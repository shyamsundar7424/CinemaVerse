import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const FAQS = [
    {
        q: 'Is CinemaVerse completely free?',
        a: 'Yes! CinemaVerse is 100% free to use. No registration, no subscription, no hidden charges. Simply browse and download.',
    },
    {
        q: 'How do I download a movie?',
        a: 'Click on any movie card to open the movie detail page. Then click "Download Movie" or "Download (Fast Server)" to start downloading via a third-party link.',
    },
    {
        q: 'What is the difference between the two download buttons?',
        a: '"Download Movie" is the standard direct link. "Download (Fast Server)" uses an alternate server that may offer higher speeds. Clicking it also supports our platform.',
    },
    {
        q: 'Do you store or host the movie files?',
        a: 'No. CinemaVerse does not host any files. We only link to publicly available third-party sources. We are simply a directory/index platform.',
    },
    {
        q: 'Why does a download link not work?',
        a: 'Third-party links may occasionally expire or go offline. We have no control over external servers. Try the "Fast Server" button as an alternative.',
    },
    {
        q: 'Can I use CinemaVerse on my phone?',
        a: 'Yes! CinemaVerse is fully mobile-responsive. It works great on smartphones, tablets, and desktops.',
    },
    {
        q: 'How do I switch between dark and light mode?',
        a: 'Click the sun/moon icon in the top-right corner of the navbar. Your preference is saved automatically.',
    },
    {
        q: 'How do I search for a specific movie?',
        a: 'Use the search bar in the navbar or on the home page. Type the movie name and results will appear instantly.',
    },
];

const FAQItem = ({ item }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="glass-card" style={{ overflow: 'hidden', transition: 'all 0.3s' }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: '100%', padding: '18px 22px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
            >
                <span style={{
                    fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.98rem',
                }}>{item.q}</span>
                {open
                    ? <ChevronUp style={{ width: 18, height: 18, color: '#a855f7', flexShrink: 0 }} />
                    : <ChevronDown style={{ width: 18, height: 18, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                }
            </button>
            {open && (
                <div style={{ padding: '0 22px 18px' }}>
                    <div style={{
                        height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 14,
                    }} />
                    <p style={{
                        color: 'rgba(255,255,255,0.65)', fontFamily: "'Inter', sans-serif",
                        fontSize: '0.9rem', lineHeight: 1.7,
                    }}>{item.a}</p>
                </div>
            )}
        </div>
    );
};

const Help = () => {
    return (
        <div style={{ paddingBottom: 60, maxWidth: 720, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: 16,
                        background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 0 30px rgba(0,212,255,0.4)',
                    }}>
                        <HelpCircle style={{ width: 32, height: 32, color: '#fff' }} />
                    </div>
                    <h1 style={{
                        fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                        letterSpacing: '-0.02em', marginBottom: 12,
                        background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>Help & FAQ</h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.55)', fontFamily: "'Inter', sans-serif",
                        fontSize: '1rem',
                    }}>
                        Find answers to common questions below.
                    </p>
                </div>

                {/* FAQ List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 48 }}>
                    {FAQS.map((item, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                        >
                            <FAQItem item={item} />
                        </motion.div>
                    ))}
                </div>

                {/* Still need help */}
                <div className="glass-card" style={{ padding: '28px 32px', textAlign: 'center' }}>
                    <MessageCircle style={{ width: 32, height: 32, color: '#a855f7', margin: '0 auto 12px' }} />
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>
                        Still need help?
                    </h3>
                    <p style={{
                        color: 'rgba(255,255,255,0.55)', fontFamily: "'Inter', sans-serif",
                        fontSize: '0.9rem', marginBottom: 20,
                    }}>
                        If you have a question we haven't answered, feel free to reach out.
                    </p>
                    <Link to="/" className="btn-download-primary" style={{ display: 'inline-flex' }}>
                        🏠 Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Help;
