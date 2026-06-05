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

// Types and Defaults
import { LoveConfig, MemoryPhoto, StoryChapter, FavoriteMemory, OpenWhenLetter } from './types';
import { 
  DEFAULT_CONFIG, DEFAULT_PHOTOS, DEFAULT_STORY, 
  DEFAULT_MEMORIES, DEFAULT_LETTERS 
} from './defaultData';

interface RisingHeart {
  id: number;
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
  const [activeTab, setActiveTab] = useState<'safekeep' | 'gallery' | 'secret-room'>('safekeep');
  const [heartsList, setHeartsList] = useState<RisingHeart[]>([]);

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

      const savedDefaultsSign = localStorage.getItem('love_defaults_signature_v20');

      if (savedDefaultsSign !== currentDefaultsSign) {
        // Code defaults have been edited in defaultData.ts! Reset localStorage keys so updates take effect immediately.
        localStorage.setItem('love_defaults_signature_v20', currentDefaultsSign);
        
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
        if (!hydrated.bgMusicUrl || hydrated.bgMusicUrl.includes("mixkit") || hydrated.bgMusicUrl.includes("codeskulptor") || hydrated.bgMusicUrl.includes("google") || hydrated.bgMusicUrl.includes("SoundHelix") || !hydrated.bgMusicUrl.includes("za6peqgbPUgB7mj4")) {
          hydrated.bgMusicUrl = "https://youtu.be/2_i3Iw0rZPo?si=za6peqgbPUgB7mj4";
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
        id: Date.now() + index,
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
    <div id="app-root-layout" className="relative min-h-screen pb-20 overflow-x-hidden bg-gradient-to-br from-[#FFF5F7] via-[#FDF2F8] to-[#F3E8FF]">
      
      {/* Dynamic drifting cute stickers canvas background */}
      <FloatingParticles />

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
                    className="w-12 h-12 relative z-10 rounded-full border-2 border-[#d4af37]/80 object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
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
            className="flex items-center justify-center p-1.5 bg-pink-50/40 border border-pink-100/40 rounded-2xl max-w-md mx-auto"
          >
            {[
              { id: 'safekeep', label: '📬 Letters & Story', icon: <Mail size={13} /> },
              { id: 'gallery', label: '📸 Polaroid Gallery', icon: <ImageIcon size={13} /> },
              { id: 'secret-room', label: '❤️ Favorite Room', icon: <Heart size={13} /> }
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
                <div className="text-center py-4 select-none">
                  <h3 className="font-serif text-2xl font-bold text-gray-800">My Secret Envelopes</h3>
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
          </main>

        </div>
      )}

      {/* CUSTOMIZABILITY ADMIN / CREATOR PANEL MODAL OVERLAY */}
      {showAdmin && isUnlocked && (
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

      {/* Eternal Love Footer Signature */}
      <footer className="w-full text-center py-6 mt-12 mb-4 bg-white/20 backdrop-blur-xs border-t border-pink-100/20 select-none">
        <p className="text-xs text-pink-600 font-serif font-bold tracking-wider flex items-center justify-center gap-1 drop-shadow-xs">
          <span>love you cutee 💖</span>
        </p>
        <p className="text-[10px] text-pink-400/80 mt-1 uppercase tracking-widest font-mono">
          Last by Ruu ✨
        </p>
        <p className="text-[10px] text-pink-450/70 mt-1.5 italic font-serif">
          sorry 🥺❤️
        </p>
      </footer>

    </div>
  );
}
