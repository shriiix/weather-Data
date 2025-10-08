import React from "react";
import { Search } from "lucide-react";

const CitySelector = ({ selectedCity, setSelectedCity }) => {
  const cities = ["New York", "London", "Tokyo", "Sydney", "Mumbai", "Paris"];

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select City
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CitySelector;
