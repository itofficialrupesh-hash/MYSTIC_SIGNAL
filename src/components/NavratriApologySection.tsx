import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  ZoomIn,
  Upload,
  RotateCcw,
  Info,
  Flower2,
  Flame,
  ChevronDown,
  Check,
  Image as ImageIcon,
  Video,
} from 'lucide-react';
import {
  DEFAULT_NAVRATRI_PHOTOS,
  NAVRATRI_WISHES,
  CUSTOM_DEVOTIONAL_AUDIO_URL,
  DEFAULT_NAVRATRI_BG_VIDEO_URL,
  NavratriPhotoItem,
} from '../data/navratriConfig';

interface NavratriApologySectionProps {
  onClose?: () => void;
  onTriggerConfetti?: () => void;
  isModal?: boolean;
}

const STORAGE_KEY_PHOTOS = 'navratri_vanshika_photos_v1';
const STORAGE_KEY_BG_VIDEO = 'navratri_bg_video_url_v1';

// Decorative SVG Lotus Motif
function LotusMotif({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Left & Right Petals */}
      <path
        d="M60 68C36 68 14 54 8 36C24 36 42 46 60 68Z"
        fill="url(#lotusGradOuter)"
        stroke="#F59E0B"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />
      <path
        d="M60 68C84 68 106 54 112 36C96 36 78 46 60 68Z"
        fill="url(#lotusGradOuter)"
        stroke="#F59E0B"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />
      {/* Mid Left & Right Petals */}
      <path
        d="M60 68C40 60 24 38 24 18C42 24 54 42 60 68Z"
        fill="url(#lotusGradMid)"
        stroke="#FBBF24"
        strokeWidth="1.3"
        strokeOpacity="0.8"
      />
      <path
        d="M60 68C80 60 96 38 96 18C78 24 66 42 60 68Z"
        fill="url(#lotusGradMid)"
        stroke="#FBBF24"
        strokeWidth="1.3"
        strokeOpacity="0.8"
      />
      {/* Center Main Petal */}
      <path
        d="M60 70C45 52 44 26 60 6C76 26 75 52 60 70Z"
        fill="url(#lotusGradCenter)"
        stroke="#FDE68A"
        strokeWidth="1.5"
      />
      {/* Base Golden Arc */}
      <path
        d="M36 70C48 75 72 75 84 70"
        stroke="#FBBF24"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="lotusGradOuter" x1="60" y1="36" x2="60" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB7185" stopOpacity="0.65" />
          <stop offset="1" stopColor="#881337" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="lotusGradMid" x1="60" y1="18" x2="60" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F43F5E" stopOpacity="0.85" />
          <stop offset="1" stopColor="#9F1239" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="lotusGradCenter" x1="60" y1="6" x2="60" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.5" stopColor="#FB7185" />
          <stop offset="1" stopColor="#BE123C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Glowing Festive Diya Component
function GlowingDiya({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dimensions =
    size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${dimensions}`} aria-hidden="true">
      {/* Warm Halo Glow */}
      <div className="absolute -top-2 w-6 h-6 rounded-full bg-amber-400/40 blur-md navratri-flame-flicker" />
      <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_4px_12px_rgba(251,191,36,0.45)]">
        {/* Flame */}
        <path
          d="M32 8C32 8 23 20 23 27C23 32 27 36 32 36C37 36 41 32 41 27C41 20 32 8 32 8Z"
          fill="url(#diyaFlame)"
          className="navratri-flame-svg"
        />
        <path
          d="M32 16C32 16 27 23 27 27.5C27 30.5 29.2 33 32 33C34.8 33 37 30.5 37 27.5C37 23 32 16 32 16Z"
          fill="#FEF08A"
        />
        {/* Diya Clay Bowl */}
        <path
          d="M10 36C10 49 20 56 32 56C44 56 54 49 54 36H10Z"
          fill="url(#diyaBowl)"
          stroke="#F59E0B"
          strokeWidth="1.5"
        />
        {/* Decorative Gold Trim */}
        <path
          d="M12 39C24 43 40 43 52 39"
          stroke="#FDE68A"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <defs>
          <linearGradient id="diyaFlame" x1="32" y1="8" x2="32" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF08A" />
            <stop offset="0.55" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="diyaBowl" x1="32" y1="36" x2="32" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B45309" />
            <stop offset="0.5" stopColor="#78350F" />
            <stop offset="1" stopColor="#451A03" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function NavratriApologySection({
  onClose,
  onTriggerConfetti,
  isModal = false,
}: NavratriApologySectionProps) {
  // Opening Intro State
  const [introStep, setIntroStep] = useState<number>(0);
  const [isHeartOpened, setIsHeartOpened] = useState<boolean>(false);

  // Gallery State
  const [photos, setPhotos] = useState<NavratriPhotoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PHOTOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_NAVRATRI_PHOTOS;
  });
  const [lightboxPhoto, setLightboxPhoto] = useState<NavratriPhotoItem | null>(null);
  const [showPhotoGuide, setShowPhotoGuide] = useState<boolean>(false);
  const [replacingPhotoId, setReplacingPhotoId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Interactive Apology Request State
  const [apologyAcknowledged, setApologyAcknowledged] = useState<boolean>(false);
  const [burstPetals, setBurstPetals] = useState<
    { id: number; left: number; emoji: string; delay: number; duration: number }[]
  >([]);

  // Devotional Instrumental Music State (Strictly opt-in, no autoplay with sound)
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [showMusicInfo, setShowMusicInfo] = useState<boolean>(false);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const chimeIntervalRef = useRef<number | null>(null);

  // Background Video State for section#navratri-apology-sanctuary
  const [bgVideoUrl, setBgVideoUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BG_VIDEO);
      if (saved !== null) return saved;
    } catch (e) {}
    return DEFAULT_NAVRATRI_BG_VIDEO_URL;
  });
  const [videoOverlayOpacity, setVideoOverlayOpacity] = useState<number>(0.55);
  const [showVideoPanel, setShowVideoPanel] = useState<boolean>(false);
  const [customVideoInput, setCustomVideoInput] = useState<string>('');
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

  // Content scroll target ref
  const mainContentRef = useRef<HTMLDivElement | null>(null);

  // Step-by-step opening animation timing
  useEffect(() => {
    const t1 = window.setTimeout(() => setIntroStep(1), 250);
    const t2 = window.setTimeout(() => setIntroStep(2), 1300);
    const t3 = window.setTimeout(() => setIntroStep(3), 2400);
    const t4 = window.setTimeout(() => setIntroStep(4), 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Cleanup Web Audio / HTML5 Audio on unmount
  useEffect(() => {
    return () => {
      stopDevotionalMusic();
    };
  }, []);

  // Gentle Web Audio API Devotional Instrumental Generator (Raag Yaman / Peaceful Tanpura & Bansuri Chimes)
  const startSynthesizedDevotionalMusic = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Play a serene pentatonic/devotional note sequence (Sa, Ga, Pa, Dha, Ni, Sa)
      // Frequencies in Hz tuned around C4/G4 peaceful drone
      const scaleFreqs = [261.63, 329.63, 392.0, 440.0, 493.88, 523.25, 392.0, 329.63];
      let noteIdx = 0;

      const playGentleNote = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        const now = audioCtxRef.current.currentTime;

        // Melodic bell/flute tone
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        const freq = scaleFreqs[noteIdx % scaleFreqs.length];
        noteIdx++;

        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 2.8);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start(now);
        osc.stop(now + 2.9);

        // Soft harmonic fifth tanpura drone every 2 notes
        if (noteIdx % 2 === 1) {
          const droneOsc = audioCtxRef.current.createOscillator();
          const droneGain = audioCtxRef.current.createGain();
          droneOsc.type = 'triangle';
          droneOsc.frequency.setValueAtTime(196.0, now); // G3 warm base
          droneGain.gain.setValueAtTime(0.001, now);
          droneGain.gain.linearRampToValueAtTime(0.02, now + 0.8);
          droneGain.gain.exponentialRampToValueAtTime(0.0005, now + 4.5);

          droneOsc.connect(droneGain);
          droneGain.connect(audioCtxRef.current.destination);
          droneOsc.start(now);
          droneOsc.stop(now + 4.6);
        }
      };

      playGentleNote();
      chimeIntervalRef.current = window.setInterval(playGentleNote, 2400);
    } catch (e) {
      console.warn('Could not start devotional synthesizer:', e);
    }
  };

  const stopDevotionalMusic = () => {
    if (chimeIntervalRef.current) {
      clearInterval(chimeIntervalRef.current);
      chimeIntervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      try {
        audioCtxRef.current.suspend();
      } catch (e) {}
    }
    if (audioElRef.current) {
      audioElRef.current.pause();
    }
    setIsPlayingMusic(false);
  };

  const toggleDevotionalMusic = () => {
    if (isPlayingMusic) {
      stopDevotionalMusic();
    } else {
      if (CUSTOM_DEVOTIONAL_AUDIO_URL) {
        if (!audioElRef.current) {
          audioElRef.current = new Audio(CUSTOM_DEVOTIONAL_AUDIO_URL);
          audioElRef.current.loop = true;
          audioElRef.current.volume = 0.5;
        }
        audioElRef.current
          .play()
          .then(() => setIsPlayingMusic(true))
          .catch(() => {
            startSynthesizedDevotionalMusic();
            setIsPlayingMusic(true);
          });
      } else {
        startSynthesizedDevotionalMusic();
        setIsPlayingMusic(true);
      }
    }
  };

  const handleOpenMyHeart = () => {
    setIsHeartOpened(true);
    if (onTriggerConfetti) onTriggerConfetti();
    setTimeout(() => {
      mainContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 180);
  };

  // Handle Photo Upload / Replacement (Preserving original aspect ratio & faces)
  const triggerPhotoUpload = (photoId: string) => {
    setReplacingPhotoId(photoId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingPhotoId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const updated = photos.map((item) =>
        item.id === replacingPhotoId
          ? {
              ...item,
              imageUrl: dataUrl,
              isPlaceholder: false,
            }
          : item
      );
      setPhotos(updated);
      try {
        localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(updated));
      } catch (err) {
        console.warn('Local storage quota exceeded for custom photo, keeping in session.', err);
      }
      setReplacingPhotoId(null);
      if (onTriggerConfetti) onTriggerConfetti();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddNewPhotoSlot = () => {
    const newId = `vanshika-custom-${Date.now()}`;
    const newSlot: NavratriPhotoItem = {
      id: newId,
      title: 'Meri Devi Ji ❤️',
      caption: 'A cherished memory dedicated to Vanshika Ji.',
      blessing: 'Maa Durga aap par hamesha apni kripa banaye rakhein. 🌺',
      imageUrl: '',
      isPlaceholder: true,
    };
    const updated = [...photos, newSlot];
    setPhotos(updated);
    triggerPhotoUpload(newId);
  };

  const handleResetGallery = () => {
    setPhotos(DEFAULT_NAVRATRI_PHOTOS);
    try {
      localStorage.removeItem(STORAGE_KEY_PHOTOS);
    } catch (e) {}
  };

  // Handle Background Video Upload / URL Replacement
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setBgVideoUrl(objectUrl);
    if (file.size <= 3.5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        if (res) {
          try {
            localStorage.setItem(STORAGE_KEY_BG_VIDEO, res);
          } catch (err) {}
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleApplyVideoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customVideoInput.trim();
    if (!trimmed) return;
    setBgVideoUrl(trimmed);
    try {
      localStorage.setItem(STORAGE_KEY_BG_VIDEO, trimmed);
    } catch (err) {}
    setCustomVideoInput('');
  };

  const handleResetBgVideo = () => {
    setBgVideoUrl(DEFAULT_NAVRATRI_BG_VIDEO_URL);
    try {
      localStorage.removeItem(STORAGE_KEY_BG_VIDEO);
    } catch (err) {}
  };

  // Handle Interactive Apology Request Click
  const handleApologyMomentClick = () => {
    setApologyAcknowledged(true);
    if (onTriggerConfetti) onTriggerConfetti();

    const symbols = ['🌷', '🌸', '❤️', '🌺', '✨', '🫶🏻', '🪔'];
    const generated = Array.from({ length: 24 }).map((_, idx) => ({
      id: Date.now() + idx,
      left: Math.random() * 88 + 6,
      emoji: symbols[idx % symbols.length],
      delay: Math.random() * 0.6,
      duration: 2.6 + Math.random() * 1.4,
    }));
    setBurstPetals(generated);

    setTimeout(() => {
      setBurstPetals([]);
    }, 4500);
  };

  return (
    <section
      id="navratri-apology-sanctuary"
      aria-label="Happy Navratri and Heartfelt Apology for Vanshika Ji"
      className={`relative w-full overflow-hidden text-amber-50 select-none bg-[#1c040b] ${
        isModal
          ? 'min-h-screen py-8 px-4 md:px-8'
          : 'rounded-[36px] border border-amber-400/30 shadow-[0_20px_60px_rgba(136,19,55,0.45)] my-6 py-10 px-4 sm:px-8'
      }`}
    >
      {/* ─── FULL-BLEED BACKGROUND VIDEO LAYER FOR section#navratri-apology-sanctuary ─── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {bgVideoUrl && (
          <video
            key={bgVideoUrl}
            src={bgVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center scale-[1.02] transition-opacity duration-700"
          />
        )}
        {/* Warm Festive Maroon & Golden Tint Overlay so text & cards stay readable */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(92, 10, 27, 0.72) 0%, rgba(58, 6, 18, 0.85) 50%, rgba(28, 4, 11, 0.94) 100%)',
            opacity: videoOverlayOpacity,
          }}
        />
      </div>

      {/* Hidden File Input for Background Video Upload */}
      <input
        ref={videoFileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/*"
        onChange={handleVideoFileChange}
        className="hidden"
        aria-label="Upload background video for Navratri sanctuary"
      />
      {/* Scoped Festive Styles & Reduced-Motion Support */}
      <style>{`
        @keyframes navratriPetalDrift {
          0% {
            transform: translateY(-10%) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.7;
          }
          85% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(110vh) translateX(28px) rotate(320deg);
            opacity: 0;
          }
        }
        @keyframes navratriFlameFlicker {
          0%, 100% { transform: scale(1) rotate(-1deg); opacity: 0.9; }
          50% { transform: scale(1.08, 1.12) rotate(1deg); opacity: 1; }
        }
        @keyframes navratriRisePetal {
          0% {
            transform: translateY(20px) scale(0.6);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-220px) scale(1.15) rotate(25deg);
            opacity: 0;
          }
        }
        .navratri-flame-svg {
          transform-origin: 32px 34px;
          animation: navratriFlameFlicker 2.2s ease-in-out infinite;
        }
        .navratri-flame-flicker {
          animation: navratriFlameFlicker 2.2s ease-in-out infinite;
        }
        .navratri-floating-petal {
          animation: navratriPetalDrift var(--petal-dur, 14s) linear infinite;
          animation-delay: var(--petal-delay, 0s);
        }
        .navratri-burst-petal {
          animation: navratriRisePetal var(--burst-dur, 3s) cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--burst-delay, 0s);
        }
        @media (prefers-reduced-motion: reduce) {
          .navratri-flame-svg,
          .navratri-flame-flicker,
          .navratri-floating-petal,
          .navratri-burst-petal {
            animation: none !important;
          }
        }
      `}</style>

      {/* Hidden File Input for Easy Photo Replacement */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload photo of Vanshika Ji"
      />

      {/* Ambient Festive Golden & Maroon Lighting Glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-amber-500/15 rounded-full blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 left-10 w-72 h-72 bg-rose-500/10 rounded-full blur-[110px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-80 h-80 bg-amber-400/10 rounded-full blur-[120px]" />

      {/* Subtle Floating Flower Petals & Golden Sparkles (Gentle, Non-Distracting) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
        {[
          { left: '7%', delay: '0s', dur: '15s', item: '🌸' },
          { left: '19%', delay: '3s', dur: '18s', item: '✨' },
          { left: '34%', delay: '1.5s', dur: '16s', item: '🌺' },
          { left: '52%', delay: '4s', dur: '19s', item: '✨' },
          { left: '68%', delay: '2s', dur: '15s', item: '🌷' },
          { left: '83%', delay: '5s', dur: '17s', item: '🌸' },
          { left: '92%', delay: '0.8s', dur: '16s', item: '✨' },
        ].map((p, idx) => (
          <span
            key={idx}
            className="navratri-floating-petal absolute -top-8 text-base opacity-40"
            style={
              {
                left: p.left,
                '--petal-delay': p.delay,
                '--petal-dur': p.dur,
              } as React.CSSProperties
            }
          >
            {p.item}
          </span>
        ))}
      </div>

      {/* Top Navigation & Optional Devotional Music Bar */}
      <div className="relative z-20 max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-amber-300/20">
        <div className="flex items-center gap-2.5">
          <GlowingDiya size="sm" />
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-300 font-bold block">
              Shardiya & Chaitra Navratri Special
            </span>
            <p className="text-xs text-rose-200/90 font-serif italic">
              Dedicated to Meri Devi Ji (Vanshika Ji) ❤️
            </p>
          </div>
        </div>

        {/* Music Controls & Optional Close Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleDevotionalMusic}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              isPlayingMusic
                ? 'bg-amber-400 text-[#2d050e] border-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                : 'bg-[#2c0610]/90 hover:bg-[#3f0918] text-amber-200 border-amber-400/40'
            }`}
            title={
              isPlayingMusic
                ? 'Mute Soft Devotional Instrumental'
                : 'Play Soft Devotional Instrumental (No Autoplay)'
            }
          >
            {isPlayingMusic ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{isPlayingMusic ? 'Devotional Music: Playing' : 'Play Soft Sitar & Chimes 🎶'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowVideoPanel((prev) => !prev)}
            className={`px-3 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              showVideoPanel
                ? 'bg-amber-400 text-[#2d050e] border-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.45)]'
                : 'bg-[#2c0610]/85 hover:bg-[#3f0918] text-amber-200 border-amber-400/40'
            }`}
            title="Upload or change background video"
          >
            <Video size={14} />
            <span>BG Video</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMusicInfo((prev) => !prev)}
            className="p-2 rounded-full bg-[#2c0610]/80 hover:bg-[#3f0918] text-amber-300/80 hover:text-amber-200 border border-amber-400/30 cursor-pointer transition-colors"
            title="How to customize devotional audio file"
            aria-label="Audio customization info"
          >
            <Info size={14} />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={() => {
                stopDevotionalMusic();
                onClose();
              }}
              className="px-3.5 py-2 rounded-full bg-rose-950/90 hover:bg-rose-900 text-amber-100 border border-amber-400/30 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <X size={14} />
              <span>Back</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Background Video Customizer Panel */}
      {showVideoPanel && (
        <div className="relative z-20 max-w-5xl mx-auto mt-3 p-4 sm:p-5 rounded-2xl bg-[#26040d]/95 border border-amber-400/40 text-xs text-amber-100 space-y-3.5 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Video size={15} className="text-amber-300" />
              <span className="font-bold text-amber-300 text-sm">
                Custom Background Video Settings
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowVideoPanel(false)}
              className="text-amber-300 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => videoFileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#26040c] font-bold flex items-center gap-1.5 cursor-pointer hover:brightness-110 transition-all shadow-md"
            >
              <Upload size={13} />
              <span>Upload Video File (MP4 / WebM)</span>
            </button>

            <button
              type="button"
              onClick={handleResetBgVideo}
              className="px-3 py-2 rounded-xl bg-rose-950/90 hover:bg-rose-900 text-amber-200 border border-amber-400/30 font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <RotateCcw size={13} />
              <span>Reset Default Video</span>
            </button>

            <div className="flex items-center gap-2 ml-auto bg-black/35 px-3 py-1.5 rounded-xl border border-amber-400/20">
              <span className="text-amber-200/90 font-medium">Video Visibility:</span>
              <input
                type="range"
                min={0.15}
                max={0.9}
                step={0.05}
                value={1 - videoOverlayOpacity}
                onChange={(e) => setVideoOverlayOpacity(1 - parseFloat(e.target.value))}
                className="accent-amber-400 cursor-pointer w-24"
              />
            </div>
          </div>

          <form onSubmit={handleApplyVideoUrl} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customVideoInput}
              onChange={(e) => setCustomVideoInput(e.target.value)}
              placeholder="Or paste direct video URL or local path (e.g. /navratri-bg.mp4)..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-black/50 border border-amber-400/30 text-amber-100 placeholder:text-amber-200/40 focus:outline-none focus:border-amber-300 select-text"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 font-bold cursor-pointer transition-all shrink-0"
            >
              Apply Video URL
            </button>
          </form>

          <p className="text-[11px] text-amber-200/75 leading-relaxed">
            💡 You can also permanently set your video file path inside{' '}
            <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">
              src/data/navratriConfig.ts
            </code>{' '}
            via <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">DEFAULT_NAVRATRI_BG_VIDEO_URL</code>.
          </p>
        </div>
      )}

      {/* Collapsible Audio Help Notice */}
      {showMusicInfo && (
        <div className="relative z-20 max-w-5xl mx-auto mt-3 p-4 rounded-2xl bg-[#26040d]/95 border border-amber-400/30 text-xs text-amber-100/90 flex items-start justify-between gap-4 animate-fade-in">
          <div className="space-y-1 leading-relaxed">
            <p className="font-bold text-amber-300">
              🎵 Devotional Instrumental Music Configuration:
            </p>
            <p className="text-amber-100/80">
              Right now, clicking the music button plays a gentle, built-in peaceful devotional melody (Raag Yaman chimes & tanpura drone) that never autoplays with sound. To use your own licensed MP3 track, place the file in <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">public/navratri-music.mp3</code> and set <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">CUSTOM_DEVOTIONAL_AUDIO_URL = '/navratri-music.mp3'</code> inside <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">src/data/navratriConfig.ts</code>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowMusicInfo(false)}
            className="text-amber-300 hover:text-white cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* =====================================================================
          4. OPENING CINEMATIC INTRODUCTION
         ===================================================================== */}
      <div className="relative z-10 max-w-4xl mx-auto pt-8 pb-10 text-center">
        {/* Decorative Arch & Lotus Header */}
        <div className="flex flex-col items-center justify-center mb-5">
          <LotusMotif className="w-24 h-16 mb-2" />
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-amber-400 to-amber-200" />
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-300 font-bold">
              Sacred Festive Offering
            </span>
            <span className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent via-amber-400 to-amber-200" />
          </div>
        </div>

        {/* Step 1: ✨ Jai Mata Di ✨ */}
        <div
          className={`transition-all duration-700 transform ${
            introStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <p className="inline-block px-5 py-1.5 rounded-full bg-amber-500/15 border border-amber-300/40 text-amber-200 font-serif text-base sm:text-lg font-bold tracking-wider shadow-[0_0_25px_rgba(251,191,36,0.2)]">
            ✨ Jai Mata Di ✨
          </p>
        </div>

        {/* Step 2: Happy Navratri, Meri Devi Ji ❤️ */}
        <div
          className={`mt-5 transition-all duration-700 transform ${
            introStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight bg-gradient-to-r from-amber-200 via-rose-200 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(251,191,36,0.25)]"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Happy Navratri, Meri Devi Ji ❤️
          </h1>
        </div>

        {/* Step 3: Aaj ka din aapke naam... */}
        <div
          className={`mt-4 max-w-2xl mx-auto transition-all duration-700 transform ${
            introStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="font-serif italic text-base sm:text-xl text-amber-100/90 leading-relaxed px-2">
            “Aaj ka din aapke naam, ek chhoti si wish aur dil se nikli hui ek maafi…”
          </p>
        </div>

        {/* Glowing Diyas Row */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 my-7">
          <GlowingDiya size="sm" />
          <GlowingDiya size="md" />
          <GlowingDiya size="sm" />
        </div>

        {/* Step 4: Open My Heart ❤️ Button */}
        <div
          className={`mt-2 transition-all duration-700 transform ${
            introStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {!isHeartOpened ? (
            <button
              type="button"
              onClick={handleOpenMyHeart}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 text-[#26040c] font-serif font-black text-base sm:text-lg tracking-wide shadow-[0_0_35px_rgba(251,191,36,0.45)] hover:shadow-[0_0_50px_rgba(251,191,36,0.75)] hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-amber-200"
            >
              <span>Open My Heart ❤️</span>
              <ChevronDown
                size={18}
                className="group-hover:translate-y-1 transition-transform text-[#26040c]"
              />
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-200 text-xs font-medium">
              <span>🌺 Dil Ki Baat Khul Chuki Hai — Scroll Down, Meri Devi Ji 🌺</span>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
          MAIN REVEALED CONTENT (Revealed smoothly when "Open My Heart ❤️" is clicked)
         ===================================================================== */}
      {isHeartOpened && (
        <div
          ref={mainContentRef}
          className="relative z-10 max-w-5xl mx-auto space-y-16 pt-6 pb-8 animate-fade-in"
        >
          {/* =================================================================
              5. HEARTFELT APOLOGY SECTION
             ================================================================= */}
          <div className="relative max-w-3xl mx-auto">
            {/* Outer Subtle Golden Halo */}
            <div className="absolute -inset-1 rounded-[34px] bg-gradient-to-b from-amber-400/30 via-rose-500/20 to-amber-500/30 blur-md pointer-events-none" />

            <div className="relative rounded-[32px] bg-gradient-to-b from-[#3b0714]/95 via-[#2a050e]/95 to-[#21030b]/98 border-2 border-amber-400/45 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 sm:p-10 md:p-12 overflow-hidden">
              {/* Corner Ornamental Golden Motifs */}
              <div className="absolute top-3 left-4 text-amber-400/30 text-2xl font-serif select-none pointer-events-none">
                ❈
              </div>
              <div className="absolute top-3 right-4 text-amber-400/30 text-2xl font-serif select-none pointer-events-none">
                ❈
              </div>
              <div className="absolute bottom-3 left-4 text-amber-400/30 text-2xl font-serif select-none pointer-events-none">
                ❈
              </div>
              <div className="absolute bottom-3 right-4 text-amber-400/30 text-2xl font-serif select-none pointer-events-none">
                ❈
              </div>

              {/* Section Heading */}
              <div className="text-center space-y-3 pb-6 border-b border-amber-400/20">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-amber-300">
                  <span>🪔</span>
                  <span>Sincere Apology From The Heart</span>
                  <span>🪔</span>
                </div>
                <h2
                  className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-amber-100 leading-snug"
                  style={{ textWrap: 'balance' } as React.CSSProperties}
                >
                  Ek Baat Dil Se Kehni Hai, Devi Ji… 🥺❤️
                </h2>
              </div>

              {/* Exact Heartfelt Message in Warm Cream / Golden Frame */}
              <div className="mt-7 space-y-5 font-serif text-base sm:text-lg text-[#FFFDF9] leading-relaxed tracking-wide select-text">
                <p className="text-amber-300 font-bold text-lg sm:text-xl">
                  Happy Navratri, <span className="underline decoration-amber-400/60 underline-offset-4">Vanshika Ji</span>. ❤️🙏🏻
                </p>

                <p className="text-amber-50/95">
                  Meri Devi Ji, aaj Navratri ke is pyaare se din par main aapko dil se wish karna chahta hoon. Mujhe pata hai ki aap mujhse bahut gussa ho aur abhi mujhse baat bhi nahi kar rahi ho.
                </p>

                <p className="text-amber-50/95">
                  Lekin main dil se aapse maafi maangna chahta hoon. Agar meri kisi baat ya mere kisi behaviour se aapko dukh hua hai, toh mujhe sach mein sorry hai. Mera intention kabhi bhi aapko hurt karne ka nahi tha.
                </p>

                <p className="text-amber-50/95">
                  Aap mere liye bahut special ho, aur aapki feelings mere liye matter karti hain. Main nahi chahta ki meri wajah se aapka dil dukhe.
                </p>

                <p className="text-amber-50/95">
                  Main aapse bas itna kehna chahta hoon ki mujhe maaf kar dena, Devi Ji. Main apni galti samajhne aur khud ko behtar banane ki koshish karunga.
                </p>

                <p className="text-amber-50/95">
                  Aaj Maa Durga se yahi prarthana hai ki aap hamesha khush raho, aapke chehre par hamesha smile rahe aur aapki life khushiyon se bhari rahe.
                </p>

                <p className="text-amber-200 font-semibold pt-1">
                  Aapko aur aapke parivaar ko Happy Navratri, Vanshika Ji. 🌺🫶🏻
                </p>

                <p className="text-rose-300 font-bold text-lg sm:text-xl pt-2">
                  Dil se sorry, meri Devi Ji. ❤️🙏🏻
                </p>
              </div>

              {/* Bottom Lotus Divider */}
              <div className="mt-8 pt-5 border-t border-amber-400/20 flex items-center justify-between text-xs text-amber-200/75 font-serif italic">
                <span>With utmost respect, care & devotion</span>
                <span>~ Yours sincerely, Ruu ✨</span>
              </div>
            </div>
          </div>

          {/* =================================================================
              6. PERSONAL PHOTO GALLERY DEDICATED TO VANSHIKA JI
             ================================================================= */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-amber-400/20 pb-4">
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-300 font-bold block">
                  🌸 Sacred Frames of Grace 🌸
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100">
                  Meri Devi Ji — <span className="text-amber-300">Vanshika Ji’s</span> Gallery 💖
                </h2>
                <p className="text-xs sm:text-sm text-amber-100/75">
                  Click any photo to view in full-screen lightbox, or easily add/replace photos anytime.
                </p>
              </div>

              {/* Easy Add / Replace Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddNewPhotoSlot}
                  className="px-3.5 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-300/40 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Upload size={13} />
                  <span>Add Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPhotoGuide((prev) => !prev)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200/90 border border-amber-300/25 text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Info size={13} />
                  <span>How to Edit in Code</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetGallery}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200/70 hover:text-amber-100 border border-white/10 text-xs cursor-pointer flex items-center gap-1 transition-all"
                  title="Reset to default project photos"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Code Configuration Guide Banner */}
            {showPhotoGuide && (
              <div className="p-4 rounded-2xl bg-[#29050f]/95 border border-amber-400/35 text-xs text-amber-100/90 space-y-2 animate-fade-in">
                <p className="font-bold text-amber-300">
                  📸 How to Permanently Add or Replace Vanshika Ji’s Photos in the Codebase:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-amber-100/80">
                  <li>
                    Place your original photo files in <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">src/assets/images/</code> (or <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">public/</code>).
                  </li>
                  <li>
                    Open <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">src/data/navratriConfig.ts</code> and update <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">DEFAULT_NAVRATRI_PHOTOS</code>.
                  </li>
                  <li>
                    You can also click <strong>"Replace Photo"</strong> on any card below to upload directly from your phone or computer! All photos preserve their original natural look without altering faces.
                  </li>
                </ol>
              </div>
            )}

            {/* Photo Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {photos.map((photo) => {
                const hasImage = Boolean(photo.imageUrl && !photo.isPlaceholder);
                return (
                  <div
                    key={photo.id}
                    className="group relative rounded-2xl bg-gradient-to-b from-[#380713]/90 to-[#1f030a]/95 border border-amber-400/35 hover:border-amber-300/80 shadow-[0_10px_30px_rgba(0,0,0,0.45)] hover:shadow-[0_12px_35px_rgba(251,191,36,0.22)] transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
                  >
                    {/* Image / Placeholder Container */}
                    <div className="relative aspect-[3/4] w-full bg-[#160207] overflow-hidden flex items-center justify-center">
                      {hasImage ? (
                        <>
                          <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            referrerPolicy="no-referrer"
                            onClick={() => setLightboxPhoto(photo)}
                            className="w-full h-full object-contain bg-[#120206] cursor-pointer transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                          {/* Lightbox Zoom Button Overlay */}
                          <button
                            type="button"
                            onClick={() => setLightboxPhoto(photo)}
                            className="absolute top-3 right-3 p-2 rounded-full bg-black/65 hover:bg-amber-400 text-amber-200 hover:text-black border border-amber-300/40 opacity-90 group-hover:opacity-100 transition-all cursor-pointer"
                            title="Open full-screen view"
                            aria-label={`View ${photo.title} in full screen`}
                          >
                            <ZoomIn size={14} />
                          </button>
                        </>
                      ) : (
                        /* Attractive Festive Placeholder when no photo is in this slot */
                        <div className="p-5 text-center flex flex-col items-center justify-center h-full space-y-3 bg-gradient-to-b from-[#2e0610] to-[#1a0309]">
                          <div className="w-14 h-14 rounded-full bg-amber-400/15 border border-amber-300/40 flex items-center justify-center text-amber-300">
                            <ImageIcon size={24} />
                          </div>
                          <p className="font-serif text-sm font-bold text-amber-200">
                            {photo.title}
                          </p>
                          <p className="text-[11px] text-amber-100/70 leading-relaxed">
                            Click below to upload Vanshika Ji’s photo or set it in{' '}
                            <code className="text-amber-300 font-mono">src/data/navratriConfig.ts</code>
                          </p>
                          <button
                            type="button"
                            onClick={() => triggerPhotoUpload(photo.id)}
                            className="mt-1 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#26040c] font-bold text-xs cursor-pointer transition-all shadow-md"
                          >
                            + Select Photo
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Caption & Replace Footer */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 border-t border-amber-400/20">
                      <div className="space-y-1">
                        <h3 className="font-serif text-base font-bold text-amber-200">
                          {photo.title}
                        </h3>
                        <p className="text-xs text-amber-100/80 leading-relaxed">
                          {photo.caption}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-amber-400/10 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-serif italic text-rose-200/90 truncate">
                          {photo.blessing}
                        </span>
                        <button
                          type="button"
                          onClick={() => triggerPhotoUpload(photo.id)}
                          className="shrink-0 text-[11px] font-mono text-amber-300 hover:text-amber-100 underline cursor-pointer"
                          title="Replace with another photo"
                        >
                          Replace
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================================
              7. NAVRATRI WISHES FOR EVERYONE (Vanshika Ji, Taruu, Tanishq)
             ================================================================= */}
          <div className="space-y-7">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-300 font-bold">
                🪔 Sacred Blessings & Prayers 🪔
              </span>
              <h2
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-amber-100"
                style={{ textWrap: 'balance' } as React.CSSProperties}
              >
                Navratri Ki Dher Saari Shubhkamnayein 🌺
              </h2>
              <p className="text-xs sm:text-sm text-amber-100/75">
                Heartfelt festive prayers for <strong className="text-amber-300">Vanshika Ji</strong>,{' '}
                <strong className="text-rose-200">Taruu</strong>, and{' '}
                <strong className="text-amber-200">Tanishq</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {NAVRATRI_WISHES.map((card) => (
                <div
                  key={card.id}
                  className={`relative rounded-3xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                    card.isMainHighlight
                      ? 'bg-gradient-to-b from-[#4c091b] via-[#340612] to-[#24030c] border-2 border-amber-300 shadow-[0_12px_40px_rgba(251,191,36,0.28)] md:-translate-y-1'
                      : 'bg-gradient-to-b from-[#340612]/90 to-[#1e030a]/95 border border-amber-400/35 hover:border-amber-300/60 shadow-lg hover:-translate-y-1'
                  }`}
                >
                  {/* Top Highlight Glow */}
                  <div
                    className={`h-1 w-20 rounded-full bg-gradient-to-r ${card.accentColor} mb-4`}
                  />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300/90">
                        {card.badge}
                      </span>
                      <GlowingDiya size="sm" />
                    </div>

                    <h3
                      className={`font-serif font-bold tracking-wide ${
                        card.isMainHighlight
                          ? 'text-2xl sm:text-3xl text-amber-200 drop-shadow-[0_2px_10px_rgba(251,191,36,0.35)]'
                          : 'text-xl sm:text-2xl text-amber-100'
                      }`}
                    >
                      {card.name}
                    </h3>

                    <p className="font-serif text-sm sm:text-base text-[#FFFDF9]/95 leading-relaxed pt-1">
                      “{card.message}”
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-amber-400/20 flex items-center justify-between text-xs text-amber-200/80">
                    <span>✨ Jai Mata Di ✨</span>
                    <span>🌺 Shubh Navratri</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =================================================================
              8. INTERACTIVE APOLOGY EXPERIENCE (Respectful & Pressure-Free)
             ================================================================= */}
          <div className="relative max-w-3xl mx-auto">
            {/* Floating Burst Petals & Hearts when button is clicked */}
            {burstPetals.length > 0 && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden z-30" aria-hidden="true">
                {burstPetals.map((p) => (
                  <span
                    key={p.id}
                    className="navratri-burst-petal absolute bottom-12 text-2xl select-none"
                    style={
                      {
                        left: `${p.left}%`,
                        '--burst-delay': `${p.delay}s`,
                        '--burst-dur': `${p.duration}s`,
                      } as React.CSSProperties
                    }
                  >
                    {p.emoji}
                  </span>
                ))}
              </div>
            )}

            <div className="rounded-[32px] bg-gradient-to-b from-[#3d0815]/95 to-[#22040b]/95 border border-amber-400/45 p-6 sm:p-10 text-center space-y-6 shadow-[0_15px_45px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="flex justify-center">
                <LotusMotif className="w-16 h-12" />
              </div>

              <h2
                className="font-serif text-2xl sm:text-3xl font-bold text-amber-100"
                style={{ textWrap: 'balance' } as React.CSSProperties}
              >
                Devi Ji, Ek Chhoti Si Request Hai… 🥺
              </h2>

              <p className="font-serif text-base sm:text-lg text-[#FFFDF9]/95 max-w-2xl mx-auto leading-relaxed">
                “Main jaanta hoon ki sirf sorry kehna hi kaafi nahi hota. Main aapki feelings samajhna chahta hoon aur apni galti sudhaarna chahta hoon. Jab aapka mann ho, tab mujhse baat kar lena. Main aapko time aur space dena chahta hoon. ❤️”
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleApologyMomentClick}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400 hover:from-amber-300 hover:to-rose-300 text-[#26040c] font-serif font-extrabold text-sm sm:text-base tracking-wide shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-100"
                >
                  Ek Pyaari Si Maafi Accept Kar Lo? 🌷
                </button>
              </div>

              {/* Gentle, Pressure-Free Gratitude Message upon click */}
              {apologyAcknowledged && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-5 p-5 rounded-2xl bg-amber-400/15 border border-amber-300/45 max-w-xl mx-auto animate-fade-in space-y-2"
                >
                  <div className="text-2xl">❤️🌸🌷✨</div>
                  <p className="font-serif text-base sm:text-lg font-bold text-amber-200 leading-relaxed">
                    “Thank you for giving this little message a moment of your time. ❤️🌸”
                  </p>
                  <p className="text-xs text-amber-100/80 italic">
                    Take all the time and space you need, Vanshika Ji. Wishing you peace, happiness, and Maa Durga’s choicest blessings always. 🙏🏻🌺
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          FULL-SCREEN PHOTO LIGHTBOX MODAL
         ===================================================================== */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#24040c] border-2 border-amber-400/50 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(251,191,36,0.3)] p-4 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-amber-200">
                  {lightboxPhoto.title}
                </h3>
                <p className="text-xs text-amber-100/75 italic">{lightboxPhoto.blessing}</p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="w-9 h-9 rounded-full bg-rose-950 hover:bg-amber-400 text-amber-200 hover:text-black border border-amber-400/40 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close full-screen photo"
              >
                <X size={18} />
              </button>
            </div>

            <div className="w-full max-h-[72vh] flex items-center justify-center bg-black/50 rounded-2xl overflow-hidden p-2">
              <img
                src={lightboxPhoto.imageUrl}
                alt={lightboxPhoto.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[68vh] object-contain rounded-xl"
              />
            </div>

            <p className="text-center font-serif text-sm text-amber-100/90">
              {lightboxPhoto.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
