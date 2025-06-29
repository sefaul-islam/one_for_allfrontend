import React, { useState, useEffect } from 'react';
import { getAvailableCounsels, joinCounselling, cancelCounselling, getStudentRegisteredCounsels } from '../../../Services/counselService';
import { Calendar, Clock, Users, BookOpen, User, CheckCircle, Search } from 'lucide-react';

const JoinCounselling = () => {
  const [counsels, setCounsels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joiningId, setJoiningId] = useState(null);
  const [joinMessage, setJoinMessage] = useState('');
  const [joinedCounselIds, setJoinedCounselIds] = useState([]);
  const [justJoinedId, setJustJoinedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAvailableCounsels();
    fetchJoinedCounsels();
  }, []);

  const fetchAvailableCounsels = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getAvailableCounsels();
      if (result.success) {
        setCounsels(Array.isArray(result.data) ? result.data : []);
      } else {
        setError(result.message || 'Failed to fetch counsels');
      }
    } catch {
      setError('Failed to fetch counsels');
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedCounsels = async () => {
    try {
      const result = await getStudentRegisteredCounsels();
      if (result.success) {
        setJoinedCounselIds(Array.isArray(result.data) ? result.data.map(c => c.id) : []);
      } else {
        setJoinedCounselIds([]);
      }
    } catch {
      setJoinedCounselIds([]);
    }
  };

  const handleJoinCounselling = async (counselId) => {
    setJoiningId(counselId);
    setJoinMessage('');
    try {
      const result = await joinCounselling(counselId);
      if (result.success) {
        setJoinMessage('Successfully joined counselling session!');
        setJoinedCounselIds(prev => [...prev, counselId]);
        setJustJoinedId(counselId);
        setTimeout(() => {
          setJustJoinedId(null);
        }, 1000);
        fetchAvailableCounsels();
      } else {
        setJoinMessage(result.message || 'Failed to join session');
      }
    } catch {
      setJoinMessage('Failed to join session');
    } finally {
      setJoiningId(null);
    }
  };

  const handleCancelCounselling = async (counselId) => {
    setJoiningId(counselId);
    setJoinMessage('');
    try {
      const result = await cancelCounselling(counselId);
      if (result.success) {
        setJoinMessage('Successfully cancelled counselling session!');
        setTimeout(() => {
          fetchAvailableCounsels();
          fetchJoinedCounsels();
        }, 1000);
      } else {
        setJoinMessage(result.message || 'Failed to cancel session');
      }
    } catch {
      setJoinMessage('Failed to cancel session');
    } finally {
      setJoiningId(null);
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

  const filteredCounsels = searchTerm.trim()
    ? counsels.filter(counsel =>
        (counsel.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          counsel.facultyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          counsel.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : counsels;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading available counsels...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchAvailableCounsels}
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
        Join Counselling Sessions
      </h2>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, faculty name, or description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {joinMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          joinMessage.includes('Successfully') 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {joinMessage.includes('Successfully') ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <span className="mr-2">⚠️</span>
            )}
            {joinMessage}
          </div>
        </div>
      )}
      
      {filteredCounsels.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">
            {searchTerm ? 'No counsels found matching your search' : 'No counselling sessions available'}
          </p>
          <p className="text-gray-400 text-sm">
            {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new sessions'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCounsels.map((counsel) => {
            const { date, time } = formatDateTime(counsel.startTime);
            const isJoining = joiningId === counsel.id;
            const isFull = (counsel.currentParticipants || 0) >= counsel.maxParticipants;
            const isJoined = joinedCounselIds.includes(counsel.id);
            
            return (
              <div key={counsel.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{counsel.title}</h3>
                    <p className="text-gray-600 mb-4">{counsel.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2 text-purple-500" />
                        <span>{counsel.facultyName || 'Faculty'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-green-500" />
                        <span>{time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-orange-500" />
                        <span className={isFull ? 'text-red-600 font-medium' : ''}>
                          {counsel.currentParticipants || 0}/{counsel.maxParticipants} participants
                        </span>
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
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isFull
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : isJoining
                          ? 'bg-blue-400 text-white cursor-wait'
                          : isJoined
                          ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      onClick={() => !isFull && !isJoining && !isJoined && handleJoinCounselling(counsel.id)}
                      disabled={isFull || isJoining || isJoined}
                    >
                      {isJoining ? 'Joining...' : isFull ? 'Session Full' : isJoined ? 'Joined' : 'Join Session'}
                    </button>
                    {isJoined && (
                      <button
                        className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isJoining
                            ? 'bg-red-400 text-white cursor-wait'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        } ${justJoinedId === counsel.id ? 'animate-fade-in' : ''}`}
                        onClick={() => !isJoining && handleCancelCounselling(counsel.id)}
                        disabled={isJoining}
                      >
                        {isJoining ? 'Cancelling...' : 'Cancel'}
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

export default JoinCounselling; 