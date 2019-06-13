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

  update() {
    this.clearCanvas();

    this.particles = this.particles.map((particle) => {
      if (!particle.isActive) {
        this.drawParticle(particle);
        return particle;
      }

      const updatedParticle = particle;
      const particleBelow = this.matrix[particle.x][particle.y + 1];
      if (!particleBelow && updatedParticle.y < this.canvas.height - updatedParticle.size) {
        updatedParticle.y += 1;
        this.matrix[updatedParticle.x][updatedParticle.y - 1] = undefined;
        this.matrix[updatedParticle.x][updatedParticle.y] = true;
      } else {
        updatedParticle.isActive = false;
      }
      this.drawParticle(updatedParticle);
      return updatedParticle;
    });
  }
}

const particleSimulator = new ParticleSimulator(1);

particleSimulator.start();
