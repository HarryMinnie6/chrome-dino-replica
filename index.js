console.log("testing");
const canvas = document.querySelector(".game-board");

const context = canvas.getContext("2d");
canvas.height = 400;
canvas.width = 640;

// variables
let score;
let scoreText;
let highScore;
let highScoreText;
let character;
let obstacles = [];
let gravity;
let gameSpeed;
let keys = {};

//listening for spacebar press
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    //jump velocity
    this.direction_Y = 0;
    this.jumpForce = 15;
    this.originalHeight = height;
    this.grounded = false;
    this.jumpTimer = 0; //more force is added when the button is held down for longer
  }

  //drawing character
  Draw() {
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fillStyle = "#CBCB41";
    context.closePath();
    context.fill();
  }
  //
  Jump() {
    if (this.grounded && this.jumpTimer == 0) {
      this.jumpTimer = 1;
      this.direction_Y = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      this.direction_Y = -this.jumpForce - this.jumpTimer / 50;
    }
  }
  //all our animation logic  -->moving etc
  Animate() {
    //jump animation
    if (keys["Space"] || keys["KeyW"]) {
      this.Jump();
      console.log("jump");
    } else {
      this.jumpTimer = 0;
    }

    //crouch animation
    // if (keys["ShiftLeft"] || keys["KeyS"]) {
    //   this.height = this.originalHeight / 2;
    // } else {
    //   this.height = this.originalHeight;
    // }

    this.y += this.direction_Y;
    //adding gravity
    if (this.y + this.height < canvas.height) {
      this.direction_Y += gravity;
      this.grounded = false;
    } else {
      this.direction_Y = 0;
      this.grounded = true;
      this.y = canvas.height - this.height;
    }

    //drawing character on the screen
    this.Draw();
  }
}
//generating random color
function random_rgba() {
  var o = Math.round,
    r = Math.random,
    s = 255;
  return (
    "rgba(" +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    r().toFixed(1) +
    ")"
  );
}
//creating obstacles
class Obstacle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;

    this.direction_X = -gameSpeed;
  }
  Update() {
    this.x += this.direction_X;
    this.Draw();
    this.direction_X = -gameSpeed;
  }

  Draw() {
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fillStyle = this.color;
    context.closePath();
    context.fill();
  }
}
class Text {
  constructor(text, x, y, alignment, color, size) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.alignment = alignment;
    this.color = color;
    this.size = size;
  }
  Draw() {
    context.beginPath();
    context.fillStyle = this.color;
    context.font = this.size + "px san-serif";
    context.textAlign = this.alignment;
    context.fillText(this.text, this.x, this.y);
    context.closePath();
  }
}

//spawning obstacles
function spawnObstacle() {
  //creating random object sizes
  let size = RandomIntRange(20, 70);
  let type = RandomIntRange(0, 1);
  let obstacle = new Obstacle(
    canvas.width + size,
    canvas.height - size,
    size,
    size,
    "rgb(64,169,243)"
  );

  obstacles.push(obstacle);
}

function RandomIntRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

//initializing the game
function Start() {
  context.font = "20px san-serif";
  gameSpeed = 3;
  gravity = 1;
  score = 0;
  highScore = 0;

  //getting highscore from local storage
  if (localStorage.getItem("highscore")) {
    highscore = localStorage.getItem("highscore");
  }

  player = new Player(25, canvas.height - 150, 50, 50);
  scoreText = new Text(`Score: ${score}`, 25, 25, "left", "#FFF ", "20");
  highScoreText = new Text(
    ` High Score: ${score}`,
    canvas.width - 25,
    25,
    "right",
    "#FFF ",
    "20"
  );

  //displaying character on the canvas
  requestAnimationFrame(Update);
}

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

function Update() {
  requestAnimationFrame(Update);
  context.clearRect(0, 0, canvas.width, canvas.height);

  spawnTimer--;
  if (spawnTimer <= 0) {
    spawnObstacle();
    console.log(obstacles);
    spawnTimer = initialSpawnTimer - gameSpeed * 8;

    if (spawnTimer < 60) {
      spawnTimer = 60;
    }
  }

  //spawning obstacles on canvas
  for (let i = 0; i < obstacles.length; i++) {
    let o = obstacles[i];

    // when the obstacles passs the left side of the screen it gets deleted
    if (o.x + o.width < 0) {
      obstacles.splice(i, 1);
    }

    //colission detection
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      obstacles = [];
      score = 0;
      spawnTimer = initialSpawnTimer;
      gameSpeed = 3;
      //adding high score to local storage when we die
      window.localStorage.setItem("highscore", highscore);
    }

    o.Update();
  }

  player.Animate();
  //incrementing score as game progresses
  score++;

  //displaying score text on canvas
  scoreText.text = `Score: ${score}`;
  //displaying score on canvas
  scoreText.Draw();

  //updating highscore if previous high score is beaten
  if (score > highScore) {
    highScore = score;
    highScoreText.text = `High Score: ${highScore}`;
    //adding high score to local storage when previous high score is beaten
    window.localStorage.setItem("highscore", highscore);
  }

  //displaying high score on canvas
  highScoreText.Draw();

  //gradually increasing game speed
  gameSpeed += 0.005;
}
Start();
