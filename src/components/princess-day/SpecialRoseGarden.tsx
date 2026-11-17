import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Heart } from 'lucide-react';
import roseBouquetImg from '../../assets/images/princess_rose_bouquet_1794939595500.jpg';
import { ROSE_REASONS } from '../../data/princessDayData';

interface SpecialRoseGardenProps {
  rosesRevealed: boolean;
  onRevealRoses: () => void;
}

function RoseBloomSvg({ tone }: { tone: 'crimson' | 'blush' }) {
  const outer = tone === 'crimson' ? '#9B1739' : '#E78FA7';
  const mid = tone === 'crimson' ? '#C5244C' : '#F4A7B9';
  const inner = tone === 'crimson' ? '#E4496D' : '#FFD3DF';
  return (
    <svg viewBox="0 0 64 64" className="w-11 h-11 shrink-0 drop-shadow-md" aria-hidden="true">
      {/* Stem & Leaves */}
      <path d="M32 34V58" stroke="#4D7C5B" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M32 48C25 46 21 41 21 38C25 38 29 41 32 45Z" fill="#5D8F6B" />
      <path d="M32 44C39 42 43 37 43 34C39 34 35 37 32 41Z" fill="#4D7C5B" />
      {/* Rose Petals */}
      <circle cx="32" cy="24" r="14" fill={outer} />
      <path
        d="M21 24C21 16 26 11 32 11C38 11 43 16 43 24C43 31 38 35 32 35C26 35 21 31 21 24Z"
        fill={mid}
      />
      <path
        d="M25 23C25 18.5 28 15 32 15C36 15 39 18.5 39 23C39 27.5 36 30.5 32 30.5C28 30.5 25 27.5 25 23Z"
        fill={inner}
      />
      <path
        d="M29 22C29 19.5 30.5 18 32.5 18C34.5 18 35.5 20 35 22C34.5 24 31.5 24.5 30 23.5"
        stroke={outer}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function SpecialRoseGarden({
  rosesRevealed,
  onRevealRoses,
}: SpecialRoseGardenProps) {
  const shouldReduceMotion = useReducedMotion();
  const [bouquetImageError, setBouquetImageError] = useState(false);

  return (
    <section
      id="princess-rose-garden"
      aria-label="Special Rose Garden"
      className="relative py-20 sm:py-24 px-4 sm:px-6 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, rgba(42, 8, 22, 0.92) 0%, rgba(74, 16, 40, 0.96) 50%, rgba(44, 9, 23, 0.95) 100%)',
      }}
    >
      {/* Soft Fairy Lights Bokeh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {[
          { left: '12%', top: '18%', size: 80 },
          { left: '84%', top: '22%', size: 96 },
          { left: '22%', top: '78%', size: 70 },
          { left: '76%', top: '74%', size: 88 },
        ].map((light, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-2xl opacity-25"
            style={{
              left: light.left,
              top: light.top,
              width: `${light.size}px`,
              height: `${light.size}px`,
              background: 'radial-gradient(circle, #D9B56D 0%, transparent 75%)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left: Luxury Red & Pink Rose Bouquet Artwork */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6 relative"
        >
          <div className="relative rounded-3xl overflow-hidden border border-[#D9B56D]/40 shadow-[0_28px_70px_rgba(0,0,0,0.55)] aspect-square max-w-md mx-auto bg-[#2D0716]">
            {!bouquetImageError ? (
              <img
                src={roseBouquetImg}
                alt="Bouquet of velvet crimson and dusty pink garden roses wrapped in champagne silk"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => setBouquetImageError(true)}
                className={`w-full h-full object-cover transition-transform duration-1000 ${
                  rosesRevealed ? 'scale-105' : 'scale-100'
                }`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#5A1432] to-[#2B0615]">
                <RoseBloomSvg tone="crimson" />
                <p className="font-serif text-lg text-[#FFF8EF] mt-3">
                  Crimson &amp; Dusty Pink Garden Roses
                </p>
              </div>
            )}

            {/* Subtle Measured Scrim at Bottom */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#240612]/90 via-[#240612]/40 to-transparent"
              aria-hidden="true"
            />
            <p className="absolute bottom-4 inset-x-5 text-xs tracking-[0.16em] uppercase text-[#D9B56D] text-center font-medium">
              Handpicked for Vanshika Ji <span aria-hidden="true">·</span> 18 November 2026
            </p>
          </div>

          {/* Gentle Glowing Heart Particles Around Bouquet When Revealed */}
          <AnimatePresence>
            {rosesRevealed && !shouldReduceMotion && (
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                {[
                  { left: '15%', delay: 0.1 },
                  { left: '35%', delay: 0.35 },
                  { left: '62%', delay: 0.2 },
                  { left: '82%', delay: 0.45 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.6 }}
                    animate={{ opacity: [0, 0.85, 0], y: -90, scale: 1.05 }}
                    transition={{
                      duration: 3.4,
                      delay: item.delay,
                      repeat: Infinity,
                      repeatDelay: 1.4,
                    }}
                    className="absolute bottom-12 text-[#F4A7B9]"
                    style={{ left: item.left }}
                  >
                    <Heart size={18} className="fill-[#F4A7B9]/80" />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right: Glass-Like Poetic Copy & Interactive Rose Reveal */}
        <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[#D9B56D] font-medium">
              The Rose Garden <span aria-hidden="true">·</span> Dedicated To You
            </p>
            <h2
              className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#FFF8EF] leading-[1.2]"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              One Rose For Every Little Reason That Makes You Special.
            </h2>
          </div>

          <div className="rounded-2xl p-6 bg-[#FFF8EF]/[0.07] backdrop-blur-md border border-[#FFF8EF]/15">
            <p className="text-sm sm:text-base text-[#FFF0F3]/90 leading-relaxed">
              Every velvet petal carries a quiet thank-you — for your warmth, your laughter, your gentle soul, and every little memory we have shared as best friends and more.
            </p>
          </div>

          {!rosesRevealed ? (
            <div>
              <button
                type="button"
                onClick={onRevealRoses}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[48px] rounded-full bg-gradient-to-r from-[#D9B56D] to-[#E6C582] text-[#350A1B] font-semibold text-sm tracking-wider uppercase shadow-[0_12px_32px_rgba(217,181,109,0.3)] hover:shadow-[0_16px_40px_rgba(217,181,109,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFF8EF]"
              >
                <span>RECEIVE YOUR VIRTUAL ROSES 🌹</span>
              </button>
            </div>
          ) : (
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left"
            >
              {ROSE_REASONS.map((rose, index) => (
                <motion.div
                  key={rose.id}
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.45,
                    delay: shouldReduceMotion ? 0 : index * 0.18,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFF8EF]/[0.08] backdrop-blur-md border border-[#F4A7B9]/25"
                >
                  <RoseBloomSvg tone={rose.tone} />
                  <div className="min-w-0">
                    <h3 className="font-serif text-base font-semibold text-[#FFF8EF]">
                      {rose.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#FFF0F3]/80 leading-relaxed mt-0.5">
                      {rose.note}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
