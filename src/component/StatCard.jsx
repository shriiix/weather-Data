import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ icon: Icon, title, value, unit, change, color }) => {
  const isPositive = change >= 0;

  return (
    <div className={`${color} rounded-xl p-6 shadow-lg text-white`}>
      <div className="flex items-center justify-between mb-4">
        <Icon size={32} className="opacity-80" />
        <div
          className={`flex items-center gap-1 ${
            isPositive ? "bg-white/20" : "bg-black/20"
          } px-2 py-1 rounded-full`}
        >
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="text-sm font-semibold">{Math.abs(change)}%</span>
        </div>
      </div>
      <p className="text-sm opacity-90 mb-1">{title}</p>
      <p className="text-3xl font-bold">
        {value}
        <span className="text-xl ml-1">{unit}</span>
      </p>
    </div>
  );
};

export default StatCard;
