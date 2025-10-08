import React from "react";

const ChartCard = ({ icon: Icon, iconColor, title, children }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      {Icon && <Icon size={20} className={iconColor} />}
      {title}
    </h3>
    {children}
  </div>
);

export default ChartCard;
