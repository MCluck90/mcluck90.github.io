const mapWidth = 24;
const mapHeight = 24;
const worldMap = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,6,7,6,7,6,6,7,7,6,6,7,6,7,6,0,0,0,0,2],
  [2,0,0,0,0,6,3,3,3,3,3,3,3,3,3,3,3,3,7,0,0,0,0,2],
  [2,0,0,0,0,6,3,8,0,0,0,0,0,0,0,0,8,3,6,0,0,0,0,2],
  [2,0,0,0,0,7,3,0,0,0,0,5,0,0,0,0,0,3,6,0,0,0,0,2],
  [2,0,0,0,0,6,3,0,0,0,0,0,0,0,0,0,0,3,7,0,0,0,0,2],
  [2,0,0,0,0,6,3,0,0,0,0,0,0,0,0,0,0,3,6,0,0,0,0,2],
  [2,0,0,0,0,6,3,8,0,0,0,0,0,0,0,0,8,3,6,0,0,0,0,2],
  [2,0,0,0,0,7,3,3,3,3,3,0,0,3,3,3,3,3,6,0,0,0,0,2],
  [2,0,0,0,0,6,6,6,6,6,3,0,0,3,6,6,6,6,7,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,6,3,0,0,3,6,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,6,3,0,0,3,6,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,1,3,0,0,3,1,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

const canvas = document.querySelector('canvas');
const w = Number(canvas.width);
const h = Number(canvas.height);
let ctx = canvas.getContext('2d');
const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = 64;
offscreenCanvas.height = 64;
const offCtx = offscreenCanvas.getContext('2d');

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

// Load all of the textures
let textures;
function loadTexture(name, index) {
  return new Promise((resolve) => {
  let img = new Image();
  img.src = `textures/${name}.png`;
  img.onload = () => {
    textures[index] = img
    resolve();
  };
  });
}

function loadAllTextures(textureNames) {
  textures = new Array(textureNames.length);
  let texturePromises = textureNames.map(loadTexture);
  Promise.all(texturePromises)
    .then(main);
}

loadAllTextures([
  'barrel',
  'bluestone',
  'colorstone',
  'eagle',
  'greenlight',
  'greystone',
  'mossy',
  'pillar',
  'purplestone',
  'redbrick',
  'wood'
]);

function main() {
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
          side = false;
        } else {
          sideDistY += deltaDistY;
          mapY += stepY;
          side = true;
        }

        hit = (worldMap[mapX][mapY] !== 0);
      }

      // Calculate distance projected on camera direction
      // (oblique distance will give fisheye effect!)
      if (!side) {
        perpWallDist = (mapX - rayPosX + (1 - stepX) / 2) / rayDirX;
      } else {
        perpWallDist = (mapY - rayPosY + (1 - stepY) / 2) / rayDirY;
      }

      // Calculate height of line to draw on screen
      let lineHeight = Math.floor(h / perpWallDist);

      // Calculate lowest and highest pixel to fill in current stripe
      let drawStart = -lineHeight / 2 + h / 2;
      let drawEnd = lineHeight / 2 + h / 2;
      if (drawEnd >= h) {
        drawEnd = h - 1;
      }

      // Texturing calculations
      let texNum = worldMap[mapX][mapY] - 1;

      // Calculate value of wallX
      let wallX; // Where exactly the wall was hit
      if (!side) {
        wallX = rayPosY + perpWallDist * rayDirY;
      } else {
        wallX = rayPosX + perpWallDist * rayDirX;
      }
      wallX -= Math.floor(wallX);

      // X coordinate on the texture
      const texWidth = 64;
      let texX = Math.floor(wallX * texWidth);
      if (!side && rayDirX > 0) {
        texX = texWidth - texX - 1;
      }
      if (side && rayDirY < 0) {
        texX = texWidth - texX - 1;
      }

      // Draw the texture
      let texture = textures[texNum];
      if (!side) {
        ctx.globalAlpha = 1;
      } else {
        // Make the sides look darker
        ctx.globalAlpha = 0.75;
      }
      ctx.drawImage(texture, 
                    Math.abs(texX), 
                    0, 
                    1, 
                    texWidth, 
                    x, 
                    drawStart, 
                    1, 
                    lineHeight);
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

    // For preventing the player from getting too close to walls
    const playerMargin = 0.1;

    const deltaPos = (pos, dir) => Math.floor(pos + playerMargin * Math.sign(dir) + dir * moveSpeed);

    // Move forward if no wall is in front of you
    if (pressedKeys[KEY_W]) {
      let deltaX = deltaPos(posX, dirX);
      let deltaY = deltaPos(posY, dirY);
      if (!worldMap[deltaX][floorY]) {
        posX += dirX * moveSpeed;
      }
      if (!worldMap[floorX][deltaY]) {
        posY += dirY * moveSpeed;
      }
    }

    // Move backward if no wall is behind you
    if (pressedKeys[KEY_S]) {
      let deltaX = deltaPos(posX, -dirX);
      let deltaY = deltaPos(posY, -dirY);
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
      let deltaX = deltaPos(posX, newDirX);
      let deltaY = deltaPos(posY, newDirY);
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
      let deltaX = deltaPos(posX, -newDirX);
      let deltaY = deltaPos(posY,  -newDirY);
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
}