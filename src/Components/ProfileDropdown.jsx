import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const ProfileDropdown = ({ onLogout, userType = 'User' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState(userType);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Get username and role from token
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || decoded.name || decoded.sub || 'User');
        
        // Determine user role from token
        const roles = decoded.roles || [];
        if (roles.includes('ROLE_ADMIN')) {
          setUserRole('Admin');
        } else if (roles.includes('ROLE_FACULTY')) {
          setUserRole('Faculty');
        } else if (roles.includes('ROLE_STUDENT')) {
          setUserRole('Student');
        } else {
          setUserRole(userType);
        }
      }
    } catch {
      setUsername('User');
      setUserRole(userType);
    }
  }, [userType]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{username}</p>
          <p className="text-xs text-gray-500">{userRole}</p>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 dropdown-enter">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{username}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center space-x-3"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
