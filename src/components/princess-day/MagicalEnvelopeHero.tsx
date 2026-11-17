import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { PRINCESS_DAY_META } from '../../data/princessDayData';

interface MagicalEnvelopeHeroProps {
  isOpened: boolean;
  onOpenSurprise: () => void;
}

export default function MagicalEnvelopeHero({
  isOpened,
  onOpenSurprise,
}: MagicalEnvelopeHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const [stage, setStage] = useState<'sealed' | 'breaking' | 'opening' | 'emerged'>(
    isOpened ? 'emerged' : 'sealed'
  );
  const [showSparkles, setShowSparkles] = useState(false);

  // Sync if replayed from finale
  useEffect(() => {
    if (!isOpened) {
      setStage('sealed');
      setShowSparkles(false);
    }
  }, [isOpened]);

  const handleTriggerOpen = () => {
    if (stage !== 'sealed') return;

    if (shouldReduceMotion) {
      setStage('emerged');
      onOpenSurprise();
      return;
    }

    setStage('breaking');
    setShowSparkles(true);

    window.setTimeout(() => {
      setStage('opening');
    }, 520);

    window.setTimeout(() => {
      setStage('emerged');
    }, 1100);

    window.setTimeout(() => {
      onOpenSurprise();
    }, 1850);
  };

  const sealBroken = stage !== 'sealed';
  const flapOpen = stage === 'opening' || stage === 'emerged';
  const letterEmerged = stage === 'emerged';

  return (
    <section
      aria-label="Cinematic Princess Day Envelope Opening"
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center px-4 pt-20 pb-14 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 25%, rgba(118, 24, 62, 0.55) 0%, rgba(74, 16, 40, 0.85) 45%, #240612 100%)',
      }}
    >
      {/* Warm Cinematic Candlelight & Champagne Radial Halos */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[560px] max-w-[95vw] h-[340px] rounded-full blur-[130px] opacity-40"
        style={{ background: 'radial-gradient(circle, #D9B56D 0%, #F4A7B9 45%, transparent 75%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center">
        {/* Quiet Unboxed Occasion Header */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-xs sm:text-sm tracking-[0.22em] uppercase text-[#D9B56D] font-medium mb-6"
        >
          {PRINCESS_DAY_META.occasion} <span aria-hidden="true">·</span> {PRINCESS_DAY_META.dateLabel}
        </motion.p>

        {/* Sequential Poetic Lines */}
        <div className="space-y-2 mb-7">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#FFF0F3]/90 leading-relaxed"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            “Some surprises are not meant to be explained...”
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#F4A7B9] leading-relaxed"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            “Some are meant to be opened with a smile.”
          </motion.p>
        </div>

        {/* Dedicated Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 1.25 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#FFF8EF] tracking-tight leading-[1.18] mb-10"
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          For My Favourite Person,
          <span className="block mt-1.5 text-[#D9B56D]">
            {PRINCESS_DAY_META.addressName} ❤️
          </span>
        </motion.h1>

        {/* 3D INTERACTIVE MAGICAL ENVELOPE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5 }}
          className="relative w-full max-w-[340px] sm:max-w-[390px] mx-auto my-2"
          style={{ perspective: '1200px' }}
        >
          {/* Ambient Glow Under Envelope */}
          <div
            className="pointer-events-none absolute -inset-4 rounded-3xl blur-2xl opacity-50 transition-opacity duration-700"
            style={{
              background:
                'radial-gradient(circle, rgba(217,181,109,0.28) 0%, rgba(244,167,185,0.16) 55%, transparent 80%)',
            }}
            aria-hidden="true"
          />

          {/* Subtle Bursting Golden Sparkles When Opening */}
          <AnimatePresence>
            {showSparkles && (
              <div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true">
                {[
                  { x: -110, y: -70, delay: 0 },
                  { x: 115, y: -60, delay: 0.08 },
                  { x: -75, y: -110, delay: 0.14 },
                  { x: 80, y: -115, delay: 0.18 },
                  { x: 0, y: -130, delay: 0.1 },
                  { x: -135, y: 10, delay: 0.2 },
                  { x: 135, y: 15, delay: 0.22 },
                ].map((sp, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.3, 1.15, 0.4],
                      x: sp.x,
                      y: sp.y,
                    }}
                    transition={{ duration: 1.25, delay: sp.delay, ease: 'easeOut' }}
                    className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-[#D9B56D]"
                    style={{ boxShadow: '0 0 12px #D9B56D, 0 0 22px #FFF8EF' }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Interactive Envelope Wrapper */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Open your Princess Day envelope surprise"
            onClick={handleTriggerOpen}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTriggerOpen();
              }
            }}
            className={`relative w-full h-[225px] sm:h-[250px] select-none ${
              stage === 'sealed' ? 'cursor-pointer group' : 'cursor-default'
            }`}
          >
            {/* Envelope Interior Back Wall */}
            <div
              className="absolute inset-0 rounded-xl shadow-[0_24px_60px_rgba(0,0,0,0.65)] border border-[#D9B56D]/40 overflow-visible"
              style={{
                background: 'linear-gradient(165deg, #6E1C3D 0%, #4A1028 60%, #340A1B 100%)',
              }}
            >
              {/* Subtle Gold Foil Inner Lining */}
              <div
                className="absolute inset-2 rounded-lg border border-[#D9B56D]/25 pointer-events-none"
                aria-hidden="true"
              />
            </div>

            {/* Emerging Cream Paper Letter */}
            <motion.div
              initial={false}
              animate={
                letterEmerged
                  ? { y: -96, opacity: 1, scale: 1 }
                  : flapOpen
                  ? { y: -28, opacity: 0.96, scale: 0.97 }
                  : { y: 12, opacity: 0, scale: 0.94 }
              }
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-4 right-4 top-3 bottom-4 z-10 rounded-lg px-5 py-5 flex flex-col items-center justify-center text-center shadow-[0_12px_30px_rgba(36,6,18,0.45)] border border-[#D9B56D]/50"
              style={{
                background: 'linear-gradient(180deg, #FFFDF9 0%, #FFF8EF 65%, #F8EAD8 100%)',
              }}
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8E3557] font-semibold">
                Mystic Signal Keepsake
              </span>
              <p className="font-serif text-lg sm:text-xl font-semibold text-[#4A1028] mt-1.5">
                {PRINCESS_DAY_META.personalLine}
              </p>
              <p className="font-handwritten text-xl sm:text-2xl text-[#6E1C3D] mt-1">
                Everything ahead was crafted with love for you, Vanshika Ji.
              </p>
            </motion.div>

            {/* Envelope Front Side & Bottom Pocket Flaps */}
            <div className="absolute inset-0 z-20 rounded-xl overflow-hidden pointer-events-none">
              <svg
                viewBox="0 0 400 250"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-[0_-2px_6px_rgba(0,0,0,0.22)]"
              >
                <defs>
                  <linearGradient id="envLeft" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8A284E" />
                    <stop offset="100%" stopColor="#5C1532" />
                  </linearGradient>
                  <linearGradient id="envRight" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C2245" />
                    <stop offset="100%" stopColor="#54122D" />
                  </linearGradient>
                  <linearGradient id="envBottom" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stopColor="#9B335B" />
                    <stop offset="100%" stopColor="#651837" />
                  </linearGradient>
                </defs>
                {/* Left Fold */}
                <polygon points="0,0 205,132 0,250" fill="url(#envLeft)" />
                {/* Right Fold */}
                <polygon points="400,0 195,132 400,250" fill="url(#envRight)" />
                {/* Bottom Fold */}
                <polygon points="0,250 200,118 400,250" fill="url(#envBottom)" />
                {/* Champagne Gold Hairline Edges */}
                <polyline
                  points="0,250 200,118 400,250"
                  fill="none"
                  stroke="#D9B56D"
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* 3D Animated Top Envelope Flap */}
            <motion.div
              initial={false}
              animate={{
                rotateX: flapOpen ? -175 : 0,
              }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                zIndex: flapOpen ? 5 : 25,
              }}
              className="absolute top-0 left-0 right-0 h-[56%] pointer-events-none"
            >
              <svg
                viewBox="0 0 400 140"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.4)]"
              >
                <defs>
                  <linearGradient id="envTopFlap" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stopColor="#9D355E" />
                    <stop offset="100%" stopColor="#6B1B3B" />
                  </linearGradient>
                </defs>
                <polygon points="0,0 400,0 200,136" fill="url(#envTopFlap)" />
                <polyline
                  points="0,0 200,136 400,0"
                  fill="none"
                  stroke="#D9B56D"
                  strokeOpacity="0.6"
                  strokeWidth="1.7"
                />
              </svg>
            </motion.div>

            {/* Sculpted Red Wax Seal with Tiny Embossed Heart */}
            <div
              className="absolute left-1/2 top-[51%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
              aria-hidden="true"
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Left Half of Wax Seal */}
                <motion.div
                  initial={false}
                  animate={
                    sealBroken
                      ? { x: -18, y: 12, rotate: -22, opacity: 0 }
                      : { x: 0, y: 0, rotate: 0, opacity: 1 }
                  }
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ clipPath: 'inset(0 50% 0 0)' }}
                >
                  <div
                    className="w-14 h-14 rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.55)] border border-[#F4A7B9]/35 flex items-center justify-center"
                    style={{
                      background:
                        'radial-gradient(circle at 35% 30%, #C82348 0%, #8C112E 65%, #5A091B 100%)',
                    }}
                  />
                </motion.div>

                {/* Right Half of Wax Seal */}
                <motion.div
                  initial={false}
                  animate={
                    sealBroken
                      ? { x: 18, y: 12, rotate: 22, opacity: 0 }
                      : { x: 0, y: 0, rotate: 0, opacity: 1 }
                  }
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ clipPath: 'inset(0 0 0 50%)' }}
                >
                  <div
                    className="w-14 h-14 rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.55)] border border-[#F4A7B9]/35 flex items-center justify-center"
                    style={{
                      background:
                        'radial-gradient(circle at 35% 30%, #C82348 0%, #8C112E 65%, #5A091B 100%)',
                    }}
                  />
                </motion.div>

                {/* Center Embossed Tiny Heart + Outer Ring */}
                <motion.div
                  initial={false}
                  animate={
                    sealBroken
                      ? { scale: 1.25, opacity: 0 }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 0.35 }}
                  className="relative z-10 w-10 h-10 rounded-full border border-[#D9B56D]/45 flex items-center justify-center group-hover:scale-105 transition-transform"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FFF0F3] drop-shadow-sm">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Prompt Caption & Primary CTA Below Envelope */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 1.75 }}
          className="mt-8 space-y-5"
        >
          <p className="text-sm sm:text-base text-[#FFF0F3]/85 font-normal tracking-wide">
            One little surprise is waiting for you...
          </p>

          {!isOpened ? (
            <button
              type="button"
              onClick={handleTriggerOpen}
              disabled={stage !== 'sealed'}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[48px] rounded-full bg-gradient-to-r from-[#D9B56D] via-[#E8C988] to-[#D9B56D] text-[#350A1B] font-semibold text-sm tracking-wider uppercase shadow-[0_10px_30px_rgba(217,181,109,0.35)] hover:shadow-[0_14px_38px_rgba(217,181,109,0.55)] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap disabled:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFF8EF]"
            >
              <span>OPEN YOUR SURPRISE ✨</span>
            </button>
          ) : (
            <p className="text-xs sm:text-sm text-[#D9B56D] tracking-[0.16em] uppercase font-medium">
              Opened with love · Scroll gently below
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
