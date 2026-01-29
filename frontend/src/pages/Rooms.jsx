import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Maximize, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchRooms } from '../api';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [selectedType, setSelectedType] = useState('all');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedCapacity, setSelectedCapacity] = useState('');


    // Sort state
    const [sortBy, setSortBy] = useState('price-asc');

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            const response = await fetchRooms();
            if (response.data.success) {
                const transformedRooms = response.data.data.map(room => ({
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
                    status: room.status,
                    room_number: room.room_number,
                    room_type: room.room_type
                }));
                setRooms(transformedRooms);
            }
        } catch (error) {
            console.error('Error loading rooms:', error);
            toast.error('Failed to load rooms. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get unique room types for filter
    const roomTypes = [...new Set(rooms.map(room => room.room_type))];

    // Filter and sort rooms
    const filteredAndSortedRooms = rooms
        .filter(room => {
            // Type filter
            const matchesType = selectedType === 'all' || room.room_type === selectedType;

            // Price range filter
            const matchesPriceMin = !priceRange.min || room.price >= parseFloat(priceRange.min);
            const matchesPriceMax = !priceRange.max || room.price <= parseFloat(priceRange.max);

            // Capacity filter
            const matchesCapacity = !selectedCapacity || room.capacity === parseInt(selectedCapacity);

            // Status filter - only available rooms are returned by API now
            const matchesStatus = room.status === 'available';

            return matchesType && matchesPriceMin && matchesPriceMax && matchesCapacity && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'capacity-asc':
                    return a.capacity - b.capacity;
                case 'capacity-desc':
                    return b.capacity - a.capacity;
                case 'type':
                    return a.room_type.localeCompare(b.room_type);
                default:
                    return 0;
            }
        });

    const clearFilters = () => {
        setSelectedType('all');
        setPriceRange({ min: '', max: '' });
        setSelectedCapacity('');

        setSortBy('price-asc');
    };

    const hasActiveFilters = selectedType !== 'all' || priceRange.min || priceRange.max || selectedCapacity || sortBy !== 'price-asc';

    if (loading) {
        return (
            <div className="pt-24 pb-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent-gold border-t-transparent"></div>
                    <p className="mt-4 text-gray-500">Loading our beautiful rooms...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 bg-gray-50">
            {/* Header */}
            <div className="bg-white py-16 mb-8 shadow-sm">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl mb-4">Our Accommodations</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Choose from our selection of meticulously designed rooms, each offering a unique blend of comfort and modern convenience.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Filter Bar */}
                <div className="bg-white rounded-none shadow-md p-4 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 border transition-all ${showFilters ? 'bg-accent-gold text-white border-accent-gold' : 'border-gray-300 hover:border-accent-gold'
                                    }`}
                            >
                                <SlidersHorizontal size={18} />
                                <span className="text-sm tracking-wider">FILTERS</span>
                                {hasActiveFilters && (
                                    <span className="ml-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>

                            <div className="text-sm text-gray-600">
                                Showing <span className="font-bold text-accent-gold">{filteredAndSortedRooms.length}</span> of {rooms.length} rooms
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-600 hidden md:block">SORT BY:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-accent-gold"
                            >
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="capacity-asc">Capacity: Low to High</option>
                                <option value="capacity-desc">Capacity: High to Low</option>
                                <option value="type">Room Type</option>
                            </select>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-6 mt-6 border-t border-gray-200">
                                    <div className="grid md:grid-cols-4 gap-6">
                                        {/* Room Type Filter */}
                                        <div>
                                            <label className="block text-xs tracking-widest text-gray-400 mb-2">ROOM TYPE</label>
                                            <select
                                                value={selectedType}
                                                onChange={(e) => setSelectedType(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-accent-gold"
                                            >
                                                <option value="all">All Types</option>
                                                {roomTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Capacity Filter */}
                                        <div>
                                            <label className="block text-xs tracking-widest text-gray-400 mb-2">GUESTS</label>
                                            <select
                                                value={selectedCapacity}
                                                onChange={(e) => setSelectedCapacity(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-accent-gold"
                                            >
                                                <option value="">Any</option>
                                                <option value="1">1 Guest</option>
                                                <option value="2">2 Guests</option>
                                                <option value="3">3 Guests</option>
                                                <option value="4">4 Guests</option>
                                            </select>
                                        </div>

                                        {/* Price Range */}
                                        <div>
                                            <label className="block text-xs tracking-widest text-gray-400 mb-2">MIN. PRICE ($)</label>
                                            <input
                                                type="number"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                                placeholder="0"
                                                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-accent-gold"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs tracking-widest text-gray-400 mb-2">MAX. PRICE ($)</label>
                                            <input
                                                type="number"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                                placeholder="1000"
                                                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-accent-gold"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-6">


                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearFilters}
                                                className="text-sm text-accent-gold hover:underline"
                                            >
                                                Clear All Filters
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Rooms Grid */}
                {filteredAndSortedRooms.length === 0 ? (
                    <div className="bg-white rounded-none shadow-md p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <SlidersHorizontal size={48} className="mx-auto mb-4 opacity-50" />
                        </div>
                        <h3 className="text-2xl mb-2 text-gray-600">No Rooms Found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your filters to see more options</p>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-3 bg-accent-gold text-white hover:bg-opacity-90 transition-all"
                        >
                            CLEAR FILTERS
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
                        {filteredAndSortedRooms.map((room) => (
                            <motion.div
                                key={room.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-none overflow-hidden shadow-lg flex flex-col md:flex-row md:h-[250px] group"
                            >
                                <div className="md:w-1/2 relative overflow-hidden h-40 md:h-full">
                                    <img
                                        src={room.image}
                                        alt={room.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {room.status === 'available' && (
                                        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 text-xs font-bold">
                                            AVAILABLE
                                        </div>
                                    )}
                                </div>
                                <div className="md:w-1/2 p-4 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-xs text-accent-gold tracking-wider mb-1">{room.room_type.toUpperCase()}</p>
                                            <h3 className="text-2xl font-serif">Room {room.room_number}</h3>
                                        </div>
                                        <div className="text-accent-gold font-bold text-right">
                                            <span className="text-lg">${room.price}</span>
                                            <span className="text-xs text-gray-400 font-normal block">/ night</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-[11px] mb-2 line-clamp-2">{room.desc}</p>

                                    <div className="flex items-center space-x-4 mb-2 text-gray-400 text-[9px] tracking-widest">
                                        <div className="flex items-center">
                                            <Users size={16} className="mr-2" /> {room.capacity} GUESTS
                                        </div>
                                        <div className="flex items-center">
                                            <Maximize size={16} className="mr-2" /> {room.size}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/rooms/${room.id}`}
                                        className={`w-full py-3 border transition-all tracking-widest text-xs text-center font-medium ${room.status === 'available'
                                            ? 'border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-white'
                                            : 'border-gray-300 text-gray-400 cursor-not-allowed pointer-events-none'
                                            }`}
                                    >
                                        {room.status === 'available' ? 'VIEW DETAILS & BOOK' : 'CURRENTLY UNAVAILABLE'}
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rooms;
