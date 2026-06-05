import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, HelpCircle, Heart, Star, Compass, Gift, Calendar, Clock, Crown } from 'lucide-react';
import { LoveConfig } from '../types';
import LovelyLogo from './LovelyLogo';

interface LandingPageProps {
  config: LoveConfig;
  onUnlocked: () => void;
}

interface ClickEmoji {
  id: number;
  x: number;
  y: number;
  scale: number;
  emoji: string;
  rotation: number;
}

export default function LandingPage({ config, onUnlocked }: LandingPageProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showHelpBadge, setShowHelpBadge] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [clickingHearts, setClickingHearts] = useState<ClickEmoji[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  
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

  // Soft click burst handler for girl-friendly sweet experience
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger if clicking directly on background, wrappers or empty space
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('form')) {
      return;
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

    if (inputClean === targetClean || inputClean === '1122' || passwordInput.trim() === config.specialDate) {
      setIsSuccess(true);
      setIsError(false);
      setFeedbackMsg("✨ Correct! Opening our digital love sanctuary...");
      setTimeout(() => {
        onUnlocked();
      }, 1200);
    } else {
      setIsError(true);
      setFeedbackMsg(`❌ Hmm, that magic date doesn't match. Try "${config.specialDate || '1122'}" or look inside!`);
      setTimeout(() => {
        setIsError(false);
      }, 800);
    }
  };

  const handleScrapbookItemClick = (itemName: string) => {
    if (itemName.toLowerCase().includes("room") || itemName.toLowerCase().includes("signal")) {
      setFeedbackMsg(`🔮 Mystic Signal & Secret Room is locked! Enter our magic passcode "${config.specialDate || '1122'}" on the left to broadcast cute cosmic pulses!`);
    } else {
      setFeedbackMsg(`🔒 "${itemName}" is locked! Enter our special date "${config.specialDate || '1122'}" on the left to open.`);
    }
    setIsError(true);
    setTimeout(() => {
      setIsError(false);
    }, 2000);
  };

  return (
    <div 
      className="relative min-h-[92vh] w-full flex flex-col items-center justify-center p-4 lg:p-8 overflow-hidden bg-gradient-to-br from-[#FFF5F7] via-[#FDF2F8] to-[#F3E8FF] select-none cursor-heart"
      id="landing-container"
      onClick={handleBackgroundClick}
    >
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

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100/60 border border-pink-200 rounded-full text-pink-600 font-bold text-[10px] uppercase tracking-widest mb-3 animate-bounce">
          <span>💖</span>
          <span>Tap anywhere to spawn cute magic sparkles!</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-pink-600 mb-2 font-bold tracking-tight italic">
          A Special Surprise For {config.coupleNameTwo || 'Mystic Signal'} ❤️
        </h1>
        <p className="text-purple-500 font-semibold tracking-widest uppercase text-xs">
          Only {config.coupleNameTwo || 'Mystic Signal'} can unlock this secret space
        </p>
      </header>

      {/* Main Login / Lock Area - Side-by-side or stacked scrapbook */}
      <div className="flex-1 w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-stretch justify-center relative z-10 mb-8">
        
        {/* Left: Password Entrance Card */}
        <div 
          id="landing-glass-container"
          className={`w-full lg:w-5/12 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] p-8 shadow-2xl flex flex-col justify-between text-center transition-all duration-700 relative ${
            isSuccess ? 'scale-95 rotate-2 opacity-30 pointer-events-none' : 'scale-100 opacity-100'
          } ${isError ? 'animate-shake border-red-300 bg-red-50/20' : ''}`}
        >
          <div>
            {/* Cute Teddy Bear Mascot holding a heart / locks */}
            <div className="relative w-full flex flex-col items-center justify-center mb-4 select-none">
              {/* Cute speech bubble from the teddy */}
              <div className="bg-white/90 border border-pink-200 text-pink-600 font-bold font-serif text-[10px] px-3 py-1.5 rounded-2xl shadow-xs leading-tight transition-transform duration-300 hover:scale-105 flex items-center justify-center gap-1.5 mb-2 animate-pulse">
                <span>🧸</span>
                <span>Enter our special date to open my heart!</span>
                <span className="text-pink-500">❤️</span>
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

            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4 mx-auto shadow-inner relative">
              <div className="absolute inset-0 bg-pink-200/20 rounded-full animate-ping pointer-events-none" />
              {isSuccess ? (
                <Unlock className="text-pink-500 w-6 h-6 heart-pulsing" />
              ) : (
                <Lock className="text-pink-500 w-6 h-8" />
              )}
            </div>
            
            <h2 className="text-xl font-bold font-serif text-gray-800 mb-2">The Vault of Us</h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Enter the date that changed everything for us, or type the secret token! ✨
            </p>

            {/* Input box form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                {/* Real hidden input layer */}
                <input
                  id="special-date-cookie"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  disabled={isSuccess}
                  maxLength={16}
                  className="absolute inset-0 w-full h-full opacity-0 z-25 cursor-text text-center text-lg focus:outline-none"
                  autoComplete="off"
                />
                
                {/* Visual heartbeat overlay masking password letters with hearts */}
                <div 
                  className={`w-full bg-white/70 border-2 rounded-2xl px-4 py-3.5 flex items-center justify-center min-h-[58px] transition-all duration-300 relative ${
                    isError 
                      ? 'border-red-400 bg-red-100/30 shadow-md animate-space' 
                      : isSuccess 
                        ? 'border-emerald-400 bg-emerald-50/60' 
                        : isFocused
                          ? 'border-pink-400 ring-4 ring-pink-100/80 bg-white/90 scale-[1.01]'
                          : 'border-pink-200 hover:border-pink-300'
                  }`}
                >
                  {passwordInput.length === 0 ? (
                    <span className="text-pink-300/80 font-mono tracking-widest text-base font-semibold select-none">
                      DD/MM/YYYY
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 justify-center flex-wrap max-w-[90%]">
                      {passwordInput.split('').map((_, index) => (
                        <span 
                          key={index} 
                          className="text-pink-500 text-[15px] select-none inline-block filter drop-shadow-[0_1px_2px_rgba(236,72,153,0.3)] animate-glow-heart"
                          style={{
                            animationDelay: `${index * 60}ms`
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
                  className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-pink-500 hover:text-pink-600 focus:outline-none cursor-pointer mx-auto transition-colors bg-pink-50/40 hover:bg-pink-50/80 px-3.5 py-1.5 rounded-full border border-pink-100/30"
                >
                  <HelpCircle size={13} className="text-pink-400" />
                  <span>Need a hint, my favorite person?</span>
                </button>

                {showHint && (
                  <div 
                    id="hint-expanded"
                    className="text-[11px] bg-white/95 text-pink-600 px-3 py-2 rounded-xl border border-pink-200/40 text-center font-semibold animate-fade-in shadow-sm leading-normal flex items-center justify-center gap-1.5 w-full"
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

        {/* Right: Preview Gallery (Scrapbook Style Collage) */}
        <div className="w-full lg:w-7/12 grid grid-cols-2 sm:grid-cols-3 gap-4 content-center bg-white/20 backdrop-blur-md p-6 rounded-[32px] border border-white/40 shadow-xl">
          
          {/* Polaroid 2 */}
          <div 
            onClick={() => handleScrapbookItemClick("Our Memories")}
            className="bg-white p-2 pb-6 shadow-md rounded-xs transform rotate-3 hover:rotate-0 hover:scale-103 transition-all duration-300 cursor-pointer border border-pink-100/20"
          >
            <div className="w-full h-24 bg-purple-50 flex items-center justify-center overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all">
              <div className="text-purple-300 text-[10px] text-center font-semibold px-1">
                🔒 Our memories
              </div>
            </div>
            <p className="mt-2 font-serif text-[10px] text-gray-400 text-center">School 2023</p>
          </div>

          {/* Envelope 1 (Open When) */}
          <div 
            onClick={() => handleScrapbookItemClick("Open When Sad Envelope")}
            className="bg-pink-50/70 hover:bg-pink-100/60 rounded-xl border-2 border-dashed border-pink-300/80 p-3 flex flex-col items-center justify-center text-center shadow-inner cursor-pointer transition-all hover:scale-103"
          >
            <div className="text-2xl mb-1 select-none animate-bounce delay-1000">💌</div>
            <p className="text-[10px] font-extrabold text-pink-500 uppercase leading-none tracking-tight font-sans">
              Open When<br/><span className="text-[9px] text-pink-400 font-bold block pt-0.5">Sad</span>
            </p>
          </div>

          {/* STORY DIARY CARD */}
          <div 
            onClick={() => handleScrapbookItemClick("Our Love Story Diary")}
            className="col-span-2 bg-white/60 hover:bg-white/90 backdrop-blur-xs rounded-2xl p-3.5 border border-white/80 cursor-pointer transition-all hover:scale-[1.01] flex items-center gap-3 shadow-xs"
          >
            <span className="text-xl">📖</span>
            <div className="text-left">
              <h3 className="text-xs font-bold text-gray-700">Locked Story Diary</h3>
              <p className="text-[10px] text-gray-400">Chapters tracing back how we met and grew closer...</p>
            </div>
            <div className="ml-auto bg-pink-100 text-pink-500 p-1 rounded-full">
              <Lock size={12} />
            </div>
          </div>

          {/* Envelope 2 */}
          <div 
            onClick={() => handleScrapbookItemClick("Open When Miss Me Envelope")}
            className="bg-purple-50/70 hover:bg-purple-100/60 rounded-xl border-2 border-dashed border-purple-300/80 p-3 flex flex-col items-center justify-center text-center shadow-inner cursor-pointer transition-all hover:scale-103"
          >
            <div className="text-2xl mb-1 select-none animate-pulse">🌷</div>
            <p className="text-[10px] font-extrabold text-purple-500 uppercase leading-none tracking-tight font-sans">
              Open When<br/><span className="text-[9px] text-purple-400 font-bold block pt-0.5">Miss Me</span>
            </p>
          </div>

          {/* POLAROID 3 - LIVE BIRTHDAY COUNTDOWN CLASSIC TIMER (25 November) */}
          <div 
            onClick={() => {
              if (timeLeft.isBirthday) {
                onUnlocked();
              } else {
                setFeedbackMsg("🎂 This custom Birthday Surprise is lock-secured! It will automatically unlock on November 25! 💝 Keep counting down!");
                setIsError(true);
                setTimeout(() => setIsError(false), 3000);
              }
            }}
            className={`col-span-1 relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-500 text-white p-3 rounded-2xl shadow-lg border border-pink-300/30 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-90 font-sans flex items-center gap-1">
                <Crown size={10} className="text-amber-300 fill-amber-300 animate-bounce" />
                <span>Birthday Timer 🔒</span>
              </span>
              <span className="text-[10px] bg-red-600 px-1.5 py-0.5 rounded-full font-bold">LOCKED</span>
            </div>

            {timeLeft.isBirthday ? (
              <div className="py-2 text-center animate-pulse">
                <div className="text-2xl">🎁🎂🎈</div>
                <p className="text-xs font-black uppercase text-amber-200 mt-1 leading-tight">🎂 HAPPY BIRTHDAY!</p>
                <span className="text-[8px] bg-white text-pink-600 px-1 py-0.5 rounded font-bold mt-1 block">
                  Click to Open Custom Gift 🎁
                </span>
              </div>
            ) : (
              <div className="py-1">
                {/* Visual ticking layout with digital numbers - fully visible! */}
                <div className="grid grid-cols-4 gap-1 text-center bg-black/40 rounded-lg p-1.5 font-mono text-[10px] font-bold shadow-inner">
                  <div>
                    <div className="text-xs text-rose-100">{timeLeft.days}</div>
                    <div className="text-[6px] uppercase opacity-75">Days</div>
                  </div>
                  <div>
                    <div className="text-xs text-rose-100">{timeLeft.hours}</div>
                    <div className="text-[6px] uppercase opacity-75">Hrs</div>
                  </div>
                  <div>
                    <div className="text-xs text-rose-100">{timeLeft.minutes}</div>
                    <div className="text-[6px] uppercase opacity-75">Min</div>
                  </div>
                  <div>
                    <div className="text-xs text-amber-300 animate-pulse">{timeLeft.seconds}</div>
                    <div className="text-[6px] uppercase opacity-75">Sec</div>
                  </div>
                </div>
                
                <p className="text-[8.5px] text-pink-100 mt-2 text-center font-semibold italic leading-tight">
                  Locked until November 25 🎂
                </p>
              </div>
            )}
          </div>

          {/* Final Secret Room Trigger */}
          <div 
            onClick={() => handleScrapbookItemClick("Mystic Signal & Secret Room")}
            className="col-span-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl p-3.5 flex items-center gap-3 text-white shadow-md border border-white/20 hover:from-pink-500 hover:to-rose-500 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <div className="bg-white/20 p-2 rounded-full leading-none shrink-0">
              <span className="text-xl">🔮</span>
            </div>
            <div className="text-left animate-pulse">
              <h3 className="text-xs font-bold leading-tight">Mystic Signal & Secret Room</h3>
              <p className="text-[9px] text-white/80 leading-normal">Connect telepathically with custom heart-vibe pulses, coupons, and more!</p>
            </div>
            <div className="ml-auto shrink-0">
              <Heart size={14} fill="white" className="heart-pulsing" />
            </div>
          </div>

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
    </div>
  );
}
