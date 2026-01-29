import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import BookedRooms from './pages/BookedRooms';
import Settings from './pages/Settings';
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
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Toaster position="top-right" />
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
