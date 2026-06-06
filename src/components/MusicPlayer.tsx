import React, { useEffect, useRef, useState } from 'react';

interface MusicPlayerProps {
  musicUrl?: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export default function MusicPlayer({ musicUrl }: MusicPlayerProps) {
  const playerRef = useRef<any>(null);
  const initializedRef = useRef<boolean>(false);
  const userInteractedRef = useRef<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackStatus, setPlaybackStatus] = useState<string>("Initializing...");

  // Hardcoded target YouTube ID: '2_i3Iw0rZPo'
  const activeYtId = "2_i3Iw0rZPo";

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Load the YouTube Iframe API if not already present
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      
      try {
        new window.YT.Player('bg-music-iframe-api', {
          height: '100%',
          width: '100%',
          videoId: activeYtId,
          playerVars: {
            autoplay: 1,
            mute: 1, // Start muted so modern browsers ALWAYS allow instantaneous automated buffering and play!
            controls: 1,
            loop: 1,
            playlist: activeYtId,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            disablekb: 1,
            enablejsapi: 1
          },
          events: {
            onReady: (event: any) => {
              playerRef.current = event.target;
              event.target.setVolume(80); // Set perfect romantic volume
              
              try {
                event.target.playVideo();
                if (userInteractedRef.current) {
                  unmuteAndPlay();
                } else {
                  setPlaybackStatus("Autoplay Ready ✨");
                }
              } catch (e) {
                setPlaybackStatus("Ready (Tap to play) 💖");
              }
            },
            onStateChange: (event: any) => {
              const state = event.data;
              if (state === window.YT.PlayerState.PLAYING) {
                const player = event.target;
                if (!isMuted) {
                  try {
                    player.unMute();
                    player.setVolume(80);
                  } catch (e) {}
                  setPlaybackStatus("Playing Live 🔊");
                }
              } else if (state === window.YT.PlayerState.PAUSED) {
                setPlaybackStatus("Paused");
              } else if (state === window.YT.PlayerState.BUFFERING) {
                setPlaybackStatus("Buffering... ⏳");
              }
            }
          }
        });
      } catch (err) {
        console.warn("YouTube Player initialization failed:", err);
      }
    };

    // Initialize player once API is detected
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
      };
    }

    function unmuteAndPlay() {
      const player = playerRef.current;
      if (player && typeof player.unMute === 'function') {
        try {
          player.unMute();
          player.setVolume(85);
          player.playVideo();
          setIsMuted(false);
          setPlaybackStatus("Playing Live 🔊");
        } catch (err) {
          console.warn("YouTube play failed:", err);
        }
      }
    }

    // Expose global unmuting function to be triggered on password unlock & screen touches
    (window as any).__unmuteThemeMusic = () => {
      userInteractedRef.current = true;
      unmuteAndPlay();
    };

    const removeListeners = () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };

    // Dynamic unmuting triggers on any user touch/tap
    const handleInteraction = () => {
      if (userInteractedRef.current) return;
      userInteractedRef.current = true;
      removeListeners();
      unmuteAndPlay();
    };

    window.addEventListener('click', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('mousedown', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });
    window.addEventListener('scroll', handleInteraction, { passive: true });

    return () => {
      removeListeners();
      try {
        delete (window as any).__unmuteThemeMusic;
      } catch (err) {}
    };
  }, []);

  const handleManualPlayUnmute = () => {
    userInteractedRef.current = true;
    
    const player = playerRef.current;
    if (player && typeof player.unMute === 'function') {
      try {
        // If the player state says it's paused or unstarted, play it, otherwise mute/unmute
        let isCurrentlyPlaying = false;
        try {
          const state = player.getPlayerState();
          isCurrentlyPlaying = (state === 1);
        } catch(e) {}

        if (player.isMuted() || !isCurrentlyPlaying) {
          player.unMute();
          player.setVolume(80);
          player.playVideo();
          setIsMuted(false);
          setPlaybackStatus("Playing Live 🔊");
        } else {
          player.mute();
          setIsMuted(true);
          setPlaybackStatus("Muted");
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <div 
      className={`fixed bottom-4 left-4 z-50 bg-slate-950/90 backdrop-blur-md rounded-xl border border-pink-500/25 shadow-[0_0_15px_rgba(236,72,153,0.25)] flex flex-col items-center gap-1.5 transition-all duration-300 md:bottom-5 md:left-5 ${
        isMinimized ? 'w-[110px] p-1.5 opacity-90 hover:opacity-100 hover:scale-[1.03]' : 'w-[180px] p-2.5'
      }`}
    >
      <div className="flex items-center justify-between w-full gap-1 px-0.5">
        <span className="text-[9.5px] font-black text-pink-300 tracking-wider uppercase flex items-center gap-0.5 select-none drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">
          {isMinimized ? "🎵" : "💖 Music"}
        </span>
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-[9px] bg-pink-900/40 text-pink-200 hover:bg-pink-800/60 hover:text-white px-2 py-0.5 rounded transition-all font-bold"
          title={isMinimized ? "Maximize Music Player" : "Minimize Music Player"}
        >
          {isMinimized ? "Show" : "Hide"}
        </button>
      </div>

      <div className={`flex flex-col items-center gap-2 w-full transition-all duration-300 ${isMinimized ? 'h-0 opacity-0 pointer-events-none overflow-hidden mt-0' : 'h-auto opacity-100 mt-1'}`}>
        
        {/* 
          Keep the YouTube iframe element PERMANENTLY mounted in the DOM.
          Do not conditionally unmount this wrapper.
        */}
        <div className="rounded-lg overflow-hidden border border-pink-500/20 bg-black relative shadow-inner transition-all duration-300 w-[156px] h-[90px] mb-0.5">
          <div id="bg-music-iframe-api" className="w-full h-full" />
        </div>
        
        <div className="flex flex-col gap-1.5 items-center w-full">
          {/* Reactive Mute-Status button */}
          <button
            onClick={handleManualPlayUnmute}
            className={`w-full text-[10px] font-extrabold py-1.5 px-2 rounded-lg active:scale-95 transition-all flex items-center justify-center gap-1 ${
              isMuted 
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white animate-pulse shadow-xs hover:from-pink-600 hover:to-rose-600' 
                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-950/80'
            }`}
          >
            {isMuted ? "🔊 Tap to Play" : "🔇 Mute"}
          </button>
          
          <div className="flex items-center gap-0.5 justify-center select-none">
            <span className="text-[8px] uppercase tracking-widest font-mono text-zinc-400 font-semibold">
              Status:
            </span>
            <span className={`text-[8.5px] font-extrabold px-0.5 rounded uppercase tracking-wider ${
              isMuted ? 'text-pink-400 animate-pulse' : 'text-emerald-400'
            }`}>
              {playbackStatus}
            </span>
          </div>

          <p className="text-[8px] text-pink-300/70 font-semibold text-center leading-snug select-none px-1">
            Tap screen to play music! 💕
          </p>
        </div>
      </div>
    </div>
  );
}
