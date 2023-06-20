window.addEventListener("load", function () {
  /**@type{HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particleArray = [];
  let numOfParticles = canvas.width * 0.33;

  class SpaceWhale {
    constructor(deltaTime) {
      this.deltaTime = deltaTime;
      this.x = canvas.width * 0.5;
      this.y = canvas.height * 0.5;
      this.width = 100;
      this.height = 100;
      this.spriteWidth = 420;
      this.spriteHeight = 285;
      this.spriteOffsetX = this.spriteWidth * 0.5;
      this.spriteOffsetY = this.spriteHeight * 0.5;
      this.frameX = 0;
      this.frameY = Math.floor(Math.random() * 4);
      this.image = document.getElementById("spaceWhale");
      this.angle = 0;
      this.va = 0.01;
      this.curve = canvas.height * 0.3;
      this.pushRadius = 250;
      this.maxFrames = 38;
      this.frameTimer = 0;
      this.frameInterval = 1000 / 50;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.cos(this.angle));
      ctx.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - this.spriteOffsetX,
        0 - this.spriteOffsetY,
        this.spriteWidth,
        this.spriteHeight
      );
      ctx.restore();
    }
    update(deltaTime) {
      this.angle += this.va;
      this.y = canvas.height * 0.5 + Math.sin(this.angle) * this.curve;
      if (this.angle > Math.Pi * 2) {
        this.angle = 0;
      }
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrames) {
          this.frameX++;
          this.frameTimer = 0;
        } else {
          this.frameX = 0;
        }
      } else {
        this.frameTimer += deltaTime;
      }
    }
  }
  let spaceWhale = new SpaceWhale();

  class Particle {
    constructor() {
      this.radius = Math.random() * 4 + 4;
      this.x = Math.floor(
        Math.random() * (canvas.width - this.radius * 2 - this.radius * 2) +
          this.radius * 2
      );
      this.y = Math.floor(
        Math.random() * (canvas.height - this.radius * 2 - this.radius * 2) +
          this.radius * 2
      );
      this.density = Math.random() * 40 + 20;
      this.imageOffset = this.imageSize * 0.0;
      this.width = this.radius * 8;
      this.height = this.radius * 8;
      this.vx = Math.floor(Math.random() * 3 + 1.5);
      this.vy = Math.random() * 3 + 1.5;
      this.basePosX = this.x;
      this.basePosY = this.y;
      this.hue = Math.floor(Math.random() * 360);
      this.starImg = document.getElementById("star");
      this.imageOffset = this.width * 0.5;
      this.maxDistance = 100;
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      ctx.drawImage(
        this.starImg,
        this.x - this.imageOffset,
        this.y - this.imageOffset,
        this.width,
        this.height
      );
    }
    update() {
      this.x -= this.vx;
      //this.y += this.vy;

      //Edges
      if (this.x < 0) this.x = canvas.width;

      if (this.y > canvas.height || this.y < 0) {
        this.y = Math.floor(Math.random() * canvas.height);
      }
    }
    connectParticles() {
      for (let i = 0; i < particleArray.length; i++) {
        for (let j = i; j < particleArray.length; j++) {
          let dx = particleArray[i].x - particleArray[j].x;
          let dy = particleArray[i].y - particleArray[j].y;
          let distance = Math.hypot(dx, dy);
          if (distance < this.maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.moveTo(particleArray[i].x, particleArray[i].y);
            ctx.lineTo(particleArray[j].x, particleArray[j].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    }
    pushParticles() {
      let dx = this.x - spaceWhale.x;
      let dy = this.y - spaceWhale.y;
      let distance = Math.hypot(dx, dy);
      let angle = Math.atan2(dy, dx);

      if (distance > spaceWhale.pushRadius) {
        this.x += Math.cos(angle) * (spaceWhale.pushRadius / distance);
        this.y += Math.sin(angle) * (spaceWhale.pushRadius / distance);
      } else {
        if (this.x !== this.basePosX) {
          let dx = this.x - this.basePosX;
          this.x += dx / 10 - this.vx;
        }
        if (this.y !== this.basePosY) {
          let dy = this.y - this.basePosY;
          this.y += dy / 10 - this.vy;
        }
      }
    }
  }

  function initParticles() {
    for (let i = 0; i < numOfParticles; i++) {
      particleArray.push(new Particle());
    }
  }
  initParticles();
  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].draw();
      particleArray[i].update();
      particleArray[i].pushParticles();
      //particleArray[i].connectParticles()
    }
    spaceWhale.draw();
    spaceWhale.update(deltaTime);

    requestAnimationFrame(animate);
  }

  animate(0);

  window.addEventListener("resize", (e) => {
    location.reload();
  });
});
