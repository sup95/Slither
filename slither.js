var CANVAS_BACKGROUND_COLOUR = "#ffe4c4";
var SNAKE_COLOUR = '#91CED7';
var FOOD_COLOUR = '#ff6f69';
var GAME_SPEED = 50;
var snake, dx, dy, score;
var foodX;
var foodY;
var changingDirection;
var gameCanvas = document.getElementById("gameCanvas");
var ctx = gameCanvas.getContext("2d");
var header = document.getElementById('header');
initSnakeAndDirections();
var startNewGame = true;
header.addEventListener("click", function (e) {
    if (startNewGame) {
        startNewGame = false;
        resetScore();
        resetHeader();
        clearCanvas();
        createFood();
        main();
    }
});
manipulateCanvasDimensions('65%', '65%');
clearCanvas();
//main();
//createFood();
document.addEventListener("keydown", changeDirection);
/**
 * The main function.
 */
function main() {
    if (didGameEnd()) {
        header.innerHTML = "Slither Again";
        startNewGame = true;
        initSnakeAndDirections();
        return;
    }
    setTimeout(function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, GAME_SPEED);
}
function initSnakeAndDirections() {
    snake = [
        { x: 150, y: 150 },
        { x: 140, y: 150 },
        { x: 130, y: 150 },
        { x: 120, y: 150 },
        { x: 110, y: 150 }
    ];
    dx = 10;
    dy = 0;
    score = 0;
}
/**
 * Set canvas height and width to a percentage of the window size.
 * @param width
 * @param height
 */
function manipulateCanvasDimensions(width, height) {
    gameCanvas.style.width = width;
    gameCanvas.style.height = height;
    gameCanvas.width = gameCanvas.offsetWidth;
    gameCanvas.height = gameCanvas.offsetHeight;
}
function clearCanvas() {
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    ctx.strokeStyle = CANVAS_BACKGROUND_COLOUR;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}
function drawSnake() {
    snake.forEach(drawSnakePart);
}
function drawSnakePart(snakePart) {
    ctx.fillStyle = SNAKE_COLOUR;
    ctx.strokeStyle = SNAKE_COLOUR;
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}
/**
 * Move/'slither' snake in the direction chosen by user.
 * Check if snake has eaten food, and if more food needs to be produced. :P
 */
function advanceSnake() {
    var head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    var didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score++;
        document.getElementById('score').innerHTML = "Score: " + score;
        createFood();
    }
    else
        snake.pop();
}
/**
 * Change snake direction in response to user event.
 * @param event
 */
function changeDirection(event) {
    var LEFT_KEY = 37;
    var RIGHT_KEY = 39;
    var UP_KEY = 38;
    var DOWN_KEY = 40;
    if (changingDirection)
        return;
    changingDirection = true;
    var keyPressed = event.keyCode;
    var goingUp = dy === -10;
    var goingDown = dy === 10;
    var goingRight = dx === 10;
    var goingLeft = dx === -10;
    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingDown) {
        dx = 0;
        dy = 10;
    }
}
/**
 * Generates random x an y coordinates to produce food.
 * @param min
 * @param max
 */
function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}
/**
 * Create food.
 * If food coordinates overlap with those of the snake, recompute.
 */
function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);
    snake.forEach(function isFoodOnSnake(part) {
        var foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake)
            createFood();
    });
}
function drawFood() {
    ctx.fillStyle = FOOD_COLOUR;
    ctx.strokeStyle = FOOD_COLOUR;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}
function resetScore() {
    document.getElementById('score').innerHTML = "Score: " + score;
}
function resetHeader() {
    header.innerHTML = "Slither";
}
/**
 * Game ends when the head of the snake collides with the snake itself;
 * or when the snake hits the walls.
 */
function didGameEnd() {
    for (var i = 4; i < snake.length; i++) {
        var didCollide = snake[i].x === snake[0].x &&
            snake[i].y === snake[0].y;
        if (didCollide)
            return true;
    }
    var hitLeftWall = snake[0].x < 0;
    var hitRightWall = snake[0].x > gameCanvas.width - 10;
    var hitToptWall = snake[0].y < 0;
    var hitBottomWall = snake[0].y > gameCanvas.height - 10;
    return hitLeftWall ||
        hitRightWall ||
        hitToptWall ||
        hitBottomWall;
}
