// Get the canvas element and its context
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Game settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let speed = 7;

// Snake initial position and velocity
let snake = [
    { x: 10, y: 10 }
];
let velocityX = 0;
let velocityY = 0;

// Food initial position
let foodX = Math.floor(Math.random() * tileCount);
let foodY = Math.floor(Math.random() * tileCount);

// Score
let score = 0;

// Game state
let gameOver = false;

// Game loop
function gameLoop() {
    if (gameOver) {
        displayGameOver();
        return;
    }

    // Clear the canvas
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Move the snake
    moveSnake();

    // Check for collisions
    checkCollisions();

    // Draw food and snake
    drawFood();
    drawSnake();

    // Update score
    document.getElementById('score').textContent = score;

    // Call the game loop again
    setTimeout(gameLoop, 1000 / speed);
}

// Move the snake
function moveSnake() {
    // Calculate new head position
    const head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };
    
    // Add new head to the beginning of the snake array
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === foodX && head.y === foodY) {
        // Increase score
        score++;
        
        // Generate new food position
        generateFood();
        
        // Increase speed slightly
        if (speed < 15) {
            speed += 0.2;
        }
    } else {
        // Remove the tail segment if food wasn't eaten
        snake.pop();
    }
}

// Check for collisions
function checkCollisions() {
    const head = snake[0];
    
    // Check wall collisions
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
        return;
    }
    
    // Check self collisions (starting from the 4th segment)
    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
        }
    }
}

// Generate new food position
function generateFood() {
    // Generate random position
    foodX = Math.floor(Math.random() * tileCount);
    foodY = Math.floor(Math.random() * tileCount);
    
    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
        if (segment.x === foodX && segment.y === foodY) {
            // If food spawns on snake, try again
            generateFood();
            return;
        }
    }
}

// Draw the snake
function drawSnake() {
    // Draw each segment of the snake
    snake.forEach((segment, index) => {
        // Head is a different color
        if (index === 0) {
            ctx.fillStyle = '#4CAF50'; // Green head
        } else {
            ctx.fillStyle = '#8BC34A'; // Lighter green body
        }
        
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    });
}

// Draw the food
function drawFood() {
    ctx.fillStyle = '#FF5722'; // Orange food
    ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 1, gridSize - 1);
}

// Display game over screen
function displayGameOver() {
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('final-score').textContent = score;
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    // Prevent arrow keys from scrolling the page
    if ([37, 38, 39, 40].includes(event.keyCode)) {
        event.preventDefault();
    }
    
    // Left arrow
    if (event.keyCode === 37 && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    }
    // Up arrow
    else if (event.keyCode === 38 && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    }
    // Right arrow
    else if (event.keyCode === 39 && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
    // Down arrow
    else if (event.keyCode === 40 && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    }
});

// Restart game
document.getElementById('restart-btn').addEventListener('click', () => {
    // Reset game state
    snake = [{ x: 10, y: 10 }];
    velocityX = 0;
    velocityY = 0;
    foodX = Math.floor(Math.random() * tileCount);
    foodY = Math.floor(Math.random() * tileCount);
    score = 0;
    speed = 7;
    gameOver = false;
    
    // Hide game over screen
    document.getElementById('game-over').classList.add('hidden');
    
    // Start game loop
    gameLoop();
});

// Start the game when the page loads
window.onload = () => {
    gameLoop();
};