import axios from 'axios';

const API_BASE_URL = 'https://hotel-booking-zeta-wine.vercel.app/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (userData) => api.post('/users/register', userData),
    login: (credentials) => api.post('/users/login', credentials),
};

// User Profile APIs
export const userAPI = {
    getProfile: () => api.get('/users/profile/me'),
    updateProfile: (data) => api.put('/users/profile/update', data),
};

// Room APIs
export const roomAPI = {
    getAllRooms: () => api.get('/rooms'),
    searchRooms: (filters) => api.post('/rooms/search', filters),
    getRoomById: (id) => api.get(`/rooms/${id}`),
    createRoom: (roomData) => api.post('/rooms', roomData),
    getMyRooms: () => api.get('/rooms/owner/my-rooms'),
    updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
    deleteRoom: (id) => api.delete(`/rooms/${id}`),
};

// Booking APIs
export const bookingAPI = {
    checkAvailability: (data) => api.post('/bookings/check-availability', data),
    createBooking: (bookingData) => api.post('/bookings/create', bookingData),
    getUserBookings: () => api.get('/bookings/user'),
    getOwnerBookings: () => api.get('/bookings/owner'),
    cancelBooking: (id) => api.post(`/bookings/cancel/${id}`),
    ownerCancelBooking: (id) => api.post(`/bookings/owner/cancel/${id}`),
    makePayment: (id) => api.post(`/bookings/payment/${id}`),
    markAsPaid: (id) => api.post(`/bookings/owner/payment/${id}`),
    searchAvailableRooms: (params) => api.get('/bookings/search', { params }),
};

// Upload APIs
export const uploadAPI = {
    uploadImage: (formData) => api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

export default api;
