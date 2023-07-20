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
my_scene.AddSphere(1, 0x00ff83, 10, [0,0,10]);
my_scene.AddSphere(3, 0xffff83, 5, [6,0,10]);
my_scene.AddFloor();

await new Promise(r => setTimeout(r, 2000));
for (var i=0; i<100; ++i) {
    my_scene.AddSphere(1, 0x00ff83, 10, [Math.random()*10,Math.random()*10,20]);
    // await new Promise(r => setTimeout(r, 100));
}