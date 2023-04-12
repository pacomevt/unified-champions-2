import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import VibrantURL from '@/assets/textures/vibrant.jpg';
import { vertexShader } from '../shaders/VibrantShader';
import { fragmentShader } from '../shaders/VibrantShader';
import * as CANNON from 'cannon-es';
import LogoURL from '@/assets/models/Logo.glb?url';
import * as dat from 'lil-gui';

export class VibrantFabric {
    constructor(container, callback) {
        this.container = {
            elem : container,
            box : null
        };
        this.data = {
        }
        this.start = false;
        this.load(callback);
    }
    load(callback) {
        const manager = new THREE.LoadingManager();
        const textureLoader = new THREE.TextureLoader(manager);
        const gltfLoader = new GLTFLoader(manager);

        gltfLoader.load(LogoURL, (gltf) => {
            this.logo = gltf.scene.children[0];
        });
        this.texture = textureLoader.load(VibrantURL);

        manager.onLoad = () => {
            console.log(this.texture);
            console.log(this.logo);
            this.init(callback);
        }
    }
    init(callback) {
        this.container.box = this.container.elem.getBoundingClientRect();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.box.width/this.container.box.height, 0.1, 1000);
        this.camera.position.set(0, 0, 0);
        this.scene.add(this.camera);
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
            transparent: true,
            side: THREE.DoubleSide,
        });
    }
    createPlane() {
        const ratio = 50;
        this.data = {
            width: this.camera.aspect * ratio,
            height: 1 * ratio,
            widthSegments: 60,
            heightSegments: 60,
        }
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(
                this.data.width,
                this.data.height, 
                this.data.widthSegments,
                this.data.heightSegments
            ),
            this.shader
        );
        this.plane.position.set(0, 0, -0.6 * this.data.ratio);
        this.scene.add(this.plane);
    }

    addLogo() {
        this.logo.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            });
        this.logo.position.set(0, 0, -900);
        this.scene.add(this.logo);
        console.log(this.logo, 'logo');

        // this.gui = new dat.GUI();
        // this.gui.add(this.logo.position, 'x', -1000, 1000);
        // this.gui.add(this.logo.position, 'y', -1000, 1000);
        // this.gui.add(this.logo.position, 'z', -1000, 1000);
        // this.gui.add(this.logo.scale, 'x', 0, 10);
        // this.gui.add(this.logo.scale, 'y', 0, 10);
        // this.gui.add(this.logo.scale, 'z', 0, 10);

    }


    createPhysics() {
        this.world = new CANNON.World(
            {
                gravity: new CANNON.Vec3(0, -9.82, 0),
            }
        );



        const Nx = this.data.widthSegments;
        const Ny = this.data.heightSegments;
        const clothWidth = this.data.width;
        const clothHeight = this.data.height;

        const mass = 5;
        const distanceX = clothWidth / Nx;
        const distanceY = clothHeight / Ny;
        const clothShape = new CANNON.Particle();
        
        this.particles = [];

        for (let i = 0; i < Nx + 1; i++) {
            this.particles.push([]);
            for (let j = 0; j < Ny + 1; j++) {
                const x = (i - Nx / 2) * distanceX;
                const y = (j - Ny / 2) * distanceY;
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

        for (let i = 0; i < Nx+ 1; i++) {
            for (let j = 0; j < Ny+1; j++) {
                if (i < Nx) 
                    this.connect(i, j, i + 1, j, distanceX);
                if (j < Ny) 
                    this.connect(i, j, i, j + 1, distanceY);
                if (i < Nx && j < Ny) {
                    this.connect(i, j, i + 1, j + 1, Math.sqrt(distanceX * distanceX + distanceY * distanceY));
                    this.connect(i + 1, j, i, j + 1, Math.sqrt(distanceX * distanceX + distanceY * distanceY));
                }
            }
        }

        const sphereSize = 5;
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
        const Nx = 40;
        const Ny = 40;

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
        this.renderer.render(this.scene, this.camera);
        this.shader.uniforms.uTime.value = this.clock.getElapsedTime();
        this.updateParticles();
        this.world.step(1 / 60);
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