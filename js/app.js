var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameUtilities = /** @class */ (function () {
    function GameUtilities(points, difficulty) {
        this.points = points;
        this.difficulty = difficulty;
        this.objectSprites = {
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
        this.characterPicked = false;
    }
    ;
    GameUtilities.prototype.randomizeLocation = function (spawnLocationX, spawnLocationY) {
        // This funciton randomizes the locaiton of an object its called on
        // spawnLocationX, spawnLocationX are number from 1 to n - blocks in the x or y direction
        // the object will be spawned at the center of one of the block in range
        // the gem and key objects 
        var randX = Math.floor(Math.random() * spawnLocationX) * 101;
        var randY = Math.floor(Math.random() * spawnLocationY) * 85 + 40;
        return [randX, randY];
    };
    ;
    GameUtilities.prototype.arrangeObjectsByY = function (array) {
        // Arrange GameObjects according to thier Y position to render 
        // objects in the lower blocks after objects in upper block
        // to give the prober depth apprance
        // sorts the All enemies array by y value in enemy objects
        array = array.sort(function (a, b) {
            // console.log("sorting: " + a + " " + b)
            if (a.y > b.y)
                return 1;
            else if (a.y < b.y)
                return -1;
            else
                return 0;
        });
    };
    ;
    return GameUtilities;
}());
;
var gameUtils = new GameUtilities(0, 1);
var genCharacterCardDeck = function () {
    //produce divs for character cards, example given below
    // <div class="character-card"><img id="boy" src="./images/char-boy.png"></div>
    var characterCardDeck = document.getElementById('character-deck');
    for (var key in gameUtils.characters) {
        if (key !== 'selected') {
            var characterCardDiv = document.createElement('div');
            characterCardDiv.classList.add('character-card');
            var characterImage = document.createElement('img');
            characterImage.setAttribute('id', key);
            characterImage.setAttribute('src', gameUtils.characters[key]);
            characterCardDiv.appendChild(characterImage);
            characterCardDeck.appendChild(characterCardDiv);
        }
        ;
    }
    ;
};
var characterDeck = document.getElementById('character-deck');
if (characterDeck) {
    characterDeck.addEventListener('click', selectCharacter, false);
}
;
function changeCharCardColor(cardElement) {
    // when change the background color of the character that is clicked on
    characterDeck.childNodes.forEach(function (box) {
        if (cardElement === box)
            box.style.background = 'yellow';
        else if (box.style.background = '#2e3d49')
            ;
    });
}
function selectCharacter(event) {
    // Function for selecting characer and animating the yellow 
    // background card for the chosen character
    if (event.target !== event.currentTarget) {
        // Clicking on the imag has no last child as it is the last child
        // This hack extractrs the id attaced to the img that is used as a key for the characters objects
        // cardElement - string, each character sprite has an id, this id is used as a key for the characters objects in gameUtils
        var cardElement = event.target;
        if (event.target.lastChild) {
            gameUtils.characters.selected = gameUtils.characters[event.target.lastChild.id];
        }
        else {
            gameUtils.characters.selected = gameUtils.characters[event.target.parentElement.lastChild.id];
            cardElement = event.target.parentElement;
        }
        player.sprite = gameUtils.characters.selected;
        gameUtils.characterPicked = true;
        changeCharCardColor(cardElement);
    }
    ;
}
;
var playerInventory = [];
var staticGameObjects = [];
var floatingGameObjects = [];
// Player must first get the key to unlock door to win the game
var GameObject = /** @class */ (function () {
    function GameObject(name, x, y, radius, sprite, points) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.xInit = x;
        this.yInit = y;
        this.radius = radius;
        this.sprite = sprite;
        this.pickedUp = false;
        this.activated = true;
        this.points = points;
        this.inventoryIndex = undefined;
    }
    GameObject.prototype.insideRad = function () {
        // Method to check if player is within certain radius of object
        // if yes, object is added to player inventory set
        return Math.sqrt(Math.pow((player.x - this.x), 2) + Math.pow((player.y - this.y), 2)) < this.radius;
    };
    GameObject.prototype.checkPickedUp = function () {
        // If the items is withing pickup radius for the player AND is not already in the inventory
        if (this.insideRad() && !player.inventory.has(this)) {
            player.inventory.add(this);
            this.inventoryIndex = player.inventory.size;
        }
    };
    ;
    GameObject.prototype.renderInventory = function () {
        if (player.inventory.has(this)) {
            // check size of player inventory to move object to bottom of screen without overlap
            this.x = 100 * this.inventoryIndex;
            this.y = 535;
        }
    };
    GameObject.prototype.render = function () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    GameObject.prototype.reset = function () {
        // Move objects have to thier initalzation positions
        this.x = this.xInit;
        this.y = this.yInit;
    };
    return GameObject;
}());
;
var FloatingObject = /** @class */ (function (_super) {
    __extends(FloatingObject, _super);
    function FloatingObject(name, x, y, radius, sprite, points) {
        var _this = _super.call(this, name, x, y, radius, sprite, points) || this;
        _this.xInit = x;
        _this.yInit = y;
        _this.radius = radius;
        _this.yMax = _this.y + 5;
        _this.yMin = _this.y - 5;
        _this.floatDirection = 1;
        return _this;
    }
    FloatingObject.prototype.animateFloat = function () {
        if (player.inventory.has(this)) {
            // check size of player inventory to move object to bottom of screen without overlap
            this.x = 100 * this.inventoryIndex;
            this.y = 535;
        }
        else {
            // Floating objects oscillate between min and max positions
            // This funciton simply takes the range y +/- 5 and moved ojbect.y between those
            // swtiching directions when min or max is reached
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
    };
    FloatingObject.prototype.renderInventory = function () {
        if (player.inventory.has(this)) {
            // check size of player inventory to move object to bottom of screen without overlap
            this.x = 100 * this.inventoryIndex;
            this.y = 535;
        }
    };
    return FloatingObject;
}(GameObject));
// Winning block which is generated after key is picked up
var WinningBlock = /** @class */ (function (_super) {
    __extends(WinningBlock, _super);
    // Wimming Block is a static game object upon which the player steps on to win the game
    // It is only active once the player has picked up the key
    function WinningBlock(name, x, y, radius, sprite, points) {
        return _super.call(this, name, x, y, radius, sprite, points) || this;
    }
    ;
    WinningBlock.prototype.checkPlayerInsideWinBlock = function () {
        // If the player is within the bloack AND has the key the game is won
        var insideBlock = Math.sqrt(Math.pow((player.x - this.x), 2) + Math.pow((player.y - this.y), 2)) <= this.radius;
        return insideBlock;
    };
    WinningBlock.prototype.checkPlayerHasKey = function () {
        if (player.hasKey) {
            this.x = 404;
        }
        else {
            this.x = this.xInit;
        }
        ;
    };
    return WinningBlock;
}(GameObject));
;
var winPad = new WinningBlock('winningBlock', 1000, 40, 20, gameUtils.objectSprites.selector, 20);
// let winPad = new WinningBlock('winningBlock',1000, 40, 40, gameUtils.objectSprites.selector, 20);
staticGameObjects.push(winPad);
function getObjectCoords(objectQuery) {
    // This function goes through the floating items array
    // and find the coordinates for the key so that gems
    // are not rendered in the same place
    var keyX = undefined;
    var keyY = undefined;
    floatingGameObjects.forEach(function (item) {
        if (item.name === objectQuery) {
            keyX = item.x;
            keyY = item.y;
        }
    });
    return [keyX, keyY];
}
var genFloatingGameObjects = function (name, gameObjectSprite, spawnLocationX, spawnLocationY, rad, points) {
    // Function generates Game objects with random x and y block placements
    // and tries to get them not to overlap
    var _a = gameUtils.randomizeLocation(spawnLocationX, spawnLocationY), xObj = _a[0], yObj = _a[1];
    var _b = getObjectCoords('key'), keyX = _b[0], keyY = _b[1];
    // if there is already as object at the same row or in the Winning Blocks column, re randomize
    floatingGameObjects.forEach(function (alreadyGenObjects) {
        if (xObj === alreadyGenObjects.x && yObj === alreadyGenObjects.y || yObj > 350 || xObj > 400) {
            yObj = gameUtils.randomizeLocation(spawnLocationX, spawnLocationY)[1];
        }
    });
    return new FloatingObject(name, xObj, yObj, rad, gameObjectSprite, points);
};
var genGameObjects = function () {
    // Clear the Floating Objects array and pl;ayer inventory
    //and generate new key and gem instances in random locations
    floatingGameObjects = [];
    var winKey = genFloatingGameObjects('key', gameUtils.objectSprites.keypic, 4, 4, 40, 10);
    floatingGameObjects.push(winKey);
    var blueGem = genFloatingGameObjects('blueGem', gameUtils.objectSprites.gemBlue, 3.5, 4.5, 55, 10);
    floatingGameObjects.push(blueGem);
    var greenGem = genFloatingGameObjects('greenGem', gameUtils.objectSprites.gemGreen, 5, 4, 55, 10);
    floatingGameObjects.push(greenGem);
    // genFloatingGameObjects(gameUtils.objectSprites.gemOrage, 5, 4, 50, 10)
    gameUtils.arrangeObjectsByY(floatingGameObjects);
};
// Enemies our player must avoid
var Enemy = /** @class */ (function () {
    function Enemy(x, y, dt) {
        this.x = x;
        this.y = y;
        this.xInit = x;
        this.yInit = y;
        this.dt = dt;
        this.dtInitial = dt;
        this.sprite = 'images/enemy-bug.png';
    }
    Enemy.prototype.update = function () {
        this.checkBoundary();
        this.x = this.x + 1 * this.dt;
    };
    Enemy.prototype.render = function () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    Enemy.prototype.checkBoundary = function () {
        // If the bug reaches the end of the stage reset its position to off stage to the left
        // If the collision with another bug has changed the bugs speed, reset to dt inital
        if (this.x > 500) {
            genEnemiesProb();
            this.x = -100;
            this.dt = this.dtInitial;
        }
    };
    return Enemy;
}());
var Player = /** @class */ (function () {
    function Player(x, y, speed, sprite) {
        this.x = x;
        this.y = y;
        this.xInit = x;
        this.yInit = y;
        this.speed = speed;
        this.sprite = sprite;
        this.win = false;
        this.hasKey = false;
        this.lives = 3;
        this.totalLives = 3;
        this.health = 100;
        this.inventory = new Set;
        this.isDead = false;
    }
    Player.prototype.render = function () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    Player.prototype.handleInput = function (text_input) {
        // Take key board inputs and translate them into 
        // X and Y movements in the characters
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
    };
    Player.prototype.update = function (xUpdate, yUpdate) {
        // xUpdate and yUpdate to X and Y positions of the player
        if (xUpdate === void 0) { xUpdate = 0; }
        if (yUpdate === void 0) { yUpdate = 0; }
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
    };
    Player.prototype.reset = function () {
        // move the character back to its intial position
        // Unless Dead then he can be moved off screen
        if (player.isDead) {
        }
        else {
            this.x = this.xInit;
            this.y = this.xInit;
        }
    };
    Player.prototype.addToInvenctory = function (gameObject) {
        if (gameObject.pickedUp) {
            this.inventory.add(gameObject);
        }
        ;
    };
    ;
    Player.prototype.checkHasKey = function () {
        var _this = this;
        this.inventory.forEach(function (item) {
            if (item.name === 'key') {
                _this.hasKey = true;
            }
        });
    };
    ;
    return Player;
}());
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
var keyboardInput = (function () {
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
// const player = new Player(200, 395, 30, gameUtils.characters.boy);
var player = new Player(200, 395, 30, gameUtils.characters.boy);
function gameStartGenEnemies(difficulty) {
    if (difficulty === void 0) { difficulty = 1; }
    // Generate Enemies at the start of the game with random speed at all lanes of the game
    for (var index = 0; index < 4; index++) {
        var xInit = index * Math.random() * 400;
        var yInit = index * 80 + 50;
        var speedInit = Math.random() * 4 + difficulty;
        genEnemies(xInit, yInit, speedInit);
        genEnemies(xInit, yInit, speedInit);
    }
    ;
}
;
var allEnemies = [];
function genEnemies(xInit, yInit, speedInit) {
    // Utility function for creating new enemies
    // Makes new enemy objects and all then to allEnemies array
    var newEnemy = new Enemy(xInit, yInit, speedInit);
    allEnemies.push(newEnemy);
    gameUtils.arrangeObjectsByY(allEnemies);
}
;
function genEnemiesProb(yLevels, speedMax, prob, maxEnemies) {
    if (yLevels === void 0) { yLevels = 4; }
    if (speedMax === void 0) { speedMax = 2; }
    if (prob === void 0) { prob = 10; }
    if (maxEnemies === void 0) { maxEnemies = 25; }
    // Generates Enemies with some probablility
    // The larger allEnemies Array, The more enemies on screen becomes, the less likely an new enemy will spawn
    var genEnemyProb = Math.floor(Math.random() * 100) > prob + allEnemies.length;
    // console.log(prob + allEnemies.length * 2)
    if (genEnemyProb && allEnemies.length < maxEnemies) {
        // console.log('bug generated');
        var yInitEnemy = Math.floor(Math.random() * yLevels * 2) * 40 + 50;
        var speedInitEnemy = Math.random() * speedMax + 1;
        var newEnemy = new Enemy(-100, yInitEnemy, speedInitEnemy);
        allEnemies.push(newEnemy);
        gameUtils.arrangeObjectsByY(allEnemies);
    }
    ;
}
;
function deleteEnemiesProb(prob) {
    if (prob === void 0) { prob = 90; }
    // Deletes Bugs as they move off the screen with some probability
    // The larger allEnemies Array becomes, the more likely an enemy will be deleted
    allEnemies.forEach(function (bug, index) {
        if (bug.x > 500 && allEnemies.length > 7) {
            var delEnemyProb = Math.floor(Math.random() * 100) > prob - allEnemies.length * 5;
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
var detectNearbyEnemies = function (enemyArray, yThresholdTop, yThresholdBottom, xThreshold) {
    // Collision detection for the player    
    // Check Enemies nearby in Y axis
    var nearbyEnemies = enemyArray.filter(function (bug) { return bug.y > player.y + 5 - yThresholdTop; }).filter(function (bug) { return bug.y < player.y + 5 + yThresholdBottom; });
    // Check Enemies nearby in X axis
    nearbyEnemies = nearbyEnemies.filter(function (bug) { return bug.x < player.x + xThreshold; }).filter(function (bug) { return bug.x > player.x - xThreshold; });
    return nearbyEnemies;
};
var collisionDetection = function () {
    // To reduce bumber of checks, first Enemies in larger radius deteched
    // then a subset closer to player as determined as colliding
    var nearbyEnemies = detectNearbyEnemies(allEnemies, 70, 70, 100);
    var collidingEnemies = detectNearbyEnemies(nearbyEnemies, 30, 50, 57);
    // If collision is detected Player health and lives are updated
    if (collidingEnemies.length > 0)
        updatePlayerHealth();
};
var detectOtherBugs = function () {
    // Figure out which bugs have bugs in the same lane
    allEnemies.forEach(function (thisBug) {
        var bugsFollowingInLane = allEnemies.filter(function (bug) { return bug.y === thisBug.y; }).filter(function (bug) { return bug.x < thisBug.x; });
        bugsFollowingInLane.forEach(function (bug) {
            if (bug.x > thisBug.x - 100) {
                bug.dt = thisBug.dt;
                bug.x = thisBug.x - 100;
            }
            ; // If Bug behind is close that THIS bugs position - a buffer of 100 pixels, make its speed the same as thisBugs speed so they dont bump
        });
    });
};
var updatePlayerHealth = function () {
    // If Collision is deteched player health is reduced
    var health = document.getElementById("health");
    player.health -= 10;
    // If player health is reduced to 0, 1 life is reduced
    if (player.health <= 0) {
        player.x = player.xInit;
        player.y = player.yInit;
        player.health += 100;
        player.lives -= 1;
    }
    ;
    health.value = player.health;
    if (player.lives === 0) {
        player.isDead = true;
    }
};
var updatePlayerHearts = function () {
    // This function adds 3 hearts div to hud
    // it checks if its there, deletes and regenerarets
    // heart acoording to number lives vs. total lives in player objects
    var hud = document.getElementsByClassName('hud-status').item(0);
    // Each Frame we remove the heart and re add the appropriate amount
    if (document.getElementById('health-heart')) {
        hud.removeChild(hud.lastElementChild);
    }
    // generate fragment with hearts
    var frag = document.createElement('div');
    frag.setAttribute('id', 'health-heart');
    // Interates for over total lives the player started with
    // if current lives is less, empty hearts are appeneded
    var range = Array(player.totalLives).keys().slice();
    range.forEach(function (index) {
        var heart = document.createElement('i');
        if (index + 1 <= player.lives) {
            heart.classList.add("nes-icon", "heart", "is-medium");
        }
        else {
            heart.classList.add("nes-icon", "heart", "is-empty");
        }
        frag.appendChild(heart);
    });
    //Append the heart fragment to HUD 
    hud.appendChild(frag);
};
function checkGameWin() {
    if (winPad.checkPlayerInsideWinBlock() && player.hasKey) {
        player.win = true;
    }
    ;
}
;
var checkGameFinish = function () {
    checkGameWin();
    if (player.isDead) {
        document.getElementById('end-screen-text').innerText =
            "Your hero has fallen. Prehaps he shall rise again after a good night's rest.";
        gameWinSequence();
    }
    else if (player.win) {
        document.getElementById('end-screen-text').innerText =
            "Your hero is vicotrious. Thou shalt live like a king";
        gameWinSequence();
    }
};
function gameWinSequence(funcPassed) {
    // Enemies pause for a second and the end screen comes back up
    allEnemies.forEach(function (enemy) { return enemy.dt = 0; });
    setTimeout(function () {
        goToEndPage();
        resetGame();
    }, 2000);
}
;
function resetGame() {
    // Reset allEnemies array, player properties and item locations
    allEnemies = allEnemies.splice(0, 10);
    allEnemies.forEach(function (bug) {
        bug.x = bug.xInit;
        bug.y = bug.yInit;
        bug.dt = bug.dtInitial;
    });
    player.x = player.xInit;
    player.y = player.yInit;
    player.lives = player.totalLives;
    player.health = 100;
    player.inventory.clear();
    player.isDead = false;
    player.hasKey = false;
    player.win = false;
    genGameObjects();
}
// Navigation Between Pages
function goToGamePage(event) {
    if (gameUtils.characterPicked) {
        document.getElementById('intro-page').style.display = 'none';
        document.getElementById('game-screen').style.display = 'flex';
        document.getElementById('end-screen').style.display = 'none';
    }
}
;
function gotoIntroPage(event) {
    if (gameUtils.characterPicked) {
        document.getElementById('intro-page').style.display = 'flex';
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('end-screen').style.display = 'none';
    }
    ;
}
;
function goToEndPage(event) {
    if (gameUtils.characterPicked) {
        document.getElementById('intro-page').style.display = 'none';
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('end-screen').style.display = 'flex';
    }
    ;
}
;
var StartGameButton = document.getElementById('start-button');
StartGameButton.addEventListener('click', goToGamePage, false);
var playAgainButton = document.getElementById('play-again-button');
playAgainButton.addEventListener('click', goToGamePage, false);
var ChangeHeroButton = document.getElementById('change-hero-button');
ChangeHeroButton.addEventListener('click', gotoIntroPage, false);
