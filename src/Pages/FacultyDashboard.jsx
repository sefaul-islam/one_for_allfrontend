import React, { useState, useEffect } from 'react';
import { Users, Calendar, Plus, Eye, BarChart3, BookOpen, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import {jwtDecode} from 'jwt-decode';
import { createReserveCounsel, getCounselStatsByFaculty } from '../Services/counselService';
import adminService from '../Services/adminService';
import FacultyDashboardHeader from '../Components/Faculty/FacultyDashboardHeader';
import FacultyDashboardNav from '../Components/Faculty/FacultyDashboardNav';
import FacultyDashboardView from '../Components/Faculty/FacultyDashboardView';
import FacultyPrepareView from '../Components/Faculty/FacultyPrepareView';
import FacultySessionTableView from '../Components/Faculty/FacultySessionTableView';
import ProfileDropdown from '../Components/ProfileDropdown';
import LogoutTransition from '../Components/LogoutTransition';

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    totalFaculty: 0
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
    } catch {
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
      // Fetch counsel stats
      const counselResult = await getCounselStatsByFaculty();
      console.log('Counsel result:', counselResult);

      if (counselResult.success) {
        setStats(prev => ({
          ...prev,
          totalSessions: Array.isArray(counselResult.data) ? counselResult.data.length : 0,
          completedSessions: counselResult.completedCount || 0,
          upcomingSessions: counselResult.pendingCount || 0,
          totalFaculty: 0 // Will be updated separately
        }));
        setSessions(Array.isArray(counselResult.data) ? counselResult.data : []);
      } else {
        setError(counselResult.message || 'Failed to fetch counsel stats');
      }

      // Try to fetch faculty count separately (may fail if no admin access)
      try {
        const facultyResult = await adminService.getAllFacultyMembers();
        console.log('Faculty result:', facultyResult);
        
        if (facultyResult.success) {
          const facultyCount = Array.isArray(facultyResult.data) ? facultyResult.data.length : 0;
          console.log('Faculty count:', facultyCount);
          
          setStats(prev => ({
            ...prev,
            totalFaculty: facultyCount
          }));
        } else {
          console.log('Faculty fetch failed:', facultyResult.message);
          // Set a default value or leave as 0
          setStats(prev => ({
            ...prev,
            totalFaculty: 0
          }));
        }
      } catch (facultyError) {
        console.error('Faculty fetch error:', facultyError);
        // Faculty user might not have access to admin endpoints
        setStats(prev => ({
          ...prev,
          totalFaculty: 0
        }));
      }
    } catch (error) {
      console.error('Error in handleRefresh:', error);
      setError('Failed to fetch counsel stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
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
      {/* Header with profile dropdown */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
          </div>
          <ProfileDropdown onLogout={handleLogout} />
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
      
      {/* Logout Transition */}
      {isLoggingOut && <LogoutTransition onComplete={completeLogout} />}
    </div>
  );
};

export default FacultyDashboard;