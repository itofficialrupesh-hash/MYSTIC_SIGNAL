import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { saveUnlockAttempt } from '../firebase';

interface PeriodHubLockProps {
  onUnlockSuccess: () => void;
  onTriggerConfetti: () => void;
}

export default function PeriodHubLock({ onUnlockSuccess, onTriggerConfetti }: PeriodHubLockProps) {
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(6);

  // Auto-unlock on 3rd attempt
  useEffect(() => {
    if (attempts >= 3) {
      // Double trigger confetti for the lovely effort
      onTriggerConfetti();
      const confettiTimer = setTimeout(() => {
        onTriggerConfetti();
      }, 400);

      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            onTriggerConfetti();
            onUnlockSuccess();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(confettiTimer);
        clearInterval(interval);
      };
    }
  }, [attempts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const cleanedPassword = password.trim();
    // Case-insensitive match for extra safety, so they don't get locked out due to typos
    const isCorrect = cleanedPassword.toLowerCase() === 'ruutanish';

    // Log the unlock attempt to Firebase Firestore for real-time engagement and monitoring
    try {
      saveUnlockAttempt(`Period Hub Password: ${cleanedPassword}`, isCorrect).catch(err => {
        console.error("Firebase save Period Hub unlock error:", err);
      });
    } catch (err) {}

    setTimeout(() => {
      setIsSubmitting(false);
      if (isCorrect) {
        onTriggerConfetti();
        // Double confetti splash
        setTimeout(onTriggerConfetti, 350);
        onUnlockSuccess();
      } else {
        setIsError(true);
        setShake(true);
        setAttempts(prev => prev + 1);
        setTimeout(() => {
          setShake(false);
        }, 600);
      }
    }, 450);
  };

  const handleForceUnlock = () => {
    onTriggerConfetti();
    setTimeout(onTriggerConfetti, 300);
    onUnlockSuccess();
  };

  return (
    <div className="relative w-full max-w-lg mx-auto p-1 select-none">
      {/* Styles for shake animation */}
      <style>{`
        @keyframes shakeEffect {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake-period {
          animation: shakeEffect 0.5s ease-in-out;
          border-color: rgba(244, 63, 94, 0.6) !important;
          box-shadow: 0 0 25px rgba(244, 63, 94, 0.2) !important;
        }
      `}</style>

      {/* Floating Sparkles and Card Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-tr from-[#1b0d26]/90 via-[#271537]/90 to-[#14061f]/95 border border-pink-500/20 shadow-[0_0_50px_rgba(244,63,94,0.15)] text-center space-y-6 backdrop-blur-md transition-all duration-300 ${
          shake ? 'animate-shake-period' : ''
        }`}
      >
        {/* Decorative Falling Elements in Background of lock */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
          <div className="absolute top-10 left-10 text-pink-400 text-lg animate-bounce">🌸</div>
          <div className="absolute bottom-12 right-12 text-purple-400 text-lg animate-pulse" style={{ animationDelay: '1s' }}>💖</div>
          <div className="absolute top-1/2 left-3/4 text-rose-300 text-sm animate-ping" style={{ animationDelay: '0.5s' }}>✨</div>
        </div>

        {/* Cute Teddy Bear Mascot holding a heart / locks */}
        <div className="relative w-full flex flex-col items-center justify-center mb-4 select-none z-10">
          {/* Cute speech bubble from the teddy */}
          <div className="bg-slate-950/90 border border-pink-500/30 text-pink-300 font-bold font-serif text-[11px] px-4 py-2 rounded-2xl shadow-lg leading-tight transition-transform duration-300 hover:scale-105 flex items-center justify-center gap-1.5 mb-3 animate-pulse">
            <span>🧸</span>
            <span>
              {attempts >= 3 
                ? "Aww, don't worry my baby! Main hnn na aapke sath! ❤️" 
                : "My Princess, enter the passcode to unlock your chocolates & hugs! 🍫"}
            </span>
          </div>
          
          {/* Animated Teddy Emojis & popping heart sparkles */}
          <div className="relative text-7xl select-none py-1 cursor-pointer hover:scale-110 transition-transform duration-300">
            🧸
            {/* Popping hearts */}
            <span className="absolute -top-1 -left-3 text-2xl animate-pulse">💖</span>
            <span className="absolute top-1 -right-4 text-xl animate-ping opacity-75">💕</span>
            <span className="absolute -right-2 bottom-1 text-2xl animate-bounce" style={{ animationDelay: '300ms' }}>💝</span>
            <span className="absolute -left-4 bottom-2 text-xl animate-bounce" style={{ animationDelay: '700ms' }}>❤️</span>
          </div>
        </div>

        {/* Lock Icon Header */}
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500/15 to-purple-500/15 border border-pink-500/30 text-pink-400 relative">
            <div className="absolute inset-0 rounded-2xl bg-pink-500/10 blur-md animate-pulse" />
            <motion.div
              animate={{ rotate: shake ? [0, -10, 10, -10, 10, 0] : 0 }}
              transition={{ duration: 0.5 }}
            >
              {attempts >= 3 ? (
                <Unlock size={26} className="text-pink-300 animate-bounce" />
              ) : (
                <Lock size={26} className={isError ? "text-rose-400" : "text-pink-400"} />
              )}
            </motion.div>
          </div>
          
          <h3 className="font-serif text-xl md:text-2xl font-black bg-gradient-to-r from-pink-300 via-rose-200 to-purple-300 bg-clip-text text-transparent tracking-wide">
            {attempts >= 3 ? "🌸 Unlocking Sanctuary For You! ✨" : "🌸 Period Hub Locked 🔒"}
          </h3>
          
          <p className="text-xs text-pink-300/80 font-semibold tracking-wider uppercase px-4 py-1 bg-pink-500/10 rounded-full inline-block border border-pink-500/20">
            {attempts >= 3 ? "💝 Effort Reward Active! 💝" : "For Ruu's Favorite Girl Only"}
          </p>
        </div>

        {attempts < 3 ? (
          <>
            {/* Description */}
            <p className="text-xs text-slate-300/95 leading-relaxed max-w-sm mx-auto relative z-10">
              My angel, this hub is filled with extra warmth, chocolates, virtual hugs, and comforts. Please enter the magical passcode to unlock your sanctuary. 🌸
            </p>

            {/* Form Input */}
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10 max-w-sm mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setIsError(false);
                  }}
                  placeholder="Enter magical passcode..."
                  className={`w-full px-5 py-3.5 bg-white/5 border rounded-2xl text-center text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/40 text-sm font-semibold tracking-wide transition-all ${
                    isError 
                      ? 'border-rose-500 bg-rose-950/20 text-rose-200' 
                      : 'border-white/10 hover:border-pink-500/30 focus:border-pink-500/50'
                  }`}
                  disabled={isSubmitting}
                />
                {isError && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-400 animate-pulse">
                    <AlertCircle size={16} />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !password.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-serif font-black tracking-widest text-xs uppercase rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Unlocking...
                  </span>
                ) : (
                  <>
                    <span>Unlock Sanctuary</span>
                    <Unlock size={12} />
                  </>
                )}
              </button>
            </form>

            {/* Hints and Error Indicators */}
            <div className="space-y-2 relative z-10 text-xs">
              {isError && (
                <p className="text-[10px] text-rose-400 font-mono uppercase tracking-widest animate-pulse font-bold">
                  Passcode incorrect, sweetie! Please try again ❤️
                </p>
              )}
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5 relative z-10 max-w-sm mx-auto"
          >
            {/* Cute message as requested */}
            <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-2xl space-y-2.5 shadow-inner">
              <span className="text-3xl animate-bounce inline-block">🥺💖🌸</span>
              <p className="text-xs text-pink-200 font-black leading-relaxed">
                Aww, my sweet angel! Aapne itni saari koshish ki passcode dhoondhne ki... ❤️
              </p>
              <p className="text-[11px] text-slate-200 font-semibold leading-relaxed">
                Ruu can't see his princess struggling even for a second! So, I am automatically unlocking this cozy Period Hub for you. No passcodes needed anymore! ✨
              </p>
            </div>

            {/* Countdown or Manual Force Unlock Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleForceUnlock}
                className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-serif font-black tracking-widest text-xs uppercase rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:shadow-[0_0_40px_rgba(244,63,94,0.6)] active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
              >
                <span className="flex items-center gap-2">
                  <span>Enter Sanctuary Now</span>
                  <Unlock size={12} />
                </span>
                <span className="text-[8px] opacity-80 tracking-widest lowercase font-sans font-normal normal-case">
                  (Or wait {countdown}s to enter automatically)
                </span>
              </button>

              {/* Progress bar */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-400"
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
