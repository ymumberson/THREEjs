import * as THREE from "three";
import "./style.css";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon";
import { PhysicsScene } from './physicsScene.js';

// // Scene
// const scene = new THREE.Scene();

// // Create the sphere
// const RADIUS = 3;
// const SEGMENTS = 64;
// const geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS);
// const material = new THREE.MeshStandardMaterial({
//     color: 0x00ff83,
//     roughness: 0.5,
// });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// // Light
// const light = new THREE.PointLight(0xffffff, 1, 100);
// light.position.set(0, 10, 10);
// light.intensity = 1.25;
// scene.add(light);

// // Camera
// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }
// const FOV = 45;
// const camera = new THREE.PerspectiveCamera(FOV, sizes.width / sizes.height);
// camera.position.z = 20;
// scene.add(camera);

// // Renderer
// const canvas = document.querySelector(".webgl");
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas
// });
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(2);
// renderer.render(scene, camera);

// // Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.enableZoom = false;
// // controls.autoRotate = true;
// // controls.autoRotateSpeed = 5;

// // Resize
// window.addEventListener('resize', () => {
//     // Update Sizes
//     sizes.width = window.innerWidth;
//     sizes.height = window.innerHeight;

//     // Update Camera
//     camera.aspect = sizes.width / sizes.height;
//     camera.updateProjectionMatrix();
//     renderer.setSize(sizes.width, sizes.height);
//     // renderer.render(scene, camera);
// })

// const loop = () => {
//     controls.update();
//     renderer.render(scene, camera);
//     window.requestAnimationFrame(loop);
// }
// loop();


// /* Cannon.js stuff ie Setting up the physics world*/
// // World setup
// var world = new CANNON.World();
// world.gravity.set(0,0,-9.82); // m/s^2

// // Create a sphere
// var radius = 1; // m
// var sphereBody = new CANNON.Body({
//     mass: 5, //kg
//     position: new CANNON.Vec3(0,0,10), // m
//     shape: new CANNON.Sphere(radius)
// });
// world.addBody(sphereBody);

// // Create a plane
// var groundBody = new CANNON.Body({
//     mass: 0, // Mass == 0 makes the body static
// })
// var groundShape = new CANNON.Plane();
// groundBody.addShape(groundShape);
// world.addBody(groundBody);

// var fixedTimeStep = 1.0 / 60.0; // seconds
// var maxSubSteps = 3;

// // Start the simulation loop
// var lastTime;
// (function simloop(time) {
//     requestAnimationFrame(simloop);
//     if (lastTime != undefined) {
//         var dt = (time - lastTime) / 1000;
//         world.step(fixedTimeStep, dt, maxSubSteps);
//     }
//     // console.log("Sphere z position: " + sphereBody.position.z);
//     lastTime = time;

//     mesh.position.z = sphereBody.position.z;
// })();

let my_scene = new PhysicsScene();

// const loop = () => {
//     // controls.update();
//     // this.renderer.render(this.scene, this.camera);
//     // window.requestAnimationFrame(loop);
// }
// loop();