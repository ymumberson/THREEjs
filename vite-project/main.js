import * as THREE from "three";
import "./style.css";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

// Scene
const scene = new THREE.Scene();

// Create the sphere
const RADIUS = 3;
const SEGMENTS = 64;
const geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS);
const material = new THREE.MeshStandardMaterial({
    color: 0x00ff83,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10)
scene.add(light);

// Camera
const sizes = {
    // width: 800,
    // height: 600
    width: window.innerWidth,
    height: window.innerHeight
}
const FOV = 45;
const camera = new THREE.PerspectiveCamera(FOV, sizes.width / sizes.height);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);

// Resize
window.addEventListener('resize', () => {
    // Update Sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    // renderer.render(scene, camera);
})

const loop = () => {
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}
loop();