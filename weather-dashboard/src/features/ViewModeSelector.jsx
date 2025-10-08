import React from "react";
import { BarChart3 } from "lucide-react";

const ViewModeSelector = ({ activeTab, setActiveTab }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        View Mode
      </label>
      <div className="relative">
        <BarChart3 className="absolute left-3 top-3 text-gray-400" size={18} />
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
        >
          <option value="overview">Overview</option>
          <option value="detailed">Detailed Analysis</option>
          <option value="comparison">Comparison</option>
        </select>
      </div>
    </div>
  );
};

export default ViewModeSelector;
