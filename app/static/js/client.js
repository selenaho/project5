// Silly Billy Likes Willy
// SoftDev pd8
// ////2023
// P05


// html manipulating ---------------------------------------------------------------------


// connect client ----------------------------------------------------------------------

var socket = io();
socket.on('connect', function () {
  socket.emit('my event', { data: 'I\'m connected!' });
});

var create_game_id = document.getElementById("btnStart");
var send_id = () => {
  socket.emit("I want a game id")
}
create_game_id.addEventListener("click", send_id);

// // Create WebSocket connection.
// const socket = new WebSocket("ws://127.0.0.1:5000");

// // Connection opened
// socket.addEventListener("open", (event) => {
//   socket.send("Hello Server!");
// });

// // Listen for messages
// socket.addEventListener("message", (event) => {
//   console.log("Message from server ", event.data);
// });


