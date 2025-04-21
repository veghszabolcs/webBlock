import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import CubeWithEdges from './CubeWithEdges.js';
import Floor from './Floor.js';

/////globals///////
var activeTool = "cameraTool"; document.getElementById(activeTool).style.backgroundColor = "white"; document.getElementById(activeTool).style.color = "black";
var selectedObject = null;
const settings = document.getElementById('selectedSettings');

//////////
//#region basic setup
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
const cube = new CubeWithEdges(1, 0x5e1f61, 0xffffff);

const cube2 = new CubeWithEdges(1, 0x2ac984, 0xffffff);

scene.add(cube2);
cube2.position.set(2, 0.5, 0);
scene.add(floor);
scene.add(cube);

camera.position.z = 5;
//#endregion
//#region Light setup
function initLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
}
//#endregion
//#region animation loop
function animate() {
    controls.update();
    renderer.render(scene, camera);
}
//#endregion
//#region Enter reset
window.addEventListener('keydown', (event) => {
    if (selectedObject !== null) return;
    if (event.key === 'Enter') {
        camera.position.set(0, 0, 5);
        controls.target.set(0, 0, 0);
        controls.update();
    }
});
//#endregion
//#region select object
window.addEventListener('click', (event) => {

    const menu = document.getElementById('menu');
    const tools = document.getElementById('tools');
    const info = document.getElementById('info');
    if (menu.contains(event.target) || tools.contains(event.target) || info.contains(event.target) || event.button !== 0 || activeTool === "cameraTool") {
        return;
    }

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    const visibleIntersect = intersects.find(i => {
        if (!i.face) return false;
        const camToPoint = new THREE.Vector3().subVectors(camera.position, i.point).normalize();
        return i.face.normal.dot(camToPoint) > 0;
    });

    if (visibleIntersect) {
        const parentObject = visibleIntersect.object.parent;

        if (parentObject instanceof Floor) return;

        if (selectedObject !== parentObject) {
            if (selectedObject?.setEdgeColor) selectedObject.setEdgeColor(0xFFFFFF);
            selectedObject = parentObject;
            if (selectedObject?.setEdgeColor) selectedObject.setEdgeColor(0xFF0000);
        }

        settings.style.display = "block";
        const inputSize = document.getElementById('inputSize');
        inputSize.value = selectedObject.mesh.scale.x;
    }
});
//#endregion
//#region tool selection
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
//#endregion
//#region settings menu
closeSettings.addEventListener('click', (event) => {
    settings.style.display = "none";
    selectedObject.setEdgeColor(0xFFFFFF);
    selectedObject = null;
});
inputSize.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;

    const newSize = event.target.value;
    if (isNaN(newSize) || newSize <= 0) {
        alert("Please enter a valid size greater than 0.");
        return;
    }
    selectedObject.setSize(newSize);
    selectedObject.position.y = newSize / 2;

});
//#endregion