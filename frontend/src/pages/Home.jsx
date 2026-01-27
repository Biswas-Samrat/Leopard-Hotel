import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wifi, Coffee, Utensils, Car, Users, Maximize, ArrowRight, ArrowUpRight, Heart, ShieldCheck, Clock } from 'lucide-react';
import { fetchRooms, fetchSettings } from '../api';
import toast from 'react-hot-toast';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState({
        hero_desktop: '/hero (2).png',
        hero_mobile: '/hero for mobail.png',
        elegance_top: '/luxury-suite.png',
        elegance_bottom: '/luxury-lobby.png',
        featured_rooms: []
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [roomsRes, settingsRes] = await Promise.all([
                fetchRooms(),
                fetchSettings('home_page')
            ]);

            let allRooms = [];
            if (roomsRes.data.success) {
                allRooms = roomsRes.data.data.map(room => ({
                    id: room.id,
                    name: `${room.room_type} - Room ${room.room_number}`,
                    price: parseFloat(room.price_per_night),
                    image: (() => {
                        const imgs = room.images ? (typeof room.images === 'string' ? JSON.parse(room.images) : room.images) : [];
                        const mainImg = imgs.find(img => img.isMain) || imgs[0];
                        return mainImg?.url || `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
                    })(),
                    capacity: room.capacity,
                    size: `${Math.floor(20 + room.capacity * 5)}m²`,
                    desc: room.description || `Experience comfort in our ${room.room_type.toLowerCase()} accommodation.`,
                    amenities: room.amenities ? room.amenities.split(',').map(a => a.trim()) : ['Free WiFi', 'Private Bathroom', 'TV'],
                }));
            }

            if (settingsRes.data.success) {
                const savedConfig = settingsRes.data.data;
                setConfig(prev => ({ ...prev, ...savedConfig }));

                if (savedConfig.featured_rooms?.length > 0) {
                    // Order rooms based on featured_rooms array
                    const ordered = [];
                    savedConfig.featured_rooms.forEach(id => {
                        const r = allRooms.find(room => room.id === parseInt(id));
                        if (r) ordered.push(r);
                    });

                    // If less than 8 featured, fill with others
                    if (ordered.length < 8) {
                        const others = allRooms.filter(r => !savedConfig.featured_rooms.includes(r.id));
                        setRooms([...ordered, ...others].slice(0, 8));
                    } else {
                        setRooms(ordered.slice(0, 8));
                    }
                } else {
                    setRooms(allRooms.slice(0, 8));
                }
            } else {
                setRooms(allRooms.slice(0, 8));
            }
        } catch (error) {
            console.error('Error loading home data:', error);
        } finally {
            setLoading(false);
        }
    };

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
                        backgroundImage: `url('${config.hero_desktop}')`,
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                </div>

                {/* Mobile Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center md:hidden"
                    style={{
                        backgroundImage: `url('${config.hero_mobile}')`,
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
                                        src={config.elegance_top}
                                        alt="Luxury Suite"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Second Image (Arched Top, Offset) */}
                                <div className="absolute -right-16 md:-right-24 bottom-0 w-[240px] md:w-[300px] h-[350px] md:h-[450px] rounded-t-full border-8 border-white shadow-2xl overflow-hidden z-10 hidden md:block">
                                    <img
                                        src={config.elegance_bottom}
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
            {rooms.length > 0 && (
                <section className="py-24 bg-gray-50">
                    <div className="container mx-auto px-4 md:px-8 text-center mb-16">
                        <span className="text-accent-gold tracking-widest text-sm font-semibold mb-4 block uppercase font-sans">Accommodations</span>
                        <h2 className="text-4xl md:text-5xl font-serif">Our Luxurious Rooms</h2>
                    </div>

                    <div className="container mx-auto px-4 md:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {rooms.map((room) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
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
                                        <Link
                                            to={`/rooms/${room.id}`}
                                            className="mt-auto w-full py-3 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-white transition-all tracking-widest text-[10px] font-bold uppercase text-center"
                                        >
                                            VIEW DETAILS
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

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
