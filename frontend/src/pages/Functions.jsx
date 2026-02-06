import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Calendar, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createFunctionEnquiry } from '../api';

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

    const handleChange = (e) => {
        setEnquiry({ ...enquiry, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await createFunctionEnquiry(enquiry);
            if (data.success) {
                toast.success('Enquiry submitted successfully! We will contact you soon.');
                setEnquiry({ name: '', email: '', phone: '', event_type: 'Wedding', date: '', guests: 50, details: '' });
            } else {
                toast.error(data.message || 'Something went wrong');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit enquiry');
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
                                        <input type="text" name="name" value={enquiry.name} onChange={handleChange} required className="w-full border-b border-gray-300 py-2 focus:border-accent-gold outline-none transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-gray-500">Phone</label>
                                        <input type="tel" name="phone" value={enquiry.phone} onChange={handleChange} required className="w-full border-b border-gray-300 py-2 focus:border-accent-gold outline-none transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-gray-500">Email Address</label>
                                    <input type="email" name="email" value={enquiry.email} onChange={handleChange} required className="w-full border-b border-gray-300 py-2 focus:border-accent-gold outline-none transition-colors" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-gray-500">Date</label>
                                        <input type="date" name="date" value={enquiry.date} onChange={handleChange} required className="w-full border-b border-gray-300 py-2 focus:border-accent-gold outline-none transition-colors" />
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
