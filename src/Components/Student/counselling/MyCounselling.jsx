import React, { useState, useEffect } from 'react';
import { getStudentRegisteredCounsels, cancelCounselling } from '../../../Services/counselService';
import { Calendar, Clock, Users, BookOpen } from 'lucide-react';

const MyCounselling = () => {
  const [counsels, setCounsels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelMessage, setCancelMessage] = useState('');

  useEffect(() => {
    fetchMyCounsels();
  }, []);

  const fetchMyCounsels = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getStudentRegisteredCounsels();
      if (result.success) {
        setCounsels(Array.isArray(result.data) ? result.data : []);
      } else {
        setError(result.message || 'Failed to fetch counsels');
      }
    } catch (err) {
      setError('Failed to fetch counsels');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return { date: '', time: '' };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const handleCancelCounselling = async (counselId) => {
    setCancellingId(counselId);
    setCancelMessage('');
    try {
      const result = await cancelCounselling(counselId);
      if (result.success) {
        setCancelMessage('Successfully cancelled counselling session!');
        fetchMyCounsels();
      } else {
        setCancelMessage(result.message || 'Failed to cancel session');
      }
    } catch {
      setCancelMessage('Failed to cancel session');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading your counsels...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchMyCounsels}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <BookOpen className="h-6 w-6 mr-3 text-blue-500" />
        My Counselling Sessions
      </h2>
      
      {cancelMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          cancelMessage.includes('Successfully')
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {cancelMessage}
        </div>
      )}
      
      {counsels.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">No counselling sessions found</p>
          <p className="text-gray-400 text-sm">You haven't registered for any counselling sessions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {counsels.map((counsel) => {
            const { date, time } = formatDateTime(counsel.startTime);
            return (
              <div key={counsel.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{counsel.title}</h3>
                    <p className="text-gray-600 mb-4">{counsel.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-green-500" />
                        <span>{time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-purple-500" />
                        <span>{counsel.currentParticipants || 0}/{counsel.maxParticipants} participants</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col items-end">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mb-3 ${
                      counsel.status === 'ACTIVE' ? 'bg-green-100 text-green-800'
                        : counsel.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800'
                        : counsel.status === 'CANCELLED' ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {counsel.status.charAt(0) + counsel.status.slice(1).toLowerCase()}
                    </span>
                    {counsel.status === 'PENDING' && (
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          cancellingId === counsel.id
                            ? 'bg-red-400 text-white cursor-wait'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                        onClick={() => handleCancelCounselling(counsel.id)}
                        disabled={cancellingId === counsel.id}
                      >
                        {cancellingId === counsel.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCounselling; 