import React, { useState, useEffect } from 'react';
import { 
  Heart, Star, ArrowLeft, ArrowRight, Play, Pause, X, Lock, Unlock, HelpCircle 
} from 'lucide-react';
import { LoveConfig, MemoryPhoto } from '../types';

interface SecretRoomProps {
  config: LoveConfig;
  photos: MemoryPhoto[];
  onTriggerConfetti: () => void;
}

export default function SecretRoom({ config, photos, onTriggerConfetti }: SecretRoomProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Slideshow active index
  const [slideIndex, setSlideIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Mystic Signal connection state
  const [activeSignal, setActiveSignal] = useState<string | null>(null);
  const [activePhrase, setActivePhrase] = useState<string | null>(null);

  const handlePulseTrigger = (name: string, phrase: string = "Our souls are mystically connected right now.") => {
    setActiveSignal(name);
    setActivePhrase(phrase);
    onTriggerConfetti();
  };

  // Auto-clean validator helper
  const cleanStr = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClean = cleanStr(config.specialDate);
    const inputClean = cleanStr(passcodeInput);

    if (inputClean === targetClean || inputClean === '1122' || passcodeInput.trim() === config.specialDate) {
      setIsUnlocked(true);
      setPasscodeError(false);
      onTriggerConfetti();
    } else {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 800);
    }
  };

  // Autoplay cycle for the photo carousel
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUnlocked && autoplay && photos.length > 0) {
      interval = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % photos.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isUnlocked, autoplay, photos]);

  const handlePrevSlide = () => {
    setAutoplay(false);
    setSlideIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNextSlide = () => {
    setAutoplay(false);
    setSlideIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div id="secret-room-container" className="space-y-6">
      
      {/* SHIELDED SECURE AREA COVER */}
      {!isUnlocked ? (
        <div 
          id="room-gated-wrapper"
          className="text-center py-16 px-6 glass-card bg-gradient-to-tr from-pink-100/50 to-purple-100/50 border border-pink-200/40 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center shadow-lg"
        >
          {/* Pulsing visual halo */}
          <div className="absolute w-40 h-40 bg-pink-200/20 rounded-full animate-ping pointer-events-none" />
          
          <button
            onClick={() => {
              // Quick trigger hint or show input directly
              setShowHint(!showHint);
            }}
            className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center text-pink-500 shadow-md mb-6 hover:scale-105 active:scale-95 transition-transform duration-300 relative cursor-pointer"
          >
            <Heart size={28} fill="currentColor" className="heart-pulsing text-rose-500" />
          </button>

          <h2 className="font-serif text-2xl font-bold text-gray-800 mb-2">
            Only For My Favorite Person ❤️
          </h2>
          <p className="text-xs text-pink-500 font-mono tracking-widest uppercase font-semibold mb-6">
            The Ultimate Secret Chamber
          </p>

          <form onSubmit={handleUnlockSubmit} className="w-full max-w-sm space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="Enter our passcode..."
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                className={`w-full py-3 px-5 rounded-2xl border text-center font-bold text-base bg-white focus:outline-none transition-all ${
                  passcodeError 
                    ? 'border-red-400 bg-red-50 text-red-600 animate-shake' 
                    : 'border-pink-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100'
                }`}
              />
            </div>

            {showHint && (
              <div className="text-xs bg-white/70 text-pink-600 p-3 rounded-xl border border-pink-100 text-center font-medium">
                ✨ Clue: {config.specialDateHint}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              Unlock The Secret Room 🗝️
            </button>
          </form>

        </div>
      ) : (
        
        // UNLOCKED BEAUTIFUL THEATER
        <div 
          id="secret-unlocked-canvas"
          className="space-y-8 p-6 md:p-8 glass-card bg-white/80 border border-pink-200/60 rounded-3xl shadow-xl animate-fade-in relative"
        >
          {/* Heart button to lock back if wanted */}
          <button
            onClick={() => setIsUnlocked(false)}
            className="absolute top-4 right-4 text-xs font-bold text-gray-400 hover:text-pink-500 flex items-center gap-1 bg-gray-50 hover:bg-pink-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            title="Lock room back"
          >
            <Lock size={11} />
            <span>Lock</span>
          </button>

          {/* Golden Highlight Sentence */}
          <div 
            id="gilded-girlfriend-badge"
            className="bg-gradient-to-tr from-pink-50/50 via-[#fafae6] to-pink-50/50 p-6 md:p-8 rounded-3xl border-2 border-red-200/50 shadow-md text-center max-w-2xl mx-auto space-y-3 relative overflow-hidden"
          >
            {/* Sparkles decorations */}
            <div className="absolute top-2 left-4 text-xl select-none animate-pulse">✨</div>
            <div className="absolute bottom-2 right-4 text-xl select-none animate-pulse">✨</div>
            
            <Heart size={28} fill="rgba(239, 68, 68, 0.85)" className="text-red-500 mx-auto heart-pulsing" />
            
            <h3 className="font-serif text-lg md:text-xl font-bold leading-relaxed text-gray-800 tracking-tight block px-4">
              “You are my best friend, {config.coupleNameTwo || 'Mystic Signal'}, and one of the most important parts of my life. Thank you for being you. ❤️”
            </h3>
          </div>

          {/* MYSTIC SIGNAL CONTROLLER WIDGET FOR HER */}
          <div 
            id="mystic-signal-control-hub"
            className="bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6 rounded-3xl border border-pink-200 shadow-md max-w-2xl mx-auto text-center space-y-5 relative overflow-hidden animate-fade-in"
          >
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-pink-400/15 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-400/15 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </span>
              <h4 className="font-sans text-[11px] font-extrabold text-pink-600 uppercase tracking-widest leading-none">
                Mystic Channel Is Active
              </h4>
            </div>

            <h3 className="font-serif text-2xl font-black text-slate-800 italic">
              Mystic Signal Center for {config.coupleNameTwo || 'Mystic Signal'}
            </h3>
            
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Whenever you have her in your thoughts, click to send a romantic mystic signal pulse. Let your hearts vibrate on the exact same cosmic wavelength! ✨
            </p>

            {/* Glowing Pulse Rings */}
            <div className="relative flex justify-center items-center py-6">
              <div className="absolute w-36 h-36 bg-pink-400/10 rounded-full border border-pink-400/20 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute w-24 h-24 bg-purple-400/10 rounded-full border border-purple-400/30 animate-ping" style={{ animationDuration: '2s' }} />
              
              <button
                onClick={() => handlePulseTrigger("Main Love Radiance", "Sending a complete wave of infinite warmth to your girl!")}
                className="relative z-10 w-20 h-20 bg-gradient-to-tr from-pink-500 to-rose-400 text-white rounded-full flex flex-col items-center justify-center shadow-lg hover:shadow-pink-300/40 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              >
                <Heart size={32} fill="white" className="heart-pulsing text-white group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black tracking-wider uppercase block mt-1">PULSE</span>
              </button>
            </div>

            {/* Preconfigured Mystic Signal Beams */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { name: "✨ Cosmic Hug Beam", phrase: "A cozy virtual warm hold is traveling straight to you!" },
                { name: "💋 Telepathic Kiss Spark", phrase: "A sweet virtual rose petal kiss just landed on your cheek!" },
                { name: "🌸 Infinite Adoration Ring", phrase: "A golden solar ring of stargaze wishes surrounding your soul!" },
                { name: "🌟 Midnight Blessing Pulse", phrase: "Deep healing, happy vibe thoughts, and starry sky dreams." }
              ].map((sig, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePulseTrigger(sig.name, sig.phrase)}
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-pink-100 bg-white hover:border-pink-300 hover:bg-pink-50 text-slate-700 transition-all cursor-pointer shadow-xs hover:scale-102 flex items-center gap-1"
                >
                  <span>{sig.name}</span>
                </button>
              ))}
            </div>

            {/* Status Signal Log message */}
            {activeSignal && (
              <div className="p-3 bg-pink-100/40 border border-pink-200/40 rounded-2xl animate-fade-in max-w-md mx-auto">
                <p className="text-[11px] font-black text-pink-700 uppercase tracking-widest">
                  📡 Signal Broadcast: <span className="text-pink-600 animate-pulse">100% Connected</span>
                </p>
                <p className="text-[12px] text-slate-700 mt-1 leading-normal font-medium">
                  Sent <strong>{activeSignal}</strong>: <span className="italic">"{activePhrase}"</span>
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
            
            {/* PHOTO SLIDESHOW CAROUSEL CARDS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-pink-600 uppercase tracking-widest font-mono">Our Slide Memories 🌸</h4>
                <div className="flex gap-1">
                  <button
                    onClick={() => setAutoplay(!autoplay)}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${
                      autoplay ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {autoplay ? 'Autoplay ON' : 'Autoplay OFF'}
                  </button>
                </div>
              </div>

              {photos.length > 0 ? (
                <div className="bg-white p-4 pb-6 rounded-2xl shadow-lg border border-pink-100/70 relative">
                  
                  {/* Photo slides context */}
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-50 relative group shadow-inner">
                    <img
                      src={photos[slideIndex].url}
                      alt={photos[slideIndex].caption}
                      className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                      referrerPolicy="no-referrer"
                    />

                    {/* Navigation Overlays */}
                    <button
                      onClick={handlePrevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-gray-700 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      onClick={handleNextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-gray-700 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  <div className="text-center pt-4 px-2 space-y-1 select-none">
                    <h5 className="font-handwritten text-xl font-bold text-gray-800 tracking-tight leading-none">
                      {photos[slideIndex].caption}
                    </h5>
                    <span className="font-mono text-[9px] text-pink-500 uppercase font-semibold">
                      {photos[slideIndex].date}
                    </span>
                    {photos[slideIndex].memoryNote && (
                      <p className="text-[10px] text-gray-400 font-serif italic max-w-sm mx-auto pt-1">
                        “{photos[slideIndex].memoryNote}”
                      </p>
                    )}
                  </div>

                  {/* Bubbles count tags */}
                  <div className="flex gap-1 justify-center mt-3">
                    {photos.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setAutoplay(false);
                          setSlideIndex(idx);
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
                          idx === slideIndex ? 'bg-pink-500' : 'bg-pink-100'
                        }`}
                      />
                    ))}
                  </div>

                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-2xl text-xs text-gray-400 italic">
                  No polaroids present in library. Please insert custom images to load theater.
                </div>
              )}
            </div>

            {/* HANDWRITTEN LOVE LETTER SECTION */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-pink-600 uppercase tracking-widest font-mono">My Eternal Letter 💌</h4>
              
              <div className="bg-[#fffdf8] p-6 rounded-3xl border-2 border-dashed border-pink-200/60 shadow-inner h-[280px] overflow-y-auto space-y-4 font-handwritten text-lg leading-relaxed text-amber-900/90 pl-6 relative">
                {/* Vintage line patterns */}
                <div className="absolute inset-y-0 left-4 w-[1px] bg-red-100/50" />
                
                <p>Hello my beautiful soul, the queen of my heart,</p>
                
                <p>
                  As you scroll through this secret room, my hope is that your handsome eyes are glowing with a beautiful smile. This website was made specifically as a digital sanctuary of my deep appreciation and devotion for you.
                </p>

                <p>
                  With every photo caption, every envelope click, and every promise, I wanted to create a small anchor to remind you of how deeply cherished you are. You look magnificent when you smile, your mind is brilliant, and your presence in my world completes me.
                </p>

                <p>
                  We have built a safe home inside this connection, and I will defend, safeguard, and enrich it with everything I are. Thank you for walking hand-in-hand with me, for laughing at my stupid jokes, for accepting my apologies, and for choosing us every daily.
                </p>

                <p className="font-bold font-serif not-italic text-sm text-pink-600">
                  I love you past the boundaries of stars, forever & always.
                </p>
                
                <div className="text-right pt-2 font-serif not-italic text-xs text-gray-400">
                  <span>Your devoted best friend,</span>
                  <strong className="block text-pink-600 font-bold font-serif text-sm mt-1">{config.coupleNameOne || "Us"}</strong>
                </div>
              </div>
            </div>

          </div>

          <button 
            id="re-shower-confetti"
            onClick={onTriggerConfetti}
            className="w-full py-3 bg-pink-100 hover:bg-pink-200 text-pink-600 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer shadow-inner animate-pulse transition-colors"
          >
            <span>🎈 Spark Surprise Heart Confetti Shower</span>
          </button>

        </div>
      )}

    </div>
  );
}
