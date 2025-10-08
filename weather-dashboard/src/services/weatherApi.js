const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // Store your API key in .env as VITE_WEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function fetchCurrentWeather(city) {
  const url = `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
}

export async function fetchWeeklyForecast(city) {
  // This example assumes you first get coordinates, then fetch forecast by lat/lon
  try {
    // Get location coordinates
    const coordResponse = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}`
    );
    const coordData = await coordResponse.json();
    const { lat, lon } = coordData.coord;

    // Fetch One Call API for 7-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${API_KEY}`
    );
    const forecastData = await forecastResponse.json();

    return forecastData.daily; // Array with daily forecast objects
  } catch (error) {
    console.error("Error fetching weekly forecast:", error);
    throw error;
  }
}
