import React from 'react';
import { BarChart3, Calendar, Users } from 'lucide-react';

const FacultyRecentSessions = ({ sessions, loading, error, formatDateTime }) => (
  <div className="bg-gray-50 rounded-xl p-6">
    <h3 className="text-xl font-semibold text-black mb-6 flex items-center">
      <BarChart3 className="h-6 w-6 mr-3 text-orange-500" />
      Recent Sessions
    </h3>
    <div className="space-y-4">
      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <p className="text-black font-medium">No sessions found</p>
          <p className="text-gray-400 text-sm">Create your first session to get started</p>
        </div>
      ) : (
        sessions.slice(0, 3).map(session => {
          const { date, time } = formatDateTime(session.startTime);
          return (
            <div key={session.id} className="bg-white rounded-lg p-5 flex items-center justify-between border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-black text-lg">{session.title}</p>
                  <p className="text-black text-sm">{session.description}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {session.currentParticipants || 0}/{session.maxParticipants} participants
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-black">{date}</p>
                <p className="text-sm text-black">{time}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                  session.status === 'ACTIVE' ? 'bg-green-100 text-green-800'
                    : session.status === 'COMPLETED' ? 'bg-red-100 text-red-800'
                    : session.status === 'CANCELLED' ? 'bg-red-100 text-red-800'
                    : session.status === 'PENDING' ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {session.status.charAt(0) + session.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);

export default FacultyRecentSessions; 