import React, { Component } from 'react';
import Kick from '../classes/kick';

class Drums extends Component {
  componentDidMount = () => {
    const context = new AudioContext();
    const cymbal = new Kick(context, 100, 'cymbal');
    const snare = new Kick(context, 200, 'snare');
    const trap = new Kick(context, 300, 'trap');

    // cymbal.play({ interval: 1.5, iterations: 1, delay: 1.5, duration: 30 });
    // cymbal.play({ interval: 0.2, iterations: 8, duration: 30 });
    // snare.play({ interval: 0.8, iterations: 2, delay: .4, duration: 30 });
    // trap.play({ interval: 1.0, iterations: 2, duration: 30 });

    const rythm = 16;
    const bpm = 165;
    const speed = bpm / rythm;
    cymbal.play({ interval: 16/speed, duration: 60, delay: 15/speed });
    cymbal.play({ interval: 2/speed, duration: 60, delay: 0 });
    snare.play({ interval: 8/speed, duration: 60, delay: 4/speed });
    trap.play({ interval: 10/speed, duration: 60, delay: 0 });
  }

  render() {
    return <h4>Drums</h4>;
  }
}

export default Drums;
