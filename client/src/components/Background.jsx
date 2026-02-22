import React, { useMemo } from 'react';

const Background = () => {
    const particles = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 1.5}px`,
            height: `${Math.random() * 4 + 1.5}px`,
            animationDelay: `${Math.random() * 25}s`,
            animationDuration: `${20 + Math.random() * 15}s`,
            opacity: Math.random() * 0.5 + 0.1,
            background: i % 3 === 0
                ? 'rgba(168,85,247,0.7)'
                : i % 3 === 1
                    ? 'rgba(0,212,255,0.7)'
                    : 'rgba(255,45,120,0.6)',
        }));
    }, []);

    return (
        <>
            <div className="animated-bg" />
            <div className="orb orb-purple" />
            <div className="orb orb-blue" />
            <div className="orb orb-pink" />
            <div className="grid-overlay" />
            <div className="particles">
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: p.left,
                            width: p.width,
                            height: p.height,
                            animationDelay: p.animationDelay,
                            animationDuration: p.animationDuration,
                            opacity: p.opacity,
                            background: p.background,
                        }}
                    />
                ))}
            </div>
        </>
    );
};

export default Background;
