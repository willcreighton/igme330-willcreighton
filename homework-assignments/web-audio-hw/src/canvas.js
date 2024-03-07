/*
  The purpose of this file is to take in the analyser node and a <canvas> element:
  - The module will create a drawing context that points at the <canvas>
  - It will store the reference to the analyser node
  - In draw(), it will loop through the data in the analyser node
  - And then draw something representative on the canvas
  - Maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import { appData } from './main.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;
let isFrequencyData = true

const setupCanvas = (canvasElement, analyserNodeRef) => {
  // Create drawing context
  ctx = canvasElement.getContext("2d");
  canvasWidth = canvasElement.width;
  canvasHeight = canvasElement.height;

  // Create a cyberpunk-y gradient that runs top to bottom
  gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [
    { percent: 0, color: "#8B00FF" },       // Electric Purple
    { percent: 0.25, color: "#FF1493" },    // Deep Pink
    { percent: 0.5, color: "#FF69B4" },     // Hot Pink
    { percent: 0.75, color: "#4B0082" },    // Indigo
    { percent: 1, color: "#000080" }        // Navy Blue
  ]);

  // Keep a reference to the analyser node
  analyserNode = analyserNodeRef;

  // This is the array where the analyser data will be stored
  audioData = new Uint8Array(analyserNode.fftSize / 2);

  // Add events to select data dropdown options
  const selectElement = document.querySelector("#data-select");
  selectElement.addEventListener("change", (e) => {
    const value = e.target.value;
    if (value === "frequency") {
      isFrequencyData = true;
    } else {
      isFrequencyData = false;
    }
  });
};

// This class handles the creation and animation of squares that dance around the screen and scale to the frequency
class MusicalSquare {
    constructor(ctx, x, y, size, color, initialRotation = 0, initialVelocityX = 2, initialVelocityY = 1) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = color;
      this.rotation = initialRotation;
      this.velocityX = initialVelocityX;
      this.velocityY = initialVelocityY;
    }
  
    update() {
      // Update the position based on velocity
      this.x += this.velocityX;
      this.y += this.velocityY;
  
      // Bounce off the right and left walls
      if (this.x + this.size / 2 > canvasWidth || this.x - this.size / 2 < 0) {
        this.velocityX = -this.velocityX;
      }
  
      // Bounce off the bottom and top walls
      if (this.y + this.size / 2 > canvasHeight || this.y - this.size / 2 < 0) {
        this.velocityY = -this.velocityY;
      }
  
      // Update the rotation angle over time
      this.rotation += 0.01;

      // Update the size based on the audioData values
      const scaleMultiplier = 1 + audioData[0] / 255;
      this.size = Math.max(10, Math.min(100, scaleMultiplier * 50));
    }
  
    draw() {
      this.ctx.save();
  
      // Translate the context to the center of the square
      this.ctx.translate(this.x, this.y);
  
      // Rotate the square by the updated angle
      this.ctx.rotate(this.rotation);
  
      // Draw the square
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
  
      this.ctx.restore();
    }
  }
  let musSquareA;
  let musSquareB;

  const draw = (params = {}) => {
  // 1 - Populate the audioData array with the frequency (or waveform) data from the analyserNode
  if (isFrequencyData) {
    analyserNode.getByteFrequencyData(audioData);
  } else {
    analyserNode.getByteTimeDomainData(audioData);
  }

  // 2 - Draw background
  ctx.save();
  ctx.fillStyle = "black";
  ctx.globalAlpha = 0.1;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.restore();

  // Set up the musical squares
  if (musSquareA == undefined) {
    musSquareA = new MusicalSquare(ctx, canvasWidth / 2, canvasHeight / 2, appData.spriteData.spriteSize, "rgba(255, 0, 0, 0.5)");
  }
  musSquareA.update();
  musSquareA.draw();

  if (musSquareB == undefined) {
    musSquareB = new MusicalSquare(ctx, canvasWidth / 2, canvasHeight / 2, appData.spriteData.spriteSize, "rgba(0, 0, 255, 0.5)", Math.PI / 4, 1, 2);
  }
  musSquareB.update();
  musSquareB.draw();

  // 3 - Draw gradient
  if (params.showGradient) {
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
  }

  // 4 - Draw bars
  if (params.showBars) {
    let barSpacing = 4;
    let margin = 5;
    let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
    let barWidth = screenWidthForBars / audioData.length;
    let barHeight = 200;
    let topSpacing = 100;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,255,0.50)';
    ctx.strokeStyle = 'rgba(0,0,255,0.75)';
    for (let i = 0; i < audioData.length; i++) {
      ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
      ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
    }
    ctx.restore();
  }

  // 5 - Draw circles
  if (params.showCircles) {
    let maxRadius = canvasHeight / 4;
    ctx.save();
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < audioData.length; i++) {
      let percent = audioData[i] / 255;
      let circleRadius = percent * maxRadius;

      const drawCircle = (fillStyle, radiusMultiplier) => {
        ctx.beginPath();
        ctx.fillStyle = utils.makeColor(...fillStyle);
        ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * radiusMultiplier, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
      };

      drawCircle([255, 111, 111, 0.34 - percent / 3.0], 1);
      drawCircle([0, 0, 255, 0.10 - percent / 10.0], 1.5);

      ctx.save();
      drawCircle([200, 200, 0, 0.5 - percent / 5.0], 0.5);
      ctx.restore();
    }
    ctx.restore();
  }

  // 6 - Bitmap manipulation

  // A) Grab all of the pixels on the canvas and put them in the `data` array
  // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
  // The variable `data` below is a reference to that array
  let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  let data = imageData.data;
  let length = data.length;
  let width = imageData.width;

  // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
  for (let i = 0; i < length; i += 4) {
    // C) Randomly change every 20th pixel to red
    if (params.showNoise && Math.random() < 0.05) {
      data[i] = data[i + 1] = data[i + 2] = 0;
      data[i] = 255;
    }

    if (params.showInvert) {
      let red = data[i], green = data[i + 1], blue = data[i + 2];
      data[i] = 255 - red;
      data[i + 1] = 255 - green;
      data[i + 2] = 255 - blue;
    }
  }

  if (params.showEmboss) {
    for (let i = 0; i < length; i++) {
      if (i % 4 == 3) continue;
      data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
    }
  }

  // D) Copy image data back to canvas
  ctx.putImageData(imageData, 0, 0);
};

export { setupCanvas, draw };