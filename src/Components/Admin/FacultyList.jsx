import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import SearchBar from './SearchBar';
import DataTable from './DataTable';
import AddFacultyForm from './AddFacultyForm';
import adminService from '../../Services/adminService';

const FacultyList = () => {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchFaculty();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFaculty(faculty);
      return;
    }

    const filtered = faculty.filter(f =>
      f.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFaculty(filtered);
  }, [faculty, searchTerm]);

  const fetchFaculty = async () => {
    try {
      const result = await adminService.getAllFacultyMembers();
      if (result.success) {
        setFaculty(result.data || []);
      } else {
        setFaculty([]);
      }
    } catch {
      setFaculty([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    fetchFaculty(); // Refresh the list
  };

  const handleDeleteClick = (facultyMember) => {
    setFacultyToDelete(facultyMember);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!facultyToDelete) return;

    setDeleting(true);
    try {
      const response = await adminService.deleteFacultyById(facultyToDelete.facultyId);
      
      if (response.success) {
        // Remove from local state
        setFaculty(prev => prev.filter(f => f.facultyId !== facultyToDelete.facultyId));
        setFilteredFaculty(prev => prev.filter(f => f.facultyId !== facultyToDelete.facultyId));
        
        setShowDeleteModal(false);
        setFacultyToDelete(null);
      } else {
        alert('Failed to delete faculty member. Please try again.');
      }
    } catch {
      alert('An error occurred while deleting the faculty member.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setFacultyToDelete(null);
  };

  const columns = [
    {
      key: 'username',
      header: 'Name',
      render: (faculty) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-medium text-sm">
              {faculty.username?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{faculty.username}</div>
            <div className="text-sm text-gray-500">{faculty.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'facultyId',
      header: 'Faculty ID',
      render: (faculty) => (
        <span className="text-sm font-mono text-gray-900">{faculty.facultyId}</span>
      )
    },
    {
      key: 'department',
      header: 'Department',
      render: (faculty) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {faculty.department}
        </span>
      )
    },
    {
      key: 'academicTitle',
      header: 'Academic Title',
      render: (faculty) => (
        <span className="text-sm text-gray-900">{faculty.academicTitle || 'N/A'}</span>
      )
    },
    {
      key: 'contactNumber',
      header: 'Contact Number',
      render: (faculty) => (
        <span className="text-sm text-gray-900">{faculty.contactNumber || 'N/A'}</span>
      )
    },
    {
      key: 'userId',
      header: 'User ID',
      render: (faculty) => (
        <span className="text-sm font-mono text-gray-600">{faculty.userId}</span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (faculty) => (
        <div className="flex items-center justify-center">
          <button 
            onClick={() => handleDeleteClick(faculty)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Faculty"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Faculty Management</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading faculty...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Faculty</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage faculty members and their information
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Faculty
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <SearchBar
          placeholder="Search faculty by username, email, or department..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">T</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Faculty</p>
              <p className="text-2xl font-semibold text-gray-900">{faculty.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-medium text-sm">A</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">{faculty.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-medium text-sm">D</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Departments</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(faculty.map(f => f.department)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-medium text-sm">R</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Recent Joins</p>
              <p className="text-2xl font-semibold text-gray-900">
                {faculty.filter(f => {
                  const joinDate = new Date(f.joinDate || f.createdAt);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return joinDate >= thirtyDaysAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DataTable
          data={filteredFaculty}
          columns={columns}
          emptyMessage="No faculty members found"
        />
      )}

      {/* Add Faculty Form */}
      <AddFacultyForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Faculty Member</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{facultyToDelete?.username}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyList;
