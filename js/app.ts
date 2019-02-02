// Enemies our player must avoid
class Enemy {
    x: number;
    y: number;
    dt: number;
    sprite: string;

    constructor(x:number, y:number, dt:number) {
        this.x = x;
        this.y = y;
        this.dt = dt;
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
            this.x = -100;
        }
    }
}


class Player {
    x: number;
    y: number;
    speed: number;
    sprite: string;
    win: boolean;

    constructor(x: number, y: number, speed: number, sprite: string) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.sprite = sprite;
        this.win = false;
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



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let characters = {
    boy:'images/char-boy.png',
    catGirl: 'images/char-cat-girl.png',
    hornGirl: 'images/char-horn-girl.png',
    pinkGirl: 'images/char-pink-girl.png',
    princessGirl: 'images/char-pink-girl.png',
}


class GameOptions {
    difficulty: string
    character: string
    score:number
    
    constructor(difficulty: string, character: string, score: number){
        this.character = character;
        this.difficulty = difficulty;
        this.score = score;
    }
}

let allEnemies: Enemy[] = [];

function genEnemies(yLevels:number = 4, speedMax:number = 3, prob:number = 70){  
    function calcEnemyStats(yLevels:number, speedMax:number, prob:number){
        let genEnegyProb = Math.floor(Math.random() * 100) > prob;
        let yInitEnemy = Math.floor(Math.random() * yLevels) * 80;
        let speedInitEnemy = Math.random() * speedMax;
    
        if(genEnegyProb){
            return new Enemy(0, yInitEnemy, speedInitEnemy);
        } else return null
    }
    
    (function addEnemyToArray(){
        let newEnemy = calcEnemyStats(yLevels, speedMax, prob);
        if(newEnemy) allEnemies.push(newEnemy);
    })();

    (function arrangeEnemiesByY(){
        allEnemies = allEnemies.sort( (a,b) => {
            console.log("sorting: " + a + " " + b)
            if(a.y > b.y) return 1;
            else if(a.y < b.y) return -1;
            else return 0;
        });
    })();
}




const player = new Player(200,295,30,characters.boy);







let collisionDetection = function(){
    let x_threshold = 20;
    let y_threshold = 20;
};




class Orange {
    y: number
    constructor(y){
        this.y = y
    }
}