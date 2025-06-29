import React, { useState, useEffect } from 'react';
import { Clock, User, GraduationCap, Calendar, Trash2 } from 'lucide-react';

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    try {
      const savedActivities = localStorage.getItem('recentActivities');
      if (savedActivities) {
        const parsed = JSON.parse(savedActivities);
        // Sort by timestamp (newest first) and take only the 5 most recent
        const sorted = parsed
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 5);
        setActivities(sorted);
      }
    } catch {
      setActivities([]);
    }
  };

  const addActivity = (activityData) => {
    const newActivity = {
      id: Date.now(),
      ...activityData,
      timestamp: new Date().toISOString()
    };

    try {
      const savedActivities = localStorage.getItem('recentActivities');
      const existingActivities = savedActivities ? JSON.parse(savedActivities) : [];
      
      // Add new activity and keep only the last 20 activities
      const updatedActivities = [newActivity, ...existingActivities].slice(0, 20);
      
      localStorage.setItem('recentActivities', JSON.stringify(updatedActivities));
      
      // Update state with the 5 most recent activities
      setActivities(updatedActivities.slice(0, 5));
    } catch {
      // Silently handle error
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMs = now - activityTime;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return activityTime.toLocaleDateString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'student_added':
      case 'student_deleted':
        return GraduationCap;
      case 'faculty_added':
      case 'faculty_deleted':
        return User;
      case 'session_created':
      case 'session_updated':
        return Calendar;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type) => {
    if (type.includes('added') || type.includes('created')) {
      return 'text-green-600 bg-green-100';
    }
    if (type.includes('deleted')) {
      return 'text-red-600 bg-red-100';
    }
    if (type.includes('updated')) {
      return 'text-blue-600 bg-blue-100';
    }
    return 'text-gray-600 bg-gray-100';
  };

  const clearActivities = () => {
    localStorage.removeItem('recentActivities');
    setActivities([]);
  };

  // Expose addActivity function globally for other components to use
  React.useEffect(() => {
    window.logActivity = addActivity;
    return () => {
      delete window.logActivity;
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        {activities.length > 0 && (
          <button
            onClick={clearActivities}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Clear all activities"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No recent activities</p>
          <p className="text-sm text-gray-400">Activities will appear here as you use the system</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Export the addActivity function for use in other components
export const logActivity = (title, description, type = 'general') => {
  if (window.logActivity) {
    window.logActivity({ title, description, type });
  }
};

export default RecentActivities;
