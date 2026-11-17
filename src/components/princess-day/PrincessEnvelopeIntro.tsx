import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { PRINCESS_DAY_CONTENT } from '../../data/princessDayData';

interface PrincessEnvelopeIntroProps {
  isOpened: boolean;
  onOpen: () => void;
}

export default function PrincessEnvelopeIntro({
  isOpened,
  onOpen,
}: PrincessEnvelopeIntroProps) {
  const shouldReduceMotion = useReducedMotion();
  const [stage, setStage] = useState<'sealed' | 'untying' | 'opening' | 'revealed'>(
    isOpened ? 'revealed' : 'sealed'
  );

  useEffect(() => {
    if (!isOpened) {
      setStage('sealed');
    }
  }, [isOpened]);

  const handleOpenClick = () => {
    if (stage !== 'sealed') return;

    if (shouldReduceMotion) {
      setStage('revealed');
      onOpen();
      return;
    }

    setStage('untying');
    window.setTimeout(() => setStage('opening'), 380);
    window.setTimeout(() => setStage('revealed'), 950);
    window.setTimeout(() => onOpen(), 1550);
  };

  const ribbonUntied = stage !== 'sealed';
  const flapOpen = stage === 'opening' || stage === 'revealed';
  const cardOut = stage === 'revealed';

  return (
    <section
      aria-label="Princess Day Envelope Opening"
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center px-4 pt-20 pb-12 overflow-hidden"
    >
      {/* Soft Pastel Pink & Lavender Halo */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[420px] max-w-[92vw] h-[320px] rounded-full blur-[90px] opacity-60"
        style={{
          background:
            'radial-gradient(circle, rgba(244,114,182,0.32) 0%, rgba(192,132,252,0.28) 55%, transparent 85%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center">
        {/* Quiet Occasion Line */}
        <p className="text-xs sm:text-sm font-medium tracking-[0.18em] uppercase text-pink-600 mb-3">
          {PRINCESS_DAY_CONTENT.occasion} <span aria-hidden="true">·</span> From {PRINCESS_DAY_CONTENT.fromName}
        </p>

        {/* Opening Heading */}
        <h1
          className="font-serif text-2xl sm:text-4xl font-bold text-[#4A1936] leading-snug mb-10"
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          {PRINCESS_DAY_CONTENT.opening.heading}
        </h1>

        {/* Animated Pastel Pink Envelope with Pink Satin Ribbon */}
        <div
          className="relative w-full max-w-[320px] sm:max-w-[360px] mx-auto my-2"
          style={{ perspective: '1100px' }}
        >
          <div
            role="button"
            tabIndex={0}
            aria-label={PRINCESS_DAY_CONTENT.opening.buttonText}
            onClick={handleOpenClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenClick();
              }
            }}
            className={`relative w-full h-[210px] sm:h-[235px] select-none ${
              stage === 'sealed' ? 'cursor-pointer group' : 'cursor-default'
            }`}
          >
            {/* Envelope Back */}
            <div
              className="absolute inset-0 rounded-2xl shadow-[0_20px_50px_rgba(236,72,153,0.22)] border border-pink-200/90"
              style={{
                background: 'linear-gradient(160deg, #FFE4EE 0%, #FBCFE8 65%, #F3E8FF 100%)',
              }}
            />

            {/* Emerging Letter Card */}
            <motion.div
              initial={false}
              animate={
                cardOut
                  ? { y: -76, opacity: 1, scale: 1 }
                  : flapOpen
                  ? { y: -20, opacity: 0.96, scale: 0.97 }
                  : { y: 10, opacity: 0, scale: 0.94 }
              }
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-4 right-4 top-3 bottom-4 z-10 rounded-xl bg-white/95 border border-pink-200 px-4 py-4 flex flex-col items-center justify-center text-center shadow-md"
            >
              <span className="text-xs font-semibold tracking-wider uppercase text-pink-500">
                Happy Princess Day 👑
              </span>
              <p className="font-serif text-lg sm:text-xl font-bold text-[#4A1936] mt-1">
                For Vanshika ji (Mystic Signal)
              </p>
              <p className="font-handwritten text-xl text-pink-600 mt-0.5">
                With lots of love from Ruu 💗
              </p>
            </motion.div>

            {/* Front Envelope Side & Bottom Pocket Folds */}
            <div className="absolute inset-0 z-20 rounded-2xl overflow-hidden pointer-events-none">
              <svg viewBox="0 0 360 235" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                  <linearGradient id="pastelSideL" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFDCE9" />
                    <stop offset="100%" stopColor="#FBCFE8" />
                  </linearGradient>
                  <linearGradient id="pastelSideR" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F8D8EE" />
                    <stop offset="100%" stopColor="#F3E8FF" />
                  </linearGradient>
                  <linearGradient id="pastelBottom" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stopColor="#FFEBF3" />
                    <stop offset="100%" stopColor="#FBCFE8" />
                  </linearGradient>
                </defs>
                <polygon points="0,0 184,122 0,235" fill="url(#pastelSideL)" />
                <polygon points="360,0 176,122 360,235" fill="url(#pastelSideR)" />
                <polygon points="0,235 180,112 360,235" fill="url(#pastelBottom)" />
                <polyline
                  points="0,235 180,112 360,235"
                  fill="none"
                  stroke="#F472B6"
                  strokeOpacity="0.35"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Horizontal Pink Satin Ribbon Band Across Envelope */}
            <motion.div
              initial={false}
              animate={ribbonUntied ? { opacity: 0, scaleX: 1.15 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.4 }}
              className="pointer-events-none absolute inset-x-0 top-[48%] -translate-y-1/2 h-4 z-25"
              style={{
                background:
                  'linear-gradient(180deg, #F9A8D4 0%, #EC4899 50%, #DB2777 100%)',
                boxShadow: '0 3px 10px rgba(236, 72, 153, 0.25)',
              }}
              aria-hidden="true"
            />

            {/* 3D Animated Top Flap */}
            <motion.div
              initial={false}
              animate={{ rotateX: flapOpen ? -175 : 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                zIndex: flapOpen ? 5 : 22,
              }}
              className="absolute top-0 left-0 right-0 h-[55%] pointer-events-none"
            >
              <svg
                viewBox="0 0 360 130"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-[0_4px_10px_rgba(236,72,153,0.16)]"
              >
                <defs>
                  <linearGradient id="pastelTopFlap" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stopColor="#FFF0F5" />
                    <stop offset="100%" stopColor="#FBCFE8" />
                  </linearGradient>
                </defs>
                <polygon points="0,0 360,0 180,126" fill="url(#pastelTopFlap)" />
                <polyline
                  points="0,0 180,126 360,0"
                  fill="none"
                  stroke="#F472B6"
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                />
              </svg>
            </motion.div>

            {/* Pink Ribbon Bow Centerpiece */}
            <motion.div
              initial={false}
              animate={
                ribbonUntied
                  ? { scale: 1.25, opacity: 0, y: -12 }
                  : { scale: 1, opacity: 1, y: 0 }
              }
              transition={{ duration: 0.42 }}
              className="pointer-events-none absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 z-30"
              aria-hidden="true"
            >
              <svg viewBox="0 0 88 64" className="w-20 h-14 drop-shadow-[0_6px_14px_rgba(219,39,119,0.35)]">
                {/* Ribbon Tails */}
                <path d="M40 34L24 58L34 56L42 36Z" fill="#DB2777" />
                <path d="M48 34L64 58L54 56L46 36Z" fill="#EC4899" />
                {/* Left Bow Loop */}
                <path
                  d="M42 30C28 12 8 14 10 30C12 44 30 40 42 32Z"
                  fill="#F472B6"
                  stroke="#FFF1F2"
                  strokeWidth="1.5"
                />
                {/* Right Bow Loop */}
                <path
                  d="M46 30C60 12 80 14 78 30C76 44 58 40 46 32Z"
                  fill="#EC4899"
                  stroke="#FFF1F2"
                  strokeWidth="1.5"
                />
                {/* Center Ribbon Knot */}
                <circle cx="44" cy="31" r="7.5" fill="#BE185D" stroke="#FFF1F2" strokeWidth="1.8" />
                <circle cx="44" cy="31" r="2.5" fill="#FDE68A" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Open Surprise CTA Button */}
        <div className="mt-10">
          {!isOpened ? (
            <button
              type="button"
              onClick={handleOpenClick}
              disabled={stage !== 'sealed'}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[50px] rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-purple-400 text-white font-semibold text-base tracking-wide shadow-[0_12px_30px_rgba(236,72,153,0.32)] hover:shadow-[0_16px_36px_rgba(236,72,153,0.45)] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap disabled:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
            >
              <span>{PRINCESS_DAY_CONTENT.opening.buttonText}</span>
            </button>
          ) : (
            <p className="text-sm font-medium text-pink-600">
              Your surprise is open below 💗
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
