import React from 'react';

const FacultyDashboardNav = ({ activeTab, setActiveTab }) => (
  <div className="bg-white shadow-lg border-b border-gray-200">
    <div className="container mx-auto px-4">
      <div className="flex space-x-8">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-4 text-sm font-semibold transition-colors duration-200 border-b-2 ${
            activeTab === 'dashboard'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('prepare')}
          className={`px-6 py-4 text-sm font-semibold transition-colors duration-200 border-b-2 ${
            activeTab === 'prepare'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
          }`}
        >
          Prepare Session
        </button>
        <button
          onClick={() => setActiveTab('sessionTable')}
          className={`px-6 py-4 text-sm font-semibold transition-colors duration-200 border-b-2 ${
            activeTab === 'sessionTable'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
          }`}
        >
          Session Table
        </button>
      </div>
    </div>
  </div>
);

export default FacultyDashboardNav; 