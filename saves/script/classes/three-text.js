import * as THREE from 'three';
import gsap from 'gsap';


export class CustomText {
    constructor(container, textureUrl) {
        this.container = {
            elem : container,
            box : null
        };
        this.textureUrl = textureUrl
        this.load();
    }
    load() {
        const manager = new THREE.LoadingManager;
        const textureLoader = new THREE.TextureLoader(manager);
        textureLoader.load(this.textureUrl, (texture) => { this.texture = texture });
        manager.onLoad = () => {
            this.init();
        }
    }
    init() {
        this.container.box = this.container.elem.getBoundingClientRect();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.box.width/this.container.box.width, 0.1, 1000);
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
            antialias: false,
            stencil: false,
            depth: false
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.box.width, this.container.box.height);
        this.container.elem.appendChild(this.renderer.domElement);
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.clock = new THREE.Clock();
        this.time = 0;
        this.bindEvents();
        this.createShader();
        this.createPlane();
        // setAnimationloop
        this.renderer.setAnimationLoop(() => {this.render();});

        
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

    createShader() {
        this.vertexShader = `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec4 vModelPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                vNormal = normal;
                vModelPosition = modelMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;


        this.fragmentShader = `
            uniform float uTime;
            uniform sampler2D uTexture;
            uniform vec2 uResolution;
            uniform vec2 uMouse;
            uniform vec3 uNewColor;
            uniform vec3 uRatio;
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec4 vModelPosition;
            void main() {
                vec2 uv = vUv;
                vec2 tempUV = vUv;
                vec2 mouse = uMouse;
                vec2 tempMouse = uMouse;
                vec4 color = texture2D(uTexture, uv);

                tempUV.x = tempUV.x * uResolution.x / uResolution.y;
                tempMouse.x = (tempMouse.x / 2.0 + 0.5) * uResolution.x / uResolution.y;
                tempMouse.y = tempMouse.y / 2.0 + 0.5;

                float distance = distance(tempUV, tempMouse);
                vec3 newColor = uNewColor * distance;
                

                gl_FragColor = vec4(color.rgb * newColor , 1);
            }
        `;

        this.shader = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uTexture: { value: this.texture },
                uResolution: { value: new THREE.Vector2(this.container.box.width, this.container.box.height) },
                uMouse: { value: this.mouse },
                uNewColor: { value: new THREE.Color(48, 4, 86) },
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            transparent: true
        });
    }


    createPlane() {
        this.cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            this.shader
        );
        this.cube.position.set(0, 0, 1.15);
        this.scene.add(this.cube);
        this.camera.lookAt(this.cube.position);
        this.cube.position.set(0, 0, 1.15);

    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.time += this.clock.getDelta();
        // this.cube.rotation.x = this.time * 0.5;
    }

}