import React, { useState } from 'react';
import AdminNavbar from '../Components/Admin/AdminNavbar';
import DashboardOverview from '../Components/Admin/DashboardOverview';
import FacultyList from '../Components/Admin/FacultyList';
import StudentList from '../Components/Admin/StudentList';
import SessionList from '../Components/Admin/SessionList';
import DepartmentList from '../Components/Admin/DepartmentList';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'faculty':
        return <FacultyList />;
      case 'students':
        return <StudentList />;
      case 'departments':
        return <DepartmentList />;
      case 'sessions':
        return <SessionList />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <AdminNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
