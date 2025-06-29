import React, { useEffect, useState } from 'react';
import { LogOut, CheckCircle } from 'lucide-react';

const LogoutCard = ({ onComplete }) => {
  const [stage, setStage] = useState('logging-out'); // 'logging-out', 'success', 'complete'

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage('success');
    }, 800); // Show success state after 0.8 seconds

    const timer2 = setTimeout(() => {
      setStage('complete');
      onComplete();
    }, 1500); // Complete after 1.5 seconds

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-3xl p-8 w-full max-w-sm mx-4 transform animate-scaleIn">
        <div className="text-center">
          {/* Icon Container */}
          <div className="relative mb-6">
            {stage === 'logging-out' && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <LogOut className="h-8 w-8 text-red-600 animate-bounce" />
              </div>
            )}
            {stage === 'success' && (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-scaleIn">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            {stage === 'logging-out' && (
              <>
                <h3 className="text-xl font-semibold text-gray-900">Signing Out</h3>
                <p className="text-gray-600">Please wait while we securely log you out...</p>
              </>
            )}
            {stage === 'success' && (
              <>
                <h3 className="text-xl font-semibold text-gray-900 animate-fadeIn">Successfully Logged Out</h3>
                <p className="text-gray-600 animate-fadeIn">Redirecting to login page...</p>
              </>
            )}
          </div>

          {/* Loading Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-1500 ease-out"
                style={{ 
                  width: stage === 'logging-out' ? '60%' : stage === 'success' ? '100%' : '0%' 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutCard;
