// Fonctions utilitaires

// Fonction pour ajouter des messages au panneau de messages
function addMessage(text) {
    const messages = document.getElementById('messages');
    const div = document.createElement('div');
    div.textContent = `> ${text}`;
    div.style.color = '#00ff00';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    
    // Limiter le nombre de messages
    if(messages.children.length > 10) {
        messages.removeChild(messages.firstChild);
    }
}

// Fonctions de gestion des crédits
function addCredits(amount) {
    gameStats.credits += amount;
    document.getElementById('credits').textContent = gameStats.credits;
}

// Utilisation d'énergie
function useEnergy(amount) {
    gameStats.energy = Math.max(0, gameStats.energy - amount);
    updateHUD();
}

// Gestion des dégâts
function takeDamage(amount) {
    if(gameStats.shields > 0) {
        gameStats.shields = Math.max(0, gameStats.shields - amount);
    } else {
        gameStats.health = Math.max(0, gameStats.health - amount);
    }
    updateHUD();
    
    if(gameStats.health <= 0) {
        addMessage("VAISSEAU DÉTRUIT! Jeu terminé.");
    }
}

// Mise à jour du HUD
function updateHUD() {
    document.getElementById('healthBar').style.width = gameStats.health + '%';
    document.getElementById('energyBar').style.width = gameStats.energy + '%';
    document.getElementById('shieldBar').style.width = gameStats.shields + '%';
}

// Fonction de réparation
function repair() {
    if(gameStats.credits >= CONFIG.ECONOMY.REPAIR_COST && gameStats.health < 100) {
        addCredits(-CONFIG.ECONOMY.REPAIR_COST);
        gameStats.health = Math.min(100, gameStats.health + CONFIG.REGENERATION.REPAIR_HEALTH_AMOUNT);
        gameStats.shields = Math.min(100, gameStats.shields + CONFIG.REGENERATION.REPAIR_SHIELD_AMOUNT);
        addMessage("Réparations effectuées!");
        updateHUD();
    }
}

// Gestion de l'inventaire
function addToInventory(item, quantity) {
    if(gameStats.inventory[item]) {
        gameStats.inventory[item] += quantity;
    } else {
        gameStats.inventory[item] = quantity;
    }
}

// Génération de nombres aléatoires dans une plage
function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

// Fonction pour calculer la distance entre deux objets 3D
function getDistance(obj1, obj2) {
    return obj1.position.distanceTo(obj2.position);
}