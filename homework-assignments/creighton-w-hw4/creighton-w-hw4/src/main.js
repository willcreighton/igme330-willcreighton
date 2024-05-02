import * as map from "./map.js";
import * as ajax from "./ajax.js";

// I. Variables & constants
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let geojson;
let favoriteIds = ["p20", "p79", "p180", "p43"];

let favoriteBtn, deleteBtn;
let currentFeatureId = null;

// II. Functions
const setupUI = () => {
  document.querySelector("#btn1").onclick = () => {
    map.setZoomLevel(5.2);
    map.setPitchAndBearing(0, 0);
    map.flyTo(lnglatNYS);
  };

  document.querySelector("#btn2").onclick = () => {
    map.setZoomLevel(5.5);
    map.setPitchAndBearing(45, 0);
    map.flyTo(lnglatNYS);
  };

  document.querySelector("#btn3").onclick = () => {
    map.setZoomLevel(3);
    map.setPitchAndBearing(0, 0);
    map.flyTo(lnglatUSA);
  };

  refreshFavorites();

  favoriteBtn = document.querySelector("#favorite-btn");
  deleteBtn = document.querySelector("#delete-btn");
};

const getFeatureById = id => geojson.features.find(f => f.id === id);

// Load the favorites from local storage into favoriteIDs
const loadFavorites = () => {
  const storedFavorites = localStorage.getItem("nysParkFavorites");
  return storedFavorites ? JSON.parse(storedFavorites) : [];
};

// Save favorited features to local storage
const saveFavorites = () => {
  localStorage.setItem("nysParkFavorites", JSON.stringify(favoriteIds));
};

// Check if an id is favorited
const isFavorited = id => favoriteIds.includes(id);

// Update the favorite and delete buttons' interactability based on selected feature
const updateFavoriteButtons = () => {
  if (currentFeatureId && isFavorited(currentFeatureId)) {
    favoriteBtn.disabled = true;
    deleteBtn.disabled = false;
  } else if (currentFeatureId) {
    favoriteBtn.disabled = false;
    deleteBtn.disabled = true;
  } else {
    favoriteBtn.disabled = true;
    deleteBtn.disabled = true;
  }
};

// Convenient helper function to format feature details
const formatDetails = properties => `
    <b>Address:</b> ${properties.address}
    <br>
    <b>Phone:</b> ${properties.phone}
    <br>
    <b>Website:</b> <a href="${properties.url}" target="_blank">${properties.url}</a>
  `;

// Display the details of a selected feature and update the favorite buttons accordingly
const showFeatureDetails = id => {
  currentFeatureId = id;
  const feature = getFeatureById(id);
  document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
  document.querySelector("#details-2").innerHTML = formatDetails(feature.properties);
  document.querySelector("#details-3").innerHTML = feature.properties.description;
  updateFavoriteButtons();
};

// Refresh the favorites list
const refreshFavorites = () => {
  const favoritesContainer = document.querySelector("#favorites-list");
  favoritesContainer.innerHTML = "";
  favoriteIds.forEach(id => favoritesContainer.appendChild(createFavoriteElement(id)));
};

// Create a favorite element
const createFavoriteElement = id => {
  const feature = getFeatureById(id);
  const a = document.createElement("a");
  a.className = "panel-block";
  a.id = feature.id;

  a.onclick = () => {
    showFeatureDetails(a.id);
    map.setZoomLevel(6);
    map.flyTo(feature.geometry.coordinates);
  };
  a.innerHTML = `
    <span class="panel-icon">
      <i class="fas fa-map-pin"></i>
    </span>
    ${feature.properties.title}
  `;
  return a;
};

document.addEventListener("DOMContentLoaded", () => setupButtonEventListeners());

// Set up event listeners for favorite and delete buttons
const setupButtonEventListeners = () => {
  const favoriteBtn = document.getElementById("favorite-btn");
  const deleteBtn = document.getElementById("delete-btn");

  if (favoriteBtn) {
    favoriteBtn.addEventListener("click", () => toggleFavorite(currentFeatureId));
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => toggleFavorite(currentFeatureId));
  }
};

// Toggle a feature's favorited "status"
const toggleFavorite = id => {
  if (!id) return;

  const isAlreadyFavorite = favoriteIds.includes(id);
  if (isAlreadyFavorite) {
    favoriteIds = favoriteIds.filter(favoriteId => favoriteId !== id);
  } else {
    favoriteIds.push(id);
  }

  updateFavoriteButtons();
  saveFavorites();
  refreshFavorites();
};

const init = () => {
  favoriteIds = loadFavorites(); // Load favorites from local storage

  map.initMap(lnglatNYS);
  ajax.downloadFile("data/parks.geojson", str => {
    geojson = JSON.parse(str);
    console.log(geojson);
    map.addMarkersToMap(geojson, showFeatureDetails);
    setupUI();
  });
};

init();
