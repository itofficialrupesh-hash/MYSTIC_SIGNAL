import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { RotateCcw, Heart } from 'lucide-react';
import castleArtwork from '../../assets/images/princess_fairytale_castle_1794939595915.jpg';
import { PRINCESS_DAY_META } from '../../data/princessDayData';

interface FinalGrandSurpriseProps {
  onReplay: () => void;
}

export default function FinalGrandSurprise({ onReplay }: FinalGrandSurpriseProps) {
  const shouldReduceMotion = useReducedMotion();
  const [castleImageError, setCastleImageError] = useState(false);

  return (
    <section
      id="princess-final-surprise"
      aria-label="The Final Grand Surprise"
      className="relative min-h-[92svh] w-full flex flex-col items-center justify-center px-4 py-24 overflow-hidden bg-[#240612] text-[#FFF8EF]"
    >
      {/* Fairytale Castle Backdrop + Measured Scrim */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {!castleImageError ? (
          <img
            src={castleArtwork}
            alt="Fairytale castle bathed in glowing moonlight under starry twilight sky"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setCastleImageError(true)}
            className="w-full h-full object-cover object-center opacity-55"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background:
                'radial-gradient(circle at 50% 25%, #6A1B3D 0%, #3A0A1E 55%, #1E040F 100%)',
            }}
          />
        )}
        {/* Layered Romantic Burgundy Contrast Scrim (>= 4.5:1 text legibility) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(36, 6, 18, 0.85) 0%, rgba(56, 11, 30, 0.62) 45%, rgba(28, 4, 14, 0.92) 100%)',
          }}
        />
      </div>

      {/* Glowing Moonlight Halo */}
      <div
        className="pointer-events-none absolute top-14 left-1/2 -translate-x-1/2 w-[360px] h-[360px] rounded-full blur-[110px] opacity-35 z-0"
        style={{ background: 'radial-gradient(circle, #D9B56D 0%, #F4A7B9 50%, transparent 80%)' }}
        aria-hidden="true"
      />

      {/* Foreground Cinematic Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
        {/* Glowing Center Heart */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.7 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-20 h-20 rounded-full bg-[#4A1028]/80 border border-[#D9B56D]/55 flex items-center justify-center shadow-[0_0_50px_rgba(244,167,185,0.45)]"
        >
          <Heart
            size={34}
            className={`text-[#F4A7B9] fill-[#F4A7B9] ${
              shouldReduceMotion ? '' : 'princess-heart-glow'
            }`}
          />
        </motion.div>

        {/* Sequenced Finale Typography */}
        <div className="space-y-4">
          <motion.p
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-xs sm:text-sm tracking-[0.26em] uppercase text-[#D9B56D] font-medium"
          >
            THE END OF THIS LITTLE SURPRISE...
          </motion.p>

          <motion.p
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#FFF0F3] leading-snug"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            BUT NEVER THE END OF HOW SPECIAL YOU ARE.
          </motion.p>
        </div>

        {/* Hairline Champagne Divider */}
        <div className="w-24 h-[1px] mx-auto bg-[#D9B56D]/50" aria-hidden="true" />

        {/* Grand Princess Day Headline */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, delay: 0.75 }}
          className="space-y-3"
        >
          <h2
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-[#FFF8EF] leading-[1.15]"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Happy Princess Day,
            <span className="block mt-2 text-[#D9B56D]">Vanshika Ji 👑</span>
          </h2>

          <p className="font-handwritten text-3xl sm:text-4xl text-[#F4A7B9] pt-1">
            {PRINCESS_DAY_META.personalLine}
          </p>

          <p className="text-base sm:text-lg text-[#FFF0F3]/90 font-serif italic pt-1">
            Forever My Favourite Mystic Signal ❤️
          </p>
        </motion.div>

        {/* Replay Experience Button */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="pt-4"
        >
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[48px] rounded-full bg-gradient-to-r from-[#D9B56D] via-[#E8C988] to-[#D9B56D] text-[#350A1B] font-semibold text-sm tracking-wider uppercase shadow-[0_12px_32px_rgba(217,181,109,0.35)] hover:shadow-[0_16px_40px_rgba(217,181,109,0.55)] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFF8EF]"
          >
            <RotateCcw size={16} />
            <span>REPLAY MY LITTLE SURPRISE</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
