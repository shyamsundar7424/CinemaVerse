import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE } from '../utils/api';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';
import { Search, Play, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Documentary', 'Anime'];

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [featured, setFeatured] = useState(null);
    const catRef = useRef(null);

    useEffect(() => {
        const id = setTimeout(fetchMovies, 450);
        return () => clearTimeout(id);
    }, [search, category]);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/api/movies?search=${search}&category=${category}`);
            setMovies(res.data);
            if (!featured && res.data.length > 0) setFeatured(res.data[0]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const scrollCats = (dir) => {
        if (catRef.current) catRef.current.scrollBy({ left: dir * 180, behavior: 'smooth' });
    };

    const featuredImg = featured
        ? (featured.image.startsWith('/uploads/') ? `${API_BASE}${featured.image}` : featured.image)
        : null;

    return (
        <div className="flex flex-col gap-8 md:gap-12 pb-12">

            {/* ── Hero Section ─────────────────────────────── */}
            {featured && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="hero-banner"
                    style={{ minHeight: 420 }}
                >
                    <img src={featuredImg} alt={featured.title} className="hero-bg" />
                    <div className="hero-overlay" />

                    {/* Glow accent */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                        width: '60%', height: 2,
                        background: 'linear-gradient(90deg, transparent, #a855f7, #00d4ff, transparent)',
                    }} />

                    <div className="relative z-10 p-6 md:p-10 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <p style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: '0.75rem', fontWeight: 700,
                                letterSpacing: '0.25em', color: '#a855f7',
                                textTransform: 'uppercase', marginBottom: 10,
                            }}>🔥 Featured Today</p>

                            <h1 style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 900, fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                                lineHeight: 1.1, letterSpacing: '-0.03em',
                                textShadow: '0 0 30px rgba(168,85,247,0.5)',
                                maxWidth: 600, marginBottom: 12,
                            }}>
                                {featured.title}
                            </h1>

                            <p style={{
                                color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif",
                                maxWidth: 480, lineHeight: 1.6, marginBottom: 24,
                                fontSize: '0.95rem',
                                display: '-webkit-box', WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>
                                {featured.description}
                            </p>

                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                <Link to={`/movie/${featured._id}`} className="btn-download-primary btn-ripple" style={{ padding: '12px 28px' }}>
                                    <Play style={{ width: 18, height: 18, fill: 'currentColor' }} />
                                    Watch Now
                                </Link>
                                <a href={featured.movieLink} target="_blank" rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 8,
                                        padding: '12px 28px', borderRadius: 50,
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1.5px solid rgba(255,255,255,0.2)',
                                        color: '#fff', fontFamily: "'Outfit', sans-serif", fontWeight: 700,
                                        fontSize: '0.95rem', textDecoration: 'none',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.25s',
                                    }}
                                    className="hover:bg-white/15"
                                >
                                    <Download style={{ width: 17, height: 17 }} />
                                    Download
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}

            {/* ── Search ───────────────────────────────────── */}
            <div style={{ position: 'relative', maxWidth: 520, margin: '0 auto', width: '100%' }}>
                <Search style={{
                    position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
                    width: 18, height: 18, color: 'rgba(168,85,247,0.8)',
                }} />
                <input
                    type="text"
                    placeholder="Search your next favourite movie..."
                    className="input-field"
                    style={{ paddingLeft: 50, paddingRight: 20, fontSize: '0.95rem' }}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* ── Categories ───────────────────────────────── */}
            <div style={{ position: 'relative' }}>
                <p style={{
                    fontFamily: "'Outfit', sans-serif", fontWeight: 700,
                    fontSize: '0.75rem', letterSpacing: '0.2em',
                    color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 12,
                }}>Browse by Category</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Left arrow */}
                    <button onClick={() => scrollCats(-1)}
                        className="hidden md:flex"
                        style={{
                            flexShrink: 0, width: 36, height: 36, borderRadius: '50%',
                            background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)',
                            color: '#fff', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.2s',
                        }}
                    ><ChevronLeft style={{ width: 18, height: 18 }} /></button>

                    <div ref={catRef} style={{
                        display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6,
                        scrollbarWidth: 'none', msOverflowStyle: 'none', flex: 1,
                    }}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`category-pill ${category === cat ? 'active' : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Right arrow */}
                    <button onClick={() => scrollCats(1)}
                        className="hidden md:flex"
                        style={{
                            flexShrink: 0, width: 36, height: 36, borderRadius: '50%',
                            background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)',
                            color: '#fff', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.2s',
                        }}
                    ><ChevronRight style={{ width: 18, height: 18 }} /></button>
                </div>
            </div>

            {/* ── Movie Grid ───────────────────────────────── */}
            <div>
                <p style={{
                    fontFamily: "'Outfit', sans-serif", fontWeight: 700,
                    fontSize: '0.75rem', letterSpacing: '0.2em',
                    color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 16,
                }}>
                    {category === 'All' ? 'All Movies' : category} {!loading && `• ${movies.length} titles`}
                </p>

                {loading ? (
                    <div className="flex justify-center py-20"><Spinner /></div>
                ) : movies.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
                    >
                        {movies.map((movie, i) => (
                            <motion.div
                                key={movie._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                            >
                                <MovieCard movie={movie} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 80 }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎬</div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem' }}>
                            No movies found. Try a different search.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
