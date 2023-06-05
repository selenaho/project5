// Silly Billy Likes Willy
// SoftDev pd8
// ////2023
// P05

// make the game ---------------------------------------------------------------------------
var c = document.getElementById("game");

var ctx = c.getContext("2d");

// control panel
fallVel = 3

var requestID;

var drawGame = function() {
    window.cancelAnimationFrame(requestID);

    var rectWidth = 200;
    var rectHeight = 220;

    //bird coords
    var rectX = 0;
    var rectY = 0;

    //poop coords
    var poopX = 0;
    var poopY = 0;

    var xVel = 0;
    var yVel = fallVel;

    var up = false;

    var bird = new Image();
    bird.src = "birdup.PNG";

    var poop = new Image();
    poop.src = "poop.jpg";

    var drawBird = function() {
        ctx.clearRect(0,0,c.width,c.height);
        ctx.drawImage(bird,rectX,rectY,rectWidth,rectHeight);
        ctx.drawImage(poop,poopX,poopY,75,50);

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
        if (rectY + rectHeight-100 > c.height) {
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
            } else if (e.keyCode === 40) {
                //down key

            } else if (e.keyCode === 37) {
                //left key
                bird.src = "birdmid.PNG"
                xVel = -3;
            } else if (e.keyCode === 39) {
                //right key
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
            } else if (e.keyCode === 40) {
                //down key

            } else if (e.keyCode === 37) {
                //left key
                bird.src = "birdup.PNG"

                xVel = 0;
            } else if (e.keyCode === 39) {
                //right key
                bird.src = "birdup.PNG"

                xVel = 0;
            }
          };
          
        rectX += xVel;
        rectY += yVel;
        poopY += 1;

        requestID = window.requestAnimationFrame(drawBird);
    };
    drawBird();
};

drawGame();

