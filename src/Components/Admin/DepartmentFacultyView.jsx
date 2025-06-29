import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Users, Mail, User } from 'lucide-react';
import SearchBar from './SearchBar';
import adminService from '../../Services/adminService';

const DepartmentFacultyView = ({ department, onBack }) => {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDepartmentFaculty();
  }, [fetchDepartmentFaculty]);

  useEffect(() => {
    filterFaculty();
  }, [faculty, searchTerm, filterFaculty]);

  const fetchDepartmentFaculty = useCallback(async () => {
    try {
      const result = await adminService.getFacultyByDepartment(department.id);
      if (result.success) {
        setFaculty(result.data || []);
      }
    } catch {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  }, [department.id]);

  const filterFaculty = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredFaculty(faculty);
      return;
    }

    const filtered = faculty.filter(f =>
      f.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFaculty(filtered);
  }, [faculty, searchTerm]);

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
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            {department.name} Faculty
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredFaculty.length} faculty member{filteredFaculty.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search faculty members..."
      />

      {/* Faculty Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFaculty.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {member.username}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFaculty.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No faculty found' : 'No faculty members'}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search terms.'
              : `No faculty members are currently assigned to ${department.name}.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default DepartmentFacultyView;
