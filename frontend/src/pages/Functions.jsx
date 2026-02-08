import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Calendar, Mail, CheckCircle, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createFunctionEnquiry, fetchGalleryPhotos } from '../api';

const Functions = () => {
    const [enquiry, setEnquiry] = useState({
        name: '',
        email: '',
        phone: '',
        event_type: 'Wedding',
        date: '',
        guests: 50,
        details: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!enquiry.name.trim()) newErrors.name = 'Name is required';
        else if (enquiry.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';

        if (!enquiry.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) newErrors.email = 'Invalid email format';

        if (!enquiry.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^[\d\+\-\s\(\)]{10,20}$/.test(enquiry.phone)) newErrors.phone = 'Invalid phone number (min 10 digits)';

        if (!enquiry.date) newErrors.date = 'Date is required';
        if (!enquiry.event_type) newErrors.event_type = 'Event type is required';
        if (!enquiry.guests || enquiry.guests <= 0) newErrors.guests = 'Must have at least 1 guest';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [modalPhotoIndex, setModalPhotoIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);
    const [itemsToShow, setItemsToShow] = useState(3);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsToShow(1.2);
            } else {
                setItemsToShow(3);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getNZToday = () => {
        const date = new Date(new Date().toLocaleString("en-US", { timeZone: "Pacific/Auckland" }));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    React.useEffect(() => {
        const loadGallery = async () => {
            try {
                const response = await fetchGalleryPhotos('function');
                if (response.data.success && response.data.data.length > 0) {
                    setGalleryImages(response.data.data.map(p => p.image_url));
                }
            } catch (error) {
                console.error('Error fetching function gallery:', error);
            }
        };
        loadGallery();
    }, []);

    const displayImages = [...galleryImages, ...galleryImages.slice(0, 3)];

    React.useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setCurrentGalleryIndex((prev) => (prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [isPaused]);

    React.useEffect(() => {
        if (currentGalleryIndex >= galleryImages.length) {
            const timer = setTimeout(() => {
                setCurrentGalleryIndex(0);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (currentGalleryIndex < 0) {
            setCurrentGalleryIndex(galleryImages.length - 1);
        }
    }, [currentGalleryIndex, galleryImages.length]);

    const handleNext = () => setCurrentGalleryIndex(prev => prev + 1);
    const handlePrev = () => setCurrentGalleryIndex(prev => prev - 1);
    const handleNextPhoto = () => setModalPhotoIndex((prev) => (prev + 1) % galleryImages.length);
    const handlePrevPhoto = () => setModalPhotoIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

    const handleChange = (e) => {
        setEnquiry({ ...enquiry, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);
        try {
            const response = await createFunctionEnquiry(enquiry);
            if (response.data.success) {
                toast.success('Enquiry submitted successfully! We will contact you soon.');
                setEnquiry({ name: '', email: '', phone: '', event_type: 'Wedding', date: '', guests: 50, details: '' });
                setErrors({});
            }
        } catch (error) {
            console.error('Enquiry error:', error);
            const serverErrors = error.response?.data?.errors;
            if (serverErrors && Array.isArray(serverErrors)) {
                toast.error(serverErrors.join(', '));
            } else {
                toast.error(error.response?.data?.message || 'Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    const eventTypes = ["Wedding", "Birthday Party", "Corporate Conference", "Anniversary", "Private Dinner", "Other"];

    return (
        <div className="pt-24 pb-20">
            {/* Hero */}
            <section className="relative h-[70vh] flex items-center justify-center text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/event-room/hero.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-90"></div>
                </div>
                <div className="relative z-10 container mx-auto px-4 flex flex-col md:flex-row items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2"
                    >
                        <span className="text-accent-gold tracking-[0.3em] uppercase font-bold text-sm mb-4 block">Event Spaces</span>
                        <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">Celebrate Life's Moments</h1>
                        <p className="text-lg opacity-90 mb-8 max-w-lg leading-relaxed">
                            From intimate gatherings to grand celebrations, our versatile function rooms provide the perfect backdrop for your special events.
                        </p>
                        <button onClick={() => document.getElementById('enquiry-form').scrollIntoView({ behavior: 'smooth' })} className="border-2 border-accent-gold text-accent-gold px-8 py-3 hover:bg-accent-gold hover:text-white transition-all duration-300 font-bold tracking-widest text-sm">
                            PLAN YOUR EVENT
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Venues Showcase */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <span className="text-accent-gold text-sm tracking-widest font-bold block mb-2">OUR SPACES</span>
                        <h2 className="text-4xl font-serif text-primary">Distinctive Venues</h2>
                    </div>

                    <div className="space-y-24">
                        {/* Venue 1 */}
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="md:w-1/2">
                                <img src="/event-room/ballroom/ballroom.jpg" alt="Grand Ballroom" className="w-full rounded shadow-lg" />
                            </div>
                            <div className="md:w-1/2">
                                <h3 className="text-3xl font-serif mb-4 text-primary">The Grand Ballroom</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Our signature venue featuring crystal chandeliers, high ceilings, and floor-to-ceiling windows. Perfect for weddings and large corporate galas.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3 text-sm text-gray-700"><Users size={18} className="text-accent-gold" /> Capacity: Up to 300 Guests</li>
                                    <li className="flex items-center gap-3 text-sm text-gray-700"><CheckCircle size={18} className="text-accent-gold" /> Private Bar & Stage</li>
                                    <li className="flex items-center gap-3 text-sm text-gray-700"><CheckCircle size={18} className="text-accent-gold" /> Advanced AV System</li>
                                </ul>
                            </div>
                        </div>


                    </div>
                </div>
            </section>

            {/* Enquiry Form */}
            {/* Photo Section */}
            <section className="py-20 bg-white overflow-hidden">
                <div className="container mx-auto px-4 mb-10 text-center">
                    <span className="text-accent-gold tracking-[0.5em] text-xs font-light mb-4 block uppercase font-sans">Event Gallery</span>
                    <h2 className="text-4xl md:text-5xl font-serif mb-6 text-primary">Capture the Magic</h2>
                    <div className="w-20 h-1 bg-accent-gold mx-auto mb-12"></div>
                </div>

                <div
                    className="relative w-full group px-4 md:px-12"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-md hover:bg-white p-5 rounded-full shadow-2xl text-gray-900 transition-all duration-300 hover:scale-110 flex items-center justify-center border border-gray-100"
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-md hover:bg-white p-5 rounded-full shadow-2xl text-gray-900 transition-all duration-300 hover:scale-110 flex items-center justify-center border border-gray-100"
                    >
                        <ChevronRight size={32} />
                    </button>

                    <div className="overflow-hidden rounded-3xl">
                        <motion.div
                            className="flex cursor-grab active:cursor-grabbing"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.1}
                            dragMomentum={false}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = offset.x;
                                const swipeVelocity = velocity.x;
                                if (swipe < -50 || swipeVelocity < -300) handleNext();
                                else if (swipe > 50 || swipeVelocity > 300) handlePrev();
                            }}
                            animate={{ x: `-${currentGalleryIndex * (100 / displayImages.length)}%` }}
                            transition={{ type: "spring", stiffness: 120, damping: 25, mass: 0.5, bounce: 0 }}
                            style={{ display: 'flex', width: `${(displayImages.length / itemsToShow) * 100}%` }}
                        >
                            {displayImages.map((img, idx) => (
                                <div key={idx} className="px-3" style={{ width: `${100 / displayImages.length}%` }}>
                                    <div className="relative group/item overflow-hidden rounded-3xl aspect-[4/3] shadow-lg border border-gray-100">
                                        <img src={img} alt={`Event Gallery ${idx % galleryImages.length + 1}`} className="w-full h-full object-cover transition-transform duration-1000 group-hover/item:scale-105 pointer-events-none" />
                                        <div className="absolute inset-0 bg-black/10 group-hover/item:bg-black/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover/item:opacity-100">
                                            <button onClick={(e) => { e.stopPropagation(); setModalPhotoIndex(idx % galleryImages.length); setIsGalleryModalOpen(true); }} className="bg-white p-5 rounded-full text-gray-900 transform translate-y-6 group-hover/item:translate-y-0 transition-all duration-500 shadow-2xl hover:bg-accent-gold hover:text-white">
                                                <Maximize2 size={32} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                <div className="flex justify-center mt-16">
                    <button onClick={() => setIsGalleryModalOpen(true)} className="px-12 py-4 bg-[#1a1a1a] text-white tracking-widest text-xs font-bold hover:bg-accent-gold transition-colors duration-300 shadow-xl">
                        VIEW ALL PHOTOS
                    </button>
                </div>
            </section>

            {/* Lightbox Modal */}
            {isGalleryModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4 md:p-10">
                    <button onClick={() => setIsGalleryModalOpen(false)} className="absolute top-6 right-6 text-white hover:text-accent-gold transition-colors z-[110]">
                        <X size={32} />
                    </button>
                    <button onClick={handlePrevPhoto} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all">
                        <ChevronLeft size={32} />
                    </button>
                    <div className="max-w-6xl w-full h-full flex flex-col items-center justify-center">
                        <motion.img key={modalPhotoIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} src={galleryImages[modalPhotoIndex]} alt={`Gallery view ${modalPhotoIndex + 1}`} className="max-h-[80vh] w-auto object-contain shadow-2xl rounded-sm" />
                        <div className="mt-8 text-white/60 tracking-widest text-sm">{modalPhotoIndex + 1} / {galleryImages.length}</div>
                    </div>
                    <button onClick={handleNextPhoto} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all">
                        <ChevronRight size={32} />
                    </button>
                </div>
            )}

            {/* Enquiry Form */}
            <section id="enquiry-form" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-accent-gold tracking-widest text-sm font-semibold mb-4 block">GET IN TOUCH</span>
                        <h2 className="text-4xl font-serif text-primary">Plan Your Event</h2>
                    </div>

                    <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
                        {/* Left Side: Form */}
                        <div className="lg:w-1/2 p-8 md:p-12">
                            <h3 className="text-2xl font-serif mb-6 text-gray-800">Event Enquiry</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-gray-500">Name</label>
                                        <input type="text" name="name" value={enquiry.name} onChange={handleChange} className={`w-full border-b ${errors.name ? 'border-red-500' : 'border-gray-300'} py-2 focus:border-accent-gold outline-none transition-colors`} />
                                        {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-gray-500">Phone</label>
                                        <input type="tel" name="phone" value={enquiry.phone} onChange={handleChange} className={`w-full border-b ${errors.phone ? 'border-red-500' : 'border-gray-300'} py-2 focus:border-accent-gold outline-none transition-colors`} />
                                        {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-gray-500">Email Address</label>
                                    <input type="email" name="email" value={enquiry.email} onChange={handleChange} className={`w-full border-b ${errors.email ? 'border-red-500' : 'border-gray-300'} py-2 focus:border-accent-gold outline-none transition-colors`} />
                                    {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-gray-500">Date</label>
                                        <input type="date" name="date" value={enquiry.date} onChange={handleChange} min={getNZToday()} className={`w-full border-b ${errors.date ? 'border-red-500' : 'border-gray-300'} py-2 focus:border-accent-gold outline-none transition-colors`} />
                                        {errors.date && <p className="text-red-500 text-[10px] mt-1">{errors.date}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-gray-500">Estimated Guests</label>
                                        <input type="number" name="guests" value={enquiry.guests} onChange={handleChange} className="w-full border-b border-gray-300 py-2 focus:border-accent-gold outline-none transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-gray-500">Event Type</label>
                                    <select name="event_type" value={enquiry.event_type} onChange={handleChange} className="w-full border-b border-gray-300 py-2 focus:border-accent-gold outline-none transition-colors bg-white">
                                        {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-gray-500">Additional Details</label>
                                    <textarea name="details" value={enquiry.details} onChange={handleChange} rows="3" className="w-full border-b border-gray-300 py-2 focus:border-accent-gold outline-none transition-colors" placeholder="Tell us more about your event..."></textarea>
                                </div>
                                <button type="submit" disabled={loading} className="bg-[#E3A048] text-white px-8 py-3 font-bold tracking-widest text-sm hover:bg-[#c98a3c] transition-colors w-full md:w-auto rounded shadow-md mt-4">
                                    {loading ? 'SENDING...' : 'SEND ENQUIRY'}
                                </button>
                            </form>
                        </div>

                        {/* Right Side: Image */}
                        <div className="lg:w-1/2 relative min-h-[400px]">
                            <img
                                src="/event-room/booking-photo.jpg"
                                alt="Event Planning"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Functions;
