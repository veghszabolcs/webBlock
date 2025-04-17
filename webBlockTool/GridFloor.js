import * as THREE from 'three';

export default class GridFloor extends THREE.Object3D {
  constructor(gridSize = 50, gridCount = 20, floorSize = 1000, floorColor = 0x777777, gridColor = 0x8d8f8f) {
    super();

    const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: floorColor, roughness: 1 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    this.add(floor);

    const gridMaterial = new THREE.LineBasicMaterial({ color: gridColor, opacity: 0.5, transparent: true });

    const gridGeometry = new THREE.Geometry();

    for (let i = -gridCount; i <= gridCount; i++) {
      gridGeometry.vertices.push(new THREE.Vector3(-gridSize * gridCount, 0, i * gridSize));
      gridGeometry.vertices.push(new THREE.Vector3(gridSize * gridCount, 0, i * gridSize));
    }

    for (let i = -gridCount; i <= gridCount; i++) {
      gridGeometry.vertices.push(new THREE.Vector3(i * gridSize, 0, -gridSize * gridCount));
      gridGeometry.vertices.push(new THREE.Vector3(i * gridSize, 0, gridSize * gridCount));
    }

    const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
    this.add(grid);
  }
}
