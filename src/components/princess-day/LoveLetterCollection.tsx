import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Heart, Check } from 'lucide-react';
import { LOVE_LETTERS, LoveLetterItem } from '../../data/princessDayData';
import roseSprigImg from '../../assets/images/princess_rose_sprig_1794939596613.jpg';

interface EnvelopeThemeConfig {
  bg: string;
  flap: string;
  border: string;
  text: string;
  subtext: string;
  sealBg: string;
  accentLine: string;
}

const ENVELOPE_THEMES: Record<LoveLetterItem['envelopeStyle'], EnvelopeThemeConfig> = {
  'burgundy-gold': {
    bg: 'linear-gradient(155deg, #5A1432 0%, #3E0C22 100%)',
    flap: '#6D1B3D',
    border: 'rgba(217, 181, 109, 0.55)',
    text: '#FFF8EF',
    subtext: '#D9B56D',
    sealBg: '#A61C3C',
    accentLine: 'border-[#D9B56D]/40',
  },
  'dusty-rose': {
    bg: 'linear-gradient(155deg, #F6CED8 0%, #E7A8B9 100%)',
    flap: '#EEB7C6',
    border: 'rgba(130, 38, 69, 0.28)',
    text: '#4A1028',
    subtext: '#7A2444',
    sealBg: '#B92549',
    accentLine: 'border-[#4A1028]/20',
  },
  'cream-vellum': {
    bg: 'linear-gradient(155deg, #FFF9F0 0%, #F4E6D3 100%)',
    flap: '#F7ECD9',
    border: 'rgba(181, 138, 70, 0.45)',
    text: '#4A1028',
    subtext: '#8D6632',
    sealBg: '#9B1D3B',
    accentLine: 'border-[#B58A46]/30',
  },
  'blush-petal': {
    bg: 'linear-gradient(155deg, #FFF0F3 0%, #FAD4DF 100%)',
    flap: '#FFE4EB',
    border: 'rgba(205, 114, 142, 0.4)',
    text: '#4A1028',
    subtext: '#8D3354',
    sealBg: '#C52950',
    accentLine: 'border-[#CD728E]/30',
  },
  'royal-plum': {
    bg: 'linear-gradient(155deg, #3B0D24 0%, #240716 100%)',
    flap: '#4C132F',
    border: 'rgba(217, 181, 109, 0.65)',
    text: '#FFF8EF',
    subtext: '#F4A7B9',
    sealBg: '#B81D41',
    accentLine: 'border-[#D9B56D]/45',
  },
};

function SealEmblem({ motif }: { motif: LoveLetterItem['sealMotif'] }) {
  switch (motif) {
    case 'heart':
      return <Heart size={15} className="fill-[#FFF8EF] text-[#FFF8EF]" />;
    case 'rose':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#FFF8EF]">
          <path d="M12 3C9.5 3 8 5 8 7.2C8 9.2 9.8 11 12 11C14.2 11 16 9.2 16 7.2C16 5 14.5 3 12 3ZM12 13C8.5 13 6 10.7 6 8C6 12.2 8.7 15.8 11.2 16.7V21H12.8V16.7C15.3 15.8 18 12.2 18 8C18 10.7 15.5 13 12 13Z" />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#FFF8EF]">
          <path d="M12 2L14.3 9.2L21.5 12L14.3 14.8L12 22L9.7 14.8L2.5 12L9.7 9.2L12 2Z" />
        </svg>
      );
    case 'crown':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#FFF8EF]">
          <path d="M3 18H21V20H3V18ZM3 7L7.5 11.5L12 5L16.5 11.5L21 7L19 16H5L3 7Z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-[#FFF8EF] fill-none" strokeWidth="2">
          <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
        </svg>
      );
  }
}

export default function LoveLetterCollection() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [openedIds, setOpenedIds] = useState<number[]>([]);
  const [imageFailed, setImageFailed] = useState(false);

  const activeLetter = selectedIndex !== null ? LOVE_LETTERS[selectedIndex] : null;

  const openLetter = (index: number) => {
    const letter = LOVE_LETTERS[index];
    setSelectedIndex(index);
    setOpenedIds((prev) => (prev.includes(letter.id) ? prev : [...prev, letter.id]));
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    const nextIdx = (selectedIndex + 1) % LOVE_LETTERS.length;
    openLetter(nextIdx);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    const prevIdx = (selectedIndex - 1 + LOVE_LETTERS.length) % LOVE_LETTERS.length;
    openLetter(prevIdx);
  };

  // Distinct entrance/exit animations per letter ID
  const getLetterPaperMotion = (id: number) => {
    if (shouldReduceMotion) {
      return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
    }
    switch (id) {
      case 1:
        return {
          initial: { opacity: 0, y: 70, scale: 0.94 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 40, scale: 0.95 },
        };
      case 2:
        return {
          initial: { opacity: 0, scale: 0.88, rotate: -2 },
          animate: { opacity: 1, scale: 1, rotate: 0 },
          exit: { opacity: 0, scale: 0.92, rotate: 1.5 },
        };
      case 3:
        return {
          initial: { opacity: 0, x: 60, y: 20 },
          animate: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: -50 },
        };
      case 4:
        return {
          initial: { opacity: 0, y: -50, scale: 0.92 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 30, scale: 0.94 },
        };
      default:
        return {
          initial: { opacity: 0, rotateX: 14, y: 50, scale: 0.95 },
          animate: { opacity: 1, rotateX: 0, y: 0, scale: 1 },
          exit: { opacity: 0, y: 30, scale: 0.95 },
        };
    }
  };

  return (
    <section
      id="princess-love-letters"
      aria-label="The Love Letter Collection"
      className="relative py-20 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto"
    >
      {/* Editorial Section Heading */}
      <div className="max-w-2xl mx-auto text-center mb-14 space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-[#D9B56D] font-medium">
          The Love Letter Collection <span aria-hidden="true">·</span> Five Keepsakes
        </p>
        <h2
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#FFF8EF] leading-tight"
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          Five Little Envelopes Written For You
        </h2>
        <p className="text-sm sm:text-base text-[#FFF0F3]/80 leading-relaxed max-w-xl mx-auto">
          Tap any envelope below to break its seal and read the note tucked inside.
        </p>
      </div>

      {/* Five Physically Distinct Interactive Envelopes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {LOVE_LETTERS.map((letter, idx) => {
          const theme = ENVELOPE_THEMES[letter.envelopeStyle];
          const isRead = openedIds.includes(letter.id);
          const isFifth = idx === 4;

          return (
            <motion.button
              key={letter.id}
              type="button"
              onClick={() => openLetter(idx)}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              className={`group relative text-left rounded-2xl p-6 sm:p-7 min-h-[210px] flex flex-col justify-between overflow-hidden shadow-[0_18px_42px_rgba(18,3,9,0.45)] transition-shadow hover:shadow-[0_24px_54px_rgba(217,181,109,0.2)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9B56D] ${
                isFifth ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
              style={{
                background: theme.bg,
                border: `1px solid ${theme.border}`,
              }}
            >
              {/* Top Envelope Flap Seam Decoration */}
              <div
                className="pointer-events-none absolute top-0 left-0 right-0 h-20 opacity-85 transition-transform duration-300 group-hover:-translate-y-1"
                aria-hidden="true"
              >
                <svg viewBox="0 0 400 90" preserveAspectRatio="none" className="w-full h-full">
                  <polygon points="0,0 400,0 200,82" fill={theme.flap} />
                  <polyline
                    points="0,0 200,82 400,0"
                    fill="none"
                    stroke={theme.border}
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              {/* Unique Decorative Envelope Element Per Card */}
              <div className="relative z-10 flex items-start justify-between pt-2">
                <span
                  className="text-xs font-medium tracking-[0.16em] uppercase"
                  style={{ color: theme.subtext }}
                >
                  0{letter.id}
                </span>

                {/* Sculpted Wax Seal Stamp */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-white/25 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: theme.sealBg }}
                  aria-hidden="true"
                >
                  <SealEmblem motif={letter.sealMotif} />
                </div>
              </div>

              {/* Decorative Satin Ribbon Strip on Envelope 2 & 5 */}
              {(letter.id === 2 || letter.id === 5) && (
                <div
                  className="pointer-events-none absolute left-7 top-0 bottom-0 w-[2px] opacity-35"
                  style={{ backgroundColor: theme.subtext }}
                  aria-hidden="true"
                />
              )}

              {/* Letter Title & Footer Metadata */}
              <div className={`relative z-10 pt-8 mt-4 border-t ${theme.accentLine}`}>
                <h3
                  className="font-serif text-xl sm:text-2xl font-semibold leading-snug"
                  style={{ color: theme.text, textWrap: 'balance' } as React.CSSProperties}
                >
                  {letter.title}
                </h3>
                <div className="mt-2.5 flex items-center justify-between gap-2 text-xs">
                  <span style={{ color: theme.subtext }} className="truncate">
                    {letter.subtitle}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 shrink-0 font-medium"
                    style={{ color: theme.subtext }}
                  >
                    {isRead ? (
                      <>
                        <Check size={13} />
                        <span>Opened</span>
                      </>
                    ) : (
                      <span>Open Letter →</span>
                    )}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* LETTER READER MODAL WITH CREAM COTTON PAPER */}
      <AnimatePresence>
        {activeLetter && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="active-letter-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1C040E]/85 backdrop-blur-md overflow-y-auto"
          >
            {/* Backdrop Close Area */}
            <div
              className="fixed inset-0"
              onClick={() => setSelectedIndex(null)}
              aria-hidden="true"
            />

            <motion.article
              key={activeLetter.id}
              {...getLetterPaperMotion(activeLetter.id)}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-2xl my-auto rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] border border-[#D9B56D]/50"
              style={{
                background: 'linear-gradient(180deg, #FFFDF9 0%, #FFF8EF 70%, #F7EAD9 100%)',
                color: '#3B1022',
              }}
            >
              {/* Top Botanical Stationery Accent */}
              <div className="relative h-28 sm:h-32 w-full overflow-hidden border-b border-[#D9B56D]/30">
                {!imageFailed ? (
                  <img
                    src={roseSprigImg}
                    alt="Delicate garden roses resting beside cream stationery"
                    referrerPolicy="no-referrer"
                    onError={() => setImageFailed(true)}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{
                      background:
                        'linear-gradient(135deg, #F9DCE4 0%, #FFF8EF 60%, #F1D9B5 100%)',
                    }}
                  />
                )}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#FFFDF9] via-transparent to-[#2D0716]/30"
                  aria-hidden="true"
                />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  aria-label="Close letter"
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#350A1B]/80 hover:bg-[#4A1028] text-[#FFF8EF] flex items-center justify-center transition-colors cursor-pointer shadow-md focus-visible:outline-2 focus-visible:outline-[#D9B56D]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Paper Body */}
              <div className="px-6 sm:px-10 pt-5 pb-8 space-y-5 max-h-[68vh] overflow-y-auto">
                <div className="space-y-1 border-b border-[#4A1028]/10 pb-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8E3557] font-medium">
                    Letter 0{activeLetter.id} of 0{LOVE_LETTERS.length} <span aria-hidden="true">·</span>{' '}
                    {activeLetter.subtitle}
                  </p>
                  <h3
                    id="active-letter-title"
                    className="font-serif text-2xl sm:text-3xl font-semibold text-[#4A1028]"
                    style={{ textWrap: 'balance' } as React.CSSProperties}
                  >
                    {activeLetter.title}
                  </h3>
                </div>

                <div className="space-y-4 font-handwritten text-[22px] sm:text-[25px] leading-[1.55] text-[#3B1022] whitespace-pre-line">
                  {activeLetter.body.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Letter Navigation Footer */}
              <div className="px-6 sm:px-10 py-4 bg-[#F7EBDC]/75 border-t border-[#D9B56D]/30 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-full border border-[#4A1028]/20 text-[#4A1028] hover:bg-[#4A1028]/5 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  className="hidden sm:inline-flex items-center px-4 py-2.5 min-h-[44px] text-xs font-medium text-[#7A2444] hover:text-[#4A1028] cursor-pointer whitespace-nowrap"
                >
                  Close Letter
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-full bg-[#4A1028] hover:bg-[#611635] text-[#FFF8EF] text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                >
                  <span>Next Letter</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.article>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
