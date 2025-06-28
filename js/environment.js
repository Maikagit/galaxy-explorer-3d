// Création de l'environnement du jeu

function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
    
    const starsVertices = [];
    for(let i = 0; i < CONFIG.ENVIRONMENT.STAR_COUNT; i++) {
        const x = (Math.random() - 0.5) * CONFIG.ENVIRONMENT.WORLD_SIZE;
        const y = (Math.random() - 0.5) * CONFIG.ENVIRONMENT.WORLD_SIZE;
        const z = (Math.random() - 0.5) * CONFIG.ENVIRONMENT.WORLD_SIZE;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

function createPlanets() {
    planetData.forEach((data, index) => {
        const geometry = new THREE.SphereGeometry(data.size, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: data.color });
        const planet = new THREE.Mesh(geometry, material);
        
        const angle = (index / planetData.length) * Math.PI * 2;
        planet.position.set(
            Math.cos(angle) * data.distance,
            (Math.random() - 0.5) * 20,
            Math.sin(angle) * data.distance
        );
        
        planet.userData = { 
            type: 'planet', 
            name: data.name, 
            desc: data.desc,
            missions: true 
        };
        
        planets.push(planet);
        scene.add(planet);
        
        // Atmosphère
        const atmoGeometry = new THREE.SphereGeometry(data.size * 1.1, 32, 32);
        const atmoMaterial = new THREE.MeshPhongMaterial({ 
            color: data.color, 
            transparent: true, 
            opacity: 0.3 
        });
        const atmosphere = new THREE.Mesh(atmoGeometry, atmoMaterial);
        atmosphere.position.copy(planet.position);
        scene.add(atmosphere);
    });
}

function createPortals() {
    for(let i = 0; i < 3; i++) {
        const geometry = new THREE.TorusGeometry(5, 1, 8, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00ffff, 
            transparent: true, 
            opacity: 0.7 
        });
        const portal = new THREE.Mesh(geometry, material);
        
        portal.position.set(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 200
        );
        
        portal.userData = { type: 'portal', active: true };
        portals.push(portal);
        scene.add(portal);
        
        // Effet visuel du portail
        const ringGeometry = new THREE.RingGeometry(4, 6, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff, 
            transparent: true, 
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(portal.position);
        scene.add(ring);
    }
}

function createOtherShips() {
    for(let i = 0; i < 6; i++) {
        const shipData = shipTypes[Math.floor(Math.random() * shipTypes.length)];
        const otherShip = createShipModel(shipData.color);
        
        otherShip.position.set(
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 400
        );
        
        // Direction aléatoire initiale
        otherShip.rotation.y = Math.random() * Math.PI * 2;
        otherShip.rotation.x = (Math.random() - 0.5) * 0.5;
        
        otherShip.userData = { 
            type: shipData.type,
            name: shipData.name,
            health: 60 + Math.random() * 40, 
            maxHealth: 60 + Math.random() * 40,
            shields: 30 + Math.random() * 20,
            maxShields: 30 + Math.random() * 20,
            speed: 0.015 + Math.random() * 0.02,
            lastShot: 0,
            patrolTarget: new THREE.Vector3(
                (Math.random() - 0.5) * 300,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 300
            ),
            state: 'patrol',
            aggroDistance: shipData.type === 'hostile' ? CONFIG.AI.AGGRO_DISTANCE_HOSTILE : CONFIG.AI.AGGRO_DISTANCE_NORMAL,
            attackDistance: shipData.type === 'hostile' ? CONFIG.AI.ATTACK_DISTANCE_HOSTILE : CONFIG.AI.ATTACK_DISTANCE_NORMAL,
            lastPlayerDistance: 1000
        };
        
        otherShips.push(otherShip);
        scene.add(otherShip);
    }
}