import { useState, useEffect } from 'react';
import { roomsAPI } from '../utils/api';
import { Search, Loader2, CheckCircle, User, Calendar, Eye, X, Mail, Phone, MessageSquare, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import './Rooms.css';

export default function BookedRooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [confirmAvailableId, setConfirmAvailableId] = useState(null);

    useEffect(() => {
        fetchBookedRooms();
    }, []);

    const fetchBookedRooms = async () => {
        setLoading(true);
        try {
            const response = await roomsAPI.getBooked();
            if (response.data.success) {
                setRooms(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching booked rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMakeAvailable = (id) => {
        setConfirmAvailableId(id);
    };

    const confirmMakeAvailable = async () => {
        if (!confirmAvailableId) return;

        const id = confirmAvailableId;
        setConfirmAvailableId(null);
        setUpdatingId(id);

        try {
            await roomsAPI.update(id, { status: 'available' });
            toast.success('Room marked as available');
            // Remove from list or refresh
            setRooms(prev => prev.filter(room => room.id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating room status');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredRooms = rooms.filter(room =>
        room.room_number.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room.guest_name && room.guest_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="rooms-page">
            <div className="page-header">
                <div className="header-text">
                    <h2>Booked Rooms</h2>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage rooms that are currently booked or occupied</p>
                </div>
            </div>

            <div className="search-filter-bar">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by room number or guest name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
                    <Loader2 className="animate-spin" style={{ color: 'var(--primary)' }} size={40} />
                </div>
            ) : (
                <div className="booked-rooms-content">
                    {filteredRooms.length === 0 ? (
                        <div style={{ background: 'white', borderRadius: '0.5rem', padding: '5rem 0', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
                            <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
                            <p style={{ fontSize: '1.25rem', color: '#64748b' }}>No rooms are currently booked</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Room</th>
                                        <th>Type</th>
                                        <th>Guest Detail</th>
                                        <th>Period</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRooms.map((room) => (
                                        <tr key={room.id}>
                                            <td data-label="Room">
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>Room {room.room_number}</span>
                                                </div>
                                            </td>
                                            <td data-label="Type">{room.room_type}</td>
                                            <td data-label="Guest Detail">
                                                {room.guest_name ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '500' }}>
                                                            <User size={14} /> {room.guest_name}
                                                        </span>
                                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                            {room.num_guests} {room.num_guests === 1 ? 'Guest' : 'Guests'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: '300' }}>Details unavailable</span>
                                                )}
                                            </td>
                                            <td data-label="Period">
                                                {room.check_in ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.875rem' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                            <Calendar size={14} style={{ color: 'var(--primary)' }} />
                                                            {new Date(room.check_in).toLocaleDateString()} - {new Date(room.check_out).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#94a3b8' }}>N/A</span>
                                                )}
                                            </td>
                                            <td data-label="Status">
                                                <span className="badge badge-warning">Booked</span>
                                            </td>
                                            <td data-label="Action" style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                                    onClick={() => setSelectedBooking(room)}
                                                >
                                                    <Eye size={14} /> View Details
                                                </button>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                                    onClick={() => handleMakeAvailable(room.id)}
                                                    disabled={updatingId === room.id}
                                                >
                                                    {updatingId === room.id ? <Loader2 size={16} className="animate-spin" /> : 'Mark Available'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
            {/* Details Modal */}
            {selectedBooking && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }} onClick={() => setSelectedBooking(null)}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        width: '100%',
                        maxWidth: '500px',
                        padding: '2rem',
                        boxShadow: 'var(--shadow-lg)',
                        position: 'relative'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedBooking(null)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                color: '#64748b'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                            Booking Details - Room {selectedBooking.room_number}
                        </h3>

                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>Guest Name</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                    <User size={16} color="var(--primary)" />
                                    <span style={{ fontWeight: 500 }}>{selectedBooking.guest_name}</span>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>Email</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <Mail size={16} color="var(--primary)" />
                                        <span style={{ fontSize: '0.875rem' }}>{selectedBooking.guest_email || 'N/A'}</span>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>Phone</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <Phone size={16} color="var(--primary)" />
                                        <span style={{ fontSize: '0.875rem' }}>{selectedBooking.guest_phone || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>Check In</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <Calendar size={16} color="var(--primary)" />
                                        <span>{new Date(selectedBooking.check_in).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>Check Out</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <Calendar size={16} color="var(--primary)" />
                                        <span>{new Date(selectedBooking.check_out).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>Number of Guests</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                    <Users size={16} color="var(--primary)" />
                                    <span>{selectedBooking.num_guests} Guests</span>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>Special Requests</label>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.25rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.25rem', minHeight: '60px' }}>
                                    <MessageSquare size={16} color="var(--primary)" style={{ marginTop: '0.125rem' }} />
                                    <span style={{ fontSize: '0.875rem', color: selectedBooking.special_requests ? '#1e293b' : '#94a3b8' }}>
                                        {selectedBooking.special_requests || 'No special requests'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedBooking(null)}
                            style={{
                                width: '100%',
                                marginTop: '2rem',
                                padding: '0.75rem',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Mark Available Confirmation Dialog */}
            {confirmAvailableId && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }} onClick={() => setConfirmAvailableId(null)}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        width: '100%',
                        maxWidth: '400px',
                        padding: '2rem',
                        boxShadow: 'var(--shadow-lg)',
                        position: 'relative',
                        textAlign: 'center'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setConfirmAvailableId(null)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                color: '#64748b'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{
                            backgroundColor: '#fef3c7',
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: '#d97706'
                        }}>
                            <CheckCircle size={24} />
                        </div>

                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>
                            Do you want mark the room as abaleable?
                        </h3>
                        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.875rem' }}>
                            Please ensure the guest has checked out before making the room available.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                            <button
                                onClick={() => setConfirmAvailableId(null)}
                                style={{
                                    padding: '0.75rem',
                                    backgroundColor: '#f1f5f9',
                                    color: '#1e293b',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                No
                            </button>
                            <button
                                onClick={confirmMakeAvailable}
                                style={{
                                    padding: '0.75rem',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
