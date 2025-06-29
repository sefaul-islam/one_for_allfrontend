import React, { useEffect, useState } from 'react';
import { LogOut, CheckCircle } from 'lucide-react';

const LogoutTransition = ({ onComplete }) => {
  const [stage, setStage] = useState('logging-out'); // 'logging-out', 'success', 'complete'

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage('success');
    }, 800);

    const timer2 = setTimeout(() => {
      setStage('complete');
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-2xl transform transition-all duration-500 ease-in-out">
        <div className="text-center">
          {stage === 'logging-out' && (
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Signing Out...</h3>
              <p className="text-gray-500">Please wait while we log you out</p>
            </div>
          )}
          
          {stage === 'success' && (
            <div className="animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Signed Out Successfully</h3>
              <p className="text-gray-500">Redirecting to login page...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoutTransition;
