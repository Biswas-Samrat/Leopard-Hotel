import { useState, useEffect } from 'react';
import { guestsAPI } from '../utils/api';
import { Search, Edit, Trash2, Eye } from 'lucide-react';
import '../pages/Rooms.css';

import toast from 'react-hot-toast';

export default function Guests() {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchGuests();
    }, []);

    const fetchGuests = async () => {
        try {
            const params = searchTerm ? { search: searchTerm } : {};
            const response = await guestsAPI.getAll(params);
            if (response.data.success) {
                setGuests(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching guests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this guest?')) return;

        try {
            await guestsAPI.delete(id);
            fetchGuests();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting guest');
        }
    };

    const viewGuestDetails = async (id) => {
        try {
            const response = await guestsAPI.getOne(id);
            if (response.data.success) {
                setSelectedGuest(response.data.data);
                setShowDetailModal(true);
            }
        } catch (error) {
            toast.error('Error loading guest details');
        }
    };

    return (
        <div className="guests-page">
            <div className="page-header">
                <h2>Guests Management</h2>
            </div>

            <div className="search-bar">
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Search guests by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && fetchGuests()}
                />
                <button className="btn btn-primary" onClick={fetchGuests}>Search</button>
            </div>

            {loading ? (
                <div className="loading">Loading guests...</div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map((guest) => (
                                <tr key={guest.id}>
                                    <td>{guest.name}</td>
                                    <td>{guest.email}</td>
                                    <td>{guest.phone || 'N/A'}</td>
                                    <td>{new Date(guest.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon" onClick={() => viewGuestDetails(guest.id)}>
                                                <Eye size={16} />
                                            </button>
                                            <button className="btn-icon danger" onClick={() => handleDelete(guest.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {guests.length === 0 && (
                        <p className="no-data">No guests found</p>
                    )}
                </div>
            )}

            {showDetailModal && selectedGuest && (
                <GuestDetailModal
                    guest={selectedGuest}
                    onClose={() => setShowDetailModal(false)}
                />
            )}
        </div>
    );
}

function GuestDetailModal({ guest, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Guest Details</h3>
                <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <div className="detail-row">
                        <strong>Name:</strong>
                        <span>{guest.name}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Email:</strong>
                        <span>{guest.email}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Phone:</strong>
                        <span>{guest.phone || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Address:</strong>
                        <span>{guest.address || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                        <strong>ID Proof:</strong>
                        <span>{guest.id_proof || 'N/A'}</span>
                    </div>

                    {guest.bookings && guest.bookings.length > 0 && (
                        <>
                            <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Booking History</h4>
                            <div className="booking-history">
                                {guest.bookings.map((booking) => (
                                    <div key={booking.id} className="booking-item">
                                        <div>
                                            <strong>Room {booking.room_number}</strong>
                                            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0' }}>
                                                {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`badge badge-${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <button className="btn btn-outline" onClick={onClose} style={{ width: '100%', marginTop: '1.5rem' }}>
                        Close
                    </button>
                </div>
            </div>
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
