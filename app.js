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
}
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
function gameFrame(){
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
}
function gameOver(){                                    // End of game message 
    ctx.font = '60px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', width / 2, height / 2);
}
function gameReset(){
    snake = new Snake();
    apple = new Apple();
    score = 0;
    snake.draw();
    apple.draw();
    gameFrame();
}

gameReset();
snake = new Snake;
apple = new Apple;

let intervalID = setInterval(gameFrame, 100);

window.addEventListener('keydown', e => {                                       // Checks array of directions to move snake
    const newDirection = directions[e.keyCode];
    if(newDirection !== undefined){
        snake.setDirection(newDirection);
    }
    if(e.keyCode === 32){
        gameReset();
    }
});