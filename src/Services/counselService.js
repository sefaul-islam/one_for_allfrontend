import { api } from "./authService";
import { jwtDecode } from "jwt-decode";

export const createReserveCounsel = async (facultyId, requestData) => {
  try {
    const response = await api.post(`/reserve-counsels/faculty/${facultyId}`, requestData);
    return {
      success: true,
      data: response.data,
      message: 'Reservation created successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create reservation',
    };
  }
};

export const getAllCounselById = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const decoded = jwtDecode(token);
    const facultyId = decoded.id;
    const response = await api.get(`/reserve-counsels/faculty/${facultyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch counsels',
    };
  }
};

export const getCounselStatsByFaculty = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const decoded = jwtDecode(token);
    const facultyId = decoded.id;
    const response = await api.get(`/reserve-counsels/faculty/${facultyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    // Status values are all uppercase: 'COMPLETED', 'PENDING', etc.
    const completedCount = Array.isArray(data) ? data.filter(c => c.status === 'COMPLETED').length : 0;
    const pendingCount = Array.isArray(data) ? data.filter(c => c.status === 'PENDING').length : 0;
    return {
      success: true,
      data,
      completedCount,
      pendingCount,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch counsel stats',
    };
  }
};

export const getCounselParticipants = async (counselId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await api.get(`/reserve-counsels/${counselId}/participants`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    // Map API response to desired structure
    const participants = Array.isArray(response.data)
      ? response.data.map(student => ({
          id: student.id,
          name: student.studentName,
          studentId: student.studentNumber,
          joiningTime: student.joinedAt,
        }))
      : [];
    return {
      success: true,
      data: participants,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch participants',
    };
  }
};

export const deleteReserveCounsel = async (counselId, facultyId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    await api.delete(`/reserve-counsels/${counselId}/faculty/${facultyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return {
      success: true,
      message: 'Session counsel deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete session counsel',
    };
  }
};

export const getStudentRegisteredCounsels = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const decoded = jwtDecode(token);
    const studentId = decoded.id;
    const response = await api.get(`/reserve-counsels/registered/student/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch registered counsels',
    };
  }
};

export const getAvailableCounsels = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await api.get('/reserve-counsels/all', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch available counsels',
    };
  }
};

export const joinCounselling = async (counselId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const decoded = jwtDecode(token);
    const studentId = decoded.id;
    const response = await api.post(`/reservecounselparticipant/${counselId}/register/${studentId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return {
      success: true,
      data: response.data,
      message: 'Successfully joined counselling session',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to join counselling session',
    };
  }
};

export const cancelCounselling = async (counselId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const decoded = jwtDecode(token);
    const studentId = decoded.id;
    await api.delete(`/reservecounselparticipant/cancelreg/${counselId}/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return {
      success: true,
      message: 'Successfully cancelled counselling session',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to cancel counselling session',
    };
  }
};

export const getStudentCounselStats = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const decoded = jwtDecode(token);
    const studentId = decoded.id;
    const response = await api.get(`/reserve-counsels/registered/student/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    const completed = Array.isArray(data) ? data.filter(c => c.status === 'COMPLETED').length : 0;
    const upcoming = Array.isArray(data) ? data.filter(c => c.status === 'PENDING').length : 0;
    const registered = Array.isArray(data) ? data.length : 0;
    return {
      success: true,
      stats: {
        registered,
        completed,
        upcoming,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch student counsel stats',
    };
  }
};