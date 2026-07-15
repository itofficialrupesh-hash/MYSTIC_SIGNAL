import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, HelpCircle, Heart, Star, Compass, Gift, Calendar, Clock, Crown, X } from 'lucide-react';
import { LoveConfig } from '../types';
import LovelyLogo from './LovelyLogo';
import { saveUnlockAttempt } from '../firebase';
import BestieZone from './BestieZone';
import BestiePasscodeLock from './BestiePasscodeLock';
import FatherSurpriseZone from './FatherSurpriseZone';
import PeriodHub from './PeriodHub';
import PeriodHubLock from './PeriodHubLock';

interface LandingPageProps {
  config: LoveConfig;
  onUnlocked: () => void;
  onTriggerConfetti: () => void;
}

interface ClickEmoji {
  id: number;
  x: number;
  y: number;
  scale: number;
  emoji: string;
  rotation: number;
}

export default function LandingPage({ config, onUnlocked, onTriggerConfetti }: LandingPageProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showHelpBadge, setShowHelpBadge] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [clickingHearts, setClickingHearts] = useState<ClickEmoji[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showBestieAuth, setShowBestieAuth] = useState(false);
  const [bestieUnlocked, setBestieUnlocked] = useState(false);
  const [fatherUnlocked, setFatherUnlocked] = useState(false);
  const [fatherPasswordInput, setFatherPasswordInput] = useState('');
  const [fatherAttempts, setFatherAttempts] = useState(0);
  const [fatherError, setFatherError] = useState(false);
  const [showFatherHint, setShowFatherHint] = useState(false);
  const [fatherAutoRevealed, setFatherAutoRevealed] = useState(false);
  
  // Period Hub states
  const [showPeriodHubModal, setShowPeriodHubModal] = useState(false);
  const [isPeriodHubUnlocked, setIsPeriodHubUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('is_period_hub_unlocked') === 'true';
    } catch (e) {
      return false;
    }
  });
  
  // Quick theme-based 4-digit unlock modal states
  const [showQuickUnlockModal, setShowQuickUnlockModal] = useState(false);
  const [showBirthdayLockedPopup, setShowBirthdayLockedPopup] = useState(false);
  const [selectedSectionName, setSelectedSectionName] = useState('');
  const [quickUnlockPin, setQuickUnlockPin] = useState('');
  const [quickUnlockError, setQuickUnlockError] = useState(false);
  const [quickUnlockShake, setQuickUnlockShake] = useState(false);
  
  // Birthday countdown state (Target: 25 November)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isBirthday: false
  });

  // Calculate the live countdown to 25 November
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // November is month index 10 (0-indexed)
      let birthdayTarget = new Date(currentYear, 10, 25, 0, 0, 0);
      
      // If November 25th has already passed this year, count down to next year's
      if (now.getTime() > birthdayTarget.getTime()) {
        birthdayTarget = new Date(currentYear + 1, 10, 25, 0, 0, 0);
      }
      
      // Check if TODAY is November 25th
      const isTodayNov25 = now.getDate() === 25 && now.getMonth() === 10;
      
      const difference = birthdayTarget.getTime() - now.getTime();
      
      if (isTodayNov25 || difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isBirthday: true });
        return;
      }
      
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);
      
      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, isBirthday: isTodayNov25 });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard support for Quick Passcode Modal
  useEffect(() => {
    if (!showQuickUnlockModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key)) {
        handleQuickUnlockPinPress(e.key);
      } else if (e.key === 'Backspace') {
        handleQuickUnlockBackspace();
      } else if (e.key === 'Escape') {
        setShowQuickUnlockModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showQuickUnlockModal, quickUnlockPin]);

  // Soft click burst handler for girl-friendly sweet experience
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger if clicking directly on background, wrappers or empty space
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('form')) {
      return;
    }

    // Unmute background music since the user interacted
    if (typeof (window as any).__unmuteThemeMusic === 'function') {
      try {
        (window as any).__unmuteThemeMusic();
      } catch (err) {}
    }

    const cuteEmojis = ['💋', '😘', '👩‍❤️‍💋‍👨', '💖', '✨', '🌸', '🦋', '🎈', '💖', '🧁', '💝', '😘', '💋', '💞', '💘', '🧸', '💝', '👩‍❤️‍💋‍👨', '💋', '❤️‍🔥'];
    const randomEmoji = cuteEmojis[Math.floor(Math.random() * cuteEmojis.length)];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newEmoji: ClickEmoji = {
      id: Date.now() + Math.random(),
      x,
      y,
      scale: Math.random() * 0.5 + 0.8,
      emoji: randomEmoji,
      rotation: (Math.random() - 0.5) * 30
    };
    
    setClickingHearts(prev => [...prev, newEmoji]);
    
    // Cleanup particle after animation finishes
    setTimeout(() => {
      setClickingHearts(prev => prev.filter(item => item.id !== newEmoji.id));
    }, 1600);
  };

  // Convert input string for clean and foolproof validation matching
  const cleanString = (str: string) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetClean = cleanString(config.specialDate);
    const inputClean = cleanString(passwordInput);
    const isCorrect = (inputClean === targetClean || inputClean === '1122' || passwordInput.trim() === config.specialDate);

    // Save attempt value to Firebase Firestore
    if (passwordInput.trim()) {
      saveUnlockAttempt(passwordInput.trim(), isCorrect).catch(err => {
        console.error("Failed to store attempt in Firebase Firestore:", err);
      });
    }

    if (isCorrect) {
      setIsSuccess(true);
      setIsError(false);
      setFeedbackMsg("✨ Correct! Opening our digital love sanctuary...");
      
      // Instantly start/unmute background music!
      if (typeof (window as any).__unmuteThemeMusic === 'function') {
        try {
          (window as any).__unmuteThemeMusic();
        } catch (err) {}
      }

      setTimeout(() => {
        onUnlocked();
      }, 250);
    } else {
      setIsError(true);
      setFeedbackMsg(`❌ Hmm, that magic date doesn't match. Please try again!`);
      setPasswordInput("");
      setTimeout(() => {
        setIsError(false);
      }, 800);
    }
  };

  const handleScrapbookItemClick = (itemName: string) => {
    if (itemName === "Vanshika's Birthday Countdown") {
      if (!timeLeft.isBirthday) {
        setShowBirthdayLockedPopup(true);
        return;
      } else {
        // If it actually is Nov 25th, trigger beautiful confetti and unlock Bestie Zone automatically
        onTriggerConfetti();
        setTimeout(onTriggerConfetti, 450);
        setBestieUnlocked(true);
        setFeedbackMsg("🎉 Happiest Birthday Vanshika! My absolute favorite human on this planet! Your surprise has blossomed!");
        return;
      }
    }
    setSelectedSectionName(itemName);
    setQuickUnlockPin('');
    setQuickUnlockError(false);
    setQuickUnlockShake(false);
    setShowQuickUnlockModal(true);
  };

  const handleQuickUnlockPinPress = (num: string) => {
    if (quickUnlockPin.length >= 4) return;
    const newPin = quickUnlockPin + num;
    setQuickUnlockPin(newPin);
    
    // Unmute background music when keypad is interacted with
    if (typeof (window as any).__unmuteThemeMusic === 'function') {
      try {
        (window as any).__unmuteThemeMusic();
      } catch (err) {}
    }

    if (newPin.length === 4) {
      const isCorrect = newPin === '1125' || newPin === '2511';
      
      // Save unlock attempt in Firebase Firestore
      try {
        saveUnlockAttempt(`Quick Unlock PIN (${selectedSectionName}): ${newPin}`, isCorrect).catch(err => {
          console.error("Firebase save quick attempt error:", err);
        });
      } catch (err) {}

      if (isCorrect) {
        onTriggerConfetti();
        setTimeout(onTriggerConfetti, 400);
        setBestieUnlocked(true);
        setShowQuickUnlockModal(false);
        setFeedbackMsg(`💖 Congratulations! Sanctuary section "${selectedSectionName}" unlocked!`);
      } else {
        setQuickUnlockError(true);
        setQuickUnlockShake(true);
        setTimeout(() => {
          setQuickUnlockShake(false);
          setQuickUnlockPin('');
        }, 600);
      }
    }
  };

  const handleQuickUnlockBackspace = () => {
    setQuickUnlockPin(prev => prev.slice(0, -1));
    setQuickUnlockError(false);
  };

  const handleQuickUnlockClear = () => {
    setQuickUnlockPin('');
    setQuickUnlockError(false);
  };

  return (
    <div 
      className="relative min-h-[92vh] w-full flex flex-col items-center justify-center p-4 lg:p-8 overflow-hidden bg-gradient-to-br from-[#0a0712] via-[#050508] to-[#120a1c] text-zinc-100 select-none cursor-heart"
      id="landing-container"
      onClick={handleBackgroundClick}
    >
      {/* Ambient background glows matching the logo */}
      <div className="absolute top-[20%] left-[25%] w-[450px] h-[450px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[20%] right-[25%] w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none select-none z-0" />

      {/* Interactive styles wrapper */}
      <style>{`
        @keyframes popUpDrift {
          0% {
            transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
            opacity: 0;
          }
          15% {
            transform: translate(-50%, -50%) scale(1.3) rotate(var(--pop-rot)) translateY(-15px);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.8) rotate(calc(var(--pop-rot) * 1.8)) translateY(-120px);
            opacity: 0;
          }
        }
        .animate-pop-drift {
          animation: popUpDrift 1.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .cursor-heart {
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='%23ec4899' stroke='%23f43f5e' stroke-width='1.5'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>"), auto;
        }
        .animate-sway {
          animation: sway 4s ease-in-out infinite alternate;
        }
        @keyframes sway {
          0% { transform: translateY(0) rotate(-3deg); }
          100% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes customGlow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(244, 63, 94, 0.7)) drop-shadow(0 0 12px rgba(244, 63, 94, 0.4)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 15px rgba(244, 63, 94, 1)) drop-shadow(0 0 25px rgba(236, 72, 153, 0.9)); transform: scale(1.1); }
        }
        .animate-glow-heart {
          animation: customGlow 2.5s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes heartPopIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2) rotate(-5deg); opacity: 0.9; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-heart-pop {
          display: inline-block;
          animation: heartPopIn 0.16s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          45%, 80% { transform: translateX(6px); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-pop-in {
          animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards;
        }
        .animate-shake {
          animation: shake 0.35s ease-in-out;
        }
      `}</style>

      {/* Floating Click Burst Layer */}
      {clickingHearts.map((item) => (
        <span
          key={item.id}
          className="absolute pointer-events-none text-3xl z-50 select-none animate-pop-drift filter drop-shadow-[0_0_12px_rgba(236,72,153,1)]"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            '--pop-rot': `${item.rotation}deg`,
          } as React.CSSProperties}
        >
          {item.emoji}
        </span>
      ))}

      {/* Graphic floating sweet background particles */}
      <div className="absolute top-10 left-10 text-pink-400 animate-glow-heart text-4xl select-none pointer-events-none">💖</div>
      <div className="absolute bottom-20 right-10 text-purple-400 opacity-80 text-4xl select-none pointer-events-none animate-bounce delay-150 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">😘</div>
      <div className="absolute top-40 right-20 text-yellow-400 animate-pulse text-3xl select-none pointer-events-none">⭐</div>
      <div className="absolute bottom-10 left-20 text-pink-300 animate-glow-heart text-5xl select-none pointer-events-none">💋</div>
      <div className="absolute top-[28%] right-[3%] text-3xl animate-glow-heart select-none pointer-events-none">💝</div>

      {/* More girl-friendly items scattered beautifully in the background for cozy mood */}
      <div className="absolute top-[20%] left-[8%] text-3xl animate-sway select-none pointer-events-none opacity-50">🎈</div>
      <div className="absolute top-[12%] right-[15%] text-3xl animate-spin-slow select-none pointer-events-none opacity-50">🌸</div>
      <div className="absolute bottom-[35%] left-[12%] text-3xl animate-bounce select-none pointer-events-none opacity-60">🧸</div>
      <div className="absolute bottom-[28%] right-[18%] text-3xl animate-glow-heart select-none pointer-events-none">💋</div>
      <div className="absolute top-[75%] left-[25%] text-2xl select-none pointer-events-none opacity-40 animate-pulse">🎀</div>
      <div className="absolute top-[5%] left-[45%] text-2xl select-none pointer-events-none opacity-50">🫧</div>

      {/* Header Section */}
      <header className="text-center mb-6 w-full max-w-4xl relative z-10 select-none">
        {/* Lovely Logo Brand Component */}
        <div className="flex justify-center mb-6">
          <LovelyLogo size="lg" imageUrl={config.profileLogoUrl} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-950/40 border border-pink-500/30 rounded-full text-pink-300 font-bold text-[10px] uppercase tracking-widest mb-3 animate-bounce shadow-[0_0_10px_rgba(236,72,153,0.15)]">
          <span>💖</span>
          <span>Tap anywhere to spawn cute magic sparkles!</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-pink-250 mb-2 font-black tracking-tight italic drop-shadow-[0_0_16px_rgba(244,63,94,0.35)]">
          A Special Surprise For <span className="bg-gradient-to-r from-pink-300 via-rose-300 to-pink-200 bg-clip-text text-transparent">{config.coupleNameTwo || 'Mystic Signal'}</span> ❤️
        </h1>
        <p className="text-purple-300 font-extrabold tracking-widest uppercase text-xs opacity-90 drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]">
          Only {config.coupleNameTwo || 'Mystic Signal'} can unlock this secret space
        </p>
      </header>

      {/* Main Login / Lock Area - Side-by-side or stacked scrapbook */}
      <div className="flex-1 w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-stretch justify-center relative z-10 mb-8">
        
        {/* Left: Password Entrance Card */}
        <div 
          id="landing-glass-container"
          className={`w-full lg:w-5/12 bg-slate-900/60 backdrop-blur-xl border border-pink-500/20 rounded-[40px] p-8 shadow-2xl flex flex-col justify-between text-center transition-all duration-700 relative ${
            isSuccess ? 'scale-95 rotate-2 opacity-30 pointer-events-none' : 'scale-100 opacity-100'
          } ${isError ? 'animate-shake border-red-500/30 bg-red-950/20' : ''}`}
        >
          <div>
            {/* Cute Teddy Bear Mascot holding a heart / locks */}
            <div className="relative w-full flex flex-col items-center justify-center mb-4 select-none">
              {/* Cute speech bubble from the teddy */}
              <div className="bg-slate-950/90 border border-pink-500/30 text-pink-300 font-bold font-serif text-[10px] px-3 py-1.5 rounded-2xl shadow-xs leading-tight transition-transform duration-300 hover:scale-105 flex items-center justify-center gap-1.5 mb-2 animate-pulse">
                <span>🧸</span>
                <span>Enter our special date to open my heart!</span>
                <span className="text-pink-400">❤️</span>
              </div>
              
              {/* Animated Teddy Emojis & popping heart sparkles */}
              <div className="relative text-7xl select-none py-1 cursor-pointer hover:scale-110 transition-transform duration-300">
                🧸
                {/* Popping hearts */}
                <span className="absolute -top-1 -left-3 text-2xl animate-pulse">💖</span>
                <span className="absolute top-1 -right-4 text-xl animate-ping opacity-75">💕</span>
                <span className="absolute -right-2 bottom-1 text-2xl animate-bounce delay-300">💝</span>
                <span className="absolute -left-4 bottom-2 text-xl animate-bounce delay-700">❤️</span>
              </div>
            </div>

            <div className="w-12 h-12 bg-pink-950/50 rounded-full border border-pink-500/30 flex items-center justify-center mb-4 mx-auto shadow-inner relative">
              <div className="absolute inset-0 bg-pink-500/10 rounded-full animate-ping pointer-events-none" />
              {isSuccess ? (
                <Unlock className="text-pink-400 w-6 h-6 heart-pulsing" />
              ) : (
                <Lock className="text-pink-400 w-6 h-8" />
              )}
            </div>
            
            <h2 className="text-xl font-bold font-serif text-pink-100 mb-2">The Vault of Us</h2>
            <p className="text-xs text-pink-200/70 mb-6 leading-relaxed">
              Enter the date that changed everything for us, or type the secret token! ✨
            </p>

            {/* Input box form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                {/* Real hidden input layer */}
                <input
                  id="special-date-cookie"
                  type="text"
                  placeholder="4-Digit Passcode"
                  value={passwordInput}
                  onChange={(e) => {
                    const cleanVal = e.target.value.slice(0, 4);
                    setPasswordInput(cleanVal);
                    if (typeof (window as any).__unmuteThemeMusic === 'function') {
                      try {
                        (window as any).__unmuteThemeMusic();
                      } catch (err) {}
                    }
                  }}
                  onFocus={() => {
                    setIsFocused(true);
                    if (typeof (window as any).__unmuteThemeMusic === 'function') {
                      try {
                        (window as any).__unmuteThemeMusic();
                      } catch (err) {}
                    }
                  }}
                  onBlur={() => setIsFocused(false)}
                  disabled={isSuccess}
                  maxLength={4}
                  className="absolute inset-0 w-full h-full opacity-0 z-25 cursor-text text-center text-lg focus:outline-none"
                  autoComplete="off"
                />
                
                {/* Visual heartbeat overlay masking password letters with hearts */}
                <div 
                  className={`w-full bg-slate-950/80 border-2 rounded-2xl px-4 py-3.5 flex items-center justify-center min-h-[58px] transition-all duration-300 relative ${
                    isError 
                      ? 'border-red-500/80 bg-red-950/40 shadow-md animate-space' 
                      : isSuccess 
                        ? 'border-emerald-500 bg-emerald-950/40' 
                        : isFocused
                          ? 'border-pink-500 ring-4 ring-pink-500/20 bg-slate-950 scale-[1.01]'
                          : 'border-pink-500/30 hover:border-pink-500/50'
                  }`}
                >
                  {passwordInput.length === 0 ? (
                    <span className="text-pink-300/80 font-mono tracking-widest text-base font-semibold select-none">
                      4-Digit Code
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 justify-center flex-wrap max-w-[90%]">
                      {passwordInput.split('').map((_, index) => (
                        <span 
                          key={index} 
                          className="text-pink-500 text-[15px] select-none inline-block filter drop-shadow-[0_1px_2px_rgba(236,72,153,0.3)] animate-heart-pop"
                          style={{
                            animationDelay: `${index * 15}ms`
                          }}
                        >
                          ❤️
                        </span>
                      ))}
                    </div>
                  )}

                  {passwordInput && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-pink-400 select-none animate-pulse">
                      <Heart size={14} fill="rgba(244, 63, 94, 0.4)" />
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable hint matching "Need a hint, my favorite person?" request */}
              <div className="flex flex-col items-center justify-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowHint(!showHint);
                    setFeedbackMsg(null);
                  }}
                  className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-pink-300 hover:text-pink-200 focus:outline-none cursor-pointer mx-auto transition-colors bg-pink-950/40 hover:bg-pink-900/60 px-3.5 py-1.5 rounded-full border border-pink-500/20 animate-pulse"
                >
                  <HelpCircle size={13} className="text-pink-400" />
                  <span>Need a hint, my favorite person?</span>
                </button>

                {showHint && (
                  <div 
                    id="hint-expanded"
                    className="text-[11px] bg-slate-950/95 text-pink-300 px-3 py-2 rounded-xl border border-pink-500/30 text-center font-semibold animate-fade-in shadow-sm leading-normal flex items-center justify-center gap-1.5 w-full"
                  >
                    <span className="text-pink-400 text-xs animate-bounce">💡</span>
                    <span>{config.specialDateHint || "WHENEVER YOU FEEL LOW MY GIRL YOU WENT TO PAPA AND MUMMA AND FRIENDS AND MAYBE RUU.... COMBINATION OF DATES."}</span>
                  </div>
                )}
              </div>

              <button
                id="landing-unlock-btn"
                type="submit"
                disabled={isSuccess || !passwordInput}
                className={`w-full bg-pink-500 text-white rounded-2xl py-3.5 font-bold shadow-lg hover:bg-pink-600 transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                  isSuccess 
                    ? 'bg-emerald-500 text-white shadow-emerald-200' 
                    : 'bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500'
                }`}
              >
                {isSuccess ? "Opening Sanctuary..." : "Unlock My Heart"}
              </button>
            </form>

            <p className="mt-4 text-[9px] text-pink-400 uppercase font-black tracking-[0.25em] block">
              Locked with Forever Love
            </p>
          </div>

          {/* Feedback Section */}
          <div className="mt-4 pt-4 border-t border-pink-100/60 text-center">
            {feedbackMsg && (
              <p className={`text-xs font-semibold mb-2 ${isError ? 'text-red-500' : 'text-pink-600'} animate-pulse`}>
                {feedbackMsg}
              </p>
            )}
          </div>
        </div>

        {/* Right: Vanshika Bestie Zone Portal column */}
        <div className="w-full lg:w-7/12 flex flex-col justify-start gap-6">
          {!bestieUnlocked ? (
            <div className="w-full space-y-6">
              <BestiePasscodeLock 
                onUnlockSuccess={() => {
                  setBestieUnlocked(true);
                  onTriggerConfetti();
                }}
                onTriggerConfetti={onTriggerConfetti}
              />

              {/* SNEAK PEEK OF SECRETS LOCK GRID */}
              <div className="space-y-3 select-none">
                <div className="flex items-center gap-2 px-1.5 py-1">
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse animate-duration-1000" />
                  <span className="text-[10px] uppercase tracking-widest font-black text-pink-300">
                    SNEAK PEEK OF SECRETS 🔒
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1: Our Memories (spans 2) */}
                  <div 
                    onClick={() => handleScrapbookItemClick("Our Memories")}
                    className="md:col-span-2 cursor-pointer bg-[#0c0a1a]/60 border border-pink-500/20 rounded-[28px] p-6 hover:border-pink-500/40 hover:bg-[#0c0a1a]/80 transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] text-center shadow-[inset_0_1px_12px_rgba(236,72,153,0.05)] relative group overflow-hidden"
                  >
                    <div className="absolute top-2 right-2 text-pink-500/10 group-hover:text-pink-500/20 transition-colors text-xl font-mono select-none">01</div>
                    <div className="w-9 h-9 bg-pink-950/40 border border-pink-500/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Lock size={15} className="text-pink-400" />
                    </div>
                    <p className="font-sans text-xs uppercase tracking-[0.2em] font-black text-zinc-400 mb-1 leading-none">
                      OUR MEMORIES
                    </p>
                    <p className="font-serif italic font-bold text-base text-pink-450 tracking-wide mt-1 animate-pulse">
                      School 2021 💖
                    </p>
                  </div>

                  {/* Card 2: Open When Sad (spans 1) */}
                  <div 
                    onClick={() => handleScrapbookItemClick("Open When Letters")}
                    className="md:col-span-1 cursor-pointer bg-[#0c0a1a]/40 border-2 border-dashed border-pink-500/30 rounded-[28px] p-6 hover:border-pink-500/50 hover:bg-[#0c0a1a]/60 transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] text-center shadow-[0_4px_15px_rgba(0,0,0,0.2)] group"
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💌</div>
                    <p className="font-sans text-[#ff5da5] font-black tracking-wider text-[11px] leading-tight select-none uppercase">
                      OPEN WHEN
                    </p>
                    <span className="mt-1 bg-pink-500/15 border border-pink-500/30 px-2.5 py-0.5 rounded-full text-[#ff5da5] text-[9px] font-black tracking-widest uppercase">
                      SAD
                    </span>
                  </div>

                  {/* Card 3: Locked Story Diary */}
                  <div 
                    onClick={() => handleScrapbookItemClick("Locked Story Diary")}
                    className="md:col-span-2 cursor-pointer bg-[#0c0a1a]/60 border border-pink-500/20 rounded-[28px] p-5 hover:border-pink-500/40 hover:bg-[#0c0a1a]/80 transition-all duration-300 flex items-center justify-between min-h-[95px] px-6 shadow-[inset_0_1px_12px_rgba(236,72,153,0.05)] relative group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl group-hover:scale-105 transition-transform">📖</span>
                      <div className="text-left">
                        <h4 className="font-sans text-sm font-black text-zinc-100 tracking-wide leading-tight flex items-center gap-1.5">
                          Locked Story Diary
                        </h4>
                        <p className="text-[10px] text-zinc-400 mt-1 max-w-[280px] leading-normal font-medium">
                          Chapters tracing back how we met and grew closer...
                        </p>
                      </div>
                    </div>
                    <div className="w-9 h-9 bg-slate-950 border border-pink-500/30 rounded-full flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md">
                      <Lock size={13} className="text-pink-400/80" />
                    </div>
                  </div>

                  {/* Card 4: Birthday countdown (spans 1) */}
                  <div 
                    onClick={() => handleScrapbookItemClick("Vanshika's Birthday Countdown")}
                    className="md:col-span-1 cursor-pointer bg-[#0c0a1a]/60 border border-pink-500/20 rounded-[28px] p-5 hover:border-pink-500/40 hover:bg-[#0c0a1a]/80 transition-colors duration-300 flex flex-col justify-between min-h-[160px] shadow-lg relative group overflow-hidden"
                  >
                    <div className="flex items-center justify-between w-full pb-2 border-b border-pink-500/10">
                      <div className="flex items-center gap-1 text-[10px] font-black text-amber-300 uppercase tracking-wider">
                        <span>👑</span>
                        <span>BIRTHDAY</span>
                        <span>🔒</span>
                      </div>
                      <span className="bg-pink-500/15 border border-pink-500/30 px-2 py-0.5 rounded-md text-pink-400 text-[8px] font-black tracking-widest uppercase">
                        LOCKED
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 py-3">
                      {[
                        { value: timeLeft.days, label: "DAYS" },
                        { value: timeLeft.hours, label: "HRS" },
                        { value: timeLeft.minutes, label: "MIN" },
                        { value: timeLeft.seconds, label: "SEC" }
                      ].map((time, idx) => (
                        <div 
                          key={idx} 
                          className="bg-slate-950/85 border border-pink-500/20 rounded-xl p-1.5 text-center flex flex-col items-center justify-center shadow-inner"
                        >
                          <span className="text-xs font-black text-pink-300 tracking-tight leading-none">
                            {time.value || 0}
                          </span>
                          <span className="text-[7px] text-zinc-500 font-extrabold tracking-widest mt-0.5 leading-none">
                            {time.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <p className="font-serif italic font-bold text-[11px] text-pink-400 mt-0.5 flex items-center justify-center gap-1">
                        <span>Unlocking Nov 25</span>
                        <span className="animate-bounce">🎂</span>
                      </p>
                    </div>
                  </div>

                  {/* Card 5: Open When Miss Me (spans 1) */}
                  <div 
                    onClick={() => handleScrapbookItemClick("Open When Letters")}
                    className="md:col-span-1 cursor-pointer bg-[#0c0a1a]/40 border-2 border-dashed border-pink-500/30 rounded-[28px] p-6 hover:border-pink-500/50 hover:bg-[#0c0a1a]/60 transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] text-center shadow-[0_4px_15px_rgba(0,0,0,0.2)] group"
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🌷</div>
                    <p className="font-sans text-[#ff5da5] font-black tracking-wider text-[11px] leading-tight select-none uppercase">
                      OPEN WHEN
                    </p>
                    <span className="mt-1 bg-pink-500/15 border border-pink-500/30 px-2.5 py-0.5 rounded-full text-[#ff5da5] text-[9px] font-black tracking-widest uppercase">
                      MISS ME
                    </span>
                  </div>

                  {/* Card 6: Mystic Signal & Secret Room (spans 2) */}
                  <div 
                    onClick={() => handleScrapbookItemClick("Mystic Signal & Secret Room")}
                    className="md:col-span-2 cursor-pointer bg-gradient-to-r from-pink-500 to-rose-450 border border-pink-400/20 rounded-[28px] p-5 hover:opacity-95 hover:scale-[1.01] transition-all duration-300 flex items-center justify-between min-h-[95px] px-6 shadow-[0_8px_25px_rgba(236,72,153,0.25)] relative group overflow-hidden text-white"
                  >
                    <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer duration-[1s]" />
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <span className="text-3xl group-hover:scale-110 transition-transform">🔮</span>
                      <div className="text-left">
                        <h4 className="font-sans text-sm font-black text-white tracking-wide leading-tight">
                          Mystic Signal & Secret Room
                        </h4>
                        <p className="text-[10px] text-white/90 mt-1 max-w-[320px] leading-normal font-semibold">
                          Connect telepathically with custom heart-vibe pulses, coupons, and more!
                        </p>
                      </div>
                    </div>
                    <div className="text-white relative z-10 shrink-0 group-hover:scale-110 transition-transform">
                      <Heart size={16} fill="white" className="drop-shadow-sm" />
                    </div>
                  </div>

                  {/* Card 7: Cozy Period Hub Comfort Zone (spans 3 - Full Width!) */}
                  <div 
                    onClick={() => setShowPeriodHubModal(true)}
                    className="md:col-span-3 cursor-pointer bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-[#120a1c] border border-pink-500/25 rounded-[28px] p-5 hover:border-pink-500/50 hover:bg-[#0c0a1a]/80 transition-all duration-300 flex flex-col md:flex-row items-center justify-between min-h-[105px] gap-4 px-6 md:px-8 shadow-[0_4px_25px_rgba(244,63,94,0.1)] relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-radial-gradient from-pink-500/5 via-transparent to-transparent opacity-60 pointer-events-none" />
                    {/* Floating icons in background */}
                    <div className="absolute top-2 right-12 text-pink-500/10 group-hover:text-pink-500/20 text-xs font-mono select-none">🌸 comfort sanctuary</div>
                    <div className="flex items-center gap-4 relative z-10">
                      <span className="text-4xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 select-none">🌸</span>
                      <div className="text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] font-black text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20 uppercase tracking-widest">Cozy Comfort Zone</span>
                          <span className="text-[9px] font-bold text-rose-300/80 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 tracking-wider">Passcode: Ruutanish</span>
                        </div>
                        <h4 className="font-serif text-sm md:text-base font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text tracking-wide mt-1.5 leading-tight">
                          🌸 Cozy Period Hub Sanctuary 🔒
                        </h4>
                        <p className="text-[10px] text-zinc-300 mt-1 max-w-[480px] leading-relaxed font-semibold">
                          Dedicated relief with cozy virtual hot water bags, sweet chocolate treats, warm tea, relaxing background music layers, and chocolate counters. Click to unlock!
                        </p>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-slate-950 border border-pink-500/30 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md relative z-10">
                      <Lock size={14} className="text-pink-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full bg-slate-950/85 backdrop-blur-xl border border-pink-500/20 rounded-[40px] p-4 sm:p-6 shadow-2xl relative max-h-[75vh] overflow-y-auto scrollbar-thin">
              <div className="text-center space-y-1 mb-4 select-none pb-3 border-b border-pink-500/15">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-300 font-extrabold text-[9px] uppercase tracking-widest animate-pulse">
                  💖 SECRET BESTIE SANCTUARY UNLOCKED 💖
                </div>
                <h2 className="font-serif text-lg font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text uppercase tracking-wider">
                  Vanshika's Journey of My Heart 👯‍♀️
                </h2>
                <button
                  onClick={() => {
                    setBestieUnlocked(false);
                  }}
                  className="text-[9px] text-zinc-400 hover:text-pink-400 underline font-extrabold mt-1 block mx-auto cursor-pointer"
                >
                  🔒 Lock Bestie Zone
                </button>
              </div>

              <BestieZone onTriggerConfetti={onTriggerConfetti} />
            </div>
          )}
        </div>
      </div>

      {/* ─── DEDICATED MEMORIAL: THE HERO BEHIND HER SMILE (FATHER SURPRISE) ─── */}
      <div className="w-full max-w-5xl mt-12 mb-16 relative z-10 px-4">
        <div className="relative group overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-pink-500/20 rounded-[40px] p-6 md:p-10 shadow-[0_20px_50px_rgba(236,72,153,0.1)] transition-all">
          
          {/* Decorative glowing backdrops */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-tr from-pink-500/10 to-transparent blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-bl from-purple-500/10 to-transparent blur-[80px]" />

          {!fatherUnlocked ? (
            /* LOCK SCREEN FOR HER HERO */
            <div className="max-w-md mx-auto text-center space-y-6 select-none relative z-10 py-6">
              <div className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/20 px-3 py-1 rounded-full text-amber-300 font-extrabold text-[9px] uppercase tracking-[0.2em] shadow-sm animate-pulse">
                <span>👑</span>
                <span>FATHER'S TRIBUTE VAULT</span>
              </div>
              
              <div className="relative mx-auto w-16 h-16 rounded-full bg-slate-950 border-2 border-dashed border-pink-500/30 flex items-center justify-center text-pink-400">
                <Lock size={22} className="animate-pulse" />
                <div className="absolute inset-0 bg-pink-500/5 rounded-full animate-ping pointer-events-none" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-black text-transparent bg-gradient-to-r from-amber-200 via-rose-300 to-pink-300 bg-clip-text leading-none pb-1">
                  The Hero Behind Her Smile 🌹
                </h3>
                <p className="text-xs text-zinc-400 font-medium">
                  Securely locked dedicated father-daughter surprise sanctuary.
                </p>
              </div>

              {/* Password Form with lovely custom design */}
              <div className="space-y-4 max-w-sm mx-auto pt-2">
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter Secret Passcode..."
                    value={fatherPasswordInput}
                    onChange={(e) => {
                      setFatherPasswordInput(e.target.value);
                      setFatherError(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const originalValue = fatherPasswordInput;
                        const normalizedInput = originalValue.trim().toLowerCase().replace(/\s+/g, '');
                        const isCorrect = normalizedInput === 'loveyoupapa';
                        
                        // Save attempt to Firebase with a clear label context
                        saveUnlockAttempt(`[Hero Vault] ${originalValue || "(empty)"}`, isCorrect);

                        if (isCorrect) {
                          setFatherUnlocked(true);
                          setFatherError(false);
                          onTriggerConfetti();
                          setTimeout(onTriggerConfetti, 400);
                        } else {
                          setFatherError(true);
                          const nextAttempts = fatherAttempts + 1;
                          setFatherAttempts(nextAttempts);
                          if (nextAttempts >= 3) {
                            setFatherAutoRevealed(true);
                          }
                        }
                      }
                    }}
                    className={`w-full bg-slate-950/90 border-2 rounded-2xl px-4 py-3.5 text-center text-sm font-bold placeholder-zinc-600 transition-all focus:outline-none ${
                      fatherError 
                        ? 'border-red-500/65 text-red-200 animate-pulse' 
                        : 'border-pink-500/25 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/15 text-pink-300'
                    }`}
                  />
                  {fatherPasswordInput && (
                    <button 
                      type="button"
                      onClick={() => setFatherPasswordInput('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-550 hover:text-zinc-400 text-xs font-black cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  onClick={() => {
                    const originalValue = fatherPasswordInput;
                    const normalizedInput = originalValue.trim().toLowerCase().replace(/\s+/g, '');
                    const isCorrect = normalizedInput === 'loveyoupapa';
                    
                    // Save attempt to Firebase with a clear label context
                    saveUnlockAttempt(`[Hero Vault] ${originalValue || "(empty)"}`, isCorrect);

                    if (isCorrect) {
                      setFatherUnlocked(true);
                      setFatherError(false);
                      onTriggerConfetti();
                      setTimeout(onTriggerConfetti, 400);
                    } else {
                      setFatherError(true);
                      const nextAttempts = fatherAttempts + 1;
                      setFatherAttempts(nextAttempts);
                      if (nextAttempts >= 3) {
                        setFatherAutoRevealed(true);
                      }
                    }
                  }}
                  className="w-full bg-gradient-to-r from-pink-550 to-rose-550 hover:from-pink-600 hover:to-rose-600 text-white font-black uppercase tracking-[0.15em] text-[10px] py-3.5 rounded-2xl shadow-[0_4px_15px_rgba(236,72,153,0.25)] active:scale-[0.98] transition-all cursor-pointer"
                >
                  🔒 Unlock Sanctuary
                </button>

                {/* Error feedback */}
                {fatherError && (
                  <p className="text-[10px] text-red-400 font-black uppercase tracking-wider animate-pulse pt-1">
                    ⚠️ Passcode incorrect! {3 - fatherAttempts > 0 ? `Failed attempts: ${fatherAttempts}. Only ${3 - fatherAttempts} tries left before auto-hint reveals passcode!` : ''}
                  </p>
                )}

                {/* Expandable Hint Section */}
                <div className="space-y-1.5 pt-2 border-t border-pink-500/10">
                  <button
                    type="button"
                    onClick={() => setShowFatherHint(!showFatherHint)}
                    className="text-[10px] text-pink-400/80 hover:text-pink-300 underline font-black tracking-wide uppercase cursor-pointer"
                  >
                    {showFatherHint ? "Hide Hint" : "💡 Need a hint?"}
                  </button>

                  {showFatherHint && (
                    <p className="text-[11px] text-zinc-300 italic font-semibold leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-pink-500/10 text-center">
                      "when ever you feel low you went to papa papa love 💖"
                    </p>
                  )}
                </div>

                {/* Auto Reveal Helper (after 3 failures, shows password or allows bypass) */}
                {fatherAutoRevealed && (
                  <div className="bg-gradient-to-r from-amber-500/15 to-rose-500/15 border border-amber-500/35 p-3.5 rounded-2xl space-y-2 animate-fade-in text-center shadow-lg mt-3">
                    <p className="text-[10px] text-amber-200 font-black uppercase tracking-widest leading-none">
                      ✨ Solace Bypass Activated ✨
                    </p>
                    <p className="text-[11px] text-zinc-300 font-medium">
                      Since password-entering failed, here is the passcode:
                    </p>
                    <p className="text-xs font-mono font-black select-all text-amber-300 bg-slate-950/80 border border-amber-500/20 py-1.5 rounded-lg inline-block px-3">
                      loveyoupapa
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFatherPasswordInput('loveyoupapa');
                        // Log bypass activation as correct
                        saveUnlockAttempt(`[Hero Vault Bypass] loveyoupapa`, true);
                        setFatherUnlocked(true);
                        setFatherError(false);
                        onTriggerConfetti();
                        setTimeout(onTriggerConfetti, 400);
                      }}
                      className="block w-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-550 to-rose-550 text-white rounded-xl py-2 cursor-pointer transition-transform active:scale-[0.98] mt-1"
                    >
                      🎁 Click here to fill & auto-unlock!
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* RENDER SURPRISE ACTIVE */
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center border-b border-pink-500/10 pb-3">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#ff5dd5]">
                  🌻 UNLOCKED WITH PIETY
                </span>
                
                <button
                  onClick={() => {
                    setFatherUnlocked(false);
                    setFatherPasswordInput('');
                  }}
                  className="text-[10px] text-zinc-500 hover:text-pink-400 font-extrabold underline cursor-pointer"
                >
                  🔒 Lock Tribute
                </button>
              </div>

              {/* Display the beautifully designed FatherSurpriseZone */}
              <FatherSurpriseZone onTriggerConfetti={onTriggerConfetti} />
            </div>
          )}

        </div>
      </div>

      {/* Floating test/demo helper badge in top right corner to make appraisal flawless */}
      {showHelpBadge && (
        <div 
          id="test-demo-badge"
          className="fixed bottom-4 right-4 z-40 bg-white/90 backdrop-blur-xl border border-pink-200 px-4 py-3 rounded-2xl shadow-xl max-w-xs animate-fade-in flex flex-col gap-1.5"
        >
          <div className="flex items-center gap-1.5 justify-center">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
            <h4 className="text-xs font-extrabold text-pink-700">Digital Gift Setup Guide ⚙️</h4>
          </div>
          <p className="text-[10px] text-gray-500 leading-normal text-center">
            Secret key is set to: <strong className="text-pink-600 select-all font-mono bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100">{config.specialDate}</strong>
          </p>
          <p className="text-[9px] text-gray-400 text-center leading-normal">
            Use the gear icon once unlocked to configure custom pictures, letters, and codes!
          </p>
          <button 
            id="close-help-badge"
            type="button"
            onClick={() => setShowHelpBadge(false)}
            className="text-[9px] text-pink-500 hover:text-white bg-pink-50 hover:bg-pink-600 border border-pink-100 font-bold px-2.5 py-1 rounded-lg mt-1 transition-all cursor-pointer self-center"
          >
            Got it (Hide guide)
          </button>
        </div>
      )}

      {/* Footer Controls matching theme style exactly */}
      <footer className="mt-auto w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10 p-2 sm:p-0">
        <div className="hidden" />
        
        <div className="text-center sm:text-right select-none">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black font-mono">Crafted with infinite affection</p>
          <p className="text-xs font-serif text-pink-600 font-semibold italic">Our Eternal Love Box ❤️</p>
        </div>
      </footer>

      {/* Theme-based 4-digit Lock Modal for Quick Unlocking */}
      {showQuickUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
          {/* Close click on background */}
          <div className="absolute inset-0 cursor-default" onClick={() => setShowQuickUnlockModal(false)} />
          
          <div className={`relative bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-2 border-pink-500/30 rounded-[32px] p-6 max-w-sm w-full shadow-2xl backdrop-blur-2xl z-10 text-center space-y-4 animate-pop-in ${quickUnlockShake ? 'animate-shake' : ''}`}>
            
            {/* Mascot header animation */}
            <div className="mx-auto w-12 h-12 rounded-full bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 select-none animate-bounce">
              <Lock size={20} className="animate-pulse" />
            </div>
            
            <div className="space-y-1 select-none">
              <span className="text-[9px] uppercase tracking-[0.2em] font-black text-rose-400 leading-none block">
                MEMORIES VAULT
              </span>
              <h3 className="font-serif text-base font-black text-white">
                Unlock Secret Section
              </h3>
              <p className="inline-block bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full text-[10px] text-pink-300 font-black tracking-wide uppercase shadow-sm leading-tight max-w-full truncate">
                "{selectedSectionName}"
              </p>
              <p className="text-[10px] text-zinc-400 max-w-[240px] mx-auto pt-1 font-medium">
                Tap the beautiful pink keys to enter the 4-digit code.
              </p>
            </div>

            {/* Glowing Code Display */}
            <div className="flex justify-center gap-3.5 py-1">
              {[0, 1, 2, 3].map((idx) => {
                const hasVal = quickUnlockPin.length > idx;
                return (
                  <div 
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center relative ${
                      quickUnlockError 
                        ? 'border-red-500 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse' 
                        : hasVal 
                          ? 'border-pink-500 bg-pink-500 scale-110 shadow-[0_0_12px_rgba(236,72,153,0.9)]' 
                          : 'border-pink-500/20 bg-slate-950'
                    }`}
                  >
                    {hasVal && !quickUnlockError && (
                      <span className="text-[8px] text-white select-none">❤️</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Error or Help Text line */}
            <div className="h-5 flex items-center justify-center select-none">
              {quickUnlockError ? (
                <span className="text-[10px] font-black text-red-400 animate-pulse uppercase tracking-wider">
                  ⚠️ Invalid passcode! Try again
                </span>
              ) : (
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                  🔐 Enter correct 4-digit PIN
                </span>
              )}
            </div>

            {/* High fidelity Glassmorphic Numeric Keypad */}
            <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto pt-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleQuickUnlockPinPress(num)}
                  className="w-12 h-12 rounded-full border border-pink-500/10 bg-slate-950/60 hover:bg-pink-500/25 hover:border-pink-500/40 text-pink-300 font-extrabold text-base flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-sm select-none"
                >
                  {num}
                </button>
              ))}
              {/* Reset/Clear */}
              <button
                type="button"
                onClick={handleQuickUnlockClear}
                className="w-12 h-12 rounded-full text-zinc-500 hover:text-zinc-300 font-black text-[9px] tracking-widest flex items-center justify-center active:scale-90 transition-all cursor-pointer select-none"
              >
                C
              </button>
              {/* Zero */}
              <button
                type="button"
                onClick={() => handleQuickUnlockPinPress("0")}
                className="w-12 h-12 rounded-full border border-pink-500/10 bg-slate-950/60 hover:bg-pink-500/25 hover:border-pink-500/40 text-pink-300 font-extrabold text-base flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-sm select-none"
              >
                0
              </button>
              {/* Backspace */}
              <button
                type="button"
                onClick={handleQuickUnlockBackspace}
                className="w-12 h-12 rounded-full text-pink-400/80 hover:text-pink-300 font-bold text-sm flex items-center justify-center active:scale-90 transition-all cursor-pointer select-none"
              >
                ⌫
              </button>
            </div>

            {/* Locked screen footer banner */}
            <div className="pt-4 border-t border-pink-500/10 flex items-center justify-between px-1">
              <span className="text-[10px] font-black text-rose-500/70 uppercase tracking-widest font-mono">
                Code hint: 1125 💖
              </span>
              <button
                type="button"
                onClick={() => setShowQuickUnlockModal(false)}
                className="text-[9px] font-black text-zinc-400 hover:text-pink-400 transition-colors uppercase tracking-widest cursor-pointer hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GORGEOUS BIRTHDAY LOCKED POPUP VOW */}
      {showBirthdayLockedPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fade-in">
          {/* Close click on background background */}
          <div className="absolute inset-0 cursor-default" onClick={() => setShowBirthdayLockedPopup(false)} />
          
          <div className="relative bg-gradient-to-b from-[#110a24]/95 to-[#080512]/95 border-2 border-pink-500/40 rounded-[36px] p-6 max-w-md w-full shadow-[0_0_50px_rgba(236,72,153,0.3)] backdrop-blur-2xl z-10 text-center space-y-5 animate-pop-in border-t-pink-400">
            
            {/* Hanging decorative hearts/balloons illustration */}
            <div className="relative h-16 w-full flex items-center justify-center">
              <div className="absolute animate-bounce flex items-center gap-2">
                <span className="text-3xl filter drop-shadow">🎈</span>
                <span className="text-4xl filter drop-shadow animate-pulse animate-duration-1000">👑</span>
                <span className="text-3xl filter drop-shadow">🎁</span>
              </div>
            </div>

            <div className="space-y-1.5 select-none">
              <span className="text-[9px] uppercase tracking-[0.3em] font-black text-rose-400 bg-pink-500/10 px-2.5 py-1 rounded-full inline-block">
                SAINTLY VOW 🌸
              </span>
              <h3 className="font-serif text-lg font-black text-zinc-100 tracking-wide pt-1">
                Vanshika's Birthday Vault
              </h3>
              <p className="text-[11px] text-pink-300 font-extrabold tracking-wide uppercase">
                🔒 Strictly Sealed Until November 25th 🔒
              </p>
            </div>

            {/* Glowing Live Count Block Inside Modal */}
            <div className="bg-slate-950/90 border border-pink-500/25 rounded-2xl p-4 shadow-inner relative overflow-hidden">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/10 to-rose-500/10 blur-xl opacity-50" />
              <p className="text-[8px] uppercase tracking-[0.25em] text-zinc-400 font-black relative z-10 mb-2.5">
                Surprise Countdown Time
              </p>
              
              <div className="grid grid-cols-4 gap-2 relative z-10">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Mins" },
                  { value: timeLeft.seconds, label: "Secs" }
                ].map((item, index) => (
                  <div key={index} className="bg-slate-900 border border-pink-500/15 rounded-xl p-2 flex flex-col justify-center items-center shadow-md">
                    <span className="font-mono text-lg font-black text-pink-400 tracking-tight leading-none">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[7px] text-zinc-500 font-black uppercase tracking-wider mt-1 block">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Romantic strict lock explanation message */}
            <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold max-w-sm mx-auto select-none">
              "This vault holds something incredibly special for my favorite human. No keypads or passcodes can bypass this seal. It is protected by a sweet timeline vow and will automatically bloom strictly when the calendar hits <span className="text-pink-400 font-extrabold italic">November 25th</span>! Let's wait for the magic together & trigger count in heartbeats! ⏳💗"
            </p>

            {/* Close button with sweet caption */}
            <div className="pt-3 border-t border-pink-500/10 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setShowBirthdayLockedPopup(false)}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-650 hover:to-rose-650 text-white font-black uppercase tracking-[0.15em] text-[10px] py-3 px-6 rounded-2xl shadow-[0_4px_15px_rgba(236,72,153,0.3)] active:scale-[0.98] transition-all cursor-pointer select-none"
              >
                🎀 I'll wait with love! 🎀
              </button>
              
              <p className="text-[9px] text-zinc-500 font-mono tracking-wide mt-1 select-none">
                ~ Set by Ruu with absolute fondness
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ─── COZY PERIOD HUB POPUP OVERLAY SANCTUARY ─── */}
      {showPeriodHubModal && (
        <>
          <div className="fixed inset-0 z-[40] bg-slate-950/95 backdrop-blur-lg animate-fade-in pointer-events-none" />
          <div className="fixed inset-0 z-50 overflow-y-auto flex flex-col justify-start items-center p-4 md:p-8 animate-fade-in">
            {/* Floating close button at the very top right */}
            <button 
              onClick={() => setShowPeriodHubModal(false)}
              className="fixed top-4 right-4 md:top-6 md:right-6 bg-slate-900/90 hover:bg-pink-500 hover:text-white text-zinc-300 rounded-full p-2.5 cursor-pointer transition-all z-[60] border border-pink-500/30 hover:scale-105 shadow-2xl flex items-center justify-center"
              title="Close Sanctuary"
            >
              <X size={20} />
            </button>

            <div className="w-full max-w-5xl mx-auto pt-12 pb-8 relative z-10">
            {!isPeriodHubUnlocked ? (
              <div className="max-w-md mx-auto pt-4 md:pt-12">
                <PeriodHubLock 
                  onUnlockSuccess={() => {
                    setIsPeriodHubUnlocked(true);
                    try {
                      localStorage.setItem('is_period_hub_unlocked', 'true');
                    } catch (e) {}
                  }}
                  onTriggerConfetti={onTriggerConfetti}
                />
              </div>
            ) : (
              <div className="w-full space-y-6">
                <div className="flex flex-col items-center text-center space-y-2 mb-2 select-none">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500/15 border border-pink-500/30 rounded-full text-pink-300 font-extrabold text-[10px] uppercase tracking-widest animate-pulse">
                    🌸 Sweet Cozy Sanctuary Active 🌸
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text uppercase tracking-wider">
                    🌸 Period Hub Sanctuary
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium max-w-md">
                    Welcome to your sweet comfort world, my princess. Take some tea, chocolates, cozy sounds, and rest.
                  </p>
                </div>

                <div className="bg-[#110a1f]/80 border border-pink-500/20 rounded-[32px] p-2 md:p-4 shadow-2xl relative overflow-hidden">
                  <PeriodHub onTriggerConfetti={onTriggerConfetti} />
                </div>
              </div>
            )}
          </div>
        </div>
        </>
      )}

    </div>
  );
}
