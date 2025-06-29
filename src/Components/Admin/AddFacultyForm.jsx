import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import adminService from '../../Services/adminService';

const AddFacultyForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'FACULTY',
    department: '',
    academicTitle: '',
    contactNumber: ''
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Academic titles list
  const academicTitles = [
    'Lecturer',
    'Assistant Professor', 
    'Associate Professor',
    'Professor',
    'Senior Lecturer',
    'Principal Lecturer',
    'Visiting Professor',
    'Emeritus Professor',
    'Research Professor',
    'Clinical Professor',
    'Adjunct Professor',
    'Professor of Practice'
  ];

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const result = await adminService.getAllDepartments();
        if (result.success) {
          setDepartments(result.data || []);
        } else {
          // Fallback to hardcoded departments if API fails
          setDepartments([
            { id: 1, deptname: 'Computer Science' },
            { id: 2, deptname: 'Electrical Engineering' },
            { id: 3, deptname: 'Business Studies' },
            { id: 4, deptname: 'Civil Engineering' },
            { id: 5, deptname: 'English' }
          ]);
        }
      } catch {
        // Fallback to hardcoded departments
        setDepartments([
          { id: 1, deptname: 'Computer Science' },
          { id: 2, deptname: 'Electrical Engineering' },
          { id: 3, deptname: 'Business Studies' },
          { id: 4, deptname: 'Civil Engineering' },
          { id: 5, deptname: 'English' }
        ]);
      }
    };

    if (isOpen) {
      fetchDepartments();
      // Reset form when opened
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'FACULTY',
        department: '',
        academicTitle: '',
        contactNumber: ''
      });
      setError('');
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.department) {
      setError('Department is required');
      return;
    }

    if (!formData.academicTitle) {
      setError('Academic title is required');
      return;
    }

    if (!formData.contactNumber) {
      setError('Contact number is required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const result = await adminService.addFaculty({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department,
        academicTitle: formData.academicTitle,
        contactNumber: formData.contactNumber
      });

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.message || 'Failed to add faculty member');
      }
    } catch {
      setError('An error occurred while adding faculty member');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Add New Faculty</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Title *
                </label>
                <select
                  name="academicTitle"
                  value={formData.academicTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Academic Title</option>
                  {academicTitles.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 09123456789"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.deptname}>
                    {dept.deptname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
              >
                {loading ? 'Adding...' : 'Add Faculty'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFacultyForm;
