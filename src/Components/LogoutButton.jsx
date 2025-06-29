import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function LogoutButton({ onLogout, className = "", showCard = true }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    if (showCard) {
      setTimeout(async () => {
        if (onLogout) await onLogout();
        setIsLoggingOut(false);
      }, 1000);
    } else {
      if (onLogout) await onLogout();
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${className}`}
      >
        <LogOut className="h-4 w-4" />
        <span className="font-medium">Logout</span>
      </button>

      {isLoggingOut && showCard && createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center animate-fade-in transition-all duration-300">
            <div className="mb-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Logging out...</h2>
          </div>
          <style>{`
            @keyframes fade-in {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in {
              animation: fade-in 0.3s ease;
            }
          `}</style>
        </div>,
        document.body
      )}
    </>
  );
}

// Demo Dashboard to show usage
function DashboardDemo() {
  const handleLogout = async () => {
    // Simulate your logout logic
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          
          {/* Logout button is now positioned fixed in top-right corner */}
          <LogoutButton onLogout={handleLogout} />
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">View your performance metrics</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Users</h3>
            <p className="text-gray-600">Manage user accounts</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-gray-600">Configure your preferences</p>
          </div>
        </div>
      </main>
    </div>
  );
}