import * as THREE from "three";
import "./style.css";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon";

class PhysicsScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.world = new CANNON.World();
        this.world.gravity.set(0,0,-9.82); // m/s^2

        this.AddSphere(3, 0x00ff83, 5, [0,0,0]);
        this.AddSphere(3, 0xffff83, 5, [6,0,0]);

        // Light
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 10, 10);
        light.intensity = 1.25;
        this.scene.add(light);

        // Camera
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        const FOV = 45;
        this.camera = new THREE.PerspectiveCamera(FOV, sizes.width / sizes.height);
        this.camera.position.z = 20;
        this.scene.add(this.camera);

        // Renderer
        const canvas = document.querySelector(".webgl");
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        this.renderer.setSize(sizes.width, sizes.height);
        this.renderer.setPixelRatio(2);
        this.renderer.render(this.scene, this.camera);

        this.deltaTime = 1 / 60; // Time step for physics simulation (1/60 sec)
        this.maxSubSteps = 3; // Maximum number of substeps to perform per frame
        this.lastTime = 0; // To keep track of the elapsed time between frames

        this.simulationLoop = this.simulationLoop.bind(this);
        this.simulationLoop();

        console.log('Created new physics scene!');
    }
    
    simulationLoop() {
        const currentTime = performance.now();
        const elapsedMilliseconds = currentTime - this.lastTime;
        this.lastTime = currentTime;
    
        this.world.step(this.deltaTime, elapsedMilliseconds / 1000, this.maxSubSteps);
    
        // Update the objects in your scene based on the updated physics simulation
        // this.my_mesh.position.z = this.my_mesh_physics.position.z;
        let physics_world = this.world.bodies;
        let render_world = this.scene.children;
        for (var i=0; i<physics_world.length; ++i) {
            render_world[i].position.x = physics_world[i].position.x;
            render_world[i].position.y = physics_world[i].position.y;
            render_world[i].position.z = physics_world[i].position.z;

            render_world[i].quaternion.x = physics_world[i].quaternion.x;
            render_world[i].quaternion.y = physics_world[i].quaternion.y;
            render_world[i].quaternion.z = physics_world[i].quaternion.z;
            render_world[i].quaternion.w = physics_world[i].quaternion.w;
        }

        // Call the render function to draw the updated scene (if you are using Three.js or other rendering library)
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.simulationLoop);
      }

    AddSphere(radius, colour, mass, position) {
        const SEGMENTS = 64;
        const geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS);
        const material = new THREE.MeshStandardMaterial({
            color: colour,
            // roughness: 0.5,
        });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        var sphereBody = new CANNON.Body({
            mass: mass, //kg
            // position: new CANNON.Vec3(0,0,10), // m
            position: new CANNON.Vec3(position[0],position[1],position[2]), // m
            shape: new CANNON.Sphere(radius)
        });
        this.world.addBody(sphereBody);
    }
}

// // Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.enableZoom = false;
// // controls.autoRotate = true;
// // controls.autoRotateSpeed = 5;

// const loop = () => {
//     controls.update();
//     renderer.render(scene, camera);
//     window.requestAnimationFrame(loop);
// }
// loop();

export { PhysicsScene };