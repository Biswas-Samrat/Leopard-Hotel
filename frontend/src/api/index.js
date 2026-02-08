import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const fetchRooms = () => API.get('/rooms');
export const fetchRoom = (id) => API.get(`/rooms/${id}`);
export const fetchSettings = (key) => API.get(`/admin/settings/${key}`);
export const createBooking = (bookingData) => API.post('/bookings', bookingData);
export const createRestaurantBooking = (data) => API.post('/hospitality/restaurant', data);
export const createPubBooking = (data) => API.post('/hospitality/pub', data);
export const createFunctionEnquiry = (data) => API.post('/hospitality/function', data);
export const createContactMessage = (data) => API.post('/contact', data);
export const fetchGalleryPhotos = (category) => API.get(`/gallery/${category}`);

export default API;
