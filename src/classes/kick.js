import {secondsToHHMMSS} from '../helpers/format';

class Kick {
  constructor(context, name, settings = {
    frequency: 150
  }) {
    this.context = context;
    this.settings = settings;
    this.name = name || `Kick ${settings.frequency}Hz`;
  }

  /**
   * trigger
   * - Trigger kick once
   * 
   * @param {duration} [optional] duration of sound in seconds
   * @param {start} [optional] start time in seconds
   * @param {volume} [optional] volume
   */
  trigger = ({
    start = 0,
    duration = .5,
    volume = 1
  } = {}) => {
    this.osc = this.context.createOscillator();
    this.gain = this.context.createGain();
    this.osc.connect(this.gain);
    this.gain.connect(this.context.destination);

    this.osc.frequency.setValueAtTime(this.settings.frequency, start);
    this.gain.gain.setValueAtTime(volume, start);
    this.osc.frequency.exponentialRampToValueAtTime(0.01, start + duration);
    this.gain.gain.exponentialRampToValueAtTime(0.01, start + duration);

    this.osc.start(start, 0, start + duration);
  }

  /**
   * play
   * - Play kick on loop
   * 
   * @param {delay} [optional] delay before first beat in seconds
   * @param {interval} [optional] interval between beats in seconds
   * @param {iterations} [optional] number of times kick is triggered
   * @param {soundDutation} [optional] duration of sound in seconds
   * @param {trackDuration} [optional] duration of track in seconds
   * @param {volume} [optional] volume
   */
  play = ({
    delay = 0,
    interval = .5,
    iterations = 100,
    soundDutation,
    trackDuration,
    volume
  } = {}) => {
    let actualIterations = iterations;
    
    if (trackDuration) actualIterations = (trackDuration - interval) / (interval || 1);

    for (let i = 0; i < actualIterations; i++) {
      const start = (i * interval) + delay || delay;
      this.trigger({start, soundDutation, volume});
    }

    console.info(`Playing ${this.name} ${actualIterations} times for ${secondsToHHMMSS(trackDuration || iterations*interval*2)} at an interval of ${interval}s`);
  }
}

export default Kick;
