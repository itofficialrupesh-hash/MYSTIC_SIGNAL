import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { SORRY_LETTER_PARAGRAPHS } from '../../data/princessDayData';

interface SpecialSorrySectionProps {
  response: 'okay' | 'time' | null;
  onSelectResponse: (choice: 'okay' | 'time') => void;
}

function CornerRoseOrnament({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={`w-14 h-14 sm:w-16 sm:h-16 pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Leaves */}
      <path d="M18 52C12 42 18 30 28 28C28 38 24 46 18 52Z" fill="#5D8F6B" fillOpacity="0.65" />
      <path d="M52 20C42 14 30 20 28 30C38 30 46 26 52 20Z" fill="#4D7C5B" fillOpacity="0.65" />
      {/* Delicate Rose */}
      <circle cx="28" cy="28" r="13" fill="#B52246" fillOpacity="0.88" />
      <circle cx="28" cy="28" r="9" fill="#DE5476" fillOpacity="0.92" />
      <circle cx="27.5" cy="27.5" r="5" fill="#F4A7B9" />
      <path
        d="M25 27C25 25 27 24 29 25C30.5 26 30 28.5 28 29C26.5 29.5 25 28.5 25 27Z"
        stroke="#8C112E"
        strokeWidth="1.1"
        fill="none"
      />
      {/* Tiny Secondary Bud */}
      <circle cx="48" cy="18" r="6" fill="#C93358" fillOpacity="0.82" />
      <circle cx="16" cy="48" r="5.5" fill="#DF728E" fillOpacity="0.85" />
    </svg>
  );
}

function HeartWaxSeal() {
  return (
    <div
      className="relative w-16 h-16 flex items-center justify-center select-none pointer-events-none"
      aria-hidden="true"
    >
      <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_6px_14px_rgba(74,16,40,0.3)]">
        <defs>
          <radialGradient id="heartWaxGrad" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#D62C53" />
            <stop offset="65%" stopColor="#9B1233" />
            <stop offset="100%" stopColor="#650920" />
          </radialGradient>
        </defs>
        {/* Organic Wax Rim */}
        <path
          d="M40 8C48 7 56 12 63 18C69 24 72 34 69 44C66 54 57 65 48 69C40 73 31 71 23 65C15 59 9 48 10 37C11 26 18 16 27 11C32 9 36 8 40 8Z"
          fill="url(#heartWaxGrad)"
        />
        {/* Inner Embossed Ring */}
        <circle
          cx="40"
          cy="40"
          r="21"
          fill="none"
          stroke="#FFF0F3"
          strokeOpacity="0.3"
          strokeWidth="1.2"
        />
        {/* Center Raised Heart */}
        <path
          d="M40 50.5L38.3 48.9C32.4 43.6 28.5 40 28.5 35.6C28.5 32 31.3 29.2 34.9 29.2C36.9 29.2 38.8 30.1 40 31.6C41.2 30.1 43.1 29.2 45.1 29.2C48.7 29.2 51.5 32 51.5 35.6C51.5 40 47.6 43.6 41.7 48.9L40 50.5Z"
          fill="#FFF0F3"
          fillOpacity="0.92"
        />
      </svg>
    </div>
  );
}

export default function SpecialSorrySection({
  response,
  onSelectResponse,
}: SpecialSorrySectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredChoice, setHoveredChoice] = useState<'okay' | 'time' | null>(null);

  return (
    <section
      id="princess-sorry-section"
      aria-label="Sincere Apology for Vanshika Ji"
      className="relative py-20 sm:py-24 px-4 sm:px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #FFF0F3 0%, #FCE3EA 50%, #FFF0F3 100%)',
        color: '#4A1028',
      }}
    >
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="text-center space-y-2.5 mb-12"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-[#8E3557] font-semibold">
            From My Heart To Yours <span aria-hidden="true">·</span> Without Pressure
          </p>
          <h2
            className="font-serif text-3xl sm:text-4xl md:text-[42px] font-semibold text-[#4A1028] leading-tight"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Can I Tell You Something, Vanshika Ji?
          </h2>
        </motion.div>

        {/* Handwritten Cream Paper Card with Small Roses & Red Heart Wax Seal */}
        <motion.article
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 22 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl p-6 sm:p-10 md:p-12 shadow-[0_22px_55px_rgba(74,16,40,0.12)] border border-[#D9B56D]/45"
          style={{
            background: 'linear-gradient(180deg, #FFFDF9 0%, #FFF8EF 65%, #F9ECDC 100%)',
          }}
        >
          {/* Corner Small Roses */}
          <CornerRoseOrnament className="absolute -top-3 -left-3 opacity-90" />
          <CornerRoseOrnament className="absolute -bottom-3 -left-3 -rotate-90 opacity-80" />
          <CornerRoseOrnament className="absolute -top-3 -right-3 rotate-90 opacity-85" />

          {/* Handwritten Apology Body */}
          <div className="relative z-10 space-y-4 font-handwritten text-[22px] sm:text-[25px] leading-[1.55] text-[#3B1022]">
            {SORRY_LETTER_PARAGRAPHS.map((paragraph, idx) => (
              <p
                key={idx}
                className={
                  idx === 0 || idx === SORRY_LETTER_PARAGRAPHS.length - 1
                    ? 'font-bold text-[#4A1028]'
                    : ''
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Red Heart-Shaped Wax Seal in Bottom Right Corner */}
          <div className="mt-6 flex justify-end">
            <HeartWaxSeal />
          </div>
        </motion.article>

        {/* Respectful Interactive Question */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12 text-center space-y-6"
        >
          <p className="font-serif italic text-xl sm:text-2xl text-[#4A1028]">
            Can we start with a little smile?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5">
            <button
              type="button"
              onClick={() => onSelectResponse('okay')}
              onMouseEnter={() => setHoveredChoice('okay')}
              onMouseLeave={() => setHoveredChoice(null)}
              className={`w-full sm:w-auto min-w-[205px] px-6 py-3.5 min-h-[48px] rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A1028] ${
                response === 'okay'
                  ? 'bg-[#4A1028] text-[#FFF8EF] border-[#4A1028] shadow-[0_10px_28px_rgba(74,16,40,0.28)]'
                  : 'bg-[#FFFFFF] text-[#4A1028] border-[#4A1028]/25 hover:border-[#4A1028] hover:bg-[#4A1028]/5'
              }`}
            >
              It&apos;s Okay ❤️
            </button>

            <button
              type="button"
              onClick={() => onSelectResponse('time')}
              onMouseEnter={() => setHoveredChoice('time')}
              onMouseLeave={() => setHoveredChoice(null)}
              className={`w-full sm:w-auto min-w-[205px] px-6 py-3.5 min-h-[48px] rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A1028] ${
                response === 'time'
                  ? 'bg-[#8E3557] text-[#FFF8EF] border-[#8E3557] shadow-[0_10px_28px_rgba(142,53,87,0.25)]'
                  : 'bg-[#FFFFFF] text-[#4A1028] border-[#4A1028]/25 hover:border-[#8E3557] hover:bg-[#F4A7B9]/15'
              }`}
            >
              I Need Some Time 🌷
            </button>
          </div>

          <AnimatePresence mode="wait">
            {response && (
              <motion.div
                key={response}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="max-w-lg mx-auto rounded-2xl p-5 bg-[#FFFFFF]/85 border border-[#D9B56D]/45 shadow-sm"
              >
                <p className="font-serif text-base sm:text-lg text-[#4A1028] leading-relaxed">
                  {response === 'time'
                    ? 'Of course, Princess. Take all the time you need. Your happiness and peace matter.'
                    : "Thank you, Vanshika Ji. Let's keep creating beautiful memories. ❤️"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!response && hoveredChoice && (
            <p className="text-xs text-[#7A2444]/80">
              Whichever feels right for you today — both are respected with all my heart.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
