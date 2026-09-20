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

    // Move the coin to a new position
    coin.x = Math.random() * (canvas.width - coin.size);
    coin.y = Math.random() * (canvas.height - coin.size);

    // Move the dangerous bricks
    moveBricksToSafePositions();
  }
}
function moveBricksToSafePositions() {
  bricks.forEach(brick => {
    let safePosition = false;

    while (!safePosition) {
      brick.x = Math.random() * (canvas.width - brick.width);
      brick.y = Math.random() * (canvas.height - brick.height);

      // Prevent bricks from spawning on the player
      const playerTooClose =
        player.x < brick.x + brick.width + 50 &&
        player.x + player.width + 50 > brick.x &&
        player.y < brick.y + brick.height + 50 &&
        player.y + player.height + 50 > brick.y;

      // Prevent bricks from spawning on the coin
      const coinTooClose =
        coin.x < brick.x + brick.width &&
        coin.x + coin.size > brick.x &&
        coin.y < brick.y + brick.height &&
        coin.y + coin.size > brick.y;

      if (!playerTooClose && !coinTooClose) {
        safePosition = true;
      }
    }

    // Give the brick a new random movement direction
    brick.speedX = (Math.random() * 6) - 3;
    brick.speedY = (Math.random() * 6) - 3;

    // Make sure the brick moves
    if (Math.abs(brick.speedX) < 1) {
      brick.speedX = 2;
    }

    if (Math.abs(brick.speedY) < 1) {
      brick.speedY = 2;
    }
  });
}
