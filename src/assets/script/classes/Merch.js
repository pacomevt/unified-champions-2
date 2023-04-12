import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import * as dat from 'lil-gui';

import { scrollPercent, displayAt } from '@/assets/script/functions/ScrollFunctions';

import TShirtURL from '../../models/T-Shirt.glb?url';

export class Merch {
    constructor(container, section, callback) {
        this.container = {
            elem : container,
            box : null
        };
        this.section = section;
        this.start = false;
        this.load(callback);
    }
    load(callback) {
        const manager = new THREE.LoadingManager;
        
        const gltfLoader = new GLTFLoader(manager);
        gltfLoader.load(TShirtURL, (obj) => {
            this.model = obj.scene.children[0];
        });
        
        manager.onLoad = () => {
            console.log(this.model)
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
            directionalLight: new THREE.DirectionalLight(0xffffff, 1),
        };
        this.lights.directionalLight.position.set(0, 1, 1);
        this.scene.add(this.lights.directionalLight);
        this.scene.add(this.lights.ambientLight);
        this.renderer = new THREE.WebGLRenderer({
            alpha: true, 
            color : 0xffffff,
            powerPreference: "high-performance",
            antialias: false,
            stencil: true,
            depth: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.box.width, this.container.box.height);
        this.container.elem.appendChild(this.renderer.domElement);
        this.raycaster = new THREE.Raycaster();
        this.intersects = [];
        this.mouse = new THREE.Vector2();
        this.clock = new THREE.Clock();
        this.time = 0;
        this.createTShirt();
        this.bindEvents();
        // this.createShader();
        // this.createPlane();
        callback();
        this.renderer.setAnimationLoop(() => {this.render();});
    }


    createTShirt() {
        this.model.position.set(0.5, 0, -1.5);
        this.model.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.5,
            roughness: 0.5,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
        });
        this.group = new THREE.Group;
        this.group.add(this.model);
        this.scene.add(this.group);

        // this.gui = new dat.GUI();

        // this.gui.add(this.model.position, 'x', -10, 10)
        // this.gui.add(this.model.position, 'y', -10, 10)
        // this.gui.add(this.model.position, 'z', -10, 10)

        // this.gui.add(this.model.rotation, 'x', -Math.PI, Math.PI)
        // this.gui.add(this.model.rotation, 'y', -Math.PI, Math.PI)
        // this.gui.add(this.model.rotation, 'z', -Math.PI, Math.PI)

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
        });
        // bind manageScroll on scroll event
        window.addEventListener('scroll', this.manageScroll.bind(this));

    }

    manageScroll() {
        const scroll = scrollPercent(this.section);
        if (scroll <= 0.05) {
            gsap.to(this.model.position, {
                x : 1.5,
                y : 0,
                z :-0.5,
                duration: 2
            });
            gsap.to(
                this.model.rotation, {
                    y: Math.PI,
                    duration: 2.2
                }
            );
        } else if (scroll > 0.05 && scroll <= 0.2) {
            gsap.to(
                this.model.position, {
                    x : 0,
                    y : 0,
                    z :-2.5,
                    duration: 1.5
                }
            );
            gsap.to(
                this.model.rotation, {
                    y: Math.PI / -2,
                    duration: 1.8
                }
            );
        } else if (scroll > 0.2 && scroll <= 0.4) {
            gsap.to(this.model.position, {
                x : -0.3,
                y : 0.15,
                z :-1,
                duration: 1
            });
            gsap.to(
                this.model.rotation, {
                    y: Math.PI / -2,
                    duration: 1.8
                }
            );
        } else if (scroll > 0.4 && scroll <= 0.6) {
            gsap.to(this.model.position, {
                x : -0.1,
                y : -0.05,
                z :-0.6,
                duration: 1
            });
            gsap.to(
                this.model.rotation, {
                    y: Math.PI / -2,
                    duration: 1.8
                }
            );
        } else if (scroll > 0.6 && scroll <= 0.8) {
            gsap.to(this.model.position, {
                x : 0.2,
                y : 0.15,
                z :-0.9,
                duration: 1
            });
            gsap.to(
                this.model.rotation, {
                    y: Math.PI / 2,
                    duration: 1.8
                }
            );
        } else {
            gsap.to(
                this.model.position, {
                    x : 0,
                    y : 0,
                    z :-2.5,
                    duration: 1.5
                }
            );
            gsap.to(
                this.model.rotation, {
                    y: Math.PI / -2,
                    duration: 1.8
                }
            );
        }
    }

    // manageScroll() {
    //     const scroll = scrollY - this.container.box.y / this.container.box.height * 969;
    //     this.model.position.y = - scroll * 0.05;
    //     console.log(this.model.position.y, this.container.elem.offsetTop )
    // }
    render() {
        if (this.start === false) return;

        // this.manageScroll();
        this.delta = this.clock.getDelta();
        this.time = this.clock.getElapsedTime();
        this.renderer.render(this.scene, this.camera);

        const r = Math.sin(this.time);
        // console.log(r)
        this.model.rotation.y +=  r / 5000;


    }

}
