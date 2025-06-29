import React, { useRef, useEffect, useState } from 'react';
import { Menu, ChevronDown } from 'lucide-react';

const COUNSELLING_OPTIONS = [
  { key: 'join', label: 'Join Counselling' },
  { key: 'my', label: 'My Counselling' },
];

const StudentNavbar = ({ activeTab, setActiveTab, onMenu, counsellingOption, onCounsellingOption }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 flex items-center justify-between py-4">
        <div className="flex space-x-8 items-center">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 border-b-2 ${
              activeTab === 'dashboard'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              className={`px-6 py-2 text-sm font-semibold flex items-center transition-colors duration-200 border-b-2 ${
                activeTab === 'counselling'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
              }`}
            >
              Counselling
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-20">
                {COUNSELLING_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setActiveTab('counselling');
                      onCounsellingOption(opt.key);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      counsellingOption === opt.key ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onMenu}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default StudentNavbar; 