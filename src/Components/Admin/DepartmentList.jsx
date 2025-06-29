import React, { useState, useEffect } from 'react';
import { Plus, Building, Users, Trash2, ChevronRight } from 'lucide-react';
import SearchBar from './SearchBar';
import DepartmentFacultyView from './DepartmentFacultyView';
import adminService from '../../Services/adminService';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [adding, setAdding] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDepartments(departments);
      return;
    }

    const filtered = departments.filter(dept =>
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDepartments(filtered);
  }, [departments, searchTerm]);

  const fetchDepartments = async () => {
    try {
      const result = await adminService.getAllDepartments();
      if (result.success) {
        setDepartments(result.data || []);
      }
    } catch {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) return;

    // Check if department already exists
    const exists = departments.some(dept => 
      dept.name.toLowerCase() === newDepartmentName.trim().toLowerCase()
    );

    if (exists) {
      alert('Department already exists!');
      return;
    }

    setAdding(true);
    try {
      const result = await adminService.addDepartment({
        name: newDepartmentName.trim()
      });

      if (result.success) {
        await fetchDepartments(); // Refresh the list
        setNewDepartmentName('');
        setShowAddForm(false);
      }
    } catch {
      // Silently handle error
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!departmentToDelete) return;

    setDeleting(true);
    try {
      const result = await adminService.deleteDepartment(departmentToDelete.id);
      if (result.success) {
        await fetchDepartments(); // Refresh the list
        setShowDeleteModal(false);
        setDepartmentToDelete(null);
      }
    } catch {
      // Silently handle error
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (department) => {
    setDepartmentToDelete(department);
    setShowDeleteModal(true);
  };

  const viewDepartmentFaculty = (department) => {
    setSelectedDepartment(department);
  };

  if (selectedDepartment) {
    return (
      <DepartmentFacultyView
        department={selectedDepartment}
        onBack={() => setSelectedDepartment(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="w-7 h-7 text-blue-600" />
            Departments
          </h1>
          <p className="text-gray-600 mt-1">Manage academic departments</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Search */}
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search departments..."
      />

      {/* Departments Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDepartments.map((department) => (
          <div
            key={department.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{department.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Users className="w-4 h-4" />
                    <span>{department.facultyCount || 0} Faculty</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openDeleteModal(department)}
                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors duration-200"
                title="Delete Department"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => viewDepartmentFaculty(department)}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded-lg flex items-center justify-between transition-colors duration-200"
            >
              <span className="text-sm font-medium">View Faculty</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {filteredDepartments.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first department.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Department
            </button>
          )}
        </div>
      )}

      {/* Add Department Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Department</h2>
            <form onSubmit={handleAddDepartment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter department name"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewDepartmentName('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding || !newDepartmentName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
                >
                  {adding ? 'Adding...' : 'Add Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Department</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{departmentToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDepartmentToDelete(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDepartment}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors duration-200"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
