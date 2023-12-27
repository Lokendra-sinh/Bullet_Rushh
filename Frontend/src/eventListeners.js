import { canvas, frontendPlayers, socket, dpi } from './gameLogic';

window.addEventListener("keydown", (event) => {
    keys[event.key] = true;
  });
  
  window.addEventListener("keyup", (event) => {
    keys[event.key] = false;
  });
  
  canvas.addEventListener("click", (event) => {
    // console.log("mouse clicked: ", event.clientX, event.clientY);
    const c = canvas.getBoundingClientRect();
    // console.log("canvas: ", c.top, c.left);
    const player = {
      x: frontendPlayers[socket.id].x,
      y: frontendPlayers[socket.id].y,
    }
    console.log("player: ", frontendPlayers[socket.id].x, frontendPlayers[socket.id].y);
  
    const mouseX = (event.clientX - c.left) / dpi;
    const mouseY = (event.clientY - c.top) / dpi;
  
    console.log("mousecanvas: ", mouseX, mouseY);
    const shotAngle = Math.atan2(mouseY - player.y, mouseX - player.x);
    console.log(shotAngle);
  
    const bullet = {
      x: player.x,
      y: player.y,
      angle: shotAngle,
    }
   
    console.log("bullet: ", bullet.x, bullet.y);
    socket.emit("addBullet", bullet);
  });