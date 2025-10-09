import React from "react";
import { Calendar } from "lucide-react";

const DateRangeSelector = ({ dateRange, setDateRange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Date Range
      </label>
      <div className="relative">
        <Calendar
          className="absolute left-3 top-3 text-gray-400 pointer-events-none"
          size={18}
        />
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer hover:border-gray-400 transition-all font-semibold text-gray-800 text-base"
        >
          <option value="7days">Last 7 Days</option>
          <option value="5days">Last 5 Days</option>
        </select>
      </div>
    </div>
  );
};

export default DateRangeSelector;
