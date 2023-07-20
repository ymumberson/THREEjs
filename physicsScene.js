import * as THREE from "three";
import "./style.css";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon";

class PhysicsScene {
    constructor(canvas_width, canvas_height, fov, aspect_ratio, camera_position, camera_lookat) {
        this.scene = new THREE.Scene();
        this.world = new CANNON.World();
        this.world.gravity.set(0,0,-9.82); // m/s^2
        this.physics_world = [];
        this.render_world = [];

        // Light
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, -10, 10);
        light.intensity = 1;
        light.castShadow = true;
        this.scene.add(light);

        const ambient_light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add( ambient_light );

        // Camera
        this.camera = new THREE.PerspectiveCamera(fov, aspect_ratio);
        this.camera.position.x = camera_position[0];
        this.camera.position.y = camera_position[1];
        this.camera.position.z = camera_position[2];
        this.camera.lookAt(new THREE.Vector3(camera_lookat[0],camera_lookat[1],camera_lookat[2]));
        this.scene.add(this.camera);

        // Renderer
        const canvas = document.querySelector(".webgl");
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(canvas_width, canvas_height);
        this.renderer.setPixelRatio(2);
        this.renderer.render(this.scene, this.camera);

        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;

        this.deltaTime = 1 / 60; // Time step for physics simulation (1/60 sec)
        this.maxSubSteps = 3; // Maximum number of substeps to perform per frame
        this.lastTime = 0; // To keep track of the elapsed time between frames

        this.SimulationLoop = this.SimulationLoop.bind(this);
        this.SimulationLoop();

        console.log('Created new physics scene!');
    }
    
    SimulationLoop() {
        const currentTime = performance.now();
        const elapsedMilliseconds = currentTime - this.lastTime;
        this.lastTime = currentTime;
    
        // Update the physics world
        this.world.step(this.deltaTime, elapsedMilliseconds / 1000, this.maxSubSteps);
    
        // Update the objects in your scene based on the updated physics simulation
        for (var i=0; i<this.physics_world.length; ++i) {
            this.render_world[i].position.x = this.physics_world[i].position.x;
            this.render_world[i].position.y = this.physics_world[i].position.y;
            this.render_world[i].position.z = this.physics_world[i].position.z;

            this.render_world[i].quaternion.x = this.physics_world[i].quaternion.x;
            this.render_world[i].quaternion.y = this.physics_world[i].quaternion.y;
            this.render_world[i].quaternion.z = this.physics_world[i].quaternion.z;
            this.render_world[i].quaternion.w = this.physics_world[i].quaternion.w;
        }

        // Call the render function to draw the updated scene (if you are using Three.js or other rendering library)
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        
        // Request animation call for next frame
        requestAnimationFrame(this.SimulationLoop);
    }

    AddSphere(radius, colour, position, mass) {
        const SEGMENTS = 64;
        const geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS);
        const material = new THREE.MeshStandardMaterial({
            color: colour,
            roughness: 0.5,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        this.render_world.push(mesh);

        var sphereBody = new CANNON.Body({
            mass: mass, //kg
            position: new CANNON.Vec3(position[0],position[1],position[2]), // m
            shape: new CANNON.Sphere(radius)
        });
        this.world.addBody(sphereBody);
        this.physics_world.push(sphereBody);
    }

    AddFloor() {
        this.AddRectangle(10000,10000, 1, 0x009A17, [0,0,0], 0);
    }

    AddCube(width, colour, position, mass) {
        this.AddRectangle(width, width, width, colour, position, mass);
    }

    AddRectangle(width, height, depth, colour, position, mass) {
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth, 10, 10, 10),
            new THREE.MeshStandardMaterial({
                color: colour,
              }));
        cube.position.x = position[0];
        cube.position.y = position[1];
        cube.position.z = position[2];
        cube.castShadow = false;
        cube.receiveShadow = true;
        this.scene.add(cube);
        this.render_world.push(cube);

        const boxShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const boxBody = new CANNON.Body({ mass: mass, shape: boxShape });
        boxBody.position.x = position[0];
        boxBody.position.y = position[1];
        boxBody.position.z = position[2];
        // const friction = 1; // Adjust this value as needed (0 to 1, where 0 is no friction and 1 is high friction)
        // const rectangleMaterial = new CANNON.Material();
        // rectangleMaterial.friction = friction;
        // rectangleMaterial.frictionEquationStiffness = 1e6; // Optionally adjust the friction stiffness
        
        // // Assign the material to the body
        // boxBody.material = rectangleMaterial;
        this.world.addBody(boxBody);
        this.physics_world.push(boxBody);
    }
}

export { PhysicsScene };