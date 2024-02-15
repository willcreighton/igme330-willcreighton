import { selectRandomIndex } from './utils.js';

// Declare babble data arrays
let words1, words2, words3;

// Load babble data using XHR
const loadBabble = () => {
    const xhr = new XMLHttpRequest();

    xhr.onload = babbleLoaded;
    xhr.open('GET', 'data/babble-data.json', true);
    xhr.send();
};

// Callback function when babble data is loaded
function babbleLoaded() {
    if (this.status === 200) {
        const data = JSON.parse(this.responseText);
        words1 = data.words1;
        words2 = data.words2;
        words3 = data.words3;

        // Initialize button click events
        document.querySelector("#default-btn").addEventListener("click", () => generateTechnobabble(1));
        document.querySelector("#hidden-btn").addEventListener("click", () => generateTechnobabble(5));

        // Display initial babble
        generateTechnobabble(1);
    } else {
        console.error('Failed to load babble data.');
    }
}

// Generate technobabble based on the specified number
const generateTechnobabble = (num) => {
    let babble = '';

    for (let i = 0; i < num; i++) {
        babble += `${selectRandomIndex(words1)} ${selectRandomIndex(words2)} ${selectRandomIndex(words3)}<br>`;
    }

    document.querySelector("#output").innerHTML = babble;
};

// Wait for the page to load before allowing interaction with it
window.onload = () => {
    // Rebabble each button click
    document.querySelector("#default-btn").addEventListener("click", () => generateTechnobabble(1));
    document.querySelector("#hidden-btn").addEventListener("click", () => generateTechnobabble(5));

    // Load babble data after the page has loaded
    loadBabble();
};