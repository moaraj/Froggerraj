// Enemies our player must avoid
var Enemy = function(x, y, dt) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y
    this.dt = dt
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function() {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + 1 * this.dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    
};

class Player {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }
    update(xUpdate, yUpdate) {
        this.x = this.x + xUpdate;
        this.y = this.y + yUpdate;
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    // Now write your own player class
    // This class requires an update(), render() and
    // a handleInput() method.
    handleInput(text_input) {
        if (text_input == 'up') {
            this.update(0, 1);
        }
        ;
        if (text_input == 'down') {
            this.update(0, -1);
        }
        ;
        if (text_input == 'left') {
            this.update(-1, 0);
        }
        ;
        if (text_input == 'right') {
            this.update(1, 1);
        }
        ;
    }
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode:]);
});





// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


const enemy1 = new Enemy(1,1,1);
const enemy2 = new Enemy(1,100,1);
const enemy3 = new Enemy(100,200,1);


const allEnemies = [];
allEnemies.push(enemy1, enemy2, enemy3);

charSpriteLocation = './char-boy.png';
let player = new Player(1,1,charSpriteLocation);



