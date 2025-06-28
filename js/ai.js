// Intelligence artificielle des vaisseaux

function updateOtherShips() {
    otherShips.forEach(otherShip => {
        const distanceToPlayer = otherShip.position.distanceTo(shipGroup.position);
        const userData = otherShip.userData;
        
        // Mise à jour de l'état selon la distance et le type
        if(userData.type === 'hostile' && distanceToPlayer < userData.attackDistance) {
            userData.state = 'attack';
        } else if(userData.type === 'hostile' && distanceToPlayer < userData.aggroDistance) {
            userData.state = 'chase';
        } else if(distanceToPlayer > userData.aggroDistance * 2) {
            if(userData.type !== 'hostile') userData.state = 'patrol';
            else userData.state = 'patrol';
        }
        
        // Comportement selon l'état
        switch(userData.state) {
            case 'patrol':
                handlePatrolBehavior(otherShip, userData);
                break;
                
            case 'chase':
                handleChaseBehavior(otherShip, userData);
                break;
                
            case 'attack':
                handleAttackBehavior(otherShip, userData, distanceToPlayer);
                break;
        }
        
        userData.lastPlayerDistance = distanceToPlayer;
    });
}

function handlePatrolBehavior(otherShip, userData) {
    if(otherShip.position.distanceTo(userData.patrolTarget) < CONFIG.AI.PATROL_TARGET_THRESHOLD) {
        userData.patrolTarget = new THREE.Vector3(
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 300
        );
    }
    
    const patrolDirection = new THREE.Vector3();
    patrolDirection.subVectors(userData.patrolTarget, otherShip.position);
    patrolDirection.normalize();
    patrolDirection.multiplyScalar(userData.speed * CONFIG.AI.PATROL_SPEED_MULTIPLIER);
    
    otherShip.position.add(patrolDirection);
    otherShip.lookAt(userData.patrolTarget);
}

function handleChaseBehavior(otherShip, userData) {
    const chaseDirection = new THREE.Vector3();
    chaseDirection.subVectors(shipGroup.position, otherShip.position);
    chaseDirection.normalize();
    chaseDirection.multiplyScalar(userData.speed * CONFIG.AI.CHASE_SPEED_MULTIPLIER);
    
    otherShip.position.add(chaseDirection);
    otherShip.lookAt(shipGroup.position);
}

function handleAttackBehavior(otherShip, userData, distanceToPlayer) {
    const attackDirection = new THREE.Vector3();
    attackDirection.subVectors(shipGroup.position, otherShip.position);
    
    if(distanceToPlayer > userData.attackDistance * 1.2) {
        // Se rapprocher
        attackDirection.normalize();
        attackDirection.multiplyScalar(userData.speed * CONFIG.AI.ATTACK_SPEED_MULTIPLIER);
        otherShip.position.add(attackDirection);
    } else if(distanceToPlayer < userData.attackDistance * 0.8) {
        // S'éloigner
        attackDirection.normalize();
        attackDirection.multiplyScalar(-userData.speed * CONFIG.AI.RETREAT_SPEED_MULTIPLIER);
        otherShip.position.add(attackDirection);
    } else {
        // Tourner autour
        const circleDirection = new THREE.Vector3();
        circleDirection.copy(attackDirection);
        circleDirection.cross(new THREE.Vector3(0, 1, 0));
        circleDirection.normalize();
        circleDirection.multiplyScalar(userData.speed * CONFIG.AI.CIRCLE_SPEED_MULTIPLIER);
        otherShip.position.add(circleDirection);
    }
    
    otherShip.lookAt(shipGroup.position);
    
    // Tirer
    if(Date.now() - userData.lastShot > CONFIG.COMBAT.ENEMY_SHOT_COOLDOWN) {
        shipShoot(otherShip);
        userData.lastShot = Date.now();
    }
}