import { NavLink } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { LayoutDashboard, Bed, Calendar, Users, Settings, Hotel, Home, CheckCircle, Utensils, Beer, History, Image as ImageIcon } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ isOpen }) {
    const { activeSection } = useAdmin();

    const allMenus = {
        hotel: [
            { path: '/', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/rooms', label: 'Rooms', icon: Bed },
            { path: '/booked-rooms', label: 'Booked Rooms', icon: CheckCircle },
            { path: '/home-control', label: 'Home Control', icon: Home },
            { path: '/settings', label: 'Settings', icon: Settings },
        ],
        restaurant: [
            { path: '/restaurant', label: 'Rest. Dashboard', icon: LayoutDashboard },
            { path: '/restaurant/bookings', label: 'Table Bookings', icon: Utensils },
            { path: '/restaurant/history', label: 'Booking History', icon: History },
            { path: '/restaurant/gallery', label: 'Photo Gallery', icon: ImageIcon },
        ],
        pub: [
            { path: '/pub', label: 'Pub Dashboard', icon: LayoutDashboard },
            { path: '/pub/bookings', label: 'Table Bookings', icon: Beer },
            { path: '/pub/history', label: 'Booking History', icon: History },
            { path: '/pub/gallery', label: 'Photo Gallery', icon: ImageIcon },
        ],
        function: [
            { path: '/function', label: 'Func. Dashboard', icon: LayoutDashboard },
            { path: '/function/enquiries', label: 'Event Enquiries', icon: Calendar },
            { path: '/function/history', label: 'Event History', icon: History },
            { path: '/function/gallery', label: 'Photo Gallery', icon: ImageIcon },
        ]
    };

    const menuItems = allMenus[activeSection] || allMenus.hotel;

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
                            end={['/', '/restaurant', '/pub', '/function'].includes(item.path)}
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
