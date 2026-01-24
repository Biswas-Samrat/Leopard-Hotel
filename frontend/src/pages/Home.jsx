import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Wifi, Coffee, Car, Utensils, Music, ShieldCheck, ArrowUpRight, X, Users, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Home = () => {
    const [selectedRoom, setSelectedRoom] = useState(null);

    const roomData = [
        { id: 1, name: "Standard Single Room", price: 180, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", capacity: 1, size: "22m²", desc: "Perfect for solo travelers, featuring a comfortable single bed and a modern workspace.", amenities: ["Free WiFi", "Private Bathroom", "Work Desk", "TV", "Toiletries"] },
        { id: 2, name: "Deluxe Double Room", price: 250, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", capacity: 2, size: "30m²", desc: "Spacious room with a queen-sized bed, ideal for couples seeking comfort and style.", amenities: ["Free WiFi", "Private Bathroom", "Sitting Area", "TV", "Room Service"] },
        { id: 3, name: "Family Suite", price: 420, image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", capacity: 4, size: "50m²", desc: "Expansive suite designed for families, with interconnected rooms and premium facilities.", amenities: ["Free WiFi", "2 Bedrooms", "Large TV", "Mini Bar", "Garden View"] },
        { id: 4, name: "Premium Twin Room", price: 280, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bHV4dXJ5JTIwaG90ZWwlMjByb29tfGVufDB8fDB8fHww", capacity: 2, size: "32m²", desc: "Features two comfortable single beds and elegant decor for a relaxing stay.", amenities: ["Free WiFi", "Bright Lighting", "Desk", "Coffee Maker", "Tea Service"] },
        { id: 5, name: "Luxury King Suite", price: 550, image: "https://images.unsplash.com/photo-1729605412224-147d072d3667?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bHV4dXJ5JTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D", capacity: 2, size: "65m²", desc: "Our finest suite with a panoramic view and top-of-the-line luxury finishes.", amenities: ["Free WiFi", "King Bed", "Jacuzzi", "Living Room", "Butler Service"] },
        { id: 6, name: "Executive Suite", price: 380, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", capacity: 2, size: "45m²", desc: "Designed for business leaders, combining luxury with a highly functional workspace.", amenities: ["Free WiFi", "Meeting Space", "Nespresso", "Office Chair", "VIP Lounge"] },
        { id: 7, name: "Garden View Double", price: 230, image: "https://plus.unsplash.com/premium_photo-1661875135365-16aab794632f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bHV4dXJ5JTIwaG90ZWwlMjByb29tfGVufDB8fDB8fHww", capacity: 2, size: "28m²", desc: "Wake up to our lush manicured gardens in this serene double room.", amenities: ["Free WiFi", "Garden Access", "Patio", "Large Windows", "Relaxing Chair"] },
        { id: 8, name: "Heritage Suite", price: 480, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", capacity: 2, size: "55m²", desc: "A blend of history and comfort, featuring original wood panels and modern luxury.", amenities: ["Free WiFi", "Antiques", "Claw-foot Tub", "Fireplace", "Breakfast in Bed"] },
    ];

    const highlights = [
        { icon: <Wifi size={24} />, title: "Free WiFi", desc: "High-speed internet throughout the hotel." },
        { icon: <Utensils size={24} />, title: "Fine Dining", desc: "Award-winning restaurant with diverse cuisines." },
        { icon: <Car size={24} />, title: "Free Parking", desc: "Secure on-site parking for all guests." },
        { icon: <Coffee size={24} />, title: "Breakfast", desc: "Start your day with our delicious breakfast." },
    ];

    const handleBookNow = (e) => {
        e.preventDefault();
        toast.success("Booking request sent! We will contact you soon.");
        setSelectedRoom(null);
    };

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center text-white">
                {/* Desktop Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center hidden md:block"
                    style={{
                        backgroundImage: "url('/hero (2).png')",
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                </div>

                {/* Mobile Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center md:hidden"
                    style={{
                        backgroundImage: "url('/hero for mobail.png')",
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                </div>

                <div className="relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >

                        <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 font-serif">
                            Leopard Hotel
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl font-light mb-10 text-gray-200">
                            Experience unparalleled comfort and legendary hospitality in the heart of Waipukurau.
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <Link to="/rooms" className="px-10 py-4 bg-accent-gold text-white tracking-widest hover:bg-opacity-90 transition-all w-full md:w-auto">
                                VIEW ROOMS
                            </Link>

                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Premium Overview Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                        {/* Left Side: Arched Images */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative w-full lg:w-1/2 flex items-end justify-center lg:justify-start"
                        >
                            <div className="relative">
                                {/* First Image (Arched Top) */}
                                <div className="w-[280px] md:w-[350px] h-[400px] md:h-[500px] rounded-t-full border-8 border-white shadow-2xl overflow-hidden z-20 relative">
                                    <img
                                        src="/luxury-suite.png"
                                        alt="Luxury Suite"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Second Image (Arched Top, Offset) */}
                                <div className="absolute -right-16 md:-right-24 bottom-0 w-[240px] md:w-[300px] h-[350px] md:h-[450px] rounded-t-full border-8 border-white shadow-2xl overflow-hidden z-10 hidden md:block">
                                    <img
                                        src="/luxury-lobby.png"
                                        alt="Luxury Lobby"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Rotating "About Us" Badge */}
                                <div className="absolute top-10 -right-20 md:-right-28 z-30 hidden md:block">
                                    <Link to="/rooms" className="relative group cursor-pointer w-28 h-28 bg-[#1a1a1a] rounded-full flex items-center justify-center p-2 shadow-xl hover:scale-105 transition-transform block">
                                        <div className="absolute inset-0 animate-spin-slow">
                                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                                                <text className="text-[10px] uppercase font-bold tracking-[0.2em] fill-white">
                                                    <textPath xlinkHref="#circlePath">
                                                        Book Now • Leopard Hotel • Excellence •
                                                    </textPath>
                                                </text>
                                            </svg>
                                        </div>
                                        <ArrowUpRight className="text-accent-gold w-8 h-8 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side: Content & Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-full lg:w-1/2"
                        >
                            <span className="text-gray-500 tracking-[0.3em] text-xs font-semibold mb-3 block uppercase font-sans">The Leopard Hotel</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
                                Where Elegance Meets <span className="text-accent-gold italic">Excellence</span>
                            </h2>

                            <div className="space-y-6 text-gray-500 font-light leading-relaxed mb-12 max-w-xl text-sm md:text-base">
                                <p>
                                    Nestled in the heart of Hawke's Bay, Leopard Hotel stands as a beacon of elegance and sophistication. Our hotel seamlessly blends timeless charm with modern amenities, offering an unparalleled experience for discerning travelers.
                                </p>
                                <p className="hidden md:block">
                                    Our commitment to legendary hospitality ensures that every guest feels like royalty. From our meticulously designed suites to our world-class facilities, we provide a sanctuary of comfort and style.
                                </p>
                            </div>

                            <div className="pt-8 border-t border-gray-100 italic text-gray-400 font-serif text-lg">
                                "Our legacy is built on the art of personalized service, where every detail is tailored to create an unforgettable stay for our cherished guests."
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Our Rooms Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 md:px-8 text-center mb-16">
                    <span className="text-accent-gold tracking-widest text-sm font-semibold mb-4 block uppercase font-sans">Accommodations</span>
                    <h2 className="text-4xl md:text-5xl font-serif">Our Luxurious Rooms</h2>
                </div>

                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {roomData.map((room) => (
                            <motion.div
                                key={room.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: room.id * 0.1 }}
                                className="bg-white group shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full"
                            >
                                <div className="relative overflow-hidden h-64">
                                    <img
                                        src={room.image}
                                        alt={room.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold tracking-widest text-gray-900 border border-gold">
                                        ${room.price}/NIGHT
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow text-center">
                                    <h3 className="text-xl font-serif mb-3 text-gray-900">{room.name}</h3>
                                    <div className="flex items-center justify-center space-x-4 mb-4 text-gray-400 text-xs tracking-widest">
                                        <div className="flex items-center"><Users size={14} className="mr-1" /> {room.capacity} GUESTS</div>
                                        <div className="flex items-center"><Maximize size={14} className="mr-1" /> {room.size}</div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedRoom(room)}
                                        className="mt-auto w-full py-3 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-white transition-all tracking-widest text-[10px] font-bold uppercase"
                                    >
                                        BOOK NOW
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Booking Modal (Copied logic from Rooms page) */}
            <AnimatePresence>
                {selectedRoom && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRoom(null)}
                            className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none flex flex-col md:flex-row"
                        >
                            <button
                                onClick={() => setSelectedRoom(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:text-accent-gold transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="md:w-1/2">
                                <img src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-full object-cover min-h-[300px]" />
                            </div>

                            <div className="md:w-1/2 p-10">
                                <span className="text-accent-gold tracking-widest text-xs font-bold mb-2 block uppercase font-sans">Booking Confirmation</span>
                                <h2 className="text-3xl mb-4 font-serif">{selectedRoom.name}</h2>
                                <div className="flex items-center space-x-4 mb-6 text-gray-500 text-sm">
                                    <div className="flex items-center"><Users size={16} className="mr-1" /> {selectedRoom.capacity} People</div>
                                    <div className="flex items-center"><Maximize size={16} className="mr-1" /> {selectedRoom.size}</div>
                                </div>

                                <p className="text-gray-600 mb-8 text-sm leading-relaxed">{selectedRoom.desc}</p>

                                <form onSubmit={handleBookNow} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] tracking-widest text-gray-400 block mb-1 font-bold">CHECK IN</label>
                                            <input type="date" className="w-full border-b border-gray-200 py-2 focus:border-accent-gold outline-none text-sm" required />
                                        </div>
                                        <div>
                                            <label className="text-[10px] tracking-widest text-gray-400 block mb-1 font-bold">CHECK OUT</label>
                                            <input type="date" className="w-full border-b border-gray-200 py-2 focus:border-accent-gold outline-none text-sm" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] tracking-widest text-gray-400 block mb-1 font-bold">FULL NAME</label>
                                        <input type="text" placeholder="John Doe" className="w-full border-b border-gray-200 py-2 focus:border-accent-gold outline-none text-sm" required />
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-accent-gold text-white tracking-widest text-xs font-bold hover:bg-opacity-90 transition-all mt-4 uppercase">
                                        CONFIRM BOOKING - ${selectedRoom.price}/NIGHT
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Facilities Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <span className="text-accent-gold tracking-widest text-sm font-semibold mb-4 block uppercase font-sans">WHY CHOOSE US</span>
                    <h2 className="text-4xl mb-16 font-serif underline decoration-accent-gold/40 underline-offset-8">Unrivaled Facilities</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {highlights.map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="bg-gray-50 p-8 rounded-none border border-gray-100 hover:shadow-lg transition-all"
                            >
                                <div className="text-accent-gold mb-4 flex justify-center">{item.icon}</div>
                                <h3 className="text-xl mb-2 font-serif">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Location teaser */}
            <section className="py-24 relative overflow-hidden text-white">
                <div
                    className="absolute inset-0 bg-fixed bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1507501336603-6e31db2be093?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl mb-8">Located in the Heart of Hawke's Bay</h2>
                    <p className="max-w-2xl mx-auto mb-10 text-lg md:text-xl font-light opacity-90">
                        Conveniently situated near Waipukurau Golf Club and Waipukurau Museum. Explore the best of New Zealand's scenery and culture right at our doorstep.
                    </p>
                    <Link to="/contact" className="inline-block px-10 py-4 border-2 border-white text-white tracking-widest hover:bg-white hover:text-gray-900 transition-all">
                        GET DIRECTIONS
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
