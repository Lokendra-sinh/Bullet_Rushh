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
    requestNumber: 0,
  };

  io.emit('updateFrontendPlayers', backendPlayers);

  socket.on('disconnect', () => {
    console.log("inside disconnect");
    delete backendPlayers[socket.id];
    io.emit('playerLeft', socket.id);
  });


  //server reconc
  socket.on('keydown', (keycode, requestNumber) => {
    backendPlayers[socket.id].requestNumber = requestNumber;
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
},1000/60);

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
