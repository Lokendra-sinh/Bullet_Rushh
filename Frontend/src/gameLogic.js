import io from "socket.io-client";

const socket = io("http://localhost:3000");

const canvas = document.getElementById("aimingCanvas");
const ctx = canvas.getContext("2d");
const dpi = window.devicePixelRatio || 1;
canvas.width = 1000
canvas.height = 600
ctx.scale(dpi, dpi);

const frontendPlayers = {};
const frontendBullets = {};
const playerSpeed = 10;
const keys = [];

// socket.on("connect", () => {
//   console.log("c
// });

socket.on('updateFrontendPlayers', (backendPlayers) => {
  for(const id in backendPlayers){
    const backendPlayer = backendPlayers[id];
    if(!frontendPlayers[id]){
      frontendPlayers[id] = backendPlayer;
    } else {
      frontendPlayers[id].x = backendPlayer.x;
      frontendPlayers[id].y = backendPlayer.y;
    }
  }
})

socket.on('playerLeft', (playerId) => {
  delete frontendPlayers[playerId];
});

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for(const id in frontendPlayers){
    const player = frontendPlayers[id];
    drawPlayer(player);
  }

}

animate();

function drawPlayer({x, y, radius, color}) {
  
  ctx.beginPath();
  ctx.shadowColor = color;
  ctx.shadowBlur = 30;
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color; 
  ctx.fill();
  ctx.closePath();
}

function drawBullets({x, y, radius, color}) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function updatePlayerPosition(){
  if(keys["ArrowUp"]) {
    // frontendPlayers[socket.id].y -= playerSpeed;
    socket.emit('keydown', 'ArrowUp')
  }

  if(keys["ArrowDown"]) {
    // frontendPlayers[socket.id].y += playerSpeed;
    socket.emit('keydown', 'ArrowDown')
  }

  if(keys["ArrowLeft"]) {
    // frontendPlayers[socket.id].x -= playerSpeed;
    socket.emit('keydown', 'ArrowLeft')
  }

  if(keys["ArrowRight"]) {
    // frontendPlayers[socket.id].x += playerSpeed;
    socket.emit('keydown', 'ArrowRight')
  }
}

setInterval(updatePlayerPosition, 15);

window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
})

addEventListener("click", (event) => {
  console.log("mouse clicked: ", event.clientX, event.clientY);
  const bullet = {
    x: event.clientX * dpi,
    y: event.clientY * dpi,
  }
  socket.emit('frontendBullets', bullet);
});

