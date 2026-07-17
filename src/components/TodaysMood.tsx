import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Mood Definitions
export type MoodType = 'happy' | 'sad' | 'angry' | 'loved' | 'sleepy' | 'missing' | 'excited';

export const MOODS: Record<MoodType, {
  label: string;
  emoji: string;
  message: string;
  color: string;
  glowColor: string;
  textColor: string;
  bgGradient: string;
}> = {
  happy: {
    label: 'Happy',
    emoji: '😊',
    message: "You deserve endless happiness.",
    color: '#a855f7', // purple
    glowColor: 'rgba(168, 85, 247, 0.6)',
    textColor: 'text-purple-300',
    bgGradient: 'from-purple-900/40 to-pink-900/40'
  },
  sad: {
    label: 'Sad',
    emoji: '😔',
    message: "I'll always stay beside you.",
    color: '#3b82f6', // blue
    glowColor: 'rgba(59, 130, 246, 0.6)',
    textColor: 'text-blue-300',
    bgGradient: 'from-blue-900/40 to-indigo-900/40'
  },
  angry: {
    label: 'Angry',
    emoji: '😡',
    message: "It's okay to be upset.",
    color: '#ef4444', // red
    glowColor: 'rgba(239, 68, 68, 0.6)',
    textColor: 'text-red-300',
    bgGradient: 'from-red-900/40 to-rose-900/40'
  },
  loved: {
    label: 'Loved',
    emoji: '❤️',
    message: "You are loved more than words.",
    color: '#ec4899', // pink
    glowColor: 'rgba(236, 72, 153, 0.6)',
    textColor: 'text-pink-300',
    bgGradient: 'from-pink-900/40 to-rose-900/40'
  },
  sleepy: {
    label: 'Sleepy',
    emoji: '😴',
    message: "Sleep well, beautiful.",
    color: '#6366f1', // indigo
    glowColor: 'rgba(99, 102, 241, 0.6)',
    textColor: 'text-indigo-300',
    bgGradient: 'from-indigo-900/40 to-blue-900/40'
  },
  missing: {
    label: 'Missing You',
    emoji: '🥺',
    message: "I miss you every second.",
    color: '#d946ef', // fuchsia
    glowColor: 'rgba(217, 70, 239, 0.6)',
    textColor: 'text-fuchsia-300',
    bgGradient: 'from-fuchsia-900/40 to-purple-900/40'
  },
  excited: {
    label: 'Excited',
    emoji: '🤗',
    message: "You make every day exciting.",
    color: '#f59e0b', // amber
    glowColor: 'rgba(245, 158, 11, 0.6)',
    textColor: 'text-amber-300',
    bgGradient: 'from-amber-900/40 to-orange-900/40'
  }
};

export default function TodaysMood() {
  const [currentMood, setCurrentMood] = useState<MoodType>('happy');
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; size: number; rotation: number; delay: number }[]>([]);
  const [showLovePopup, setShowLovePopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isOctopusClicked, setIsOctopusClicked] = useState(false);

  // Time-based mood
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) {
      setCurrentMood('sleepy');
    } else if (hour >= 6 && hour < 12) {
      setCurrentMood('happy');
    } else if (hour >= 18 && hour < 22) {
      setCurrentMood('loved');
    }
  }, []);

  const moodData = MOODS[currentMood];

  const handleOctopusClick = () => {
    setIsOctopusClicked(true);
    setShowLovePopup(true);
    triggerHearts(100);
    setTimeout(() => {
      setIsOctopusClicked(false);
      setShowLovePopup(false);
    }, 3000);
  };

  const triggerHearts = (count: number) => {
    const newHearts = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.5
    }));
    setHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts([]);
    }, 4000);
  };

  const handleGiveHugClick = () => {
    triggerHearts(100);
    setCurrentMood('loved');
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-16 px-4 relative z-20">
      {/* Background FX specific to Mood section */}
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 0, y: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], y: -150, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, delay: heart.delay, ease: "easeOut" }}
            className="fixed pointer-events-none z-[100] drop-shadow-md"
            style={{
              left: `${heart.x}vw`,
              top: `${heart.y}vh`,
              fontSize: `${heart.size}px`,
              transform: `rotate(${heart.rotation}deg)`
            }}
          >
            {moodData.emoji === '❤️' || currentMood === 'loved' ? '❤️' : '💖'}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        
        {/* LEFT: Text & Controls */}
        <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-black mb-2 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(216,180,254,0.4)]">
              Today's Mood 💜
            </h2>
            <p className="text-purple-200 text-lg md:text-xl font-medium tracking-wide drop-shadow-md">
              "Every emotion of yours is precious to me."
            </p>
          </motion.div>

          {/* Animated Mood Card */}
          <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentMood}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className={`w-full max-w-md p-6 rounded-[32px] backdrop-blur-xl border border-white/10 shadow-2xl bg-gradient-to-br ${moodData.bgGradient} transition-all duration-600`}
            style={{ boxShadow: `0 10px 40px -10px ${moodData.glowColor}` }}
          >
            <div className="flex items-center gap-4 mb-3">
              <span className="text-5xl drop-shadow-lg">{moodData.emoji}</span>
              <h3 className={`text-3xl font-black font-serif ${moodData.textColor}`}>
                {moodData.label}
              </h3>
            </div>
            <p className="text-zinc-200 text-lg leading-relaxed italic">
              "{moodData.message}"
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGiveHugClick}
            className="group relative px-8 py-4 rounded-full font-bold text-lg text-white shadow-xl overflow-hidden mt-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/20 blur-md group-hover:blur-xl transition-all duration-300" />
            <span className="relative z-10 flex items-center gap-2 drop-shadow-md">
              Give Her a Hug 🤍
            </span>
          </motion.button>
          
          {/* Mood Selector (for demo/interactive purposes) */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-4">
            {(Object.keys(MOODS) as MoodType[]).map(m => (
              <button
                key={m}
                onClick={() => setCurrentMood(m)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${currentMood === m ? 'scale-110 ring-2 ring-white/50 bg-white/20' : 'opacity-60 hover:opacity-100 hover:scale-105 bg-white/5'}`}
                title={MOODS[m].label}
              >
                {MOODS[m].emoji}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Octopus Character */}
        <div className="flex-1 w-full flex justify-center items-center relative min-h-[400px]">
          {/* Glass circle behind */}
          <motion.div 
            animate={{ 
              backgroundColor: moodData.glowColor,
              boxShadow: `0 0 60px 20px ${moodData.glowColor}`
            }}
            transition={{ duration: 0.6 }}
            className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full blur-3xl opacity-30 z-0"
          />
          <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/5 backdrop-blur-md border border-white/10 z-0 shadow-2xl" />

          {/* Floating Fireflies/Particles specific to mood */}
          <AnimatePresence>
            {currentMood === 'sleepy' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-10 right-10 text-4xl opacity-80 animate-pulse">🌙</div>
                <div className="absolute top-20 left-10 text-2xl opacity-60 animate-bounce">⭐</div>
                <div className="absolute top-5 right-32 text-xl opacity-40">💤</div>
                <div className="absolute top-16 right-24 text-2xl opacity-60 delay-150">💤</div>
              </motion.div>
            )}
            {currentMood === 'sad' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 z-0 pointer-events-none">
                {Array.from({length: 10}).map((_, i) => (
                  <div key={i} className="absolute w-1 h-3 bg-blue-400/50 rounded-full animate-bounce" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDuration: `${0.5 + Math.random()}s` }} />
                ))}
              </motion.div>
            )}
            {currentMood === 'angry' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 z-0 pointer-events-none">
                 <div className="absolute top-10 left-1/4 text-3xl animate-ping opacity-60">💢</div>
                 <div className="absolute top-16 right-1/4 text-2xl animate-ping opacity-40 delay-150">💢</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The Plush Octopus */}
          <motion.div
            className="relative z-10 cursor-pointer select-none"
            animate={{
              y: isOctopusClicked ? [0, 20, 0] : [-10, 10, -10], // idle floating / click hug bounce
              scale: isHovered ? (isOctopusClicked ? 0.9 : 1.05) : 1,
              rotate: isHovered ? 3 : 0,
            }}
            transition={{
              y: { 
                duration: isOctopusClicked ? 0.4 : (currentMood === 'sleepy' ? 6 : 4), 
                repeat: isOctopusClicked ? 0 : Infinity, 
                ease: "easeInOut" 
              },
              scale: { duration: 0.3 },
              rotate: { duration: 0.3 }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleOctopusClick}
          >
            {/* We will build a pure CSS/SVG Octopus here! */}
            <PlushOctopus mood={currentMood} color={moodData.color} isHugged={isOctopusClicked} />

            {/* Click popup bubble */}
            <AnimatePresence>
              {showLovePopup && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: -20, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.8 }}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-pink-600 px-4 py-2 rounded-2xl font-bold shadow-xl border border-pink-200 whitespace-nowrap z-20 after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-white"
                >
                  I love you ❤️
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function PlushOctopus({ mood, color, isHugged }: { mood: MoodType; color: string; isHugged: boolean }) {
  // We use SVG to draw a cute reversible octopus
  
  // Expressions based on mood
  const getExpression = () => {
    switch (mood) {
      case 'happy':
        return (
          <g>
            {/* Eyes */}
            <circle cx="80" cy="115" r="9" fill="#1e1b4b" />
            <circle cx="83" cy="112" r="3" fill="white" />
            <circle cx="120" cy="115" r="9" fill="#1e1b4b" />
            <circle cx="123" cy="112" r="3" fill="white" />
            {/* Blush */}
            <ellipse cx="65" cy="122" rx="8" ry="4" fill="#f472b6" opacity="0.6" />
            <ellipse cx="135" cy="122" rx="8" ry="4" fill="#f472b6" opacity="0.6" />
            {/* Mouth (Big smile) */}
            <path d="M 90 125 Q 100 140 110 125" fill="none" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
            {/* Sparkles */}
            <text x="140" y="90" fontSize="16">✨</text>
            <text x="40" y="80" fontSize="12">✨</text>
          </g>
        );
      case 'sad':
        return (
          <g>
            {/* Eyes */}
            <circle cx="80" cy="120" r="9" fill="#1e1b4b" />
            <circle cx="83" cy="117" r="3" fill="white" />
            <circle cx="120" cy="120" r="9" fill="#1e1b4b" />
            <circle cx="123" cy="117" r="3" fill="white" />
            {/* Tears */}
            <path d="M 80 130 L 80 145" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" className="animate-bounce" />
            <path d="M 120 130 L 120 145" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" className="animate-bounce delay-75" />
            {/* Eyebrows */}
            <path d="M 70 105 L 85 110" fill="none" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 130 105 L 115 110" fill="none" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
            {/* Mouth */}
            <path d="M 95 130 Q 100 125 105 130" fill="none" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 'angry':
        return (
          <g>
            {/* Eyes */}
            <path d="M 72 115 Q 80 110 88 115" fill="none" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
            <path d="M 112 115 Q 120 110 128 115" fill="none" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
            {/* Eyebrows */}
            <path d="M 70 105 L 85 115" fill="none" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
            <path d="M 130 105 L 115 115" fill="none" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
            {/* Mouth (Pout) */}
            <path d="M 95 130 Q 100 125 105 130" fill="none" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 'loved':
        return (
          <g>
            {/* Heart Eyes */}
            <text x="70" y="125" fontSize="22">❤️</text>
            <text x="110" y="125" fontSize="22">❤️</text>
            {/* Blush */}
            <ellipse cx="65" cy="130" rx="10" ry="5" fill="#f472b6" opacity="0.8" />
            <ellipse cx="135" cy="130" rx="10" ry="5" fill="#f472b6" opacity="0.8" />
            {/* Mouth (Smile) */}
            <path d="M 90 135 Q 100 145 110 135" fill="none" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 'sleepy':
        return (
          <g>
            {/* Closed Eyes */}
            <path d="M 70 120 Q 80 125 90 120" fill="none" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
            <path d="M 110 120 Q 120 125 130 120" fill="none" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
            {/* Sleep bubble */}
            <circle cx="100" cy="135" r="4" fill="none" stroke="#60a5fa" strokeWidth="2" className="animate-ping" />
          </g>
        );
      case 'missing':
        return (
          <g>
            {/* Big Watery Eyes */}
            <circle cx="80" cy="115" r="12" fill="#1e1b4b" />
            <circle cx="84" cy="111" r="5" fill="white" />
            <circle cx="76" cy="119" r="2" fill="white" />
            <circle cx="120" cy="115" r="12" fill="#1e1b4b" />
            <circle cx="124" cy="111" r="5" fill="white" />
            <circle cx="116" cy="119" r="2" fill="white" />
            {/* Blush */}
            <ellipse cx="65" cy="125" rx="10" ry="5" fill="#f472b6" opacity="0.6" />
            <ellipse cx="135" cy="125" rx="10" ry="5" fill="#f472b6" opacity="0.6" />
            {/* Eyebrows (worried) */}
            <path d="M 70 100 L 85 95" fill="none" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 130 100 L 115 95" fill="none" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
            {/* Mouth */}
            <path d="M 95 132 Q 100 128 105 132" fill="none" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 'excited':
        return (
          <g>
            {/* Star Eyes */}
            <text x="70" y="125" fontSize="24">✨</text>
            <text x="110" y="125" fontSize="24">✨</text>
            {/* Big Open Mouth */}
            <path d="M 90 130 Q 100 150 110 130 Z" fill="#1e1b4b" />
            <path d="M 95 138 Q 100 145 105 138 Z" fill="#f472b6" />
            {/* Blush */}
            <ellipse cx="65" cy="125" rx="8" ry="4" fill="#f472b6" opacity="0.8" />
            <ellipse cx="135" cy="125" rx="8" ry="4" fill="#f472b6" opacity="0.8" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <motion.svg 
      width="240" 
      height="240" 
      viewBox="0 0 200 200" 
      animate={{ filter: `drop-shadow(0 20px 20px ${color}66)` }}
      transition={{ duration: 0.6 }}
      className={`drop-shadow-2xl transition-all duration-300 ${mood === 'angry' ? 'animate-pulse' : ''} ${mood === 'excited' ? 'animate-bounce' : ''}`}
    >
      <motion.g 
        animate={{ scale: isHugged ? 0.9 : 1 }}
        transition={{ type: "spring", bounce: 0.6 }}
      >
        {/* Tentacles Background layer */}
        <motion.path 
          d="M 40 140 Q 30 170 50 160 Q 60 145 70 140" 
          animate={{ fill: color }} transition={{ duration: 0.6 }} 
          className={`${isHugged ? 'animate-ping' : ''}`}
        />
        <motion.path d="M 70 140 Q 75 180 90 165 Q 95 145 100 140" animate={{ fill: color }} transition={{ duration: 0.6 }} />
        <motion.path d="M 100 140 Q 105 180 120 165 Q 125 145 130 140" animate={{ fill: color }} transition={{ duration: 0.6 }} />
        <motion.path d="M 130 140 Q 140 170 155 160 Q 165 145 160 140" animate={{ fill: color }} transition={{ duration: 0.6 }} />
        <motion.path d="M 160 140 Q 170 160 180 140" animate={{ fill: color }} transition={{ duration: 0.6 }} />
        <motion.path d="M 20 140 Q 30 160 40 140" animate={{ fill: color }} transition={{ duration: 0.6 }} />

        {/* Tentacles Front layer (Wrapped around if hugged) */}
        {isHugged && (
           <motion.path 
             initial={{ opacity: 0, pathLength: 0 }}
             animate={{ opacity: 1, pathLength: 1 }}
             d="M 30 120 Q 100 160 170 120"
             fill="none"
             stroke={color}
             strokeWidth="20"
             strokeLinecap="round"
             className="drop-shadow-lg"
           />
        )}

        {/* Main Body (Head) */}
        <motion.path 
          d="M 30 140 C 30 50, 170 50, 170 140 Z" 
          animate={{ fill: color }} 
          transition={{ duration: 0.6 }} 
        />
        
        {/* Inner shadow/highlight for 3D Plush effect */}
        <path d="M 45 120 C 45 65, 155 65, 155 120" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.15" />
        <path d="M 55 100 C 55 75, 145 75, 145 100" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.1" />

        {/* Dynamic Expression */}
        <motion.g
          key={mood}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {getExpression()}
        </motion.g>
      </motion.g>
    </motion.svg>
  );
}
