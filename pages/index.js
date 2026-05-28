import { useEffect, useRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const FLOW_URL = 'https://abctrack.info/metonil-99/landpl5/?flow=20829&ga=GTM-KBNTF44H&gad=AW-17265998042+l6wqCNvVz7QcENrxiKlA&utm_source=google&utm_campaign=metonil-pl&utm_content={adgroupid}&utm_term={keyword}&utm_medium=cpc&src=23&subid={gclid}';

export default function BridgePage() {
  const ctaRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid'];
    const hasAny = keys.some(k => params.has(k));
    if (!hasAny || !ctaRef.current) return;
    try {
      const url = new URL(ctaRef.current.href);
      keys.forEach(k => { if (params.has(k)) url.searchParams.set(k, params.get(k)); });
      ctaRef.current.href = url.toString();
    } catch(e) {}
  }, []);

  return (
    <>
      <Head>
        <title>Metonil — Oferta Specjalna</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </Head>

      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KBNTF44H');` }}
      />
      <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KBNTF44H" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
      </noscript>

      <div style={S.page}>
        <div style={S.badge}>⚡ Oferta ograniczona</div>
        <div style={S.productName}>Metonil</div>
        <p style={S.tagline}>Sprawdź specjalną ofertę dostępną tylko dziś dla mieszkańców Polski.</p>

        <a
          ref={ctaRef}
          href={FLOW_URL}
          style={S.ctaBtn}
          rel="nofollow sponsored"
        >
          Zobacz ofertę →
        </a>

        <p style={S.urgency}>
          <span style={S.urgencyDot} />
          Zostało kilka miejsc w tej cenie
        </p>

        <div style={S.trust}>
          <span>🔒 Bezpieczna płatność</span>
          <span>📦 Wysyłka w 24h</span>
          <span>↩ Gwarancja zwrotu</span>
        </div>

        <div style={S.disclaimer}>Materiał reklamowy. Wyniki mogą się różnić.</div>
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          height: 100%;
          font-family: 'Inter', sans-serif;
          background: #0f0f1a;
          color: #fff;
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 40px rgba(34,197,94,0.35); }
          50% { box-shadow: 0 0 60px rgba(34,197,94,0.6); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        a:hover { transform: translateY(-3px); box-shadow: 0 0 60px rgba(34,197,94,0.55) !important; animation: none !important; }
      `}</style>
    </>
  );
}

const S = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px 16px',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#f0c040',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    padding: '6px 16px',
    borderRadius: 100,
    marginBottom: 28,
  },
  productName: {
    fontSize: 'clamp(42px, 12vw, 72px)',
    fontWeight: 900,
    letterSpacing: '-1px',
    lineHeight: 1,
    marginBottom: 16,
    background: 'linear-gradient(135deg, #fff 40%, #f0c040)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  tagline: {
    fontSize: 'clamp(15px, 3.5vw, 19px)',
    color: 'rgba(255,255,255,0.65)',
    fontWeight: 400,
    maxWidth: 360,
    lineHeight: 1.6,
    marginBottom: 40,
  },
  ctaBtn: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: '#fff',
    fontSize: 'clamp(16px, 4vw, 20px)',
    fontWeight: 700,
    padding: '18px 44px',
    borderRadius: 10,
    textDecoration: 'none',
    letterSpacing: '0.2px',
    boxShadow: '0 0 40px rgba(34,197,94,0.35)',
    marginBottom: 20,
    animation: 'glow 2.5s ease-in-out infinite',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  urgency: {
    fontSize: 13,
    color: '#f87171',
    fontWeight: 600,
    letterSpacing: '0.3px',
    marginBottom: 32,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  urgencyDot: {
    display: 'inline-block',
    width: 8,
    height: 8,
    background: '#f87171',
    borderRadius: '50%',
    animation: 'blink 1s ease infinite',
  },
  trust: {
    display: 'flex',
    gap: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
  disclaimer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0,0,0,0.5)',
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    padding: '6px 16px',
  },
};
