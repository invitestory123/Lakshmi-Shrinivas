import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, useReducedMotion, useScroll } from 'motion/react';
import {
  CalendarBlank,
  MapPin,
  SpeakerHigh,
  SpeakerSlash,
  FlowerLotus,
  Sparkle,
  ArrowDown,
  CheckCircle,
  NavigationArrow,
  X,
  WhatsappLogo,
  Heart,
  EnvelopeOpen
} from '@phosphor-icons/react';
import './styles.css';

// ==========================================
// TARGET DATES & CONSTANTS
// ==========================================

// Kalyana Mahotsavam (Muhurtham) Target: Sunday, 22 November 2026 at 12:15 PM IST
const WEDDING_TARGET = new Date('2026-11-22T12:15:00+05:30');

// Sangeet & Reception Target: Sunday, 29 November 2026 at 6:30 PM IST
const RECEPTION_TARGET = new Date('2026-11-29T18:30:00+05:30');

// Music Sources (From folder)
const MUSIC_MP4_SRC = '/assets/music.mp4';
const FALLBACK_MUSIC_SRC = '/assets/wedding-music.mp3';

// Main God & Goddess Photo for Without Reception / Marriage Hero (1st image)
const PRIMARY_DIVINE_HERO = '/assets/divine-couple-srinivasa-lakshmi.jpg';

// Parents Information
const PARENTS_INFO = {
  bride: {
    role: 'Daughter of',
    father: 'Shri Manjunath Gangal',
    mother: 'Smt. Sunita Gangal',
    fullText: 'Daughter of Shri Manjunath Gangal and Smt. Sunita Gangal'
  },
  groom: {
    role: 'Son of',
    father: 'Shri Shripad Sawkar',
    mother: 'Smt. Nalina Sawkar',
    fullText: 'Son of Shri Shripad Sawkar and Smt. Nalina Sawkar'
  }
};

// Bagalkot Wedding & Engagement Venue (Only Bagalkot for Marriage Link)
const BAGALKOT_VENUE = {
  name: 'Shri Hemaraddi Mallamma Kalyana Mantapa',
  location: 'Bagalkot, Karnataka',
  tag: 'Bagalkot Celebrations · 21 & 22 November 2026',
  address: 'Shri Hemaraddi Mallamma Kalyana Mantapa, Bagalkot, Karnataka',
  mapLink: 'https://share.google/GKkAYUOth7WvYTCw9',
  embedUrl: 'https://www.google.com/maps?q=Shri+Hemaraddi+Mallamma+Kalyana+Mantapa,+Bagalkot,+Karnataka&output=embed',
  eventsHeld: 'Engagement (8:00 PM) & Kalyana Mahotsavam (12:15 PM)'
};

// Bengaluru Reception Venue (For Modern Reception Link)
const BENGALURU_VENUE = {
  name: 'AKIRA ORCHARDS',
  subtitle: '(Aadya Farms & Leisure)',
  tag: 'Bengaluru Celebrations · 29 November 2026',
  address: '#73/1, Jarkabande Kaval, Yelahanka Hobli, Via Attur Post, Bengaluru 560 106',
  date: 'Sunday, 29 November 2026',
  time: '6:30 PM Onwards',
  mapLink: 'https://maps.app.goo.gl/i9owwkGY7QZJa6sj7?g_st=iw',
  embedUrl: 'https://www.google.com/maps?q=Akira+Orchards,+Yelahanka,+Ramagondanahalli,+Bengaluru,+Karnataka+560089&output=embed'
};

// MARRIAGE EVENTS (Without Reception)
// • Removed Haldi & Mehendi box
// • Engagement timings: 8:00 PM onwards
// • Wedding time: 12:15 PM
// • Removed Sangeet & Reception box
const MARRIAGE_EVENTS = [
  {
    number: '01',
    tag: 'Sacred Ring Ceremony',
    name: 'Engagement (Nischitartha)',
    date: 'Saturday, 21 November 2026',
    time: '8:00 PM onwards',
    venue: 'Shri Hemaraddi Mallamma Kalyana Mantapa',
    location: 'Bagalkot, Karnataka',
    note: 'The auspicious ring exchange and sacred promises uniting two loving families.',
    icon: '✦',
    featured: false
  },
  {
    number: '02',
    tag: 'Auspicious Muhurtham',
    name: 'Wedding (Kalyana Mahotsavam)',
    date: 'Sunday, 22 November 2026',
    time: '12:15 PM',
    venue: 'Shri Hemaraddi Mallamma Kalyana Mantapa',
    location: 'Bagalkot, Karnataka',
    note: 'The eternal union blessed by Lord Venkateshwara and Goddess Lakshmi with Saptapadi and Dhaare.',
    icon: '❧',
    featured: true
  }
];

// RECEPTION SCHEDULE (Modern Aesthetic Timeline)
const RECEPTION_SCHEDULE = [
  {
    number: '01',
    name: 'Sangeet & Melodies',
    time: '6:30 PM Onwards',
    note: 'An enchanting musical evening with vibrant rhythms, dance, and celebrations.',
    icon: '♫'
  },
  {
    number: '02',
    name: 'Reception & Felicitations',
    time: '7:30 PM Onwards',
    note: 'Heartfelt greetings, photography, and felicitations with the newlyweds.',
    icon: '✧'
  },
  {
    number: '03',
    name: 'Grand Celebration Dinner',
    time: '8:00 PM Onwards',
    note: 'A lavish culinary banquet under the open starry skies.',
    icon: '❋'
  }
];

// Couple Gallery Photos
const GALLERY_PHOTOS = [
  {
    id: 'red-glamour',
    title: 'Royalty & Grace',
    caption: 'Dressed in radiant smiles and vibrant red',
    badge: 'Lakshmi & Shrinivas',
    src: '/assets/gallery/gallery-1-red-glamour.jpg'
  },
  {
    id: 'sunset-meadow',
    title: 'Golden Sunset Vows',
    caption: 'Hand in hand beneath the eternal evening skies',
    badge: 'Moments Forever',
    src: '/assets/gallery/gallery-2-sunset-meadow.jpg'
  },
  {
    id: 'picnic-laughter',
    title: 'Joyful Laughter & Blossoms',
    caption: 'Playful moments, bubbles, and boundless joy',
    badge: 'Pure Happiness',
    src: '/assets/gallery/gallery-3-picnic-laughter.jpg'
  },
  {
    id: 'romantic-walk',
    title: 'Walking Into Forever',
    caption: 'Together along life’s most beautiful path',
    badge: 'Side By Side',
    src: '/assets/gallery/gallery-4-romantic-walk.jpg'
  }
];

// ==========================================
// CALENDAR DOWNLOAD HELPERS
// ==========================================
function downloadCalendarICS(type: 'wedding' | 'reception') {
  let title = '';
  let description = '';
  let location = '';
  let dtStart = '';
  let dtEnd = '';

  if (type === 'wedding') {
    title = 'Lakshmi & Shrinivas — Kalyana Mahotsavam (Wedding)';
    description = `Wedding ceremony of Lakshmi Gangal (${PARENTS_INFO.bride.fullText}) and Shrinivas Sawkar (${PARENTS_INFO.groom.fullText}) at Bagalkot. Engagement on 21 Nov at 8:00 PM, Kalyana Mahotsavam on 22 Nov at 12:15 PM.`;
    location = 'Shri Hemaraddi Mallamma Kalyana Mantapa, Bagalkot, Karnataka';
    dtStart = '20261122T064500Z'; // 12:15 PM IST = 06:45 AM UTC
    dtEnd = '20261122T103000Z';
  } else {
    title = 'Lakshmi & Shrinivas — Sangeet & Reception';
    description = `Sangeet & Reception of Lakshmi Gangal and Shrinivas Sawkar at AKIRA ORCHARDS, Bengaluru.`;
    location = 'AKIRA ORCHARDS (Aadya Farms & Leisure), Yelahanka, Bengaluru 560106';
    dtStart = '20261129T130000Z'; // 06:30 PM IST = 01:00 PM UTC
    dtEnd = '20261129T180000Z';
  }

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lakshmi & Shrinivas Invitation//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lakshmi-shrinivas-${type}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

// ==========================================
// COUNTDOWN COMPONENT
// ==========================================
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = Math.max(0, targetDate.getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000) % 24;
  const mins = Math.floor(diff / 60000) % 60;
  const secs = Math.floor(diff / 1000) % 60;

  const units = [
    { label: 'Days', val: days },
    { label: 'Hours', val: hours },
    { label: 'Minutes', val: mins },
    { label: 'Seconds', val: secs }
  ];

  return (
    <div className="countdown-grid">
      {units.map((u, i) => (
        <div key={i} className="count-box">
          <motion.div
            key={u.val}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="num"
          >
            {String(u.val).padStart(2, '0')}
          </motion.div>
          <small>{u.label}</small>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// SCRATCH CARD DATE REVEAL
// ==========================================
function ScratchCardDate({ view }: { view: 'marriage' | 'reception' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const isScratching = useRef(false);
  const strokesCount = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(ratio, ratio);

    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#c98b27');
    grad.addColorStop(0.3, '#f9dc98');
    grad.addColorStop(0.6, '#e0a33c');
    grad.addColorStop(1, '#9e6312');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = '#4f2c0f';
    ctx.textAlign = 'center';
    ctx.font = '600 11px Marcellus, serif';
    ctx.fillText(
      view === 'marriage' ? 'SCRATCH TO REVEAL MUHURTHAM DATE' : 'SCRATCH TO REVEAL RECEPTION DATE',
      rect.width / 2,
      rect.height / 2 - 12
    );
    ctx.font = '28px serif';
    ctx.fillText(view === 'marriage' ? '🪷' : '✨', rect.width / 2, rect.height / 2 + 24);
  }, [view]);

  const handleScratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching.current || revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(e.clientX - rect.left, e.clientY - rect.top, 28, 0, Math.PI * 2);
    ctx.fill();

    strokesCount.current += 1;
    if (strokesCount.current > 38) {
      setRevealed(true);
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      if ('vibrate' in navigator) navigator.vibrate(30);
    }
  };

  return (
    <section className="scratch-section">
      <p className="section-kicker">
        {view === 'marriage' ? 'Auspicious Muhurtham' : 'Sangeet & Reception'}
      </p>
      <h2 className="section-heading">
        {view === 'marriage' ? 'Saved in the Stars' : 'Save Our Celebration Date'}
      </h2>
      <div className="scratch-card-wrapper">
        <div className="scratch-revealed-bg">
          {view === 'marriage' ? (
            <>
              <small>Sunday · Kalyana Muhurtham</small>
              <b>22</b>
              <span>November · 2026</span>
              <em>12:15 PM · Bagalkot, Karnataka</em>
            </>
          ) : (
            <>
              <small>Sunday · Sangeet & Reception</small>
              <b>29</b>
              <span>November · 2026</span>
              <em>6:30 PM · AKIRA ORCHARDS, Bengaluru</em>
            </>
          )}
        </div>
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            isScratching.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            handleScratch(e);
          }}
          onPointerMove={handleScratch}
          onPointerUp={() => { isScratching.current = false; }}
          onPointerCancel={() => { isScratching.current = false; }}
        />
      </div>
      <p className="scratch-instruction">
        {revealed
          ? 'We eagerly await your presence with blessings ♡'
          : `Gently swipe or rub to reveal the ${view === 'marriage' ? 'wedding' : 'reception'} date`}
      </p>
    </section>
  );
}

// ==========================================
// PETAL SHOWER ANIMATION
// ==========================================
function PetalShower() {
  const petals = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${(i * 5.8 + Math.random() * 4) % 96}%`,
      delay: `${(i * 0.75) % 8}s`,
      duration: `${6 + (i % 5) * 1.5}s`,
      size: `${16 + (i % 4) * 6}px`,
      symbol: i % 3 === 0 ? '🌸' : i % 3 === 1 ? '🪷' : '✨'
    }));
  }, []);

  return (
    <div className="pushpa-vrishti" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: p.size
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}

// ==========================================
// MAIN APPLICATION
// ==========================================
function App() {
  // Query param detection: default to 'marriage' (without reception)
  const [currentView, setCurrentView] = useState<'marriage' | 'reception'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view') || params.get('type') || params.get('event');
      if (v === 'reception' || window.location.hash === '#reception') {
        return 'reception';
      }
    }
    return 'marriage';
  });

  const [hasOpened, setHasOpened] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showBlessingModal, setShowBlessingModal] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<typeof GALLERY_PHOTOS[0] | null>(null);

  // Parallax Tilt
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Audio Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpEventChoice, setRsvpEventChoice] = useState('Both Engagement & Kalyana Mahotsavam');
  const [rsvpGuests, setRsvpGuests] = useState('2');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Synchronize document title with active view
  useEffect(() => {
    if (currentView === 'marriage') {
      document.title = 'Lakshmi & Shrinivas · Kalyana Mahotsavam · 21 & 22 November 2026';
    } else {
      document.title = 'Lakshmi & Shrinivas · Sangeet & Reception · 29 November 2026';
    }
  }, [currentView]);

  // View Switch Handler
  const switchView = (target: 'marriage' | 'reception') => {
    setCurrentView(target);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (target === 'reception') {
        url.searchParams.set('view', 'reception');
      } else {
        url.searchParams.delete('view');
      }
      window.history.replaceState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Music handlers
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isAudioPlaying) {
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      audio.play().then(() => setIsAudioPlaying(true)).catch((e) => console.warn(e));
    }
  };

  const handleOpenInvitation = () => {
    setHasOpened(true);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.85;
      audio.play().then(() => setIsAudioPlaying(true)).catch((e) => console.log('Autoplay:', e));
    }
  };

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };

  const handleStageMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // WhatsApp RSVP
  const handleWhatsAppRSVP = () => {
    const guest = rsvpName.trim() || 'Guest';
    let text = '';
    if (currentView === 'marriage') {
      text = encodeURIComponent(
        `*Wedding RSVP for Lakshmi & Shrinivas (Bagalkot)*\n\n` +
        `Namaste! We are happy to confirm our presence for the wedding celebrations in Bagalkot.\n` +
        `• *Guest Name:* ${guest}\n` +
        `• *Phone:* ${rsvpPhone.trim() || 'N/A'}\n` +
        `• *Events Attending:* ${rsvpEventChoice}\n` +
        `• *Number of Guests:* ${rsvpGuests}\n` +
        (rsvpMessage.trim() ? `• *Blessings:* ${rsvpMessage.trim()}\n` : '') +
        `\nLooking forward to seeking blessings together in Bagalkot!`
      );
    } else {
      text = encodeURIComponent(
        `*Sangeet & Reception RSVP for Lakshmi & Shrinivas (Bengaluru)*\n\n` +
        `Namaste! We are delighted to confirm our presence for the Sangeet & Reception on 29th November 2026 at AKIRA ORCHARDS, Bengaluru.\n` +
        `• *Guest Name:* ${guest}\n` +
        `• *Phone:* ${rsvpPhone.trim() || 'N/A'}\n` +
        `• *Number of Guests:* ${rsvpGuests}\n` +
        (rsvpMessage.trim() ? `• *Warm Wishes:* ${rsvpMessage.trim()}\n` : '') +
        `\nCan't wait to celebrate with Lakshmi & Shrinivas!`
      );
    }
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleFormRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    setRsvpSubmitted(true);
  };

  return (
    <main>
      {/* Background Wedding Music Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
        loop
        onPlay={() => setIsAudioPlaying(true)}
        onPause={() => setIsAudioPlaying(false)}
      >
        <source src={MUSIC_MP4_SRC} type="audio/mp4" />
        <source src={MUSIC_MP4_SRC} type="video/mp4" />
        <source src={FALLBACK_MUSIC_SRC} type="audio/mpeg" />
      </audio>

      {/* Scroll indicator bar */}
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />

      {/* Floating Music Controller Bar */}
      <button
        className={`ambient-bar ${!isAudioPlaying ? 'muted' : ''}`}
        onClick={toggleMusic}
        aria-label="Toggle music"
        title={isAudioPlaying ? 'Mute Music' : 'Play Music'}
      >
        {isAudioPlaying ? (
          <SpeakerHigh size={18} weight="fill" color="#ffd54f" />
        ) : (
          <SpeakerSlash size={18} weight="bold" color="#e0a33c" />
        )}
        <span>{isAudioPlaying ? 'Music Playing' : 'Play Music'}</span>
        <div className="audio-waves" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
      </button>

      {/* Floating View Switcher Bar (Easy toggle between Marriage & Modern Reception) */}
      <nav className="invitation-switch-bar" aria-label="Switch Invitation Version">
        <button
          className={`invitation-switch-btn ${currentView === 'marriage' ? 'active' : ''}`}
          onClick={() => switchView('marriage')}
          title="Marriage Invitation (Without Reception)"
        >
          💍 Marriage (Bagalkot)
        </button>
        <button
          className={`invitation-switch-btn ${currentView === 'reception' ? 'active' : ''}`}
          onClick={() => switchView('reception')}
          title="Modern Aesthetic Reception Invitation"
        >
          ✨ Reception (Bengaluru)
        </button>
      </nav>

      {/* Welcome Envelope / Gate */}
      <AnimatePresence>
        {!hasOpened && (
          <motion.div
            className="welcome-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="welcome-card-box">
              <span className="mantra-kannada">॥ ಶ್ರೀ ಲಕ್ಷ್ಮೀ ವೆಂಕಟೇಶ್ವರ ಪ್ರಸನ್ನ ॥</span>
              <small>Together with our families</small>
              <h1>
                Lakshmi <em>&</em> Shrinivas
              </h1>

              {/* Parents Names Lineage */}
              <div className="welcome-lineage-box">
                <div className="welcome-lineage-row">
                  <span>Bride's Parents</span>
                  <strong>{PARENTS_INFO.bride.father}</strong> &amp; <strong>{PARENTS_INFO.bride.mother}</strong>
                </div>
                <div className="welcome-lineage-row">
                  <span>Groom's Parents</span>
                  <strong>{PARENTS_INFO.groom.father}</strong> &amp; <strong>{PARENTS_INFO.groom.mother}</strong>
                </div>
              </div>

              <p className="invite-text">
                {currentView === 'marriage'
                  ? 'cordially invite you to celebrate our holy wedding'
                  : 'cordially invite you to celebrate our Sangeet & Reception'}
              </p>

              <div className="dates-chip">
                {currentView === 'marriage' ? (
                  <span>21 &amp; 22 November 2026 · Bagalkot</span>
                ) : (
                  <span>Sunday · 29 November 2026 · Bengaluru</span>
                )}
              </div>

              <motion.button
                className="open-card-btn"
                whileTap={{ scale: 0.96 }}
                onClick={handleOpenInvitation}
              >
                <span className="btn-seal-icon">
                  <FlowerLotus size={18} weight="fill" />
                </span>
                <b>Open Sacred Invitation</b>
              </motion.button>
              <div style={{ marginTop: '12px', fontSize: '10.5px', color: '#8c5b2a', letterSpacing: '0.08em' }}>
                ♫ Tap to open with music
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          VIEW 1: MARRIAGE INVITATION (WITHOUT RECEPTION)
          • 29 removed from front page (21 · 22 NOVEMBER 2026)
          • Bengaluru removed from front page (BAGALKOT, KARNATAKA)
          • Haldi and Mehndi box removed
          • Engagement: 8:00 PM onwards
          • Wedding time: 12:15 PM
          • Sangeet and Reception box removed
          • Bangalore map removed
          • Parents name prominently added
          • 1st image (Lord Srinivasa & Lakshmi) as hero
          ======================================================== */}
      {currentView === 'marriage' ? (
        <div className="marriage-view-wrapper">
          {/* HERO SECTION */}
          <section className="hero">
            <div className="hero-backdrop" aria-hidden="true">
              <img
                src={PRIMARY_DIVINE_HERO}
                alt="Lord Srinivasa and Goddess Lakshmi Temple Art"
                className="hero-backdrop-img"
              />
              <div className="hero-overlay-scrim" />
            </div>

            {/* Dynamic Divine Aura */}
            <div className="divine-aura-glow" aria-hidden="true" />
            <div className="namam-ray" aria-hidden="true" />

            {/* Deepas */}
            <div className="hanging-deepas" aria-hidden="true">
              <span className="deepa-glow deepa-left-top" />
              <span className="deepa-glow deepa-right-top" />
              <span className="deepa-glow deepa-left-mid" />
              <span className="deepa-glow deepa-right-mid" />
            </div>

            {/* Cascading Petals */}
            <PetalShower />

            {/* Top Shloka & Names */}
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <p className="divine-shloka">॥ ಶ್ರೀ ಲಕ್ಷ್ಮೀ ವೆಂಕಟೇಶ ಪ್ರಸನ್ನ ॥</p>
              <p className="parents-blessing">WITH THE DIVINE BLESSINGS OF OUR FAMILIES</p>
              
              <h1 className="hero-names">
                Lakshmi <span className="and">&</span> Shrinivas
              </h1>

              {/* Parents Names Lineage Banner */}
              <div className="parents-lineage-banner">
                <div className="lineage-col">
                  <span className="role-tag">Daughter of</span>
                  <span className="names-text">
                    {PARENTS_INFO.bride.father} &amp; {PARENTS_INFO.bride.mother}
                  </span>
                </div>
                <span className="lineage-sparkle">✦</span>
                <div className="lineage-col">
                  <span className="role-tag">Son of</span>
                  <span className="names-text">
                    {PARENTS_INFO.groom.father} &amp; {PARENTS_INFO.groom.mother}
                  </span>
                </div>
              </div>

              {/* Date Strip: 29 REMOVED! Only 21 · 22 November 2026 */}
              <div className="hero-dates-strip">
                <i />
                <span>21 · 22 NOVEMBER 2026</span>
                <i />
              </div>

              {/* Location: BENGALURU REMOVED! Only BAGALKOT, KARNATAKA */}
              <div className="hero-locations">BAGALKOT, KARNATAKA</div>
            </motion.div>

            {/* Main Divine Portrait Frame (1st image: Lord Srinivasa & Goddess Lakshmi) */}
            <div
              className="divine-art-stage"
              onMouseMove={handleStageMouseMove}
              onMouseLeave={handleStageMouseLeave}
              style={{
                transform: reduceMotion
                  ? 'none'
                  : `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
              }}
            >
              <div className="divine-art-inner">
                <img
                  src={PRIMARY_DIVINE_HERO}
                  alt="Lord Srinivasa and Goddess Lakshmi"
                  className="divine-main-img"
                />

                {/* Frame Corner Ornaments */}
                <span className="frame-corner fc-tl" />
                <span className="frame-corner fc-tr" />
                <span className="frame-corner fc-bl" />
                <span className="frame-corner fc-br" />

                {/* Twinkling Jewels & Crown Sparkles */}
                <span className="twinkle-star ts-crown-shrinivas"><Sparkle weight="fill" /></span>
                <span className="twinkle-star ts-crown-lakshmi"><Sparkle weight="fill" /></span>
                <span className="twinkle-star ts-namam"><Sparkle weight="fill" /></span>
                <span className="twinkle-star ts-lotus-flower"><FlowerLotus weight="fill" /></span>

                {/* Seek Divine Blessings Pill */}
                <button
                  className="darshan-badge"
                  onClick={() => setShowBlessingModal(true)}
                  title="Touch for Divine Blessings"
                >
                  <Sparkle size={14} weight="fill" color="#ffd54f" />
                  <span>Seek Divine Blessings · ಆಶೀರ್ವಾದ</span>
                </button>
              </div>
            </div>

            {/* Scroll down cue */}
            <div className="scroll-indicator">
              <span>Explore Celebrations</span>
              <ArrowDown size={15} weight="bold" />
            </div>
          </section>

          {/* FAMILY TRIBUTE: DEDICATED PARENTS BLESSINGS SECTION */}
          <section className="family-tribute-section">
            <div className="family-tribute-card">
              <span className="family-tribute-kicker">With the Eternal Blessings of Our Beloved Parents</span>
              <h2 className="family-tribute-title">Gangal &amp; Sawkar Families</h2>
              
              <div className="family-parents-grid">
                <div className="family-parent-card">
                  <span className="family-parent-tag">Bride's Parents</span>
                  <div className="family-parent-names">
                    {PARENTS_INFO.bride.father}
                    <br />
                    &amp; {PARENTS_INFO.bride.mother}
                  </div>
                  <span className="family-child-badge">Daughter: Lakshmi Gangal</span>
                </div>

                <div className="family-divider-icon">
                  <FlowerLotus size={32} weight="fill" />
                </div>

                <div className="family-parent-card">
                  <span className="family-parent-tag">Groom's Parents</span>
                  <div className="family-parent-names">
                    {PARENTS_INFO.groom.father}
                    <br />
                    &amp; {PARENTS_INFO.groom.mother}
                  </div>
                  <span className="family-child-badge">Son: Shrinivas Sawkar</span>
                </div>
              </div>
            </div>
          </section>

          {/* COUPLE PHOTO GALLERY */}
          <section className="gallery-section">
            <div className="gallery-container">
              <p className="section-kicker">Moments of Togetherness</p>
              <h2 className="section-heading">Our Love Story in Frames</h2>
              <p style={{ color: '#6e482b', maxWidth: '580px', margin: '0 auto', fontSize: '15.5px' }}>
                From shared dreams and laughter to the beginning of our forever journey. Tap on any picture to view full size.
              </p>

              <div className="gallery-grid">
                {GALLERY_PHOTOS.map((photo) => (
                  <motion.div
                    key={photo.id}
                    className="gallery-card"
                    onClick={() => setSelectedPhotoModal(photo)}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="gallery-img-box">
                      <span className="gallery-badge">{photo.badge}</span>
                      <img src={photo.src} alt={photo.title} loading="lazy" />
                    </div>
                    <div className="gallery-caption">
                      <h4>{photo.title}</h4>
                      <p>{photo.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* COUNTDOWN SECTION (Targeted to Kalyana Muhurtham: 22 Nov 2026, 12:15 PM) */}
          <section className="countdown-section">
            <p className="section-kicker">Until the Kalyana Muhurtham</p>
            <h2 className="section-heading">Countdown to 22nd November</h2>
            <CountdownTimer targetDate={WEDDING_TARGET} />
          </section>

          {/* INTERACTIVE SCRATCH TO REVEAL DATE (22 November 2026, 12:15 PM) */}
          <ScratchCardDate view="marriage" />

          {/* SACRED VOWS & STORY (Photo 2: Shankha & Chakra Divine Hands) */}
          <section className="story-section">
            <div className="story-container">
              <FlowerLotus size={32} weight="thin" color="#b83350" />
              <p className="story-script-heading">The Divine Union</p>
              <h2 className="section-heading">Named in Reverence, United in Love</h2>

              <div className="divine-hands-feature">
                <img
                  src="/assets/divine-hands-shankha-chakra.jpg"
                  alt="Sacred hands holding the holy Shankha and Sudarshana Chakra"
                />
              </div>

              <p className="story-body-text">
                When two souls are drawn together by divine grace, every ritual becomes a sacred blessing.
                Carrying the auspicious names of Goddess Mahalakshmi and Lord Srinivasa, our journey begins
                with sacred promises, Vedic traditions, and the cherished blessings of our parents and families.
              </p>
              <div className="couple-signatures">Lakshmi &amp; Shrinivas</div>
            </div>
          </section>

          {/* WEDDING CEREMONY & SACRED AGNI (Photo 3: Traditional Kalyana Homa) */}
          <section className="ceremony-section">
            <div className="ceremony-grid">
              <div className="ceremony-art-wrapper">
                <img
                  src="/assets/traditional-kalyana-homa.jpg"
                  alt="Lord Vishnu and Goddess Jaya Lakshmi at the sacred Kalyana Agni Homa"
                />
                <div className="homa-fire-glow" aria-hidden="true" />
              </div>

              <div className="ceremony-text">
                <p className="section-kicker">Kalyana Mahotsavam</p>
                <h2 className="section-heading">Before the Sacred Fire</h2>
                <p>
                  With holy Vedic chants, the fragrance of sandalwood, camphor, and seven sacred steps (Saptapadi),
                  Lord Srinivasa and Goddess Lakshmi stand as the eternal guardians of our lifelong union.
                </p>
                <p style={{ marginTop: '14px', fontSize: '13.5px', color: '#ffd89a', letterSpacing: '0.08em' }}>
                  ✦ Kalyana Muhurtham · Sunday, 22nd November 2026 · 12:15 PM · Bagalkot ✦
                </p>
              </div>
            </div>
          </section>

          {/* WEDDING FESTIVITIES & EVENTS TIMELINE
              • REMOVED Haldi & Mehendi box
              • Engagement: 8:00 PM onwards
              • Wedding: 12:15 PM
              • REMOVED Sangeet & Reception box
          */}
          <section className="events-section">
            <div style={{ textAlign: 'center' }}>
              <p className="section-kicker">Celebration Schedule</p>
              <h2 className="section-heading">Auspicious Wedding Ceremonies</h2>
              <p style={{ color: '#7b4f2c', maxWidth: '520px', margin: '0 auto' }}>
                Join us in celebrating our sacred milestones in Bagalkot with love and heartfelt blessings.
              </p>
            </div>

            <div className="events-wrapper">
              {MARRIAGE_EVENTS.map((event, idx) => (
                <motion.div
                  key={event.name}
                  className={`event-card ${event.featured ? 'featured-event' : ''}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <div className="event-badge-strip">
                    <span className="event-badge-num">{event.number}</span>
                    <span className="event-badge-tag">{event.tag}</span>
                  </div>
                  <h3>
                    {event.icon} {event.name}
                  </h3>
                  <p className="event-note">{event.note}</p>

                  <dl className="event-meta-grid">
                    <div className="meta-item">
                      <dt>Date</dt>
                      <dd>{event.date}</dd>
                    </div>
                    <div className="meta-item">
                      <dt>Time</dt>
                      <dd style={{ fontWeight: 700, color: event.featured ? '#b83350' : 'inherit' }}>
                        {event.time}
                      </dd>
                    </div>
                    <div className="meta-item">
                      <dt>Venue</dt>
                      <dd>{event.venue}, {event.location}</dd>
                    </div>
                  </dl>
                </motion.div>
              ))}
            </div>
          </section>

          {/* VENUE SECTION: ONLY BAGALKOT (BANGALORE MAP REMOVED!) */}
          <section className="venue-section">
            <div className="venue-container">
              <p className="section-kicker">Find Your Way</p>
              <h2 className="section-heading">Wedding &amp; Engagement Venue</h2>
              <p style={{ color: '#634026' }}>
                We eagerly await your presence at Shri Hemaraddi Mallamma Kalyana Mantapa, Bagalkot.
              </p>

              <div className="venue-display-card" style={{ marginTop: '24px' }}>
                <div className="venue-header-info">
                  <span className="venue-dates-tag">{BAGALKOT_VENUE.tag}</span>
                  <h3>{BAGALKOT_VENUE.name}</h3>
                  <p className="venue-address-text">{BAGALKOT_VENUE.address}</p>
                </div>

                <div className="map-iframe-wrapper">
                  <iframe
                    title="Bagalkot Wedding Venue Map"
                    src={BAGALKOT_VENUE.embedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="venue-action-btns">
                  <a
                    className="action-btn btn-primary"
                    href={BAGALKOT_VENUE.mapLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <NavigationArrow size={18} weight="bold" />
                    Open in Google Maps
                  </a>
                  <button
                    className="action-btn btn-secondary"
                    onClick={() => downloadCalendarICS('wedding')}
                  >
                    <CalendarBlank size={18} weight="bold" />
                    Add Wedding to Calendar
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* RSVP SECTION FOR WEDDING IN BAGALKOT */}
          <section className="rsvp-section">
            <div className="rsvp-box">
              <p className="section-kicker" style={{ textAlign: 'center' }}>Warmest Welcome</p>
              <h2>RSVP For Wedding &amp; Engagement</h2>
              <p className="rsvp-subtitle">
                Your presence and blessings in Bagalkot will make our wedding day truly memorable!
              </p>

              {rsvpSubmitted ? (
                <div className="rsvp-confirmed-box">
                  <CheckCircle size={42} weight="fill" color="#166534" />
                  <h4>Thank You, {rsvpName || 'Dear Guest'}!</h4>
                  <p style={{ margin: '8px 0', color: '#14532d' }}>
                    Your RSVP has been joyfully recorded. We eagerly await welcoming you in Bagalkot!
                  </p>
                  <button
                    className="action-btn btn-whatsapp"
                    style={{ margin: '14px auto 0' }}
                    onClick={handleWhatsAppRSVP}
                  >
                    <WhatsappLogo size={18} weight="fill" />
                    Send Confirmation on WhatsApp
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormRSVP} className="rsvp-form">
                  <div className="rsvp-form-group">
                    <label>Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar & Family"
                      className="rsvp-input"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                    />
                  </div>

                  <div className="rsvp-form-group">
                    <label>Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      className="rsvp-input"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                    />
                  </div>

                  <div className="rsvp-form-group">
                    <label>Ceremonies You Will Attend</label>
                    <select
                      className="rsvp-select"
                      value={rsvpEventChoice}
                      onChange={(e) => setRsvpEventChoice(e.target.value)}
                    >
                      <option value="Both Engagement & Kalyana Mahotsavam">
                        Both Engagement (8:00 PM) &amp; Kalyana Mahotsavam (12:15 PM)
                      </option>
                      <option value="Engagement Only (Saturday, Nov 21 · 8:00 PM)">
                        Engagement Only (Saturday, Nov 21 · 8:00 PM)
                      </option>
                      <option value="Kalyana Mahotsavam Only (Sunday, Nov 22 · 12:15 PM)">
                        Kalyana Mahotsavam Only (Sunday, Nov 22 · 12:15 PM)
                      </option>
                    </select>
                  </div>

                  <div className="rsvp-form-group">
                    <label>Number of Guests Attending</label>
                    <select
                      className="rsvp-select"
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5+">5+ Guests (Family)</option>
                    </select>
                  </div>

                  <div className="rsvp-form-group">
                    <label>Blessings for Lakshmi &amp; Shrinivas</label>
                    <textarea
                      rows={3}
                      placeholder="May Lord Srinivasa and Goddess Lakshmi bless you both with eternal joy..."
                      className="rsvp-textarea"
                      value={rsvpMessage}
                      onChange={(e) => setRsvpMessage(e.target.value)}
                    />
                  </div>

                  <div className="rsvp-btns-row">
                    <button type="submit" className="action-btn btn-primary">
                      Confirm Wedding RSVP
                    </button>
                    <button
                      type="button"
                      className="action-btn btn-whatsapp"
                      onClick={handleWhatsAppRSVP}
                    >
                      <WhatsappLogo size={18} weight="fill" />
                      RSVP via WhatsApp
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* FOOTER */}
          <footer>
            <img
              src={PRIMARY_DIVINE_HERO}
              alt="Divine couple background"
              className="footer-art-backdrop"
            />
            <div className="footer-content">
              <FlowerLotus size={28} weight="fill" color="#f4d58d" />
              <p className="footer-invite-text">With Gratitude &amp; Joy</p>
              <h2>Lakshmi &amp; Shrinivas</h2>
              
              <p style={{ margin: '8px 0', fontSize: '12.5px', color: '#ffdfa8' }}>
                {PARENTS_INFO.bride.fullText}
                <br />
                {PARENTS_INFO.groom.fullText}
              </p>

              <span className="footer-date">
                Kalyana Mahotsavam · 21 &amp; 22 November 2026 · Bagalkot
              </span>
              <p style={{ marginTop: '16px', fontSize: '12px', color: '#eed6aa', fontStyle: 'italic' }}>
                ॥ ಶ್ರೀ ಲಕ್ಷ್ಮೀ ವೆಂಕಟೇಶ್ವರಾಯ ನಮಃ ॥
              </p>
            </div>
          </footer>
        </div>
      ) : (
        /* ========================================================
           VIEW 2: MODERN & AESTHETIC RECEPTION INVITATION
           "With reception one, make it little modern and aesthetic not traditional."
           • Contemporary luxury editorial aesthetic
           • Deep velvet & rose gold champagne palette
           • Sangeet & Reception on Sunday, 29 November 2026
           • AKIRA ORCHARDS, Bengaluru
           • Bangalore venue map & directions
           • Modern countdown & schedule
           ======================================================== */
        <div className="modern-rec-page">
          <section className="modern-rec-hero">
            <div className="reception-glow-bg" />
            <div className="reception-sparkle-stars" />

            <div className="modern-rec-badge">
              <Sparkle size={14} weight="fill" />
              Sangeet &amp; Reception Evening · Bengaluru
            </div>

            <h1 className="modern-rec-title">Lakshmi &amp; Shrinivas</h1>
            <p className="modern-rec-subtitle">Together with our families</p>

            <div className="modern-rec-parents">
              {PARENTS_INFO.bride.fullText}
              <br />
              {PARENTS_INFO.groom.fullText}
            </div>

            <div className="modern-rec-date-strip">
              Sunday · 29 November 2026 · 6:30 PM Onwards
            </div>

            {/* Couple Spotlight Frame */}
            <div className="modern-rec-photo-card">
              <img
                src="/assets/gallery/gallery-1-red-glamour.jpg"
                alt="Lakshmi and Shrinivas in modern evening elegance"
              />
            </div>

            <h2 style={{ fontFamily: 'Italiana, serif', fontSize: '32px', color: '#fff4d9', margin: '10px 0' }}>
              Celebration of Love &amp; Music
            </h2>
            <p style={{ maxWidth: '520px', color: '#ffd6e0', fontSize: '15px', lineHeight: 1.6 }}>
              Join us for an unforgettable evening under the starlit sky filled with harmonious melodies,
              celebratory toasts, and a grand gourmet banquet.
            </p>

            <div className="reception-actions" style={{ marginTop: '22px' }}>
              <a
                className="action-btn btn-primary"
                href={BENGALURU_VENUE.mapLink}
                target="_blank"
                rel="noreferrer"
              >
                <NavigationArrow size={18} weight="bold" />
                Open Bengaluru Map Link
              </a>
              <button
                className="action-btn btn-secondary"
                style={{ color: '#fff4d9', borderColor: '#ffd89a' }}
                onClick={() => downloadCalendarICS('reception')}
              >
                <CalendarBlank size={18} weight="bold" />
                Add to Calendar
              </button>
            </div>
          </section>

          {/* RECEPTION COUNTDOWN */}
          <section className="countdown-section" style={{ background: '#140612', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="section-kicker" style={{ color: '#ffb3c6' }}>Counting Down to the Evening</p>
            <h2 className="section-heading" style={{ color: '#fff4e8' }}>Countdown to 29th November</h2>
            <CountdownTimer targetDate={RECEPTION_TARGET} />
          </section>

          {/* SCRATCH CARD FOR RECEPTION */}
          <ScratchCardDate view="reception" />

          {/* MODERN RECEPTION SCHEDULE */}
          <section className="events-section" style={{ background: '#0e040c' }}>
            <div style={{ textAlign: 'center' }}>
              <p className="section-kicker" style={{ color: '#ffb3c6' }}>Evening Itinerary</p>
              <h2 className="section-heading" style={{ color: '#fff4e8' }}>Sangeet &amp; Reception Program</h2>
              <p style={{ color: '#dfc0ad', maxWidth: '520px', margin: '0 auto' }}>
                AKIRA ORCHARDS (Aadya Farms &amp; Leisure), Bengaluru
              </p>
            </div>

            <div className="events-wrapper">
              {RECEPTION_SCHEDULE.map((item, idx) => (
                <motion.div
                  key={item.name}
                  className="event-card"
                  style={{
                    background: 'rgba(38, 16, 32, 0.7)',
                    borderColor: 'rgba(255, 200, 140, 0.3)',
                    color: '#fff'
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <div className="event-badge-strip">
                    <span className="event-badge-num">{item.number}</span>
                    <span className="event-badge-tag" style={{ color: '#ffd89a' }}>{item.time}</span>
                  </div>
                  <h3 style={{ color: '#fff5ea' }}>
                    {item.icon} {item.name}
                  </h3>
                  <p className="event-note" style={{ color: '#ebd0be' }}>{item.note}</p>

                  <dl className="event-meta-grid">
                    <div className="meta-item">
                      <dt style={{ color: '#ffc2d1' }}>Date</dt>
                      <dd style={{ color: '#fff' }}>Sunday, 29 November 2026</dd>
                    </div>
                    <div className="meta-item">
                      <dt style={{ color: '#ffc2d1' }}>Timing</dt>
                      <dd style={{ color: '#fff' }}>{item.time}</dd>
                    </div>
                    <div className="meta-item">
                      <dt style={{ color: '#ffc2d1' }}>Venue</dt>
                      <dd style={{ color: '#fff' }}>AKIRA ORCHARDS, Bengaluru</dd>
                    </div>
                  </dl>
                </motion.div>
              ))}
            </div>
          </section>

          {/* COUPLE PHOTO GALLERY */}
          <section className="gallery-section" style={{ background: '#12050f' }}>
            <div className="gallery-container">
              <p className="section-kicker" style={{ color: '#ffb3c6' }}>Moments of Joy</p>
              <h2 className="section-heading" style={{ color: '#fff4e8' }}>Our Story in Frames</h2>
              <div className="gallery-grid">
                {GALLERY_PHOTOS.map((photo) => (
                  <motion.div
                    key={photo.id}
                    className="gallery-card"
                    onClick={() => setSelectedPhotoModal(photo)}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="gallery-img-box">
                      <span className="gallery-badge">{photo.badge}</span>
                      <img src={photo.src} alt={photo.title} loading="lazy" />
                    </div>
                    <div className="gallery-caption">
                      <h4 style={{ color: '#fff' }}>{photo.title}</h4>
                      <p style={{ color: '#eed' }}>{photo.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* VENUE: AKIRA ORCHARDS BENGALURU */}
          <section className="venue-section" style={{ background: '#0a0208' }}>
            <div className="venue-container">
              <p className="section-kicker" style={{ color: '#ffb3c6' }}>Location &amp; Directions</p>
              <h2 className="section-heading" style={{ color: '#fff4e8' }}>Reception Venue</h2>
              <p style={{ color: '#dfc2af' }}>
                Join us at AKIRA ORCHARDS, Yelahanka Hobli, Bengaluru.
              </p>

              <div className="venue-display-card" style={{ marginTop: '24px', background: 'rgba(38, 16, 32, 0.85)', borderColor: 'rgba(255, 200, 140, 0.4)' }}>
                <div className="venue-header-info">
                  <span className="venue-dates-tag" style={{ background: 'rgba(255, 180, 200, 0.15)', color: '#ffe2eb' }}>
                    {BENGALURU_VENUE.tag} · 6:30 PM Onwards
                  </span>
                  <h3 style={{ color: '#fff5ea' }}>{BENGALURU_VENUE.name}</h3>
                  <p style={{ fontSize: '13.5px', color: '#ffb4c6', margin: '2px 0 6px' }}>{BENGALURU_VENUE.subtitle}</p>
                  <p className="venue-address-text" style={{ color: '#e0c8b6' }}>{BENGALURU_VENUE.address}</p>
                </div>

                <div className="map-iframe-wrapper">
                  <iframe
                    title="Bengaluru Reception Venue Map"
                    src={BENGALURU_VENUE.embedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="venue-action-btns">
                  <a
                    className="action-btn btn-primary"
                    href={BENGALURU_VENUE.mapLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <NavigationArrow size={18} weight="bold" />
                    Open in Google Maps
                  </a>
                  <button
                    className="action-btn btn-secondary"
                    style={{ color: '#fff', borderColor: '#ffd89a' }}
                    onClick={() => downloadCalendarICS('reception')}
                  >
                    <CalendarBlank size={18} weight="bold" />
                    Add to Calendar
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* RECEPTION RSVP */}
          <section className="rsvp-section" style={{ background: '#120510' }}>
            <div className="rsvp-box" style={{ background: 'rgba(38, 16, 32, 0.85)', borderColor: 'rgba(255, 200, 140, 0.4)' }}>
              <p className="section-kicker" style={{ textAlign: 'center', color: '#ffb3c6' }}>Warm Welcome</p>
              <h2 style={{ color: '#fff4e8' }}>RSVP For Sangeet &amp; Reception</h2>
              <p className="rsvp-subtitle" style={{ color: '#e5cac0' }}>
                Your gracious presence will complete our joyous celebration!
              </p>

              {rsvpSubmitted ? (
                <div className="rsvp-confirmed-box">
                  <CheckCircle size={42} weight="fill" color="#166534" />
                  <h4>Thank You, {rsvpName || 'Dear Guest'}!</h4>
                  <p style={{ margin: '8px 0', color: '#14532d' }}>
                    Your RSVP has been confirmed. We look forward to seeing you at AKIRA ORCHARDS!
                  </p>
                  <button
                    className="action-btn btn-whatsapp"
                    style={{ margin: '14px auto 0' }}
                    onClick={handleWhatsAppRSVP}
                  >
                    <WhatsappLogo size={18} weight="fill" />
                    Send Confirmation via WhatsApp
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormRSVP} className="rsvp-form">
                  <div className="rsvp-form-group">
                    <label style={{ color: '#ffe4ec' }}>Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Sharma & Family"
                      className="rsvp-input"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                    />
                  </div>

                  <div className="rsvp-form-group">
                    <label style={{ color: '#ffe4ec' }}>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      className="rsvp-input"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                    />
                  </div>

                  <div className="rsvp-form-group">
                    <label style={{ color: '#ffe4ec' }}>Total Number of Guests</label>
                    <select
                      className="rsvp-select"
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5+">5+ Guests</option>
                    </select>
                  </div>

                  <div className="rsvp-form-group">
                    <label style={{ color: '#ffe4ec' }}>Wishes &amp; Congratulations</label>
                    <textarea
                      rows={3}
                      placeholder="Congratulations Lakshmi & Shrinivas! Can't wait to celebrate..."
                      className="rsvp-textarea"
                      value={rsvpMessage}
                      onChange={(e) => setRsvpMessage(e.target.value)}
                    />
                  </div>

                  <div className="rsvp-btns-row">
                    <button type="submit" className="action-btn btn-primary">
                      Confirm Reception RSVP
                    </button>
                    <button
                      type="button"
                      className="action-btn btn-whatsapp"
                      onClick={handleWhatsAppRSVP}
                    >
                      <WhatsappLogo size={18} weight="fill" />
                      RSVP via WhatsApp
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* FOOTER */}
          <footer style={{ background: '#080106' }}>
            <div className="footer-content">
              <Sparkle size={26} weight="fill" color="#ffd89a" />
              <p className="footer-invite-text" style={{ color: '#ffb3c6' }}>With Love &amp; Happiness</p>
              <h2 style={{ color: '#fff5e8' }}>Lakshmi &amp; Shrinivas</h2>
              <span className="footer-date" style={{ color: '#ffdfa8' }}>
                Sunday, 29 November 2026 · Bengaluru
              </span>
            </div>
          </footer>
        </div>
      )}

      {/* ========================================================
          MODALS: DARSHAN BLESSINGS & PHOTO LIGHTBOX
          ======================================================== */}
      {/* Divine Darshan Blessings Modal */}
      <AnimatePresence>
        {showBlessingModal && (
          <div className="blessing-modal-backdrop" onClick={() => setShowBlessingModal(false)}>
            <motion.div
              className="blessing-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
            >
              <FlowerLotus size={42} weight="fill" color="#d4a34b" />
              <h3 style={{ margin: '10px 0 4px', fontFamily: 'Italiana, serif', fontSize: '26px' }}>
                Divine Blessings · ಆಶೀರ್ವಾದ
              </h3>
              <p style={{ fontStyle: 'italic', color: '#c98b27', fontSize: '14px', marginBottom: '14px' }}>
                ॥ ಶಾಂತಾಕಾರಂ ಭುಜಗಶಯನಂ ಪದ್ಮನಾಭಂ ಸುರೇಶಂ ॥
              </p>
              <p style={{ lineHeight: '1.6', fontSize: '14px', color: '#4a250e' }}>
                May Lord Srinivasa and Goddess Mahalakshmi shower eternal grace, boundless joy,
                health, prosperity, and everlasting harmony upon{' '}
                <strong>Lakshmi Gangal</strong> ({PARENTS_INFO.bride.fullText}) and{' '}
                <strong>Shrinivas Sawkar</strong> ({PARENTS_INFO.groom.fullText}) as they unite in holy matrimony.
              </p>
              <button
                className="close-modal-btn"
                onClick={() => setShowBlessingModal(false)}
              >
                Accept Blessings
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Photo Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoModal && (
          <div className="lightbox-backdrop" onClick={() => setSelectedPhotoModal(null)}>
            <motion.div
              className="lightbox-box"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                className="lightbox-close-btn"
                onClick={() => setSelectedPhotoModal(null)}
                title="Close"
              >
                <X size={20} weight="bold" />
              </button>
              <img
                src={selectedPhotoModal.src}
                alt={selectedPhotoModal.title}
                className="lightbox-img"
              />
              <div className="lightbox-info">
                <h3>{selectedPhotoModal.title}</h3>
                <p>{selectedPhotoModal.caption}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
