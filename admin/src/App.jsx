import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import BookedRooms from './pages/BookedRooms';
import Settings from './pages/Settings';
import RestaurantBookings from './pages/RestaurantBookings';
import PubBookings from './pages/PubBookings';
import FunctionBookings from './pages/FunctionBookings';
import Connection from './pages/Connection';

import HomeControl from './pages/HomeControl';
import Layout from './components/Layout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>Loading...</div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />

            <Route path="/" element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="rooms" element={<Rooms />} />
                <Route path="booked-rooms" element={<BookedRooms />} />
                <Route path="home-control" element={<HomeControl />} />
                <Route path="settings" element={<Settings />} />

                {/* Section Dashboards */}
                <Route path="restaurant" element={<Dashboard />} />
                <Route path="pub" element={<Dashboard />} />
                <Route path="function" element={<Dashboard />} />

                {/* Restaurant Routes */}
                <Route path="restaurant/bookings" element={<RestaurantBookings />} />
                <Route path="restaurant/history" element={<RestaurantBookings />} />

                {/* Pub Routes */}
                <Route path="pub/bookings" element={<PubBookings />} />
                <Route path="pub/history" element={<PubBookings />} />

                {/* Function Routes */}
                <Route path="function/enquiries" element={<FunctionBookings />} />
                <Route path="function/history" element={<FunctionBookings />} />

                {/* Connection Route */}
                <Route path="connection" element={<Connection />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AdminProvider>
                    <Toaster position="top-right" />
                    <AppRoutes />
                </AdminProvider>
            </Router>
        </AuthProvider>
    );
}

export default App;
