
const BASE_URL = "https://api.open-meteo.com/v1";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1";

const FORECAST_FIELDS = [
  "temperature_2m_max",
  "temperature_2m_min",
  "temperature_2m_mean",
  "relative_humidity_2m_mean",
  "windspeed_10m_max",
  "precipitation_sum",
];

async function requestJson(url, errorMessage, logMessage, options = {}) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`${errorMessage} (HTTP ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(logMessage, error);
    }

    throw error;
  }
}

function buildGeocodingUrl(city, count = 10) {
  const params = new URLSearchParams({
    name: city.trim(),
    count: String(count),
    language: "en",
    format: "json",
  });

  return `${GEOCODING_URL}/search?${params.toString()}`;
}

function normalizeLocation(result) {
  return {
    name: result.name,
    country: result.country ?? "",
    latitude: result.latitude,
    longitude: result.longitude,
    displayName: [result.name, result.country].filter(Boolean).join(", "),
  };
}

function formatNumber(value) {
  return Number.isFinite(value) ? Number(value.toFixed(1)) : null;
}

async function getCityCoordinates(city) {
  const data = await requestJson(
    buildGeocodingUrl(city, 1),
    "Failed to fetch city coordinates",
    "Error fetching coordinates:"
  );

  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" not found`);
  }

  return normalizeLocation(data.results[0]);
}

async function resolveLocation(locationOrCity) {
  const hasCoordinates =
    typeof locationOrCity === "object" &&
    locationOrCity !== null &&
    Number.isFinite(locationOrCity.latitude) &&
    Number.isFinite(locationOrCity.longitude);

  if (hasCoordinates) {
    return normalizeLocation(locationOrCity);
  }

  if (typeof locationOrCity !== "string" || !locationOrCity.trim()) {
    throw new Error("Please select a valid city");
  }

  return getCityCoordinates(locationOrCity);
}

function buildForecastUrl({ latitude, longitude }, { days }) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone: "auto",
    daily: FORECAST_FIELDS.join(","),
    forecast_days: String(days),
  });

  return `${BASE_URL}/forecast?${params.toString()}`;
}

function formatDailyForecastEntry(dailyData, date, index) {
  return {
    date,
    day: new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "UTC",
    }),
    temp: formatNumber(dailyData.temperature_2m_mean[index]),
    tempMin: formatNumber(dailyData.temperature_2m_min[index]),
    tempMax: formatNumber(dailyData.temperature_2m_max[index]),
    humidity: formatNumber(dailyData.relative_humidity_2m_mean[index]),
    wind: formatNumber(dailyData.windspeed_10m_max[index]),
    rainfall: formatNumber(dailyData.precipitation_sum[index]),
  };
}

export async function searchCities(city, { signal } = {}) {
  const query = city.trim();

  if (query.length < 2) {
    return [];
  }

  const data = await requestJson(
    buildGeocodingUrl(query, 10),
    "Failed to search cities",
    "Error searching cities:",
    { signal }
  );

  return (data.results ?? []).map(normalizeLocation);
}

export async function fetchWeeklyForecast(locationOrCity, days = 7) {
  if (!Number.isInteger(days) || days < 1 || days > 16) {
    throw new Error("Forecast days must be between 1 and 16");
  }

  const location = await resolveLocation(locationOrCity);
  const url = buildForecastUrl(location, { days });

  const data = await requestJson(
    url,
    "Failed to fetch weather forecast",
    "Error fetching weekly forecast:"
  );

  if (!data.daily?.time) {
    throw new Error("Forecast data is unavailable");
  }

  return data.daily.time.map((date, index) =>
    formatDailyForecastEntry(data.daily, date, index)
  );
}
