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
let speed;
let keys = [];

