import { useState, useEffect } from "react";
import { fetchWeeklyForecast } from "../services/weatherApi";

/**
 * Custom React hook for fetching weekly weather data.
 * @param {string} city - The selected city for which to fetch weather.
 * @param {string} dateRange - The selected date range ("7days", "30days", etc.)
 * @returns {object} - { data, loading, error }
 */
export default function useWeatherData(city, dateRange) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    setLoading(true);
    setError(null);

    fetchWeeklyForecast(city, dateRange)
      .then((forecast) => {
        setData(forecast);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [city, dateRange]);

  return { data, loading, error };
}
