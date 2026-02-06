import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AdminContext = createContext();

export function useAdmin() {
    return useContext(AdminContext);
}

export function AdminProvider({ children }) {
    const [activeSection, setActiveSection] = useState('hotel');
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        if (path.startsWith('/restaurant')) {
            setActiveSection('restaurant');
        } else if (path.startsWith('/pub')) {
            setActiveSection('pub');
        } else if (path.startsWith('/function')) {
            setActiveSection('function');
        } else if (path.startsWith('/connection')) {
            setActiveSection('connection');
        } else {
            setActiveSection('hotel');
        }
    }, [location.pathname]);

    const value = {
        activeSection,
        setActiveSection
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}
