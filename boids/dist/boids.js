(() => {
  // src/canvas.ts
  var canvas = document.querySelector("canvas");
  document.addEventListener("resize", () => {
  });
  canvas.width = canvas.getBoundingClientRect().width;
  canvas.height = canvas.getBoundingClientRect().height;
  var ctx = canvas.getContext("2d");
  function rotatePoint(point, center, angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    point.x -= center.x;
    point.y -= center.y;
    const xNew = point.x * cos - point.y * sin;
    const yNew = point.x * sin + point.y * cos;
    point.x = xNew + center.x;
    point.y = yNew + center.y;
  }
  var lerp = (n1, n2, amount) => {
    amount = Math.max(amount, 0);
    amount = Math.min(amount, 1);
    return n1 + (n2 - n1) * amount;
  };
  var previousPositions = {};
  var previousVelocities = {};
  var drawBoid = (boid, size, color, allowWrapping) => {
    const previousPosition = previousPositions[boid.id] || {
      x: boid.velocity.x,
      y: boid.velocity.y
    };
    previousPositions[boid.id] = previousPosition;
    const previousVelocity = previousVelocities[boid.id] || {
      x: boid.velocity.x,
      y: boid.velocity.y
    };
    previousVelocities[boid.id] = previousVelocity;
    previousPosition.x = lerp(previousPosition.x, boid.position.x, 0.1);
    previousPosition.y = lerp(previousPosition.y, boid.position.y, 0.1);
    const position = allowWrapping ? boid.position : previousPosition;
    previousVelocity.x = lerp(previousVelocity.x, boid.velocity.x, 0.1);
    previousVelocity.y = lerp(previousVelocity.y, boid.velocity.y, 0.1);
    const direction = Math.atan2(previousVelocity.y, previousVelocity.x);
    const tip = {
      x: position.x + size,
      y: position.y
    };
    const leftTail = {
      x: position.x - size / 2,
      y: position.y - size / 2
    };
    const rightTail = {
      x: position.x - size / 2,
      y: position.y + size / 2
    };
    rotatePoint(tip, position, direction);
    rotatePoint(leftTail, position, direction);
    rotatePoint(rightTail, position, direction);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    ctx.lineTo(leftTail.x, leftTail.y);
    ctx.lineTo(rightTail.x, rightTail.y);
    ctx.lineTo(tip.x, tip.y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  };

  // src/vector.ts
  var Vector = class {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
    get length() {
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    toUnit() {
      return new Vector(this.x / this.length, this.y / this.length);
    }
    distanceTo(other) {
      return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
    }
    subtract(other) {
      return new Vector(this.x - other.x, this.y - other.y);
    }
    add(other) {
      return new Vector(this.x + other.x, this.y + other.y);
    }
    mult(n) {
      return new Vector(this.x * n, this.y * n);
    }
    div(n) {
      return new Vector(this.x / n, this.y / n);
    }
    clone() {
      return new Vector(this.x, this.y);
    }
  };

  // src/boids.ts
  function uuidv4() {
    return ([1e7].toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (Number(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(c) / 4).toString(16));
  }
  var createBoid = (x, y) => {
    const degrees = Math.random() * 360;
    const radians = degrees * (Math.PI / 180);
    const position = new Vector(x, y);
    const velocity = new Vector(Math.cos(radians), Math.sin(radians));
    return {
      id: uuidv4(),
      position,
      velocity
    };
  };
  function moveBoids(boids2, speed, separation, alignment, cohesion, jitter, allowWrapping) {
    const centerSum = boids2.reduce((acc, boid) => {
      acc.x += boid.position.x;
      acc.y += boid.position.y;
      return acc;
    }, new Vector());
    for (const boid of boids2) {
      const center = new Vector((centerSum.x - boid.position.x) / Math.max(boids2.length - 1, 1), (centerSum.y - boid.position.y) / Math.max(boids2.length - 1, 1));
      const v1 = new Vector((center.x - boid.position.x) / 100 * cohesion, (center.y - boid.position.y) / 100 * cohesion);
      let v2 = new Vector();
      let v3 = new Vector();
      for (const other of boids2) {
        if (other === boid) {
          continue;
        }
        if (boid.position.distanceTo(other.position) < separation) {
          v2 = v2.subtract(other.position.subtract(boid.position));
        }
        if (!allowWrapping) {
          if (boid.position.x < 10) {
            v2 = v2.subtract(new Vector(-10, 0));
          } else if (boid.position.x > canvas.width - 10) {
            v2 = v2.subtract(new Vector(10, 0));
          }
          if (boid.position.y < 10) {
            v2 = v2.subtract(new Vector(0, -10));
          } else if (boid.position.y > canvas.height - 10) {
            v2 = v2.subtract(new Vector(0, 10));
          }
        }
        v3 = v3.add(other.velocity.mult(alignment));
      }
      v3 = v3.div(Math.max(boids2.length - 1, 1));
      const direction = Math.atan2(boid.velocity.y, boid.velocity.x);
      const newDirection = direction + Math.PI * (jitter * Math.random() * (Math.random() - 0.5));
      const jitterVector = new Vector(Math.cos(newDirection), Math.sin(newDirection)).toUnit();
      boid.velocity = boid.velocity.add(v1).add(v2).add(v3).add(jitterVector).toUnit();
      boid.position = boid.position.add(boid.velocity.mult(speed));
    }
  }

  // src/main.ts
  var speedEl = document.getElementById("speed");
  var sizeEl = document.getElementById("size");
  var populationEl = document.getElementById("population");
  var separationEl = document.getElementById("separation");
  var alignmentEl = document.getElementById("alignment");
  var cohesionEl = document.getElementById("cohesion");
  var jitterEl = document.getElementById("jitter");
  var allowWrappingEl = document.getElementById("allowWrapping");
  var colorEl = document.getElementById("color");
  var boids = [];
  for (let i = 0; i < Number(populationEl.value); i++) {
    boids.push(createBoid(Math.random() * canvas.width, Math.random() * canvas.height));
  }
  function update(delta) {
    const speed = Number(speedEl.value);
    const population = Number(populationEl.value);
    const separation = Number(separationEl.value);
    const alignment = Number(alignmentEl.value) / 100;
    const cohesion = Number(cohesionEl.value) / 100;
    const jitter = Number(jitterEl.value) / 100;
    const allowWrapping = !!allowWrappingEl.checked;
    while (boids.length > population) {
      boids.pop();
    }
    while (boids.length < population) {
      boids.push(createBoid(Math.random() * canvas.width, Math.random() * canvas.height));
    }
    moveBoids(boids, speed * delta, separation, alignment, cohesion, jitter, allowWrapping);
    if (!allowWrapping) {
      return;
    }
    for (const boid of boids) {
      if (boid.position.x <= 0) {
        boid.position.x = canvas.width + boid.position.x;
      } else if (boid.position.x >= canvas.width) {
        boid.position.x -= canvas.width;
      }
      if (boid.position.y <= 0) {
        boid.position.y = canvas.height + boid.position.y;
      } else if (boid.position.y >= canvas.height) {
        boid.position.y -= canvas.height;
      }
    }
  }
  function render() {
    const size = Number(sizeEl.value);
    const color = colorEl.value;
    const allowWrapping = !!allowWrappingEl.checked;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const boid of boids) {
      drawBoid(boid, size, color, allowWrapping);
    }
  }
  var prev = +new Date();
  function heartbeat() {
    let now = +new Date();
    const delta = (now - prev) / 1e3;
    update(delta);
    render();
    prev = now;
    requestAnimationFrame(heartbeat);
  }
  heartbeat();
})();
//# sourceMappingURL=boids.js.map
