import React from 'react';
import { X, LayoutDashboard, Users, GraduationCap, Calendar, Building } from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose, activeTab, setActiveTab, adminProfile }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview and statistics'
    },
    {
      id: 'students',
      label: 'Students',
      icon: GraduationCap,
      description: 'Manage student accounts'
    },
    {
      id: 'faculty',
      label: 'Faculty',
      icon: Users,
      description: 'Manage faculty members'
    },
    {
      id: 'departments',
      label: 'Departments',
      icon: Building,
      description: 'Manage departments'
    },
    {
      id: 'sessions',
      label: 'Sessions',
      icon: Calendar,
      description: 'Counseling sessions'
    }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onClose(); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-200
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
              <p className="text-sm text-gray-500">Management Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Admin Profile */}
        {adminProfile && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">
                  {adminProfile.username ? adminProfile.username.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{adminProfile.username || 'Admin'}</p>
                <p className="text-sm text-gray-500">{adminProfile.email || 'admin@example.com'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <p className={`font-medium ${isActive ? 'text-blue-900' : ''}`}>
                    {item.label}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Admin Dashboard v1.0
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
