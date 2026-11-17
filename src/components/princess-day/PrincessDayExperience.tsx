import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowLeft, Heart, RotateCcw, Sparkles } from 'lucide-react';
import { PRINCESS_DAY_CONTENT } from '../../data/princessDayData';
import PrincessAmbientLayer, { HeartBurstItem } from './PrincessAmbientLayer';
import PrincessMusicControl from './PrincessMusicControl';
import PrincessEnvelopeIntro from './PrincessEnvelopeIntro';
import {
  PrincessCrownSvg,
  TeddySorrySvg,
  TeddyCareSvg,
} from './PrincessIllustrations';

interface PrincessDayExperienceProps {
  onBackHome: () => void;
}

export default function PrincessDayExperience({ onBackHome }: PrincessDayExperienceProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isOpened, setIsOpened] = useState(false);

  // Typing animation state for Personal Love Message (Unicode/emoji-safe array)
  const messageChars = useMemo(
    () => Array.from(PRINCESS_DAY_CONTENT.personalMessage),
    []
  );
  const [typedCount, setTypedCount] = useState(0);
  const [typingDone, setTypingDone] = useState(false);

  // Interactive section states
  const [forgiven, setForgiven] = useState(false);
  const [smileAnswered, setSmileAnswered] = useState(false);
  const [finaleNoteShown, setFinaleNoteShown] = useState(false);
  const [bursts, setBursts] = useState<HeartBurstItem[]>([]);
  const [replayKey, setReplayKey] = useState(0);

  const mainContentRef = useRef<HTMLDivElement | null>(null);

  // Spawn pastel hearts & floral confetti burst
  const triggerSweetBurst = (symbols = ['💗', '🩷', '🌸', '🎀', '✨', '🌷', '🦋']) => {
    if (shouldReduceMotion) return;
    const base = Date.now();
    const items: HeartBurstItem[] = Array.from({ length: 22 }).map((_, i) => ({
      id: base + i,
      left: Math.random() * 88 + 6,
      symbol: symbols[i % symbols.length],
      delay: Math.random() * 0.45,
      duration: 2.3 + Math.random() * 1.1,
      drift: (Math.random() - 0.5) * 90,
    }));
    setBursts((prev) => [...prev, ...items]);
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((item) => item.id < base));
    }, 4000);
  };

  // Start typing personal message once envelope is opened
  useEffect(() => {
    if (!isOpened) {
      setTypedCount(0);
      setTypingDone(false);
      return;
    }

    if (shouldReduceMotion) {
      setTypedCount(messageChars.length);
      setTypingDone(true);
      return;
    }

    let index = 0;
    const interval = window.setInterval(() => {
      index += 2;
      if (index >= messageChars.length) {
        setTypedCount(messageChars.length);
        setTypingDone(true);
        window.clearInterval(interval);
      } else {
        setTypedCount(index);
      }
    }, 28);

    return () => window.clearInterval(interval);
  }, [isOpened, messageChars, shouldReduceMotion]);

  const handleOpenEnvelope = () => {
    setIsOpened(true);
    triggerSweetBurst(['🎀', '💗', '🌸', '✨', '👑']);
    window.setTimeout(() => {
      mainContentRef.current?.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 180);
  };

  const handleReplay = () => {
    setIsOpened(false);
    setForgiven(false);
    setSmileAnswered(false);
    setFinaleNoteShown(false);
    setTypedCount(0);
    setTypingDone(false);
    setReplayKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  const displayedTypedText = useMemo(
    () => messageChars.slice(0, typedCount).join(''),
    [messageChars, typedCount]
  );

  return (
    <div
      key={replayKey}
      id="princess-day-experience"
      className="relative min-h-screen w-full overflow-x-hidden font-sans text-[#4A1936]"
      style={{
        background:
          'linear-gradient(180deg, #FFF5F8 0%, #FFE6F0 28%, #F5ECFF 62%, #FFF5F8 100%)',
      }}
    >
      {/* Scoped Soft Pastel Keyframe Animations + Reduced-Motion Compliance */}
      <style>{`
        @keyframes princessFloatDrift {
          0% {
            transform: translate3d(0, 0, 0) rotate(-6deg);
            opacity: 0;
          }
          15% {
            opacity: 0.65;
          }
          85% {
            opacity: 0.65;
          }
          100% {
            transform: translate3d(18px, -110vh, 0) rotate(12deg);
            opacity: 0;
          }
        }
        @keyframes princessSoftSparkle {
          0%, 100% {
            transform: scale(0.75);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.9;
          }
        }
        @keyframes princessCrownFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-7px);
          }
        }
        @keyframes princessTeddySway {
          0%, 100% {
            transform: rotate(-2deg) translateY(0px);
          }
          50% {
            transform: rotate(2deg) translateY(-5px);
          }
        }
        @keyframes princessBurstRise {
          0% {
            transform: translate3d(0, 10px, 0) scale(0.5);
            opacity: 0;
          }
          18% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--burst-drift, 0px), -78vh, 0) scale(1.15);
            opacity: 0;
          }
        }
        @keyframes princessPulseHeart {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.12);
          }
        }
        .princess-float-drift {
          animation: princessFloatDrift var(--float-dur, 15s) linear infinite;
          animation-delay: var(--float-delay, 0s);
        }
        .princess-soft-sparkle {
          animation: princessSoftSparkle 3.5s ease-in-out infinite;
          animation-delay: var(--sparkle-delay, 0s);
        }
        .princess-crown-float {
          animation: princessCrownFloat 3.4s ease-in-out infinite;
        }
        .princess-teddy-sway {
          animation: princessTeddySway 3.8s ease-in-out infinite;
        }
        .princess-burst-rise {
          animation: princessBurstRise var(--burst-dur, 2.8s) cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--burst-delay, 0s);
        }
        .princess-pulse-heart {
          animation: princessPulseHeart 1.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .princess-float-drift,
          .princess-soft-sparkle,
          .princess-crown-float,
          .princess-teddy-sway,
          .princess-burst-rise,
          .princess-pulse-heart {
            animation: none !important;
          }
        }
      `}</style>

      {/* Ambient Floating Hearts, Butterflies, Sparkles & Flowers */}
      <PrincessAmbientLayer bursts={bursts} />

      {/* Minimal Glassmorphic Sticky Top Header (Mobile-first <= 56px) */}
      <header className="fixed top-0 inset-x-0 z-40 h-14 px-4 sm:px-6 flex items-center justify-between gap-3 bg-white/65 backdrop-blur-md border-b border-pink-200/60">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#6B2D54] hover:text-pink-600 transition-colors cursor-pointer min-h-[40px] pr-2 whitespace-nowrap shrink-0"
        >
          <ArrowLeft size={16} />
          <span>Mystic Signal</span>
        </button>

        <PrincessMusicControl />
      </header>

      <main className="relative z-10">
        {/* 1. OPENING SCREEN */}
        <PrincessEnvelopeIntro isOpened={isOpened} onOpen={handleOpenEnvelope} />

        {/* MAIN REVEALED PRINCESS WORLD */}
        <AnimatePresence>
          {isOpened && (
            <motion.div
              ref={mainContentRef}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.65 }}
              className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-20 space-y-14 sm:space-y-16"
            >
              {/* 2. PRINCESS WELCOME */}
              <motion.section
                aria-label="Princess Welcome"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-[28px] p-7 sm:p-10 text-center bg-white/65 backdrop-blur-md border border-white/80 shadow-[0_18px_48px_rgba(236,72,153,0.12)] overflow-hidden"
              >
                {/* Floating Corner Flowers */}
                <span className="pointer-events-none absolute top-4 left-5 text-2xl opacity-75 select-none" aria-hidden="true">🌸</span>
                <span className="pointer-events-none absolute top-5 right-5 text-2xl opacity-75 select-none" aria-hidden="true">🌷</span>
                <span className="pointer-events-none absolute bottom-4 left-6 text-xl opacity-70 select-none" aria-hidden="true">🦋</span>
                <span className="pointer-events-none absolute bottom-4 right-6 text-xl opacity-70 select-none" aria-hidden="true">🌸</span>

                <div className="mb-3">
                  <PrincessCrownSvg size="md" />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500 mb-3">
                  {PRINCESS_DAY_CONTENT.occasion} <span aria-hidden="true">·</span> For My Favourite Girl
                </p>

                <h2
                  className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#4A1936] leading-tight"
                  style={{ textWrap: 'balance' } as React.CSSProperties}
                >
                  {PRINCESS_DAY_CONTENT.welcome.line1}
                </h2>
                <p className="font-serif text-2xl sm:text-3xl font-semibold text-pink-600 mt-2">
                  {PRINCESS_DAY_CONTENT.welcome.line2}
                </p>
                <p className="font-serif text-xl sm:text-2xl font-medium text-purple-700 mt-1">
                  {PRINCESS_DAY_CONTENT.welcome.line3}
                </p>
                <p className="mt-5 text-sm sm:text-base text-[#6B2D54] italic font-medium max-w-md mx-auto leading-relaxed">
                  {PRINCESS_DAY_CONTENT.welcome.subtitle}
                </p>
              </motion.section>

              {/* 3. PERSONAL LOVE MESSAGE (Typing Animation) */}
              <motion.section
                aria-label="Personal Love Message"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="rounded-[28px] p-6 sm:p-10 bg-gradient-to-br from-white/80 via-[#FFF5F9]/85 to-[#F6EEFF]/80 backdrop-blur-md border border-pink-200/80 shadow-[0_18px_48px_rgba(192,132,252,0.14)]"
              >
                <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-pink-200/60">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-600">
                    From Ruu&apos;s Heart 💌
                  </span>
                  {!typingDone && (
                    <button
                      type="button"
                      onClick={() => {
                        setTypedCount(messageChars.length);
                        setTypingDone(true);
                      }}
                      className="text-xs font-semibold text-purple-600 hover:text-pink-600 cursor-pointer whitespace-nowrap"
                    >
                      Show full message
                    </button>
                  )}
                </div>

                <div className="whitespace-pre-line font-sans text-[16px] sm:text-[18px] leading-[1.75] text-[#4A1936] font-medium min-h-[180px]">
                  {displayedTypedText}
                  {!typingDone && (
                    <span
                      className="inline-block w-[2px] h-5 bg-pink-500 ml-0.5 align-middle animate-pulse"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </motion.section>

              {/* 4. SPECIAL SORRY SECTION */}
              <motion.section
                aria-label="Special Sorry Section"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="rounded-[28px] p-6 sm:p-10 bg-white/75 backdrop-blur-md border border-pink-200/80 shadow-[0_18px_48px_rgba(236,72,153,0.12)] text-center space-y-6"
              >
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-500">
                    A Genuine Apology
                  </p>
                  <h2
                    className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1936]"
                    style={{ textWrap: 'balance' } as React.CSSProperties}
                  >
                    {PRINCESS_DAY_CONTENT.sorry.heading}
                  </h2>
                </div>

                {/* Cute Animated Teddy Bear Holding Sorry Card */}
                <div className="flex justify-center">
                  <TeddySorrySvg />
                </div>

                <p className="text-[16px] sm:text-[17px] leading-[1.75] text-[#4A1936] font-medium max-w-xl mx-auto">
                  {PRINCESS_DAY_CONTENT.sorry.message}
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgiven(true);
                      triggerSweetBurst(['🥹', '🩷', '💗', '🎀', '🌸']);
                    }}
                    className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[48px] rounded-full text-sm sm:text-base font-semibold transition-all cursor-pointer whitespace-nowrap shadow-md active:scale-95 ${
                      forgiven
                        ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white'
                        : 'bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white hover:shadow-[0_10px_26px_rgba(236,72,153,0.35)] hover:-translate-y-0.5'
                    }`}
                  >
                    <span>{PRINCESS_DAY_CONTENT.sorry.buttonText}</span>
                  </button>
                </div>

                <AnimatePresence>
                  {forgiven && (
                    <motion.div
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="max-w-md mx-auto rounded-2xl p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 text-[#4A1936] font-serif text-lg sm:text-xl font-semibold shadow-xs"
                    >
                      {PRINCESS_DAY_CONTENT.sorry.responseMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>

              {/* 5. TAKE CARE SECTION */}
              <motion.section
                aria-label="Take Care Section"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-[28px] p-6 sm:p-10 bg-gradient-to-br from-[#F6EEFF]/85 via-white/80 to-[#FFE8F1]/85 backdrop-blur-md border border-purple-200/75 shadow-[0_18px_48px_rgba(168,85,247,0.12)] text-center space-y-6 overflow-hidden"
              >
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-600">
                    Health &amp; Comfort First
                  </p>
                  <h2
                    className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1936]"
                    style={{ textWrap: 'balance' } as React.CSSProperties}
                  >
                    {PRINCESS_DAY_CONTENT.takeCare.heading}
                  </h2>
                </div>

                {/* Cute Flowers + Cozy Teddy + Soft Beating Heart */}
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  <span className="text-3xl sm:text-4xl select-none" aria-hidden="true">🌷</span>
                  <TeddyCareSvg />
                  <div className="flex flex-col items-center gap-1" aria-hidden="true">
                    <Heart className="w-8 h-8 text-pink-500 fill-pink-400 princess-pulse-heart" />
                    <span className="text-2xl select-none">🌸</span>
                  </div>
                </div>

                <p className="text-[16px] sm:text-[17px] leading-[1.75] text-[#4A1936] font-medium max-w-xl mx-auto">
                  {PRINCESS_DAY_CONTENT.takeCare.message}
                </p>
              </motion.section>

              {/* 6. INTERACTIVE LOVE QUESTION */}
              <motion.section
                aria-label="Interactive Love Question"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="rounded-[28px] p-6 sm:p-10 bg-white/75 backdrop-blur-md border border-pink-200/80 shadow-[0_18px_48px_rgba(236,72,153,0.12)] text-center space-y-6"
              >
                <h2
                  className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1936] max-w-lg mx-auto leading-snug"
                  style={{ textWrap: 'balance' } as React.CSSProperties}
                >
                  {PRINCESS_DAY_CONTENT.loveQuestion.heading}
                </h2>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSmileAnswered(true);
                      triggerSweetBurst(['🥰', '💗', '🧿', '🌸', '🩷']);
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-[0_10px_24px_rgba(236,72,153,0.32)] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {PRINCESS_DAY_CONTENT.loveQuestion.optionOne}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSmileAnswered(true);
                      triggerSweetBurst(['💗', '✨', '🧿', '🎀', '🦋']);
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-[0_10px_24px_rgba(168,85,247,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {PRINCESS_DAY_CONTENT.loveQuestion.optionTwo}
                  </button>
                </div>

                <AnimatePresence>
                  {smileAnswered && (
                    <motion.div
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="max-w-md mx-auto rounded-2xl p-4 bg-gradient-to-r from-pink-50 via-white to-purple-50 border border-pink-200 text-[#4A1936] font-serif text-lg sm:text-xl font-semibold"
                    >
                      {PRINCESS_DAY_CONTENT.loveQuestion.responseMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>

              {/* 7. FINAL SURPRISE */}
              <motion.section
                aria-label="Final Princess Day Surprise"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
                className="relative rounded-[32px] p-8 sm:p-12 text-center bg-gradient-to-b from-white/85 via-[#FFEBF2]/90 to-[#F3E8FF]/90 backdrop-blur-md border border-pink-200 shadow-[0_24px_60px_rgba(236,72,153,0.18)] space-y-6 overflow-hidden"
              >
                <div className="flex justify-center">
                  <PrincessCrownSvg size="lg" />
                </div>

                <div className="space-y-2.5">
                  <h2
                    className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1936] leading-tight"
                    style={{ textWrap: 'balance' } as React.CSSProperties}
                  >
                    {PRINCESS_DAY_CONTENT.finale.line1}
                  </h2>
                  <p className="font-serif text-xl sm:text-2xl font-semibold text-pink-600">
                    {PRINCESS_DAY_CONTENT.finale.line2}
                  </p>
                  <p className="text-base sm:text-lg font-medium text-[#6B2D54] pt-1 leading-relaxed">
                    {PRINCESS_DAY_CONTENT.finale.line3}
                  </p>
                </div>

                <div className="pt-2 flex flex-col items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFinaleNoteShown(true);
                      triggerSweetBurst(['👑', '💌', '💗', '🌸', '🎀', '🩷', '✨']);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[50px] rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-purple-400 text-white font-semibold text-base tracking-wide shadow-[0_14px_34px_rgba(236,72,153,0.34)] hover:shadow-[0_18px_40px_rgba(236,72,153,0.46)] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles size={16} />
                    <span>{PRINCESS_DAY_CONTENT.finale.buttonText}</span>
                  </button>

                  <AnimatePresence>
                    {finaleNoteShown && (
                      <motion.p
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-handwritten text-2xl sm:text-3xl text-pink-700 max-w-md mx-auto pt-1"
                      >
                        {PRINCESS_DAY_CONTENT.finale.keepsakeNote}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={handleReplay}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B2D54]/80 hover:text-pink-600 transition-colors cursor-pointer min-h-[40px] px-3"
                  >
                    <RotateCcw size={13} />
                    <span>Replay Surprise</span>
                  </button>
                </div>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
