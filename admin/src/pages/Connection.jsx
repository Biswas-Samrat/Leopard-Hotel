import { useState, useEffect } from 'react';
import { connectionAPI } from '../utils/api';
import { Calendar, Mail, MessageSquare, Trash2, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './RestaurantBookings.css'; // Reuse table styles

export default function Connection() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await connectionAPI.getMessages();
            if (response.data && response.data.success) {
                setMessages(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            // Optimistic update
            setMessages(prev => prev.filter(m => m.id !== id));
            const response = await connectionAPI.deleteMessage(id);

            if (response.data && response.data.success) {
                toast.success('Message deleted');
            } else {
                toast.error('Failed to delete');
                fetchMessages(); // Revert
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete message');
            fetchMessages(); // Revert
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading messages...</div>;
    }

    return (
        <div className="bookings-container">
            <div className="bookings-header">
                <h1 className="bookings-title">Connection Requests</h1>
                <p className="bookings-subtitle">Manage contact form submissions</p>
            </div>

            <div className="table-card">
                <div className="overflow-x-auto">
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>Sender Info</th>
                                <th style={{ width: '20%' }}>Date</th>
                                <th style={{ width: '45%' }}>Message</th>
                                <th style={{ width: '10%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((msg) => (
                                <tr key={msg.id}>
                                    <td data-label="Sender Info">
                                        <div className="guest-wrapper">
                                            <div className="user-avatar bg-gray-100 text-gray-600">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <div className="guest-name">{msg.name}</div>
                                                <div className="guest-contact">
                                                    <Mail size={14} /> {msg.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="Date">
                                        <div className="date-wrapper">
                                            <div className="date-item">
                                                <Calendar size={16} className="text-accent-gold" />
                                                {new Date(msg.created_at).toLocaleDateString('en-NZ', {
                                                    month: 'short', day: 'numeric', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="Message">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium text-gray-800">
                                                {msg.subject || '(No Subject)'}
                                            </div>
                                            <div className="text-sm text-gray-600 whitespace-pre-wrap">
                                                {msg.message}
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="Actions">
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-colors shadow-sm"
                                            style={{ backgroundColor: '#dc2626', color: 'white', border: 'none' }}
                                            title="Delete Message"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {messages.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="empty-state">
                                        No messages found.
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
