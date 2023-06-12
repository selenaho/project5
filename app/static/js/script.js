// Silly Billy Likes Willy
// SoftDev pd8
// ////2023
// P05

var htmlcolor = document.getElementById("color").innerHTML;
var username = document.getElementById("name").innerHTML;
var opponent = document.getElementById("opponent").innerHTML;


var data = {
    game_id: window.location.href.split("/").pop().slice(0,5),
    color: htmlcolor,
    key: null
};

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var collided=false; // TODO: set to actual

var fps=60;
var yAcc = 16;
var fallVel = 6

// bird dimensions
var birdImgWidth = 200;
var birdImgHeight = 220;

//poop dimensions
var poopWidth = 40;
var poopHeight = 35;

var socket = io();
socket.on('connect', function () {
    socket.emit('gamestart', data);
});

var tree1 = new Image();
tree1.src = "../static/assets/tree1.PNG";
var tree2 = new Image();
tree2.src = "../static/assets/tree2.PNG";
var tree3 = new Image();
tree3.src = "../static/assets/tree3.PNG";
var tree4 = new Image();
tree4.src = "../static/assets/tree4.PNG";
var tree5 = new Image();
tree5.src = "../static/assets/tree5.PNG";
var grass = new Image();
grass.src = "../static/assets/grass.PNG";

var cloud1 = new Image();
cloud1.src = "../static/assets/cloud1.PNG";
var cloud2 = new Image();
cloud2.src = "../static/assets/cloud2.PNG";
var cloud3 = new Image();
cloud3.src = "../static/assets/cloud3.PNG";
var cloud4 = new Image();
cloud4.src = "../static/assets/cloud4.PNG";

var poop = new Image();
poop.src = "../static/assets/poop.PNG";

var birdImgs = {
    red:new Image(),
    green:new Image()
}

var poopData = {
    green: {
        active: false,
        x: -1000,
        y: -1000,
        yVel: 0
    },
    red: {
        active: false,
        x: -1000,
        y: -1000,
        yVel: 0
    }
};

var points = {
    red:0,
    green:0
}

socket.on('point_update', (bird_points) => {
    points['red'] = bird_points['red'];
    points['green'] = bird_points['green'];

    document.getElementById("greenpoints").innerHTML="Green: " + bird_points['green'];

    document.getElementById("redpoints").innerHTML="Red: " + bird_points['red'];
})
    

socket.on('draw', function (bird_positions) {
    let game_id = data['game_id'];

    ctx.clearRect(0,0,c.width,c.height);
    // background color
    ctx.fillStyle = "rgb(187, 240, 237)";
    ctx.fillRect(0, 0, c.width, c.height);

    // background images (trees, grass, clouds)
    ctx.drawImage(grass,0,c.height-50,c.width,50);
    ctx.drawImage(tree1,20,c.height-220,100,300);
    ctx.drawImage(tree2,175,c.height-320,100,330);
    ctx.drawImage(tree3,800,c.height-320,100,320);
    ctx.drawImage(tree4,500,c.height-190,100,200);
    ctx.drawImage(tree5,890,c.height-190,100,200);
    ctx.drawImage(cloud1,175,40,100,80);
    ctx.drawImage(cloud2,600,70,150,120);
    ctx.drawImage(cloud3,800,100,130,100);
    ctx.drawImage(cloud4,50,150,120,100);
    
    // collision
    collideInfo = bird_positions[game_id][htmlcolor];


    for (color in bird_positions[game_id]) {
        let info = bird_positions[game_id][color];

        birdImgs[color].src = "../static/assets/"+color+"bird"+info['dir']+".PNG";
        // draw bird
        ctx.drawImage(birdImgs[color],
        info['x'], info['y'], birdImgWidth, birdImgHeight);

        if (poopData[color]['active']) {
            // starting x val for poop
            // check which way bird is facing, poop x-coord will vary bc of this    
            if (poopData[color]['x'] == -1000) {    
                if (info['dir'].charAt(info['dir'].length-1) ==="t") {
                    // left
                    poopData[color]['x'] = info['x']+.5*birdImgWidth;
                }
                else {
                    // right
                    poopData[color]['x'] = info['x']+.25*birdImgWidth;
                }
                // starting y value for poop
                poopData[color]['y'] = info['y']+birdImgHeight+80;
                // console.log("poop: "+poopData[color]['x']);
                // console.log("bird: "+info['x']);
            }
            // if poop out of bounds then set active to false
            if (poopData[color]['x'] > c.width || poopData[color]['x']+poopWidth < 0 || poopData[color]['y'] > c.height || poopData[color]['y']+poopHeight < 0) {
                // reset procedure
                poopData[color]['active'] = false;
                poopData[color]['x'] = -1000;
                poopData[color]['yVel'] = 0;

            }
            else {
                // console.log("poopReal: "+poopData[color]['x']);

                ctx.drawImage(poop,poopData[color]['x'],poopData[color]['y'],poopWidth,poopHeight);
                // accelerate
                poopData[color]['yVel'] = Math.min(fallVel, poopData[color]['yVel']+=yAcc/fps);
                // update y value
                poopData[color]['y']+=poopData[color]['yVel'];
            }
        }     
        

        //collide

            if (poopData[color]['x'] < collideInfo['x']+birdImgWidth && poopData[color]['x'] > collideInfo['x']) {
                if (poopData[color]['y'] < collideInfo['y']+birdImgHeight && poopData[color]['y'] > collideInfo['y']) {
                    collided = true;
                    console.log(color)
                }
                if (poopData[color]['y']+poopHeight < collideInfo['y']+birdImgHeight && poopData[color]['y']+poopHeight > collideInfo['y']) {
                    collided = true;
                    console.log(color)

                }
            }
            if (poopData[color]['x']+poopWidth < collideInfo['x']+birdImgWidth && poopData[color]['x']+poopWidth > collideInfo['x']) {
                if (poopData[color]['y'] < collideInfo['y']+birdImgHeight && poopData[color]['y'] > collideInfo['y']) {
                    collided = true;
                    console.log(color)

                }
                if (poopData[color]['y']+poopHeight < collideInfo['y']+birdImgHeight && poopData[color]['y']+poopHeight > collideInfo['y']) {
                    collided = true;
                    console.log(color)

                }
                
            }
            if (collided) {
                poopData[color]['active'] = false;
                poopData[color]['x'] = -1000;
                poopData[color]['yVel'] = 0;
            }
    }

    if (collided) {
        if (data['color'] === "red") {
            points['green'] +=1;
        }
        else {
            points['red'] += 1;

        }
        //check if either points['green'] or points['red'] == 5
        //if either of the players won -->
        
        collided = false;
        socket.emit('collided', [data, points]);
    }

    if(points['green']==5 || points['red']==5) {
        if (points['green'] == 5) {
            colorWinner = 'green';
        }
        else {
            colorWinner = 'red';
        }
        
        if (colorWinner == htmlcolor) {
            winner = username;
        } 
        else {
            winner = opponent;
        }
        
        destination = "/winner/" + data['game_id']
        const form = document.createElement('form');

        form.method = 'POST';
        form.action = destination;
        form.style.display = "none";
        const inputField1 = document.createElement('input');
        inputField1.type = 'text';
        inputField1.name = 'winner';
        inputField1.value = winner;

        form.appendChild(inputField1);
        document.body.appendChild(form);

        form.submit();
    }

    
}); 

document.onkeydown = (e) => {
    let key = e.code.toLowerCase().replace("arrow","");
    if (['up','left','right'].includes(key)) {
        data['key'] = key;
    }

    if (key==='down') {
        if (!poopData[htmlcolor]['active']) {
            socket.emit('pooped', data);
            data['key']="down";
        }
    }        
}

socket.on('has_pooped', (color) => {
        poopData[color]['active'] = true;
})


document.onkeyup = (e) => {
    data['key'] = null;
}

var requestID;

var drawGame = function() {
    window.cancelAnimationFrame(requestID);
    
    setTimeout(() => {

        socket.emit('frame',data);
        requestID = window.requestAnimationFrame(drawGame);
    }, 1000/fps);
}
drawGame();




//drawgame emits event frame --> __init__ --> sends event called draw


// make the game ---------------------------------------------------------------------------
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

    // var poop = new Image();
    // poop.src = "../static/assets/poop.PNG";

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

