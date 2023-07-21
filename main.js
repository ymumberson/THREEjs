import * as THREE from "three";
import "./style.css";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon";
import { PhysicsScene } from './physicsScene.js';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const FOV = 45;
const camera_position = new THREE.Vector3(0,-20,1);
const camera_lookat = new THREE.Vector3(0, 0, 0);
let my_scene = new PhysicsScene(sizes.width, sizes.height, FOV, sizes.width / sizes.height, [0, -100, 30], [0, 0, 0]);
my_scene.AddSphere(1, 0xf050ff, [0,0,10], 10);
my_scene.AddSphere(3, 0xf0ff83, [6,0,10], 5);
my_scene.AddFloor();

// await new Promise(r => setTimeout(r, 2000));
// for (var i=0; i<100; ++i) {
//     my_scene.AddSphere(1, 0x00ff83, [Math.random()*10,Math.random()*10,20], 10);
//     // await new Promise(r => setTimeout(r, 100));
// }

// await new Promise(r => setTimeout(r, 5000));
// for (var i=0; i<100; ++i) {
//     let rnd = Math.random()*10;
//     my_scene.AddSphere(rnd, 0x00ff83, [Math.random()*10,Math.random()*10,20], rnd);
//     await new Promise(r => setTimeout(r, 500));
// }

await new Promise(r => setTimeout(r, 2000));
let ls = [];
for (var i=0; i<100; ++i) {
    ls.push(my_scene.AddCube(1, 0x00ff83, [Math.random()*10,Math.random()*10,20], 10));
    // await new Promise(r => setTimeout(r, 100));
    // my_scene.AddRectangle(Math.random()*1,Math.random()*1,Math.random()*1, 0x00ff83, [Math.random()*10,Math.random()*10,20], 10);
}

await new Promise(r => setTimeout(r, 3000));
for (var i=0; i<100; ++i) {
    console.log(my_scene.RemovePhysicsMesh(ls[i]));
    await new Promise(r => setTimeout(r, 10));
}

// await new Promise(r => setTimeout(r, 5000));
// for (var i=0; i<100; ++i) {
//     let rnd = Math.random()*10;
//     my_scene.AddCube(rnd, 0x00ff83, [Math.random()*10,Math.random()*10,20], rnd);
//     await new Promise(r => setTimeout(r, 500));
// }

// console.log("Starting to remove!");
// await new Promise(r => setTimeout(r, 3000));
// for (var i=0; i<100; ++i) {
//     my_scene.RemoveAtIndex(3);
//     await new Promise(r => setTimeout(r, 10));
// }
// console.log("Finished removing!");