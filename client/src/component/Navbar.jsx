import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from '../assets/assets';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/Experience' },
        { name: 'About', path: '/' },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isHome = location.pathname === "/";

        const handleScroll = () => {
            if (!isHome) {
                setIsScrolled(true);
            } else {
                setIsScrolled(window.scrollY > 10);
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <nav className={`fixed top-0 left-0  w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

            {/* Logo */}
            <Link to='/'>
                <img src={assets.logo} alt="logo" className={`h-9 ${isScrolled && "invert opacity-80"}`} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <a key={i} href={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}>
                        {link.name}
                        <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                    </a>
                ))}
                {user && user.role === 'hotelOwner' && (
                    <button onClick={() => navigate('/owner')} className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`}>
                        Dashboard
                    </button>
                )}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                {/* <img src={assets.searchIcon} alt="search" className={`${isScrolled && "invert "} h-7 transition-all duration-500`} /> */}

                {isAuthenticated ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full ${isScrolled ? 'bg-gray-100' : 'bg-white/20'} transition-all`}
                        >
                            <img src={assets.userIcon} alt="user" className={`h-5 ${isScrolled && "invert"}`} />
                            <span className={`text-sm ${isScrolled ? 'text-gray-700' : 'text-white'}`}>{user?.name}</span>
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                <button
                                    onClick={() => { navigate('/my-bookings'); setShowUserMenu(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                                >
                                    My Bookings
                                </button>
                                <button
                                    onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')} className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${isScrolled ? "text-white bg-black" : "bg-black text-white"}`}>
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                {isAuthenticated && (
                    <button onClick={() => setShowUserMenu(!showUserMenu)}>
                        <img src={assets.userIcon} alt="user" className={`h-5 ${isScrolled && "invert"}`} />
                    </button>
                )}
                <img onClick={() => setIsMenuOpen(!isMenuOpen)} src={assets.menuIcon} alt="" className={`${isScrolled && "invert"} h-4`} />
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <img src={assets.closeIcon} alt="close menu" className="h-6.5" />
                </button>

                {navLinks.map((link, i) => (
                    <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                        {link.name}
                    </a>
                ))}

                {user && user.role === 'hotelOwner' && <button onClick={() => { navigate('/owner'); setIsMenuOpen(false); }} className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
                    Dashboard
                </button>}

                {user && <button onClick={() => { navigate('/my-bookings'); setIsMenuOpen(false); }} className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
                    My Bookings
                </button>}

                {user && <button onClick={() => { navigate('/profile'); setIsMenuOpen(false); }} className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
                    Profile
                </button>}

                {isAuthenticated ? (
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="bg-red-600 text-white px-8 py-2.5 rounded-full transition-all duration-500">
                        Logout
                    </button>
                ) : (
                    <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar