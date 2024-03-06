// WebAudio context (public)
let audioCtx;

// WebAudio nodes that are part of the audio routing graph (private)
let element, sourceNode, analyserNode, gainNode, bassNode, trebleNode;

// Enumeration for default values
const DEFAULTS = Object.freeze({
  gain: 0.5,
  numSamples: 256
});

// Array to hold audio frequency data
let audioData = new Uint8Array(DEFAULTS.numSamples / 2);

// Public methods (exported at the bottom of the file)
const setUpWebAudio = (filePath) => {
  // Create AudioContext
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  // Create an <audio> element
  element = new Audio();

  // Load sound file
  loadSoundFile(filePath);

  // Create a source node that points at the <audio> element
  sourceNode = audioCtx.createMediaElementSource(element);

  // Create an analyser node
  analyserNode = audioCtx.createAnalyser();

  // Set the number of samples or "bins" for the sound spectrum
  analyserNode.fftSize = DEFAULTS.numSamples;

  // Create a gain (volume) node
  gainNode = audioCtx.createGain();
  gainNode.gain.value = DEFAULTS.gain;

  // Create Bass node
  bassNode = audioCtx.createBiquadFilter();
  bassNode.type = "lowshelf"; // Use lowshelf type for bass
  bassNode.frequency.value = 150; // Set initial frequency value

  // Create Treble node
  trebleNode = audioCtx.createBiquadFilter();
  trebleNode.type = "highshelf"; // Use highshelf type for treble
  trebleNode.frequency.value = 3000; // Set initial frequency value

  // Connect the nodes - create the audio graph
  sourceNode.connect(analyserNode);
  analyserNode.connect(bassNode); // Connect analyserNode to Bass node
  bassNode.connect(trebleNode); // Connect Bass node to Treble node
  trebleNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);
};

const loadSoundFile = (filePath) => {
  element.src = filePath;
};

const playCurrentSound = () => {
  element.play();
};

const pauseCurrentSound = () => {
  element.pause();
};

const setVolume = (value) => {
  value = Number(value); // Make sure it's a Number rather than a String
  gainNode.gain.value = value;
};

const setBass = (value) => {
  value = Number(value); // Make sure it's a Number rather than a String
  bassNode.gain.value = value;
}

const setTreble = (value) => {
  value = Number(value); // Make sure it's a Number rather than a String
  trebleNode.gain.value = value;
}

// Exported variables and methods
export { audioCtx, setUpWebAudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, setBass, setTreble, analyserNode };