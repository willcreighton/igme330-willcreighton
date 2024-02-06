"use strict";

// Babble declaration
const words1 = [
    "Acute", "Aft", "Anti-matter", "Bipolar", "Cargo", "Command", "Communication", "Computer", "Deuterium", "Dorsal",
    "Emergency", "Engineering", "Environmental", "Flight", "Fore", "Guidance", "Heat", "Impulse", "Increased",
    "Inertial", "Infinite", "Ionizing", "Isolinear", "Lateral", "Linear", "Matter", "Medical", "Navigational",
    "Optical", "Optimal", "Optional", "Personal", "Personnel", "Phased", "Reduced", "Science", "Ship's",
    "Shuttlecraft", "Structural", "Subspace", "Transporter", "Ventral"
];
const words2 = [
    "Propulsion", "Dissipation", "Sensor", "Improbability", "Buffer", "Graviton", "Replicator", "Matter",
    "Anti-matter", "Organic", "Power", "Silicon", "Holographic", "Transient", "Integrity", "Plasma", "Fusion",
    "Control", "Access", "Auto", "Destruct", "Isolinear", "Transwarp", "Energy", "Medical", "Environmental",
    "Coil", "Impulse", "Warp", "Phaser", "Operating", "Photon", "Deflector", "Integrity", "Control", "Bridge",
    "Dampening", "Display", "Beam", "Quantum", "Baseline", "Input"
];
const words3 = [
    "Chamber", "Interface", "Coil", "Polymer", "Biosphere", "Platform", "Thruster", "Deflector", "Replicator",
    "Tricorder", "Operation", "Array", "Matrix", "Grid", "Sensor", "Mode", "Panel", "Storage", "Conduit", "Pod",
    "Hatch", "Regulator", "Display", "Inverter", "Spectrum", "Generator", "Cloud", "Field", "Terminal", "Module",
    "Procedure", "System", "Diagnostic", "Device", "Beam", "Probe", "Bank", "Tie-In", "Facility", "Bay",
    "Indicator", "Cell"
];

function selectRandomIndex(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateTechnobabble() {
    let babble = `${selectRandomIndex(words1)} ${selectRandomIndex(words2)} ${selectRandomIndex(words3)}`;
    document.querySelector("#output").innerHTML = babble;
}

// Wait for the page to load before interacting with it
window.onload = function () {
    generateTechnobabble(); // Initial babble

    // Rebabble each button click
    document.querySelector("#myButton").addEventListener("click", generateTechnobabble);
};