import React, { useState, useEffect } from 'react';
import { Users, Calendar, Plus, Eye, BarChart3, BookOpen, Clock, CheckCircle, AlertCircle, RefreshCw, LogOut, Menu } from 'lucide-react';
import {jwtDecode} from 'jwt-decode'
import { createReserveCounsel, getCounselStatsByFaculty } from '../Services/counselService';
import FacultyDashboardHeader from '../Components/Faculty/FacultyDashboardHeader';
import FacultyDashboardNav from '../Components/Faculty/FacultyDashboardNav';
import FacultyDashboardView from '../Components/Faculty/FacultyDashboardView';
import FacultyPrepareView from '../Components/Faculty/FacultyPrepareView';
import FacultySessionTableView from '../Components/Faculty/FacultySessionTableView';
import LogoutCard from '../Components/LogoutCard';
// TODO: Import the actual axios service file
// import { apiService } from './services/axiosService';

// TEMPORARY: Mock API service for demonstration
// TODO: Remove this mock service and uncomment the import above
const apiService = {
  getStats: async () => {
    // TODO: This will be replaced by actual API call
    // Expected response format:
    // {
    //   totalSessions: number,
    //   completedSessions: number,
    //   upcomingSessions: number
    // }
    throw new Error('API service not implemented');
  },
  
  getAllSessions: async () => {
    // TODO: This will be replaced by actual API call
    // Expected response format:
    // [
    //   {
    //     id: number,
    //     title: string,
    //     description: string,
    //     startTime: string (ISO format),
    //     endTime: string (ISO format),
    //     maxParticipants: number,
    //     currentParticipants: number,
    //     status: 'Scheduled' | 'Completed' | 'Cancelled'
    //   }
    // ]
    throw new Error('API service not implemented');
  },
  
  createSession: async (sessionData) => {
    // TODO: This will be replaced by actual API call
    // Expected request format:
    // {
    //   title: string,
    //   description: string,
    //   startTime: string (ISO format),
    //   endTime: string (ISO format),
    //   maxParticipants: number
    // }
    throw new Error('API service not implemented');
  }
};

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    maxParticipants: ''
  });

  const handleLogout = () => {
    setIsLoggingOut(true);
  };

  const completeLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleCreateSession = async () => {
    if (!newSession.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!newSession.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!newSession.startTime) {
      setError('Start time is required');
      return;
    }
    if (!newSession.maxParticipants || newSession.maxParticipants < 1) {
      setError('Max participants must be at least 1');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const sessionData = {
        title: newSession.title.trim(),
        description: newSession.description.trim(),
        startTime: `${newSession.startTime}:00`,
        endTime: `${newSession.endTime}:00`,
        maxParticipants: parseInt(newSession.maxParticipants)
      };
      const token = localStorage.getItem('token');
      if(!token){
        setError('Token not found');
        return;
      }
      const decoded = jwtDecode(token);
      const facultyId= decoded.id;
      const result = await createReserveCounsel(facultyId,sessionData);
      if(result.success){
        setSessions(prev=>[...prev, result.data]);
        resetNewSession();
        setShowCreateForm(false);
        await handleRefresh();
      }
      else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to create session. Please try again.');
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

  const handleRefresh = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getCounselStatsByFaculty();
      if (result.success) {
        setStats(prev => ({
          ...prev,
          totalSessions: Array.isArray(result.data) ? result.data.length : 0,
          completedSessions: result.completedCount,
          upcomingSessions: result.pendingCount
        }));
        setSessions(Array.isArray(result.data) ? result.data : []);
      } else {
        setError(result.message || 'Failed to fetch counsel stats');
      }
    } catch (err) {
      setError('Failed to fetch counsel stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, []);

  const resetNewSession = () => setNewSession({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    maxParticipants: ''
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <FacultySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />
      {/* Header with menu button */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
          </div>
        </div>
      </div>
      <FacultyDashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <FacultyDashboardView
            stats={stats}
            sessions={sessions}
            loading={loading}
            error={error}
            handleRefresh={handleRefresh}
            setError={setError}
            formatDateTime={formatDateTime}
          />
        )}
        {activeTab === 'prepare' && (
          <FacultyPrepareView
            stats={stats}
            newSession={newSession}
            setNewSession={setNewSession}
            loading={loading}
            error={error}
            handleCreateSession={handleCreateSession}
            setShowCreateForm={setShowCreateForm}
            setError={setError}
            resetNewSession={resetNewSession}
            showCreateForm={showCreateForm}
            sessions={sessions}
            formatDateTime={formatDateTime}
          />
        )}
        {activeTab === 'sessionTable' && (
          <FacultySessionTableView
            sessions={sessions}
            setSessions={setSessions}
            formatDateTime={formatDateTime}
          />
        )}
      </div>
      
      {/* Logout Animation */}
      {isLoggingOut && <LogoutCard onComplete={completeLogout} />}
    </div>
  );
};

export default FacultyDashboard;