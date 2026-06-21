import React, { useState, useEffect } from 'react';
import { Heart, Lock, Unlock, Delete } from 'lucide-react';
import { saveUnlockAttempt } from '../firebase';

interface BestiePasscodeLockProps {
  onUnlockSuccess: () => void;
  onTriggerConfetti: () => void;
}

export default function BestiePasscodeLock({ onUnlockSuccess, onTriggerConfetti }: BestiePasscodeLockProps) {
  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        checkPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setIsError(false);
  };

  const checkPin = (enteredPin: string) => {
    const isCorrect = enteredPin === '2511' || enteredPin === '1125';
    
    // Save attempts to Firebase Firestore
    try {
      saveUnlockAttempt(`Bestie PIN: ${enteredPin}`, isCorrect).catch(err => {
        console.error("Firebase save PIN error:", err);
      });
    } catch (e) {}

    if (isCorrect) {
      onTriggerConfetti();
      // Double confetti splash
      setTimeout(onTriggerConfetti, 400);
      onUnlockSuccess();
    } else {
      setIsError(true);
      setShake(true);
      setAttempts((prev) => prev + 1);
      setTimeout(() => {
        setShake(false);
        setPin(''); // Reset
      }, 600);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  return (
    <div 
      className={`max-w-md mx-auto p-6 md:p-8 rounded-3xl bg-gradient-to-tr from-[#0b031d] via-[#12062f] to-[#08021a] border border-pink-500/20 shadow-[0_0_45px_rgba(255,79,163,0.15)] text-center space-y-8 select-none transition-transform duration-300 ${
        shake ? 'animate-shake' : ''
      }`}
    >
      <style>{`
        @keyframes shakeEffect {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shakeEffect 0.5s ease-in-out;
          border-color: rgba(244, 63, 94, 0.6);
        }
      `}</style>

      {/* Floating Sparkles and Background */}
      <div className="space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 relative">
          <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-md animate-pulse" />
          <Lock size={22} className={isError ? "text-rose-500" : "text-pink-400 animate-pulse"} />
        </div>
        
        <h3 className="font-serif text-lg md:text-xl font-black bg-gradient-to-r from-pink-300 via-rose-200 to-amber-150 bg-clip-text text-transparent uppercase tracking-wider">
          Bestie Wing Locked 🔒
        </h3>
        
        {/* Love You Bestie Label (As requested: no hints, only love you bestie) */}
        <p className="text-xs text-pink-300 font-extrabold tracking-wide uppercase px-4 py-1.5 bg-pink-500/10 rounded-full inline-block border border-pink-500/20">
          💖 love you bestie 💖
        </p>
      </div>

      {/* Pin Indication Dots (Hearts!) */}
      <div className="flex justify-center items-center gap-4">
        {[0, 1, 2, 3].map((idx) => {
          const filled = pin.length > idx;
          return (
            <div 
              key={idx}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                filled 
                  ? 'bg-pink-500 border-pink-400 text-white scale-110 shadow-[0_0_12px_#ff4fa3]' 
                  : isError 
                  ? 'border-rose-500/40 bg-rose-500/5' 
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <Heart 
                size={14} 
                className={filled ? 'text-white' : 'text-zinc-600'} 
                fill={filled ? 'currentColor' : 'none'} 
              />
            </div>
          );
        })}
      </div>

      {/* Digital keypad interface */}
      <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto pt-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <button
            key={num}
            onClick={() => handleKeyPress(num)}
            className="w-16 h-16 rounded-full bg-white/5 hover:bg-pink-500/15 border border-white/5 hover:border-pink-500/30 text-white font-serif text-lg font-bold flex items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer"
          >
            {num}
          </button>
        ))}
        <div className="w-16 h-16" /> {/* Spacer */}
        <button
          onClick={() => handleKeyPress('0')}
          className="w-16 h-16 rounded-full bg-white/5 hover:bg-pink-500/15 border border-white/5 hover:border-pink-500/30 text-white font-serif text-lg font-bold flex items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          className="w-16 h-16 rounded-full bg-white/5 hover:bg-rose-500/15 border border-white/5 hover:border-rose-500/30 text-zinc-400 hover:text-white flex items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer"
          title="Delete"
        >
          <Delete size={18} />
        </button>
      </div>

      {/* Error message and help hints */}
      <div className="space-y-4">
        {isError && (
          <p className="text-[11px] text-rose-400 font-mono uppercase tracking-widest animate-pulse font-bold">
            Incorrect passcode! Try again ❤️
          </p>
        )}

        {attempts >= 3 && (
          <div className="p-4 bg-gradient-to-r from-pink-500/15 to-purple-600/15 border border-pink-500/30 rounded-2xl animate-fade-in text-center space-y-2.5 mt-2 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
            <p className="text-pink-200 text-xs font-bold leading-relaxed">
              Mera pyaara bestie thak gya? 🥺 Pareshan mat ho, real key of our heart is here! <br/>
              Special magic passcode is: <span className="font-mono text-sm bg-pink-500/30 px-2 py-0.5 rounded-md border border-pink-400/40 text-white font-black animate-pulse shadow-sm ml-1 inline-block">2511</span> ✨
            </p>
            <button
              onClick={() => {
                setPin('2511');
                setIsError(false);
                setTimeout(() => {
                  onTriggerConfetti();
                  setTimeout(onTriggerConfetti, 400);
                  onUnlockSuccess();
                }, 400);
              }}
              className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white text-[9.5px] font-black uppercase tracking-wider rounded-full shadow-[0_0_12px_rgba(244,63,94,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1"
            >
              <span>💖 Tap here to Auto-Unlock instantly! 💖</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
