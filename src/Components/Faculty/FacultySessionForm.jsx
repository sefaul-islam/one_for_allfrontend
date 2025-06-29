import React from 'react';

const FacultySessionForm = ({
  newSession,
  setNewSession,
  loading,
  error,
  handleCreateSession,
  setShowCreateForm,
  setError,
  resetNewSession,
  showCreateForm
}) => {
  if (!showCreateForm) return null;
  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Session</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Session Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newSession.title}
              onChange={e => setNewSession({ ...newSession, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter session title"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">{newSession.title.length}/100 characters</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Participants <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={newSession.maxParticipants}
              onChange={e => setNewSession({ ...newSession, maxParticipants: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter maximum participants"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={newSession.description}
            onChange={e => setNewSession({ ...newSession, description: e.target.value })}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="Enter detailed session description"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">{newSession.description.length}/500 characters</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={newSession.startTime}
              onChange={e => setNewSession({ ...newSession, startTime: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={newSession.endTime}
              onChange={e => setNewSession({ ...newSession, endTime: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              min={newSession.startTime || new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-gray-500 mt-1">Select when the session should end</p>
          </div>
        </div>
        <div className="flex space-x-4 pt-4">
          <button
            onClick={handleCreateSession}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
          >
            {loading ? 'Creating...' : 'Create Session'}
          </button>
          <button
            onClick={() => {
              setShowCreateForm(false);
              setError('');
              resetNewSession();
            }}
            disabled={loading}
            className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultySessionForm; 