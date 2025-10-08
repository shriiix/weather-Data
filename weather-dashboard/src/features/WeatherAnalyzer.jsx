import React, { useState } from "react";
import {
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  CloudRain,
  Search,
  Calendar,
  TrendingUp,
  BarChart3,
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
import sampleWeather from "../data/sampleWeather";
import StatCard from "../component/StatCard";
import CitySelector from "./CitySelector";
import DateRangeSelector from "./DateRangeSelector";
import ViewModeSelector from "./ViewModeSelector";

export default function WeatherAnalyzer() {
  const [selectedCity, setSelectedCity] = useState("New York");
  const [dateRange, setDateRange] = useState("7days");
  const [activeTab, setActiveTab] = useState("overview");

  const weeklyData = sampleWeather;

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Cloud className="text-blue-500" size={40} />
          Weather Data Analyzer
        </h1>
        <p className="text-gray-600">
          Comprehensive weather insights and analytics
        </p>
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
          value="23.4"
          unit="°C"
          change={2.5}
          color="bg-gradient-to-br from-orange-400 to-red-500"
        />
        <StatCard
          icon={Droplets}
          title="Avg Humidity"
          value="60.7"
          unit="%"
          change={-1.2}
          color="bg-gradient-to-br from-blue-400 to-cyan-500"
        />
        <StatCard
          icon={Wind}
          title="Avg Wind Speed"
          value="14.0"
          unit="km/h"
          change={0.8}
          color="bg-gradient-to-br from-teal-400 to-green-500"
        />
        <StatCard
          icon={CloudRain}
          title="Total Rainfall"
          value="14"
          unit="mm"
          change={-15.3}
          color="bg-gradient-to-br from-indigo-400 to-purple-500"
        />
      </div>

      {/* Charts */}
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

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <Sun size={32} />
          <h3 className="text-2xl font-bold">Weekly Summary</h3>
        </div>
        <p className="text-blue-50 text-lg leading-relaxed">
          This week in {selectedCity} has shown stable weather patterns with an
          average temperature of 23.4°C. Humidity levels remained moderate at
          60.7%, while wind speeds averaged 14.0 km/h. Total precipitation was
          recorded at 14mm, primarily during midweek. Overall conditions have
          been favorable with a slight warming trend expected.
        </p>
      </div>
    </>
  );
}
