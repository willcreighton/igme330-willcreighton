/*
    main.js is primarily responsible for hooking up the UI to the rest of the application
    and setting up the main event loop.
*/

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

let appData;

fetch('./data/av-data.json')
  .then(response => response.json())
  .then(data => {
    appData = data;
  })
  .catch(error => console.error('Error loading data:', error));

export { appData };

// Faking an enumeration
const DEFAULTS = Object.freeze({
  sound1: "media/New Adventure Theme.mp3"
});

const drawParams = {
  showGradient: true,
  showBars: true,
  showCircles: true,
  showNoise: false,
  showInvert: false,
  showEmboss: false
};

const init = () => {
  audio.setUpWebAudio(DEFAULTS.sound1);
  console.log("init called");
  console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  const canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  setUpUI(canvasElement);
  canvas.setupCanvas(canvasElement, audio.analyserNode);
  loop();

  const addCheckboxListener = (checkbox, property) => {
    checkbox.addEventListener('change', () => {
      drawParams[property] = checkbox.checked;
    });
  };

  addCheckboxListener(document.querySelector('#gradient-cb'), 'showGradient');
  addCheckboxListener(document.querySelector('#bars-cb'), 'showBars');
  addCheckboxListener(document.querySelector('#circles-cb'), 'showCircles');
  addCheckboxListener(document.querySelector('#noise-cb'), 'showNoise');
  addCheckboxListener(document.querySelector('#invert-cb'), 'showInvert');
  addCheckboxListener(document.querySelector('#emboss-cb'), 'showEmboss');
};

const setUpUI = (canvasElement) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fs-button");
  const playButton = document.querySelector("#play-button");

  // add .onclick event to button
  fsButton.onclick = () => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  playButton.onclick = () => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    // check if context is in suspended state (autoplay policy)
    if (audio.audioCtx.state === "suspended") {
      audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);

    if (playButton.dataset.playing === "no") {
      audio.playCurrentSound();
      playButton.dataset.playing = "yes";
    } else {
      audio.pauseCurrentSound();
      playButton.dataset.playing = "no";
    }
  };

  // C - hookup sliders & labels
  const volumeSlider = document.querySelector("#volume-slider");
  const volumeLabel = document.querySelector("#volume-label");
  const bassSlider = document.querySelector("#bass-slider");
  const bassLabel = document.querySelector("#bass-label");
  const trebleSlider = document.querySelector("#treble-slider");
  const trebleLabel = document.querySelector("#treble-label");

  // add .oninput event to slider
  volumeSlider.oninput = (e) => {
    // set the gain
    audio.setVolume(e.target.value);
    // update value of label to match value of slider
    volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
  };

  // set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  // Bass set up
  bassSlider.oninput = (e) => {
    audio.setBass(e.target.value);
    bassLabel.innerHTML = e.target.value;
  }

  bassSlider.dispatchEvent(new Event("input"));

  // Treble set up
  trebleSlider.oninput = (e) => {
    audio.setTreble(e.target.value);
    trebleLabel.innerHTML = e.target.value;
  }

  trebleSlider.dispatchEvent(new Event("input"));

  // D - hookup track select
  const trackSelect = document.querySelector("#track-select");
  // add .onchange event to select
  trackSelect.onchange = (e) => {
    audio.loadSoundFile(e.target.value);
    // pause the current track if it is playing
    if (playButton.dataset.playing === "yes") {
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  };
};

// Define the target fps to cap the frame rate
const targetFPS = 60;
let lastFrameTime = performance.now();

const loop = () => {
  const currentTime = performance.now();
  const elapsed = currentTime - lastFrameTime;

  // Ensure that at least 16.67ms (1000ms / 60 FPS) has passed since the last frame
  if (elapsed > 16.67) {
    lastFrameTime = currentTime;

    canvas.draw(drawParams);

    // Schedule the next frame
    setTimeout(loop, 1000 / targetFPS);
  } else {
    // If less than 16.67ms has passed, wait until the next frame
    setTimeout(loop, 16.67 - elapsed);
  }
};

export { init };