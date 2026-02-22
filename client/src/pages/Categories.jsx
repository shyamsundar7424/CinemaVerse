import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE } from '../utils/api';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';
import { ChevronLeft, ChevronRight, Grid } from 'lucide-react';
import { motion } from 'framer-motion';

const ALL_CATEGORIES = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Documentary', 'Anime'];

const CATEGORY_META = {
    Action: { emoji: '💥', desc: 'High-octane thrills and explosive sequences.' },
    Comedy: { emoji: '😂', desc: 'Laugh-out-loud stories that lighten the mood.' },
    Drama: { emoji: '🎭', desc: 'Deep emotional journeys and real-life stories.' },
    Horror: { emoji: '👻', desc: 'Spine-chilling scares and suspenseful plots.' },
    'Sci-Fi': { emoji: '🚀', desc: 'Futuristic worlds, technology, and the unknown.' },
    Documentary: { emoji: '🎥', desc: 'Real stories and facts that inspire.' },
    Anime: { emoji: '⚡', desc: 'Japanese animated masterpieces.' },
};

const Categories = () => {
    const [active, setActive] = useState('Action');
    const [movies, setMovies] = useState([]);
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch counts for all categories
    useEffect(() => {
        const fetchCounts = async () => {
            const results = {};
            await Promise.all(ALL_CATEGORIES.map(async (cat) => {
                try {
                    const res = await axios.get(`${API_BASE}/api/movies?category=${cat}`);
                    results[cat] = res.data.length;
                } catch { results[cat] = 0; }
            }));
            setCounts(results);
        };
        fetchCounts();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/api/movies?category=${active}`);
                setMovies(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetch();
    }, [active]);

    return (
        <div style={{ paddingBottom: 60 }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <Grid style={{ width: 28, height: 28, color: '#a855f7' }} />
                    <h1 style={{
                        fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '2.2rem',
                        background: 'linear-gradient(135deg, #a855f7, #00d4ff)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>Browse Categories</h1>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif" }}>
                    Explore our collection by genre — find exactly what you're in the mood for.
                </p>
            </motion.div>

            {/* Category Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 14, marginBottom: 40,
            }}>
                {ALL_CATEGORIES.map((cat) => {
                    const meta = CATEGORY_META[cat];
                    const isActive = active === cat;
                    return (
                        <button key={cat} onClick={() => setActive(cat)} style={{
                            padding: '20px 16px', borderRadius: 16, cursor: 'pointer',
                            background: isActive
                                ? 'linear-gradient(135deg, rgba(168,85,247,0.4), rgba(0,212,255,0.3))'
                                : 'rgba(255,255,255,0.04)',
                            border: isActive
                                ? '1.5px solid rgba(168,85,247,0.6)'
                                : '1.5px solid rgba(255,255,255,0.08)',
                            textAlign: 'center',
                            transition: 'all 0.25s',
                            boxShadow: isActive ? '0 0 20px rgba(168,85,247,0.3)' : 'none',
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{meta.emoji}</div>
                            <div style={{
                                fontFamily: "'Outfit', sans-serif", fontWeight: 700,
                                fontSize: '0.95rem', color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                                marginBottom: 4,
                            }}>{cat}</div>
                            <div style={{
                                fontSize: '0.72rem', fontWeight: 600,
                                color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
                            }}>
                                {counts[cat] ?? '...'} titles
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Selected Category Info */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '2rem' }}>{CATEGORY_META[active]?.emoji}</span>
                    <h2 style={{
                        fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.5rem',
                    }}>{active}</h2>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                        — {CATEGORY_META[active]?.desc}
                    </span>
                </div>
            </div>

            {/* Movies Grid */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><Spinner /></div>
            ) : movies.length > 0 ? (
                <motion.div
                    key={active}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                    style={{ display: 'grid', gap: 20 }}
                >
                    {movies.map((movie, i) => (
                        <motion.div key={movie._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <MovieCard movie={movie} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>{CATEGORY_META[active]?.emoji}</div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Outfit', sans-serif" }}>
                        No {active} movies available yet. Check back soon!
                    </p>
                </div>
            )}
        </div>
    );
};

export default Categories;
