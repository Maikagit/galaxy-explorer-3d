// Configuration globale du jeu
const CONFIG = {
    // Paramètres du vaisseau
    SHIP: {
        MAX_VELOCITY: 1.2,
        ROTATION_SPEED: 0.015,
        STRAFE_SPEED: 0.2,
        NATURAL_DECELERATION: 0.985,
        MIN_VELOCITY_THRESHOLD: 0.005,
        ACCELERATION_RATE: 0.03,
        DECELERATION_RATE: 0.03
    },
    
    // Paramètres de combat
    COMBAT: {
        PROJECTILE_SPEED: 2,
        PROJECTILE_LIFE: 100,
        PROJECTILE_DAMAGE: 25,
        ENEMY_PROJECTILE_SPEED: 1.5,
        ENEMY_PROJECTILE_LIFE: 150,
        ENEMY_PROJECTILE_DAMAGE: 15,
        ENERGY_COST_PER_SHOT: 10,
        ENEMY_SHOT_COOLDOWN: 2000
    },
    
    // Paramètres de l'IA
    AI: {
        AGGRO_DISTANCE_HOSTILE: 40,
        AGGRO_DISTANCE_NORMAL: 15,
        ATTACK_DISTANCE_HOSTILE: 35,
        ATTACK_DISTANCE_NORMAL: 25,
        PATROL_SPEED_MULTIPLIER: 1,
        CHASE_SPEED_MULTIPLIER: 1.5,
        ATTACK_SPEED_MULTIPLIER: 1.2,
        RETREAT_SPEED_MULTIPLIER: 0.8,
        CIRCLE_SPEED_MULTIPLIER: 0.5,
        PATROL_TARGET_THRESHOLD: 10
    },
    
    // Paramètres de l'environnement
    ENVIRONMENT: {
        STAR_COUNT: 10000,
        WORLD_SIZE: 2000,
        FOG_DISTANCE: 1000
    },
    
    // Paramètres du radar
    RADAR: {
        RADIUS: 75,
        WORLD_RADIUS: 200
    },
    
    // Paramètres des interactions
    INTERACTION: {
        PLANET_INTERACTION_DISTANCE: 15,
        PORTAL_INTERACTION_DISTANCE: 20,
        COLLISION_DISTANCE: 3
    },
    
    // Coûts et récompenses
    ECONOMY: {
        MISSION_COST: 500,
        PORTAL_TRAVEL_COST: 200,
        REPAIR_COST: 100,
        KILL_REWARD: 150,
        MISSION_REWARD_MIN: 600,
        MISSION_REWARD_MAX: 1400,
        TRADE_PROFIT_MIN: 100,
        TRADE_PROFIT_MAX: 400
    },
    
    // Régénération
    REGENERATION: {
        ENERGY_REGEN_RATE: 0.2,
        REPAIR_HEALTH_AMOUNT: 50,
        REPAIR_SHIELD_AMOUNT: 30
    }
};