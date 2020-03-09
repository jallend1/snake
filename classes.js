
class Apple{
    constructor(){
        this.position = new Block(10, 10);
    }
    draw(){
        this.position.drawCircle('LimeGreen');
    }
    move(){                                                                     // CHooses random spot for a new apple
        const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
        const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 2;
        this.position = new Block(randomCol, randomRow);
    }   
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