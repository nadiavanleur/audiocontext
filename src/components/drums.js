import React, { Component } from 'react';
import DrumSpace from '../classes/drumSpace';

class Drums extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      recordings: []
    };
  }

  componentDidMount = () => {
    this.startAudio();
  }

  startAudio = () => {
    this.setState({ playing: true }, () => {
      this.drumSpace = new DrumSpace({
        duration: 60,
        getRecording: recording => this.setState({ recordings: [...this.state.recordings, recording] })
      });
      // this.drumSpace.useDefaultInstruments();
      this.drumSpace.addInstrument('kick', { interval: 16, delay: 15 });
      this.drumSpace.addInstrument('kick', { interval: 2, delay: 0 });
      this.drumSpace.addInstrument('snare', { interval: 8, delay: 4 });
      this.drumSpace.addInstrument('kick', { interval: 10, delay: 0, frequency: 300 });
      this.drumSpace.play();
    });
  };

  stopAudio = () => {
    this.setState({ playing: false }, () => {
      this.drumSpace.stop();
    });
  };

  render() {
    const { recordings } = this.state;

    return (
      <>
        <button
          onClick={() => {
            if (this.state.playing) {
              this.stopAudio();
            } else {
              this.startAudio();
            }
          }}
        >
          {this.state.playing ? 'stop' : 'start'}
        </button>
        {recordings && (
          <ul>
            {recordings.map(recording => {
              return (
                <li key={recording.toString()}>
                  <audio controls src={recording} />
                </li>
              )
            })}
          </ul>
        )}
      </>
    );
  }
}

export default Drums;
