// Gestion de l'interface utilisateur

function showPlanetInfo(planet) {
    const info = document.getElementById('planetInfo');
    document.getElementById('planetName').textContent = planet.userData.name;
    document.getElementById('planetDesc').textContent = planet.userData.desc;
    
    const completeBtn = document.getElementById('completeMissionBtn');
    if(currentMission && currentMission.target === planet && !currentMission.completed) {
        completeBtn.style.display = 'block';
    } else {
        completeBtn.style.display = 'none';
    }
    
    info.style.display = 'block';
    info.style.left = '50%';
    info.style.top = '50%';
    info.style.transform = 'translate(-50%, -50%)';
}

function showPortalInfo() {
    const info = document.getElementById('portalInfo');
    info.style.display = 'block';
    info.style.left = '50%';
    info.style.top = '50%';
    info.style.transform = 'translate(-50%, -50%)';
}

function showShipInfo(ship) {
    const info = document.getElementById('shipInfo');
    const userData = ship.userData;
    
    document.getElementById('shipInfoName').textContent = userData.name;
    document.getElementById('shipInfoDesc').textContent = 
        `Type: ${userData.type} | Santé: ${Math.round(userData.health)}/${Math.round(userData.maxHealth)}`;
    
    const actionsDiv = document.getElementById('shipInfoActions');
    actionsDiv.innerHTML = '';
    
    if(userData.type === 'trader') {
        actionsDiv.innerHTML = '<button onclick="openTrade()">Commerce</button>';
    } else if(userData.type === 'ally') {
        actionsDiv.innerHTML = '<button onclick="requestSupport()">Demander Support</button>';
    } else {
        actionsDiv.innerHTML = '<div>Communication établie</div>';
    }
    
    info.style.display = 'block';
    info.style.left = '50%';
    info.style.top = '50%';
    info.style.transform = 'translate(-50%, -50%)';
}

function closePlanetInfo() {
    document.getElementById('planetInfo').style.display = 'none';
}

function closePortalInfo() {
    document.getElementById('portalInfo').style.display = 'none';
}

function closeShipInfo() {
    document.getElementById('shipInfo').style.display = 'none';
}

function toggleInventory() {
    const inv = document.getElementById('inventory');
    if(inv.style.display === 'none' || inv.style.display === '') {
        inv.style.display = 'block';
        updateInventoryDisplay();
    } else {
        inv.style.display = 'none';
    }
}

function updateInventoryDisplay() {
    const invList = document.getElementById('inventoryList');
    invList.innerHTML = '';
    
    Object.keys(gameStats.inventory).forEach(item => {
        const quantity = gameStats.inventory[item];
        const div = document.createElement('div');
        div.className = 'inventory-item';
        div.innerHTML = `<span>${item}</span><span>${quantity}</span>`;
        invList.appendChild(div);
    });
}

function updateRadar() {
    const radar = document.getElementById('radar');
    radar.innerHTML = '';
    
    const radarRadius = CONFIG.RADAR.RADIUS;
    const worldRadius = CONFIG.RADAR.WORLD_RADIUS;
    
    // Point du joueur
    const playerDot = document.createElement('div');
    playerDot.className = 'radar-dot radar-player';
    playerDot.style.left = '50%';
    playerDot.style.top = '50%';
    radar.appendChild(playerDot);
    
    // Planètes
    planets.forEach(planet => {
        const distance = shipGroup.position.distanceTo(planet.position);
        if(distance < worldRadius) {
            const dot = document.createElement('div');
            dot.className = 'radar-dot radar-planet';
            
            const relativePos = planet.position.clone().sub(shipGroup.position);
            const x = (relativePos.x / worldRadius) * radarRadius;
            const z = (relativePos.z / worldRadius) * radarRadius;
            
            dot.style.left = `${50 + (x / radarRadius) * 50}%`;
            dot.style.top = `${50 + (z / radarRadius) * 50}%`;
            
            if(currentMission && currentMission.target === planet) {
                dot.className += ' radar-target';
            }
            
            radar.appendChild(dot);
        }
    });
    
    // Portails
    portals.forEach(portal => {
        const distance = shipGroup.position.distanceTo(portal.position);
        if(distance < worldRadius) {
            const dot = document.createElement('div');
            dot.className = 'radar-dot radar-portal';
            
            const relativePos = portal.position.clone().sub(shipGroup.position);
            const x = (relativePos.x / worldRadius) * radarRadius;
            const z = (relativePos.z / worldRadius) * radarRadius;
            
            dot.style.left = `${50 + (x / radarRadius) * 50}%`;
            dot.style.top = `${50 + (z / radarRadius) * 50}%`;
            
            radar.appendChild(dot);
        }
    });
    
    // Autres vaisseaux
    otherShips.forEach(ship => {
        const distance = shipGroup.position.distanceTo(ship.position);
        if(distance < worldRadius) {
            const dot = document.createElement('div');
            let className = 'radar-dot ';
            
            switch(ship.userData.type) {
                case 'ally':
                    className += 'radar-ally';
                    break;
                case 'trader':
                    className += 'radar-trader';
                    break;
                default:
                    className += 'radar-ship';
            }
            
            dot.className = className;
            
            const relativePos = ship.position.clone().sub(shipGroup.position);
            const x = (relativePos.x / worldRadius) * radarRadius;
            const z = (relativePos.z / worldRadius) * radarRadius;
            
            dot.style.left = `${50 + (x / radarRadius) * 50}%`;
            dot.style.top = `${50 + (z / radarRadius) * 50}%`;
            
            radar.appendChild(dot);
        }
    });
}

function requestSupport() {
    addMessage("Garde Spatiale: Assistance en route!");
    closeShipInfo();
}