import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Zap, Clock, Users } from 'lucide-react';

const Dining = () => {
    const menuCategories = [
        { title: "Steakhouse", desc: "Premium cuts of meat grilled to perfection over open flame.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
        { title: "Gourmet Pizza", desc: "Hand-tossed dough with fresh local toppings and authentic cheeses.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
        { title: "British Classics", desc: "Traditional favorites prepared with a modern New Zealand twist.", image: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
        { title: "American Bistro", desc: "Hearty burgers, wings, and comfort food for the whole family.", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    ];

    return (
        <div className="pt-24 pb-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
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

            {/* Cuisines Grid */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl mb-4">A Taste of the World</h2>
                        <div className="w-20 h-1 bg-accent-gold mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {menuCategories.map((cat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group relative h-[400px] overflow-hidden rounded-sm cursor-pointer shadow-lg"
                            >
                                <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 p-10 text-white">
                                    <h3 className="text-3xl mb-2 font-serif">{cat.title}</h3>
                                    <p className="text-sm opacity-70 mb-6 max-w-sm">{cat.desc}</p>
                                    <button className="text-xs tracking-[0.3em] font-bold text-accent-gold group-hover:underline">
                                        VIEW MENU SELECTION
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Atmosphere Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <span className="text-accent-gold tracking-widest text-sm font-semibold mb-4 block">THE AMBIANCE</span>
                            <h2 className="text-4xl mb-6">Relaxed, Family-Friendly Atmosphere</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Enjoy brunch, lunch, dinner, or evening cocktails in our beautifully designed dining room. Whether it's a casual family gathering or a romantic dinner, our staff provides excellent service to ensure you have a wonderful experience.
                            </p>
                            <div className="bg-accent-gold bg-opacity-10 p-8 border-l-4 border-accent-gold">
                                <p className="italic text-gray-700 mb-4 text-lg">
                                    "The food was exceptional and the service was top-notch. The steak was cooked perfectly and the atmosphere was so welcoming."
                                </p>
                                <span className="text-sm font-bold tracking-widest">— GUEST REVIEW, 2025</span>
                            </div>
                        </div>
                        <div className="md:w-1/2 grid grid-cols-2 gap-4">
                            <img src="https://images.unsplash.com/photo-1550966841-3ee71448744c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Restaurant interior" className="rounded-sm" />
                            <img src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Cocktails" className="mt-12 rounded-sm shadow-xl" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dining;
