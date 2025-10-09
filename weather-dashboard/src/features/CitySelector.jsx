import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";

const CitySelector = ({ selectedCity, setSelectedCity }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce search
  useEffect(() => {
    if (searchTerm.length < 2) {
      setCities([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        // Fetch from Open-Meteo Geocoding API
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            searchTerm
          )}&count=10&language=en&format=json`
        );
        const data = await response.json();

        if (data.results) {
          const cityList = data.results.map((result) => ({
            name: result.name,
            country: result.country,
            displayName: `${result.name}, ${result.country}`,
          }));
          setCities(cityList);
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Search City
      </label>

      <div className="relative">
        <Search
          className="absolute left-3 top-3 text-gray-400 pointer-events-none"
          size={18}
        />
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : selectedCity}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setSearchTerm("");
            setIsOpen(true);
          }}
          placeholder="Type city name..."
          className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-text hover:border-gray-400 transition-all font-semibold text-gray-800 text-base"
        />

        {loading && (
          <Loader2
            className="absolute right-3 top-3 text-blue-500 animate-spin"
            size={18}
          />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && searchTerm.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-6 text-center text-gray-500">
              <Loader2
                size={24}
                className="mx-auto mb-2 animate-spin text-blue-500"
              />
              <p className="text-sm">Searching cities...</p>
            </div>
          ) : cities.length > 0 ? (
            cities.map((city) => (
              <button
                key={city.displayName}
                type="button"
                onClick={() => handleCitySelect(city.name)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 group"
              >
                <MapPin
                  size={16}
                  className="text-gray-400 group-hover:text-blue-500"
                />
                <div>
                  <p className="font-semibold text-gray-800">{city.name}</p>
                  <p className="text-xs text-gray-500">{city.country}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              <Search size={24} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No cities found</p>
            </div>
          )}
        </div>
      )}

      {searchTerm.length > 0 && searchTerm.length < 2 && isOpen && (
        <p className="mt-1 text-xs text-gray-500">
          Type at least 2 characters to search
        </p>
      )}
    </div>
  );
};

export default CitySelector;
