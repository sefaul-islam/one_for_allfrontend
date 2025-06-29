import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import FacultyStatsCards from './FacultyStatsCards';
import FacultyRecentSessions from './FacultyRecentSessions';

const FacultyDashboardView = ({ stats, sessions, loading, error, handleRefresh, setError, formatDateTime }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="flex items-center space-x-4">
          {loading && (
            <div className="flex items-center text-blue-600">
              <RefreshCw className="animate-spin h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Loading...</span>
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-600 ml-4"
            >
              <span className="sr-only">Dismiss</span>
              ×
            </button>
          </div>
        </div>
      )}
      <FacultyStatsCards stats={stats} />
      <FacultyRecentSessions sessions={sessions} loading={loading} error={error} formatDateTime={formatDateTime} />
    </div>
  </div>
);

export default FacultyDashboardView; 