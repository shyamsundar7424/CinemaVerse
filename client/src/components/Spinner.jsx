import React from 'react';

const Spinner = () => (
    <div className="flex flex-col items-center justify-center gap-4">
        <div style={{ position: 'relative', width: 64, height: 64 }}>
            {/* Outer ring - blue */}
            <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                border: '3px solid transparent',
                borderTopColor: '#00d4ff',
                borderRightColor: '#00d4ff',
                animation: 'spin 1s linear infinite',
            }} />
            {/* Inner ring - purple */}
            <div style={{
                position: 'absolute', inset: 8,
                borderRadius: '50%',
                border: '3px solid transparent',
                borderTopColor: '#a855f7',
                borderLeftColor: '#a855f7',
                animation: 'spin 0.7s linear infinite reverse',
            }} />
            {/* Center dot */}
            <div style={{
                position: 'absolute', inset: '50%',
                width: 8, height: 8,
                marginLeft: -4, marginTop: -4,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a855f7, #00d4ff)',
                boxShadow: '0 0 12px rgba(168,85,247,0.8)',
            }} />
        </div>
        <p style={{
            fontSize: '0.8rem',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            letterSpacing: '0.15em',
            background: 'linear-gradient(90deg, #a855f7, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        }}>LOADING...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

export default Spinner;
