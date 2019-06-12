class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 1;
  }
}

class ParticleSimulator {
  constructor(tickTime) {
    this.particles = [];
    this.tickTime = tickTime;
    setInterval(this.update, this.tickTime);
    this.canvas = document.getElementById('particle-simulator');
    this.canvas.addEventListener('click', this.handleClick);
    this.ctx = this.canvas.getContext('2d');
  }

  handleClick = (e) => {
    const position = this.getMousePosition(e);
    const particle = new Particle(position.x, position.y);
    this.particles.push(particle);
  }

  getMousePosition = (evt) => {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }

  drawParticle = (particle) => {
    this.ctx.fillStyle = 'rgb(0,0,0)';
    this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  }

  clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.height);
  }

  update = () => {
    this.clearCanvas();

    this.particles = this.particles.map((particle) => {
      const updatedParticle = particle;
      if (updatedParticle.y < this.canvas.height - updatedParticle.size) {
        updatedParticle.y += 1;
      }
      this.drawParticle(updatedParticle);
      return updatedParticle;
    });
  }
}

const particleSimulator = new ParticleSimulator(10);
particleSimulator.update();
