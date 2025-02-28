// Select the canvas and setup the game
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Load jump sound
const jumpSound =  new Audio("jump.mp3");

// Player Properties
const player = {

    x: 50,
    y: 300,
    width: 30,
    height: 50,
    color: "white",
    velocityY: 0,
    gravity: 0.5,
    jumpPower: -10,
    onGround: false,
    speed: 5
}

// Platforms
const platforms = [
    {x: 100, y: 350, width: 150, height: 10},
    {x: 300, y: 280, width: 150, height: 10},
    {x: 500, y: 220, width: 150, height: 10}
];

// Draw Platforms
function drawPlatforms()
{
    ctx.fillStyle = "white";
    platforms.forEach(
        platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
        }
    );
}

// Set Platform Collisions
function checkPlatformCollision()
{
    // Track if player lands on any platform
    let onPlatform = false;

    // loop through platforms to check if player has landed on it
    platforms.forEach(
        platform => {
            if(
                player.velocityY > 0 && // only check when falling
                player.y + player.height <= platform.y + player.velocityY && // Player is above platform
                player.y + player.height + player.velocityY >= platform.y &&
                player.x + player.width > platform.x &&
                player.x < platform.x + platform.width
            )
            {
                // Postion player on top of the platform
                player.y = platform.y - player.height;
                player.velocityY = 0;
                onPlatform = true;
            }
        }
    );

    // update ground status
    player.onGround = onPlatform;
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

    

    // Prevent Moving out of bounds
    if(player.x < 0) player.x = 0;
    if(player.x + player.width > canvas.width)
    {
        player.x = canvas.width - player.width;
    }
    
    // Gravity
    player.velocityY += player.gravity;
    player.y += player.velocityY;
    
    // Check Platform collisions before gound check
    checkPlatformCollision();
    
    // Prevent falling through the ground
    if(player.y + player.height >= canvas.height)
    {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.onGround = true;
    }
    else
    {
        player.onGround = false;
    }

    // Jumping
    if(keys["Space"] && player.onGround)
    {
        player.velocityY = player.jumpPower;
        player.onGround = false;
        jumpSound.play(); // Play jump sound
        
    } 
}

// Game Loop
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