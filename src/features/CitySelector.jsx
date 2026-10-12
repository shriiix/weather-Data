
import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { searchCities } from "../services/weatherApi";

const CitySelector = ({ selectedCity, setSelectedCity }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef(null);
  const searchIdRef = useRef(0);

  // Search cities with a 300 ms debounce
  useEffect(() => {
    const requestId = ++searchIdRef.current;
    const query = searchTerm.trim();

    if (query.length < 2 || !isOpen) {
      setCities([]);
      setLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const results = await searchCities(query, {
          signal: controller.signal,
        });

        if (requestId === searchIdRef.current) {
          setCities(results);
        }
      } catch (err) {
        if (
          err.name !== "AbortError" &&
          requestId === searchIdRef.current
        ) {
          setCities([]);
          setError("Unable to search cities. Please try again.");
        }
      } finally {
        if (requestId === searchIdRef.current) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchTerm, isOpen]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Save the entire selected city, including coordinates
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchTerm("");
    setCities([]);
    setError("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Search City
      </label>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-3 text-gray-400"
          size={18}
        />

        <input
          type="text"
          value={
            isOpen
              ? searchTerm
              : typeof selectedCity === "string"
                ? selectedCity
                : selectedCity?.displayName ?? selectedCity?.name ?? ""
          }
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setSearchTerm("");
            setIsOpen(true);
          }}
          placeholder="Type city name..."
          autoComplete="off"
          className="w-full cursor-text rounded-lg border-2 border-gray-300 bg-white py-2.5 pl-10 pr-10 text-base font-semibold text-gray-800 transition-all hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />

        {loading && (
          <Loader2
            className="absolute right-3 top-3 animate-spin text-blue-500"
            size={18}
          />
        )}
      </div>

      {isOpen && searchTerm.trim().length >= 2 && (
        <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border-2 border-gray-300 bg-white shadow-lg">
          {loading ? (
            <div className="px-4 py-6 text-center text-gray-500">
              <Loader2
                size={24}
                className="mx-auto mb-2 animate-spin text-blue-500"
              />
              <p className="text-sm">Searching cities...</p>
            </div>
          ) : error ? (
            <div className="px-4 py-6 text-center text-sm text-red-600">
              {error}
            </div>
          ) : cities.length > 0 ? (
            cities.map((city) => (
              <button
                key={`${city.latitude}-${city.longitude}`}
                type="button"
                onClick={() => handleCitySelect(city)}
                className="group flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-blue-50"
              >
                <MapPin
                  size={16}
                  className="text-gray-400 group-hover:text-blue-500"
                />

                <div>
                  <p className="font-semibold text-gray-800">
                    {city.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {city.country || "Unknown country"}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              <Search
                size={24}
                className="mx-auto mb-2 text-gray-400"
              />
              <p className="text-sm">No cities found</p>
            </div>
          )}
        </div>
      )}

      {isOpen &&
        searchTerm.trim().length > 0 &&
        searchTerm.trim().length < 2 && (
          <p className="mt-1 text-xs text-gray-500">
            Type at least 2 characters to search
          </p>
        )}
    </div>
  );
};

export default CitySelector;
