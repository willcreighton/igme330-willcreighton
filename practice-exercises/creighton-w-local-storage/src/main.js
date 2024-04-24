import * as storage from "./storage.js";

let items = storage.readFromLocalStorage("items") || [];

const showItems = () => {
  const itemList = document.querySelector(".section ol");
  itemList.innerHTML = "";
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    itemList.appendChild(listItem);
  });
};

const addItem = (str) => {
  if (str.trim().length > 0) {
    items.push(str.trim());
    showItems();
    storage.writeToLocalStorage("items", items);
  }
};

document.querySelector("#btn-add").addEventListener("click", () => {
  const inputElement = document.querySelector("#thing-text");
  const newItem = inputElement.value;
  addItem(newItem);
  inputElement.value = "";
});

const clearList = () => {
  items = [];
  showItems();
  storage.writeToLocalStorage("items", items);
};

// Event listener for the "Clear List" button
document.querySelector("#btn-clear").addEventListener("click", clearList);

window.addEventListener("load", () => {
  if (!Array.isArray(items)) {
    items = [];
  }
  showItems();
});
