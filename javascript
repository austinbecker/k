const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const player = {
  x: 380,
  y: 230,
  width: 30,
  height: 30,
  speed: 5,
  color: "blue"
};

const coin = {
  x: 200,
  y: 150,
  size: 18,
  color: "gold"
};

const bricks = [
  { x: 80,  y: 80,  width: 80,  height: 30, speedX: 3,  speedY: 100 },
  { x: 250, y: 60,  width: 90,  height: 30, speedX: -2, speedY: 2 },
  { x: 500, y: 70,  width: 100, height: 30, speedX: 2, speedY: 1 },
  { x: 680, y: 120, width: 30, height: 90, speedX: -2, speedY: 2 },
  { x: 100, y: 250, width: 30, height: 100, speedX: 1, speedY: -3 },
  { x: 280, y: 220, width: 100, height: 30, speedX: 3, speedY: -1 },
  { x: 500, y: 250, width: 90, height: 30, speedX: -3, speedY: 2 },
  { x: 700, y: 350, width: 30, height: 90, speedX: -1, speedY: -2 },
  { x: 180, y: 420, width: 100, height: 30, speedX: 2, speedY: -2 },
  { x: 450, y: 420, width: 120, height: 30, speedX: -2, speedY: -1 }
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
  bricks.forEach(function(brick) {
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
  const coinBox = {
    x: coin.x,
    y: coin.y,
    width: coin.size,
    height: coin.size
  };

  if (isColliding(player, coinBox)) {
    score++;
    scoreText.textContent = "Score: " + score;

    coin.x = Math.random() * (canvas.width - coin.size);
    coin.y = Math.random() * (canvas.height - coin.size);

    moveBricksToSafePositions();
  }
}

function moveBricksToSafePositions() {
  const placedBricks = [];

  bricks.forEach(function(brick) {
    let safe = false;
    let attempts = 0;

    while (!safe && attempts < 1000) {
      attempts++;

      brick.x = Math.random() * (canvas.width - brick.width);
      brick.y = Math.random() * (canvas.height - brick.height);

      const playerTooClose =
        player.x < brick.x + brick.width + 60 &&
        player.x + player.width + 60 > brick.x &&
        player.y < brick.y + brick.height + 60 &&
        player.y + player.height + 60 > brick.y;

      const coinTooClose =
        coin.x < brick.x + brick.width + 30 &&
        coin.x + coin.size + 30 > brick.x &&
        coin.y < brick.y + brick.height + 30 &&
        coin.y + coin.size + 30 > brick.y;

      const anotherBrickTooClose = placedBricks.some(function(otherBrick) {
        return (
          brick.x < otherBrick.x + otherBrick.width + 20 &&
          brick.x + brick.width + 20 > otherBrick.x &&
          brick.y < otherBrick.y + otherBrick.height + 20 &&
          brick.y + brick.height + 20 > otherBrick.y
        );
      });

      if (
        !playerTooClose &&
        !coinTooClose &&
        !anotherBrickTooClose
      ) {
        safe = true;
      }
    }

    placedBricks.push(brick);

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
  bricks.forEach(function(brick) {
    if (isColliding(player, brick)) {
      gameOver = true;
      message.textContent =
        "You died! Press SPACEBAR to restart.";
    }
  });
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
  bricks.forEach(function(brick) {
    ctx.fillStyle = "red";

    ctx.fillRect(
      brick.x,
      brick.y,
      brick.width,
      brick.height
    );

    ctx.strokeStyle = "darkred";
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

// Arrange all 10 bricks safely when the game first starts
moveBricksToSafePositions();

gameLoop();
