var canvas = document.getElementById("game-canvas");

if (window.innerHeight < window.innerWidth) {
  canvas.height = window.innerHeight;
  canvas.width = canvas.height * 480 / 320;
}
else {
  canvas.width = window.innerWidth;
  canvas.height = canvas.width * 320 / 480;

}

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var scaleFactor = canvasWidth / 480;
var ctx = canvas.getContext("2d");

var score = 0;
var lives = 1;

var x = canvasWidth / 2;
var y = canvasHeight - 30 * scaleFactor;

var speed = 3 * scaleFactor;
var dx = speed;
var dy = -speed;

var ballRadius = 10 * scaleFactor;

var paddleHeight = 10 * scaleFactor;
var paddleWidth = 75 * scaleFactor;
var paddleX = (canvasWidth - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
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
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = 16 * scaleFactor + "px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8 * scaleFactor, 20 * scaleFactor);
}

function drawLives() {
  ctx.font = 16 * scaleFactor + "px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvasWidth - 65 * scaleFactor, 20 * scaleFactor);
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();


  //set next ball position
  if (x + dx > canvasWidth - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  if (x > paddleX - ballRadius && x - ballRadius < paddleX + paddleWidth && y + dy > canvasHeight - paddleHeight - ballRadius) {
    var angle = (x - paddleX - paddleWidth /2) / (paddleWidth /2); //ratio between dx and sqrt2*speed
    angle = angle < -0.95 ? -0.95 : angle; //min angle at -0.95
    angle = angle > 0.95 ? 0.95 : angle; //max angle at 0.95
    dx = Math.sqrt(2)*speed*angle;
    dy = -Math.sqrt(Math.abs(2*speed*speed - dx*dx))
  }
  else if (y > canvasHeight - ballRadius) {
    //touch the ground
    lives--;
    if (!lives) {
      alert("GAME OVER");
      document.location.reload();
    }
    else {
      x = canvasWidth / 2;
      y = canvasHeight - 30 * scaleFactor;
      dx = speed;
      dy = -speed;
      paddleX = (canvasWidth - paddleWidth) / 2;
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
  requestAnimationFrame(draw);
}

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  }
  else if (e.keyCode == 37) {
    leftPressed = true;
  }
  else if (e.keyCode == 40) {
    dy = speed;
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


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


draw();
