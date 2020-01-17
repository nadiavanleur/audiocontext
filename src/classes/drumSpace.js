import Kick from '../classes/kick';
import Snare from '../classes/snare';

class DrumSpace {
  constructor({bpm = 165, steps = 16, duration = 1, instruments = []} = {}) {
    this.context = new AudioContext();
    this.bpm = bpm;
    this.steps = steps;
    this.speed = bpm / steps;
    this.duration = duration;
    this.instruments = instruments;
  }

  useDefaultInstruments = () => {
    this.instruments = [
      {
        instrument: new Kick(this.context, 'cymbal', {frequency: 100}),
        settings: {
          interval: 16,
          delay: 15
        }
      },
      {
        instrument: new Kick(this.context, 'cymbal', {frequency: 100}),
        settings: {
          interval: 2,
          delay: 0
        }
      },
      {
        instrument: new Snare(this.context, 'snare'),
        settings: {
          interval: 8,
          delay: 4
        }
      },
      {
        instrument: new Kick(this.context, 'trap', {frequency: 300}),
        settings: {
          interval: 10,
          delay: 0
        }
      }
    ]
  }

  addInstrument = (instrument = 'kick', { interval, delay, name = 'instrument', ...other } = {}) => {
    let newInstrument;

    switch (instrument) {
      case 'kick':
        newInstrument = new Kick(this.context, name, { frequency: 100, ...other });
        break;
      case 'snare':
        newInstrument = new Snare(this.context, name, other);
        break;

      default:
        console.warn(`Unknown instrument ${instrument}`)
        break;
    }

    if (newInstrument) this.instruments.push({
      instrument: newInstrument,
      settings: {
        interval,
        delay
      }
    });
  }

  play = () => {
    this.instruments.forEach(({instrument, settings}) => instrument.play({
      interval: settings.interval/this.speed,
      trackDuration: this.duration,
      delay: settings.delay/this.speed
    }));
  }
}

export default DrumSpace;
