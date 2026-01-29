import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Users, MapPin, Clock, Heart } from 'lucide-react';

const About = () => {
    const stats = [
        { label: 'Years of Excellence', value: '25+' },
        { label: 'Luxury Rooms', value: '48' },
        { label: 'Happy Guests', value: '10K+' },
        { label: 'Awards Won', value: '12' },
    ];

    const values = [
        {
            icon: <Shield className="w-8 h-8 text-accent-gold" />,
            title: "Reliability",
            desc: "Trust is the foundation of our hospitality. We ensure every stay is safe, secure, and dependable."
        },
        {
            icon: <Award className="w-8 h-8 text-accent-gold" />,
            title: "Quality",
            desc: "From the linens to the cuisine, we never compromise on the high standards our guests expect."
        },
        {
            icon: <Heart className="w-8 h-8 text-accent-gold" />,
            title: "Passion",
            desc: "Our team is driven by a genuine love for service, making every interaction personal and warm."
        },
    ];

    return (
        <div className="pt-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 scale-105"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
                </div>

                <div className="relative z-10 text-center px-4">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-accent-gold tracking-[0.4em] text-sm font-semibold uppercase mb-4 block"
                    >
                        Our Legacy
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-6xl lg:text-7xl text-white font-serif mb-6"
                    >
                        About Leopard Hotel
                    </motion.h1>
                    <div className="w-24 h-1 bg-accent-gold mx-auto"></div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Leopard Hotel History"
                                className="rounded-none shadow-2xl w-full h-[500px] object-cover"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2 space-y-6"
                        >
                            <span className="text-accent-gold tracking-widest text-xs font-bold uppercase">Since 1998</span>
                            <h2 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight">
                                A Grand Tradition of <br />
                                <span className="italic">Hospitality</span>
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Founded in the heart of Hawke's Bay, Leopard Hotel has been a beacon of luxury and comfort for over two decades. What started as a small boutique establishment has grown into one of the region's most celebrated destinations.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Our mission has always been simple: to provide a sanctuary where elegance meets excellence. Every corner of our hotel tells a story of meticulous design, dedicated service, and a commitment to creating unforgettable memories for our guests.
                            </p>
                            <div className="flex flex-wrap gap-8 pt-6">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="text-center">
                                        <div className="text-2xl md:text-3xl font-serif text-accent-gold">{stat.value}</div>
                                        <div className="text-xs uppercase tracking-widest text-gray-400 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-accent-gold tracking-widest text-sm font-semibold mb-4 block uppercase">Our Philosophy</span>
                        <h2 className="text-3xl md:text-5xl font-serif">The Core Values We Live By</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {values.map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-white p-10 text-center shadow-sm hover:shadow-xl transition-all border-b-4 border-transparent hover:border-accent-gold"
                            >
                                <div className="flex justify-center mb-6">{value.icon}</div>
                                <h3 className="text-xl font-serif mb-4">{value.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                            Experience the Art of <br />
                            <span className="text-accent-gold">Refined Living</span>
                        </h2>
                        <p className="text-gray-600 text-lg mb-10 leading-relaxed italic">
                            "The Leopard Hotel is more than just a place to sleep. It's an experience carefully crafted to rejuvenate your soul and delight your senses."
                        </p>
                        <div className="flex items-center justify-center space-x-4">
                            <div className="w-12 h-[1px] bg-gray-300"></div>
                            <span className="uppercase tracking-[0.3em] text-xs font-bold text-gray-500">The General Manager</span>
                            <div className="w-12 h-[1px] bg-gray-300"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
