import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import './Header.css';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-title">
                    <h1>{getPageTitle()}</h1>
                </div>

                <div className="header-actions">
                    <div className="header-user">
                        <User size={20} />
                        <span>{user?.name || 'Admin'}</span>
                    </div>
                    <button onClick={logout} className="btn btn-outline">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

function getPageTitle() {
    const path = window.location.pathname;
    const titles = {
        '/': 'Dashboard',
        '/rooms': 'Room Management',
        '/bookings': 'Booking Management',
        '/guests': 'Guest Management',
        '/settings': 'Settings'
    };
    return titles[path] || 'Admin Panel';
}
