// Silly Billy Likes Willy
// SoftDev pd8
// ////2023
// P05


// connect client ----------------------------------------------------------------------

// Create WebSocket connection.
const socket = new WebSocket("ws://127.0.0.1:5000");

// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
});