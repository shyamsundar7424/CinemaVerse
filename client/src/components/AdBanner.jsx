import React, { useState } from 'react';

/**
 * AdBanner — Adsterra 320×50 banner
 *
 * Uses an <iframe srcdoc> so invoke.js has its own document context.
 * This bypasses the document.write() limitation in React SPAs and is
 * the most reliable method to render Adsterra iframe-format banners.
 */

const AD_KEY = 'ce7bc04510eed59ece7b07252d1d6721';
const AD_WIDTH = 320;
const AD_HEIGHT = 50;

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

const AdBanner = () => {
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
                    overflow: 'hidden',
                    display: 'block',
                }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                onError={() => setVisible(false)}
                title="Advertisement"
            />
        </div>
    );
};

export default AdBanner;
