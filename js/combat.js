// Système de combat

function shoot() {
    if(gameStats.energy < CONFIG.COMBAT.ENERGY_COST_PER_SHOT) return;
    
    const geometry = new THREE.SphereGeometry(0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const projectile = new THREE.Mesh(geometry, material);
    
    projectile.position.copy(shipGroup.position);
    projectile.userData = { 
        type: 'projectile', 
        velocity: new THREE.Vector3(0, 0, -CONFIG.COMBAT.PROJECTILE_SPEED),
        life: CONFIG.COMBAT.PROJECTILE_LIFE,
        damage: CONFIG.COMBAT.PROJECTILE_DAMAGE
    };
    
    // Appliquer la rotation du vaisseau au projectile
    const direction = new THREE.Vector3(0, 0, -CONFIG.COMBAT.PROJECTILE_SPEED);
    direction.applyQuaternion(shipGroup.quaternion);
    projectile.userData.velocity = direction;
    
    projectiles.push(projectile);
    scene.add(projectile);
    
    useEnergy(CONFIG.COMBAT.ENERGY_COST_PER_SHOT);
    addMessage("Tir laser!");
}

function shipShoot(ship) {
    const geometry = new THREE.SphereGeometry(0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const projectile = new THREE.Mesh(geometry, material);
    
    projectile.position.copy(ship.position);
    
    const direction = new THREE.Vector3();
    direction.subVectors(shipGroup.position, ship.position);
    direction.normalize();
    direction.multiplyScalar(CONFIG.COMBAT.ENEMY_PROJECTILE_SPEED);
    
    projectile.userData = { 
        type: 'enemyProjectile', 
        velocity: direction,
        life: CONFIG.COMBAT.ENEMY_PROJECTILE_LIFE,
        damage: CONFIG.COMBAT.ENEMY_PROJECTILE_DAMAGE
    };
    
    projectiles.push(projectile);
    scene.add(projectile);
}

function updateProjectiles() {
    for(let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        projectile.position.add(projectile.userData.velocity);
        projectile.userData.life--;
        
        if(projectile.userData.life <= 0) {
            scene.remove(projectile);
            projectiles.splice(i, 1);
            continue;
        }
        
        // Collision avec les autres vaisseaux (projectiles du joueur)
        if(projectile.userData.type === 'projectile') {
            for(let j = otherShips.length - 1; j >= 0; j--) {
                const otherShip = otherShips[j];
                if(projectile.position.distanceTo(otherShip.position) < CONFIG.INTERACTION.COLLISION_DISTANCE) {
                    // Calculer les dégâts
                    let damage = projectile.userData.damage;
                    
                    if(otherShip.userData.shields > 0) {
                        otherShip.userData.shields -= damage;
                        if(otherShip.userData.shields < 0) {
                            damage = Math.abs(otherShip.userData.shields);
                            otherShip.userData.shields = 0;
                            otherShip.userData.health -= damage;
                        }
                    } else {
                        otherShip.userData.health -= damage;
                    }
                    
                    scene.remove(projectile);
                    projectiles.splice(i, 1);
                    
                    // Le vaisseau touché devient hostile
                    if(otherShip.userData.type !== 'hostile') {
                        otherShip.userData.type = 'hostile';
                        otherShip.userData.state = 'attack';
                        addMessage(`${otherShip.userData.name} devient hostile!`);
                    }
                    
                    if(otherShip.userData.health <= 0) {
                        scene.remove(otherShip);
                        otherShips.splice(j, 1);
                        addCredits(CONFIG.ECONOMY.KILL_REWARD);
                        addMessage(`${otherShip.userData.name} détruit! +${CONFIG.ECONOMY.KILL_REWARD}₡`);
                    }
                    break;
                }
            }
        }
        
        // Collision avec le joueur (projectiles ennemis)
        if(projectile.userData.type === 'enemyProjectile') {
            if(projectile.position.distanceTo(shipGroup.position) < CONFIG.INTERACTION.COLLISION_DISTANCE) {
                takeDamage(projectile.userData.damage);
                scene.remove(projectile);
                projectiles.splice(i, 1);
                addMessage("Touché par un vaisseau hostile!");
            }
        }
    }
}