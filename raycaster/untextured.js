const mapWidth = 24;
const mapHeight = 24;
const worldMap = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,2,2,2,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
  [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,3,0,0,0,3,0,0,0,1],
  [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,2,2,0,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,0,0,0,5,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const canvas = document.querySelector('canvas');
const w = Number(canvas.width);
const h = Number(canvas.height);
let ctx = canvas.getContext('2d');

// Capture user input
const KEY_W = 'KeyW';
const KEY_S = 'KeyS';
const KEY_A = 'KeyA';
const KEY_D = 'KeyD';
let pressedKeys = {};
let mouseXMovement = 0;
document.addEventListener('keydown', e => {
  pressedKeys[e.code] = true;
});
document.addEventListener('keyup', e => {
  pressedKeys[e.code] = false;
});
canvas.addEventListener('click', e => {
  canvas.requestPointerLock();
});
canvas.addEventListener('mousemove', e => {
  if (document.pointerLockElement !== canvas) {
    return;
  }

  mouseXMovement += e.movementX;
});

// Player start position
let posX = 22;
let posY = 12;

// Player start direction
let dirX = -1;
let dirY = 0;

// The 2D raycaster version of camera plane
let planeX = 0;
let planeY = 0.66;

// Handles delta time changes
let time = Date.now();
let oldTime = Date.now();

requestAnimationFrame(function loop() {
  // Clear the screen
  ctx.clearRect(0, 0, w, h);

  // Begin the actual raycasting
  for (let x = 0; x < w; x++) {
    // Calculate ray position and direction
    let cameraX = 2 * x / w - 1; // X-coordinate in camera space
    let rayPosX = posX;
    let rayPosY = posY;
    let rayDirX = dirX + planeX * cameraX;
    let rayDirY = dirY + planeY * cameraX;

    // Which box of the map we're in
    let mapX = Math.floor(rayPosX);
    let mapY = Math.floor(rayPosY);

    // Length of the ray from the current position to next x or y-side
    let sideDistX;
    let sideDistY;

    // Length of ray from one x or y-side to next x or y-side
    let deltaDistX = Math.sqrt(1 + (rayDirY * rayDirY) / (rayDirX * rayDirX));
    let deltaDistY = Math.sqrt(1 + (rayDirX * rayDirX) / (rayDirY * rayDirY));
    let perpWallDist;

    // What direction to step in x or y-direction (either +1 or -1)
    let stepX;
    let stepY;

    let hit = false; // Was there a wall hit?
    let side; // Was a NS or a EW wall hit?

    // Calculate step and initial sideDist
    if (rayDirX < 0) {
      stepX = -1;
      sideDistX = (rayPosX - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1 - rayPosX) * deltaDistX;
    }

    if (rayDirY < 0) {
      stepY = -1;
      sideDistY = (rayPosY - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1 - rayPosY) * deltaDistY;
    }

    // Perform DDA
    while (!hit) {
      // Jump to next map square, OR in x-direction, OR in y-direction
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }

      hit = (worldMap[mapX][mapY] !== 0);
    }

    // Calculate distance projected on camera direction
    // (oblique distance will give fisheye effect!)
    if (side === 0) {
      perpWallDist = (mapX - rayPosX + (1 - stepX) / 2) / rayDirX;
    } else {
      perpWallDist = (mapY - rayPosY + (1 - stepY) / 2) / rayDirY;
    }

    // Calculate height of line to draw on screen]
    let lineHeight = Math.floor(h / perpWallDist);

    // Calculate lowest and highest pixel to fill in current stripe
    let drawStart = -lineHeight / 2 + h / 2;
    if (drawStart < 0) {
      drawStart = 0;
    }
    let drawEnd = lineHeight / 2 + h / 2;
    if (drawEnd >= h) {
      drawEnd = h - 1;
    }

    let color;
    switch (worldMap[mapX][mapY]) {
      case 1:
        color = '#F00';
        break;
      case 2: 
        color = '#0F0';
        break;
      case 3:
        color = '#00F';
        break;
      case 4:
        color = '#FFF';
        break;
      default:
        color = '#FF0';
        break;
    }

    // Give x and y sides different brightness
    if (side === 1) {
      color = color.replace('F', '8');
    }

    // Draw the pixels of the stripe as a vertical line
    ctx.fillStyle = color;
    ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
  }
  
  // Timing for input and FPS counter
  oldTime = time;
  time = Date.now();
  let frameTime = (time - oldTime) / 1000; // Time frame has taken in seconds

  // Speed modifiers
  const mouseSensitivity = 0.3;
  let moveSpeed = frameTime * 5; // Squares per second
  let rotSpeed = frameTime * mouseXMovement * mouseSensitivity; // Radians per second

  // For checking map positions
  let floorX = Math.floor(posX);
  let floorY = Math.floor(posY);

  // Move forward if no wall is in front of you
  if (pressedKeys[KEY_W]) {
    let deltaX = Math.floor(posX + dirX * moveSpeed);
    let deltaY = Math.floor(posY + dirY * moveSpeed);
    if (!worldMap[deltaX][floorY]) {
      posX += dirX * moveSpeed;
    }
    if (!worldMap[floorX][deltaY]) {
      posY += dirY * moveSpeed;
    }
  }

  // Move backward if no wall is behind you
  if (pressedKeys[KEY_S]) {
    let deltaX = Math.floor(posX - dirX * moveSpeed);
    let deltaY = Math.floor(posY - dirY * moveSpeed);
    if (!worldMap[deltaX][floorY]) {
      posX -= dirX * moveSpeed;
    }
    if (!worldMap[floorX][deltaY]) {
      posY -= dirY * moveSpeed;
    }
  }

  // Move to the left if no wall is blocking you
  if (pressedKeys[KEY_A]) {
    let newDirX = dirX * Math.cos(Math.PI / 2) - dirY * Math.sin(Math.PI / 2);
    let newDirY = dirX * Math.sin(Math.PI / 2) + dirY * Math.cos(Math.PI / 2);
    let deltaX = Math.floor(posX + newDirX * moveSpeed);
    let deltaY = Math.floor(posY + newDirY * moveSpeed);
    if (worldMap[deltaX][floorY] === 0) {
      posX += newDirX * moveSpeed;
    }
    if (worldMap[floorX][deltaY] === 0) {
      posY += newDirY * moveSpeed;
    }
  }
  
  // Move to the right if no wall is blocking you
  if (pressedKeys[KEY_D]) {
    let newDirX = dirX * Math.cos(Math.PI / 2) - dirY * Math.sin(Math.PI / 2);
    let newDirY = dirX * Math.sin(Math.PI / 2) + dirY * Math.cos(Math.PI / 2);
    let deltaX = Math.floor(posX - newDirX * moveSpeed);
    let deltaY = Math.floor(posY - newDirY * moveSpeed);
    if (!worldMap[deltaX][floorY]) {
      posX -= newDirX * moveSpeed;
    }
    if (!worldMap[floorX][deltaY]) {
      posY -= newDirY * moveSpeed;
    }
  }

  // Rotate
  if (mouseXMovement !== 0) {
    // Both camera direction and camera plane must be rotated
    let oldDirX = dirX;
    dirX = dirX * Math.cos(-rotSpeed) - dirY * Math.sin(-rotSpeed);
    dirY = oldDirX * Math.sin(-rotSpeed) + dirY * Math.cos(-rotSpeed);
    let oldPlaneX = planeX;
    planeX = planeX * Math.cos(-rotSpeed) - planeY * Math.sin(-rotSpeed);
    planeY = oldPlaneX * Math.sin(-rotSpeed) + planeY * Math.cos(-rotSpeed);
  }
  mouseXMovement = 0;

  requestAnimationFrame(loop);
});