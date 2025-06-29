import React from 'react';
import LogoutButton from '../LogoutButton';
import { X } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const FacultySidebar = ({ isOpen, onClose, onLogout }) => {
  let username = '';
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      username = decoded.username || decoded.name || decoded.sub || '';
    }
  } catch {}

  return (
    <div
      className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      style={{ minWidth: '18rem' }}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <div>
          <span className="block text-xs text-gray-400 mb-1">Signed in as</span>
          <span className="block text-lg font-bold text-gray-900">{username}</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
      </div>
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {/* Add sidebar navigation links here if needed */}
      </div>
      <div className="px-6 py-6 border-t border-gray-200 mt-auto">
        <LogoutButton onLogout={onLogout} className="w-full" />
      </div>
    </div>
  );
};

export default FacultySidebar; 