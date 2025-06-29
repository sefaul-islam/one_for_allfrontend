import React, { useState, useEffect } from 'react';
import StudentNavbar from './StudentNavbar';
import DashboardContent from './DashboardContent';
import CounsellingContent from './CounsellingContent';
import LogoutTransition from '../LogoutTransition';
import { getStudentCounselStats } from '../../Services/counselService';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [counsellingOption, setCounsellingOption] = useState('search');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [stats, setStats] = useState([
    { title: 'Upcoming Sessions', value: 0, icon: '📅', color: 'bg-blue-500' },
    { title: 'Registered', value: 0, icon: '📝', color: 'bg-green-500' },
    { title: 'Completed', value: 0, icon: '✅', color: 'bg-purple-500' },
  ]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');

  const handleLogout = () => {
    setIsLoggingOut(true);
  };

  const completeLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setStatsError('');
      const result = await getStudentCounselStats();
      if (result.success) {
        setStats([
          { title: 'Upcoming Sessions', value: result.stats.upcoming, icon: '📅', color: 'bg-blue-500' },
          { title: 'Registered', value: result.stats.registered, icon: '📝', color: 'bg-green-500' },
          { title: 'Completed', value: result.stats.completed, icon: '✅', color: 'bg-purple-500' },
        ]);
      } else {
        setStatsError(result.message || 'Failed to fetch stats');
      }
      setLoadingStats(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-gray-700">
      <StudentNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counsellingOption={counsellingOption}
        onCounsellingOption={setCounsellingOption}
        onLogout={handleLogout}
      />
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          loadingStats ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading stats...</span>
            </div>
          ) : statsError ? (
            <div className="text-center py-12 text-red-500">{statsError}</div>
          ) : (
            <DashboardContent stats={stats} setActiveTab={setActiveTab} setCounsellingOption={setCounsellingOption} />
          )
        )}
        {activeTab === 'counselling' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <CounsellingContent counsellingOption={counsellingOption} />
          </div>
        )}
      </div>
      
      {/* Logout Transition */}
      {isLoggingOut && <LogoutTransition onComplete={completeLogout} />}
    </div>
  );
};

export default StudentDashboard; 