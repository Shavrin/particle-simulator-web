import Particle from './Particle';

export default class ParticleSimulator {
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
    this.canvas.addEventListener('contextmenu', this.handleClick);
    this.ctx = this.canvas.getContext('2d');
  }

  start() {
    setInterval(this.update, this.tickTime);
  }

  stop() {
    clearInterval(this.update);
  }

  handleClick(e) {
    e.preventDefault();
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
    const particle = new Particle(x, y, e.type === 'click' ? 'sand' : 'water');
    this.particles.push(particle);
    this.matrix[x][y] = true;
  }


  drawParticle(particle) {
    switch (particle.type) {
      case 'sand':
        this.ctx.fillStyle = 'yellow';
        break;
      case 'water':
        this.ctx.fillStyle = 'blue';
        break;
      default:
        this.ctx.fillStyle = 'white';
    }
    this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  }

  clearCanvas() {
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.height);
  }

  moveParticleDown(particle) {
    const newParticle = particle;
    delete this.matrix[newParticle.x][newParticle.y];
    newParticle.y += 1;
    this.matrix[newParticle.x][newParticle.y] = true;
  }

  moveParticleLeft(particle) {
    const newParticle = particle;
    delete this.matrix[newParticle.x][newParticle.y];
    newParticle.x -= 1;
    this.matrix[newParticle.x][newParticle.y] = true;
  }

  moveParticleRandomlyLeftRight(particle) {
    if (Math.random() >= 0.5) {
      this.moveParticleRight(particle);
    } else {
      this.moveParticleLeft(particle);
    }
  }

  moveParticleRight(particle) {
    const newParticle = particle;
    delete this.matrix[newParticle.x][newParticle.y];
    newParticle.x += 1;
    this.matrix[newParticle.x][newParticle.y] = true;
  }

  sandBehaviour(particle) {
    const newParticle = particle;
    const isThereParticleBelow = this.matrix[newParticle.x][newParticle.y + 1];
    const isAtTheBottom = !(newParticle.y < this.canvas.height - newParticle.size);
    const isOneSpotAboveBottom = !(newParticle.y < this.canvas.height - newParticle.size - 1);
    const isOnTheRightSide = newParticle.x === 99;
    const isOnTheLeftSide = newParticle.x === 0;
    const particleBelowLeft = isOnTheLeftSide
      ? false
      : this.matrix[newParticle.x - 1][newParticle.y + 1];
    const particleBelowRight = isOnTheRightSide
      ? false
      : this.matrix[newParticle.x + 1][newParticle.y + 1];
    const twoParticlesBelowLeft = (particleBelowLeft
                                    && this.matrix[newParticle.x - 1][newParticle.y + 2]);
    const twoParticlesBelowRight = (particleBelowRight
                                    && this.matrix[newParticle.x + 1][newParticle.y + 2]);
    if (!newParticle.isActive) {
      // If it's not active, don't do anything.
    } else
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
    if (((isOneSpotAboveBottom && particleBelowRight && !particleBelowLeft)
        || (!isOneSpotAboveBottom && !twoParticlesBelowLeft)) && !isOnTheLeftSide) {
      this.moveParticleLeft(newParticle);
    } else
    // Particle is one spot above bottom,
    // there isn't a particle below right,
    // and there is a particle below left
    // OR
    // Particle isn't one spot above bottom,
    // and there are two spots free to the bottom right.
    if (((isOneSpotAboveBottom && !particleBelowRight && particleBelowLeft)
        || (!isOneSpotAboveBottom && !twoParticlesBelowRight)) && !isOnTheRightSide) {
      this.moveParticleRight(newParticle);
    }
    return newParticle;
  }

  waterBehaviour(particle) {
    const newParticle = particle;
    const isThereParticleBelow = this.matrix[newParticle.x][newParticle.y + 1];
    const isAtTheBottom = !(newParticle.y < this.canvas.height - newParticle.size);
    const isOnTheRightSide = newParticle.x === 99;
    const isOnTheLeftSide = newParticle.x === 0;
    const rightSpotFree = isOnTheRightSide ? false : !this.matrix[newParticle.x + 1][newParticle.y];
    const leftSpotFree = isOnTheLeftSide ? false : !this.matrix[newParticle.x - 1][newParticle.y];

    if (isAtTheBottom) {
      if (rightSpotFree && leftSpotFree) {
        this.moveParticleRandomlyLeftRight(newParticle);
      } else if (rightSpotFree && !leftSpotFree) {
        this.moveParticleRight(newParticle);
      } else if (leftSpotFree && !rightSpotFree && !isOnTheLeftSide) {
        this.moveParticleLeft(newParticle);
      }
    } else if (!isThereParticleBelow) {
      this.moveParticleDown(newParticle);
    } else if (rightSpotFree && leftSpotFree) {
      this.moveParticleRandomlyLeftRight(newParticle);
    } else if (!leftSpotFree && rightSpotFree) {
      this.moveParticleRight(newParticle);
    } else if (leftSpotFree && !rightSpotFree && !isOnTheLeftSide) {
      this.moveParticleLeft(newParticle);
    }

    return newParticle;
  }

  update() {
    this.clearCanvas();

    this.particles = this.particles.map((particle) => {
      let newParticle = particle;
      switch (particle.type) {
        case 'sand':
          newParticle = this.sandBehaviour(particle);
          break;
        case 'water':
          newParticle = this.waterBehaviour(particle);
          break;
        default:
          newParticle = this.sandBehaviour(particle);
          break;
      }
      this.drawParticle(newParticle);
      return newParticle;
    });
  }
}
