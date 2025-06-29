import React from 'react';
import { X, User, Mail, Phone, GraduationCap, Calendar, Building } from 'lucide-react';

const FacultyViewModal = ({ isOpen, faculty, onClose }) => {
  if (!isOpen || !faculty) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Faculty Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Faculty Info */}
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-2xl">
                  {faculty.username?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{faculty.username}</h3>
                <p className="text-gray-500">{faculty.facultyId}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h4>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{faculty.email || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{faculty.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Professional Information</h4>
                
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-gray-900">{faculty.department || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="text-gray-900">{faculty.position || 'Faculty Member'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Join Date</p>
                    <p className="text-gray-900">
                      {faculty.joinDate 
                        ? new Date(faculty.joinDate).toLocaleDateString() 
                        : 'Not available'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(faculty.specialization || faculty.qualifications) && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Additional Information</h4>
                <div className="grid grid-cols-1 gap-4">
                  {faculty.specialization && (
                    <div>
                      <p className="text-sm text-gray-500">Specialization</p>
                      <p className="text-gray-900">{faculty.specialization}</p>
                    </div>
                  )}
                  {faculty.qualifications && (
                    <div>
                      <p className="text-sm text-gray-500">Qualifications</p>
                      <p className="text-gray-900">{faculty.qualifications}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="mt-8 pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyViewModal;
