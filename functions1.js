
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var foodAmount = document.getElementById("foodAmount");
var food = 0;

var x = 0; //coordinates of player
var y = 0;

var enemies = [20]; 


/**
 * Generates walls and spaces of map.
 */
function generateMap() {
  for (var X = 0; X < 60; X++) {
    for (var Y = 0; Y < 50; Y++) {
      if (Math.random() < 0.30) {
        ctx.fillStyle = 'rgb(0,0,0)'
        ctx.fillRect(X * 10, Y * 10, 10, 10);
      }
      else {
        ctx.fillStyle = 'rgb(255,255,255)'
        ctx.fillRect(X * 10, Y * 10, 10, 10);
      }
    }
  }
}


generateMap(); //generate blank map for user to see 


/**
 * Clears player current location
 */
function clear() {
  ctx.fillStyle = 'rgb(255,255,255)'
  ctx.fillRect(x, y, 10, 10);
}


/**
 * Moves player accordingly to arrowkey pressed
 * @param {string} d for 'direction'- shall be single letter indicating direction of move
 */
function move(d) {
  var imgd = ctx.getImageData(x + 5, y + 5, 1, 1);
  var pix = imgd.data;
  ctx.fillStyle = 'rgb(254,50,0)'
  if (pix[0] == 255) {
    ctx.fillRect(x, y, 10, 10);
  }
  else if (pix[0] == 20) {   // checks for R value in RGB value of food color (blue)
    ctx.fillRect(x, y, 10, 10);
    food += 1;
    foodAmount.innerHTML = food;
    if (food == 6) {
      ctx.clearRect(0, 0, 600, 500)
      alert("You Won! Press OK to play again.") 
      generateMap() //resets map
      generateFood()
      generateEnemies()
      food = 0; //resets counter
      foodAmount.innerHTML = food;
    }
  }
  else {   //if move attempted into wall, revert coordinate
    if (d == "L") {
      x = x + 10;
      ctx.fillRect(x, y, 10, 10);
    }
    else if (d == "R") {
      x = x - 10;
      ctx.fillRect(x, y, 10, 10);
    }
    else if (d == "U") {
      y = y + 10;
      ctx.fillRect(x, y, 10, 10);
    }
    else if (d == "D") {
      y = y - 10;
      ctx.fillRect(x, y, 10, 10);
    }
  }
}


/**
 * Main play function completing map generation and starting game with arrow key listener. 
 */
function play() {
  
  generateFood();
  generateEnemies();

  document.getElementById("playbutton").disabled = true;

  x = Math.round(Math.random() * 60) * 10;     //random starting location of player generated
  y = Math.round(Math.random() * 50) * 10;

  ctx.fillStyle = 'rgb(254,50,0)'
  ctx.fillRect(x, y, 10, 10);
  
  document.addEventListener("keydown", function(event) {
    const key = event.key;
    switch (key) {
      case "ArrowLeft":
        clear()
        x = x - 10;
        move("L")
        break;
      case "ArrowRight":
        clear()
        x = x + 10;
        move("R")
        break;
      case "ArrowUp":
        clear()
        y = y - 10;
        move("U")
        break;
      case "ArrowDown":
        clear()
        y = y + 10;
        move("D")
        break;
    }
  });
}


/**
 * Randomly generates locations of set amount of food.
 */
function generateFood() {
  for (var i = 0; i < 8; i++) {
    ctx.fillStyle = 'rgb(20,0,255)'
    ctx.fillRect(Math.round(Math.random() * 60) * 10, Math.round(Math.random() * 50) * 10, 10, 10);
  }
}


/**
 * Randomly generates locations of set amount of enemies and adds to list. 
 */
function generateEnemies() {
  for (var i = 0; i < 20; i++) {

    var xen = Math.round(Math.random() * 60) * 10;
    var yen = Math.round(Math.random() * 50) * 10;

    ctx.fillStyle = 'rgb(230,0,255)'
    ctx.fillRect(xen, yen, 10, 10);

    enemies[i] = new Enemy(xen, yen);  
  }
}


/**
 * Simple Enemy class able to track and set Enemy coordinates. 
 */
class Enemy {
  
  constructor(xen, yen) {
    this.xen = xen;
    this.yen = yen;

    this.getX = () => {return xen}
    this.getY = () => {return yen}

    this.setX = (value) => {xen = value}
    this.setY = (value) => {yen = value}
  }
}


/**
 * Clears Enemy at entered x, y coordinates
 * @param {int} xen x coordinate of enemy
 * @param {int} yen y coordinate of enemy
 */
function clearEnemy(xen, yen) {
  ctx.fillStyle = 'rgb(255,255,255)'
  ctx.fillRect(xen, yen, 10, 10);
}


/**
 * Moves enemy accorindly.
 * @param {int} xen x coordinate of enemy
 * @param {int} yen y coordinate of enemy
 * @param {string} d direction of enemy movement
 * @param {int} i index of enemy in list
 */
function moveEnemy(xen, yen, d, i) {
  var imgd = ctx.getImageData(xen + 5, yen + 5, 1, 1);
  var pix = imgd.data;
  ctx.fillStyle = 'rgb(230,0,255)'
  if (pix[0] == 255) {
    ctx.fillRect(xen, yen, 10, 10);
    enemies[i].setX(xen)
    enemies[i].setY(yen)
  }
  else if (pix[0] == 254) {     // R value of player character, if moved on end game
    ctx.clearRect(0, 0, 600, 500)
    alert("You Lost! Press OK to play again.")
    generateMap()
    generateFood()
    generateEnemies()
    food = 0;
    foodAmount.innerHTML = food;
  }
  else {    // if wall encountered revert coordinates 
    if (d == "L") {
      ctx.fillRect(xen + 10, yen, 10, 10);
      enemies[i].setX(xen + 10)
    }
    else if (d == "R") {
      ctx.fillRect(xen - 10, yen, 10, 10);
      enemies[i].setX(xen - 10)
    }
    else if (d == "U") {
      ctx.fillRect(xen, yen + 10, 10, 10);
      enemies[i].setY(yen + 10)
    }
    else if (d == "D") {
      ctx.fillRect(xen, yen - 10, 10, 10);
      enemies[i].setY(yen - 10)
    }
  }
}


/**
 * Simulates movement for all enemies in list
 */
function simulateEnemies() {
  
  for (var i = 0; i < enemies.length; i++) {
    
    var xen = enemies[i].getX();
    var yen = enemies[i].getY();

    var dec = Math.random();  //currently movement decided by simple random number - random movement
    clearEnemy(xen, yen)
    
    if (dec < 0.25) {
      xen = xen - 10;
      moveEnemy(xen, yen, "L", i)
    }
    else if (dec >= 0.25 && dec < 0.5) {
      xen = xen + 10;
      moveEnemy(xen, yen, "R", i)
    }
    else if (dec >= 0.5 && dec < 0.75) {
      yen = yen - 10;
      moveEnemy(xen, yen, "U", i)
    }
    else {
      yen = yen + 10;
      moveEnemy(xen, yen, "D", i)
    }
  }
}


/**
 * Main method starting game
 */
function run() {
  play();
  
  for (var i = 0; i < 100000; i++) {
    setTimeout(simulateEnemies, i * 100);
  }
}










    




