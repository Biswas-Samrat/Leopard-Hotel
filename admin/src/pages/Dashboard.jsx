import { useState, useEffect } from 'react';
import { dashboardAPI, hospitalityAPI } from '../utils/api';
import { useAdmin } from '../context/AdminContext';
import { Bed, Calendar, Users, TrendingUp, Utensils, Beer, Clock } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
    const { activeSection } = useAdmin();
    const [stats, setStats] = useState(null);
    const [hospitalityStats, setHospitalityStats] = useState({ count: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (activeSection === 'hotel') {
            fetchHotelStats();
        } else {
            fetchHospitalityStats(activeSection);
        }
    }, [activeSection]);

    const fetchHotelStats = async () => {
        try {
            const response = await dashboardAPI.getStats();
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching hotel stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHospitalityStats = async (section) => {
        try {
            let response;
            if (section === 'restaurant') response = await hospitalityAPI.getRestaurantBookings();
            else if (section === 'pub') response = await hospitalityAPI.getPubBookings();
            else if (section === 'function') response = await hospitalityAPI.getFunctionBookings();

            if (response && response.data.success) {
                setHospitalityStats({
                    count: response.data.count,
                    bookings: response.data.data
                });
            }
        } catch (error) {
            console.error(`Error fetching ${section} stats:`, error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    if (activeSection === 'restaurant' || activeSection === 'pub' || activeSection === 'function') {
        const title = activeSection.charAt(0).toUpperCase() + activeSection.slice(1);
        const Icon = activeSection === 'restaurant' ? Utensils : activeSection === 'pub' ? Beer : Calendar;

        const newBookingsCount = hospitalityStats.bookings?.filter(b => b.status !== 'completed').length || 0;

        return (
            <div className="dashboard">
                <div className="dashboard-header mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">{title} Dashboard</h1>
                </div>
                <div className="dashboard-stats responsive-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: '#fff7ed' }}>
                            <Icon size={24} color="#E3A048" />
                        </div>
                        <div className="stat-content">
                            <p className="stat-title">Total Bookings</p>
                            <h3 className="stat-value">{hospitalityStats.count}</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: '#fff7ed' }}>
                            <Clock size={24} color="#E3A048" />
                        </div>
                        <div className="stat-content">
                            <p className="stat-title">New Bookings</p>
                            <h3 className="stat-value">{newBookingsCount}</h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default Hotel Dashboard
    const statCards = [
        {
            title: 'Total Rooms',
            value: stats?.totalRooms || 0,
            icon: Bed,
            color: '#3b82f6',
            bgColor: '#dbeafe'
        },
        {
            title: 'Active Bookings',
            value: stats?.totalBookings || 0,
            icon: Calendar,
            color: '#10b981',
            bgColor: '#d1fae5'
        },
        {
            title: 'Active Guests',
            value: stats?.totalGuests || 0,
            icon: Users,
            color: '#f59e0b',
            bgColor: '#fef3c7'
        }
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-stats responsive-grid">
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

            <div className="dashboard-grid no-recent">
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
