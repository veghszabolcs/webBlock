import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import CubeWithEdges from './CubeWithEdges.js';
import Floor from './GridFloor.js';

/////globals///////
var activeTool = "cameraTool"; document.getElementById(activeTool).style.backgroundColor = "white"; document.getElementById(activeTool).style.color = "black";

//////////
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

initLight();

const floor = new Floor();
const cube = new CubeWithEdges(1, 0x5e1f61, 0xffffff)

scene.add(floor);
scene.add(cube);

camera.position.z = 5;
///////////

function initLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
}

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

    const menu = document.getElementById('menu');
    const tools = document.getElementById('tools');
    const info = document.getElementById('info');
    if (menu.contains(event.target) || tools.contains(event.target) || info.contains(event.target) || event.button !== 0 || activeTool === "cameraTool") {
        return;
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {

        const selectedObject = intersects[0].object;
        console.log("You clicked on:", selectedObject);

        if (selectedObject.parent instanceof CubeWithEdges) {
            console.log("You clicked on the cube!");
            selectedObject.parent.setEdgeColor(0xff0000);
        }
    }
});

tools.addEventListener('click', (event) => {

    if (event.target !== event.currentTarget) {
        const lastTool = activeTool;
        activeTool = event.target.id;

        if (lastTool !== activeTool) {
            document.getElementById(lastTool).style.backgroundColor = "transparent"; 
            document.getElementById(lastTool).style.color = "white";

            document.getElementById(activeTool).style.backgroundColor = "white";
            document.getElementById(activeTool).style.color = "black";
        }
    }

});