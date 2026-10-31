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
  X
} from '@phosphor-icons/react';
import './styles.css';

// Target Date: Sangeet & Reception on 29 November 2026, 6:30 PM
const RECEPTION_TARGET_DATE = new Date('2026-11-29T18:30:00+05:30');

// Music Sources (Using music.mp4 from folder)
const MUSIC_MP4_SRC = '/assets/music.mp4';
const FALLBACK_MUSIC_SRC = '/assets/wedding-music.mp3';

// Main God & Goddess Photo
const PRIMARY_DIVINE_HERO = '/assets/divine-couple-srinivasa-lakshmi.jpg';

// Venue Information
const RECEPTION_VENUE = {
  name: 'AKIRA ORCHARDS',
  subtitle: '(Aadya Farms & Leisure)',
  address: '#73/1, Jarkabande Kaval, Yelahanka Hobli, Via Attur Post, Bengaluru 560 106',
  date: 'Sunday, 29 November 2026',
  time: '6:30 PM Onwards',
  mapLink: 'https://maps.app.goo.gl/i9owwkGY7QZJa6sj7?g_st=iw',
  embedUrl: 'https://www.google.com/maps?q=Akira+Orchards,+Yelahanka,+Ramagondanahalli,+Bengaluru,+Karnataka+560089&output=embed'
};

// Joyful Couple Photos for Gallery & Spotlight
const GALLERY_PHOTOS = [
  {
    id: 'red-glamour',
    title: 'A Royal Celebration',
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

// Evening Festivities Timeline
const RECEPTION_SCHEDULE = [
  {
    number: '01',
    name: 'Sangeet & Melodies',
    time: '6:30 PM Onwards',
    note: 'An enchanting musical beginning with lively rhythms, dance, and joyous celebrations.',
    icon: '♫'
  },
  {
    number: '02',
    name: 'Reception & Felicitations',
    time: '7:30 PM Onwards',
    note: 'Warm welcomes, celebratory toasts, photography, and blessings with our beloved guests.',
    icon: '✧'
  },
  {
    number: '03',
    name: 'Grand Celebration Dinner',
    time: '8:00 PM Onwards',
    note: 'A lavish gourmet culinary banquet served amidst an open-air starry garden.',
    icon: '❋'
  }
];

// Add to Calendar helper
function addReceptionToCalendar() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lakshmi & Shrinivas Reception//EN',
    'BEGIN:VEVENT',
    'SUMMARY:Lakshmi & Shrinivas — Sangeet & Reception',
    'DESCRIPTION:Sangeet & Reception of Lakshmi Gangal and Shrinivas Sawkar at AKIRA ORCHARDS, Bengaluru.',
    'LOCATION:AKIRA ORCHARDS (Aadya Farms & Leisure), Yelahanka, Bengaluru 560106',
    'DTSTART:20261129T130000Z', // 06:30 PM IST = 01:00 PM UTC
    'DTEND:20261129T180000Z',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lakshmi-shrinivas-reception.ics';
  a.click();
  URL.revokeObjectURL(url);
}

// Countdown timer
function CountdownTimer() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = Math.max(0, RECEPTION_TARGET_DATE.getTime() - now);
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
    ctx.fillText('SCRATCH TO REVEAL RECEPTION DATE', rect.width / 2, rect.height / 2 - 12);
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
      <p className="section-kicker">Sangeet & Reception</p>
      <h2 className="section-heading">Save Our Celebration Date</h2>
      <div className="scratch-card-wrapper">
        <div className="scratch-revealed-bg">
          <small>Sunday · Sangeet & Reception</small>
          <b>29</b>
          <span>November · 2026</span>
          <em>AKIRA ORCHARDS · Bengaluru</em>
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
        {revealed ? 'We eagerly await your joyful presence ♡' : 'Gently swipe or rub to reveal the reception date'}
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
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

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
      `*Sangeet & Reception RSVP for Lakshmi & Shrinivas*\n\n` +
      `Namaste! We are happy to confirm our presence for the Sangeet & Reception on 29th November 2026.\n` +
      `• *Guest Name:* ${guest}\n` +
      `• *Phone:* ${rsvpPhone.trim() || 'N/A'}\n` +
      `• *Number of Guests:* ${rsvpGuests}\n` +
      (rsvpMessage.trim() ? `• *Wishes/Blessings:* ${rsvpMessage.trim()}\n` : '') +
      `\nLooking forward to celebrating with Lakshmi & Shrinivas!`
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
      {/* Background Wedding Music Audio Element (Using music.mp4 from folder) */}
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
              <p className="invite-text">cordially invite you to celebrate our</p>
              <h2 style={{ fontFamily: 'Italiana, serif', fontSize: '26px', color: '#b83350', margin: '4px 0 14px' }}>
                Sangeet & Reception
              </h2>

              <div className="dates-chip">
                <span>Sunday · 29 November 2026 · Bengaluru</span>
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

      {/* HERO SECTION WITH GOD & GODDESS PHOTO & MOVEMENT ANIMATION */}
      <section className="hero">
        {/* Background Atmosphere */}
        <div className="hero-backdrop" aria-hidden="true">
          <img
            src={PRIMARY_DIVINE_HERO}
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
            <span>Sangeet & Reception · 29 November 2026</span>
            <i />
          </div>
          <div className="hero-locations">Bengaluru, Karnataka</div>
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
          <span>Explore Sangeet & Reception</span>
          <ArrowDown size={15} weight="bold" />
        </div>
      </section>

      {/* FULL-PAGE SANGEET & RECEPTION SHOWCASE (100% Highlighted) */}
      <section className="reception-fullpage-showcase" id="reception-showcase">
        <div className="reception-glow-bg" />
        <div className="reception-sparkle-stars" />

        <div className="reception-content-wrapper">
          <span className="reception-top-pill">
            <Sparkle size={14} weight="fill" />
            Celebration Evening · Bengaluru
          </span>

          {/* Joyful Couple Photo Spotlight */}
          <div className="reception-photo-hero">
            <div className="reception-photo-inner">
              <img
                src="/assets/gallery/gallery-1-red-glamour.jpg"
                alt="Lakshmi and Shrinivas in elegant evening attire"
              />
            </div>
          </div>

          <h2 className="reception-title">Sangeet & Reception</h2>
          <p className="reception-subtitle">
            An enchanting evening of music, joyful dance & celebratory feast
          </p>

          {/* Event Time & Venue Box */}
          <div className="reception-details-box">
            <div className="reception-date-row">
              <i />
              <span>Sunday · 29 November 2026</span>
              <i />
            </div>
            <span className="reception-time-badge">6:30 PM Onwards</span>

            <h3 className="reception-venue-title">{RECEPTION_VENUE.name}</h3>
            <p className="reception-venue-sub">{RECEPTION_VENUE.subtitle}</p>
            <p className="reception-address">{RECEPTION_VENUE.address}</p>
          </div>

          {/* Dedicated Action Buttons */}
          <div className="reception-actions">
            <a
              className="action-btn btn-primary"
              href={RECEPTION_VENUE.mapLink}
              target="_blank"
              rel="noreferrer"
            >
              <NavigationArrow size={18} weight="bold" />
              Open Reception Map Link
            </a>
            <button
              className="action-btn btn-secondary"
              style={{ color: '#fff4d9', borderColor: '#ffd89a' }}
              onClick={addReceptionToCalendar}
            >
              <CalendarBlank size={18} weight="bold" />
              Add to Calendar
            </button>
          </div>
        </div>
      </section>

      {/* COUNTDOWN SECTION (Targeted to 29th November Sangeet & Reception) */}
      <section className="countdown-section">
        <p className="section-kicker">Until the Sangeet & Reception</p>
        <h2 className="section-heading">Countdown to 29th November</h2>
        <CountdownTimer />
      </section>

      {/* INTERACTIVE SCRATCH TO REVEAL DATE (Sunday 29 November 2026) */}
      <ScratchCardDate />

      {/* COUPLE PHOTO GALLERY SECTION */}
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

      {/* EVENING PROGRAM & SCHEDULE */}
      <section className="events-section">
        <div style={{ textAlign: 'center' }}>
          <p className="section-kicker">Evening Festivities</p>
          <h2 className="section-heading">Celebration Program</h2>
          <p style={{ color: '#7b4f2c', maxWidth: '520px', margin: '0 auto' }}>
            An evening crafted with melodies, congratulations, and delightful dining.
          </p>
        </div>

        <div className="events-wrapper">
          {RECEPTION_SCHEDULE.map((item, idx) => (
            <motion.div
              key={item.name}
              className={`event-card ${idx === 0 ? 'featured-event' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="event-badge-strip">
                <span className="event-badge-num">{item.number}</span>
                <span className="event-badge-tag">{item.time}</span>
              </div>
              <h3>
                {item.icon} {item.name}
              </h3>
              <p className="event-note">{item.note}</p>

              <dl className="event-meta-grid">
                <div className="meta-item">
                  <dt>Date</dt>
                  <dd>Sunday, 29 November 2026</dd>
                </div>
                <div className="meta-item">
                  <dt>Timing</dt>
                  <dd>{item.time}</dd>
                </div>
                <div className="meta-item">
                  <dt>Venue</dt>
                  <dd>{RECEPTION_VENUE.name}, Bengaluru</dd>
                </div>
              </dl>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VENUE SECTION WITH GOOGLE MAPS */}
      <section className="venue-section">
        <div className="venue-container">
          <p className="section-kicker">Find Your Way</p>
          <h2 className="section-heading">Reception Venue</h2>
          <p style={{ color: '#634026' }}>
            Explore navigation links and maps to join us at AKIRA ORCHARDS, Bengaluru.
          </p>

          <div className="venue-display-card" style={{ marginTop: '24px' }}>
            <div className="venue-header-info">
              <span className="venue-dates-tag">Sunday · 29 November 2026 · 6:30 PM Onwards</span>
              <h3>{RECEPTION_VENUE.name}</h3>
              <p style={{ fontSize: '13px', color: '#b97816', margin: '2px 0 6px' }}>{RECEPTION_VENUE.subtitle}</p>
              <p className="venue-address-text">{RECEPTION_VENUE.address}</p>
            </div>

            <div className="map-iframe-wrapper">
              <iframe
                title="Bengaluru Reception Venue Map"
                src={RECEPTION_VENUE.embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="venue-action-btns">
              <a
                className="action-btn btn-primary"
                href={RECEPTION_VENUE.mapLink}
                target="_blank"
                rel="noreferrer"
              >
                <NavigationArrow size={18} weight="bold" />
                Open in Google Maps
              </a>
              <button
                className="action-btn btn-secondary"
                onClick={addReceptionToCalendar}
              >
                <CalendarBlank size={18} weight="bold" />
                Add to Calendar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE RSVP SECTION FOR RECEPTION */}
      <section className="rsvp-section">
        <div className="rsvp-box">
          <p className="section-kicker" style={{ textAlign: 'center' }}>Warmest Welcome</p>
          <h2>RSVP For Sangeet & Reception</h2>
          <p className="rsvp-subtitle">
            Your presence will make our evening truly unforgettable. Please let us know if you can join us on Sunday, 29th November!
          </p>

          {rsvpSubmitted ? (
            <div className="rsvp-confirm-alert">
              <CheckCircle size={42} weight="fill" color="#166534" />
              <h4>Thank You, {rsvpName || 'Dear Guest'}!</h4>
              <p style={{ margin: '8px 0', color: '#14532d' }}>
                Your RSVP has been joyfully recorded. We look forward to celebrating with you at AKIRA ORCHARDS!
              </p>
              <button
                className="action-btn btn-whatsapp"
                style={{ margin: '14px auto 0', width: 'fit-content' }}
                onClick={handleWhatsAppRSVP}
              >
                <WhatsappLogo size={18} weight="fill" />
                Send Confirmation on WhatsApp
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
                <label>Total Number of Guests Attending</label>
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
                  placeholder="Congratulations Lakshmi & Shrinivas! Can't wait to celebrate..."
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
          src={PRIMARY_DIVINE_HERO}
          alt="Divine couple background"
          className="footer-art-backdrop"
        />
        <div className="footer-content">
          <FlowerLotus size={32} weight="thin" color="#f4d58d" />
          <p className="footer-invite-text">With Gratitude & Joy</p>
          <h2>Lakshmi & Shrinivas</h2>
          <span className="footer-date">
            Sangeet & Reception · 29 November 2026 · Bengaluru
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
                <strong>Shrinivas Sawkar</strong>.
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
