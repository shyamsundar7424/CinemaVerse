import React, { useEffect, useRef } from 'react';

/**
 * AdBanner — Adsterra 320×50 responsive banner
 * Injects the ad script once on mount and cleans up on unmount.
 */
const AdBanner = () => {
    const containerRef = useRef(null);
    const injectedRef = useRef(false);

    useEffect(() => {
        if (injectedRef.current || !containerRef.current) return;
        injectedRef.current = true;

        // Set atOptions on window
        window.atOptions = {
            key: 'ce7bc04510eed59ece7b07252d1d6721',
            format: 'iframe',
            height: 50,
            width: 320,
            params: {},
        };

        // Inject invoke script
        const script = document.createElement('script');
        script.src = 'https://www.highperformanceformat.com/ce7bc04510eed59ece7b07252d1d6721/invoke.js';
        script.async = true;
        script.type = 'text/javascript';
        containerRef.current.appendChild(script);

        return () => {
            // Cleanup on unmount
            try {
                if (containerRef.current) {
                    containerRef.current.innerHTML = '';
                }
            } catch (_) { }
        };
    }, []);

    return (
        <div
            aria-label="Advertisement"
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 0',
                margin: '8px 0',
            }}
        >
            {/* "Advertisement" label — subtle, visible */}
            <p style={{
                fontSize: '0.62rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                marginBottom: 6,
                fontFamily: "'Inter', sans-serif",
            }}>
                Advertisement
            </p>

            {/* Ad container — fixed 320×50, max-width safe on mobile */}
            <div
                ref={containerRef}
                style={{
                    width: 320,
                    height: 50,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    borderRadius: 6,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            />
        </div>
    );
};

export default AdBanner;
