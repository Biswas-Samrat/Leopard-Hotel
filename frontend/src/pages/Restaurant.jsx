import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Zap, Clock, Users, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createRestaurantBooking, fetchGalleryPhotos } from '../api';

const Restaurant = () => {
    const [step, setStep] = useState(1);
    const [currentMonth, setCurrentMonth] = useState(new Date(new Date().toLocaleString("en-US", { timeZone: "Pacific/Auckland" })));
    const [bookingData, setBookingData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
        special_requests: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!bookingData.name.trim()) newErrors.name = 'Name is required';
        else if (bookingData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';

        if (!bookingData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) newErrors.email = 'Invalid email format';

        if (!bookingData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^[\d\+\-\s\(\)]{10,20}$/.test(bookingData.phone)) newErrors.phone = 'Invalid phone number (min 10 digits)';

        if (!bookingData.date) newErrors.date = 'Date is required';
        if (!bookingData.time) newErrors.time = 'Time is required';
        if (!bookingData.guests || bookingData.guests <= 0) newErrors.guests = 'Must have at least 1 guest';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [modalPhotoIndex, setModalPhotoIndex] = useState(0);

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

    React.useEffect(() => {
        const loadGallery = async () => {
            try {
                const response = await fetchGalleryPhotos('restaurant');
                if (response.data.success && response.data.data.length > 0) {
                    setGalleryImages(response.data.data.map(p => p.image_url));
                }
            } catch (error) {
                console.error('Error fetching restaurant gallery:', error);
            }
        };
        loadGallery();
    }, []);

    // For smooth looping, we display clones of the first few images at the end
    const displayImages = [...galleryImages, ...galleryImages.slice(0, 4)];

    const [isPaused, setIsPaused] = useState(false);

    // Auto-advance gallery every 5 seconds
    React.useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setCurrentGalleryIndex((prev) => (prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [isPaused]);

    // Handle seamless loop jump
    React.useEffect(() => {
        if (currentGalleryIndex >= galleryImages.length) {
            const timer = setTimeout(() => {
                setCurrentGalleryIndex(0);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (currentGalleryIndex < 0) {
            // Support backward wrapping
            setCurrentGalleryIndex(galleryImages.length - 1);
        }
    }, [currentGalleryIndex, galleryImages.length]);

    const handleNext = () => {
        setCurrentGalleryIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        setCurrentGalleryIndex(prev => prev - 1);
    };

    const handleNextPhoto = () => {
        setModalPhotoIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const handlePrevPhoto = () => {
        setModalPhotoIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    // Calendar Helper Functions
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday

        // Use New Zealand time for "today"
        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Pacific/Auckland" }));
        today.setHours(0, 0, 0, 0);

        const daysArray = [];

        // Add empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            daysArray.push({ day: '', isCurrentMonth: false });
        }

        // Add days of current month
        for (let i = 1; i <= days; i++) {
            const dateObj = new Date(year, month, i);
            // Manually construct YYYY-MM-DD to avoid timezone shifts
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isPast = dateObj < today;
            daysArray.push({ day: i, isCurrentMonth: true, date: dateObj, dateString, isPast });
        }

        return daysArray;
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentMonth.setMonth(currentMonth.getMonth() + offset));
        setCurrentMonth(new Date(newDate));
    };

    const handleDateSelect = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const day = dateObj.getDate();
        // Construct YYYY-MM-DD matching the generation logic
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setBookingData({ ...bookingData, date: dateStr });
    };

    const renderCalendar = () => getDaysInMonth(currentMonth);

    // Wizard Navigation
    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);
        try {
            const response = await createRestaurantBooking(bookingData);
            if (response.data.success) {
                toast.success('Reservation successful!');
                setStep(1);
                setBookingData({
                    name: '',
                    email: '',
                    phone: '',
                    date: '',
                    time: '',
                    guests: 2,
                    special_requests: ''
                });
                setErrors({});
            }
        } catch (error) {
            console.error('Booking error:', error);
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

    return (
        <div className="pt-24 pb-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/resturent/resturent-hero.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
                <div className="relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-accent-gold tracking-[0.5em] text-sm font-light mb-4 block">CULINARY EXCELLENCE</span>
                        <h1 className="text-5xl md:text-7xl font-serif mb-6">Leopard Restaurant</h1>
                        <p className="max-w-2xl mx-auto text-lg font-light opacity-90">
                            A family-friendly haven serving a diverse menu of global cuisines in a relaxed, elegant setting.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Info Bar */}
            <div className="bg-white py-10 border-b border-gray-100">
                <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-accent-gold mb-2 flex justify-center"><Clock size={24} /></div>
                        <p className="text-xs tracking-widest text-gray-400 mb-1">OPEN DAILY</p>
                        <p className="text-sm font-bold">11:00 AM - 10:00 PM</p>
                    </div>
                    <div>
                        <div className="text-accent-gold mb-2 flex justify-center"><Utensils size={24} /></div>
                        <p className="text-xs tracking-widest text-gray-400 mb-1">CUISINE</p>
                        <p className="text-sm font-bold">Global / Fusion</p>
                    </div>
                    <div>
                        <div className="text-accent-gold mb-2 flex justify-center"><Users size={24} /></div>
                        <p className="text-xs tracking-widest text-gray-400 mb-1">CAPACITY</p>
                        <p className="text-sm font-bold">80 Guests</p>
                    </div>
                    <div>
                        <div className="text-accent-gold mb-2 flex justify-center"><Zap size={24} /></div>
                        <p className="text-xs tracking-widest text-gray-400 mb-1">SERVICE</p>
                        <p className="text-sm font-bold">Dine-in & Room Service</p>
                    </div>
                </div>
            </div>

            {/* Photo Section */}
            <section className="py-20 bg-white overflow-hidden">
                <div className="container mx-auto px-4 mb-10 text-center">
                    <span className="text-accent-gold tracking-[0.5em] text-xs font-light mb-4 block">VISUAL EXPERIENCE</span>
                    <h2 className="text-4xl md:text-5xl font-serif mb-6">Our Atmosphere</h2>
                    <div className="w-20 h-1 bg-accent-gold mx-auto mb-12"></div>
                </div>

                <div
                    className="relative w-full group px-4 md:px-12"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Navigation Arrows - Centered precisely on images */}
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

                                if (swipe < -50 || swipeVelocity < -300) {
                                    handleNext();
                                } else if (swipe > 50 || swipeVelocity > 300) {
                                    handlePrev();
                                }
                            }}
                            animate={{
                                x: `-${currentGalleryIndex * (100 / displayImages.length)}%`
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 25,
                                mass: 0.5,
                                bounce: 0
                            }}
                            style={{
                                display: 'flex',
                                width: `${(displayImages.length / itemsToShow) * 100}%`
                            }}
                        >
                            {displayImages.map((img, idx) => (
                                <div key={idx} className="px-3" style={{ width: `${100 / displayImages.length}%` }}>
                                    <div className="relative group/item overflow-hidden rounded-3xl aspect-[4/3] shadow-lg border border-gray-100">
                                        <img
                                            src={img}
                                            alt={`Restaurant Gallery ${idx % galleryImages.length + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover/item:scale-105 pointer-events-none"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover/item:bg-black/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover/item:opacity-100">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setModalPhotoIndex(idx % galleryImages.length);
                                                    setIsGalleryModalOpen(true);
                                                }}
                                                className="bg-white p-5 rounded-full text-gray-900 transform translate-y-6 group-hover/item:translate-y-0 transition-all duration-500 shadow-2xl hover:bg-accent-gold hover:text-white"
                                            >
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
                    <button
                        onClick={() => setIsGalleryModalOpen(true)}
                        className="px-12 py-4 bg-[#1a1a1a] text-white tracking-widest text-xs font-bold hover:bg-accent-gold transition-colors duration-300 shadow-xl"
                    >
                        VIEW ALL PHOTOS
                    </button>
                </div>
            </section>

            {/* Lightbox Modal */}
            {isGalleryModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4 md:p-10">
                    <button
                        onClick={() => setIsGalleryModalOpen(false)}
                        className="absolute top-6 right-6 text-white hover:text-accent-gold transition-colors z-[110]"
                    >
                        <X size={32} />
                    </button>

                    <button
                        onClick={handlePrevPhoto}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all"
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <div className="max-w-6xl w-full h-full flex flex-col items-center justify-center">
                        <motion.img
                            key={modalPhotoIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={galleryImages[modalPhotoIndex]}
                            alt={`Gallery view ${modalPhotoIndex + 1}`}
                            className="max-h-[80vh] w-auto object-contain shadow-2xl rounded-sm"
                        />
                        <div className="mt-8 text-white/60 tracking-widest text-sm">
                            {modalPhotoIndex + 1} / {galleryImages.length}
                        </div>
                    </div>

                    <button
                        onClick={handleNextPhoto}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all"
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>
            )}

            {/* Menu Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 md:px-16 lg:px-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl mb-4 text-primary">Our Menu</h2>
                        <div className="w-20 h-1 bg-accent-gold mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full overflow-hidden rounded-sm"
                        >
                            <img src="/resturent/Menu (1).jpg" alt="Restaurant Menu 1" className="w-full h-auto" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="w-full overflow-hidden rounded-sm"
                        >
                            <img src="/resturent/Menu (2).jpg" alt="Restaurant Menu 2" className="w-full h-auto" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Booking Wizard Section */}
            <section className="py-24 bg-stone-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-accent-gold tracking-widest text-sm font-semibold mb-4 block">RESERVATIONS</span>
                        <h2 className="text-4xl font-serif text-primary">Book a Table</h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto items-start">
                        {/* Left Side: Booking Wizard */}
                        <div className="w-full lg:w-1/2 bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-8">
                            {/* Progress Header */}
                            <div className="flex justify-center mb-12">
                                <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-2">
                                    {['Date', 'Time', 'People', 'Confirmation'].map((stepName, idx) => (
                                        <div key={stepName} className="flex items-center">
                                            <div
                                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${step === idx + 1
                                                    ? 'bg-[#E3A048] text-white shadow-md'
                                                    : step > idx + 1
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'text-gray-400'
                                                    }`}
                                            >
                                                {stepName}
                                            </div>
                                            {idx < 3 && <span className="mx-2 text-gray-300">›</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Step 1: Select Date */}
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <h2 className="text-3xl font-serif text-center mb-10 text-gray-800">Select Date</h2>

                                    <div className="mb-6 flex items-center justify-between px-4">
                                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
                                        <span className="text-xl font-medium">
                                            {currentMonth.toLocaleDateString('en-NZ', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight /></button>
                                    </div>

                                    <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                            <div key={d} className="text-xs font-bold text-gray-400 py-2">{d}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {renderCalendar().map((day, idx) => (
                                            <button
                                                key={idx}
                                                disabled={!day.isCurrentMonth || day.isPast}
                                                onClick={() => day.isCurrentMonth && !day.isPast && handleDateSelect(day.date)}
                                                className={`
                                                h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all
                                                ${!day.isCurrentMonth ? 'invisible' : ''}
                                                ${day.isPast ? 'text-red-300 line-through cursor-not-allowed bg-red-50' :
                                                        bookingData.date === day.dateString
                                                            ? 'bg-[#E3A048] text-white shadow-md transform scale-105'
                                                            : 'bg-gray-50 text-gray-700 hover:bg-orange-50'}
                                            `}
                                            >
                                                {day.day}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-10">
                                        <button
                                            onClick={nextStep}
                                            disabled={!bookingData.date}
                                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${bookingData.date
                                                ? 'bg-[#E3A048] text-white hover:bg-[#c98a3c] shadow-lg'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Select Time */}
                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <h2 className="text-3xl font-serif text-center mb-10 text-gray-800">Select Time</h2>

                                    <div className="mb-8">
                                        <h3 className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Lunch Time</h3>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            {['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM'].map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => setBookingData({ ...bookingData, time })}
                                                    className={`py-3 rounded-full text-sm font-bold transition-all ${bookingData.time === time
                                                        ? 'bg-[#E3A048] text-white shadow-md'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-10">
                                        <h3 className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Dinner Time</h3>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            {['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'].map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => setBookingData({ ...bookingData, time })}
                                                    className={`py-3 rounded-full text-sm font-bold transition-all ${bookingData.time === time
                                                        ? 'bg-[#E3A048] text-white shadow-md'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button onClick={prevStep} className="w-1/2 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
                                            Back
                                        </button>
                                        <button
                                            onClick={nextStep}
                                            disabled={!bookingData.time}
                                            className={`w-1/2 py-4 rounded-xl font-bold text-lg transition-all ${bookingData.time
                                                ? 'bg-[#E3A048] text-white hover:bg-[#c98a3c] shadow-lg'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Select People */}
                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <h2 className="text-3xl font-serif text-center mb-10 text-gray-800">Number of People</h2>

                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-10">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                                            <button
                                                key={num}
                                                onClick={() => setBookingData({ ...bookingData, guests: num })}
                                                className={`aspect-square rounded-2xl text-2xl font-medium transition-all ${bookingData.guests === num
                                                    ? 'bg-[#E3A048] text-white shadow-lg transform scale-105'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex gap-4">
                                        <button onClick={prevStep} className="w-1/2 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
                                            Back
                                        </button>
                                        <button
                                            onClick={nextStep}
                                            className="w-1/2 py-4 rounded-xl font-bold text-lg bg-[#E3A048] text-white hover:bg-[#c98a3c] shadow-lg"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Confirmation */}
                            {step === 4 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <h2 className="text-3xl font-serif text-center mb-10 text-gray-800">Complete Reservation</h2>

                                    <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                            <span className="text-gray-500 font-medium">Date</span>
                                            <span className="font-bold text-gray-800">
                                                {new Date(bookingData.date).toLocaleDateString('en-NZ', { weekday: 'long', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                            <span className="text-gray-500 font-medium">Time</span>
                                            <span className="font-bold text-gray-800">{bookingData.time}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3">
                                            <span className="text-gray-500 font-medium">Guests</span>
                                            <span className="font-bold text-gray-800">{bookingData.guests} People</span>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                name="name"
                                                value={bookingData.name}
                                                onChange={handleChange}
                                                placeholder="Your Name"
                                                className={`w-full px-6 py-4 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-[#E3A048] focus:ring-0 outline-none bg-white font-medium`}
                                            />
                                            {errors.name && <p className="text-red-500 text-sm ml-2">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={bookingData.phone}
                                                onChange={handleChange}
                                                placeholder="Phone Number"
                                                className={`w-full px-6 py-4 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:border-[#E3A048] focus:ring-0 outline-none bg-white font-medium`}
                                            />
                                            {errors.phone && <p className="text-red-500 text-sm ml-2">{errors.phone}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <input
                                                type="email"
                                                name="email"
                                                value={bookingData.email}
                                                onChange={handleChange}
                                                placeholder="Email"
                                                className={`w-full px-6 py-4 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-[#E3A048] focus:ring-0 outline-none bg-white font-medium`}
                                            />
                                            {errors.email && <p className="text-red-500 text-sm ml-2">{errors.email}</p>}
                                        </div>
                                        <textarea
                                            name="special_requests"
                                            value={bookingData.special_requests}
                                            onChange={handleChange}
                                            placeholder="Special Requests (Optional)"
                                            rows="2"
                                            className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#E3A048] focus:ring-0 outline-none bg-white font-medium resize-none"
                                        ></textarea>
                                    </form>

                                    <div className="flex gap-4">
                                        <button onClick={prevStep} className="w-1/2 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
                                            Back
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="w-1/2 py-4 rounded-xl font-bold text-lg bg-[#E3A048] text-white hover:bg-[#c98a3c] shadow-lg flex items-center justify-center gap-2"
                                        >
                                            {loading ? 'Processing...' : 'Confirm'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Right Side: Image */}
                        <div className="w-full lg:w-1/2 sticky top-24 hidden lg:block">
                            <img
                                src="/resturent/img (5).jpg"
                                alt="Dining Experience"
                                className="w-full h-[500px] object-cover rounded-3xl shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Restaurant;
