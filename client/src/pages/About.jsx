import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Globe, Shield, Zap, Heart } from 'lucide-react';

const FEATURES = [
    { icon: <Film style={{ width: 28, height: 28, color: '#a855f7' }} />, title: 'Huge Library', desc: 'Thousands of movies across every genre — from Hollywood blockbusters to indie gems.' },
    { icon: <Globe style={{ width: 28, height: 28, color: '#00d4ff' }} />, title: 'Global Content', desc: 'Browse international films, anime, documentaries, and regional cinema all in one place.' },
    { icon: <Zap style={{ width: 28, height: 28, color: '#ffd700' }} />, title: 'Fast Downloads', desc: 'Multiple download servers ensure you always get your movie at maximum speed.' },
    { icon: <Shield style={{ width: 28, height: 28, color: '#ff2d78' }} />, title: 'Safe & Legal', desc: 'All our links point to third-party publicly available sources. We never host files ourselves.' },
    { icon: <Heart style={{ width: 28, height: 28, color: '#ff6b35' }} />, title: 'Free Forever', desc: 'CinemaVerse is completely free. No subscription, no hidden fees — ever.' },
];

const About = () => {
    return (
        <div style={{ paddingBottom: 60, maxWidth: 760, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

                {/* Hero */}
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: 18,
                        background: 'linear-gradient(135deg, #a855f7, #00d4ff)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 0 40px rgba(168,85,247,0.5)',
                    }}>
                        <Film style={{ width: 36, height: 36, color: '#fff' }} />
                    </div>
                    <h1 style={{
                        fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3rem)',
                        letterSpacing: '-0.03em', marginBottom: 16,
                        background: 'linear-gradient(135deg, #a855f7, #00d4ff)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>About CinemaVerse</h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.65)', fontFamily: "'Inter', sans-serif",
                        fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 560, margin: '0 auto',
                    }}>
                        CinemaVerse is a free streaming and movie discovery platform built for movie lovers.
                        We index publicly available content so you can find, browse, and download your favourite films — all in one beautiful place.
                    </p>
                </div>

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
                    {FEATURES.map((f, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card"
                            style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: '20px 24px' }}
                        >
                            <div style={{
                                flexShrink: 0, width: 52, height: 52, borderRadius: 14,
                                background: 'rgba(255,255,255,0.06)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{f.icon}</div>
                            <div>
                                <h3 style={{
                                    fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.05rem',
                                    marginBottom: 6,
                                }}>{f.title}</h3>
                                <p style={{
                                    color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif",
                                    fontSize: '0.9rem', lineHeight: 1.6,
                                }}>{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Disclaimer */}
                <div className="glass-card" style={{ padding: '24px 28px', borderLeft: '3px solid #a855f7' }}>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, marginBottom: 10, color: '#a855f7' }}>
                        Legal Disclaimer
                    </h3>
                    <p style={{
                        color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif",
                        fontSize: '0.88rem', lineHeight: 1.7,
                    }}>
                        CinemaVerse does not host, upload, or store any media files. All download links redirect to third-party
                        sources that are publicly available on the internet. We are not responsible for the content, availability,
                        or legality of any linked material. If you believe any content violates your rights, please contact us.
                    </p>
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <Link to="/" className="btn-download-primary" style={{ display: 'inline-flex' }}>
                        🎬 Start Browsing Movies
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default About;
