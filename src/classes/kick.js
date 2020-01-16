import {secondsToHHMMSS} from '../helpers/format';

class Kick {
  constructor(context, frequency = 150, name) {
    this.context = context;
    this.frequency = frequency;
    this.name = name || `${frequency}Hz`;
  }

  /**
   * setFrequency
   * 
   * @param frequency [required] new frequency
   */
  setFrequency = (frequency) => this.frequency = frequency;
  
  /**
   * trigger
   * - Trigger kick once
   * 
   * @param time [optional] start time in seconds
   * @param length [optional] length of sound in seconds
   */
  trigger = (time = 0, length = .5) => {
    this.osc = this.context.createOscillator();
    this.gain = this.context.createGain();
    this.osc.connect(this.gain);
    this.gain.connect(this.context.destination);

    this.osc.frequency.setValueAtTime(this.frequency, time);
    this.gain.gain.setValueAtTime(1, time);
    this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    this.osc.start(time, 0, time + length);
  }

  /**
   * play
   * - Play kick on loop
   * 
   * @param {iterations} [optional] number of times kick is triggered
   * @param {duration} [optional] duration of loop in seconds
   * @param {interval} [optional] interval between beats in seconds
   * @param {delay} [optional] delay before first beat in seconds
   */
  play = ({iterations = 100, interval = .5, delay = 0, duration} = {}) => {
    let actualIterations = iterations;
    
    if (duration) actualIterations = (duration - interval) / (interval || 1);

    for (let i = 0; i < actualIterations; i++) {
      const start = (i * interval) + delay || delay;
      this.trigger(start, interval);
    }

    console.info(`Playing kick ${this.name} ${actualIterations} times for ${secondsToHHMMSS(duration || iterations*interval*2)} at an interval of ${interval}s`);
  }
}

export default Kick;
