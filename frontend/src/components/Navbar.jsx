import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Rooms', path: '/rooms' },
        { name: 'Contact', path: '/contact' },
    ];

    const isHomePage = location.pathname === '/';

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                ? (isHomePage ? 'bg-white/70 backdrop-blur-md shadow-md py-4' : 'bg-white shadow-md py-4')
                : (isHomePage ? 'bg-transparent py-6' : 'bg-white shadow-md py-4')
                }`}
        >
            <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <img src="/logo (4).png" alt="Leopard Hotel Logo" className="h-14 w-auto object-contain" />
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-sm tracking-widest hover:text-accent-gold transition-colors ${location.pathname === link.path
                                ? 'text-accent-gold border-b border-accent-gold'
                                : (scrolled || !isHomePage ? 'text-gray-700' : 'text-white')
                                }`}
                        >
                            {link.name.toUpperCase()}
                        </Link>
                    ))}
                    <Link
                        to="/rooms"
                        className="bg-accent-gold text-white px-6 py-2 rounded-none hover:bg-opacity-90 transition-all text-sm tracking-widest"
                    >
                        BOOK NOW
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`${scrolled || !isHomePage ? 'text-gray-900' : 'text-white'} focus:outline-none`}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-xl animate-fade-in-down">
                    <div className="flex flex-col p-4 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-lg tracking-widest ${location.pathname === link.path ? 'text-accent-gold' : 'text-gray-800'
                                    }`}
                            >
                                {link.name.toUpperCase()}
                            </Link>
                        ))}
                        <Link
                            to="/rooms"
                            onClick={() => setIsOpen(false)}
                            className="bg-accent-gold text-white px-6 py-3 text-center tracking-widest"
                        >
                            BOOK NOW
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
