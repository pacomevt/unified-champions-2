import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import VibrantURL from '@/assets/textures/vibrant.jpg';
import { vertexShader } from '../shaders/VibrantShader';
import { fragmentShader } from '../shaders/VibrantShader';
import * as CANNON from 'cannon-es';
import LogoURL from '@/assets/models/Logo.glb?url';
import * as dat from 'lil-gui';
import { gsap } from 'gsap';

export class VibrantFabric {
    constructor(container, callback) {
        this.container = {
            elem : container,
            box : null
        };
        this.start = false;
        this.animate = false;
        this.load(callback);
    }
    load(callback) {
        const manager = new THREE.LoadingManager();
        const textureLoader = new THREE.TextureLoader(manager);
        const gltfLoader = new GLTFLoader(manager);

        gltfLoader.load(LogoURL, (gltf) => {
            this.mesh = gltf.scene.children[0];
        });
        this.texture = textureLoader.load(VibrantURL);

        manager.onLoad = () => {
            console.log(this.texture);
            console.log(this.mesh);
            this.init(callback);
        }
    }
    init(callback) {
        this.container.box = this.container.elem.getBoundingClientRect();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.box.width/this.container.box.height, 0.1, 1000);
        this.camera.position.set(0, 0, 0);
        this.scene.add(this.camera);
        // add fog to the scene
        


        this.lights = {
            ambientLight: new THREE.AmbientLight(0xffffff, 1),
        }
        this.scene.add(this.lights.ambientLight);
        this.renderer = new THREE.WebGLRenderer({
            alpha: true, 
            color : 0xffffff,
            powerPreference: "high-performance",
            antialias: true,
            stencil: false,
            depth: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.box.width, this.container.box.height);
        // this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.container.elem.appendChild(this.renderer.domElement);
        this.raycaster = new THREE.Raycaster();
        this.intersects = [];
        this.mouse = new THREE.Vector2();
        this.clock = new THREE.Clock();
        this.time = 0;

        this.bindEvents();
        this.createShader();
        this.createPlane();
        this.addLogo();
        this.createPhysics();
        callback();
        this.renderer.setAnimationLoop(() => {this.render();});
    }
    createShader() {
        this.clock.start();
        this.shader = new THREE.ShaderMaterial({
            uniforms: {
                uResolution: { value: new THREE.Vector2(this.container.box.width, this.container.box.height) },
                uTime : { type : 'f', value : this.clock.getElapsedTime() },
                uProgress: { type: 'f', value: 0 },
                uTexture : { type : 't', value : this.texture },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
        });
    }
    createPlane() {
        const ratio = 50;
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(this.camera.aspect * ratio, 1 * ratio, 40, 40),
            this.shader
        );
        this.plane.position.set(0, 0, -0.6 * ratio);
        this.scene.add(this.plane);
    }

    addLogo() {

        //normalize the geometry

        this.mesh.geometry.computeBoundingBox();
        const box = this.mesh.geometry.boundingBox;
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = this.plane.geometry.parameters.width / maxSize * 0.3;
        this.mesh.scale.set(scale, scale, scale);
        this.mesh.geometry.center();

        this.mesh.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
        });
        this.scene.add(this.mesh);
        
        const pos = this.plane.position.clone();
        this.mesh.position.set(pos.x, pos.y, pos.z - 5);
        this.mesh.rotation.x = Math.PI / 2;
    }


    createPhysics() {
        this.world = new CANNON.World(
            {
                gravity: new CANNON.Vec3(0, -9.82, 0),
            }
        );

        console.log(this.plane.geometry);
        this.parameters = {
            width: this.plane.geometry.parameters.width,
            height: this.plane.geometry.parameters.height,
            Nx: this.plane.geometry.parameters.widthSegments,
            Ny: this.plane.geometry.parameters.heightSegments,
            distanceX: this.plane.geometry.parameters.width / this.plane.geometry.parameters.widthSegments,
            distanceY: this.plane.geometry.parameters.height / this.plane.geometry.parameters.heightSegments,
        };

        const Nx = 40;
        const Ny = 40;
        const clothSize = 50;
        const mass = 10;
        const distance = clothSize / Nx;
        const clothShape = new CANNON.Particle();
        this.particles = [];

        for (let i = 0; i < this.parameters.Nx + 1; i++) {
            this.particles.push([]);
            for (let j = 0; j < this.parameters.Ny + 1; j++) {
                const x = (i - this.parameters.Nx / 2) * this.parameters.distanceX;
                const y = (j - this.parameters.Ny / 2) * this.parameters.distanceY;
                const z = 0;
                const particle = new CANNON.Body({
                    mass: mass,
                    shape: clothShape,
                    position: new CANNON.Vec3(x, y, z),
                });
                this.particles[i].push(particle);
                this.world.addBody(particle);
            }
        }

        for (let i = 0; i < this.parameters.Nx+ 1; i++) {
            for (let j = 0; j < this.parameters.Ny+1; j++) {
                if (i < this.parameters.Nx) {
                    this.connect(i, j, i + 1, j, this.parameters.distanceX);
                }
                if (j < this.parameters.Ny) {
                    this.connect(i, j, i, j + 1, this.parameters.distanceY);
                }
                // if (i < Nx && j < Ny) {
                //     this.connect(i, j, i + 1, j + 1, distance);
                // }
                // if (i < Nx && j < Ny) {
                //     this.connect(i + 1, j, i, j + 1, distance);
                // }
            }
        }

        const sphereSize = 12;
        // Create a sphere

        this.sphere = new THREE.Mesh(
            new THREE.SphereGeometry(sphereSize, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );

        const sphereShape = new CANNON.Sphere(sphereSize);
        this.sphereBody = new CANNON.Body({
            shape: sphereShape,
        });
        this.world.addBody(this.sphereBody);
        this.sphereBody.position.set(0, 0, 0);
    }

    updateParticles() {
        const Nx = this.parameters.Nx;
        const Ny = this.parameters.Ny;

        for (let i = 0; i < Nx + 1; i++) {
            for (let j = 0; j < Ny + 1; j++) {
                const index = j * (Nx + 1) + i;
                const positionAttribute = this.plane.geometry.attributes.position;
                const position = this.particles[i][Ny - j].position;
                positionAttribute.setXYZ(index, position.x, position.y, position.z);
                positionAttribute.needsUpdate = true;
            }
        }
    }

    connect(i1,j1,i2,j2, distance) {
        const constraint = new CANNON.DistanceConstraint(
            this.particles[i1][j1],
            this.particles[i2][j2],
            distance
        );
        this.world.addConstraint(constraint);
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.renderer.setSize(this.container.box.width, this.container.box.height);
            this.camera.aspect = this.container.box.width / this.container.box.height;
            this.camera.updateProjectionMatrix();
        });
        window.addEventListener('mousemove', (e) => {
            //set raycaster 
            this.mouse.x = ((e.clientX - this.container.box.x) / this.container.box.width) * 2 - 1;
            this.mouse.y = -((e.clientY - this.container.box.y) / this.container.box.height) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
        });
    }
    render() {
        if (this.start == true) {
            this.renderer.render(this.scene, this.camera);
            this.shader.uniforms.uTime.value = this.clock.getElapsedTime();
            this.mesh.rotation.z = this.clock.getElapsedTime();
            if (this.animate == true) {
                this.world.step(1 / 60);
                this.updateParticles();
            }
        }
    }
    dispose() {
        this.renderer.dispose();
        this.scene.dispose();
        this.camera.dispose();
        this.shader.dispose();
        this.plane.dispose();
        this.logo.dispose();
        this.world.dispose();
        this.sphere.dispose();
        this.mouse.dispose();
        this.raycaster.dispose();
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                object.material.dispose();
            }
        });
    }
}