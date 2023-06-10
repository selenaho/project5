// Silly Billy Likes Willy
// SoftDev pd8
// ////2023
// P05


// html manipulating ---------------------------------------------------------------------
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

var usernames= [];
socket.on('message', function (message) {
    usernames = message;
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

    const inputField2 = document.createElement('input');
    inputField2.type = 'text';
    inputField2.name = 'name';
    inputField2.value = data['username']

    const inputField3 = document.createElement('input');
    inputField3.type = 'text';
    inputField3.name = 'opponent';
    usernames.splice(usernames.indexOf(data['username']),1)
    inputField3.value = usernames[0]

    form.appendChild(inputField1);
    form.appendChild(inputField2);
    form.appendChild(inputField3);
    document.body.appendChild(form);

    form.submit();
});