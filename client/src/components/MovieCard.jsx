import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { API_BASE } from '../utils/api';

const MovieCard = ({ movie }) => {
    const imageUrl = movie.image.startsWith('/uploads/')
        ? `${API_BASE}${movie.image}`
        : movie.image;

    const rating = movie.rating ? movie.rating.replace('/10', '') : '8.0';

    return (
        <Link to={`/movie/${movie._id}`} style={{ display: 'block', textDecoration: 'none' }}>
            <div className="glass-card-hover" style={{ overflow: 'hidden', cursor: 'pointer' }}>
                {/* Poster */}
                <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
                    <img
                        src={imageUrl}
                        alt={movie.title}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            transition: 'transform 0.6s ease',
                            display: 'block',
                        }}
                        className="group-hover:scale-110"
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />

                    {/* Gradient overlay */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(3,0,20,0.95) 0%, rgba(3,0,20,0.4) 50%, transparent 100%)',
                    }} />

                    {/* Rating badge top-right */}
                    <div style={{
                        position: 'absolute', top: 10, right: 10,
                        display: 'flex', alignItems: 'center', gap: 4,
                        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,200,50,0.4)',
                        borderRadius: 50, padding: '3px 8px',
                    }}>
                        <Star style={{ width: 11, height: 11, color: '#ffd700', fill: '#ffd700' }} />
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ffd700', fontFamily: "'Outfit', sans-serif" }}>
                            {rating}
                        </span>
                    </div>

                    {/* Category badge top-left */}
                    <div style={{
                        position: 'absolute', top: 10, left: 10,
                        background: 'linear-gradient(135deg, rgba(168,85,247,0.85), rgba(0,212,255,0.85))',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 50, padding: '3px 10px',
                        fontSize: '0.65rem', fontWeight: 700,
                        fontFamily: "'Outfit', sans-serif",
                        letterSpacing: '0.08em', color: '#fff',
                        textTransform: 'uppercase',
                    }}>
                        {movie.category}
                    </div>

                    {/* Play overlay on hover */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: 0, transition: 'opacity 0.3s ease',
                        background: 'rgba(3,0,20,0.4)',
                    }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0}
                    >
                        <div style={{
                            width: 52, height: 52, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #a855f7, #00d4ff)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 30px rgba(168,85,247,0.8)',
                        }}>
                            <Play style={{ width: 22, height: 22, fill: '#fff', color: '#fff', marginLeft: 3 }} />
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div style={{ padding: '12px 14px 14px' }}>
                    <h3 style={{
                        fontFamily: "'Outfit', sans-serif", fontWeight: 800,
                        fontSize: '0.95rem', lineHeight: 1.2,
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                        marginBottom: 6,
                        color: 'inherit',
                    }}>{movie.title}</h3>

                    <p style={{
                        fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)',
                        lineHeight: 1.5,
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        marginBottom: 12,
                    }}>{movie.description}</p>

                    <div className="neon-button" style={{ width: '100%' }}>
                        <Play style={{ width: 13, height: 13, fill: 'currentColor' }} />
                        Watch Now
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
