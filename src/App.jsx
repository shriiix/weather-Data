import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import WeatherAnalyzer from "./features/WeatherAnalyzer";

function App() {
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="w-full max-w-8xl p-8 mx-auto">
        <WeatherAnalyzer />
      </div>
    </div>
  );
}

export default App;
