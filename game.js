const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 15;
const paddleHeight = 100;
const ballSize = 16;
const playerX = 20;
const aiX = canvas.width - paddleWidth - 20;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);

const paddleSpeed = 6;
const aiDifficulty = 1; // between 0 (easy) and 1 (impossible)

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function resetBall() {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision (top/bottom)
    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY = -ballSpeedY;
        ballY = clamp(ballY, 0, canvas.height - ballSize);
    }

    // Player paddle collision
    if (
        ballX <= playerX + paddleWidth &&
        ballY + ballSize >= playerY &&
        ballY <= playerY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        // Add a little "english"
        let deltaY = (ballY + ballSize/2) - (playerY + paddleHeight/2);
        ballSpeedY = deltaY * 0.18;
        ballX = playerX + paddleWidth;
    }

    // AI paddle collision
    if (
        ballX + ballSize >= aiX &&
        ballY + ballSize >= aiY &&
        ballY <= aiY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        let deltaY = (ballY + ballSize/2) - (aiY + paddleHeight/2);
        ballSpeedY = deltaY * 0.18;
        ballX = aiX - ballSize;
    }

    // Score check (reset ball)
    if (ballX < 0 || ballX + ballSize > canvas.width) {
        resetBall();
    }

    // AI paddle movement (simple tracking)
    const aiCenter = aiY + paddleHeight / 2;
    const ballCenter = ballY + ballSize / 2;
    if (aiCenter < ballCenter - 10) {
        aiY += paddleSpeed * aiDifficulty;
    } else if (aiCenter > ballCenter + 10) {
        aiY -= paddleSpeed * aiDifficulty;
    }
    aiY = clamp(aiY, 0, canvas.height - paddleHeight);
}

function draw() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#111");

    // Net
    for (let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width / 2 - 2, i, 4, 20, "#444");
    }

    // Paddles
    drawRect(playerX, playerY, paddleWidth, paddleHeight, "#fff");
    drawRect(aiX, aiY, paddleWidth, paddleHeight, "#fff");

    // Ball
    drawRect(ballX, ballY, ballSize, ballSize, "#fff");
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Player paddle movement (mouse control)
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = clamp(mouseY - paddleHeight / 2, 0, canvas.height - paddleHeight);
});

gameLoop();