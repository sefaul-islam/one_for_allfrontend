import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Calendar, Activity } from 'lucide-react';
import StatsCard from './StatsCard';
import RecentActivities from './RecentActivities';
import AddStudentForm from './AddStudentForm';
import AddFacultyForm from './AddFacultyForm';
import adminService from '../../Services/adminService';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalSessions: 0,
    activeSessions: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showAddFacultyForm, setShowAddFacultyForm] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch real student, faculty, and session data
      const [studentsResult, facultyResult] = await Promise.all([
        adminService.getAllStudents(),
        adminService.getAllFaculty()
      ]);

      const studentCount = studentsResult.success ? studentsResult.data.length : 0;
      const facultyCount = facultyResult.success ? facultyResult.data.length : 0;

      // Fetch sessions data
      const sessionsResult = await adminService.getAllSessions();
      const totalSessions = sessionsResult.success ? sessionsResult.data.length : 0;
      const activeSessions = sessionsResult.success 
        ? sessionsResult.data.filter(s => 
            s.status === 'active' || 
            s.status === 'ongoing' || 
            s.status === 'in-progress'
          ).length 
        : 0;

      setStats({
        totalStudents: studentCount,
        totalFaculty: facultyCount,
        totalSessions: totalSessions,
        activeSessions: activeSessions
      });
    } catch {
      // Fallback to default values
      setStats({
        totalStudents: 0,
        totalFaculty: 0,
        totalSessions: 0,
        activeSessions: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudentSuccess = () => {
    fetchDashboardStats(); // Refresh stats after adding student
  };

  const handleAddFacultySuccess = () => {
    fetchDashboardStats(); // Refresh stats after adding faculty
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-blue-100">
          Manage your institution's students, faculty, and counseling sessions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          color="blue"
          change="+12%"
          changeType="positive"
        />
        <StatsCard
          title="Faculty Members"
          value={stats.totalFaculty}
          icon={Users}
          color="green"
          change="+5%"
          changeType="positive"
        />
        <StatsCard
          title="Total Sessions"
          value={stats.totalSessions}
          icon={Calendar}
          color="purple"
          change="+8%"
          changeType="positive"
        />
        <StatsCard
          title="Active Sessions"
          value={stats.activeSessions}
          icon={Activity}
          color="orange"
          change="+15%"
          changeType="positive"
        />
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowAddStudentForm(true)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-left transition-colors flex items-center space-x-3"
              >
                <GraduationCap className="h-5 w-5" />
                <span>Add New Student</span>
              </button>
              <button
                onClick={() => setShowAddFacultyForm(true)}
                className="w-full bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg text-left transition-colors flex items-center space-x-3"
              >
                <Users className="h-5 w-5" />
                <span>Add Faculty Member</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <RecentActivities />
        </div>
      </div>

      {/* Add Forms */}
      <AddStudentForm
        isOpen={showAddStudentForm}
        onClose={() => setShowAddStudentForm(false)}
        onSuccess={handleAddStudentSuccess}
      />

      <AddFacultyForm
        isOpen={showAddFacultyForm}
        onClose={() => setShowAddFacultyForm(false)}
        onSuccess={handleAddFacultySuccess}
      />
    </div>
  );
};

export default DashboardOverview;
