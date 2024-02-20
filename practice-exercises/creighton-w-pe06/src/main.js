import { getRandomColor, getRandomInt } from './utils.js';
import { drawRectangle, drawArc, drawLine } from './canvas-utils.js';

function init() {
    let paused = false;
    let createRectangles = true;
    let createArcs = false;
    let createLines = false;

    const setUpUI = () => {
        document.querySelector("#btn-play").addEventListener("click", () => {
            paused = false;
        });

        document.querySelector("#btn-pause").addEventListener("click", () => {
            paused = true;
        });

        document.querySelector("canvas").addEventListener("click", canvasClicked);

        document.querySelector("#cb-rectangles").addEventListener("change", function () {
            createRectangles = this.checked;
        });

        document.querySelector("#cb-arcs").addEventListener("change", function () {
            createArcs = this.checked;
        });

        document.querySelector("#cb-lines").addEventListener("change", function () {
            createLines = this.checked;
        });

        document.querySelector("#btn-clear").addEventListener("click", clearScreen);
    };

    const canvasClicked = (e) => {
        let rect = e.target.getBoundingClientRect();
        let mouseX = e.clientX - rect.x;
        let mouseY = e.clientY - rect.y;

        if (createArcs) {
            let canvas = document.querySelector("canvas");
            const ctx = canvas.getContext('2d');
            drawArc(ctx, mouseX, mouseY, getRandomInt(10, 40), getRandomColor(), getRandomInt(1, 5), getRandomColor());
        }
    };

    const drawRandomRect = (ctx) => {
        let width = getRandomInt(10, 40);
        let height = getRandomInt(10, 40);
        let x = getRandomInt(0, ctx.canvas.width - width);
        let y = getRandomInt(0, ctx.canvas.height - height);

        drawRectangle(ctx, x, y, width, height, getRandomColor());
    };

    const drawRandomArc = (ctx) => {
        let radius = getRandomInt(10, 40);
        let x = getRandomInt(0 + radius, ctx.canvas.width - radius);
        let y = getRandomInt(0 + radius, ctx.canvas.height - radius);

        drawArc(ctx, x, y, radius, getRandomColor(), getRandomInt(1, 5), getRandomColor());
    };

    const drawRandomLine = (ctx) => {
        let x1 = getRandomInt(0, ctx.canvas.width);
        let y1 = getRandomInt(0, ctx.canvas.height);
        let x2 = getRandomInt(0, ctx.canvas.width);
        let y2 = getRandomInt(0, ctx.canvas.height);
        
        drawLine(ctx, x1, y1, x2, y2, getRandomInt(1, 5), getRandomColor());
    };

    const clearScreen = () => {
        let canvas = document.querySelector("canvas");
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawRandomShapes = (ctx) => {
        if (createRectangles) {
            drawRandomRect(ctx);
        }
        if (createArcs) {
            drawRandomArc(ctx);
        }
        if (createLines) {
            drawRandomLine(ctx);
        }
    };

    const animate = () => {
        let canvas = document.querySelector("canvas");
        const ctx = canvas.getContext('2d');

        if (!paused) {
            drawRandomShapes(ctx);
        }

        requestAnimationFrame(animate);
    };

    // Execute the animations
    animate();
    setUpUI();
}

init();