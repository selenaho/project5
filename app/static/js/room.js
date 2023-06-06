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
