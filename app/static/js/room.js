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

var color = null;

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
    // console.log(message);
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

socket.on("color", (colorinfo) => {
    if (colorinfo[0] == data['username']) {
        color = colorinfo[1]
    }
})

socket.on('readyToPlay', function (id) {
    destination = '/game/' + id;
    
    const form = document.createElement('form');

    form.method = 'POST';
    form.action = destination;
    form.style.display = "none";
    const inputField1 = document.createElement('input');
    inputField1.type = 'text';
    inputField1.name = 'color';
    inputField1.value = color;

    form.appendChild(inputField1);
    document.body.appendChild(form);

    form.submit();

    // console.log("READY TO PLAY");
    // //console.log(window.location.host)
    // host = window.location.host;


    // window.location.pathname = destination;
    //socket.emit('sendToGame');
});