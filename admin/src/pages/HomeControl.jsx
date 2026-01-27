import React, { useState, useEffect } from 'react';
import { Upload, Home, Image as ImageIcon, Check, Save, Loader2, ArrowRight } from 'lucide-react';
import { roomsAPI, settingsAPI, uploadAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './HomeControl.css';

export default function HomeControl() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [config, setConfig] = useState({
        hero_desktop: '',
        hero_mobile: '',
        elegance_top: '',
        elegance_bottom: '',
        featured_rooms: []
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [roomsRes, configRes] = await Promise.all([
                    roomsAPI.getAll(),
                    settingsAPI.get('home_page')
                ]);

                if (roomsRes.data.success) setRooms(roomsRes.data.data);
                if (configRes.data.success) {
                    const savedConfig = configRes.data.data;
                    // Ensure featured_rooms is an array of 8 elements (or empty)
                    if (!savedConfig.featured_rooms) savedConfig.featured_rooms = [];
                    setConfig(savedConfig);
                }
            } catch (error) {
                console.error('Error loading home control data:', error);
                toast.error('Failed to load configuration');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleImageUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            toast.loading('Uploading image...', { id: 'upload' });
            const res = await uploadAPI.uploadGeneral(formData);
            if (res.data.success) {
                setConfig(prev => ({ ...prev, [field]: res.data.url }));
                toast.success('Image uploaded successfully', { id: 'upload' });
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image', { id: 'upload' });
        }
    };

    const handleRoomSelect = (index, roomId) => {
        const updatedFeatured = [...config.featured_rooms];
        updatedFeatured[index] = parseInt(roomId);
        setConfig(prev => ({ ...prev, featured_rooms: updatedFeatured }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsAPI.update('home_page', config);
            toast.success('Home page updated successfully');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to update home page');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Loader2 className="animate-spin" size={48} />
                <p>Loading home page controls...</p>
            </div>
        );
    }

    return (
        <div className="home-control-container">
            <div className="header-flex">
                <div>
                    <h1>Home Page Customization</h1>
                    <p className="subtitle">Manage hero banners, section images, and featured rooms.</p>
                </div>
                <button className="btn btn-primary btn-icon" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="control-sections">
                {/* Hero Section */}
                <section className="control-card">
                    <div className="card-header">
                        <ImageIcon size={20} className="text-primary" />
                        <h2>Hero Section Banners</h2>
                    </div>
                    <div className="grid-2">
                        <div className="upload-group">
                            <label>Desktop Banner (1920x1080 recommended)</label>
                            <div className="image-preview-large">
                                {config.hero_desktop ? (
                                    <img src={config.hero_desktop} alt="Hero Desktop" />
                                ) : (
                                    <div className="no-image">No image selected</div>
                                )}
                                <label className="upload-overlay">
                                    <input type="file" onChange={(e) => handleImageUpload(e, 'hero_desktop')} hidden />
                                    <Upload size={20} />
                                    <span>Change Photo</span>
                                </label>
                            </div>
                        </div>
                        <div className="upload-group">
                            <label>Mobile Banner (800x1200 recommended)</label>
                            <div className="image-preview-mobile">
                                {config.hero_mobile ? (
                                    <img src={config.hero_mobile} alt="Hero Mobile" />
                                ) : (
                                    <div className="no-image">No image selected</div>
                                )}
                                <label className="upload-overlay">
                                    <input type="file" onChange={(e) => handleImageUpload(e, 'hero_mobile')} hidden />
                                    <Upload size={20} />
                                    <span>Change Photo</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="section-footer">
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            Save Hero Banners
                        </button>
                    </div>
                </section>

                {/* Elegance Section */}
                <section className="control-card">
                    <div className="card-header">
                        <Home size={20} className="text-primary" />
                        <h2>"Elegance Meets Excellence" Section</h2>
                    </div>
                    <div className="grid-2">
                        <div className="upload-group">
                            <label>Top Image (Arched)</label>
                            <div className="image-preview-tall">
                                {config.elegance_top ? (
                                    <img src={config.elegance_top} alt="Elegance Top" />
                                ) : (
                                    <div className="no-image">No image selected</div>
                                )}
                                <label className="upload-overlay">
                                    <input type="file" onChange={(e) => handleImageUpload(e, 'elegance_top')} hidden />
                                    <Upload size={20} />
                                    <span>Change Photo</span>
                                </label>
                            </div>
                        </div>
                        <div className="upload-group">
                            <label>Bottom Image (Secondary Arched)</label>
                            <div className="image-preview-tall">
                                {config.elegance_bottom ? (
                                    <img src={config.elegance_bottom} alt="Elegance Bottom" />
                                ) : (
                                    <div className="no-image">No image selected</div>
                                )}
                                <label className="upload-overlay">
                                    <input type="file" onChange={(e) => handleImageUpload(e, 'elegance_bottom')} hidden />
                                    <Upload size={20} />
                                    <span>Change Photo</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="section-footer">
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            Save Section Photos
                        </button>
                    </div>
                </section>

                {/* Featured Rooms Order */}
                <section className="control-card">
                    <div className="card-header">
                        <Check size={20} className="text-primary" />
                        <h2>Featured Rooms (Positions 1-8)</h2>
                    </div>
                    <p className="card-desc">Select which rooms will appear in the "Our Luxurious Rooms" grid on the homepage and their exact order.</p>
                    <div className="room-order-grid">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((pos) => (
                            <div key={pos} className="room-select-item">
                                <div className="pos-badge">{pos + 1}</div>
                                <select
                                    className="input"
                                    value={config.featured_rooms[pos] || ''}
                                    onChange={(e) => handleRoomSelect(pos, e.target.value)}
                                >
                                    <option value="">Select a Room</option>
                                    {rooms.map(room => (
                                        <option key={room.id} value={room.id}>
                                            Room {room.room_number} - {room.room_type}
                                        </option>
                                    ))}
                                </select>
                                {config.featured_rooms[pos] && (
                                    <div className="room-tiny-preview">
                                        {(() => {
                                            const room = rooms.find(r => r.id === config.featured_rooms[pos]);
                                            if (!room) return null;
                                            let thumb = '';
                                            try {
                                                const imgs = typeof room.images === 'string' ? JSON.parse(room.images) : room.images;
                                                thumb = imgs[0]?.url;
                                            } catch (e) { }
                                            return thumb ? <img src={thumb} alt="Room" /> : <div className="no-thumb">No Image</div>;
                                        })()}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="section-footer">
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            Save Room Order
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
