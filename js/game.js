// Fichier principal du jeu

function init() {
    // Scène
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000011, 1, CONFIG.ENVIRONMENT.FOG_DISTANCE);
    
    // Caméra
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000011);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('gameContainer').appendChild(renderer.domElement);
    
    // Lumières
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Créer le vaisseau du joueur
    createPlayerShip();
    
    // Créer l'environnement
    createStarfield();
    createPlanets();
    createPortals();
    createOtherShips();
    
    // Event listeners
    setupControls();
    
    // Démarrer la boucle de jeu
    animate();
    
    addMessage("Systèmes en ligne. Prêt pour l'exploration!");
}

function animate() {
    requestAnimationFrame(animate);
    
    updateMovement();
    updateCamera();
    updateProjectiles();
    updateOtherShips();
    
    // Régénération d'énergie
    if(gameStats.energy < 100) {
        gameStats.energy = Math.min(100, gameStats.energy + CONFIG.REGENERATION.ENERGY_REGEN_RATE);
        updateHUD();
    }
    
    // Animation des planètes
    planets.forEach(planet => {
        planet.rotation.y += 0.01;
    });
    
    // Animation des portails
    portals.forEach(portal => {
        portal.rotation.x += 0.02;
        portal.rotation.y += 0.01;
    });
    
    // Mise à jour du radar
    updateRadar();
    
    // Vérifier la progression de la mission
    if(currentMission && !currentMission.completed) {
        const distance = shipGroup.position.distanceTo(currentMission.target.position);
        if(distance < CONFIG.INTERACTION.PLANET_INTERACTION_DISTANCE) {
            // Objectif atteint - le joueur peut terminer la mission
        }
    }
    
    renderer.render(scene, camera);
}

// Démarrer le jeu
init();