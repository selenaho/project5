console.log(document.getElementById("color").innerHTML)

// // Silly Billy Likes Willy
// // SoftDev pd8
// // ////2023
// // P05

// // make the game ---------------------------------------------------------------------------
// var c = document.getElementById("game");

// var ctx = c.getContext("2d");

// // control panel
// var fallVel = 6;
// var poopVel = 4;
// var flapVel = -6;
// var moveVel = 5;
// var fps = 60;
// var yAcc = 16;

// //poop dimensions
// var poopWidth = 40;
// var poopHeight = 35;

// // bird dimensions
// var rectWidth = 200;
// var rectHeight = 220;

// var requestID;
// var poopList = [];

// var drawGame = function() {
//     window.cancelAnimationFrame(requestID);

//     //bird coords
//     var rectX = 0;
//     var rectY = 0;

//     //poop coords
//     var poopX = 0;
//     var poopY = 0;

//     var xVel = 0;
//     var yVel = fallVel;

//     var up = false;
//     var left = false;

//     var bird = new Image();
//     bird.src = "../static/assets/birdup.PNG";

//     var poop = new Image();
//     poop.src = "../static/assets/poop.PNG";

//     var tree1 = new Image();
//     tree1.src = "../static/assets/tree1.PNG";
//     var tree2 = new Image();
//     tree2.src = "../static/assets/tree2.PNG";
//     var tree3 = new Image();
//     tree3.src = "../static/assets/tree3.PNG";
//     var tree4 = new Image();
//     tree4.src = "../static/assets/tree4.PNG";
//     var tree5 = new Image();
//     tree5.src = "../static/assets/tree5.PNG";
//     var grass = new Image();
//     grass.src = "../static/assets/grass.PNG";

//     var cloud1 = new Image();
//     cloud1.src = "../static/assets/cloud1.PNG";
//     var cloud2 = new Image();
//     cloud2.src = "../static/assets/cloud2.PNG";
//     var cloud3 = new Image();
//     cloud3.src = "../static/assets/cloud3.PNG";
//     var cloud4 = new Image();
//     cloud4.src = "../static/assets/cloud4.PNG";


//     var drawBird = function() {
//         ctx.clearRect(0,0,c.width,c.height);

//         // background color
//         ctx.fillStyle = "rgb(187, 240, 237)";
//         ctx.fillRect(0, 0, c.width, c.height);

//         // background images (trees, grass, clouds)
//         ctx.drawImage(grass,0,c.height-50,c.width,50);
//         ctx.drawImage(tree1,20,c.height-220,100,300);
//         ctx.drawImage(tree2,175,c.height-320,100,330);
//         ctx.drawImage(tree3,800,c.height-320,100,320);
//         ctx.drawImage(tree4,500,c.height-190,100,200);
//         ctx.drawImage(tree5,890,c.height-190,100,200);
//         ctx.drawImage(cloud1,175,40,100,80);
//         ctx.drawImage(cloud2,600,70,150,120);
//         ctx.drawImage(cloud3,800,100,130,100);
//         ctx.drawImage(cloud4,50,150,120,100);


//         // draw bird
//         ctx.drawImage(bird,rectX,rectY,rectWidth,rectHeight);

//         // x-axis bounds
//         // if bird goes beyond left bound
//         if (rectX + rectWidth-20 < 0) {
//             rectX = c.width-20;
//         }
//         // if bird goes beyond right bound
//         if (rectX+20 > c.width) {
//             rectX = -1*rectWidth+20;
//         }

//         // y-axis bounds
//         //hits upper bound
//         if (rectY + rectHeight < 0) {
//             rectY = c.height - rectHeight;
//         }
//         //lower bound
//         // if (rectY + rectHeight-70 > c.height) {
//         //     if (!up) {
//         //         yVel = 0;
//         //     }
//         // }

//         // check if user clicks arrows
//         document.onkeydown = (e) => {
//             e = e || window.event;
//             if (e.keyCode === 38) {
//                 //up key
//                 if (yVel > 1) {
//                     yVel = flapVel;
//                     up = true;

//                     if (left) {
//                         bird.src = "../static/assets/birddownleft.PNG";
//                     }
//                     else {
//                         bird.src = "../static/assets/birddown.PNG";
//                     }
//                 }
                

//                 // make bird flap down

//             } else if (e.keyCode === 40) {
//                 //down key
//                 if (poopList.length === 0) {
//                     poopList.push(poop);
//                     // check which way bird is facing, poop x-coord will vary bc of this
//                     if (left) {
//                         poopX = rectX+.5*rectWidth;
//                     }
//                     else {
//                         poopX = rectX+.25*rectWidth;
//                     }
//                     poopY = rectY+rectHeight-80;
//                 }
//             } else if (e.keyCode === 37) {
//                 //left key
//                 left = true;
//                 xVel = -1*moveVel;
//             } else if (e.keyCode === 39) {
//                 //right key
//                 left = false;
//                 xVel = moveVel;
//             }
//           };

//           document.onkeyup = (e) => {
//             e = e || window.event;
//             if (e.keyCode === 38) {
//                 //up key
//                 // yVel = fallVel;
//                 up = false;

//                 // make bird flap up
                
//             } else if (e.keyCode === 40) {
//                 //down key

//             } else if (e.keyCode === 37) {
//                 //left key


//                 xVel = 0;
//             } else if (e.keyCode === 39) {
//                 //right key

//                 xVel = 0;
//             }
//           };
          
//         // check if there's a poop on the screen
//         if (poopList.length>0) {
//             ctx.drawImage(poop,poopX,poopY,poopWidth,poopHeight);
//             if (poopX > c.width || poopX+poopWidth < 0) {
//                 poopList.pop();
//             }
//             if (poopY > c.height || poopY+poopHeight < 0) {
//                 poopList.pop();
//             }
//             poopY += poopVel;
//         }

//         if (yVel > 0) {
//             if (left) {
//                 bird.src = "../static/assets/birdupleft.PNG";
//             }
//             else {
//                 bird.src = "../static/assets/birdup.PNG";
//             }
//         }

//         var state = "up";
//         if (Math.abs(xVel) === moveVel) {
//             state="mid";
//             console.log(state)
//         }
//         src = "../static/assets/bird"+state;
//         if (left) {
//             src="../static/assets/bird"+state+"left";
//         }
//         bird.src = src+".PNG";
//         console.log(bird.src);


        

//         rectX += xVel;
//         rectY += yVel;

//         rectY = Math.min(rectY, c.height - rectHeight+70)

//         yVel += yAcc/fps;
//         yVel = Math.min(fallVel, yVel);

//         // sign = xVel/Math.abs(xVel)
//         // xVel = (sign) * (Math.abs(xVel)-xAcc/fps);
//         // xVel = sign * Math.max(0, Math.abs(xVel));
        
//         setTimeout(() => {
//             requestID = window.requestAnimationFrame(drawBird);
//         }, 1000/fps);

//         // requestID = window.requestAnimationFrame(drawBird);

//     };
//     drawBird();
// };

// drawGame();

