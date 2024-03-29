

// state variables
var windowState;
var gameMode;
var numBits;
var mouseDown;

// in game variables
var currentBits;
var currentHex;
var score;
var health;
var lossHealthRate;

// visuals
var scoreColor;
var spacingX;
var spacingY;
var dimmed;
var mobilePixels;

// constants
var eightBitHotkeys;
var fourBitHotkeys;
var labels;

// theme
var rain;
var lightnings;
var numLightnings;
var variance;
var numPoints;
var flowerRandomness;
var killerRandomness;
var killerLightnings;
var killerLightningTimer;
var killerLightningFrames;

var mobileMode;

let debugText;

let settingsIcon;
function preload() {
  settingsIcon = loadImage('assets/settingsIcon.png');
}

function setup() {
  debugText = "debug text";
  // createCanvas(500,500);
  // createCanvas(displayWidth,displayHeight);
  createCanvas(windowWidth,windowHeight);

  noStroke();
  fill(0);
  textAlign(CENTER,CENTER);
  
  eightBitHotkeys = "asdfjkl;";
  fourBitHotkeys = "XXfghj";
  labels = ["80","40","20","10","08","04","02","01"]; // deprecate?
  spacingX = (width / 8);
  spacingY = (height / 8);
  mobilePixels = 510;

  mobileMode = width < mobilePixels;

  windowState = "menu"; // menu, game, gameOver, reset, tutorial, hexTable, settings
  // gameMode = mobileMode ? "easy" : "normal"; // normal, easy
  gameMode = "easy"; // normal, easy

  rain = [];
  for(var i = 0; i < 200; i++) {
    rain.push(new Rain());
  }

  // numLightnings = mobileMode ? 2 : 7;
  numLightnings = 2;
  variance = 5;
  numPoints = 20;
  flowerRandomness = 50;
  killerRandomness = 40;
  // for(var i = 0; i < 10; i++) {
  //   lightnings.push(generateLightningPoints(createVector(50,50), createVector(500 + random(-200,200),500 + random(-200,200))));
  // }
  killerLightningFrames = 5;

  textFont('Trebuchet MS');


  initialize();

}

function initialize() {
  currentBits = [false,false,false,false,false,false,false,false];
  if(gameMode == "normal") {
    numBits = 2;
  }
  else if (gameMode == "easy") {
    numBits = 1;
  }

  currentHex = generateHexBit(numBits);
  score = 0;
  health = 100;
  lossHealthRate = 0;
  scoreColor = "white";
  mouseDown = false;
  dimmed = false;

  lightnings = [];
  killerLightnings = [];
  killerLightningTimer = killerLightningFrames;

}


function draw() {

  

  // image(settingsIcon, 0, 0, 10, 10);

  if (windowState == "menu") {
    drawMenu();
  }
  else if(windowState == "game") {
    runGame();
  }

  else if(windowState == "gameOver") {
    gameOver();
  }

  else if(windowState == "reset") {
    initialize();
    windowState = "game";
  }

  else if (windowState == "tutorial") {
    drawTutorial();
  }
  
  else if (windowState == "hexTable") {
    drawHexTable();
  }

  else if (windowState == "settings") {
    drawSettings();
  }

  if(windowState != "gameOver") {
    push();
    for(var i = 0; i < rain.length; i++) {
      rain[i].draw();
      rain[i].update();
    }
    pop();
  }
  

  // draw debug text in center of screen
  // push();
  // fill(255);
  // textSize(20);
  // text(debugText, width/2, height/2);
  // pop();

}

function runGame() {
  background(0);
  
  checkForClick();

  placeLightningOnBits("flower");
  // placeLightningOnBits("killer");
  drawLightning();
  drawKillerLightnings();
  // killerLightnings = [];
  lightnings = [];
  if(killerLightnings.length != 0) {
    // var numToGenerate = killerLightnings.length; 
    if(killerLightningTimer > 0) {
      killerLightningTimer--;
    } 
    else {
      killerLightnings = [];
      killerLightningTimer = killerLightningFrames;
    }
  }

  if(gameMode == "normal") {
    drawEightBits();
  }
  else if(gameMode == "easy") {
    drawFourBits();
  }
  
  

  
  // if(gameMode == "funMode")
  //   if(!(currentHex.includes("B") || currentHex.includes("D"))) nextRound();

  // draw the hex
  fill("blue");
  textSize(Math.pow(spacingX, 0.5)*15);
  textFont('Georgia');
  text(currentHex, width/2, height/2);
  textFont('Trebuchet MS');
  
  // draw the score
  textSize(30);
  fill(scoreColor);
  push();
  textAlign(LEFT,CENTER);
  text("Score: " + score, 10, spacingY/3);
  pop();

  
  if(health > 0) health -= lossHealthRate;
  if(health <= 0) {
    health = 0;
    windowState = "gameOver";
  }
  drawHealth();

  textSize(20);
  fill(255);
  text("Highscore: " + getHighscore(), width - 75, spacingY/3);
  
}

function drawEightBits() {
  rectMode(CORNER);
  push()
  for(var i = 0; i < 8; i++) {
    
    stroke("white");
    textSize(spacingX/4);

    fill(255);
    // text(labels[i], i * spacingX+spacingX/2, height - 2*spacingX+2*spacingX/3);
    if(!mobileMode)
      text(eightBitHotkeys[i], i * spacingX+spacingX/2, height - 2*spacingX+2*spacingX/3);

    if(currentBits[i]) {
      fill(255);
      rect(i * spacingX, height - spacingX, spacingX, spacingX, 20);
      fill(0);
      text(+currentBits[i], i * spacingX+spacingX/2, height - spacingX+spacingX/2);
    } 
    else {
      fill(0);
      rect(i * spacingX, height - spacingX, spacingX, spacingX, 20);
      fill(255);
      text(+currentBits[i], i * spacingX+spacingX/2, height - spacingX+spacingX/2);
      // text(eightBitHotkeys[i], i * spacingX+spacingX/2, height - spacingX+spacingX/2);
    }
    
  }
  pop();
  var bits = readEightBits();
  fill(255);

  textSize(spacingX/2);
  text(bits, width - spacingX, height - 2*spacingX);
}

function drawFourBits() {
  rectMode(CORNER);
  push()
  var temp = spacingX;
  var adjust = 0;
  if(mobileMode) {
    //mobile want bits to be larger
    temp = spacingX;
    spacingX = spacingX*2
    adjust = 2;

  }
  for(var i = 2; i < 6; i++) {
    
    stroke("white");
    textSize(spacingX/4);

    fill(255);
    // text(labels[i+2][1], (i-adjust) * spacingX+spacingX/2, height - 2*spacingX+2*spacingX/3);
    if(!mobileMode)
      text(fourBitHotkeys[i], (i-adjust) * spacingX+spacingX/2, height - 2*spacingX+2*spacingX/3);

    if(currentBits[i]) {
      fill(255);
      rect((i-adjust) * spacingX, height - spacingX, spacingX, spacingX, 20);
      fill(0);
      text(+currentBits[i], (i-adjust) * spacingX+spacingX/2, height - spacingX+spacingX/2);
    } 
    else {
      fill(0);
      rect((i-adjust) * spacingX, height - spacingX, spacingX, spacingX, 20);
      fill(255);
      text(+currentBits[i], (i-adjust) * spacingX+spacingX/2, height - spacingX+spacingX/2);
    }
    
  }
  pop();
  var bits = readFourBits();
  fill(255);

  textSize(spacingX/2);
  text(bits, width - spacingX, height - 2*spacingX);

  spacingX = temp;

}

function placeLightningOnBits(lightningType) {
  // lightningType is either "flower" or "killer"
  var start;
  var end;
  if(gameMode == "easy" && mobileMode) {

    var mobileSpacing = spacingX * 2;
    for(var i = 0; i < 4; i++) {
  
      if (currentBits[i+2]) {
        for(var lightningi = 0; lightningi < numLightnings; lightningi++) {
          start = createVector(mobileSpacing * i + mobileSpacing/2, height - mobileSpacing/2);
          // end = createVector(width/2 + random(-randomness,randomness), height/2 + random(-randomness,randomness));
          if(lightningType == "flower") {
            end = createVector(mobileSpacing * i + mobileSpacing/2 + random(-flowerRandomness*2,flowerRandomness*2), height - mobileSpacing*3/2 + random(-flowerRandomness,flowerRandomness));
            lightnings.push(generateLightningPoints(start, end));
          }
          else if(lightningType == "killer") {
            end = createVector(width/2 + random(-killerRandomness,killerRandomness), height/2 + random(-killerRandomness,killerRandomness));
            killerLightnings.push(generateLightningPoints(start, end));
          }
        }
      }
    }
  
  }
  else {
    for(var i = 0; i < 8; i++) {
    
      if (currentBits[i]) {
        for(var lightningi = 0; lightningi < numLightnings; lightningi++) {
          start = createVector(spacingX * i + spacingX/2, height - spacingX/2);
          // end = createVector(width/2 + random(-randomness,randomness), height/2 + random(-randomness,randomness));
          if(lightningType == "flower") {
            end = createVector(spacingX * i + spacingX/2 + random(-flowerRandomness,flowerRandomness), height - spacingX*3/2 + random(-flowerRandomness,flowerRandomness));
            lightnings.push(generateLightningPoints(start, end));
          }
          else if(lightningType == "killer") {
            end = createVector(width/2 + random(-killerRandomness,killerRandomness), height/2 + random(-killerRandomness,killerRandomness));
            killerLightnings.push(generateLightningPoints(start, end));
          }

        }
      }
    }
  }
}

function drawHealth() {

  let len = 3*width/4;

  fill("red");
  rect((width - len)/2, height/4, len, 15, 4)
  fill("green");
  rect((width - len)/2, height/4, len*health/100, 15, 4)
}

function generateHexBit(bits) {
  var hex = "";
  for (var i = 0; i < bits; i++) {
    // var num = floor(random() * 255)+1;
    var num = floor(random() * 15)+1;
    // console.log(num);
    // console.log(floor(num/16).toString(16).toUpperCase());
    // console.log((num % 16).toString(16).toUpperCase());
    // var hex = floor(num/16).toString(16).toUpperCase() + (num % 16).toString(16).toUpperCase()
    hex += num.toString(16).toUpperCase();
  }
  
  // console.log(hex);
  return hex;
  
}

function readEightBits() {
  var total = 0;
  for(var i = 0; i < 8; i++) {
    if(currentBits[i]) total += 1 << (7 - i);
  }
  total = total.toString(16).toUpperCase();
  if(total.length == 1) total = "0" + total;
  return total;
}

function readFourBits() {
  var total = 0;
  for(var i = 2; i < 6; i++) {
    if(currentBits[i]) total += 1 << (3 - (i-2));
  }
  total = total.toString(16).toUpperCase();
  // if(total.length == 1) total = "0" + total;
  return total;
}

function check() {
  
  if((gameMode == "normal" && readEightBits() == currentHex) 
      || (gameMode == "easy" && readFourBits() == currentHex)) {
    nextRound();
  }
}

function nextRound() {

  placeLightningOnBits("killer");

  currentHex = generateHexBit(numBits);
  currentBits = [false,false,false,false,false,false,false,false];
  score += 1;
  health = 100;

  if(lossHealthRate < 1) lossHealthRate += 0.05;
  else if(lossHealthRate >= 1.2) {
    scoreColor = "#5555ff";
    lossHealthRate += 0.001;
    // 100 health / 1.2 health per frame = 83.33 frames
    // 83 frames * 1 second per 60 frames = 1.389 seconds

  }
  else if(lossHealthRate >= 1) { 
    // occurs at a score of 20


    // 60 frames per second
    // -1 health per frame
    // 100 health total
    // 100 frames to die
    // 100 frames * 1 second per 60 frames = 1.66 seconds

    // console.log("you are at max speed!")
    scoreColor = "lightgreen";
    lossHealthRate += 0.01;
  }
  lossHealthRate = Number.parseFloat(lossHealthRate.toPrecision(6));


}

function getHighscore() {
  if(gameMode == "normal") {
    return 27;
  }
  else if (gameMode == "easy") {
    return 117;
  }
}

// assuming centered
function mouseIsIn(x,y,w,h) {
  // console.log(mobileMode);
  if (!mobileMode) {
    return (x - w/2) <= mouseX && mouseX <= (x + w/2) && y - h/2 <= mouseY && mouseY <= y + h/2;
  }
  for (let i = 0; i < touches.length; i++) {
    if (x - w/2 <= touches[i].x && touches[i].x <= x + w/2 && y - h/2 <= touches[i].y && touches[i].y <= y + h/2) {
      return true;
    }
  }
}


function keyPressed() {
  // debugText += "?";
  if(windowState == "game") {

    if(gameMode == "normal") {
      for(var i = 0; i < eightBitHotkeys.length; i++) {
        if(key.toLowerCase() == eightBitHotkeys[i]) {
          currentBits[i] = !currentBits[i];
        }
      }
    }
    else if(gameMode == "easy") {
      for(var i = 2; i < fourBitHotkeys.length; i++) {
        if(key.toLowerCase() == fourBitHotkeys[i]) {
          currentBits[i] = !currentBits[i];
        }
      }
    }

    

  }
  else if(windowState == "gameOver") {
    if(key == 'r') {
      windowState = "reset";
    }
  }

  if(keyCode == BACKSPACE) {
    currentBits = [false,false,false,false,false,false,false,false];
  }

  // if(key == '6') {
  //   nextThing();
  // }
  // if(key == '9') {
  //   state = "gameOver";
  // }
  

  // if(keyCode == ENTER) {
    check(); 
  // }
}

function checkForClick() {
  if(!mouseDown) return;

  if (mobileMode) {
    if (windowState == "game") {
      return;
    }

    for (var i = 0; i < touches.length; i++) {
      // console.log(touches[i].x, touches[i].y);
      let touchX = touches[i].x;
      let touchY = touches[i].y;
      
      if (gameMode == "normal") {
        let pos = floor(map(touchX, 0,width,0,8));
        currentBits[pos] = !currentBits[pos];
        mouseDown = false;
        check();
      }
      if (gameMode == "easy") {
        if(touchY > height-2*spacingX) {
          let pos = floor(map(touchX, 0,width,0,4)) + 2;
          currentBits[pos] = !currentBits[pos];
          mouseDown = false;
          check();
          debugText += "flip2";

        }
      }

    }

    
  }
  // desktop mode
  else {
    if (gameMode == "normal") {
      let pos = floor(map(mouseX, 0,width,0,8));
      currentBits[pos] = !currentBits[pos];
      mouseDown = false;
      check();
    }
    if (gameMode == "easy") {
      let pos = floor(map(mouseX, 0,width,0,8));
      // only flip bit if pos is between 2 and 5
      if (2 <= pos && pos <= 5)
        currentBits[pos] = !currentBits[pos];
      mouseDown = false;
      check();
      debugText += "flip2";

    }
  }

  // if(mobileMode && gameMode == "easy") {
  //   // mobile buttons are different FOR EASY MODE
  //   if(mouseY > height-2*spacingX) {
  //     let pos = floor(map(mouseX, 0,width,0,4)) + 2;
  //     currentBits[pos] = !currentBits[pos];
  //     mouseDown = false;
  //     check();
  //   }
    
  // } 

  // else if(mouseY > height-spacingX) {
  //   let pos = floor(map(mouseX, 0,width,0,8));
  //   currentBits[pos] = !currentBits[pos];
  //   mouseDown = false;
  //   check();
  // }
}

function mousePressed() {
  mouseDown = true;
}

function mouseReleased() {
  mouseDown = false;
}

// function touchStarted() {
//   for (var i = 0; i < touches.length; i++) {
//     console.log(touches[i].x, touches[i].y);
//   }
// }

function touchStarted() {

  debugText = "";
  
  for (var i = 0; i < touches.length; i++) {
    console.log(touches[i].x, touches[i].y);
    // text(touches[i].x, touches[i].x, touches[i].y);
    // debugText = "(" + touches[i].x + ", " + touches[i].y + ")";

    // for every touch, add the x y rounded to 2 decimal places to the debug text
    // debugText += "(" + Number.parseFloat(touches[i].x).toPrecision(4) + ", " + Number.parseFloat(touches[i].y).toPrecision(4) + ") ";
  }

  mouseDown = true;
  
  if (windowState != "game") {
    return;
  }
  var i = touches.length - 1;
  // for (var i = 0; i < touches.length; i++) {
    // console.log(i)
    debugText += i;
    // console.log(touches[i].x, touches[i].y);
    let touchX = touches[i].x;
    let touchY = touches[i].y;
    
    if (gameMode == "normal") {
      let pos = floor(map(touchX, 0,width,0,8));
      currentBits[pos] = !currentBits[pos];
      // mouseDown = false;
    }
    if (gameMode == "easy") {
      if(touchY > height-2*spacingX) {
        let pos = floor(map(touchX, 0,width,0,4)) + 2;
        currentBits[pos] = !currentBits[pos];
        // mouseDown = false;
        // debugText += "flip1";
        // debugText += "pos: " + pos + " ";
        // debugText += currentBits;
        debugText += ": "
        for (var j = 2; j < currentBits.length-2; j++) {
          debugText += currentBits[j] ? "1" : "0";
        }
        debugText += " "

      }
    }
  // }
  check();
}

function touchEnded() {
  if (touches.length == 0)
    mouseDown = false;
}