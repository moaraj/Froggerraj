// Enemies our player must avoid
class Enemy {
    x: number;
    y: number;
    dt: number;
    dtInitial: number;
    sprite: string;

    constructor(x:number, y:number, dt:number) {
        this.x = x;
        this.y = y;
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
    lives: number;
    totalLives: number;
    health: number

    constructor(x: number, y: number, speed: number, sprite: string) {
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
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }

    handleInput(text_input: string) {
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
        if (this.y + yUpdate > 399) yUpdate = 0;
        if (this.y + yUpdate < 0) yUpdate = 0;
        this.y = this.y + yUpdate;
    }

    restart(status: any){
        if(this.win === false){
            let status = {
            win: true,
                startX: 200,
                startY: 295
            }
        }
    }
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
let keyboardInput = (function(){
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        player.handleInput(allowedKeys[e.keyCode]);
    });
})();



const player = new Player(200,395,30, 'images/char-boy.png');


let characters = {
    boy:'images/char-boy.png',
    catGirl: 'images/char-cat-girl.png',
    hornGirl: 'images/char-horn-girl.png',
    pinkGirl: 'images/char-pink-girl.png',
    selected: 'images/char-boy.png'
}

let characterDeck = document.getElementById('character-deck');
if (characterDeck) {
    characterDeck.addEventListener('click', selectCharacter, false);        
}


function selectCharacter(event) {
    if (event.target !== event.currentTarget) {
        if (event.target.lastChild) {
        characters.selected = characters[event.target.lastChild.id] ;
        } else {
        // console.log(event.target.parentElement.lastChild.id)
        characters.selected = characters[event.target.parentElement.lastChild.id];
        }

        player.sprite = characters.selected;
    }
}


class GameOptions {
    difficulty: string
    character: string
    score:number
    
    constructor(difficulty: string, character: string, score: number){
        this.character = character;
        this.difficulty = difficulty;
        this.score = score;
    };
}

function gameStartGenEnemies(difficulty:number = 1){
    for (let index = 0; index < 4; index++) {
        let xInit = index * Math.random() * 400;
        let yInit = index * 80 + 50;
        let speedInit = Math.random() * 4 + difficulty;
        genEnemies(xInit, yInit, speedInit);
        genEnemies(xInit, yInit, speedInit);
    };
};


let allEnemies: Enemy[] = [];

function arrangeEnemiesByY(){
    // Arrange Bugs according to thier Y position to render properly
    allEnemies = allEnemies.sort( (a,b) => {
        // console.log("sorting: " + a + " " + b)
        if(a.y > b.y) return 1;
        else if(a.y < b.y) return -1;
        else return 0;
    });
};


function genEnemies(xInit:number, yInit:number, speedInit:number){
    let newEnemy = new Enemy(xInit, yInit, speedInit)
    allEnemies.push(newEnemy);
    arrangeEnemiesByY();
};

function genEnemiesProb(yLevels:number = 4, speedMax:number = 2, prob:number = 10, maxEnemies: number = 25){  
    // The larger allEnemies Array becomes, the less likely an new enemy will spawn
    let genEnemyProb = Math.floor(Math.random() * 100) > prob + allEnemies.length;
    // console.log(prob + allEnemies.length * 2)
    if(genEnemyProb && allEnemies.length < maxEnemies){
        // console.log('bug generated');
        let yInitEnemy = Math.floor(Math.random() * yLevels * 2) * 40 + 50;
        let speedInitEnemy = Math.random() * speedMax + 1;
        let newEnemy = new Enemy(-100, yInitEnemy, speedInitEnemy);
        allEnemies.push(newEnemy);
        arrangeEnemiesByY();
    };
};



function deleteEnemiesProb(prob:number = 90){
    // The larger allEnemies Array becomes, the more likely an enemy will be deleted
    allEnemies.forEach((bug, index) => {
        if(bug.x > 500 && allEnemies.length > 7){
            let delEnemyProb = Math.floor(Math.random() * 100) > prob - allEnemies.length * 5;
            if(delEnemyProb){
                allEnemies.splice(index, 1);
                // console.log('deleteing bug')
            }; // if prob delete
        }; // Bug is off screen and more than 7 enemies exist
    });
};


let detectNearbyEnemies = function(enemyArray:Enemy[], yThresholdTop:number, yThresholdBottom:number, xThreshold:number):Enemy[]{
        // Check Enemies nearby in Y axis
        let nearbyEnemies = enemyArray.filter(bug => bug.y > player.y + 5 - yThresholdTop).filter(bug => bug.y < player.y + 5 + yThresholdBottom)
        // Check Enemies nearby in X axis
        nearbyEnemies = nearbyEnemies.filter(bug => bug.x < player.x + xThreshold).filter(bug => bug.x > player.x - xThreshold)
        return nearbyEnemies
}

let collisionDetection = function(){
    let nearbyEnemies = detectNearbyEnemies(allEnemies,50,50,100);
    let collidingEnemies = detectNearbyEnemies(nearbyEnemies,30,50,57);

    if (collidingEnemies.length > 0) updatePlayerHealth();
}

const updatePlayerHealth = function(){
    // If Collision is deteched player health is reduced
    let health = document.getElementById("health");
    player.health -= 3;
    // If player health is reduced to 0, 1 life is reduced
    if (player.health <= 0) {
        player.x = player.xInit;
        player.y = player.yInit;
        player.health += 100;
        player.lives -= 1;
        updatePlayerHearts();
        
    };
    health.value = player.health;
};

const updatePlayerHearts = function(){
    // This function adds 3 hearts div to hud
    // it checks if its there, deletes and regenerarets
    // heart acoording to number lives vs. total lives in player objects

    let hud = document.getElementsByClassName('hud-status').item(0);

    if(document.getElementById('health-heart')){
        hud.removeChild(hud.lastElementChild);
    }
    
    let frag = document.createElement('div');
    frag.setAttribute('id', 'health-heart');

    let range = [...Array(player.totalLives).keys()];
    range.forEach(index => {
        let heart = document.createElement('i')
        if(index + 1 <= player.lives){
            heart.classList.add("nes-icon", "heart", "is-medium");
        } else {
            heart.classList.add("nes-icon", "heart", "is-empty");
        }
        frag.appendChild(heart);
    });
    hud.appendChild(frag);
};



let detectOtherBugs = function () {
    // Figure out which bugs have bugs in the same lane
    allEnemies.forEach(thisBug =>{
        let bugsFollowingInLane = allEnemies.filter(bug => bug.y === thisBug.y).filter(bug => bug.x < thisBug.x);
        bugsFollowingInLane.forEach(bug => {
            if(bug.x > thisBug.x - 100){
                bug.dt = thisBug.dt;
                bug.x = thisBug.x -100;
            }; // If Bug behind is close that THIS bugs position - a buffer of 70 pixels, make its speed the same as thisBugs speed so they dont bump
        });

        });
    };



