import * as THREE from 'three';
import VibrantURL from '@/assets/textures/vibrant.jpg';
import { vertexShader } from '../shaders/VibrantShader';
import { fragmentShader } from '../shaders/VibrantShader';

export class VibrantPlane {
    constructor(container, callback) {
        this.container = {
            elem : container,
            box : null
        };
        this.start = false;
        this.load(callback);
    }
    load(callback) {
        const manager = new THREE.LoadingManager();
        const textureLoader = new THREE.TextureLoader(manager);
        this.texture = textureLoader.load(VibrantURL);
        manager.onLoad = () => {
            this.init(callback);
            console.log(this.texture)
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
    }
}









// export class VibrantPlane {
//     constructor(container, callback) {
//         this.container = {
//             elem : container,
//             box : null
//         };
//         this.start = false;
//         this.load(callback);
//     }
//     load(callback) {
//         const manager = new THREE.LoadingManager();
//         const textureLoader = new THREE.TextureLoader(manager);
//         this.texture = textureLoader.load(VibrantURL);
//         manager.onLoad = () => {
//             this.init(callback);
//             console.log(this.texture)
//         }
//     }
//     init(callback) {
//         this.container.box = this.container.elem.getBoundingClientRect();
//         this.scene = new THREE.Scene();
//         this.camera = new THREE.PerspectiveCamera(75, this.container.box.width/this.container.box.height, 0.1, 1000);
//         this.camera.position.set(0, 0, 0);
//         this.scene.add(this.camera);
//         this.lights = {
//             ambientLight: new THREE.AmbientLight(0xffffff, 1),
//         }
//         this.scene.add(this.lights.ambientLight);
//         this.renderer = new THREE.WebGLRenderer({
//             alpha: true, 
//             color : 0xffffff,
//             powerPreference: "high-performance",
//             antialias: true,
//             stencil: false,
//             depth: true
//         });
//         this.renderer.setPixelRatio(window.devicePixelRatio);
//         this.renderer.setSize(this.container.box.width, this.container.box.height);
//         // this.renderer.toneMapping = THREE.ReinhardToneMapping;
//         this.container.elem.appendChild(this.renderer.domElement);
//         this.raycaster = new THREE.Raycaster();
//         this.intersects = [];
//         this.mouse = new THREE.Vector2();
//         this.clock = new THREE.Clock();
//         this.time = 0;

//         this.bindEvents();
//         this.createShader();
//         this.createPlane();
//         callback();
//         this.renderer.setAnimationLoop(() => {this.render();});
//     }

//     createShader() {
//         this.clock.start();
//         this.shader = new THREE.ShaderMaterial({
//             uniforms: {
//                 uResolution: { value: new THREE.Vector2(this.container.box.width, this.container.box.height) },
//                 uTime : { type : 'f', value : this.clock.getElapsedTime() },
//                 uProgress: { type: 'f', value: 0 },
//                 uTexture : { type : 't', value : this.texture },
//             },
//             vertexShader: vertexShader,
//             fragmentShader: fragmentShader,
//             transparent: true,
//         });
//     }
//     createPlane() {
//         const ratio = 1;
//         this.cube = new THREE.Mesh(
//             new THREE.PlaneGeometry(this.camera.aspect * ratio, 1 * ratio, 40, 40),
//             this.shader
//         );
//         this.cube.position.set(0, 0, -0.6);
//         this.scene.add(this.cube);
//     }

//     bindEvents() {
//         window.addEventListener('resize', () => {
//             this.renderer.setSize(this.container.box.width, this.container.box.height);
//             this.camera.aspect = this.container.box.width / this.container.box.height;
//             this.camera.updateProjectionMatrix();
//         });
//         // window.addEventListener('mousemove', (e) => {
//         //     //set raycaster 
//         //     this.mouse.x = ((e.clientX - this.container.box.x) / this.container.box.width) * 2 - 1;
//         //     this.mouse.y = -((e.clientY - this.container.box.y) / this.container.box.height) * 2 + 1;
//         //     this.raycaster.setFromCamera(this.mouse, this.camera);
//         // });
//     }

//     render() {
//         this.renderer.render(this.scene, this.camera);
//         this.shader.uniforms.uTime.value = this.clock.getElapsedTime();
//     }
// }



  // this.planeBody = new CANNON.Body({
        //     mass: 0,
        //     shape: new CANNON.Plane(),
        //     material: new CANNON.Material(),
        // });
        // this.planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        // this.world.addBody(this.planeBody);
        
        // this.sphereBody = new CANNON.Body({
        //     mass: 1,
        //     shape: new CANNON.Sphere(0.5),
        //     material: new CANNON.Material(),
        // });
        // this.sphereBody.position.set(0, 0, 0);
        // this.world.addBody(this.sphereBody);

        // this.world.addContactMaterial(
        //     new CANNON.ContactMaterial(
        //         this.planeBody.material,
        //         this.sphereBody.material,
        //         {
        //             friction: 0.1,
        //             restitution: 0.5,
        //         }
        //     )
        // );

        // this.world.broadphase = new CANNON.NaiveBroadphase();
        // this.world.solver.iterations = 10;

        // this.world.step(1 / 60);

        // this.plane.position.copy(this.planeBody.position);
        // this.plane.quaternion.copy(this.planeBody.quaternion);
        // this.sphere.position.copy(this.sphereBody.position);
        // this.sphere.quaternion.copy(this.sphereBody.quaternion);

        // this.world.addEventListener('postStep', () => {
        //     this.plane.position.copy(this.planeBody.position);
        //     this.plane.quaternion.copy(this.planeBody.quaternion);
        //     this.sphere.position.copy(this.sphereBody.position);
        //     this.sphere.quaternion.copy(this.sphereBody.quaternion);
        // });

        // this.intersects = this.raycaster.intersectObject(this.plane);
        // if (this.intersects.length > 0) {
        //     this.sphereBody.position.copy(this.intersects[0].point);
        // }




        


// export class VibrantFabric extends VibrantPlane {
//     constructor(container, callback) {
//         super(container, callback);
//     }

//     init(callback) {
//         super.init(callback);
//         this.createPhysics();
//     } 

//     createPlane() {
//         super.createPlane();
//         // this.plane.position.set(0, 0, -2);
//         // this.plane.material.wireframe = true;
//     }
//     createPhysics() {
//         this.world = new CANNON.World(
//             {
//                 gravity: new CANNON.Vec3(0, -9.82, 0),
//             }
//         );
//         const Nx = 40;
//         const Ny = 40;
//         const clothSize = 50;
//         const mass = 1;
//         const distance = clothSize / Nx;
//         const clothShape = new CANNON.Particle();
//         this.particles = [];

//         for (let i = 0; i < Nx + 1; i++) {
//             this.particles.push([]);
//             for (let j = 0; j < Ny + 1; j++) {
//                 const x = (i - Nx / 2) * distance;
//                 const y = (j - Ny / 2) * distance;
//                 const z = 0;
//                 const particle = new CANNON.Body({
//                     mass: mass,
//                     shape: clothShape,
//                     position: new CANNON.Vec3(x, y, z),
//                 });
//                 this.particles[i].push(particle);
//                 this.world.addBody(particle);
//             }
//         }

//         for (let i = 0; i < Nx+ 1; i++) {
//             for (let j = 0; j < Ny+1; j++) {
//                 if (i < Nx) {
//                     this.connect(i, j, i + 1, j, distance);
//                 }
//                 if (j < Ny) {
//                     this.connect(i, j, i, j + 1, distance);
//                 }
//                 // if (i < Nx && j < Ny) {
//                 //     this.connect(i, j, i + 1, j + 1, distance);
//                 // }
//                 // if (i < Nx && j < Ny) {
//                 //     this.connect(i + 1, j, i, j + 1, distance);
//                 // }
//             }
//         }

//         const sphereSize = 5;
//         const movementRadius = 2;

//         // Create a sphere

//         this.sphere = new THREE.Mesh(
//             new THREE.SphereGeometry(sphereSize, 32, 32),
//             new THREE.MeshBasicMaterial({ color: 0xff0000 })
//         );
//         this.scene.add(this.sphere);

//         const sphereShape = new CANNON.Sphere(sphereSize);
//         this.sphereBody = new CANNON.Body({
//             shape: sphereShape,
//         });
//         this.world.addBody(this.sphereBody);
//     }

//     updateParticles() {
//         const Nx = 40;
//         const Ny = 40;

//         for (let i = 0; i < Nx + 1; i++) {
//             for (let j = 0; j < Ny + 1; j++) {
//                 const index = j * (Nx + 1) + i;
//                 const positionAttribute = this.plane.geometry.attributes.position;
//                 const position = this.particles[i][Ny - j].position;
//                 positionAttribute.setXYZ(index, position.x, position.y, position.z);
//                 positionAttribute.needsUpdate = true;
//             }
//         }
//     }

//     connect(i1,j1,i2,j2, distance) {
//         const constraint = new CANNON.DistanceConstraint(
//             this.particles[i1][j1],
//             this.particles[i2][j2],
//             distance
//         );
//         this.world.addConstraint(constraint);
//     }

//     render() {
//         super.render();
//         this.updateParticles();
//         this.world.step(1 / 120);
//     }
// }