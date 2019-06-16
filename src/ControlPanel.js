export default class ControlPanel {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
    document.getElementsByTagName('body')[0].addEventListener('click', this.handleClick);
    this.selectedParticleType = 'sand';
  }

  handleClick({ target }) {
    switch (target.className) {
      case 'sand':
        this.selectedParticleType = 'sand';
        break;
      case 'water':
        this.selectedParticleType = 'water';
        break;
      case 'gas':
        this.selectedParticleType = 'water';
        break;
      default: break;
    }
  }
}
