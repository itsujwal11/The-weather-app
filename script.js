const apiKey = '251506d7409997036f27a381327bde97';
const apiBase = 'https://api.openweathermap.org/data/2.5/weather';
const cityInput = document.getElementById('cityInput');
const useLocationButton = document.getElementById('useLocationButton');
const defaultCitySelect = document.getElementById('defaultCitySelect');
const searchButton = document.getElementById('searchButton'); 

async function getWeather(city) {
  try {
    const response = await fetch(`${apiBase}?q=${city}&units=metric&appid=${apiKey}`);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    updateWeather(data);
  } catch (error) {
    alert(error.message);
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(`${apiBase}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    if (!response.ok) throw new Error('Location not found');
    const data = await response.json();
    updateWeather(data);
  } catch (error) {
    alert(error.message);
  }
}
function updateWeather(data) {
  document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('condition').textContent = data.weather[0].description;
  document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById('temperature').textContent = Math.round(data.main.temp);
  document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}°`;
  document.getElementById('feels-like-detail').textContent = `${Math.round(data.main.feels_like)}°`;
  document.getElementById('humidity-detail').textContent = `${data.main.humidity}%`;
  document.getElementById('wind-speed-detail').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
  document.getElementById('visibility-detail').textContent = `${Math.round(data.visibility / 1000)} km`;
}

window.onload = () => getWeather(defaultCitySelect.value);
defaultCitySelect.addEventListener('change', () => {
  getWeather(defaultCitySelect.value);
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && cityInput.value) {
    getWeather(cityInput.value);
    cityInput.value = '';
  }
});
searchButton.addEventListener('click', () => {
  if (cityInput.value) {
    getWeather(cityInput.value);
    cityInput.value = '';
  } else {
    alert('Please enter a city name');
  }
});
useLocationButton.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => getWeatherByCoords(position.coords.latitude, position.coords.longitude),
      () => alert('Unable to retrieve your location')
    );
  } else {
    alert('Geolocation is not supported by your browser');
  }
});