const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const height = canvas.height;
const width = canvas.width;
const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;
const directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};
let score = 0;

function circle(x, y, radius, fillCircle){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    fillCircle ? ctx.fill() : ctx.stroke();
};

function drawBorder(){
    ctx.fillStyle = "Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
}

function drawScore(){
    ctx.font = '20px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Score: ' + score, blockSize, blockSize);
}

function gameOver(){
    clearInterval(intervalID);
    ctx.font = '60px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', width / 2, height / 2);
}


const Block = function(col, row){
    this.col = col;
    this.row = row;
}

Block.prototype.drawSquare = function (color){
    const x = this.col * blockSize;
    const y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
}

Block.prototype.drawCircle = function (color) {
    const centerX = this.col * blockSize + blockSize / 2;
    const centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
}

Block.prototype.equal = function (otherBlock){
    return this.col === otherBlock.col && this.row === otherBlock.row;
}
const Snake = function(){
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];
    this.direction = "right";
    this.nextDirection = "right";
}

Snake.prototype.checkCollision = function(head){
    const leftCollision = (head.col === 0);
    const topCollision = (head.row === 0);
    const rightCollision = (head.col === widthInBlocks - 1);
    const bottomCollision = (head.row === heightInBlocks -1);
    const wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
    let selfCollision = false;
    for(let i = 0; i < this.segments.length; i++){
        if(head.equal(this.segments[i])){
            selfCollision = true;
        }
    }
    return wallCollision || selfCollision;
}

Snake.prototype.draw = function () {
    for(let i = 0; i < this.segments.length; i++){
        this.segments[i].drawSquare('Blue');
    }
};
Snake.prototype.move = function () {
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

    if(this.checkCollision(newHead)){
        gameOver();
        return;
    }

    this.segments.unshift(newHead);
    if(newHead.equal(apple.position)){
        score++;
        apple.move();
    } else {
        this.segments.pop();
    }
}

Snake.prototype.setDirection = function(newDirection){
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
const Apple = function() {
    this.position = new Block(10, 10);
};

Apple.prototype.draw = function(){
    this.position.drawCircle('LimeGreen');
};

Apple.prototype.move = function(){
    const randomCol = Math.floor(Math.random() * (widthInBlocks -2)) + 1;
    const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 2;
    this.position = new Block(randomCol, randomRow);
}   

const snake = new Snake();
const apple = new Apple();
snake.draw();
apple.draw();


const intervalID = setInterval(function (){
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
}, 100);



window.addEventListener('keydown', e => {
    const newDirection = directions[e.keyCode];
    if(newDirection !== undefined){
        snake.setDirection(newDirection);
    }
});