// DOM Elements
let cityInput = document.querySelector(".city-input");
let searchBtn = document.querySelector(".search-btn");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");
const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currentDateTxt = document.querySelector(".current-date-txt");
const forecastItemContainer = document.querySelector(
  ".forecast-item-container"
);

// API key
let apiKey = "9c93005f6010bb53b2cfb0b7466903c6";

// Event: When clicking the search button
searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

// Event: Press Enter inside the input
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && cityInput.value.trim() !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

// Fetch weather or forecast data from the API
async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

// Get weather icon based on weather condition ID
function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id === 800) return "clear.svg";
  return "clouds.svg";
}

// Get today's date in a formatted string
function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
}

// Main function: Get current weather and display it
async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);

  if (weatherData.cod != 200) {
    showDisplaySection(notFoundSection);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryTxt.textContent = country;
  tempTxt.textContent = Math.round(temp) + " °C";
  conditionTxt.textContent = main;
  humidityValueTxt.textContent = humidity + "%";
  windValueTxt.textContent = speed + " M/s";
  currentDateTxt.textContent = getCurrentDate();
  weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;
  showDisplaySection(weatherInfoSection);

  updateForecastInfo(city);
}

// Get and display the 5-day forecast
async function updateForecastInfo(city) {
  const forecastsData = await getFetchData("forecast", city);
  forecastItemContainer.innerHTML = "";

  const timeTaken = "12:00:00"; // forecast for midday
  const todayDate = new Date().toISOString().split("T")[0];

  forecastsData.list.forEach((forecast) => {
    if (
      forecast.dt_txt.includes(timeTaken) &&
      !forecast.dt_txt.includes(todayDate)
    ) {
      updateForecastItem(forecast);
    }
  });
}

// Create a forecast card for one day and add it to the page
function updateForecastItem(weatherData) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${formattedDate}</h5>
            <img src="assets/weather/${getWeatherIcon(
              id
            )}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>`;

  forecastItemContainer.insertAdjacentHTML("beforeend", forecastItem);
}

// Hide all sections and show the selected one
function showDisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach((sec) => {
    sec.style.display = "none";
  });
  section.style.display = "flex";
}
س;
