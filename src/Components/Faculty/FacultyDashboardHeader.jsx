import React from 'react';
import LogoutButton from '../LogoutButton';

const FacultyDashboardHeader = ({ title, onLogout }) => (
  <div className="bg-white shadow-sm border-b border-gray-200">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <LogoutButton onLogout={onLogout} />
    </div>
  </div>
);

export default FacultyDashboardHeader; 