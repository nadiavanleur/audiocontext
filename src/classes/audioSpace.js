class AudioSpace {
  constructor(context, rhythm = 16, bpm = 185) {
    this.context = context;
    this.rhythm = rhythm;
    this.bpm = bpm;
    this.speed = bpm / rhythm;
  }
}

export default AudioSpace;
