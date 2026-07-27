import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Smile, MessageCircle, RefreshCw, Send, Volume2, VolumeX, Camera, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabaseService } from '../lib/supabase';
import rupeshDefaultPhoto from '../assets/images/regenerated_image_1780655372225.jpg';
import vanshikaDefaultPhoto from '../assets/images/regenerated_image_1780939152437.jpg';

// High-fidelity Web Audio API synthesizer for adorable romantic sound effects
class HugAudioSynth {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playPop() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio Context blocked or failed to load:", e);
    }
  }

  playHeartbeat() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(60, this.ctx.currentTime);
      osc.frequency.setValueAtTime(50, this.ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }

  playKiss() {
    try {
      this.init();
      if (!this.ctx) return;
      // High frequency kiss "smack"
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc2.start();
      osc.stop(this.ctx.currentTime + 0.12);
      osc2.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }
}

const audio = new HugAudioSynth();

type HugStyle = 'forehead_kiss' | 'deep_cuddle' | 'bear_hug' | 'cheek_kiss';

interface VirtualHugProps {
  onTriggerConfetti?: () => void;
}

export default function VirtualHug({ onTriggerConfetti }: VirtualHugProps) {
  const [role, setRole] = useState<'rupesh' | 'vanshika'>('rupesh');
  const [hugStyle, setHugStyle] = useState<HugStyle>('forehead_kiss');
  const [customMsg, setCustomMsg] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Custom Photo Face States
  const [faceMode, setFaceMode] = useState<'avatar' | 'photo'>(() => {
    return (localStorage.getItem('ruu_hug_face_mode') as 'avatar' | 'photo') || 'photo';
  });

  const [rupeshPhoto, setRupeshPhoto] = useState<string>(() => {
    return localStorage.getItem('ruu_hug_rupesh_photo') || rupeshDefaultPhoto;
  });

  const [vanshikaPhoto, setVanshikaPhoto] = useState<string>(() => {
    return localStorage.getItem('ruu_hug_vanshika_photo') || vanshikaDefaultPhoto;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Animation Phase: 'idle' | 'approaching' | 'hugging' | 'kissing' | 'releasing'
  const [phase, setPhase] = useState<'idle' | 'approaching' | 'hugging' | 'kissing' | 'releasing'>('idle');
  const [isIncoming, setIsIncoming] = useState(false);
  const [incomingSender, setIncomingSender] = useState('');
  const [incomingMsg, setIncomingMsg] = useState('');
  const [incomingStyle, setIncomingStyle] = useState<HugStyle>('forehead_kiss');
  
  // Confetti particles local state
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string; scale: number; rotation: number }[]>([]);
  const particleIdRef = useRef(0);
  const heartbeatIntervalRef = useRef<any>(null);

  // Sync state with local activity log
  useEffect(() => {
    // Determine user role from default nickname or session
    const checkRole = async () => {
      const user = await supabaseService.auth.getCurrentUser();
      if (user) {
        const nameLower = user.name.toLowerCase();
        if (nameLower.includes('vanshika') || nameLower.includes('princess') || user.id === 'princess_user_id') {
          setRole('vanshika');
        } else {
          setRole('rupesh');
        }
      }
    };
    checkRole();

    // Listen to realtime virtual hug events in activity_logs
    const unsubscribe = supabaseService.subscribe('activity_logs', (payload) => {
      if (payload.eventType === 'INSERT') {
        const log = payload.new;
        if (log.action === 'triggered_virtual_hug') {
          // Avoid triggering if it's sent by current user
          let parsedDetails: any = {};
          try {
            parsedDetails = JSON.parse(log.details);
          } catch (e) {
            parsedDetails = { sender: 'Rupesh', style: 'forehead_kiss', message: log.details };
          }
          
          const currentUserName = role === 'vanshika' ? 'Vanshika' : 'Rupesh';
          const senderName = parsedDetails.sender || 'Rupesh';
          
          if (senderName.toLowerCase() !== currentUserName.toLowerCase()) {
            // Trigger incoming hug!
            setIncomingSender(senderName);
            setIncomingMsg(parsedDetails.message || '');
            setIncomingStyle(parsedDetails.style || 'forehead_kiss');
            setIsIncoming(true);
            setHugStyle(parsedDetails.style || 'forehead_kiss');
            
            // Start animation
            startHugAnimation(true, parsedDetails.message, parsedDetails.style);
          }
        }
      }
    });

    return () => {
      unsubscribe();
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
    };
  }, [role]);

  // Photo uploads & resets
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'rupesh' | 'vanshika') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (target === 'rupesh') {
        setRupeshPhoto(base64String);
        localStorage.setItem('ruu_hug_rupesh_photo', base64String);
      } else {
        setVanshikaPhoto(base64String);
        localStorage.setItem('ruu_hug_vanshika_photo', base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = (target: 'rupesh' | 'vanshika') => {
    if (target === 'rupesh') {
      setRupeshPhoto(rupeshDefaultPhoto);
      localStorage.removeItem('ruu_hug_rupesh_photo');
    } else {
      setVanshikaPhoto(vanshikaDefaultPhoto);
      localStorage.removeItem('ruu_hug_vanshika_photo');
    }
  };

  // Generate interactive love particles
  const spawnParticles = (count: number, type: 'heart' | 'kiss' | 'sparkle' | 'all' = 'all') => {
    const emojis = {
      heart: ['💖', '💗', '💓', '💝', '❤️', '💕'],
      kiss: ['💋', '😘', '😚', '💋'],
      sparkle: ['✨', '⭐', '🌟', '🌈'],
      all: ['💖', '💗', '💓', '💝', '❤️', '💋', '😘', '✨', '⭐', '🌸', '🫂']
    }[type];

    const newParticles = Array.from({ length: count }).map(() => {
      particleIdRef.current += 1;
      return {
        id: particleIdRef.current,
        x: 30 + Math.random() * 40, // percentage from left
        y: 30 + Math.random() * 40, // percentage from top
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        scale: 0.6 + Math.random() * 1.2,
        rotation: -45 + Math.random() * 90
      };
    });

    setParticles(prev => [...prev, ...newParticles]);
    
    // Cleanup particles
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 4000);
  };

  // Perform animated virtual hug steps
  const startHugAnimation = (incoming = false, receivedMsg = '', receivedStyle: HugStyle = 'forehead_kiss') => {
    if (phase !== 'idle') return;
    
    const targetStyle = incoming ? receivedStyle : hugStyle;
    const activeMsg = incoming ? receivedMsg : customMsg;

    if (soundEnabled) audio.playPop();
    setPhase('approaching');

    // Step 1: Characters approach (1.5s)
    setTimeout(() => {
      setPhase('hugging');
      spawnParticles(15, 'heart');
      
      // Start heartbeat sound effect during hug
      if (soundEnabled) {
        audio.playHeartbeat();
        heartbeatIntervalRef.current = setInterval(() => {
          audio.playHeartbeat();
        }, 800);
      }

      // Step 2: Transition to Special Action/Kiss phase (after 2.5s of cuddle)
      setTimeout(() => {
        if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
        
        setPhase('kissing');
        if (soundEnabled) audio.playKiss();
        
        // Trigger large explosion of kisses
        spawnParticles(25, targetStyle === 'forehead_kiss' ? 'kiss' : 'sparkle');
        
        if (onTriggerConfetti) {
          onTriggerConfetti();
        }

        // Step 3: Cool down / Release phase (after 2.5s of kissing)
        setTimeout(() => {
          setPhase('releasing');
          
          // Step 4: Reset back to idle (after 1.5s)
          setTimeout(() => {
            setPhase('idle');
            setIsIncoming(false);
            if (!incoming) setCustomMsg(''); // clear after sending
          }, 1500);
        }, 2800);
      }, 2500);
    }, 1500);
  };

  // Trigger outbound virtual hug and log to Supabase service
  const handleSendHug = async () => {
    if (phase !== 'idle') return;

    const senderName = role === 'vanshika' ? 'Vanshika' : 'Rupesh';
    const recipientName = role === 'vanshika' ? 'Rupesh' : 'Vanshika';
    const styleLabel = {
      forehead_kiss: 'Forehead Kiss & Warm Cuddle 💋',
      deep_cuddle: 'Deep Healing Tight Hug 🫂',
      bear_hug: 'Super Cozy Bear Hug 🧸',
      cheek_kiss: 'Sweet Cheek Kiss & Cuddle 😘'
    }[hugStyle];

    // Formulate database record
    const payload = {
      sender: senderName,
      recipient: recipientName,
      style: hugStyle,
      message: customMsg.trim() || `Sending you the absolute warmest ${styleLabel}!`
    };

    try {
      // Log to activityLogs which triggers realtime subscription update for the partner!
      await supabaseService.activityLogs.log(
        'triggered_virtual_hug',
        JSON.stringify(payload)
      );
    } catch (e) {
      console.error("Realtime hug dispatch failed:", e);
    }

    // Start local animation immediately
    startHugAnimation(false);
  };

  // Visual text helpers
  const getStatusMessage = () => {
    switch (phase) {
      case 'idle':
        return isIncoming 
          ? `💖 Incoming sweet hug from ${incomingSender}! 💖`
          : `🧸 Select a cuddle style to send to your love...`;
      case 'approaching':
        return `🌸 Rupesh and Vanshika are reaching out for each other...`;
      case 'hugging':
        return hugStyle === 'deep_cuddle' 
          ? `🫂 Holding each other tight... listening to their heartbeats 💓`
          : `🫂 Rupesh and Vanshika holding each other in a warm snuggly cuddle...`;
      case 'kissing':
        if (hugStyle === 'forehead_kiss') {
          return `💋 Rupesh leans in and gently kisses Vanshika's forehead! 💋`;
        } else if (hugStyle === 'cheek_kiss') {
          return `😘 Sweet blushing cheek kiss! Muahhh! 😘`;
        } else if (hugStyle === 'bear_hug') {
          return `🧸 Squeezing tight in a cozy teddy-bear snuggle! ⭐`;
        } else {
          return `✨ Melting away in a deep healing embrace... 💕`;
        }
      case 'releasing':
        return `💖 That felt incredibly warm. Love synced successfully! 💖`;
      default:
        return '';
    }
  };

  const getStyleDescription = () => {
    switch (hugStyle) {
      case 'forehead_kiss': return "Forehead Kiss & Warm Cuddle - Maximum romance and safety feelings.";
      case 'deep_cuddle': return "Deep Healing Tight Cuddle - To melt away any stress, periods cramps or sadness.";
      case 'bear_hug': return "Silly Bear Hug - Playful squeeze that lifts you off your feet.";
      case 'cheek_kiss': return "Sweet Cheek Kiss - Blushing cuteness with soft pats.";
    }
  };

  return (
    <div className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-br from-slate-900/90 to-purple-950/90 border border-pink-500/30 p-5 shadow-2xl flex flex-col items-center select-none text-white mt-6">
      
      {/* Background Hearts Rain */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute w-full h-full animate-heart-rain" />
      </div>

      {/* Header HUD */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-4 z-10">
        <div className="flex items-center gap-2">
          <Heart className="text-pink-400 fill-pink-500 animate-pulse shrink-0" size={20} />
          <div>
            <h3 className="font-serif text-sm md:text-base font-black tracking-wide bg-gradient-to-r from-pink-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent uppercase">
              💖 Synchronized Hug & Kiss Sanctuary
            </h3>
            <p className="text-[10px] text-zinc-400 font-bold">
              Real-time interactive physical simulator
            </p>
          </div>
        </div>
        
        {/* Toggle Controls */}
        <div className="flex items-center gap-1.5">
          {/* Sound switch */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-pink-300 cursor-pointer"
            title={soundEnabled ? "Disable Cuddly Sounds" : "Enable Cuddly Sounds"}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Persona selector (Rupesh vs Vanshika) */}
          <button
            onClick={() => setRole(prev => prev === 'rupesh' ? 'vanshika' : 'rupesh')}
            disabled={phase !== 'idle'}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/15 active:scale-95 disabled:opacity-50 text-[10px] font-black rounded-lg transition-all border border-white/10 text-pink-300 uppercase tracking-widest cursor-pointer flex items-center gap-1"
          >
            <RefreshCw size={10} className="animate-spin-slow" />
            <span>I am: {role === 'rupesh' ? 'Rupesh Ji 🧸' : 'Vanshika Ji 👑'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Box */}
      <div className="relative w-full h-56 md:h-64 bg-slate-950/60 rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-between items-center p-3">
        
        {/* Floating Interactive Live Notification banner */}
        <div className="z-10 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-center text-xs font-black shadow-lg">
          <span className="bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 bg-clip-text text-transparent uppercase tracking-wider animate-pulse">
            {getStatusMessage()}
          </span>
        </div>

        {/* Real-time Message bubbles floating above characters */}
        <div className="absolute top-14 left-0 right-0 flex justify-between px-6 md:px-12 pointer-events-none z-10">
          {/* Rupesh message bubble */}
          <AnimatePresence>
            {((phase !== 'idle' && !isIncoming && customMsg) || (phase !== 'idle' && isIncoming && incomingSender === 'Rupesh' && incomingMsg)) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="max-w-[150px] bg-sky-500 text-white rounded-2xl p-2 text-[10px] font-bold shadow-md border border-sky-400 relative rounded-bl-none"
              >
                {isIncoming ? incomingMsg : customMsg}
                <div className="absolute bottom-0 left-0 transform translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-sky-500 rotate-45 border-r border-b border-sky-400" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vanshika message bubble */}
          <AnimatePresence>
            {((phase !== 'idle' && !isIncoming && role === 'vanshika' && customMsg) || (phase !== 'idle' && isIncoming && incomingSender === 'Vanshika' && incomingMsg)) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="max-w-[150px] bg-pink-500 text-white rounded-2xl p-2 text-[10px] font-bold shadow-md border border-pink-400 relative rounded-br-none"
              >
                {isIncoming ? incomingMsg : customMsg}
                <div className="absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 bg-pink-500 rotate-45 border-l border-t border-pink-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The Animated Physical Avatars Stage */}
        <div className="relative w-full flex-1 flex items-end justify-center pb-2">
          
          {/* Dynamic Light Glow Center Effect */}
          <AnimatePresence>
            {phase === 'hugging' && (
              <motion.div 
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [1, 1.2, 1], opacity: 0.8 }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="absolute bottom-6 w-36 h-36 rounded-full bg-pink-500/30 blur-2xl pointer-events-none"
              />
            )}
            {phase === 'kissing' && (
              <motion.div 
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [1.2, 1.4, 1.2], opacity: 0.9 }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="absolute bottom-8 w-44 h-44 rounded-full bg-amber-400/25 blur-3xl pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Particle System Container */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, scale: 0.1, x: `${p.x}%`, y: `${p.y}%`, rotate: p.rotation }}
                animate={{ 
                  opacity: [1, 0.9, 0],
                  y: `${p.y - 45 - Math.random() * 20}%`, 
                  x: `${p.x + (Math.random() - 0.5) * 35}%`,
                  scale: p.scale * 1.4,
                  rotate: p.rotation + (Math.random() - 0.5) * 90
                }}
                transition={{ duration: 2.2, ease: 'easeOut' }}
                className="absolute text-xl md:text-2xl filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]"
              >
                {p.emoji}
              </motion.div>
            ))}
          </div>

          {/* RUPESH CHARACTER AVATAR */}
          <motion.div
            animate={
              phase === 'idle' ? { x: -65, y: 0, rotate: 0 } :
              phase === 'approaching' ? { x: -20, y: [0, -10, 0, -8, 0], transition: { duration: 1.5 } } :
              phase === 'hugging' ? { x: -6, y: 0, rotate: 5 } :
              phase === 'kissing' ? { x: -2, y: -2, rotate: 12 } :
              { x: -65, y: 0, rotate: 0, transition: { duration: 1.5 } } // releasing
            }
            className="absolute bottom-4 flex flex-col items-center z-10"
          >
            {/* Blushing cheek indicator / emotional eyes */}
            <div className="relative flex flex-col items-center">
              {/* Arm overlaying during hug */}
              {phase === 'hugging' && (
                <motion.div 
                  initial={{ rotate: -20, x: 5 }}
                  animate={{ rotate: 10, x: 10 }}
                  className="absolute right-[-8px] top-12 w-10 h-3 bg-indigo-500 rounded-full origin-left z-30 border border-white/20"
                />
              )}

              {/* Head */}
              <div className="w-16 h-16 rounded-full border-2 border-indigo-400/60 relative overflow-hidden shadow-lg flex items-center justify-center bg-[#ffffff]">
                {faceMode === 'photo' ? (
                  <img src={rupeshPhoto} alt="Rupesh" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <>
                    {/* Hair */}
                    <div className="absolute top-0 left-0 right-0 h-6 bg-slate-800 rounded-b-lg" />
                    <div className="absolute top-1 left-1.5 w-4 h-4 bg-slate-800 rounded-full" />
                    <div className="absolute top-1 right-1.5 w-4 h-4 bg-slate-800 rounded-full" />
                    
                    {/* Eyes */}
                    <div className="absolute top-7 left-3.5 flex gap-5">
                      <div className="w-2 h-2 rounded-full bg-slate-800 flex items-center justify-center">
                        {phase === 'kissing' && <span className="text-[6px] text-white">^</span>}
                      </div>
                      <div className="w-2 h-2 rounded-full bg-slate-800 flex items-center justify-center">
                        {phase === 'kissing' && <span className="text-[6px] text-white">^</span>}
                      </div>
                    </div>

                    {/* Blushing Cheeks */}
                    <span className="absolute bottom-5 left-2 w-2.5 h-1.5 bg-rose-400/40 rounded-full blur-2xs" />
                    <span className="absolute bottom-5 right-2 w-2.5 h-1.5 bg-rose-400/40 rounded-full blur-2xs" />

                    {/* Mouth */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      {phase === 'kissing' ? (
                        <div className="w-2.5 h-1.5 border-t-2 border-rose-500 rounded-t-full" /> // kiss mouth
                      ) : phase === 'hugging' ? (
                        <div className="w-3.5 h-2 bg-rose-400 rounded-b-full" /> // wide happy smile
                      ) : (
                        <div className="w-3 h-1.5 border-b-2 border-slate-700 rounded-b-full" /> // normal smile
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Body / Sweater */}
              <div className="w-16 h-12 bg-gradient-to-b from-indigo-500 to-sky-600 rounded-t-3xl border-t-2 border-white/20 shadow-inner flex items-center justify-center mt-[-2px]">
                <span className="text-[10px] font-black tracking-widest text-white/50">RUPESH</span>
              </div>
            </div>
          </motion.div>

          {/* VANSHIKA CHARACTER AVATAR */}
          <motion.div
            animate={
              phase === 'idle' ? { x: 65, y: 0, rotate: 0 } :
              phase === 'approaching' ? { x: 20, y: [0, -10, 0, -8, 0], transition: { duration: 1.5 } } :
              phase === 'hugging' ? { x: 6, y: 0, rotate: -5 } :
              phase === 'kissing' ? { x: 0, y: 4, rotate: -2 } : // slight bowing head to receive forehead kiss
              { x: 65, y: 0, rotate: 0, transition: { duration: 1.5 } } // releasing
            }
            className="absolute bottom-4 flex flex-col items-center z-10"
          >
            <div className="relative flex flex-col items-center">
              {/* Forehead Kiss Sparkle Indicator right on head */}
              <AnimatePresence>
                {phase === 'kissing' && hugStyle === 'forehead_kiss' && (
                  <motion.div
                    initial={{ scale: 0.1, y: 5, opacity: 0 }}
                    animate={{ scale: [1, 1.4, 1.2], y: -20, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-[-25px] z-40 flex flex-col items-center"
                  >
                    <span className="text-xl animate-bounce">💋</span>
                    <span className="text-[8px] bg-red-500 text-white font-extrabold px-1.5 py-0.2 rounded-full whitespace-nowrap shadow-md uppercase tracking-wider animate-pulse">
                      MUAHHH!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cheek Kiss Indicator */}
              <AnimatePresence>
                {phase === 'kissing' && hugStyle === 'cheek_kiss' && (
                  <motion.div
                    initial={{ scale: 0.1, opacity: 0 }}
                    animate={{ scale: 1.3, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-3 left-[-12px] z-40 text-lg"
                  >
                    💋
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Arm overlaying during hug */}
              {phase === 'hugging' && (
                <motion.div 
                  initial={{ rotate: 20, x: -5 }}
                  animate={{ rotate: -10, x: -10 }}
                  className="absolute left-[-8px] top-12 w-10 h-3 bg-pink-500 rounded-full origin-right z-30 border border-white/20"
                />
              )}

              {/* Head */}
              <div className="relative w-16 h-16">
                {/* Long Hair Backing (styled as background so the face stays beautiful white/gori) */}
                {faceMode !== 'photo' && (
                  <div className="absolute inset-x-[-4px] bottom-[-10px] top-3 bg-amber-950 rounded-b-2xl z-0" />
                )}

                {/* Crown / Tiara */}
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 text-sm z-30 animate-wiggle">👑</div>

                {/* Face/Head Circle */}
                <div className="w-16 h-16 rounded-full border-2 border-pink-400/50 relative shadow-md flex items-center justify-center bg-[#ffffff] z-10 overflow-hidden">
                  {faceMode === 'photo' ? (
                    <img src={vanshikaPhoto} alt="Vanshika" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-full animate-pulse-slow" />
                  ) : (
                    <>
                      {/* Hair Front Bangs */}
                      <div className="absolute top-0 left-0 right-0 h-5 bg-amber-950 rounded-b-lg" />
                      {/* Side curls */}
                      <div className="absolute left-[-1.5px] top-4 w-2.5 h-10 bg-amber-950 rounded-r-lg" />
                      <div className="absolute right-[-1.5px] top-4 w-2.5 h-10 bg-amber-950 rounded-l-lg" />

                      {/* Cute Hair bow */}
                      <div className="absolute top-1 right-2 text-[10px] z-20">🎀</div>

                      {/* Eyes */}
                      <div className="absolute top-7 left-3 flex gap-6 z-10">
                        <div className="w-2.5 h-2.5 flex items-center justify-center text-[10px] text-slate-800 font-bold">
                          {phase === 'kissing' ? '🥺' : phase === 'hugging' ? '🥰' : '👀'}
                        </div>
                        <div className="w-2.5 h-2.5 flex items-center justify-center text-[10px] text-slate-800 font-bold">
                          {phase === 'kissing' ? '🥺' : phase === 'hugging' ? '🥰' : '👀'}
                        </div>
                      </div>

                      {/* Deep blushing cheeks when hugged/kissed */}
                      <motion.span 
                        animate={phase === 'kissing' || phase === 'hugging' ? { scale: 1.8, opacity: 0.8 } : { scale: 1, opacity: 0.3 }}
                        className="absolute bottom-5 left-1.5 w-3 h-2 bg-pink-500 rounded-full blur-3xs" 
                      />
                      <motion.span 
                        animate={phase === 'kissing' || phase === 'hugging' ? { scale: 1.8, opacity: 0.8 } : { scale: 1, opacity: 0.3 }}
                        className="absolute bottom-5 right-1.5 w-3 h-2 bg-pink-500 rounded-full blur-3xs" 
                      />

                      {/* Mouth */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                        {phase === 'kissing' || phase === 'hugging' ? (
                          <div className="w-3.5 h-2 bg-rose-500 rounded-b-full border-t border-rose-300" /> // blushing smile
                        ) : (
                          <div className="w-3 h-1.5 border-b-2 border-slate-700 rounded-b-full" /> // small smile
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Body / Dress */}
              <div className="w-16 h-12 bg-gradient-to-b from-pink-500 to-rose-500 rounded-t-3xl border-t-2 border-white/20 shadow-inner flex items-center justify-center mt-[-2px] relative overflow-hidden">
                <span className="text-[9px] font-black tracking-widest text-white/60">VANSHIKA JI</span>
                {/* Hearts on dress */}
                <div className="absolute bottom-1 text-[8px] opacity-40">💖</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Styles & Configuration Controls */}
      <div className="w-full mt-4 space-y-4 z-10">
        
        {/* Style selection buttons */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest block">
            Select Cuddle Style
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { id: 'forehead_kiss', label: 'Forehead Kiss 💋', color: 'border-pink-400 text-pink-300 bg-pink-500/10' },
              { id: 'deep_cuddle', label: 'Healing Cuddle 🫂', color: 'border-rose-400 text-rose-300 bg-rose-500/10' },
              { id: 'bear_hug', label: 'Cozy Bear Hug 🧸', color: 'border-amber-400 text-amber-300 bg-amber-500/10' },
              { id: 'cheek_kiss', label: 'Cheek Kiss 😘', color: 'border-purple-400 text-purple-300 bg-purple-500/10' }
            ].map(style => (
              <button
                key={style.id}
                disabled={phase !== 'idle'}
                onClick={() => setHugStyle(style.id as HugStyle)}
                className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                  hugStyle === style.id 
                    ? `${style.color} scale-[1.03] shadow-[0_0_12px_rgba(244,63,94,0.3)] font-black` 
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5 text-zinc-300'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-zinc-400 italic font-medium">
            💡 {getStyleDescription()}
          </p>
        </div>

        {/* Real Face & Skin Customizer Section */}
        <div className="bg-white/5 rounded-2xl p-3 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Camera className="text-pink-400 shrink-0 animate-pulse" size={14} />
              <div>
                <label className="text-[10px] text-zinc-300 font-black uppercase tracking-widest block">
                  Face Style & Skin Glow 💖
                </label>
                <span className="text-[8px] text-zinc-400 font-bold block">
                  Customize Rupesh & Vanshika appearance
                </span>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <div className="flex bg-slate-950 rounded-lg p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setFaceMode('avatar');
                  localStorage.setItem('ruu_hug_face_mode', 'avatar');
                }}
                className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  faceMode === 'avatar'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Glow Avatar ✨
              </button>
              <button
                type="button"
                onClick={() => {
                  setFaceMode('photo');
                  localStorage.setItem('ruu_hug_face_mode', 'photo');
                }}
                className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  faceMode === 'photo'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Real Face 📸
              </button>
            </div>
          </div>

          {/* Photo mode uploads */}
          {faceMode === 'photo' && (
            <div className="space-y-2 animate-fade-in">
              <p className="text-[9px] text-zinc-400 font-semibold italic">
                Upload your real photos! They will sit beautifully on the animated avatars and hug/kiss each other.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Rupesh Photo Card */}
                <div className="bg-slate-950/40 p-2 rounded-xl border border-white/5 flex flex-col items-center space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300">Rupesh Ji Face</span>
                  <div className="relative w-11 h-11 rounded-full border border-indigo-400/40 overflow-hidden shadow">
                    <img src={rupeshPhoto} alt="Rupesh" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-1 w-full justify-center">
                    <label className="flex items-center justify-center p-1 bg-white/10 hover:bg-white/15 rounded-lg text-white transition-colors cursor-pointer text-[9px] flex-1 text-center font-bold">
                      <Upload size={10} className="mr-1" /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, 'rupesh')}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleResetPhoto('rupesh')}
                      className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg transition-colors cursor-pointer"
                      title="Reset to default"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>

                {/* Vanshika Photo Card */}
                <div className="bg-slate-950/40 p-2 rounded-xl border border-white/5 flex flex-col items-center space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-pink-300">Vanshika Ji Face</span>
                  <div className="relative w-11 h-11 rounded-full border border-pink-400/40 overflow-hidden shadow">
                    <img src={vanshikaPhoto} alt="Vanshika" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-1 w-full justify-center">
                    <label className="flex items-center justify-center p-1 bg-white/10 hover:bg-white/15 rounded-lg text-white transition-colors cursor-pointer text-[9px] flex-1 text-center font-bold">
                      <Upload size={10} className="mr-1" /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, 'vanshika')}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleResetPhoto('vanshika')}
                      className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg transition-colors cursor-pointer"
                      title="Reset to default"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Sweet Note Attachment Input Box */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest block flex items-center gap-1">
            <MessageCircle size={10} />
            <span>Attach a sweet whisper note (Optional)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. I am right here for you, my queen... rest well..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              disabled={phase !== 'idle'}
              maxLength={100}
              className="flex-1 bg-white/5 border border-white/10 focus:border-pink-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
            />
            
            {/* The Dispatch Button */}
            <button
              onClick={handleSendHug}
              disabled={phase !== 'idle'}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
            >
              <Send size={12} />
              <span>HUG!</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
