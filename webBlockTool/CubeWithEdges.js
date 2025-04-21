import * as THREE from 'three';

export default class CubeWithEdges extends THREE.Object3D {
    constructor(size = 1, color = 0x00ff00, edgeColor = 0xffffff) {
        super();

        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshBasicMaterial({ color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.add(this.mesh);

        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: edgeColor });
        this.edgeLines = new THREE.LineSegments(edges, lineMaterial);
        this.add(this.edgeLines);

        this.userData.selectable = true;
        this.position.y = 0.5
    }

    setColor(newColor) {
        this.mesh.material.color.set(newColor);
    }

    setEdgeColor(newColor) {
        this.edgeLines.material.color.set(newColor);
    }

    setSize(size){
        this.mesh.geometry.dispose();
        this.mesh.geometry = new THREE.BoxGeometry(size, size, size);
        this.edgeLines.geometry.dispose();
        this.edgeLines.geometry = new THREE.EdgesGeometry(this.mesh.geometry);
    }

    moveVertically(distance) {
        this.position.y += distance;
    }

    reset() {
        this.scale.set(1, 1, 1);
        this.setColor(0x00ff00);
        this.setEdgeColor(0xffffff);
    }
}