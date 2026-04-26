import React from 'react';

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="card p-6 flex items-center justify-between">
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
      {icon}
    </div>
  </div>
);

export default StatCard;
