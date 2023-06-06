// Silly Billy Likes Willy
// SoftDev pd8
// ////2023
// P05

// make the game ---------------------------------------------------------------------------
var c = document.getElementById("game");

var ctx = c.getContext("2d");

// control panel
fallVel = 3;
poopVel = 4;

//poop dimensions
var poopWidth = 40;
var poopHeight = 35;

// bird dimensions
var rectWidth = 200;
var rectHeight = 220;

var requestID;
var poopList = [];

var drawGame = function() {
    window.cancelAnimationFrame(requestID);

    //bird coords
    var rectX = 0;
    var rectY = 0;

    //poop coords
    var poopX = 0;
    var poopY = 0;

    var xVel = 0;
    var yVel = fallVel;

    var up = false;
    var left = false;

    var bird = new Image();
    bird.src = "birdup.PNG";

    var poop = new Image();
    poop.src = "poop.PNG";

    var drawBird = function() {
        ctx.clearRect(0,0,c.width,c.height);
        ctx.drawImage(bird,rectX,rectY,rectWidth,rectHeight);

        // x-axis bounds
        // if bird goes beyond left bound
        if (rectX + rectWidth-20 < 0) {
            rectX = c.width-20;
        }
        // if bird goes beyond right bound
        if (rectX+20 > c.width) {
            rectX = -1*rectWidth+20;
        }

        // y-axis bounds
        //hits upper bound
        if (rectY + rectHeight < 0) {
            rectY = c.height - rectHeight;
        }
        //lower bound
        if (rectY + rectHeight-70 > c.height) {
            if (!up) {
                yVel = 0;
            }
        }

        // check if user clicks arrows
        document.onkeydown = (e) => {
            e = e || window.event;
            if (e.keyCode === 38) {
                //up key
                yVel = -4;
                up = true;

                // make bird flap down
                if (left) {
                    bird.src = "birddownleft.PNG";
                }
                else {
                    bird.src = "birddown.PNG";
                }
            } else if (e.keyCode === 40) {
                //down key
                if (poopList.length === 0) {
                    poopList.push(poop);
                    // check which way bird is facing, poop x-coord will vary bc of this
                    if (left) {
                        poopX = rectX+.5*rectWidth;
                    }
                    else {
                        poopX = rectX+.25*rectWidth;
                    }
                    poopY = rectY+rectHeight-80;
                }
            } else if (e.keyCode === 37) {
                //left key
                left = true;
                bird.src = "birdmidleft.PNG"
                xVel = -3;
            } else if (e.keyCode === 39) {
                //right key
                left = false;
                bird.src = "birdmid.PNG"
                xVel = +3;
            }
          };

          document.onkeyup = (e) => {
            e = e || window.event;
            if (e.keyCode === 38) {
                //up key
                yVel = fallVel;
                up = false;

                // make bird flap up
                if (left) {
                    bird.src = "birdupleft.PNG";
                }
                else {
                    bird.src = "birdup.PNG";
                }
            } else if (e.keyCode === 40) {
                //down key

            } else if (e.keyCode === 37) {
                //left key
                bird.src = "birdupleft.PNG"

                xVel = 0;
            } else if (e.keyCode === 39) {
                //right key
                bird.src = "birdup.PNG"

                xVel = 0;
            }
          };
          
        // check if there's a poop on the screen
        if (poopList.length>0) {
            ctx.drawImage(poop,poopX,poopY,poopWidth,poopHeight);
            if (poopX > c.width || poopX+poopWidth < 0) {
                poopList.pop();
            }
            if (poopY > c.height || poopY+poopHeight < 0) {
                poopList.pop();
            }
            poopY += poopVel;
        }

        rectX += xVel;
        rectY += yVel;

        requestID = window.requestAnimationFrame(drawBird);
    };
    drawBird();
};

drawGame();

