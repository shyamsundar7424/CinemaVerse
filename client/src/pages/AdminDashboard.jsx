import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Edit, Trash2, Upload, X, LogOut, Film, Shield,
    BarChart2, Clock, Tag, Link as LinkIcon, Image, CheckCircle, AlertCircle,
    Play, Zap, Tv, List
} from 'lucide-react';

const CATEGORIES = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Documentary', 'Anime'];
const CONTENT_TYPES = ['Movie', 'Web Series'];

const CAT_COLORS = {
    Action: '#ff2d78', Comedy: '#ffd700', Drama: '#00d4ff',
    Horror: '#a855f7', 'Sci-Fi': '#00ffaa', Documentary: '#ff6b35', Anime: '#f472b6',
};

/* ── Stat Card ────────────────────────────────── */
const StatCard = ({ icon, label, value, accent }) => (
    <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: `${accent}22`,
            border: `1.5px solid ${accent}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            {icon}
        </div>
        <div>
            <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</p>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.7rem', lineHeight: 1 }}>{value}</p>
        </div>
    </div>
);

/* ── Category Bar ─────────────────────────────── */
const CatBar = ({ cat, count, total }) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    const color = CAT_COLORS[cat] || '#a855f7';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ minWidth: 80, fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{cat}</span>
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: 4, background: color, boxShadow: `0 0 8px ${color}88` }}
                />
            </div>
            <span style={{ minWidth: 28, fontSize: '0.78rem', fontWeight: 700, color, textAlign: 'right' }}>{count}</span>
        </div>
    );
};

/* ── Empty Episode template ───────────────────── */
const emptyEpisode = () => ({
    episodeNumber: 1,
    title: '',
    downloadLinkFast: '',
    downloadLinkNormal: '',
});

/* ── Main Component ───────────────────────────── */
const AdminDashboard = () => {
    const [movies, setMovies] = useState([]);
    const [formData, setFormData] = useState({
        title: '', category: 'Action', contentType: 'Movie',
        description: '', trailerLink: '', downloadLink: '', fastDownloadLink: '',
        year: '', rating: '',
    });
    const [episodes, setEpisodes] = useState([emptyEpisode()]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'add' | 'movies'
    const [deleteConfirm, setDeleteConfirm] = useState(null); // movie._id
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef(null);
    const formRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/admin'); return; }
        fetchMovies();
    }, [navigate]);

    const fetchMovies = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/movies`);
            setMovies(res.data);
        } catch { toast.error('Failed to load movies'); }
    };

    // Stats
    const catCounts = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = movies.filter(m => m.category === cat).length;
        return acc;
    }, {});
    const recentMovies = [...movies].slice(0, 8);
    const filteredMovies = movies.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('Image too large (max 5 MB)'); return; }
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    /* ── Episode Helpers ──────────────────────────── */
    const handleEpisodeChange = (index, field, value) => {
        const updated = [...episodes];
        updated[index] = { ...updated[index], [field]: value };
        setEpisodes(updated);
    };

    const addEpisode = () => {
        setEpisodes([...episodes, {
            episodeNumber: episodes.length + 1,
            title: `Episode ${episodes.length + 1}`,
            downloadLinkFast: '',
            downloadLinkNormal: '',
        }]);
    };

    const removeEpisode = (index) => {
        if (episodes.length <= 1) { toast.warning('Web Series must have at least one episode'); return; }
        const updated = episodes.filter((_, i) => i !== index);
        // Re-number episodes
        updated.forEach((ep, i) => { ep.episodeNumber = i + 1; });
        setEpisodes(updated);
    };

    /* ── Submit ────────────────────────────────────── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const data = new FormData();

        // Append standard fields
        Object.entries(formData).forEach(([k, v]) => { if (v !== undefined && v !== null) data.append(k, v); });
        if (imageFile) data.append('image', imageFile);

        // If Web Series, append episodes as JSON
        if (formData.contentType === 'Web Series') {
            data.append('episodes', JSON.stringify(episodes));
        }

        setIsLoading(true);
        try {
            const cfg = { headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' } };
            if (editingId) {
                await axios.put(`${API_BASE}/api/movies/${editingId}`, data, cfg);
                toast.success('✅ Movie updated successfully!');
            } else {
                if (!imageFile) { toast.error('Please select a poster image'); setIsLoading(false); return; }
                await axios.post(`${API_BASE}/api/movies`, data, cfg);
                toast.success('🎬 Added to database!');
            }
            resetForm();
            fetchMovies();
            setActiveTab('movies');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '', category: 'Action', contentType: 'Movie',
            description: '', trailerLink: '', downloadLink: '', fastDownloadLink: '',
            year: '', rating: '',
        });
        setEpisodes([emptyEpisode()]);
        setImageFile(null); setImagePreview(null); setEditingId(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleEdit = (movie) => {
        setFormData({
            title: movie.title, category: movie.category,
            contentType: movie.contentType || 'Movie',
            description: movie.description,
            trailerLink: movie.trailerLink || '',
            downloadLink: movie.downloadLink || movie.movieLink || '',
            fastDownloadLink: movie.fastDownloadLink || '',
            year: movie.year || '', rating: movie.rating || '',
        });
        if (movie.contentType === 'Web Series' && movie.episodes && movie.episodes.length > 0) {
            setEpisodes(movie.episodes.map(ep => ({
                episodeNumber: ep.episodeNumber,
                title: ep.title,
                downloadLinkFast: ep.downloadLinkFast || '',
                downloadLinkNormal: ep.downloadLinkNormal || '',
            })));
        } else {
            setEpisodes([emptyEpisode()]);
        }
        setEditingId(movie._id);
        setImagePreview(movie.image.startsWith('/uploads/') ? `${API_BASE}${movie.image}` : movie.image);
        setImageFile(null);
        setActiveTab('add');
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_BASE}/api/movies/${id}`, { headers: { 'x-auth-token': token } });
            toast.success('🗑️ Movie deleted successfully');
            setDeleteConfirm(null);
            fetchMovies();
        } catch { toast.error('Failed to delete movie'); }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin');
        toast.info('Logged out successfully');
    };

    const isWebSeries = formData.contentType === 'Web Series';

    /* ── NAV TABS ──────────────────────────────── */
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 style={{ width: 16, height: 16 }} /> },
        { id: 'add', label: editingId ? 'Edit Movie' : 'Add Movie', icon: <Plus style={{ width: 16, height: 16 }} /> },
        { id: 'movies', label: `All Movies (${movies.length})`, icon: <Film style={{ width: 16, height: 16 }} /> },
    ];

    /* ── Shared input style ────────────────────── */
    const episodeInputStyle = {
        flex: 1, minWidth: 0,
    };

    return (
        <div style={{ paddingBottom: 60 }}>
            {/* ── Header ──────────────────────────────── */}
            <div className="glass-card" style={{
                padding: '16px 24px', marginBottom: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                flexWrap: 'wrap',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: 10,
                        background: 'linear-gradient(135deg, #a855f7, #00d4ff)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(168,85,247,0.4)',
                    }}>
                        <Shield style={{ width: 20, height: 20, color: '#fff' }} />
                    </div>
                    <div>
                        <h1 style={{
                            fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.2rem',
                            letterSpacing: '-0.02em',
                        }}>Admin Dashboard</h1>
                        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                            CinemaVerse Management Portal
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '9px 18px', borderRadius: 50,
                        background: 'rgba(255,45,120,0.12)', border: '1.5px solid rgba(255,45,120,0.35)',
                        color: '#ff2d78', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.85rem',
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,45,120,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,45,120,0.12)'; }}
                >
                    <LogOut style={{ width: 15, height: 15 }} />
                    Logout
                </button>
            </div>

            {/* ── Tab Navigation ──────────────────────────────── */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id !== 'add') { resetForm(); } }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '10px 20px', borderRadius: 50,
                            background: activeTab === tab.id
                                ? 'linear-gradient(135deg, rgba(168,85,247,0.4), rgba(0,212,255,0.3))'
                                : 'rgba(255,255,255,0.04)',
                            border: activeTab === tab.id
                                ? '1.5px solid rgba(168,85,247,0.6)'
                                : '1.5px solid rgba(255,255,255,0.08)',
                            color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                            fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.88rem',
                            cursor: 'pointer', transition: 'all 0.25s',
                            boxShadow: activeTab === tab.id ? '0 0 16px rgba(168,85,247,0.3)' : 'none',
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* ══════════════════════════════════════════════
                    TAB 1: DASHBOARD
                ══════════════════════════════════════════════ */}
                {activeTab === 'dashboard' && (
                    <motion.div key="dashboard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* Stat Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                            <StatCard
                                icon={<Film style={{ width: 22, height: 22, color: '#a855f7' }} />}
                                label="Total Movies" value={movies.length} accent="#a855f7"
                            />
                            <StatCard
                                icon={<Tv style={{ width: 22, height: 22, color: '#00ffaa' }} />}
                                label="Web Series" value={movies.filter(m => m.contentType === 'Web Series').length} accent="#00ffaa"
                            />
                            <StatCard
                                icon={<Tag style={{ width: 22, height: 22, color: '#00d4ff' }} />}
                                label="Categories" value={CATEGORIES.length} accent="#00d4ff"
                            />
                            <StatCard
                                icon={<Clock style={{ width: 22, height: 22, color: '#ffd700' }} />}
                                label="Added This Week"
                                value={movies.filter(m => {
                                    const d = new Date(m.createdAt);
                                    return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
                                }).length}
                                accent="#ffd700"
                            />
                        </div>

                        {/* Category Breakdown + Recent */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

                            {/* Category Breakdown */}
                            <div className="glass-card" style={{ padding: '24px 28px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                    <BarChart2 style={{ width: 18, height: 18, color: '#a855f7' }} />
                                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem' }}>Category Breakdown</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {CATEGORIES.map(cat => (
                                        <CatBar key={cat} cat={cat} count={catCounts[cat] || 0} total={movies.length} />
                                    ))}
                                </div>
                            </div>

                            {/* Recently Added */}
                            <div className="glass-card" style={{ padding: '24px 28px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                    <Clock style={{ width: 18, height: 18, color: '#00d4ff' }} />
                                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem' }}>Recently Added</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {recentMovies.length === 0 ? (
                                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No movies yet.</p>
                                    ) : recentMovies.map(movie => (
                                        <div key={movie._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <img
                                                src={movie.image.startsWith('/uploads/') ? `${API_BASE}${movie.image}` : movie.image}
                                                alt={movie.title}
                                                style={{ width: 36, height: 50, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
                                            />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{
                                                    fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.88rem',
                                                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                                }}>{movie.title}</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <span style={{
                                                        fontSize: '0.68rem', fontWeight: 700,
                                                        color: CAT_COLORS[movie.category] || '#a855f7',
                                                        textTransform: 'uppercase', letterSpacing: '0.08em',
                                                    }}>{movie.category}</span>
                                                    {movie.contentType === 'Web Series' && (
                                                        <span style={{
                                                            fontSize: '0.6rem', fontWeight: 700,
                                                            padding: '1px 6px', borderRadius: 50,
                                                            background: 'rgba(0,255,170,0.12)', border: '1px solid rgba(0,255,170,0.3)',
                                                            color: '#00ffaa',
                                                        }}>SERIES</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                                <button onClick={() => handleEdit(movie)}
                                                    style={{
                                                        width: 30, height: 30, borderRadius: 8,
                                                        background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)',
                                                        color: '#00d4ff', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                    <Edit style={{ width: 13, height: 13 }} />
                                                </button>
                                                <button onClick={() => setDeleteConfirm(movie._id)}
                                                    style={{
                                                        width: 30, height: 30, borderRadius: 8,
                                                        background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.25)',
                                                        color: '#ff2d78', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                    <Trash2 style={{ width: 13, height: 13 }} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {movies.length > 8 && (
                                    <button onClick={() => setActiveTab('movies')} style={{
                                        marginTop: 14, fontSize: '0.8rem', color: '#a855f7',
                                        background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
                                    }}>View all {movies.length} movies →</button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ══════════════════════════════════════════════
                    TAB 2: ADD / EDIT MOVIE
                ══════════════════════════════════════════════ */}
                {activeTab === 'add' && (
                    <motion.div key="add" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        ref={formRef}>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24 }} className="grid-form-layout">
                            {/* Form */}
                            <div className="glass-card" style={{ padding: '28px 32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                                    {editingId
                                        ? <Edit style={{ width: 20, height: 20, color: '#00d4ff' }} />
                                        : <Plus style={{ width: 20, height: 20, color: '#a855f7' }} />}
                                    <h2 style={{
                                        fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.2rem',
                                        color: editingId ? '#00d4ff' : '#a855f7',
                                    }}>
                                        {editingId ? 'Edit Movie Details' : 'Add New Movie'}
                                    </h2>
                                    {editingId && (
                                        <span style={{
                                            marginLeft: 8, padding: '3px 10px', borderRadius: 50,
                                            background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.3)',
                                            fontSize: '0.7rem', fontWeight: 600, color: '#00d4ff',
                                        }}>Editing</span>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                                    {/* ── Content Type Toggle ───────────────── */}
                                    <div>
                                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                            <Tv style={{ width: 13, height: 13, color: '#00ffaa' }} />
                                            Content Type *
                                        </label>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {CONTENT_TYPES.map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, contentType: type })}
                                                    style={{
                                                        flex: 1, padding: '12px 16px', borderRadius: 12,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                                        background: formData.contentType === type
                                                            ? type === 'Movie'
                                                                ? 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(0,212,255,0.2))'
                                                                : 'linear-gradient(135deg, rgba(0,255,170,0.3), rgba(0,212,255,0.2))'
                                                            : 'rgba(255,255,255,0.04)',
                                                        border: formData.contentType === type
                                                            ? type === 'Movie'
                                                                ? '1.5px solid rgba(168,85,247,0.5)'
                                                                : '1.5px solid rgba(0,255,170,0.5)'
                                                            : '1.5px solid rgba(255,255,255,0.08)',
                                                        color: formData.contentType === type ? '#fff' : 'rgba(255,255,255,0.5)',
                                                        fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem',
                                                        cursor: 'pointer', transition: 'all 0.25s',
                                                    }}
                                                >
                                                    {type === 'Movie' ? <Film style={{ width: 16, height: 16 }} /> : <Tv style={{ width: 16, height: 16 }} />}
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Row: Title + Category */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-row">
                                        <div>
                                            <label className="form-label">Title *</label>
                                            <input name="title" value={formData.title} onChange={handleChange}
                                                placeholder={isWebSeries ? 'e.g. Breaking Bad' : 'e.g. Interstellar'} className="input-field" required />
                                        </div>
                                        <div>
                                            <label className="form-label">Category *</label>
                                            <select name="category" value={formData.category} onChange={handleChange}
                                                className="input-field" style={{ cursor: 'pointer' }}>
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Row: Year + Rating */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-row">
                                        <div>
                                            <label className="form-label">Release Year</label>
                                            <input name="year" value={formData.year} onChange={handleChange}
                                                placeholder="e.g. 2023" type="number" min="1900" max="2030"
                                                className="input-field" />
                                        </div>
                                        <div>
                                            <label className="form-label">Rating (e.g. 8.5/10)</label>
                                            <input name="rating" value={formData.rating} onChange={handleChange}
                                                placeholder="e.g. 8.5/10" className="input-field" />
                                        </div>
                                    </div>

                                    {/* Trailer Link */}
                                    <div>
                                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Play style={{ width: 13, height: 13, color: '#00d4ff' }} />
                                            Watch Trailer Link
                                        </label>
                                        <input name="trailerLink" value={formData.trailerLink} onChange={handleChange}
                                            placeholder="YouTube embed URL or MP4 link" className="input-field" />
                                    </div>

                                    {/* ── Conditional: Movie Download Links OR Episode Inputs ── */}
                                    {!isWebSeries ? (
                                        <>
                                            {/* Download Link */}
                                            <div>
                                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <LinkIcon style={{ width: 13, height: 13, color: '#a855f7' }} />
                                                    Download Movie Link *
                                                </label>
                                                <input name="downloadLink" value={formData.downloadLink} onChange={handleChange}
                                                    placeholder="https://example.com/download" className="input-field" required />
                                            </div>

                                            {/* Fast Download Link */}
                                            <div>
                                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <Zap style={{ width: 13, height: 13, color: '#ffd700' }} />
                                                    Download (Fast Server) Link
                                                </label>
                                                <input name="fastDownloadLink" value={formData.fastDownloadLink} onChange={handleChange}
                                                    placeholder="https://fast-server.com/download" className="input-field" />
                                            </div>
                                        </>
                                    ) : (
                                        /* ── Episodes Section ──────────────────── */
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 0 }}>
                                                    <List style={{ width: 13, height: 13, color: '#00ffaa' }} />
                                                    Episodes ({episodes.length})
                                                </label>
                                                <button type="button" onClick={addEpisode}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: 6,
                                                        padding: '6px 14px', borderRadius: 50,
                                                        background: 'rgba(0,255,170,0.1)', border: '1px solid rgba(0,255,170,0.3)',
                                                        color: '#00ffaa', fontFamily: "'Outfit', sans-serif",
                                                        fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                                                    }}>
                                                    <Plus style={{ width: 13, height: 13 }} /> Add Episode
                                                </button>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                {episodes.map((ep, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        style={{
                                                            padding: '16px 18px', borderRadius: 14,
                                                            background: 'rgba(0,255,170,0.03)',
                                                            border: '1px solid rgba(0,255,170,0.12)',
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                                            <span style={{
                                                                fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.85rem',
                                                                color: '#00ffaa',
                                                            }}>Episode {ep.episodeNumber}</span>
                                                            <button type="button" onClick={() => removeEpisode(idx)}
                                                                style={{
                                                                    width: 26, height: 26, borderRadius: 8,
                                                                    background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.25)',
                                                                    color: '#ff2d78', cursor: 'pointer',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                }}>
                                                                <X style={{ width: 12, height: 12 }} />
                                                            </button>
                                                        </div>

                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                            <input
                                                                value={ep.title} placeholder="Episode title"
                                                                onChange={e => handleEpisodeChange(idx, 'title', e.target.value)}
                                                                className="input-field" style={episodeInputStyle}
                                                            />
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="form-row">
                                                                <input
                                                                    value={ep.downloadLinkFast} placeholder="Fast Server Link"
                                                                    onChange={e => handleEpisodeChange(idx, 'downloadLinkFast', e.target.value)}
                                                                    className="input-field" style={episodeInputStyle}
                                                                />
                                                                <input
                                                                    value={ep.downloadLinkNormal} placeholder="Normal Server Link"
                                                                    onChange={e => handleEpisodeChange(idx, 'downloadLinkNormal', e.target.value)}
                                                                    className="input-field" style={episodeInputStyle}
                                                                />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Description */}
                                    <div>
                                        <label className="form-label">Description *</label>
                                        <textarea
                                            name="description" value={formData.description} onChange={handleChange}
                                            placeholder={isWebSeries ? 'Write a compelling description of the series...' : 'Write a compelling description of the movie...'}
                                            className="input-field"
                                            style={{ minHeight: 130, resize: 'vertical' }}
                                            required
                                        />
                                    </div>

                                    {/* Image Upload (inline for mobile) */}
                                    <div>
                                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Image style={{ width: 13, height: 13, color: '#a855f7' }} />
                                            Poster {!editingId && '*'}
                                        </label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 16,
                                                padding: '14px 18px', borderRadius: 14, cursor: 'pointer',
                                                background: 'rgba(168,85,247,0.05)',
                                                border: '2px dashed rgba(168,85,247,0.25)',
                                                transition: 'border-color 0.2s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.6)'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.25)'}
                                        >
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview"
                                                    style={{ width: 52, height: 72, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                                            ) : (
                                                <div style={{
                                                    width: 52, height: 72, borderRadius: 8, flexShrink: 0,
                                                    background: 'rgba(168,85,247,0.1)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <Upload style={{ width: 20, height: 20, color: 'rgba(168,85,247,0.6)' }} />
                                                </div>
                                            )}
                                            <div>
                                                <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>
                                                    {imageFile ? imageFile.name : imagePreview ? 'Current poster (click to change)' : 'Click to upload poster'}
                                                </p>
                                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                                                    JPG, PNG, WebP — max 5 MB
                                                </p>
                                            </div>
                                        </div>
                                        <input type="file" ref={fileInputRef} onChange={handleImageChange}
                                            accept="image/*" style={{ display: 'none' }} />
                                    </div>

                                    {/* Buttons */}
                                    <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                                        <button type="submit" disabled={isLoading}
                                            className="btn-download-primary btn-ripple"
                                            style={{
                                                flex: 1, justifyContent: 'center', padding: '14px',
                                                opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer',
                                            }}
                                        >
                                            {isLoading ? (
                                                <><svg style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" /></svg> Saving...</>
                                            ) : editingId ? (
                                                <><CheckCircle style={{ width: 18, height: 18 }} /> Update {isWebSeries ? 'Series' : 'Movie'}</>
                                            ) : (
                                                <><Plus style={{ width: 18, height: 18 }} /> Add {isWebSeries ? 'Series' : 'Movie'}</>
                                            )}
                                        </button>
                                        {editingId && (
                                            <button type="button" onClick={() => { resetForm(); }}
                                                style={{
                                                    padding: '14px 22px', borderRadius: 50,
                                                    background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)',
                                                    color: 'rgba(255,255,255,0.6)', fontFamily: "'Outfit', sans-serif",
                                                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: 8,
                                                }}
                                            >
                                                <X style={{ width: 16, height: 16 }} /> Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Aside: Poster large preview (hidden on small screens via CSS) */}
                            <div className="poster-preview-aside glass-card"
                                style={{ padding: 16, width: 200, flexShrink: 0, alignSelf: 'flex-start' }}>
                                <p style={{
                                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)',
                                    textTransform: 'uppercase', marginBottom: 12, textAlign: 'center',
                                }}>Poster Preview</p>
                                <div style={{
                                    aspectRatio: '2/3', borderRadius: 12, overflow: 'hidden',
                                    background: 'rgba(168,85,247,0.06)',
                                    border: '1.5px dashed rgba(168,85,247,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Poster" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: 16 }}>
                                            <Film style={{ width: 32, height: 32, color: 'rgba(168,85,247,0.4)', margin: '0 auto 8px' }} />
                                            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>No image selected</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ══════════════════════════════════════════════
                    TAB 3: ALL MOVIES
                ══════════════════════════════════════════════ */}
                {activeTab === 'movies' && (
                    <motion.div key="movies" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="glass-card" style={{ padding: '24px 28px' }}>
                            {/* Table header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Film style={{ width: 18, height: 18, color: '#a855f7' }} />
                                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem' }}>
                                        All Movies
                                    </h3>
                                    <span style={{
                                        padding: '2px 10px', borderRadius: 50,
                                        background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)',
                                        fontSize: '0.72rem', fontWeight: 700, color: '#a855f7',
                                    }}>{filteredMovies.length}</span>
                                </div>
                                {/* Search */}
                                <input
                                    type="text" placeholder="Search by title or category..."
                                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    className="input-field"
                                    style={{ maxWidth: 280, padding: '9px 16px', fontSize: '0.85rem' }}
                                />
                            </div>

                            {/* Table */}
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 580 }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                            {['Poster', 'Title', 'Type', 'Category', 'Year', 'Actions'].map(h => (
                                                <th key={h} style={{
                                                    padding: '10px 14px', textAlign: h === 'Actions' ? 'right' : 'left',
                                                    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em',
                                                    color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
                                                }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMovies.map((movie, i) => (
                                            <tr key={movie._id} style={{
                                                borderBottom: '1px solid rgba(255,255,255,0.04)',
                                                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                                                transition: 'background 0.15s',
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,85,247,0.05)'}
                                                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                                            >
                                                <td style={{ padding: '10px 14px' }}>
                                                    <img
                                                        src={movie.image.startsWith('/uploads/') ? `${API_BASE}${movie.image}` : movie.image}
                                                        alt={movie.title}
                                                        style={{ width: 38, height: 52, borderRadius: 6, objectFit: 'cover' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '10px 14px' }}>
                                                    <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem', maxWidth: 180, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                        {movie.title}
                                                    </p>
                                                </td>
                                                <td style={{ padding: '10px 14px' }}>
                                                    <span style={{
                                                        padding: '3px 10px', borderRadius: 50, fontSize: '0.68rem', fontWeight: 700,
                                                        background: movie.contentType === 'Web Series' ? 'rgba(0,255,170,0.1)' : 'rgba(168,85,247,0.1)',
                                                        border: movie.contentType === 'Web Series' ? '1px solid rgba(0,255,170,0.3)' : '1px solid rgba(168,85,247,0.3)',
                                                        color: movie.contentType === 'Web Series' ? '#00ffaa' : '#a855f7',
                                                    }}>
                                                        {movie.contentType === 'Web Series' ? 'Series' : 'Movie'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '10px 14px' }}>
                                                    <span style={{
                                                        padding: '3px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700,
                                                        background: `${CAT_COLORS[movie.category] || '#a855f7'}18`,
                                                        border: `1px solid ${CAT_COLORS[movie.category] || '#a855f7'}44`,
                                                        color: CAT_COLORS[movie.category] || '#a855f7',
                                                    }}>{movie.category}</span>
                                                </td>
                                                <td style={{ padding: '10px 14px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                                                    {movie.year || '—'}
                                                </td>
                                                <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                        <button onClick={() => handleEdit(movie)}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: 6,
                                                                padding: '6px 14px', borderRadius: 8,
                                                                background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)',
                                                                color: '#00d4ff', fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.78rem',
                                                                cursor: 'pointer', whiteSpace: 'nowrap',
                                                            }}>
                                                            <Edit style={{ width: 12, height: 12 }} /> Edit
                                                        </button>
                                                        <button onClick={() => setDeleteConfirm(movie._id)}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: 6,
                                                                padding: '6px 14px', borderRadius: 8,
                                                                background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)',
                                                                color: '#ff2d78', fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.78rem',
                                                                cursor: 'pointer', whiteSpace: 'nowrap',
                                                            }}>
                                                            <Trash2 style={{ width: 12, height: 12 }} /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredMovies.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                                        <Film style={{ width: 36, height: 36, color: 'rgba(255,255,255,0.15)', margin: '0 auto 12px' }} />
                                        <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Outfit', sans-serif" }}>
                                            {searchQuery ? `No movies matching "${searchQuery}"` : 'No movies in database yet.'}
                                        </p>
                                        {!searchQuery && (
                                            <button onClick={() => setActiveTab('add')}
                                                className="btn-download-primary"
                                                style={{ display: 'inline-flex', marginTop: 16 }}>
                                                <Plus style={{ width: 16, height: 16 }} /> Add First Movie
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Delete Confirmation Modal ────────────────── */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9999,
                            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
                        }}
                        onClick={() => setDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card"
                            style={{ padding: '32px 36px', maxWidth: 420, width: '100%', textAlign: 'center' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{
                                width: 56, height: 56, borderRadius: 14, margin: '0 auto 20px',
                                background: 'rgba(255,45,120,0.15)', border: '1.5px solid rgba(255,45,120,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <AlertCircle style={{ width: 26, height: 26, color: '#ff2d78' }} />
                            </div>
                            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.2rem', marginBottom: 10 }}>
                                Delete Movie?
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', marginBottom: 24, lineHeight: 1.5 }}>
                                This action is permanent and cannot be undone. The movie will be removed from the database.
                            </p>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                <button onClick={() => setDeleteConfirm(null)}
                                    style={{
                                        padding: '11px 24px', borderRadius: 50,
                                        background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)',
                                        color: 'rgba(255,255,255,0.7)', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem',
                                        cursor: 'pointer',
                                    }}>
                                    Cancel
                                </button>
                                <button onClick={() => handleDelete(deleteConfirm)}
                                    style={{
                                        padding: '11px 24px', borderRadius: 50,
                                        background: 'linear-gradient(135deg, #ff2d78, #ff6b35)',
                                        border: 'none', color: '#fff',
                                        fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem',
                                        cursor: 'pointer', boxShadow: '0 0 20px rgba(255,45,120,0.4)',
                                        display: 'flex', alignItems: 'center', gap: 8,
                                    }}>
                                    <Trash2 style={{ width: 15, height: 15 }} /> Yes, Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
