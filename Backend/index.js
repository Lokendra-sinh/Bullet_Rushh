const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const backendPlayers = {};
const backendBullets = {};
const bulletSpeed = 5;
const playerSpeed = 10;
const bulletRadius = 10;
let bulletId = 0;

io.on("connect", (socket) => {
  console.log("inside connect");

  backendPlayers[socket.id] = {
    x: Math.floor(Math.random() * 1000),
    y: Math.floor(Math.random() * 600),
    color: `hsl(${Math.random() * 360}, ${100}%, ${50}%)`,
    radius: 10,
  };

  io.emit('updateFrontendPlayers', backendPlayers);

  socket.on('frontendBullets', (frontendBullet) => {
    bulletId++;
    const currentPlayer = backendPlayers[socket.id];
    const angle = Math.atan2(frontendBullet.y - currentPlayer.y, frontendBullet.x - currentPlayer.x);
    const bulletVelocity = {
        x: bulletSpeed * Math.cos(angle),
        y: bulletSpeed * Math.sin(angle),
    }
    const newBullet = {
        x: currentPlayer.x,
        y: currentPlayer.y,
        velocity: bulletVelocity,
        color: backendPlayers[socket.id].color,
        radius: bulletRadius,
        playerId: socket.id,
    }

    backendBullets[bulletId] = newBullet;

    

  })

  function updateBulletPositions(){
    for(const id in backendBullets){
       backendBullets[id].x += backendBullets[id].velocity.x;
       backendBullets[id].y += backendBullets[id].velocity.y;
    }
    io.emit('updatedBackendBullets', backendBullets);
  }
  
  socket.on('disconnect', () => {
    console.log("inside disconnect");
    delete backendPlayers[socket.id];
    io.emit('playerLeft', socket.id);
  });

  socket.on('keydown', (keycode) => {
    console.log(keycode);
      switch (keycode) {
          case "ArrowUp":
            backendPlayers[socket.id].y -= playerSpeed;
            break;    
          case "ArrowDown":
              backendPlayers[socket.id].y += playerSpeed;
            break;   
          case "ArrowLeft":
              backendPlayers[socket.id].x -= playerSpeed;
            break;   
          case "ArrowRight":
              backendPlayers[socket.id].x += playerSpeed;
            break;
        }
  })
});

setInterval(() => {
 io.emit('updateFrontendPlayers', backendPlayers);
},30);

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
