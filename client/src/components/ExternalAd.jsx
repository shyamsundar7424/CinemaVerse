import React, { useEffect, useRef } from 'react';

/**
 * ExternalAd — effectivegatecpm ad script
 * Injects the ad script asynchronously once on mount, cleans up on unmount.
 * Reserves min-height to prevent layout shift.
 */
const ExternalAd = () => {
    const containerRef = useRef(null);
    const injectedRef = useRef(false);

    useEffect(() => {
        if (injectedRef.current || !containerRef.current) return;
        injectedRef.current = true;

        const script = document.createElement('script');
        script.src =
            'https://pl28768839.effectivegatecpm.com/9e/e2/b0/9ee2b02a10f5dab68e1dcd7c43493d39.js';
        script.async = true;
        script.type = 'text/javascript';
        containerRef.current.appendChild(script);

        return () => {
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
                margin: '12px 0',
            }}
        >
            {/* Subtle label */}
            <p
                style={{
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    color: 'rgba(255,255,255,0.2)',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                Advertisement
            </p>

            {/* Ad container — reserves space to prevent layout shift */}
            <div
                ref={containerRef}
                style={{
                    minHeight: 90,
                    width: '100%',
                    maxWidth: 728,
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

export default ExternalAd;
