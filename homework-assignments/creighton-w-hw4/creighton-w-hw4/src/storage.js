export const loadFavorites = () => {
  return JSON.parse(localStorage.getItem("nysParkFavorites") || "[]");
};

export const saveFavorites = (favorites) => {
  localStorage.setItem("nysParkFavorites", JSON.stringify(favorites));
};
