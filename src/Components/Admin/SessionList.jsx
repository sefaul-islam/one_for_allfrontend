import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Users, Filter } from 'lucide-react';
import SearchBar from './SearchBar';
import DataTable from './DataTable';
import adminService from '../../Services/adminService';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const result = await adminService.getAllSessions();
      if (result.success) {
        setSessions(result.data);
      }
    } catch {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = useCallback(() => {
    let filtered = sessions;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(session =>
        session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.facultyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => {
        const status = session.status?.toLowerCase();
        return status === statusFilter.toLowerCase();
      });
    }

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, statusFilter]);

  useEffect(() => {
    filterSessions();
  }, [filterSessions]);

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower === 'active' || statusLower === 'ongoing') {
      return 'px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium';
    } else if (statusLower === 'pending' || statusLower === 'scheduled') {
      return 'px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium';
    } else if (statusLower === 'completed') {
      return 'px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium';
    } else if (statusLower === 'cancelled') {
      return 'px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium';
    } else {
      return 'px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium';
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Session Title',
      render: (session) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Calendar className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{session.title}</p>
            <p className="text-sm text-gray-500 truncate max-w-xs">{session.description}</p>
          </div>
        </div>
      )
    },
    {
      key: 'faculty',
      header: 'Faculty',
      render: (session) => (
        <span className="text-gray-900">{session.facultyName || 'N/A'}</span>
      )
    },
    {
      key: 'schedule',
      header: 'Schedule',
      render: (session) => {
        const startTime = formatDateTime(session.startTime);
        const endTime = formatDateTime(session.endTime);
        return (
          <div className="text-sm">
            <div className="flex items-center text-gray-900">
              <Calendar className="h-4 w-4 mr-1" />
              {startTime.date}
            </div>
            <div className="flex items-center text-gray-500 mt-1">
              <Clock className="h-4 w-4 mr-1" />
              {startTime.time} - {endTime.time}
            </div>
          </div>
        );
      }
    },
    {
      key: 'participants',
      header: 'Participants',
      render: (session) => (
        <div className="flex items-center text-gray-900">
          <Users className="h-4 w-4 mr-1" />
          <span>{session.currentParticipants || 0} / {session.maxParticipants || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (session) => (
        <span className={getStatusBadge(session.status)}>
          {session.status || 'Unknown'}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Counseling Sessions</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading sessions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Counseling Sessions</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search sessions by title, description, or faculty..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {/* Sessions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredSessions}
          emptyMessage="No counseling sessions found"
        />
      </div>
    </div>
  );
};

export default SessionList;
