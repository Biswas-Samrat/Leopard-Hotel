import { useState, useEffect } from 'react';
import { bookingsAPI } from '../utils/api';
import { Search, Filter, Trash2 } from 'lucide-react';
import '../pages/Rooms.css';

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchBookings();
    }, [statusFilter]);

    const fetchBookings = async () => {
        try {
            const params = statusFilter ? { status: statusFilter } : {};
            const response = await bookingsAPI.getAll(params);
            if (response.data.success) {
                setBookings(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await bookingsAPI.updateStatus(id, newStatus);
            fetchBookings();
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating status');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;

        try {
            await bookingsAPI.delete(id);
            fetchBookings();
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting booking');
        }
    };

    const filteredBookings = bookings.filter(booking =>
    (booking.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.room_number?.toString().includes(searchTerm))
    );

    return (
        <div className="bookings-page">
            <div className="page-header">
                <h2>Bookings Management</h2>
            </div>

            <div className="filters">
                <div className="search-bar" style={{ flex: 2 }}>
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by guest name or room number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <select
                        className="input"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="checked-in">Checked In</option>
                        <option value="checked-out">Checked Out</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading bookings...</div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Guest</th>
                                <th>Room</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Guests</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.guest_name || 'N/A'}</td>
                                    <td>Room {booking.room_number}</td>
                                    <td>{new Date(booking.check_in).toLocaleDateString()}</td>
                                    <td>{new Date(booking.check_out).toLocaleDateString()}</td>
                                    <td>{booking.num_guests}</td>
                                    <td>
                                        <select
                                            className={`badge badge-${getStatusColor(booking.status)}`}
                                            style={{ border: 'none', cursor: 'pointer' }}
                                            value={booking.status}
                                            onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="checked-in">Checked In</option>
                                            <option value="checked-out">Checked Out</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className="btn-icon danger" onClick={() => handleDelete(booking.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredBookings.length === 0 && (
                        <p className="no-data">No bookings found</p>
                    )}
                </div>
            )}
        </div>
    );
}

function getStatusColor(status) {
    const colors = {
        pending: 'warning',
        confirmed: 'success',
        'checked-in': 'info',
        'checked-out': 'info',
        cancelled: 'danger'
    };
    return colors[status] || 'info';
}
