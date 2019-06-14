class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 1;
    this.isActive = true;
  }
}

class ParticleSimulator {
  constructor(tickTime) {
    this.handleClick = this.handleClick.bind(this);
    this.update = this.update.bind(this);
    this.particles = [];
    this.matrix = (() => {
      const arr = [];
      for (let i = 0; i < 100; i += 1) {
        arr[i] = [];
      }
      return arr;
    })();
    this.tickTime = tickTime;
    this.canvas = document.getElementById('particle-simulator');
    this.canvas.addEventListener('click', this.handleClick);
    this.ctx = this.canvas.getContext('2d');
  }

  start() {
    setInterval(this.update, this.tickTime);
  }

  stop() {
    clearInterval(this.update);
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    let x = Math.floor(e.clientX - rect.left, 10);
    let y = Math.floor(e.clientY - rect.top, 10);
    if (x > 99) {
      x = 99;
    }
    if (y > 99) {
      y = 99;
    }
    if (this.matrix[x][y] === true) {
      return;
    }
    const particle = new Particle(x, y);
    this.particles.push(particle);
    this.matrix[x][y] = true;
  }


  drawParticle(particle) {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  }

  clearCanvas() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.height);
  }

  moveParticleDown(particle) {
    const newParticle = particle;
    this.matrix[newParticle.x][newParticle.y] = null;
    newParticle.y += 1;
    this.matrix[newParticle.x][newParticle.y] = true;
  }

  moveParticleLeft(particle) {
    const newParticle = particle;
    this.matrix[newParticle.x][newParticle.y] = null;
    newParticle.x -= 1;
    this.matrix[newParticle.x][newParticle.y] = true;
  }

  moveParticleRight(particle) {
    const newParticle = particle;
    this.matrix[newParticle.x][newParticle.y] = null;
    newParticle.x += 1;
    this.matrix[newParticle.x][newParticle.y] = true;
  }

  update() {
    this.clearCanvas();

    this.particles = this.particles.map((particle) => {
      const newParticle = particle;
      const isThereParticleBelow = this.matrix[newParticle.x][newParticle.y + 1];
      const isAtTheBottom = !(newParticle.y < this.canvas.height - newParticle.size);
      const isOneSpotAboveBottom = !(newParticle.y < this.canvas.height - newParticle.size - 1);
      const particleBelowLeft = this.matrix[newParticle.x - 1][newParticle.y + 1];
      const particleBelowRight = this.matrix[newParticle.x + 1][newParticle.y + 1];
      const twoParticlesBelowLeft = (particleBelowLeft
                                      && this.matrix[newParticle.x - 1][newParticle.y + 2]);
      const twoParticlesBelowRight = (particleBelowRight
                                      && this.matrix[newParticle.x + 1][newParticle.y + 2]);

      // Particle is at the bottom of the canvas.
      if (isAtTheBottom) { newParticle.isActive = false; } else
      // Particle is not at the bottom and there isn't a particle directly below.
      if (!isThereParticleBelow) {
        this.moveParticleDown(newParticle);
      } else
      // Particle is one spot above bottom,
      // there is a particle below right,
      // and there isn't a particle below left
      // OR
      // Particle isn't one spot above bottom,
      // and there are two spots free to the bottom left.
      if ((isOneSpotAboveBottom && particleBelowRight && !particleBelowLeft)
          || (!isOneSpotAboveBottom && !twoParticlesBelowLeft)) {
        this.moveParticleLeft(newParticle);
      } else
      // Particle is one spot above bottom,
      // there isn't a particle below right,
      // and there is a particle below left
      // OR
      // Particle isn't one spot above bottom,
      // and there are two spots free to the bottom right.
      if ((isOneSpotAboveBottom && !particleBelowRight && particleBelowLeft)
          || (!isOneSpotAboveBottom && !twoParticlesBelowRight)) {
        this.moveParticleRight(newParticle);
      }

      this.drawParticle(newParticle);
      return newParticle;
    });
  }
}

const particleSimulator = new ParticleSimulator(50);

particleSimulator.start();
