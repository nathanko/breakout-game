var canvas = document.getElementById("game-canvas");

if ((window.innerHeight - 50) * 480 / 320 < window.innerWidth) { //landscape
  console.log("l")
  canvas.height = window.innerHeight - 50;
  canvas.width = canvas.height * 480 / 320;
}
else {
  console.log("p")
  canvas.width = window.innerWidth;
  canvas.height = canvas.width * 320 / 480;

}

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var scaleFactor = canvasWidth / 480;
var ctx = canvas.getContext("2d");

var score = 0;
var highscore = localStorage.getItem("highscore");
var bricksDown = 0; //number of bricks hit
var dscore = 1; //number of points to add to score for each brick hit
var lives = 3;
var won = false;
var lost = false;

var x = canvasWidth / 2;
var y = canvasHeight - 30 * scaleFactor;

var speed = 3 * scaleFactor;
dx = 0;
dy = -speed * Math.sqrt(2);

var ballRadius = 10 * scaleFactor;

var paddleHeight = 10 * scaleFactor;
var paddleWidth = 75 * scaleFactor;
var paddleX = (canvasWidth - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 4;
var brickColumnCount = 5;
var brickWidth = 75 * scaleFactor;
var brickHeight = 20 * scaleFactor;
var brickPadding = 10 * scaleFactor;
var brickOffsetTop = 30 * scaleFactor;
var brickOffsetLeft = 30 * scaleFactor;


var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1
    };
  }
}

function drawBall() {
  //console.log("x: " + x + " y: " + y);
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (x + ballRadius > b.x && x - ballRadius < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += dscore;
          bricksDown++;
          dscore *= 2;
        }
      }
    }
  }
}


function displayWinMessage() {
  var newhs = false;
  if (!highscore || score > highscore) {
    highscore = score;
    newhs = true;
  }
  localStorage.setItem("highscore", highscore);

  //clear message area
  ctx.beginPath();
  ctx.rect(0, 0, canvasWidth, canvasHeight - paddleHeight - 20 * scaleFactor);
  ctx.fillStyle = "#eee";
  ctx.fill();
  ctx.closePath();
  
  drawScore();
  drawLives();

  ctx.beginPath();

  ctx.font = 16 * scaleFactor + "px Arial";
  ctx.fillStyle = "#0c0";
  if (newhs) {
    ctx.fillText("You won! New highscore!", canvasWidth / 2 - 90 * scaleFactor, canvasHeight / 2 - 90 * scaleFactor);
  }
  else {
    ctx.fillText("You won!", canvasWidth / 2 - 40 * scaleFactor, canvasHeight / 2 - 90 * scaleFactor);
  }

  ctx.font = 20 * scaleFactor + "px Arial";
  ctx.fillText("Score: " + score, canvasWidth / 2 - 60 * scaleFactor, canvasHeight / 2 - 55 * scaleFactor);
  ctx.fillText("High score: " + highscore, canvasWidth / 2 - 65 * scaleFactor, canvasHeight / 2 - 30 * scaleFactor);

  ctx.font = 12 * scaleFactor + "px Arial";
  ctx.fillStyle = "#aaa";
  ctx.fillText("Click anywhere or press any key to play again!", canvasWidth / 2 - 120 * scaleFactor, canvasHeight / 2 + 10 * scaleFactor);

}

function displayLoseMessage() {
  //clear message area
  ctx.beginPath();
  ctx.rect(0, canvasHeight / 2 - 25 * scaleFactor, canvasWidth, 50 * scaleFactor);
  ctx.fillStyle = "#eee";
  ctx.fill();
  ctx.closePath();

  ctx.font = 16 * scaleFactor + "px Arial";
  ctx.fillStyle = "#ff0000";
  ctx.fillText("You lost! Game over!", canvasWidth / 2 - 75 * scaleFactor, canvasHeight / 2 - 10 * scaleFactor);
  ctx.font = 12 * scaleFactor + "px Arial";
  ctx.fillStyle = "#aaa";
  ctx.fillText("Click anywhere or press any key to play again!", canvasWidth / 2 - 120 * scaleFactor, canvasHeight / 2 + 10 * scaleFactor);

}

function drawScore() {
  ctx.font = 16 * scaleFactor + "px Arial";
  ctx.fillStyle = "#777";
  var scoreText = "Score: " + score;
  if (highscore){
    scoreText+="      High score: " + highscore; 
  }
  ctx.fillText(scoreText, 8 * scaleFactor, 20 * scaleFactor);
}

function drawLives() {
  ctx.font = 16 * scaleFactor + "px Arial";
  ctx.fillStyle = "#777";
  ctx.fillText("Lives: " + lives, canvasWidth - 65 * scaleFactor, 20 * scaleFactor);
}

function drawInfo() {
  ctx.font = 16 * scaleFactor + "px Arial";
  ctx.fillStyle = "#aaa";
  if (dscore > 2  ) {
    ctx.fillText("+" + dscore/2 + " points! Nice streak!", canvasWidth / 2 - 80 * scaleFactor, canvasHeight / 2 + 10 * scaleFactor);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  drawBricks();  
  collisionDetection();
  drawInfo();  
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();

  //check win
  if (bricksDown == brickRowCount * brickColumnCount) {
    won = true;
    displayWinMessage();
    canvas.addEventListener("click", reload, false);
    canvas.addEventListener("touchend", reload, false);
    document.addEventListener("keyup", reload, false);

    //document.location.reload();
  }


  //set next ball position
  if (x + dx > canvasWidth - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  //touch paddle
  if (x > paddleX - ballRadius && x - ballRadius < paddleX + paddleWidth && y + dy > canvasHeight - paddleHeight - ballRadius) {
    dscore = 1;
    var angle = (x - paddleX - paddleWidth / 2) / (paddleWidth / 2); //ratio between dx and sqrt2*speed
    angle = angle < -0.95 ? -0.95 : angle; //min angle at -0.95
    angle = angle > 0.95 ? 0.95 : angle; //max angle at 0.95
    dx = Math.sqrt(2) * speed * angle;
    dy = -Math.sqrt(Math.abs(2 * speed * speed - dx * dx))
  }
  else if (y > canvasHeight - ballRadius) {
    //touch the ground
    lives--;
    dscore = 1;
    if (!lives) {
      lost = true;
      displayLoseMessage();
      canvas.addEventListener("click", reload, false);
      canvas.addEventListener("touchend", reload, false);
      document.addEventListener("keyup", reload, false);
    }
    else {
      x = canvasWidth / 2;
      y = canvasHeight - 30 * scaleFactor;
      dx = 0;
      dy = -speed * Math.sqrt(2);
      //paddleX = (canvasWidth - paddleWidth) / 2;
    }

  }

  //set next paddle position
  if (rightPressed && paddleX < canvasWidth - paddleWidth) {
    paddleX += 7;
  }
  else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  if (!won && !lost) {
    requestAnimationFrame(draw);
  }
}

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  }
  else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  }
  else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvasWidth) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function reload(e) {
  document.location.reload();
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("touchmove", mouseMoveHandler, false);


draw();
