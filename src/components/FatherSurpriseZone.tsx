import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Mail, Lock, Unlock, Shield, Star, Smile, Gift, ChevronRight } from 'lucide-react';

// Import local photos as centerpiece
import photoTogetherGreen from '../assets/images/regenerated_image_1780655372225.jpg'; 
import photoMyEverythingRed from '../assets/images/regenerated_image_1780939152437.jpg';

interface FatherSurpriseZoneProps {
  onTriggerConfetti: () => void;
}

interface LearningCardProps {
  key?: React.Key;
  card: {
    id: number;
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    border: string;
  };
  idx: number;
  onTriggerConfetti: () => void;
}

function LearningCardSurprise({ card, idx, onTriggerConfetti }: LearningCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [typedTitle, setTypedTitle] = useState('');
  const [typedDesc, setTypedDesc] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isRevealed) {
      setTypedTitle('');
      setTypedDesc('');
      setIsTyping(false);
      return;
    }

    let isCancelled = false;
    const charSpeed = 40; // ms per char speed
    setIsTyping(true);

    const runTyping = async () => {
      // Type Title
      let currentTitle = '';
      for (let i = 0; i < card.title.length; i++) {
        if (isCancelled) return;
        currentTitle += card.title[i];
        setTypedTitle(currentTitle);
        await new Promise((resolve) => setTimeout(resolve, charSpeed));
      }

      await new Promise((resolve) => setTimeout(resolve, 150));

      // Type Description
      let currentDesc = '';
      for (let i = 0; i < card.description.length; i++) {
        if (isCancelled) return;
        currentDesc += card.description[i];
        setTypedDesc(currentDesc);
        await new Promise((resolve) => setTimeout(resolve, charSpeed - 15));
      }

      setIsTyping(false);
    };

    runTyping();

    return () => {
      isCancelled = true;
    };
  }, [isRevealed, card.title, card.description]);

  return (
    <AnimatePresence mode="wait">
      {!isRevealed ? (
        <motion.div
          key="gift-wrapper"
          onClick={() => {
            setIsRevealed(true);
            onTriggerConfetti();
          }}
          className="bg-gradient-to-br from-slate-950 via-slate-900 to-[#120524] border-2 border-dashed border-pink-500/25 rounded-2xl p-5 text-center flex flex-col items-center justify-center space-y-3 min-h-[175px] cursor-pointer group hover:border-pink-500/60 shadow-lg relative select-none overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
          transition={{ delay: idx * 0.1, duration: 0.4 }}
          whileHover={{ scale: 1.05, translateY: -2, boxShadow: "0 8px 25px rgba(236,72,153,0.15)" }}
        >
          {/* Pulsing glowing gift background */}
          <div className="absolute inset-0 bg-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
          
          <div className="relative">
            <div className="absolute -inset-2 rounded-full border border-pink-500/10 animate-ping opacity-40 pointer-events-none" />
            <div className="w-10 h-10 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-full flex items-center justify-center animate-bounce">
              <Gift className="w-5 h-5 text-pink-400" />
            </div>
          </div>

          <div className="space-y-1 z-10">
            <h4 className="font-sans text-[10px] uppercase font-bold tracking-widest text-pink-400">
              Value {idx + 1}
            </h4>
            <p className="text-[11px] text-zinc-400 font-medium">
              Touch to unwrap lesson
            </p>
          </div>
          
          <span className="text-[8px] text-pink-300 font-extrabold tracking-widest uppercase animate-pulse">
            ✨ UNWRAP ✨
          </span>
        </motion.div>
      ) : (
        <motion.div
          key="card-content"
          className={`bg-slate-900/40 border ${card.border} bg-gradient-to-b ${card.color} rounded-2xl p-5 text-center flex flex-col items-center justify-center space-y-2.5 shadow-lg relative min-h-[175px] group select-none`}
          initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
        >
          {/* Wrap Back Action */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsRevealed(false);
            }}
            className="absolute top-2 right-2 text-zinc-600 hover:text-pink-400 hover:scale-105 active:scale-95 text-[8px] uppercase font-black tracking-widest px-1.5 py-0.5 bg-slate-950/40 border border-zinc-800/60 rounded-full cursor-pointer transition-all"
            title="Wrap Back"
          >
            🎁 Wrap
          </button>

          <div className="w-11 h-11 bg-slate-950 border border-white/5 rounded-full flex items-center justify-center shadow-md animate-pulse">
            {card.icon}
          </div>
          
          <h4 className="font-sans text-xs uppercase tracking-widest font-black text-zinc-100 min-h-[16px] flex items-center justify-center">
            {typedTitle}
            {isTyping && typedTitle.length < card.title.length && (
              <span className="animate-pulse text-pink-500 ml-0.5">|</span>
            )}
          </h4>
          
          <p className="font-serif italic text-[11px] text-zinc-300 leading-normal min-h-[32px]">
            "{typedDesc}"
            {isTyping && typedTitle.length >= card.title.length && typedDesc.length < card.description.length && (
              <span className="animate-pulse text-amber-400 ml-0.5">|</span>
            )}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function FatherSurpriseZone({ onTriggerConfetti }: FatherSurpriseZoneProps) {
  // Opening flow state: false until unlocked via the glowing heart lock
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showUnlockingEffect, setShowUnlockingEffect] = useState(false);
  
  // Interaction states
  const [letterOpen, setLetterOpen] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [photo1Revealed, setPhoto1Revealed] = useState(false);
  const [photo2Revealed, setPhoto2Revealed] = useState(false);
  const [messageRevealed, setMessageRevealed] = useState(false);

  // Handwritten message typewriter states
  const [typedPara1, setTypedPara1] = useState('');
  const [typedPara2, setTypedPara2] = useState('');
  const [typedPara3, setTypedPara3] = useState('');
  const [typedPara4, setTypedPara4] = useState('');
  const [activeParaCursorField, setActiveParaCursorField] = useState<'p1' | 'p2' | 'p3' | 'p4' | 'none'>('none');
  const [messageTypingComplete, setMessageTypingComplete] = useState(false);
  const [skippedMessageTyping, setSkippedMessageTyping] = useState(false);

  const strPara1 = "Looking at these beautiful pictures, I can see how much love and warmth exists between you and your father.";
  const strPara2 = "The way you care for people... The way you worry when someone is upset... The way you always try to make others smile...";
  const strPara3 = "It tells me that you were raised with immense love. Today, I just want you to know that your father's efforts shine through you every single day.";
  const strPara4 = "You are truly one of the most beautiful souls I have ever known. Never stop being the kind-hearted person you are.";

  // Floating rose petals and golden particles elements
  const [petals, setPetals] = useState<{ id: number; left: number; delay: number; duration: number; size: number }[]>([]);
  const [goldSparks, setGoldSparks] = useState<{ id: number; top: number; left: number; scale: number; delay: number }[]>([]);

  // Generate petals and sparks on mount
  useEffect(() => {
    // 15 drifting petals
    const newPetals = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // random start horizontal
      delay: Math.random() * 8, // staggered onset
      duration: 10 + Math.random() * 15, // speed
      size: 12 + Math.random() * 18, // random visual weight
    }));
    setPetals(newPetals);

    // 25 stationary golden sparks
    const sparks = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      scale: 0.5 + Math.random() * 1.2,
      delay: Math.random() * 5,
    }));
    setGoldSparks(sparks);
  }, []);

  // Typewriter state variables
  const [typedUncle, setTypedUncle] = useState('');
  const [typedTitle, setTypedTitle] = useState('');
  const [typedIntro, setTypedIntro] = useState('');
  const [typedBullet1, setTypedBullet1] = useState('');
  const [typedBullet2, setTypedBullet2] = useState('');
  const [typedBullet3, setTypedBullet3] = useState('');
  const [typedBullet4, setTypedBullet4] = useState('');
  const [typedBody, setTypedBody] = useState('');
  const [typedWishes, setTypedWishes] = useState('');
  const [activeCursorField, setActiveCursorField] = useState<'uncle' | 'title' | 'intro' | 'b1' | 'b2' | 'b3' | 'b4' | 'body' | 'wishes' | 'none'>('none');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [skippedTyping, setSkippedTyping] = useState(false);

  const strUncle = "Dear Uncle,";
  const strTitle = "Happy Father's Day.";
  const strIntro = "Today isn't just about celebrating a father. It's about celebrating a man whose love, guidance, sacrifices and care helped create such a wonderful daughter.";
  const strBullet1 = "Every smile she shares.";
  const strBullet2 = "Every kind word she speaks.";
  const strBullet3 = "Every moment she worries for others.";
  const strBullet4 = "Every bit of strength she carries.";
  const strBody = "All of it reflects the values you gave her. Thank you for protecting her. Thank you for supporting her dreams. Thank you for teaching her kindness. And thank you for being the reason behind so many of her beautiful smiles.";
  const strWishes = "Wishing you happiness, health and endless love today and always.";

  useEffect(() => {
    if (!letterOpen) {
      setTypedUncle('');
      setTypedTitle('');
      setTypedIntro('');
      setTypedBullet1('');
      setTypedBullet2('');
      setTypedBullet3('');
      setTypedBullet4('');
      setTypedBody('');
      setTypedWishes('');
      setIsTypingComplete(false);
      setSkippedTyping(false);
      setActiveCursorField('none');
      return;
    }

    if (skippedTyping) {
      setTypedUncle(strUncle);
      setTypedTitle(strTitle);
      setTypedIntro(strIntro);
      setTypedBullet1(strBullet1);
      setTypedBullet2(strBullet2);
      setTypedBullet3(strBullet3);
      setTypedBullet4(strBullet4);
      setTypedBody(strBody);
      setTypedWishes(strWishes);
      setIsTypingComplete(true);
      setActiveCursorField('none');
      return;
    }

    let isCancelled = false;
    const charSpeed = 15; // ms per char

    const typeText = async (
      text: string, 
      setter: (val: string) => void, 
      fieldKey: 'uncle' | 'title' | 'intro' | 'b1' | 'b2' | 'b3' | 'b4' | 'body' | 'wishes'
    ) => {
      if (isCancelled || skippedTyping) return;
      setActiveCursorField(fieldKey);
      let current = '';
      for (let i = 0; i < text.length; i++) {
        if (isCancelled || skippedTyping) return;
        current += text[i];
        setter(current);
        await new Promise(resolve => setTimeout(resolve, charSpeed));
      }
    };

    const runSequentialTyping = async () => {
      await typeText(strUncle, setTypedUncle, 'uncle');
      if (isCancelled || skippedTyping) return;
      await new Promise(resolve => setTimeout(resolve, 200));

      await typeText(strTitle, setTypedTitle, 'title');
      if (isCancelled || skippedTyping) return;
      await new Promise(resolve => setTimeout(resolve, 200));

      await typeText(strIntro, setTypedIntro, 'intro');
      if (isCancelled || skippedTyping) return;
      await new Promise(resolve => setTimeout(resolve, 200));

      await typeText(strBullet1, setTypedBullet1, 'b1');
      if (isCancelled || skippedTyping) return;
      await new Promise(resolve => setTimeout(resolve, 150));

      await typeText(strBullet2, setTypedBullet2, 'b2');
      if (isCancelled || skippedTyping) return;
      await new Promise(resolve => setTimeout(resolve, 150));

      await typeText(strBullet3, setTypedBullet3, 'b3');
      if (isCancelled || skippedTyping) return;
      await new Promise(resolve => setTimeout(resolve, 150));

      await typeText(strBullet4, setTypedBullet4, 'b4');
      if (isCancelled || skippedTyping) return;
      await new Promise(resolve => setTimeout(resolve, 200));

      await typeText(strBody, setTypedBody, 'body');
      if (isCancelled || skippedTyping) return;
      await new Promise(resolve => setTimeout(resolve, 200));

      await typeText(strWishes, setTypedWishes, 'wishes');
      if (isCancelled || skippedTyping) return;
      
      setActiveCursorField('none');
      setIsTypingComplete(true);
    };

    runSequentialTyping();

    return () => {
      isCancelled = true;
    };
  }, [letterOpen, skippedTyping]);

  useEffect(() => {
    if (!messageRevealed) {
      setTypedPara1('');
      setTypedPara2('');
      setTypedPara3('');
      setTypedPara4('');
      setMessageTypingComplete(false);
      setSkippedMessageTyping(false);
      setActiveParaCursorField('none');
      return;
    }

    if (skippedMessageTyping) {
      setTypedPara1(strPara1);
      setTypedPara2(strPara2);
      setTypedPara3(strPara3);
      setTypedPara4(strPara4);
      setMessageTypingComplete(true);
      setActiveParaCursorField('none');
      return;
    }

    let isCancelled = false;
    const charSpeed = 15; // ms per char

    const typePara = async (
      text: string, 
      setter: (val: string) => void, 
      fieldKey: 'p1' | 'p2' | 'p3' | 'p4'
    ) => {
      if (isCancelled || skippedMessageTyping) return;
      setActiveParaCursorField(fieldKey);
      let current = '';
      for (let i = 0; i < text.length; i++) {
        if (isCancelled || skippedMessageTyping) return;
        current += text[i];
        setter(current);
        await new Promise(resolve => setTimeout(resolve, charSpeed));
      }
    };

    const runSequentialTyping = async () => {
      await typePara(strPara1, setTypedPara1, 'p1');
      if (isCancelled || skippedMessageTyping) return;
      await new Promise(resolve => setTimeout(resolve, 200));

      await typePara(strPara2, setTypedPara2, 'p2');
      if (isCancelled || skippedMessageTyping) return;
      await new Promise(resolve => setTimeout(resolve, 200));

      await typePara(strPara3, setTypedPara3, 'p3');
      if (isCancelled || skippedMessageTyping) return;
      await new Promise(resolve => setTimeout(resolve, 200));

      await typePara(strPara4, setTypedPara4, 'p4');
      if (isCancelled || skippedMessageTyping) return;
      
      setActiveParaCursorField('none');
      setMessageTypingComplete(true);
    };

    runSequentialTyping();

    return () => {
      isCancelled = true;
    };
  }, [messageRevealed, skippedMessageTyping]);

  // Handle heart click to trigger full reveal
  const handleHeartUnlock = () => {
    setShowUnlockingEffect(true);
    onTriggerConfetti();
    
    // Auto unmute global music if possible to start the piano loop
    if (typeof (window as any).__unmuteThemeMusic === 'function') {
      try {
        (window as any).__unmuteThemeMusic();
      } catch (err) {}
    }

    setTimeout(() => {
      setIsUnlocked(true);
      setShowUnlockingEffect(false);
      onTriggerConfetti();
    }, 1200);
  };

  const learningCards = [
    {
      id: 1,
      icon: <Smile className="text-pink-400 w-6 h-6" />,
      title: "Kindness",
      description: "A heart that always cares for others.",
      color: "from-pink-500/20 to-purple-500/10",
      border: "border-pink-500/35"
    },
    {
      id: 2,
      icon: <Shield className="text-amber-400 w-6 h-6" />,
      title: "Strength",
      description: "Standing strong during difficult times.",
      color: "from-amber-500/20 to-rose-500/10",
      border: "border-amber-500/35"
    },
    {
      id: 3,
      icon: <Star className="text-purple-400 w-6 h-6" />,
      title: "Positivity",
      description: "Finding reasons to smile even on hard days.",
      color: "from-[#8B5CF6]/20 to-[#EC4899]/10",
      border: "border-purple-500/35"
    },
    {
      id: 4,
      icon: <Heart className="text-rose-400 w-6 h-6" />,
      title: "Love",
      description: "Making people feel safe and valued.",
      color: "from-rose-500/20 to-purple-500/10",
      border: "border-rose-500/35"
    }
  ];

  return (
    <div className="relative w-full text-zinc-100 min-h-[500px]">
      
      {/* ─── SCENE 1: GLOWING HEART SECURE PASSAGE DOOR ─── */}
      <AnimatePresence>
        {!isUnlocked && (
          <motion.div 
            key="lock-screen"
            className="w-full flex flex-col items-center justify-center py-12 px-4 text-center space-y-8"
            exit={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Ambient golden orb behind the lock */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-500/10 blur-[90px] animate-pulse pointer-events-none" />
            
            <div className="relative">
              <motion.div 
                className={`w-36 h-36 rounded-full border-4 border-dashed border-pink-400/40 p-3 relative flex items-center justify-center cursor-pointer transition-all duration-[800ms] ${
                  showUnlockingEffect ? 'scale-125 rotate-45 border-amber-400' : 'hover:scale-105 hover:border-pink-500/80 shadow-[0_0_20px_rgba(236,72,153,0.15)] bg-slate-950/40'
                }`}
                onClick={handleHeartUnlock}
                animate={showUnlockingEffect ? { 
                  boxShadow: ["0 0 15px rgba(236,72,153,0.2)", "0 0 45px rgba(245,158,11,0.6)", "0 0 60px rgba(236,72,153,0.8)"] 
                } : {}}
              >
                {/* Rotating ring */}
                <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-pink-500 border-r-pink-500/40 animate-spin animate-duration-[4000ms]" />

                {showUnlockingEffect ? (
                  <motion.div
                    animate={{ scale: [1, 1.4, 0.8], rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Unlock className="w-16 h-16 text-amber-300 filter drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
                  </motion.div>
                ) : (
                  <Heart 
                    className="w-16 h-16 text-pink-500 animate-pulse cursor-pointer filter hover:text-rose-450 transition-colors drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" 
                    fill="currentColor"
                  />
                )}

                <span className="absolute bottom-2 text-[8px] tracking-[0.25em] font-black bg-black/80 text-pink-300 px-3 py-1 rounded-full border border-pink-500/20">
                  {showUnlockingEffect ? "OPENING..." : "TAP TO UNLOCK VOW"}
                </span>
              </motion.div>
              
              {/* Particle rings under physical lock */}
              <div className="absolute -inset-4 rounded-full border border-pink-500/10 scale-110 animate-ping opacity-30 pointer-events-none" />
            </div>

            <div className="space-y-3.5 max-w-sm mx-auto z-10">
              <span className="text-[10px] bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent uppercase tracking-[0.3em] font-black">
                ✨ HOLY SURPRISE PORTAL
              </span>
              <h3 className="font-serif text-2xl font-black text-white leading-tight">
                Her Hero : Father's Love
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                "A dedicated sanctuary honoring the beautiful connection that molded you. Tap the glowing heart above to unwrap the emotional celebration."
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── SCENE 2: PREMIUM SURPRISE VOW FULL REVEAL ─── */}
      {isUnlocked && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="space-y-12 pb-16 relative"
        >
          {/* Continuous floating golden star particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {goldSparks.map((spark) => (
              <div
                key={spark.id}
                className="absolute w-1.5 h-1.5 rounded-full bg-amber-400/60 blur-[1px] animate-pulse"
                style={{
                  top: `${spark.top}%`,
                  left: `${spark.left}%`,
                  transform: `scale(${spark.scale})`,
                  animationDelay: `${spark.delay}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
            
            {/* Drifting pink rose petals */}
            {petals.map((petal) => (
              <div
                key={petal.id}
                className="absolute text-rose-500/30 font-serif select-none pointer-events-none pointer-events-none animate-drifting-petals text-lg"
                style={{
                  left: `${petal.left}%`,
                  top: `-10%`,
                  fontSize: `${petal.size}px`,
                  animationDelay: `${petal.delay}s`,
                  animationDuration: `${petal.duration}s`,
                }}
              >
                🌸
              </div>
            ))}
          </div>

          {/* Style snippet to handle custom drifting petals animation */}
          <style>{`
            @keyframes driftPetals {
              0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
              10% { opacity: 0.8; }
              90% { opacity: 0.8; }
              100% { transform: translateY(750px) translateX(120px) rotate(360deg); opacity: 0; }
            }
            .animate-drifting-petals {
              animation: driftPetals 16s linear infinite;
            }
          `}</style>

          {/* ────── SECTION HEADER ────── */}
          <div className="text-center space-y-3 relative z-10 pt-2 select-none">
            <motion.div 
              className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-300 font-extrabold text-[9px] uppercase tracking-[0.2em] shadow-sm animate-pulse"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span>🌹</span>
              <span>PATRIARCH'S BEAUTIFUL BLOOM</span>
              <span>👑</span>
            </motion.div>

            <motion.h2 
              className="font-serif text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-amber-200 via-rose-300 to-pink-300 bg-clip-text leading-tight tracking-wide filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.15)]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              The Hero Behind Her Smile
            </motion.h2>

            <motion.p 
              className="text-xs md:text-sm text-pink-200/80 font-serif italic max-w-xl mx-auto leading-relaxed px-4 text-center mt-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              "Before anyone else protected her, encouraged her, and believed in her... there was always one person standing quietly behind her dreams."
            </motion.p>
          </div>

          {/* ────── CENTERPIECE MEMORY GALLERY ────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto px-4 relative z-10">
            
            {/* PHOTO 1 FRAME: Together Green top */}
            {!photo1Revealed ? (
              <motion.div 
                key="gift-1"
                className="bg-gradient-to-br from-slate-950 via-slate-900 to-[#1e152a] border-[3px] border-dashed border-amber-500/35 p-6 rounded-[32px] shadow-[0_15px_35px_rgba(245,158,11,0.12)] cursor-pointer relative group transition-all flex flex-col items-center justify-center text-center space-y-6 min-h-[420px] select-none overflow-hidden"
                initial={{ x: -40, opacity: 0, rotate: -2 }}
                animate={{ x: 0, opacity: 1, rotate: -1 }}
                whileHover={{ scale: 1.05, rotate: 1, borderColor: "rgba(245,158,11,0.75)", boxShadow: "0 0 35px rgba(245,158,11,0.25)" }}
                onClick={() => {
                  setPhoto1Revealed(true);
                  onTriggerConfetti();
                }}
              >
                {/* Decorative background orbs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-500/5 blur-[50px] group-hover:bg-amber-500/10 pointer-events-none" />
                
                {/* Ribbon Wrap & Emblem */}
                <div className="relative">
                  {/* Outer breathing ring */}
                  <div className="absolute -inset-4 rounded-full border border-amber-500/20 animate-ping opacity-60 pointer-events-none" />
                  
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 border-2 border-amber-400 p-1 flex items-center justify-center shadow-[0_4px_15px_rgba(245,158,11,0.4)] relative">
                    <Gift className="w-12 h-12 text-white animate-bounce drop-shadow-md" />
                  </div>
                </div>

                <div className="space-y-3.5 z-10 max-w-[240px]">
                  <span className="text-[9px] bg-gradient-to-r from-amber-300 to-rose-450 px-2.5 py-1 rounded-full text-white font-extrabold uppercase tracking-[0.2em] shadow-sm border border-amber-300/10">
                    🎁 SACRED MOMENT
                  </span>
                  <h4 className="font-serif text-lg font-black text-transparent bg-gradient-to-r from-amber-100 to-rose-200 bg-clip-text leading-tight">
                    Untie Precious Surprise
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                    A beautiful daughter-father candid photo is wrapped inside. Touch to unwrap!
                  </p>
                </div>
                
                {/* Pulse hint */}
                <span className="text-[10px] text-amber-300 font-extrabold tracking-widest uppercase animate-pulse">
                  ✨ TAP TO UNWRAP ✨
                </span>
              </motion.div>
            ) : (
              <motion.div 
                key="photo-1"
                className="bg-slate-900/90 border-2 border-amber-500/20 p-3 pb-6 rounded-[32px] shadow-[0_15px_35px_rgba(245,158,11,0.15)] cursor-pointer overflow-hidden transform relative group transition-all"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 12 }}
                whileHover={{ scale: 1.04, rotate: 0, borderColor: "rgba(245,158,11,0.5)", boxShadow: "0 20px 45px rgba(245,158,11,0.3)" }}
                onClick={onTriggerConfetti}
              >
                {/* Re-wrap button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhoto1Revealed(false);
                  }}
                  className="absolute bottom-16 right-4 z-20 bg-slate-950/80 hover:bg-slate-950 text-amber-300 text-[9px] uppercase font-black tracking-wider border border-amber-500/30 rounded-full px-2.5 py-1 cursor-pointer transition-colors"
                  title="Wrap Back"
                >
                  🎁 Wrap Back
                </button>

                {/* Star sparkle decoration overlay */}
                <div className="absolute top-2 right-2 text-amber-400 opacity-25 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  <Sparkles size={16} className="animate-pulse" />
                </div>
                
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-slate-950/60 relative">
                  <img 
                    src={photoTogetherGreen} 
                    alt="Vanshika and her Father together smiling beautifully" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                    referrerPolicy="no-referrer"
                  />
                  {/* Vintage overlay shimmer and shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                {/* Elegant Hand-written styled label */}
                <div className="mt-4 text-center">
                  <p className="font-serif italic font-bold text-base text-amber-300 group-hover:text-amber-200 transition-colors tracking-wide">
                    🌹 "My Everything"
                  </p>
                  <span className="text-[9px] font-mono tracking-widest text-zinc-500 font-black uppercase mt-1 block">
                    Candid Fatherly Warmth
                  </span>
                </div>
              </motion.div>
            )}

            {/* PHOTO 2 FRAME: Maroon Dress My Everything */}
            {!photo2Revealed ? (
              <motion.div 
                key="gift-2"
                className="bg-gradient-to-br from-slate-950 via-slate-900 to-[#27131e] border-[3px] border-dashed border-pink-500/35 p-6 rounded-[32px] shadow-[0_15px_35px_rgba(236,72,153,0.12)] cursor-pointer relative group transition-all flex flex-col items-center justify-center text-center space-y-6 min-h-[420px] select-none overflow-hidden"
                initial={{ x: 40, opacity: 0, rotate: 2 }}
                animate={{ x: 0, opacity: 1, rotate: 1 }}
                whileHover={{ scale: 1.05, rotate: -1, borderColor: "rgba(236,72,153,0.75)", boxShadow: "0 0 35px rgba(236,72,153,0.25)" }}
                onClick={() => {
                  setPhoto2Revealed(true);
                  onTriggerConfetti();
                }}
              >
                {/* Decorative background orbs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-pink-500/5 blur-[50px] group-hover:bg-pink-500/10 pointer-events-none" />
                
                {/* Ribbon Wrap & Emblem */}
                <div className="relative">
                  {/* Outer breathing ring */}
                  <div className="absolute -inset-4 rounded-full border border-pink-500/20 animate-ping opacity-60 pointer-events-none" />
                  
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 border-2 border-pink-400 p-1 flex items-center justify-center shadow-[0_4px_15px_rgba(236,72,153,0.4)] relative">
                    <Gift className="w-12 h-12 text-white animate-bounce drop-shadow-md" />
                  </div>
                </div>

                <div className="space-y-3.5 z-10 max-w-[240px]">
                  <span className="text-[9px] bg-gradient-to-r from-pink-350 to-purple-400 px-2.5 py-1 rounded-full text-white font-extrabold uppercase tracking-[0.2em] shadow-sm border border-pink-300/10">
                    💖 HEROIC TRIBUTE
                  </span>
                  <h4 className="font-serif text-lg font-black text-transparent bg-gradient-to-r from-pink-100 to-purple-200 bg-clip-text leading-tight">
                    Untie Eternal Anchor
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                    A celestial fatherly connection snapshot is hidden inside. Touch to open!
                  </p>
                </div>
                
                {/* Pulse hint */}
                <span className="text-[10px] text-pink-300 font-extrabold tracking-widest uppercase animate-pulse">
                  ✨ TAP TO UNWRAP ✨
                </span>
              </motion.div>
            ) : (
              <motion.div 
                key="photo-2"
                className="bg-slate-900/90 border-2 border-pink-500/20 p-3 pb-6 rounded-[32px] shadow-[0_15px_35px_rgba(236,72,153,0.15)] cursor-pointer overflow-hidden transform relative group transition-all"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 12 }}
                whileHover={{ scale: 1.04, rotate: 0, borderColor: "rgba(236,72,153,0.5)", boxShadow: "0 20px 45px rgba(236,72,153,0.3)" }}
                onClick={onTriggerConfetti}
              >
                {/* Re-wrap button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhoto2Revealed(false);
                  }}
                  className="absolute bottom-16 right-4 z-20 bg-slate-950/80 hover:bg-slate-950 text-pink-300 text-[9px] uppercase font-black tracking-wider border border-pink-500/30 rounded-full px-2.5 py-1 cursor-pointer transition-colors"
                  title="Wrap Back"
                >
                  🎁 Wrap Back
                </button>

                {/* Heart decoration overlay */}
                <div className="absolute top-2 right-2 text-pink-400 opacity-25 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  <Heart size={15} fill="rgba(244,63,94,0.4)" className="animate-pulse" />
                </div>

                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-slate-950/60 relative">
                  <img 
                    src={photoMyEverythingRed} 
                    alt="Vanshika and her Father looking majestic" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                    referrerPolicy="no-referrer"
                  />
                  {/* Vintage overlay shimmer and shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                {/* Elegant Hand-written styled label */}
                <div className="mt-4 text-center">
                  <p className="font-serif italic font-bold text-base text-pink-300 group-hover:text-pink-200 transition-colors tracking-wide">
                    💖 "A Daughter's Safe Place"
                  </p>
                  <span className="text-[9px] font-mono tracking-widest text-zinc-500 font-black uppercase mt-1 block">
                    Protector & First Hero
                  </span>
                </div>
              </motion.div>
            )}

          </div>

          {/* ────── BUTTON & DEPRECATING ACCENT: HIDDEN FATHER'S LETTER ────── */}
          <div className="text-center relative z-10 select-none px-4">
            <button
              onClick={() => {
                setLetterOpen(!letterOpen);
                onTriggerConfetti();
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-full shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] border border-amber-300/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Heart size={14} className="fill-current animate-pulse" />
              <span>{letterOpen ? "Close Father's Letter" : "❤️ Open Father's Day Letter"}</span>
            </button>

            {/* Glowing reveals Father's letter */}
            <AnimatePresence>
              {letterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="max-w-xl mx-auto mt-6 text-left overflow-hidden bg-[#0a0715]/90 border-2 border-dashed border-amber-500/30 rounded-[35px] shadow-[inset_0_1px_15px_rgba(245,158,11,0.08)] relative"
                >
                  {/* Subtle watermarked vector flower behind */}
                  <div className="absolute bottom-4 right-4 text-6xl opacity-[0.03] select-none">🌹</div>
                  
                  {/* Skip Animation utility badge */}
                  {!isTypingComplete && !skippedTyping && (
                    <div className="absolute top-4 right-4 z-20">
                      <button
                        type="button"
                        onClick={() => setSkippedTyping(true)}
                        className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-extrabold text-[10px] uppercase tracking-widest border border-amber-500/20 rounded-full cursor-pointer transition-colors active:scale-95"
                      >
                        ⚡ Skip Animation
                      </button>
                    </div>
                  )}

                  <div className="p-6 md:p-8 space-y-4 font-serif text-sm md:text-base leading-relaxed text-zinc-200 indent-2">
                    {/* Header text with cursor */}
                    {(typedUncle || activeCursorField === 'uncle') && (
                      <p className="font-extrabold text-amber-300 text-lg border-b border-amber-500/10 pb-2 select-text">
                        {typedUncle}
                        {activeCursorField === 'uncle' && <span className="animate-pulse text-amber-300 ml-0.5">|</span>}
                      </p>
                    )}
                    
                    {(typedTitle || activeCursorField === 'title') && (
                      <p className="italic font-medium text-pink-250 select-text">
                        {typedTitle}
                        {activeCursorField === 'title' && <span className="animate-pulse text-pink-300 ml-0.5">|</span>}
                      </p>
                    )}
                    
                    {(typedIntro || activeCursorField === 'intro') && (
                      <p className="text-zinc-300 select-text">
                        {typedIntro}
                        {activeCursorField === 'intro' && <span className="animate-pulse text-amber-200 ml-0.5">|</span>}
                      </p>
                    )}
                    
                    {/* Bullet list renders progressively as items are typed */}
                    {(typedBullet1 || activeCursorField === 'b1' || typedBullet2 || activeCursorField === 'b2' || typedBullet3 || activeCursorField === 'b3' || typedBullet4 || activeCursorField === 'b4') && (
                      <ul className="space-y-2 py-1 select-text border-l-2 border-amber-500/25 pl-4 ml-2">
                        {(typedBullet1 || activeCursorField === 'b1') && (
                          <li className="flex items-center gap-2">
                            <span className="text-amber-400">✨</span>
                            <span>
                              {typedBullet1}
                              {activeCursorField === 'b1' && <span className="animate-pulse text-amber-300 ml-0.5">|</span>}
                            </span>
                          </li>
                        )}
                        {(typedBullet2 || activeCursorField === 'b2') && (
                          <li className="flex items-center gap-2">
                            <span className="text-amber-400">✨</span>
                            <span>
                              {typedBullet2}
                              {activeCursorField === 'b2' && <span className="animate-pulse text-amber-300 ml-0.5">|</span>}
                            </span>
                          </li>
                        )}
                        {(typedBullet3 || activeCursorField === 'b3') && (
                          <li className="flex items-center gap-2">
                            <span className="text-amber-400">✨</span>
                            <span>
                              {typedBullet3}
                              {activeCursorField === 'b3' && <span className="animate-pulse text-amber-300 ml-0.5">|</span>}
                            </span>
                          </li>
                        )}
                        {(typedBullet4 || activeCursorField === 'b4') && (
                          <li className="flex items-center gap-2">
                            <span className="text-amber-400">✨</span>
                            <span>
                              {typedBullet4}
                              {activeCursorField === 'b4' && <span className="animate-pulse text-amber-300 ml-0.5">|</span>}
                            </span>
                          </li>
                        )}
                      </ul>
                    )}

                    {(typedBody || activeCursorField === 'body') && (
                      <p className="text-zinc-300 pt-1 select-text">
                        {typedBody}
                        {activeCursorField === 'body' && <span className="animate-pulse text-pink-400 ml-0.5">|</span>}
                      </p>
                    )}

                    {(typedWishes || activeCursorField === 'wishes') && (
                      <p className="font-semibold text-amber-200 select-text">
                        {typedWishes}
                        {activeCursorField === 'wishes' && <span className="animate-pulse text-amber-300 ml-0.5">|</span>}
                      </p>
                    )}

                    <div className="pt-4 border-t border-amber-100/10 flex justify-between items-center text-xs text-zinc-500 select-none">
                      <span className="font-mono uppercase font-black tracking-widest text-[#ff5da5]">
                        🌸 HONORED SURPRISE
                      </span>
                      <span className="font-bold italic text-amber-300 text-sm">
                        🌹 Happy Father's Day
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ────── WHAT SHE LEARNED FROM HER FATHER CARDS ────── */}
          <div className="space-y-6 max-w-3xl mx-auto px-4 relative z-10">
            <div className="text-center select-none">
              <span className="text-[10px] uppercase font-black tracking-widest text-pink-400 leading-none">
                GUIDING LIGHT & VALUES
              </span>
              <h3 className="font-serif text-lg font-black text-white mt-1">
                🌟 What She Learned From Her Father
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {learningCards.map((card, idx) => (
                <LearningCardSurprise
                  key={card.id}
                  card={card}
                  idx={idx}
                  onTriggerConfetti={onTriggerConfetti}
                />
              ))}
            </div>
          </div>

          {/* ────── SPECIAL HANDWRITTEN GLOWING MESSAGE FOR HER ────── */}
          <div className="px-4 max-w-xl mx-auto relative z-10 select-none">
            {!messageRevealed ? (
              <motion.div 
                key="gift-message"
                className="bg-gradient-to-br from-slate-950 via-slate-900 to-[#1d0d1e] border-[3px] border-dashed border-pink-500/35 p-6 md:p-8 rounded-[35px] shadow-[0_15px_35px_rgba(236,72,153,0.12)] cursor-pointer relative group transition-all flex flex-col items-center justify-center text-center space-y-6 min-h-[300px] select-none overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.04, borderColor: "rgba(236,72,153,0.75)", boxShadow: "0 0 35px rgba(236,72,153,0.25)" }}
                onClick={() => {
                  setMessageRevealed(true);
                  onTriggerConfetti();
                }}
              >
                {/* Decorative background orbs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-pink-500/5 blur-[50px] group-hover:bg-pink-500/10 pointer-events-none" />
                
                {/* Ribbon Wrap & Emblem */}
                <div className="relative">
                  {/* Outer breathing ring */}
                  <div className="absolute -inset-4 rounded-full border border-pink-500/20 animate-ping opacity-60 pointer-events-none" />
                  
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 border-2 border-pink-400 p-1 flex items-center justify-center shadow-[0_4px_15px_rgba(236,72,153,0.4)] relative">
                    <Gift className="w-10 h-10 text-white animate-bounce drop-shadow-md" />
                  </div>
                </div>

                <div className="space-y-3 z-10 max-w-sm">
                  <span className="text-[9px] bg-gradient-to-r from-pink-300 to-rose-400 px-2.5 py-1 rounded-full text-white font-extrabold uppercase tracking-[0.2em] shadow-sm border border-pink-300/10">
                    💖 EXQUISITE REFLECTION
                  </span>
                  <h4 className="font-serif text-lg font-black text-transparent bg-gradient-to-r from-pink-100 to-rose-200 bg-clip-text leading-tight">
                    Open Special Message for Taru Radhe Ji
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                    A celestial, comforting validation of your kind-hearted nature and your beautiful father-daughter bond is typed just for you.
                  </p>
                </div>
                
                {/* Pulse hint */}
                <span className="text-[10px] text-pink-300 font-extrabold tracking-widest uppercase animate-pulse">
                  ✨ TOUCH TO UNVELVET MY HEART ✨
                </span>
              </motion.div>
            ) : (
              <motion.div 
                key="revealed-message"
                className="bg-gradient-to-br from-[#130d22] to-[#0a0512] border-2 border-pink-500/30 rounded-[35px] p-6 md:p-8 text-center space-y-4 shadow-[0_10px_35px_rgba(236,72,153,0.18)] border-t-pink-400 transform -rotate-1 hover:rotate-0 transition-all duration-500 relative"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 12 }}
              >
                {/* Actions row */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  {!messageTypingComplete && !skippedMessageTyping && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSkippedMessageTyping(true);
                      }}
                      className="px-2.5 py-1 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 font-extrabold text-[9px] uppercase tracking-wider border border-pink-500/20 rounded-full cursor-pointer transition-colors active:scale-95"
                    >
                      ⚡ Skip
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMessageRevealed(false);
                    }}
                    className="px-2.5 py-1 bg-slate-950/80 hover:bg-slate-950 text-pink-300 text-[9px] uppercase font-black tracking-wider border border-pink-500/30 rounded-full cursor-pointer transition-colors active:scale-95"
                    title="Wrap Back"
                  >
                    🎁 Wrap Back
                  </button>
                </div>

                <span className="text-3xl filter drop-shadow animate-bounce">💖</span>
                
                <h3 className="font-serif text-lg font-black text-transparent bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text">
                  To Taru Radhe Ji
                </h3>

                <div className="font-serif italic text-xs md:text-[13px] leading-relaxed text-pink-100/90 text-center space-y-3.5 max-w-md mx-auto">
                  {(typedPara1 || activeParaCursorField === 'p1') && (
                    <p>
                      "{typedPara1}"
                      {activeParaCursorField === 'p1' && <span className="animate-pulse text-pink-400 ml-0.5">|</span>}
                    </p>
                  )}
                  {(typedPara2 || activeParaCursorField === 'p2') && (
                    <p>
                      "{typedPara2}"
                      {activeParaCursorField === 'p2' && <span className="animate-pulse text-pink-400 ml-0.5">|</span>}
                    </p>
                  )}
                  {(typedPara3 || activeParaCursorField === 'p3') && (
                    <p>
                      "{typedPara3}"
                      {activeParaCursorField === 'p3' && <span className="animate-pulse text-pink-400 ml-0.5">|</span>}
                    </p>
                  )}
                  {(typedPara4 || activeParaCursorField === 'p4') && (
                    <p className="font-bold text-amber-300 text-sm filter drop-shadow">
                      "{typedPara4}"
                      {activeParaCursorField === 'p4' && <span className="animate-pulse text-amber-300 ml-0.5">|</span>}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <span className="inline-block w-8 h-0.5 bg-gradient-to-r from-pink-500 via-rose-500 to-transparent" />
                </div>
              </motion.div>
            )}
          </div>

          {/* ────── FINAL EMOTIONAL BOX / ENVELOPE ────── */}
          <div className="text-center relative z-10 select-none px-4 space-y-4">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-black animate-pulse">
              🎁 Click below to open deep final seal
            </p>

            <div className="flex justify-center">
              <motion.div 
                className={`w-20 h-20 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-400/40 hover:border-pink-500 flex items-center justify-center cursor-pointer transition-all shadow-[0_0_20px_rgba(236,72,153,0.1)] relative ${
                  envelopeOpen ? 'scale-90 bg-slate-950/80' : 'hover:scale-105 animate-bounce'
                }`}
                onClick={() => {
                  setEnvelopeOpen(!envelopeOpen);
                  onTriggerConfetti();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-4xl filter drop-shadow animate-pulse">✉️</span>
              </motion.div>
            </div>

            <AnimatePresence>
              {envelopeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-lg mx-auto bg-slate-950/90 border border-pink-500/25 p-6 rounded-[28px] shadow-2xl relative space-y-5 text-center"
                >
                  <p className="font-serif italic text-xs leading-relaxed text-zinc-300 max-w-sm mx-auto space-y-1 block">
                    <span>"Sometimes people leave memories behind... But some people become memories themselves. And those memories stay forever."</span>
                    <span className="block pt-2 text-[#ff5dd5] font-bold">"Thank you for every smile."</span>
                    <span className="block text-[#ff5dd5] font-bold">"Thank you for every moment."</span>
                    <span className="block text-[#ff5dd5] font-bold">"Thank you for being you."</span>
                  </p>

                  {/* Devotional Surrender Message Highlight */}
                  <div className="my-4 py-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border border-amber-500/30 rounded-2xl px-4 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                    <p className="font-serif text-xs font-black text-amber-300 tracking-normal text-center leading-relaxed">
                      🕉️ "SAB KUCH SHYAM BABA JI OR KRISHN JI PAR CHOR DO RADHE JI" 🙏
                    </p>
                  </div>

                  <div className="pt-4 border-t border-pink-500/10 space-y-2">
                    <h4 className="font-serif text-pink-400 text-base font-black tracking-wide flex items-center justify-center gap-1 shrink-0 animate-pulse">
                      <span>❤️</span>
                      <span>"Please Come Back, Taru Radhe Ji"</span>
                      <span>❤️</span>
                    </h4>
                    
                    <p className="text-[10px] font-sans font-semibold text-zinc-400 max-w-sm mx-auto leading-relaxed">
                      "This little corner of my heart still remembers your smile, your care, and the warmth you brought into my life." 🌹
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      )}

    </div>
  );
}
