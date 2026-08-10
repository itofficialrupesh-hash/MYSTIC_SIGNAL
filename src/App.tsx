import React, { useState, useEffect } from 'react';
import { 
  Heart, Sparkles, Image as ImageIcon, Settings, 
  HelpCircle, Gift, Mail, BookOpen, Music as MusicIcon, 
  Trash2, Plus, LogOut, Check 
} from 'lucide-react';

// Core Sub-components
import FloatingParticles from './components/FloatingParticles';
import MusicPlayer from './components/MusicPlayer';
import LandingPage from './components/LandingPage';
import SecretAdmin from './components/SecretAdmin';
import PolaroidGallery from './components/PolaroidGallery';
import OpenWhenLetters from './components/OpenWhenLetters';
import SecretRoom from './components/SecretRoom';
import LovelyLogo from './components/LovelyLogo';
import NeonTextHeart from './components/NeonTextHeart';
import SecretApologyZone from './components/SecretApologyZone';
import BestieZone from './components/BestieZone';
import BestiePasscodeLock from './components/BestiePasscodeLock';
import PeriodHub from './components/PeriodHub';
import PeriodHubLock from './components/PeriodHubLock';
import PrivateChat from './components/PrivateChat';
import VirtualHug from './components/VirtualHug';

// Types and Defaults
import { LoveConfig, MemoryPhoto, StoryChapter, FavoriteMemory, OpenWhenLetter } from './types';
import { 
  DEFAULT_CONFIG, DEFAULT_PHOTOS, DEFAULT_STORY, 
  DEFAULT_MEMORIES, DEFAULT_LETTERS 
} from './defaultData';

interface RisingHeart {
  id: string;
  x: number;
  drift: string;
  rot: string;
  scale: number;
  duration: string;
  color: string;
}

export default function App() {
  // Authentication states
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Persistent Customization States
  const [config, setConfig] = useState<LoveConfig>(DEFAULT_CONFIG);
  const [photos, setPhotos] = useState<MemoryPhoto[]>(DEFAULT_PHOTOS);
  const [story, setStory] = useState<StoryChapter[]>(DEFAULT_STORY);
  const [memories, setMemories] = useState<FavoriteMemory[]>(DEFAULT_MEMORIES);
  const [letters, setLetters] = useState<OpenWhenLetter[]>(DEFAULT_LETTERS);

  // UI States
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminPassModalOpen, setIsAdminPassModalOpen] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminPassError, setAdminPassError] = useState(false);
  const [activeTab, setActiveTab] = useState<'safekeep' | 'gallery' | 'secret-room' | 'bestie-zone' | 'period-hub' | 'chat'>('safekeep');
  const [homeSubView, setHomeSubView] = useState<'letters' | 'bestie'>('letters');
  const [heartsList, setHeartsList] = useState<RisingHeart[]>([]);
  const [isBestieZoneUnlocked, setIsBestieZoneUnlocked] = useState<boolean>(false);
  const [isPeriodHubUnlocked, setIsPeriodHubUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('is_period_hub_unlocked') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Load custom values from localStorage if available
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('love_config');
      const savedPhotos = localStorage.getItem('love_photos');
      const savedStory = localStorage.getItem('love_story');
      const savedMemories = localStorage.getItem('love_memories');
      const savedLetters = localStorage.getItem('love_letters');

      // Unique signature representing exact compiled default values to detect any developer file alterations
      const currentDefaultsSign = JSON.stringify({
        coupleOne: DEFAULT_CONFIG.coupleNameOne,
        coupleTwo: DEFAULT_CONFIG.coupleNameTwo,
        passcode: DEFAULT_CONFIG.specialDate,
        hint: DEFAULT_CONFIG.specialDateHint,
        music: DEFAULT_CONFIG.bgMusicUrl,
        logoUrl: DEFAULT_CONFIG.profileLogoUrl,
        promisesLength: DEFAULT_CONFIG.promises.length,
        reasonsLength: DEFAULT_CONFIG.reasonsWhySpecial.length,
        photosLength: DEFAULT_PHOTOS.length,
        storyLength: DEFAULT_STORY.length,
        memoriesLength: DEFAULT_MEMORIES.length,
        lettersLength: DEFAULT_LETTERS.length
      });

      const savedDefaultsSign = localStorage.getItem('love_defaults_signature_v200');

      if (savedDefaultsSign !== currentDefaultsSign) {
        // Code defaults have been edited in defaultData.ts! Reset localStorage keys so updates take effect immediately.
        localStorage.setItem('love_defaults_signature_v200', currentDefaultsSign);
        
        localStorage.removeItem('love_config');
        localStorage.removeItem('love_photos');
        localStorage.removeItem('love_story');
        localStorage.removeItem('love_memories');
        localStorage.removeItem('love_letters');

        setConfig(DEFAULT_CONFIG);
        setPhotos(DEFAULT_PHOTOS);
        setStory(DEFAULT_STORY);
        setMemories(DEFAULT_MEMORIES);
        setLetters(DEFAULT_LETTERS);
        return;
      }

      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        // Hydrate any new default configs (such as profileLogoUrl or specialDateHint if undefined)
        const hydrated = { ...DEFAULT_CONFIG, ...parsed };
        
        // Automatic sweet music track migration to stable fail-safe SoundHelix/YouTube soundtrack
        if (!hydrated.bgMusicUrl || hydrated.bgMusicUrl.includes("mixkit") || hydrated.bgMusicUrl.includes("codeskulptor") || hydrated.bgMusicUrl.includes("google") || hydrated.bgMusicUrl.includes("SoundHelix") || !hydrated.bgMusicUrl.includes("MAvHJCModP0")) {
          hydrated.bgMusicUrl = "https://www.youtube.com/watch?v=MAvHJCModP0";
          try {
            localStorage.setItem('love_config', JSON.stringify(hydrated));
          } catch (storageErr) {
            console.warn("Storage write failed:", storageErr);
          }
        }
        setConfig(hydrated);
      }
      if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
      if (savedStory) setStory(JSON.parse(savedStory));
      if (savedMemories) setMemories(JSON.parse(savedMemories));
      if (savedLetters) setLetters(JSON.parse(savedLetters));
    } catch (err) {
      console.warn("Could not read localStorage configurations.", err);
    }
  }, []);

  // Dynamically update browser tab favicon to match the configured profileLogoUrl
  useEffect(() => {
    if (config.profileLogoUrl) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = config.profileLogoUrl;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = config.profileLogoUrl;
        document.head.appendChild(newLink);
      }
    }
  }, [config.profileLogoUrl]);

  // Save changes to localStorage helper
  const handleSaveAll = (updated: {
    config: LoveConfig;
    photos: MemoryPhoto[];
    story: StoryChapter[];
    memories: FavoriteMemory[];
    letters: OpenWhenLetter[];
  }) => {
    setConfig(updated.config);
    setPhotos(updated.photos);
    setStory(updated.story);
    setMemories(updated.memories);
    setLetters(updated.letters);

    try {
      localStorage.setItem('love_config', JSON.stringify(updated.config));
      localStorage.setItem('love_photos', JSON.stringify(updated.photos));
      localStorage.setItem('love_story', JSON.stringify(updated.story));
      localStorage.setItem('love_memories', JSON.stringify(updated.memories));
      localStorage.setItem('love_letters', JSON.stringify(updated.letters));
    } catch (err) {
      console.error("Storage error:", err);
    }
  };

  const handleResetFactoryDefaults = () => {
    if (confirm("Reset everything to standard default couples draft? This overrides all custom uploads.")) {
      setConfig(DEFAULT_CONFIG);
      setPhotos(DEFAULT_PHOTOS);
      setStory(DEFAULT_STORY);
      setMemories(DEFAULT_MEMORIES);
      setLetters(DEFAULT_LETTERS);

      localStorage.removeItem('love_config');
      localStorage.removeItem('love_photos');
      localStorage.removeItem('love_story');
      localStorage.removeItem('love_memories');
      localStorage.removeItem('love_letters');
      setShowAdmin(false);
      triggerHeartsShower();
    }
  };

  // Heart confetti generator
  const triggerHeartsShower = () => {
    const heartColors = ['#ec4899', '#f43f5e', '#d946ef', '#a855f7', '#f472b6', '#fda4af', '#f43f5e'];
    const newHearts: RisingHeart[] = Array.from({ length: 45 }).map((_, index) => {
      const scale = Math.random() * 1.3 + 0.4;
      const duration = `${Math.random() * 1.5 + 2.2}s`;
      const drift = `${Math.random() * 320 - 160}px`;
      const rot = `${Math.random() * 360}deg`;
      return {
        id: `heart-${Date.now()}-${index}-${Math.random()}`,
        x: Math.random() * 92 + 4,
        drift,
        rot,
        scale,
        duration,
        color: heartColors[Math.floor(Math.random() * heartColors.length)]
      };
    });

    setHeartsList((prev) => [...prev, ...newHearts]);

    // Cleanup particles once animated to minimize DOM node overhead
    setTimeout(() => {
      setHeartsList((prev) => prev.slice(newHearts.length));
    }, 4500);
  };

  // Trigger hearts when correct login is entered
  const handleMasterUnlocked = () => {
    setIsUnlocked(true);
    triggerHeartsShower();
  };

  return (
    <div id="app-root-layout" className="relative min-h-screen pb-20 overflow-x-hidden bg-gradient-to-br from-[#0a0712] via-[#050508] to-[#120a1c] text-zinc-100 transition-all duration-300">
      
      {/* Glow effects mimicking the logo theme */}
      <div className="fixed top-10 left-[15%] w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none select-none z-0 transform-gpu" />
      <div className="fixed top-[40%] right-[10%] w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none select-none z-0 transform-gpu" />
      <div className="fixed bottom-20 left-[20%] w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none select-none z-0 transform-gpu" />

      {/* Dynamic drifting cute stickers canvas background */}
      <FloatingParticles paused={showAdmin || isAdminPassModalOpen} />

      {/* BACKGROUND MUSIC PLAYER STREAM (Global float controller) */}
      <MusicPlayer musicUrl={config.bgMusicUrl} />

      {/* RISING HEART SHOWER OVERLAY CONTAINER */}
      <div className="fixed inset-x-0 bottom-0 top-0 pointer-events-none z-50 overflow-hidden">
        {heartsList.map((heart) => (
          <div
            key={heart.id}
            className="absolute bottom-0 burst-heart text-2xl select-none"
            style={{
              left: `${heart.x}%`,
              '--hb-drift': heart.drift,
              '--hb-rot': heart.rot,
              '--hb-scale': heart.scale,
              '--hb-duration': heart.duration,
              color: heart.color,
            } as React.CSSProperties}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* CORE WRAPPERS */}
      {!isUnlocked ? (
        <LandingPage 
          config={config} 
          onUnlocked={handleMasterUnlocked}
          onTriggerConfetti={triggerHeartsShower}
        />
      ) : (
        // AUTHENTICATED SECRET LAND
        <div id="sanctuary-dashboard" className="w-full max-w-6xl mx-auto px-4 py-6 animate-fade-in space-y-6">
          
          {/* Main banner header */}
          <header className="relative p-6 md:p-8 bg-white/40 backdrop-blur-md rounded-3xl border border-pink-100/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
            {/* Cute mini backdrop stickers */}
            <div className="absolute top-2 right-2 text-3xl opacity-15 select-none cute-sticker">🌸</div>
            <div className="absolute bottom-2 left-6 text-2xl opacity-15 select-none cute-sticker">✨</div>
            
            <div className="space-y-1.5 text-center md:text-left select-none">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="relative shrink-0 select-none group">
                  <div className="absolute inset-0 bg-pink-400/20 rounded-full blur-sm group-hover:bg-pink-400/40 transition-all duration-300" />
                  <img 
                    src={config.profileLogoUrl || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop"} 
                    alt="Sanctuary Logo" 
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 relative z-10 rounded-full border-2 border-pink-500/80 object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-0 right-0 z-20 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-80"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500 border-2 border-white flex items-center justify-center text-[7px] text-white font-bold select-none">💖</span>
                  </span>
                </div>
                <h1 className="font-serif text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Our Secret Sanctuary</h1>
              </div>
              <p className="text-xs font-semibold text-pink-500/80 uppercase tracking-widest font-mono">
                For {config.coupleNameTwo || "My Favorite Person"} from {config.coupleNameOne || "Us"} with love
              </p>
              <span className="text-[10px] text-gray-400 block pt-0.5 leading-normal">
                💖 Created just for you as a digital box of stars, memories and letters.
              </span>
            </div>

            {/* Custom Settings Header Action Drawer */}
            <div className="flex flex-wrap gap-2.5 justify-center">
              <button
                id="btn-creator-tools"
                onClick={() => setShowAdmin(true)}
                className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 hover:text-pink-600 text-xs font-bold rounded-2xl border border-pink-100/40 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                title="Customize letters, names, password, promises & pictures"
              >
                <Settings size={14} className="animate-spin-slow text-pink-500" />
                <span>Personalize Gift ⚙️</span>
              </button>

              <button
                id="btn-lock-logout"
                onClick={() => {
                  setIsUnlocked(false);
                  setActiveTab('safekeep');
                }}
                className="px-4 py-2 bg-pink-100/50 hover:bg-pink-100 text-pink-600 font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center gap-1.5"
                title="Lock back the digital room"
              >
                <LogOut size={13} />
                <span>Safeguard Locked</span>
              </button>
            </div>
          </header>

          {/* Tab switches for the 3 main wings */}
          <div 
            id="dashboard-tabs"
            className="flex flex-wrap items-center justify-center p-1.5 bg-pink-50/40 border border-pink-100/40 rounded-2xl max-w-2xl mx-auto gap-1"
          >
            {[
              { id: 'safekeep', label: '📬 Letters & Story', icon: <Mail size={13} /> },
              { id: 'gallery', label: '📸 Polaroid Gallery', icon: <ImageIcon size={13} /> },
              { id: 'period-hub', label: '🌸 Period Hub', icon: <span className="text-xs">🌸</span> },
              { id: 'secret-room', label: '❤️ Favorite Room', icon: <Heart size={13} /> },
              { id: 'bestie-zone', label: '👯 Vanshika Bestie', icon: <Heart size={13} fill="currentColor" /> },
              { id: 'chat', label: '💖 Talk To Ruu', icon: <Sparkles size={13} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  triggerHeartsShower();
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-white text-pink-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* MAIN PANELS CHANGER */}
          <main className="animate-slide-up">
            {/* WING A: LETTERS, TIMELINES & ENVELOPES */}
            {activeTab === 'safekeep' && (
              <div className="space-y-6">
                {/* Home Sub-Section Navigation / Toggles */}
                <div id="home-subview-hub" className="flex items-center justify-center p-1 bg-pink-50/10 border border-pink-500/10 rounded-2xl max-w-md mx-auto gap-1 shadow-inner select-none">
                  <button
                    onClick={() => setHomeSubView('letters')}
                    className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      homeSubView === 'letters'
                        ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span>📬 Secret Letters</span>
                  </button>
                  <button
                    onClick={() => {
                      setHomeSubView('bestie');
                      triggerHeartsShower();
                    }}
                    className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      homeSubView === 'bestie'
                        ? 'bg-gradient-to-r from-pink-500 to-rose-450 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                        : 'text-pink-300 hover:text-pink-200 bg-pink-500/5 hover:bg-pink-500/10'
                    }`}
                  >
                    <span>❤️ Journey of My Heart</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
                  </button>
                </div>

                {homeSubView === 'letters' ? (
                  <div className="space-y-8 animate-fade-in">
                    {/* BREATHTAKING HIGHLIGHT BANNER: JOURNEY OF MY HEART */}
                    <div 
                      id="bestie-launch-banner"
                      className="p-[1.5px] rounded-3xl bg-gradient-to-r from-pink-500 via-[#ff4fa3] to-purple-600 shadow-[0_0_20px_rgba(255,79,163,0.25)] relative overflow-hidden select-none hover:scale-[1.01] transition-all duration-300"
                    >
                      {/* Decorative backdrop graphics */}
                      <div className="absolute inset-0 bg-radial-gradient from-purple-500/20 via-transparent to-transparent opacity-60 pointer-events-none" />
                      <div className="bg-[#08031d] rounded-[22.5px] p-6 text-center space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500/20 border border-pink-500/40 rounded-full text-pink-300 font-extrabold text-[9px] uppercase tracking-widest animate-bounce">
                          <span>✨ SURPRISE IN HOME SECTION ✨</span>
                        </div>
                        <h3 className="font-serif text-xl md:text-2xl font-black text-white bg-gradient-to-r from-pink-200 via-rose-300 to-amber-200 bg-clip-text text-transparent uppercase tracking-wider">
                          Journey Of My Heart ❤️
                        </h3>
                        <p className="text-xs text-zinc-300 max-w-lg mx-auto leading-relaxed">
                          A beautiful 7-stage interactive journey crafted specifically for my best friend Vanshika to celebrate our unbreakable bond, sweet milestones, memories, and stars.
                        </p>
                        <button
                          onClick={() => {
                            setHomeSubView('bestie');
                            triggerHeartsShower();
                          }}
                          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff4fa3] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,79,163,0.4)] cursor-pointer decoration-none inline-flex items-center gap-2"
                        >
                          <span>Explore Journey 🚀🌸</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-center py-2 select-none">
                      <h3 className="font-serif text-2xl font-black text-pink-100 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">My Secret Envelopes</h3>
                      <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                        Click each capsule, enter our special password date if locked, and unlock the letters I wrote for you.
                      </p>
                    </div>
                    
                    <OpenWhenLetters 
                      config={config} 
                      story={story} 
                      memories={memories} 
                      letters={letters}
                      onTriggerConfetti={triggerHeartsShower}
                      onUnlockPasscodeChecked={() => true}
                    />
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in max-w-4xl mx-auto">
                    <div className="flex justify-start select-none">
                      <button
                        onClick={() => {
                          setHomeSubView('letters');
                          triggerHeartsShower();
                        }}
                        className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs cursor-pointer transition-all border border-white/5 flex items-center gap-1.5"
                      >
                        <span>← Back to Secret Letters</span>
                      </button>
                    </div>
                    {!isBestieZoneUnlocked ? (
                      <BestiePasscodeLock 
                        onUnlockSuccess={() => setIsBestieZoneUnlocked(true)}
                        onTriggerConfetti={triggerHeartsShower}
                      />
                    ) : (
                      <BestieZone 
                        onTriggerConfetti={triggerHeartsShower}
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* WING B: IMMERSIVE POLAROID GALLERY */}
            {activeTab === 'gallery' && (
              <div className="animate-fade-in">
                <PolaroidGallery 
                  photos={photos} 
                  onAddTrigger={() => setShowAdmin(true)}
                  onRemovePhoto={(id) => {
                    const filtered = photos.filter(p => p.id !== id);
                    setPhotos(filtered);
                    localStorage.setItem('love_photos', JSON.stringify(filtered));
                  }}
                />
              </div>
            )}

            {/* WING C: ETERNAL SECRET ROOM */}
            {activeTab === 'secret-room' && (
              <div className="animate-fade-in max-w-4xl mx-auto">
                <SecretRoom 
                  config={config} 
                  photos={photos} 
                  onTriggerConfetti={triggerHeartsShower}
                />
              </div>
            )}

            {/* WING D: VANSHIKA BESTIE SURPRISE ZONE */}
            {activeTab === 'bestie-zone' && (
              <div className="animate-fade-in max-w-4xl mx-auto">
                {!isBestieZoneUnlocked ? (
                  <BestiePasscodeLock 
                    onUnlockSuccess={() => setIsBestieZoneUnlocked(true)}
                    onTriggerConfetti={triggerHeartsShower}
                  />
                ) : (
                  <BestieZone 
                    onTriggerConfetti={triggerHeartsShower}
                  />
                )}
              </div>
            )}

            {/* WING E: PERIOD HUB COZY SANCTUARY POPUP OVERLAY */}
            {activeTab === 'period-hub' && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-lg flex flex-col justify-start items-center p-4 md:p-8 animate-fade-in text-white select-none">
                {/* Floating close button at top right */}
                <button 
                  onClick={() => {
                    setActiveTab('safekeep');
                    triggerHeartsShower();
                  }}
                  className="fixed top-4 right-4 md:top-6 md:right-6 bg-slate-900/90 hover:bg-pink-500 hover:text-white text-zinc-300 rounded-full p-2.5 cursor-pointer transition-all z-[60] border border-pink-500/30 hover:scale-105 shadow-2xl flex items-center justify-center"
                  title="Return to Dashboard"
                >
                  <span className="text-xs font-serif font-black mr-1 uppercase tracking-wider">Dashboard 🌸</span>
                </button>

                <div className="w-full max-w-5xl mx-auto pt-12 pb-8 relative z-10">
                  {!isPeriodHubUnlocked ? (
                    <div className="max-w-md mx-auto pt-4 md:pt-12">
                      <PeriodHubLock 
                        onUnlockSuccess={() => {
                          setIsPeriodHubUnlocked(true);
                          try {
                            localStorage.setItem('is_period_hub_unlocked', 'true');
                          } catch (e) {}
                        }}
                        onTriggerConfetti={triggerHeartsShower}
                      />
                    </div>
                  ) : (
                    <div className="w-full space-y-6">
                      <div className="flex flex-col items-center text-center space-y-2 mb-2 select-none">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500/15 border border-pink-500/30 rounded-full text-pink-300 font-extrabold text-[10px] uppercase tracking-widest animate-pulse">
                          🌸 Sweet Cozy Sanctuary Active 🌸
                        </div>
                        <h2 className="font-serif text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text uppercase tracking-wider">
                          🌸 Period Hub Sanctuary
                        </h2>
                        <p className="text-xs text-zinc-400 font-medium max-w-md">
                          Welcome to your sweet comfort world, my princess. Take some tea, chocolates, cozy sounds, and rest.
                        </p>
                      </div>

                      <div className="bg-[#110a1f]/80 backdrop-blur-xl border border-pink-500/20 rounded-[32px] p-2 md:p-4 shadow-2xl relative overflow-hidden text-zinc-800 dark:text-white">
                        <PeriodHub onTriggerConfetti={triggerHeartsShower} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
                <PrivateChat onTriggerConfetti={triggerHeartsShower} />
                <VirtualHug onTriggerConfetti={triggerHeartsShower} />
              </div>
            )}
          </main>

        </div>
      )}

      {/* CUSTOMIZABILITY ADMIN / CREATOR PANEL MODAL OVERLAY */}
      {showAdmin && (
        <SecretAdmin 
          config={config}
          photos={photos}
          story={story}
          memories={memories}
          letters={letters}
          onSave={handleSaveAll}
          onReset={handleResetFactoryDefaults}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {/* ADMIN PASSCODE GATE MODAL */}
      {isAdminPassModalOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-pink-500/30 rounded-3xl p-6 w-full max-w-sm text-center shadow-[0_0_50px_rgba(236,72,153,0.3)] relative">
            <button
              onClick={() => {
                setIsAdminPassModalOpen(false);
                setAdminPassInput('');
                setAdminPassError(false);
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer text-sm"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto text-pink-400 text-xl mb-4 animate-pulse">
              🔐
            </div>
            <h3 className="font-serif text-lg font-bold text-white mb-1">Admin Access Gate</h3>
            <p className="text-xs text-zinc-400 mb-4">Enter the secret master key to open configuration tools.</p>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const cleanedInput = adminPassInput.trim().toLowerCase();
                if (cleanedInput === 'myticruu' || cleanedInput === 'mysticruu') {
                  setShowAdmin(true);
                  setIsAdminPassModalOpen(false);
                  setAdminPassInput('');
                  setAdminPassError(false);
                } else {
                  setAdminPassError(true);
                  try {
                    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                    if (AudioContextClass) {
                      const ctx = new AudioContextClass();
                      const osc = ctx.createOscillator();
                      const gain = ctx.createGain();
                      osc.type = 'sawtooth';
                      osc.frequency.setValueAtTime(150, ctx.currentTime);
                      gain.gain.setValueAtTime(0.08, ctx.currentTime);
                      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
                      osc.connect(gain);
                      gain.connect(ctx.destination);
                      osc.start();
                      osc.stop(ctx.currentTime + 0.3);
                    }
                  } catch (err) {}
                }
              }}
              className="space-y-3 text-left"
            >
              <input
                type="password"
                placeholder="Enter master password..."
                value={adminPassInput}
                onChange={(e) => {
                  setAdminPassInput(e.target.value);
                  setAdminPassError(false);
                }}
                className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-2xl text-white text-xs font-mono text-center focus:outline-none focus:border-pink-500 transition-colors"
                autoFocus
              />
              {adminPassError && (
                <p className="text-[10px] text-red-400 font-bold text-center animate-pulse">
                  ❌ Invalid Master Password! Access Denied.
                </p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold tracking-widest uppercase rounded-2xl cursor-pointer shadow-md transition-all active:scale-95"
              >
                Unlock Panel 🔓
              </button>
            </form>
          </div>
        </div>
      )}


      {/* Centered Animated Neon Pink Heart & Love You Baby Ji Section */}
      <div className="relative w-full text-center py-6 z-10 flex flex-col items-center justify-center select-none">
        <NeonTextHeart logoUrl={config.profileLogoUrl} />
        <div id="love-you-baby-ji" className="mt-2 px-6 py-3.5 bg-slate-950/70 backdrop-blur-md rounded-2xl border border-pink-500/20 shadow-[0_0_25px_rgba(236,72,153,0.2)] max-w-sm md:max-w-md mx-auto transition-transform duration-300 hover:scale-[1.03]">
          <p className="text-sm md:text-base font-serif font-extrabold text-pink-300 drop-shadow-[0_0_12px_rgba(236,72,153,0.6)] tracking-wide animate-pulse leading-relaxed">
            Love You Baby Ji 💗💋🩷🫰🏻🙈🐥🎀
          </p>
        </div>
      </div>

      {/* Eternal Love Footer Signature */}
      <footer className="w-full text-center py-6 mt-12 mb-4 bg-slate-950/20 backdrop-blur-xs border-t border-pink-500/10 select-none">
        <p className="text-xs text-pink-400 font-serif font-bold tracking-wider flex items-center justify-center gap-1 drop-shadow-xs">
          <span>love you cutee 💖</span>
        </p>
        <p className="text-[10px] text-pink-300/80 mt-1.5 italic font-serif">
          sorry 🥺❤️
        </p>
        <p className="text-[11px] text-pink-400 font-serif font-bold mt-2 tracking-wide uppercase animate-pulse">
          BACHAA MAAF KARDOO OOS DIN KE LIYE JI 🙏🥺❤️
        </p>
        <p className="text-[9px] text-pink-400/60 mt-1 uppercase tracking-widest font-mono">
          by your Ruu ✨
        </p>

        <div className="mt-8">
          <button
            onClick={() => setIsAdminPassModalOpen(true)}
            className="px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-pink-500 rounded-full text-xs font-bold font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-sm hover:shadow-md"
          >
            <Settings size={14} className="animate-spin-slow" />
            Secret Admin Panel
          </button>
        </div>
      </footer>

      {/* GLOBAL SECRET APOLOGY ZONE BADGE & CARD CONTROLLER */}
      {isUnlocked && (
        <SecretApologyZone config={config} onTriggerConfetti={triggerHeartsShower} />
      )}

    </div>
  );
}
