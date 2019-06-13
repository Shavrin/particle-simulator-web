class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 1;
  }
}

class ParticleSimulator {
  constructor(tickTime) {
    this.handleClick = this.handleClick.bind(this);
    this.update = this.update.bind(this);
    this.particles = [];
    this.tickTime = tickTime;
    this.canvas = document.getElementById('particle-simulator');
    this.canvas.addEventListener('click', this.handleClick);
    this.ctx = this.canvas.getContext('2d');

    setInterval(this.update, this.tickTime);
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const particle = new Particle(x, y);
    this.particles.push(particle);
  }


  drawParticle(particle) {
    this.ctx.fillStyle = 'rgb(0,0,0)';
    this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.height);
  }

  update() {
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

const particleSimulator = new ParticleSimulator(50);
