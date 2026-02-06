import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Beer, Music, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createPubBooking } from '../api';

const Pub = () => {
    const [step, setStep] = useState(1);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookingData, setBookingData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
        special_requests: ''
    });
    const [loading, setLoading] = useState(false);

    // Calendar Helper Functions (Same as Restaurant)
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const daysArray = [];

        for (let i = 0; i < firstDay; i++) {
            daysArray.push({ day: '', isCurrentMonth: false });
        }

        for (let i = 1; i <= days; i++) {
            const dateObj = new Date(year, month, i);
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
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setBookingData({ ...bookingData, date: dateStr });
    };

    const renderCalendar = () => getDaysInMonth(currentMonth);

    // Wizard Navigation
    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);
    const handleChange = (e) => setBookingData({ ...bookingData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await createPubBooking(bookingData);
            if (data.success) {
                toast.success('Pub table reserved successfully!');
                setBookingData({ name: '', email: '', phone: '', date: '', time: '', guests: 2, special_requests: '' });
                setStep(1);
            } else {
                toast.error(data.message || 'Something went wrong');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to book table');
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
                        backgroundImage: "url('/pub/pub-hero.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                </div>
                <div className="relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-accent-gold tracking-[0.5em] text-sm font-light mb-4 block">THE LOCAL FAVORITE</span>
                        <h1 className="text-5xl md:text-7xl font-serif mb-6">Leopard Pub & Bar</h1>
                        <p className="max-w-2xl mx-auto text-lg font-light opacity-90">
                            Craft beers, signature cocktails, and live sports in a vibrant atmosphere.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Info Bar */}
            <div className="bg-white py-10 border-b border-gray-100">
                <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-accent-gold mb-2 flex justify-center"><Clock size={24} /></div>
                        <p className="text-xs tracking-widest text-gray-400 mb-1">HAPPY HOUR</p>
                        <p className="text-sm font-bold">4:00 PM - 7:00 PM</p>
                    </div>
                    <div>
                        <div className="text-accent-gold mb-2 flex justify-center"><Beer size={24} /></div>
                        <p className="text-xs tracking-widest text-gray-400 mb-1">ON TAP</p>
                        <p className="text-sm font-bold">12 Craft Beers</p>
                    </div>
                    <div>
                        <div className="text-accent-gold mb-2 flex justify-center"><Music size={24} /></div>
                        <p className="text-xs tracking-widest text-gray-400 mb-1">ENTERTAINMENT</p>
                        <p className="text-sm font-bold">Live Music Fri-Sat</p>
                    </div>
                    <div>
                        <div className="text-accent-gold mb-2 flex justify-center"><Users size={24} /></div>
                        <p className="text-xs tracking-widest text-gray-400 mb-1">VIBE</p>
                        <p className="text-sm font-bold">Casual & Lively</p>
                    </div>
                </div>
            </div>

            {/* Highlights Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl mb-4 text-primary font-serif">Pub Classics & Drinks</h2>
                        <div className="w-20 h-1 bg-accent-gold mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Signature Cocktails", img: "/pub/drink/Signature Cocktails.jpg", desc: "Expertly crafted by our mixologists." },
                            { title: "Gourmet Burgers", img: "/pub/drink/Gourmet Burgers.jpg", desc: "Best burgers in town, guaranteed." },
                            { title: "Live Sports", img: "/pub/drink/Live Sports.jpg", desc: "Catch every game on our big screens." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                                <div className="h-64 overflow-hidden">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-serif mb-2 text-stone-800">{item.title}</h3>
                                    <p className="text-stone-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
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
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-xs font-bold text-gray-400 py-2">{d}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {renderCalendar().map((day, idx) => (
                                            <button
                                                key={idx}
                                                disabled={!day.isCurrentMonth || day.isPast}
                                                onClick={() => day.isCurrentMonth && !day.isPast && handleDateSelect(day.date)}
                                                className={`h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${!day.isCurrentMonth ? 'invisible' : ''} ${day.isPast ? 'text-red-300 line-through cursor-not-allowed bg-red-50' : bookingData.date === day.dateString ? 'bg-[#E3A048] text-white shadow-md transform scale-105' : 'bg-gray-50 text-gray-700 hover:bg-orange-50'}`}
                                            >
                                                {day.day}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-10">
                                        <button onClick={nextStep} disabled={!bookingData.date} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${bookingData.date ? 'bg-[#E3A048] text-white hover:bg-[#c98a3c] shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>Next</button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Select Time */}
                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <h2 className="text-3xl font-serif text-center mb-10 text-gray-800">Select Time</h2>
                                    <div className="mb-8">
                                        <h3 className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Available Times</h3>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            {['4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'].map(time => (
                                                <button key={time} onClick={() => setBookingData({ ...bookingData, time })} className={`py-3 rounded-full text-sm font-bold transition-all ${bookingData.time === time ? 'bg-[#E3A048] text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>{time}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={prevStep} className="w-1/2 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50">Back</button>
                                        <button onClick={nextStep} disabled={!bookingData.time} className={`w-1/2 py-4 rounded-xl font-bold text-lg transition-all ${bookingData.time ? 'bg-[#E3A048] text-white hover:bg-[#c98a3c] shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>Next</button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Select People */}
                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <h2 className="text-3xl font-serif text-center mb-10 text-gray-800">Number of Guests</h2>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-10">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                                            <button key={num} onClick={() => setBookingData({ ...bookingData, guests: num })} className={`aspect-square rounded-2xl text-2xl font-medium transition-all ${bookingData.guests === num ? 'bg-[#E3A048] text-white shadow-lg transform scale-105' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>{num}</button>
                                        ))}
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={prevStep} className="w-1/2 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50">Back</button>
                                        <button onClick={nextStep} className="w-1/2 py-4 rounded-xl font-bold text-lg bg-[#E3A048] text-white hover:bg-[#c98a3c] shadow-lg">Next</button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Confirmation */}
                            {step === 4 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <h2 className="text-3xl font-serif text-center mb-10 text-gray-800">Complete Reservation</h2>
                                    <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                        <div className="flex justify-between items-center py-3 border-b border-gray-200"><span className="text-gray-500 font-medium">Date</span><span className="font-bold text-gray-800">{new Date(bookingData.date).toLocaleDateString('en-NZ', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
                                        <div className="flex justify-between items-center py-3 border-b border-gray-200"><span className="text-gray-500 font-medium">Time</span><span className="font-bold text-gray-800">{bookingData.time}</span></div>
                                        <div className="flex justify-between items-center py-3"><span className="text-gray-500 font-medium">Guests</span><span className="font-bold text-gray-800">{bookingData.guests} People</span></div>
                                    </div>
                                    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                                        <input type="text" name="name" value={bookingData.name} onChange={handleChange} placeholder="Your Name" required className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#E3A048] focus:ring-0 outline-none bg-white font-medium" />
                                        <input type="tel" name="phone" value={bookingData.phone} onChange={handleChange} placeholder="Phone Number" required className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#E3A048] focus:ring-0 outline-none bg-white font-medium" />
                                        <input type="email" name="email" value={bookingData.email} onChange={handleChange} placeholder="Email (Optional)" className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#E3A048] focus:ring-0 outline-none bg-white font-medium" />
                                        <textarea name="special_requests" value={bookingData.special_requests} onChange={handleChange} placeholder="Special Requests (Optional)" rows="2" className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#E3A048] focus:ring-0 outline-none bg-white font-medium resize-none"></textarea>
                                    </form>
                                    <div className="flex gap-4">
                                        <button onClick={prevStep} className="w-1/2 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50">Back</button>
                                        <button onClick={handleSubmit} disabled={loading} className="w-1/2 py-4 rounded-xl font-bold text-lg bg-[#E3A048] text-white hover:bg-[#c98a3c] shadow-lg flex items-center justify-center gap-2">{loading ? 'Processing...' : 'Confirm'}</button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Right Side: Image */}
                        <div className="w-full lg:w-1/2 sticky top-24 hidden lg:block">
                            <img src="/pub/book/book-table.jpg" alt="Pub Interior" className="w-full h-[500px] object-cover rounded-3xl shadow-xl" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Pub;
