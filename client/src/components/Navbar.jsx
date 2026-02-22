import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Film, Sun, Moon, Home, Grid, Info, HelpCircle, Shield } from 'lucide-react';
import { useTheme } from '../App';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const { dark, toggle } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setIsOpen(false); }, [location.pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchVal.trim()) {
            navigate(`/?search=${encodeURIComponent(searchVal.trim())}`);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
        { name: 'Categories', path: '/categories', icon: <Grid className="w-4 h-4" /> },
        { name: 'About', path: '/about', icon: <Info className="w-4 h-4" /> },
        { name: 'Help', path: '/help', icon: <HelpCircle className="w-4 h-4" /> },
    ];

    const isActive = (path) => location.pathname === path || (path === '/' && location.pathname === '/');

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-blur shadow-lg' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16 md:h-18 gap-4">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                        <div style={{
                            width: 38, height: 38,
                            background: 'linear-gradient(135deg, #a855f7, #00d4ff)',
                            borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 16px rgba(168,85,247,0.5)',
                            transition: 'box-shadow 0.3s',
                        }}
                            className="group-hover:shadow-[0_0_28px_rgba(168,85,247,0.9)]"
                        >
                            <Film style={{ width: 20, height: 20, color: '#fff' }} />
                        </div>
                        <span style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 900, fontSize: '1.35rem', letterSpacing: '-0.03em',
                        }}>
                            Cinema
                            <span style={{
                                background: 'linear-gradient(90deg, #a855f7, #00d4ff)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>Verse</span>
                        </span>
                    </Link>

                    {/* Centered Search — desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
                        <div style={{ position: 'relative', width: '100%' }}>
                            <Search style={{
                                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                                width: 17, height: 17,
                                color: searchFocused ? '#a855f7' : 'rgba(255,255,255,0.4)',
                                transition: 'color 0.2s',
                            }} />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search movies, genres..."
                                value={searchVal}
                                onChange={e => setSearchVal(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                style={{ paddingLeft: 44 }}
                                className="input-field"
                            />
                        </div>
                    </form>

                    {/* Right: Nav Links + Theme Toggle */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map(link => (
                            <Link key={link.name} to={link.path}
                                style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}
                                className={`text-sm font-semibold tracking-wide transition-colors duration-200 ${isActive(link.path) ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <motion.span layoutId="nav-underline" style={{
                                        position: 'absolute', bottom: -4, left: 0, right: 0,
                                        height: 2, borderRadius: 1,
                                        background: 'linear-gradient(90deg, #a855f7, #00d4ff)',
                                    }} />
                                )}
                            </Link>
                        ))}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggle}
                            aria-label="Toggle theme"
                            style={{
                                width: 40, height: 40,
                                borderRadius: '50%',
                                background: dark ? 'rgba(168,85,247,0.15)' : 'rgba(255,200,50,0.15)',
                                border: `1.5px solid ${dark ? 'rgba(168,85,247,0.4)' : 'rgba(255,200,50,0.5)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                            }}
                            className="hover:scale-110"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {dark ? (
                                    <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
                                        <Sun style={{ width: 18, height: 18, color: '#ffd700' }} />
                                    </motion.span>
                                ) : (
                                    <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.25 }}>
                                        <Moon style={{ width: 18, height: 18, color: '#a855f7' }} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        {/* Admin Button */}
                        <Link to="/admin" style={{
                            display: 'flex', alignItems: 'center', gap: 7,
                            padding: '8px 16px', borderRadius: 50,
                            background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(0,212,255,0.15))',
                            border: '1.5px solid rgba(168,85,247,0.5)',
                            color: '#fff', textDecoration: 'none',
                            fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.82rem',
                            letterSpacing: '0.03em',
                            boxShadow: '0 0 12px rgba(168,85,247,0.25)',
                            transition: 'all 0.25s',
                            whiteSpace: 'nowrap',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 22px rgba(168,85,247,0.55)'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.9)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 12px rgba(168,85,247,0.25)'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; }}
                        >
                            <Shield style={{ width: 15, height: 15, color: '#a855f7' }} />
                            Admin
                        </Link>
                    </div>

                    {/* Mobile: Theme + Hamburger */}
                    <div className="flex md:hidden items-center gap-3">
                        <button onClick={toggle} style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'rgba(168,85,247,0.15)',
                            border: '1.5px solid rgba(168,85,247,0.35)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                        }}>
                            {dark ? <Sun style={{ width: 16, height: 16, color: '#ffd700' }} /> : <Moon style={{ width: 16, height: 16, color: '#a855f7' }} />}
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} style={{
                            width: 36, height: 36, borderRadius: 8,
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}>
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="glass-card p-4 mb-3 flex flex-col gap-2">
                                {/* Mobile search */}
                                <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'rgba(255,255,255,0.4)' }} />
                                    <input
                                        type="text" placeholder="Search movies..."
                                        value={searchVal} onChange={e => setSearchVal(e.target.value)}
                                        style={{ paddingLeft: 40 }} className="input-field"
                                    />
                                </form>
                                {navLinks.map(link => (
                                    <Link key={link.name} to={link.path}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all font-semibold"
                                    >
                                        {link.icon}
                                        {link.name}
                                    </Link>
                                ))}
                                {/* Admin link in mobile menu */}
                                <Link to="/admin"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '12px 16px', borderRadius: 12, textDecoration: 'none',
                                        background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(0,212,255,0.1))',
                                        border: '1.5px solid rgba(168,85,247,0.4)',
                                        color: '#fff', fontFamily: "'Outfit', sans-serif",
                                        fontWeight: 700, fontSize: '0.95rem', marginTop: 4,
                                    }}
                                >
                                    <Shield style={{ width: 17, height: 17, color: '#a855f7' }} />
                                    Admin Panel
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
