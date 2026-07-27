import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Sparkles, Smile, MessageSquare, Coffee, Music, CloudRain, 
  CloudSnow, Sun, Moon, Volume2, VolumeX, Mail, Gift, Flame, Compass,
  ChevronLeft, ChevronRight, RefreshCw, Feather, Droplet, Cloud, Award, 
  HeartHandshake, Eye, Star, CheckSquare, Send, ThumbsUp, Sparkle, User, HelpCircle, Play, Pause
} from 'lucide-react';
import { COMFORT_MESSAGES } from '../data/comfortMessages';
import { supabaseService } from '../lib/supabase';

// Web Audio API feedback sounds
const playSynthTone = (freq: number, type: OscillatorType = 'sine', duration = 0.5, volume = 0.1) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Smooth release
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.log(e);
  }
};

const triggerSuccessChime = () => {
  playSynthTone(523.25, 'sine', 0.15, 0.08); // C5
  setTimeout(() => playSynthTone(659.25, 'sine', 0.15, 0.08), 80); // E5
  setTimeout(() => playSynthTone(783.99, 'sine', 0.25, 0.08), 160); // G5
  setTimeout(() => playSynthTone(1046.50, 'sine', 0.4, 0.1), 240); // C6
};

// ─── 1. VIRTUAL LOVE EXPERIENCE ───
export function VirtualLoveExperience({ onTriggerConfetti }: { onTriggerConfetti?: () => void }) {
  const [activeExperience, setActiveExperience] = useState<string | null>(null);
  const [glowActive, setGlowActive] = useState(false);
  const [letterMsg, setLetterMsg] = useState("");

  const handleTrigger = (id: string) => {
    setActiveExperience(id);
    playSynthTone(id === 'hug' ? 329.63 : 523.25, 'sine', 0.4, 0.1);
    
    const exp = experiences.find(e => e.id === id);
    if (exp) {
      supabaseService.activityLogs.log('virtual_experience', `User triggered virtual experience: ${exp.title}`);
    }

    if (onTriggerConfetti && ['hug', 'kiss', 'flower', 'teddy'].includes(id)) {
      onTriggerConfetti();
    }

    if (id === 'hug') {
      setGlowActive(true);
      setTimeout(() => setGlowActive(false), 2500);
      if (navigator.vibrate) {
        try { navigator.vibrate([100, 50, 100]); } catch (e) {}
      }
    }

    if (id === 'letter') {
      const rand = COMFORT_MESSAGES[Math.floor(Math.random() * COMFORT_MESSAGES.length)];
      setLetterMsg(rand);
    }
  };

  const experiences = [
    { id: 'hug', title: '🫂 Virtual Hug', emoji: '🫂', desc: 'Hold me tightly from across the miles.', color: 'from-pink-500/20 to-purple-500/20 border-pink-500/30' },
    { id: 'kiss', title: '💋 Forehead Kiss', emoji: '💋', desc: 'A soft, comforting blessing for my queen.', color: 'from-rose-500/20 to-red-500/20 border-rose-500/30' },
    { id: 'hand', title: '❤️ Hold My Hand', emoji: '🤝', desc: 'Two hands slowly joining in warmth.', color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30' },
    { id: 'teddy', title: '🧸 Teddy Delivery', emoji: '🧸', desc: 'Cute virtual teddy barrelling onto your screen.', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30' },
    { id: 'chocolate', title: '🍫 Chocolate Delivery', emoji: '🍫', desc: 'Opening a rich chocolate treat to boost mood.', color: 'from-yellow-600/20 to-amber-700/20 border-amber-600/30' },
    { id: 'flower', title: '🌹 Flower Delivery', emoji: '🌹', desc: 'A bursting flower shower with soft wind.', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30' },
    { id: 'hchoco', title: '☕ Hot Chocolate', emoji: '☕', desc: 'Warm cup filling with marshmallows.', color: 'from-orange-500/20 to-red-600/20 border-orange-500/30' },
    { id: 'tea', title: '🍵 Warm Tea', emoji: '🍵', desc: 'Delicate chamomile steeping in warm water.', color: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30' },
    { id: 'letter', title: '💌 Love Letter', emoji: '💌', desc: 'An intimate, deep written note from Ruu.', color: 'from-blue-500/20 to-purple-600/20 border-blue-500/30' },
  ];

  return (
    <div className="space-y-6 relative">
      {/* soft screen glow for hugs */}
      <AnimatePresence>
        {glowActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-pink-500/10 backdrop-blur-sm pointer-events-none z-40 transition-all"
          />
        )}
      </AnimatePresence>

      <div className="text-center space-y-1">
        <span className="inline-block px-3 py-1 bg-pink-500/10 text-pink-300 border border-pink-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
          💖 Interactive Comfort Suite
        </span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          "Even From Miles Away, My Love Can Reach You."
        </h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Tap anything below whenever you need comfort.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {experiences.map((exp) => (
          <motion.div
            key={exp.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTrigger(exp.id)}
            className={`p-5 rounded-3xl bg-gradient-to-br ${exp.color} border backdrop-blur-xl shadow-lg cursor-pointer transition-all flex flex-col justify-between h-[140px] text-left group relative overflow-hidden`}
          >
            <div className="absolute top-2 right-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
              ✨
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none group-hover:animate-bounce">{exp.emoji}</span>
              <div>
                <h4 className="font-serif text-sm font-bold text-white tracking-wide">{exp.title}</h4>
                <p className="text-[10px] text-zinc-300/80 leading-relaxed mt-1">{exp.desc}</p>
              </div>
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-pink-300/60 group-hover:text-pink-300 mt-2 flex items-center gap-1">
              Tap to Experience 🌸
            </span>
          </motion.div>
        ))}
      </div>

      {/* Floating Animated Overlay Popup for active experience */}
      <AnimatePresence>
        {activeExperience && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1a0f2e] border border-pink-500/30 rounded-[32px] p-6 md:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400" />
              
              {/* Animation Stage */}
              <div className="h-40 flex items-center justify-center relative overflow-hidden bg-slate-950/40 rounded-2xl border border-pink-500/10">
                {activeExperience === 'hug' && (
                  <div className="relative flex flex-col items-center justify-center space-y-2">
                    <motion.div 
                      animate={{ scale: [1, 1.15, 1] }} 
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-6xl"
                    >
                      🫂
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0, y: 0 }}
                          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], y: -50, x: (i - 4) * 15 }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
                          className="absolute text-pink-500 text-lg"
                        >
                          ❤️
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {activeExperience === 'kiss' && (
                  <div className="relative flex flex-col items-center justify-center">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }} 
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="text-6xl"
                    >
                      💋
                    </motion.div>
                    <motion.div 
                      animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.3, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute text-yellow-300 text-4xl font-serif"
                    >
                      ✨
                    </motion.div>
                  </div>
                )}

                {activeExperience === 'hand' && (
                  <div className="flex items-center gap-6 justify-center relative">
                    <motion.div
                      animate={{ x: [ -30, 0, -30 ] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="text-5xl"
                    >
                      🫱
                    </motion.div>
                    <motion.div
                      animate={{ x: [ 30, 0, 30 ] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="text-5xl"
                    >
                      🫲
                    </motion.div>
                    <motion.div
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="absolute text-rose-500 text-3xl"
                    >
                      💖
                    </motion.div>
                  </div>
                )}

                {activeExperience === 'teddy' && (
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        x: [-100, 0, 0, 0], 
                        y: [0, -10, 0, -10, 0], 
                        scale: [0.5, 1, 1.1, 1] 
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-6xl"
                    >
                      🧸👋
                    </motion.div>
                  </div>
                )}

                {activeExperience === 'chocolate' && (
                  <div className="relative flex flex-col items-center">
                    <motion.div
                      animate={{ rotate: [0, 360], scale: [0.9, 1.1, 0.9] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="text-6xl"
                    >
                      🍫
                    </motion.div>
                    <span className="text-[11px] text-pink-300 font-bold mt-2">Unwrapping sweetness...</span>
                  </div>
                )}

                {activeExperience === 'flower' && (
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl"
                    >
                      🌹
                    </motion.div>
                    <div className="absolute inset-0 pointer-events-none">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0.2, rotate: 0 }}
                          animate={{ 
                            opacity: [0, 1, 0], 
                            scale: [0.2, 1, 0.5], 
                            x: Math.sin(i) * 60, 
                            y: Math.cos(i) * 60,
                            rotate: 360 
                          }}
                          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.1 }}
                          className="absolute text-pink-300 text-sm"
                        >
                          🌸
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {activeExperience === 'hchoco' && (
                  <div className="relative flex flex-col items-center">
                    <motion.div
                      animate={{ y: [2, -2, 2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl"
                    >
                      ☕
                    </motion.div>
                    {/* Steam rising */}
                    <div className="absolute top-6 flex gap-1">
                      {['💨', '💨', '💨'].map((st, i) => (
                        <motion.span
                          key={i}
                          initial={{ y: 5, opacity: 0 }}
                          animate={{ y: -30, opacity: [0, 0.6, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }}
                          className="text-xs"
                        >
                          ~
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {activeExperience === 'tea' && (
                  <div className="relative flex flex-col items-center">
                    <motion.div
                      animate={{ rotate: [0, -15, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-6xl"
                    >
                      🍵
                    </motion.div>
                    <div className="absolute top-2 right-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5], y: -25 }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                          className="absolute text-[10px]"
                        >
                          🌿
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {activeExperience === 'letter' && (
                  <div className="relative p-3 w-full text-center">
                    <motion.div
                      initial={{ scale: 0.8, rotate: -5 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-5xl mb-2"
                    >
                      💌
                    </motion.div>
                    <p className="text-[11px] text-pink-100 font-serif italic max-h-[80px] overflow-y-auto line-clamp-3">
                      "{letterMsg}"
                    </p>
                  </div>
                )}
              </div>

              {/* Messages details */}
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-pink-400">
                  {activeExperience === 'hug' && "Endless Hug Transferred! 🫂"}
                  {activeExperience === 'kiss' && "Forehead Kiss Delivered! 💋"}
                  {activeExperience === 'hand' && "Holding Your Beautiful Hand! ❤️"}
                  {activeExperience === 'teddy' && "Teddy Bear is Squishing You! 🧸"}
                  {activeExperience === 'chocolate' && "Your Sweet Chocolate Bar! 🍫"}
                  {activeExperience === 'flower' && "Fairy Flower Petals Falling! 🌹"}
                  {activeExperience === 'hchoco' && "Marshmallow Hot Chocolate Cozy! ☕"}
                  {activeExperience === 'tea' && "Your Soothing Herbal Tea! 🍵"}
                  {activeExperience === 'letter' && "Handwritten Love Letter Opened! 💌"}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {activeExperience === 'hug' && "Inhale deeply. Picture my chin resting on your head, my hands rubbing your back, and my warm embrace squeezing you close. You are safe."}
                  {activeExperience === 'kiss' && "Mwah! A tender, soft forehead kiss dedicated to soothe your headache, relieve your anxiety, and make you feel treasured."}
                  {activeExperience === 'hand' && "Fingers interlaced, palm against palm. I am with you through every single spasm. Close your eyes and feel the gentle pulse of my hand holding yours."}
                  {activeExperience === 'teddy' && "My special cuddly teddy companion has landed with a soft bounce! He waves, hugs, and is ready to keep you comfy under the blanket."}
                  {activeExperience === 'chocolate' && "Rich luxury dark chocolate melting on your tongue, triggering endorphins to heal cramps and bring a sweet smile."}
                  {activeExperience === 'flower' && "A beautiful collection of fresh, fragrant blossoms raining around you, filling your workspace with cherry blooms and love."}
                  {activeExperience === 'hchoco' && "Creamy cocoa with baby marshmallows. Sip it slowly in your mind and let the warm, sweet comfort relax your stomach."}
                  {activeExperience === 'tea' && "Relaxing herbal tea that acts as an organic muscle relaxer. Take a quiet, cozy sip for me."}
                  {activeExperience === 'letter' && `"${letterMsg}"`}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveExperience(null);
                    playSynthTone(400, 'sine', 0.1);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-450 hover:from-pink-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg"
                >
                  Comfort Received 💖
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// ─── 2. TEDDY COLLECTION CAROUSEL ───
export function TeddyCollection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationType, setAnimationType] = useState<'wave' | 'jump' | 'hug' | null>(null);

  const teddies = [
    { id: 'pink', name: 'Pink Teddy 🌸', emoji: '🧸🌸', desc: 'Fluffy soft pastel pink teddy that specializes in warm belly cuddles.', message: 'Hie my princess! Main pink teddy hnn, and main aapko tight hug dene aaya hnn! ❤️' },
    { id: 'white', name: 'White Teddy ☁️', emoji: '🧸☁️', desc: 'Lightweight white teddy as soft as clouds.', message: 'Sshh... close your eyes, baby. I am cuddling you tightly so you can drift to sleep.' },
    { id: 'brown', name: 'Brown Teddy 🍫', emoji: '🧸🤎', desc: 'Classic chocolate brown teddy full of wisdom and hugs.', message: 'I will hold your heating pad for you and protect you from any bad pain! 🥊' },
    { id: 'heart', name: 'Heart Teddy ❤️', emoji: '🧸💖', desc: 'Holding a huge sparkling crimson heart.', message: 'This heart is packed with 1,000,000% of Ruu\'s pure endless love for you!' },
    { id: 'doctor', name: 'Doctor Teddy 🩺', emoji: '🧸🩺', desc: 'Wearing a tiny stethoscope to heal cramps.', message: 'Sanctuary check! Cramp level is too high, administering a massive wave of forehead kisses! 💋' },
    { id: 'angel', name: 'Angel Teddy 👼', emoji: '🧸✨', desc: 'Has sparkling wings to guard your sweet dreams.', message: 'Flapping my soft wings to send a sweet, pain-relieving magical breeze to you.' },
    { id: 'panda', name: 'Panda Teddy 🐼', emoji: '🐼🖤', desc: 'Sleepy panda plushie that loves rolling around.', message: 'Let\'s roll into a blanket burrito together and eat chocolates! 🍫' },
    { id: 'sleepy', name: 'Sleepy Teddy 💤', emoji: '🧸🛌', desc: 'Always wearing a sleep cap and holding a pillow.', message: 'Yaaawn... it\'s cozy nap time, sweetie. Lay down and let\'s sleep together.' },
    { id: 'bunny', name: 'Bunny Plush 🐰', emoji: '🐰💝', desc: 'Cute floppy-eared white bunny with extra long arms.', message: 'My long bunny ears are here to listen to whatever you want to share, baby!' },
  ];

  const handleAction = (type: 'wave' | 'jump' | 'hug') => {
    setAnimationType(type);
    
    supabaseService.activityLogs.log('teddy_interaction', `User interacted with teddy: ${type} on ${teddies[currentIndex].name}`);

    // Play specific melody for each action
    if (type === 'wave') {
      playSynthTone(587.33, 'sine', 0.15, 0.08);
      setTimeout(() => playSynthTone(698.46, 'sine', 0.15, 0.08), 80);
    } else if (type === 'jump') {
      playSynthTone(523.25, 'triangle', 0.15, 0.1);
      setTimeout(() => playSynthTone(659.25, 'triangle', 0.15, 0.1), 100);
      setTimeout(() => playSynthTone(783.99, 'triangle', 0.25, 0.1), 200);
    } else {
      triggerSuccessChime();
    }

    setTimeout(() => setAnimationType(null), 2000);
  };

  const nextTeddy = () => {
    setCurrentIndex((prev) => (prev + 1) % teddies.length);
    playSynthTone(440, 'sine', 0.1);
  };

  const prevTeddy = () => {
    setCurrentIndex((prev) => (prev - 1 + teddies.length) % teddies.length);
    playSynthTone(392, 'sine', 0.1);
  };

  const activeTeddy = teddies[currentIndex];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🧸</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🧸 Teddy Comfort Collection
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Meet your sweet guardian plushies. Click their actions to see them play!
        </p>
      </div>

      <div className="relative max-w-lg mx-auto bg-slate-950/40 border border-pink-500/15 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Navigation arrows */}
        <button 
          onClick={prevTeddy}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900 border border-pink-500/20 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all text-pink-300 z-10"
        >
          <ChevronLeft size={16} />
        </button>
        <button 
          onClick={nextTeddy}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900 border border-pink-500/20 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all text-pink-300 z-10"
        >
          <ChevronRight size={16} />
        </button>

        {/* Teddy Display Stage */}
        <div className="h-64 flex flex-col items-center justify-center relative select-none">
          {/* Animated Teddy Wrapper */}
          <motion.div
            key={activeTeddy.id}
            animate={
              animationType === 'wave' 
                ? { rotate: [0, -10, 10, -10, 10, 0], scale: 1 }
                : animationType === 'jump'
                ? { y: [0, -40, 0, -25, 0], scale: [1, 1.05, 0.95, 1.02, 1] }
                : animationType === 'hug'
                ? { scale: [1, 1.25, 1], rotate: [0, 5, -5, 0] }
                : { y: [0, -4, 0] }
            }
            transition={
              animationType 
                ? { duration: 1.5 } 
                : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }
            className="text-8xl drop-shadow-[0_10px_15px_rgba(244,63,94,0.15)] select-none filter contrast-125"
          >
            {activeTeddy.emoji}
          </motion.div>

          {/* Sparkles on action */}
          {animationType && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], x: Math.sin(i) * 50, y: Math.cos(i) * 50 }}
                  transition={{ duration: 1 }}
                  className="absolute text-yellow-300 text-lg"
                >
                  ✨
                </motion.span>
              ))}
            </div>
          )}

          {/* Speech Bubble */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTeddy.id + '-' + (animationType || 'idle')}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="mt-6 text-center max-w-xs bg-slate-900/90 border border-pink-500/20 rounded-2xl px-4 py-2.5 shadow-md relative"
            >
              <p className="text-[11px] font-medium text-pink-200 italic leading-relaxed">
                {animationType === 'wave' && "👋 Hello, my princess! I wave to you!"}
                {animationType === 'jump' && "✨ Wheee! Jamping with joy for you!"}
                {animationType === 'hug' && "🫂 SQUISH! Giving you the absolute tightest cuddle!"}
                {!animationType && activeTeddy.message}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Teddy Metadata */}
        <div className="text-center space-y-1 mt-2">
          <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">{activeTeddy.name}</h4>
          <p className="text-[10px] text-zinc-400 max-w-xs mx-auto leading-relaxed">{activeTeddy.desc}</p>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <button
            onClick={() => handleAction('wave')}
            className="py-2.5 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 rounded-xl text-[10px] font-extrabold uppercase tracking-widest text-pink-300 cursor-pointer transition-all active:scale-95"
          >
            👋 Wave
          </button>
          <button
            onClick={() => handleAction('jump')}
            className="py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl text-[10px] font-extrabold uppercase tracking-widest text-purple-300 cursor-pointer transition-all active:scale-95"
          >
            🚀 Jump
          </button>
          <button
            onClick={() => handleAction('hug')}
            className="py-2.5 bg-gradient-to-r from-pink-500 to-rose-450 hover:from-pink-600 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest cursor-pointer transition-all active:scale-95 shadow-md"
          >
            🫂 Hug
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── 3. CHOCOLATE COLLECTION ───
export function ChocolateCollection({ onTriggerConfetti }: { onTriggerConfetti?: () => void }) {
  const [unwrappingId, setUnwrappingId] = useState<string | null>(null);
  const [unwrappedList, setUnwrappedList] = useState<string[]>([]);

  const chocolates = [
    { id: 'heart', name: 'Heart Chocolate', emoji: '💝', desc: 'Silky red ruby chocolate filled with sweet raspberry syrup.', message: 'Sweet raspberry heart melts away, healing your cozy cramps instantly! 🍓' },
    { id: 'ferrero', name: 'Ferrero Rocher', emoji: '🌰', desc: 'Premium hazelnut truffle covered in milk chocolate and crisp wafers.', message: 'Crispy wafer and creamy praline burst! You deserve this luxurious treat, baby. ✨' },
    { id: 'dairymilk', name: 'Dairy Milk', emoji: '🍫', desc: 'Classic smooth, creamy rich milk chocolate block.', message: 'Sweet milky goodness. Imagine me breaking a piece and feeding it to you. 🥄' },
    { id: 'kitkat', name: 'KitKat Break', emoji: '🧇', desc: 'Crispy chocolate-coated wafer bars to take a lovely break.', message: 'Have a break, have a sweet hug! Enjoy the crispy crunch of love. ❤️' },
    { id: 'dark', name: 'Dark Chocolate', emoji: '🧁', desc: '75% pure rich dark cocoa, loaded with cramp-soothing magnesium.', message: 'Magnesium-loaded dark cocoa relaxes your uterus muscles beautifully. Eat up!' },
    { id: 'cookie', name: 'Warm Chocolate Cookie', emoji: '🍪', desc: 'Freshly baked cookie with gooey, melting chocolate chips.', message: 'Soft, warm cookie direct from Ruu\'s virtual oven. It smells like vanilla heaven! 🍪' },
    { id: 'cupcake', name: 'Strawberry Cupcake', emoji: '🧁', desc: 'Soft pink cake topped with sweet cream cheese and a cherry.', message: 'Fluffy strawberry cloud! Eat it to trigger happy little serotonin waves. 🌸' },
    { id: 'cake', name: 'Choco Lava Cake', emoji: '🍰', desc: 'A rich chocolate sponge cake with a warm flowing fudge center.', message: 'Warm fudge lava flows over your heart, soothing any painful cramps today! 🌋' },
  ];

  const handleUnwrap = (id: string) => {
    if (unwrappedList.includes(id)) return;
    setUnwrappingId(id);
    playSynthTone(349.23, 'triangle', 0.2, 0.1); // F4
    setTimeout(() => {
      playSynthTone(523.25, 'sine', 0.3, 0.1); // C5
      setUnwrappedList(prev => [...prev, id]);
      setUnwrappingId(null);
      if (onTriggerConfetti) onTriggerConfetti();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🍫</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🍫 Premium Chocolate Patisserie
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Hover to see them glow, tap to unwrap your sweet calorie-free dopamine treats!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {chocolates.map((item) => {
          const isUnwrapped = unwrappedList.includes(item.id);
          const isUnwrapping = unwrappingId === item.id;

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.03 }}
              className="relative p-5 rounded-3xl bg-slate-950/40 border border-pink-500/10 hover:border-pink-500/30 shadow-xl overflow-hidden flex flex-col items-center justify-between text-center min-h-[175px] group cursor-pointer"
              onClick={() => handleUnwrap(item.id)}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-radial-gradient from-pink-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Chocolate Stage */}
              <div className="h-20 flex items-center justify-center relative">
                <AnimatePresence mode="wait">
                  {isUnwrapping ? (
                    <motion.div
                      key="wrapping"
                      animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.2 }}
                      className="text-4xl"
                    >
                      🎁✨
                    </motion.div>
                  ) : isUnwrapped ? (
                    <motion.div
                      key="unwrapped"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-5xl"
                    >
                      {item.emoji}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="wrapped"
                      className="text-4xl filter grayscale group-hover:grayscale-0 transition-all flex flex-col items-center"
                    >
                      <span className="opacity-90">🍬</span>
                      <span className="text-[8px] tracking-widest font-bold uppercase text-pink-400 mt-1">Wrapped</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Name / Message */}
              <div className="space-y-1 relative z-10">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.name}</h4>
                <p className="text-[9px] text-zinc-400 leading-relaxed min-h-[24px] flex items-center justify-center px-1">
                  {isUnwrapped ? item.message : item.desc}
                </p>
              </div>

              {/* Unwrap helper badge */}
              <div className="mt-2.5">
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                  isUnwrapped 
                    ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' 
                    : isUnwrapping 
                    ? 'text-pink-300 border-pink-500/20 bg-pink-500/10 animate-pulse'
                    : 'text-pink-400 border-pink-500/20 bg-pink-500/5'
                }`}>
                  {isUnwrapped ? '❤️ Unwrapped' : isUnwrapping ? 'Opening...' : '🍬 Tap to Open'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}


// ─── 4. INTERACTIVE FLOWER GARDEN ───
export function FlowerGarden() {
  const [petals, setPetals] = useState<any[]>([]);

  const flowers = [
    { id: 'rose', name: 'Crimson Rose 🌹', emoji: '🌹', color: 'text-red-500', petalSymbol: '🌹', desc: 'Symbol of Ruu\'s deep, burning adoration for you.' },
    { id: 'tulip', name: 'Pink Tulip 🌷', emoji: '🌷', color: 'text-pink-400', petalSymbol: '🌷', desc: 'Symbolizes care, absolute comfort, and happiness.' },
    { id: 'sunflower', name: 'Sunny Sunflower 🌻', emoji: '🌻', color: 'text-yellow-400', petalSymbol: '🌻', desc: 'Radiates positivity and warm healing energy.' },
    { id: 'cherry', name: 'Cherry Blossom 🌸', emoji: '🌸', color: 'text-rose-300', petalSymbol: '🌸', desc: 'Graceful falling petals to soothe tired minds.' },
    { id: 'lavender', name: 'Calming Lavender 🌾', emoji: '🪻', color: 'text-purple-400', petalSymbol: '🪻', desc: 'Calms your nervous system and promotes deep sleep.' },
    { id: 'mixed', name: 'Mixed Bouquet 💐', emoji: '💐', color: 'text-amber-300', petalSymbol: '💝', desc: 'A comprehensive bunch of endless virtual healing care.' },
  ];

  const handleTouchFlower = (symbol: string, e: React.MouseEvent<HTMLDivElement>) => {
    playSynthTone(587.33 + Math.random() * 200, 'sine', 0.25, 0.08);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const newPetals = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      x: x,
      y: y,
      symbol: symbol,
      speedX: (Math.random() - 0.5) * 6,
      speedY: (Math.random() - 0.5) * 6 - 3,
      rotate: Math.random() * 360,
      opacity: 1
    }));

    setPetals(prev => [...prev, ...newPetals]);
  };

  // Animate petals falling down and fade
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden) return;
      setPetals(prev => {
        if (prev.length === 0) return prev;
        return prev
          .map(p => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY + 2.5, // gravity
            speedY: p.speedY + 0.1,
            rotate: p.rotate + 4,
            opacity: p.opacity - 0.015
          }))
          .filter(p => p.opacity > 0);
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 relative">
      <div className="text-center space-y-1">
        <span className="text-2xl">🌹</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🌹 Interactive Healing Flower Garden
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Hover and tap flowers to explode sweet falling petals across your screen.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {flowers.map((fl) => (
          <div
            key={fl.id}
            onClick={(e) => handleTouchFlower(fl.petalSymbol, e)}
            className="p-4 rounded-2xl bg-slate-950/40 border border-pink-500/10 hover:border-pink-500/30 hover:scale-105 active:scale-95 cursor-pointer transition-all flex flex-col items-center justify-between text-center h-44 group relative overflow-hidden"
          >
            <span className="text-5xl group-hover:scale-110 group-hover:rotate-6 transition-all select-none">{fl.emoji}</span>
            <div className="space-y-0.5 relative z-10">
              <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{fl.name}</h4>
              <p className="text-[9px] text-zinc-400 leading-normal line-clamp-2 px-1">{fl.desc}</p>
            </div>
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-pink-300/40 group-hover:text-pink-300/80">
              Tap to Touch 🌸
            </span>
          </div>
        ))}
      </div>

      {/* Falling petal elements */}
      {petals.map((p) => (
        <span
          key={p.id}
          className="fixed pointer-events-none select-none z-50 text-lg"
          style={{
            left: p.x,
            top: p.y,
            transform: `rotate(${p.rotate}deg)`,
            opacity: p.opacity
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}


// ─── 5. LOVE LETTER LIBRARY ───
export function LoveLetterLibrary() {
  const [activeMsgIdx, setActiveMsgIdx] = useState(0);

  const rotateMessage = () => {
    setActiveMsgIdx((prev) => (prev + 1) % COMFORT_MESSAGES.length);
    playSynthTone(523.25, 'sine', 0.15, 0.05);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMsgIdx((prev) => (prev + 1) % COMFORT_MESSAGES.length);
    }, 15000); // automatic rotation every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">💌</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          💌 Love Letter Library (150+ Comforts)
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Delicate handwritten care notes that rotate automatically. Click below to shuffle.
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-gradient-to-br from-pink-900/10 via-slate-900/30 to-[#120a1c] border border-pink-500/20 rounded-[32px] p-6 shadow-2xl relative overflow-hidden text-left min-h-[190px] flex flex-col justify-between">
        {/* vintage paper lines background style */}
        <div className="absolute inset-0 bg-linear-gradient(rgba(244,63,94,0.02)_1px,transparent_1px) bg-[length:100%_24px] pointer-events-none" />
        <div className="absolute top-2 right-4 text-3xl opacity-10 select-none">🌸</div>
        <div className="absolute bottom-2 left-4 text-4xl opacity-10 select-none font-serif">✉️</div>

        <div className="space-y-3 relative z-10">
          <span className="text-[9px] uppercase font-bold tracking-widest text-pink-300 bg-pink-500/15 px-2.5 py-0.5 rounded-full inline-block border border-pink-500/20">
            Comfort Letter #{activeMsgIdx + 1}
          </span>
          <p className="font-handwritten text-xl md:text-2xl text-pink-100 leading-relaxed pr-6">
            "{COMFORT_MESSAGES[activeMsgIdx]}"
          </p>
        </div>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/5 relative z-10">
          <span className="font-handwritten text-xl text-pink-400 font-bold">— Love, Ruu 🧸</span>
          <button
            onClick={rotateMessage}
            className="px-3.5 py-2 border border-pink-500/25 hover:bg-pink-500/10 text-pink-300 rounded-xl text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <RefreshCw size={11} /> Next Letter
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── 6. MINI COMFORT GAMES ───
export function MiniComfortGames({ onTriggerConfetti }: { onTriggerConfetti?: () => void }) {
  const [activeGame, setActiveGame] = useState<number | null>(null);

  // GAME 1: Catch Hearts states
  const [score, setScore] = useState(0);
  const [game1Active, setGame1Active] = useState(false);
  const [fallingItems, setFallingItems] = useState<any[]>([]);

  // GAME 2: Feed Teddy states
  const [teddyChewCount, setTeddyChewCount] = useState(0);
  const [teddyMood, setTeddyMood] = useState<'hungry' | 'chewing' | 'happy'>('hungry');

  // GAME 3: Bloom Garden states
  const [bloomedFlowers, setBloomedFlowers] = useState<number[]>([]);
  const [butterflies, setButterflies] = useState<any[]>([]);

  // GAME 4: Light The Sky states
  const [litStars, setLitStars] = useState<number[]>([]);
  const [skyMagical, setSkyMagical] = useState(false);

  // GAME 5: Match Chocolates states
  const [cards, setCards] = useState<any[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  const gamesList = [
    { id: 1, title: '❤️ Catch Hearts', emoji: '❤️', desc: 'Collect red flying hearts. Avoid rainy storm clouds.', reward: 'Virtual Hug 🫂' },
    { id: 2, title: '🧸 Feed Teddy', emoji: '🧸', desc: 'Feed chocolates to make Teddy Bear giggle and smile.', reward: 'Unlock Happy Animation ✨' },
    { id: 3, title: '🌸 Bloom Garden', emoji: '🌸', desc: 'Tap sleeping flowers to release flying butterflies.', reward: 'Special Comfort Note 💌' },
    { id: 4, title: '⭐ Light The Sky', emoji: '⭐', desc: 'Tap twinkling sky stars to clear the dark storm clouds.', reward: 'Virtual Forehead Kiss 💋' },
    { id: 5, title: '🍫 Match Chocolates', emoji: '🍫', desc: 'Simple memory card matching challenge.', reward: 'Unlock Premium Surprise Gift 🎁' },
  ];

  const selectGame = (id: number) => {
    setActiveGame(id);
    playSynthTone(440, 'sine', 0.15);
    
    const game = gamesList.find(g => g.id === id);
    if (game) {
      supabaseService.activityLogs.log('started_game', `User started playing: ${game.title}`);
    }

    // Initializers
    if (id === 1) {
      setScore(0);
      setGame1Active(true);
      setFallingItems(Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        x: Math.random() * 90,
        y: -10 - i * 25,
        isCloud: Math.random() > 0.7,
        speed: Math.random() * 1.5 + 1.2
      })));
    } else if (id === 2) {
      setTeddyChewCount(0);
      setTeddyMood('hungry');
    } else if (id === 3) {
      setBloomedFlowers([]);
      setButterflies([]);
    } else if (id === 4) {
      setLitStars([]);
      setSkyMagical(false);
    } else if (id === 5) {
      const symbols = ['🍫', '🍪', '🍩', '🧁', '🍫', '🍪', '🍩', '🧁'];
      // shuffle
      const shuffled = symbols
        .map((s, idx) => ({ id: idx, symbol: s, matchId: s, isFlipped: false }))
        .sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setFlippedIndices([]);
      setMatchedIds([]);
    }
  };

  // Game 1 Loop
  useEffect(() => {
    if (activeGame !== 1 || !game1Active) return;
    const interval = setInterval(() => {
      if (document.hidden) return;
      setFallingItems(prev => {
        return prev.map(item => {
          let nextY = item.y + item.speed;
          if (nextY > 100) {
            return {
              ...item,
              x: Math.random() * 90,
              y: -5,
              isCloud: Math.random() > 0.7,
              speed: Math.random() * 1.5 + 1.2
            };
          }
          return { ...item, y: nextY };
        });
      });
    }, 40);
    return () => clearInterval(interval);
  }, [activeGame, game1Active]);

  const handleCatchItem = (item: any) => {
    if (item.isCloud) {
      playSynthTone(180, 'sawtooth', 0.3);
      setScore(prev => Math.max(0, prev - 2));
    } else {
      playSynthTone(523.25 + score * 20, 'sine', 0.15);
      setScore(prev => {
        const next = prev + 1;
        if (next >= 10) {
          setGame1Active(false);
          triggerSuccessChime();
          if (onTriggerConfetti) onTriggerConfetti();
        }
        return next;
      });
    }
    // reset caught item
    setFallingItems(prev => prev.map(p => p.id === item.id ? { ...p, y: -5, x: Math.random() * 90, isCloud: Math.random() > 0.7 } : p));
  };

  // Game 2 Actions
  const handleFeedTeddy = () => {
    if (teddyMood === 'chewing') return;
    setTeddyMood('chewing');
    playSynthTone(400, 'triangle', 0.15);
    setTimeout(() => {
      setTeddyChewCount(prev => {
        const next = prev + 1;
        if (next >= 5) {
          setTeddyMood('happy');
          triggerSuccessChime();
          if (onTriggerConfetti) onTriggerConfetti();
        } else {
          setTeddyMood('hungry');
        }
        return next;
      });
    }, 800);
  };

  // Game 3 Actions
  const handleTapBloomFlower = (idx: number, e: React.MouseEvent) => {
    if (bloomedFlowers.includes(idx)) return;
    setBloomedFlowers(prev => [...prev, idx]);
    playSynthTone(600 + idx * 50, 'sine', 0.2);

    const rect = e.currentTarget.getBoundingClientRect();
    // add flying butterflies
    const newButterflies = Array.from({ length: 3 }).map((_, i) => ({
      id: Date.now() + i,
      x: e.clientX,
      y: e.clientY,
      targetX: Math.random() * 300 - 150,
      targetY: -150 - Math.random() * 100,
    }));
    setButterflies(prev => [...prev, ...newButterflies]);

    if (bloomedFlowers.length + 1 >= 6) {
      triggerSuccessChime();
      if (onTriggerConfetti) onTriggerConfetti();
    }
  };

  // Game 4 Actions
  const handleTapStar = (idx: number) => {
    if (litStars.includes(idx)) return;
    setLitStars(prev => [...prev, idx]);
    playSynthTone(800 + idx * 40, 'sine', 0.15);

    if (litStars.length + 1 >= 7) {
      setSkyMagical(true);
      triggerSuccessChime();
      if (onTriggerConfetti) onTriggerConfetti();
    }
  };

  // Game 5 Match Cards
  const handleCardClick = (idx: number) => {
    if (flippedIndices.length >= 2 || flippedIndices.includes(idx) || matchedIds.includes(cards[idx].matchId)) return;
    
    playSynthTone(440 + idx * 20, 'sine', 0.1);
    const nextFlipped = [...flippedIndices, idx];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      const firstCard = cards[nextFlipped[0]];
      const secondCard = cards[nextFlipped[1]];

      if (firstCard.matchId === secondCard.matchId) {
        // match
        setTimeout(() => {
          setMatchedIds(prev => {
            const next = [...prev, firstCard.matchId];
            if (next.length === 4) {
              triggerSuccessChime();
              if (onTriggerConfetti) onTriggerConfetti();
            }
            return next;
          });
          setFlippedIndices([]);
          playSynthTone(783.99, 'sine', 0.2, 0.1);
        }, 600);
      } else {
        // fail flip back
        setTimeout(() => {
          setFlippedIndices([]);
          playSynthTone(220, 'sawtooth', 0.2, 0.05);
        }, 1200);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🎮</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🎮 Mini Cozy Comfort Arcade
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Lightweight, hyper-relaxing pocket games with magical interactive rewards.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {activeGame === null ? (
          <motion.div 
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
          >
            {gamesList.map((game) => (
              <div
                key={game.id}
                onClick={() => selectGame(game.id)}
                className="p-5 rounded-3xl bg-slate-950/40 border border-pink-500/10 hover:border-pink-500/30 hover:scale-[1.03] cursor-pointer transition-all flex flex-col justify-between text-left h-48 group relative overflow-hidden"
              >
                <div className="space-y-1">
                  <span className="text-3xl select-none group-hover:scale-110 group-hover:rotate-6 transition-all inline-block">{game.emoji}</span>
                  <h4 className="font-serif text-xs font-bold text-white uppercase tracking-wider">{game.title}</h4>
                  <p className="text-[10px] text-zinc-400 leading-normal">{game.desc}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-white/5">
                  <span className="text-[8px] text-pink-300/80 font-bold uppercase tracking-widest block">🎁 Reward:</span>
                  <span className="text-[9px] text-zinc-300 font-bold block mt-0.5">{game.reward}</span>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-xl mx-auto bg-slate-950/40 border border-pink-500/15 rounded-3xl p-6 relative overflow-hidden"
          >
            {/* Back Button */}
            <button
              onClick={() => {
                setActiveGame(null);
                setGame1Active(false);
                playSynthTone(300, 'sine', 0.1);
              }}
              className="absolute top-3 left-3 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold text-zinc-300 transition-all cursor-pointer border border-white/5"
            >
              ➔ Lobby
            </button>

            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-center mb-6">
              {gamesList.find(g => g.id === activeGame)?.title}
            </h4>

            {/* GAMEPLAY WINDOWS */}
            {activeGame === 1 && (
              <div className="h-64 bg-slate-900/50 rounded-2xl border border-pink-500/10 relative overflow-hidden">
                <div className="absolute top-2 right-3 text-[10px] font-mono font-bold text-pink-300">
                  Hearts Caught: <span className="text-sm text-pink-400 font-extrabold">{score}/10</span>
                </div>

                {!game1Active ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-3 bg-slate-950/90">
                    <span className="text-5xl">🫂❤️🌸</span>
                    <h5 className="font-serif text-sm font-bold text-pink-400 uppercase">You Won a Virtual Hug!</h5>
                    <p className="text-xs text-zinc-300 leading-relaxed max-w-xs">
                      My angel, you have collected enough love hearts! Imagine me wrapping you tightly and kissing your hair.
                    </p>
                    <button
                      onClick={() => selectGame(1)}
                      className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-450 hover:from-pink-600 rounded-xl text-[10px] font-black tracking-widest text-white uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      Replay Catching Hearts
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0">
                    {fallingItems.map((item) => (
                      <motion.div
                        key={item.id}
                        className="absolute text-3xl cursor-pointer select-none filter active:scale-125 transition-transform"
                        style={{ left: `${item.x}%`, top: `${item.y}%` }}
                        onMouseDown={() => handleCatchItem(item)}
                      >
                        {item.isCloud ? '🌧️' : '💖'}
                      </motion.div>
                    ))}
                    <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-zinc-500 font-semibold animate-pulse">
                      Tap the hearts! Avoid the storm clouds!
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeGame === 2 && (
              <div className="h-64 bg-slate-900/50 rounded-2xl border border-pink-500/10 flex flex-col items-center justify-center p-4 relative">
                {/* Teddy graphics */}
                <div className="relative text-7xl select-none h-24 flex items-center justify-center">
                  <motion.span
                    animate={
                      teddyMood === 'chewing' 
                        ? { scale: [1, 1.12, 1], rotate: [0, -5, 5, 0] } 
                        : teddyMood === 'happy'
                        ? { y: [0, -25, 0, -15, 0], scale: [1, 1.05, 0.95, 1.02, 1] }
                        : { y: [0, -2, 0] }
                    }
                    transition={teddyMood === 'chewing' ? { duration: 0.25, repeat: 3 } : { duration: 2, repeat: Infinity }}
                  >
                    🧸
                  </motion.span>
                  
                  {/* Happy text balloons */}
                  {teddyMood === 'happy' && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-6 bg-pink-500 text-white border border-pink-400 font-serif font-black uppercase text-[9px] px-2.5 py-0.5 rounded-full"
                    >
                      💖 He giggles! 💖
                    </motion.div>
                  )}
                </div>

                <div className="text-center space-y-1.5 mt-3">
                  <p className="text-xs text-zinc-300 font-bold leading-relaxed max-w-xs">
                    {teddyMood === 'happy' 
                      ? "Aww, Teddy is extremely full and happy! He wants to dance on your stomach and make you laugh. ✨" 
                      : `Teddy\'s chocolate tummy: ${teddyChewCount}/5 chocolates fed.`}
                  </p>
                  
                  {teddyMood !== 'happy' && (
                    <button
                      onClick={handleFeedTeddy}
                      disabled={teddyMood === 'chewing'}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 rounded-xl text-[10px] font-black tracking-widest text-white uppercase transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      🍫 Feed chocolate
                    </button>
                  )}
                  {teddyMood === 'happy' && (
                    <button
                      onClick={() => selectGame(2)}
                      className="px-5 py-2 border border-pink-500/25 hover:bg-pink-500/10 rounded-xl text-[9px] text-pink-300 font-bold uppercase transition-all active:scale-95 cursor-pointer"
                    >
                      Reset and Feed Again
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeGame === 3 && (
              <div className="h-64 bg-slate-900/50 rounded-2xl border border-pink-500/10 p-4 relative flex flex-col justify-between">
                <div className="text-center text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  Tap all sleeping flower bulbs to bloom them! ({bloomedFlowers.length}/6)
                </div>

                {/* Flowers Garden Grid */}
                <div className="grid grid-cols-3 gap-4 my-auto">
                  {Array.from({ length: 6 }).map((_, idx) => {
                    const isBloomed = bloomedFlowers.includes(idx);
                    return (
                      <div
                        key={idx}
                        onClick={(e) => handleTapBloomFlower(idx, e)}
                        className={`p-3 rounded-xl border text-center cursor-pointer transition-all select-none flex flex-col items-center justify-center h-16 ${
                          isBloomed 
                            ? 'bg-pink-500/10 border-pink-500/30 text-3xl' 
                            : 'bg-white/5 border-white/10 hover:border-pink-500/20 text-xl filter brightness-75'
                        }`}
                      >
                        {isBloomed ? '🌸' : '🌱'}
                      </div>
                    );
                  })}
                </div>

                {/* Flying butterflies */}
                {butterflies.map((b) => (
                  <motion.span
                    key={b.id}
                    initial={{ left: b.x - 200, top: b.y - 200, opacity: 1 }}
                    animate={{ left: b.x - 200 + b.targetX, top: b.y - 200 + b.targetY, opacity: 0 }}
                    transition={{ duration: 1.8 }}
                    className="absolute text-xl pointer-events-none select-none"
                  >
                    🦋
                  </motion.span>
                ))}

                {bloomedFlowers.length >= 6 && (
                  <div className="absolute inset-0 bg-slate-950/90 rounded-2xl border border-pink-500/20 p-4 flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-4xl animate-bounce">💌🦋🌸</span>
                    <h5 className="font-serif text-xs font-bold text-pink-400">Your Garden Reward:</h5>
                    <p className="text-[11px] font-serif text-slate-100 italic">
                      "I hope your day becomes as gorgeous and warm as a field of fresh pink cherry blossoms. Drink some water and breathe, my princess. Ruu is with you always."
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeGame === 4 && (
              <div className="h-64 bg-slate-900/50 rounded-2xl border border-pink-500/10 relative p-4 flex flex-col justify-between">
                <div className="text-center text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  Tap all glowing stars in the night sky! ({litStars.length}/7)
                </div>

                {/* Sky Stage */}
                <div className="relative flex-1">
                  {/* Floating Stars */}
                  {[
                    { id: 0, x: 10, y: 15 },
                    { id: 1, x: 45, y: 22 },
                    { id: 2, x: 80, y: 10 },
                    { id: 3, x: 25, y: 48 },
                    { id: 4, x: 65, y: 44 },
                    { id: 5, x: 15, y: 75 },
                    { id: 6, x: 85, y: 72 },
                  ].map((star) => {
                    const isLit = litStars.includes(star.id);
                    return (
                      <motion.div
                        key={star.id}
                        onClick={() => handleTapStar(star.id)}
                        className={`absolute cursor-pointer select-none font-bold ${
                          isLit ? 'text-yellow-300 text-3xl animate-pulse' : 'text-zinc-600 text-lg hover:text-zinc-400'
                        }`}
                        style={{ left: `${star.x}%`, top: `${star.y}%` }}
                        animate={isLit ? { rotate: 360 } : { scale: [1, 1.15, 1] }}
                        transition={isLit ? { duration: 1 } : { duration: 1.5, repeat: Infinity, delay: star.id * 0.2 }}
                      >
                        ⭐
                      </motion.div>
                    );
                  })}
                </div>

                {skyMagical && (
                  <div className="absolute inset-0 bg-[#0e071c]/95 rounded-2xl border border-pink-500/20 p-4 flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-4xl animate-bounce">💋✨🌌</span>
                    <h5 className="font-serif text-xs font-bold text-yellow-300">Sky Cleared! Virtual Forehead Kiss:</h5>
                    <p className="text-[11px] text-slate-100 leading-relaxed max-w-xs">
                      Mwaahh! A long, tender forehead kiss just for you under the sparkling clear sky. No storms or cramps can touch you now, my queen. 👑🌌
                    </p>
                    <button
                      onClick={() => selectGame(4)}
                      className="px-4 py-1.5 border border-yellow-300/30 rounded-xl text-[9px] text-yellow-200 uppercase font-black transition-all cursor-pointer"
                    >
                      Clear Again
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeGame === 5 && (
              <div className="h-64 bg-slate-900/50 rounded-2xl border border-pink-500/10 p-4 flex flex-col justify-between">
                <div className="text-center text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  Match the delicious chocolate pairs! (Matched: {matchedIds.length}/4)
                </div>

                {/* Grid */}
                <div className="grid grid-cols-4 gap-3 my-auto">
                  {cards.map((card, idx) => {
                    const isFlipped = flippedIndices.includes(idx) || matchedIds.includes(card.matchId);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleCardClick(idx)}
                        className={`aspect-square rounded-xl border flex items-center justify-center text-2xl select-none cursor-pointer transition-all ${
                          isFlipped 
                            ? 'bg-pink-500/10 border-pink-500/30 text-3xl' 
                            : 'bg-white/5 border-white/10 hover:border-pink-500/20 text-zinc-600 font-serif font-black'
                        }`}
                      >
                        {isFlipped ? card.symbol : '?'}
                      </div>
                    );
                  })}
                </div>

                {matchedIds.length >= 4 && (
                  <div className="absolute inset-0 bg-slate-950/95 rounded-2xl border border-pink-500/20 p-4 flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-4xl animate-bounce">🎁🍫✨</span>
                    <h5 className="font-serif text-xs font-bold text-pink-400">Surprise Locked Box Opened!</h5>
                    <p className="text-[11px] text-slate-100 max-w-xs leading-relaxed">
                      Yay! You matched all chocolates perfectly, baby. You receive a virtual delivery of: **1 Warm Hug, 2 sweet Ferrero Rocher, 1 Warm Tea, and a beautiful rose!** 🌹🍵
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// ─── 7. MOOD BOOSTER SECTION ───
export function MoodBooster() {
  const [selectedMood, setSelectedMood] = useState<string>('cramps');

  const moods = [
    { id: 'happy', title: 'Happy 😊', bg: 'from-amber-950/30 via-yellow-950/30 to-[#120a1c]', border: 'border-yellow-500/20', text: 'yellow-300', music: 'Lofi Beats / Warm Fireplace 🎹', desc: 'Savoring your beautiful happy smile! I hope it remains forever shining bright.' },
    { id: 'emotional', title: 'Emotional 🥺', bg: 'from-pink-950/30 via-indigo-950/30 to-[#120a1c]', border: 'border-pink-500/20', text: 'pink-300', music: 'Soothing Relaxing Piano 🎹', desc: 'Let it out, my angel. It is completely okay to cry and feel sensitive today. Ruu is right beside you holding you.' },
    { id: 'sleepy', title: 'Sleepy 🥱', bg: 'from-purple-950/30 via-blue-950/30 to-[#120a1c]', border: 'border-purple-500/20', text: 'purple-300', music: 'Soft Cozy Rain / Sleep Music 🌧️', desc: 'Get under that soft blanket, lay down, and let\'s rest together in a cozy slumber.' },
    { id: 'tired', title: 'Tired 😫', bg: 'from-slate-950/40 to-[#120a1c]', border: 'border-slate-500/20', text: 'slate-300', music: 'Relaxing wave swells 🌊', desc: 'No work or typing allowed. I command you to close your eyes and let me manage your world.' },
    { id: 'cramps', title: 'Cramps 😫🩹', bg: 'from-rose-950/40 via-purple-950/30 to-[#120a1c]', border: 'border-rose-500/25', text: 'rose-300', music: 'Live Warm Fireplace / Piano 🔥', desc: 'Ouch, my sweet baby... please put your heating pad on, tuck under the blanket, and let my words kiss your pain away.' },
    { id: 'relaxed', title: 'Relaxed 🧘‍♀️', bg: 'from-emerald-950/30 via-teal-950/30 to-[#120a1c]', border: 'border-emerald-500/20', text: 'emerald-300', music: 'Cozy Nature & Birds chirping 🌿', desc: 'Ah, pure bliss. Inhale sweet tranquility, exhale all muscle spasms.' },
    { id: 'loved', title: 'Loved 🩷', bg: 'from-red-950/30 via-pink-950/30 to-[#120a1c]', border: 'border-red-500/20', text: 'rose-400', music: 'Lofi beats layered with sweet synths 🎵', desc: 'I am screaming "I LOVE YOU MY PRINCESS!" to the entire universe!' },
    { id: 'stressed', title: 'Stressed 🤯', bg: 'from-cyan-950/30 via-blue-950/30 to-[#120a1c]', border: 'border-cyan-500/20', text: 'cyan-300', music: 'Ocean Wave Swells / Soft Rain 🌊', desc: 'Breathe... count to 4. Everything is going to be perfectly okay, sweetie. I got you.' },
  ];

  const activeMood = moods.find(m => m.id === selectedMood) || moods[4];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🌈</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🌈 Cozy Mood Booster & Adaptor
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Select how you are feeling right now, and watch the sanctuary adapt its design, quotes, and music recommendations.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {moods.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setSelectedMood(m.id);
              playSynthTone(523.25 + moods.indexOf(m) * 30, 'sine', 0.15, 0.05);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              selectedMood === m.id 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105'
                : 'bg-white/5 border border-white/5 hover:border-pink-500/10 text-zinc-400 hover:text-pink-300'
            }`}
          >
            {m.title}
          </button>
        ))}
      </div>

      <motion.div
        key={selectedMood}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${activeMood.bg} border ${activeMood.border} p-6 md:p-8 rounded-[32px] max-w-xl mx-auto shadow-2xl space-y-4`}
      >
        <div className="flex justify-between items-start border-b border-white/5 pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-pink-400">Selected Mood Sanctuary</span>
            <h4 className={`text-lg font-serif font-black text-${activeMood.text} mt-1`}>{activeMood.title} Active</h4>
          </div>
          <span className="text-3xl select-none animate-bounce">💖</span>
        </div>

        <p className="text-xs text-zinc-200 leading-relaxed font-semibold italic">
          "{activeMood.desc}"
        </p>

        <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-pink-400 font-bold">
            <Volume2 size={12} />
            <span>Ruu\'s Recommended Sound Combo:</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            For maximum ease, turn on **{activeMood.music}** in the live mixer above!
          </p>
        </div>
      </motion.div>
    </div>
  );
}


// ─── 8. FLOATING RELAXATION PLAYER ───
export function RelaxationPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState('Rain');

  const tracks = ['Rain', 'Lofi', 'Piano', 'Nature', 'Ocean Waves', 'Fireplace', 'Birds', 'White Noise', 'Sleep Music'];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🎵</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🎵 Relaxation Player
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Floating player with beautiful animated equalizers. Enjoy premium relaxing frequencies.
        </p>
      </div>

      <div className="max-w-xs mx-auto bg-slate-950/60 border border-pink-500/15 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Animated equalizer waves */}
        <div className="h-12 flex items-end gap-1.5 mb-5 relative w-36">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 bg-gradient-to-t from-pink-500 to-purple-500 rounded-full"
              animate={isPlaying ? { height: [5, 48, 5] } : { height: 5 }}
              transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Current track */}
        <div className="text-center space-y-0.5">
          <span className="text-[8px] uppercase tracking-widest font-bold text-pink-400">Now Tuning In</span>
          <h4 className="text-sm font-serif font-bold text-white tracking-wide">{track} Frequencies</h4>
          <p className="text-[9px] text-zinc-400">Binaural relaxing delta waves</p>
        </div>

        {/* Tracks slider */}
        <div className="flex gap-1 overflow-x-auto max-w-full py-3 scrollbar-none">
          {tracks.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTrack(t);
                setIsPlaying(true);
                playSynthTone(440, 'sine', 0.15);
              }}
              className={`px-3 py-1 rounded-full text-[9px] font-bold shrink-0 cursor-pointer transition-all ${
                track === t 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-white/5 border border-white/5 text-zinc-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Play controls */}
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              playSynthTone(isPlaying ? 300 : 500, 'sine', 0.1);
            }}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-450 hover:from-pink-600 flex items-center justify-center text-white cursor-pointer transition-all shadow-md active:scale-95"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── 9. DAILY COMFORT CHECKLIST ───
export function DailyComfortChecklist({ onUpdateComfortScore }: { onUpdateComfortScore?: (amt: number) => void }) {
  const [items, setItems] = useState([
    { id: 'water', label: 'Drink Water 💧', done: false, pt: 10 },
    { id: 'eat', label: 'Eat Something Light 🍎', done: false, pt: 12 },
    { id: 'rest', label: 'Take Special Rest 🛌', done: false, pt: 15 },
    { id: 'pad', label: 'Cozy Heating Pad Active 🩹', done: false, pt: 15 },
    { id: 'stretch', label: 'Gentle Warm Stretching 🧘‍♀️', done: false, pt: 10 },
    { id: 'drink', label: 'Sip Cozy Chamomile Tea 🍵', done: false, pt: 10 },
    { id: 'smile', label: 'Smile for Ruu 🩷', done: false, pt: 10 },
    { id: 'breathe', label: 'Deep Breathing Session 💨', done: false, pt: 10 },
    { id: 'music', label: 'Listen to Binaural Music 🎵', done: false, pt: 8 },
  ]);

  const handleToggle = (id: string) => {
    const matched = items.find(i => i.id === id);
    if (!matched) return;
    
    playSynthTone(matched.done ? 220 : 523.25, 'sine', 0.15, 0.08);

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.done;
        if (nextState && onUpdateComfortScore) {
          onUpdateComfortScore(item.pt);
        } else if (!nextState && onUpdateComfortScore) {
          onUpdateComfortScore(-item.pt);
        }
        return { ...item, done: nextState };
      }
      return item;
    }));
  };

  const doneCount = items.filter(i => i.done).length;
  const progressPercent = Math.floor((doneCount / items.length) * 100);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">✨</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          ✨ Daily Comfort Checklist
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Check off tasks to fill your Cozy Comfort Meter. Take good care of yourself, baby!
        </p>
      </div>

      <div className="max-w-md mx-auto bg-slate-950/40 border border-pink-500/15 rounded-[32px] p-6 shadow-2xl space-y-5">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-pink-300 font-bold">Comfort Checklist Done: {doneCount}/{items.length}</span>
            <span className="text-pink-400 font-mono font-black">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between font-semibold text-xs ${
                item.done 
                  ? 'bg-pink-500/10 border-pink-500/30 text-pink-300 line-through opacity-80 shadow-inner' 
                  : 'bg-white/5 border-white/5 hover:border-pink-500/15 text-zinc-300'
              }`}
            >
              <span>{item.label}</span>
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                item.done ? 'bg-pink-500 border-pink-500 text-white' : 'border-white/10'
              }`}>
                {item.done && <CheckSquare size={12} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ─── 10. MESSAGE FOR RUU ───
export function MessageForRuu({ onTriggerConfetti }: { onTriggerConfetti?: () => void }) {
  const [feedbackText, setFeedbackText] = useState(() => {
    return localStorage.getItem('ruu_msg_draft') || "";
  });
  const [senderType, setSenderType] = useState<'love' | 'anon'>('love');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [mood, setMood] = useState('🥰');
  const [activeTab, setActiveTab] = useState<'write' | 'drawer'>('write');
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  // Load draft and history from Supabase with Real-time synchronization
  useEffect(() => {
    const loadData = async () => {
      try {
        const msgs = await supabaseService.feedback.get();
        // Map to local UI structure
        const uiMsgs = msgs.map((m: any) => ({
          id: m.id,
          text: m.message,
          sender: m.anonymous ? 'Anonymous Angel 🫂' : 'Princess 👑',
          rating: m.rating,
          mood: m.mood,
          timestamp: new Date(m.created_at || Date.now()).toLocaleString(),
          isFavorite: false,
          reactions: m.reactions || { '❤️': 0, '🧸': 0, '🌸': 0, '✨': 0 }
        }));
        setRecentMessages(uiMsgs);
      } catch (err) {
        console.warn("Could not load feedback messages from Supabase:", err);
      }
    };
    loadData();

    // Subscribe to real-time updates from Supabase
    const unsubscribe = supabaseService.subscribe('period_feedback', (payload) => {
      if (payload.eventType === 'INSERT') {
        const m = payload.new;
        const mapped = {
          id: m.id,
          text: m.message,
          sender: m.anonymous ? 'Anonymous Angel 🫂' : 'Princess 👑',
          rating: m.rating,
          mood: m.mood,
          timestamp: new Date(m.created_at || Date.now()).toLocaleString(),
          isFavorite: false,
          reactions: m.reactions || { '❤️': 0, '🧸': 0, '🌸': 0, '✨': 0 }
        };
        setRecentMessages(prev => {
          if (prev.some(x => x.id === mapped.id)) return prev;
          return [mapped, ...prev];
        });
      } else if (payload.eventType === 'DELETE') {
        setRecentMessages(prev => prev.filter(x => x.id !== payload.old.id));
      }
    });

    return () => unsubscribe();
  }, [isSubmitted]);

  // Save draft on edit
  const handleTextChange = (text: string) => {
    setFeedbackText(text);
    localStorage.setItem('ruu_msg_draft', text);
  };

  const moodsList = [
    { emoji: '🥰', label: 'Happy' },
    { emoji: '🥺', label: 'Emotional' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '🩹', label: 'In Pain' },
    { emoji: '😭', label: 'Overwhelmed' }
  ];

  const quickEmojis = ['❤️', '💖', '🧸', '🌹', '🍫', '🍵', '🫂', '✨'];

  const handleAddEmoji = (emoji: string) => {
    playSynthTone(440, 'sine', 0.1);
    const updated = feedbackText + emoji;
    handleTextChange(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    try {
      const user = await supabaseService.auth.getCurrentUser();
      const userId = user?.id || 'guest_user_ruu';

      playSynthTone(523.25, 'sine', 0.15);
      setTimeout(() => playSynthTone(659.25, 'sine', 0.15), 80);
      setTimeout(() => playSynthTone(783.99, 'sine', 0.3), 160);

      // Save message in Supabase backend
      await supabaseService.feedback.add({
        user_id: userId,
        message: feedbackText,
        rating,
        mood,
        anonymous: senderType === 'anon'
      });

      // Clear draft
      setFeedbackText("");
      localStorage.removeItem('ruu_msg_draft');

      setIsSubmitted(true);
      if (onTriggerConfetti) {
        onTriggerConfetti();
        setTimeout(onTriggerConfetti, 250);
        setTimeout(onTriggerConfetti, 500);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit love note to database.');
    }
  };

  const handleToggleFavorite = (msgId: any) => {
    const nextList = recentMessages.map(m => {
      if (m.id === msgId) {
        return { ...m, isFavorite: !m.isFavorite };
      }
      return m;
    });
    setRecentMessages(nextList);
    playSynthTone(523.25, 'sine', 0.15, 0.05);
  };

  const handleAddReaction = (msgId: any, emoji: string) => {
    const nextList = recentMessages.map(m => {
      if (m.id === msgId) {
        const reactions = m.reactions || { '❤️': 0, '🧸': 0, '🌸': 0, '✨': 0 };
        return {
          ...m,
          reactions: {
            ...reactions,
            [emoji]: (reactions[emoji] || 0) + 1
          }
        };
      }
      return m;
    });
    setRecentMessages(nextList);
    playSynthTone(587.33, 'triangle', 0.1, 0.05);
  };

  const handleDeleteMessage = async (msgId: any) => {
    if (confirm("Are you sure you want to delete this love note from your locker?")) {
      try {
        await supabaseService.feedback.delete(msgId.toString());
        setRecentMessages(prev => prev.filter(m => m.id !== msgId));
        playSynthTone(220, 'sine', 0.25);
      } catch (err) {
        alert('Could not delete love note. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">💌</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          💌 Send a Heartbeat to Ruu
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Share your feelings, baby. Saved securely in your physical heart locker on your local browser.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-slate-950/40 border border-pink-500/15 rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
        
        {/* Sub tab navigation */}
        <div className="grid grid-cols-2 gap-2 mb-6 select-none">
          <button
            onClick={() => {
              setActiveTab('write');
              playSynthTone(300, 'sine', 0.1);
            }}
            className={`py-2 rounded-xl text-[10px] uppercase font-black tracking-widest border transition-all cursor-pointer ${
              activeTab === 'write' 
                ? 'bg-pink-500/20 border-pink-500 text-pink-300' 
                : 'bg-white/5 border-white/5 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Write Note 📝
          </button>
          <button
            onClick={() => {
              setActiveTab('drawer');
              playSynthTone(350, 'sine', 0.1);
            }}
            className={`py-2 rounded-xl text-[10px] uppercase font-black tracking-widest border transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'drawer' 
                ? 'bg-pink-500/20 border-pink-500 text-pink-300' 
                : 'bg-white/5 border-white/5 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Locker Drawer ({recentMessages.length}) 🗄️
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'write' ? (
            !isSubmitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 text-left"
              >
                {/* Mood selector */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-extrabold text-pink-400">
                    Select Your Current Mood:
                  </label>
                  <div className="flex items-center gap-1.5 py-1">
                    {moodsList.map((m) => (
                      <button
                        key={m.emoji}
                        type="button"
                        onClick={() => {
                          setMood(m.emoji);
                          playSynthTone(320, 'sine', 0.1);
                        }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all border ${
                          mood === m.emoji 
                            ? 'bg-pink-500/20 border-pink-500 scale-105 shadow-md' 
                            : 'bg-white/5 border-white/5 hover:border-pink-500/10'
                        }`}
                        title={m.label}
                      >
                        {m.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5-heart rating */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-extrabold text-pink-400">
                    Daily Comfort Scale:
                  </label>
                  <div className="flex items-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setRating(star);
                          playSynthTone(300 + star * 40, 'sine', 0.1);
                        }}
                        className="cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Heart 
                          size={20} 
                          className={star <= rating ? "fill-pink-500 text-pink-500 animate-pulse" : "text-zinc-600"} 
                        />
                      </button>
                    ))}
                    <span className="text-[10px] text-zinc-400 font-bold ml-2 font-mono">({rating}/5 Comfort)</span>
                  </div>
                </div>

                {/* Message Input with character counter */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest font-extrabold text-pink-400">
                      How did this make you feel?
                    </label>
                    <span className={`text-[9px] font-mono font-bold ${feedbackText.length > 450 ? 'text-red-400' : 'text-zinc-500'}`}>
                      {feedbackText.length}/500 chars
                    </span>
                  </div>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        handleTextChange(e.target.value);
                      }
                    }}
                    placeholder="Share your feelings, ask for extra virtual chocolates, or say whatever is in your heart..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/50 transition-all placeholder-zinc-500"
                  />
                </div>

                {/* Easy Quick Emojis */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-extrabold text-zinc-500">
                    Quick Emoji Insertion:
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {quickEmojis.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => handleAddEmoji(e)}
                        className="px-2 py-1 bg-white/5 hover:bg-pink-500/10 border border-white/5 hover:border-pink-500/20 rounded-lg text-xs select-none transition-all"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* sender selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSenderType('love');
                      playSynthTone(400, 'sine', 0.1);
                    }}
                    className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                      senderType === 'love' 
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-md' 
                        : 'bg-white/5 border-white/5 text-zinc-400 hover:border-pink-500/15'
                    }`}
                  >
                    <User size={12} /> Send Love ❤️
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSenderType('anon');
                      playSynthTone(350, 'sine', 0.1);
                    }}
                    className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                      senderType === 'anon' 
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md' 
                        : 'bg-white/5 border-white/5 text-zinc-400 hover:border-pink-500/15'
                    }`}
                  >
                    <User size={12} /> Anonymous 🫂
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!feedbackText.trim()}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-450 hover:from-pink-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <span>Send to Ruu</span>
                  <Send size={12} />
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="text-center space-y-6 py-6 relative"
              >
                {/* Floating Hearts Celebration */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 150, scale: 0.5, x: 0 }}
                      animate={{ 
                        opacity: [0, 0.9, 0], 
                        y: [120, -120], 
                        x: [0, (i % 2 === 0 ? 40 : -40), (i % 3 === 0 ? 20 : -20)],
                        scale: [0.6, 1.2, 0.7] 
                      }}
                      transition={{ 
                        duration: 3 + i * 0.4, 
                        repeat: Infinity, 
                        delay: i * 0.25,
                        ease: "easeOut"
                      }}
                      className="absolute text-pink-500 text-xl"
                      style={{
                        left: `${35 + (i * 4)}%`,
                      }}
                    >
                      {i % 2 === 0 ? '❤️' : '💖'}
                    </motion.div>
                  ))}
                </div>

                {/* Celebrating Teddy Bear holding a Heart */}
                <div className="relative z-10 w-32 h-32 mx-auto">
                  <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(244,63,94,0.45)]">
                    {/* Ears */}
                    <circle cx="32" cy="28" r="10" fill="#92400e" />
                    <circle cx="32" cy="28" r="5" fill="#fbcfe8" />
                    <circle cx="68" cy="28" r="10" fill="#92400e" />
                    <circle cx="68" cy="28" r="5" fill="#fbcfe8" />
                    {/* Head */}
                    <circle cx="50" cy="44" r="22" fill="#78350f" />
                    {/* Eyes */}
                    <circle cx="42" cy="40" r="2" fill="#000" />
                    <circle cx="58" cy="40" r="2" fill="#000" />
                    {/* Snout */}
                    <ellipse cx="50" cy="48" rx="6" ry="4.5" fill="#fde047" />
                    <polygon points="48,46 52,46 50,48.5" fill="#451a03" />
                    {/* Smile */}
                    <path d="M48,50 Q50,52 52,50" stroke="#451a03" strokeWidth="1" fill="none" />
                    {/* Cheeks */}
                    <circle cx="38" cy="44" r="2.5" fill="#f43f5e" opacity="0.6" />
                    <circle cx="62" cy="44" r="2.5" fill="#f43f5e" opacity="0.6" />
                    {/* Body */}
                    <ellipse cx="50" cy="74" rx="20" ry="16" fill="#78350f" />
                    <ellipse cx="50" cy="74" rx="13" ry="10" fill="#92400e" />
                    {/* Arms waving */}
                    <motion.path 
                      d="M32,68 C25,60 20,55 18,58 C16,61 22,70 30,74" 
                      fill="#78350f" 
                      animate={{ rotate: [-10, 10, -10] }} 
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ transformOrigin: '30px 72px' }}
                    />
                    <motion.path 
                      d="M68,68 C75,60 80,55 82,58 C84,61 78,70 70,74" 
                      fill="#78350f" 
                      animate={{ rotate: [10, -10, 10] }} 
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ transformOrigin: '70px 72px' }}
                    />
                    {/* Heart in hands */}
                    <motion.path
                      d="M50,76 C50,76 43,70 43,65 C43,61 47,58 50,61 C53,58 57,61 57,65 C57,70 50,76 50,76 Z"
                      fill="#f43f5e"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ transformOrigin: '50px 68px' }}
                    />
                  </svg>
                </div>

                <div className="space-y-1 relative z-10">
                  <h5 className="font-serif text-lg font-black text-transparent bg-gradient-to-r from-pink-300 to-amber-200 bg-clip-text uppercase tracking-wide">
                    Message Sent to Ruu! 💖
                  </h5>
                  <p className="text-xs text-zinc-300 leading-relaxed max-w-xs mx-auto">
                    Thank you, my beautiful princess! Your sweet message and comfort rating have been placed into Ruu's virtual heart locker. I am sending you a million warm snuggles! 🧸
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    playSynthTone(400, 'sine', 0.1);
                  }}
                  className="relative z-10 px-6 py-2.5 border border-pink-500/25 text-pink-300 hover:bg-pink-500/10 hover:border-pink-500/50 rounded-xl text-[10px] uppercase font-black tracking-widest cursor-pointer transition-all active:scale-95"
                >
                  Send Another Note
                </button>
              </motion.div>
            )
          ) : (
            <motion.div
              key="drawer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 text-left max-h-[400px] overflow-y-auto custom-scrollbar pr-1"
            >
              {recentMessages.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 space-y-2">
                  <span className="text-3xl block">📭</span>
                  <p className="text-xs">No sent messages yet in this session.</p>
                </div>
              ) : (
                recentMessages.map((m) => (
                  <div 
                    key={m.id}
                    className="p-4 bg-white/5 border border-white/5 hover:border-pink-500/15 rounded-2xl relative space-y-2.5 transition-all text-xs"
                  >
                    {/* Header line */}
                    <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400">
                      <span className="text-pink-400 font-black">{m.sender} {m.mood}</span>
                      <span>{m.timestamp.split(',')[0]}</span>
                    </div>

                    <p className="text-zinc-200 leading-relaxed">{m.text}</p>

                    {/* Bottom tools (Favorites and Quick reactions) */}
                    <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[11px]">
                      {/* Heart Favorites toggle */}
                      <button 
                        onClick={() => handleToggleFavorite(m.id)}
                        className="flex items-center gap-1 font-bold transition-all cursor-pointer hover:scale-105"
                      >
                        <Heart 
                          size={13} 
                          className={m.isFavorite ? "fill-red-500 text-red-500 animate-pulse" : "text-zinc-500"} 
                        />
                        <span className={m.isFavorite ? "text-red-400" : "text-zinc-500"}>
                          {m.isFavorite ? "Favorited" : "Favorite"}
                        </span>
                      </button>

                      {/* Floating reaction display */}
                      <div className="flex items-center gap-1 bg-slate-900/40 rounded-lg px-1.5 py-0.5 border border-white/5 text-[9px]">
                        {Object.entries(m.reactions || { '❤️': 0, '🧸': 0, '🌸': 0, '✨': 0 }).map(([emoji, count]: any) => (
                          <button
                            key={emoji}
                            onClick={() => handleAddReaction(m.id, emoji)}
                            className="hover:scale-125 transition-transform"
                          >
                            <span>{emoji} {count > 0 && <span className="font-mono text-zinc-400 font-bold">{count}</span>}</span>
                          </button>
                        ))}
                      </div>

                      {/* Delete option */}
                      <button 
                        onClick={() => handleDeleteMessage(m.id)}
                        className="text-[9px] font-bold uppercase tracking-wider text-zinc-600 hover:text-red-400 cursor-pointer transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


// ─── 11. SURPRISE GIFT BOX ───
export function SurpriseGiftBox({ onTriggerConfetti }: { onTriggerConfetti?: () => void }) {
  const [giftReward, setGiftReward] = useState<any | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  const rewards = [
    { type: '🧸 Teddy', emoji: '🧸', title: 'Cuddly Fluffy Teddy Plushie!', message: 'He is specially tasked with sleeping next to you and rubbing your tummy.' },
    { type: '🍫 Chocolate', emoji: '🍫', title: 'Luxury Swiss Melted Chocolate!', message: 'Sweet, dopamine-packed treat to instantly lift your gorgeous spirit.' },
    { type: '🌹 Flowers', emoji: '🌹', title: 'A Fresh Red Rose Blossom!', message: 'Smelling like vanilla honey, carrying 1,000 warm virtual kisses.' },
    { type: '💌 Letter', emoji: '💌', title: 'Handwritten Little Postcard!', message: '"You are doing so, so well my beautiful queen. Rest well, eat sweet treats, I am with you."' },
    { type: '❤️ Compliment', emoji: '👑', title: 'Royal Queen Compliment!', message: 'Did you know? You have the most lovely eyes and beautiful smile in the cosmos.' },
    { type: '🫂 Hug', emoji: '🫂', desc: 'Tight snuggle squeeze.', title: 'Extra Tight Virtual Squish!', message: 'Wrapping my warm arms around your waist and pulling you tight against my chest.' },
    { type: '☕ Coffee', emoji: '☕', title: 'Cozy Marshmallow Cocoa!', message: 'Warm, rich milk chocolate topped with mini sweet cloud marshmallows.' },
    { type: '🍵 Tea', emoji: '🍵', title: 'Honey Chamomile Elixir!', message: 'Soothing organic tea that naturally calms heavy stomach cramping.' },
    { type: '✨ Lucky Star', emoji: '⭐', title: 'Sparkling Golden Lucky Star!', message: 'He has strict rules to guide your dreams tonight and ward off headaches.' },
    { type: '🌈 Rainbow', emoji: '🌈', title: 'A Bright Colorful Rainbow Sky!', message: 'Filling your horizon with colorful, vibrant happiness and comfort.' },
  ];

  const handleOpenGift = () => {
    if (isOpening) return;
    setIsOpening(true);
    setGiftReward(null);
    playSynthTone(293.66, 'sawtooth', 0.15, 0.1); // D4
    setTimeout(() => playSynthTone(392, 'sawtooth', 0.15, 0.1), 100); // G4
    setTimeout(() => playSynthTone(587.33, 'triangle', 0.15, 0.1), 200); // D5

    setTimeout(() => {
      const rand = rewards[Math.floor(Math.random() * rewards.length)];
      setGiftReward(rand);
      setIsOpening(false);
      triggerSuccessChime();
      if (onTriggerConfetti) onTriggerConfetti();
    }, 1800);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <span className="text-2xl">🎁</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          🎁 Surprise Mystery Gift Box
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Tap the floating gift box to receive a mystery pampering reward from Ruu!
        </p>
      </div>

      <div className="max-w-xs mx-auto bg-slate-950/40 border border-pink-500/15 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
        <AnimatePresence mode="wait">
          {!giftReward ? (
            <motion.div
              key="closed"
              initial={{ scale: 0.9 }}
              animate={isOpening ? { rotate: [0, -15, 15, -15, 15, 0], scale: 1.15 } : { scale: [0.95, 1.05, 0.95] }}
              transition={isOpening ? { duration: 1.5 } : { duration: 2.2, repeat: Infinity }}
              onClick={handleOpenGift}
              className="text-7xl select-none cursor-pointer filter hover:drop-shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all"
            >
              🎁
            </motion.div>
          ) : (
            <motion.div
              key="reward"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-center space-y-4"
            >
              <span className="text-6xl select-none animate-bounce inline-block">{giftReward.emoji}</span>
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest font-black text-pink-400">{giftReward.type} Reward</span>
                <h4 className="text-sm font-serif font-black text-white">{giftReward.title}</h4>
                <p className="text-[10px] text-zinc-300 leading-relaxed px-2">{giftReward.message}</p>
              </div>
              <button
                onClick={() => {
                  setGiftReward(null);
                  playSynthTone(400, 'sine', 0.1);
                }}
                className="px-5 py-2 border border-pink-500/25 hover:bg-pink-500/10 rounded-xl text-[9px] text-pink-300 uppercase font-black transition-all cursor-pointer"
              >
                Tap to Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {isOpening && (
          <span className="text-[9px] uppercase font-black text-pink-300 tracking-widest animate-pulse mt-4">Unboxing Care...</span>
        )}
        {!giftReward && !isOpening && (
          <span className="text-[8px] uppercase font-extrabold text-zinc-500 tracking-widest mt-4 animate-pulse">Tap Box to Open</span>
        )}
      </div>
    </div>
  );
}


// ─── 12. FINAL SECTION ───
export function FinalSection() {
  return (
    <div className="relative py-24 text-center select-none overflow-hidden rounded-[48px] border border-pink-500/25 bg-gradient-to-b from-[#160c28] via-[#0b0416] to-[#010005] shadow-[0_0_50px_rgba(244,63,94,0.15)]">
      {/* Background Aurora glowing layers */}
      <div className="absolute inset-0 bg-radial-gradient from-pink-500/10 via-purple-950/15 to-transparent pointer-events-none opacity-80" />
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-500/15 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-rose-500/15 rounded-full blur-[120px] animate-pulse" />

      {/* Floating ambient particles (Butterflies, hearts, sakura, stars, aurora, fireflies) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['🦋', '❤️', '🌸', '⭐', '✨', '🌸', '❤️', '✨', '🦋', '⭐', '✨', '🌸'].map((emoji, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 350, x: (idx * 30) - 100 }}
            animate={{ 
              opacity: [0, 0.8, 0.8, 0], 
              y: -50, 
              x: (idx * 30) - 100 + Math.sin(idx + Date.now()/5000) * 80 
            }}
            transition={{ 
              duration: 7 + (idx % 4) * 2, 
              repeat: Infinity, 
              delay: idx * 0.6,
              ease: 'easeInOut'
            }}
            className="absolute text-xl text-pink-300/80"
            style={{ 
              left: `${5 + (idx * 8)}%`, 
              top: '20%' 
            }}
          >
            {emoji}
          </motion.span>
        ))}

        {/* Small glowing fireflies/stardust particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`firefly-${i}`}
            animate={{
              y: [280, -20],
              x: [i * 25, i * 25 + Math.sin(i) * 30],
              opacity: [0, 0.7, 0],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 8 + (i % 3) * 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            className="absolute w-1 h-1 bg-amber-200 rounded-full blur-[0.5px]"
            style={{ left: `${(i * 6)}%` }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-6 space-y-8 relative z-10">
        <span className="text-5xl animate-pulse inline-block filter drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">
          💖🌸👑
        </span>
        <h3 className="font-serif text-2xl md:text-4xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text leading-relaxed tracking-wide">
          "You are loved more than you know. Take care of yourself. Rest well. Tomorrow is another beautiful day. ❤️"
        </h3>
        
        <div className="h-0.5 w-32 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-300 mx-auto rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]" />

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-pink-300 font-extrabold font-mono">
            Forever Protected By Your Boy Ruu
          </p>
          <p className="text-[11px] text-zinc-400 font-medium max-w-md mx-auto leading-normal">
            Take deep breaths, slip under warm blankets, and let your body heal. I am holding your beautiful hand every step of the way. Sleep tight, my precious angel. ❤️
          </p>
        </div>
      </div>
    </div>
  );
}
