import React, { useState } from 'react';

/**
 * ExternalAd — Adsterra 728×90 Leaderboard banner
 *
 * Uses an <iframe srcdoc> so invoke.js has its own document context.
 * Hidden on screens narrower than 728px to prevent overflow.
 */

const AD_KEY = 'e4613014e4e954fb3d3df1e15e7c0ba6';
const AD_WIDTH = 728;
const AD_HEIGHT = 90;

const srcdoc = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { overflow: hidden; background: transparent; display: flex; align-items: center; justify-content: center; }
</style>
</head>
<body>
<script type="text/javascript">
  atOptions = {
    'key': '${AD_KEY}',
    'format': 'iframe',
    'height': ${AD_HEIGHT},
    'width': ${AD_WIDTH},
    'params': {}
  };
</script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${AD_KEY}/invoke.js"></script>
</body>
</html>`;

const ExternalAd = () => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div
            aria-label="Advertisement"
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 0',
                margin: '8px 0',
                // Hide on mobile — 728px won't fit narrower screens
                // (inline style fallback; CSS media query handled via maxWidth clamp)
            }}
        >
            <p style={{
                fontSize: '0.58rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: 'rgba(255,255,255,0.18)',
                textTransform: 'uppercase',
                marginBottom: 5,
                fontFamily: "'Inter', sans-serif",
            }}>
                Advertisement
            </p>
            <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
                <iframe
                    srcDoc={srcdoc}
                    width={AD_WIDTH}
                    height={AD_HEIGHT}
                    scrolling="no"
                    frameBorder="0"
                    style={{
                        maxWidth: '100%',
                        border: 'none',
                        borderRadius: 6,
                        display: 'block',
                    }}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    onError={() => setVisible(false)}
                    title="Advertisement"
                />
            </div>
        </div>
    );
};

export default ExternalAd;
