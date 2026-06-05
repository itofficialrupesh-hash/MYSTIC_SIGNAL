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
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
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
            mute: 0, // Request unmuted playback immediately if browser permissions allow
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
                event.target.unMute();
                event.target.playVideo();
                setIsMuted(false);
                setPlaybackStatus("Playing Live 🔊");
              } catch (e) {
                setPlaybackStatus("Ready (Tap to play) 💖");
              }

              // Instant unmute if the user already interacted
              if (userInteractedRef.current) {
                unmuteAndPlay();
              }
            },
            onStateChange: (event: any) => {
              const state = event.data;
              if (state === window.YT.PlayerState.PLAYING) {
                const player = event.target;
                try {
                  player.unMute();
                  player.setVolume(80);
                } catch (e) {}
                setIsMuted(false);
                setPlaybackStatus("Playing Live 🔊");
                userInteractedRef.current = true;
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
      className="fixed bottom-4 left-4 z-50 bg-slate-950/95 backdrop-blur-md p-4 rounded-2xl border border-pink-500/35 shadow-[0_0_25px_rgba(236,72,153,0.35)] flex flex-col items-center gap-2.5 transition-all duration-300 md:bottom-6 md:left-6 w-[230px]"
    >
      <div className="flex items-center justify-between w-full gap-2 px-0.5">
        <span className="text-[11px] font-black text-pink-300 tracking-wider uppercase flex items-center gap-1 select-none drop-shadow-[0_0_10px_rgba(236,72,153,0.4)]">
          <span className="animate-pulse">💖</span> Magic Music
        </span>
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-[10px] bg-pink-900/40 text-pink-300 hover:bg-pink-800/50 hover:text-pink-100 px-2.5 py-1 rounded-md border border-pink-500/20 transition-all font-bold"
          title={isMinimized ? "Maximize Music Player" : "Minimize Music Player"}
        >
          {isMinimized ? "Show" : "Hide"}
        </button>
      </div>

      <div className={`flex flex-col items-center gap-2.5 w-full transition-all duration-300 ${isMinimized ? 'h-0 opacity-0 pointer-events-none overflow-hidden mt-0' : 'h-auto opacity-100 mt-1'}`}>
        
        {/* 
          Keep the YouTube iframe element PERMANENTLY mounted in the DOM.
          Do not conditionally unmount this wrapper.
        */}
        <div className="rounded-lg overflow-hidden border border-pink-500/30 bg-black relative shadow-inner transition-all duration-300 w-[196px] h-[110px] mb-1">
          <div id="bg-music-iframe-api" className="w-full h-full" />
        </div>
        
        <div className="flex flex-col gap-2 items-center w-full">
          {/* Reactive Mute-Status button */}
          <button
            onClick={handleManualPlayUnmute}
            className={`w-full text-[11px] font-extrabold py-2 px-3 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 ${
              isMuted 
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white animate-pulse shadow-[0_0_15px_rgba(236,72,153,0.35)] hover:from-pink-600 hover:to-rose-600' 
                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-950/80'
            }`}
          >
            {isMuted ? "🔊 Tap to Play & Unmute" : "🔇 Mute Background"}
          </button>
          
          <div className="flex items-center gap-1 justify-center select-none mt-0.5">
            <span className="text-[9px] uppercase tracking-widest font-mono text-zinc-400 font-semibold">
              Status:
            </span>
            <span className={`text-[9.5px] font-extrabold px-1 rounded uppercase tracking-wider ${
              isMuted ? 'text-pink-400 animate-pulse' : 'text-emerald-400'
            }`}>
              {playbackStatus}
            </span>
          </div>

          <p className="text-[9.5px] text-pink-300/80 font-semibold text-center leading-normal select-none px-1">
            Touching or tapping anywhere on the page starts the music automatically! 💕
          </p>
        </div>
      </div>
    </div>
  );
}
