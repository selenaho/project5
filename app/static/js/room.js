// Silly Billy Likes Willy
// SoftDev pd8
// ////2023
// P05


// html manipulating ---------------------------------------------------------------------
// var bird_color = document.getElementById("birdColor");

// var display_chosen_color = () => {

//     var selected_color = document.getElementById("selectedColor");
//     selected_color.innerHTML = "<p>The color you selected is " + bird_color.value + "</p>";

// }

// bird_color.addEventListener("change", display_chosen_color);

// var formChange = () => {
//     color = document.getElementById("birdColor").value
// }

var data = {
    game_id: window.location.href.split("/").pop().slice(0,5),
    username: document.getElementById("username").innerHTML
};

// connect client ----------------------------------------------------------------------
var socket = io();
socket.on('connect', function () {
    socket.emit('sendusername', data);
});

socket.on('message', function (message) {
    console.log(message);
    // let msg_list = document.getElementById("msg");
    // let li = document.createElement("li");
    // li.textContent = message;
    // msg_list.appendChild(li);

    var msg = document.getElementById("msg");
    msg.innerHTML = "<p>User(s) in this room: " + message + "</p>";
});


var checkboxClicked = (checkbox) => {
    if (checkbox.checked) {
        socket.emit('checked', data);
    }
    else {
        socket.emit('unchecked', data);
    }
};

socket.on('readyToPlay', function (id) {
    console.log("READY TO PLAY");
    //console.log(window.location.host)
    host = window.location.host;
    destination = '/game/' + id;
    window.location.pathname = destination;
    //socket.emit('sendToGame');
});