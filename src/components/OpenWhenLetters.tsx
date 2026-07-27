import React, { useState, useEffect } from 'react';
import { 
  Heart, Mail, Lock, Unlock, Check, Sparkles, BookOpen, 
  Smile, HelpCircle, Gift, Compass, ChevronRight, X, Play, RefreshCw 
} from 'lucide-react';
import { logActivity } from '../lib/activityLogger';
import { LoveConfig, StoryChapter, FavoriteMemory, OpenWhenLetter } from '../types';

interface OpenWhenLettersProps {
  config: LoveConfig;
  story: StoryChapter[];
  memories: FavoriteMemory[];
  letters: OpenWhenLetter[];
  onTriggerConfetti: () => void;
  onUnlockPasscodeChecked: () => boolean;
}

export default function OpenWhenLetters({
  config,
  story,
  memories,
  letters,
  onTriggerConfetti,
  onUnlockPasscodeChecked
}: OpenWhenLettersProps) {
  
  // Unlocked sections state for current session
  const [unlockedSections, setUnlockedSections] = useState<Record<string, boolean>>({});
  
  // Lockbox passcode prompt states
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Active open letters/Timeline view states
  const [openSectionContent, setOpenSectionContent] = useState<{
    id: string;
    title: string;
    emoji: string;
    type: string;
    content?: string;
  } | null>(null);

  // Breathing simulation state for "Sad" letter
  const [breathingPhase, setBreathingPhase] = useState<'In' | 'Hold' | 'Out'>('In');
  const [breathingTimer, setBreathingTimer] = useState(4);

  // Forgiveness Slider state for "Angry" letter
  const [angerValue, setAngerValue] = useState(0);

  // Hug counter for "Miss me" letter
  const [hugCount, setHugCount] = useState(0);
  const [loveDuration, setLoveDuration] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Coupon state for "Surprise" letter
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);

  // Special love coupons list
  const couponTemplates = [
    "🎫 One Night Cuddle Session Ticket (Ad-Free & Unlimited Warmth)",
    "🎫 Spontaneous Late Night Ice Cream Run Voucher (Any flavors she desires)",
    "🎫 10,000 Sweet Forehead Kisses Redeemable Coupon",
    "🎫 One Hour No-Interruption Back Massage Pass",
    "🎫 Romantic Dinner Date (Where you pick the place and I pick up the check) 🍝",
    "🎫 Free Forgiveness Slip (Instantly disarms any minor silly argument) 🕊️",
    "🎫 Midnight Drives & Playlist Jamming Session Ticket"
  ];

  // Love clock ticker (calculated since Anniversary Date, let's assume standard default starting date or custom)
  useEffect(() => {
    const anniversary = new Date('2023-11-22T00:00:00');
    
    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - anniversary.getTime();
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setLoveDuration({ days: d, hours: h, minutes: m, seconds: s });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Guided breathing ring cycle
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (openSectionContent?.type === 'sad') {
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev <= 1) {
            if (breathingPhase === 'In') {
              setBreathingPhase('Hold');
              return 4;
            } else if (breathingPhase === 'Hold') {
              setBreathingPhase('Out');
              return 4;
            } else {
              setBreathingPhase('In');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [openSectionContent, breathingPhase]);

  // Locked item specifications
  const drawers = [
    { id: 'story', title: 'Our Story', subtitle: 'Our beautiful timeline of love', emoji: '📖', type: 'story' },
    { id: 'memories', title: 'Favorite Memories', subtitle: 'The little things we hold close', emoji: '🌸', type: 'memories' },
    { id: 'special', title: "Why You're Special", subtitle: 'Things I love about you', emoji: '❤️', type: 'special' },
    { id: 'sad', title: "Open When You're Sad", subtitle: 'When you need a warm squeeze', emoji: '🫂', type: 'sad' },
    { id: 'angry', title: "Open When You're Angry", subtitle: 'Apologies & interactive cute healing', emoji: '🌷', type: 'angry' },
    { id: 'miss', title: "Open When You Miss Me", subtitle: 'Countdowns & virtual hugs', emoji: '💕', type: 'miss' },
    { id: 'apology', title: "My Apology Letter", subtitle: 'Deep words from my heart', emoji: '💌', type: 'apology' },
    { id: 'promises', title: 'Future Promises', subtitle: 'My lifetime promises to you', emoji: '✨', type: 'promises' },
    { id: 'surprise', title: 'Secret Surprise Coupon', subtitle: 'A digital scratch card of coupon gifts', emoji: '🎁', type: 'surprise' },
  ];

  const handleOpenClick = (id: string) => {
    if (unlockedSections[id]) {
      // Already unlocked, open directly
      const dr = drawers.find(d => d.id === id);
      if (dr) {
        setOpenSectionContent({
          id: dr.id,
          title: dr.title,
          emoji: dr.emoji,
          type: dr.type
        });
      }
    } else {
      // Show password prompt
      setActiveSectionId(id);
      setPasscodeInput('');
      setPasscodeError(false);
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanStr = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const targetClean = cleanStr(config.specialDate);
    const inputClean = cleanStr(passcodeInput);

    if (inputClean === targetClean || inputClean === '1122' || passcodeInput.trim() === config.specialDate) {
      if (activeSectionId) {
        setUnlockedSections({ ...unlockedSections, [activeSectionId]: true });
        const dr = drawers.find(d => d.id === activeSectionId);
        if (dr) {
          // Trigger reward effect
          onTriggerConfetti();
          setOpenSectionContent({
            id: dr.id,
            title: dr.title,
            emoji: dr.emoji,
            type: dr.type
          });
        }
      }
      setActiveSectionId(null);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 800);
    }
  };

  const generateRandomCoupon = () => {
    const idx = Math.floor(Math.random() * couponTemplates.length);
    setActiveCoupon(couponTemplates[idx]);
    onTriggerConfetti();
  };

  const handleVirtualHugClick = () => {
    setHugCount(prev => prev + 1);
    onTriggerConfetti();
    logActivity("Clicked Hug", `Total Hugs: ${hugCount + 1}`);
  };

  return (
    <div className="space-y-6" id="locked-sections-wrapper">
      
      {/* Grid of locked envelopes/drawers */}
      <div 
        id="drawers-grid"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {drawers.map((dr, index) => {
          const isUnlocked = unlockedSections[dr.id];
          return (
            <div
              key={dr.id}
              onClick={() => handleOpenClick(dr.id)}
              className={`relative cursor-pointer group glass-card rounded-2xl p-6 border transition-all duration-300 hover:scale-103 ${
                isUnlocked 
                  ? 'bg-gradient-to-tr from-pink-50/70 to-purple-50/70 border-pink-200/50 shadow-md' 
                  : 'bg-white/45 border-slate-100 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Dynamic Lock/Unlock indicator in top-right */}
              <div className="absolute top-4 right-4">
                {isUnlocked ? (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-pulse">
                    <Unlock size={12} />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-pink-100/60 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                    <Lock size={12} />
                  </div>
                )}
              </div>

              {/* Large styled icon */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-2xl mb-4 shadow-inner">
                {dr.emoji}
              </div>

              <h4 className="font-serif font-bold text-gray-800 text-base group-hover:text-pink-600 transition-colors">
                {dr.title}
              </h4>
              <p className="text-[11px] text-gray-400 mt-1 leading-normal font-medium">
                {dr.subtitle}
              </p>

              {/* Tiny bottom tag */}
              <div className="mt-4 pt-3 border-t border-dashed border-pink-100/40 flex items-center justify-between text-[10px] font-bold text-pink-500">
                <span>{isUnlocked ? "Read Letter" : "🔒 Section Locked"}</span>
                <ChevronRight size={12} className="group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* LOCKBOX PASSWORD CODE PROMPT MODAL */}
      {activeSectionId && (
        <div 
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          id="passcode-prompt-wrapper"
        >
          <div 
            id="password-keypad-card"
            className={`w-full max-w-sm glass-card bg-white/90 border border-pink-100 p-6 rounded-3xl shadow-xl text-center relative ${
              passcodeError ? 'animate-shake' : ''
            }`}
          >
            <button
              onClick={() => setActiveSectionId(null)}
              className="absolute top-4 right-4 w-7 h-7 hover:bg-pink-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={15} />
            </button>

            <span className="text-3xl mb-3 block animate-bounce text-pink-500">🗝️</span>
            
            <h3 className="font-serif font-bold text-lg text-gray-800 mb-1">
              Unlock secret section
            </h3>
            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-semibold mb-4 text-pink-500">
              For Girlfriend's eyes only
            </p>

            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter our special key..."
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className={`w-full py-2.5 px-4 rounded-xl border text-center font-bold text-sm bg-white focus:outline-none transition-all ${
                    passcodeError 
                      ? 'border-red-400 bg-red-50 text-red-600' 
                      : 'border-pink-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100'
                  }`}
                  autoFocus
                />
              </div>

              <div className="bg-pink-50/50 p-3 rounded-xl border border-pink-100/40 text-[10px] text-pink-600 font-medium italic">
                💡 Hint: {config.specialDateHint}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md cursor-pointer transition-colors"
              >
                Authenticate & Open
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEARTFELT LETTER DETAIL MODAL */}
      {openSectionContent && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in"
          id="letter-reveal-overlay"
        >
          <div 
            id="letter-parchment-sheet"
            className="w-full max-w-xl h-[85vh] bg-stone-50 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative border-4 border-double border-pink-300"
          >
            {/* Elegant classic serif letterhead header */}
            <div className="px-6 py-4 bg-gradient-to-r from-pink-100 to-purple-100 border-b border-pink-200/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{openSectionContent.emoji}</span>
                <span className="font-serif font-bold text-gray-800 text-sm">{openSectionContent.title}</span>
              </div>
              <button
                onClick={() => setOpenSectionContent(null)}
                className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Letter core content container with scroll context */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              
              {/* TIMELINE: OUR STORY 📖 */}
              {openSectionContent.type === 'story' && (
                <div className="space-y-8 py-2 animate-fade-in">
                  <div className="text-center">
                    <span className="text-xs uppercase font-mono tracking-widest text-pink-400 font-bold block mb-1">Our Journey</span>
                    <h3 className="font-serif text-2xl font-bold text-gray-800">Our Shared Notebook</h3>
                  </div>

                  <div className="relative border-l-2 border-dashed border-pink-200 pl-6 ml-4 space-y-8">
                    {story.map((chapter) => (
                      <div key={chapter.id} className="relative">
                        {/* Circle bullet on timeline */}
                        <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-pink-100 border-2 border-pink-400 flex items-center justify-center text-[7px]" />
                        
                        <div>
                          <span className="font-mono text-[9px] font-bold text-pink-400 uppercase tracking-widest block mb-0.5">
                            {chapter.date}
                          </span>
                          <h4 className="font-serif font-bold text-gray-700 text-sm mb-1.5 flex items-center gap-1">
                            <span>{chapter.title}</span>
                          </h4>
                          <p className="text-xs text-gray-500 leading-relaxed font-serif italic bg-white p-3.5 rounded-xl border border-pink-50 shadow-xs">
                            {chapter.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LIST: FAVORITE MEMORIES 🌸 */}
              {openSectionContent.type === 'memories' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-pink-400 font-bold block mb-1">Treasures</span>
                    <h3 className="font-serif text-2xl font-bold text-gray-800">Favorite Notebook Moments</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {memories.map((mem) => (
                      <div 
                        key={mem.id} 
                        className="bg-white p-4 rounded-xl border border-pink-100/40 shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow"
                      >
                        <span className="text-2xl mt-0.5">{mem.emoji}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-serif font-bold text-gray-700 text-sm">{mem.title}</h4>
                            <span className="text-[9px] bg-pink-50 text-pink-500 font-mono px-1.5 py-0.5 rounded font-semibold">{mem.date}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 font-serif leading-relaxed italic">
                            “{mem.description}”
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LIST: WHY YOU'RE SPECIAL ❤️ */}
              {openSectionContent.type === 'special' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-pink-400 font-bold block mb-1">My Affirmations</span>
                    <h3 className="font-serif text-2xl font-bold text-gray-800">Why You Are So Precious To Me</h3>
                  </div>

                  <div className="space-y-3 pt-2">
                    {config.reasonsWhySpecial.map((reas, index) => (
                      <div 
                        key={index} 
                        className="flex gap-3 items-start bg-white p-3.5 rounded-xl border border-pink-50 shadow-xs hover:border-pink-200 transition-colors"
                      >
                        <Heart size={15} fill="rgba(244, 63, 94, 0.7)" className="text-rose-500 shrink-0 mt-0.5 heart-pulsing" />
                        <span className="text-xs text-gray-600 font-bold leading-relaxed">{reas}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STANDARD LETTER RENDERING (FOR SAD, ANGRY, MISS, APOLOGY, PROMISES, SURPRISE) */}
              {['sad', 'angry', 'miss', 'apology', 'promises', 'surprise'].includes(openSectionContent.type) && (
                <div className="space-y-6 animate-fade-in font-serif italic text-sm text-gray-700 leading-relaxed max-w-md mx-auto">
                  
                  {/* Digital letter text inside paper block */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-pink-100 shadow-md font-serif text-base leading-relaxed text-gray-700 whitespace-pre-wrap font-handwritten text-xl leading-relaxed">
                    {letters.find(l => l.type === openSectionContent.type)?.letterText || "My Sweetheart, I love you incredibly."}
                  </div>

                  {/* SENDER SIGNATURE */}
                  <div className="text-right pr-4">
                    <span className="font-serif italic font-semibold text-gray-400 text-xs block">Yours forever and always,</span>
                    <span className="font-serif font-black text-rose-500 text-base">{config.coupleNameOne || "Us"} ❤️</span>
                  </div>

                  {/* INTERACTIVE COMPONENT - SAD: GUIDED DEEP BREATHING */}
                  {openSectionContent.type === 'sad' && (
                    <div className="bg-gradient-to-tr from-pink-50 to-purple-50 p-5 rounded-2xl border border-pink-200/40 text-center space-y-4 font-sans not-italic mt-6">
                      <h4 className="text-xs font-bold text-pink-700 flex items-center justify-center gap-1">
                        <Sparkles size={13} className="text-pink-500 animate-spin" />
                        <span>Let's Breathe Together, My Love 🧘‍♀️</span>
                      </h4>
                      <p className="text-[10px] text-gray-400">Watch the warm glowing circle and align your breathing</p>
                      
                      {/* Interactive pulsing breathing ball */}
                      <div className="relative flex items-center justify-center h-28 my-4">
                        <div 
                          className={`absolute rounded-full bg-pink-300/30 border-2 border-pink-400 flex items-center justify-center transition-all duration-3000 ${
                            breathingPhase === 'In' 
                              ? 'w-24 h-24' 
                              : breathingPhase === 'Hold' 
                                ? 'w-24 h-24 bg-pink-400/40' 
                                : 'w-12 h-12'
                          }`}
                        />
                        <div className="absolute font-sans font-bold text-xs text-pink-700">
                          {breathingPhase === 'In' && 'Breathe In 🌸'}
                          {breathingPhase === 'Hold' && 'Hold It... ✨'}
                          {breathingPhase === 'Out' && 'Breathe Out 🌬️'}
                          <div className="text-[8px] font-mono text-pink-500/85 mt-0.5">{breathingTimer}s</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* INTERACTIVE COMPONENT - ANGRY: APOLOGIZE-O-METER */}
                  {openSectionContent.type === 'angry' && (
                    <div className="bg-gradient-to-tr from-rose-50 to-pink-50 p-5 rounded-2xl border border-rose-100 text-center space-y-4 font-sans not-italic mt-6">
                      <h4 className="text-xs font-bold text-rose-700 flex items-center justify-center gap-1">
                        <Heart size={13} fill="currentColor" className="text-rose-500" />
                        <span>Apology & Anger Disarmer 🥺</span>
                      </h4>
                      <p className="text-[10px] text-gray-500">How much anger have you forgiven me for? Slide to cool off:</p>
                      
                      <div className="flex items-center gap-3 justify-center mb-1">
                        <span className="text-2xl select-none">
                          {angerValue < 30 ? '👿' : angerValue < 70 ? '🤔' : angerValue < 100 ? '🩹' : '🥰'}
                        </span>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={angerValue}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setAngerValue(val);
                            if (val === 100) {
                              onTriggerConfetti();
                            }
                          }}
                          className="w-48 h-1.5 bg-rose-200 accent-rose-500 cursor-pointer rounded-lg appearance-none"
                        />
                        <span className="text-xs font-mono font-bold text-rose-600">{angerValue}%</span>
                      </div>

                      <div className="text-xs font-bold text-rose-700 animate-pulse">
                        {angerValue === 0 && "I'm extremely sorry, my precious! 🥺"}
                        {angerValue > 0 && angerValue < 35 && "Still mad at me? I will do a cute dance of forgiveness 💃"}
                        {angerValue >= 35 && angerValue < 70 && "Slid to 35%+! Here is an imaginary flower coupon 🌷"}
                        {angerValue >= 70 && angerValue < 100 && "Getting warmer... almost there... 💕"}
                        {angerValue === 100 && "Yay! Overwhelming warmth! Sweetly Forgiven! 🥰"}
                      </div>
                    </div>
                  )}

                  {/* INTERACTIVE COMPONENT - MISS ME: LIVE ANNIVERSARY CLOCK & VIRTUAL HUGS */}
                  {openSectionContent.type === 'miss' && (
                    <div className="bg-gradient-to-tr from-pink-50 to-purple-50 p-5 rounded-2xl border border-pink-200/50 text-center space-y-4 font-sans not-italic mt-6">
                      <div>
                        <h4 className="text-xs font-bold text-pink-700 flex items-center justify-center gap-1 mb-1">
                          <Heart size={12} fill="currentColor" className="text-pink-500" />
                          <span>Love Ticker Timer</span>
                        </h4>
                        <div className="grid grid-cols-4 gap-1 select-none max-w-xs mx-auto text-pink-800">
                          <div className="bg-white/70 p-1.5 rounded-lg border border-pink-200/20">
                            <span className="font-mono font-black text-sm block leading-none">{loveDuration.days}</span>
                            <span className="text-[7px] font-mono uppercase tracking-widest text-pink-400">Days</span>
                          </div>
                          <div className="bg-white/70 p-1.5 rounded-lg border border-pink-200/20">
                            <span className="font-mono font-black text-sm block leading-none">{loveDuration.hours}</span>
                            <span className="text-[7px] font-mono uppercase tracking-widest text-pink-400">Hours</span>
                          </div>
                          <div className="bg-white/70 p-1.5 rounded-lg border border-pink-200/20">
                            <span className="font-mono font-black text-sm block leading-none">{loveDuration.minutes}</span>
                            <span className="text-[7px] font-mono uppercase tracking-widest text-pink-400">Mins</span>
                          </div>
                          <div className="bg-white/70 p-1.5 rounded-lg border border-pink-200/20">
                            <span className="font-mono font-black text-sm block leading-none">{loveDuration.seconds}</span>
                            <span className="text-[7px] font-mono uppercase tracking-widest text-pink-400">Secs</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-pink-100/40">
                        <p className="text-[10px] text-gray-400 mb-2">Send a heart virtual squeeze directly to me:</p>
                        <button
                          onClick={handleVirtualHugClick}
                          className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 mx-auto transition-all"
                        >
                          🤗 Send Virtual Hug
                        </button>
                        {hugCount > 0 && (
                          <div className="text-[10px] font-bold text-pink-500 mt-2 animate-bounce">
                            ❤ Hug Sent! Squeeze Counter: {hugCount}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* INTERACTIVE COMPONENT - PROMISES: LIFETIME BULLET BOX */}
                  {openSectionContent.type === 'promises' && (
                    <div className="space-y-3 pt-4 border-t border-pink-100/40 font-sans not-italic mt-6">
                      <h4 className="text-xs font-bold text-pink-700 flex items-center gap-1">
                        <Check size={13} className="text-emerald-500" />
                        <span>Sacred Future Promises Checklist</span>
                      </h4>
                      <div className="space-y-2">
                        {config.promises.map((prom, idx) => (
                          <div key={idx} className="flex gap-2.5 items-start bg-white p-3 rounded-xl border border-pink-50/60 shadow-xs">
                            <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] uppercase font-bold font-mono">✓</span>
                            <span className="text-xs text-gray-500 leading-normal font-medium">{prom}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* INTERACTIVE COMPONENT - SURPRISE: COUPON GENERATOR BOX */}
                  {openSectionContent.type === 'surprise' && (
                    <div className="bg-gradient-to-tr from-pink-50 to-purple-50 p-5 rounded-3xl border border-pink-200/50 text-center space-y-4 font-sans not-italic mt-6">
                      <h4 className="text-xs font-bold text-pink-700 flex items-center justify-center gap-1">
                        <Gift size={13} className="text-pink-500 animate-bounce" />
                        <span>Surprise Gift Coupon Booth 🎁</span>
                      </h4>
                      <p className="text-[10px] text-gray-400">Click below to claim an sweet couples voucher that I must redeem!</p>

                      <button
                        onClick={generateRandomCoupon}
                        className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer hover:scale-103 active:scale-95 flex items-center justify-center gap-1.5 mx-auto transition-all"
                      >
                        <RefreshCw size={13} />
                        <span>Dispense Random Date Vouchers</span>
                      </button>

                      {activeCoupon && (
                        <div 
                          className="bg-[#fffeee] border-2 border-dashed border-pink-200 p-4 rounded-xl shadow-inner text-amber-900 animate-slide-up"
                        >
                          <span className="text-[8px] font-mono uppercase tracking-widest text-amber-500 block mb-1">Coupon Issued</span>
                          <p className="font-serif italic font-bold text-sm tracking-tight">{activeCoupon}</p>
                          <span className="text-[8px] font-mono text-gray-400 block mt-2">Voucher Code: DATE-LOVE-{Date.now() % 100000}</span>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Modal action tray lock bottom */}
            <div className="px-6 py-4 bg-stone-100 border-t border-pink-200/50 flex justify-end">
              <button
                onClick={() => setOpenSectionContent(null)}
                className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md cursor-pointer transition-colors"
              >
                Close Envelope
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
