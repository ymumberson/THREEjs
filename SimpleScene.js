// Scene
const scene = new THREE.Scene();

// Red cube
const WIDTH = 1;
const geometry = new THREE.BoxGeometry(WIDTH, WIDTH, WIDTH);
const material = new THREE.MeshBasicMaterial({
    color: 0xff0000
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera
const FOV = 75; // Vertical FoV in degrees
const sizes = {
    width: 800,
    height: 600
}
const ASPECT_RATIO = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO);
camera.position.z = 3;
// camera.position.y = 1;
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);