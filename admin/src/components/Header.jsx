import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { LogOut, User, X, Menu, Building, Utensils, Beer, Users, MessageSquare } from 'lucide-react';
import './Header.css';

export default function Header({ toggleSidebar }) {
    const { user, logout } = useAuth();
    const { activeSection } = useAdmin();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const sections = [
        { id: 'hotel', label: 'Hotel', icon: Building, path: '/' },
        { id: 'restaurant', label: 'Restaurant', icon: Utensils, path: '/restaurant' },
        { id: 'pub', label: 'Pub', icon: Beer, path: '/pub' },
        { id: 'function', label: 'Function Room', icon: Users, path: '/function' },
        { id: 'connection', label: 'Connection', icon: MessageSquare, path: '/connection' },
    ];

    const handleSectionClick = (path) => {
        navigate(path);
    };

    return (
        <header className="header">
            <div className="header-content">
                <button className="mobile-toggle" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>

                <div className="section-tabs">
                    {sections.map(section => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => handleSectionClick(section.path)}
                                className={`section-tab ${activeSection === section.id ? 'active' : ''}`}
                            >
                                <Icon size={18} />
                                <span>{section.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="header-actions">
                    <div className="header-user">
                        <User size={20} />
                        <span>{user?.name || 'Admin'}</span>
                    </div>
                    <button onClick={() => setShowLogoutConfirm(true)} className="btn btn-outline">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            {showLogoutConfirm && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }} onClick={() => setShowLogoutConfirm(false)}>
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
                            onClick={() => setShowLogoutConfirm(false)}
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
                            backgroundColor: '#fee2e2',
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: '#ef4444'
                        }}>
                            <LogOut size={24} />
                        </div>

                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>
                            Do you want to logout?
                        </h3>
                        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.875rem' }}>
                            You will need to login again to access the admin panel.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
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
                                No, Stay
                            </button>
                            <button
                                onClick={logout}
                                style={{
                                    padding: '0.75rem',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

function getPageTitle() {
    const path = window.location.pathname;
    const titles = {
        '/': 'Dashboard',
        '/rooms': 'Room Management',
        '/booked-rooms': 'Booked Rooms',
        '/home-control': 'Home Control',
        '/settings': 'Settings'
    };
    return titles[path] || 'Admin Panel';
}
