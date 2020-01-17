import React, { Component } from 'react';
import Kick from '../classes/kick';
import Snare from '../classes/snare';

class Drums extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false
    }
  }

  componentDidMount = () => {
    this.startAudio();
  }

  startAudio = () => {
    this.setState({playing: true}, () => {
      this.audioContext = new AudioContext();
      this.cymbal = new Kick(this.audioContext, 100, 'cymbal');
      this.snare = new Snare(this.audioContext, 200, 'snare');
      this.trap = new Kick(this.audioContext, 300, 'trap');
  
      // cymbal.play({ interval: 1.5, iterations: 1, delay: 1.5, duration: 30 });
      // cymbal.play({ interval: 0.2, iterations: 8, duration: 30 });
      // snare.play({ interval: 0.8, iterations: 2, delay: .4, duration: 30 });
      // trap.play({ interval: 1.0, iterations: 2, duration: 30 });
  
      this.rythm = 16;
      this.bpm = 165;
      this.speed = this.bpm / this.rythm;
      // this.cymbal.play({ interval: 16/this.speed, duration: 60, delay: 15/this.speed });
      // this.cymbal.play({ interval: 2/this.speed, duration: 60, delay: 0 });
      this.snare.play({ interval: 8/this.speed, duration: 60, delay: 4/this.speed });
      // this.trap.play({ interval: 10/this.speed, duration: 60, delay: 0 });

    });
  }

  stopAudio = () => {
    this.setState({playing: false}, () => {
      this.audioContext.close()
    });
  }

  render() {
    return <button onClick={() => {
      if (this.state.playing) {
        this.stopAudio();
      } else {
        this.startAudio();
      }
    }}>{this.state.playing ? 'stop' : 'start'}</button>;
  }
}

export default Drums;
