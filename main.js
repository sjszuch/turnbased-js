var playerStats = {
    // Maximum health
    maxHealth: 100,

    // Percent that you can dodge an enemy attack
    dodgeRate: 5,

    // Percent that attacks are critical
    critRate: 5,

    // Percent that attack damage is buffed
    strength: 1
}

// CONSTRUCTORS
// Constructor function for all attack skills
function Attack(name, power, combosFrom, comboPower, coolDown) {
    this.name = name;
    this.power = power;
    this.combosFrom = combosFrom;
    this.comboPower = comboPower;
    this.coolDown = coolDown;
}

// Enemy constructor
function Enemy(name, health, attack1, attack2) {
    this.name = name;
    this.health = health;
    this.enemyAttacks = [
        this.attack1 = attack1,
        this.attack2 = attack2
    ]
}

// ARRAYS
// A list of all attack skills
var attackList = [
    punch = new Attack("punch", 10, null, null, 5),
    kick = new Attack("kick", 20, "punch", 50, 10)
];

// A list of all enemies
var enemyList = [
    froggit = new Enemy("Froggit", 500, 5, 10),
    flowey = new Enemy("Flowey", 100, 2, 5)
]

// Used any time player attacks, scales the damage by the player's stats
function strengthScale(initAttack) {
    switch (playerStats.strength) {
        case 1:
            return initAttack;
            break;
        case 2:
            return Math.round(initAttack * 1.5);
            break;
        case 3:
            return Math.round(initAttack * 2);
            break;
        case 4:
            return Math.round(initAttack * 2.5);
            break;
        case 5:
            return Math.round(initAttack * 3);
            break;
    }
}

// Checks if the attack can be combo'd and logs the attack power, then sets last attack to the one just used
function useAttack(action) {
    var attackPower;

    if (lastAttack === action.combosFrom) {
        attackPower = strengthScale(action.comboPower);
    } else
        attackPower = strengthScale(action.power);

    lastAttack = action.name;
    return attackPower;
}

// Random number generator with max of n
function rng(n) {
    return Math.pow(Math.random() * n);
}

// Gameplay / DOM

// This variable stores the name of the last used attack
var lastAttack;

// This stores the last amount of damage that the player dealt
var lastDamage;

// Boolean whether it's the player's turn, and if the player chose to defend
var playerTurn = true;
var defending = false;

// Sets the maximum HP based on the playerStats object
var playerHealth = playerStats.maxHealth;

// Sets enemy health to the health of the element on enemyList
var enemyHealth = enemyList[0].health;

// Stores the last amount of damage taken by the player
var damageTaken = 0;

// Which round it is
var turnNumber = 0;

var healCooldown = 0;

// When you press an attack or shield button, attack the monster or defend
function takeTurn(e) {
    if (playerTurn) {
        // If the player chose to defend
        if (e === "defend") {
            defending = true;
            lastAttack = "defending";
            if (healCooldown > 0) {
                healCooldown--;
            }
        }
        // If the player chose to heal
        else if (e === "heal" && healCooldown === 0) {
            playerHealth += 20;
            healCooldown = 3;
            lastAttack = "heal";
        } else {
            lastDamage = useAttack(attackList[e]);
            enemyHealth -= useAttack(attackList[e]);
            if (healCooldown > 0) {
                healCooldown--;
            }
            document.querySelector("#enemy-sprite").style.filter = "brightness(.5)";
        }

        playerTurn = false;

        update("player");
        setTimeout(enemyTurn, 2000);
    }
}

// Enemy takes turn
function enemyTurn() {
    document.querySelector("#enemy-sprite").style.filter = "brightness(1)";

    if (defending) {
        playerHealth -= enemyList[0].enemyAttacks[1] / 2;
        damageTaken = enemyList[0].enemyAttacks[1] / 2;
    } else {
        playerHealth -= enemyList[0].enemyAttacks[1];
        damageTaken = enemyList[0].enemyAttacks[1];
    }

    turnNumber++;
    update();
    defending = false;
    playerTurn = true;
}

// Update function to display the healths
function update(lastTurn) {

    statusUpdate = document.querySelector("#status");
    healButton = document.querySelector("#heal-button");
    kickButton = document.querySelector("#kick-button");

    document.querySelector("#player-health").innerHTML = playerHealth;
    document.querySelector("#enemy-health").innerHTML = enemyHealth;

    if (healCooldown > 0) {
        healButton.innerHTML = healCooldown;
    } else
        healButton.innerHTML = "Heal";

    if (lastTurn === "player") {
        switch (lastAttack) {
            case "defending":
                statusUpdate.innerHTML = "Player defends";
                break;
            case "heal":
                statusUpdate.innerHTML = "Player heals";
                break;
            default:
                statusUpdate.innerHTML = "Player uses " + lastAttack + " for " + lastDamage;
                break;
        }
    } else
        statusUpdate.innerHTML = "Enemy attacks for " + damageTaken;


    if (lastAttack === "punch") {
        kickButton.style.filter = "hue-rotate(250deg)";
    } else {
        kickButton.style.filter = "hue-rotate(0)";
    }

}

update();