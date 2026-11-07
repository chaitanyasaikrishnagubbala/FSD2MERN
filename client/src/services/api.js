import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor: automatically inject JWT token if user is authenticated
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('driveease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: standardizes error messages and handles session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired credentials if unauthorized
      const currentToken = localStorage.getItem('driveease_token');
      if (currentToken) {
        localStorage.removeItem('driveease_token');
        localStorage.removeItem('driveease_user');
        // Optional: trigger custom event or redirect if on protected page
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

// Modular API services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData)
};

export const vehicleService = {
  getVehicles: (params) => api.get('/vehicles', { params }),
  getVehicleById: (id) => api.get(`/vehicles/${id}`),
  checkAvailability: (id, pickupDate, returnDate) =>
    api.get(`/vehicles/${id}/availability`, { params: { pickupDate, returnDate } }),
  createVehicle: (vehicleData) => api.post('/vehicles', vehicleData),
  updateVehicle: (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData),
  deleteVehicle: (id) => api.delete(`/vehicles/${id}`)
};

export const bookingService = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason })
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllBookings: (params) => api.get('/admin/bookings', { params }),
  updateBookingStatus: (id, status, reason) =>
    api.patch(`/admin/bookings/${id}/status`, { status, reason }),
  getAllUsers: () => api.get('/admin/users')
};

export default api;
