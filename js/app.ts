class GameUtilities {
    // This class contains different functions and objects that 
    // are useful for all other objects and the game engine
    points: number;
    difficulty: number;
    objectSprites: {};
    characters: {};
    characterPicked: boolean;

    constructor(points: number, difficulty: number) {
        this.points = points
        this.difficulty = difficulty
        this.objectSprites = {
            selector: 'images/Selector.png',
            keypic: 'images/Key.png',
            gemOrage: 'images/GemOrange.png',
            gemGreen: 'images/GemGreen.png',
            gemBlue: 'images/GemBlue.png'
        }

        this.characters = {
            boy: 'images/char-boy.png',
            catGirl: 'images/char-cat-girl.png',
            hornGirl: 'images/char-horn-girl.png',
            pinkGirl: 'images/char-pink-girl.png',
            selected: 'images/char-boy.png'
        }
        this.characterPicked = false
    };

    randomizeLocation(spawnLocationX: number, spawnLocationY: number) {
        // This funciton randomizes the locaiton of an object its called on
        // spawnLocationX, spawnLocationX are number from 1 to n - blocks in the x or y direction
        // the object will be spawned at the center of one of the block in range
        // the gem and key objects 

        let randX = Math.floor(Math.random() * spawnLocationX) * 101;
        let randY = Math.floor(Math.random() * spawnLocationY) * 85 + 40;
        return [randX, randY]
    };

    arrangeObjectsByY(array) {
        // Arrange GameObjects according to thier Y position to render 
        // objects in the lower blocks after objects in upper block
        // to give the prober depth apprance

        // sorts the All enemies array by y value in enemy objects
        array = array.sort((a, b) => {
            // console.log("sorting: " + a + " " + b)
            if (a.y > b.y) return 1;
            else if (a.y < b.y) return -1;
            else return 0;
        });
    };

};

let gameUtils = new GameUtilities(0, 1);


let genCharacterCardDeck = function () {
    //produce divs for character cards, example given below
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
        };
    };
};


let characterDeck = document.getElementById('character-deck');
if (characterDeck) {
    characterDeck.addEventListener('click', selectCharacter, false);
};


function changeCharCardColor(cardElement){
    // when change the background color of the character that is clicked on
    characterDeck.childNodes.forEach(box => {
        if (cardElement === box) box.style.background = 'yellow';
        else if box.style.background = '#2e3d49'
    });
}


function selectCharacter(event) {
        // Function for selecting characer and animating the yellow 
        // background card for the chosen character

    if (event.target !== event.currentTarget) {
        // Clicking on the imag has no last child as it is the last child
        // This hack extractrs the id attaced to the img that is used as a key for the characters objects

        // cardElement - string, each character sprite has an id, this id is used as a key for the characters objects in gameUtils
        let cardElement = event.target;

        if (event.target.lastChild) {
            gameUtils.characters.selected = gameUtils.characters[event.target.lastChild.id];
        } else {
            gameUtils.characters.selected = gameUtils.characters[event.target.parentElement.lastChild.id];
            cardElement = event.target.parentElement;
        }
        player.sprite = gameUtils.characters.selected;
        gameUtils.characterPicked = true;

        changeCharCardColor(cardElement);
    };
};



let playerInventory = [];
let staticGameObjects = [];
let floatingGameObjects: FloatingObject[] = [];

// Player must first get the key to unlock door to win the game
class GameObject {
    x: number;
    xInit: number;
    y: number;
    yInit: number;
    radius: number
    sprite: string;
    activated: boolean;
    pickedUp: boolean;
    inventoryIndex: number | undefined;
    points: number;


    constructor(x: number, y: number, radius: number, sprite: string, points: number) {
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

    insideRad(){
        // Method to check if player is within certain radius of object
        // if yes, object is added to player inventory set
        return Math.sqrt((player.x - this.x) ** 2 + (player.y - this.y) ** 2) < this.radius;   
    }

    checkPickedUp() {
        // If the items is withing pickup radius for the player AND is not already in the inventory
        
        if (this.insideRad() && !player.inventory.has(this)) {
            player.inventory.add(this);
            this.inventoryIndex = player.inventory.size
        }  
    };

    renderInventory(){
        if (player.inventory.has(this)) {
        // check size of player inventory to move object to bottom of screen without overlap
        this.x = 100 * this.inventoryIndex;
        this.y = 535;    
        } 
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

class FloatingObject extends GameObject {
    yMax: number;
    yMin: number;
    floatDirection: number;

    constructor(x: number, y: number, radius: number, sprite: string, points: number) {
        super(x, y, radius, sprite, points);
        this.xInit = x;
        this.yInit = y;
        this.radius = radius;
        this.yMax = this.y + 5;
        this.yMin = this.y - 5;
        this.floatDirection = 1;
    }

    animateFloat() {
        if (player.inventory.has(this)) {
            // check size of player inventory to move object to bottom of screen without overlap
            this.x = 100 * this.inventoryIndex;
            this.y = 535;    
            }  else {

        
        // Floating objects oscillate between min and max positions
        // This funciton simply takes the range y +/- 5 and moved ojbect.y between those
        // swtiching directions when min or max is reached
        if (this.y > this.yMax) { this.y = this.yMax };
        if (this.y === this.yMax) { this.floatDirection = -0.25 };

        if (this.y < this.yMin) { this.y = this.yMin };
        if (this.y === this.yMin) { this.floatDirection = 0.25 };
        this.y = this.y + this.floatDirection;
        }
    }

    renderInventory(){
        if (player.inventory.has(this)) {
        // check size of player inventory to move object to bottom of screen without overlap
        this.x = 100 * this.inventoryIndex;
        this.y = 535;    
        } 
    }
}

// Winning block which is generated after key is picked up

class WinningBlock extends GameObject {
    // Wimming Block is a static game object upon which the player steps on to win the game
    // It is only active once the player has picked up the key

    constructor(x: number, y: number, radius: number, sprite: string, points: number) {
        super(x, y, radius, sprite, points)
        this.radius = 10;
    };

    checkInventoryForKey() {
        // Player must have picked up the key to be able to 
        // render the Wimmin blcok on the stage
        if (player.inventory.has(winKey)) {
            this.x = 404;
            this.y = 40
            player.hasKey = true;
        }
    };

    checkWin() {
        // If the player is within the bloack AND has the key the game is won
        let insideBlock = Math.sqrt((player.x - this.x) ** 2 + (player.y - this.y) ** 2) < this.radius;
        if (player.hasKey && insideBlock) {
            player.win = true;
            // Game Win Function
        }
    }
};

let winPad = new WinningBlock(1000, 40, 40, gameUtils.objectSprites.selector, 20);
staticGameObjects.push(winPad);


let genFloatingGameObjects = function (
    gameObjectSprite: string, spawnLocationX: number, spawnLocationY: number,
    rad: number, points: number) {
    // Function generates Game objects with random x and y block placements
    // and tries to get them not to overlap

    let [xObj, yObj] = gameUtils.randomizeLocation(spawnLocationX, spawnLocationY);

    // if there is already as object at the same row or in the Winning Blocks column, re randomize
    floatingGameObjects.forEach(alreadyGenObjects => {
        if (yObj === alreadyGenObjects.y || yObj > 350 || xObj > 400) {
            yObj = gameUtils.randomizeLocation(spawnLocationX, spawnLocationY)[1]
        });
    return new FloatingObject(xObj, yObj, rad, gameObjectSprite, points);
};


let winKey = genFloatingGameObjects(gameUtils.objectSprites.keypic, 4, 4, 40, 10);
floatingGameObjects.push(winKey);

let blueGem = genFloatingGameObjects(gameUtils.objectSprites.gemBlue, 3.5, 4.5, 55, 10)
floatingGameObjects.push(blueGem);

let greenGem = genFloatingGameObjects(gameUtils.objectSprites.gemGreen, 5, 4, 55, 10)
floatingGameObjects.push(greenGem);

// genFloatingGameObjects(gameUtils.objectSprites.gemOrage, 5, 4, 50, 10)
gameUtils.arrangeObjectsByY(floatingGameObjects)



// Enemies our player must avoid
class Enemy {
    x: number;
    y: number;
    xInit: number;
    yInit: number;
    dt: number;
    dtInitial: number;
    sprite: string;

    constructor(x: number, y: number, dt: number) {
        this.x = x;
        this.y = y;
        this.xInit = x;
        this.yInit = y;
        this.dt = dt;
        this.dtInitial = dt;
        this.sprite = 'images/enemy-bug.png';
    }

    update() {
        this.checkBoundary()
        this.x = this.x + 1 * this.dt;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    checkBoundary() {
        // If the bug reaches the end of the stage reset its position to off stage to the left
        // If the collision with another bug has changed the bugs speed, reset to dt inital
        if (this.x > 500) {
            genEnemiesProb();
            this.x = -100;
            this.dt = this.dtInitial;
        }
    }
}



class Player {
    x: number;
    y: number;
    xInit: number;
    yInit: number;
    speed: number;
    sprite: string;
    win: boolean;
    hasKey: boolean;
    lives: number;
    totalLives: number;
    health: number;
    isDead: boolean;
    inventory: Set<FloatingObject>;

    constructor(x: number, y: number, speed: number, sprite: string) {
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

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(text_input: string) {
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
    }

    update(xUpdate = 0, yUpdate = 0) {
        // xUpdate and yUpdate to X and Y positions of the player

        if (this.x + xUpdate > 400) {
            this.x = 410;
            xUpdate = 0;
        }

        if (this.x + xUpdate < 0) {
            this.x = 0;
            xUpdate = 0;
        }

        this.x = this.x + xUpdate;
        if (this.y + yUpdate > 399) yUpdate = 0;
        if (this.y + yUpdate < 0) yUpdate = 0;
        this.y = this.y + yUpdate;
    }

    reset(){
        // move the character back to its intial position
        // Unless Dead then he can be moved off screen
        if (player.isDead) {
            
        } else {
            this.x = this.xInit;
            this.y = this.xInit;
        }
        
    }

    addToInvenctory(gameObject: FloatingObject) {
        if (gameObject.pickedUp) {
            this.inventory.add(gameObject);
        };
    };

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


// const player = new Player(200, 395, 30, gameUtils.characters.boy);
const player = new Player(200, 395, 30, gameUtils.characters.boy)

function gameStartGenEnemies(difficulty: number = 1) {
    // Generate Enemies at the start of the game with random speed at all lanes of the game
    for (let index = 0; index < 4; index++) {
        let xInit = index * Math.random() * 400;
        let yInit = index * 80 + 50;
        let speedInit = Math.random() * 4 + difficulty;
        genEnemies(xInit, yInit, speedInit);
        genEnemies(xInit, yInit, speedInit);
    };
};


let allEnemies: Enemy[] = [];

function genEnemies(xInit: number, yInit: number, speedInit: number) {
    // Utility function for creating new enemies
    // Makes new enemy objects and all then to allEnemies array
    let newEnemy = new Enemy(xInit, yInit, speedInit)
    allEnemies.push(newEnemy);
    gameUtils.arrangeObjectsByY(allEnemies)
};

function genEnemiesProb(yLevels: number = 4, speedMax: number = 2, prob: number = 10, maxEnemies: number = 25) {
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
        gameUtils.arrangeObjectsByY(allEnemies)
    };
};



function deleteEnemiesProb(prob: number = 90) {
    // Deletes Bugs as they move off the screen with some probability
    // The larger allEnemies Array becomes, the more likely an enemy will be deleted
    allEnemies.forEach((bug, index) => {
        if (bug.x > 500 && allEnemies.length > 7) {
            let delEnemyProb = Math.floor(Math.random() * 100) > prob - allEnemies.length * 5;
            if (delEnemyProb) {
                allEnemies.splice(index, 1);
                // console.log('deleteing bug')
            }; // if prob delete
        }; // Bug is off screen and more than 7 enemies exist
    });
};


let detectNearbyEnemies = function (enemyArray: Enemy[], yThresholdTop: number, yThresholdBottom: number, xThreshold: number): Enemy[] {
    // Collision detection for the player    
    // Check Enemies nearby in Y axis
    let nearbyEnemies = enemyArray.filter(bug => bug.y > player.y + 5 - yThresholdTop).filter(bug => bug.y < player.y + 5 + yThresholdBottom)
    // Check Enemies nearby in X axis
    nearbyEnemies = nearbyEnemies.filter(bug => bug.x < player.x + xThreshold).filter(bug => bug.x > player.x - xThreshold)
    return nearbyEnemies
}


let collisionDetection = function () {
    // To reduce bumber of checks, first Enemies in larger radius deteched
    // then a subset closer to player as determined as colliding
    let nearbyEnemies = detectNearbyEnemies(allEnemies, 70, 70, 100);
    let collidingEnemies = detectNearbyEnemies(nearbyEnemies, 30, 50, 57);
    // If collision is detected Player health and lives are updated
    if (collidingEnemies.length > 0) updatePlayerHealth();
    
}

let detectOtherBugs = function () {
    // Figure out which bugs have bugs in the same lane
    allEnemies.forEach(thisBug => {
        let bugsFollowingInLane = allEnemies.filter(bug => bug.y === thisBug.y).filter(bug => bug.x < thisBug.x);
        bugsFollowingInLane.forEach(bug => {
            if (bug.x > thisBug.x - 100) {
                bug.dt = thisBug.dt;
                bug.x = thisBug.x - 100;
            }; // If Bug behind is close that THIS bugs position - a buffer of 100 pixels, make its speed the same as thisBugs speed so they dont bump
        });

    });
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
    };

    health.value = player.health;
    if (player.lives === 0) {
        player.isDead = true;
    }
};



const updatePlayerHearts = function () {
    // This function adds 3 hearts div to hud
    // it checks if its there, deletes and regenerarets
    // heart acoording to number lives vs. total lives in player objects

    let hud = document.getElementsByClassName('hud-status').item(0);

    // Each Frame we remove the heart and re add the appropriate amount
    if (document.getElementById('health-heart')) {
        hud.removeChild(hud.lastElementChild);
    }

    // generate fragment with hearts
    let frag = document.createElement('div');
    frag.setAttribute('id', 'health-heart');

    // Interates for over total lives the player started with
    // if current lives is less, empty hearts are appeneded
    let range = [...Array(player.totalLives).keys()];
    range.forEach(index => {
        let heart = document.createElement('i')
        if (index + 1 <= player.lives) {
            heart.classList.add("nes-icon", "heart", "is-medium");
        } else {
            heart.classList.add("nes-icon", "heart", "is-empty");
        }
        frag.appendChild(heart);
    });

    //Append the heart fragment to HUD 
    hud.appendChild(frag);
};


function resetGame() {
    allEnemies = allEnemies.splice(0,10);
    allEnemies.forEach(bug => {
        bug.x = bug.xInit;
        bug.y = bug.yInit;
        bug.dt = bug.dtInitial
    });

    player.x = player.xInit;
    player.y = player.yInit;
    player.lives = player.totalLives;
    player.health = 100;
    player.inventory.clear();
    player.isDead = false;
    player.hasKey = false;
    player.win = false;

    floatingGameObjects.forEach(item => {
        item.x = item.xInit;
        item.y = item.yInit;
    });
}



// gameWinCheck = function(){
//     if (player.win && player.hasKey) {
        
//     }
// }

const gameFinish = function () {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('end-screen').style.display = 'flex';

    if (player.isDead) {
        document.getElementById('end-screen-text').innerText =
            "Your hero has fallen. Prehaps he shall rise again after a good night's rest.";
    } else {
        document.getElementById('end-screen-text').innerText =
            "Your hero is vicotrious. Thou shalt live like a king";
    }
}

function gameWinSequence() {
    // Enemies pause for a second and the end screen comes back up
    allEnemies.forEach(enemy => enemy.dt = 0);
    setTimeout(gameFinish, 2000);
}





let StartGameButton = document.getElementsByClassName('start-button').item(0);
StartGameButton.addEventListener('click', startGame, false);

let playAgainButton = document.getElementById('play-again-button');
playAgainButton.addEventListener('click', playAgain, false);

let ChangeHeroButton = document.getElementById('change-hero-button');
ChangeHeroButton.addEventListener('click', changeHero, false);

function startGame(event) {
    if (gameUtils.characterPicked) {
        document.getElementById('intro-page').style.display = 'none';
        document.getElementById('game-screen').style.display = 'flex';
        document.getElementById('end-screen').style.display = 'none';
    }
};


function playAgain(event) {
    if (gameUtils.characterPicked) {
        document.getElementById('intro-page').style.display = 'none';
        document.getElementById('game-screen').style.display = 'flex';
        document.getElementById('end-screen').style.display = 'none';
    };
    resetGame()
};


function changeHero(event) {
    if (gameUtils.characterPicked) {
        document.getElementById('intro-page').style.display = 'none';
        document.getElementById('game-screen').style.display = 'flex';
        document.getElementById('end-screen').style.display = 'none';
    };
};


