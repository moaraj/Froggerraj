"use strict";
class GameUtilities {
    constructor(points, difficulty) {
        this.points = points;
        this.difficulty = difficulty;
        this.objectLocations = {
            selector: 'images/Selector.png',
            keypic: 'images/Key.png',
            gemOrage: 'images/GemOrange.png',
            gemGreen: 'images/GemGreen.png',
            gemBlue: 'images/GemBlue.png'
        };
        this.characters = {
            boy: 'images/char-boy.png',
            catGirl: 'images/char-cat-girl.png',
            hornGirl: 'images/char-horn-girl.png',
            pinkGirl: 'images/char-pink-girl.png',
            selected: 'images/char-boy.png'
        };
    }
    ;
}
;
let gameUtils = new GameUtilities(0, 1);
// Player must first get the key to unlock door to win the game
class GameObject {
    constructor(x, y, radius, sprite, points) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.sprite = sprite;
        this.pickedUp = false;
        this.activated = true;
        this.points = points;
    }
    randomizeLocation(spawnLocationX, spawnLocationY) {
        this.x = Math.floor(Math.random() * spawnLocationX) * 101;
        this.y = Math.floor(Math.random() * spawnLocationY) * 85 + 40;
    }
    checkPickedUp() {
        let InsideRad = Math.sqrt(Math.pow((player.x - this.x), 2) + Math.pow((player.y - this.y), 2)) < this.radius;
        if (InsideRad) {
            this.pickedUp = true;
        }
        ;
    }
    ;
    moveToInvetory(n) {
        this.x = 100 * n;
        this.y = 535;
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}
class FloatingObject extends GameObject {
    constructor(x, y, radius, sprite, points) {
        super(x, y, radius, sprite, points);
        this.radius = radius;
        this.yMax = this.y + 5;
        this.yMin = this.y - 5;
        this.floatDirection = 1;
    }
    animateFloat() {
        if (this.y > this.yMax) {
            this.y = this.yMax;
        }
        ;
        if (this.y === this.yMax) {
            this.floatDirection = -0.25;
        }
        ;
        if (this.y < this.yMin) {
            this.y = this.yMin;
        }
        ;
        if (this.y === this.yMin) {
            this.floatDirection = 0.25;
        }
        ;
        this.y = this.y + this.floatDirection;
    }
}
let staticGameObjects = [];
let floatingGameObjects = [];
// let winKey = new FloatingObject(104,120,40,'images/Key.png');
let winKey = new FloatingObject(104, 380, 40, gameUtils.objectLocations.keypic, 10);
floatingGameObjects.push(winKey);
let blueGem = new FloatingObject(204, 280, 40, gameUtils.objectLocations.gemBlue, 10);
floatingGameObjects.push(blueGem);
let winPad = new GameObject(404, 40, 40, gameUtils.objectLocations.selector, 10);
staticGameObjects.push(winPad);
let playerInventory = [];
// if(winKey.pickedUp = false ){
//     winPad.activated = false;
// } else {winKey.activated = true;}
// Enemies our player must avoid
class Enemy {
    constructor(x, y, dt) {
        this.x = x;
        this.y = y;
        this.dt = dt;
        this.dtInitial = dt;
        this.sprite = 'images/enemy-bug.png';
    }
    update() {
        this.checkBoundary();
        this.x = this.x + 1 * this.dt;
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    checkBoundary() {
        if (this.x > 500) {
            genEnemiesProb();
            this.x = -100;
            this.dt = this.dtInitial;
        }
    }
}
class Player {
    constructor(x, y, speed, sprite) {
        this.x = x;
        this.y = y;
        this.xInit = x;
        this.yInit = y;
        this.speed = speed;
        this.win = false;
        this.sprite = sprite;
        this.lives = 3;
        this.totalLives = 3;
        this.health = 100;
        this.inventory = new Set;
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    handleInput(text_input) {
        if (text_input == 'up') {
            this.update(0, -1 * this.speed);
        }
        ;
        if (text_input == 'down') {
            this.update(0, 1 * this.speed);
        }
        ;
        if (text_input == 'left') {
            this.update(-1 * this.speed, 0);
        }
        ;
        if (text_input == 'right') {
            this.update(1 * this.speed, 0);
        }
        ;
    }
    update(xUpdate = 0, yUpdate = 0) {
        if (this.x + xUpdate > 400) {
            this.x = 410;
            xUpdate = 0;
        }
        if (this.x + xUpdate < 0) {
            this.x = 0;
            xUpdate = 0;
        }
        this.x = this.x + xUpdate;
        if (this.y + yUpdate > 399)
            yUpdate = 0;
        if (this.y + yUpdate < 0)
            yUpdate = 0;
        this.y = this.y + yUpdate;
    }
    restart(status) {
        if (this.win === false) {
            let status = {
                win: true,
                startX: 200,
                startY: 295
            };
        }
        ;
    }
    ;
    addToInvenctory(gameObject) {
        if (gameObject.pickedUp) {
            this.inventory.add(gameObject);
        }
        ;
    }
    ;
}
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
let keyboardInput = (function () {
    document.addEventListener('keyup', function (e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        player.handleInput(allowedKeys[e.keyCode]);
    });
})();
const player = new Player(200, 395, 30, 'images/char-boy.png');
let genCharacterCardDeck = function () {
    //produce divs for carad careds, example given below
    // <div class="character-card"><img id="boy" src="./images/char-boy.png"></div>
    let characterCardDeck = document.getElementById('character-deck');
    for (const key in gameUtils.characters) {
        if (key !== 'selected') {
            const characterCardDiv = document.createElement('div');
            characterCardDiv.classList.add('character-card');
            const characterImage = document.createElement('img');
            characterImage.setAttribute('id', key);
            characterImage.setAttribute('src', gameUtils.characters[key]);
            characterCardDiv.appendChild(characterImage);
            characterCardDeck.appendChild(characterCardDiv);
        }
        ;
    }
    ;
};
let characterDeck = document.getElementById('character-deck');
if (characterDeck) {
    characterDeck.addEventListener('click', selectCharacter, false);
}
function selectCharacter(event) {
    if (event.target !== event.currentTarget) {
        // Clicking on the imag has no last child as it is the last child
        // This hack extractrs the id attaced to the img that is used as a key for the characters objects
        if (event.target.lastChild) {
            gameUtils.characters.selected = gameUtils.characters[event.target.lastChild.id];
        }
        else {
            gameUtils.characters.selected = gameUtils.characters[event.target.parentElement.lastChild.id];
        }
        player.sprite = gameUtils.characters.selected;
    }
}
function gameStartGenEnemies(difficulty = 1) {
    // Generate Enemies at the start of the game with random speed at all lanes of the game
    for (let index = 0; index < 4; index++) {
        let xInit = index * Math.random() * 400;
        let yInit = index * 80 + 50;
        let speedInit = Math.random() * 4 + difficulty;
        genEnemies(xInit, yInit, speedInit);
        genEnemies(xInit, yInit, speedInit);
    }
    ;
}
;
let allEnemies = [];
function arrangeEnemiesByY() {
    // Arrange Bugs according to thier Y position to render properly
    // Simply sorts the All enemies array by y value in enemy objects
    allEnemies = allEnemies.sort((a, b) => {
        // console.log("sorting: " + a + " " + b)
        if (a.y > b.y)
            return 1;
        else if (a.y < b.y)
            return -1;
        else
            return 0;
    });
}
;
function genEnemies(xInit, yInit, speedInit) {
    // Utility function for creating new enemies
    // Makes new enemy objects and all then to allEnemies array
    let newEnemy = new Enemy(xInit, yInit, speedInit);
    allEnemies.push(newEnemy);
    arrangeEnemiesByY();
}
;
function genEnemiesProb(yLevels = 4, speedMax = 2, prob = 10, maxEnemies = 25) {
    // Generates Enemies with some probablility
    // The larger allEnemies Array, The more enemies on screen becomes, the less likely an new enemy will spawn
    let genEnemyProb = Math.floor(Math.random() * 100) > prob + allEnemies.length;
    // console.log(prob + allEnemies.length * 2)
    if (genEnemyProb && allEnemies.length < maxEnemies) {
        // console.log('bug generated');
        let yInitEnemy = Math.floor(Math.random() * yLevels * 2) * 40 + 50;
        let speedInitEnemy = Math.random() * speedMax + 1;
        let newEnemy = new Enemy(-100, yInitEnemy, speedInitEnemy);
        allEnemies.push(newEnemy);
        arrangeEnemiesByY();
    }
    ;
}
;
function deleteEnemiesProb(prob = 90) {
    // Deletes Bugs as they move off the screen with some probability
    // The larger allEnemies Array becomes, the more likely an enemy will be deleted
    allEnemies.forEach((bug, index) => {
        if (bug.x > 500 && allEnemies.length > 7) {
            let delEnemyProb = Math.floor(Math.random() * 100) > prob - allEnemies.length * 5;
            if (delEnemyProb) {
                allEnemies.splice(index, 1);
                // console.log('deleteing bug')
            }
            ; // if prob delete
        }
        ; // Bug is off screen and more than 7 enemies exist
    });
}
;
let detectNearbyEnemies = function (enemyArray, yThresholdTop, yThresholdBottom, xThreshold) {
    // Collision detection for the player    
    // Check Enemies nearby in Y axis
    let nearbyEnemies = enemyArray.filter(bug => bug.y > player.y + 5 - yThresholdTop).filter(bug => bug.y < player.y + 5 + yThresholdBottom);
    // Check Enemies nearby in X axis
    nearbyEnemies = nearbyEnemies.filter(bug => bug.x < player.x + xThreshold).filter(bug => bug.x > player.x - xThreshold);
    return nearbyEnemies;
};
let collisionDetection = function () {
    // To reduce bumber of checks, first Enemies in larger radius deteched
    // then a subset closer to player as determined as colliding
    let nearbyEnemies = detectNearbyEnemies(allEnemies, 50, 50, 100);
    let collidingEnemies = detectNearbyEnemies(nearbyEnemies, 30, 50, 57);
    // If collision is detected Player health and lives are updated
    if (collidingEnemies.length > 0)
        updatePlayerHealth();
};
const updatePlayerHealth = function () {
    // If Collision is deteched player health is reduced
    let health = document.getElementById("health");
    player.health -= 10;
    // If player health is reduced to 0, 1 life is reduced
    if (player.health <= 0) {
        player.x = player.xInit;
        player.y = player.yInit;
        player.health += 100;
        player.lives -= 1;
        updatePlayerHearts();
    }
    ;
    health.value = player.health;
};
const updatePlayerHearts = function () {
    // This function adds 3 hearts div to hud
    // it checks if its there, deletes and regenerarets
    // heart acoording to number lives vs. total lives in player objects
    let hud = document.getElementsByClassName('hud-status').item(0);
    if (document.getElementById('health-heart')) {
        hud.removeChild(hud.lastElementChild);
    }
    let frag = document.createElement('div');
    frag.setAttribute('id', 'health-heart');
    let range = [...Array(player.totalLives).keys()];
    range.forEach(index => {
        let heart = document.createElement('i');
        if (index + 1 <= player.lives) {
            heart.classList.add("nes-icon", "heart", "is-medium");
        }
        else {
            heart.classList.add("nes-icon", "heart", "is-empty");
        }
        frag.appendChild(heart);
    });
    hud.appendChild(frag);
};
let detectOtherBugs = function () {
    // Figure out which bugs have bugs in the same lane
    allEnemies.forEach(thisBug => {
        let bugsFollowingInLane = allEnemies.filter(bug => bug.y === thisBug.y).filter(bug => bug.x < thisBug.x);
        bugsFollowingInLane.forEach(bug => {
            if (bug.x > thisBug.x - 100) {
                bug.dt = thisBug.dt;
                bug.x = thisBug.x - 100;
            }
            ; // If Bug behind is close that THIS bugs position - a buffer of 70 pixels, make its speed the same as thisBugs speed so they dont bump
        });
    });
};
