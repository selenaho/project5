// Silly Billy Likes Willy
// SoftDev pd8
// ////2023
// P05


// html manipulating ---------------------------------------------------------------------
var bird_color = document.getElementById("birdColor");

var display_chosen_color = () => {

    var selected_color = document.getElementById("selectedColor");
    selected_color.innerHTML = "<p>The color you selected is " + bird_color.value + "</p>";

}

bird_color.addEventListener("change", display_chosen_color);

// connect client ----------------------------------------------------------------------
var socket = io();
socket.on('connect', function () {
    socket.emit('my event', { data: 'I\'m in the room!' });
    socket.emit('sendusername')
});

socket.on('message', function(message){
    console.log(message);
    let msg_list = document.getElementById("msg");
    let li = document.createElement("li");
    li.textContent = message;
    msg_list.appendChild(li);
  });

var checkboxClicked = (checkbox) => {
    if (checkbox.checked) {
        //alert("checked")
        socket.emit('checked')
    } 
    else {
        socket.emit('unchecked')
        //alert("unchecked")
    }
}

socket.on('readyToPlay', function(){
    console.log("READY TO PLAY")
    socket.emit('sendToGame');
});