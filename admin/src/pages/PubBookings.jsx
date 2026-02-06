import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { hospitalityAPI } from '../utils/api';
import { Calendar, Clock, Users, Mail, Phone, MessageSquare, CheckCircle, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './RestaurantBookings.css';

export default function PubBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const isHistory = location.pathname.includes('/history');

    useEffect(() => {
        fetchBookings();
    }, [location.pathname]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await hospitalityAPI.getPubBookings();
            if (response.data && response.data.success) {
                setBookings(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching pub bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (bookingId) => {
        if (!bookingId) return;

        try {
            // Optimistic update
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: 'completed' } : b
            ));

            const response = await hospitalityAPI.updatePubBookingStatus(bookingId, 'completed');

            if (response.data && response.data.success) {
                toast.success('Moved to Booking History');
                fetchBookings();
            } else {
                toast.error('Failed to update, reverting...');
                fetchBookings();
            }
        } catch (error) {
            console.error('Update error:', error);
            fetchBookings();
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (bookingId) => {
        if (!bookingId) return;

        try {
            // Optimistic update
            setBookings(prev => prev.filter(b => b.id !== bookingId));

            const response = await hospitalityAPI.deletePubBooking(bookingId);

            if (response.data && response.data.success) {
                toast.success('Record deleted');
            } else {
                toast.error('Failed to delete');
                fetchBookings(); // Revert
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete record');
            fetchBookings(); // Revert
        }
    };

    const displayedBookings = bookings.filter(b =>
        isHistory ? b.status === 'completed' : b.status !== 'completed'
    );

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading bookings...</div>;
    }

    return (
        <div className="bookings-container">
            <div className="bookings-header">
                <h1 className="bookings-title">
                    {isHistory ? 'Pub Booking History' : 'Active Pub Bookings'}
                </h1>
            </div>

            <div className="table-card">
                <div className="overflow-x-auto">
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th className="col-guest">Guest Info</th>
                                <th className="col-date">Date & Time</th>
                                <th className="col-guests">Guests</th>
                                <th>Special Requests</th>
                                {isHistory && <th className="col-status">Actions</th>}
                                {!isHistory && <th className="col-status">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {displayedBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>
                                        <div className="guest-wrapper">
                                            <div className="user-avatar bg-amber-100 text-amber-700">
                                                {booking.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <div className="guest-name">{booking.name}</div>
                                                <div className="guest-contact">
                                                    <Mail size={14} /> {booking.email}
                                                </div>
                                                {booking.phone && (
                                                    <div className="guest-contact">
                                                        <Phone size={14} /> {booking.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="date-wrapper">
                                            <div className="date-item">
                                                <Calendar size={16} className="text-accent-gold" />
                                                {new Date(booking.date).toLocaleDateString('en-NZ', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="time-item">
                                                <Clock size={16} />
                                                {booking.time}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="date-item">
                                            <Users size={16} color="#94a3b8" />
                                            <span>{booking.guests}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {booking.special_requests ? (
                                            <div className="guest-contact" style={{ marginTop: 0 }}>
                                                <MessageSquare size={14} style={{ minWidth: '14px' }} />
                                                <span className="truncate max-w-xs" title={booking.special_requests}>
                                                    {booking.special_requests}
                                                </span>
                                            </div>
                                        ) : (
                                            <span style={{ color: '#cbd5e1', fontStyle: 'italic', fontSize: '0.85rem' }}>None</span>
                                        )}
                                    </td>

                                    {isHistory && (
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <span className="status-badge bg-green-100 text-green-700">
                                                    Completed
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(booking.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white rounded-lg transition-colors shadow-sm"
                                                    style={{ backgroundColor: '#dc2626', color: 'white', border: 'none' }}
                                                    title="Delete Record"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    )}

                                    {!isHistory && (
                                        <td>
                                            <button
                                                onClick={() => handleComplete(booking.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm"
                                                title="Mark as completed"
                                            >
                                                <CheckCircle size={14} />
                                                Complete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {displayedBookings.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="empty-state">
                                        No {isHistory ? 'completed' : 'active'} bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
