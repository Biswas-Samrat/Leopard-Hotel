import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/admin/auth/login', credentials),
    getProfile: () => api.get('/admin/auth/me'),
    updatePassword: (data) => api.put('/admin/auth/password', data)
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/admin/dashboard/stats'),
    getRevenue: () => api.get('/admin/dashboard/revenue')
};

// Rooms API
export const roomsAPI = {
    getAll: () => api.get('/admin/rooms'),
    getBooked: () => api.get('/admin/rooms/booked'),
    getOne: (id) => api.get(`/admin/rooms/${id}`),
    create: (data) => api.post('/admin/rooms', data),
    update: (id, data) => api.put(`/admin/rooms/${id}`, data),
    delete: (id) => api.delete(`/admin/rooms/${id}`)
};

// Bookings API
export const bookingsAPI = {
    getAll: (params) => api.get('/admin/bookings', { params }),
    getOne: (id) => api.get(`/admin/bookings/${id}`),
    updateStatus: (id, status) => api.put(`/admin/bookings/${id}/status`, { status }),
    delete: (id) => api.delete(`/admin/bookings/${id}`)
};

// Guests API
export const guestsAPI = {
    getAll: (params) => api.get('/admin/guests', { params }),
    getOne: (id) => api.get(`/admin/guests/${id}`),
    update: (id, data) => api.put(`/admin/guests/${id}`, data),
    delete: (id) => api.delete(`/admin/guests/${id}`)
};

// Upload API
export const uploadAPI = {
    uploadRoomImage: (roomId, formData) => api.post(`/admin/upload/room/${roomId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    uploadGeneral: (formData) => api.post('/admin/upload/general', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    deleteRoomImage: (roomId, publicId) => api.delete(`/admin/upload/room/${roomId}/image`, { data: { publicId } }),
    getRoomImages: (roomId) => api.get(`/admin/upload/room/${roomId}/images`)
};

// Hospitality API
export const hospitalityAPI = {
    getRestaurantBookings: () => api.get('/admin/hospitality/restaurant'),
    updateRestaurantBookingStatus: (id, status) => api.put(`/admin/hospitality/restaurant/${id}/status`, { status }),
    deleteRestaurantBooking: (id) => api.delete(`/admin/hospitality/restaurant/${id}`),
    getPubBookings: () => api.get('/admin/hospitality/pub'),
    updatePubBookingStatus: (id, status) => api.put(`/admin/hospitality/pub/${id}/status`, { status }),
    deletePubBooking: (id) => api.delete(`/admin/hospitality/pub/${id}`),
    getFunctionBookings: () => api.get('/admin/hospitality/function'),
    updateFunctionBookingStatus: (id, status) => api.put(`/admin/hospitality/function/${id}/status`, { status }),
    deleteFunctionBooking: (id) => api.delete(`/admin/hospitality/function/${id}`),
};

// Connection API
export const connectionAPI = {
    getMessages: () => api.get('/admin/connection'),
    deleteMessage: (id) => api.delete(`/admin/connection/${id}`),
};

// Settings API
export const settingsAPI = {
    get: (key) => api.get(`/admin/settings/${key}`),
    update: (key, value) => api.put(`/admin/settings/${key}`, { value })
};

export default api;
