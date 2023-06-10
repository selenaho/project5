// Silly Billy Likes Willy
// SoftDev pd8
// ////2023
// P05


// html manipulating ---------------------------------------------------------------------


// connect client ----------------------------------------------------------------------

var socket = io();


var create_game_id = document.getElementById("btnCreate");

create_game_id.addEventListener("click", () => {
  socket.emit("I want a game id");
});

socket.on('message', function(message){
  console.log(message);
  var join_code = document.getElementById("joinCode");
  join_code.innerHTML = "<p>Your join code is: " + message + "</p>";
});