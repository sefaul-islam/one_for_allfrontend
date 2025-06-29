import React, { useState } from 'react';
import { Calendar, BookOpen, X, Trash2 } from 'lucide-react';
import { getCounselParticipants, deleteReserveCounsel } from '../../Services/counselService';
import { jwtDecode } from 'jwt-decode';

const FacultySessionsTable = ({ sessions, setSessions, formatDateTime }) => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleRowClick = async (session) => {
    setSelectedSession(session);
    setModalOpen(true);
    setLoading(true);
    setError('');
    setParticipants([]);
    try {
      const res = await getCounselParticipants(session.id);
      if (res.success) {
        setParticipants(res.data);
      } else {
        setError(res.message || 'Failed to fetch participants');
      }
    } catch {
      setError('Failed to fetch participants');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSession(null);
    setParticipants([]);
    setError('');
    setLoading(false);
  };

  const handleDelete = async (sessionId) => {
    setDeletingId(sessionId);
    setDeleteError('');
    try {
      const token = localStorage.getItem('token');
      const facultyId = jwtDecode(token).id;
      const res = await deleteReserveCounsel(sessionId, facultyId);
      if (res.success) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        setConfirmDeleteId(null);
      } else {
        setDeleteError(res.message || 'Failed to delete session');
      }
    } catch {
      setDeleteError('Failed to delete session');
    } finally {
      setDeletingId(null);
    }
  };

  // Find the session being deleted for its title
  const sessionToDelete = sessions.find(s => s.id === confirmDeleteId);

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-black mb-6 flex items-center">
        <BookOpen className="h-6 w-6 mr-3 text-orange-500" />
        All Sessions
      </h3>
      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-black-500 mx-auto mb-4" />
          <p className="text-black font-medium text-lg">No sessions created yet</p>
          <p className="text-gray-400 text-sm">Start by creating your first session</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Session Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Participants</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sessions.map(session => {
                const { date, time } = formatDateTime(session.startTime);
                return (
                  <tr
                    key={session.id}
                    className="hover:bg-orange-100 transition-colors duration-150 cursor-pointer"
                    onClick={() => handleRowClick(session)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                          <Calendar className="h-5 w-5 text-black-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-black">{session.title}</p>
                          <p className="text-sm text-black mt-1">{session.description}</p>
                        </div>
                        <button
                          className="ml-4 text-red-500 hover:text-red-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
                          title="Delete Session"
                          onClick={e => {
                            e.stopPropagation();
                            setConfirmDeleteId(session.id);
                          }}
                          disabled={deletingId === session.id}
                        >
                          {deletingId === session.id ? (
                            <span className="animate-spin">🗑️</span>
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {deleteError && deletingId === session.id && (
                        <div className="text-red-500 text-xs mt-1">{deleteError}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="font-medium text-black">{date}</p>
                        <p className="text-black">{time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <span className="font-medium text-black">
                          {session.currentParticipants || 0}
                        </span>
                        <span className="text-black">/{session.maxParticipants}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{
                            width: `${Math.min(((session.currentParticipants || 0) / session.maxParticipants) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full
                          ${session.status === 'ACTIVE' ? 'bg-green-100 text-green-800'
                            : session.status === 'COMPLETED' ? 'bg-red-100 text-red-800'
                            : session.status === 'CANCELLED' ? 'bg-red-100 text-red-800'
                            : session.status === 'PENDING' ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'}
                        `}
                      >
                        {session.status.charAt(0) + session.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for session details */}
      {modalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-black mb-4">Session Participants</h2>
            <p className="text-lg font-semibold text-orange-600 mb-2">{selectedSession.title}</p>
            <div className="mb-4">
              <span className="text-gray-700 font-medium">Session ID: </span>
              <span className="text-black">{selectedSession.id}</span>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-black mb-2">Participants</h3>
              {loading ? (
                <div className="text-gray-500 italic">Loading...</div>
              ) : error ? (
                <div className="text-red-500 italic">{error}</div>
              ) : participants.length === 0 ? (
                <div className="text-gray-500 italic">No participants have joined yet.</div>
              ) : (
                <ul className="space-y-2">
                  {participants.map((p, idx) => (
                    <li key={p.id || idx} className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                        <span className="text-black font-medium">{p.name}</span>
                        <span className="text-gray-400">ID: {p.id}</span>
                        <span className="text-gray-400">Student Number: {p.studentId}</span>
                      </div>
                      <span className="text-gray-600 mt-1 md:mt-0">Joined at {p.joiningTime}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* You can add more session details here if needed */}
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xs relative flex flex-col items-center">
            <p className="text-lg font-semibold text-black mb-2 text-center">Are you sure you want to delete this session counsel?</p>
            <p className="text-base text-orange-600 font-bold mb-4 text-center">{sessionToDelete.title}</p>
            <div className="flex space-x-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deletingId === confirmDeleteId}
              >
                {deletingId === confirmDeleteId ? 'Deleting...' : 'Yes'}
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg font-medium"
                onClick={() => setConfirmDeleteId(null)}
                disabled={deletingId === confirmDeleteId}
              >
                Cancel
              </button>
            </div>
            {deleteError && (
              <div className="text-red-500 text-xs mt-2">{deleteError}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultySessionsTable; 