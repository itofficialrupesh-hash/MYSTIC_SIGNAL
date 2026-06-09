import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Sparkles, Mail, Gift, Smile, Star, Lock, Unlock, 
  ChevronRight, RefreshCw, Eye, ThumbsUp, PartyPopper, Flame 
} from 'lucide-react';
import { motion } from 'motion/react';
import sorryBoyPhoto from '../assets/images/regenerated_image_1780655372225.jpg';
import vanshikaHappyPhoto from '../assets/images/regenerated_image_1780939152437.jpg';

interface BestieZoneProps {
  onTriggerConfetti: () => void;
}

export default function BestieZone({ onTriggerConfetti }: BestieZoneProps) {
  // Navigation level state
  // 'entry' | 'level1' | 'level2' | 'level3' | 'level4' | 'secret' | 'gift' | 'finale'
  const [level, setLevel] = useState<'entry' | 'level1' | 'level2' | 'level3' | 'level4' | 'secret' | 'gift' | 'finale'>('entry');
  
  // Custom interactive animations states
  const [entryPhase, setEntryPhase] = useState(0); // 0: typing line 1, 1: typing line 2, 2: typing line 3, 3: completed typing
  const [typedLine, setTypedLine] = useState('');
  const [doorUnlocked, setDoorUnlocked] = useState(false);
  const [isOpeningDoor, setIsOpeningDoor] = useState(false);
  const [screenBrightness, setScreenBrightness] = useState(false);

  // Level 1: Envelopes
  const [openedEnvelopes, setOpenedEnvelopes] = useState<number[]>([]);
  
  // Level 2: Flowers Garden
  const [bloomedFlowers, setBloomedFlowers] = useState<number[]>([]);

  // Level 3: Comfort Box
  const [comfortOpen, setComfortOpen] = useState(false);
  const [comfortIndex, setComfortIndex] = useState(0);

  // Level 4: Constellation of Reasons
  const [unlockedStars, setUnlockedStars] = useState<number[]>([]);
  const [constellationFinished, setConstellationFinished] = useState(false);

  // Secret Level
  const [secretStep, setSecretStep] = useState(0); // 0: favorite thing prompt, 1: smile?, 2: laugh?, 3: eyes?, 4: personality?, 5: you are you!
  const [massiveExplosion, setMassiveExplosion] = useState(false);

  // Final Gift Box
  const [giftRibbonOpen, setGiftRibbonOpen] = useState(false);
  const [giftLetterOpen, setGiftLetterOpen] = useState(false);

  // Final Interaction
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [finaleTriggered, setFinaleTriggered] = useState(false);

  // Self-managing background effects
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);
  const [fireflies, setFireflies] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter lines for Entry Journey
  const entryLines = [
    "There are billions of people in this world...",
    "But only one became my favorite.",
    "And this little journey is for her."
  ];

  // Initialize background particles and fireflies
  useEffect(() => {
    // Generate star field particles
    const initParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 6
    }));
    setParticles(initParticles);

    // Generate dreamy fireflies
    const initFireflies = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5
    }));
    setFireflies(initFireflies);
  }, []);

  // Handle Entry experience typewriter sequence
  useEffect(() => {
    if (level !== 'entry') return;
    
    let currentLine = entryLines[entryPhase];
    if (!currentLine) {
      setEntryPhase(3); // All lines done!
      return;
    }

    let charIndex = 0;
    setTypedLine('');
    
    const interval = setInterval(() => {
      setTypedLine((prev) => prev + currentLine.charAt(charIndex));
      charIndex++;
      
      if (charIndex >= currentLine.length) {
        clearInterval(interval);
        // Pause at completion of a line, then move to next
        setTimeout(() => {
          setEntryPhase((prev) => prev + 1);
        }, 1800);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [entryPhase, level]);

  // Sparkle burst helper when clicking on items
  const handleSparkleClick = (x: number, y: number) => {
    // Sparkle sensory notification
    onTriggerConfetti();
  };

  // Level 1 Envelopes click
  const openEnvelope = (index: number) => {
    if (openedEnvelopes.includes(index)) return;
    setOpenedEnvelopes((prev) => [...prev, index]);
    onTriggerConfetti();
  };

  // Level 2 Bloom Flowers
  const bloomFlower = (index: number) => {
    if (bloomedFlowers.includes(index)) return;
    setBloomedFlowers((prev) => [...prev, index]);
    onTriggerConfetti();
  };

  // Level 4 Unlock Stars
  const unlockStar = (index: number) => {
    if (unlockedStars.includes(index)) return;
    setUnlockedStars((prev) => [...prev, index]);
    onTriggerConfetti();
  };

  // Check if Level 4 finished
  useEffect(() => {
    if (unlockedStars.length === 7 && !constellationFinished) {
      setConstellationFinished(true);
      setTimeout(() => {
        setLevel('secret');
        onTriggerConfetti();
      }, 1500);
    }
  }, [unlockedStars]);

  // Handle final button hold
  const startHolding = () => {
    if (finaleTriggered) return;
    setIsHolding(true);
    setHoldProgress(0);

    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current!);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    holdTimerRef.current = setTimeout(() => {
      setFinaleTriggered(true);
      setIsHolding(false);
      onTriggerConfetti();
      // Double shake confetti explosion for maximum aesthetic pleasure
      setTimeout(onTriggerConfetti, 1000);
      setTimeout(onTriggerConfetti, 2200);
    }, 2500);
  };

  const stopHolding = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
  };

  // Handle Entry Doors Unlock Click
  const handleUnlockMyHeart = () => {
    setIsOpeningDoor(true);
    setDoorUnlocked(true);
    setTimeout(() => {
      setScreenBrightness(true);
    }, 600);
    setTimeout(() => {
      setLevel('level1');
      setScreenBrightness(false);
      onTriggerConfetti();
    }, 1500);
  };

  const levelOneFinished = openedEnvelopes.length === 3;
  const levelTwoFinished = bloomedFlowers.length === 7;
  const levelThreeFinished = comfortIndex >= 4;

  const enveLetters = [
    "I don't say it enough, but you make difficult days easier. You know exactly how to turn my stress into absolute peace in seconds.",
    "You became home without ever being a place. Ever since we became best friends, your presence is where I find my safety.",
    "My favorite part of most days is talking to you. Sharing jokes, gossips, and dreams makes life infinitely sweeter."
  ];

  const flowerTexts = [
    "The beginning of my favorite friendship. A peaceful day where our planets aligned and everything changed.",
    "When our conversations became part of my day. Going from formal 'hi' to unsuspending late night voice calls.",
    "When our inside jokes became a language. Giggling about things nobody else on earth would ever understand.",
    "When life felt lighter because of you. Even heavy exams and dark problems felt manageable with you around.",
    "When I realized how much I cared. Praying for your health, happiness, and ultimate peace every single day.",
    "When friendship became something deeper. Deeper than words, an unbreakable soul connection of true trust.",
    "When I knew I never wanted to lose you. No matter what changes, we walk this path side by side, besties forever!"
  ];

  const comfortCards = [
    { title: "🍫 Chocolate Treatment", text: "If I could, I'd bring you your favorite chocolate right now to melt all your stress away! Sweetness only for Vanshika." },
    { title: "☕ Cozy Mug Support", text: "Take a virtual warm sip and remember to be gentle with yourself. You are doing so incredibly well!" },
    { title: "🧸 Assigned Teddy Guard", text: "This magical virtual teddy bear has been officially assigned by Ruu to protect your beautiful smile, 24/7." },
    { title: "🤗 Quantum Hug Sender", text: "Imagine the biggest, warmest, and most comforting hug possible. That is exactly the one I am sending across." },
    { title: "📜 Personal Soft Letter", text: "You don't have to be strong every single second. Rest is allowed. Breathe in, breathe out, everything will be perfect." }
  ];

  const reasonStars = [
    "Your endless kindness and the golden heart you show to everyone. ✨",
    "Your beautiful bright smile that can instantly illuminate the darkest room. 🌸",
    "Your absolute strength and resilience in the face of any challenge. 💪🏻",
    "Your sweet, caring heart that makes sure everybody is pampered and safe. 💝",
    "Your loyalty, standing by me as a true rock through every turn of life. 🤝",
    "Your capability to turn ordinary mundane days into legendary memories. 🎭",
    "The beautiful way you are simply, authentically, and perfectly you. 👑"
  ];

  return (
    <div 
      id="sansut-bestfriend-zone" 
      className="relative w-full rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[#03031a] via-[#080326] to-[#12042f] text-zinc-100 overflow-hidden shadow-[0_0_50px_rgba(255,79,163,0.15)] border border-purple-500/10 min-h-[600px] flex flex-col justify-between"
    >
      {/* CUSTOM KEYFRAMES / CSS HOOK STYLE BLOCK */}
      <style>{`
        @keyframes subtleTwinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); filter: drop-shadow(0 0 6px #ff4fa3); }
        }
        @keyframes magicalFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes fireflyDrift {
          0%, 100% { transform: translate(0, 0) opacity(0.3); }
          50% { transform: translate(20px, -30px) opacity(0.9); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 79, 163, 0.3); }
          50% { box-shadow: 0 0 25px rgba(255, 79, 163, 0.7); border-color: rgba(255, 70, 160, 0.82); }
        }
        @keyframes cinematicDoorOpen {
          0% { transform: rotateY(0deg); opacity: 1; filter: brightness(1); }
          100% { transform: rotateY(-110deg); opacity: 0; filter: brightness(3); }
        }
        @keyframes starGlowWave {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px #ff4fa3); }
          50% { transform: scale(1.18); filter: drop-shadow(0 0 15px #a855f7); }
        }
        @keyframes heartPulseBeat {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255,79,163,0.5)); }
          50% { transform: scale(1.15); filter: drop-shadow(0 0 30px rgba(255,79,163,1)); }
        }
        .magical-float {
          animation: magicalFloat 6s ease-in-out infinite;
        }
        .twinkle-star {
          animation: subtleTwinkle 4s ease-in-out infinite;
        }
        .firefly-particle {
          animation: fireflyDrift 7s ease-in-out infinite;
        }
        .pulse-border-glow {
          animation: pulseGlow 3s ease-in-out infinite;
        }
        .cinematic-left-door {
          transform-origin: left center;
          animation: cinematicDoorOpen 1.8s cubic-bezier(0.7, 0, 0.3, 1) forwards;
        }
        .heart-beat-effect {
          animation: heartPulseBeat 1.2s infinite;
        }
        .sparkle-cursor-glow {
          background: radial-gradient(circle, rgba(255,79,163,0.15) 0%, transparent 70%);
        }
      `}</style>

      {/* Floating Sparkles, Fireflies and Star System Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {particles.map((p) => (
          <div
            key={`star-${p.id}`}
            className="absolute bg-white/45 rounded-full twinkle-star"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.id * 0.1}s`,
            }}
          />
        ))}

        {fireflies.map((f) => (
          <div
            key={`firefly-${f.id}`}
            className="absolute bg-amber-400/40 rounded-full firefly-particle"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              filter: `blur(1px) drop-shadow(0 0 6px rgba(251,191,36,0.8))`,
              animationDelay: `${f.delay}s`,
            }}
          />
        ))}

        {/* Floating Heart vector assets */}
        <div className="absolute top-[20%] left-[8%] text-pink-500/10 text-4xl animate-bounce" style={{ animationDuration: '4s' }}>❤️</div>
        <div className="absolute bottom-[20%] right-[6%] text-purple-500/10 text-5xl animate-bounce" style={{ animationDuration: '6s' }}>🌸</div>
        <div className="absolute top-[60%] right-[12%] text-pink-500/10 text-3xl animate-pulse">✨</div>
      </div>

      {/* FLASH BRIGHTNESS TRANSITION EFFECT */}
      {screenBrightness && (
        <div className="fixed inset-0 bg-white/95 z-200 pointer-events-none animate-fade-out" style={{ animationDuration: '1s' }} />
      )}

      {/* --- LEVEL 0: HEADING & SUBTITLE --- */}
      <div className="relative z-10 w-full text-center pb-4 select-none">
        <h2 className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,79,163,0.35)] uppercase flex items-center justify-center gap-2">
          <span>Journey Through My Heart ❤️</span>
        </h2>
        <p className="text-xs md:text-sm text-pink-200/70 font-serif italic mt-2.5 max-w-xl mx-auto leading-relaxed px-4">
          "A little adventure made for the girl who became my best friend, my comfort place, and my favorite person for the last seven beautiful years."
        </p>
        
        {/* Active level line progress tracker indicator */}
        {level !== 'entry' && (
          <div className="flex justify-center items-center gap-1.5 mt-4 select-none">
            {['level1', 'level2', 'level3', 'level4', 'secret', 'gift', 'finale'].map((lvl, index) => {
              const stages = ['level1', 'level2', 'level3', 'level4', 'secret', 'gift', 'finale'];
              const currentLvlIndex = stages.indexOf(level);
              const isActive = lvl === level;
              const isPassed = index < currentLvlIndex;
              return (
                <div key={lvl}>
                  <button 
                    onClick={() => {
                      if (isPassed || lvl === 'level1') {
                        setLevel(lvl as any);
                      }
                    }}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'w-7 bg-pink-500 shadow-[0_0_8px_#ff4fa3]' 
                        : isPassed 
                        ? 'w-2.5 bg-pink-500/80 hover:bg-pink-500' 
                        : 'w-2.5 bg-white/10'
                    }`}
                    title={`Stage ${index + 1}`}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- SCENE CHANGING SECTION VIEWPORTS --- */}
      <div id="bestfriend-level-container" className="relative z-10 w-full flex-1 flex flex-col items-center justify-center py-6 min-h-[400px]">

        {/* ================= ENTRY EXPERIENCE ================= */}
        {level === 'entry' && (
          <div id="entry-adventure" className="w-full text-center space-y-8 animate-fade-in py-6">
            <div className="min-h-[50px] flex items-center justify-center">
              <p className="text-base md:text-lg font-serif font-semibold text-pink-100 tracking-wide leading-relaxed drop-shadow-[0_0_8px_rgba(255,79,163,0.4)]">
                {typedLine}
                <span className="animate-pulse font-bold text-pink-500">|</span>
              </p>
            </div>

            {/* HEART DOOR DISPLAY */}
            {entryPhase === 3 && (
              <div className="mt-8 space-y-8 animate-slide-up flex flex-col items-center">
                <div 
                  className={`w-40 h-40 relative cursor-pointer group rounded-full border-4 border-dashed border-pink-400/40 p-4 ${
                    isOpeningDoor ? 'scale-110 rotate-12' : 'hover:scale-[1.05]'
                  } transition-all duration-[800ms] flex items-center justify-center`}
                  onClick={handleUnlockMyHeart}
                >
                  {/* Glowing background circles */}
                  <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-xl animate-pulse group-hover:bg-pink-500/35 transition-all duration-500" />
                  
                  {/* Giant Glowing Heart vectors */}
                  <Heart 
                    className={`w-24 h-24 ${isOpeningDoor ? 'text-pink-300 animate-ping' : 'text-[#ff4fa3] heart-beat-effect'}`}
                    fill="currentColor"
                  />
                  
                  <span className="absolute text-[10px] font-mono tracking-widest text-pink-100 uppercase bg-black/80 px-2 py-1 rounded-full border border-pink-500/30 font-bold bottom-1 shadow-lg">
                    {isOpeningDoor ? "OPENING..." : "ENTER HEART"}
                  </span>
                </div>

                <div className="space-y-3.5 max-w-sm mx-auto">
                  <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-mono select-none">
                    Vanshika Ji, Tap the heart above to unlock 🔓✨
                  </p>
                  
                  <button
                    onClick={handleUnlockMyHeart}
                    className="px-6 py-2 bg-gradient-to-r from-[#ff4fa3] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(255,79,163,0.5)] transform active:scale-95 hover:scale-105 cursor-pointer flex items-center gap-2 mx-auto justify-center transition-all duration-300"
                  >
                    <Unlock size={12} />
                    <span>Unlock My Heart ❤️</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= LEVEL 1: THINGS I NEVER SAY ENOUGH ================= */}
        {level === 'level1' && (
          <div id="bestie-level-1" className="w-full max-w-3xl text-center space-y-6 animate-fade-in">
            <div className="space-y-1 select-none">
              <span className="text-[10px] font-sans bg-pink-500/20 text-pink-300 border border-pink-500/40 px-3 py-1 rounded-full font-black uppercase tracking-widest leading-relaxed">
                Level 1 — Things I Never Say Enough 🕊️💗
              </span>
              <h3 className="font-serif text-lg md:text-xl font-bold text-pink-50 bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
                Open my secret letters to you
              </h3>
              <p className="text-[11px] text-zinc-400">
                Click each glowing pink envelope below to view a heartfelt secret confession.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {[0, 1, 2].map((idx) => {
                const isOpened = openedEnvelopes.includes(idx);
                return (
                  <div 
                    key={idx}
                    onClick={() => openEnvelope(idx)}
                    className={`relative p-5 rounded-2xl cursor-pointer select-none transition-all duration-300 transform ${
                      isOpened 
                        ? 'bg-[#180a2b]/90 border-2 border-[#ff4fa3]/80 shadow-[0_0_20px_rgba(255,79,163,0.3)] scale-[1.03]' 
                        : 'bg-[#090518]/70 hover:bg-[#110826]/90 border border-purple-500/20 hover:border-pink-500/30 scale-100 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    }`}
                  >
                    {!isOpened ? (
                      <div className="py-8 flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                          <Mail size={22} className="animate-bounce" />
                        </div>
                        <p className="text-xs font-black tracking-wider text-pink-300 uppercase">
                          Envelope 0{idx + 1}
                        </p>
                        <span className="text-[9px] text-zinc-500 font-mono">TAP TO UNFOLD 📬</span>
                      </div>
                    ) : (
                      <div className="space-y-3 text-left animate-fade-in relative min-h-[140px] flex flex-col justify-between">
                        <div className="absolute top-0 right-0">
                          <Sparkles size={14} className="text-pink-400 animate-pulse" />
                        </div>
                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest font-mono">
                          LETTER 0{idx + 1} 💘
                        </span>
                        <p className="text-xs text-zinc-200 font-serif leading-relaxed italic border-l-2 border-pink-500/50 pl-2">
                          "{enveLetters[idx]}"
                        </p>
                        <span className="bg-pink-500/10 border border-pink-500/30 rounded-lg px-2 py-0.5 text-[8px] font-black text-pink-200 uppercase tracking-widest self-start mt-2">
                          Opened ✨
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {levelOneFinished && (
              <div className="pt-6 animate-slide-up flex flex-col items-center">
                <button
                  onClick={() => {
                    setLevel('level2');
                    onTriggerConfetti();
                  }}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff4fa3] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 group cursor-pointer transition-transform duration-300 active:scale-95 animate-pulse"
                >
                  <span>Go to Level 2: Memory Garden 🌸</span>
                  <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= LEVEL 2: GARDEN OF MEMORIES ================= */}
        {level === 'level2' && (
          <div id="bestie-level-2" className="w-full max-w-4xl text-center space-y-6 animate-fade-in">
            <div className="space-y-1 select-none">
              <span className="text-[10px] font-sans bg-purple-500/20 text-purple-300 border border-purple-500/40 px-3 py-1 rounded-full font-black uppercase tracking-widest leading-relaxed">
                Level 2 — Garden of Memories 🌸🌌
              </span>
              <h3 className="font-serif text-lg md:text-xl font-bold bg-gradient-to-r from-pink-200 via-purple-100 to-pink-300 bg-clip-text text-transparent">
                Garden of Neon Friendship Petals
              </h3>
              <p className="text-[11px] text-zinc-400">
                Click on each of the 7 magical glowing flowers to make them bloom and reveal our journey milestones.
              </p>
            </div>

            {/* Glowing 7 flowers layout */}
            <div className="flex flex-wrap justify-center gap-4 py-6">
              {flowerTexts.map((text, idx) => {
                const isBloomed = bloomedFlowers.includes(idx);
                return (
                  <div 
                    key={idx}
                    onClick={() => bloomFlower(idx)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 text-center select-none max-w-xs relative flex flex-col items-center gap-2.5 ${
                      isBloomed 
                        ? 'bg-[#1a0833] border border-[#ff4fa3]/60 shadow-[0_0_15px_rgba(255,79,163,0.25)] scale-[1.02]' 
                        : 'bg-black/30 hover:bg-black/45 border border-purple-500/10 hover:border-pink-500/20 hover:scale-105'
                    }`}
                  >
                    {!isBloomed ? (
                      <div className="py-2.5 px-1.5 flex flex-col items-center gap-1.5">
                        <span className="text-3xl animate-pulse select-none">🌸</span>
                        <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest font-mono">
                          Bloom Flower 0{idx + 1}
                        </p>
                      </div>
                    ) : (
                      <div className="animate-fade-in flex flex-col items-center gap-1.5 min-h-[90px] justify-center">
                        <span className="text-3xl select-none animate-spin-slow">🌺</span>
                        <span className="text-[8px] font-black tracking-widest font-mono text-purple-400 uppercase">
                          BLOOMED 0{idx + 1} ⭐
                        </span>
                        <p className="text-xs text-zinc-200 leading-normal font-serif italic max-w-[200px]">
                          "{text}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {levelTwoFinished && (
              <div className="pt-2 animate-slide-up flex flex-col items-center">
                <button
                  onClick={() => {
                    setLevel('level3');
                    onTriggerConfetti();
                  }}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-[#ff4fa3] hover:from-purple-700 hover:to-pink-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 group cursor-pointer transition-transform duration-300 active:scale-95 animate-pulse"
                >
                  <span>Go to Level 3: Comfort Box 🧸</span>
                  <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= LEVEL 3: COMFORT BOX ================= */}
        {level === 'level3' && (
          <div id="bestie-level-3" className="w-full max-w-xl text-center space-y-6 animate-fade-in">
            <div className="space-y-1 select-none">
              <span className="text-[10px] font-sans bg-pink-500/20 text-pink-300 border border-pink-500/40 px-3 py-1 rounded-full font-black uppercase tracking-widest leading-relaxed">
                Level 3 — Comfort Box 🧸🎁
              </span>
              <h3 className="font-serif text-lg md:text-xl font-bold text-pink-100 italic bg-gradient-to-r from-rose-200 to-amber-200 bg-clip-text text-transparent">
                Open on Difficult Days
              </h3>
              <p className="text-[11px] text-zinc-400">
                A warm digital sanctuary created to bring instant comfort to Vanshika when life gets tough.
              </p>
            </div>

            {!comfortOpen ? (
              <div className="py-12 flex flex-col items-center space-y-6">
                {/* Cute Teddy Bear Vector Representation */}
                <div className="relative select-none animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-xl animate-pulse" />
                  <div className="w-24 h-24 bg-gradient-to-b from-amber-800 to-amber-950 border-2 border-pink-400/50 rounded-full relative flex items-center justify-center p-3">
                    {/* Teddy ears */}
                    <div className="absolute -top-1 -left-1 w-7 h-7 bg-amber-800 rounded-full border border-pink-400/40" />
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-amber-800 rounded-full border border-pink-400/40" />
                    {/* Cute face layout */}
                    <div className="w-full h-full rounded-full bg-[#523d24] flex flex-col justify-center items-center pb-1">
                      <div className="flex gap-4">
                        <div className="w-2.5 h-2.5 bg-black rounded-full border border-white" />
                        <div className="w-2.5 h-2.5 bg-black rounded-full border border-white" />
                      </div>
                      <div className="w-6 h-4 bg-amber-100 rounded-full mt-1.5 flex flex-col items-center justify-center relative">
                        <div className="w-2.5 h-2 bg-black rounded-full" />
                        <div className="w-0.5 h-1.5 bg-black mt-0.5" />
                      </div>
                    </div>
                  </div>
                  {/* Small absolute holding heart */}
                  <span className="absolute bottom-0 right-0 text-xl animate-pulse">💖</span>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-pink-200 italic font-serif">
                    "This virtual teddy and box of warmth is always standing guard for you."
                  </p>
                  
                  <button
                    onClick={() => {
                      setComfortOpen(true);
                      onTriggerConfetti();
                    }}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff4fa3] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs uppercase tracking-widest cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,79,163,0.4)]"
                  >
                    Open On Difficult Days 🧸🎁
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#09051c] border-2 border-[#ff4fa3]/50 shadow-[0_0_25px_rgba(255,79,163,0.3)] animate-scale-up space-y-4 text-center">
                <div className="flex justify-between items-center select-none">
                  <span className="text-[9px] font-black font-mono tracking-widest text-[#ff4fa3] uppercase">
                    COMFORT CARD {comfortIndex + 1} / 5
                  </span>
                  <span className="text-base">🧸🧁🌸</span>
                </div>

                {/* Animated changing Comfort Card item */}
                <div className="p-6 rounded-xl bg-purple-950/40 border border-pink-500/10 min-h-[130px] flex flex-col justify-center gap-2">
                  <h4 className="text-sm font-black text-pink-300 drop-shadow-[0_0_6px_rgba(255,100,160,0.5)]">
                    {comfortCards[comfortIndex].title}
                  </h4>
                  <p className="text-xs text-zinc-300 font-serif italic max-w-sm mx-auto leading-relaxed">
                    "{comfortCards[comfortIndex].text}"
                  </p>
                </div>

                {/* Next / Prev controllers */}
                <div className="flex justify-between gap-3 pt-2">
                  <button
                    disabled={comfortIndex === 0}
                    onClick={() => setComfortIndex((prev) => Math.max(0, prev - 1))}
                    className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-[10px] font-bold text-zinc-400 cursor-pointer transition-all"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      if (comfortIndex < 4) {
                        setComfortIndex((prev) => prev + 1);
                        onTriggerConfetti();
                      } else {
                        setLevel('level4');
                        onTriggerConfetti();
                      }
                    }}
                    className="px-5 py-1.5 rounded-lg bg-[#ff4fa3] hover:bg-pink-600 text-[10px] font-extrabold uppercase tracking-wide text-white cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <span>{comfortIndex < 4 ? "Next Warmth 🧸" : "Go to Level 4 🌟"}</span>
                    <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= LEVEL 4: CONSTELLATION OF REASONS ================= */}
        {level === 'level4' && (
          <div id="bestie-level-4" className="w-full max-w-2xl text-center space-y-6 animate-fade-in relative">
            <div className="space-y-1 select-none">
              <span className="text-[10px] font-sans bg-purple-500/20 text-purple-300 border border-purple-500/40 px-3 py-1 rounded-full font-black uppercase tracking-widest leading-relaxed">
                Level 4 — Constellation of Reasons ✨🌌
              </span>
              <h3 className="font-serif text-lg md:text-xl font-bold bg-gradient-to-r from-pink-200 via-purple-100 to-amber-200 bg-clip-text text-transparent">
                My 7 Star Constellation of Gratitude
              </h3>
              <p className="text-[11px] text-zinc-400">
                The sky turns crystal dark. Click each of the 7 sparkling stars below to reveal my favourite qualities about you.
              </p>
            </div>

            {/* Galaxy Star Map Canvas UI */}
            <div className="p-6 md:p-8 rounded-3xl bg-[#030112] border border-purple-500/10 shadow-[inner_0_0_20px_rgba(0,0,0,0.8)] relative min-h-[300px] flex flex-col justify-center items-center overflow-hidden">
              {/* Magical glowing background nebula links */}
              <div className="absolute inset-0 bg-radial-gradient from-purple-900/10 via-transparent to-transparent pointer-events-none" />

              <div className="flex flex-wrap justify-center gap-3.5 max-w-xl relative z-10">
                {reasonStars.map((text, idx) => {
                  const isUnlocked = unlockedStars.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => unlockStar(idx)}
                      className={`px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-300 flex items-center gap-2 select-none uppercase tracking-wider font-mono text-[9px] ${
                        isUnlocked 
                          ? 'bg-gradient-to-r from-purple-950/80 to-[#1a082b]/80 border-2 border-pink-400 shadow-[0_0_12px_#ff4fa3] text-pink-200 font-extrabold scale-102' 
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:scale-105 hover:text-white'
                      }`}
                    >
                      <Star 
                        size={11} 
                        className={isUnlocked ? 'text-pink-400 animate-spin-slow' : 'text-zinc-500'} 
                        fill={isUnlocked ? "#ff4fa3" : "none"}
                      />
                      <span>{isUnlocked ? `Star 0${idx + 1} Unlocked!` : `Unlock Star 0${idx + 1}`}</span>
                    </button>
                  );
                })}
              </div>

              {/* Reveal text for the unlocked stars */}
              <div className="mt-6 w-full max-w-md min-h-[70px] bg-slate-950/65 border border-pink-500/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                {unlockedStars.length === 0 ? (
                  <p className="text-[10px] uppercase font-mono tracking-widest text-[#ff4fa3]/50 animate-pulse select-none">
                    ⭐ Click any star to map our constellations ⭐
                  </p>
                ) : (
                  <div className="animate-fade-in space-y-1">
                    <span className="text-[8px] font-black tracking-widest text-purple-400 uppercase font-mono">
                      STAR CONFESSION:
                    </span>
                    <p className="text-xs md:text-sm text-pink-100 font-serif leading-relaxed italic">
                      "{reasonStars[unlockedStars[unlockedStars.length - 1]]}"
                    </p>
                  </div>
                )}
              </div>

              {/* Progress counter */}
              <div className="mt-4 text-[10px] text-zinc-500 font-mono select-none uppercase tracking-widest">
                Mapped constellations: <span className="font-bold text-pink-400">{unlockedStars.length} / 7</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECRET LEVEL ================= */}
        {level === 'secret' && (
          <div id="bestie-secret-level" className="w-full max-w-md text-center space-y-8 animate-fade-in py-6 select-none">
            {secretStep === 0 ? (
              <div className="space-y-6">
                <span className="text-[10px] font-sans bg-rose-500/25 text-pink-300 border border-pink-500/40 px-3 py-1 rounded-full font-black uppercase tracking-widest leading-relaxed">
                  🔒 ACCESSING THE CORE OF MY HEART 🔒
                </span>
                <p className="text-base md:text-lg font-serif font-extrabold text-pink-100 leading-relaxed max-w-sm mx-auto">
                  "Want to know my absolute favorite thing about you?"
                </p>

                <button
                  onClick={() => {
                    setSecretStep(1);
                    onTriggerConfetti();
                  }}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff4fa3] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs uppercase tracking-widest cursor-pointer shadow-[0_0_15px_rgba(255,79,163,0.4)] hover:scale-105 active:scale-95 transition-transform"
                >
                  Tell Me ❤️
                </button>
              </div>
            ) : secretStep < 5 ? (
              <div className="space-y-8 animate-scale-up">
                <p className="text-[#ff4fa3] uppercase font-mono tracking-widest text-xs font-black animate-pulse">
                  {secretStep === 1 && "Is it your warm beautiful smile? 🧐"}
                  {secretStep === 2 && "Is it your sweet cute laugh? 🧸"}
                  {secretStep === 3 && "Is it your sparkling, kind eyes? ✨"}
                  {secretStep === 4 && "Is it your wonderful supportive personality? 🌸"}
                </p>

                <div className="text-5xl font-black text-rose-500 tracking-wider">
                  {secretStep === 1 && "NO."}
                  {secretStep === 2 && "NO."}
                  {secretStep === 3 && "NO."}
                  {secretStep === 4 && "CLOSE..."}
                </div>

                <button
                  onClick={() => {
                    setSecretStep((prev) => prev + 1);
                    onTriggerConfetti();
                    if (secretStep === 4) {
                      setMassiveExplosion(true);
                    }
                  }}
                  className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-black text-[10px] uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
                >
                  Next Guess  🌸
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-bounce" style={{ animationDuration: '4s' }}>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/40 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                  ❤️ THE FINAL REVEAL ❤️
                </span>

                <h3 className="font-serif text-xl md:text-2xl font-black text-pink-300 uppercase leading-relaxed tracking-wider drop-shadow-[0_0_25px_#ff4fa3]">
                  MY FAVORITE THING ABOUT YOU IS THAT YOU ARE YOU.
                </h3>

                <p className="text-xs text-zinc-300 italic max-w-sm mx-auto leading-relaxed">
                  Authentic, wonderful, and beautiful in every way possible. Never change!
                </p>

                {/* Massive explosion confirmation button */}
                <button
                  onClick={() => {
                    setLevel('gift');
                    onTriggerConfetti();
                  }}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 cursor-pointer transition-all"
                >
                  Reveal Your Final Gift ❤️
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= FINAL GIFT BOX ================= */}
        {level === 'gift' && (
          <div id="bestie-gift-box" className="w-full max-w-2xl text-center space-y-6 animate-fade-in relative">
            <div className="space-y-1 select-none">
              <span className="text-[10px] font-sans bg-rose-500/20 text-pink-300 border border-pink-500/40 px-3 py-1 rounded-full font-black uppercase tracking-widest leading-relaxed">
                Level 5 — The Final Gift Box 🎁🎀
              </span>
              <h3 className="font-serif text-lg md:text-xl font-bold text-pink-100">
                Your Luxury Ribbon Gift Box
              </h3>
            </div>

            {!giftLetterOpen ? (
              <div className="py-8 flex flex-col items-center space-y-6">
                {/* Premium Ribbon Gift box animations */}
                <div 
                  className={`w-36 h-36 bg-gradient-to-tr from-pink-600 via-[#ff4fa3] to-purple-600 border border-pink-400 rounded-3xl relative cursor-pointer shadow-[0_0_35px_rgba(255,79,163,0.5)] transform ${
                    giftRibbonOpen ? '-translate-y-4 scale-105 filter brightness-110' : 'hover:scale-105 active:scale-95'
                  } transition-all duration-700 flex items-center justify-center`}
                  onClick={() => {
                    setGiftRibbonOpen(true);
                    onTriggerConfetti();
                    setTimeout(() => {
                      setGiftLetterOpen(true);
                    }, 500);
                  }}
                >
                  {/* Decorative ribbon ribbon wrapper */}
                  <div className="absolute inset-y-0 w-5 bg-yellow-400 flex justify-center items-center rounded-sm">
                    {/* Golden knot overlay */}
                    <div className="w-10 h-6 bg-yellow-500 rounded-full border border-yellow-300 shadow-md transform rotate-12 absolute" />
                  </div>
                  <div className="absolute inset-x-0 h-5 bg-yellow-400" />
                  
                  {/* Center gift label */}
                  <span className="absolute z-10 text-[9px] font-mono font-black text-slate-900 uppercase bg-yellow-300 px-2 py-0.5 rounded-full select-none shadow-md">
                    VANSHIKA BESTIE
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] text-zinc-400 tracking-widest font-mono uppercase">
                    Tap the ribbon gift box above to open the letter 💌
                  </p>
                  
                  <button
                    onClick={() => {
                      setGiftRibbonOpen(true);
                      onTriggerConfetti();
                      setTimeout(() => {
                        setGiftLetterOpen(true);
                      }, 500);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-[#ff4fa3] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Open Your Final Gift ❤️
                  </button>
                </div>
              </div>
            ) : (
              // Glassmorphism handwritten letter
              <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-pink-400/50 shadow-[0_0_30px_rgba(255,79,163,0.3)] text-left space-y-4 max-w-xl mx-auto animate-scale-up relative">
                
                {/* Embedded Cute Profile Portrait Frame of her if available */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-pink-500/10">
                  <div className="shrink-0 relative">
                    <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-xs" />
                    <img 
                      src={sorryBoyPhoto} 
                      alt="Your Lovely Bestie Vanshika" 
                      onClick={() => onTriggerConfetti()}
                      className="w-14 h-14 object-cover rounded-full border-2 border-pink-500 cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 text-xs text-rose-500">💕</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-black text-pink-300 bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
                      Vanshika ji Bestie
                    </h4>
                    <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                      My Favorite Person 🧸⭐
                    </p>
                  </div>
                </div>

                <div className="text-xs text-zinc-200 font-serif leading-relaxed space-y-3 italic select-none">
                  <p className="font-extrabold text-pink-200 font-serif text-sm border-b border-pink-500/5 pb-1">"My Love,</p>
                  <p>Seven years ago I found a best friend.</p>
                  <p>I never imagined she would become one of the most important people in my life.</p>
                  <p>Thank you for every laugh. Thank you for every conversation. Thank you for every memory.</p>
                  <p>Thank you for every time you stayed.</p>
                  <p>You have made difficult days easier and happy days even brighter. You are my comfort place. My favorite notification. My safe space. And one of the greatest blessings in my life.</p>
                  <p>No matter how much time passes, I will always be grateful that our paths crossed.</p>
                  <p className="font-black text-pink-300 text-sm mt-3 font-serif">Happy Best Friend Day.</p>
                  <p className="font-bold text-pink-200 font-serif">And thank you for being you. ❤️"</p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setLevel('finale');
                      onTriggerConfetti();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 cursor-pointer select-none active:scale-95 transition-all"
                  >
                    <span>Proceed to Finale</span>
                    <ChevronRight size={11} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= LEVEL 8: FINAL INTERACTION & GRAND FINALE ================= */}
        {level === 'finale' && (
          <motion.div 
            id="bestie-grand-finale" 
            className="w-full max-w-xl text-center space-y-6 py-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 85, damping: 15 }}
          >
            <div className="space-y-1 select-none">
              <span className="text-[10px] font-sans bg-rose-500/20 text-rose-300 border border-pink-500/40 px-3 py-1 rounded-full font-black uppercase tracking-widest leading-relaxed">
                🌠 THE GRAND FINALE INTERACTION 🌠
              </span>
              <h3 className="font-serif text-lg md:text-xl font-bold bg-gradient-to-r from-pink-200 via-rose-100 to-amber-200 bg-clip-text text-transparent">
                Out of Billions, I Found You 💖
              </h3>
            </div>

            {!finaleTriggered ? (
              <div className="py-8 space-y-8 flex flex-col items-center">
                <p className="text-xs text-zinc-300 max-w-xs mx-auto leading-relaxed">
                  Hold down the sparkling button below for 3 full seconds to trigger our custom Grand Bestie Finale!
                </p>

                {/* PRESS AND HOLD BUTTON WITH PROGRESS RADIAL/BAR */}
                <div className="relative flex flex-col items-center">
                  <button
                    onMouseDown={startHolding}
                    onMouseUp={stopHolding}
                    onMouseLeave={stopHolding}
                    onTouchStart={startHolding}
                    onTouchEnd={stopHolding}
                    className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-3 border-pink-300/40 shadow-[0_0_20px_rgba(255,79,163,0.5)] transform flex items-center justify-center flex-col gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <Heart size={28} className={`text-white ${isHolding ? 'animate-ping' : ''}`} fill="currentColor" />
                    <span className="text-[10px] text-zinc-100 font-extrabold uppercase font-mono select-none">
                      {isHolding ? `${Math.round(holdProgress)}%` : "HOLD ME"}
                    </span>
                  </button>

                  {/* Visual holding progress bar */}
                  <div className="w-48 h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-75"
                      style={{ width: `${holdProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <motion.div 
                className="p-6 md:p-8 rounded-3xl bg-[#0b0416] border-2 border-pink-400 shadow-[0_0_40px_rgba(255,79,163,0.7)] space-y-6 flex flex-col items-center max-w-xl mx-auto"
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 90, damping: 14, mass: 0.9 }}
              >
                <motion.span 
                  className="text-4xl inline-block"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  🌸💖👯💐⭐
                </motion.span>
                
                <h4 className="font-serif text-lg md:text-xl font-bold bg-gradient-to-r from-pink-300 via-rose-200 to-yellow-200 bg-clip-text text-transparent drop-shadow-[0_0_10px_#ff4fa3]">
                  CONGRATULATIONS VANSHIKA! ✨
                </h4>

                <div className="space-y-4 font-serif text-xs text-zinc-200 leading-relaxed italic border-l-2 border-pink-400 pl-4 py-1 text-left select-none w-full">
                  <p className="font-extrabold font-serif text-pink-300 text-sm">"Out of billions of people in the world,</p>
                  <p className="font-serif">I am super grateful that one of them is you.</p>
                  <p className="font-bold font-serif text-pink-200">Forever my best friend. Forever my favorite person. ❤️"</p>
                </div>

                {/* Double Polaroid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mt-4">
                  {/* Polaroid Card 1 */}
                  <motion.div 
                    className="bg-slate-900 border border-pink-500/30 p-2.5 pb-4 rounded-xl shadow-[0_4px_15px_rgba(236,72,153,0.15)] select-none cursor-pointer"
                    whileHover={{ scale: 1.05, rotate: 0, boxShadow: "0 10px 25px rgba(236,72,153,0.3)" }}
                    initial={{ rotate: -2, opacity: 0, x: -15 }}
                    animate={{ rotate: -1, opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                  >
                    <div className="aspect-[3/4] w-full rounded-lg overflow-hidden border border-pink-500/10">
                      <img 
                        src={vanshikaHappyPhoto} 
                        alt="Vanshika Gorgeous smiling with Jhumka" 
                        className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                        onClick={() => onTriggerConfetti()}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="font-mono text-[9px] text-pink-200 mt-2.5 font-bold italic text-center select-none leading-normal">
                      "My Absolute Gorgeous Queen 👑✨"
                    </p>
                  </motion.div>

                  {/* Polaroid Card 2 */}
                  <motion.div 
                    className="bg-slate-900 border border-pink-500/30 p-2.5 pb-4 rounded-xl shadow-[0_4px_15px_rgba(236,72,153,0.15)] select-none cursor-pointer"
                    whileHover={{ scale: 1.05, rotate: 0, boxShadow: "0 10px 25px rgba(236,72,153,0.3)" }}
                    initial={{ rotate: 2, opacity: 0, x: 15 }}
                    animate={{ rotate: 1, opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                  >
                    <div className="aspect-[3/4] w-full rounded-lg overflow-hidden border border-pink-500/10">
                      <img 
                        src={sorryBoyPhoto} 
                        alt="Vanshika Pouting" 
                        className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
                        onClick={() => onTriggerConfetti()}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="font-mono text-[9px] text-pink-300 mt-2.5 font-bold italic text-center select-none leading-normal">
                      "Sach mai nazar hoti hai! 🧿 Pout Queen 🥺❤️"
                    </p>
                  </motion.div>
                </div>

                {/* Lovely Girlfriend message */}
                <motion.div 
                  className="w-full text-center space-y-3 p-4 bg-gradient-to-r from-pink-500/10 via-purple-600/10 to-rose-500/10 border border-pink-500/20 rounded-2xl shadow-inner mt-4 select-none"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
                  <h5 className="font-serif text-[11px] font-black tracking-widest text-transparent bg-gradient-to-r from-pink-300 via-yellow-200 to-pink-300 bg-clip-text uppercase animate-pulse">
                    ✨ More than a Bestie... My Everything ✨
                  </h5>
                  <p className="text-[11px] text-pink-100 leading-relaxed font-semibold font-serif">
                    Tabse behtareen bestie bolte bolte direct heart ki baat bolna reh hi gaya... <span className="text-pink-400 font-extrabold">You are not just my best friend, you are my absolutely beautiful, gorgeous Girlfriend</span>, the absolute queen of my heart and my entire universe! 💖💍
                  </p>
                  <p className="text-[10px] text-zinc-300 leading-relaxed italic">
                    From your cute, adorable angry little pouts (sach mein sabki nazar lag jaayegi mere pyaare baby ko! 🧿) to your drop-dead gorgeous looks where those beautiful eyes, sharp eyeliner, and jhumkas make my heart melt instantly... I love every single shade of yours. Thank you for holding my hand and being my forever & ever. I am completely yours! ❤️🌹
                  </p>
                </motion.div>

                <div className="pt-2 w-full">
                  <button
                    onClick={() => {
                      setLevel('entry');
                      setEntryPhase(0);
                      setOpenedEnvelopes([]);
                      setBloomedFlowers([]);
                      setComfortOpen(false);
                      setComfortIndex(0);
                      setUnlockedStars([]);
                      setConstellationFinished(false);
                      setSecretStep(0);
                      setGiftRibbonOpen(false);
                      setGiftLetterOpen(false);
                      setFinaleTriggered(false);
                      setHoldProgress(0);
                      onTriggerConfetti();
                    }}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RefreshCw size={10} />
                    <span>Relive Adventure Loop ✍🏻</span>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

      </div>

      {/* --- FOOTER STATUS BAR --- */}
      <div className="relative z-10 w-full pt-4 border-t border-purple-500/10 flex flex-col md:flex-row items-center justify-between text-zinc-500 text-[9px] font-mono select-none uppercase tracking-widest">
        <span>Vanshika ji Bestie Adventure 👯</span>
        <span className="text-pink-400 font-extrabold animate-pulse">International Best Friend Day Surprise ⭐</span>
      </div>

    </div>
  );
}
