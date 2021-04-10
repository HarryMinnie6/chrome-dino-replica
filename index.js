console.log("testing");
const canvas = document.querySelector(".game-board");

const context = canvas.getContext("2d");
canvas.height = 400;
canvas.width = 640;

// variables
let score;
let highScore;
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
    this.jumpForce = 5   ;
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
    if(this.grounded && this.jumpTimer == 0) {
      this.jumpTimer = 1;
      this.direction_Y = -this.jumpForce
    } else if (this.jumpTimer> 0 && this.jumpTimer < 15) {
      this.jumpTimer++
      this.direction_Y = -this.jumpForce - (this.jumpTimer)
    }
  }
  //all our animation logic  -->moving etc
  Animate() {
    //jumping function
    //jump animation
    if (keys["Space"] || keys["KeyW"]) {
      this.Jump();
      console.log("jump");
    } else {
      this.jumpTimer = 0;
    }

    //crouch animation
    if (keys["ShiftLeft"] || keys["KeyS"]) {
      this.height = this.originalHeight / 2;
    } else {
      this.height = this.originalHeight;
    }

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

//initializing the game
function Start() {
  context.font = "20px san-serif";
  gameSpeed = 3;
  gravity = 1;
  score = 0;
  highScore = 0;

  player = new Player(25, canvas.height - 150, 50, 50);
  //displaying character on the canvas
  requestAnimationFrame(Update);
}

function Update() {
  requestAnimationFrame(Update);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.Animate();
}
Start();
