import io from "socket.io-client";
import gsap from 'gsap';

const socket = io("http://localhost:3000");

const canvas = document.getElementById("aimingCanvas");
const ctx = canvas.getContext("2d");
const dpi = window.devicePixelRatio || 1;
canvas.width = 1000;
canvas.height = 600;
ctx.scale(dpi, dpi);

const frontendPlayers = {};
const frontendBullets = {};
const playerRequests = [];
let requestNumber = 0;
const playerSpeed = 10;
const t = 0.5;
const keys = [];

socket.on("updateFrontendPlayers", (backendPlayers) => {
  for (const id in backendPlayers) {
    const backendPlayer = backendPlayers[id];
    if (!frontendPlayers[id]) {
      frontendPlayers[id] = backendPlayer;
    } else if (frontendPlayers[id]) {
      if (id === socket.id) {
        const lastProcessedRequestIndex = playerRequests.findIndex(
          (request) => {
            return request.requestNumber === backendPlayer.requestNumber;
          }
        );

        if (lastProcessedRequestIndex > -1) {
          playerRequests.splice(0, lastProcessedRequestIndex + 1);

          playerRequests.forEach((request) => {
            frontendPlayers[id].x += request.vx;
            frontendPlayers[id].y += request.vy;
          });
        }
      } else {

        //apply interpolation for smooth animation
        // frontendPlayers[id].x = lerp(frontendPlayers[id].x, backendPlayer.x, t);
        // frontendPlayers[id].y = lerp(frontendPlayers[id].y, backendPlayer.y, t);

        gsap.to(frontendPlayers[id], {
          duration: 0.015, // Adjust the duration as needed
          x: backendPlayer.x,
          y: backendPlayer.y,
          ease: 'power1.out', // Linear ease-out
        });
      }
    }
  }
});

function lerp(start, end, t){
  return start + (end -start) * t;
}

socket.on("playerLeft", (playerId) => {
  delete frontendPlayers[playerId];
});

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const id in frontendPlayers) {
    const player = frontendPlayers[id];
    drawPlayer(player);
  }
}

animate();

function drawPlayer({ x, y, radius, color }) {
  ctx.beginPath();
  ctx.shadowColor = color;
  ctx.shadowBlur = 30;
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawBullets({ x, y, radius, color }) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function updatePlayerPosition() {
  if (keys["ArrowUp"]) {
    requestNumber++;
    playerRequests.push({ requestNumber, vx: 0, vy: -playerSpeed });
    frontendPlayers[socket.id].y -= playerSpeed;
    socket.emit("keydown", "ArrowUp", requestNumber);
  }

  if (keys["ArrowDown"]) {
    requestNumber++;
    playerRequests.push({ requestNumber, vx: 0, vy: playerSpeed });
    frontendPlayers[socket.id].y += playerSpeed;
    socket.emit("keydown", "ArrowDown", requestNumber);
  }

  if (keys["ArrowLeft"]) {
    requestNumber++;
    playerRequests.push({ requestNumber, vx: -playerSpeed, vy: 0 });
    frontendPlayers[socket.id].x -= playerSpeed;
    socket.emit("keydown", "ArrowLeft", requestNumber);
  }

  if (keys["ArrowRight"]) {
    requestNumber++;
    playerRequests.push({ requestNumber, vx: playerSpeed, vy: 0 });
    frontendPlayers[socket.id].x += playerSpeed;
    socket.emit("keydown", "ArrowRight", requestNumber);
  }
}

setInterval(updatePlayerPosition, 1000/60);

window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

addEventListener("click", (event) => {
  console.log("mouse clicked: ", event.clientX, event.clientY);
  const bullet = {
    x: event.clientX * dpi,
    y: event.clientY * dpi,
  };
  socket.emit("frontendBullets", bullet);
});
