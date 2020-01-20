import { secondsToHHMMSS } from '../helpers/format';

class Snare {
  /**
   * constructor
   * 
   * @param {delay} [optional] delay before first beat in seconds
   * @param {interval} [optional] interval between beats in seconds
   * @param {iterations} [optional] number of times snare is triggered
   * @param {soundDuration} [optional] duration of sound in seconds
   * @param {trackDuration} [optional] duration of track in seconds
   * @param {volume} [optional] volume
   */
  constructor(context, name, settings = {
    output: false
  }) {
    this.context = context;
    this.output = settings.output;
    this.name = name || `Snare`;
  }

  /**
   * noiseBuffer
   * - Create splash sound buffer
   */
  noiseBuffer = () => {
    const bufferSize = this.context.sampleRate;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    return buffer;
  };

  /**
   * trigger
   * - Trigger snare once
   * 
   * @param {duration} [optional] duration of sound in seconds
   * @param {start} [optional] start time in seconds
   * @param {volume} [optional] volume
   */
  trigger = ({
    duration = .2,
    start = 0,
    volume = .5
  } = {}) => {
    // Create noise
    this.noise = this.context.createBufferSource();
    this.noise.buffer = this.noiseBuffer();
    const noiseFilter = this.context.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    this.noise.connect(noiseFilter);
    this.noiseEnvelope = this.context.createGain();
    noiseFilter.connect(this.noiseEnvelope);

    // Create oscillator
    this.osc = this.context.createOscillator();
    this.osc.type = 'triangle';
    this.oscEnvelope = this.context.createGain();
    this.osc.connect(this.oscEnvelope);
    this.oscEnvelope.connect(this.context.destination);

    this.noiseEnvelope.connect(this.context.destination);

    // Set variables for current trigger
    this.noiseEnvelope.gain.setValueAtTime(volume, start);
    this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, start + duration);

    this.osc.frequency.setValueAtTime(100, start);
    this.oscEnvelope.gain.setValueAtTime(0.7, start);
    this.oscEnvelope.gain.exponentialRampToValueAtTime(0.01, start + duration / 2);

    // Connect output and start sound
    if (this.output) this.noiseEnvelope.connect(this.output);
    this.noise.start(start)

    if (this.output) this.oscEnvelope.connect(this.output);
    this.osc.start(start)

    // Stop sounds after duration
    this.noise.stop(start + duration);
    this.osc.stop(start + duration);
  }

  /**
   * play
   * - Play snare on loop
   * 
   * @param {delay} [optional] delay before first beat in seconds
   * @param {interval} [optional] interval between beats in seconds
   * @param {iterations} [optional] number of times snare is triggered
   * @param {soundDuration} [optional] duration of sound in seconds
   * @param {trackDuration} [optional] duration of track in seconds
   * @param {volume} [optional] volume
   */
  play = ({
    delay = 0,
    trackDuration,
    interval = .2,
    iterations = 100,
    soundDuration,
    volume
  } = {}) => {
    let actualIterations = iterations;

    if (trackDuration) actualIterations = (trackDuration - interval) / (interval || 1);

    for (let i = 0; i < actualIterations; i++) {
      const start = (i * interval) + delay || delay;
      this.trigger({ start, soundDuration, volume });
    }

    console.info(`Playing ${this.name} ${actualIterations} times for ${secondsToHHMMSS(trackDuration || iterations * interval * 2)} at an interval of ${interval}s`);
  }
}

export default Snare;
