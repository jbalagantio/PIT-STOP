// importing dependencies
import {
    liWeatherConditionValue,
    liAirTempValue,
    liWindSpeedValue,
    rainEffect
} from "./ui.js";

import { weather } from "./state.js";

// weather
const locationSuccess = (position) => {

    console.log("POSITION:", position);
    console.log("LAT:", position.coords.latitude);
    console.log("LONG:", position.coords.longitude);

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    getWeather(latitude, longitude);
};

export const getLocation = () => {
    if(navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(locationSuccess, error);

    } else {

        console.log("Geolocation is not supported by this browser.");

    };
};

//          Error callback function for Geolocation
const error = (err) => {
  switch(err.code) {
    case err.PERMISSION_DENIED:
      console.warn("User denied the request for Geolocation.");
      break;
    case err.POSITION_UNAVAILABLE:
      console.warn("Location information is unavailable.");
      break;
    case err.TIMEOUT:
      console.warn("The request to get user location timed out.");
      break;
    default:
      console.warn("An unknown error occurred:", err.message);
      break;
  };
};

//              Get Weather Function
const getWeather = async (latitude, longitude) => {

    console.log("GET WEATHER LAT:", latitude);
    console.log("GET WEATHER LONG:", longitude);



    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,precipitation,rain,showers,wind_speed_10m&forecast_days=1`;

    try {

        const response = await fetch(weatherUrl);

        if (!response.ok) {
            throw new Error(`Weather API Error: ${response.status}`);
        };

        const weatherData = await response.json();

        console.log("WEATHER DATA:", weatherData);

        weatherCondition(weatherData);
    
    } catch (error) {

        console.error("Weather unavailable", error);

        weather.condition = "clear";
        weather.temperature = "--";
        weather.precipitation = 0;
        weather.windSpeed = 0;

        renderWeather();

    }
};

const weatherCondition = (weatherData) => {
    if (
        weatherData.current.rain > 0 ||
        weatherData.current.showers > 0
    ) {

        weather.condition = "rain";

    } else if (weatherData.current.precipitation > 0) {

        weather.condition = "wet";

    } else {

        weather.condition = "clear";
    };

    weather.temperature = weatherData.current.temperature_2m;
    weather.precipitation = weatherData.current.precipitation;
    weather.windSpeed = weatherData.current.wind_speed_10m;

    // // force rain for presentation
    // weather.condition = "rain" // only if it doesn't rain
    // keeping this now for further testing
    
    renderWeather();
};

const renderWeather = () => {
    liWeatherConditionValue.textContent = weather.condition;
    liAirTempValue.textContent = `${weather.temperature} °C`;
    liWindSpeedValue.textContent = `${weather.windSpeed} km/h`;

    if (weather.condition === "rain") {

        rainEffect.classList.remove("hidden");

    } else {

        rainEffect.classList.add("hidden");
    };
};

getLocation();