// Système de commerce

function trade() {
    const profit = Math.floor(randomBetween(CONFIG.ECONOMY.TRADE_PROFIT_MIN, CONFIG.ECONOMY.TRADE_PROFIT_MAX));
    addCredits(profit);
    addMessage(`Commerce réussi! +${profit}₡`);
    closePlanetInfo();
}

function openTrade() {
    let tradeHTML = '<h4>COMMERCE</h4>';
    
    Object.keys(tradeGoods).forEach(item => {
        const price = tradeGoods[item];
        tradeHTML += `
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>${item}</span>
                <div>
                    <button onclick="buyItem('${item}')" style="margin: 2px;">Acheter ${price.buyPrice}₡</button>
                    <button onclick="sellItem('${item}')" style="margin: 2px;">Vendre ${price.sellPrice}₡</button>
                </div>
            </div>
        `;
    });
    
    document.getElementById('shipInfoActions').innerHTML = tradeHTML;
}

function buyItem(item) {
    const price = tradeGoods[item].buyPrice;
    if(gameStats.credits >= price) {
        addCredits(-price);
        addToInventory(item, 1);
        addMessage(`Acheté: ${item} pour ${price}₡`);
        updateInventoryDisplay();
    } else {
        addMessage("Crédits insuffisants!");
    }
}

function sellItem(item) {
    if(gameStats.inventory[item] && gameStats.inventory[item] > 0) {
        const price = tradeGoods[item].sellPrice;
        addCredits(price);
        gameStats.inventory[item]--;
        if(gameStats.inventory[item] === 0) {
            delete gameStats.inventory[item];
        }
        addMessage(`Vendu: ${item} pour ${price}₡`);
        updateInventoryDisplay();
    } else {
        addMessage(`Vous n'avez pas de ${item}!`);
    }
}

function usePortal() {
    if(gameStats.credits >= CONFIG.ECONOMY.PORTAL_TRAVEL_COST) {
        addCredits(-CONFIG.ECONOMY.PORTAL_TRAVEL_COST);
        
        shipGroup.position.set(
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 300
        );
        
        gameStats.currentSystem = availableSystems[Math.floor(Math.random() * availableSystems.length)];
        document.getElementById('currentSystem').textContent = gameStats.currentSystem;
        
        addMessage(`Voyage vers ${gameStats.currentSystem} réussi!`);
        closePortalInfo();
    } else {
        addMessage("Crédits insuffisants!");
    }
}