// Création et gestion des modèles de vaisseaux

function createPlayerShip() {
    shipGroup = new THREE.Group();
    
    // Corps principal du vaisseau
    const shipGeometry = new THREE.ConeGeometry(0.5, 2, 8);
    const shipMaterial = new THREE.MeshPhongMaterial({ color: 0x0088ff });
    ship = new THREE.Mesh(shipGeometry, shipMaterial);
    ship.rotation.x = Math.PI / 2;
    shipGroup.add(ship);
    
    // Ailes
    const wingGeometry = new THREE.BoxGeometry(2, 0.1, 0.5);
    const wingMaterial = new THREE.MeshPhongMaterial({ color: 0x004488 });
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(0, 0, -0.5);
    shipGroup.add(leftWing);
    
    // Réacteurs
    const engineGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.8);
    const engineMaterial = new THREE.MeshPhongMaterial({ color: 0xff4400 });
    const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    leftEngine.position.set(-1, 0, -1);
    leftEngine.rotation.z = Math.PI / 2;
    shipGroup.add(leftEngine);
    
    const rightEngine = leftEngine.clone();
    rightEngine.position.set(1, 0, -1);
    shipGroup.add(rightEngine);
    
    shipGroup.position.set(0, 0, 0);
    scene.add(shipGroup);
}

function createShipModel(color = 0x0088ff) {
    const shipGroup = new THREE.Group();
    
    // Corps principal du vaisseau
    const shipGeometry = new THREE.ConeGeometry(0.5, 2, 8);
    const shipMaterial = new THREE.MeshPhongMaterial({ color: color });
    const ship = new THREE.Mesh(shipGeometry, shipMaterial);
    ship.rotation.x = Math.PI / 2;
    shipGroup.add(ship);
    
    // Ailes
    const wingGeometry = new THREE.BoxGeometry(2, 0.1, 0.5);
    const wingMaterial = new THREE.MeshPhongMaterial({ color: color * 0.7 });
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(0, 0, -0.5);
    shipGroup.add(leftWing);
    
    // Réacteurs
    const engineGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.8);
    const engineMaterial = new THREE.MeshPhongMaterial({ color: 0xff4400 });
    const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    leftEngine.position.set(-1, 0, -1);
    leftEngine.rotation.z = Math.PI / 2;
    shipGroup.add(leftEngine);
    
    const rightEngine = leftEngine.clone();
    rightEngine.position.set(1, 0, -1);
    shipGroup.add(rightEngine);
    
    return shipGroup;
}