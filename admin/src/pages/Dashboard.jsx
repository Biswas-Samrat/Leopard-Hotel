import { useState, useEffect } from 'react';
import { dashboardAPI } from '../utils/api';
import { Bed, Calendar, Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await dashboardAPI.getStats();
            if (response.data.success) {
                setStats(response.data.stats);
                setRecentBookings(response.data.recentBookings || []);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    const statCards = [
        {
            title: 'Total Rooms',
            value: stats?.totalRooms || 0,
            icon: Bed,
            color: '#3b82f6',
            bgColor: '#dbeafe'
        },
        {
            title: 'Total Bookings',
            value: stats?.totalBookings || 0,
            icon: Calendar,
            color: '#10b981',
            bgColor: '#d1fae5'
        },
        {
            title: 'Total Guests',
            value: stats?.totalGuests || 0,
            icon: Users,
            color: '#f59e0b',
            bgColor: '#fef3c7'
        }
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-stats">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: card.bgColor }}>
                                <Icon size={24} color={card.color} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-title">{card.title}</p>
                                <h3 className="stat-value">{card.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card occupancy-card">
                    <div className="card-header">
                        <h3>Occupancy Rate</h3>
                        <TrendingUp size={20} color="var(--primary)" />
                    </div>
                    <div className="occupancy-chart">
                        <div className="occupancy-circle">
                            <svg viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="var(--primary)"
                                    strokeWidth="8"
                                    strokeDasharray={`${(Number(stats?.occupancyRate) || 0) * 2.51} 251`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <div className="occupancy-text">
                                <span className="occupancy-value">{(Number(stats?.occupancyRate) || 0).toFixed(1)}%</span>
                                <span className="occupancy-label">Occupied</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card recent-bookings-card">
                    <div className="card-header">
                        <h3>Recent Bookings</h3>
                        <Clock size={20} color="var(--primary)" />
                    </div>
                    <div className="recent-bookings">
                        {recentBookings.length > 0 ? (
                            recentBookings.map((booking) => (
                                <div key={booking.id} className="booking-item">
                                    <div className="booking-info">
                                        <p className="booking-guest">{booking.guest_name || 'Guest'}</p>
                                        <p className="booking-room">Room {booking.room_number}</p>
                                    </div>
                                    <span className={`badge badge-${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="no-data">No recent bookings</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="dashboard-card quick-actions-card">
                <div className="card-header">
                    <h3>Quick Actions</h3>
                </div>
                <div className="quick-actions">
                    <button className="action-btn" onClick={() => window.location.href = '/rooms'}>
                        <Bed size={20} />
                        <span>Manage Rooms</span>
                    </button>
                    <button className="action-btn" onClick={() => window.location.href = '/bookings'}>
                        <Calendar size={20} />
                        <span>View Bookings</span>
                    </button>
                    <button className="action-btn" onClick={() => window.location.href = '/guests'}>
                        <Users size={20} />
                        <span>Manage Guests</span>
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
