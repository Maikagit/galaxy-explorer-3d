// État global du jeu
let gameStats = {
    health: 100,
    energy: 100,
    shields: 100,
    credits: 1000,
    currentSystem: "Alpha Centauri",
    velocity: 0,
    maxVelocity: CONFIG.SHIP.MAX_VELOCITY,
    inventory: {
        "Composants Électroniques": 5,
        "Carburant": 10,
        "Minerais": 3
    }
};

// Variables du jeu
let scene, camera, renderer, ship, shipGroup;
let planets = [], portals = [], otherShips = [], projectiles = [];
let currentMission = null;
let keys = {};
let mouseX = 0, mouseY = 0;
let cameraOffset = new THREE.Vector3(0, 5, 10);

// Données de commerce
const tradeGoods = {
    "Composants Électroniques": { buyPrice: 50, sellPrice: 80 },
    "Carburant": { buyPrice: 20, sellPrice: 35 },
    "Minerais": { buyPrice: 100, sellPrice: 150 },
    "Cristaux Rares": { buyPrice: 200, sellPrice: 300 },
    "Artefacts Anciens": { buyPrice: 500, sellPrice: 800 },
    "Matière Exotique": { buyPrice: 1000, sellPrice: 1500 }
};

// Données des planètes
const planetData = [
    { name: "Kepler-442b", color: 0x00ff00, size: 3, distance: 50, desc: "Planète terrestre avec de l'eau" },
    { name: "Mars Beta", color: 0xff4400, size: 2, distance: 80, desc: "Planète désertique riche en minerais" },
    { name: "Ocean World", color: 0x0088ff, size: 4, distance: 120, desc: "Monde océanique avec vie marine" },
    { name: "Crystal Planet", color: 0xff00ff, size: 2.5, distance: 160, desc: "Planète cristalline précieuse" }
];

// Types de vaisseaux
const shipTypes = [
    { color: 0x00ff00, type: 'ally', name: 'Garde Spatiale' },
    { color: 0xffff00, type: 'trader', name: 'Marchand' },
    { color: 0xff8800, type: 'neutral', name: 'Explorateur' },
    { color: 0xff0000, type: 'hostile', name: 'Pirate' },
    { color: 0x8800ff, type: 'neutral', name: 'Scientifique' }
];

// Systèmes disponibles
const availableSystems = ["Beta Proxima", "Gamma Draconis", "Delta Vega", "Epsilon Eridani"];