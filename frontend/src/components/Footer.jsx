import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#1a1a1a] text-white pt-20 pb-10">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid md:grid-cols-3 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="col-span-1">
                        <Link to="/" className="flex flex-col mb-6">
                            <span className="text-2xl font-bold tracking-widest text-white">LEOPARD</span>
                            <span className="text-xs tracking-[0.3em] font-light text-accent-gold uppercase">HOTEL & RESTAURANT</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Experience the best of New Zealand hospitality at the Leopard Hotel. Luxury rooms, global cuisine, and memories that last a lifetime.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-accent-gold transition-colors"><Facebook size={18} /></a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-accent-gold transition-colors"><Instagram size={18} /></a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-accent-gold transition-colors"><Twitter size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-serif mb-6 border-b border-gray-800 pb-2 inline-block">Explore</h3>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link to="/" className="hover:text-accent-gold transition-colors">Home</Link></li>
                            <li><Link to="/rooms" className="hover:text-accent-gold transition-colors">Our Rooms</Link></li>
                            <li><Link to="/contact" className="hover:text-accent-gold transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-serif mb-6 border-b border-gray-800 pb-2 inline-block">Visit Us</h3>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="flex items-start">
                                <MapPin size={18} className="mr-3 text-accent-gold shrink-0" />
                                <span>4/10 Ruataniwha Street, Waipukurau 4200, New Zealand</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="mr-3 text-accent-gold" />
                                <span>+64 6 858 9196</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="mr-3 text-accent-gold" />
                                <span>info@leopardhotel.co.nz</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 tracking-widest">
                    <p>© 2026 LEOPARD HOTEL WAIPUKURAU. ALL RIGHTS RESERVED.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a>
                        <a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
