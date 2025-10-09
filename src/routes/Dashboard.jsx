import React from "react";
import WeatherAnalyzer from "../features/WeatherAnalyzer";

const Dashboard = () => (
  <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
    <div className="w-full max-w-8xl p-8 mx-auto">
      <WeatherAnalyzer />
    </div>
  </div>
);

export default Dashboard;
