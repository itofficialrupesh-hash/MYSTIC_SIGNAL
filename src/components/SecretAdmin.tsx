import React, { useState, useEffect } from 'react';
import { 
  X, Save, RotateCcw, Image, Plus, Trash2, 
  Settings, Heart, Sparkles, Sliders, Music, 
  Download, Upload, Check, HelpCircle, Lock
} from 'lucide-react';
import { LoveConfig, MemoryPhoto, StoryChapter, FavoriteMemory, OpenWhenLetter } from '../types';
import { getUnlockAttempts, deleteUnlockAttempt } from '../firebase';

interface SecretAdminProps {
  config: LoveConfig;
  photos: MemoryPhoto[];
  story: StoryChapter[];
  memories: FavoriteMemory[];
  letters: OpenWhenLetter[];
  onSave: (data: {
    config: LoveConfig;
    photos: MemoryPhoto[];
    story: StoryChapter[];
    memories: FavoriteMemory[];
    letters: OpenWhenLetter[];
  }) => void;
  onReset: () => void;
  onClose: () => void;
}

export default function SecretAdmin({
  config,
  photos,
  story,
  memories,
  letters,
  onSave,
  onReset,
  onClose
}: SecretAdminProps) {
  // State for config
  const [localConfig, setLocalConfig] = useState<LoveConfig>({ ...config });
  // State for photos
  const [localPhotos, setLocalPhotos] = useState<MemoryPhoto[]>([...photos]);
  // State for story chapters
  const [localStory, setLocalStory] = useState<StoryChapter[]>([...story]);
  // State for favorite memories
  const [localMemories, setLocalMemories] = useState<FavoriteMemory[]>([...memories]);
  // State for letters
  const [localLetters, setLocalLetters] = useState<OpenWhenLetter[]>([...letters]);

  // Tab state
  const [activeTab, setActiveTab] = useState<'basics' | 'photos' | 'story' | 'letters' | 'promises' | 'attempts'>('basics');
  
  // Custom Attempts state
  const [attempts, setAttempts] = useState<{ id: string; value: string; isCorrect: boolean; timestamp: string }[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [attemptsError, setAttemptsError] = useState<string | null>(null);

  const fetchAttempts = async () => {
    setLoadingAttempts(true);
    setAttemptsError(null);
    try {
      const data = await getUnlockAttempts();
      setAttempts(data);
    } catch (err: any) {
      setAttemptsError("Could not retrieve lock security logs. Check database connection or permissions.");
      console.error(err);
    } finally {
      setLoadingAttempts(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'attempts') {
      fetchAttempts();
    }
  }, [activeTab]);

  const handleDeleteAttempt = async (id: string) => {
    if (confirm("Are you sure you want to delete this attempt log?")) {
      try {
        await deleteUnlockAttempt(id);
        setAttempts(prev => prev.filter(a => a.id !== id));
      } catch (err) {
        alert("Failed to delete log entry");
      }
    }
  };

  const handleClearAllAttempts = async () => {
    if (confirm("Are you sure you want to completely clear all logged attempts? This will delete them one by one.")) {
      setLoadingAttempts(true);
      try {
        for (const atm of attempts) {
          await deleteUnlockAttempt(atm.id);
        }
        setAttempts([]);
      } catch (err) {
        alert("Failed to clear some attempts.");
      } finally {
        setLoadingAttempts(false);
      }
    }
  };

  // Custom Photo Adding States
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoDate, setPhotoDate] = useState('');
  const [photoNote, setPhotoNote] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Preloaded Unsplash photo templates for easy love decoration
  const unsplashTemplates = [
    { url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop", name: "Star Stargazing" },
    { url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop", name: "Hand Holding" },
    { url: "https://images.unsplash.com/photo-1543269608-fa3950436a11?q=80&w=600&auto=format&fit=crop", name: "Warm Coffee" },
    { url: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?q=80&w=600&auto=format&fit=crop", name: "Sparklers Heart" },
    { url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop", name: "Cozy Tent" },
    { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop", name: "Acoustic Sunset" }
  ];

  // Handler to process local image file upload and resize in Canvas to keep Base64 lightweight
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError("Please upload an image file (PNG/JPG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to scale down
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Constraint boundaries (max width/height 600px for storage limits)
        const maxDim = 500;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // compress to JPG 70% quality
          setPhotoUrl(dataUrl);
        }
      };
      img.onerror = () => {
        setUploadError("Error loading graphic image.");
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError("Error processing file reader.");
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = () => {
    if (!photoUrl) {
      setUploadError("Please provide an image url or upload a photo file.");
      return;
    }

    const newPhoto: MemoryPhoto = {
      id: `photo-${Date.now()}`,
      url: photoUrl,
      date: photoDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      caption: photoCaption || "A Beautiful Day Together",
      memoryNote: photoNote || "We spent the day laughing, smiling and building sweet memories..."
    };

    setLocalPhotos([newPhoto, ...localPhotos]);
    // Reset Form
    setPhotoUrl('');
    setPhotoCaption('');
    setPhotoDate('');
    setPhotoNote('');
    setUploadError(null);
  };

  const handleRemovePhoto = (id: string) => {
    setLocalPhotos(localPhotos.filter(p => p.id !== id));
  };

  const handleSaveAll = () => {
    onSave({
      config: localConfig,
      photos: localPhotos,
      story: localStory,
      memories: localMemories,
      letters: localLetters
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 1500);
  };

  // Export customized gift config bundle as JSON file
  const handleExportConfig = () => {
    const dataStr = JSON.stringify({
      config: localConfig,
      photos: localPhotos,
      story: localStory,
      memories: localMemories,
      letters: localLetters
    }, null, 2);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gift_story_config_${localConfig.coupleNameTwo.replace(/\s+/g, '_').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import customized gift config bundle from JSON
  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.config && imported.photos) {
          setLocalConfig(imported.config);
          setLocalPhotos(imported.photos);
          if (imported.story) setLocalStory(imported.story);
          if (imported.memories) setLocalMemories(imported.memories);
          if (imported.letters) setLocalLetters(imported.letters);
          alert("Success! Your custom Gift Package was loaded correctly. Click 'Save Changes' to commit!");
        } else {
          alert("Error: Incorrect file structure format.");
        }
      } catch (err) {
        alert("Error parsing JSON file draft.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in"
      id="admin-backdrop"
    >
      <div 
        id="admin-box"
        className="w-full max-w-4xl h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Left Side Bar with Romantic Accent */}
        <div className="md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 p-5 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                <Heart size={16} fill="currentColor" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Gift Settings Panel</h3>
                <p className="text-[10px] text-gray-400">Personalize her secret room</p>
              </div>
            </div>

            <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              <button
                type="button"
                onClick={() => setActiveTab('basics')}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === 'basics' ? 'bg-pink-100/60 text-pink-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Sliders size={14} />
                <span>Basics & Secret Key</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === 'photos' ? 'bg-pink-100/60 text-pink-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Image size={14} />
                <span>Polaroid Memories</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('story')}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === 'story' ? 'bg-pink-100/60 text-pink-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Sparkles size={14} />
                <span>Story & Memories</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('letters')}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === 'letters' ? 'bg-pink-100/60 text-pink-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Heart size={14} />
                <span>Open When Letters</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('promises')}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === 'promises' ? 'bg-pink-100/60 text-pink-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Music size={14} />
                <span>Promises & Why Special</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('attempts')}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === 'attempts' ? 'bg-pink-100/60 text-pink-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Lock size={14} className="text-pink-500" />
                <span>Unlock Attempts Log 🔐</span>
              </button>
            </nav>
          </div>

          <div className="hidden md:flex flex-col gap-2 pt-4 border-t border-slate-100">
            <button
              onClick={handleExportConfig}
              className="text-[10px] font-bold text-gray-500 hover:text-pink-600 flex items-center gap-1.5 py-1 px-2.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              title="Backup current customizations as file"
            >
              <Download size={12} />
              <span>Export Love Backup</span>
            </button>
            <label className="text-[10px] font-bold text-gray-500 hover:text-pink-600 flex items-center gap-1.5 py-1 px-2.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
              <Upload size={12} />
              <span>Import Love Backup</span>
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportConfig} 
                className="hidden" 
              />
            </label>
          </div>
        </div>

        {/* Right Action Display Panel */}
        <div id="admin-main-panel" className="flex-1 flex flex-col min-h-0 bg-white">
          {/* Header Panel */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {activeTab === 'basics' && 'General Customizations & Secrets'}
                {activeTab === 'photos' && 'Polaroid Photo Frame Album'}
                {activeTab === 'story' && 'Interactive Story Book Log'}
                {activeTab === 'letters' && 'Open When heart-mail'}
                {activeTab === 'promises' && 'Lifetime Promises list'}
                {activeTab === 'attempts' && 'Visitor Lock Passcode Attempts 🔐'}
              </h2>
              <p className="text-xs text-gray-400">
                {activeTab === 'attempts' ? 'Monitor password entry history live from Firestore database' : 'Everything edits in real time locally'}
              </p>
            </div>
            <button 
              id="close-admin-header-btn"
              onClick={onClose}
              className="w-10 h-10 hover:bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Core scrollable canvas */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* TAB 1: BASICS */}
            {activeTab === 'basics' && (
              <div className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Your First Name / Signature</label>
                    <input
                      type="text"
                      value={localConfig.coupleNameOne}
                      onChange={(e) => setLocalConfig({ ...localConfig, coupleNameOne: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-100/80 focus:border-pink-300 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Her First Name / Heart Name</label>
                    <input
                      type="text"
                      value={localConfig.coupleNameTwo}
                      onChange={(e) => setLocalConfig({ ...localConfig, coupleNameTwo: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-100/80 focus:border-pink-300 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100/50 space-y-4">
                  <h4 className="text-xs font-bold text-pink-700 flex items-center gap-1.5">
                    <Heart size={14} fill="currentColor" />
                    <span>Secret Unlock Vault Passcode</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Secret Date Passcode (e.g. 1122)</label>
                      <input
                        type="text"
                        value={localConfig.specialDate}
                        onChange={(e) => setLocalConfig({ ...localConfig, specialDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white rounded-xl border border-pink-200/50 focus:outline-none focus:ring-2 focus:ring-pink-100/80 focus:border-pink-300 text-sm font-mono font-bold text-pink-700"
                        placeholder="e.g. 1122"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Secret hint to display below input</label>
                      <input
                        type="text"
                        value={localConfig.specialDateHint}
                        onChange={(e) => setLocalConfig({ ...localConfig, specialDateHint: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white rounded-xl border border-pink-200/50 focus:outline-none focus:ring-2 focus:ring-pink-100/80 focus:border-pink-300 text-sm font-medium"
                        placeholder="e.g. Enter our anniversary month day!"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
                    <Music size={14} className="text-pink-500" />
                    <span>Atmospheric Theme Music MP3 Link</span>
                  </label>
                  <input
                    type="url"
                    value={localConfig.bgMusicUrl}
                    onChange={(e) => setLocalConfig({ ...localConfig, bgMusicUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-100/80 focus:border-pink-300 text-xs font-mono"
                    placeholder="URL to .mp3 direct file"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Provide any direct MP3 audio stream. Try standard audio streams or leave current default romantic instrumental playing.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
                    <Image size={14} className="text-pink-500" />
                    <span>Lover Logo / Profile Portrait Picture URL</span>
                  </label>
                  <input
                    type="url"
                    value={localConfig.profileLogoUrl || ''}
                    onChange={(e) => setLocalConfig({ ...localConfig, profileLogoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-100/80 focus:border-pink-300 text-xs font-mono"
                    placeholder="E.g. paste your direct image link or base64 data URL"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Paste any direct romantic picture link (from Imgur, Postimg, Unsplash, or Discord) to display it in the gorgeous gold-bordered circular brand logo!
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: POLAROID PHOTO GALLERY */}
            {activeTab === 'photos' && (
              <div className="space-y-6 animate-fade-in">
                {/* Form to add photo */}
                <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Plus size={14} />
                    <span>Hang a New Photo Memo</span>
                  </h4>

                  {/* Photo file import options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Option A: Upload local image from device</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageFileChange}
                        className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Option B: Use romantic stock template</label>
                      <div className="flex gap-1.5 flex-wrap">
                        {unsplashTemplates.map((t, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setPhotoUrl(t.url)}
                            className="text-[10px] px-2 py-1 bg-white border border-slate-200 hover:border-pink-300 text-slate-600 rounded-md cursor-pointer transition-colors hover:bg-pink-50/20 active:scale-95"
                          >
                            {t.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Image URL Address (Auto-filled on Option A/B)</label>
                      <input 
                        type="text" 
                        placeholder="https://images.unsplash.com/..." 
                        value={photoUrl.startsWith('data:') ? "Uploaded Device File (Base64 Binary Ready!)" : photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Date Signature</label>
                        <input 
                          type="text" 
                          placeholder="November 22, 2023" 
                          value={photoDate}
                          onChange={(e) => setPhotoDate(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Polaroid Caption</label>
                        <input 
                          type="text" 
                          placeholder="Our First Ice Cream" 
                          value={photoCaption}
                          onChange={(e) => setPhotoCaption(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Memory Note (Written at the back/bottom like a handwritten diary)</label>
                    <textarea 
                      placeholder="Write your emotional story or funny scribble about this photo..." 
                      value={photoNote}
                      onChange={(e) => setPhotoNote(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none resize-none"
                    />
                  </div>

                  {uploadError && (
                    <div className="text-xs text-red-500 font-bold">{uploadError}</div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Photo to Polaroid Gallery</span>
                  </button>
                </div>

                {/* Grid preview of currently active photos */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-700">Active Polaroid Gallery ({localPhotos.length} Photos)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" id="admin-gallery-preview">
                    {localPhotos.map((p, idx) => (
                      <div 
                        key={p.id} 
                        className="p-2 border border-gray-100 rounded-2xl bg-slate-50/50 flex flex-col justify-between group relative"
                      >
                        <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-200 shadow-inner mb-2">
                          <img 
                            src={p.url} 
                            alt={p.caption} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-800 truncate">{p.caption}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{p.date}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(p.id)}
                          className="absolute top-4 right-4 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md"
                          title="Remove Photo"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STORY AND FAVORITE MEMORIES */}
            {activeTab === 'story' && (
              <div className="space-y-6 animate-fade-in">
                {/* Chapters list */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Sparkles size={14} className="text-pink-500" />
                    <span>Our Chapter Storyboard (Our Story 📖)</span>
                  </h4>
                  <div className="space-y-4">
                    {localStory.map((chap, idx) => (
                      <div key={chap.id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Chapter Title</label>
                            <input 
                              type="text" 
                              value={chap.title} 
                              onChange={(e) => {
                                const updated = [...localStory];
                                updated[idx].title = e.target.value;
                                setLocalStory(updated);
                              }}
                              className="w-full px-3 py-1.5 bg-white text-xs font-bold rounded-lg border border-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Occasion Date / Era</label>
                            <input 
                              type="text" 
                              value={chap.date} 
                              onChange={(e) => {
                                const updated = [...localStory];
                                updated[idx].date = e.target.value;
                                setLocalStory(updated);
                              }}
                              className="w-full px-3 py-1.5 bg-white text-xs rounded-lg border border-slate-200"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Chapter Story Narrative</label>
                          <textarea 
                            value={chap.content} 
                            rows={3}
                            onChange={(e) => {
                              const updated = [...localStory];
                              updated[idx].content = e.target.value;
                              setLocalStory(updated);
                            }}
                            className="w-full px-3 py-1.5 bg-white text-xs rounded-lg border border-slate-200 resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Memories list */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Heart size={14} className="text-pink-500" />
                    <span>Favorite Memories list (Favorite Memories 🌸)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {localMemories.map((mem, idx) => (
                      <div key={mem.id} className="p-3 border border-slate-100 bg-slate-50/30 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={mem.emoji} 
                            onChange={(e) => {
                              const updated = [...localMemories];
                              updated[idx].emoji = e.target.value;
                              setLocalMemories(updated);
                            }}
                            className="w-10 text-center py-1 bg-white text-sm rounded-lg border border-slate-200"
                            title="Emoji"
                          />
                          <input 
                            type="text" 
                            value={mem.title} 
                            onChange={(e) => {
                              const updated = [...localMemories];
                              updated[idx].title = e.target.value;
                              setLocalMemories(updated);
                            }}
                            className="flex-1 px-2.5 py-1 bg-white text-xs font-bold rounded-lg border border-slate-200"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={mem.date} 
                          onChange={(e) => {
                            const updated = [...localMemories];
                            updated[idx].date = e.target.value;
                            setLocalMemories(updated);
                          }}
                          className="w-full px-2.5 py-1 bg-white text-[10px] text-gray-500 rounded-lg border border-slate-200"
                          placeholder="Date"
                        />
                        <textarea 
                          value={mem.description} 
                          rows={2}
                          onChange={(e) => {
                            const updated = [...localMemories];
                            updated[idx].description = e.target.value;
                            setLocalMemories(updated);
                          }}
                          className="w-full px-2.5 py-1 bg-white text-[10px] rounded-lg border border-slate-200 resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: LETTERS */}
            {activeTab === 'letters' && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-6">
                  {localLetters.map((letObj, idx) => (
                    <div key={letObj.id} className="p-4 border border-rose-100 bg-pink-50/20 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wide text-pink-500 flex items-center gap-1.5">
                          <span>{letObj.emoji}</span>
                          <span>{letObj.title}</span>
                        </span>
                        <input
                          type="text"
                          value={letObj.title}
                          onChange={(e) => {
                            const updated = [...localLetters];
                            updated[idx].title = e.target.value;
                            setLocalLetters(updated);
                          }}
                          className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-bold w-60"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Teaser description on the card</label>
                        <input
                          type="text"
                          value={letObj.shortTeaser}
                          onChange={(e) => {
                            const updated = [...localLetters];
                            updated[idx].shortTeaser = e.target.value;
                            setLocalLetters(updated);
                          }}
                          className="w-full px-3 py-1.5 bg-white text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Handwritten Love Message Letter Text</label>
                        <textarea
                          value={letObj.letterText}
                          rows={4}
                          onChange={(e) => {
                            const updated = [...localLetters];
                            updated[idx].letterText = e.target.value;
                            setLocalLetters(updated);
                          }}
                          className="w-full px-3 py-1.5 bg-white text-xs rounded-lg border border-slate-200 font-serif leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: LIFETIME PROMISES & SPECIAL REASONS */}
            {activeTab === 'promises' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Promises list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Sparkles size={14} className="text-pink-500" />
                    <span>My Sacred Lifetime Promises List (Future Promises ✨)</span>
                  </h4>
                  <div className="space-y-2">
                    {localConfig.promises.map((prom, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-xs font-bold font-mono">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={prom}
                          onChange={(e) => {
                            const updatedProms = [...localConfig.promises];
                            updatedProms[index] = e.target.value;
                            setLocalConfig({ ...localConfig, promises: updatedProms });
                          }}
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why Special list */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Heart size={14} className="text-pink-500" />
                    <span>Why You are So Special Note Bullets (Why You're Special ❤️)</span>
                  </h4>
                  <div className="space-y-2">
                    {localConfig.reasonsWhySpecial.map((reas, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <span className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 text-[10px]">❤️</span>
                        <input
                          type="text"
                          value={reas}
                          onChange={(e) => {
                            const updatedReas = [...localConfig.reasonsWhySpecial];
                            updatedReas[index] = e.target.value;
                            setLocalConfig({ ...localConfig, reasonsWhySpecial: updatedReas });
                          }}
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: ATTEMPTS LOGS */}
            {activeTab === 'attempts' && (
              <div className="space-y-6 animate-fade-in text-gray-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-gray-700">Database Action Hub</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Fetch latest logs from Firestore or clear log database entries</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={fetchAttempts}
                      disabled={loadingAttempts}
                      className="px-3 py-1.5 bg-pink-100/60 hover:bg-pink-100 text-pink-600 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                    >
                      <RotateCcw size={12} className={loadingAttempts ? "animate-spin" : ""} />
                      <span>{loadingAttempts ? "Loading..." : "Refresh Live"}</span>
                    </button>
                    {attempts.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllAttempts}
                        disabled={loadingAttempts}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Trash2 size={12} />
                        <span>Clear All Logs</span>
                      </button>
                    )}
                  </div>
                </div>

                {attemptsError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium animate-pulse">
                    ⚠️ {attemptsError}
                  </div>
                )}

                {loadingAttempts && attempts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
                    <span className="text-xs text-gray-400 font-medium font-sans animate-pulse">Connecting to Firestore database...</span>
                  </div>
                ) : attempts.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50/50 border border-dashed border-gray-100 rounded-3xl space-y-2">
                    <div className="text-2xl select-none">🔒</div>
                    <h5 className="text-xs font-bold text-gray-700">No attempts logged yet</h5>
                    <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                      Anytime someone types a passcode on the lock screen and submits it, the entered value will show up here in real time!
                    </p>
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50 bg-white">
                    <div className="px-4 py-2.5 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest grid grid-cols-12 gap-2 select-none">
                      <span className="col-span-3">Status</span>
                      <span className="col-span-4">Entered Passcode</span>
                      <span className="col-span-4">Time & Date</span>
                      <span className="col-span-1 text-right">Delete</span>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                      {attempts.map((atm) => (
                        <div key={atm.id} className="px-4 py-3.5 text-xs grid grid-cols-12 gap-2 items-center hover:bg-slate-50/50 transition-colors">
                          <span className="col-span-3 flex items-center gap-1.5">
                            {atm.isCorrect ? (
                              <>
                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold select-none">✓</span>
                                <span className="font-extrabold text-emerald-600 text-[11px]">Correct</span>
                              </>
                            ) : (
                              <>
                                <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-[10px] font-bold select-none">✗</span>
                                <span className="font-extrabold text-red-500 text-[11px]">Failed</span>
                              </>
                            )}
                          </span>
                          <span className="col-span-4 font-mono font-bold text-pink-700 bg-pink-50/60 px-2.5 py-0.5 rounded-lg w-max text-[11px] border border-pink-100/50">
                            {atm.value}
                          </span>
                          <span className="col-span-4 text-[11px] text-gray-400 font-mono">
                            {new Date(atm.timestamp).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </span>
                          <span className="col-span-1 text-right text-gray-800">
                            <button
                              type="button"
                              onClick={() => handleDeleteAttempt(atm.id)}
                              className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer inline-block"
                              title="Delete log entry"
                            >
                              <Trash2 size={13} />
                            </button>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Action Save/Reset Tray Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={onReset}
              className="px-4 py-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset all customizations back to factory default demo values"
            >
              <RotateCcw size={14} />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 hover:bg-slate-100 text-gray-500 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAll}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer transition-transform"
              >
                {saveSuccess ? (
                  <>
                    <Check size={14} />
                    <span>Saved Successfully!</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
