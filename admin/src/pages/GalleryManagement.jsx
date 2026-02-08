import { useState, useEffect } from 'react';
import { galleryAPI } from '../utils/api';
import { Plus, Trash2, Image as ImageIcon, X, RefreshCw, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import './GalleryManagement.css';

export default function GalleryManagement({ category, title }) {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [replacingId, setReplacingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchPhotos();
    }, [category]);

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            const response = await galleryAPI.getPhotos(category);
            if (response.data.success) {
                setPhotos(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching gallery photos:', error);
            toast.error('Failed to load photos');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (photos.length + files.length > 20) {
            toast.error(`Limit exceeded. You can only upload ${20 - photos.length} more photos.`);
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        try {
            setUploading(true);
            const response = await galleryAPI.addPhoto(category, formData);
            if (response.data.success) {
                toast.success(response.data.message || 'Photos added successfully');
                fetchPhotos();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload photos');
        } finally {
            setUploading(false);
            e.target.value = null; // Clear input
        }
    };

    const handleReplace = async (e, photoId) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setReplacingId(photoId);
            const response = await galleryAPI.replacePhoto(photoId, formData);
            if (response.data.success) {
                toast.success('Photo replaced successfully');
                fetchPhotos();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to replace photo');
        } finally {
            setReplacingId(null);
            e.target.value = null; // Clear input
        }
    };

    const handleDelete = async (photoId) => {
        try {
            setDeletingId(photoId);
            const response = await galleryAPI.deletePhoto(photoId);
            if (response.data.success) {
                toast.success('Photo deleted successfully');
                fetchPhotos();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete photo');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="gallery-management">
            <div className="page-header">
                <div>
                    <h2>{title} Photo Gallery</h2>
                    <p className="text-secondary">{photos.length} / 20 photos uploaded</p>
                </div>
                {photos.length < 20 && (
                    <label className="btn btn-primary cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleUpload} multiple hidden disabled={uploading} />
                        <Plus size={18} />
                        {uploading ? 'Uploading...' : 'Add Photos'}
                    </label>
                )}
            </div>

            {loading ? (
                <div className="loading">Loading photos...</div>
            ) : (
                <div className="gallery-grid">
                    {photos.map((photo, index) => (
                        <div key={photo.id} className="gallery-item">
                            <div className="gallery-image-wrapper">
                                <img src={photo.image_url} alt={`${category} ${index + 1}`} />

                                {(replacingId === photo.id || deletingId === photo.id) && (
                                    <div className="gallery-loading-overlay">
                                        <RefreshCw size={24} className="animate-spin" />
                                        <span>{replacingId === photo.id ? 'Replacing...' : 'Deleting...'}</span>
                                    </div>
                                )}

                                <div className="gallery-item-overlay">
                                    <label className="action-btn replace" title="Replace Photo">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleReplace(e, photo.id)}
                                            hidden
                                            disabled={replacingId === photo.id}
                                        />
                                        <RefreshCw size={18} className={replacingId === photo.id ? 'animate-spin' : ''} />
                                    </label>
                                    <button
                                        className="action-btn delete"
                                        onClick={() => handleDelete(photo.id)}
                                        title="Delete Photo"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="gallery-item-number">{index + 1}</div>
                            </div>
                        </div>
                    ))}

                    {photos.length === 0 && (
                        <div className="gallery-empty">
                            <ImageIcon size={48} />
                            <p>No photos uploaded yet.</p>
                            <p className="text-secondary">Upload up to 20 photos for the {category} gallery.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
