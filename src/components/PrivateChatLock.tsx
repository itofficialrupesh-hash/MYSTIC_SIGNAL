import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { saveUnlockAttempt } from '../firebase';

interface PrivateChatLockProps {
  onUnlockSuccess: () => void;
  onTriggerConfetti: () => void;
}

export default function PrivateChatLock({ onUnlockSuccess, onTriggerConfetti }: PrivateChatLockProps) {
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(6);

  // Auto-unlock on 3rd attempt so she never gets stuck
  useEffect(() => {
    if (attempts >= 3) {
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
    const cleanedPassword = password.trim().toLowerCase();
    
    // Accept either 'ruutanish' or the magic anniversary numbers '1125' / '2511'
    const isCorrect = cleanedPassword === 'ruutanish' || cleanedPassword === '1125' || cleanedPassword === '2511';

    // Log unlock attempt to Firebase
    try {
      saveUnlockAttempt(`Private Chat Password: ${cleanedPassword}`, isCorrect).catch(err => {
        console.error("Firebase save Private Chat unlock error:", err);
      });
    } catch (err) {}

    setTimeout(() => {
      setIsSubmitting(false);
      if (isCorrect) {
        onTriggerConfetti();
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
    <div className="relative w-full max-w-lg mx-auto p-1 select-none text-zinc-100">
      <style>{`
        @keyframes shakeEffect {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake-chat {
          animation: shakeEffect 0.5s ease-in-out;
          border-color: rgba(244, 63, 94, 0.6) !important;
          box-shadow: 0 0 25px rgba(244, 63, 94, 0.2) !important;
        }
      `}</style>

      <div 
        className={`bg-slate-950/80 backdrop-blur-xl border border-pink-500/20 rounded-[36px] p-6 md:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300 ${
          shake ? 'animate-shake-chat' : ''
        }`}
      >
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 bg-pink-500/15 border border-pink-500/20 px-3 py-1 rounded-full text-pink-300 font-extrabold text-[9px] uppercase tracking-[0.2em] shadow-sm">
            <span>✨</span>
            <span>Real-Time Private Chat</span>
            <span>✨</span>
          </div>
          <h3 className="font-serif text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-300 to-indigo-300 bg-clip-text leading-tight pt-1">
            Unlock Chat Room 🔒
          </h3>
          <p className="text-xs text-zinc-400 font-medium max-w-xs mx-auto">
            Our exclusive, secure digital space is ready. Enter our special secret password key to enter.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {attempts >= 3 ? (
            <motion.div 
              key="auto-unlock"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-5 bg-pink-500/10 border border-pink-500/30 rounded-2xl space-y-3.5 text-center"
            >
              <div className="flex justify-center text-pink-400 animate-bounce">
                <Sparkles size={28} />
              </div>
              <p className="text-xs text-pink-300 font-extrabold leading-relaxed">
                Ruu can't let his favorite person struggle even for a second! Unlocking our private chat automatically for you...
              </p>
              <div className="text-2xl font-black font-mono text-white animate-pulse">
                🕒 {countdown}s
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">
                Hold tight, sweetie! 💖
              </p>
            </motion.div>
          ) : (
            <motion.form 
              key="lock-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-2 text-left">
                <label className="text-[10px] text-pink-300 uppercase font-black tracking-widest pl-1">
                  Secret Key Phrase / Anniversary Date
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter Secret Passcode..."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setIsError(false);
                    }}
                    className="w-full bg-slate-950 border border-pink-500/20 rounded-2xl py-3 px-4 text-xs font-semibold text-center text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all shadow-inner tracking-widest"
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-500/50">
                    <Lock size={14} />
                  </div>
                </div>
                {isError && (
                  <p className="text-[10px] text-red-400 font-extrabold pl-1 animate-pulse flex items-center gap-1">
                    <AlertCircle size={10} />
                    <span>Oops! Wrong key. Try 'ruutanish' or our special dates! 💖</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !password}
                className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white font-black uppercase tracking-[0.15em] text-[10px] py-3.5 rounded-2xl shadow-[0_4px_20px_rgba(236,72,153,0.25)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "Verifying Keys..." : "Unlock Chat Room ✨"}</span>
              </button>

              <div className="flex items-center justify-between px-1 text-[10px] text-zinc-500 font-bold">
                <span>Passcode hint: ruutanish</span>
                <button
                  type="button"
                  onClick={handleForceUnlock}
                  className="text-pink-400 hover:text-pink-300 underline cursor-pointer"
                >
                  Quick Bypass ⚡
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
