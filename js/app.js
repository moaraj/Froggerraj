// Enemies our player must avoid
class Enemy {
    constructor(x, y, dt) {
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
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/char-boy.png';
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }

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

    update(xUpdate, yUpdate) {
        this.x = this.x + xUpdate;
        this.y = this.y + yUpdate;
    }
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
let keyboardInput = function(){
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        console.log(e.keyCode);
    
        player.handleInput(allowedKeys[e.keyCode]);
    });
}
keyboardInput();




// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const player = new Player(100,100)

const enemy1 = new Enemy(0,50,1);
const enemy2 = new Enemy(0,130,1);
const enemy3 = new Enemy(0,210,1);

const allEnemies = [];
allEnemies.push(enemy1, enemy2, enemy3);






