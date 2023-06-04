// Silly Billy Likes Willy
// SoftDev pd8
// ////2023
// P05

var c = document.getElementById("game");

var ctx = c.getContext("2d");

var bird = new Image();
bird.src = "birdmid.jpg";

var drawGame = function() {
    // var rectWidth = 120;
    // var rectHeight = 60;

    console.log("running drawgame");
    // ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(bird,c.width/4,c.height,200,220);
}

var requestID;

var dvdLogoSetup = function() {
    window.cancelAnimationFrame(requestID);

    var rectWidth = 200;
    var rectHeight = 220;

    var rectX = 0;
    var rectY = 0;

    var xVel = 0;
    var yVel = 1;

    var bird = new Image();
    bird.src = "birdmid.jpg";

    var dvdLogo = function() {
        ctx.clearRect(0,0,c.width,c.height);
        ctx.drawImage(bird,rectX,rectY,rectWidth,rectHeight);

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
            yVel = 0;
        }

        // check if user clicks arrows
        document.onkeydown = (e) => {
            e = e || window.event;
            if (e.keyCode === 38) {
                //up key
                yVel = -1;
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

        requestID = window.requestAnimationFrame(dvdLogo);
    };
    dvdLogo();
};

dvdLogoSetup();