import React from "react";
import { Calendar } from "lucide-react";

const DateRangeSelector = ({ dateRange, setDateRange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Date Range
      </label>
      <div className="relative">
        <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="year">Last Year</option>
        </select>
      </div>
    </div>
  );
};

export default DateRangeSelector;
