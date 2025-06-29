import React from 'react';
import { Plus, Eye, AlertCircle } from 'lucide-react';
import FacultySessionForm from './FacultySessionForm';

const FacultyPrepareView = ({
  stats,
  newSession,
  setNewSession,
  loading,
  error,
  handleCreateSession,
  setShowCreateForm,
  setError,
  resetNewSession,
  showCreateForm,
}) => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Prepare Session</h2>
        {loading && (
          <div className="flex items-center text-blue-600">
            <span className="animate-spin h-5 w-5 mr-2 inline-block">🔄</span>
            <span className="text-sm font-medium">Processing...</span>
          </div>
        )}
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
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Create Session</span>
        </button>
        <div className="bg-gray-100 px-6 py-3 rounded-lg flex items-center space-x-2">
          <Eye className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700 font-medium">
            Total Sessions: <span className="text-gray-900 font-bold">{stats.totalSessions}</span>
          </span>
        </div>
      </div>
      <FacultySessionForm
        newSession={newSession}
        setNewSession={setNewSession}
        loading={loading}
        error={error}
        handleCreateSession={handleCreateSession}
        setShowCreateForm={setShowCreateForm}
        setError={setError}
        resetNewSession={resetNewSession}
        showCreateForm={showCreateForm}
      />
    </div>
  </div>
);

export default FacultyPrepareView; 