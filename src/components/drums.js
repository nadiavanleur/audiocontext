import React, { Component } from 'react';
import DrumSpace from '../classes/drumSpace';

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
      const drumSpace = new DrumSpace({
        duration: 60
      });
      drumSpace.addInstrument('kick', {interval: 16, delay: 15});
      drumSpace.addInstrument('kick', {interval: 2, delay: 0});
      drumSpace.addInstrument('snare', {interval: 8, delay: 4});
      drumSpace.addInstrument('kick', {interval: 10, delay: 0, frequency: 300});
      drumSpace.play();
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
