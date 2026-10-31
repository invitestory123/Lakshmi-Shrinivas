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
  Check,
  Heart,
  WhatsappLogo,
  CheckCircle,
  NavigationArrow,
  Images,
  X,
  Eye
} from '@phosphor-icons/react';
import './styles.css';

// Auspicious Wedding Target Date (Muhurtham)
const WEDDING_TARGET = new Date('2026-11-22T09:30:00+05:30');

// Music Sources (User requested music.mp4 from folder)
const MUSIC_MP4_SRC = '/assets/music.mp4';
const FALLBACK_MUSIC_SRC = '/assets/wedding-music.mp3';

// Sacred Temple Artworks
const ARTWORKS = [
  {
    id: 'srinivasa-lakshmi',
    title: 'Srinivasa & Lakshmi',
    role: 'Recommended for Main Hero',
    badge: 'Primary Hero',
    src: '/assets/divine-couple-srinivasa-lakshmi.jpg',
    description: 'Lord Srinivasa & Goddess Mahalakshmi holding a sacred lotus flower before the golden pillars and divine Thirunamam.'
  },
  {
    id: 'shankha-chakra',
    title: 'Shankha & Chakra Hands',
    role: 'Sacred Vows & Engagement',
    badge: 'Panigrahana',
    src: '/assets/divine-hands-shankha-chakra.jpg',
    description: 'The divine hands adorned with mehndi, fresh jasmine, tulsi, and jewels, holding the holy Sudarshana Chakra and Shankha.'
  },
  {
    id: 'kalyana-homa',
    title: 'Vivaha Kalyana Homa',
    role: 'Ceremony & Agni Rituals',
    badge: 'Wedding Rituals',
    src: '/assets/traditional-kalyana-homa.jpg',
    description: 'Traditional painting of Lord Vishnu and Goddess Jaya Lakshmi around the sacred wedding fire and deepas.'
  }
];

// Couple Photo Gallery
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

// Schedule of Events
const EVENTS = [
  {
    name: 'Haldi & Mehendi',
    date: 'Saturday, 21 November 2026',
    time: '10:30 AM onwards',
    venue: 'Shri Hemaraddi Mallamma Kalyana Mantapa',
    location: 'Bagalkot, Karnataka',
    note: 'Fragrant turmeric blessings, joyful songs, and intricate bridal mehndi designs.',
    icon: '❋',
    tag: 'Pre-Wedding Celebration'
  },
  {
    name: 'Engagement (Nischitartha)',
    date: 'Saturday, 21 November 2026',
    time: '6:00 PM onwards',
    venue: 'Shri Hemaraddi Mallamma Kalyana Mantapa',
    location: 'Bagalkot, Karnataka',
    note: 'The auspicious ring exchange and sacred promises uniting two loving families.',
    icon: '✦',
    tag: 'Sacred Ring Ceremony'
  },
  {
    name: 'Wedding (Kalyana Mahotsavam)',
    date: 'Sunday, 22 November 2026',
    time: '9:30 AM (Muhurtham)',
    venue: 'Shri Hemaraddi Mallamma Kalyana Mantapa',
    location: 'Bagalkot, Karnataka',
    note: 'The eternal union blessed by Lord Venkateshwara and Goddess Lakshmi with Saptapadi and Dhaare.',
    icon: '❧',
    tag: 'Auspicious Muhurtham',
    featured: true
  },
  {
    name: 'Sangeet & Grand Reception',
    date: 'Sunday, 29 November 2026',
    time: '6:30 PM onwards',
    venue: 'AKIRA ORCHARDS (Aadya Farms & Leisure)',
    location: '#73/1, Jarkabande Kaval, Yelahanka Hobli, Via Attur Post, Bengaluru 560 106',
    note: 'An enchanting evening of music, dinner, dancing, and heartfelt celebrations with our loved ones.',
    icon: '✧',
    tag: 'Musical Evening & Feast',
    featured: true
  }
];

// Venues Details
const VENUES = {
  bagalkot: {
    id: 'bagalkot',
    title: 'Wedding & Engagement Venue',
    name: 'Shri Hemaraddi Mallamma Kalyana Mantapa',
    tag: 'Bagalkot Celebrations · 21 & 22 November 2026',
    address: 'Shri Hemaraddi Mallamma Kalyana Mantapa, Bagalkot, Karnataka',
    mapLink: 'https://share.google/GKkAYUOth7WvYTCw9',
    embedUrl: 'https://www.google.com/maps?q=Shri+Hemaraddi+Mallamma+Kalyana+Mantapa,+Bagalkot,+Karnataka&output=embed',
    eventsHeld: 'Haldi, Mehendi, Engagement & Kalyana Mahotsavam'
  },
  bengaluru: {
    id: 'bengaluru',
    title: 'Sangeet & Reception Venue',
    name: 'AKIRA ORCHARDS (Aadya Farms & Leisure)',
    tag: 'Bengaluru Celebrations · 29 November 2026',
    address: '#73/1, Jarkabande Kaval, Yelahanka Hobli, Via Attur Post, Bengaluru 560 106',
    mapLink: 'https://maps.app.goo.gl/i9owwkGY7QZJa6sj7?g_st=iw',
    embedUrl: 'https://www.google.com/maps?q=Akira+Orchards,+Yelahanka,+Ramagondanahalli,+Bengaluru,+Karnataka 560089&output=embed',
    eventsHeld: 'Sangeet Musical Evening & Grand Reception Dinner'
  }
};

// Calendar generator helper
function createCalendarInvite(type: 'wedding' | 'reception' | 'all') {
  let title = '';
  let description = '';
  let location = '';
  let dtStart = '';
  let dtEnd = '';

  if (type === 'wedding') {
    title = 'Lakshmi & Shrinivas — Kalyana Mahotsavam (Wedding)';
    description = 'Wedding ceremony of Lakshmi Gangal and Shrinivas Sawkar at Bagalkot.';
    location = 'Shri Hemaraddi Mallamma Kalyana Mantapa, Bagalkot, Karnataka';
    dtStart = '20261122T040000Z'; // 09:30 AM IST = 04:00 AM UTC
    dtEnd = '20261122T093000Z';
  } else if (type === 'reception') {
    title = 'Lakshmi & Shrinivas — Sangeet & Reception';
    description = 'Sangeet & Reception of Lakshmi Gangal and Shrinivas Sawkar at AKIRA ORCHARDS, Bengaluru.';
    location = 'AKIRA ORCHARDS (Aadya Farms & Leisure), Yelahanka, Bengaluru 560106';
    dtStart = '20261129T130000Z'; // 06:30 PM IST = 01:00 PM UTC
    dtEnd = '20261129T173000Z';
  } else {
    title = 'Lakshmi & Shrinivas — Wedding Celebrations';
    description = 'Wedding Celebrations in Bagalkot (21-22 Nov) and Reception in Bengaluru (29 Nov).';
    location = 'Bagalkot & Bengaluru';
    dtStart = '20261121T050000Z';
    dtEnd = '20261129T173000Z';
  }

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lakshmi & Shrinivas Wedding//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${dtStart}`,
    `DTEnd:${dtEnd}`,
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

// Countdown component
function CountdownTimer() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = Math.max(0, WEDDING_TARGET.getTime() - now);
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

// Scratch to reveal date component
function ScratchCardDate() {
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

    // Ornate gold foil gradient
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#c98b27');
    grad.addColorStop(0.3, '#f9dc98');
    grad.addColorStop(0.6, '#e0a33c');
    grad.addColorStop(1, '#9e6312');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Auspicious motif pattern
    ctx.fillStyle = '#4f2c0f';
    ctx.textAlign = 'center';
    ctx.font = '600 11px Marcellus, serif';
    ctx.fillText('SCRATCH TO REVEAL AUSPICIOUS DATE', rect.width / 2, rect.height / 2 - 12);
    ctx.font = '28px serif';
    ctx.fillText('🪷', rect.width / 2, rect.height / 2 + 24);
  }, []);

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
      <p className="section-kicker">Auspicious Muhurtham</p>
      <h2 className="section-heading">Saved in the Stars</h2>
      <div className="scratch-card-wrapper">
        <div className="scratch-revealed-bg">
          <small>Sunday · Kalyana Muhurtham</small>
          <b>22</b>
          <span>November · 2026</span>
          <em>Bagalkot, Karnataka</em>
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
        {revealed ? 'We eagerly await your presence with blessings ♡' : 'Gently swipe or rub to reveal the wedding date'}
      </p>
    </section>
  );
}

// Falling Lotus Petals Generator
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

// Main App Component
function App() {
  const [hasOpened, setHasOpened] = useState(false);
  const [selectedHeroArt, setSelectedHeroArt] = useState(ARTWORKS[0].id);
  const [activeVenue, setActiveVenue] = useState<'bagalkot' | 'bengaluru'>('bagalkot');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showBlessingModal, setShowBlessingModal] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<typeof GALLERY_PHOTOS[0] | null>(null);

  // Audio Reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parallax Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState('2');
  const [rsvpAttending, setRsvpAttending] = useState('All Celebrations (Bagalkot & Bengaluru)');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  // Active Hero Artwork
  const currentHeroArtwork = ARTWORKS.find((a) => a.id === selectedHeroArt) || ARTWORKS[0];

  // Mouse move tilt effect
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

  // Toggle Music Play / Pause
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isAudioPlaying) {
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      audio.play().then(() => {
        setIsAudioPlaying(true);
      }).catch((err) => {
        console.warn('Audio play failed:', err);
      });
    }
  };

  // Start music upon opening invitation
  const handleOpenInvitation = () => {
    setHasOpened(true);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.85;
      audio.play().then(() => {
        setIsAudioPlaying(true);
      }).catch((err) => {
        console.log('Autoplay deferred until user interaction:', err);
      });
    }
  };

  const triggerDarshanBlessings = () => {
    setShowBlessingModal(true);
  };

  const handleWhatsAppRSVP = () => {
    const guest = rsvpName.trim() || 'Guest';
    const text = encodeURIComponent(
      `*Wedding RSVP for Lakshmi & Shrinivas*\n\n` +
      `Namaste! We are happy to confirm our presence.\n` +
      `• *Guest Name:* ${guest}\n` +
      `• *Phone:* ${rsvpPhone.trim() || 'N/A'}\n` +
      `• *Attending:* ${rsvpAttending}\n` +
      `• *Number of Guests:* ${rsvpGuests}\n` +
      (rsvpMessage.trim() ? `• *Blessings/Wishes:* ${rsvpMessage.trim()}\n` : '') +
      `\nHearty congratulations and warmest wishes to Lakshmi & Shrinivas!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleFormRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    setRsvpSubmitted(true);
  };

  return (
    <main>
      {/* Background Wedding Music Audio Element (Using music.mp4 from workspace) */}
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
        aria-label="Toggle wedding music"
        title={isAudioPlaying ? 'Mute Wedding Music' : 'Play Wedding Music'}
      >
        {isAudioPlaying ? (
          <SpeakerHigh size={18} weight="fill" color="#ffd54f" />
        ) : (
          <SpeakerSlash size={18} weight="bold" color="#e0a33c" />
        )}
        <span>{isAudioPlaying ? 'Wedding Music Playing' : 'Play Music'}</span>
        <div className="audio-waves" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
      </button>

      {/* Welcome Envelope / Card Gate */}
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
              <p className="invite-text">cordially invite you to celebrate our wedding</p>

              <div className="dates-chip">
                <span>21 · 22 · 29 November 2026</span>
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

      {/* HERO SECTION WITH GOD & GODDESS ANIMATION */}
      <section className="hero">
        {/* Background Atmosphere */}
        <div className="hero-backdrop" aria-hidden="true">
          <img
            src={currentHeroArtwork.src}
            alt="Divine temple sanctuary backdrop"
            className="hero-backdrop-img"
          />
          <div className="hero-overlay-scrim" />
        </div>

        {/* Dynamic Divine Aura behind crowns */}
        <div className="divine-aura-glow" aria-hidden="true" />

        {/* Glowing Beam along sacred Thirunamam */}
        <div className="namam-ray" aria-hidden="true" />

        {/* Flickering Temple Deepas */}
        <div className="hanging-deepas" aria-hidden="true">
          <span className="deepa-glow deepa-left-top" />
          <span className="deepa-glow deepa-right-top" />
          <span className="deepa-glow deepa-left-mid" />
          <span className="deepa-glow deepa-right-mid" />
        </div>

        {/* Cascading Lotus Petal Blessings */}
        <PetalShower />

        {/* Top Blessing Shloka & Names */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <p className="divine-shloka">॥ ಶ್ರೀ ಲಕ್ಷ್ಮೀ ವೆಂಕಟೇಶ ಪ್ರಸನ್ನ ॥</p>
          <p className="parents-blessing">With the divine blessings of our families</p>
          <h1 className="hero-names">
            Lakshmi <span className="and">&</span> Shrinivas
          </h1>
          <div className="hero-dates-strip">
            <i />
            <span>21 · 22 · 29 November 2026</span>
            <i />
          </div>
          <div className="hero-locations">Bagalkot & Bengaluru, Karnataka</div>
        </motion.div>

        {/* Main Divine Portrait Frame with Interactive Movement & Shimmer */}
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
              src={currentHeroArtwork.src}
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

            {/* Interactive "Touch for Divine Blessings" Pill */}
            <button
              className="darshan-badge"
              onClick={triggerDarshanBlessings}
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

      {/* PHOTO SELECTOR & ADVICE (Answering: "Which photo will be nice for that?") */}
      <section className="photo-chooser-banner">
        <div className="photo-chooser-title">Divine Artworks & Perspectives</div>
        <p className="photo-chooser-desc">
          You can preview any of the 3 sacred artworks as the Main Hero. Our recommended harmony features{' '}
          <strong>Srinivasa & Lakshmi</strong> for the Hero, <strong>Shankha & Chakra</strong> for the Engagement/Vows, and{' '}
          <strong>Kalyana Homa</strong> for the Ceremony.
        </p>
        <div className="photo-options-grid">
          {ARTWORKS.map((art) => (
            <div
              key={art.id}
              className={`photo-opt-card ${selectedHeroArt === art.id ? 'active' : ''}`}
              onClick={() => setSelectedHeroArt(art.id)}
            >
              <img src={art.src} alt={art.title} />
              <span>{art.title}</span>
              <b>{art.badge}</b>
            </div>
          ))}
        </div>
      </section>

      {/* COUPLE PHOTO GALLERY SECTION (Newly Added With User Photos!) */}
      <section className="gallery-section">
        <div className="gallery-container">
          <p className="section-kicker">Moments of Togetherness</p>
          <h2 className="section-heading">Our Love Story in Frames</h2>
          <p style={{ color: '#6e482b', maxWidth: '580px', margin: '0 auto', fontSize: '15.5px' }}>
            From shared dreams and laughter to the beginning of our forever journey. Click on any picture to view full size.
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

      {/* COUNTDOWN SECTION */}
      <section className="countdown-section">
        <p className="section-kicker">Until we take our sacred vows</p>
        <h2 className="section-heading">Counting Every Auspicious Moment</h2>
        <CountdownTimer />
      </section>

      {/* INTERACTIVE SCRATCH TO REVEAL DATE */}
      <ScratchCardDate />

      {/* STORY & SACRED VOWS (Photo 2: Shankha & Chakra Divine Hands) */}
      <section className="story-section">
        <div className="story-container">
          <FlowerLotus size={32} weight="thin" color="#b83350" />
          <p className="story-script-heading">The Divine Union</p>
          <h2 className="section-heading">Named in Reverence, United in Love</h2>

          <div className="divine-hands-feature">
            <img
              src="/assets/divine-hands-shankha-chakra.jpg"
              alt="Sacred hands holding the holy Shankha and Sudarshana Chakra adorned with mehendi and tulsi"
            />
          </div>

          <p className="story-body-text">
            When two souls are drawn together by divine destiny, every ritual becomes a blessing.
            Carrying the auspicious names of Goddess Mahalakshmi and Lord Srinivasa, our journey begins
            with sacred promises, traditional values, and the cherished love of our families.
          </p>
          <div className="couple-signatures">Lakshmi & Shrinivas</div>
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
              With holy Vedic chants, the fragrance of sandalwood and camphor, and seven sacred steps (Saptapadi),
              Lord Srinivasa and Goddess Lakshmi stand as the eternal guardians of our lifelong union.
            </p>
            <p style={{ marginTop: '14px', fontSize: '13px', color: '#ffd89a', letterSpacing: '0.08em' }}>
              ✦ Dhaare Muhurtham · 22nd November 2026 · Bagalkot ✦
            </p>
          </div>
        </div>
      </section>

      {/* WEDDING FESTIVITIES & EVENTS TIMELINE */}
      <section className="events-section">
        <div style={{ textAlign: 'center' }}>
          <p className="section-kicker">Celebration Schedule</p>
          <h2 className="section-heading">Festivities of Love & Tradition</h2>
          <p style={{ color: '#7b4f2c', maxWidth: '520px', margin: '0 auto' }}>
            Four cherished milestones across Bagalkot and Bengaluru. We look forward to celebrating every moment with you.
          </p>
        </div>

        <div className="events-wrapper">
          {EVENTS.map((event, idx) => (
            <motion.div
              key={event.name}
              className={`event-card ${event.featured ? 'featured-event' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="event-badge-strip">
                <span className="event-badge-num">0{idx + 1}</span>
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
                  <dd>{event.time}</dd>
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

      {/* DUAL VENUE SECTION WITH INTERACTIVE MAPS & CALENDAR */}
      <section className="venue-section">
        <div className="venue-container">
          <p className="section-kicker">Find Your Way</p>
          <h2 className="section-heading">Celebration Venues</h2>
          <p style={{ color: '#634026' }}>
            Explore navigation links and maps for our wedding in Bagalkot and reception in Bengaluru.
          </p>

          <div className="venue-tabs">
            <button
              className={`venue-tab-btn ${activeVenue === 'bagalkot' ? 'active' : ''}`}
              onClick={() => setActiveVenue('bagalkot')}
            >
              <MapPin size={15} weight="fill" style={{ marginRight: '6px' }} />
              1. Bagalkot — Wedding & Engagement
            </button>
            <button
              className={`venue-tab-btn ${activeVenue === 'bengaluru' ? 'active' : ''}`}
              onClick={() => setActiveVenue('bengaluru')}
            >
              <MapPin size={15} weight="fill" style={{ marginRight: '6px' }} />
              2. Bengaluru — Sangeet & Reception
            </button>
          </div>

          {/* Active Venue Details */}
          {activeVenue === 'bagalkot' && (
            <motion.div
              key="bagalkot"
              className="venue-display-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="venue-header-info">
                <span className="venue-dates-tag">{VENUES.bagalkot.tag}</span>
                <h3>{VENUES.bagalkot.name}</h3>
                <p className="venue-address-text">{VENUES.bagalkot.address}</p>
              </div>

              <div className="map-iframe-wrapper">
                <iframe
                  title="Bagalkot Wedding Venue Map"
                  src={VENUES.bagalkot.embedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="venue-action-btns">
                <a
                  className="action-btn btn-primary"
                  href={VENUES.bagalkot.mapLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <NavigationArrow size={18} weight="bold" />
                  Open Wedding Map Link
                </a>
                <button
                  className="action-btn btn-secondary"
                  onClick={() => createCalendarInvite('wedding')}
                >
                  <CalendarBlank size={18} weight="bold" />
                  Add Wedding to Calendar
                </button>
              </div>
            </motion.div>
          )}

          {activeVenue === 'bengaluru' && (
            <motion.div
              key="bengaluru"
              className="venue-display-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="venue-header-info">
                <span className="venue-dates-tag">{VENUES.bengaluru.tag}</span>
                <h3>{VENUES.bengaluru.name}</h3>
                <p className="venue-address-text">{VENUES.bengaluru.address}</p>
              </div>

              <div className="map-iframe-wrapper">
                <iframe
                  title="Bengaluru Reception Venue Map"
                  src={VENUES.bengaluru.embedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="venue-action-btns">
                <a
                  className="action-btn btn-primary"
                  href={VENUES.bengaluru.mapLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <NavigationArrow size={18} weight="bold" />
                  Open Reception Map Link
                </a>
                <button
                  className="action-btn btn-secondary"
                  onClick={() => createCalendarInvite('reception')}
                >
                  <CalendarBlank size={18} weight="bold" />
                  Add Reception to Calendar
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* INTERACTIVE RSVP SECTION FOR GUESTS */}
      <section className="rsvp-section">
        <div className="rsvp-box">
          <p className="section-kicker" style={{ textAlign: 'center' }}>Warmest Welcome</p>
          <h2>RSVP For Our Guests</h2>
          <p className="rsvp-subtitle">
            Your blessings and presence mean the world to us. Please let us know if you can join our celebration!
          </p>

          {rsvpSubmitted ? (
            <div className="rsvp-confirm-alert">
              <CheckCircle size={42} weight="fill" color="#166534" />
              <h4>Thank You, {rsvpName || 'Dear Guest'}!</h4>
              <p style={{ margin: '8px 0', color: '#14532d' }}>
                Your RSVP has been joyfully recorded. We cannot wait to celebrate with you!
              </p>
              <button
                className="action-btn btn-whatsapp"
                style={{ margin: '14px auto 0', width: 'fit-content' }}
                onClick={handleWhatsAppRSVP}
              >
                <WhatsappLogo size={18} weight="fill" />
                Also Send via WhatsApp
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormRSVP}>
              <div className="rsvp-form-group">
                <label>Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh & Family"
                  className="rsvp-input"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                />
              </div>

              <div className="rsvp-form-group">
                <label>WhatsApp / Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="rsvp-input"
                  value={rsvpPhone}
                  onChange={(e) => setRsvpPhone(e.target.value)}
                />
              </div>

              <div className="rsvp-form-group">
                <label>Which Celebrations Will You Attend?</label>
                <select
                  className="rsvp-select"
                  value={rsvpAttending}
                  onChange={(e) => setRsvpAttending(e.target.value)}
                >
                  <option value="All Celebrations (Bagalkot & Bengaluru)">
                    All Celebrations (Bagalkot & Bengaluru)
                  </option>
                  <option value="Engagement & Wedding (Nov 21 - 22 · Bagalkot)">
                    Engagement & Wedding (Nov 21 - 22 · Bagalkot)
                  </option>
                  <option value="Sangeet & Reception (Nov 29 · Bengaluru)">
                    Sangeet & Reception (Nov 29 · Bengaluru)
                  </option>
                </select>
              </div>

              <div className="rsvp-form-group">
                <label>Total Number of Guests</label>
                <select
                  className="rsvp-select"
                  value={rsvpGuests}
                  onChange={(e) => setRsvpGuests(e.target.value)}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5+">5+ Family Members</option>
                </select>
              </div>

              <div className="rsvp-form-group">
                <label>Blessings & Warm Wishes for Lakshmi & Shrinivas</label>
                <textarea
                  rows={3}
                  placeholder="May Lord Venkateshwara and Goddess Mahalakshmi bless you both..."
                  className="rsvp-textarea"
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                />
              </div>

              <div className="rsvp-btns-row">
                <button type="submit" className="action-btn btn-primary">
                  <Check size={18} weight="bold" />
                  Submit RSVP
                </button>
                <button
                  type="button"
                  className="action-btn btn-whatsapp"
                  onClick={handleWhatsAppRSVP}
                >
                  <WhatsappLogo size={18} weight="fill" />
                  RSVP on WhatsApp
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <img
          src="/assets/divine-couple-srinivasa-lakshmi.jpg"
          alt="Divine couple background"
          className="footer-art-backdrop"
        />
        <div className="footer-content">
          <FlowerLotus size={32} weight="thin" color="#f4d58d" />
          <p className="footer-invite-text">With Gratitude & Joy</p>
          <h2>Lakshmi & Shrinivas</h2>
          <span className="footer-date">
            November 2026 · Bagalkot & Bengaluru
          </span>
          <p style={{ marginTop: '16px', fontSize: '12px', color: '#eed6aa', fontStyle: 'italic' }}>
            ॥ ಶ್ರೀ ಲಕ್ಷ್ಮೀ ವೆಂಕಟೇಶ್ವರಾಯ ನಮಃ ॥
          </p>
        </div>
      </footer>

      {/* BLESSINGS POPUP MODAL */}
      <AnimatePresence>
        {showBlessingModal && (
          <motion.div
            className="blessings-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBlessingModal(false)}
          >
            <motion.div
              className="blessings-modal-box"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <FlowerLotus size={40} weight="fill" color="#c98b27" />
              <span className="mantra-kannada" style={{ marginTop: '10px' }}>
                ॥ ಶ್ರೀ ಲಕ್ಷ್ಮೀ ವೆಂಕಟೇಶ್ವರ ಪ್ರಸನ್ನ ॥
              </span>
              <h3>Divine Ashirvada</h3>
              <p>
                May Lord Srinivasa and Goddess Mahalakshmi shower eternal grace, boundless joy,
                health, prosperity, and everlasting harmony upon <strong>Lakshmi Gangal</strong> and{' '}
                <strong>Shrinivas Sawkar</strong> as they unite in holy matrimony.
              </p>
              <button
                className="close-modal-btn"
                onClick={() => setShowBlessingModal(false)}
              >
                Accept Blessings · ಧನ್ಯವಾದಗಳು
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPhotoModal && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhotoModal(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="lightbox-close-btn"
                onClick={() => setSelectedPhotoModal(null)}
                aria-label="Close photo"
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
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
