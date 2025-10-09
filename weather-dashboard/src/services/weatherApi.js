// src/services/weatherApi.js

const BASE_URL = "https://api.open-meteo.com/v1";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1";

// Get city coordinates from city name
async function getCityCoordinates(city) {
  try {
    const response = await fetch(
      `${GEOCODING_URL}/search?name=${encodeURIComponent(
        city
      )}&count=1&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch city coordinates");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error(`City "${city}" not found`);
    }

    return {
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude,
      name: data.results[0].name,
      country: data.results[0].country,
    };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
}

// Fetch weather forecast
export async function fetchWeeklyForecast(city, days = 7) {
  try {
    // Get coordinates for the city
    const location = await getCityCoordinates(city);

    // Fetch weather data
    const response = await fetch(
      `${BASE_URL}/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,relative_humidity_2m_mean,windspeed_10m_max,precipitation_sum&timezone=auto&forecast_days=${days}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    // Transform data to match your chart format
    const transformedData = data.daily.time.map((date, index) => ({
      date: date,
      day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      temp: parseFloat(data.daily.temperature_2m_mean[index].toFixed(1)),
      tempMin: parseFloat(data.daily.temperature_2m_min[index].toFixed(1)),
      tempMax: parseFloat(data.daily.temperature_2m_max[index].toFixed(1)),
      humidity: parseFloat(
        data.daily.relative_humidity_2m_mean[index].toFixed(1)
      ),
      wind: parseFloat(data.daily.windspeed_10m_max[index].toFixed(1)),
      rainfall: parseFloat(data.daily.precipitation_sum[index].toFixed(1)),
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching weekly forecast:", error);
    throw error;
  }
}

// Fetch current weather
export async function fetchCurrentWeather(city) {
  try {
    const location = await getCityCoordinates(city);

    const response = await fetch(
      `${BASE_URL}/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,windspeed_10m,precipitation&timezone=auto`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch current weather");
    }

    const data = await response.json();

    return {
      temp: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      wind: data.current.windspeed_10m,
      precipitation: data.current.precipitation,
      location: location.name,
      country: location.country,
    };
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
}
