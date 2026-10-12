import React, { useState, useEffect } from "react";
import {
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  CloudRain,
  AlertCircle,
  Loader,
} from "lucide-react";

import { MapPin } from "lucide-react";
import StatCard from "../component/StatCard";
import CitySelector from "./CitySelector";
import DateRangeSelector from "./DateRangeSelector";
import ViewModeSelector from "./ViewModeSelector";
import { fetchWeeklyForecast } from "../services/weatherApi";

function formatForecastDate(date, index) {
  if (index === 0) {
    return "Today";
  }

  if (index === 1) {
    return "Tomorrow";
  }

  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function displayValue(value) {
  return value ?? "--";
}

export default function WeatherAnalyzer() {
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const selectedCityName =
    typeof selectedCity === "string"
      ? selectedCity
      : selectedCity.displayName ?? selectedCity.name;
  const [dateRange, setDateRange] = useState("7days");
  const [activeTab, setActiveTab] = useState("overview");
  const [weeklyData, setWeeklyData] = useState([]);
  const [stats, setStats] = useState({
    avgTemp: 0,
    avgHumidity: 0,
    avgWind: 0,
    totalRainfall: 0,
    tempChange: 0,
    humidityChange: 0,
    windChange: 0,
    rainfallChange: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);

      try {
        const days = dateRange === "7days" ? 7 : 5;
        const data = await fetchWeeklyForecast(selectedCity, days);

        if (!ignore) {
          setWeeklyData(data);
          const calculatedStats = calculateStats(data);
          setStats(calculatedStats);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
          console.error("Error fetching weather data:", err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchWeatherData();

    return () => {
      ignore = true;
    };
  }, [selectedCity, dateRange]);

  const calculateStats = (data) => {
    if (data.length === 0) {
      return {
        avgTemp: 0,
        avgHumidity: 0,
        avgWind: 0,
        totalRainfall: 0,
        tempChange: 0,
        humidityChange: 0,
        windChange: 0,
        rainfallChange: 0,
      };
    }

    const avgTemp =
      data.reduce((sum, item) => sum + item.temp, 0) / data.length;
    const avgHumidity =
      data.reduce((sum, item) => sum + item.humidity, 0) / data.length;
    const avgWind =
      data.reduce((sum, item) => sum + item.wind, 0) / data.length;
    const totalRainfall = data.reduce((sum, item) => sum + item.rainfall, 0);

    const tempChange =
      data.length > 1
        ? ((data[data.length - 1].temp - data[0].temp) / data[0].temp) * 100
        : 0;
    const humidityChange =
      data.length > 1
        ? ((data[data.length - 1].humidity - data[0].humidity) /
            data[0].humidity) *
          100
        : 0;
    const windChange =
      data.length > 1
        ? ((data[data.length - 1].wind - data[0].wind) / data[0].wind) * 100
        : 0;
    const rainfallChange = Math.random() * 20 - 10;

    return {
      avgTemp: avgTemp.toFixed(1),
      avgHumidity: avgHumidity.toFixed(1),
      avgWind: avgWind.toFixed(1),
      totalRainfall: totalRainfall.toFixed(1),
      tempChange: tempChange.toFixed(1),
      humidityChange: humidityChange.toFixed(1),
      windChange: windChange.toFixed(1),
      rainfallChange: rainfallChange.toFixed(1),
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-xl text-gray-600">Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <p className="text-xl text-red-600 mb-2">Error Loading Data</p>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Cloud className="text-blue-500" size={40} />
          Weather Data Analyzer
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={18} className="text-blue-500" />
          <span>Showing forecast for</span>
          <span className="font-bold text-blue-600 text-lg">
            {selectedCityName}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-8 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CitySelector
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
          <DateRangeSelector
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          <ViewModeSelector activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Thermometer}
          title="Avg Temperature"
          value={stats.avgTemp}
          unit="°C"
          change={parseFloat(stats.tempChange)}
          color="bg-orange-500"
        />
        <StatCard
          icon={Droplets}
          title="Avg Humidity"
          value={stats.avgHumidity}
          unit="%"
          change={parseFloat(stats.humidityChange)}
          color="bg-blue-500"
        />
        <StatCard
          icon={Wind}
          title="Avg Wind Speed"
          value={stats.avgWind}
          unit="km/h"
          change={parseFloat(stats.windChange)}
          color="bg-green-500"
        />
        <StatCard
          icon={CloudRain}
          title="Total Rainfall"
          value={stats.totalRainfall}
          unit="mm"
          change={parseFloat(stats.rainfallChange)}
          color="bg-purple-500"
        />
      </div>

      {/* Daily Forecast */}
      <section className="bg-white rounded-xl p-6 shadow-lg mb-8 border border-gray-100">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800">
            {dateRange === "5days"
              ? "5-Day Weather Forecast"
              : "7-Day Temperature Forecast"}
          </h2>
          <p className="text-gray-600 mt-1">
            {dateRange === "5days"
              ? "Daily temperatures, humidity, wind, and precipitation."
              : "Daily average temperature from today onward."}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-left">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {dateRange === "5days" ? "Average temperature" : "Temperature"}
                </th>
                {dateRange === "5days" && (
                  <>
                    {/* <th scope="col" className="px-4 py-3 font-semibold">
                      Low
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      High
                    </th> */}
                    {/* <th scope="col" className="px-4 py-3 font-semibold">
                      Humidity
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Wind
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Rainfall
                    </th> */}
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((day, index) => (
                <tr
                  key={day.date}
                  className="border-b border-gray-100 last:border-0"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-semibold text-gray-800"
                  >
                    {formatForecastDate(day.date, index)}
                  </th>
                  <td className="px-4 py-4 font-semibold text-orange-600">
                    {displayValue(day.temp)} °C
                  </td>
                  {dateRange === "5days" && (
                    <>
                      {/* <td className="px-4 py-4 text-gray-700">
                        {displayValue(day.tempMin)} °C
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        {displayValue(day.tempMax)} °C
                      </td> */}
                      {/* <td className="px-4 py-4 text-gray-700">
                        {displayValue(day.humidity)}%
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        {displayValue(day.wind)} km/h
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        {displayValue(day.rainfall)} mm
                      </td> */}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Summary */}
      <div className="bg-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <Sun size={32} />
          <h3 className="text-2xl font-bold">
            {activeTab === "overview" ? "Quick Summary" : "Detailed Summary"}
          </h3>
        </div>
        <p className="text-blue-50 text-lg leading-relaxed">
          The forecast for {selectedCityName} shows an average temperature of{" "}
          {stats.avgTemp}°C with humidity levels at {stats.avgHumidity}%. Wind
          speeds are averaging {stats.avgWind} km/h, and total precipitation is
          expected to be around {stats.totalRainfall}mm over this period.
          Weather conditions appear{" "}
          {parseFloat(stats.tempChange) > 0 ? "warming" : "cooling"} with a{" "}
          {Math.abs(stats.tempChange)}% temperature trend.
        </p>
      </div>
    </>
  );
}
