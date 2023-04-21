let theme_toggler = document.querySelector("#theme_toggler");

theme_toggler.addEventListener("click", function () {
  document.body.classList.toggle("dark_mode");
});

function actualDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function actualDay(dateTime) {
  let date = new Date(dateTime * 1000);
  let day = date.getDay();
  let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return weekDays[day];
}

function showForecast(response) {
  let arrayForecast = response.data.daily;

  let weatherForecastEmelent = document.querySelector("#weather-forecast");

  let htmlForecast = `<div class="row">`;
  arrayForecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      htmlForecast =
        htmlForecast +
        `
  <div class="col-2">
    <div class="app-forecast-date">${actualDay(forecastDay.time)}</div>
    <img 
      src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
        forecastDay.condition.icon
      }.png"
      alt=""
      width="45"
    />
    <div class="app-forecast-temp">
      <span class="app-forecast-temperature-first"> ${Math.round(
        forecastDay.temperature.maximum
      )}° </span>
      <span class="app-forecast-temperature-last"> ${Math.round(
        forecastDay.temperature.minimum
      )}° </span>
    </div>
  </div>
`;
    }
  });

  htmlForecast = htmlForecast + `</div>`;
  weatherForecastEmelent.innerHTML = htmlForecast;
}
function retriveForecast(coordinates) {
  let apiKey = "b44b3b21bbcdc2007ba9f404ao7et12a";
  let apiLink = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&key=${apiKey}&units=metric`;

  axios.get(apiLink).then(showForecast);
}

function showTemperature(response) {
  let tempElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celciusTemp = response.data.temperature.current;

  tempElement.innerHTML = Math.round(celciusTemp);
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = Math.round(response.data.temperature.humidity);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = actualDate(response.data.time * 1000);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  retriveForecast(response.data.coordinates);
}
function searchCity(city) {
  let apiKey = "b44b3b21bbcdc2007ba9f404ao7et12a";
  let apiUrl = ` https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);
}

function makeSubmission(event) {
  event.preventDefault();
  let inputCityElement = document.querySelector("#cityWeatherForecast");
  searchCity(inputCityElement.value);
}
function searchLocation(position) {
  let apiKey = "548d49c1c558397f60419672a958837";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);
}

function getNowLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function showFahrenheit(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#temperature");

  let fahrenheitTemp = (celciusTemp * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(fahrenheitTemp);
}

function showCelcius(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#temperature");
  tempElement.innerHTML = Math.round(celciusTemp);
}

let celciusTemp = null;

let form = document.querySelector("#city-form");
form.addEventListener("submit", makeSubmission);

let currentLocationSubmit = document.querySelector("#current-location");
currentLocationSubmit.addEventListener("click", getNowLocation);

let fahrenheit = document.querySelector("#key");
fahrenheit.addEventListener("click", showFahrenheit);

let celcius = document.querySelector("#key2");
celcius.addEventListener("click", showCelcius);

searchCity("Gaborone");
