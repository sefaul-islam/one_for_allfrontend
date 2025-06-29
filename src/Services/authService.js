// authService.js
import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = 'http://localhost:8080'; // Replace with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication service object
const authService = {
  // Login function
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      // Assuming your backend returns { token, user } in response.data
      const token = response.data;
      localStorage.setItem('token', token);
      
      return {
        success: true,
        data: token,
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        error: error.response?.data
      };
    }
  },

 
  
};


export { api };


export default authService;