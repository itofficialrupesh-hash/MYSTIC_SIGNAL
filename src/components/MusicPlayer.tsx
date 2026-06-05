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
  const [playbackStatus, setPlaybackStatus] = useState<string>("init");

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
            mute: 1, // Start muted to safely bypass strict Chrome/Safari autoplay policies
            controls: 1, // Show native play controls so user can always tap to play/unmute
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
              event.target.setVolume(60); // Apply target volume level
              
              try {
                event.target.playVideo();
                setPlaybackStatus("playing_muted");
              } catch (e) {
                console.log("Autoplay check:", e);
              }

              // Instant unmute attempt if they clicked the page before API was ready
              if (userInteractedRef.current) {
                unmuteAndPlay();
              }
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setPlaybackStatus("playing");
              }
              if (event.data === window.YT.PlayerState.ENDED) {
                event.target.playVideo();
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

    const unmuteAndPlay = () => {
      const player = playerRef.current;
      if (player && typeof player.unMute === 'function') {
        try {
          player.unMute();
          player.setVolume(60);
          player.playVideo();
          setPlaybackStatus("playing");
        } catch (err) {
          console.warn("Unmute action failed:", err);
        }
      }
    };

    // Dynamic unmuting triggers on any user touch/tap
    const handleInteraction = () => {
      userInteractedRef.current = true;
      unmuteAndPlay();
    };

    window.addEventListener('click', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('mousedown', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });
    window.addEventListener('scroll', handleInteraction, { passive: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  const handleManualPlayUnmute = () => {
    userInteractedRef.current = true;
    const player = playerRef.current;
    if (player && typeof player.unMute === 'function') {
      try {
        player.unMute();
        player.setVolume(60);
        player.playVideo();
        setPlaybackStatus("playing");
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <div 
      className="fixed bottom-4 left-4 z-50 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.15)] flex flex-col items-center gap-1.5 transition-all duration-300 md:bottom-6 md:left-6 max-w-[210px]"
    >
      <div className="flex items-center justify-between w-full gap-3 px-0.5">
        <span className="text-[10px] font-extrabold text-pink-300 tracking-wider uppercase flex items-center gap-1 select-none drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">
          <span className="animate-pulse">🎵</span> Background Music
        </span>
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-[10px] bg-pink-950/40 text-pink-300 hover:bg-pink-900/60 hover:text-pink-100 px-2 py-0.5 rounded-md border border-pink-500/20 transition-all font-bold"
          title={isMinimized ? "Maximize Music Player" : "Minimize Music Player"}
        >
          {isMinimized ? "Show" : "Hide"}
        </button>
      </div>

      {/* 
        CRITICAL BUG FIX: 
        Keep the YouTube iframe element PERMANENTLY mounted in the DOM.
        Do not conditionally unmount this wrapper. Use simple CSS layout tags to hide/minimize it.
        This ensures background audio playback is continuous and never breaks.
      */}
      <div className={`flex flex-col items-center gap-2 w-full transition-all duration-300 ${isMinimized ? 'h-0 opacity-0 pointer-events-none overflow-hidden mt-0' : 'h-auto opacity-100 mt-1'}`}>
        <div className="w-[170px] h-[95px] rounded-lg overflow-hidden border border-pink-500/20 bg-black relative shadow-inner">
          <div id="bg-music-iframe-api" className="w-full h-full" />
        </div>
        
        <div className="flex flex-col gap-1 items-center w-full">
          <button
            onClick={handleManualPlayUnmute}
            className="w-full text-[10px] bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold py-1.5 px-2 rounded-lg hover:from-pink-600 hover:to-rose-600 active:scale-[0.98] transition-all shadow-[0_0_12px_rgba(236,72,153,0.35)]"
          >
            🔊 Click to Unmute / Play
          </button>
          <p className="text-[9px] text-pink-400 font-bold text-center leading-normal select-none">
            Tap screen, button or red play icon 💖
          </p>
        </div>
      </div>
    </div>
  );
}
