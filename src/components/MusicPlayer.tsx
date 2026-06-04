import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, RefreshCw, AlertCircle } from 'lucide-react';

interface MusicPlayerProps {
  musicUrl: string;
}

// Fail-safe high-availability sweet melody collection
const FALLBACK_MELODIES = [
  { name: "Romantic Sweet Seaside", url: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Seasides_Soundtrack.mp3" },
  { name: "Cozy Cozy Instrumental", url: "https://commondatastorage.googleapis.com/codeskulptor-demos/charlie_assets/char_sounds/soundtrack.mp3" },
  { name: "Sweet Spring Acoustic", url: "https://commondatastorage.googleapis.com/codeskulptor-demos/pyspath3/soundtrack.mp3" },
  { name: "Whimsical Lofi Dreams", url: "https://commondatastorage.googleapis.com/codeskulptor-assets/gamedev/assets_gamedev_funny_background.mp3" }
];

export default function MusicPlayer({ musicUrl }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const consecutiveErrors = useRef(0);
  const lastSwitchTime = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [activeUrl, setActiveUrl] = useState(musicUrl);
  const [showAutoplayAdvisory, setShowAutoplayAdvisory] = useState(true);

  // Synchronize dynamic user settings changes
  useEffect(() => {
    if (musicUrl) {
      setActiveUrl(musicUrl);
      setErrorStatus(null);
      consecutiveErrors.current = 0; // Reset errors when active url is updated
      const matchedIdx = FALLBACK_MELODIES.findIndex(m => m.url === musicUrl);
      if (matchedIdx !== -1) {
        setCurrentTrackIndex(matchedIdx);
      }
    }
  }, [musicUrl]);

  // Handle active music track loading and initial attempt
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = activeUrl;
      // Pre-load metadata
      audioRef.current.load();
      
      // If was playing, keep playing
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Autoplay block or source switch failure:", err);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [activeUrl]);

  // Aggressive browser media policies bypassed by high sensitivity listener
  useEffect(() => {
    const attemptAutoplay = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setErrorStatus(null);
            setShowAutoplayAdvisory(false);
            cleanup();
          })
          .catch((err) => {
            console.warn("Soft autoplay interaction check:", err);
          });
      }
    };

    const cleanup = () => {
      document.removeEventListener('click', attemptAutoplay);
      document.removeEventListener('keydown', attemptAutoplay);
      document.removeEventListener('touchstart', attemptAutoplay);
      document.removeEventListener('touchend', attemptAutoplay);
      document.removeEventListener('focus', attemptAutoplay);
    };

    document.addEventListener('click', attemptAutoplay);
    document.addEventListener('keydown', attemptAutoplay);
    document.addEventListener('touchstart', attemptAutoplay);
    document.addEventListener('touchend', attemptAutoplay);
    document.addEventListener('focus', attemptAutoplay);

    // Initial soft check
    setTimeout(attemptAutoplay, 800);

    return () => {
      cleanup();
    };
  }, [activeUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle stream error state and automatically fall back
  const handleAudioError = () => {
    const errorObj = audioRef.current?.error;
    
    // If the error was just an aborted load (e.g. changing dynamic src), ignore it
    // HTML5 Audio error code 1 corresponds to MEDIA_ERR_ABORTED
    if (errorObj && errorObj.code === 1) {
      console.log("Ignored audio load abort (code 1)");
      return;
    }

    const now = Date.now();
    // Throttle fallback switches to at most once per 2 seconds to avoid any rapid cascades
    if (now - lastSwitchTime.current < 2000) {
      console.warn("Throttling excessively rapid fallback switch attempt");
      return;
    }
    lastSwitchTime.current = now;

    console.warn(`Audio source failed to load: ${activeUrl}. Error detail:`, errorObj ? `code ${errorObj.code}, ${errorObj.message}` : "unknown");
    
    // Prevent infinite loop if all sources fail (such as being offline)
    if (consecutiveErrors.current > 6) {
      console.error("All fallback sources failed consecutively. Pausing retries to prevent loop freeze.");
      setErrorStatus("Tap any button/card to trigger audio!");
      setIsPlaying(false);
      return;
    }

    consecutiveErrors.current += 1;
    
    const nextIdx = (currentTrackIndex + 1) % FALLBACK_MELODIES.length;
    setCurrentTrackIndex(nextIdx);
    const fallbackTrack = FALLBACK_MELODIES[nextIdx];
    setActiveUrl(fallbackTrack.url);
    setErrorStatus(`Switched to: ${fallbackTrack.name}`);
    
    // Automatically dismiss warning notification after 4.5 seconds
    setTimeout(() => {
      setErrorStatus(null);
    }, 4500);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      consecutiveErrors.current = 0; // Reset error counts on play attempt
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setErrorStatus(null);
          setShowAutoplayAdvisory(false);
        })
        .catch((err) => {
          console.warn("Playback block:", err);
          setErrorStatus("Tap any key/button to trigger music!");
          setTimeout(() => {
            setErrorStatus(null);
          }, 3000);
        });
    }
  };

  const forceSwitchNextMelody = () => {
    consecutiveErrors.current = 0; // Reset error counts on force track switch
    const nextIdx = (currentTrackIndex + 1) % FALLBACK_MELODIES.length;
    setCurrentTrackIndex(nextIdx);
    const nextMel = FALLBACK_MELODIES[nextIdx];
    setActiveUrl(nextMel.url);
    setIsPlaying(true);
    setErrorStatus(`Broadcasting: ${nextMel.name}`);
    setTimeout(() => {
      setErrorStatus(null);
    }, 3000);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-4 left-4 sm:left-auto sm:right-4 z-50 flex flex-col items-end gap-1.5 select-none max-w-[320px]">
      
      {/* Soft interactive hint indicating how to wake up unplayed music */}
      {showAutoplayAdvisory && !isPlaying && (
        <div className="bg-pink-600 text-white text-[10px] sm:text-xs font-bold font-serif rounded-2xl px-3.5 py-2 shadow-xl border border-pink-400 flex items-center gap-1.5 animate-bounce">
          <AlertCircle size={14} className="shrink-0" />
          <span>🎵 Tap anywhere on our Sanctuary to play her song!</span>
        </div>
      )}

      {/* Main audio element widget container */}
      <div 
        id="music-player-widget"
        className="glass-card bg-white/80 backdrop-blur-md border border-pink-200/50 shadow-lg rounded-3xl px-4 py-2.5 flex items-center gap-2.5 w-full hover:scale-102 transition-transform duration-300"
      >
        <audio 
          ref={audioRef} 
          loop 
          onError={handleAudioError}
          onPlay={() => {
            setIsPlaying(true);
            setShowAutoplayAdvisory(false);
            consecutiveErrors.current = 0; // Reset error counts on successful playback
          }} 
          onPause={() => setIsPlaying(false)}
        />

        <button
          id="btn-toggle-music"
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center text-white transition-all cursor-pointer shadow-md shrink-0 relative group"
          title={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <Pause size={18} fill="white" className="text-white active:scale-90 transition-transform" />
          ) : (
            <Play size={18} fill="white" className="text-white ml-0.5 active:scale-90 transition-transform" />
          )}
        </button>

        <div className="flex flex-col justify-center w-24 shrink-0 overflow-hidden">
          <span className="text-[9px] font-black tracking-widest text-pink-500 uppercase font-mono leading-none">
            Sweet Vibe
          </span>
          <span className="text-xs font-bold text-slate-800 truncate block mt-0.5" title={FALLBACK_MELODIES[currentTrackIndex].name}>
            {isPlaying ? FALLBACK_MELODIES[currentTrackIndex].name : "Melody paused"}
          </span>
        </div>

        {/* Next Track Switcher helper */}
        <button
          type="button"
          onClick={forceSwitchNextMelody}
          className="p-1 px-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 hover:text-pink-700 transition-all cursor-pointer shrink-0"
          title="Switch loving melody"
        >
          <RefreshCw size={13} className="animate-spin-slow" />
        </button>

        {/* Animated Music Bars Equalizer */}
        <div className="flex items-end gap-0.5 h-4 w-5 shrink-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-0.75 bg-pink-400 rounded-full"
              style={{
                height: isPlaying ? '100%' : '15%',
                transformOrigin: 'bottom',
                animationName: isPlaying ? 'equalizer-wave' : 'none',
                animationDuration: `1.${i + 1}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDirection: 'alternate',
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-1 border-l border-pink-100 pl-2 shrink-0">
          <button 
            id="btn-toggle-mute"
            onClick={toggleMute} 
            className="text-slate-400 hover:text-pink-600 cursor-pointer transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input
            id="vol-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-10 h-1 accent-pink-500 bg-pink-100 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {errorStatus && (
          <span className="absolute -top-8 right-2 bg-pink-50 text-[10px] border border-pink-100 text-pink-600 rounded-md px-2 py-0.5 whitespace-nowrap shadow-sm">
            {errorStatus}
          </span>
        )}
      </div>
    </div>
  );
}

