import ParticleSimulator from './ParticleSimulator';
import ControlPanel from './ControlPanel';

const particleSimulator = new ParticleSimulator(50);
const controlPanel = new ControlPanel();

particleSimulator.start();
