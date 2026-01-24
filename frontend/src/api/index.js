import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const fetchRooms = () => API.get('/rooms');
export const fetchRoom = (id) => API.get(`/rooms/${id}`);
export const createBooking = (bookingData) => API.post('/bookings', bookingData);

export default API;
