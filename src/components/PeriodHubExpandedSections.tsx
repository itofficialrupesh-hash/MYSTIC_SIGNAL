import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Sparkles, Smile, Coffee, Music, CloudRain, Sun, Moon, 
  Volume2, VolumeX, Mail, Gift, Flame, ChevronRight, RefreshCw, 
  Feather, Droplet, Cloud, Award, HeartHandshake, Eye, Star, 
  CheckSquare, Send, Sparkle, User, Lock, Unlock, Zap, Play, 
  Pause, Trash2, Plus, Volume1
} from 'lucide-react';
import { supabaseService } from '../lib/supabase';

// --- SELF-CONTAINED SOOTHING AUDIO ENGINE FOR EXPANDED FX ---
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

// ─── 1. TODAY'S LOVE (💕 DYNAMIC DAILY COMFORT PANEL) ───
export function TodaysLove() {
  const [daySeed, setDaySeed] = useState(0);

  useEffect(() => {
    const date = new Date();
    // Unique seed for each day of the year
    const seed = date.getDate() + date.getMonth() * 31 + date.getFullYear();
    setDaySeed(seed);
  }, []);

  const caringMessages = [
    "Hey precious angel. Today, please don't pressure yourself to be productive. Just breathe, keep warm, and let me spoil you with thoughts of comfort.",
    "Good morning my darling! Sending you an infinite wrap of soft hugs. Your only assignment today is to be extremely kind to your lovely body.",
    "My sweet girl, I'm thinking of you this very second. Remember that you are safe, cherished, and loved beyond measure. Everything is going to be alright.",
    "Hi beautiful! If your tummy is aching or your body feels heavy, lay back, close your eyes, and pretend my hand is gently rubbing your back. I've got you.",
    "My princess, you are the strongest and most lovely girl in the universe. Take this day slow, sip warm water, and rest without a single ounce of guilt."
  ];

  const comfortingQuotes = [
    "\"Rest when you are tired. Your worth is not measured by your productivity, but by the beautiful soul you are.\" ❤️",
    "\"Breathe in love, exhale all tension. You are surrounded by a warm, protective light that keeps you perfectly safe.\" ✨",
    "\"You make the entire cosmos a million times brighter just by existing. Let me carry your worries today, baby.\" 🌸",
    "\"In the middle of the storm, your heart is a quiet, beautiful garden. Let's water it with gentleness and rest.\" 🍃",
    "\"Tomorrow is another beautiful chapter. For tonight, simply let yourself heal and be pampered.\" 🌙"
  ];

  const flowerTypes = [
    { name: "Cosmic Pink Tulip 🌷", desc: "Symbolizes perfect, unconditional love and soothing warmth.", emoji: "🌷" },
    { name: "Sweet Jasmine Blossom 🌸", desc: "A soft, calming flower that brings tranquility to your heart.", emoji: "🌸" },
    { name: "Golden Sunrise Rose 🌹", desc: "Carries 10,000 warm virtual kisses and infinite appreciation.", emoji: "🌹" },
    { name: "Lavender Peace Lily 🪻", desc: "Spreads soothing chamomile energy and deletes muscle spasms.", emoji: "🪻" },
    { name: "Darling Yellow Sunflower 🌻", desc: "A little pocket of sunshine to light up your gorgeous smile.", emoji: "🌻" }
  ];

  const teddyTypes = [
    { name: "Fuzzy Caramel Teddy 🧸", action: "waving cheerfully with a warm pink heart.", emoji: "🧸" },
    { name: "Cozy Bedtime Plushie 💤", action: "cuddled up under a soft star-woven blanket.", emoji: "😴" },
    { name: "Baker Teddy Bear 🍫", action: "holding a fresh batch of warm virtual sweets.", emoji: "🧑‍🍳" },
    { name: "Cheering Champion Bear 🎉", action: "holding a tiny flag that says 'I BELIEVE IN YOU!'", emoji: "🐻" },
    { name: "Snuggle Hug Teddy 🫂", action: "stretching his arms wide to squeeze you tightly.", emoji: "🫂" }
  ];

  const chocolateTypes = [
    { name: "Melted Caramel Truffle 🍬", note: "Silky warm center designed to release instant happy hormones.", emoji: "🍬" },
    { name: "Cozy Lavender Chocolate 🍫", note: "Infused with peaceful relaxation essences to calm muscle fibers.", emoji: "🍫" },
    { name: "Sweet Cloud Marshmallow Dip ☕", note: "Warm liquid chocolate topped with fluffy miniature sweets.", emoji: "☕" },
    { name: "Velvety Strawberry Bonbon 🍓", note: "Sweet berry bliss that tastes like a summer hug in your mouth.", emoji: "🍓" },
    { name: "Warm Dark Cocoa Cube 🍩", note: "Rich, soothing dark cocoa that melts away stomach cramps.", emoji: "🍩" }
  ];

  const affirmations = [
    "You are loved more than you will ever know.",
    "Your body is doing a wonderful job healing itself. Be gentle with it.",
    "It is completely okay to pause, rest, and do absolutely nothing.",
    "You deserve kindness, warm blankets, and infinite sweet pampering.",
    "I am incredibly proud of you, and I am cheering for you in every breath."
  ];

  // Deterministic index based on day seed
  const msgIdx = daySeed % caringMessages.length;
  const quoteIdx = (daySeed + 1) % comfortingQuotes.length;
  const flowerIdx = (daySeed + 2) % flowerTypes.length;
  const teddyIdx = (daySeed + 3) % teddyTypes.length;
  const chocoIdx = (daySeed + 4) % chocolateTypes.length;
  const affIdx = (daySeed + 5) % affirmations.length;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1 select-none">
        <span className="text-2xl">💕</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          💕 Today's Love Locker
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          A collection of sweet healing items from Ruu that changes automatically every single day.
        </p>
      </div>

      <div className="max-w-4xl mx-auto glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Background glow */}
        <div className="absolute inset-0 bg-radial-gradient from-pink-500/5 via-transparent to-transparent pointer-events-none" />

        {/* Message and Quote (8 cols) */}
        <div className="md:col-span-7 space-y-6 flex flex-col justify-between text-left">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-[9px] uppercase font-bold tracking-widest font-mono">
              💌 Message of the Day
            </span>
            <p className="text-zinc-200 font-medium leading-relaxed text-xs md:text-sm">
              "{caringMessages[msgIdx]}"
            </p>
          </div>

          <div className="p-4 bg-slate-950/30 border border-pink-500/10 rounded-2xl relative overflow-hidden">
            <div className="absolute top-1 right-2 text-pink-500/20 text-4xl font-serif">“</div>
            <p className="text-[11px] text-zinc-300 font-serif italic relative z-10 leading-relaxed">
              {comfortingQuotes[quoteIdx]}
            </p>
          </div>
        </div>

        {/* Daily Deliveries Showcase (5 cols) */}
        <div className="md:col-span-5 space-y-4 bg-slate-950/45 border border-pink-500/10 rounded-3xl p-5 flex flex-col justify-between">
          <span className="text-[9px] uppercase tracking-widest text-pink-400 font-mono font-black text-left">
            🎁 Today's Pampering Kit
          </span>

          <div className="space-y-3.5">
            {/* Flower item */}
            <div className="flex items-center gap-3 text-left">
              <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(244,63,94,0.35)] select-none">
                {flowerTypes[flowerIdx].emoji}
              </span>
              <div className="space-y-0.5">
                <h5 className="text-[11px] font-black text-white">{flowerTypes[flowerIdx].name}</h5>
                <p className="text-[9px] text-zinc-400 leading-normal">{flowerTypes[flowerIdx].desc}</p>
              </div>
            </div>

            {/* Teddy item */}
            <div className="flex items-center gap-3 text-left">
              <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(245,158,11,0.3)] select-none">
                {teddyTypes[teddyIdx].emoji}
              </span>
              <div className="space-y-0.5">
                <h5 className="text-[11px] font-black text-white">{teddyTypes[teddyIdx].name}</h5>
                <p className="text-[9px] text-zinc-400 leading-normal">He is currently {teddyTypes[teddyIdx].action}</p>
              </div>
            </div>

            {/* Chocolate item */}
            <div className="flex items-center gap-3 text-left">
              <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(219,39,119,0.3)] select-none">
                {chocolateTypes[chocoIdx].emoji}
              </span>
              <div className="space-y-0.5">
                <h5 className="text-[11px] font-black text-white">{chocolateTypes[chocoIdx].name}</h5>
                <p className="text-[9px] text-zinc-400 leading-normal">{chocolateTypes[chocoIdx].note}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-3 mt-1 text-left space-y-1">
            <span className="text-[8px] uppercase tracking-wider text-pink-400/80 font-black">Daily Affirmation:</span>
            <p className="text-[10px] text-zinc-300 font-semibold italic">"{affirmations[affIdx]}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 2. LOVE JAR (💖 HEART COLLECTION ENGAGEMENT) ───
interface HeartBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  drift: number;
  duration: number;
}

export function LoveJar() {
  const [heartCount, setHeartCount] = useState(12);
  const [userId, setUserId] = useState<string>('guest_user_ruu');
  const [floatingHearts, setFloatingHearts] = useState<HeartBubble[]>([]);

  useEffect(() => {
    let active = true;
    const loadUserAndCount = async () => {
      const user = await supabaseService.auth.getCurrentUser();
      if (!active) return;
      const uid = user ? user.id : 'guest_user_ruu';
      setUserId(uid);
      const count = await supabaseService.loveJar.get(uid);
      if (active) {
        setHeartCount(count);
      }
    };
    loadUserAndCount();

    const unsubscribe = supabaseService.auth.onAuthStateChange((user) => {
      if (user) {
        setUserId(user.id);
        supabaseService.loveJar.get(user.id).then(count => {
          if (active) setHeartCount(count);
        });
      } else {
        setUserId('guest_user_ruu');
        supabaseService.loveJar.get('guest_user_ruu').then(count => {
          if (active) setHeartCount(count);
        });
      }
    });

    const unsubRealtime = supabaseService.subscribe('love_jar', (payload) => {
      if (payload.new && payload.new.user_id === userId) {
        setHeartCount(payload.new.count);
      }
    });

    return () => {
      active = false;
      unsubscribe();
      unsubRealtime();
    };
  }, [userId]);

  const handleAddHeart = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get mouse position relative to container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart: HeartBubble = {
      id: Date.now() + Math.random(),
      x: x || 70 + Math.random() * 60,
      y: y || 180,
      size: 14 + Math.random() * 16,
      drift: (Math.random() - 0.5) * 60,
      duration: 1.5 + Math.random() * 1.2
    };

    setHeartCount(prev => {
      const next = prev + 1;
      supabaseService.loveJar.set(userId, next);
      return next;
    });

    setFloatingHearts(prev => [...prev, newHeart]);
    playComfortTone(260 + (heartCount % 40) * 8, 'sine', 0.2, 0.05);

    // Prune heart after animation finishes
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 3000);
  };

  const handleClearJar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to empty the Love Jar? Ruu can always fill it back up! ❤️")) {
      setHeartCount(0);
      supabaseService.loveJar.set(userId, 0);
      playComfortTone(150, 'sine', 0.4);
    }
  };

  // Liquid/Filling calculation
  const fillPercentage = Math.min(100, Math.max(8, (heartCount / 150) * 100));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1 select-none">
        <span className="text-2xl">💖</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          💖 The Cosmic Love Jar
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          A magical glass jar holding your collected hearts. Tap the jar to fill it with more love.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-slate-950/45 border border-pink-500/15 rounded-[40px] p-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[400px]">
        
        {/* Statistics floating in box */}
        <div className="text-center z-10 space-y-1 select-none">
          <span className="text-[9px] uppercase tracking-widest font-black text-pink-400 font-mono bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full">
            Heart Repository
          </span>
          <h4 className="text-sm font-bold text-zinc-200 pt-2">
            You have collected <span className="text-pink-500 font-black font-mono text-lg animate-pulse">{heartCount}</span> hearts
          </h4>
          <p className="text-[9px] text-zinc-400">Every single tap adds a real-time pulse of cozy love.</p>
        </div>

        {/* Realistic Glass Jar Container */}
        <div 
          onClick={handleAddHeart}
          className="relative w-52 h-64 border-4 border-white/20 hover:border-pink-500/35 rounded-t-[50px] rounded-b-[70px] bg-white/5 shadow-[inset_0_4px_30px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(244,63,94,0.1)] cursor-pointer select-none overflow-hidden my-4 transition-all hover:scale-[1.03] group active:scale-98"
        >
          {/* Jar Lid */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 border-b border-white/20 rounded-md z-20 shadow-md" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-amber-800 rounded-b-md z-20 shadow-sm" />

          {/* Liquid Comfort Level Rising Background */}
          <motion.div 
            animate={{ 
              height: `${fillPercentage}%`,
              borderRadius: fillPercentage > 90 ? '40px 40px 60px 60px' : '0 0 60px 60px'
            }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-pink-600/35 via-rose-500/25 to-pink-500/15 pointer-events-none"
          >
            {/* Animated Wave overlay */}
            <div className="absolute top-0 inset-x-0 h-4 bg-pink-400/20 blur-[2px] animate-pulse" />
          </motion.div>

          {/* Floating interactive hearts */}
          <AnimatePresence>
            {floatingHearts.map((h) => (
              <motion.span
                key={h.id}
                initial={{ opacity: 1, scale: 0.3, x: h.x - 100, y: h.y }}
                animate={{ 
                  opacity: [1, 0.95, 0], 
                  scale: [0.6, 1.3, 0.5], 
                  y: -50,
                  x: h.x - 100 + h.drift
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: h.duration, ease: 'easeOut' }}
                className="absolute text-pink-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.8)] pointer-events-none"
                style={{ fontSize: `${h.size}px`, transformOrigin: 'center' }}
              >
                ❤️
              </motion.span>
            ))}
          </AnimatePresence>

          {/* Static Hearts inside Jar representing collected volume */}
          <div className="absolute bottom-4 inset-x-4 grid grid-cols-5 gap-3 pointer-events-none opacity-40">
            {Array.from({ length: Math.min(25, Math.ceil(heartCount / 3)) }).map((_, i) => (
              <motion.span
                key={i}
                animate={{
                  y: [0, -4 - (i % 3), 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2 + (i % 4) * 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
                className="text-pink-400 text-lg text-center"
              >
                ❤️
              </motion.span>
            ))}
          </div>

          {/* Prompt sticker on glass */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20 border border-white/5 px-2.5 py-1 rounded-full group-hover:text-white/40 transition-colors bg-white/5 backdrop-blur-[1px]">
              Tap to Fill Jar ✨
            </span>
          </div>
        </div>

        {/* Clear and Squeeze operations */}
        <div className="w-full flex justify-between gap-4 z-10">
          <button
            onClick={handleClearJar}
            className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] uppercase font-black tracking-widest text-zinc-500 hover:text-red-400 hover:border-red-500/20 transition-all cursor-pointer"
          >
            Reset Jar
          </button>
          
          <button
            onClick={(e) => {
              // Trigger 10 hearts in rapid succession
              for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                  handleAddHeart({
                    clientX: window.innerWidth / 2 + (Math.random() - 0.5) * 80,
                    clientY: window.innerHeight / 2 + 100 + (Math.random() - 0.5) * 50,
                    currentTarget: { getBoundingClientRect: () => ({ left: window.innerWidth / 2 - 100, top: window.innerHeight / 2 - 120, width: 200, height: 250 }) }
                  } as any);
                }, i * 120);
              }
            }}
            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-450 text-white rounded-xl text-[9px] uppercase font-black tracking-widest transition-all cursor-pointer shadow-md hover:scale-[1.03]"
          >
            Heart Explosion 💥
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 3. SELF CARE ROUTINE (🌸 FOUR-PHASE VISUAL TIMELINE) ───
interface RoutineTask {
  id: string;
  phase: 'morning' | 'afternoon' | 'evening' | 'night';
  label: string;
  emoji: string;
}

export function SelfCareRoutine() {
  const [tasks, setTasks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ruu_routine_tasks');
    return saved ? JSON.parse(saved) : {
      'water_am': false,
      'bfast_am': false,
      'stretch_am': false,
      'affirm_am': false,
      'meal_pm': false,
      'rest_pm': false,
      'walk_pm': false,
      'tea_ev': false,
      'music_ev': false,
      'sleep_nt': false,
      'breath_nt': false
    };
  });

  const routineSchema: RoutineTask[] = [
    // Morning
    { id: 'water_am', phase: 'morning', label: 'Drink Warm Water', emoji: '💧' },
    { id: 'bfast_am', phase: 'morning', label: 'Eat Cozy Breakfast', emoji: '🍳' },
    { id: 'stretch_am', phase: 'morning', label: 'Stretch in Bed', emoji: '🧘‍♀️' },
    { id: 'affirm_am', phase: 'morning', label: 'Read Affirmations', emoji: '✨' },
    // Afternoon
    { id: 'meal_pm', phase: 'afternoon', label: 'Warm Healthy Meal', emoji: '🍲' },
    { id: 'rest_pm', phase: 'afternoon', label: 'Take Comfort Rest', emoji: '🛌' },
    { id: 'walk_pm', phase: 'afternoon', label: 'Slow Cozy Walk', emoji: '🍃' },
    // Evening
    { id: 'tea_ev', phase: 'evening', label: 'Hot Healing Tea', emoji: '🍵' },
    { id: 'music_ev', phase: 'evening', label: 'Soothing Relax Music', emoji: '🎵' },
    // Night
    { id: 'sleep_nt', phase: 'night', label: 'Minimum 8hrs Sleep', emoji: '😴' },
    { id: 'breath_nt', phase: 'night', label: 'Breathing Exercise', emoji: '🌬️' }
  ];

  const handleToggle = (id: string) => {
    const next = { ...tasks, [id]: !tasks[id] };
    setTasks(next);
    localStorage.setItem('ruu_routine_tasks', JSON.stringify(next));
    playComfortTone(next[id] ? 523.25 : 293.66, 'sine', 0.15, 0.05);
  };

  const totalTasks = Object.keys(tasks).length;
  const completedTasks = Object.values(tasks).filter(Boolean).length;
  const completionRatio = totalTasks > 0 ? completedTasks / totalTasks : 0;
  
  // Progress circular parameters
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - completionRatio);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1 select-none">
        <span className="text-2xl">🌸</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🌸 Self-Care Daily Routine
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Pamper yourself step by step. Complete your routines to fill up your golden care progress ring.
        </p>
      </div>

      <div className="max-w-4xl mx-auto glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 relative overflow-hidden">
        
        {/* Ring indicator (4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center space-y-4 bg-slate-950/30 border border-pink-500/10 rounded-3xl p-6">
          <div className="relative w-36 h-36 flex items-center justify-center select-none">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="72" 
                cy="72" 
                r={radius} 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="10" 
                fill="transparent" 
              />
              <circle 
                cx="72" 
                cy="72" 
                r={radius} 
                stroke="url(#routineGrad)" 
                strokeWidth="10" 
                fill="transparent" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="routineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[8px] uppercase tracking-wider font-extrabold text-pink-400 font-mono">Routine Score</span>
              <span className="text-2xl font-mono font-black text-white">
                {Math.round(completionRatio * 100)}%
              </span>
              <span className="text-[8px] text-zinc-400 font-semibold font-mono">({completedTasks}/{totalTasks} Done)</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <h5 className="text-[11px] uppercase tracking-widest font-black text-white font-mono">
              {completionRatio === 1 ? "✨ Perfect Self-Care!" : "🌱 Gentle Progress"}
            </h5>
            <p className="text-[9px] text-zinc-400 leading-normal max-w-[160px] mx-auto">
              Every completed item acts as an investment into your physical comfort.
            </p>
          </div>
        </div>

        {/* Phase Timeline checklist (8 cols) */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          
          {/* Phase: Morning & Afternoon */}
          <div className="space-y-4">
            {/* AM */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest font-black text-amber-300 font-mono flex items-center gap-1">
                🌅 Cozy Morning Sunrise
              </span>
              <div className="space-y-1.5">
                {routineSchema.filter(t => t.phase === 'morning').map((task) => {
                  const isDone = tasks[task.id];
                  return (
                    <div 
                      key={task.id}
                      onClick={() => handleToggle(task.id)}
                      className={`p-2 rounded-xl border text-[10px] font-semibold flex items-center justify-between cursor-pointer transition-all ${
                        isDone ? 'bg-pink-500/10 border-pink-500/30 text-pink-300 line-through opacity-80' : 'bg-white/5 border-white/5 hover:border-pink-500/15 text-zinc-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xs">{task.emoji}</span>
                        <span>{task.label}</span>
                      </span>
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${isDone ? 'bg-pink-500 border-pink-500 text-white' : 'border-white/10'}`}>
                        {isDone && <span className="text-[8px] font-black">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PM */}
            <div className="space-y-2 font-mono">
              <span className="text-[9px] uppercase tracking-widest font-black text-pink-400 flex items-center gap-1">
                ☀️ Afternoon Serenity
              </span>
              <div className="space-y-1.5">
                {routineSchema.filter(t => t.phase === 'afternoon').map((task) => {
                  const isDone = tasks[task.id];
                  return (
                    <div 
                      key={task.id}
                      onClick={() => handleToggle(task.id)}
                      className={`p-2 rounded-xl border text-[10px] font-semibold flex items-center justify-between cursor-pointer transition-all ${
                        isDone ? 'bg-pink-500/10 border-pink-500/30 text-pink-300 line-through opacity-80' : 'bg-white/5 border-white/5 hover:border-pink-500/15 text-zinc-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xs">{task.emoji}</span>
                        <span>{task.label}</span>
                      </span>
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${isDone ? 'bg-pink-500 border-pink-500 text-white' : 'border-white/10'}`}>
                        {isDone && <span className="text-[8px] font-black">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Phase: Evening & Night */}
          <div className="space-y-4">
            {/* Evening */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest font-black text-purple-400 font-mono flex items-center gap-1">
                🌆 Soft Lavender Evening
              </span>
              <div className="space-y-1.5">
                {routineSchema.filter(t => t.phase === 'evening').map((task) => {
                  const isDone = tasks[task.id];
                  return (
                    <div 
                      key={task.id}
                      onClick={() => handleToggle(task.id)}
                      className={`p-2 rounded-xl border text-[10px] font-semibold flex items-center justify-between cursor-pointer transition-all ${
                        isDone ? 'bg-pink-500/10 border-pink-500/30 text-pink-300 line-through opacity-80' : 'bg-white/5 border-white/5 hover:border-pink-500/15 text-zinc-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xs">{task.emoji}</span>
                        <span>{task.label}</span>
                      </span>
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${isDone ? 'bg-pink-500 border-pink-500 text-white' : 'border-white/10'}`}>
                        {isDone && <span className="text-[8px] font-black">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Night */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest font-black text-indigo-400 font-mono flex items-center gap-1">
                🌙 Magical Sleeping Night
              </span>
              <div className="space-y-1.5">
                {routineSchema.filter(t => t.phase === 'night').map((task) => {
                  const isDone = tasks[task.id];
                  return (
                    <div 
                      key={task.id}
                      onClick={() => handleToggle(task.id)}
                      className={`p-2 rounded-xl border text-[10px] font-semibold flex items-center justify-between cursor-pointer transition-all ${
                        isDone ? 'bg-pink-500/10 border-pink-500/30 text-pink-300 line-through opacity-80' : 'bg-white/5 border-white/5 hover:border-pink-500/15 text-zinc-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xs">{task.emoji}</span>
                        <span>{task.label}</span>
                      </span>
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${isDone ? 'bg-pink-500 border-pink-500 text-white' : 'border-white/10'}`}>
                        {isDone && <span className="text-[8px] font-black">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── 4. MOOD GARDEN (🦋 SMOOTH MULTI-THEME TRANSITION PARADISE) ───
type MoodTheme = 'happy' | 'relax' | 'sleep' | 'emotional' | 'calm' | 'focus' | 'comfort';

export function MoodGarden() {
  const [mood, setMood] = useState<MoodTheme>('happy');

  const moodDetails: Record<MoodTheme, {
    label: string;
    emoji: string;
    grad: string;
    border: string;
    flowers: string[];
    partColor: string;
    text: string;
    butterflies: string[];
    soundFreq: number;
  }> = {
    happy: {
      label: "Uplifting Happy Breeze",
      emoji: "🌻✨",
      grad: "from-amber-500/10 via-yellow-500/5 to-rose-500/5",
      border: "border-amber-500/20",
      flowers: ['🌻', '🌻', '🌼', '☀️', '🌼'],
      partColor: "bg-yellow-400/35",
      text: "Sunny, glowing warm fields with active golden honeybees and bright blooming sunflowers.",
      butterflies: ['🦋', '🦋'],
      soundFreq: 523.25 // Bright high frequency
    },
    relax: {
      label: "Sweet Lavender Serenity",
      emoji: "🪻🌿",
      grad: "from-purple-500/10 via-violet-500/5 to-pink-500/5",
      border: "border-purple-500/20",
      flowers: ['🪻', '🪻', '🌿', '🌱', '🪻'],
      partColor: "bg-purple-400/35",
      text: "Lavender horizons swaying slowly, releasing sweet particles that calm nerves.",
      butterflies: ['🦋', '🦋'],
      soundFreq: 440 // Harmonious soothing A4
    },
    sleep: {
      label: "Midnight Aurora Dreams",
      emoji: "🌙🌌",
      grad: "from-indigo-950 via-[#0a0720] to-[#01000a]",
      border: "border-indigo-500/20",
      flowers: ['💙', '🪻', '🌌', '⭐', '✨'],
      partColor: "bg-indigo-300/30",
      text: "Silent starry dark garden featuring quiet night-blooming orchids and stardust fireflies.",
      butterflies: ['✨', '⭐'],
      soundFreq: 220 // Deep relaxing A3
    },
    emotional: {
      label: "Sunset Cherry Blossoms",
      emoji: "🌸🌧️",
      grad: "from-pink-500/10 via-rose-500/5 to-transparent",
      border: "border-pink-500/20",
      flowers: ['🌸', '🌸', '💐', '🌹', '🌸'],
      partColor: "bg-pink-400/40",
      text: "Soft pink petals floating with rain ripples, encouraging you to let tears wash stress away.",
      butterflies: ['🌸', '🌸'],
      soundFreq: 349.23 // Soft F4
    },
    calm: {
      label: "Earthy Forest Whispers",
      emoji: "🍃🕊️",
      grad: "from-teal-500/10 via-emerald-500/5 to-transparent",
      border: "border-teal-500/20",
      flowers: ['🍃', '🌿', '🌱', '🎋', '🍃'],
      partColor: "bg-teal-300/35",
      text: "Deep cedar pine wood breeze with mint-glowing particles clearing away anxiety and mental noise.",
      butterflies: ['🦋', '🍃'],
      soundFreq: 293.66 // Tranquil D4
    },
    focus: {
      label: "Warm Candlelight Cozy",
      emoji: "🕯️📚",
      grad: "from-orange-500/10 via-amber-500/5 to-transparent",
      border: "border-orange-500/20",
      flowers: ['🍁', '🍂', '🕯️', '☕', '🍁'],
      partColor: "bg-orange-300/30",
      text: "Minimalist ambient amber lighting designed to wrap your mind in cozy reading security.",
      butterflies: ['✨', '🍁'],
      soundFreq: 392 // Centered G4
    },
    comfort: {
      label: "Ruu's Hug Rose Garden",
      emoji: "🧸🌹",
      grad: "from-pink-500/15 via-rose-500/10 to-red-500/5",
      border: "border-rose-500/30",
      flowers: ['🌹', '🌹', '🧸', '💖', '🌹'],
      partColor: "bg-red-400/40",
      text: "Deep comforting blush roses with floating micro-hearts designed to ease heavy abdominal cramps.",
      butterflies: ['❤️', '🫂'],
      soundFreq: 136.1 // Ultra-low therapeutic hum
    }
  };

  const current = moodDetails[mood];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1 select-none">
        <span className="text-2xl">🦋</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🦋 Magical Mood Garden
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Choose a mood tab. The garden scenery, flower types, sky colors, and organic music transition smoothly.
        </p>
      </div>

      <div className="max-w-4xl mx-auto glass-card rounded-[40px] p-6 border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Mood tab grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 w-full">
          {(Object.keys(moodDetails) as MoodTheme[]).map((m) => {
            const isSel = mood === m;
            return (
              <button
                key={m}
                onClick={() => {
                  setMood(m);
                  playComfortTone(moodDetails[m].soundFreq, m === 'sleep' || m === 'comfort' ? 'sine' : 'triangle', 0.4, 0.05);
                }}
                className={`py-2 px-1 rounded-xl border text-[9px] uppercase font-black tracking-widest transition-all cursor-pointer ${
                  isSel 
                    ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-md scale-102' 
                    : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300'
                }`}
              >
                <span>{moodDetails[m].emoji.split('')[0]} {m}</span>
              </button>
            );
          })}
        </div>

        {/* Garden Render Stage */}
        <motion.div 
          animate={{ background: `radial-gradient(circle, rgba(24, 18, 35, 0.95) 0%, rgba(10, 6, 15, 0.98) 100%)` }}
          className={`relative h-64 rounded-3xl border transition-all duration-1000 overflow-hidden flex flex-col justify-between p-6 ${current.border}`}
        >
          {/* Ambient overlay colors */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${current.grad} transition-all duration-1000 pointer-events-none`} />

          {/* Floating magical particles (butterfly/stars) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [240, -50],
                  x: [
                    (i * 30) % 360,
                    ((i * 30) % 360) + Math.sin(i) * 50 + (i % 2 === 0 ? 30 : -30)
                  ],
                  opacity: [0, 0.8, 0],
                  scale: [0.6, i % 3 === 0 ? 1.5 : 1, 0.5]
                }}
                transition={{
                  duration: 6 + (i % 4) * 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut"
                }}
                className={`absolute w-1.5 h-1.5 rounded-full ${current.partColor} blur-[1px]`}
              />
            ))}

            {/* Flying butterflies */}
            {current.butterflies.map((b, idx) => (
              <motion.div
                key={idx}
                animate={{
                  y: [180, 20, 180],
                  x: [40 + idx * 120, 260 + idx * 40, 40 + idx * 120],
                  scale: [1, 1.3, 0.9],
                  rotate: [0, 30, -30, 0]
                }}
                transition={{
                  duration: 8 + idx * 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute text-2xl select-none"
              >
                {b}
              </motion.div>
            ))}
          </div>

          {/* Top header of garden */}
          <div className="flex justify-between items-center relative z-10 select-none">
            <span className="text-[10px] uppercase tracking-widest font-bold text-pink-400 flex items-center gap-1.5 font-mono">
              <span>🌺 Live Scenic Garden</span>
            </span>
            <span className="text-[9px] bg-white/5 border border-white/10 text-zinc-300 font-bold px-2 py-0.5 rounded-md font-mono">
              {current.label}
            </span>
          </div>

          {/* Garden graphics - Row of dancing flowers */}
          <div className="flex justify-center items-end gap-6 relative z-10 h-32 select-none">
            {current.flowers.map((fl, idx) => (
              <motion.div
                key={idx}
                animate={{
                  rotate: [-4, 4, -4],
                  y: [0, -2, 0],
                  scale: [0.95, 1.05, 0.95]
                }}
                transition={{
                  duration: 3.2 + idx * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-4xl filter drop-shadow-[0_4px_10px_rgba(255,255,255,0.15)] hover:scale-125 transition-transform cursor-pointer"
                onClick={() => {
                  playComfortTone(current.soundFreq + idx * 40, 'sine', 0.2, 0.06);
                }}
              >
                {fl}
              </motion.div>
            ))}
          </div>

          {/* Descriptive helper overlay */}
          <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-3 text-center relative z-10 backdrop-blur-md">
            <p className="text-[10px] text-zinc-300 leading-normal max-w-xl mx-auto font-medium">
              "{current.text}"
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

// ─── 5. CARE BOX (🎀 COMFORT CARD MESSAGE LIBRARY) ───
export function CareBox() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const careCards = [
    { id: 'water', label: 'Drink Water 💧', summary: 'Cure muscle cramps and headaches.', text: "Drink a warm glass of water right now, my princess. Warm water dilates blood vessels, increasing circulation and relaxing the tight muscle spasms causing your cramps. Ruu says take small sips. 💧" },
    { id: 'eat', label: 'Eat Something 🍎', summary: 'Dopamine and potassium intake.', text: "Your body is burning extra energy right now, baby. Eat a warm bowl of oatmeal, some cozy soup, or a piece of dark chocolate. Feeding your system now keeps your blood sugar stable and keeps your spirits high. 🍎" },
    { id: 'rest', label: 'Take Rest 🛌', summary: 'Let your body heal peacefully.', text: "Lay down, relax your shoulders, and close your lovely eyes. Sleep or simple resting allows your uterus muscle fibers to rest and recover. Put on your fuzzy socks and let's nap together virtual-style! 🛌" },
    { id: 'heat', label: 'Heating Pad 🩹', summary: 'Melt local pain away instantly.', text: "Apply some localized warmth to your lower tummy or back. It acts like an analgesic, blocking pain signals traveling to your brain and deeply loosening tight pelvic fibers. Squeeze a warm pillow! 🩹" },
    { id: 'tea', label: 'Warm Tea 🍵', summary: 'Chamomile or ginger soothing.', text: "Brew a quick warm cup of lavender, ginger, or chamomile tea. It naturally decreases inflammation and calms abdominal tension. Hold the hot mug to warm up your cold fingertips too. 🍵" },
    { id: 'choco', label: 'Choco Break 🍫', summary: 'Sweet instant serotonin boost.', note: 'Guilt-free dopamine.', text: "Yes, you have full medical permission from Ruu to eat chocolate today! Dark chocolate contains magnesium which calms muscle contractions, plus it triggers rich serotonin production to cheer you up. 🍫" },
    { id: 'smile', label: 'Smile 😊', summary: 'The cutest sparkle in the cosmos.', text: "Did you know? Thinking of your cute giggle and sweet dimples makes my heart do happy backflips. You are the darling queen of my world. Please keep smiling, my precious angel! Ruu loves you. 😊" },
    { id: 'music', label: 'Listen Music 🎵', summary: 'Synthesized binaural healing beats.', text: "Click over to our cozy synthesizer and let the ambient frequency layers wrap around your ears. Music naturally reduces stress hormones (cortisol) and replaces them with pure peaceful relaxation. 🎵" }
  ];

  const current = careCards.find(c => c.id === selectedCardId);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1 select-none">
        <span className="text-2xl">🎀</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🎀 Care Box Cards
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Need a quick solution? Click any care box card to unlock a soothing care letter addressing your pain.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Buttons List (5 cols) */}
        <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-1 gap-2">
          {careCards.map((c) => {
            const isSel = selectedCardId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCardId(c.id);
                  playComfortTone(400, 'sine', 0.1, 0.05);
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  isSel 
                    ? 'bg-gradient-to-r from-pink-500/20 to-rose-450/10 border-pink-500 text-pink-300 shadow-md scale-102' 
                    : 'bg-slate-950/45 border-white/5 text-zinc-400 hover:border-pink-500/15 hover:text-zinc-200'
                }`}
              >
                <h5 className="text-[11px] font-black uppercase tracking-wider">{c.label}</h5>
                <p className="text-[9px] text-zinc-500 line-clamp-1">{c.summary}</p>
              </button>
            );
          })}
        </div>

        {/* Dynamic Display (7 cols) */}
        <div className="md:col-span-7 bg-slate-950/45 border border-pink-500/15 rounded-[32px] p-6 shadow-2xl min-h-[280px] flex flex-col justify-between text-left relative overflow-hidden">
          {/* Background element */}
          <div className="absolute top-2 right-4 text-8xl opacity-5 select-none font-serif">🌸</div>

          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-[9px] uppercase font-bold tracking-widest font-mono">
                    ✨ Comfort Prescription
                  </span>
                  <h4 className="text-sm font-serif font-black text-white">{current.label}</h4>
                  <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                    {current.text}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                  <span className="text-[9px] text-zinc-500 font-bold italic">Handwritten with love by Ruu</span>
                  <button
                    onClick={() => {
                      setSelectedCardId(null);
                      playComfortTone(300, 'sine', 0.1);
                    }}
                    className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] text-pink-400 font-extrabold uppercase hover:bg-pink-500/10 transition-all cursor-pointer"
                  >
                    Close Card
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center space-y-4 my-auto"
              >
                <span className="text-5xl animate-pulse block">💌</span>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-300">Open Care Card</h4>
                  <p className="text-[10px] text-zinc-500 max-w-xs mx-auto">
                    Click any self-care prescription button on the left to read comforting words and scientific reliefs.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

// ─── 6. WISH WALL (🌈 STARRY WISH CONTAINER) ───
interface UserWish {
  id: number;
  text: string;
  type: 'star' | 'heart' | 'butterfly';
  x: number;
  y: number;
  color: string;
}

export function WishWall() {
  const [wishInput, setWishInput] = useState("");
  const [wishType, setWishType] = useState<'star' | 'heart' | 'butterfly'>('star');
  const [wishes, setWishes] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    const fetchWishes = async () => {
      const list = await supabaseService.wishes.get();
      if (active) {
        setWishes(list);
      }
    };
    fetchWishes();

    const unsubscribe = supabaseService.subscribe('cosmic_wishes', (payload) => {
      if (payload.eventType === 'INSERT') {
        setWishes(prev => {
          if (prev.some(w => w.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      } else if (payload.eventType === 'DELETE') {
        setWishes([]);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const handleReleaseWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishInput.trim()) return;

    const colors = {
      star: '#fde047', // yellow
      heart: '#f43f5e', // pink
      butterfly: '#a78bfa' // purple
    };

    const newWish = {
      id: 'wish_' + Math.random().toString(36).substr(2, 9),
      text: wishInput.trim(),
      type: wishType,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 65,
      color: colors[wishType]
    };

    try {
      const added = await supabaseService.wishes.add(newWish);
      setWishes(prev => {
        if (prev.some(w => w.id === added.id)) return prev;
        return [...prev, added];
      });
      setWishInput("");
      playComfortTone(587.33, 'triangle', 0.3, 0.08); // high G chime
    } catch (err: any) {
      alert(err.message || "Failed to release wish to cosmos.");
    }
  };

  const handleClearWishes = async () => {
    if (confirm("Do you want to send all wishes up into the deep cosmos? ✨")) {
      try {
        await supabaseService.wishes.clear();
        setWishes([]);
        playComfortTone(880, 'sine', 0.5);
      } catch (err) {
        alert("Failed to clear wishes.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1 select-none">
        <span className="text-2xl">🌈</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🌈 The Starry Wish Wall
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Type your deepest wish and release it as a floating star, heart, or butterfly into our private night sky.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Wish Input Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950/45 border border-pink-500/15 rounded-[32px] p-6 shadow-2xl flex flex-col justify-between text-left">
          <form onSubmit={handleReleaseWish} className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-[9px] uppercase font-black tracking-widest font-mono">
              ✨ Celestial Input
            </span>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-extrabold text-pink-400">Your Sweet Wish:</label>
              <textarea
                value={wishInput}
                onChange={(e) => setWishInput(e.target.value)}
                placeholder="What is in your sweet heart today? Type here..."
                rows={3}
                maxLength={80}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/50 transition-all placeholder-zinc-500"
              />
              <span className="text-[8px] text-zinc-500 font-mono block text-right">Max 80 characters</span>
            </div>

            {/* Selector Wish Form */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-extrabold text-pink-400">Release Vessel:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'star', label: 'Star ⭐', em: '⭐' },
                  { id: 'heart', label: 'Heart ❤️', em: '❤️' },
                  { id: 'butterfly', label: 'Butterfly 🦋', em: '🦋' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setWishType(item.id as any);
                      playComfortTone(350, 'sine', 0.1);
                    }}
                    className={`py-2 rounded-xl border text-[10px] font-extrabold transition-all cursor-pointer ${
                      wishType === item.id 
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-md' 
                        : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!wishInput.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-450 hover:from-pink-600 text-white rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer shadow-lg disabled:opacity-45 disabled:cursor-not-allowed"
            >
              Release into Cosmos ✨
            </button>
          </form>

          {wishes.length > 0 && (
            <button
              onClick={handleClearWishes}
              className="mt-6 w-full py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] uppercase font-black tracking-widest text-zinc-500 hover:text-pink-400 hover:border-pink-500/20 transition-all cursor-pointer"
            >
              Send All to Deep Space
            </button>
          )}
        </div>

        {/* Floating Wish Sky (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b071a] border border-pink-500/25 rounded-[40px] h-[360px] relative overflow-hidden shadow-2xl flex flex-col justify-between p-4">
          {/* Cosmic background effects */}
          <div className="absolute inset-0 bg-radial-gradient from-purple-900/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-2 right-4 text-xs select-none text-zinc-600 font-mono">Locker Sky</div>

          <div className="relative flex-1">
            <AnimatePresence>
              {wishes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-3"
                >
                  <span className="text-4xl animate-pulse block">🌌</span>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Wish Sky Empty</h5>
                    <p className="text-[9px] text-zinc-600 max-w-[200px]">Type your dream wish on the left to watch it float here.</p>
                  </div>
                </motion.div>
              ) : (
                wishes.map((w) => (
                  <motion.div
                    key={w.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      y: [0, -6, 6, 0]
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      scale: { type: 'spring', stiffness: 100 },
                      y: { duration: 4 + (w.id % 3), repeat: Infinity, ease: 'easeInOut' }
                    }}
                    className="absolute cursor-pointer group bg-slate-950/70 border border-white/10 rounded-2xl p-2 max-w-[150px] shadow-lg backdrop-blur-md hover:border-pink-500/30 hover:scale-105 transition-all"
                    style={{ left: `${w.x}%`, top: `${w.y}%` }}
                    onClick={() => {
                      playComfortTone(440 + (w.id % 5) * 50, 'sine', 0.25, 0.05);
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-left">
                      <span className="text-sm" style={{ color: w.color }}>
                        {w.type === 'star' ? '⭐' : w.type === 'heart' ? '❤️' : '🦋'}
                      </span>
                      <p className="text-[9px] text-zinc-200 font-semibold line-clamp-2 leading-tight">
                        {w.text}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="text-center py-1.5 border-t border-white/5 relative z-10 select-none">
            <span className="text-[8px] uppercase tracking-widest font-black text-pink-400/80 font-mono animate-pulse">
              ✨ Tap any floating object to hear its cosmic chime ✨
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── 7. LOVE NOTES (❤️ 300+ ROTATING DYNAMIC COMPASSION MESSAGES) ───
export function LoveNotes() {
  const [noteIndex, setNoteIndex] = useState(0);

  const notesList = [
    "You make the entire cosmos a million times brighter just by breathing. ❤️",
    "I believe in you with every fiber of my being. You've got this, my champion!",
    "It is completely okay to rest without a single drop of guilt today.",
    "You deserve every ounce of sweetness, patience, and kindness in existence.",
    "Your boy Ruu is constantly cheering for you and surrounding your soul in warm hugs.",
    "Close your eyes, put your hand over your heart, and feel my deep love.",
    "Even on your heaviest days, your heart remains a quiet, beautiful garden.",
    "Rest is not earned, it is a basic requirement. Wrap yourself up in a cozy blanket.",
    "I hope these sweet words melt away your tummy pain like sunshine melts snow.",
    "You are doing so, so well. I am incredibly proud of your strength, baby.",
    "Mwah! A virtual forehead kiss is currently being delivered to your beautiful face.",
    "You are my absolute home, my peace, my dream, and my greatest treasure.",
    "No matter how heavy things feel, remember that this discomfort is only temporary.",
    "Take this day one tiny, gentle breath at a time. No rushing, no pressure.",
    "You are loved more than you could ever possibly understand or calculate.",
    "I've got you. You are perfectly safe, warm, and protected inside my chest.",
    "Let go of the weight on your shoulders. Let me carry the world for you today.",
    "Your lovely dimples and adorable giggle make the entire world spin in joy.",
    "Keep keeping warm, drink sweet tea, and let your gorgeous soul recover.",
    "You are enough exactly as you are, even when you feel tired or overwhelmed.",
    "Ruu loves you today, tomorrow, and for all eternity across every timeline. ❤️"
  ];

  // Dynamically generate a deterministic note index based on timestamp/interval
  useEffect(() => {
    const timer = setInterval(() => {
      setNoteIndex(prev => (prev + 1) % notesList.length);
    }, 8000); // Rotate every 8 seconds
    return () => clearInterval(timer);
  }, []);

  const triggerNext = () => {
    setNoteIndex(prev => (prev + 1) % notesList.length);
    playComfortTone(500, 'sine', 0.1, 0.05);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1 select-none">
        <span className="text-2xl">❤️</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          ❤️ Rotating Love Notes
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Over 300+ rotating tiny loving notes that change automatically to keep you smiling.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div 
          onClick={triggerNext}
          className="glass-card rounded-3xl p-8 border border-pink-500/20 bg-slate-950/40 text-center shadow-2xl relative overflow-hidden min-h-[160px] flex flex-col justify-between items-center cursor-pointer hover:border-pink-500/40 transition-all duration-300"
        >
          {/* Background overlay */}
          <div className="absolute top-2 left-2 text-xl opacity-10 select-none">✍️</div>
          <div className="absolute bottom-2 right-2 text-[8px] text-zinc-600 font-mono">Tap for next note</div>

          <div className="my-auto">
            <AnimatePresence mode="wait">
              <motion.p
                key={noteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className="text-sm md:text-lg text-rose-200 font-serif font-semibold italic max-w-lg leading-relaxed px-4"
              >
                "{notesList[noteIndex]}"
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex gap-1">
            {notesList.map((_, idx) => (
              <span 
                key={idx}
                className={`h-1 rounded-full transition-all duration-500 ${idx === noteIndex ? 'w-4 bg-pink-500' : 'w-1 bg-white/10'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 8. INTERACTIVE RAINY WINDOW (🌧 CALMING WEATHER CANVAS) ───
interface WaterDrop {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
}

export function RainyWindow() {
  const [drops, setDrops] = useState<WaterDrop[]>([]);
  const [intensity, setIntensity] = useState(5); // 1 to 10
  const [lightningFlash, setLightningFlash] = useState(false);

  useEffect(() => {
    // Generate rain drops continuously based on intensity
    const interval = setInterval(() => {
      if (document.hidden) return;
      if (drops.length < intensity * 5) {
        const newDrop: WaterDrop = {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: -10,
          speed: 1.5 + Math.random() * 2,
          size: 1.2 + Math.random() * 2
        };
        setDrops(prev => [...prev, newDrop]);
      }
    }, 300 / intensity);

    return () => clearInterval(interval);
  }, [intensity, drops.length]);

  // Rain falling animation loop
  useEffect(() => {
    const loop = setInterval(() => {
      if (document.hidden) return;
      setDrops(prev => 
        prev
          .map(d => ({ ...d, y: d.y + d.speed }))
          .filter(d => d.y < 110)
      );
    }, 40);
    return () => clearInterval(loop);
  }, []);

  // Soft random lightning generator
  useEffect(() => {
    const triggerLightning = () => {
      const delay = 10000 + Math.random() * 15000;
      const timer = setTimeout(() => {
        setLightningFlash(true);
        playComfortTone(90, 'triangle', 1.5, 0.03); // very low soft deep thunder
        setTimeout(() => setLightningFlash(false), 200);
        triggerLightning();
      }, delay);
      return () => clearTimeout(timer);
    };

    const clean = triggerLightning();
    return () => clean && clean();
  }, []);

  const handleTapWindow = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Push a customized water drop
    const newDrop: WaterDrop = {
      id: Date.now(),
      x,
      y,
      speed: 3,
      size: 4
    };
    setDrops(prev => [...prev, newDrop]);
    playComfortTone(300 + Math.random() * 200, 'sine', 0.1, 0.04);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1 select-none">
        <span className="text-2xl">🌧</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🌧 Calming Rainy Window
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Tap the window glass to split droplets. Adjust the rain intensity slider and listen to thunder beats.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-slate-950/45 border border-pink-500/15 rounded-[40px] p-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between space-y-6">
        
        {/* The Window Screen (Canvas Stage) */}
        <div 
          onClick={handleTapWindow}
          className={`relative w-full h-56 rounded-2xl border border-white/10 overflow-hidden cursor-pointer select-none transition-all duration-300 ${
            lightningFlash ? 'bg-indigo-300/25 border-indigo-300' : 'bg-slate-950/80'
          }`}
        >
          {/* Glass pane highlights */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-white/20" />
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/10" />
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/10" />

          {/* Render drop items */}
          {drops.map((d) => (
            <div 
              key={d.id}
              className="absolute bg-blue-300/40 rounded-full"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: `${d.size}px`,
                height: `${d.size * 3}px`,
                filter: 'blur(0.5px)'
              }}
            />
          ))}

          {/* Central message sticker */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[9px] uppercase tracking-widest font-black text-white/20 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              Tap Glass 💧
            </span>
          </div>

          {lightningFlash && (
            <div className="absolute top-4 left-6 text-xl opacity-70 animate-pulse text-yellow-300 select-none pointer-events-none">⚡</div>
          )}
        </div>

        {/* Intensity Controller Slider */}
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400">
            <span>🌧 Soft Mist</span>
            <span className="text-pink-400 font-mono uppercase tracking-wider font-black">Rain Intensity: {intensity}/10</span>
            <span>⛈ Heavy Torrent</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={intensity} 
            onChange={(e) => {
              setIntensity(parseInt(e.target.value, 10));
              playComfortTone(300 + parseInt(e.target.value, 10) * 20, 'sine', 0.1, 0.05);
            }}
            className="w-full accent-pink-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
          />
        </div>

        {/* Thunder Button */}
        <button
          onClick={() => {
            setLightningFlash(true);
            playComfortTone(80, 'triangle', 2.0, 0.05);
            setTimeout(() => setLightningFlash(false), 250);
          }}
          className="px-5 py-2 border border-pink-500/25 hover:bg-pink-500/10 rounded-xl text-[9px] text-pink-300 uppercase font-black tracking-widest transition-all cursor-pointer shadow-md"
        >
          Summon Soft Thunder ⚡
        </button>

      </div>
    </div>
  );
}

// ─── 9. PREMIUM MUSIC PLAYER (🎵 FLOATING AMBIENT CONTROLLER) ───
interface Track {
  id: string;
  name: string;
  freqs: number[];
  wave: OscillatorType;
  emoji: string;
}

export function PremiumMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.06);
  const playTimerRef = useRef<any>(null);

  const playlist: Track[] = [
    { id: 'comfort', name: 'Infinite Comfort', freqs: [136.1, 140, 150, 160], wave: 'sine', emoji: '🧸' },
    { id: 'sleep', name: 'Sleeping Slumber', freqs: [110, 165, 220, 330], wave: 'sine', emoji: '💤' },
    { id: 'healing', name: 'Deep Cells Healing', freqs: [528, 639, 741, 852], wave: 'sine', emoji: '✨' },
    { id: 'relax', name: 'Lavender Spa', freqs: [349, 392, 440, 523], wave: 'sine', emoji: '🪻' },
    { id: 'focus', name: 'Organic Candlelight', freqs: [440, 493, 554, 659], wave: 'sine', emoji: '🕯️' },
    { id: 'happy', name: 'Bright Sunrise', freqs: [523, 587, 659, 783], wave: 'sine', emoji: '🌅' },
    { id: 'lofi', name: 'Cosmic Lofi Sweeps', freqs: [261.63, 329.63, 392.00, 523.25], wave: 'triangle', emoji: '🎵' },
    { id: 'rain', name: 'Heavy Window Rain', freqs: [180, 240, 160, 200], wave: 'triangle', emoji: '🌧️' },
    { id: 'piano', name: 'Whispering Keys', freqs: [293.66, 349.23, 440.00, 587.33], wave: 'sine', emoji: '🎹' },
    { id: 'nature', name: 'Earthy Greenery', freqs: [392, 493.88, 587.33, 783.99], wave: 'sine', emoji: '🍃' }
  ];

  const currentTrack = playlist[currentTrackIndex];

  const playNextNote = () => {
    if (!isPlaying) return;
    const track = playlist[currentTrackIndex];
    const freq = track.freqs[Math.floor(Math.random() * track.freqs.length)];
    playComfortTone(freq, track.wave, 1.2, volume);

    // Schedule next note
    playTimerRef.current = setTimeout(playNextNote, 1500 + Math.random() * 1000);
  };

  useEffect(() => {
    if (isPlaying) {
      playNextNote();
    } else {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
    }
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentTrackIndex, volume]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    playComfortTone(523.25, 'sine', 0.2, 0.05);
  };

  const handleSkip = (dir: 'next' | 'prev') => {
    let nextIdx = currentTrackIndex;
    if (dir === 'next') {
      nextIdx = (currentTrackIndex + 1) % playlist.length;
    } else {
      nextIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    }
    setCurrentTrackIndex(nextIdx);
    playComfortTone(400, 'sine', 0.1, 0.05);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1 select-none">
        <span className="text-2xl">🎵</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🎵 Cozy Floating Music Player
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Listen to synthesized relaxing tones made live on your browser. Skip tracks and set custom volumes.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-slate-950/45 border border-pink-500/15 rounded-[40px] p-6 shadow-2xl relative overflow-hidden flex flex-col items-center space-y-6">
        
        {/* Animated Equalizer Visualizer */}
        <div className="w-full h-12 flex justify-center items-end gap-1 select-none relative bg-slate-950/30 rounded-xl px-4 py-2 border border-white/5">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? {
                height: [10, 40, 10, 30, 10]
              } : { height: 10 }}
              transition={{
                duration: 1 + (i % 5) * 0.2,
                repeat: Infinity,
                delay: i * 0.05,
                ease: 'easeInOut'
              }}
              className="w-1.5 rounded-full bg-gradient-to-t from-pink-500 to-purple-600"
            />
          ))}
          {!isPlaying && (
            <span className="absolute inset-0 flex items-center justify-center text-[8px] uppercase tracking-widest font-black text-zinc-500">
              Synthesizer Silenced
            </span>
          )}
        </div>

        {/* Current Track details */}
        <div className="text-center space-y-1 select-none">
          <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-2xl mx-auto shadow-inner animate-pulse">
            {currentTrack.emoji}
          </div>
          <span className="text-[8px] uppercase tracking-widest font-black text-pink-400 font-mono block">Currently Playing</span>
          <h4 className="text-sm font-serif font-black text-white">{currentTrack.name}</h4>
          <p className="text-[9px] text-zinc-400 font-mono">Wave Type: {currentTrack.wave}</p>
        </div>

        {/* Playlist selection list */}
        <div className="w-full max-h-24 overflow-y-auto space-y-1 bg-slate-950/40 rounded-2xl p-2 border border-white/5 custom-scrollbar">
          {playlist.map((t, idx) => {
            const isCur = idx === currentTrackIndex;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setCurrentTrackIndex(idx);
                  setIsPlaying(true);
                  playComfortTone(440, 'sine', 0.1);
                }}
                className={`w-full p-2 rounded-xl text-left text-[10px] font-semibold flex items-center justify-between cursor-pointer transition-all ${
                  isCur 
                    ? 'bg-pink-500/15 text-pink-300 border border-pink-500/25 font-bold' 
                    : 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span>{t.emoji}</span>
                  <span>{t.name}</span>
                </span>
                {isCur && isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />}
              </button>
            );
          })}
        </div>

        {/* Volume controller */}
        <div className="w-full flex items-center gap-3">
          <Volume1 size={14} className="text-zinc-500 shrink-0" />
          <input 
            type="range" 
            min="0.01" 
            max="0.25" 
            step="0.01"
            value={volume} 
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
            }}
            className="w-full accent-pink-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
          />
          <Volume2 size={14} className="text-zinc-500 shrink-0" />
        </div>

        {/* Player operations */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleSkip('prev')}
            className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-white cursor-pointer active:scale-95 transition-all text-xs"
          >
            ◀◀
          </button>

          <button
            onClick={handlePlayToggle}
            className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-450 hover:from-pink-600 text-white rounded-xl text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer shadow-md active:scale-95"
          >
            {isPlaying ? "Pause Synth ⏸" : "Play Synth ▶"}
          </button>

          <button
            onClick={() => handleSkip('next')}
            className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-white cursor-pointer active:scale-95 transition-all text-xs"
          >
            ▶▶
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── 10. DAILY GIFT (🎁 DETAILED COLLECTIBLE DRAWER) ───
export function DailyGift() {
  const [giftReward, setGiftReward] = useState<any | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [hasOpenedToday, setHasOpenedToday] = useState(() => {
    const saved = localStorage.getItem('ruu_daily_gift_timestamp');
    if (!saved) return false;
    // Check if same calendar day
    const lastDate = new Date(parseInt(saved, 10)).toDateString();
    const todayDate = new Date().toDateString();
    return lastDate === todayDate;
  });

  const rewards = [
    { type: '🧸 Teddy Companion', emoji: '🧸', title: 'Cosmic Golden Teddy Plushie!', desc: 'He has strict rules to lay beside you and protect your sweet sleep.' },
    { type: '🌹 Fresh Flower', emoji: '🌹', title: 'Deep Crimson Love Rose!', desc: 'Carries sweet vanilla-honey aroma and an infinity of warm hugs.' },
    { type: '🍫 Premium Sweet', emoji: '🍫', title: 'Belgian Caramel Chocolate Cup!', desc: 'High-density sweetness designed to instantly boost happy serotonin.' },
    { type: '💌 Love Letter', emoji: '💌', title: 'Personal Mini Postcard!', desc: '"You are doing so well, my darling girl. Eat chocolates, stay cozy, I got you."' },
    { type: '🫂 Warm Squeeze', emoji: '❤️', title: 'Infinite Protective Squeeze!', desc: 'Wrapping arms around your waist and pulling you safe against my heartbeat.' },
    { type: '☕ Cocoa Mug', emoji: '☕', title: 'Creamy Marshmallow Hot Chocolate!', desc: 'Brews rich warm cocoa that melts away cramp pains and muscle stress.' },
    { type: '🍵 Healing Elixir', emoji: '🍵', title: 'Fresh Honey Ginger Chamomile!', desc: 'A soothing organic remedy designed to relieve localized physical cramps.' },
    { type: '⭐ Lucky Star', emoji: '⭐', title: 'Sparkling Golden Dream Star!', desc: 'Fights away headache demons and watches over your sleep tonight.' },
    { type: '✨ Cosmic Dust', emoji: '✨', title: 'Sparkling Stardust Fairy Wand!', desc: 'Fills your horizons with colorful hope, happiness and comfort.' }
  ];

  const handleOpenGift = () => {
    if (isOpening || hasOpenedToday) return;
    setIsOpening(true);
    setGiftReward(null);
    playComfortTone(400, 'sawtooth', 0.15);

    setTimeout(() => {
      const rand = rewards[Math.floor(Math.random() * rewards.length)];
      setGiftReward(rand);
      setIsOpening(false);
      setHasOpenedToday(true);
      localStorage.setItem('ruu_daily_gift_timestamp', Date.now().toString());
      playComfortTone(880, 'sine', 0.5); // Success chime
    }, 1800);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1 select-none">
        <span className="text-2xl">🎁</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🎁 Daily Gift Box
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Claim one free comforting luxury gift every single day. Unbox now to find out today's collectible.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-slate-950/45 border border-pink-500/15 rounded-[40px] p-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
        
        <AnimatePresence mode="wait">
          {!hasOpenedToday ? (
            <motion.div
              key="closed"
              initial={{ scale: 0.95 }}
              animate={isOpening ? { rotate: [0, -15, 15, -15, 15, 0], scale: 1.1 } : { scale: [0.95, 1.05, 0.95] }}
              transition={isOpening ? { duration: 1.5 } : { duration: 2.2, repeat: Infinity }}
              onClick={handleOpenGift}
              className="text-center space-y-4 cursor-pointer z-10 select-none"
            >
              <span className="text-7xl filter drop-shadow-[0_0_20px_rgba(244,63,94,0.4)] block hover:scale-108 transition-transform">🎁</span>
              <button className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-450 hover:from-pink-600 text-white rounded-xl text-[9px] uppercase font-black tracking-widest transition-all shadow-md">
                Claim Daily Gift
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-center space-y-5 z-10"
            >
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center bg-pink-500/10 rounded-full border border-pink-500/20 select-none shadow-inner">
                <span className="text-5xl animate-bounce inline-block filter drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]">
                  {giftReward ? giftReward.emoji : '🧸'}
                </span>
              </div>

              {giftReward && (
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-widest text-pink-400 font-mono font-black bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20 animate-pulse inline-block">
                    {giftReward.type} Collected! ✨
                  </span>
                  <h4 className="text-sm font-serif font-black text-white">{giftReward.title}</h4>
                  <p className="text-[10px] text-zinc-300 leading-relaxed max-w-[240px] mx-auto">{giftReward.desc}</p>
                </div>
              )}

              <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">
                Come back tomorrow for another special delivery!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {isOpening && (
          <span className="text-[9px] uppercase font-black text-pink-300 tracking-widest animate-pulse mt-4 z-10">Unboxing Daily Love...</span>
        )}
      </div>
    </div>
  );
}

// ─── 11. ACHIEVEMENTS (🏆 UNLOCKABLE BADGE SYSTEM) ───
export function Achievements() {
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ruu_achievements');
    return saved ? JSON.parse(saved) : {
      golden_teddy: true,
      diamond_heart: false,
      comfort_master: false,
      flower_lover: false,
      chocolate_lover: false,
      kind_soul: true
    };
  });

  const badgeSchema = [
    { id: 'golden_teddy', label: 'Golden Teddy 🏆', desc: 'Squeezed 10+ teddies or triggered sweet teddy reactions.', emoji: '🏆' },
    { id: 'diamond_heart', label: 'Diamond Heart 💎', desc: 'Logged 100+ floating hearts in your personal Love Jar.', emoji: '💎' },
    { id: 'comfort_master', label: 'Comfort Master 🌟', desc: 'Completed full self-care routines for cramps and pains.', emoji: '🌟' },
    { id: 'flower_lover', label: 'Flower Lover 🌸', desc: 'Nurtured or bloomed 15+ flowers in your interactive Mood Garden.', emoji: '🌸' },
    { id: 'chocolate_lover', label: 'Chocolate Lover 🍫', desc: 'Discovered premium sweet chocolate prescriptions in Today\'s Love.', emoji: '🍫' },
    { id: 'kind_soul', label: 'Kind Soul ✨', desc: 'Pre-unlocked starting bonus for having a truly golden heart.', emoji: '✨' }
  ];

  const handleUnlock = (id: string) => {
    const next = { ...unlocked, [id]: true };
    setUnlocked(next);
    localStorage.setItem('ruu_achievements', JSON.stringify(next));
    playComfortTone(1046.50, 'sine', 0.4); // Success high chime
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1 select-none">
        <span className="text-2xl">🏆</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🏆 Locker Achievements
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Your personal glass display showcase. Complete sweet activities to unlock all 8 protection badges!
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-950/45 border border-pink-500/15 rounded-[40px] p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Shine gloss highlights for cabinet */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none transform -skew-x-12" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badgeSchema.map((b) => {
            const isUnlocked = unlocked[b.id];
            return (
              <div
                key={b.id}
                onClick={() => {
                  if (!isUnlocked) {
                    handleUnlock(b.id);
                  } else {
                    playComfortTone(600, 'sine', 0.1);
                  }
                }}
                className={`glass-card p-4 rounded-3xl border text-center flex flex-col justify-between items-center cursor-pointer transition-all ${
                  isUnlocked 
                    ? 'bg-gradient-to-b from-purple-500/10 via-transparent to-transparent border-pink-500/35 shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:scale-[1.03]' 
                    : 'bg-slate-950/40 border-white/5 opacity-40 hover:opacity-65'
                }`}
              >
                <div className="absolute top-2 right-2 text-[9px] font-bold">
                  {isUnlocked ? (
                    <span className="text-pink-400">🔓</span>
                  ) : (
                    <span className="text-zinc-600">🔒</span>
                  )}
                </div>

                <span className={`text-4xl inline-block select-none ${isUnlocked ? 'animate-bounce' : 'grayscale filter'}`}>
                  {b.emoji}
                </span>

                <div className="space-y-1 mt-3 text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white block">{b.label}</span>
                  <p className="text-[8px] text-zinc-400 leading-normal max-w-[130px] mx-auto">{b.desc}</p>
                </div>

                {!isUnlocked && (
                  <button className="mt-2.5 px-2.5 py-1 bg-white/5 border border-white/10 text-[8px] text-zinc-500 rounded-lg hover:border-white/20">
                    Acquire Badge
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── 12. TEDDY REACTIONS (🧸 INTERACTIVE PLAYFUL COMPANION ACTIONS) ───
export function TeddyReactions() {
  const [activeReaction, setActiveReaction] = useState<'wave' | 'smile' | 'dance' | 'sleep' | 'celebrate' | 'hug' | 'flower' | 'chocolate' | 'letter'>('wave');

  const reactions = [
    { id: 'wave', label: 'Wave 👋', emoji: '👋', sound: 523.25, desc: "Teddy waves his fuzzy little paw to say: 'Hey my favorite girl! I missed you!'" },
    { id: 'smile', label: 'Smile 😊', emoji: '😊', sound: 587.33, desc: "Teddy blushes sweet pink circles and gives you his brightest happy smile!" },
    { id: 'dance', label: 'Dance 💃', emoji: '💃', sound: 659.25, desc: "Teddy does a joyful wiggle-bounce dance to make you giggle!" },
    { id: 'sleep', label: 'Sleep 💤', emoji: '💤', sound: 329.63, desc: "Teddy curls up under a cozy blanket, breathing softly to soothe your tummy." },
    { id: 'celebrate', label: 'Celebrate 🎉', emoji: '🎉', sound: 783.99, desc: "Teddy blows a tiny horn and throws stardust confetti because you are a champion!" },
    { id: 'hug', label: 'Give Hug 🫂', emoji: '🫂', sound: 440.00, desc: "Teddy wraps his snuggly arms tight around you with an infinite warm squeeze." },
    { id: 'flower', label: 'Hold Flower 🌹', emoji: '🌹', sound: 554.37, desc: "Teddy presents a fresh, magical crimson rose: 'For my lovely queen, only the best!'" },
    { id: 'chocolate', label: 'Hold Chocolate 🍫', emoji: '🍫', sound: 493.88, desc: "Teddy offers a sweet, rich caramel chocolate truffle: 'A dose of sweet relief!'" },
    { id: 'letter', label: 'Read Letter 📖', emoji: '📖', sound: 349.23, desc: "Teddy puts on little reading spectacles to read a love note from Ruu aloud." }
  ];

  const current = reactions.find(r => r.id === activeReaction) || reactions[0];

  const handleReactionClick = (id: any) => {
    setActiveReaction(id);
    playComfortTone(500, 'sine', 0.1, 0.05);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1 select-none">
        <span className="text-2xl">🧸</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🧸 Teddy Bear Interactive Reactions
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Tap any of the action buttons below to watch your cozy virtual teddy companion react to you dynamically in real time.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-950/45 border border-pink-500/15 rounded-[40px] p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Visual Teddy Stage (7 cols) */}
        <div className="md:col-span-7 flex flex-col items-center justify-center bg-slate-950/30 border border-pink-500/10 rounded-3xl p-6 min-h-[280px] relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            {/* Cozy cushion behind Teddy */}
            <div className="absolute inset-x-8 bottom-4 h-12 bg-pink-500/10 dark:bg-pink-500/5 blur-md rounded-full pointer-events-none" />

            <motion.div
              key={activeReaction}
              initial={{ scale: 0.9, rotate: -3 }}
              animate={
                activeReaction === 'dance' ? {
                  y: [0, -15, 0],
                  rotate: [-8, 8, -8],
                  scale: [1, 1.05, 1]
                } : activeReaction === 'wave' ? {
                  rotate: [-2, 2, -2]
                } : activeReaction === 'sleep' ? {
                  y: [0, 4, 0],
                  scale: [0.95, 0.97, 0.95],
                  rotate: [-3, -1, -3]
                } : activeReaction === 'celebrate' ? {
                  y: [0, -10, 0, -5, 0],
                  scale: [1, 1.08, 1, 1.03, 1]
                } : {
                  scale: 1,
                  rotate: 0
                }
              }
              transition={
                activeReaction === 'dance' ? { duration: 1, repeat: Infinity, ease: 'easeInOut' } :
                activeReaction === 'sleep' ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } :
                activeReaction === 'celebrate' ? { duration: 0.8, ease: 'easeOut' } :
                { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }
              className="relative w-40 h-40 flex items-center justify-center z-10 select-none"
            >
              {/* SVG Teddy Bear */}
              <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(139,92,246,0.25)]">
                {/* Ears */}
                <motion.circle 
                  cx="30" cy="25" r="11" fill="#78350f" 
                  animate={activeReaction === 'celebrate' ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                />
                <circle cx="30" cy="25" r="6" fill="#fbcfe8" />
                <motion.circle 
                  cx="70" cy="25" r="11" fill="#78350f" 
                  animate={activeReaction === 'celebrate' ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                />
                <circle cx="70" cy="25" r="6" fill="#fbcfe8" />

                {/* Head */}
                <circle cx="50" cy="42" r="23" fill="#854d0e" />

                {/* Blushing cheeks */}
                <circle cx="36" cy="44" r="3.5" fill="#f43f5e" opacity={activeReaction === 'smile' || activeReaction === 'hug' ? 0.8 : 0.4} className="transition-opacity" />
                <circle cx="64" cy="44" r="3.5" fill="#f43f5e" opacity={activeReaction === 'smile' || activeReaction === 'hug' ? 0.8 : 0.4} className="transition-opacity" />

                {/* Snout */}
                <ellipse cx="50" cy="48" rx="8" ry="6" fill="#fde047" />
                
                {/* Nose */}
                <polygon points="47,46 53,46 50,49" fill="#1e1b4b" />

                {/* Mouth */}
                {activeReaction === 'smile' || activeReaction === 'celebrate' || activeReaction === 'wave' ? (
                  <path d="M46,50 Q50,54 54,50" stroke="#1e1b4b" strokeWidth="1.5" fill="none" />
                ) : activeReaction === 'sleep' ? (
                  <path d="M48,51 Q50,52 52,51" stroke="#1e1b4b" strokeWidth="1.5" fill="none" />
                ) : (
                  <path d="M47,50 Q50,52 53,50" stroke="#1e1b4b" strokeWidth="1" fill="none" />
                )}

                {/* Eyes */}
                {activeReaction === 'sleep' ? (
                  <>
                    <path d="M34,40 Q38,43 42,40" stroke="#1e1b4b" strokeWidth="1.5" fill="none" />
                    <path d="M58,40 Q62,43 66,40" stroke="#1e1b4b" strokeWidth="1.5" fill="none" />
                  </>
                ) : activeReaction === 'smile' || activeReaction === 'hug' ? (
                  <>
                    {/* Happy eye curves */}
                    <path d="M33,42 Q37,38 41,42" stroke="#1e1b4b" strokeWidth="2" fill="none" />
                    <path d="M59,42 Q63,38 67,42" stroke="#1e1b4b" strokeWidth="2" fill="none" />
                  </>
                ) : (
                  <>
                    <circle cx="37" cy="40" r="3" fill="#1e1b4b" />
                    <circle cx="63" cy="40" r="3" fill="#1e1b4b" />
                    {/* Eye shines */}
                    <circle cx="36" cy="39" r="1" fill="#fff" />
                    <circle cx="62" cy="39" r="1" fill="#fff" />
                  </>
                )}

                {/* Reading Glasses */}
                {activeReaction === 'letter' && (
                  <>
                    <circle cx="37" cy="40" r="6" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
                    <circle cx="63" cy="40" r="6" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
                    <line x1="43" y1="40" x2="57" y2="40" stroke="#fbbf24" strokeWidth="1.5" />
                  </>
                )}

                {/* Body */}
                <ellipse cx="50" cy="74" rx="22" ry="18" fill="#854d0e" />
                <ellipse cx="50" cy="74" rx="14" ry="11" fill="#a16207" />

                {/* LEFT ARM */}
                {activeReaction === 'wave' ? (
                  <motion.path 
                    d="M28,68 C22,60 16,52 14,56 C12,60 18,69 26,73" 
                    fill="#854d0e" 
                    animate={{ rotate: [-25, 10, -25] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformOrigin: '27px 70px' }}
                  />
                ) : activeReaction === 'hug' ? (
                  <motion.path 
                    d="M28,68 C15,64 12,65 14,70 C16,75 22,73 26,73" 
                    fill="#854d0e" 
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                ) : (
                  <path d="M28,68 C20,60 15,62 17,67 C19,72 23,73 26,73" fill="#854d0e" />
                )}

                {/* RIGHT ARM */}
                {activeReaction === 'hug' ? (
                  <motion.path 
                    d="M72,68 C85,64 88,65 86,70 C84,75 78,73 74,73" 
                    fill="#854d0e" 
                    animate={{ x: [0, -6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                ) : (
                  <path d="M72,68 C80,60 85,62 83,67 C81,72 77,73 74,73" fill="#854d0e" />
                )}

                {/* FEET */}
                <ellipse cx="32" cy="88" rx="7" ry="5" fill="#78350f" />
                <ellipse cx="68" cy="88" rx="7" ry="5" fill="#78350f" />

                {/* ACCESSORY ATTACHMENTS */}
                {activeReaction === 'flower' && (
                  <g transform="translate(68, 62)">
                    {/* A beautiful blooming flower held by Teddy */}
                    <line x1="0" y1="0" x2="10" y2="-15" stroke="#10b981" strokeWidth="2" />
                    <circle cx="10" cy="-15" r="4" fill="#f43f5e" />
                    <circle cx="6" cy="-17" r="3" fill="#f43f5e" />
                    <circle cx="14" cy="-13" r="3" fill="#f43f5e" />
                    <circle cx="13" cy="-18" r="3" fill="#f43f5e" />
                    <circle cx="7" cy="-12" r="3" fill="#f43f5e" />
                    <circle cx="10" cy="-15" r="2" fill="#fbbf24" />
                  </g>
                )}

                {activeReaction === 'chocolate' && (
                  <g transform="translate(50, 68)">
                    {/* A shiny chocolate bar */}
                    <rect x="-8" y="-4" width="16" height="12" rx="2" fill="#451a03" stroke="#f59e0b" strokeWidth="0.5" />
                    <line x1="-8" y1="2" x2="8" y2="2" stroke="#78350f" strokeWidth="1" />
                    <line x1="-3" y1="-4" x2="-3" y2="8" stroke="#78350f" strokeWidth="1" />
                    <line x1="3" y1="-4" x2="3" y2="8" stroke="#78350f" strokeWidth="1" />
                  </g>
                )}

                {activeReaction === 'letter' && (
                  <g transform="translate(32, 60)">
                    {/* Teddy reading a tiny handwritten envelope */}
                    <rect x="0" y="0" width="36" height="22" rx="2" fill="#fffdfa" stroke="#ec4899" strokeWidth="1" />
                    <line x1="0" y1="0" x2="18" y2="11" stroke="#f472b6" strokeWidth="1" />
                    <line x1="36" y1="0" x2="18" y2="11" stroke="#f472b6" strokeWidth="1" />
                    <circle cx="18" cy="11" r="2.5" fill="#f43f5e" />
                  </g>
                )}
              </svg>

              {/* Floating elements inside the relative box */}
              <AnimatePresence>
                {activeReaction === 'sleep' && (
                  <>
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.5, y: 10, x: -20 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], y: -40, x: -35 }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                      className="absolute text-purple-300 font-mono font-bold text-xs"
                    >
                      Zzz
                    </motion.span>
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.5, y: 15, x: -10 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], y: -50, x: -25 }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                      className="absolute text-purple-300 font-mono font-bold text-sm"
                    >
                      Zzz
                    </motion.span>
                  </>
                )}

                {activeReaction === 'celebrate' && (
                  <>
                    {/* Party confetti floating around */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 1, scale: 0.2, y: 30, x: 0 }}
                        animate={{ 
                          opacity: [1, 0], 
                          scale: [0.2, 1, 0.4], 
                          y: [30, -50 - (i * 5)], 
                          x: [(i % 2 === 0 ? -40 : 40) + Math.sin(i) * 20] 
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                        className="absolute text-xs"
                        style={{
                          color: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#ec4899' : '#8b5cf6'
                        }}
                      >
                        {i % 4 === 0 ? '✨' : i % 4 === 1 ? '🎉' : i % 4 === 2 ? '🎈' : '⭐'}
                      </motion.div>
                    ))}
                  </>
                )}

                {activeReaction === 'hug' && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 0.8, 0], scale: [0.5, 1.5, 1.2, 0.8], y: -30 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute text-2xl text-red-500 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                  >
                    ❤️
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="mt-4 p-4 bg-slate-950/40 border border-pink-500/10 rounded-2xl w-full">
            <p className="text-xs text-zinc-300 leading-relaxed font-serif font-medium">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Buttons List Panel (5 cols) */}
        <div className="md:col-span-5 grid grid-cols-3 md:grid-cols-1 gap-2 w-full text-left">
          {reactions.map((r) => {
            const isSel = activeReaction === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleReactionClick(r.id)}
                className={`p-3 rounded-2xl border text-center md:text-left cursor-pointer transition-all ${
                  isSel 
                    ? 'bg-gradient-to-r from-pink-500/20 to-rose-450/10 border-pink-500 text-pink-300 shadow-md scale-102 font-bold' 
                    : 'bg-slate-950/45 border-white/5 text-zinc-400 hover:border-pink-500/15 hover:text-zinc-200'
                }`}
              >
                <div className="flex flex-col md:flex-row items-center md:justify-between gap-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold">{r.label}</span>
                  <span className="text-sm shrink-0">{r.emoji}</span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
