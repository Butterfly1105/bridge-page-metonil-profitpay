import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';

// ── FAQ accordion ─────────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={S.faqItem}>
      <button style={S.faqQ} onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>{q}</span>
        <span style={{ ...S.faqIcon, transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      {open && <div style={S.faqA}>{a}</div>}
    </div>
  );
}

// ── Reusable order form ───────────────────────────────────────────────────────
function OrderForm({ onSuccess, utmRef, headline, ctaText, onDark }) {
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9) {
      setError('Podaj prawidłowy numer telefonu (min. 9 cyfr).');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, phone: digits, ...utmRef.current }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError('Wystąpił błąd. Spróbuj ponownie lub zadzwoń do nas.');
      }
    } catch {
      setError('Błąd połączenia. Sprawdź internet i spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={onDark ? S.formBoxDark : S.formBox}>
      <h2 style={S.formTitle}>{headline}</h2>
      <form onSubmit={handleSubmit} style={S.form} noValidate>
        <input
          type="text"
          placeholder="Imię i nazwisko"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={S.input}
          autoComplete="name"
        />
        <input
          type="tel"
          placeholder="Numer telefonu (np. 48 123 456 789)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          style={S.input}
          autoComplete="tel"
        />
        {error && <p role="alert" style={S.errorMsg}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ ...S.ctaBtn, opacity: loading ? 0.75 : 1 }}
        >
          {loading ? 'Wysyłanie...' : ctaText}
        </button>
        <p style={S.ctaNote}>🔒 Twoje dane są bezpieczne. Oddzwonimy w ciągu 15 minut.</p>
      </form>
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen() {
  return (
    <>
      <Head>
        <title>Metonil — Dziękujemy za zamówienie!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <header style={S.header}>
        <div style={S.inner}>
          <span style={S.logo}>METONIL</span>
        </div>
      </header>
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={S.successBox}>
          <div style={S.successIcon}>✅</div>
          <h1 style={S.successTitle}>Dziękujemy za zamówienie!</h1>
          <p style={S.successText}>
            Nasz konsultant zadzwoni do Ciebie wkrótce, aby potwierdzić zamówienie.
            Płatność następuje gotówką przy odbiorze paczki.
          </p>
          <div style={S.successDetails}>
            <p>📦 Dostawa: 2–4 dni robocze</p>
            <p>💳 Płatność: gotówką przy odbiorze</p>
            <p>🚚 Wysyłka: gratis</p>
          </div>
        </div>
      </div>
      <GlobalStyles />
    </>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #fff;
        color: #1a1a1a;
      }
      a { text-decoration: none; color: inherit; }
      button { cursor: pointer; font-family: inherit; }
      input:focus { outline: 2px solid #5e2d91; outline-offset: -1px; border-color: #5e2d91 !important; }
    `}</style>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [success, setSuccess] = useState(false);
  const utmRef = useRef({});

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    utmRef.current = {
      gclid:        p.get('gclid')        || p.get('subid') || '',
      utm_source:   p.get('utm_source')   || 'google',
      utm_campaign: p.get('utm_campaign') || 'metonil-pl',
      utm_content:  p.get('utm_content')  || '',
      utm_term:     p.get('utm_term')     || '',
      utm_medium:   p.get('utm_medium')   || 'cpc',
    };
  }, []);

  function handleSuccess() {
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (success) return <SuccessScreen />;

  return (
    <>
      <Head>
        <title>Metonil — Suplement na Stawy | Oficjalny Sklep</title>
        <meta name="description" content="Metonil to suplement diety wspomagający zdrowie stawów i chrząstki. Składniki: Boswellia, Kurkumina, Kolagen Typ II. Dostawa gratis, płatność przy odbiorze." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* GTM */}
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KBNTF44H');` }}
      />
      <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KBNTF44H" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
      </noscript>

      {/* ── HEADER ── */}
      <header style={S.header}>
        <div style={{ ...S.inner, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={S.logo}>METONIL</span>
          <div style={S.headerRight}>
            <span style={S.officialTag}>Oficjalny Sklep</span>
            <span style={S.freeBadge}>🚚 Darmowa dostawa</span>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={S.heroSection}>
        <div style={S.inner}>
          <div style={S.heroBadge}>SUPLEMENT DIETY NA STAWY</div>
          <h1 style={S.headline}>Metonil — Naturalne Wsparcie<br />dla Twoich Stawów</h1>
          <p style={S.subheadline}>
            Formuła z Boswellią, Kurkuminą i Kolagenem Typ II. Wspomaga zdrowie stawów, chrząstki i tkanki łącznej.
          </p>

          <div style={S.productWrapper}>
            <img
              src="/produto.png"
              alt="Metonil kapsułki — suplement diety na stawy"
              style={S.productImg}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>

          <div style={S.offerBox}>
            <div style={S.discountBadge}>−50%</div>
            <p style={S.offerLabel}>ZAMÓW TERAZ — DOSTAWA GRATIS</p>
            <div style={S.priceRow}>
              <span style={S.oldPrice}>198 zł</span>
              <span style={S.price}>99 zł</span>
            </div>
            <div style={S.codPill}>💳 Płatność przy odbiorze (COD)</div>
          </div>

          <OrderForm
            onSuccess={handleSuccess}
            utmRef={utmRef}
            headline="Wypełnij formularz, aby zamówić"
            ctaText="ZAMAWIAM — PŁACĘ PRZY ODBIORZE"
          />
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section style={S.trustStrip}>
        <div style={{ ...S.inner, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 8 }}>
          {[
            { icon: '🚚', label: 'Darmowa dostawa' },
            { icon: '💳', label: 'Płatność przy odbiorze' },
            { icon: '🌿', label: 'Naturalne składniki' },
            { icon: '📞', label: 'Wsparcie klienta' },
          ].map(({ icon, label }) => (
            <div key={label} style={S.trustItem}>
              <span style={S.trustIcon}>{icon}</span>
              <span style={S.trustLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── EDUCATIONAL ── */}
      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.sectionTitle}>Czym są stawy?</h2>
          <p style={S.bodyText}>
            Stawy to połączenia między kośćmi, które umożliwiają ruch ciała. Każdy staw otoczony
            jest chrząstką stawową — elastyczną tkanką, która amortyzuje uderzenia i zapewnia
            płynne poruszanie się.
          </p>
          <p style={S.bodyText}>
            Chrząstka stawowa nie posiada własnych naczyń krwionośnych — odżywia się wyłącznie
            przez maź stawową. Z wiekiem jej zdolność do regeneracji stopniowo maleje, dlatego
            szczególnie ważne staje się odpowiednie odżywianie i suplementacja.
          </p>
          <p style={S.bodyText}>
            Na zdrowie stawów wpływa wiele czynników: aktywność fizyczna, masa ciała, dieta
            oraz uzupełnienie składników odżywczych takich jak kolagen, witamina C i związki
            roślinne.
          </p>
        </div>
      </section>

      {/* ── INGREDIENTS ── */}
      <section style={S.darkSection}>
        <div style={S.inner}>
          <h2 style={S.sectionTitleWhite}>Składniki aktywne Metonil</h2>
          {[
            {
              icon: '🌿',
              name: 'Boswellia Serrata',
              tag:  'Ekstrakt roślinny',
              desc: 'Ekstrakt z żywicy indyjskiej zawierający kwasy bosweliowe — składniki aktywne wspierające prawidłowe funkcjonowanie stawów. Stosowana w tradycyjnej medycynie ajurwedyjskiej.',
            },
            {
              icon: '🟡',
              name: 'Kurkumina',
              tag:  'Polifenol roślinny',
              desc: 'Aktywny polifenol pozyskiwany z kłączy kurkumy (Curcuma longa). Składnik szeroko stosowany w tradycyjnej kuchni i praktykach żywieniowych Azji Południowej. W formie standaryzowanego ekstraktu odznacza się wysoką biodostępnością.',
            },
            {
              icon: '🔬',
              name: 'MSM (Siarka organiczna)',
              tag:  'Związek organiczny',
              desc: 'Metylosulfonylometan — organiczny związek siarki naturalnie występujący w roślinach. Siarka jest składnikiem strukturalnym kolagenu i keratyny, stanowiących budulec chrząstki stawowej.',
            },
            {
              icon: '💊',
              name: 'Kolagen Typ II',
              tag:  'Białko strukturalne',
              desc: 'Natywny kolagen typu II pozyskiwany z mostków kurzych. Stanowi ok. 60% suchej masy chrząstki stawowej. Uzupełnia dietę w aminokwasy niezbędne do utrzymania tkanki łącznej.',
            },
            {
              icon: '🍊',
              name: 'Witamina C',
              tag:  'Witamina',
              desc: 'Kwas askorbinowy przyczynia się do prawidłowego tworzenia kolagenu niezbędnego do funkcjonowania chrząstek i kości. Oświadczenie zdrowotne zatwierdzone przez EFSA (UE nr 13.1).',
            },
          ].map(({ icon, name, tag, desc }) => (
            <div key={name} style={S.ingredientCard}>
              <span style={S.ingredientIcon}>{icon}</span>
              <div style={S.ingredientBody}>
                <div style={S.ingredientMeta}>
                  <h3 style={S.ingredientName}>{name}</h3>
                  <span style={S.ingredientTag}>{tag}</span>
                </div>
                <p style={S.ingredientDesc}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW TO USE ── */}
      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.sectionTitle}>Jak stosować Metonil?</h2>
          <div style={S.stepsWrap}>
            {[
              { num: '1', title: 'Zamów', desc: 'Wypełnij formularz. Nasz konsultant oddzwoni w ciągu 15 minut, aby potwierdzić zamówienie.' },
              { num: '2', title: 'Otrzymaj paczkę', desc: 'Dostawa w 2–4 dni robocze. Płacisz gotówką przy odbiorze — żadnych opłat z góry.' },
              { num: '3', title: 'Stosuj regularnie', desc: '2 kapsułki dziennie z posiłkiem, popijając szklanką wody.' },
            ].map(({ num, title, desc }, i, arr) => (
              <div key={num} style={S.stepRow}>
                <div style={S.stepLeft}>
                  <div style={S.stepNum}>{num}</div>
                  {i < arr.length - 1 && <div style={S.stepLine} />}
                </div>
                <div style={S.stepContent}>
                  <h3 style={S.stepTitle}>{title}</h3>
                  <p style={S.stepDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={S.graySection}>
        <div style={S.inner}>
          <h2 style={S.sectionTitle}>Często zadawane pytania</h2>
          <FAQItem
            q="Czy Metonil to lek?"
            a="Nie. Metonil jest suplementem diety, nie lekiem. Suplement diety uzupełnia dietę w składniki odżywcze i nie służy do leczenia, łagodzenia ani zapobiegania chorobom. W przypadku dolegliwości zdrowotnych należy skonsultować się z lekarzem."
          />
          <FAQItem
            q="Jak przebiega płatność?"
            a="Płatność następuje wyłącznie przy odbiorze paczki — gotówką kurierowi lub w punkcie odbioru. Nie pobieramy żadnych opłat z góry. Nie potrzebujesz karty kredytowej ani konta bankowego."
          />
          <FAQItem
            q="Ile trwa dostawa?"
            a="Standardowy czas dostawy to 2–4 dni robocze na terenie całej Polski. Paczka jest wysyłana po telefonicznym potwierdzeniu zamówienia przez naszego konsultanta."
          />
          <FAQItem
            q="Czy mogę łączyć Metonil z innymi suplementami?"
            a="W przypadku jednoczesnego stosowania kilku suplementów diety lub leków zalecamy konsultację z lekarzem lub farmaceutą przed rozpoczęciem stosowania."
          />
        </div>
      </section>

      {/* ── SECOND FORM ── */}
      <section style={S.darkSection}>
        <div style={S.inner}>
          <div style={S.offerRepeat}>
            <span style={S.oldPrice2}>198 zł</span>
            <span style={S.price2}>99 zł</span>
            <span style={S.discountTag2}>−50%</span>
            <span style={S.freeShip2}>🚚 Dostawa gratis</span>
          </div>
          <OrderForm
            onSuccess={handleSuccess}
            utmRef={utmRef}
            headline="Zamów Metonil — Zapłać przy odbiorze"
            ctaText="ZAMAWIAM — 99 ZŁ PRZY ODBIORZE"
            onDark
          />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={S.footer}>
        <div style={S.inner}>
          <p style={S.footerBrand}>© {new Date().getFullYear()} Metonil. Wszelkie prawa zastrzeżone.</p>
          <p style={S.footerDisclaimer}>
            Metonil jest suplementem diety, a nie lekiem. Suplement diety nie może być stosowany
            jako substytut zrównoważonej i różnorodnej diety oraz zdrowego trybu życia.
            Nie przekraczać zalecanej porcji do spożycia w ciągu dnia. Produkt przechowywać
            w miejscu niedostępnym dla małych dzieci. Nie stosować w ciąży i podczas laktacji
            bez konsultacji z lekarzem lub farmaceutą. Indywidualne wyniki stosowania mogą się
            różnić u różnych osób. Produkt nie jest przeznaczony do diagnozowania, leczenia,
            łagodzenia ani zapobiegania jakimkolwiek chorobom.
          </p>
        </div>
      </footer>

      <GlobalStyles />
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const PURPLE  = '#5e2d91';
const PURPLE2 = '#4a2175';
const GREEN   = '#27ae60';

const S = {
  // Inner content constraint — used inside every section
  inner: {
    maxWidth: 560,
    margin: '0 auto',
    padding: '0 20px',
  },

  // Header
  header: {
    background: PURPLE,
    padding: '13px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 12px rgba(94,45,145,0.35)',
  },
  logo: {
    color: '#fff',
    fontWeight: 900,
    fontSize: 22,
    letterSpacing: 3,
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 3,
  },
  officialTag: {
    background: 'rgba(255,255,255,0.18)',
    color: '#fff',
    fontSize: 9,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  freeBadge: {
    background: GREEN,
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 9px',
    borderRadius: 4,
  },

  // Hero
  heroSection: {
    background: 'linear-gradient(160deg, #f8f4ff 0%, #fff 55%)',
    padding: '28px 0 24px',
    textAlign: 'center',
  },
  heroBadge: {
    display: 'inline-block',
    background: '#ede5ff',
    color: PURPLE,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.2,
    padding: '4px 14px',
    borderRadius: 20,
    marginBottom: 14,
    textTransform: 'uppercase',
    border: `1px solid #c5a8e8`,
  },
  headline: {
    fontSize: 26,
    fontWeight: 900,
    color: '#111',
    lineHeight: 1.2,
    marginBottom: 12,
  },
  subheadline: {
    fontSize: 15,
    color: '#666',
    lineHeight: 1.65,
    marginBottom: 22,
  },
  productWrapper: {
    margin: '0 auto 22px',
    maxWidth: 220,
  },
  productImg: {
    width: '100%',
    objectFit: 'contain',
  },

  // Offer box
  offerBox: {
    background: '#fff',
    border: `2px solid ${PURPLE}`,
    borderRadius: 16,
    padding: '22px 20px 18px',
    marginBottom: 20,
    position: 'relative',
    textAlign: 'center',
    boxShadow: '0 4px 24px rgba(94,45,145,0.1)',
  },
  discountBadge: {
    position: 'absolute',
    top: -15,
    right: 16,
    background: '#e74c3c',
    color: '#fff',
    fontWeight: 900,
    fontSize: 15,
    padding: '4px 14px',
    borderRadius: 20,
    boxShadow: '0 2px 8px rgba(231,76,60,0.4)',
  },
  offerLabel: {
    fontWeight: 700,
    fontSize: 11,
    color: PURPLE,
    marginBottom: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 14,
  },
  oldPrice: {
    fontSize: 18,
    color: '#bbb',
    textDecoration: 'line-through',
  },
  price: {
    fontSize: 46,
    fontWeight: 900,
    color: PURPLE,
    lineHeight: 1,
  },
  codPill: {
    background: PURPLE,
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    padding: '9px 20px',
    borderRadius: 8,
    display: 'inline-block',
  },

  // Form
  formBox: {
    background: '#f8f4ff',
    borderRadius: 16,
    padding: '22px 18px',
    border: `1.5px solid #ddd0f5`,
  },
  formBoxDark: {
    background: '#fff',
    borderRadius: 16,
    padding: '22px 18px',
  },
  formTitle: {
    fontSize: 17,
    fontWeight: 800,
    color: PURPLE,
    textAlign: 'center',
    marginBottom: 16,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    padding: '14px 16px',
    fontSize: 16,
    border: '1.5px solid #d5c8ee',
    borderRadius: 10,
    outline: 'none',
    width: '100%',
    background: '#fff',
    color: '#333',
    transition: 'border-color 0.15s',
  },
  ctaBtn: {
    background: `linear-gradient(180deg, #2ecc71 0%, ${GREEN} 100%)`,
    color: '#fff',
    fontWeight: 900,
    fontSize: 16,
    padding: '17px',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: 1.3,
    boxShadow: '0 4px 18px rgba(39,174,96,0.4)',
    transition: 'opacity 0.2s',
    letterSpacing: 0.3,
    width: '100%',
  },
  ctaNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  errorMsg: {
    fontSize: 13,
    color: '#c0392b',
    textAlign: 'center',
    padding: '8px 12px',
    background: '#fff5f5',
    border: '1px solid #fcc',
    borderRadius: 8,
  },

  // Trust strip
  trustStrip: {
    background: PURPLE2,
    padding: '16px 0',
  },
  trustItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
    flex: '1 1 22%',
    minWidth: 72,
  },
  trustIcon: { fontSize: 24 },
  trustLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: 1.3,
  },

  // White section
  section: {
    background: '#fff',
    padding: '36px 0',
    borderTop: '1px solid #f0f0f0',
  },

  // Dark purple section
  darkSection: {
    background: PURPLE,
    padding: '36px 0',
  },

  // Gray section
  graySection: {
    background: '#f7f5fb',
    padding: '36px 0',
    borderTop: '1px solid #ece6f5',
  },

  // Section titles
  sectionTitle: {
    fontSize: 22,
    fontWeight: 900,
    color: PURPLE,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  sectionTitleWhite: {
    fontSize: 22,
    fontWeight: 900,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  bodyText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 1.8,
    marginBottom: 14,
  },

  // Ingredient cards
  ingredientCard: {
    background: '#fff',
    borderRadius: 14,
    padding: '16px',
    marginBottom: 12,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    boxShadow: '0 2px 12px rgba(0,0,0,0.09)',
  },
  ingredientIcon: {
    fontSize: 32,
    lineHeight: 1,
    flexShrink: 0,
    marginTop: 2,
  },
  ingredientBody: {
    flex: 1,
  },
  ingredientMeta: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  ingredientName: {
    fontSize: 15,
    fontWeight: 800,
    color: PURPLE,
  },
  ingredientTag: {
    background: '#ede5ff',
    color: PURPLE,
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 9px',
    borderRadius: 10,
  },
  ingredientDesc: {
    fontSize: 13,
    color: '#555',
    lineHeight: 1.65,
  },

  // Steps
  stepsWrap: {
    display: 'flex',
    flexDirection: 'column',
  },
  stepRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 0,
  },
  stepLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNum: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: PURPLE,
    color: '#fff',
    fontWeight: 900,
    fontSize: 17,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 2px 10px rgba(94,45,145,0.35)',
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
    background: 'linear-gradient(180deg, #c5a8e8 0%, transparent 100%)',
    margin: '6px 0',
  },
  stepContent: {
    paddingBottom: 28,
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: '#111',
    marginBottom: 4,
    marginTop: 9,
  },
  stepDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 1.6,
  },

  // FAQ
  faqItem: {
    background: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
  },
  faqQ: {
    width: '100%',
    background: '#fff',
    border: 'none',
    padding: '16px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 700,
    color: '#222',
    textAlign: 'left',
    gap: 12,
  },
  faqIcon: {
    color: PURPLE,
    fontSize: 20,
    fontWeight: 300,
    flexShrink: 0,
    transition: 'transform 0.2s',
    lineHeight: 1,
  },
  faqA: {
    padding: '12px 18px 16px',
    fontSize: 13,
    color: '#666',
    lineHeight: 1.75,
    background: '#faf8ff',
    borderTop: '1px solid #ede5ff',
  },

  // Second form offer bar
  offerRepeat: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  oldPrice2: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'line-through',
  },
  price2: {
    fontSize: 30,
    fontWeight: 900,
    color: '#fff',
  },
  discountTag2: {
    background: '#e74c3c',
    color: '#fff',
    fontWeight: 800,
    fontSize: 13,
    padding: '3px 12px',
    borderRadius: 12,
  },
  freeShip2: {
    color: '#2ecc71',
    fontSize: 13,
    fontWeight: 700,
  },

  // Success
  successBox: {
    maxWidth: 460,
    width: '100%',
    padding: '36px 24px',
    background: '#eafaf1',
    border: '2px solid #27ae60',
    borderRadius: 18,
    textAlign: 'center',
  },
  successIcon: { fontSize: 52, marginBottom: 16 },
  successTitle: {
    fontSize: 24,
    fontWeight: 900,
    color: '#1e8449',
    marginBottom: 14,
  },
  successText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 1.75,
    marginBottom: 20,
  },
  successDetails: {
    background: '#fff',
    borderRadius: 10,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    fontSize: 15,
    color: '#333',
    lineHeight: 1.6,
    textAlign: 'left',
  },

  // Footer
  footer: {
    background: '#fafafa',
    padding: '24px 0 28px',
    borderTop: '1px solid #eee',
  },
  footerBrand: {
    fontSize: 12,
    fontWeight: 700,
    color: '#bbb',
    marginBottom: 10,
    textAlign: 'center',
  },
  footerDisclaimer: {
    fontSize: 11,
    color: '#ccc',
    lineHeight: 1.75,
  },
};
