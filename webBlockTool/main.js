import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import CubeWithEdges from './CubeWithEdges.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const cube = new CubeWithEdges(1, 0x5e1f61, 0xffffff)

scene.add(cube);

camera.position.z = 5;

function animate() {
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        camera.position.set(0, 0, 5);
        controls.target.set(0, 0, 0);
        controls.update();
    }
});

window.addEventListener('click', (event) => {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        console.log("You clicked on:", selectedObject);

        selectedObject.material.color.set(0xff0000);
    }
});