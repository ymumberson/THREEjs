import * as THREE from "three";
import "./style.css";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon";

class PhysicsScene {
    constructor(canvas_width, canvas_height, fov, aspect_ratio, camera_position, camera_lookat) {
        this.scene = new THREE.Scene();
        this.world = new CANNON.World();
        this.world.gravity.set(0,0,-9.82); // m/s^2
        this.physics_meshes = [];

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

        /* Material code from https://github.com/pmndrs/cannon-es/blob/master/examples/friction.html */
        this.my_material = new CANNON.Material('my_material');
        const my_material_and_my_material = new CANNON.ContactMaterial(this.my_material, this.my_material, {
            friction: 0.4,
            restitution: 0.3,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3,
            frictionEquationStiffness: 1e8,
            frictionEquationRegularizationTime: 3,
        })
  
        // Add contact material to the world
        this.world.addContactMaterial(my_material_and_my_material)

        this.loader = new THREE.TextureLoader();
        this.texture1 = this.loader.load('brick1.jpg');

        console.log('Created new physics scene!');
    }
    
    SimulationLoop() {
        const currentTime = performance.now();
        const elapsedMilliseconds = currentTime - this.lastTime;
        this.lastTime = currentTime;
    
        // Update the physics world
        this.world.step(this.deltaTime, elapsedMilliseconds / 1000, this.maxSubSteps);
    
        // Update the objects in your scene based on the updated physics simulation
        for (var i=0; i<this.physics_meshes.length; ++i) {
            this.physics_meshes[i].Synchronize();
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

        var sphereBody = new CANNON.Body({
            mass: mass, //kg
            position: new CANNON.Vec3(position[0],position[1],position[2]), // m
            shape: new CANNON.Sphere(radius),
            material: this.my_material,
        });
        this.world.addBody(sphereBody);

        let phys_mesh = new PhysicsMesh(mesh, sphereBody);
        this.physics_meshes.push(phys_mesh);
        return phys_mesh;
    }

    AddFloor() {
        return this.AddRectangle(10000,10000, 1, 0x009A17, [0,0,0], 0);
    }

    AddCube(width, colour, position, mass) {
        return this.AddRectangle(width, width, width, colour, position, mass);
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
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.scene.add(cube);

        const boxShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const boxBody = new CANNON.Body({
            mass: mass,
            shape: boxShape,
            material: this.my_material
        });
        boxBody.position.x = position[0];
        boxBody.position.y = position[1];
        boxBody.position.z = position[2];
        this.world.addBody(boxBody);

        let phys_mesh = new PhysicsMesh(cube, boxBody);
        this.physics_meshes.push(phys_mesh);
        return phys_mesh;
    }

    AddBrick(width, height, depth, colour, position, mass) {
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth, 10, 10, 10),
            new THREE.MeshStandardMaterial({
                map: this.texture1,
              }));
        cube.position.x = position[0];
        cube.position.y = position[1];
        cube.position.z = position[2];
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.scene.add(cube);

        const boxShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const boxBody = new CANNON.Body({
            mass: mass,
            shape: boxShape,
            material: this.my_material
        });
        boxBody.position.x = position[0];
        boxBody.position.y = position[1];
        boxBody.position.z = position[2];
        this.world.addBody(boxBody);

        let phys_mesh = new PhysicsMesh(cube, boxBody);
        this.physics_meshes.push(phys_mesh);
        return phys_mesh;
    }

    RemovePhysicsMesh(phys_mesh) {
        for (var i=0; i<this.physics_meshes.length; ++i) {
            if (this.physics_meshes[i] === phys_mesh) {
                return this.RemoveAtIndex(i);
            }
        }
        return false;
    }

    RemoveAtIndex(index) {
        if (index > -1 && index < this.physics_meshes.length) {
            this.scene.remove(this.physics_meshes[index].mesh);
            this.world.remove(this.physics_meshes[index].body);
            this.physics_meshes.splice(index,1);
            return true;
        }
        return false;
    }

    GetPhysicsMesh(index) {
        if (index > -1 && index < this.physics_meshes.length) {
            return this.physics_meshes[index];
        }
        return null;
    }
}

class PhysicsMesh {
    constructor(mesh, body) {
        this.mesh = mesh;
        this.body = body;
    }

    Synchronize() {
        this.mesh.position.y = this.body.position.y;
        this.mesh.position.x = this.body.position.x;
        this.mesh.position.z = this.body.position.z;

        this.mesh.quaternion.x = this.body.quaternion.x;
        this.mesh.quaternion.y = this.body.quaternion.y;
        this.mesh.quaternion.z = this.body.quaternion.z;
        this.mesh.quaternion.w = this.body.quaternion.w;
    }
}

export { PhysicsScene, PhysicsMesh };