import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { createContactMessage } from '../api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';

        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';

        if (!formData.message.trim()) newErrors.message = 'Message is required';
        else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);

        try {
            const response = await createContactMessage(formData);
            if (response.data.success) {
                toast.success("Message sent! We'll get back to you shortly.");
                setFormData({ name: '', email: '', subject: '', message: '' });
                setErrors({});
            }
        } catch (error) {
            console.error('Contact error:', error);
            const serverErrors = error.response?.data?.errors;
            if (serverErrors && Array.isArray(serverErrors)) {
                toast.error(serverErrors.join(', '));
            } else {
                toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen bg-white">
            {/* Contact Header */}
            <section className="bg-gray-50 py-20 border-b border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <span className="text-accent-gold tracking-[0.4em] text-xs font-bold mb-4 block">GET IN TOUCH</span>
                    <h1 className="text-4xl md:text-5xl font-serif mb-6">Contact Us</h1>
                    <p className="max-w-xl mx-auto text-gray-500">
                        Have questions or want to make a special request? We're here to help you plan your perfect stay in Waipukurau.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Contact Info Column */}
                    <div className="lg:col-span-1 space-y-12">
                        <div>
                            <h3 className="text-xl font-bold tracking-widest mb-6">LOCATION</h3>
                            <div className="flex items-start space-x-4">
                                <div className="text-accent-gold mt-1"><MapPin size={24} /></div>
                                <div className="text-gray-600 leading-relaxed">
                                    4/10 Ruataniwha Street<br />
                                    Waipukurau 4200<br />
                                    New Zealand
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold tracking-widest mb-6">RESERVATIONS</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 text-gray-600">
                                    <div className="text-accent-gold"><Phone size={24} /></div>
                                    <span>+64 6 858 9196</span>
                                </div>
                                <div className="flex items-center space-x-4 text-gray-600">
                                    <div className="text-accent-gold"><Mail size={24} /></div>
                                    <span>reservations@leopardhotel.co.nz</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold tracking-widest mb-6">CHECK TIMES</h3>
                            <div className="flex items-center space-x-4 text-gray-600">
                                <div className="text-accent-gold"><Clock size={24} /></div>
                                <div>
                                    <p>Check-in: 2:00 PM</p>
                                    <p>Check-out: 10:00 AM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-10 border border-gray-100 shadow-xl"
                        >
                            <h2 className="text-3xl font-serif mb-8">Send a Message</h2>
                            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold tracking-[0.2em] text-gray-400">YOUR NAME</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full border-b-2 ${errors.name ? 'border-red-500' : 'border-gray-100'} py-3 focus:border-accent-gold outline-none transition-all`}
                                    />
                                    {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold tracking-[0.2em] text-gray-400">EMAIL ADDRESS</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full border-b-2 ${errors.email ? 'border-red-500' : 'border-gray-100'} py-3 focus:border-accent-gold outline-none transition-all`}
                                    />
                                    {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold tracking-[0.2em] text-gray-400">SUBJECT</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={`w-full border-b-2 ${errors.subject ? 'border-red-500' : 'border-gray-100'} py-3 focus:border-accent-gold outline-none transition-all`}
                                    />
                                    {errors.subject && <p className="text-red-500 text-[10px] mt-1">{errors.subject}</p>}
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold tracking-[0.2em] text-gray-400">MESSAGE</label>
                                    <textarea
                                        rows="5"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`w-full border-b-2 ${errors.message ? 'border-red-500' : 'border-gray-100'} py-3 focus:border-accent-gold outline-none transition-all`}
                                    ></textarea>
                                    {errors.message && <p className="text-red-500 text-[10px] mt-1">{errors.message}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center justify-center space-x-3 w-full md:w-auto px-12 py-4 bg-gray-900 text-white hover:bg-accent-gold transition-all tracking-widest text-sm font-bold disabled:opacity-50"
                                    >
                                        <span>{loading ? 'SENDING...' : 'SEND MESSAGE'}</span>
                                        <Send size={18} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <section className="h-[500px] w-full bg-gray-200 grayscale hover:grayscale-0 transition-all duration-1000">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3005.1!2d176.54!3d-39.99!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d15a5!2sLeopard%20Hotel!5e0!3m2!1sen!2snz!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </section>
        </div>
    );
};

export default Contact;
