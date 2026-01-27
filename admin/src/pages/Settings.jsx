import { useState } from 'react';
import { authAPI } from '../utils/api';
import { Lock, User, Mail } from 'lucide-react';
import './Settings.css';

export default function Settings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);

        try {
            await authAPI.updatePassword({ currentPassword, newPassword });
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Error updating password'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <h2>Settings</h2>
            </div>

            <div className="settings-grid">
                <div className="settings-card">
                    <h3><User size={20} /> Profile Information</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Name</label>
                            <p>{JSON.parse(localStorage.getItem('adminUser') || '{}').name || 'Admin'}</p>
                        </div>
                        <div className="info-item">
                            <label>Email</label>
                            <p>{JSON.parse(localStorage.getItem('adminUser') || '{}').email || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <h3><Lock size={20} /> Change Password</h3>

                    {message.text && (
                        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <label className="form-label">Current Password</label>
                            <input
                                type="password"
                                className="input"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                className="input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
