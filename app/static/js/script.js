// Silly Billy Likes Willy
// SoftDev pd8
// ////2023
// P05

// make the game ---------------------------------------------------------------------------
var c = document.getElementById("game");

var ctx = c.getContext("2d");

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
    var yVel = 1;

    var up = false;

    var bird = new Image();
    bird.src = "birdmid.PNG";

    var poop = new Image();
    poop.src = "poop.jpg";

    var drawBird = function() {
        ctx.clearRect(0,0,c.width,c.height);
        ctx.drawImage(bird,rectX,rectY,rectWidth,rectHeight);
        ctx.drawImage(poop,poopX,poopY,75,50);

        // x-axis bounds
        // if bird goes beyond left bound
        if (rectX + rectWidth < 0) {
            rectX = c.width-rectWidth;
        }
        // if bird goes beyond right bound
        if (rectX > c.width) {
            rectX = 0;
        }

        // y-axis bounds
        //hits upper bound
        if (rectY + rectHeight < 0) {
            rectY = c.height - rectHeight;
        }
        //lower bound
        if (rectY + rectHeight > c.height) {
            if (!up) {
                yVel = 0;
            }
        }

        // check if user clicks arrows
        document.onkeydown = (e) => {
            e = e || window.event;
            if (e.keyCode === 38) {
                //up key
                yVel = -2;
                up = true;
            } else if (e.keyCode === 40) {
                //down key

            } else if (e.keyCode === 37) {
                //left key
                xVel = -1;
            } else if (e.keyCode === 39) {
                //right key
                xVel = +1;
            }
          };

          document.onkeyup = (e) => {
            e = e || window.event;
            if (e.keyCode === 38) {
                //up key
                yVel = 1;
                up = false;
            } else if (e.keyCode === 40) {
                //down key

            } else if (e.keyCode === 37) {
                //left key
                xVel = 0;
            } else if (e.keyCode === 39) {
                //right key
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

