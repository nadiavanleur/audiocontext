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
      this.drumSpace = new DrumSpace({
        duration: 60,
      });
      this.drumSpace.addInstrument('kick', {interval: 16, delay: 15});
      this.drumSpace.addInstrument('kick', {interval: 2, delay: 0});
      this.drumSpace.addInstrument('snare', {interval: 8, delay: 4});
      this.drumSpace.addInstrument('kick', {interval: 10, delay: 0, frequency: 300});
      this.drumSpace.play();
    });
  }

  stopAudio = () => {
    this.setState({playing: false}, () => {
      this.audioContext.close()
    });
  }

  render() {
    return (
      <>
        <button onClick={() => this.drumSpace.stop()}>stop</button>
        <button onClick={() => this.drumSpace.play()}>play</button>
      </>
    );
  }
}

export default Drums;
