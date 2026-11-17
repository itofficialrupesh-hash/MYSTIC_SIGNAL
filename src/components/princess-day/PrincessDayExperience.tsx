import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import PrincessAmbientLayer from './PrincessAmbientLayer';
import PrincessMusicControl from './PrincessMusicControl';
import MagicalEnvelopeHero from './MagicalEnvelopeHero';
import LoveLetterCollection from './LoveLetterCollection';
import SpecialRoseGarden from './SpecialRoseGarden';
import SpecialSorrySection from './SpecialSorrySection';
import LittleCareSection from './LittleCareSection';
import FinalGrandSurprise from './FinalGrandSurprise';

interface PrincessDayExperienceProps {
  onBackHome: () => void;
}

export default function PrincessDayExperience({ onBackHome }: PrincessDayExperienceProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [rosesRevealed, setRosesRevealed] = useState(false);
  const [sorryResponse, setSorryResponse] = useState<'okay' | 'time' | null>(null);
  const [replayKey, setReplayKey] = useState(0);
  const storyContainerRef = useRef<HTMLDivElement | null>(null);

  const handleOpenSurprise = () => {
    setIsEnvelopeOpened(true);
    window.setTimeout(() => {
      storyContainerRef.current?.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 180);
  };

  const handleReplay = () => {
    setIsEnvelopeOpened(false);
    setRosesRevealed(false);
    setSorryResponse(null);
    setReplayKey((prev) => prev + 1);
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <div
      key={replayKey}
      id="princess-day-experience"
      className="relative min-h-screen w-full overflow-x-hidden bg-[#240612] text-[#FFF8EF] font-sans"
    >
      {/* Scoped Fairytale Keyframe Animations with Reduced-Motion Support */}
      <style>{`
        @keyframes princessPetalFall {
          0% {
            transform: translate3d(0, -10%, 0) rotate(0deg);
            opacity: 0;
          }
          12% {
            opacity: 0.72;
          }
          85% {
            opacity: 0.65;
          }
          100% {
            transform: translate3d(var(--petal-sway, 24px), 108vh, 0) rotate(260deg);
            opacity: 0;
          }
        }
        @keyframes princessTwinkle {
          0%, 100% {
            opacity: 0.25;
            transform: scale(0.85);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.2);
          }
        }
        @keyframes princessHeartGlow {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 8px rgba(244, 167, 185, 0.5));
          }
          50% {
            transform: scale(1.08);
            filter: drop-shadow(0 0 18px rgba(244, 167, 185, 0.85));
          }
        }
        .princess-petal-fall {
          animation: princessPetalFall var(--petal-dur, 15s) linear infinite;
          animation-delay: var(--petal-delay, 0s);
        }
        .princess-twinkle {
          animation: princessTwinkle var(--twinkle-dur, 4s) ease-in-out infinite;
          animation-delay: var(--twinkle-delay, 0s);
        }
        .princess-heart-glow {
          animation: princessHeartGlow 2.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .princess-petal-fall,
          .princess-twinkle,
          .princess-heart-glow {
            animation: none !important;
          }
        }
      `}</style>

      {/* Ambient Falling Petals & Soft Starlight */}
      <PrincessAmbientLayer density={rosesRevealed ? 'celebration' : 'gentle'} />

      {/* Minimal Top Navigation Bar (Respecting 15% mobile sticky height cap) */}
      <header className="fixed top-0 inset-x-0 z-40 px-4 sm:px-8 h-14 flex items-center justify-between gap-4 bg-[#240612]/75 backdrop-blur-md border-b border-[#D9B56D]/20">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#FFF8EF]/90 hover:text-[#D9B56D] transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[40px] pr-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9B56D]"
        >
          <ArrowLeft size={16} />
          <span>Mystic Signal</span>
        </button>

        <div className="flex items-center gap-3 shrink-0">
          <PrincessMusicControl />
        </div>
      </header>

      {/* Scene 1: Full-Screen Cinematic Envelope Opening */}
      <main>
        <MagicalEnvelopeHero
          isOpened={isEnvelopeOpened}
          onOpenSurprise={handleOpenSurprise}
        />

        {/* Scene 2+: Smoothly Revealed Interactive Experience */}
        <AnimatePresence>
          {isEnvelopeOpened && (
            <motion.div
              ref={storyContainerRef}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              {/* Section 4: The Love Letter Collection (5 Envelopes) */}
              <div
                style={{
                  background:
                    'linear-gradient(180deg, #240612 0%, #3A0A1E 50%, #2B0716 100%)',
                }}
              >
                <LoveLetterCollection />
              </div>

              {/* Section 5: Special Rose Garden */}
              <SpecialRoseGarden
                rosesRevealed={rosesRevealed}
                onRevealRoses={() => setRosesRevealed(true)}
              />

              {/* Section 6: Special Sorry Section */}
              <SpecialSorrySection
                response={sorryResponse}
                onSelectResponse={(choice) => setSorryResponse(choice)}
              />

              {/* Section 7: Little Care Section */}
              <LittleCareSection />

              {/* Section 8: Final Grand Surprise */}
              <FinalGrandSurprise onReplay={handleReplay} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
