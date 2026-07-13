import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Sparkles, Smile, MessageSquare, Coffee, Music, CloudRain, 
  CloudSnow, Sun, Moon, Volume2, VolumeX, Mail, Gift, Flame, Compass,
  ChevronLeft, ChevronRight, RefreshCw, Feather, Droplet, Cloud, Award, 
  HeartHandshake, Eye, Star, CheckSquare, Send, ThumbsUp, Sparkle, User, 
  HelpCircle, Play, Pause, Compass as CompassIcon, Calendar, Lock, Unlock, Zap
} from 'lucide-react';

// --- COZY LOCAL AUDIO ENGINE FOR SYNTH MUSIC & FX ---
function playCozySynthTone(freq: number, type: OscillatorType = 'sine', duration = 0.5, volume = 0.1) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn(e);
  }
}

// ─── 1. COMFORT JOURNEY ───
export function ComfortJourney() {
  const [activeTab, setActiveTab] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  const journeySteps = {
    morning: {
      title: "Cozy Morning Sunrise",
      time: "6:00 AM - 11:59 AM",
      illustration: "🌅",
      quote: "My beautiful girl, take a deep breath. Today has no demands for you. Only gentle steps.",
      reminders: [
        "Drink a warm glass of water first to wake up your system 💧",
        "Stretch your arms and fingers slowly in bed - no rushing! 🛌",
        "Put on your warmest fuzzy socks right away 🧦",
        "Ruu is sending you a huge morning kiss to start the day. 💋"
      ],
      bg: "from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/20"
    },
    afternoon: {
      title: "Gentle Afternoon Care",
      time: "12:00 PM - 4:59 PM",
      illustration: "🌸",
      quote: "You have made it halfway through the day. I am so proud of your strength, my queen.",
      reminders: [
        "Have a light, nutritious warm lunch. Maybe sweet soup? 🥣",
        "Check your heating pad temperature - keep it sweet and warm. 🔥",
        "Close your eyes for 10 minutes, breathe, and put on lo-fi piano. 🎹",
        "A little chocolate is highly encouraged right now! 🍫"
      ],
      bg: "from-pink-500/10 via-rose-500/5 to-transparent border-pink-500/20"
    },
    evening: {
      title: "Amber Evening Winds",
      time: "5:00 PM - 8:59 PM",
      illustration: "🍵",
      quote: "The day is winding down. Let go of every single worry. You did beautifully.",
      reminders: [
        "Sip on chamomile or peppermint tea slowly. Let it warm your belly. 🍵",
        "Change into your favorite oversized comfy pajamas 👕",
        "Avoid heavy chores. The world can wait; your healing comes first. 🌍",
        "Sending you a warm virtual cuddle to wrap around your waist. 🫂"
      ],
      bg: "from-purple-500/10 via-indigo-500/5 to-transparent border-purple-500/20"
    },
    night: {
      title: "Starlight Deep Rest",
      time: "9:00 PM - 5:59 AM",
      illustration: "🌙",
      quote: "Sleep peacefully, my darling angel. I am guarding your dreams tonight.",
      reminders: [
        "Turn off bright screens 1 hour before sleeping 📱",
        "Listen to the healing rain synthesizer in Sleep Mode 🌧️",
        "Know that you are safe, infinitely precious, and deeply adored. ❤️",
        "Close your eyes and feel Ruu holding you tight. Goodnight. ⭐"
      ],
      bg: "from-blue-500/10 via-slate-500/5 to-transparent border-blue-500/20"
    }
  };

  const current = journeySteps[activeTab];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">💖</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          💖 The Comfort Journey Timeline
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          A premium, step-by-step custom guide tailored to pamper you from sunrise to stargaze.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Timeline Tabs */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {(Object.keys(journeySteps) as Array<keyof typeof journeySteps>).map((key) => {
            const isActive = activeTab === key;
            const step = journeySteps[key];
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  playCozySynthTone(300 + (isActive ? 100 : 50), 'sine', 0.15);
                }}
                className={`py-3.5 rounded-2xl border transition-all duration-300 text-xs font-black capitalize flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  isActive 
                    ? 'bg-white/10 border-pink-500/45 text-pink-300 shadow-lg scale-[1.03]' 
                    : 'bg-slate-950/20 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300'
                }`}
              >
                <span className="text-lg">{step.illustration}</span>
                <span className="hidden sm:inline text-[10px] tracking-wider uppercase">{key}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Step Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`border rounded-[32px] p-6 md:p-8 bg-gradient-to-br ${current.bg} shadow-2xl relative overflow-hidden backdrop-blur-md`}
          >
            {/* Ambient visual ring */}
            <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-pink-500/5 blur-[40px] pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
              <div className="text-5xl md:text-6xl p-5 bg-white/5 rounded-[24px] border border-white/10 self-center md:self-start">
                {current.illustration}
              </div>

              <div className="flex-1 space-y-4 text-left">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-black text-pink-400 font-mono">{current.time}</span>
                  <h4 className="font-serif text-xl md:text-2xl font-black text-white">{current.title}</h4>
                </div>

                <p className="italic text-xs text-zinc-200 border-l-2 border-pink-500/40 pl-3 leading-relaxed font-medium">
                  "{current.quote}"
                </p>

                <div className="space-y-2.5 pt-2">
                  <span className="text-[9px] uppercase tracking-widest font-black text-zinc-400">Priceless Reminders:</span>
                  <ul className="space-y-2">
                    {current.reminders.map((rem, i) => (
                      <motion.li 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex items-start gap-2 text-[11px] text-zinc-300 font-semibold"
                      >
                        <span className="text-pink-400 mt-0.5">🌸</span>
                        <span>{rem}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}


// ─── 2. OPEN WHEN... ENVELOPES ───
export function OpenWhenEnvelopes() {
  const [selectedLetter, setSelectedLetter] = useState<{ title: string; message: string; emoji: string; label: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const letters = [
    {
      title: "I'm Sad",
      emoji: "❤️",
      label: "❤️ Open When I'm Sad",
      message: "Hey beautiful. If you're feeling down or sad right now, I want you to close your eyes, put your hand over your heart, and remember that my love is constantly wrapped around you. You are allowed to cry, you are allowed to be tired. You don't have to carry the world. I love you exactly as you are, and I am right here beside you. Rest up, baby."
    },
    {
      title: "I Miss You",
      emoji: "🥺",
      label: "🥺 Open When I Miss You",
      message: "I miss you more, my darling queen! Distance is just a temporary number, but our souls are completely intertwined. Right now, as you read this, I am sending you a warm cosmic hug. Close your eyes and count to three. I am hugging your soul and whispering that you are my entire world. Soon we will be together!"
    },
    {
      title: "I Can't Sleep",
      emoji: "😴",
      label: "😴 Open When I Can't Sleep",
      message: "If your eyes won't close and your mind is racing, relax your shoulders, let your head sink deep into your pillow, and pretend my arm is under your neck and my hand is gently caressing your hair. Breathe in sync with me: slow, steady, soft. Sleep well, my beautiful angel. I'll watch over you and guard your dreams."
    },
    {
      title: "I Need A Hug",
      emoji: "🫂",
      label: "🫂 Open When I Need A Hug",
      message: "SQUEEZE! This is an official emergency hug. I am wrapping my arms tight around your lower back, resting my chin gently on your head, and swaying us slowly from side to side. Feel the warmth, feel my heartbeat, and let your body relax completely into my embrace. I've got you. You are perfectly safe."
    },
    {
      title: "I Feel Emotional",
      emoji: "🌸",
      label: "🌸 Open When I Feel Emotional",
      message: "It is okay to feel everything so deeply right now, my sweet girl. Hormones and cramps can make things feel so heavy, and that is completely valid. Let your tears flow if they need to; they are just washing away the stress. I am here to listen, to hold you, and to remind you how incredibly loved and precious you are. Take all the time you need, my princess."
    },
    {
      title: "I Need Motivation",
      emoji: "💗",
      label: "💗 Open When I Need Motivation",
      message: "You are the strongest, most resilient girl I have ever known. Even when you are struggling, you manage to shine. Take this one step, one breath, one minute at a time. I believe in you with every fiber of my being. You've got this, my champion! Nothing can hold you back."
    },
    {
      title: "I Want To Smile",
      emoji: "😊",
      label: "😊 Open When I Want To Smile",
      message: "Here is your regular, infinite, unconditional supply of joy! Did you know that when you smile, the entire universe sparkles a little brighter? You are the cutest, most darling girl in existence, and thinking of your adorable giggle makes my heart do backflips. You are my home, my dream, and my greatest treasure. Keep smiling, my gorgeous angel! Ruu loves you forever!"
    }
  ];

  const handleSelectLetter = (letItem: typeof letters[0]) => {
    setSelectedLetter(letItem);
    setIsOpen(false);
    setIsReading(false);
    playCozySynthTone(523.25, 'sine', 0.15, 0.08); // Sweet ding
  };

  const handleBreakSeal = () => {
    if (isOpen) return;
    setIsOpen(true);
    playCozySynthTone(659.25, 'sine', 0.2, 0.1); // Seal crack tone
    
    // Slide up letter after flap opens
    setTimeout(() => {
      playCozySynthTone(783.99, 'sine', 0.25, 0.08);
    }, 500);

    // Expand to full reading postcard
    setTimeout(() => {
      setIsReading(true);
      playCozySynthTone(1046.50, 'sine', 0.35, 0.08);
      
      // Auto unlock love letter badge!
      try {
        const badgesSaved = localStorage.getItem('ruu_reward_badges');
        const badges = badgesSaved ? JSON.parse(badgesSaved) : {};
        badges.loveLetter = true;
        localStorage.setItem('ruu_reward_badges', JSON.stringify(badges));
      } catch (e) {}
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">💌</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          💌 The 'Open When...' Envelopes
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Handwritten comforting letters from Ruu, carefully sealed and stored for your every emotional phase.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {letters.map((letItem, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -6, scale: 1.03 }}
            onClick={() => handleSelectLetter(letItem)}
            className="glass-card bg-slate-950/45 hover:bg-pink-500/5 border border-white/5 hover:border-pink-500/25 p-5 rounded-[28px] cursor-pointer text-center space-y-3 transition-all flex flex-col justify-between items-center group relative overflow-hidden"
          >
            {/* Absolute sparkle effects */}
            <div className="absolute top-2 right-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✨</div>
            
            <div className="text-4xl select-none group-hover:scale-110 group-hover:rotate-6 transition-transform">
              ✉️
            </div>
            
            <span className="text-[10px] font-black tracking-wide text-zinc-300 uppercase block leading-tight font-mono">
              {letItem.title}
            </span>
            <div className="w-12 h-0.5 bg-pink-500/20 group-hover:bg-pink-500/40 rounded-full transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* 3D Envelope Opening Animated Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="w-full max-w-md text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[480px]"
            >
              <AnimatePresence mode="wait">
                {!isReading ? (
                  <motion.div
                    key="envelope-stage"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center space-y-8 w-full"
                  >
                    <span className="text-xs font-black uppercase tracking-widest text-pink-400 font-mono">
                      {selectedLetter.label}
                    </span>

                    {/* Interactive 3D Envelope Container */}
                    <div className="relative w-80 h-52 bg-[#170a2d] border border-pink-500/20 rounded-2xl shadow-2xl overflow-visible flex items-center justify-center">
                      
                      {/* Back Wall pocket shadow effect */}
                      <div className="absolute inset-0.5 bg-[#1b0a36] rounded-2xl z-0" />

                      {/* Sliding Letter */}
                      <motion.div
                        initial={{ y: 0, scale: 0.95, zIndex: 5 }}
                        animate={{ 
                          y: isOpen ? -75 : 0, 
                          scale: isOpen ? 1 : 0.95,
                          zIndex: isOpen ? 15 : 5
                        }}
                        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-x-5 h-36 bottom-3 bg-pink-50 rounded-xl p-4 shadow-md text-left border border-pink-200/40 flex flex-col justify-between"
                      >
                        <div className="space-y-1 select-none">
                          <div className="h-2 w-16 bg-pink-300/30 rounded-full" />
                          <div className="h-1.5 w-full bg-pink-300/10 rounded-full" />
                          <div className="h-1.5 w-5/6 bg-pink-300/10 rounded-full" />
                          <div className="h-1.5 w-11/12 bg-pink-300/10 rounded-full" />
                        </div>
                        <div className="flex justify-between items-center select-none">
                          <span className="text-pink-400 text-sm">🌸</span>
                          <span className="text-[8px] font-mono font-black text-pink-400 uppercase tracking-widest">Ruu is writing...</span>
                        </div>
                      </motion.div>

                      {/* Front Triangular Cover sides */}
                      <div 
                        className="absolute inset-0 bg-[#251247] z-10"
                        style={{
                          clipPath: 'polygon(0 30%, 50% 100%, 100% 30%, 100% 100%, 0 100%)',
                          borderTop: '1px solid rgba(244, 63, 94, 0.15)'
                        }}
                      />

                      {/* Animated Flap */}
                      <motion.div
                        initial={{ rotateX: 0 }}
                        animate={{ rotateX: isOpen ? -180 : 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        style={{ 
                          transformOrigin: 'top', 
                          perspective: 1000, 
                          transformStyle: 'preserve-3d',
                          backfaceVisibility: 'hidden',
                          clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
                        }}
                        className="absolute top-0 inset-x-0 h-28 bg-[#331b5c] border-t border-pink-500/10 rounded-t-2xl z-20 shadow-md"
                      />

                      {/* Wax Seal Button (Break seal) */}
                      <AnimatePresence>
                        {!isOpen && (
                          <motion.div
                            key="seal"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleBreakSeal}
                            className="absolute top-[44%] left-[calc(50%-22px)] w-11 h-11 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.4)] border border-pink-400/50 z-30 select-none animate-pulse"
                          >
                            <span className="text-xl">❤️</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <p className="text-[10px] uppercase font-black text-zinc-400 tracking-widest animate-pulse select-none">
                      {!isOpen ? "Tap wax seal to break & open letter" : "Opening your care note..."}
                    </p>

                    <button
                      onClick={() => {
                        setSelectedLetter(null);
                        playCozySynthTone(300, 'sine', 0.1);
                      }}
                      className="px-5 py-2 border border-zinc-700 hover:bg-white/5 rounded-xl text-[10px] uppercase tracking-widest text-zinc-400 font-bold cursor-pointer"
                    >
                      Go Back
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="reading-stage"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    className="w-full bg-[#fcf8f2] border-2 border-pink-300 rounded-[36px] p-6 md:p-8 shadow-2xl text-left space-y-6 relative overflow-hidden"
                  >
                    {/* Retro vintage background lines */}
                    <div className="absolute inset-0 bg-linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px) bg-[length:100%_24px] pointer-events-none opacity-40" />
                    
                    {/* Pink decorative floral elements */}
                    <div className="absolute top-4 right-4 text-3xl opacity-15 select-none font-serif">🌸</div>
                    <div className="absolute bottom-4 left-4 text-3xl opacity-15 select-none font-serif">💌</div>

                    <div className="space-y-1 relative z-10">
                      <span className="text-[9px] uppercase tracking-widest text-pink-500 font-extrabold px-2.5 py-0.5 bg-pink-500/10 rounded-full inline-block font-mono">
                        Sealed Letter From Ruu
                      </span>
                      <h4 className="font-serif text-2xl font-black text-zinc-800 tracking-wide leading-tight mt-1">
                        {selectedLetter.title}
                      </h4>
                    </div>

                    <div className="h-0.5 w-16 bg-pink-300 rounded-full relative z-10" />

                    <p className="font-handwritten text-xl md:text-2xl text-amber-950 leading-relaxed italic relative z-10 pr-1 max-h-[220px] overflow-y-auto font-semibold">
                      "{selectedLetter.message}"
                    </p>

                    <div className="pt-4 flex flex-col items-end border-t border-dashed border-pink-200/60 relative z-10 font-handwritten text-xl text-pink-600 font-bold">
                      <span>Forever yours,</span>
                      <span className="text-2xl mt-1">Ruu ❤️</span>
                    </div>

                    <div className="pt-2 flex justify-center relative z-10 w-full">
                      <button
                        onClick={() => {
                          setSelectedLetter(null);
                          setIsOpen(false);
                          setIsReading(false);
                          playCozySynthTone(300, 'sine', 0.1);
                        }}
                        className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer shadow-lg hover:shadow-pink-500/20"
                      >
                        Fold & Seal Back ❤️
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// ─── 3. BREATHING COMPANION ───
export function BreathingCompanion() {
  const [phase, setPhase] = useState<'expand' | 'hold' | 'release'>('expand');
  const [counter, setCounter] = useState(4);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Cycle states: Expand (4s) -> Hold (4s) -> Release (4s)
  useEffect(() => {
    let timer: any;
    if (counter > 1) {
      timer = setTimeout(() => setCounter(prev => prev - 1), 1000);
    } else {
      if (phase === 'expand') {
        setPhase('hold');
        setCounter(4);
        playCozySynthTone(440, 'triangle', 0.5, 0.05); // A4
      } else if (phase === 'hold') {
        setPhase('release');
        setCounter(4);
        playCozySynthTone(392, 'triangle', 0.5, 0.05); // G4
      } else {
        setPhase('expand');
        setCounter(4);
        playCozySynthTone(349.23, 'triangle', 0.5, 0.05); // F4
      }
    }
    return () => clearTimeout(timer);
  }, [counter, phase]);

  // Handle continuous therapeutic hum synthesis
  const startTherapeuticHum = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Cozy delta brainwave frequency hum
      osc.frequency.setValueAtTime(136.1, ctx.currentTime); // Om/Earth frequency

      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.warn(e);
    }
  };

  const stopTherapeuticHum = () => {
    try {
      if (oscillatorRef.current) oscillatorRef.current.stop();
      if (audioContextRef.current) audioContextRef.current.close();
    } catch (e) {
      console.warn(e);
    }
    oscillatorRef.current = null;
    audioContextRef.current = null;
  };

  useEffect(() => {
    if (isMusicOn) {
      startTherapeuticHum();
    } else {
      stopTherapeuticHum();
    }
    return () => stopTherapeuticHum();
  }, [isMusicOn]);

  // Adjust frequency dynamically based on breathing phase
  useEffect(() => {
    if (isMusicOn && oscillatorRef.current && audioContextRef.current) {
      const freq = phase === 'expand' ? 140 : phase === 'hold' ? 150 : 130;
      oscillatorRef.current.frequency.exponentialRampToValueAtTime(freq, audioContextRef.current.currentTime + 3);
    }
  }, [phase, isMusicOn]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🫶</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🫶 Breathing Companion
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Synchronize your breathing with the blooming bubble to instantly relieve cramp tension.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-slate-950/45 border border-pink-500/15 rounded-[40px] p-8 shadow-2xl relative overflow-hidden flex flex-col items-center space-y-8">
        
        {/* Floating background ambient dust */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                x: [0, (i % 2 === 0 ? 30 : -30), 0],
                opacity: [0.1, 0.6, 0.1],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
              className="absolute w-1 h-1 rounded-full bg-pink-400/30"
              style={{
                left: `${(i * 9) % 100}%`,
                bottom: `${(i * 7) % 60}%`
              }}
            />
          ))}
        </div>

        {/* Toggle continuous hum button */}
        <button
          onClick={() => {
            setIsMusicOn(!isMusicOn);
            playCozySynthTone(500, 'sine', 0.1);
          }}
          className={`px-4 py-2 rounded-xl text-[9px] uppercase font-black tracking-widest flex items-center gap-1.5 transition-all border z-10 ${
            isMusicOn 
              ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-[0_0_15px_rgba(244,63,94,0.25)]' 
              : 'bg-white/5 border-white/5 text-zinc-400 hover:border-pink-500/20 hover:text-zinc-300'
          }`}
        >
          {isMusicOn ? <Volume2 size={12} className="animate-pulse" /> : <VolumeX size={12} />}
          <span>{isMusicOn ? "Therapeutic Hum Active" : "Activate Soothing Hum"}</span>
        </button>

        {/* Breathing Circle Frame */}
        <div className="relative w-48 h-48 flex items-center justify-center z-10">
          
          {/* Animated Halo Gradients */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={phase}
              animate={
                phase === 'expand' 
                  ? { scale: [1, 1.35], opacity: [0.15, 0.35] } 
                  : phase === 'hold' 
                  ? { scale: 1.45, opacity: 0.45, rotate: 360 } 
                  : { scale: [1.45, 0.95], opacity: [0.45, 0.15] }
              }
              transition={{ duration: 4, ease: 'easeInOut' }}
              className={`absolute inset-0 rounded-full blur-[24px] bg-gradient-to-tr transition-all duration-1000 ${
                phase === 'expand' 
                  ? 'from-pink-500/30 to-rose-400/10' 
                  : phase === 'hold' 
                  ? 'from-purple-500/40 to-indigo-500/20 shadow-[0_0_40px_rgba(139,92,246,0.3)]' 
                  : 'from-blue-500/25 to-teal-400/10'
              }`}
            />
          </AnimatePresence>

          {/* Glowing expanding pulsing rings */}
          <motion.div
            animate={
              phase === 'expand' 
                ? { scale: 1.3, opacity: 0.2 } 
                : phase === 'hold' 
                ? { scale: [1.3, 1.35, 1.3], opacity: 0.3 } 
                : { scale: 0.9, opacity: 0.1 }
            }
            transition={{ duration: 4, ease: 'easeInOut', repeat: phase === 'hold' ? Infinity : 0 }}
            className="absolute inset-2 border border-dashed border-pink-400/30 rounded-full pointer-events-none"
          />

          {/* Actual Circle */}
          <motion.div
            animate={phase === 'expand' ? { scale: 1.2 } : phase === 'hold' ? { scale: 1.25 } : { scale: 0.9 }}
            transition={{ duration: 4, ease: 'easeInOut' }}
            className={`w-36 h-36 rounded-full flex flex-col items-center justify-center text-center border-2 border-white/20 shadow-2xl z-10 transition-all duration-1000 ${
              phase === 'expand' 
                ? 'bg-pink-500/20 border-pink-400/40 shadow-[0_0_25px_rgba(244,63,94,0.3)]' 
                : phase === 'hold' 
                ? 'bg-purple-500/20 border-purple-400/40 shadow-[0_0_35px_rgba(139,92,246,0.4)]' 
                : 'bg-blue-500/20 border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
            }`}
          >
            <span className="text-[10px] uppercase tracking-widest font-black text-pink-300 font-mono">
              {phase}
            </span>
            <span className="text-3xl font-black text-white font-mono mt-1">
              {counter}
            </span>
          </motion.div>
        </div>

        {/* Supportive Text */}
        <div className="text-center space-y-2 z-10">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider transition-colors duration-1000">
            {phase === 'expand' && "🌬️ Breathe In Warm Love..."}
            {phase === 'hold' && "🧘‍♀️ Hold & Melt Cramp Tension..."}
            {phase === 'release' && "✨ Release Deep & Relax..."}
          </h4>
          <p className="text-[10px] text-zinc-300 max-w-xs mx-auto leading-relaxed h-12">
            {phase === 'expand' && "Imagine breathing in warm, golden healing sunshine that travels directly to your belly."}
            {phase === 'hold' && "Let the warmth stay there, loosening up all tight muscle fibers and easing discomfort."}
            {phase === 'release' && "Exhale every bit of pain, exhaustion and worry. Ruu is breathing right next to you."}
          </p>
        </div>
      </div>
    </div>
  );
}


// ─── 4. SLEEP MODE ───
export function SleepMode() {
  const [isActive, setIsActive] = useState(false);
  const [fireflies, setFireflies] = useState<Array<{ id: number, x: number, y: number, delay: number, dur: number }>>([]);
  const [timerDuration, setTimerDuration] = useState<number | 'none'>('none'); // in minutes
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // in seconds
  
  const rainOscillatorRef = useRef<OscillatorNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const rainCtxRef = useRef<AudioContext | null>(null);
  const lofiTimerRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  // Initialize random fireflies
  useEffect(() => {
    const list = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      dur: 4 + Math.random() * 4
    }));
    setFireflies(list);
  }, []);

  // Web Audio Rain synthesizer loop (white-noise-like formulation)
  const startRainSynth = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      rainCtxRef.current = ctx;

      // Create noise buffer
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass filter to make it sound like gentle rain
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 750;
      filter.Q.value = 0.85;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.015, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();

      rainGainRef.current = gain;
    } catch (e) {
      console.warn(e);
    }
  };

  const stopRainSynth = () => {
    try {
      if (rainCtxRef.current) rainCtxRef.current.close();
    } catch (e) {
      console.warn(e);
    }
    rainCtxRef.current = null;
  };

  // Continuous play of extremely slow, warm healing chords for deep relaxation
  const playAmbientChords = () => {
    if (!isActive) return;
    
    // Soothing, extremely warm and low chord progression:
    // Cmaj7 (C3, E3, G3, B3) -> Fmaj7 (F3, A3, C4, E4) -> Am9 (A2, C3, E3, G3, B3) -> Em7 (E3, G3, B3, D4)
    const chords = [
      [130.81, 164.81, 196.00, 246.94],
      [174.61, 220.00, 261.63, 329.63],
      [110.00, 130.81, 164.81, 196.00, 246.94],
      [164.81, 196.00, 246.94, 293.66]
    ];

    const chosenChord = chords[Math.floor(Math.random() * chords.length)];
    chosenChord.forEach((note, index) => {
      // Arpeggiate chord note entry very gently (500ms separation)
      setTimeout(() => {
        playCozySynthTone(note, 'sine', 7.5, 0.025);
      }, index * 500);
    });

    // Schedule next chord sequence in 9.5 seconds
    lofiTimerRef.current = setTimeout(playAmbientChords, 9500);
  };

  // Sync Sleep activation
  useEffect(() => {
    if (isActive) {
      startRainSynth();
      // Start slow ambient chords
      setTimeout(playAmbientChords, 600);
      
      // Save activation to local storage so Comfort Star badge unlocks
      try {
        localStorage.setItem('ruu_sleep_mode_ever_activated', 'true');
      } catch (e) {}

      // Handle timer count
      if (timerDuration !== 'none') {
        const secs = timerDuration * 60;
        setTimeLeft(secs);
      } else {
        setTimeLeft(null);
      }
    } else {
      stopRainSynth();
      if (lofiTimerRef.current) clearTimeout(lofiTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      setTimeLeft(null);
    }

    return () => {
      stopRainSynth();
      if (lofiTimerRef.current) clearTimeout(lofiTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isActive]);

  // Handle countdown ticking
  useEffect(() => {
    if (isActive && timeLeft !== null) {
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            setIsActive(false); // turn off sleep mode
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isActive, timeLeft]);

  // Convert seconds remaining to elegant readable text
  const formatTimeRemaining = () => {
    if (timeLeft === null) return '';
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? '0' : ''}${s} left`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🌙</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🌙 Sleep Mode Night Ambient
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          One click to enter a quiet, beautiful cosmos. Best utilized while trying to fall asleep.
        </p>
      </div>

      <div className={`max-w-2xl mx-auto rounded-[40px] p-8 border shadow-2xl relative overflow-hidden transition-all duration-1000 min-h-[380px] flex flex-col items-center justify-between ${
        isActive 
          ? 'bg-[#03010c] border-indigo-500/25 shadow-[0_0_50px_rgba(99,102,241,0.2)]' 
          : 'bg-slate-950/40 border-pink-500/15'
      }`}>
        
        {/* Animated Background stars & aurora only visible in Sleep Mode */}
        <AnimatePresence>
          {isActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Stars layer */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:20px_20px]" />
              
              {/* Glowing Aurora */}
              <div className="absolute -top-20 inset-x-0 h-40 bg-radial-gradient from-teal-500/20 via-indigo-500/10 to-transparent blur-3xl animate-pulse" />
              
              {/* Aurora Fireflies */}
              {fireflies.map((ff) => (
                <motion.div
                  key={ff.id}
                  animate={{ 
                    y: [0, -45, 0], 
                    opacity: [0, 0.9, 0],
                    x: [0, Math.sin(ff.id) * 25, 0]
                  }}
                  transition={{
                    duration: ff.dur,
                    delay: ff.delay,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-teal-300/60 shadow-[0_0_8px_#5eead4]"
                  style={{ left: `${ff.x}%`, top: `${ff.y}%` }}
                />
              ))}

              {/* Slow Floating Cloud */}
              <motion.div
                animate={{ x: [-200, 800] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/4 left-0 text-7xl opacity-5 pointer-events-none select-none"
              >
                ☁️
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center z-10 space-y-4 pt-4">
          <motion.div
            animate={isActive ? { rotate: [0, -4, 4, -4, 0], scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl select-none"
          >
            {isActive ? "✨🌙✨" : "🌙"}
          </motion.div>

          <div className="space-y-1">
            <h4 className="font-serif text-lg font-black text-white">
              {isActive ? "Sleeping Under Cosmic Protection" : "Starlight Sleep Sanctuary"}
            </h4>
            <p className="text-[10px] text-zinc-400 max-w-sm mx-auto leading-relaxed">
              {isActive 
                ? "Gentle synthesized rain and deep sleep waves are activated. Sleep peacefully, my princess." 
                : "Enter an safe ambient nocturnal space to heal, soothe your cramps, and fall asleep easily."}
            </p>
          </div>
        </div>

        {/* Sleep timer Selector (Interactive and clean) */}
        <div className="z-10 flex flex-col items-center gap-2 mt-4">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-full p-1">
            {([
              { label: 'No Timer', value: 'none' },
              { label: '15m', value: 15 },
              { label: '30m', value: 30 },
              { label: '45m', value: 45 },
              { label: '60m', value: 60 }
            ] as const).map((tOpt) => (
              <button
                key={tOpt.label}
                disabled={isActive}
                onClick={() => {
                  setTimerDuration(tOpt.value);
                  playCozySynthTone(350, 'sine', 0.1);
                }}
                className={`px-3 py-1.5 rounded-full text-[9px] font-mono font-bold tracking-wide transition-all ${
                  isActive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  timerDuration === tOpt.value 
                    ? 'bg-pink-500/25 text-pink-300 font-extrabold border border-pink-500/25' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tOpt.label}
              </button>
            ))}
          </div>
          {isActive && timeLeft !== null && (
            <span className="text-[10px] font-mono font-black text-teal-400 tracking-wider bg-teal-400/10 px-3 py-1 rounded-full animate-pulse border border-teal-400/20">
              ⏱️ {formatTimeRemaining()}
            </span>
          )}
        </div>

        {/* Central Sleep Toggle Button */}
        <div className="z-10 pb-2 mt-4">
          <button
            onClick={() => {
              setIsActive(!isActive);
              playCozySynthTone(isActive ? 250 : 500, 'sine', 0.25);
            }}
            className={`px-8 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all cursor-pointer shadow-lg flex items-center gap-2 ${
              isActive 
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white shadow-teal-500/10' 
                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
            }`}
          >
            {isActive ? <Zap size={12} className="animate-bounce" /> : <Moon size={12} />}
            <span>{isActive ? "Deactivate Sleep Mode" : "Activate Sleep Mode"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── 5. DAILY SURPRISE ───
export function DailySurprise() {
  const [hasOpenedToday, setHasOpenedToday] = useState(false);
  const [surpriseItem, setSurpriseItem] = useState<{ name: string; emoji: string; desc: string } | null>(null);

  const surprises = [
    { name: "Fluffy Baby Teddy Bear", emoji: "🧸", desc: "He has a soft round tummy designed specifically for laying over your sore belly." },
    { name: "Cosmic Red Rose", emoji: "🌹", desc: "A fresh blossom carrying infinite love, sweet vanilla fragrance, and comfort." },
    { name: "Gourmet Hazelnut Chocolate truffle", emoji: "🍫", desc: "Dopamine booster block with warm hazelnut notes to soothe your mood." },
    { name: "A Sweet Postcard", emoji: "💌", desc: "A cozy short note: 'You are so beautiful and doing amazing, my queen. I love you.'" },
    { name: "Infinite Sweet Compliments", emoji: "❤️", desc: "You are literally the cutest, most darling soul in the entire universe today." },
    { name: "Rainbow Horizon", emoji: "🌈", desc: "Filling your sky with happy, bright, glowing thoughts of safe recovery." },
    { name: "Lucky Stardust", emoji: "⭐", desc: "Sparkly light to keep all headache demons far away from your dreams tonight." },
    { name: "Fairy Sparkles", emoji: "✨", desc: "Magical fairy dust to float gently around your room and grant you instant rest." }
  ];

  const triggerSurprise = () => {
    if (hasOpenedToday) return;
    playCozySynthTone(523.25, 'sine', 0.15);
    setTimeout(() => playCozySynthTone(659.25, 'sine', 0.15), 100);
    setTimeout(() => playCozySynthTone(783.99, 'sine', 0.35), 200);

    const rand = surprises[Math.floor(Math.random() * surprises.length)];
    setSurpriseItem(rand);
    setHasOpenedToday(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🎀</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🎀 Daily Care Surprise Box
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Every single day you visit, you get to unbox a premium gift of comfort!
        </p>
      </div>

      <div className="max-w-xs mx-auto bg-slate-950/45 border border-pink-500/15 rounded-[32px] p-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
        {/* Glow behind the box */}
        <div className="absolute inset-0 bg-radial-gradient from-pink-500/5 to-transparent pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {!hasOpenedToday ? (
            <motion.div
              key="box"
              initial={{ scale: 0.95 }}
              animate={{ scale: [0.95, 1.05, 0.95], rotate: [0, -3, 3, -3, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              onClick={triggerSurprise}
              className="text-center space-y-4 cursor-pointer z-10"
            >
              <span className="text-7xl filter drop-shadow-[0_0_20px_rgba(244,63,94,0.4)] block hover:scale-110 transition-transform">🎁</span>
              <button className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-450 hover:from-pink-600 text-white rounded-xl text-[9px] uppercase font-black tracking-widest transition-all shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                Unbox Today's Gift
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              className="text-center space-y-5 z-10"
            >
              {/* Custom High-Fidelity Animated Graphics depending on current surprise item */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                {/* Sparkle explosion particles in background */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{ scale: [0, 1, 0], x: Math.sin(i * Math.PI / 4) * 45, y: Math.cos(i * Math.PI / 4) * 45 }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.1 }}
                    className={`absolute w-1.5 h-1.5 rounded-full ${
                      surpriseItem?.emoji === '🌈' ? 'bg-amber-300' :
                      surpriseItem?.emoji === '🌹' ? 'bg-rose-400' :
                      surpriseItem?.emoji === '⭐' ? 'bg-yellow-300' : 'bg-pink-400'
                    }`}
                  />
                ))}

                {/* Main animated element */}
                <motion.div
                  animate={
                    surpriseItem?.emoji === '🧸' ? { y: [0, -12, 0], rotate: [-10, 10, -10, 0] } :
                    surpriseItem?.emoji === '🍫' ? { scale: [1, 1.15, 0.95, 1], rotate: [0, 360] } :
                    surpriseItem?.emoji === '🌹' ? { rotate: [0, 20, -20, 0], scale: [1, 1.1, 1] } :
                    surpriseItem?.emoji === '💌' ? { y: [-5, 5, -5], scale: [1, 1.05, 1] } :
                    surpriseItem?.emoji === '❤️' ? { scale: [1, 1.3, 1] } :
                    surpriseItem?.emoji === '🌈' ? { scale: [0.9, 1.1, 0.9], y: [-5, 5, -5] } :
                    surpriseItem?.emoji === '⭐' ? { rotate: 360, scale: [1, 1.2, 1] } :
                    { y: [0, -8, 8, 0], rotate: [0, 15, -15, 0] }
                  }
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-6xl select-none"
                >
                  {surpriseItem?.emoji}
                </motion.div>
              </div>

              <div className="space-y-1 px-1">
                <span className="text-[9px] uppercase tracking-widest text-pink-400 font-mono font-black animate-pulse bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20">
                  Daily Unlocked! ✨
                </span>
                <h4 className="text-sm font-serif font-black text-white pt-1">{surpriseItem?.name}</h4>
                <p className="text-[10px] text-zinc-300 leading-relaxed max-w-[220px] mx-auto">{surpriseItem?.desc}</p>
              </div>

              <button
                onClick={() => {
                  setHasOpenedToday(false);
                  setSurpriseItem(null);
                  playCozySynthTone(300, 'sine', 0.1);
                }}
                className="px-4 py-2 border border-pink-500/25 hover:bg-pink-500/10 rounded-xl text-[9px] text-pink-300 uppercase font-black transition-all cursor-pointer hover:border-pink-500/45 active:scale-95"
              >
                Accept with Love ❤️
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


// ─── 6. POSITIVE AFFIRMATIONS (250 UNIQUE!) ───
export function PositiveAffirmations() {
  const [currentAff, setCurrentAff] = useState("");
  const [category, setCategory] = useState<'all' | 'healing' | 'love' | 'strength' | 'peace'>('all');

  const healingAffirmations = [
    "Your body is healing right now.", "Rest is completely productive.", "It is okay to lay down and do nothing.",
    "Your physical comfort is the top priority today.", "Cramps are temporary; your healing is permanent.",
    "Let go of muscle tightness.", "Every warm sip of tea relaxes you.", "Breathe warm sunshine into your belly.",
    "You do not have to fight the pain alone.", "Gentle warmth is flowing inside you.", "Your body knows exactly how to heal.",
    "Be kind, gentle, and slow with yourself.", "Soft pillows, warm blankets, cozy heart.", "Healing comes in soft, silent waves.",
    "Give yourself full permission to recover.", "Each breath releases cramp tension.", "You are safe inside your cozy bed.",
    "The world can wait while you recover.", "Nurture your beautiful body with love.", "Allow your mind to drift and rest.",
    "Your comfort is a priceless gift.", "Wrap yourself in warmth and absolute silence.", "Pain fades; comfort is rising.",
    "Your energy is replenishing slowly.", "Sip warm liquids, let your belly heal.", "Soft muscles, open breathing.",
    "The heavy feeling will lift soon.", "Treat your body like a fragile, lovely flower.", "Warm heating pads are a beautiful relief.",
    "Let your heavy eyelids close gently.", "You are safe from all demands today.", "Patience with your physical healing.",
    "Your body is incredibly wise and strong.", "Cozy warmth is enveloping your soul.", "Breathe out pain; breathe in peace.",
    "A quiet dark room is your safe haven.", "Step away from all busy thoughts.", "Every minute of rest is a victory.",
    "Soft heartbeat, warm tummy, gentle healing.", "Your well-being is the only thing that matters.", "Quiet, slow, beautiful relaxation.",
    "No guilt in sleeping through the afternoon.", "Your muscles are softening and relaxing.", "Warm lavender honey vibes today.",
    "Drink some warm cozy chamomile.", "Your body deserves this sweet downtime.", "Let the tension melt into the sheets.",
    "Healing is happening in every heartbeat.", "Peaceful, quiet, radiant physical comfort.", "You are recovering beautifully."
  ];

  const loveAffirmations = [
    "You are loved beyond all measure.", "Ruu is always holding your hand.", "You are my absolute queen and angel.",
    "My heart beat syncs with yours.", "You are infinitely adored, sweetheart.", "Sending you a million virtual hugs.",
    "I cherish every single detail of you.", "You are safe in my virtual arms.", "You are my entire world and dream.",
    "I am constantly sending warm, fuzzy vibes your way.", "My love is a warm blanket around you.", "You have the most beautiful soul.",
    "I am so incredibly blessed to love you.", "Your smile is my absolute favorite light.", "Holding you tight in my thoughts.",
    "You are never, ever alone in this.", "Every beat of my heart says your name.", "Your comfort is my life's mission.",
    "You are so precious and beautifully made.", "Sending kisses to your sweet forehead.", "I love you exactly as you are.",
    "You are my peaceful, cozy harbor.", "My love for you grows with every sunrise.", "Wrapped in absolute love and care.",
    "You are the most darling girl in existence.", "Sending cozy heating vibes to your belly.", "I am right here with you, always.",
    "Your happiness is my highest goal.", "Thinking of you makes my heart blossom.", "You are my beautiful star in the dark.",
    "No distance can dim my care for you.", "Wishing I was there to rub your tummy.", "You are infinitely protected and sweet.",
    "My arms are always waiting for you.", "You are my sweet pumpkin cake.", "Infinite love, infinite kisses, infinite care.",
    "You make the entire cosmos brighter.", "My heart is your absolute safe locker.", "I adore you more than words can say.",
    "A million warm, soft hugs just for you.", "You are the queen of my galaxy.", "Sending you pure, sweet, gentle love.",
    "You are my absolute cozy home.", "Every star in the sky sings your praise.", "You are so loved, so treasured, so sweet.",
    "No matter what, I am by your side.", "Holding your beautiful hands in mine.", "You are my ultimate dream come true.",
    "My soft hugs are wrapping around you.", "You are infinitely loved, my beautiful queen."
  ];

  const strengthAffirmations = [
    "You are incredibly strong and resilient.", "You can handle this tough day.", "Your strength is gentle and quiet.",
    "You have overcome every hard day before.", "A soft soul with absolute inner power.", "Your bravery is inspiring to me.",
    "You handle everything with such grace.", "Take pride in your incredible courage.", "You are a warrior of light and love.",
    "Even when you feel fragile, you are strong.", "Your quiet patience is a beautiful power.", "You got this, my strong princess.",
    "Nothing can break your beautiful spirit.", "Trust in your body's strength.", "You are stronger than any cramp pain.",
    "One gentle step at a time is enough.", "Your mind is calm, clear, and powerful.", "Beautiful strength flows inside your veins.",
    "You rise above the physical storms.", "Your courage is a soft, glowing star.", "Your resilience is a work of art.",
    "Be proud of how well you cope.", "You have an amazing, powerful heart.", "Your gentle power can move mountains.",
    "You are capable of resting without fear.", "Strength is knowing when to lay down.", "You are doing incredibly well.",
    "Stand proud in your quiet light.", "Your strength is wrapped in soft kindness.", "You are a radiant, powerful soul.",
    "Every difficult day teaches us softness.", "You are protected by your inner glow.", "Your journey is full of great strength.",
    "I believe in your strength completely.", "Your energy is returning to you.", "You are a magnificent, brave queen.",
    "No storm lasts forever; you are stronger.", "You hold the power to heal inside.", "Quiet confidence, gentle recovery.",
    "Your capacity to heal is infinite.", "You are stronger than any heavy feeling.", "Take strength from my endless love.",
    "Your spirit is unbroken and lovely.", "You cope with such beautiful elegance.", "Your soft power is a golden shield.",
    "I am cheering for your strength every second.", "Your heart is a sanctuary of peace.", "You are a star that never stops glowing.",
    "Your courage makes me fall in love again.", "You are a masterpiece of strength."
  ];

  const peaceAffirmations = [
    "Peace is washing over you now.", "Let your mind be still and quiet.", "Slow down, breathe, and find calm.",
    "All is well in your cozy world.", "Silence the chatter; welcome the quiet.", "Your room is a sanctuary of peace.",
    "Feel the quiet rhythm of your heart.", "Let go of all tomorrow's worries.", "Today is for peace and deep healing.",
    "Calmness is settling into your muscles.", "You are safe, warm, and highly peaceful.", "Let your thoughts drift like soft clouds.",
    "The night is calm; your soul is peaceful.", "No rushing, no pressure, only pure peace.", "Every breath brings deep calmness.",
    "Your spirit is serene and beautifully still.", "Quiet winds are carrying away your pain.", "Let your body sink into absolute peace.",
    "The cosmos is cradling you in silence.", "You deserve peaceful, undisturbed quiet.", "Feel the warm wave of serenity.",
    "Peace begins with a deep, slow breath.", "Your soul is a quiet mountain lake.", "Rest in the beautiful, silent space.",
    "No storms can disturb your inner calm.", "Soft lavender light is surrounding you.", "You are floating in peaceful waters.",
    "Your mind is as calm as the night sky.", "Gentle waves of peace are soothing you.", "Let all heavy burdens roll away.",
    "Silence is a warm, cozy friend today.", "You are safe from every expectation.", "Deep peace, quiet hope, warm dreams.",
    "Let the serenity settle in your bones.", "Your sanctuary is warm and beautifully quiet.", "Breathe out chaos; breathe in serenity.",
    "The stars are glowing in deep peace.", "Calm, slow, gentle recovery vibes.", "Your space is filled with sacred quiet.",
    "Let the peace soothe your beautiful belly.", "You are resting in a cocoon of light.", "Serene thoughts, happy heart.",
    "Your world is full of soft, gentle quiet.", "Let your body surrender to deep rest.", "Peace is your ultimate crown today.",
    "The silent cosmos adores your quiet soul.", "Float in a beautiful, warm pink cloud.", "Deep, restorative, golden serenity.",
    "Your evening is blessed with absolute calm.", "You are at complete, beautiful peace."
  ];

  // Dynamically compile up to 250 affirmations programmatically using templates to ensure there are exactly 250!
  const getAffirmationPool = () => {
    let pool = [...healingAffirmations, ...loveAffirmations, ...strengthAffirmations, ...peaceAffirmations];
    
    // Procedural booster list to hit EXACTLY 250 unique affirmations as requested!
    const dynamicBoosters = [
      "You are a pure beam of comforting light.", "Your patience with your body is beautiful.",
      "Cramps are just your body's way of asking for rest.", "Ruu is kissing your tummy virtually right now.",
      "You deserve to be pampered like a royal princess.", "You are the sweetest part of my day.",
      "Soft blankets are hugging you from all sides.", "The heavy physical feelings will lift soon, I promise.",
      "You are doing so well, baby.", "My warm hands are virtually massage-rubbing your belly.",
      "Your comforting vibes are felt all over.", "Close your eyes and let my love warm you.",
      "There is no rush to feel perfectly okay.", "Your heart is filled with pure cozy gold.",
      "You are my absolute favorite blessing.", "Resting is a super power today.",
      "The moon is shining to keep you company.", "Your breathing is soft, gentle, and peaceful.",
      "You are a rare, beautiful flower.", "I am sending you soft chamomile tea vibes.",
      "Every cell in your body is renewing.", "Your recovery is a beautiful, slow dance.",
      "You are safe from all stress and pressure.", "Your bed is your private magical castle.",
      "I am holding your spirit close to mine.", "You are the queen of comfort today.",
      "Your soft sighs are heard and comforted.", "Let the heating pad work its warm magic.",
      "You are allowed to take up space and rest.", "You are so loved, so loved, so loved.",
      "The stars are singing a sweet lullaby for you.", "Your body is a temple of healing light.",
      "Every little pain is melting away slowly.", "You are my absolute favorite thought.",
      "I am wrapping you in a virtual silk cloud.", "You are stronger than this temporary wave.",
      "Your recovery is highly protected by love.", "Sending you peaceful, sweet fairy dreams.",
      "You are doing absolutely great, my sweetheart.", "You are my cozy winter fireplace.",
      "Rest, heal, and smile for your Ruu.", "No chores, no calls, just pure sleep.",
      "Your cozy pajamas are hugging you well.", "You have the most beautiful, warm heart.",
      "You are my ultimate dream girl, always.", "Soft music is soothing your cramps.",
      "Every muscle fiber is relaxing right now.", "You are at absolute, safe peace.",
      "Ruu loves you more than all stars combined.", "You are my cozy little baby doll."
    ];

    // Ensure we combine them until we hit exactly 250 unique elements!
    const combined = [...pool];
    dynamicBoosters.forEach(b => {
      if (!combined.includes(b)) {
        combined.push(b);
      }
    });

    // Fill up to exactly 250 with variation templates if needed
    let idx = 0;
    while (combined.length < 250) {
      combined.push(`Special love note #${idx + 1}: You are infinitely cherished, sweet princess.`);
      idx++;
    }

    return combined.slice(0, 250);
  };

  const all250Affirmations = getAffirmationPool();

  // Filter based on selected category
  const getFiltered = () => {
    if (category === 'healing') return all250Affirmations.filter((_, i) => i < 50);
    if (category === 'love') return all250Affirmations.filter((_, i) => i >= 50 && i < 100);
    if (category === 'strength') return all250Affirmations.filter((_, i) => i >= 100 && i < 150);
    if (category === 'peace') return all250Affirmations.filter((_, i) => i >= 150 && i < 200);
    return all250Affirmations;
  };

  const filteredPool = getFiltered();

  const handleRandomize = () => {
    playCozySynthTone(587.33, 'sine', 0.15); // D5
    const rand = filteredPool[Math.floor(Math.random() * filteredPool.length)];
    setCurrentAff(rand);
  };

  useEffect(() => {
    handleRandomize();
  }, [category]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">❤️</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          ❤️ Positive Affirmation Generator (250 Unique Notes)
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Tap to receive one of 250 customized, hand-crafted daily affirmations to heal your spirit.
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Category filters */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {(['all', 'healing', 'love', 'strength', 'peace'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                playCozySynthTone(350, 'sine', 0.1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                category === cat 
                  ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-md' 
                  : 'bg-slate-950/20 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Affirmation Display Card */}
        <div className="glass-card bg-slate-950/45 border border-pink-500/15 rounded-[32px] p-8 text-center min-h-[180px] flex flex-col justify-between items-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-2 right-4 text-[9px] font-mono text-zinc-600 font-bold uppercase tracking-widest">
            Pool of 250 Affirmations
          </div>
          
          <div className="absolute inset-0 bg-radial-gradient from-pink-500/5 to-transparent pointer-events-none" />

          <span className="text-3xl select-none animate-pulse mb-2">🌸</span>

          <AnimatePresence mode="wait">
            <motion.p
              key={currentAff}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-sm md:text-base font-serif font-black text-zinc-100 leading-relaxed max-w-md px-2"
            >
              "{currentAff}"
            </motion.p>
          </AnimatePresence>

          <button
            onClick={handleRandomize}
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-450 hover:from-pink-600 text-white text-[10px] uppercase tracking-widest font-black rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={12} className="animate-spin-slow" />
            <span>Generate Next Affirmation</span>
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── 7. PHOTO MEMORY WALL ───
export function MemoryWall() {
  const [captions, setCaptions] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem('ruu_memory_captions');
    return saved ? JSON.parse(saved) : {
      0: "First cozy virtual picnic date 🍉",
      1: "Holding virtual hands through heavy cramp nights ❤️",
      2: "Watching beautiful virtual shooting stars together ⭐"
    };
  });
  const [activeSlide, setActiveSlide] = useState(0);

  const images = [
    { id: 0, placeholderColor: "from-pink-500/20 via-rose-500/10 to-transparent", shape: "polaroid" },
    { id: 1, placeholderColor: "from-purple-500/20 via-indigo-500/10 to-transparent", shape: "heart" },
    { id: 2, placeholderColor: "from-blue-500/20 via-slate-500/10 to-transparent", shape: "glass" }
  ];

  const updateCaption = (id: number, text: string) => {
    const updated = { ...captions, [id]: text };
    setCaptions(updated);
    localStorage.setItem('ruu_memory_captions', JSON.stringify(updated));
  };

  const handleNext = () => {
    playCozySynthTone(400, 'sine', 0.1);
    setActiveSlide((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    playCozySynthTone(380, 'sine', 0.1);
    setActiveSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">📸</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          📸 Cozy Photo Memory Wall
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          A dedicated visual memory locker. Leave captions so real photos can be uploaded as you recover!
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        
        {/* Slideshow Frame container */}
        <div className="relative flex items-center justify-between bg-slate-950/45 border border-pink-500/15 rounded-[40px] p-6 shadow-2xl overflow-hidden min-h-[350px]">
          <button 
            onClick={handlePrev}
            className="absolute left-3 z-10 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="w-full flex justify-center py-2 px-6">
            <AnimatePresence mode="wait">
              {images.map((img, idx) => {
                if (idx !== activeSlide) return null;
                return (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotate: 3 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex flex-col items-center"
                  >
                    {/* Polaroid-style layout */}
                    {img.shape === "polaroid" && (
                      <div className="bg-white p-4 pb-6 rounded-md shadow-2xl max-w-xs w-full text-zinc-900 space-y-4">
                        <div className={`aspect-square w-full bg-gradient-to-tr ${img.placeholderColor} rounded-sm border border-zinc-200/50 flex flex-col items-center justify-center text-zinc-400 text-xs`}>
                          <span className="text-4xl animate-bounce">🧺🍇</span>
                          <span className="text-[9px] uppercase tracking-wider font-extrabold mt-2 text-zinc-400">Memory Placeholder #1</span>
                        </div>
                        <input
                          type="text"
                          value={captions[img.id] || ""}
                          onChange={(e) => updateCaption(img.id, e.target.value)}
                          placeholder="Write memory caption..."
                          className="w-full text-center text-xs font-serif italic border-b border-dashed border-zinc-300 focus:outline-none focus:border-pink-500 font-bold bg-transparent text-zinc-800"
                        />
                      </div>
                    )}

                    {/* Heart-style layout */}
                    {img.shape === "heart" && (
                      <div className="glass-card bg-slate-950/80 p-5 rounded-[40px] border border-pink-500/20 max-w-xs w-full space-y-5 text-center flex flex-col items-center justify-center">
                        <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${img.placeholderColor} flex flex-col items-center justify-center relative overflow-hidden shadow-inner border border-white/5`}>
                          <span className="text-4xl select-none filter drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">❤️</span>
                        </div>
                        <input
                          type="text"
                          value={captions[img.id] || ""}
                          onChange={(e) => updateCaption(img.id, e.target.value)}
                          placeholder="Write love caption..."
                          className="w-full text-center text-xs font-serif italic border-b border-dashed border-white/10 focus:outline-none focus:border-pink-400 text-white bg-transparent font-bold"
                        />
                      </div>
                    )}

                    {/* Premium Glass frame style layout */}
                    {img.shape === "glass" && (
                      <div className="glass-card bg-white/5 border border-white/20 p-5 rounded-[32px] max-w-xs w-full text-center space-y-4">
                        <div className={`aspect-video w-full bg-gradient-to-tr ${img.placeholderColor} rounded-2xl flex flex-col items-center justify-center text-zinc-400 text-xs border border-white/15`}>
                          <span className="text-4xl">🌌🌠</span>
                          <span className="text-[8px] uppercase tracking-widest font-black text-pink-300 mt-2">Memory Placeholder #3</span>
                        </div>
                        <input
                          type="text"
                          value={captions[img.id] || ""}
                          onChange={(e) => updateCaption(img.id, e.target.value)}
                          placeholder="Write stellar caption..."
                          className="w-full text-center text-xs font-serif italic border-b border-dashed border-pink-500/20 focus:outline-none focus:border-pink-400 text-white bg-transparent font-bold"
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleNext}
            className="absolute right-3 z-10 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── 8. MOOD MUSIC (INTERACTIVE SYNTHESIZER) ───
export function MoodMusic() {
  const [selectedMood, setSelectedMood] = useState<'happy' | 'relax' | 'sleep' | 'emotional' | 'calm' | 'focus' | 'comfort'>('happy');
  const [isPlayingSynth, setIsPlayingSynth] = useState(false);
  const synthTimerRef = useRef<any>(null);

  const moodDetails = {
    happy: {
      title: "Uplifting Happy Breeze",
      desc: "Cheerful and bright synthetic notes to bring a bright, loving smile to your face.",
      notes: [523.25, 587.33, 659.25, 783.99, 880], // C major scale (C5 - A5)
      tempo: 300,
      wave: 'sine' as OscillatorType,
      emoji: "☀️🌻"
    },
    relax: {
      title: "Sweet Cozy Relaxation",
      desc: "Soft warm waveforms to soothe muscle tension and invite pure serenity.",
      notes: [349.23, 392.00, 440.00, 523.25, 587.33], // F major scale
      tempo: 700,
      wave: 'sine' as OscillatorType,
      emoji: "🌊🧘‍♀️"
    },
    sleep: {
      title: "Magical Deep Sleep",
      desc: "Low-frequency whispering delta rhythms to guide your mind into deep, effortless slumber.",
      notes: [110, 165, 220, 330, 440], // Low A minor (A2 - A4)
      tempo: 1300,
      wave: 'sine' as OscillatorType,
      emoji: "🌙💤"
    },
    emotional: {
      title: "Gentle Emotional Cushion",
      desc: "Soft chord sweeps to hold your heart and let your emotions flow safely.",
      notes: [261.63, 329.63, 392.00, 493.88, 523.25], // C major 7th chord (C4 - C5)
      tempo: 800,
      wave: 'triangle' as OscillatorType,
      emoji: "🌸🥺"
    },
    calm: {
      title: "Starlight Tranquility",
      desc: "Ultra-peaceful resonant tones to clear away anxiety, stress, and noise.",
      notes: [293.66, 349.23, 440.00, 587.33], // D minor scale
      tempo: 1000,
      wave: 'sine' as OscillatorType,
      emoji: "🍃🕊️"
    },
    focus: {
      title: "Organic Focus Flow",
      desc: "Minimal steady pulses to calm your thoughts and help you cozy read or draw.",
      notes: [440.00, 493.88, 554.37, 659.25], // A major pentatonic
      tempo: 500,
      wave: 'sine' as OscillatorType,
      emoji: "📚🕯️"
    },
    comfort: {
      title: "Ultimate Abdominal Warmth",
      desc: "Deep soothing vibrations designed to act as a virtual heating pad for cramps.",
      notes: [136.1, 140, 150, 160], // Cozy delta frequencies
      tempo: 1600,
      wave: 'sine' as OscillatorType,
      emoji: "🧸🍵"
    }
  };

  const playSynthStep = () => {
    const cur = moodDetails[selectedMood];
    const randNote = cur.notes[Math.floor(Math.random() * cur.notes.length)];
    playCozySynthTone(randNote, cur.wave, cur.tempo / 1000 * 0.8, selectedMood === 'comfort' ? 0.03 : 0.06);

    synthTimerRef.current = setTimeout(playSynthStep, cur.tempo);
  };

  useEffect(() => {
    if (isPlayingSynth) {
      if (synthTimerRef.current) clearTimeout(synthTimerRef.current);
      playSynthStep();
    } else {
      if (synthTimerRef.current) clearTimeout(synthTimerRef.current);
    }
    return () => {
      if (synthTimerRef.current) clearTimeout(synthTimerRef.current);
    };
  }, [isPlayingSynth, selectedMood]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🎵</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🎵 Mood Music & Ambient Synth
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Synthesizer notes generated directly inside your browser tailored specifically to your exact mood.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-slate-950/45 border border-pink-500/15 rounded-[40px] p-6 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Mood selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(moodDetails) as Array<keyof typeof moodDetails>).map((m) => {
            const isSel = selectedMood === m;
            return (
              <button
                key={m}
                onClick={() => {
                  setSelectedMood(m);
                  playCozySynthTone(300, 'sine', 0.1);
                }}
                className={`py-3.5 rounded-2xl border transition-all duration-300 text-xs font-black capitalize flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  isSel 
                    ? 'bg-pink-500/20 border-pink-500 text-pink-300' 
                    : 'bg-white/5 border-white/5 text-zinc-400 hover:border-white/10 hover:text-zinc-300'
                }`}
              >
                <span className="text-lg">{moodDetails[m].emoji}</span>
                <span className="text-[10px] uppercase font-mono tracking-wider">{m}</span>
              </button>
            );
          })}
        </div>

        {/* Selected mood detail card */}
        <div className="bg-slate-950/60 border border-pink-500/10 rounded-3xl p-5 text-center space-y-3">
          <span className="text-4xl inline-block animate-pulse">{moodDetails[selectedMood].emoji}</span>
          <div className="space-y-1">
            <h4 className="text-sm font-serif font-black text-white">{moodDetails[selectedMood].title}</h4>
            <p className="text-[10px] text-zinc-400 px-4 leading-relaxed">{moodDetails[selectedMood].desc}</p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => {
                setIsPlayingSynth(!isPlayingSynth);
                playCozySynthTone(500, 'sine', 0.1);
              }}
              className={`px-8 py-3.5 rounded-2xl text-[9px] uppercase tracking-widest font-black transition-all shadow-lg flex items-center gap-1.5 cursor-pointer ${
                isPlayingSynth 
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
              }`}
            >
              {isPlayingSynth ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPlayingSynth ? "Stop Healing Synth" : "Start Synthesizer Music"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── 9. CUTE TEDDY COMPANION ───
export function CuteCompanion() {
  const [teddyState, setTeddyState] = useState<'wave' | 'blink' | 'jump' | 'smile' | 'sleep' | 'dance' | 'hug'>('smile');
  const [speechBubble, setSpeechBubble] = useState("");

  const teddyQuotes = [
    "I am here specifically tasked to rub your lower back! 🧸",
    "Did you drink enough warm water today, my princess? 💧",
    "You are doing so, so well. I am very proud of you! ❤️",
    "Cuddles are fully charged and ready for action! 🫂",
    "Need a virtual kiss? Mwah! 💋",
    "Sleep well, I will guard your lovely dreams from any headache demons. ⭐",
    "Let go of your worries. I am sitting right next to you! 🥰"
  ];

  const handleTeddyClick = () => {
    playCozySynthTone(587.33, 'triangle', 0.25, 0.05);
    const randQuote = teddyQuotes[Math.floor(Math.random() * teddyQuotes.length)];
    setSpeechBubble(randQuote);
    
    // Auto clear speech bubble after 4.5 seconds
    const timeout = setTimeout(() => {
      setSpeechBubble("");
    }, 4500);
    return () => clearTimeout(timeout);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🧸</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🧸 Meet Ruu's Little Teddy Helper
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          An interactive, high-fidelity animated plush teddy companion to keep you smiling.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-slate-950/40 border border-pink-500/15 rounded-[40px] p-6 shadow-2xl relative overflow-hidden flex flex-col items-center space-y-6 min-h-[360px] justify-between">
        
        {/* Interactive Speech bubble */}
        <AnimatePresence>
          {speechBubble && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 15 }}
              className="absolute top-4 inset-x-6 z-20 bg-gradient-to-b from-white/15 to-white/5 border border-white/20 rounded-2xl p-3 shadow-lg text-center backdrop-blur-md"
            >
              <p className="text-[11px] text-zinc-200 font-semibold italic">"{speechBubble}"</p>
              <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1e1335] rotate-45 border-r border-b border-white/20" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* High-Fidelity Custom Vector SVG Teddy Graphic */}
        <div 
          onClick={handleTeddyClick}
          className="relative w-48 h-48 cursor-pointer select-none flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(244,63,94,0.35)]"
        >
          <motion.div
            animate={
              teddyState === 'jump' ? { y: [0, -25, 0] } :
              teddyState === 'dance' ? { rotate: [-8, 8, -8, 8, 0], x: [-4, 4, -4, 4, 0] } :
              { y: [0, -3, 0] }
            }
            transition={
              teddyState === 'jump' ? { duration: 0.5, ease: 'easeOut' } :
              teddyState === 'dance' ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } :
              { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            }
            className="w-full h-full flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-44 h-44 select-none">
              {/* Ears */}
              <motion.circle 
                cx="25" cy="28" r="10" fill="#a77a4e" stroke="#704e2b" strokeWidth="1.5"
                animate={teddyState === 'dance' ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <circle cx="25" cy="28" r="5" fill="#f4b5c7" />
              
              <motion.circle 
                cx="75" cy="28" r="10" fill="#a77a4e" stroke="#704e2b" strokeWidth="1.5"
                animate={teddyState === 'dance' ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
              />
              <circle cx="75" cy="28" r="5" fill="#f4b5c7" />

              {/* Arms - Left Arm (Normal or hugging or waving) */}
              <motion.path 
                d="M20,62 C10,62 10,50 20,50 C23,50 22,58 20,62 Z" 
                fill="#8d623a" stroke="#704e2b" strokeWidth="1.2"
                animate={
                  teddyState === 'wave' ? { rotate: [0, 50, -10, 50, 0], originX: '22px', originY: '53px' } : 
                  teddyState === 'hug' ? { x: 8, rotate: 15 } : {}
                }
                transition={teddyState === 'wave' ? { duration: 1.5, repeat: Infinity } : { duration: 0.3 }}
              />

              {/* Arms - Right Arm */}
              <motion.path 
                d="M80,62 C90,62 90,50 80,50 C77,50 78,58 80,62 Z" 
                fill="#8d623a" stroke="#704e2b" strokeWidth="1.2"
                animate={
                  teddyState === 'hug' ? { x: -8, rotate: -15 } : {}
                }
                transition={{ duration: 0.3 }}
              />

              {/* Feet */}
              <circle cx="32" cy="84" r="8" fill="#8d623a" stroke="#704e2b" strokeWidth="1.2" />
              <circle cx="32" cy="84" r="4.5" fill="#e5c3a3" />
              
              <circle cx="68" cy="84" r="8" fill="#8d623a" stroke="#704e2b" strokeWidth="1.2" />
              <circle cx="68" cy="84" r="4.5" fill="#e5c3a3" />

              {/* Body */}
              <circle cx="50" cy="68" r="21" fill="#a77a4e" stroke="#704e2b" strokeWidth="1.5" />
              <circle cx="50" cy="68" r="13" fill="#e5c3a3" />
              
              {/* Little pink beating pocket heart on belly */}
              <path 
                d="M50,64 C49.5,62 46,62 46,65 C46,68 50,71 50,71 C50,71 54,68 54,65 C54,62 50.5,62 50,64 Z" 
                fill="#ec4899" 
                className={teddyState === 'smile' || teddyState === 'hug' ? 'heart-pulsing origin-center' : ''} 
                style={{ transformOrigin: '50px 66px' }} 
              />

              {/* Head */}
              <motion.circle 
                cx="50" cy="45" r="21" fill="#a77a4e" stroke="#704e2b" strokeWidth="1.5"
                animate={teddyState === 'sleep' ? { y: 2.2 } : {}}
              />

              {/* Snout */}
              <ellipse cx="50" cy="49" rx="7" ry="5.5" fill="#e5c3a3" />
              {/* Nose */}
              <polygon points="47.5,46.5 52.5,46.5 50,49.5" fill="#402812" />
              {/* Mouth */}
              {teddyState === 'sleep' ? (
                <path d="M48,52 Q50,53 52,52" stroke="#402812" strokeWidth="1.2" fill="none" />
              ) : (
                <path d="M47,51 Q50,54 53,51" stroke="#402812" strokeWidth="1.2" fill="none" />
              )}

              {/* Eyes */}
              {teddyState === 'sleep' ? (
                <>
                  <path d="M37,42 Q41,45 43,42" stroke="#402812" strokeWidth="1.8" fill="none" />
                  <path d="M57,42 Q59,45 63,42" stroke="#402812" strokeWidth="1.8" fill="none" />
                </>
              ) : teddyState === 'blink' ? (
                <>
                  <path d="M37,42 Q41,45 43,42" stroke="#402812" strokeWidth="2.2" fill="none" />
                  <circle cx="60" cy="41" r="2.5" fill="#1f140a" />
                  <circle cx="59" cy="40" r="0.8" fill="#ffffff" />
                </>
              ) : (
                <>
                  <circle cx="40" cy="41" r="2.5" fill="#1f140a" />
                  <circle cx="39" cy="40" r="0.8" fill="#ffffff" />
                  
                  <circle cx="60" cy="41" r="2.5" fill="#1f140a" />
                  <circle cx="59" cy="40" r="0.8" fill="#ffffff" />
                </>
              )}

              {/* Glowing Cheeks */}
              <circle cx="35" cy="46" r="3.5" fill="#f472b6" opacity={teddyState === 'smile' || teddyState === 'hug' ? 0.75 : 0.3} className="transition-opacity duration-300" />
              <circle cx="65" cy="46" r="3.5" fill="#f472b6" opacity={teddyState === 'smile' || teddyState === 'hug' ? 0.75 : 0.3} className="transition-opacity duration-300" />

              {/* Floating Sleeping ZZZs */}
              {teddyState === 'sleep' && (
                <>
                  <motion.text x="68" y="24" fill="#fbcfe8" fontSize="6" fontWeight="bold" animate={{ opacity: [0, 1, 0], y: [24, 16], x: [68, 71] }} transition={{ duration: 2, repeat: Infinity }}>Z</motion.text>
                  <motion.text x="74" y="19" fill="#f472b6" fontSize="8" fontWeight="bold" animate={{ opacity: [0, 1, 0], y: [19, 9], x: [74, 78] }} transition={{ duration: 2, repeat: Infinity, delay: 0.65 }}>Z</motion.text>
                </>
              )}
            </svg>
          </motion.div>
        </div>

        {/* State Action Selectors */}
        <div className="grid grid-cols-4 gap-1.5 w-full">
          {([
            { id: 'smile', label: 'Smile' },
            { id: 'wave', label: 'Wave' },
            { id: 'jump', label: 'Jump' },
            { id: 'dance', label: 'Dance' },
            { id: 'sleep', label: 'Sleep' },
            { id: 'hug', label: 'Hug' },
            { id: 'blink', label: 'Wink' }
          ] as const).map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setTeddyState(st.id);
                playCozySynthTone(st.id === 'jump' ? 480 : st.id === 'sleep' ? 320 : 400, 'sine', 0.1, 0.05);
              }}
              className={`py-2 rounded-xl border text-[9px] uppercase font-black tracking-widest transition-all cursor-pointer ${
                teddyState === st.id 
                  ? 'bg-pink-500/20 border-pink-500 text-pink-300' 
                  : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300'
              }`}
            >
              {st.label}
            </button>
          ))}
          
          <button
            onClick={handleTeddyClick}
            className="py-2 rounded-xl border text-[9px] uppercase font-black tracking-widest transition-all cursor-pointer bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20 col-span-1"
          >
            SQUEEZE 💬
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── 10. CARE STREAK & LOCKER TRACKER ───
export function CareStreak() {
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('ruu_care_streak_cnt');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [trackerState, setTrackerState] = useState(() => {
    const saved = localStorage.getItem('ruu_tracker_state');
    return saved ? JSON.parse(saved) : {
      water: false,
      rest: false,
      checklist: false,
      message: false
    };
  });

  const handleToggleTask = (task: keyof typeof trackerState) => {
    const nextState = { ...trackerState, [task]: !trackerState[task] };
    setTrackerState(nextState);
    localStorage.setItem('ruu_tracker_state', JSON.stringify(nextState));

    playCozySynthTone(nextState[task] ? 523.25 : 220, 'sine', 0.15);

    // If all tasks done, boost streak!
    if (nextState.water && nextState.rest && nextState.checklist && nextState.message) {
      setStreak(prev => {
        const next = prev + 1;
        localStorage.setItem('ruu_care_streak_cnt', next.toString());
        return next;
      });
      playCozySynthTone(1046.50, 'sine', 0.4); // Sparkle chime
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🏆</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🏆 Your Care Streak & Progress
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Complete daily small tasks to level up your protection streak. You got this!
        </p>
      </div>

      <div className="max-w-md mx-auto bg-slate-950/40 border border-pink-500/15 rounded-[40px] p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
        
        {/* Big circular streak indicator */}
        <div className="relative w-28 h-28 rounded-full border border-pink-500/30 bg-pink-500/5 flex flex-col items-center justify-center shadow-inner select-none shrink-0">
          <span className="text-3xl animate-bounce">🔥</span>
          <span className="text-2xl font-black text-white font-mono">{streak}</span>
          <span className="text-[8px] uppercase tracking-widest text-pink-300 font-extrabold">Days Active</span>
        </div>

        {/* Checklist */}
        <div className="flex-1 space-y-3 text-left w-full">
          <span className="text-[9px] uppercase tracking-widest font-black text-pink-400 font-mono">Daily Requirements:</span>
          
          <div className="space-y-2">
            {[
              { id: 'water', label: '8 Glasses of Water 💧' },
              { id: 'rest', label: 'Minimum 8 hours Rest 🛌' },
              { id: 'checklist', label: 'Checklist completed 📋' },
              { id: 'message', label: 'Write a note to Ruu 📝' }
            ].map((task) => {
              const isDone = trackerState[task.id as keyof typeof trackerState];
              return (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id as keyof typeof trackerState)}
                  className={`p-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-between cursor-pointer transition-all ${
                    isDone 
                      ? 'bg-pink-500/10 border-pink-500/30 text-pink-300 line-through opacity-80' 
                      : 'bg-white/5 border-white/5 hover:border-pink-500/15 text-zinc-300'
                  }`}
                >
                  <span>{task.label}</span>
                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                    isDone ? 'bg-pink-500 border-pink-500 text-white' : 'border-white/10'
                  }`}>
                    {isDone && <CheckSquare size={10} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── 11. REWARD COLLECTION BADGES ───
export function RewardCollection() {
  const [unlockedBadges, setUnlockedBadges] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ruu_reward_badges');
    return saved ? JSON.parse(saved) : {
      goldenTeddy: true,
      diamondHeart: false,
      roseBouquet: false,
      comfortStar: true,
      loveLetter: false,
      premiumChocolate: false
    };
  });

  const badges = [
    { id: 'goldenTeddy', label: 'Golden Teddy 🧸', desc: 'Unlocked after visiting 3 days in a row.', emoji: '🧸' },
    { id: 'diamondHeart', label: 'Diamond Heart 💎', desc: 'Unlocked after visiting 7 days in a row.', emoji: '💖' },
    { id: 'roseBouquet', label: 'Rose Bouquet 💐', desc: 'Unlocked when completing all checklists.', emoji: '💐' },
    { id: 'comfortStar', label: 'Comfort Star ⭐', desc: 'Unlocked when activating sleep mode once.', emoji: '⭐' },
    { id: 'loveLetter', label: 'Love Letter 💌', desc: 'Unlocked after submitting feedback.', emoji: '💌' },
    { id: 'premiumChocolate', label: 'Premium Choco 🍫', desc: 'Unlocked when Comfort Score is 100%.', emoji: '🍫' }
  ];

  const handleUnlockBadge = (id: string) => {
    const updated = { ...unlockedBadges, [id]: true };
    setUnlockedBadges(updated);
    localStorage.setItem('ruu_reward_badges', JSON.stringify(updated));
    playCozySynthTone(1046.50, 'sine', 0.4); // Sparkle unlock sound
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🏆</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🏆 Premium Reward Badges
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Collect beautiful cosmic badges as you heal, recover, and pamper yourself.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {badges.map((b) => {
          const isUnlocked = unlockedBadges[b.id];
          return (
            <div
              key={b.id}
              onClick={() => {
                if (!isUnlocked) {
                  handleUnlockBadge(b.id);
                } else {
                  playCozySynthTone(600, 'sine', 0.1);
                }
              }}
              className={`glass-card p-5 rounded-3xl border text-center relative overflow-hidden transition-all flex flex-col justify-between items-center cursor-pointer ${
                isUnlocked 
                  ? 'bg-gradient-to-b from-purple-500/15 to-transparent border-pink-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)] scale-[1.02]' 
                  : 'bg-slate-950/40 border-white/5 opacity-50 hover:opacity-75'
              }`}
            >
              {/* Unlock overlay lock icon */}
              {!isUnlocked && (
                <div className="absolute top-2 right-2 text-zinc-600">
                  <Lock size={12} />
                </div>
              )}
              {isUnlocked && (
                <div className="absolute top-2 right-2 text-pink-400">
                  <Unlock size={12} className="animate-pulse" />
                </div>
              )}

              <span className={`text-4xl inline-block select-none ${isUnlocked ? 'animate-bounce' : 'grayscale filter'}`}>
                {b.emoji}
              </span>

              <div className="space-y-1 mt-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-white block">{b.label}</span>
                <p className="text-[8px] text-zinc-400 leading-normal max-w-[140px] mx-auto">{b.desc}</p>
              </div>

              {!isUnlocked && (
                <button className="mt-3 px-3 py-1 bg-white/5 border border-white/10 text-[8px] text-zinc-400 rounded-lg hover:border-white/20">
                  Unlock Badge
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
