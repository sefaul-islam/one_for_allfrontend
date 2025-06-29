import { api } from "./authService";

const adminService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard stats',
        error: error.response?.data
      };
    }
  },

  // Get all faculty members
  getAllFaculty: async (search = '', page = 1, limit = 10) => {
    try {
      const response = await api.get(`/admin/faculty?search=${search}&page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch faculty members',
        error: error.response?.data
      };
    }
  },

  // Get all faculty members (without pagination)
  getAllFacultyMembers: async () => {
    try {
      const response = await api.get('/admin/allfaculties');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch faculty members',
        error: error.response?.data
      };
    }
  },

  // Get all students
  getAllStudents: async () => {
    try {
      const response = await api.get('/admin/allstudents');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch students',
        error: error.response?.data
      };
    }
  },

  // Get all sessions
  getAllSessions: async (search = '', page = 1, limit = 10) => {
    try {
      const response = await api.get(`/admin/sessions?search=${search}&page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch sessions',
        error: error.response?.data
      };
    }
  },

  // Get recent activities (newly added users/sessions)
  getRecentActivities: async (limit = 10) => {
    try {
      const response = await api.get(`/admin/recent-activities?limit=${limit}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch recent activities',
        error: error.response?.data
      };
    }
  },

  // Get admin profile
  getAdminProfile: async () => {
    try {
      const response = await api.get('/admin/profile');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch admin profile',
        error: error.response?.data
      };
    }
  },

  // Add new faculty member
  addFaculty: async (facultyData) => {
    try {
      const response = await api.post('/admin/createfaculty', facultyData);
      return {
        success: true,
        data: response.data,
        message: 'Faculty member added successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add faculty member',
        error: error.response?.data
      };
    }
  },

  // Add new student
  addStudent: async (studentData) => {
    try {
      const response = await api.post('/admin/createstudent', studentData);
      return {
        success: true,
        data: response.data,
        message: 'Student added successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add student',
        error: error.response?.data
      };
    }
  },

  // Update user status (activate/deactivate)
  updateUserStatus: async (userId, status) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, { status });
      return {
        success: true,
        data: response.data,
        message: 'User status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user status',
        error: error.response?.data
      };
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user',
        error: error.response?.data
      };
    }
  },

  // Delete student by ID
  deleteStudentById: async (studentId) => {
    try {
      await api.delete(`/admin/${studentId}/deletestudentbyid`);
      return {
        success: true,
        message: 'Student deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete student',
        error: error.response?.data
      };
    }
  },

  // Delete faculty by ID
  deleteFacultyById: async (facultyId) => {
    try {
      await api.delete(`/admin/${facultyId}/deletefaculty`);
      return {
        success: true,
        message: 'Faculty deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete faculty',
        error: error.response?.data
      };
    }
  },

  // Get all departments
  getAllDepartments: async () => {
    try {
      const response = await api.get('/department/departmentlist');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch departments',
        error: error.response?.data
      };
    }
  },

  // Add new department
  addDepartment: async (departmentData) => {
    try {
      const response = await api.post('/admin/departments', departmentData);
      return {
        success: true,
        data: response.data,
        message: 'Department added successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add department',
        error: error.response?.data
      };
    }
  },

  // Delete department
  deleteDepartment: async (departmentId) => {
    try {
      await api.delete(`/admin/departments/${departmentId}`);
      return {
        success: true,
        message: 'Department deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete department',
        error: error.response?.data
      };
    }
  },

  // Get faculty by department
  getFacultyByDepartment: async (departmentId) => {
    try {
      console.log('AdminService: Calling faculty endpoint for department ID:', departmentId);
      const response = await api.get(`/${departmentId}/faculties`);
      console.log('AdminService: Faculty API response:', response);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('AdminService: Faculty API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch department faculty',
        error: error.response?.data
      };
    }
  },

  // Get single student by ID
  getStudentById: async (studentId) => {
    try {
      const response = await api.get(`/admin/students/${studentId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student details',
        error: error.response?.data
      };
    }
  },

  // Update student information
  updateStudent: async (studentId, studentData) => {
    try {
      const response = await api.put(`/admin/students/${studentId}`, studentData);
      return {
        success: true,
        data: response.data,
        message: 'Student updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update student',
        error: error.response?.data
      };
    }
  },

  // Get students by course
  getStudentsByCourse: async (course) => {
    try {
      const response = await api.get(`/admin/students/course/${course}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch students by course',
        error: error.response?.data
      };
    }
  },

  // Get students by year
  getStudentsByYear: async (year) => {
    try {
      const response = await api.get(`/admin/students/year/${year}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch students by year',
        error: error.response?.data
      };
    }
  },

  // Get student statistics
  getStudentStats: async () => {
    try {
      const response = await api.get('/admin/students/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student statistics',
        error: error.response?.data
      };
    }
  }
};

export default adminService;