const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const height = canvas.height;
const width = canvas.width;
const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;
const directions = {                                    // Keycodes for arrows
    37: "left", 
    38: "up", 
    39: "right", 
    40: "down"
};     
let score = 0;

function circle(x, y, radius, fillCircle){              // Creates shape of the apple
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    fillCircle ? ctx.fill() : ctx.stroke();
};

function drawBorder(){                                  // Establishes and styles game boundaries
    ctx.fillStyle = "Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
}

function drawScore(){                                   // Draws score on canvas
    ctx.font = '20px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Score: ' + score, blockSize, blockSize);
}

function gameOver(){                                    // End of game message
    clearInterval(intervalID);
    ctx.font = '60px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', width / 2, height / 2);
}

class Block {                                                   // Establishes grid system on canvas
    constructor(col, row){
        this.col = col;
        this.row = row;
    }
    drawSquare(color){                                          // Draws the snake
        const x = this.col * blockSize;
        const y = this.row * blockSize;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, blockSize, blockSize);
    }
    drawCircle(color) {                                         // Draws the apple
        const centerX = this.col * blockSize + blockSize / 2;
        const centerY = this.row * blockSize + blockSize / 2;
        ctx.fillStyle = color;
        circle(centerX, centerY, blockSize / 2, true);
    }
    equal(otherBlock){                                          // Determines if snake head has reached the apple
        return this.col === otherBlock.col && this.row === otherBlock.row;
    }
}

class Snake{
    constructor(){
        this.segments = [                                       // Initial baby snake
            new Block(7, 5),
            new Block(6, 5),
            new Block(5, 5)
        ];
        this.direction = "right";
        this.nextDirection = "right";   
    }
    checkCollision(head){                                        
        // WALL COLLISION VARIABLES
        const leftCollision = (head.col === 0);                 
        const topCollision = (head.row === 0);
        const rightCollision = (head.col === widthInBlocks - 1);
        const bottomCollision = (head.row === heightInBlocks -1);
        const wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
        
        let selfCollision = false;                              // Snake on snake collision
        for(let i = 0; i < this.segments.length; i++){
            if(head.equal(this.segments[i])){
                selfCollision = true;
            }
        }
        return wallCollision || selfCollision;                  // Returns true if collision, ending game
    }
    draw() {                                                    // Draws the snake
        for(let i = 0; i < this.segments.length; i++){
            this.segments[i].drawSquare('Blue');
        }
    };
    move() {                                                    // Moves the snake
        const head = this.segments[0];
        let newHead;
    
        this.direction = this.nextDirection;
        if (this.direction === 'right'){
            newHead = new Block(head.col + 1, head.row);
        } else if(this.direction ==='down'){
            newHead = new Block(head.col, head.row + 1);
        } else if(this.direction === 'left'){
            newHead = new Block(head.col - 1, head.row);
        } else if (this.direction === 'up'){
            newHead = new Block(head.col, head.row - 1);
        }
        if(this.checkCollision(newHead)){                       // Checks if new location creates a collision
            gameOver();
            return;
        }
        this.segments.unshift(newHead);                         // Adds new location of snake head
        if(newHead.equal(apple.position)){                      // If snake got to the apple, increases score and resets apple
            score++;
            apple.move();
        } else {                
            this.segments.pop();                                // Keeps the tail moving
        }
    }
    setDirection(newDirection){
        // Prevents snake from inverting on itself
        if(this.direction === 'up' && newDirection === 'down'){
            return;
        }else if (this.direction === 'left' && newDirection === 'right'){
            return;
        }else if(this.direction === 'down' && newDirection === 'up'){
            return;
        }else if(this.direction === 'right' && newDirection === 'left'){
            return;
        }
        this.nextDirection = newDirection;
    }
}

class Apple{
    constructor(){
        this.position = new Block(10, 10);
    }
    draw(){
        this.position.drawCircle('LimeGreen');
    };
    move(){                                                                     // CHooses random spot for a new apple
        const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
        const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 2;
        this.position = new Block(randomCol, randomRow);
    }   
}

// Game initializiation 
const snake = new Snake();
const apple = new Apple();
snake.draw();
apple.draw();


const intervalID = setInterval(() => {                                          // Game animation
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
}, 100);

window.addEventListener('keydown', e => {                                       // Checks array of directions to move snake
    const newDirection = directions[e.keyCode];
    if(newDirection !== undefined){
        snake.setDirection(newDirection);
    }
});