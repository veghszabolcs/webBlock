import * as THREE from 'three';

export default class Floor extends THREE.Object3D {
  constructor() {
    super();

    const FloorGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
    const FloorMaterial = new THREE.MeshBasicMaterial({ color: 0x888a88, side: THREE.DoubleSide, wireframe: true });
    const FloorMesh = new THREE.Mesh(FloorGeometry, FloorMaterial);
    FloorMesh.rotation.x = Math.PI / 2; 
    FloorMesh.position.y = -0.5; 

    this.add(FloorMesh);
  }
}
