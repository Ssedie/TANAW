import axios from 'axios';
import { API_URL } from './config/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Success - just return the response
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          console.error('Unauthorized:', data.message);
          localStorage.removeItem('auth');
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden - redirect to unauthorized page
          console.error('Forbidden:', data.message);
          window.location.href = '/unauthorized';
          break;
          
        case 404:
          // Not found
          console.error('Not found:', data.message);
          break;
          
        case 500:
          // Server error
          console.error('Server error:', data.message);
          alert('An unexpected error occurred. Please try again later.');
          break;
          
        default:
          console.error('Error:', data.message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server');
      alert('Unable to connect to server. Please check your connection.');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;