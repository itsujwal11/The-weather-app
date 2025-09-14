const apiKey = "251506d7409997036f27a381327bde97";
const apiBase = "https://api.openweathermap.org/data/2.5/weather";
const cityInput = document.getElementById("cityInput");
const useLocationButton = document.getElementById("useLocationButton");
const defaultCitySelect = document.getElementById("defaultCitySelect");
const searchButton = document.getElementById("searchButton");
const iconImg = document.getElementById("weather-icon-img");

async function getWeather(city) {
  try {
    const res = await fetch(`${apiBase}?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    updateWeather(data);
  } catch (err) {
    alert(err.message);
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    const res = await fetch(`${apiBase}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    if (!res.ok) throw new Error("Location not found");
    const data = await res.json();
    updateWeather(data);
  } catch (err) {
    alert(err.message);
  }
}

function updateWeather(data) {
  document.getElementById("location").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("condition").textContent = data.weather[0].description;
  iconImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  iconImg.alt = data.weather[0].main;
  document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°`;
  document.getElementById("feels-like").textContent = `${Math.round(data.main.feels_like)}°`;
  document.getElementById("feels-like-detail").textContent = `${Math.round(data.main.feels_like)}°`;
  document.getElementById("humidity-detail").textContent = `${data.main.humidity}%`;
  document.getElementById("wind-speed-detail").textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
  document.getElementById("visibility-detail").textContent = `${(data.visibility / 1000).toFixed(1)} km`;
}

window.addEventListener("load", () => {
  getWeather(defaultCitySelect.value);
});

defaultCitySelect.addEventListener("change", () => {
  getWeather(defaultCitySelect.value);
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && cityInput.value.trim()) {
    getWeather(cityInput.value.trim());
    cityInput.value = "";
  }
});

searchButton.addEventListener("click", () => {
  if (cityInput.value.trim()) {
    getWeather(cityInput.value.trim());
    cityInput.value = "";
  } else {
    alert("Please enter a city name");
  }
});

useLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
    () => alert("Unable to retrieve your location")
  );
});
