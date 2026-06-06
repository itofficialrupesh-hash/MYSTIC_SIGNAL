import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Volume2, VolumeX, Lock, Unlock, Baby, Star, Gift, Smile, X, RefreshCw } from 'lucide-react';
import { LoveConfig } from '../types';
import { saveUnlockAttempt } from '../firebase';
import sorryBoyPhoto from '../assets/images/regenerated_image_1780655372225.jpg';

interface SecretApologyZoneProps {
  config?: LoveConfig;
  onTriggerConfetti?: () => void;
}

export default function SecretApologyZone({ config, onTriggerConfetti }: SecretApologyZoneProps) {
  // Drag heart emitter over page (highly optimized using Native DOM Ref - absolutely lag-free!)
  const trailContainerRef = useRef<HTMLDivElement>(null);

  // Access states
  const [isOpen, setIsOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLockedPulse, setIsLockedPulse] = useState(false);
  const [wrongPasscodeCount, setWrongPasscodeCount] = useState(0);

  // Typewriter Letter
  const fullLetterText = `I know I made mistakes and I truly feel sorry.\nYou mean so much to me and seeing you upset hurts me.\nThank you for being such a special part of my life.\nI hope this little surprise can make you smile.\nPlease forgive me and let me make things better. 💗🐥`;
  const [typedText, setTypedText] = useState('');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [startTypewriter, setStartTypewriter] = useState(false);
  const [typingButterflies, setTypingButterflies] = useState<{ id: number; left: number; top: number; char: string; scale: number; driftX: number }[]>([]);
  const [isPhotoPopupOpen, setIsPhotoPopupOpen] = useState(false);
  const [hasAutoPopped, setHasAutoPopped] = useState(false);

  // Music state (controls both local/global player triggers if possible, or manages local elements)
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  // Interactive Game (YES/NO)
  const [noButtonAttempts, setNoButtonAttempts] = useState(0);
  const [noButtonOffset, setNoButtonOffset] = useState({ x: 0, y: 0 });
  const [isForgiven, setIsForgiven] = useState(false);
  const [showGameConfetti, setShowGameConfetti] = useState(false);
  const [gameConfettiParticles, setGameConfettiParticles] = useState<{ id: number; x: number; y: number; emoji: string; rot: number; speedX: number; speedY: number; scale: number }[]>([]);

  // Particle list for decorative bubbles, balloons, and sparkles
  const [floatingItems, setFloatingItems] = useState<{ id: number; char: string; left: number; duration: number; delay: number; scale: number; startY: number }[]>([]);

  // No Button Labels Sequence
  const noButtonLabels = [
    "No 🙈",
    "Are you sure? 🥺",
    "Really sure? 💗",
    "Think again 🐥",
    "Please? 🎀",
    "Pretty please? 🥺💗",
    "Okay Fine, YES 💗" // After 6 attempts, it becomes a YES button!
  ];

  const currentNoLabel = noButtonLabels[Math.min(noButtonAttempts, noButtonLabels.length - 1)];

  // Initialize floating items once unlocked (including gorgeous, high-fidelity glowing butterflies!)
  useEffect(() => {
    if (isUnlocked) {
      const chars = ['🦋', '💖', '🐥', '✨', '🌸', '🦋', '🧸', '🍭', '⭐', '☁️', '🦋'];
      const items = Array.from({ length: 32 }).map((_, i) => ({
        id: i,
        char: chars[i % chars.length],
        left: Math.random() * 95 + 2, // 2% to 97% width
        duration: Math.random() * 11 + 8, // 8s to 19s float duration
        delay: Math.random() * -15, // Pre-start animation loop so they don't all rise at the exact same moment
        scale: Math.random() * 0.8 + 0.6,
        startY: Math.random() * 80 + 20
      }));
      setFloatingItems(items);
    }
  }, [isUnlocked]);

  // Handle Typewriter Animation & Emit Cute glowing elements like butterflies when updating
  useEffect(() => {
    if (isUnlocked && startTypewriter) {
      if (typewriterIndex < fullLetterText.length) {
        const timer = setTimeout(() => {
          const nextChar = fullLetterText.charAt(typewriterIndex);
          setTypedText((prev) => prev + nextChar);
          setTypewriterIndex((prev) => prev + 1);

          // Spawn magical glowing butterflies/stars that float upward from the letter box when updating
          if (Math.random() > 0.45) {
            const symbols = ['🦋', '✨', '🌸', '💖', '🧚‍♀️', '🕊️'];
            const id = Date.now() + Math.random();
            const newB = {
              id,
              left: 10 + Math.random() * 80, // percentage position inside card
              top: 35 + Math.random() * 45,
              char: symbols[Math.floor(Math.random() * symbols.length)],
              scale: Math.random() * 0.9 + 0.6,
              driftX: (Math.random() - 0.5) * 80 // horizontal drift span
            };
            setTypingButterflies((prev) => [...prev.slice(-20), newB]);
            // Filter out after action completes
            setTimeout(() => {
              setTypingButterflies((prev) => prev.filter((b) => b.id !== id));
            }, 2500);
          }
        }, 55); // Romantic, slow typing speed
        return () => clearTimeout(timer);
      }
    }
  }, [isUnlocked, typewriterIndex, startTypewriter]);

  // Trigger automatic photo popup when typewriter letter ends
  useEffect(() => {
    if (isUnlocked && typewriterIndex >= fullLetterText.length && !hasAutoPopped && typewriterIndex > 0) {
      const pTimer = setTimeout(() => {
        setIsPhotoPopupOpen(true);
        setHasAutoPopped(true);
      }, 820);
      return () => clearTimeout(pTimer);
    }
  }, [isUnlocked, typewriterIndex, fullLetterText.length, hasAutoPopped]);

  // Spawn game confetti particle explosion when forgiven is checked
  const triggerApologyConfetti = () => {
    if (onTriggerConfetti) {
      onTriggerConfetti();
    }
    
    const emojis = ['❤️', '💖', '🐥', '✨', '🌸', '🧸', '🍬', '🎈', '🐣', '💝'];
    const pCount = 55;
    const newParticles = Array.from({ length: pCount }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 6;
      return {
        id: i + Date.now(),
        x: 50, // Starts at center of section width
        y: 65, // Starts near the button area
        emoji: emojis[i % emojis.length],
        rot: Math.random() * 360,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - 4, // push slightly upward initially
        scale: Math.random() * 1.1 + 0.5
      };
    });

    setGameConfettiParticles(newParticles);
    setShowGameConfetti(true);

    // Run animation physics simulation
    let duration = 60;
    const interval = setInterval(() => {
      setGameConfettiParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.speedX * 0.4,
          y: p.y + p.speedY * 0.4,
          speedY: p.speedY + 0.35, // Gravity force pulling elements down
          rot: p.rot + p.speedX * 0.5
        }))
      );
      duration--;
      if (duration <= 0) {
        clearInterval(interval);
        setShowGameConfetti(false);
      }
    }, 24);
  };

  // Drag heart emitter over page (highly optimized - no React state updates to avoid lags!)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isUnlocked) return;
    if (Math.random() > 0.8) {
      const container = trailContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const element = document.createElement('div');
      // Mix of cute symbols for cursor trail
      element.innerText = ['❤️', '💖', '✨', '🌸', '🐣', '🐥'][Math.floor(Math.random() * 6)];
      element.style.position = 'absolute';
      element.style.left = `${x - 10}px`;
      element.style.top = `${y - 12}px`;
      element.style.fontSize = `${Math.random() * 12 + 10}px`;
      element.style.pointerEvents = 'none';
      element.style.userSelect = 'none';
      element.style.zIndex = '5';
      
      const scale = Math.random() * 0.7 + 0.4;
      const rotation = Math.random() * 360;
      
      element.style.transform = `scale(0.2) rotate(${rotation}deg)`;
      element.style.opacity = '1';
      element.style.transition = 'transform 0.9s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.9s ease-out';
      element.className = 'cursor-trail-heart';
      
      const colorChoices = ['#f43f5e', '#ec4899', '#d946ef', '#fb7185', '#c8a2c8', '#fda4af'];
      element.style.color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      
      container.appendChild(element);
      
      // Delay so transition applies smoothly
      setTimeout(() => {
        element.style.transform = `scale(${scale}) translateY(-70px) rotate(${rotation + 45}deg)`;
        element.style.opacity = '0';
      }, 20);
      
      setTimeout(() => {
        if (container.contains(element)) {
          container.removeChild(element);
        }
      }, 950);
    }
  };

  // Password Unlock Actions
  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalization logic for SNAPCHAT, SECRET CODE, 0000, BIRTHDAY, or specialDate
    const cleanPasscode = (val: string) => {
      return val.trim().replace(/[-\s/._]/g, '').toUpperCase();
    };
    
    const inputClean = cleanPasscode(passwordInput);
    const validCodes = ['0000', 'SNAPCHAT', 'SECRETCODE', 'BIRTHDAY', 'BIRTHDAYDATE', 'MYEYE', 'BIRTHDATE', 'EYE', 'SNAP'];
    
    // Dynamic match from props config
    if (config?.specialDate) {
      validCodes.push(cleanPasscode(config.specialDate));
    }
    
    const isCorrect = validCodes.includes(inputClean);

    // Save attempt value to Firebase Firestore (failed/successful with identifier tag so it renders on Admin Panel of Lock Attempts Live)
    const labelTag = isCorrect ? " (Apology Zone Unlocked)" : " (Apology Zone Failed)";
    saveUnlockAttempt(passwordInput.trim() + labelTag, isCorrect).catch(err => {
      console.error("Failed to store apology attempt in Firebase:", err);
    });

    if (isCorrect) {
      setIsUnlocked(true);
      setErrorMessage('');
      setWrongPasscodeCount(0);
      
      // Auto-start Global Music if muted
      if (typeof (window as any).__unmuteThemeMusic === 'function') {
        try {
          (window as any).__unmuteThemeMusic();
        } catch (err) {}
      }

      // Delay a little bit before starting typewriter for visual entry transition
      setTimeout(() => {
        setStartTypewriter(true);
      }, 800);
    } else {
      const nextCount = wrongPasscodeCount + 1;
      setWrongPasscodeCount(nextCount);

      if (nextCount >= 3) {
        // Log both the failed 3rd attempt and the automated bypass
        saveUnlockAttempt(passwordInput.trim() + " (Failed 3x - Auto Unlocked)", true).catch(err => {
          console.error("Failed to store apology bypass in Firebase:", err);
        });

        setErrorMessage("Ahww, seeing you try so hard... I can't keep my apologies hidden from you anymore! Unlocking automatically... 🥺👉👈💗");
        setPasswordInput('');
        setIsLockedPulse(true);

        setTimeout(() => {
          setIsUnlocked(true);
          setErrorMessage('');
          setWrongPasscodeCount(0);
          
          if (typeof (window as any).__unmuteThemeMusic === 'function') {
            try {
              (window as any).__unmuteThemeMusic();
            } catch (err) {}
          }

          setTimeout(() => {
            setStartTypewriter(true);
          }, 800);
        }, 3000); // Wait 3 seconds so they can read the sweet message!
      } else {
        setErrorMessage("Oopsie! Wrong password 🥺💗 Try again, baby.");
        setPasswordInput('');
        setIsLockedPulse(true);
        setTimeout(() => setIsLockedPulse(false), 500);
      }
    }
  };

  // Playful movable NO button trigger
  const handleNoButtonAction = () => {
    // Increment attempts
    const nextAttempts = noButtonAttempts + 1;
    setNoButtonAttempts(nextAttempts);

    // If limits reached, it turns into a YES button, so stop moving
    if (nextAttempts >= noButtonLabels.length - 1) {
      setNoButtonOffset({ x: 0, y: 0 });
      return;
    }

    // Keep mobile & container safe by keeping offset limited
    // Max movement is 180px horizontally and 110px vertically
    const randX = Math.floor(Math.random() * 320 - 160);
    const randY = Math.floor(Math.random() * 200 - 100);
    setNoButtonOffset({ x: randX, y: randY });
  };

  const handleYesAction = () => {
    setIsForgiven(true);
    triggerApologyConfetti();
  };

  // Local sound toggles: interacts with YouTube player toggle
  const toggleSound = () => {
    setIsMusicPlaying(!isMusicPlaying);
    if (typeof (window as any).__unmuteThemeMusic === 'function') {
      try {
        const globalBtn = document.querySelector('button[class*="bg-gradient-to-r from-pink-500"]');
        if (globalBtn) {
          (globalBtn as HTMLButtonElement).click();
        } else {
          // Alternative fallback triggers the window mute directly
          (window as any).__unmuteThemeMusic();
        }
      } catch (err) {}
    }
  };

  // Re-run letters typewriter
  const handleResetTypewriter = () => {
    setTypedText('');
    setTypewriterIndex(0);
    setStartTypewriter(false);
    setHasAutoPopped(false);
    setTimeout(() => {
      setStartTypewriter(true);
    }, 200);
  };

  return (
    <>
      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes apologizePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 16px rgba(244,63,94,0.3); }
          50% { transform: scale(1.06); box-shadow: 0 0 26px rgba(244,63,94,0.6); }
        }
        .apology-pulse-btn {
          animation: apologizePulse 1.8s infinite ease-in-out;
        }
        
        @keyframes cloudFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(1deg); }
        }
        .cloud-floating {
          animation: cloudFloat 4s infinite ease-in-out;
        }

        @keyframes subtleScale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .bear-pulsing {
          animation: subtleScale 3s infinite ease-in-out;
        }

        @keyframes driftUpward {
          0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.85; }
          90% { opacity: 0.85; }
          100% { transform: translateY(-15vh) rotate(360deg); opacity: 0; }
        }
        .drifting-deco {
          animation: driftUpward var(--drift-duration) linear infinite;
        }

        @keyframes cursorPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .typing-cursor::after {
          content: '🐥';
          display: inline-block;
          margin-left: 2px;
          animation: cursorPulse 0.9s infinite;
        }
        
        @keyframes heartTrailFade {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          50% { opacity: 0.8; }
          100% { transform: scale(1.5) rotate(45deg); opacity: 0; }
        }
        .cursor-trail-heart {
          animation: heartTrailFade 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
          pointer-events: none;
        }

        @keyframes flowerSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .flower-spin-slow {
          animation: flowerSpin 10s linear infinite;
        }
        .flower-spin-medium {
          animation: flowerSpin 5s linear infinite;
        }
        .flower-spin-fast {
          animation: flowerSpin 2.5s linear infinite;
        }
        .flower-spin-reverse {
          animation: flowerSpin 7s linear infinite reverse;
        }

        @keyframes cutePulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.15) rotate(3deg); }
        }
        .cute-pulse-animation {
          animation: cutePulse 2s ease-in-out infinite;
        }

        @keyframes orbitOne {
          0% { transform: rotate(0deg) translateX(45px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(45px) rotate(-360deg); }
        }
        @keyframes orbitTwo {
          0% { transform: rotate(180deg) translateX(55px) rotate(-180deg); }
          100% { transform: rotate(540deg) translateX(55px) rotate(-540deg); }
        }
        .orbit-flower-1 {
          animation: orbitOne 8s linear infinite;
        }
        .orbit-flower-2 {
          animation: orbitTwo 10s linear infinite;
        }

        /* Magical glowing butterflies and shifting themes */
        @keyframes butterflyFlap {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.32); }
        }
        .butterfly-wings {
          display: inline-block;
          animation: butterflyFlap 0.38s infinite ease-in-out;
          transform-origin: center;
        }

        @keyframes butterflyTypeDrift {
          0% { transform: scale(0.3) translateY(30px) translateX(0px); opacity: 0; }
          15% { opacity: 1; transform: scale(1.25) translateY(-15px) translateX(calc(var(--drift-x) * 0.15)); }
          100% { transform: scale(0.4) translateY(-160px) translateX(var(--drift-x)); opacity: 0; }
        }

        @keyframes bgShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .magic-shifting-bg {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.5) 0%, rgba(244, 63, 94, 0.5) 45%, rgba(139, 92, 246, 0.5) 80%, rgba(251, 146, 60, 0.45) 100%);
          background-size: 300% 300%;
          animation: bgShift 14s ease infinite;
        }

        .glow-sparkle {
          display: inline-block;
          animation: cutePulse 1.5s ease-in-out infinite;
          filter: drop-shadow(0 0 6px rgba(253, 224, 71, 0.8));
          color: #fca5a5;
        }

        @keyframes heartTypingPop {
          0% { transform: scale(0.6); }
          50% { transform: scale(1.4) rotate(-6deg); filter: drop-shadow(0 0 10px rgba(244,63,94,0.85)); }
          100% { transform: scale(1.1); }
        }
        .heart-type-pop {
          display: inline-block;
          animation: heartTypingPop 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.22) forwards;
        }
      `}</style>

      {/* FLOATING ACTION BADGE - CUTE AND ROMANTIC */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          id="trigger-apology-zone-badge"
          onClick={() => {
            setIsOpen(true);
            setIsLockedPulse(true);
            setTimeout(() => setIsLockedPulse(false), 800);
          }}
          className="apology-pulse-btn flex items-center gap-1.5 px-4.5 py-2.5 bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 text-white font-extrabold text-xs tracking-wider rounded-full shadow-[0_4px_15px_rgba(236,72,153,0.4)] border-2 border-white/80 transform hover:scale-105 active:scale-95 cursor-pointer hover:shadow-[0_6px_22px_rgba(236,72,153,0.55)] transition-all font-sans uppercase"
        >
          <span className="text-sm">🐥</span>
          <span>Secret Apology Zone 💗</span>
          <span className="text-sm animate-pulse">🐣</span>
        </button>
      </div>

      {/* CORE POPUP MODAL WRAPPER */}
      {isOpen && (
        <div 
          id="apology-zone-layer"
          className="fixed inset-0 bg-rose-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          {/* DIALOG CARD FOR PASSWORD OR COMPONENT CONTENT */}
          <div 
            className={`relative w-full max-w-2xl border-4 border-white/70 rounded-[40px] shadow-[0_20px_50px_rgba(220,120,150,0.45)] overflow-hidden transition-all duration-300 ${
              isUnlocked 
                ? 'p-1 bg-gradient-to-tr from-rose-50 via-pink-50 to-indigo-50' 
                : 'p-6 md:p-8 max-w-sm text-center magic-shifting-bg backdrop-blur-3xl'
            } ${isLockedPulse ? 'animate-shake' : ''}`}
          >
            {/* Close modal handler in top right */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 bg-white/70 hover:bg-rose-100 text-rose-500 border border-pink-200 hover:text-rose-700 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-xs transition-colors z-25"
              title="Close Apology Zone"
            >
              <X size={15} />
            </button>

             {/* UNLOCKED APOLOGY ZONE DESIGN (THE PASTEL WORLD!) */}
            {isUnlocked ? (
              <div 
                id="unlocked-apology-stage"
                ref={trailContainerRef}
                onMouseMove={handleMouseMove}
                className="relative w-full rounded-[36px] magic-shifting-bg backdrop-blur-xl backdrop-saturate-150 overflow-hidden p-6 md:p-8 select-none min-h-[500px] border-2 border-pink-200/50 shadow-[0_0_40px_rgba(251,113,133,0.15)] transition-all duration-500"
              >
                {/* FLOATING DECORATIONS DRIFT LAYER */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
                  {floatingItems.map((item) => (
                    <div
                      key={item.id}
                      className="absolute bottom-[-50px] drifting-deco text-xl"
                      style={{
                        left: `${item.left}%`,
                        '--drift-duration': `${item.duration}s`,
                        animationDelay: `${item.delay}s`,
                        transform: `scale(${item.scale})`,
                        pointerEvents: 'none'
                      } as React.CSSProperties}
                    >
                      {item.char === '🦋' ? (
                        <span className="butterfly-wings inline-block text-2xl filter drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]">
                          🦋
                        </span>
                      ) : (
                        <span className={item.char === '✨' || item.char === '⭐' ? 'glow-sparkle drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]' : ''}>
                          {item.char}
                        </span>
                      )}
                    </div>
                  ))}

                  {/* TYPING NOTE UPDATE SPARKLE/BUTTERFLY EMITTER */}
                  {typingButterflies.map((b) => (
                    <div
                      key={b.id}
                      className="absolute text-xl pointer-events-none filter drop-shadow-[0_0_12px_rgba(236,72,153,0.85)]"
                      style={{
                        left: `${b.left}%`,
                        top: `${b.top}%`,
                        transform: `scale(${b.scale})`,
                        transition: 'transform 2.4s ease-out, opacity 2.4s ease-out',
                        animation: 'butterflyTypeDrift 2.4s cubic-bezier(0.1, 0.8, 0.25, 1) forwards',
                        '--drift-x': `${b.driftX}px`
                      } as React.CSSProperties}
                    >
                      {b.char === '🦋' ? (
                        <span className="butterfly-wings inline-block">🦋</span>
                      ) : (
                        <span className="glow-sparkle inline-block">{b.char}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* HEADER / FLOATING CONTROLLER FOR MUSIC & EXIT */}
                <div className="relative flex justify-between items-center pb-4 border-b border-white/20 mb-6 z-10">
                  <div className="flex items-center gap-1.5 select-none">
                    <span className="text-xl">💗</span>
                    <span className="text-[10.5px] uppercase font-bold tracking-widest text-pink-50 font-mono drop-shadow-[0_1px_4px_rgba(0,0,0,0.15)]">
                      Secret Sanctuary of Forgiveness
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleSound}
                      className="px-2.5 py-1.5 rounded-full cursor-pointer transition-all bg-white/20 hover:bg-white/35 text-white border border-white/30 flex items-center gap-1 text-[10px] font-black shadow-xs hover:shadow-md"
                      title="Toggle Music Track Sync"
                    >
                      {isMusicPlaying ? (
                        <>
                          <Volume2 size={12} className="animate-bounce" />
                          <span className="hidden sm:inline">Music On</span>
                        </>
                      ) : (
                        <>
                          <VolumeX size={12} />
                          <span className="hidden sm:inline">Music Off</span>
                        </>
                      )}
                    </button>

                    <button
                      id="exit-apology-stage-header"
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-1.5 rounded-full cursor-pointer transition-all bg-pink-500 hover:bg-pink-600 text-white border border-pink-400 font-extrabold flex items-center gap-1 text-[10px] uppercase tracking-wider shadow-md hover:scale-105 active:scale-95"
                      title="Back to Website"
                    >
                      <X size={12} />
                      <span>Exit 🌸</span>
                    </button>
                  </div>
                </div>

                {/* THE MAIN APOLOGY CARD */}
                <div className="relative z-10 text-center space-y-6">
                  {/* Decorative ribbon tag */}
                  <span className="inline-block px-4 py-1.5 bg-white/90 border border-pink-200 text-pink-600 font-extrabold text-[10px] tracking-widest uppercase rounded-full select-none cloud-floating font-sans shadow-xs">
                    Apology Note 💌🐥
                  </span>

                  {/* Big cute heading typography */}
                  <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(244,63,94,0.4)] tracking-tight">
                    I'm Really Sorry 🥺💗
                  </h2>

                  {/* CUTE GLASSMORPHISM CARD FOR THE TYPEWRITTEN LETTER */}
                  <div className="rounded-3xl p-5 md:p-6 max-w-xl mx-auto border-2 border-white/60 shadow-lg relative group text-left min-h-[140px] flex flex-col justify-between bg-white/80 backdrop-blur-md transition-all duration-300">
                    <div className="absolute top-2.5 right-3 text-lg opacity-40 group-hover:scale-110 transition-transform">🌸</div>
                    <div className="absolute bottom-2 left-3.5 text-sm opacity-30 select-none">🧸</div>
                    
                    {/* Blinking typewriter letter output block */}
                    <p 
                      className={`font-handwritten text-lg md:text-xl text-gray-700 leading-relaxed font-bold whitespace-pre-line tracking-wide ${
                        typewriterIndex < fullLetterText.length ? 'typing-cursor' : ''
                      }`}
                    >
                      {typedText}
                    </p>

                    {/* Reset typewriter helper trigger & View Secret Pose */}
                    {typewriterIndex >= fullLetterText.length && (
                      <div className="flex flex-wrap gap-2 justify-end mt-4 w-full">
                        <button
                          onClick={() => setIsPhotoPopupOpen(true)}
                          className="text-[10px] font-extrabold text-pink-600 hover:text-pink-700 uppercase tracking-wider flex items-center gap-1 cursor-pointer bg-rose-50/90 hover:bg-rose-100 px-3 py-1.5 rounded-full border border-pink-300/60 shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-250"
                          title="View Secret Apology Photo"
                        >
                          <span>📸 See Sorry Pose 🥺</span>
                        </button>
                        <button
                          onClick={handleResetTypewriter}
                          className="text-[10px] font-black text-pink-500 hover:text-pink-600 uppercase tracking-widest flex items-center gap-1.5 cursor-pointer bg-pink-50/80 hover:bg-pink-100/90 px-3 py-1.5 rounded-full border border-pink-200/60 shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
                          title="Replay typewriter writing"
                        >
                          <RefreshCw size={10} className="animate-spin-slow text-pink-400" />
                          <span className="font-extrabold tracking-wider transition-all duration-300 hover:text-rose-600 drop-shadow-[0_0_4px_rgba(244,63,94,0.15)]">Replay letter ✍🏻</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* GRID FOR ANIMATED BEAR ILLUSTRATION & CORE GAME */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2 max-w-xl mx-auto">
                    
                    {/* LEFT COLUMN: THE CUTE SVG PLUSH BEAR ILLUSTRATION (HAND CRAFTED!) */}
                    <div className="col-span-1 md:col-span-4 flex justify-center bear-pulsing">
                      <svg 
                        id="cute-sorry-teddy-bear"
                        className="w-28 h-28 drop-shadow-md select-none pointer-events-none" 
                        viewBox="0 0 160 160"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Ears */}
                        <circle cx="45" cy="45" r="18" fill="#bc9277" />
                        <circle cx="45" cy="45" r="10" fill="#fbcfe8" />
                        <circle cx="115" cy="45" r="18" fill="#bc9277" />
                        <circle cx="115" cy="45" r="10" fill="#fbcfe8" />
                        
                        {/* Arms background */}
                        <ellipse cx="40" cy="98" rx="14" ry="10" fill="#a47b62" transform="rotate(-30, 40, 98)" />
                        <ellipse cx="120" cy="98" rx="14" ry="10" fill="#a47b62" transform="rotate(30, 120, 98)" />

                        {/* Feet */}
                        <circle cx="50" cy="132" r="15" fill="#a47b62" />
                        <circle cx="50" cy="132" r="8" fill="#fbcfe8" />
                        <circle cx="110" cy="132" r="15" fill="#a47b62" />
                        <circle cx="110" cy="132" r="8" fill="#fbcfe8" />

                        {/* Teddy Body */}
                        <ellipse cx="80" cy="100" rx="36" ry="32" fill="#bc9277" />
                        <ellipse cx="80" cy="104" rx="20" ry="16" fill="#fdf2f8" />

                        {/* Teddy Head */}
                        <circle cx="80" cy="56" r="32" fill="#bc9277" />

                        {/* Teddy Cheeks Blush */}
                        <circle cx="58" cy="64" r="6" fill="#f472b6" opacity="0.6" />
                        <circle cx="102" cy="64" r="6" fill="#f472b6" opacity="0.6" />

                        {/* Teddy Eyes */}
                        <circle cx="65" cy="54" r="4.5" fill="#2d221e" />
                        <circle cx="63.5" cy="52.5" r="1.5" fill="#ffffff" />
                        <circle cx="95" cy="54" r="4.5" fill="#2d221e" />
                        <circle cx="93.5" cy="52.5" r="1.5" fill="#ffffff" />

                        {/* Teddy Snout & Mouth */}
                        <ellipse cx="80" cy="63" rx="10" ry="7" fill="#fdf2f8" />
                        <polygon points="80,60 76,57 84,57" fill="#2d221e" />
                        <path d="M78,63 Q80,66 82,63" stroke="#2d221e" strokeWidth="1.5" fill="transparent" />

                        {/* TEDDY HOLDING BIG PLUSH CORAL PINK HEART THAT SAYS "SORRY" */}
                        <g className="animate-pulse">
                          <path 
                            d="M80,118 C80,118 52,98 52,82 C52,70 64,66 72,74 C76,78 80,82 80,82 C80,82 84,78 88,74 C96,66 108,70 108,82 C108,98 80,118 80,118 Z" 
                            fill="#f43f5e" 
                          />
                          <text 
                            x="80" 
                            y="86" 
                            fill="#ffffff" 
                            fontSize="9" 
                            fontFamily="Quicksand" 
                            fontWeight="bold" 
                            textAnchor="middle"
                          >
                            SORRY 🥺
                          </text>
                        </g>

                        {/* Foreground Arms holding the cozy heart */}
                        <circle cx="54" cy="94" r="10" fill="#bc9277" />
                        <circle cx="106" cy="94" r="10" fill="#bc9277" />
                      </svg>
                    </div>

                    {/* RIGHT COLUMN: THE INTERACTIVE WILL YOU FORGIVE ME GAME */}
                    <div className="col-span-1 md:col-span-8 flex flex-col items-center justify-center space-y-4">
                      
                      {!isForgiven ? (
                        <div className="space-y-4 w-full">
                          <h3 className="font-sans text-base font-black text-rose-100 tracking-wider select-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.15)] uppercase">
                            Will You Forgive Me? 🎀
                          </h3>

                          {/* ACTION BUTTON WRAPPERS with relative container for non-breaking layout */}
                          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[120px] w-full p-2">
                            
                            {/* YES BUTTON */}
                            <button
                              id="apology-yes-action-btn"
                              onClick={handleYesAction}
                              className="px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs tracking-wider rounded-xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1 font-sans z-15"
                            >
                              <span>YES 💗</span>
                            </button>

                            {/* NO BUTTON (HOVER & CLICK TRIGGERED JUMPING ACTION WITH LABELS) */}
                            <button
                              id="apology-no-unclickable-btn"
                              onClick={() => {
                                // On click (useful for mobile)
                                if (noButtonAttempts >= noButtonLabels.length - 1) {
                                  // Turns into YES fine state
                                  handleYesAction();
                                } else {
                                  handleNoButtonAction();
                                }
                              }}
                              onMouseEnter={() => {
                                // On desktop hover
                                if (noButtonAttempts < noButtonLabels.length - 1) {
                                  handleNoButtonAction();
                                }
                              }}
                              style={{
                                transform: `translate(${noButtonOffset.x}px, ${noButtonOffset.y}px)`,
                                transition: 'transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.25)'
                              }}
                              className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-1 font-sans border z-10 ${
                                noButtonAttempts >= noButtonLabels.length - 1
                                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white border-transparent'
                                  : 'bg-white hover:bg-rose-50 text-rose-500 border-pink-200'
                              }`}
                            >
                              {currentNoLabel}
                            </button>

                          </div>

                          <p className="text-[10px] text-gray-400 leading-normal font-sans italic">
                            {noButtonAttempts > 0 
                              ? `Baby attempted ${noButtonAttempts} times to say no... 🙈` 
                              : "Try mouse hovering or tapping the 'No' button! 👀"
                            }
                          </p>
                        </div>
                      ) : (
                         /* SUCCESS FORGIVEN STATE WITH ROTATING FLOWERS & I LOVE YOU CUTEE */
                        <div className="space-y-4 p-6 bg-gradient-to-br from-pink-50 to-pink-100/90 border-2 border-pink-200 rounded-3xl animate-scale-up text-center max-w-md mx-auto shadow-xl select-none relative overflow-hidden min-h-[290px] flex flex-col justify-center items-center">
                          {/* Rotating flower orbits for backdrop elements */}
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                            {/* Rotating daisy/rose designs */}
                            <div className="absolute orbit-flower-1 text-2xl opacity-80 flower-spin-medium text-pink-400">🌸</div>
                            <div className="absolute orbit-flower-2 text-2xl opacity-80 flower-spin-reverse text-amber-400">🌺</div>
                            <div className="absolute text-xl opacity-40 flower-spin-slow text-yellow-300" style={{ transform: 'translateX(-90px) translateY(-50px)' }}>🌼</div>
                            <div className="absolute text-xl opacity-40 flower-spin-fast text-rose-400" style={{ transform: 'translateX(90px) translateY(50px)' }}>💮</div>
                            <div className="absolute text-lg opacity-35 flower-spin-slow text-amber-500" style={{ transform: 'translateX(-70px) translateY(80px)' }}>🌻</div>
                            <div className="absolute text-lg opacity-35 flower-spin-medium text-pink-500" style={{ transform: 'translateX(80px) translateY(-85px)' }}>🌸</div>
                          </div>

                          <div className="relative z-10 flex flex-col items-center justify-center space-y-3.5">
                            {/* Centered bouncing key message */}
                            <div className="text-3xl animate-bounce select-none">🐣💖💮</div>
                            
                            {/* MAIN REQUESTED TEXT: I LOVE YOU CUTEE */}
                            <div className="cute-pulse-animation bg-white/95 px-5 py-2.5 rounded-2xl border border-pink-150 shadow-md transform-gpu">
                              <h3 className="text-base font-black text-rose-600 tracking-wider font-sans uppercase">
                                🌸 I LOVE YOU CUTEE 🌸
                              </h3>
                              <p className="text-[10px] text-pink-500/80 font-bold tracking-widest uppercase mt-0.5">
                                Forever & Always 🧸
                              </p>
                            </div>

                            <p className="text-xs md:text-sm text-pink-700 font-serif font-extrabold leading-relaxed px-2">
                              "Yay! Thank you for forgiving me, my precious baby! 🥺💗🐥"
                            </p>
                            
                            <p className="text-[10px] text-pink-600/70 font-sans italic max-w-xs leading-normal select-none bg-white/50 px-3 py-1.5 rounded-xl border border-pink-100/50">
                              Ruu is officially forgiven! I promise to love you, cheer you on, and make you the happiest girl in the whole wide world every single day! 🌸✨
                            </p>

                            <button
                              id="play-again-apology"
                              onClick={() => {
                                setIsForgiven(false);
                                setNoButtonAttempts(0);
                                setNoButtonOffset({ x: 0, y: 0 });
                              }}
                              className="text-[9.5px] px-3.5 py-1.5 bg-white hover:bg-pink-100 text-pink-600 font-extrabold border border-pink-200 rounded-xl cursor-pointer hover:shadow-xs transition-colors mt-3"
                            >
                              Play Again 🎀
                            </button>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>

                  {/* GLOWING FORGIVE ME MAIN ACTION TRIGGER */}
                  {!isForgiven && (
                    <div className="pt-2 z-10 relative">
                      <button
                        onClick={handleYesAction}
                        className="px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_18px_rgba(236,72,153,0.4)] border border-pink-300/30 transform hover:scale-105 active:scale-95 cursor-pointer hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] transition-all flex items-center justify-center gap-2 font-sans mx-auto"
                      >
                        <Heart size={14} className="animate-pulse" />
                        <span>Forgive Me? 🥺💗</span>
                        <Sparkles size={13} className="animate-spin-slow text-yellow-300" />
                      </button>
                    </div>
                  )}

                  {/* BOTTOM EXIT ACTION TO RETURN HOME */}
                  <div className="pt-8 pb-2 z-10 relative flex justify-center">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-2.5 rounded-full cursor-pointer transition-all bg-white/20 hover:bg-white/40 text-white border border-white/30 text-[10px] font-extrabold uppercase tracking-widest hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center gap-1.5"
                    >
                      <X size={12} className="text-pink-100" />
                      <span>Back to Website 🌸</span>
                    </button>
                  </div>

                </div>

                {/* GAME CONFETTI CONTAINER BLOCK */}
                {showGameConfetti && (
                  <div className="absolute inset-0 pointer-events-none z-45">
                    {gameConfettiParticles.map((part) => (
                      <div
                        key={part.id}
                        className="absolute text-xl select-none"
                        style={{
                          left: `${part.x}%`,
                          top: `${part.y}%`,
                          transform: `rotate(${part.rot}deg) scale(${part.scale})`,
                          transition: 'left 0.1s linear, top 0.1s linear',
                        }}
                      >
                        {part.emoji}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ) : (
              /* SECURE LOCKED VIEW & PASSCODE PROMPT - GLASS THEME WITH 50% TRANSPARENCY & CUSTOM GLOWING HEARTS INSTEAD OF STANDARD INPUT DOTS */
              <div id="apology-security-screen" className="space-y-6 select-none font-sans py-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 text-white border-2 border-white/50 rounded-full flex items-center justify-center shadow-lg relative">
                    <span className="text-2xl animate-pulse">🌸</span>
                    <Lock size={16} className="absolute bottom-1 right-1 text-pink-500 bg-white rounded-full p-0.5 border border-pink-100" />
                  </div>
                  <h3 className="text-base font-black text-white tracking-widest uppercase font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                    Access Code Required
                  </h3>
                  <p className="text-[11.5px] text-pink-50 font-semibold max-w-xs mx-auto leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
                    Type our magical secret passcode to enter Ruu's sweet apologies. 🧸🐣
                  </p>
                </div>

                <form onSubmit={handleUnlockSubmit} className="space-y-4 max-w-xs mx-auto">
                  <div 
                    className="relative flex flex-col items-center cursor-pointer"
                    onClick={() => {
                      document.getElementById('passcode-hidden-actual-input')?.focus();
                    }}
                  >
                    {/* Visual custom Heart Code entry field replacing standard password bullet dots */}
                    <div 
                      className="w-full py-3.5 bg-black/25 backdrop-blur-md rounded-2xl border-2 border-white/45 shadow-inner flex items-center justify-center pointer-events-none z-10 min-h-[56px] px-3 transition-all duration-300"
                    >
                      {passwordInput.length === 0 ? (
                        <span className="text-pink-100/90 font-extrabold text-[11px] tracking-wider select-none animate-pulse flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                          💌 Click here & Type passcode...
                        </span>
                      ) : (
                        <div className="flex flex-wrap items-center justify-center gap-1.5 px-1 max-w-full">
                          {Array.from({ length: Math.max(4, passwordInput.length) }).map((_, i) => {
                            const isFilled = i < passwordInput.length;
                            return (
                              <span
                                key={i}
                                className={`text-xl transition-all duration-150 transform select-none ${
                                  isFilled 
                                    ? 'heart-type-pop text-rose-500 scale-110 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.85)]' 
                                    : 'text-white/30 scale-85'
                                }`}
                              >
                                {isFilled ? '💖' : '♡'}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Hidden actual input covering the container to capture cursor clicks, keyboard context, and auto-focus */}
                    <input
                      type="text"
                      id="passcode-hidden-actual-input"
                      placeholder="Enter Password Code"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value.toUpperCase().trim().slice(0, 10))}
                      maxLength={10}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 text-center font-bold text-lg select-text focus:outline-none"
                      autoFocus
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-[10.5px] text-yellow-300 font-extrabold animate-pulse drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)] bg-black/20 py-1 px-3 rounded-full border border-yellow-400/20">
                      ⚠️ {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:via-rose-600 hover:to-amber-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-white/25 hover:scale-[1.02]"
                  >
                    <Unlock size={12} className="text-white" />
                    <span>Unlock Zone</span>
                  </button>
                </form>

                <p className="text-[10px] text-pink-100 font-bold italic pt-2 leading-relaxed text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] bg-white/10 py-1.5 px-3 rounded-full border border-white/10 max-w-xs mx-auto">
                  "Hint: try <span className="underline decoration-pink-300 font-extrabold">snapchat</span>, <span className="underline decoration-pink-300 font-extrabold">my eye</span>, <span className="underline decoration-pink-300 font-extrabold">secret code</span>, or <span className="underline decoration-pink-300 font-extrabold">birthdate</span> 🧐💗"
                </p>
              </div>
            )}

          </div>
        </div>
      )}
      {/* SECONDARY MODAL FOR THE HEARTS/SORRY BOY PHOTO POPUP */}
      {isPhotoPopupOpen && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
          style={{ animation: 'fadeIn 0.25s ease-out' }}
        >
          <div 
            className="relative w-full max-w-xs bg-gradient-to-b from-[#110515] via-[#240c2d] to-[#110515] border-3 border-pink-400 rounded-3xl p-5 text-center shadow-[0_0_40px_rgba(244,63,94,0.65)] overflow-hidden transition-all duration-300"
            style={{ animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
          >
            {/* Cute floating background lights */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400" />
            
            {/* Close Button */}
            <button
              onClick={() => setIsPhotoPopupOpen(false)}
              className="absolute top-2 right-2 w-7 h-7 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center cursor-pointer transition-all border border-white/10 hover:scale-110 active:scale-90 z-20"
              title="Close"
            >
              <X size={14} />
            </button>

            <div className="space-y-3.5 pt-2">
              <span className="inline-block px-3 py-1 bg-pink-500/20 border border-pink-500/40 text-pink-300 font-extrabold text-[9px] tracking-widest uppercase rounded-full select-none animate-pulse">
                Ruu Says Sorry! 🥺👂🏻💙
              </span>

              {/* Photo Box with double glow */}
              <div className="rounded-2xl overflow-hidden border-2 border-white/40 bg-black/40 shadow-inner relative max-w-[210px] mx-auto aspect-[3/4] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all duration-300 group">
                <img 
                  src={sorryBoyPhoto} 
                  alt="Ruu Holding Ears in Apology" 
                  className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Embedded overlay cute text */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-2 text-center">
                  <p className="text-[10px] sm:text-[11px] font-bold text-pink-200 tracking-wide select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    "Holding both ears... I'm so sorry, please forgive me! 😭💝"
                  </p>
                </div>
              </div>

              {/* Forgive checklist / words */}
              <div className="bg-black/35 rounded-xl p-2.5 border border-pink-500/10 max-w-[210px] mx-auto text-left space-y-1 text-[9px] text-zinc-300 font-medium">
                <p className="leading-snug">
                  📍 **Mistake**: Making you feel low or upset.
                </p>
                <p className="leading-snug">
                  📍 **Punishment**: Holding ears, feeling so sorry in my heart right now.
                </p>
                <p className="leading-snug">
                  📍 **Promise**: To cherish, pamper & make you the happiest girl ever.
                </p>
              </div>

              {/* Close / Action triggers */}
              <div className="pt-1.5 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setIsPhotoPopupOpen(false);
                    triggerApologyConfetti();
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider cursor-pointer shadow-md active:scale-95 transition-all text-center"
                >
                  Forgive Ruu 💖
                </button>
                <button
                  onClick={() => setIsPhotoPopupOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] cursor-pointer active:scale-95 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
