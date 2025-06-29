import React, { useState } from 'react';
import { User, LogOut, LayoutDashboard, Users, GraduationCap, Calendar, Building } from 'lucide-react';
import LogoutTransition from '../LogoutTransition';

const AdminNavbar = ({ activeTab, setActiveTab }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutTransition, setShowLogoutTransition] = useState(false);

  const navigationTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'students',
      label: 'Students',
      icon: GraduationCap
    },
    {
      id: 'faculty',
      label: 'Faculty',
      icon: Users
    },
    {
      id: 'departments',
      label: 'Departments',
      icon: Building
    },
    {
      id: 'sessions',
      label: 'Sessions',
      icon: Calendar
    }
  ];

  const handleSignOut = () => {
    setShowProfileMenu(false);
    setShowLogoutTransition(true);
  };

  const completeLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Get admin info from localStorage
  const adminInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Title and Navigation Tabs */}
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              </div>
              
              {/* Navigation Tabs */}
              <nav className="hidden md:flex space-x-1">
                {navigationTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                        ${activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right side - Profile menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {adminInfo.username || 'Admin'}
                </span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {adminInfo.username || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-gray-200">
            <div className="flex overflow-x-auto py-2 space-x-1">
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200
                      ${activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Transition */}
      {showLogoutTransition && <LogoutTransition onComplete={completeLogout} />}

      {/* Backdrop to close profile menu */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </>
  );
};

export default AdminNavbar;
