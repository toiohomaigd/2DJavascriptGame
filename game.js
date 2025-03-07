// Select the canvas and setup the game
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Sounds / Audio
const jumpSound = new Audio("jump.mp3");
const bgMusic = new Audio("background.mp3");
bgMusic.loop = true;

function playMusic()
{
    bgMusic.play();
    document.removeEventListener("click", playMusic);
}

// Attempt to play music on page load
window.addEventListener("load", playMusic());

// Toogle background music
let musicPlaying = true;
const musicButton = document.getElementById("musicToggle");

musicButton.addEventListener("click",
    ()=>{
        if(musicPlaying)
        {
            bgMusic.pause();
        }
        else
        {
            bgMusic.play();
        }
        musicPlaying = !musicPlaying;
    }
   
);

// prevent spacebar from toggling background music
window.addEventListener("keydown", 
(event)=>{
    if(event.code === "Space")
    {
        event.preventDefault(); // stop spacebar activating buttons
    }
    keys[event.code] = true;
});

// Player properties
const player = {
    x: 50,
    y: 300,
    width: 30,
    height: 50,
    color: "blue",
    velocityY: 0,
    velocityX: 0,
    speed: 5,
    gravity: 0.5,
    jumpPower: -10,
    onGround: false
};

// Controls
let keys = {};

// Listen for key events
window.addEventListener("keydown", (event) => {
    keys[event.code] = true;
});

window.addEventListener("keyup", (event) => {
    keys[event.code] = false
});

// Draw player
function drawPlayer() 
{
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Check collision with platforms
function checkPlatformCollision()
{
    let landedOnPlatform = false; // Track if player lands on any platform

    platforms.forEach(
        platform => {
            if(
                player.velocityY > 0 && // Only check when falling
                player.y + player.height <= platform.y + player.velocityY && // Player is above the platform before collision
                player.y + player.height + player.velocityY >= platform.y &&
                player.x + player.width > platform.x &&
                player.x < platform.x + platform.width
            )
            {
                player.y = platform.y - player.height; // Position player on top of the platform
                player.velocityY = 0;
                landedOnPlatform = true;
            }
        }
    );
    
    // Update ground status
    player.onGround = landedOnPlatform;
} 

// Update player movement
function updatePlayer()
{
    // Left and Right movement
    if(keys["ArrowLeft"])
    {
        player.x -= player.speed;
    }
    if(keys["ArrowRight"])
    {
        player.x += player.speed;
    }   

    // Prevent moving out of bounds
    if(player.x < 0) player.x = 0;
    if(player.x + player.width > canvas.width) player.x = canvas.wdith - player.width;
    
    // Gravity
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Check platform collisions before ground check
    checkPlatformCollision();

    // Prevent falling through the ground
    if(player.y + player.height >= canvas.height)
    {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.onGround = true;
    }

    // Jumping
    if(keys["Space"] && player.onGround)
    {
        player.velocityY = player.jumpPower;
        player.onGround = false;
        jumpSound.play(); // Play jump sound
    }
}

// Platforms
const platforms = [
    {x: 100, y: 350, width: 150, height: 10},
    {x: 300, y: 280, width: 150, height: 10},
    {x: 500, y: 220, width: 150, height: 10}
];

// Draw platforms
function drawPlatforms()
{
    ctx.fillStyle = "brown";
    platforms.forEach(
        platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
        }
    );
}


function gameLoop()
{ 
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    drawPlatforms();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();