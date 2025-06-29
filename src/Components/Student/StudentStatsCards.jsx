import React from 'react';
import { Calendar, Users, CheckCircle } from 'lucide-react';

const iconMap = {
  '📅': Calendar,
  '📝': Users,
  '✅': CheckCircle,
};

const StatsCard = ({ title, value, icon, color }) => {
  const Icon = iconMap[icon] || Calendar;
  return (
    <div className={`rounded-xl p-6 shadow-md flex items-center space-x-4 ${color} text-white`}>
      <div className="bg-white/20 rounded-full p-3 flex items-center justify-center">
        <Icon className="h-8 w-8" />
      </div>
      <div>
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
};

const StudentStatsCards = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    {stats.map((stat, idx) => (
      <StatsCard key={idx} {...stat} />
    ))}
  </div>
);

export default StudentStatsCards; 