// Select the canvas and setup the game
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Player Properties
const player = {

    x: 50,
    y: 300,
    width: 30,
    height: 50,
    color: "blue",
    velocityY: 0,
    gravity: 0.5,
    jumpPower: -10,
    onGround: false
}

// Controls
let keys = {}

// Listen for key events (from the keyboard)
window.addEventListener("keydown", 
    (event) => { keys[event.code] = true }
);

window.addEventListener("keyup", 
    (event) => { keys[event.code] = false }
);

// Draw player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}