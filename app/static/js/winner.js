var socket = io();
var leaveLink = document.getElementById("leave");
leaveLink.addEventListener("click", () => {
    var game_id = window.location.href.split("/").pop().slice(0,5);
    socket.emit("leave", game_id);
    console.log("LEAVING")
})