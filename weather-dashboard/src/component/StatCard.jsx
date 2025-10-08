import React from "react";
import { TrendingUp } from "lucide-react";

const StatCard = ({ icon: Icon, title, value, unit, change, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          <span className="text-gray-500 text-lg">{unit}</span>
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp
              size={14}
              className={change > 0 ? "text-green-500" : "text-red-500"}
            />
            <span
              className={`text-sm font-medium ${
                change > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change}% vs yesterday
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

export default StatCard;
