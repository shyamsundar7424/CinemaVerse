import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../utils/api';
import Spinner from '../components/Spinner';
import MovieCard from '../components/MovieCard';
import { Play, Download, ArrowLeft, Star, Calendar, Tag, Zap, Shield, X, Tv, List } from 'lucide-react';
import { motion } from 'framer-motion';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [related, setRelated] = useState([]);
    const [showTrailer, setShowTrailer] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/movies/${id}`);
                setMovie(res.data);
                // Fetch related movies (same category, exclude current)
                const relRes = await axios.get(`${API_BASE}/api/movies?category=${res.data.category}`);
                setRelated(relRes.data.filter(m => m._id !== id).slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Spinner />
        </div>
    );

    if (!movie) return (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎬</div>
            <h2 style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '2rem',
                background: 'linear-gradient(135deg, #ff2d78, #ff6b35)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: 16,
            }}>Movie Not Found</h2>
            <Link to="/" style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 600 }}>← Back to Home</Link>
        </div>
    );

    const imageUrl = movie.image.startsWith('/uploads/')
        ? `${API_BASE}${movie.image}`
        : movie.image;

    const rating = movie.rating ? movie.rating.replace('/10', '') : '8.0';
    const year = movie.year || new Date(movie.createdAt).getFullYear();
    const isWebSeries = movie.contentType === 'Web Series';
    const hasEpisodes = isWebSeries && movie.episodes && movie.episodes.length > 0;

    // Render stars
    const ratingNum = parseFloat(rating) || 8;
    const fullStars = Math.floor(ratingNum / 2);

    return (
        <div style={{ paddingBottom: 60 }}>
            {/* Back */}
            <Link to="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.82rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                marginBottom: 24, transition: 'color 0.2s',
            }}
                onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
                <ArrowLeft style={{ width: 16, height: 16 }} />
                Back to Archive
            </Link>

            {/* ── Cinematic Banner ──────────────────────────── */}
            <div style={{
                position: 'relative', width: '100%', height: '380px', borderRadius: 20,
                overflow: 'hidden', marginBottom: 40,
            }}>
                <img src={imageUrl} alt={movie.title} style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    filter: 'brightness(0.35) blur(2px)',
                    transform: 'scale(1.05)',
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(3,0,20,0.2) 0%, rgba(3,0,20,0.7) 70%, rgba(3,0,20,1) 100%)',
                }} />
                {/* Banner title overlay */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 40px',
                }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            fontFamily: "'Outfit', sans-serif", fontWeight: 900,
                            fontSize: 'clamp(2rem, 6vw, 4rem)', lineHeight: 1.05,
                            letterSpacing: '-0.03em',
                            textShadow: '0 0 40px rgba(168,85,247,0.5)',
                        }}
                    >
                        {movie.title}
                    </motion.h1>
                </div>
            </div>

            {/* ── Main Content ───────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>

                {/* Left: Poster */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    <div className="poster-glow" style={{ maxWidth: 300, width: '100%' }}>
                        <img src={imageUrl} alt={movie.title} style={{
                            width: '100%', display: 'block', borderRadius: 16,
                        }} />
                    </div>
                </motion.div>

                {/* Right: Details */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
                >
                    {/* Meta badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {isWebSeries && (
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                background: 'linear-gradient(135deg, rgba(0,255,170,0.3), rgba(0,212,255,0.2))',
                                border: '1px solid rgba(0,255,170,0.4)', borderRadius: 50,
                                padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700,
                                fontFamily: "'Outfit', sans-serif", color: '#00ffaa',
                            }}>
                                <Tv style={{ width: 13, height: 13 }} />
                                Web Series
                            </span>
                        )}
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(0,212,255,0.3))',
                            border: '1px solid rgba(168,85,247,0.4)', borderRadius: 50,
                            padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700,
                            fontFamily: "'Outfit', sans-serif", color: '#00d4ff',
                        }}>
                            <Tag style={{ width: 13, height: 13 }} />
                            {movie.category}
                        </span>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 50, padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600,
                            color: 'rgba(255,255,255,0.6)',
                        }}>
                            <Calendar style={{ width: 13, height: 13 }} />
                            {year}
                        </span>
                        {movie.director && (
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 50, padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600,
                                color: 'rgba(255,255,255,0.6)',
                            }}>
                                🎬 {movie.director}
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex', gap: 3 }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} style={{
                                    width: 18, height: 18,
                                    color: i < fullStars ? '#ffd700' : 'rgba(255,255,255,0.2)',
                                    fill: i < fullStars ? '#ffd700' : 'none',
                                }} />
                            ))}
                        </div>
                        <span style={{
                            fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.3rem',
                            color: '#ffd700',
                        }}>{rating}</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>/10</span>
                    </div>

                    {/* Description */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <p style={{
                            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em',
                            color: '#a855f7', textTransform: 'uppercase', marginBottom: 12,
                            fontFamily: "'Outfit', sans-serif",
                        }}>Synopsis</p>
                        <p style={{
                            color: 'rgba(255,255,255,0.8)', lineHeight: 1.75,
                            fontSize: '0.95rem', fontFamily: "'Inter', sans-serif",
                        }}>
                            {movie.description}
                        </p>
                    </div>

                    {/* Cast */}
                    {movie.cast && (
                        <div>
                            <p style={{
                                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em',
                                color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8,
                                fontFamily: "'Outfit', sans-serif",
                            }}>Cast</p>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{movie.cast}</p>
                        </div>
                    )}

                    {/* ── Watch Trailer Button ──────────────────── */}
                    {(movie.trailerLink || movie.movieLink) && (
                        <button
                            onClick={() => setShowTrailer(true)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                padding: '13px 28px', borderRadius: 50,
                                background: 'rgba(255,255,255,0.06)',
                                border: '1.5px solid rgba(255,255,255,0.15)',
                                color: '#fff',
                                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.95rem',
                                backdropFilter: 'blur(12px)',
                                alignSelf: 'flex-start',
                                transition: 'all 0.25s',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                        >
                            <Play style={{ width: 18, height: 18, fill: 'currentColor' }} />
                            ▶ Watch Trailer
                        </button>
                    )}

                    {/* ── Download / Episodes Section ────────────── */}
                    {hasEpisodes ? (
                        /* ── EPISODES LIST (Web Series) ──────────── */
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                <List style={{ width: 16, height: 16, color: '#00ffaa' }} />
                                <p style={{
                                    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em',
                                    color: '#00ffaa', textTransform: 'uppercase',
                                    fontFamily: "'Outfit', sans-serif",
                                }}>Episodes ({movie.episodes.length})</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {movie.episodes.map((ep, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="glass-card"
                                        style={{ padding: '16px 20px' }}
                                    >
                                        <div style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            marginBottom: (ep.downloadLinkFast || ep.downloadLinkNormal) ? 12 : 0,
                                            flexWrap: 'wrap', gap: 8,
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <span style={{
                                                    width: 32, height: 32, borderRadius: 8,
                                                    background: 'linear-gradient(135deg, rgba(0,255,170,0.2), rgba(0,212,255,0.15))',
                                                    border: '1px solid rgba(0,255,170,0.3)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '0.85rem',
                                                    color: '#00ffaa', flexShrink: 0,
                                                }}>
                                                    {ep.episodeNumber}
                                                </span>
                                                <span style={{
                                                    fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.95rem',
                                                }}>
                                                    {ep.title}
                                                </span>
                                            </div>
                                        </div>

                                        {(ep.downloadLinkFast || ep.downloadLinkNormal) && (
                                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                {ep.downloadLinkNormal && (
                                                    <a
                                                        href={ep.downloadLinkNormal}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-download-primary btn-ripple"
                                                        style={{ flex: 1, minWidth: 140, justifyContent: 'center', padding: '10px 16px', fontSize: '0.85rem' }}
                                                    >
                                                        <Download style={{ width: 15, height: 15 }} />
                                                        Normal Server
                                                    </a>
                                                )}
                                                {ep.downloadLinkFast && (
                                                    <a
                                                        href={ep.downloadLinkFast}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-download-fast btn-ripple"
                                                        style={{ flex: 1, minWidth: 140, justifyContent: 'center', padding: '10px 16px', fontSize: '0.85rem' }}
                                                    >
                                                        <Zap style={{ width: 15, height: 15 }} />
                                                        Fast Server
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* ── SINGLE DOWNLOAD (Movie) ──────────────── */
                        <div>
                            <p style={{
                                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em',
                                color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 16,
                                fontFamily: "'Outfit', sans-serif",
                            }}>Download Options</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                                {/* Button 1: Download Movie — purple/blue */}
                                {(movie.downloadLink || movie.movieLink) && (
                                    <div>
                                        <a
                                            href={movie.downloadLink || movie.movieLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-download-primary btn-ripple"
                                            style={{ width: '100%', justifyContent: 'center', padding: '16px 24px', fontSize: '1.05rem' }}
                                        >
                                            <Download style={{ width: 20, height: 20 }} />
                                            Download Movie
                                        </a>
                                    </div>
                                )}

                                {/* Button 2: Fast Server — pink/orange */}
                                {movie.fastDownloadLink && (
                                    <div>
                                        <a
                                            href={movie.fastDownloadLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-download-fast btn-ripple"
                                            style={{ width: '100%', justifyContent: 'center', padding: '16px 24px', fontSize: '1.05rem' }}
                                        >
                                            <Zap style={{ width: 20, height: 20 }} />
                                            Download (Fast Server)
                                        </a>
                                        <p style={{
                                            textAlign: 'center', marginTop: 8,
                                            color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem',
                                            fontStyle: 'italic', fontFamily: "'Inter', sans-serif",
                                        }}>
                                            Support us by using this link
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Disclaimer ───────────────────────────── */}
                    <div style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '12px 16px', borderRadius: 12,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                    }}>
                        <Shield style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginTop: 1 }} />
                        <p style={{
                            fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)',
                            fontFamily: "'Inter', sans-serif", lineHeight: 1.6, fontStyle: 'italic',
                        }}>
                            We do not host any files. All files are from third-party sources.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* ── Related Movies ─────────────────────────── */}
            {related.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    style={{ marginTop: 56 }}
                >
                    {/* Section header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                        <div style={{
                            height: 24, width: 4, borderRadius: 2,
                            background: 'linear-gradient(180deg, #a855f7, #00d4ff)',
                        }} />
                        <h2 style={{
                            fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.3rem',
                        }}>More {movie.category} {isWebSeries ? 'Shows' : 'Movies'}</h2>
                        <div style={{
                            flex: 1, height: 1,
                            background: 'linear-gradient(90deg, rgba(168,85,247,0.3), transparent)',
                        }} />
                    </div>

                    {/* Related grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                        gap: 20,
                    }}>
                        {related.map((m, i) => (
                            <motion.div key={m._id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.07 }}
                            >
                                <MovieCard movie={m} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ── Trailer Modal ──────────────────────────── */}
            {showTrailer && (() => {
                const src = movie.trailerLink || movie.movieLink || '';
                // Convert YouTube watch URL to embed URL
                let embedSrc = src;
                const ytMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
                if (ytMatch) embedSrc = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
                const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);
                return (
                    <div
                        onClick={() => setShowTrailer(false)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9999,
                            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: 20,
                        }}
                    >
                        <div
                            onClick={e => e.stopPropagation()}
                            style={{
                                position: 'relative', width: '100%', maxWidth: 900,
                                aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden',
                                background: '#000',
                                boxShadow: '0 0 60px rgba(168,85,247,0.3)',
                            }}
                        >
                            <button
                                onClick={() => setShowTrailer(false)}
                                style={{
                                    position: 'absolute', top: 12, right: 12, zIndex: 10,
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: 'rgba(0,0,0,0.6)', border: '1.5px solid rgba(255,255,255,0.2)',
                                    color: '#fff', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <X style={{ width: 18, height: 18 }} />
                            </button>
                            {isVideo ? (
                                <video
                                    src={src}
                                    controls
                                    autoPlay
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            ) : (
                                <iframe
                                    src={embedSrc}
                                    title="Trailer"
                                    allow="autoplay; encrypted-media; fullscreen"
                                    allowFullScreen
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                />
                            )}
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default MovieDetail;
