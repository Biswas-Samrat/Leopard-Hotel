import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bed, Calendar, Users, Settings, Hotel, Home, CheckCircle } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ isOpen }) {
    const menuItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/rooms', label: 'Rooms', icon: Bed },
        { path: '/booked-rooms', label: 'Booked Rooms', icon: CheckCircle },
        { path: '/home-control', label: 'Home Control', icon: Home },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
            <div className="sidebar-header">
                <Hotel size={24} color="var(--primary)" />
                <h2>Leopard Hotel</h2>
                <p>Admin Panel</p>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'active' : ''}`
                            }
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <p>&copy; 2026 Leopard Hotel</p>
            </div>
        </aside>
    );
}
