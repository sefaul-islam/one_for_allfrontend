import React from 'react';
import { Search, Users, X } from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const handleSearchCounsels = () => {
    // TODO: Implement search counsels functionality
    // API call to fetch available counsels
    // const token = localStorage.getItem('jwt_token');
    // const response = await fetch('/api/counsels/search', {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    console.log('Search counsels clicked');
  };

  const handleRegisteredCounsels = () => {
    // TODO: Implement registered counsels functionality
    // API call to fetch user's registered counsels
    // const token = localStorage.getItem('jwt_token');
    // const response = await fetch('/api/counsels/registered', {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    console.log('Registered counsels clicked');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Menu Options */}
          <div className="space-y-3">
            <button
              onClick={handleSearchCounsels}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <Search className="h-5 w-5 text-gray-500 group-hover:text-blue-600" />
              <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                Search Counsels
              </span>
            </button>
            
            <button
              onClick={handleRegisteredCounsels}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors group"
            >
              <Users className="h-5 w-5 text-gray-500 group-hover:text-green-600" />
              <span className="text-gray-700 group-hover:text-green-600 font-medium">
                Registered Counsels
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;