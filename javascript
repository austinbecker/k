const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const message = document.getElementById("message");

const player = {
  x: 380,
  y: 230,
  width: 30,
  height: 30,
  speed: 5,
  color: "#3b82f6"
};

const coin = {
  x: 200,
  y: 150,
  size: 18,
  color: "#facc15"
};

const bricks = [
  {
    x: 100,
    y: 100,
    width: 80,
    height: 30,
    speedX: 3,
    speedY: 0
  },
  {
    x: 600,
    y: 350,
    width: 100,
    height: 30,
    speedX: -3,
    speedY: 0
  },
  {
    x: 350,
    y: 50,
    width: 30,
    height: 80,
    speedX: 0,
    speedY: 3
  }
];

const keys = {};
let score = 0;
let gameOver = false;

document.addEventListener("keydown", function(event) {
  keys[event.key.toLowerCase()] = true;

  if (event.code === "Space" && gameOver) {
    restartGame();
  }
});

document.addEventListener("keyup", function(event) {
  keys[event.key.toLowerCase()] = false;
});

function movePlayer() {
  if (keys["arrowup"] || keys["w"]) {
    player.y -= player.speed;
  }

  if (keys["arrowdown"] || keys["s"]) {
    player.y += player.speed;
  }

  if (keys["arrowleft"] || keys["a"]) {
    player.x -= player.speed;
  }

  if (keys["arrowright"] || keys["d"]) {
    player.x += player.speed;
  }

  player.x = Math.max(
    0,
    Math.min(canvas.width - player.width, player.x)
  );

  player.y = Math.max(
    0,
    Math.min(canvas.height - player.height, player.y)
  );
}

function moveBricks() {
  bricks.forEach(brick => {
    brick.x += brick.speedX;
    brick.y += brick.speedY;

    if (
      brick.x <= 0 ||
      brick.x + brick.width >= canvas.width
    ) {
      brick.speedX *= -1;
    }

    if (
      brick.y <= 0 ||
      brick.y + brick.height >= canvas.height
    ) {
      brick.speedY *= -1;
    }
  });
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function checkCoinCollision() {
  const coinObject = {
    x: coin.x,
    y: coin.y,
    width: coin.size,
    height: coin.size
  };

  if (isColliding(player, coinObject)) {
    score++;
    scoreText.textContent = "Score: " + score;

    coin.x = Math.random() * (canvas.width - coin.size);
    coin.y = Math.random() * (canvas.height - coin.size);

    moveBricksToSafePositions();
  }
}

function moveBricksToSafePositions() {
  bricks.forEach(brick => {
    let safePosition = false;

    while (!safePosition) {
      brick.x = Math.random() * (canvas.width - brick.width);
      brick.y = Math.random() * (canvas.height - brick.height);

      const playerTooClose =
        player.x < brick.x + brick.width + 50 &&
        player.x + player.width + 50 > brick.x &&
        player.y < brick.y + brick.height + 50 &&
        player.y + player.height + 50 > brick.y;

      const coinTooClose =
        coin.x < brick.x + brick.width &&
        coin.x + coin.size > brick.x &&
        coin.y < brick.y + brick.height &&
        coin.y + coin.size > brick.y;

      if (!playerTooClose && !coinTooClose) {
        safePosition = true;
      }
    }

    brick.speedX = Math.random() * 6 - 3;
    brick.speedY = Math.random() * 6 - 3;

    if (Math.abs(brick.speedX) < 1) {
      brick.speedX = 2;
    }

    if (Math.abs(brick.speedY) < 1) {
      brick.speedY = 2;
    }
  });
}

function checkBrickCollision() {
  for (const brick of bricks) {
    if (isColliding(player, brick)) {
      gameOver = true;
      message.textContent =
        "You died! Press SPACEBAR to restart.";
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = player.color;

  ctx.fillRect(
    player.x,
    player.y,
    player.width,
    player.height
  );
}

function drawCoin() {
  ctx.fillStyle = coin.color;

  ctx.beginPath();

  ctx.arc(
    coin.x + coin.size / 2,
    coin.y + coin.size / 2,
    coin.size / 2,
    0,
    Math.PI * 2
  );

  ctx.fill();
}

function drawBricks() {
  bricks.forEach(brick => {
    ctx.fillStyle = "#dc2626";

    ctx.fillRect(
      brick.x,
      brick.y,
      brick.width,
      brick.height
    );

    ctx.strokeStyle = "#7f1d1d";
    ctx.lineWidth = 3;

    ctx.strokeRect(
      brick.x,
      brick.y,
      brick.width,
      brick.height
    );
  });
}

function restartGame() {
  score = 0;
  gameOver = false;

  scoreText.textContent = "Score: 0";
  message.textContent = "";

  player.x = 380;
  player.y = 230;

  coin.x = Math.random() * (canvas.width - coin.size);
  coin.y = Math.random() * (canvas.height - coin.size);

  moveBricksToSafePositions();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    movePlayer();
    moveBricks();
    checkCoinCollision();
    checkBrickCollision();
  }

  drawPlayer();
  drawCoin();
  drawBricks();

  requestAnimationFrame(gameLoop);
}

gameLoop();
