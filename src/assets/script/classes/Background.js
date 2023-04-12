import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

import gsap from 'gsap';
import * as dat from 'lil-gui'

import ControllerURL from '../../models/controller2.glb?url';

export class Background {
    constructor(container, callback) {
        this.container = {
            elem : container,
            box : null
        };
        this.start = false;
        // this.textureUrl = textureUrl
        this.data = {
            area: 100,
            ease: 0.15,
        }
        this.load(callback);
    }
    load(callback) {
        const manager = new THREE.LoadingManager;

        // env
        // const cubeLoader = new THREE.CubeTextureLoader(manager);
        // this.texture = cubeLoader.load([
        //     PosXURL, NegXURL,
        //     PosYURL, NegYURL,
        //     PosZURL, NegZURL
        // ]);

        //controller
        const gltfLoader = new GLTFLoader(manager);
        gltfLoader.load(ControllerURL, (obj) => {
            this.controllerModel = obj.scene.children[0].children[0];
        });

        //
        manager.onLoad = () => {
            this.init(callback);
        }
    }
    init(callback) {
        this.container.box = this.container.elem.getBoundingClientRect();
        this.scene = new THREE.Scene();
        // this.texture.encoding = THREE.sRGBEncoding;
        // this.scene.background = this.texture;
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
        // this.gui = new dat.GUI();

        // this.createController();
        // this.bindEvents();
        // this.createShader();
        // this.createPlane();
        callback();
        // this.renderer.setAnimationLoop(() => {this.render();});
    }

    createController() {
        this.controller = new THREE.Group();
        const vertices = [];
        let pointsGeometry = new THREE.BufferGeometry();
        const ratio = 0.8;
        let pointsMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: 0xaaaaff,
            transparent: true,
            opacity: 0.4,
        });
        this.controllerModel.traverse(obj => {
            if (obj.isMesh) {
                const sampler = new MeshSurfaceSampler(obj).build();
                const TEMP_position = new THREE.Vector3();
                const verticesCount = obj.geometry.getAttribute('position').count
                for (let i = 0; i < verticesCount*ratio; i++) {
                    sampler.sample(TEMP_position);
                    vertices.push(TEMP_position.x *3, TEMP_position.y*3, TEMP_position.z*3);
                }
            }
        });
        pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.particles = new THREE.Points(pointsGeometry, pointsMaterial);
        this.geometryCopy = new THREE.BufferGeometry(); 
        this.geometryCopy.copy(this.particles.geometry);
        this.controller.add(this.particles);
        this.controller.position.set(0, 2, -38);
        this.controller.rotation.set(0.55, -Math.PI, 0);
        gsap.from(this.controller.position, {
            x: 0,
            y: 0,
            z: 4,
            duration: 8,
            ease: 'power3.out'
            })


        // this.gui = new dat.GUI();

        // this.gui.add(this.controller.position, 'x', -50, 50)
        // this.gui.add(this.controller.position, 'y', -50, 50)
        // this.gui.add(this.controller.position, 'z', -50, 50)

        // this.gui.add(this.controller.rotation, 'x', -Math.PI, Math.PI)
        // this.gui.add(this.controller.rotation, 'y', -Math.PI, Math.PI)
        // this.gui.add(this.controller.rotation, 'z', -Math.PI, Math.PI)

        this.scene.add(this.controller);
        console.log(this.controller);
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
            //set camera rotation
            gsap.to(this.camera.rotation, {
                x: this.mouse.y * 0.01,
                y: -this.mouse.x * 0.005,
                duration: 1,
                ease: 'power2.out'
            });
            //set particles position
            this.intersects = this.raycaster.intersectObject(this.controller);
            if (this.intersects.length > 0) {
                const particles = this.controller.children[0];
                const pos = particles.geometry.attributes.position;
                const copy = this.geometryCopy.attributes.position;
                const mx = this.intersects[ 0 ].point.x;
                const my = this.intersects[ 0 ].point.y;
                const mz = this.intersects[ 0 ].point.z;
                for ( var i = 0, l = pos.count; i < l; i++) {
                    const initX = copy.getX(i);
                    const initY = copy.getY(i);
                    const initZ = copy.getZ(i);
                    let px = pos.getX(i);
                    let py = pos.getY(i);
                    let pz = pos.getZ(i);
                    let dx = mx - px;
                    let dy = my - py;
                    const dz = mz - pz;
                    const mouseDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    let d = ( dx = mx - px ) * dx + ( dy = my - py ) * dy;
                    const f = - this.data.area/d ;
                        if( mouseDistance < this.data.area ){
                            if(i%2 ==0){
                                const t = Math.atan2( dy, dx );
                                px -= 0.2 * Math.cos( t );
                                py -= 0.2 * Math.sin( t );
                                pz -= 0.2 * Math.sin( t );
                            }else{
                                const t = Math.atan2( dy, dx );
                                let moveX = f * Math.cos( t ) ;
                                let moveY = f * Math.sin( t ) ;
                                px += moveX;
                                py += moveY;
                                pos.setXYZ( i, px, py, pz );
                                pos.needsUpdate = true;
                            }
                    }
                    px += ( initX  - px ) * this.data.ease;
                    py += ( initY  - py ) * this.data.ease;
                    pz += ( initZ  - pz ) * this.data.ease;
                    pos.setXYZ( i, px, py, pz );
                    pos.needsUpdate = true;
                }
            }
        });
    }
    manageScroll() {
        const scroll = scrollY / this.container.box.height * 969;
        this.controller.position.y = scroll * 0.05;
    }
    render() {
        if (this.start === false) return;
        this.manageScroll();
        this.delta = this.clock.getDelta();
        this.time = this.clock.getElapsedTime();
        if (this.intersects.length <= 0) {
            //replace particles to initial position
            const particles = this.controller.children[0];
            const pos = particles.geometry.attributes.position;
            const copy = this.geometryCopy.attributes.position;
            for ( var i = 0, l = pos.count; i < l; i++) {
                const initX = copy.getX(i);
                const initY = copy.getY(i);
                const initZ = copy.getZ(i);
                let px = pos.getX(i);
                let py = pos.getY(i);
                let pz = pos.getZ(i);
                px += ( initX  - px ) * this.data.ease;
                py += ( initY  - py ) * this.data.ease;
                pz += ( initZ  - pz ) * this.data.ease;
                pos.setXYZ( i, px, py, pz );
                pos.needsUpdate = true;
            }
        }
        this.controller.children.forEach(obj => {
            obj.rotation.y =-(this.time * 0.06);
            obj.rotation.Z =-(this.time * 0.06);
        });

        this.renderer.render(this.scene, this.camera);
    }
}






// createShader() {
//     this.vertexShader = `
//         varying vec2 vUv;
//         uniform float uTime;
//         uniform vec2 uResolution;
//         uniform vec2 uMouse;
        
//         void main() {
//             vUv = uv;
//             vec4 newPosition;
//             vec2 tempUV = vUv;
//             vec2 tempMouse = uMouse;

//             tempUV.x = tempUV.x * uResolution.x / uResolution.y;
//             tempMouse.x = (tempMouse.x / 2.0 + 0.5) * uResolution.x / uResolution.y;
//             tempMouse.y = tempMouse.y / 2.0 + 0.5;

//             float distance = distance(tempUV, tempMouse);
//             distance = (1.0 - smoothstep(0.0, 0.1, distance))/2.0;

//             newPosition = vec4(position.x, position.y, position.z + distance, 1.0);
//             gl_Position = projectionMatrix * modelViewMatrix * newPosition;
//         }
//     `;
//     this.fragmentShader = `
//         uniform vec2 uResolution;
//         varying vec2 vUv;
//         void main() {
//             vec2 uv = vUv;
//             vec3 color = vec3(1.0);
//             gl_FragColor = vec4(color.rgb, 1);
//         }
//     `;
//     this.clock.start();
//     this.shader = new THREE.ShaderMaterial({
//         uniforms: {
//             uResolution: { value: new THREE.Vector2(this.container.box.width, this.container.box.height) },
//             uTime : { type : 'f', value : this.clock.getElapsedTime() },
//             uMouse : { type : 'v2', value : this.mouse },
//         },
//         vertexShader: this.vertexShader,
//         fragmentShader: this.fragmentShader,
//         transparent: true,
//         wireframe: true,
//     });
// }
// createPlane() {
//     this.cube = new THREE.Mesh(
//         new THREE.PlaneGeometry(3, 3, 40, 40),
//         this.shader
//     );
//     this.cube.position.set(0, 0, -2);
//     this.scene.add(this.cube);
// }