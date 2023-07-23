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
const camera_position = [0, -50, 15];
const camera_lookat = [0, 0, 0];
let my_scene = new PhysicsScene(sizes.width, sizes.height, FOV, sizes.width / sizes.height, camera_position, camera_lookat);
my_scene.AddSphere(1, 0xf050ff, [0,0,10], 10);
my_scene.AddSphere(3, 0xf0ff83, [6,0,10], 5);

my_scene.AddFloor();

/* Create a brick wall */
// await new Promise(r => setTimeout(r, 2000));
let brick_height = 0.5;
let brick_width = 1;
let brick_depth = 0.3;
let offset = 0;
let wall_width = 20;
let wall_height = 10;
let wall_pos = [0-(wall_width*brick_width/2),-15,0];
for (var i=0; i<wall_height; ++i) {
    for (var j=0; j<wall_width; ++j) {
        if (i % 2 !== 0 && j===wall_width-1) continue;
        let offsetX = (i % 2 == 0) ? 0 : brick_width/2;
        let X = wall_pos[0]+(j*(brick_width+offset))+offsetX;
        let Y = wall_pos[1];
        let Z = wall_pos[2]+(i*(brick_depth+offset));
        my_scene.AddBrick(brick_width,brick_height,brick_depth,0xffffff,[X,Y,Z],1);
    }
}
/* Ball to explode the wall */
await new Promise(r => setTimeout(r, 2000));
my_scene.AddSphere(0.5, 0xf00083, [wall_pos[0]+(wall_width*brick_width/2),wall_pos[1],wall_pos[2]+(wall_height*brick_depth/2)], 5);


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
    ls.push(my_scene.AddCube(1, 0x00ff83, [-5+Math.random()*10,-5+Math.random()*10,20], 10));
    // await new Promise(r => setTimeout(r, 100));
    // my_scene.AddRectangle(Math.random()*1,Math.random()*1,Math.random()*1, 0x00ff83, [Math.random()*10,Math.random()*10,20], 10);
}

// await new Promise(r => setTimeout(r, 5000));
// for (var i=0; i<100; ++i) {
//     console.log(my_scene.RemovePhysicsMesh(ls[i]));
//     await new Promise(r => setTimeout(r, 10));
// }

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