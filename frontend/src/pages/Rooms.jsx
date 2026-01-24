import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Maximize, Wifi, Coffee, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Rooms = () => {
    const [selectedRoom, setSelectedRoom] = useState(null);

    const roomData = [
        {
            id: 1,
            name: "Standard Single Room",
            price: 180,
            image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            capacity: 1,
            size: "22m²",
            desc: "Perfect for solo travelers, featuring a comfortable single bed and a modern workspace.",
            amenities: ["Free WiFi", "Private Bathroom", "Work Desk", "TV", "Toiletries"]
        },
        {
            id: 2,
            name: "Deluxe Double Room",
            price: 250,
            image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            capacity: 2,
            size: "30m²",
            desc: "Spacious room with a queen-sized bed, ideal for couples seeking comfort and style.",
            amenities: ["Free WiFi", "Private Bathroom", "Sitting Area", "TV", "Room Service"]
        },
        {
            id: 3,
            name: "Family Suite",
            price: 420,
            image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            capacity: 4,
            size: "50m²",
            desc: "Expansive suite designed for families, with interconnected rooms and premium facilities.",
            amenities: ["Free WiFi", "2 Bedrooms", "Large TV", "Mini Bar", "Garden View"]
        },
        {
            id: 4,
            name: "Premium Twin Room",
            price: 280,
            image: "https://plus.unsplash.com/premium_photo-1661875135365-16aab794632f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bHV4dXJ5JTIwaG90ZWwlMjByb29tfGVufDB8fDB8fHww",
            capacity: 2,
            size: "32m²",
            desc: "Features two comfortable single beds and elegant decor for a relaxing stay.",
            amenities: ["Free WiFi", "Bright Lighting", "Desk", "Coffee Maker", "Tea Service"]
        }
    ];

    const handleBookNow = (e) => {
        e.preventDefault();
        toast.success("Booking request sent! We will contact you soon.");
        setSelectedRoom(null);
    };

    return (
        <div className="pt-24 pb-20 bg-gray-50">
            {/* Header */}
            <div className="bg-white py-16 mb-12 shadow-sm">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl mb-4">Our Accommodations</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Choose from our selection of meticulously designed rooms, each offering a unique blend of comfort and modern convenience.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
                    {roomData.map((room) => (
                        <motion.div
                            key={room.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-none overflow-hidden shadow-lg flex flex-col md:flex-row h-full group"
                        >
                            <div className="md:w-1/2 relative overflow-hidden">
                                <img
                                    src={room.image}
                                    alt={room.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="md:w-1/2 p-8 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-serif">{room.name}</h3>
                                    <div className="text-accent-gold font-bold">
                                        <span className="text-lg">${room.price}</span>
                                        <span className="text-xs text-gray-400 font-normal"> / night</span>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm mb-6 flex-grow">{room.desc}</p>

                                <div className="flex items-center space-x-6 mb-8 text-gray-400 text-xs tracking-widest">
                                    <div className="flex items-center">
                                        <Users size={16} className="mr-2" /> {room.capacity} GUESTS
                                    </div>
                                    <div className="flex items-center">
                                        <Maximize size={16} className="mr-2" /> {room.size}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedRoom(room)}
                                    className="w-full py-4 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-white transition-all tracking-widest text-sm"
                                >
                                    VIEW DETAILS & BOOK
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Booking Modal */}
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
                                <span className="text-accent-gold tracking-widest text-xs font-bold mb-2 block uppercase">PREMIUM STAY</span>
                                <h2 className="text-3xl mb-4">{selectedRoom.name}</h2>
                                <div className="flex items-center space-x-4 mb-6 text-gray-500 text-sm">
                                    <div className="flex items-center"><Users size={16} className="mr-1" /> {selectedRoom.capacity} People</div>
                                    <div className="flex items-center"><Maximize size={16} className="mr-1" /> {selectedRoom.size}</div>
                                </div>

                                <p className="text-gray-600 mb-8">{selectedRoom.desc}</p>

                                <div className="mb-8">
                                    <h4 className="text-sm font-bold tracking-widest mb-4">AMENITIES</h4>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                        {selectedRoom.amenities.map(amenity => (
                                            <div key={amenity} className="flex items-center text-sm text-gray-500">
                                                <div className="w-1.5 h-1.5 bg-accent-gold rounded-full mr-3"></div>
                                                {amenity}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <form onSubmit={handleBookNow} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] tracking-widest text-gray-400 block mb-1">CHECK IN</label>
                                            <input type="date" className="w-full border-b border-gray-200 py-2 focus:border-accent-gold outline-none text-sm" required />
                                        </div>
                                        <div>
                                            <label className="text-[10px] tracking-widest text-gray-400 block mb-1">CHECK OUT</label>
                                            <input type="date" className="w-full border-b border-gray-200 py-2 focus:border-accent-gold outline-none text-sm" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] tracking-widest text-gray-400 block mb-1">FULL NAME</label>
                                        <input type="text" placeholder="John Doe" className="w-full border-b border-gray-200 py-2 focus:border-accent-gold outline-none text-sm" required />
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-accent-gold text-white tracking-widest text-sm hover:bg-opacity-90 transition-all mt-4">
                                        CONFIRM BOOKING - ${selectedRoom.price}/NIGHT
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Rooms;
