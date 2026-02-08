import { useState, useEffect } from 'react';
import { roomsAPI, uploadAPI } from '../utils/api';
import { Plus, Edit, Trash2, Search, Filter, SlidersHorizontal, Image as ImageIcon, X, Trash, Check, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import './Rooms.css';

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteRoomId, setDeleteRoomId] = useState(null);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [capacityFilter, setCapacityFilter] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    // Sort states
    const [sortBy, setSortBy] = useState('room_number');
    const [sortOrder, setSortOrder] = useState('asc');

    // Show/hide filters
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await roomsAPI.getAll();
            if (response.data.success) {
                setRooms(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setDeleteRoomId(id);
    };

    const confirmDelete = async () => {
        if (!deleteRoomId) return;

        try {
            await roomsAPI.delete(deleteRoomId);
            toast.success('Room deleted successfully');
            fetchRooms();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting room');
        } finally {
            setDeleteRoomId(null);
        }
    };

    // Get unique room types for filter
    const roomTypes = [...new Set(rooms.map(room => room.room_type))];

    // Filter and sort rooms
    const filteredAndSortedRooms = rooms
        .filter(room => {
            // Search filter
            const matchesSearch = room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.room_type.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            const matchesStatus = !statusFilter || room.status === statusFilter;

            // Type filter
            const matchesType = !typeFilter || room.room_type === typeFilter;

            // Capacity filter
            const matchesCapacity = !capacityFilter || room.capacity >= parseInt(capacityFilter);

            // Price range filter
            const matchesPriceMin = !priceRange.min || room.price_per_night >= parseFloat(priceRange.min);
            const matchesPriceMax = !priceRange.max || room.price_per_night <= parseFloat(priceRange.max);

            return matchesSearch && matchesStatus && matchesType && matchesCapacity && matchesPriceMin && matchesPriceMax;
        })
        .sort((a, b) => {
            let compareValue = 0;

            switch (sortBy) {
                case 'room_number':
                    compareValue = a.room_number.localeCompare(b.room_number);
                    break;
                case 'room_type':
                    compareValue = a.room_type.localeCompare(b.room_type);
                    break;
                case 'capacity':
                    compareValue = a.capacity - b.capacity;
                    break;
                case 'price_per_night':
                    compareValue = a.price_per_night - b.price_per_night;
                    break;
                case 'status':
                    compareValue = a.status.localeCompare(b.status);
                    break;
                default:
                    compareValue = 0;
            }

            return sortOrder === 'asc' ? compareValue : -compareValue;
        });

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setTypeFilter('');
        setCapacityFilter('');
        setPriceRange({ min: '', max: '' });
        setSortBy('room_number');
        setSortOrder('asc');
    };

    return (
        <div className="rooms-page">
            <div className="page-header">
                <h2>Rooms Management</h2>
                <button className="btn btn-primary" onClick={() => { setEditingRoom(null); setShowModal(true); }}>
                    <Plus size={18} />
                    Add Room
                </button>
            </div>

            {/* Search and Filter Toggle */}
            <div className="search-filter-bar">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by room number or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className={`btn btn-outline filter-toggle ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <SlidersHorizontal size={18} />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="filters-panel">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label className="form-label">Status</label>
                            <select
                                className="input"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="available">Available</option>
                                <option value="booked">Booked</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="form-label">Room Type</label>
                            <select
                                className="input"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="">All Types</option>
                                {roomTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="form-label">Min Capacity</label>
                            <select
                                className="input"
                                value={capacityFilter}
                                onChange={(e) => setCapacityFilter(e.target.value)}
                            >
                                <option value="">Any</option>
                                <option value="1">1+ Guests</option>
                                <option value="2">2+ Guests</option>
                                <option value="3">3+ Guests</option>
                                <option value="4">4+ Guests</option>
                                <option value="6">6+ Guests</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="form-label">Min Price ($)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="0"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                            />
                        </div>

                        <div className="filter-group">
                            <label className="form-label">Max Price ($)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="1000"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                            />
                        </div>

                        <div className="filter-group">
                            <label className="form-label">Sort By</label>
                            <select
                                className="input"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="room_number">Room Number</option>
                                <option value="room_type">Room Type</option>
                                <option value="capacity">Capacity</option>
                                <option value="price_per_night">Price</option>
                                <option value="status">Status</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="form-label">Order</label>
                            <select
                                className="input"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>

                        <div className="filter-group filter-actions">
                            <button className="btn btn-outline" onClick={clearFilters}>
                                Clear All
                            </button>
                        </div>
                    </div>

                    <div className="filter-summary">
                        <strong>Showing {filteredAndSortedRooms.length}</strong> of {rooms.length} rooms
                    </div>
                </div>
            )}

            {loading ? (
                <div className="loading">Loading rooms...</div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Room Number</th>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Price/Night</th>
                                <th>Status</th>
                                <th>Amenities</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedRooms.map((room) => {
                                let mainImg = null;
                                try {
                                    const imgs = room.images ? (typeof room.images === 'string' ? JSON.parse(room.images) : room.images) : [];
                                    mainImg = imgs.find(img => img.isMain)?.url || imgs[0]?.url;
                                } catch (e) {
                                    mainImg = null;
                                }

                                return (
                                    <tr key={room.id}>
                                        <td data-label="Image">
                                            <div className="room-image-preview">
                                                {mainImg ? (
                                                    <img
                                                        src={mainImg}
                                                        alt="Room"
                                                        className="room-image-thumbnail"
                                                    />
                                                ) : (
                                                    <div className="room-image-thumbnail no-image flex items-center justify-center bg-gray-100">
                                                        <ImageIcon size={16} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td data-label="Room Number"><strong>{room.room_number}</strong></td>
                                        <td data-label="Type">{room.room_type}</td>
                                        <td data-label="Capacity">{room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</td>
                                        <td data-label="Price">{room.price_per_night}</td>
                                        <td data-label="Status">
                                            <span className={`badge badge-${getStatusColor(room.status)}`}>
                                                {room.status}
                                            </span>
                                        </td>
                                        <td data-label="Amenities" className="amenities-cell">
                                            {room.amenities ? room.amenities.split(',').slice(0, 3).join(', ') : 'N/A'}
                                            {room.amenities && room.amenities.split(',').length > 3 && '...'}
                                        </td>
                                        <td data-label="Actions">
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => { setEditingRoom(room); setShowModal(true); }}
                                                    title="Edit room"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className="btn-icon danger"
                                                    onClick={() => handleDelete(room.id)}
                                                    title="Delete room"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredAndSortedRooms.length === 0 && (
                        <p className="no-data">No rooms found matching your filters</p>
                    )}
                </div>
            )}

            {showModal && (
                <RoomModal
                    room={editingRoom}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { setShowModal(false); fetchRooms(); }}
                />
            )}

            {/* Room Delete Confirmation Dialog */}
            {deleteRoomId && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }} onClick={() => setDeleteRoomId(null)}>
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
                            onClick={() => setDeleteRoomId(null)}
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
                            <Trash2 size={24} />
                        </div>

                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>
                            Do you want to delete the room?
                        </h3>
                        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.875rem' }}>
                            This action cannot be undone. All data related to this room will be permanently removed.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                            <button
                                onClick={() => setDeleteRoomId(null)}
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
                                No
                            </button>
                            <button
                                onClick={confirmDelete}
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
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Executive Suite', 'Family Room'];
const AMENITIES_OPTIONS = [
    'Free WiFi',
    'Air Conditioning',
    'Smart TV',
    'Mini Bar',
    'Coffee Maker',
    'Private Balcony',
    'Jacuzzi',
    'Room Service'
];

function RoomModal({ room, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        room_number: room?.room_number ?? '',
        room_type: room?.room_type ?? ROOM_TYPES[0],
        capacity: room?.capacity ?? 1,
        price_per_night: room?.price_per_night ?? '',
        status: room?.status ?? 'available',
        description: room?.description ?? '',
    });

    const [selectedAmenities, setSelectedAmenities] = useState(
        room?.amenities ? room.amenities.split(',').map(a => a.trim()) : []
    );

    const [existingImages, setExistingImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (room?.images) {
            try {
                const imgs = typeof room.images === 'string' ? JSON.parse(room.images) : room.images;
                setExistingImages(Array.isArray(imgs) ? imgs : []);
            } catch (e) {
                setExistingImages([]);
            }
        }
    }, [room]);

    const handleAmenityChange = (amenity) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + existingImages.length > 10) {
            toast.error('Maximum 10 photos allowed per room');
            return;
        }
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const handleRemoveSelectedFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = async (publicId) => {
        if (!confirm('Are you sure you want to remove this image?')) return;

        try {
            setUploading(true);
            await uploadAPI.deleteRoomImage(room.id, publicId);
            setExistingImages(prev => prev.filter(img => img.publicId !== publicId));
        } catch (error) {
            toast.error('Error removing image');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const toggleImageSelection = async (publicId) => {
        const updatedImages = existingImages.map(img =>
            img.publicId === publicId ? { ...img, isSelected: !img.isSelected } : img
        );

        try {
            await roomsAPI.update(room.id, { images: JSON.stringify(updatedImages) });
            setExistingImages(updatedImages);
        } catch (error) {
            toast.error('Error updating image selection');
        }
    };

    const setAsMainImage = async (publicId) => {
        const updatedImages = existingImages.map(img => ({
            ...img,
            isMain: img.publicId === publicId
        }));

        try {
            await roomsAPI.update(room.id, { images: JSON.stringify(updatedImages) });
            setExistingImages(updatedImages);
        } catch (error) {
            toast.error('Error setting main image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let roomId = room?.id;
            let res;

            const finalData = {
                ...formData,
                amenities: selectedAmenities.join(', ')
            };

            if (room) {
                res = await roomsAPI.update(room.id, finalData);
            } else {
                res = await roomsAPI.create(finalData);
                roomId = res.data.data.id;
            }

            // Upload images if selected
            if (selectedFiles.length > 0 && roomId) {
                setUploading(true);
                const uploadData = new FormData();
                selectedFiles.forEach(file => {
                    uploadData.append('room_images', file);
                });
                await uploadAPI.uploadRoomImage(roomId, uploadData);
            }

            onSuccess();
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Error saving room';
            toast.error(errorMsg);
            console.error('Room save error details:', error.response?.data || error);
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                <h3>{room ? 'Edit Room' : 'Add New Room'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Room Number *</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.room_number}
                                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Room Type *</label>
                            <div className="radio-group">
                                {ROOM_TYPES.map(type => (
                                    <label key={type} className="radio-label">
                                        <input
                                            type="radio"
                                            name="room_type"
                                            value={type}
                                            checked={formData.room_type === type}
                                            onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
                                        />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Capacity *</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                min="1"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Price per Night ($) *</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.price_per_night}
                                onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                            className="input"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="available">Available</option>
                            <option value="booked">Booked</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="input"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="2"
                            placeholder="Describe the room..."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Amenities</label>
                        <div className="checkbox-grid">
                            {AMENITIES_OPTIONS.map(amenity => (
                                <label key={amenity} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={selectedAmenities.includes(amenity)}
                                        onChange={() => handleAmenityChange(amenity)}
                                    />
                                    <span>{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Image Management Section */}
                    <div className="image-management-section">
                        <label className="form-label">Room Gallery (Max 10)</label>
                        <p className="text-xs text-gray-500 mb-2">
                            ⭐ Set Main (Rooms Page) | ✅ Select 3 for Details Page Grid
                        </p>

                        <div className="image-grid-admin">
                            {/* Existing Images */}
                            {existingImages.map((img, index) => (
                                <div key={index} className={`admin-image-item ${img.isMain ? 'is-main' : ''} ${img.isSelected ? 'is-selected' : ''}`}>
                                    <img src={img.url} alt={`Room ${index}`} />
                                    <div className="image-actions-overlay">
                                        <button
                                            type="button"
                                            className={`action-btn ${img.isMain ? 'active' : ''}`}
                                            onClick={() => setAsMainImage(img.publicId)}
                                            title="Set as Main"
                                        >
                                            <Star size={14} fill={img.isMain ? 'currentColor' : 'none'} />
                                        </button>
                                        <button
                                            type="button"
                                            className={`action-btn ${img.isSelected ? 'active' : ''}`}
                                            onClick={() => toggleImageSelection(img.publicId)}
                                            title="Display in Details Grid"
                                        >
                                            <Check size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            className="action-btn delete"
                                            onClick={() => handleRemoveExistingImage(img.publicId)}
                                        >
                                            <Trash size={14} />
                                        </button>
                                    </div>
                                    {img.isMain && <span className="image-badge main">Main</span>}
                                    {img.isSelected && <span className="image-badge selected">Grid</span>}
                                </div>
                            ))}

                            {/* New Files to Upload */}
                            {selectedFiles.map((file, index) => (
                                <div key={`new-${index}`} className="admin-image-item pending">
                                    <img src={URL.createObjectURL(file)} alt="Pending" />
                                    <button
                                        type="button"
                                        className="remove-pending-btn"
                                        onClick={() => handleRemoveSelectedFile(index)}
                                    >
                                        <X size={12} />
                                    </button>
                                    <span className="image-badge pending">Pending</span>
                                </div>
                            ))}

                            {/* Upload Button */}
                            {(existingImages.length + selectedFiles.length < 10) && (
                                <label className="upload-placeholder">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                        hidden
                                    />
                                    <Plus size={24} />
                                    <span>Add Photo</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving || uploading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                            {saving ? 'Saving...' : (uploading ? 'Uploading...' : 'Save Room')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function getStatusColor(status) {
    return status === 'available' ? 'success' : status === 'booked' ? 'warning' : 'danger';
}
