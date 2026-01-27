import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchRoom, createBooking } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Maximize, ArrowLeft, Check, Calendar, Mail, Phone, User, MessageSquare, Image, X, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const loadRoom = async () => {
            try {
                const response = await fetchRoom(id);
                if (response.data.success) {
                    const roomData = response.data.data;

                    // Safely handle amenities
                    let amenitiesList = ['Free WiFi', 'Private Bathroom', 'TV'];
                    if (roomData.amenities) {
                        if (Array.isArray(roomData.amenities)) {
                            amenitiesList = roomData.amenities;
                        } else if (typeof roomData.amenities === 'string') {
                            amenitiesList = roomData.amenities.split(',').map(a => a.trim());
                        }
                    }

                    // Safely handle images
                    let allImgObjects = [];
                    if (roomData.images) {
                        try {
                            allImgObjects = typeof roomData.images === 'string' ? JSON.parse(roomData.images) : roomData.images;
                        } catch (e) {
                            allImgObjects = [];
                        }
                    }

                    if (!Array.isArray(allImgObjects) || allImgObjects.length === 0) {
                        allImgObjects = [{ url: `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`, publicId: 'default' }];
                    }

                    // Selected images for the 3-photo grid
                    const selectedForGrid = allImgObjects.filter(img => img.isSelected).map(img => img.url);
                    // If less than 3 are selected, fill with others
                    const gridImages = [...selectedForGrid];
                    allImgObjects.forEach(img => {
                        if (gridImages.length < 3 && !gridImages.includes(img.url)) {
                            gridImages.push(img.url);
                        }
                    });
                    // Fallback to fill the grid
                    while (gridImages.length < 3) gridImages.push(gridImages[0]);

                    const allGalleryUrls = allImgObjects.map(img => img.url);

                    setRoom({
                        id: roomData.id,
                        room_number: roomData.room_number,
                        room_type: roomData.room_type,
                        price: parseFloat(roomData.price_per_night),
                        capacity: roomData.capacity,
                        size: `${Math.floor(20 + roomData.capacity * 5)}m²`,
                        desc: roomData.description || `Experience comfort in our ${roomData.room_type.toLowerCase()} accommodation.`,
                        amenities: amenitiesList,
                        gridImages: gridImages,
                        images: allGalleryUrls,
                        status: roomData.status
                    });
                }
            } catch (error) {
                console.error('Error fetching room:', error);
                toast.error('Failed to load room details');
                navigate('/rooms');
            } finally {
                setLoading(false);
            }
        };
        loadRoom();
    }, [id, navigate]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setBookingLoading(true);

        const formData = new FormData(e.target);
        const bookingData = {
            room_id: room.id,
            guest_name: formData.get('guest_name'),
            guest_email: formData.get('guest_email'),
            guest_phone: formData.get('guest_phone'),
            check_in: formData.get('check_in'),
            check_out: formData.get('check_out'),
            guests: room.capacity, // Changed from num_guests to match backend
            special_requests: formData.get('special_requests')
        };

        try {
            const response = await createBooking(bookingData);
            if (response.data.success) {
                toast.success('Booking created successfully! We will contact you soon.');
                navigate('/rooms');
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast.error(error.response?.data?.message || 'Error creating booking');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="pt-32 pb-20 flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-gold"></div>
            </div>
        );
    }

    if (!room) return null;

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4">
                <Link
                    to="/rooms"
                    className="inline-flex items-center text-gray-500 hover:text-accent-gold transition-colors mb-4 mt-3 group"
                >
                    <ArrowLeft size={20} className="mr-2 transition-transform group-hover:-translate-x-1" />
                    BACK TO ALL ROOMS
                </Link>

                <div className="bg-white shadow-xl overflow-hidden rounded-none flex flex-col lg:flex-row">
                    {/* Left: Booking Form */}
                    <div className="lg:w-[30%] bg-gray-50 pt-6 pb-8 px-6 lg:pt-8 lg:pb-12 lg:px-10 order-2 lg:order-1 border-r border-gray-100">
                        <div className="sticky top-10">
                            <div className="text-left mb-6">
                                <h3 className="text-3xl font-serif mb-2 text-gray-900">Book Your Stay</h3>
                                <div className="w-12 h-0.5 bg-accent-gold"></div>
                            </div>

                            <form onSubmit={handleBooking} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                                    <div className="relative group">
                                        <label className="text-[10px] tracking-widest text-gray-400 block mb-2 font-bold flex items-center">
                                            <Calendar size={12} className="mr-1" /> CHECK-IN DATE
                                        </label>
                                        <input
                                            type="date"
                                            name="check_in"
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full bg-white border border-gray-200 px-4 py-3 rounded-none focus:border-accent-gold outline-none text-sm transition-colors"
                                            required
                                        />
                                    </div>
                                    <div className="relative group">
                                        <label className="text-[10px] tracking-widest text-gray-400 block mb-2 font-bold flex items-center">
                                            <Calendar size={12} className="mr-1" /> CHECK-OUT DATE
                                        </label>
                                        <input
                                            type="date"
                                            name="check_out"
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full bg-white border border-gray-200 px-4 py-3 rounded-none focus:border-accent-gold outline-none text-sm transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <label className="text-[10px] tracking-widest text-gray-400 block mb-2 font-bold flex items-center">
                                        <User size={12} className="mr-1" /> FULL NAME
                                    </label>
                                    <input
                                        type="text"
                                        name="guest_name"
                                        placeholder="Enter your full name"
                                        className="w-full bg-white border border-gray-200 px-4 py-3 rounded-none focus:border-accent-gold outline-none text-sm transition-colors"
                                        required
                                    />
                                </div>

                                <div className="relative group">
                                    <label className="text-[10px] tracking-widest text-gray-400 block mb-2 font-bold flex items-center">
                                        <Mail size={12} className="mr-1" /> EMAIL ADDRESS
                                    </label>
                                    <input
                                        type="email"
                                        name="guest_email"
                                        placeholder="your@email.com"
                                        className="w-full bg-white border border-gray-200 px-4 py-3 rounded-none focus:border-accent-gold outline-none text-sm transition-colors"
                                        required
                                    />
                                </div>

                                <div className="relative group">
                                    <label className="text-[10px] tracking-widest text-gray-400 block mb-2 font-bold flex items-center">
                                        <Phone size={12} className="mr-1" /> PHONE NUMBER
                                    </label>
                                    <input
                                        type="tel"
                                        name="guest_phone"
                                        placeholder="+1 234 567 8900"
                                        className="w-full bg-white border border-gray-200 px-4 py-3 rounded-none focus:border-accent-gold outline-none text-sm transition-colors"
                                    />
                                </div>

                                <div className="relative group">
                                    <label className="text-[10px] tracking-widest text-gray-400 block mb-2 font-bold flex items-center">
                                        <MessageSquare size={12} className="mr-1" /> SPECIAL REQUESTS
                                    </label>
                                    <textarea
                                        name="special_requests"
                                        placeholder="Any special requirements?"
                                        className="w-full bg-white border border-gray-200 px-4 py-3 rounded-none focus:border-accent-gold outline-none text-sm resize-none transition-colors"
                                        rows="3"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={bookingLoading || room.status !== 'available'}
                                    className={`w-full py-4 tracking-widest text-sm transition-all mt-6 shadow-lg ${room.status === 'available'
                                        ? 'bg-accent-gold text-white hover:bg-black'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {bookingLoading ? 'PROCESSNG...' : (room.status === 'available' ? 'BOOK THIS ROOM NOW' : 'NOT AVAILABLE')}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Photo & Room Details */}
                    <div className="lg:w-[70%] order-1 lg:order-2 bg-white flex flex-col">
                        <div className="relative h-[300px] lg:h-[400px] overflow-hidden grid grid-cols-2 gap-1">
                            {/* Left: Main Large Photo */}
                            <div
                                className="h-full overflow-hidden relative cursor-pointer group"
                                onClick={() => { setCurrentImageIndex(room.images.indexOf(room.gridImages[0])); setShowGallery(true); }}
                            >
                                <img
                                    src={room.gridImages[0]}
                                    alt={`${room.room_type} 1`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                            </div>

                            {/* Right: Stacked Secondary Photos */}
                            <div className="grid grid-rows-2 gap-1 h-full overflow-hidden">
                                <div
                                    className="h-full overflow-hidden relative cursor-pointer group"
                                    onClick={() => { setCurrentImageIndex(room.images.indexOf(room.gridImages[1])); setShowGallery(true); }}
                                >
                                    <img
                                        src={room.gridImages[1]}
                                        alt={`${room.room_type} 2`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                                </div>
                                <div
                                    className="h-full overflow-hidden relative cursor-pointer group"
                                    onClick={() => { setCurrentImageIndex(room.images.indexOf(room.gridImages[2])); setShowGallery(true); }}
                                >
                                    <img
                                        src={room.gridImages[2]}
                                        alt={`${room.room_type} 3`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                                </div>
                            </div>

                            {/* View All Button */}
                            <button
                                onClick={() => setShowGallery(true)}
                                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-900 px-4 py-2 text-[10px] tracking-widest font-bold uppercase shadow-lg flex items-center transition-all z-10"
                            >
                                <Image size={14} className="mr-2" />
                                VIEW ALL PHOTOS
                            </button>

                            {/* Price Tag */}
                            <div className="absolute top-0 right-0 bg-accent-gold text-white px-8 py-4 text-xl font-serif shadow-lg z-10">
                                ${room.price} <span className="text-sm font-sans opacity-80 font-normal">/ night</span>
                            </div>
                        </div>

                        <div className="p-8 lg:p-12">
                            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm tracking-widest text-gray-400 font-medium">
                                <div className="flex items-center">
                                    <Users size={18} className="mr-2 text-accent-gold" />
                                    {room.capacity} GUESTS
                                </div>
                                <div className="flex items-center">
                                    <Maximize size={18} className="mr-2 text-accent-gold" />
                                    {room.size} SPACE
                                </div>
                                <div className="flex items-center uppercase">
                                    <Check size={18} className="mr-1 text-green-500" />
                                    {room.status}
                                </div>
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-serif mb-6 text-gray-900">{room.room_type}</h1>
                            <p className="text-gray-500 text-lg leading-relaxed mb-10">{room.desc}</p>

                            <div className="border-t border-gray-100 pt-10">
                                <h3 className="text-xl font-serif mb-6 text-gray-900">Room Amenities</h3>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    {room.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center group">
                                            <div className="w-2 h-2 bg-accent-gold rounded-full mr-4 group-hover:scale-150 transition-transform"></div>
                                            <span className="text-gray-600 text-sm tracking-wide">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Modal */}
            <AnimatePresence>
                {showGallery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 md:p-10"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowGallery(false)}
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110]"
                        >
                            <X size={32} />
                        </button>

                        {/* Image counter */}
                        <div className="absolute top-6 left-6 text-white/70 text-sm font-serif z-[110]">
                            {currentImageIndex + 1} / {room.images.length}
                        </div>

                        {/* Main Image View */}
                        <div className="relative w-full max-w-6xl h-[70vh] flex items-center justify-center">
                            <button
                                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? room.images.length - 1 : prev - 1))}
                                className="absolute left-0 text-white/50 hover:text-white transition-colors p-2 z-[110]"
                            >
                                <ChevronLeft size={48} />
                            </button>

                            <motion.img
                                key={currentImageIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                src={room.images[currentImageIndex]}
                                className="max-w-full max-h-full object-contain"
                            />

                            <button
                                onClick={() => setCurrentImageIndex((prev) => (prev === room.images.length - 1 ? 0 : prev + 1))}
                                className="absolute right-0 text-white/50 hover:text-white transition-colors p-2 z-[110]"
                            >
                                <ChevronRight size={48} />
                            </button>
                        </div>

                        {/* Thumbnails */}
                        <div className="mt-8 flex gap-2 overflow-x-auto max-w-full p-2 no-scrollbar">
                            {room.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-accent-gold scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoomDetails;
