// Gestion des contrôles et du mouvement

function setupControls() {
    document.addEventListener('keydown', (event) => {
        keys[event.code] = true;
        
        if(event.code === 'Space') {
            event.preventDefault();
            shoot();
        }
        
        if(event.code === 'KeyR') {
            repair();
        }
        
        if(event.code === 'KeyI') {
            toggleInventory();
        }
        
        if(event.code === 'KeyM') {
            toggleMission();
        }
    });
    
    document.addEventListener('keyup', (event) => {
        keys[event.code] = false;
    });
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    document.addEventListener('click', (event) => {
        checkInteractions(event);
    });
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function updateMovement() {
    const rotationSpeed = CONFIG.SHIP.ROTATION_SPEED;
    
    // Rotation du vaisseau
    if(keys['KeyA'] || keys['ArrowLeft']) {
        shipGroup.rotation.y += rotationSpeed;
    }
    if(keys['KeyD'] || keys['ArrowRight']) {
        shipGroup.rotation.y -= rotationSpeed;
    }
    if(keys['KeyW'] || keys['ArrowUp']) {
        shipGroup.rotation.x = Math.max(shipGroup.rotation.x - rotationSpeed, -Math.PI/3);
    }
    if(keys['KeyS'] || keys['ArrowDown']) {
        shipGroup.rotation.x = Math.min(shipGroup.rotation.x + rotationSpeed, Math.PI/3);
    }
    
    // Contrôle de vitesse (pas de marche arrière)
    if(keys['KeyQ']) {
        gameStats.velocity = Math.min(gameStats.velocity + CONFIG.SHIP.ACCELERATION_RATE, gameStats.maxVelocity);
        useEnergy(1);
    }
    if(keys['KeyE']) {
        gameStats.velocity = Math.max(gameStats.velocity - CONFIG.SHIP.DECELERATION_RATE, 0);
    }
    
    // Mouvement principal selon la vélocité
    if(gameStats.velocity > 0) {
        const direction = new THREE.Vector3(0, 0, -gameStats.velocity);
        direction.applyQuaternion(shipGroup.quaternion);
        shipGroup.position.add(direction);
    }
    
    // Mouvements de dérive (plus lents)
    const strafeSpeed = CONFIG.SHIP.STRAFE_SPEED;
    if(keys['KeyZ']) {
        const direction = new THREE.Vector3(-strafeSpeed, 0, 0);
        direction.applyQuaternion(shipGroup.quaternion);
        shipGroup.position.add(direction);
    }
    if(keys['KeyC']) {
        const direction = new THREE.Vector3(strafeSpeed, 0, 0);
        direction.applyQuaternion(shipGroup.quaternion);
        shipGroup.position.add(direction);
    }
    if(keys['KeyX']) {
        const direction = new THREE.Vector3(0, strafeSpeed, 0);
        direction.applyQuaternion(shipGroup.quaternion);
        shipGroup.position.add(direction);
    }
    if(keys['KeyV']) {
        const direction = new THREE.Vector3(0, -strafeSpeed, 0);
        direction.applyQuaternion(shipGroup.quaternion);
        shipGroup.position.add(direction);
    }
    
    // Décélération naturelle
    if(!keys['KeyQ'] && !keys['KeyE']) {
        gameStats.velocity *= CONFIG.SHIP.NATURAL_DECELERATION;
        if(gameStats.velocity < CONFIG.SHIP.MIN_VELOCITY_THRESHOLD) gameStats.velocity = 0;
    }
}

function updateCamera() {
    // Caméra qui suit le vaisseau et regarde dans sa direction
    const idealPosition = new THREE.Vector3();
    const idealLookAt = new THREE.Vector3();
    
    // Position de la caméra derrière le vaisseau
    const offset = new THREE.Vector3(0, 3, 8);
    offset.applyQuaternion(shipGroup.quaternion);
    idealPosition.copy(shipGroup.position).add(offset);
    
    // Point vers lequel regarder (devant le vaisseau)
    const lookDirection = new THREE.Vector3(0, 0, -10);
    lookDirection.applyQuaternion(shipGroup.quaternion);
    idealLookAt.copy(shipGroup.position).add(lookDirection);
    
    // Interpolation douce
    camera.position.lerp(idealPosition, 0.1);
    
    // Faire regarder la caméra dans la direction du vaisseau
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(-1).add(camera.position);
    currentLookAt.lerp(idealLookAt, 0.1);
    camera.lookAt(currentLookAt);
}

function checkInteractions(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    // Vérifier les clics sur les vaisseaux
    const shipIntersects = raycaster.intersectObjects(otherShips.map(ship => ship.children).flat());
    
    if(shipIntersects.length > 0) {
        const clickedShip = shipIntersects[0].object.parent;
        showShipInfo(clickedShip);
        return;
    }
    
    // Vérifier les clics sur planètes et portails
    const intersects = raycaster.intersectObjects([...planets, ...portals]);
    
    if(intersects.length > 0) {
        const object = intersects[0].object;
        const distance = shipGroup.position.distanceTo(object.position);
        
        if(object.userData.type === 'planet') {
            if(distance < CONFIG.INTERACTION.PLANET_INTERACTION_DISTANCE) {
                showPlanetInfo(object);
            } else {
                addMessage(`Trop loin de ${object.userData.name}. Approchez-vous!`);
            }
        } else if(object.userData.type === 'portal') {
            if(distance < CONFIG.INTERACTION.PORTAL_INTERACTION_DISTANCE) {
                showPortalInfo(object);
            } else {
                addMessage("Trop loin du portail. Approchez-vous!");
            }
        }
    }
}