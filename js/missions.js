// Système de missions

function startMission() {
    if(gameStats.credits >= CONFIG.ECONOMY.MISSION_COST) {
        addCredits(-CONFIG.ECONOMY.MISSION_COST);
        
        const targetPlanet = planets[Math.floor(Math.random() * planets.length)];
        currentMission = {
            type: 'exploration',
            target: targetPlanet,
            reward: Math.floor(randomBetween(CONFIG.ECONOMY.MISSION_REWARD_MIN, CONFIG.ECONOMY.MISSION_REWARD_MAX)),
            description: `Explorer ${targetPlanet.userData.name} et rapporter des données`,
            completed: false
        };
        
        updateMissionPanel();
        addMessage(`Mission acceptée: ${currentMission.description}`);
        closePlanetInfo();
    } else {
        addMessage("Crédits insuffisants!");
    }
}

function completeMission() {
    if(currentMission && !currentMission.completed) {
        const distance = shipGroup.position.distanceTo(currentMission.target.position);
        if(distance < CONFIG.INTERACTION.PLANET_INTERACTION_DISTANCE) {
            currentMission.completed = true;
            addCredits(currentMission.reward);
            
            const rewards = ["Cristaux Rares", "Artefacts Anciens", "Matière Exotique"];
            const rewardItem = rewards[Math.floor(Math.random() * rewards.length)];
            addToInventory(rewardItem, 1);
            
            addMessage(`Mission accomplie! +${currentMission.reward}₡ + ${rewardItem}`);
            currentMission = null;
            updateMissionPanel();
        } else {
            addMessage("Vous devez être près de la planète cible!");
        }
    }
}

function updateMissionPanel() {
    const missionText = document.getElementById('missionText');
    const missionReward = document.getElementById('missionReward');
    
    if(currentMission) {
        missionText.textContent = currentMission.description;
        missionReward.textContent = `Récompense: ${currentMission.reward}₡`;
    } else {
        missionText.textContent = 'Aucune mission active';
        missionReward.textContent = '';
    }
}

function toggleMission() {
    const panel = document.getElementById('missionPanel');
    if(panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
        updateMissionPanel();
    } else {
        panel.style.display = 'none';
    }
}