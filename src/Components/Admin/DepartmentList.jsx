import React, { useState, useEffect } from 'react';
import { Plus, Building, Users, ChevronRight } from 'lucide-react';
import SearchBar from './SearchBar';
import DepartmentFacultyView from './DepartmentFacultyView';
import adminService from '../../Services/adminService';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [departmentFacultyCounts, setDepartmentFacultyCounts] = useState({});
  const [loadingFacultyCounts, setLoadingFacultyCounts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [adding, setAdding] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDepartments(departments);
      return;
    }

    const filtered = departments.filter(dept =>
      dept.deptname?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDepartments(filtered);
  }, [departments, searchTerm]);

  const fetchDepartments = async () => {
    try {
      setLoadingFacultyCounts(true);
      const result = await adminService.getAllDepartments();
      if (result.success) {
        const depts = result.data || [];
        setDepartments(depts);
        
        // Fetch faculty count for each department
        const facultyCounts = {};
        await Promise.all(
          depts.map(async (dept) => {
            try {
              const facultyResult = await adminService.getFacultyByDepartment(dept.id);
              if (facultyResult.success) {
                facultyCounts[dept.id] = facultyResult.data?.length || 0;
              } else {
                facultyCounts[dept.id] = 0;
              }
            } catch {
              facultyCounts[dept.id] = 0;
            }
          })
        );
        setDepartmentFacultyCounts(facultyCounts);
      }
    } catch {
      // Silently handle error
    } finally {
      setLoading(false);
      setLoadingFacultyCounts(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) return;

    // Check if department already exists
    const exists = departments.some(dept => 
      dept.deptname.toLowerCase() === newDepartmentName.trim().toLowerCase()
    );

    if (exists) {
      alert('Department already exists!');
      return;
    }

    setAdding(true);
    try {
      const result = await adminService.addDepartment({
        deptname: newDepartmentName.trim()
      });

      if (result.success) {
        await fetchDepartments(); // Refresh the list with faculty counts
        setNewDepartmentName('');
        setShowAddForm(false);
      }
    } catch {
      // Silently handle error
    } finally {
      setAdding(false);
    }
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
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => viewDepartmentFaculty(department)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{department.deptname}</h3>
                  <p className="text-xs text-gray-500 font-mono">ID: {department.id}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {loadingFacultyCounts ? (
                        <span className="inline-flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400 mr-1"></div>
                          Loading...
                        </span>
                      ) : (
                        `${departmentFacultyCounts[department.id] || 0} Faculty`
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded-lg flex items-center justify-between transition-colors duration-200">
              <span className="text-sm font-medium">Click to View Faculty</span>
              <ChevronRight className="w-4 h-4" />
            </div>
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
    </div>
  );
};

export default DepartmentList;
