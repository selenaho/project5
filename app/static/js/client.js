// Silly Billy Likes Willy
// SoftDev pd8
// ////2023
// P05


// html manipulating ---------------------------------------------------------------------
var UnhiddenUM = document.getElementById("btnUnhiddenUM");
var hidden_and_unhidden = () => {
  var um = document.getElementById("userManual");
  if (um.style.display === "none") {
    um.style.display = "block";
  }
  else {
    um.style.display = "none";
  }
};
UnhiddenUM.addEventListener("click", un_hidden);


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

