import Kick from '../classes/kick';
import Snare from '../classes/snare';

class DrumSpace {
  constructor({ bpm = 165, bar = 16, duration = 1, instruments = [], getRecording } = {}) {
    this.context = new AudioContext();
    this.bpm = bpm;
    this.bar = bar;
    this.speed = bpm / bar;
    this.duration = duration;
    this.instruments = instruments;
    this.recordings = [];

    this.output = this.context.createMediaStreamDestination();
    this.recorder = new MediaRecorder(this.output.stream);

    let chunks = [];
    this.recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    this.recorder.onstop = (e) => {
      var blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
      if (getRecording) getRecording(URL.createObjectURL(blob));
    };
  }

  useDefaultInstruments = () => {
    this.instruments = [
      {
        instrument: new Kick(this.context, 'cymbal', {
          output: this.output,
          frequency: 100
        }),
        settings: {
          interval: 16,
          delay: 15
        }
      },
      {
        instrument: new Kick(this.context, 'cymbal', {
          frequency: 100,
          output: this.output
        }),
        settings: {
          interval: 2,
          delay: 0
        }
      },
      {
        instrument: new Snare(this.context, 'snare', {
          output: this.output
        }),
        settings: {
          interval: 8,
          delay: 4
        }
      },
      {
        instrument: new Kick(this.context, 'trap', {
          frequency: 300,
          output: this.output,
        }),
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
        newInstrument = new Kick(this.context, name, {
          frequency: 100,
          output: this.output,
          ...other
        });
        break;
      case 'snare':
        newInstrument = new Snare(this.context, name, {
          output: this.output,
          ...other
        });
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
    this.recorder.start();
    this.instruments.forEach(({ instrument, settings }) => instrument.play({
      interval: settings.interval / this.speed,
      trackDuration: this.duration,
      delay: settings.delay / this.speed
    }));
    setTimeout(() => {
      this.recorder.stop();
    }, this.duration * 1000);
  }

  stop = () => {
    this.recorder.stop();
    this.context.close();
  }
}

export default DrumSpace;
