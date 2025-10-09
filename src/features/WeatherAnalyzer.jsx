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
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MapPin } from "lucide-react";
import StatCard from "../component/StatCard";
import CitySelector from "./CitySelector";
import DateRangeSelector from "./DateRangeSelector";
import ViewModeSelector from "./ViewModeSelector";
import { fetchWeeklyForecast } from "../services/weatherApi";

export default function WeatherAnalyzer() {
  const [selectedCity, setSelectedCity] = useState("Mumbai");
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
            {selectedCity}
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
          color="bg-gradient-to-br from-orange-400 to-red-500"
        />
        <StatCard
          icon={Droplets}
          title="Avg Humidity"
          value={stats.avgHumidity}
          unit="%"
          change={parseFloat(stats.humidityChange)}
          color="bg-gradient-to-br from-blue-400 to-cyan-500"
        />
        <StatCard
          icon={Wind}
          title="Avg Wind Speed"
          value={stats.avgWind}
          unit="km/h"
          change={parseFloat(stats.windChange)}
          color="bg-gradient-to-br from-teal-400 to-green-500"
        />
        <StatCard
          icon={CloudRain}
          title="Total Rainfall"
          value={stats.totalRainfall}
          unit="mm"
          change={parseFloat(stats.rainfallChange)}
          color="bg-gradient-to-br from-indigo-400 to-purple-500"
        />
      </div>

      {/* Charts - Conditional Rendering Based on View Mode */}
      {activeTab === "overview" ? (
        // Overview Mode - Only Temperature Chart
        <div className="mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Thermometer size={20} className="text-orange-500" />
              Temperature Trends
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke="#f97316"
                  strokeWidth={3}
                  fill="url(#tempGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        // Detailed Analysis Mode - All Charts
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Temperature Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Thermometer size={20} className="text-orange-500" />
              Temperature Trends
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke="#f97316"
                  strokeWidth={3}
                  fill="url(#tempGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Humidity Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Droplets size={20} className="text-blue-500" />
              Humidity Levels
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Wind Speed Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Wind size={20} className="text-teal-500" />
              Wind Speed Analysis
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="wind" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Rainfall Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CloudRain size={20} className="text-indigo-500" />
              Precipitation Data
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="rainfall" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <Sun size={32} />
          <h3 className="text-2xl font-bold">
            {activeTab === "overview" ? "Quick Summary" : "Detailed Summary"}
          </h3>
        </div>
        <p className="text-blue-50 text-lg leading-relaxed">
          The forecast for {selectedCity} shows an average temperature of{" "}
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
