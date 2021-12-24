(() => {
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
  };

  // src/boids.ts
  var createBoid = (x, y) => {
    const degrees = Math.random() * 360;
    const radians = degrees * (Math.PI / 180);
    return {
      position: new Vector(x, y),
      velocity: new Vector(Math.cos(radians), Math.sin(radians))
    };
  };
  function moveBoids(boids2, speed, separation, alignment, cohesion) {
    const centerSum = boids2.reduce((acc, boid) => {
      acc.x += boid.position.x;
      acc.y += boid.position.y;
      return acc;
    }, new Vector());
    for (const boid of boids2) {
      const center = new Vector((centerSum.x - boid.position.x) / (boids2.length - 1), (centerSum.y - boid.position.y) / (boids2.length - 1));
      const v1 = new Vector((center.x - boid.position.x) / 100 * cohesion, (center.y - boid.position.y) / 100 * cohesion);
      let v2 = new Vector();
      for (const other of boids2) {
        if (other === boid) {
          continue;
        }
        if (boid.position.distanceTo(other.position) < separation) {
          v2 = v2.subtract(other.position.subtract(boid.position));
        }
      }
      let v3 = new Vector();
      for (const other of boids2) {
        if (other === boid) {
          continue;
        }
        v3 = v3.add(other.velocity.mult(alignment));
      }
      v3 = v3.div(boids2.length - 1);
      boid.velocity = boid.velocity.add(v1).add(v2).add(v3).toUnit();
      boid.position = boid.position.add(boid.velocity.mult(speed));
    }
  }

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
  var drawBoid = (boid) => {
    const direction = Math.atan2(boid.velocity.y, boid.velocity.x);
    const length = 10;
    const tip = {
      x: boid.position.x + length,
      y: boid.position.y
    };
    const leftTail = {
      x: boid.position.x - length / 2,
      y: boid.position.y - length / 2
    };
    const rightTail = {
      x: boid.position.x - length / 2,
      y: boid.position.y + length / 2
    };
    rotatePoint(tip, boid.position, direction);
    rotatePoint(leftTail, boid.position, direction);
    rotatePoint(rightTail, boid.position, direction);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
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

  // src/main.ts
  var speedEl = document.getElementById("speed");
  var separationEl = document.getElementById("separation");
  var alignmentEl = document.getElementById("alignment");
  var cohesionEl = document.getElementById("cohesion");
  var boids = [];
  for (let i = 0; i < 50; i++) {
    boids.push(createBoid(Math.random() * canvas.width, Math.random() * canvas.height));
  }
  function update(delta) {
    const speed = Number(speedEl.value);
    const separation = Number(separationEl.value);
    const alignment = Number(alignmentEl.value) / 100;
    const cohesion = Number(cohesionEl.value) / 100;
    moveBoids(boids, speed * delta, separation, alignment, cohesion);
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
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const boid of boids) {
      drawBoid(boid);
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
