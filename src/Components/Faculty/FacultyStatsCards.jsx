import React from 'react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

const FacultyStatsCards = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium">Total Sessions</p>
          <p className="text-4xl font-bold mt-2">{stats.totalSessions}</p>
          <p className="text-blue-200 text-xs mt-1">All time</p>
        </div>
        <div className="bg-blue-400/30 rounded-full p-3">
          <Calendar className="h-8 w-8 text-blue-100" />
        </div>
      </div>
    </div>
    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-100 text-sm font-medium">Completed</p>
          <p className="text-4xl font-bold mt-2">{stats.completedSessions}</p>
          <p className="text-green-200 text-xs mt-1">Sessions finished</p>
        </div>
        <div className="bg-green-400/30 rounded-full p-3">
          <CheckCircle className="h-8 w-8 text-green-100" />
        </div>
      </div>
    </div>
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-orange-100 text-sm font-medium">Upcoming</p>
          <p className="text-4xl font-bold mt-2">{stats.upcomingSessions}</p>
          <p className="text-orange-200 text-xs mt-1">Sessions scheduled</p>
        </div>
        <div className="bg-orange-400/30 rounded-full p-3">
          <Clock className="h-8 w-8 text-orange-100" />
        </div>
      </div>
    </div>
  </div>
);

export default FacultyStatsCards; 