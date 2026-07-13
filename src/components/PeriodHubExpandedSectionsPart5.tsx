import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Sparkles, Smile, Coffee, Sun, Moon, Volume2, VolumeX, Gift, 
  ChevronRight, RefreshCw, Feather, Award, HeartHandshake, Star, 
  HelpCircle, Compass, CheckCircle2, RotateCcw, Flame
} from 'lucide-react';

// --- COZY AUDIO HELPER ---
function playComfortTone(freq: number, type: OscillatorType = 'sine', duration = 0.5, volume = 0.08) {
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

// ─── 1. DAILY CARE COMPANION ───
export function DailyCareCompanion() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();

  // Determine current care state
  let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'night';
  if (hour >= 5 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';

  const configs = {
    morning: {
      title: "Good Morning, Princess! ☀️",
      emoji: "🌸",
      themeBg: "from-amber-200/20 to-pink-500/10",
      accent: "text-amber-300",
      greeting: "Wake up gently, my favorite human. Today is a new day to cherish you. Remember to take small, easy steps, stretch, and wrap yourself in soft fabrics.",
      tips: [
        "Drink a big glass of warm lemon water to soothe cramp muscles.",
        "Take a slow 2-minute stretch on your cozy mattress.",
        "Put on your warm, fuzzy socks and a loose oversized sweater."
      ],
      companionThought: "Teddy is already boiling water for your morning tea! 🫖"
    },
    afternoon: {
      title: "Sweet Afternoon Check-in 🌤️",
      emoji: "🧸",
      themeBg: "from-pink-500/10 to-rose-400/10",
      accent: "text-rose-300",
      greeting: "You are doing so wonderfully today. The afternoon is a perfect time to take a tiny pause. Let go of any stress, close your eyes, and take deep breaths.",
      tips: [
        "Enjoy a cup of warm chamomile or lavender herbal tea.",
        "Take a 15-minute lazy cat nap to recharge your beautiful mind.",
        "A small piece of dark chocolate can relieve tension right now."
      ],
      companionThought: "Teddy recommends a snuggly pillow behind your back! 🛋️"
    },
    evening: {
      title: "Cozy Evening Relaxation 🌅",
      emoji: "🍵",
      themeBg: "from-purple-500/10 to-pink-500/10",
      accent: "text-purple-300",
      greeting: "The sun is setting, and you deserve supreme comfort. Turn down the lights, let's put on some relaxing piano tunes, and treat yourself with pure love.",
      tips: [
        "Warm up your magical heating pad and place it on your tummy.",
        "Eat a warm, comforting bowl of soup or lightweight meal.",
        "Dim the room lights to allow your eyes and nerves to rest."
      ],
      companionThought: "Teddy is hugging your hot water bottle tightly to warm it! 🔥"
    },
    night: {
      title: "Safe & Cozy Night, My Star 🌙",
      emoji: "✨",
      themeBg: "from-indigo-950/40 to-purple-950/35",
      accent: "text-indigo-300",
      greeting: "You survived the day beautifully. Close your eyes, let Ruu's love protect your dreams. No worries, no stress, only soft blankets and infinite security.",
      tips: [
        "Keep your phone far away and cuddle under your heavy duvet.",
        "Listen to the soft rain generator here for a peaceful slumber.",
        "Remember you are deeply, unconditionally loved every second."
      ],
      companionThought: "Teddy is sleeping at your feet keeping you 100% safe! 💤"
    }
  };

  const current = configs[timeOfDay];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-[40px] p-6 md:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-br ${current.themeBg}`}
    >
      <div className="absolute top-4 right-4 text-xs font-mono opacity-60">
        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Visual Companion avatar */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-slate-950/40 rounded-3xl border border-white/5">
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [-2, 2, -2]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl mb-3 select-none"
          >
            {current.emoji}
          </motion.div>
          
          <h4 className={`text-sm font-serif font-black ${current.accent}`}>
            {timeOfDay.toUpperCase()} COMPANION
          </h4>
          <p className="text-[11px] text-zinc-400 mt-1 italic">
            "{current.companionThought}"
          </p>
        </div>

        {/* Companion Content */}
        <div className="md:col-span-8 space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-serif font-black text-transparent bg-gradient-to-r from-white via-pink-100 to-zinc-200 bg-clip-text">
              {current.title}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-serif">
              {current.greeting}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 font-bold">
              Suggested Care Focus
            </span>
            <ul className="space-y-2">
              {current.tips.map((tip, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-start gap-2.5 text-xs text-zinc-300"
                >
                  <span className="text-pink-500 text-xs shrink-0 mt-0.5">🌸</span>
                  <span>{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── 2. COMFORT WHEEL ───
const COMFORT_REWARDS = [
  { id: 'love', label: 'Love ❤️', color: '#f43f5e', desc: 'Ruu sends you a warm, dynamic heart stardust blessing!', sound: 523.25 },
  { id: 'hug', label: 'Hug 🫂', color: '#ec4899', desc: 'An infinite snuggly teddy hug wrapped around your shoulders!', sound: 587.33 },
  { id: 'teddy', label: 'Teddy 🧸', color: '#d97706', desc: 'A brand new cute companion teddy added to your secret bedside cabinet!', sound: 659.25 },
  { id: 'chocolate', label: 'Chocolate 🍫', color: '#b45309', desc: 'A virtual gourmet gold-wrapped hazelnut comfort chocolate!', sound: 698.46 },
  { id: 'flowers', label: 'Flowers 🌹', color: '#10b981', desc: 'A lovely bundle of fresh red roses to brighten your mood!', sound: 783.99 },
  { id: 'letter', label: 'Letter 💌', color: '#a855f7', desc: 'A beautiful handwritten love scroll with warm comforting words!', sound: 880.00 },
  { id: 'coffee', label: 'Coffee ☕', color: '#f59e0b', desc: 'A warm mug of organic mocha with sweet marshmallow topping!', sound: 987.77 },
  { id: 'tea', label: 'Tea 🍵', color: '#84cc16', desc: 'A cup of soothing organic chamomile peppermint tea!', sound: 1046.50 },
  { id: 'compliment', label: 'Compliment ✨', color: '#06b6d4', desc: '"You are the absolute prettiest, strongest, and most incredible girl!"', sound: 1174.66 }
];

export function ComfortWheel() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [reward, setReward] = useState<typeof COMFORT_REWARDS[0] | null>(null);
  const [rewardsHistory, setRewardsHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('ruu_comfort_wheel_history');
    return saved ? JSON.parse(saved) : [];
  });

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setReward(null);
    playComfortTone(440, 'triangle', 0.2, 0.1);

    // Dynamic rotation: spin at least 5 times (1800 deg) plus extra random degree
    const randomExtra = Math.floor(Math.random() * 360);
    const targetRot = rotation + 1800 + randomExtra;
    setRotation(targetRot);

    // Calculate index from angle
    const sliceAngle = 360 / COMFORT_REWARDS.length;
    const finalAngle = targetRot % 360;
    // Wheel rotates clockwise, so active slice is offset from top (270 deg)
    const rawIdx = Math.floor((360 - finalAngle) / sliceAngle) % COMFORT_REWARDS.length;
    const winningReward = COMFORT_REWARDS[rawIdx];

    setTimeout(() => {
      setSpinning(false);
      setReward(winningReward);
      playComfortTone(winningReward.sound, 'sine', 0.8, 0.15);

      // Save to history
      const newHist = [winningReward.label, ...rewardsHistory.slice(0, 4)];
      setRewardsHistory(newHist);
      localStorage.setItem('ruu_comfort_wheel_history', JSON.stringify(newHist));

      // Trigger a visual update on the counter if state persists
      try {
        const counters = JSON.parse(localStorage.getItem('ruu_comfort_counters') || '{}');
        const key = winningReward.id + 's'; // simple plural mapping e.g. loves, teddies
        counters[key] = (counters[key] || 0) + 1;
        localStorage.setItem('ruu_comfort_counters', JSON.stringify(counters));
      } catch (e) {}

    }, 3500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">💖</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          Cozy Comfort Prize Wheel
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Take a gentle spin to receive a sweet digital care prescription from Ruu!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto bg-slate-950/40 border border-white/5 rounded-[36px] p-6">
        {/* Left column: The Wheel */}
        <div className="flex flex-col items-center justify-center relative py-4">
          <div className="relative w-64 h-64 md:w-72 md:h-72">
            
            {/* Outer golden rim glow */}
            <div className="absolute inset-0 rounded-full border-[6px] border-pink-500/30 blur-sm pointer-events-none" />

            {/* Pointer indicator */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[18px] border-t-pink-500 drop-shadow-md" />

            {/* Wheel Canvas wrapper */}
            <div 
              style={{ 
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 3.5s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none'
              }}
              className="w-full h-full rounded-full border-4 border-white/20 overflow-hidden relative shadow-2xl select-none"
            >
              {/* Pie segments rendered dynamically in standard conic gradient */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {COMFORT_REWARDS.map((rew, idx) => {
                  const angle = 360 / COMFORT_REWARDS.length;
                  const startAngle = idx * angle;
                  const endAngle = (idx + 1) * angle;

                  // Convert polar to cartesian
                  const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);

                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                  // Calculate label coordinates
                  const midAngle = startAngle + angle / 2;
                  const rx = 50 + 32 * Math.cos((midAngle * Math.PI) / 180);
                  const ry = 50 + 32 * Math.sin((midAngle * Math.PI) / 180);

                  return (
                    <g key={rew.id}>
                      <path d={pathData} fill={rew.color} opacity={0.3} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                      <text 
                        x={rx} 
                        y={ry} 
                        fill="#fbcfe8" 
                        fontSize="3.8" 
                        fontWeight="bold"
                        textAnchor="middle" 
                        alignmentBaseline="middle"
                        transform={`rotate(${midAngle + 90}, ${rx}, ${ry})`}
                      >
                        {rew.label.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
                <circle cx="50" cy="50" r="8" fill="#1e1b4b" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              </svg>
            </div>

            {/* Middle hub spin button */}
            <button 
              onClick={spinWheel}
              disabled={spinning}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-white/20 text-xs font-serif font-black flex items-center justify-center cursor-pointer shadow-lg transition-all ${
                spinning 
                  ? 'bg-zinc-800 text-zinc-500 scale-95' 
                  : 'bg-gradient-to-br from-pink-500 to-rose-450 hover:to-pink-600 text-white hover:scale-105 active:scale-95'
              }`}
            >
              {spinning ? "SPINNING" : "SPIN!"}
            </button>
          </div>
        </div>

        {/* Right column: Details and History */}
        <div className="flex flex-col justify-center space-y-4">
          <AnimatePresence mode="wait">
            {reward ? (
              <motion.div 
                key="reward"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="p-5 bg-gradient-to-r from-pink-500/15 to-purple-500/10 border border-pink-500/25 rounded-2xl text-center md:text-left space-y-2 shadow-inner"
              >
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-xl">🎉</span>
                  <h4 className="font-serif font-black text-pink-300 text-md">
                    You Received: {reward.label}
                  </h4>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  {reward.desc}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 bg-white/5 border border-white/5 rounded-2xl text-center md:text-left space-y-2"
              >
                <h4 className="font-serif font-bold text-zinc-300 text-sm">
                  Waiting to spin...
                </h4>
                <p className="text-xs text-zinc-400">
                  Every spin guarantees warm feelings. Rest your fingers, take a deep breath, and press center button!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-semibold">
              Recent Spun Rewards
            </span>
            <div className="flex flex-wrap gap-2">
              {rewardsHistory.length > 0 ? (
                rewardsHistory.map((h, i) => (
                  <span 
                    key={i} 
                    className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-xs text-zinc-300"
                  >
                    {h}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-500 italic">No spins yet today</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 3. KINDNESS WALL ───
const KINDNESS_QUOTES = [
  "You are enough.",
  "You deserve kindness.",
  "I'm proud of you.",
  "Rest without guilt.",
  "You are stronger than you know.",
  "Your comfort is a priority.",
  "Breathe, my lovely girl.",
  "You are safe here.",
  "Ruu is holding your hand.",
  "This pain is only temporary.",
  "It is okay to do absolutely nothing.",
  "You are doing exceptionally well.",
  "Be gentle with your golden heart.",
  "You are deeply, unconditionally loved.",
  "Soft beds, warm teas, and infinite care.",
  "Take all the time you need.",
  "Your feelings are valid and safe.",
  "You are the light of my universe."
];

export function KindnessWall() {
  const [activeNotes, setActiveNotes] = useState<string[]>([]);

  useEffect(() => {
    // Populate an initial list
    const shuffled = [...KINDNESS_QUOTES].sort(() => 0.5 - Math.random());
    setActiveNotes(shuffled.slice(0, 10));

    // Dynamic rotation intervals to cycle messages
    const interval = setInterval(() => {
      setActiveNotes(prev => {
        const next = [...prev];
        next.shift();
        const unused = KINDNESS_QUOTES.filter(q => !next.includes(q));
        const pick = unused[Math.floor(Math.random() * unused.length)];
        next.push(pick || KINDNESS_QUOTES[0]);
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🌈</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          Interactive Kindness Wall
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          A continuous, beautiful cascade of soothing notes specifically designed to lift your spirits.
        </p>
      </div>

      <div className="relative w-full overflow-hidden py-4 select-none">
        {/* Soft left/right gradients */}
        <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 flex-wrap justify-center max-w-4xl mx-auto px-4">
          <AnimatePresence>
            {activeNotes.map((note, idx) => (
              <motion.div
                key={note}
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -15 }}
                transition={{ duration: 0.5 }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 text-xs font-serif font-medium text-zinc-200 hover:border-pink-500/30 transition-all flex items-center gap-2 cursor-pointer"
                onClick={() => playComfortTone(400 + idx * 40, 'sine', 0.2, 0.05)}
              >
                <span className="text-pink-500">🌸</span>
                <span>{note}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── 4. COMFORT MEDITATION ───
export function ComfortMeditation() {
  const [active, setActive] = useState(false);
  const [medStep, setMedStep] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [seconds, setSeconds] = useState(4);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Sound generator
  const startSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime); // calming hum

      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      console.warn(e);
    }
  };

  const stopSound = () => {
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch (e) {}
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (active) {
      startSound();
      timer = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            // cycle to next meditation stage
            setMedStep(curr => {
              if (curr === 'inhale') {
                if (gainNodeRef.current && audioContextRef.current) {
                  gainNodeRef.current.gain.setValueAtTime(0.06, audioContextRef.current.currentTime);
                }
                return 'hold1';
              }
              if (curr === 'hold1') {
                if (gainNodeRef.current && audioContextRef.current) {
                  gainNodeRef.current.gain.linearRampToValueAtTime(0.02, audioContextRef.current.currentTime + 4);
                }
                return 'exhale';
              }
              if (curr === 'exhale') {
                if (gainNodeRef.current && audioContextRef.current) {
                  gainNodeRef.current.gain.setValueAtTime(0.01, audioContextRef.current.currentTime);
                }
                return 'hold2';
              }
              if (gainNodeRef.current && audioContextRef.current) {
                gainNodeRef.current.gain.linearRampToValueAtTime(0.04, audioContextRef.current.currentTime + 4);
              }
              return 'inhale';
            });
            return 4; // Reset to 4 seconds
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopSound();
      setMedStep('inhale');
      setSeconds(4);
    }

    return () => {
      clearInterval(timer);
      stopSound();
    };
  }, [active, soundEnabled]);

  const stepDetails = {
    inhale: {
      text: "Breathe in sweet pink stardust...",
      scale: 1.5,
      gradient: "from-pink-500/20 to-rose-400/20",
      accent: "border-pink-500"
    },
    hold1: {
      text: "Hold the warm comfort inside...",
      scale: 1.5,
      gradient: "from-amber-400/25 to-pink-500/20",
      accent: "border-amber-400"
    },
    exhale: {
      text: "Slowly let go of all muscle tension...",
      scale: 0.95,
      gradient: "from-purple-500/20 to-pink-500/10",
      accent: "border-purple-500"
    },
    hold2: {
      text: "Rest completely in the silent gap...",
      scale: 0.95,
      gradient: "from-slate-900 to-slate-950",
      accent: "border-zinc-700"
    }
  };

  const currentStep = stepDetails[medStep];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🫂</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          Uplifting Cramp Relief Meditation
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          A rhythmic breathing visualizer synchronized to soothe your body, pelvic muscles, and soul.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-slate-950/45 border border-white/5 rounded-[40px] p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
        
        {/* Breathing Circle Container */}
        <div className="relative w-60 h-60 flex items-center justify-center">
          <AnimatePresence>
            {active && (
              <motion.div
                key={medStep}
                initial={{ scale: medStep === 'inhale' ? 0.95 : 1.5, opacity: 0.2 }}
                animate={{ scale: currentStep.scale, opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className={`absolute inset-4 rounded-full bg-gradient-to-br ${currentStep.gradient} blur-xl pointer-events-none`}
              />
            )}
          </AnimatePresence>

          <motion.div
            animate={active ? {
              scale: currentStep.scale,
            } : { scale: 1 }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className={`w-36 h-36 rounded-full border-4 ${currentStep.accent} bg-slate-950/80 flex flex-col items-center justify-center z-10 transition-colors duration-1000`}
          >
            <span className="text-2xl font-serif font-black text-zinc-100">
              {active ? seconds : "🌸"}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-pink-400 font-bold mt-1">
              {active ? medStep.toUpperCase() : "Ready"}
            </span>
          </motion.div>
        </div>

        {/* Dynamic Instructions */}
        <div className="space-y-2 max-w-md">
          <h4 className="text-sm font-serif font-black text-zinc-200 min-h-6">
            {active ? currentStep.text : "Press Start to begin breathing with Teddy"}
          </h4>
          <p className="text-xs text-zinc-400">
            "Slowing your breathing down sends safety triggers to your nerves, immediately reducing cramp perception."
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              setActive(!active);
              playComfortTone(523, 'sine', 0.3, 0.1);
            }}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-450 text-white text-xs font-serif font-bold hover:scale-103 cursor-pointer"
          >
            {active ? "Pause Meditation" : "Start Comfort Breathing"}
          </button>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playComfortTone(440, 'sine', 0.1, 0.05);
            }}
            className={`px-4 py-2.5 rounded-full border text-xs font-serif font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              soundEnabled 
                ? 'bg-pink-500/15 border-pink-500/30 text-pink-300' 
                : 'bg-white/5 border-white/5 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Volume2 size={13} />
            <span>Ambient Sound: {soundEnabled ? "ON 🎶" : "OFF"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 5. VIRTUAL GIFT SHELF ───
const GIFTS = [
  { id: 'heart', label: 'Love Heart ❤️', emoji: '❤️', desc: 'Sustained pure stardust affection.', date: 'Day 1' },
  { id: 'teddy', label: 'Sweet Teddy 🧸', emoji: '🧸', desc: 'Extra fuzzy sleeping bed companion.', date: 'Day 2' },
  { id: 'rose', label: 'Crimson Rose 🌹', emoji: '🌹', desc: 'Everlasting fresh aroma rose.', date: 'Day 3' },
  { id: 'cocoa', label: 'Hot Cocoa ☕', emoji: '☕', desc: 'Rich chocolate with double vanilla marshmallows.', date: 'Day 4' },
  { id: 'truffle', label: 'Choc Truffle 🍫', emoji: '🍫', desc: 'Decadent dark caramel sweet relief.', date: 'Day 5' },
  { id: 'star', label: 'Golden Star ⭐️', emoji: '⭐️', desc: 'Twinkling guardian starlight.', date: 'Day 6' },
  { id: 'mug', label: 'Comfort Mug 🍵', emoji: '🍵', desc: 'Infinite warm mint lavender tea refills.', date: 'Day 7' },
  { id: 'butterfly', label: 'Magic Butterfly 🦋', emoji: '🦋', desc: 'Spreads neon comfort powder.', date: 'Day 8' }
];

export function VirtualGiftShelf() {
  const [selectedGift, setSelectedGift] = useState<typeof GIFTS[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🌹</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          My Unlocked Virtual Gift Cabinet
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Hover or tap any precious comforting items Ruu has unlocked or gifted you so far.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Shelf structure */}
        <div className="relative bg-slate-950/45 border border-pink-500/10 rounded-[32px] p-6 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 pb-4">
            {GIFTS.map((g) => (
              <motion.div
                key={g.id}
                whileHover={{ scale: 1.1, y: -4 }}
                onClick={() => {
                  setSelectedGift(g);
                  playComfortTone(587, 'sine', 0.15, 0.08);
                }}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-500/20 transition-all cursor-pointer select-none"
              >
                <span className="text-3xl filter drop-shadow-md">{g.emoji}</span>
                <span className="text-[10px] text-zinc-400 font-serif mt-2 truncate max-w-full text-center">
                  {g.label.split(' ')[0]}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Wooden style shelf divider bar */}
          <div className="h-2.5 bg-gradient-to-r from-amber-900/40 via-amber-700/55 to-amber-900/40 rounded-full border border-amber-800/20 shadow-md" />
        </div>

        {/* Selected Gift Showcase Detail */}
        <AnimatePresence mode="wait">
          {selectedGift && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 bg-gradient-to-r from-amber-500/10 to-pink-500/5 border border-amber-500/20 rounded-2xl max-w-md mx-auto text-center space-y-1.5"
            >
              <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">{selectedGift.emoji}</span>
              <h4 className="font-serif font-black text-amber-200 text-sm">{selectedGift.label}</h4>
              <p className="text-xs text-zinc-300 italic">"{selectedGift.desc}"</p>
              <div className="text-[10px] font-mono uppercase text-pink-400 tracking-wider">
                Unlocked status: {selectedGift.date}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── 6. LOVE TIMELINE ───
const TIMELINE_STEPS = [
  { stage: "Morning Care", time: "08:00 AM", emoji: "☀️", note: "Ruu says: 'Did you wake up safely, my rose? Please do not skip breakfast! Eat something hot and slow.'" },
  { stage: "Afternoon Check", time: "01:00 PM", emoji: "🌤️", note: "Ruu says: 'You are so brave and strong. Remember to stretch out and refill your lavender tea. I am kissing your forehead from here.'" },
  { stage: "Evening Relieve", time: "06:00 PM", emoji: "🌅", note: "Ruu says: 'Turn on the fireplace sounds and heat up the heating pad immediately. Give yourself permission to let the day fade away.'" },
  { stage: "Night Comfort", time: "10:00 PM", emoji: "🌙", note: "Ruu says: 'My precious sweet girl, curl up tight. I have set up a magical dome of safety over your bed. Sweetest dreams, my star!'" }
];

export function LoveTimeline() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">💌</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          Love & Comfort Care Timeline
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Tap each critical segment of the day to discover hand-written virtual notes from Ruu.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8 select-none">
        {/* Timeline Line Grid */}
        <div className="relative flex flex-col md:flex-row md:justify-between items-center gap-8 md:gap-4 bg-slate-950/45 border border-white/5 rounded-[36px] p-8">
          
          {/* Connector bar (desktop) */}
          <div className="hidden md:block absolute left-12 right-12 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-pink-500/10 via-pink-500/40 to-purple-500/10 rounded-full z-0" />

          {TIMELINE_STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-2 w-full md:w-auto">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => {
                    setActiveStep(idx);
                    playComfortTone(440 + idx * 80, 'sine', 0.2, 0.08);
                  }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 cursor-pointer shadow-lg transition-all ${
                    isActive 
                      ? 'bg-gradient-to-br from-pink-500 to-purple-500 border-white text-white' 
                      : 'bg-slate-900 border-white/10 text-zinc-300 hover:border-pink-500/30'
                  }`}
                >
                  <span className="text-xl">{step.emoji}</span>
                </motion.button>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-serif font-black text-zinc-200">{step.stage}</h4>
                  <p className="text-[10px] font-mono text-pink-400 font-bold">{step.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected timelines step content box */}
        <AnimatePresence mode="wait">
          {activeStep !== null && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-6 bg-gradient-to-br from-purple-950/30 via-pink-950/20 to-slate-950/40 border border-pink-500/20 rounded-[28px] max-w-lg mx-auto text-center space-y-2 relative"
            >
              <div className="absolute top-2 right-4 text-[10px] font-mono text-purple-300 font-bold">
                TIMELINE SECRET NOTE
              </div>
              <span className="text-2xl">💌</span>
              <h4 className="font-serif font-black text-pink-300 text-sm">
                {TIMELINE_STEPS[activeStep].stage} Comfort Guide
              </h4>
              <p className="text-xs text-zinc-200 leading-relaxed italic">
                {TIMELINE_STEPS[activeStep].note}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── 7. GRATITUDE GARDEN ───
const ACTIVITIES = [
  { id: 'water', text: "Drank cup of warm water 🥛", points: 15 },
  { id: 'wheel', text: "Spun comfort wheel 💖", points: 10 },
  { id: 'breaths', text: "Took 5 deep breaths 🫂", points: 15 },
  { id: 'hug_teddy', text: "Gave Teddy a sweet hug 🧸", points: 20 },
  { id: 'read_note', text: "Read a handwriting note 💌", points: 20 }
];

export function GratitudeGarden() {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ruu_gratitude_garden_done');
    return saved ? JSON.parse(saved) : {};
  });
  const [gardenPoints, setGardenPoints] = useState<number>(() => {
    const saved = localStorage.getItem('ruu_garden_points');
    return saved ? parseInt(saved, 10) : 0;
  });

  const toggleActivity = (id: string, pts: number) => {
    const nextCompleted = { ...completed, [id]: !completed[id] };
    setCompleted(nextCompleted);
    localStorage.setItem('ruu_gratitude_garden_done', JSON.stringify(nextCompleted));

    const diff = !completed[id] ? pts : -pts;
    const nextPoints = Math.max(0, gardenPoints + diff);
    setGardenPoints(nextPoints);
    localStorage.setItem('ruu_garden_points', nextPoints.toString());

    if (!completed[id]) {
      playComfortTone(659, 'triangle', 0.25, 0.1);
    } else {
      playComfortTone(330, 'triangle', 0.15, 0.08);
    }
  };

  const resetGarden = () => {
    setCompleted({});
    setGardenPoints(0);
    localStorage.removeItem('ruu_gratitude_garden_done');
    localStorage.removeItem('ruu_garden_points');
    playComfortTone(300, 'sine', 0.3, 0.05);
  };

  const bloomsCount = Math.min(10, Math.floor(gardenPoints / 10));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🌸</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          Interactive Gratitude Garden
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Every completed self-care activity adds beautiful blooming flowers and magical butterflies to your cozy garden state.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-4xl mx-auto bg-slate-950/45 border border-white/5 rounded-[40px] p-6">
        
        {/* Garden Canvas Stage (7 cols) */}
        <div className="md:col-span-7 bg-slate-950/40 border border-pink-500/10 rounded-3xl p-6 min-h-[260px] flex flex-col items-center justify-center relative overflow-hidden text-center select-none">
          <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

          {/* Render garden of flowers */}
          <div className="relative w-full h-44 flex flex-wrap items-center justify-center gap-4 z-10">
            {bloomsCount > 0 ? (
              Array.from({ length: bloomsCount }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 80, delay: i * 0.1 }}
                  className="text-4xl filter drop-shadow-[0_4px_10px_rgba(236,72,153,0.3)] cursor-pointer"
                  onClick={() => playComfortTone(400 + i * 50, 'sine', 0.3, 0.07)}
                >
                  {i % 3 === 0 ? '🌸' : i % 3 === 1 ? '🌹' : '🌷'}
                </motion.div>
              ))
            ) : (
              <div className="text-xs text-zinc-500 max-w-xs space-y-1">
                <p>"Your garden is completely quiet."</p>
                <p className="text-[11px] opacity-80">Check off any self-care steps on the right side to grow your first spring blooms!</p>
              </div>
            )}

            {/* Floating butterflies if garden has points */}
            {gardenPoints >= 20 && (
              <>
                <motion.div 
                  animate={{ 
                    x: [0, 40, -30, 0], 
                    y: [0, -30, -10, 0] 
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="absolute text-xl pointer-events-none"
                >
                  🦋
                </motion.div>
                <motion.div 
                  animate={{ 
                    x: [30, -20, 20, 30], 
                    y: [-20, 30, -30, -20] 
                  }}
                  transition={{ duration: 12, repeat: Infinity, delay: 2 }}
                  className="absolute text-xl pointer-events-none"
                >
                  🦋
                </motion.div>
              </>
            )}
          </div>

          <div className="mt-4 p-3 bg-slate-950/45 border border-pink-500/5 rounded-2xl w-full flex justify-between items-center text-xs">
            <span className="text-zinc-400 font-bold">GARDEN HEALTH: {gardenPoints} Pts</span>
            <button 
              onClick={resetGarden}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors uppercase font-mono font-bold cursor-pointer"
            >
              Reset Garden
            </button>
          </div>
        </div>

        {/* Checkable List Panel (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold block mb-1">
            Complete Daily Self-Care Checklist
          </span>
          {ACTIVITIES.map((act) => {
            const isDone = !!completed[act.id];
            return (
              <button
                key={act.id}
                onClick={() => toggleActivity(act.id, act.points)}
                className={`w-full p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isDone 
                    ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-emerald-500/30 text-emerald-300' 
                    : 'bg-slate-900/60 border-white/5 text-zinc-300 hover:border-pink-500/15'
                }`}
              >
                <span className="text-xs font-serif font-semibold">{act.text}</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                  isDone 
                    ? 'bg-emerald-500 border-emerald-400 text-white' 
                    : 'border-white/20 bg-slate-950'
                }`}>
                  {isDone && <CheckCircle2 size={12} />}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}

// ─── 8. THEME CUSTOMIZER ───
const PALETTES = [
  { id: 'pink_dream', label: 'Pink Dream', color: 'bg-pink-500', desc: 'Soft pastel pinks & sweet purples' },
  { id: 'lavender_glow', label: 'Lavender Glow', color: 'bg-purple-500', desc: 'Warm cozy lavender midnight essence' },
  { id: 'rose_gold', label: 'Rose Gold', color: 'bg-rose-450', desc: 'Elegant warm terracotta terracotta gold dust' },
  { id: 'aurora_sky', label: 'Aurora Sky', color: 'bg-emerald-500', desc: 'Northern lights northern emerald' },
  { id: 'soft_night', label: 'Soft Night', color: 'bg-indigo-950', desc: 'Silent safe slate-blue midnight skies' },
  { id: 'cream_white', label: 'Cream White', color: 'bg-stone-200', desc: 'Lightweight creamy stone oatmeal' }
];

interface ThemeCustomizerProps {
  currentTheme: string;
  onChangeTheme: (theme: string) => void;
}

export function ThemeCustomizer({ currentTheme, onChangeTheme }: ThemeCustomizerProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🎨</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          Cozy Room Theme Customizer
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Tailor the colors of the period workspace workspace to match your emotional mood.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {PALETTES.map((p) => {
          const isSel = currentTheme === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                onChangeTheme(p.id);
                playComfortTone(523, 'sine', 0.15, 0.05);
              }}
              className={`p-4 rounded-3xl border text-center cursor-pointer transition-all flex flex-col items-center space-y-2 ${
                isSel 
                  ? 'bg-gradient-to-b from-pink-500/10 to-rose-450/5 border-pink-500 shadow-md scale-102 font-bold' 
                  : 'bg-slate-950/45 border-white/5 text-zinc-400 hover:border-pink-500/15'
              }`}
            >
              <div className={`w-8 h-8 rounded-full ${p.color} border-2 border-white/20`} />
              <div className="space-y-0.5">
                <span className="text-xs text-zinc-200 font-serif font-black">{p.label}</span>
                <p className="text-[9px] text-zinc-500 max-w-full truncate">{p.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 9. FINAL THANK YOU ───
export function FinalThankYou() {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const addHeart = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newH = { id: Date.now(), x, y, size: Math.random() * 20 + 15 };
    setHearts(prev => [...prev, newH]);
    playComfortTone(587, 'sine', 0.3, 0.08);

    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newH.id));
    }, 1500);
  };

  return (
    <div 
      onClick={addHeart}
      className="relative max-w-4xl mx-auto rounded-[48px] border border-pink-500/20 bg-gradient-to-br from-pink-950/20 via-slate-950/60 to-purple-950/20 p-10 md:p-14 text-center space-y-6 shadow-2xl overflow-hidden cursor-pointer select-none"
    >
      {/* Background stardust */}
      <div className="absolute inset-0 pointer-events-none opacity-45">
        <div className="absolute top-[20%] left-[15%] text-2xl animate-pulse">🌸</div>
        <div className="absolute bottom-[30%] right-[10%] text-xl animate-pulse delay-1000">🦋</div>
        <div className="absolute top-[40%] right-[25%] text-lg animate-pulse delay-700">⭐</div>
        <div className="absolute bottom-[15%] left-[20%] text-sm animate-pulse">✨</div>
      </div>

      <div className="space-y-4 max-w-xl mx-auto relative z-10">
        <span className="text-4xl inline-block animate-bounce mb-2">❤️</span>
        <h2 className="font-serif text-2xl md:text-4xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text leading-tight">
          "You deserve love, comfort and kindness every single day."
        </h2>
        <p className="text-xs text-zinc-400 font-serif leading-relaxed">
          Tap anywhere inside this box to send floating pink hearts into the sky. Ruu loves you unconditionally, protects you, and stays by your side forever. Take a deep, cozy rest.
        </p>
      </div>

      {/* Render clicking hearts */}
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, scale: 0.2, x: h.x, y: h.y }}
            animate={{ opacity: 0, scale: 1.5, y: h.y - 100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute text-pink-500 text-xl pointer-events-none select-none z-30"
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
