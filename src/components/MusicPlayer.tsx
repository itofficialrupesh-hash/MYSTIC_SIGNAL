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

function getYouTubeId(url: string | undefined): string {
  if (!url) return "8PTOkwze0Vw";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|si=)([^#\&\?]*).*/;
  // Try extracting standard Youtube watch ID, shortlink, parameter or si
  const match = url.match(regExp);
  // Also try simple query param watch?v= or slash parsing
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }
  // Alternate simpler check for short links and direct watch links
  try {
    if (url.includes("youtu.be/")) {
      const parts = url.split("youtu.be/");
      if (parts[1]) {
        const id = parts[1].split(/[?#]/)[0];
        if (id.length === 11) return id;
      }
    }
    if (url.includes("v=")) {
      const parts = url.split("v=");
      if (parts[1]) {
        const id = parts[1].substring(0, 11);
        if (id.length === 11) return id;
      }
    }
  } catch (e) {}
  return "8PTOkwze0Vw";
}

export default function MusicPlayer({ musicUrl }: MusicPlayerProps) {
  const playerRef = useRef<any>(null);
  const initializedRef = useRef<boolean>(false);
  const userInteractedRef = useRef<boolean>(false);
  const userVoluntarilyMutedRef = useRef<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const isMutedRef = useRef<boolean>(true);
  const [playbackStatus, setPlaybackStatus] = useState<string>("Initializing...");

  const activeYtId = getYouTubeId(musicUrl);

  const unmuteAndPlay = () => {
    if (userVoluntarilyMutedRef.current) return;
    const player = playerRef.current;
    if (player && typeof player.unMute === 'function') {
      try {
        player.unMute();
        player.setVolume(85);
        player.playVideo();
        setIsMuted(false);
        isMutedRef.current = false;
        setPlaybackStatus("Playing Live 🔊");
      } catch (err) {
        console.warn("YouTube play failed:", err);
      }
    }
  };

  // Keep ref up-to-date with state
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

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
              event.target.setVolume(85); // Set perfect romantic volume
              
              const alreadyInteracted = userInteractedRef.current && !userVoluntarilyMutedRef.current;
              if (alreadyInteracted) {
                try {
                  event.target.unMute();
                  event.target.playVideo();
                  setIsMuted(false);
                  isMutedRef.current = false;
                  setPlaybackStatus("Playing Live 🔊");
                } catch (e) {
                  console.warn("Unmuted play error onReady:", e);
                }
              } else {
                try {
                  // ALWAYS START MUTED TO ALLOW AUTOPLAY BY BROWSER WITHOUT BLOCKS
                  event.target.mute();
                  event.target.playVideo();
                  setIsMuted(true);
                  isMutedRef.current = true;
                  setPlaybackStatus("Autoplay Ready ✨");
                } catch (e) {
                  console.warn("Muted play error onReady:", e);
                  try {
                    event.target.mute();
                    event.target.playVideo();
                  } catch (e2) {}
                }
              }
            },
            onStateChange: (event: any) => {
              const state = event.data;
              if (state === window.YT.PlayerState.PLAYING) {
                const player = event.target;
                if (userInteractedRef.current && !userVoluntarilyMutedRef.current) {
                  try {
                    player.unMute();
                    player.setVolume(85);
                    setIsMuted(false);
                    isMutedRef.current = false;
                    setPlaybackStatus("Playing Live 🔊");
                  } catch (e) {}
                } else if (!isMutedRef.current && !userVoluntarilyMutedRef.current) {
                  try {
                    player.unMute();
                    player.setVolume(85);
                    setPlaybackStatus("Playing Live 🔊");
                  } catch (e) {}
                } else {
                  setPlaybackStatus("Autoplay Ready ✨");
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

    // Expose global unmuting function to be triggered on password unlock & screen touches
    (window as any).__unmuteThemeMusic = () => {
      userInteractedRef.current = true;
      unmuteAndPlay();
    };

    // Dynamic unmuting triggers on any user touch/tap on the screen
    const handleInteraction = () => {
      userInteractedRef.current = true;
      unmuteAndPlay();
    };

    const eventOpts = { capture: true, passive: true };

    window.addEventListener('click', handleInteraction, eventOpts);
    window.addEventListener('touchstart', handleInteraction, eventOpts);
    window.addEventListener('mousedown', handleInteraction, eventOpts);
    window.addEventListener('keydown', handleInteraction, eventOpts);
    window.addEventListener('scroll', handleInteraction, eventOpts);
    window.addEventListener('pointerdown', handleInteraction, eventOpts);

    document.addEventListener('click', handleInteraction, eventOpts);
    document.addEventListener('touchstart', handleInteraction, eventOpts);
    document.addEventListener('mousedown', handleInteraction, eventOpts);
    document.addEventListener('keydown', handleInteraction, eventOpts);
    document.addEventListener('scroll', handleInteraction, eventOpts);
    document.addEventListener('pointerdown', handleInteraction, eventOpts);

    if (document.body) {
      document.body.addEventListener('click', handleInteraction, eventOpts);
      document.body.addEventListener('touchstart', handleInteraction, eventOpts);
      document.body.addEventListener('mousedown', handleInteraction, eventOpts);
      document.body.addEventListener('keydown', handleInteraction, eventOpts);
      document.body.addEventListener('scroll', handleInteraction, eventOpts);
      document.body.addEventListener('pointerdown', handleInteraction, eventOpts);
    }

    return () => {
      window.removeEventListener('click', handleInteraction, eventOpts);
      window.removeEventListener('touchstart', handleInteraction, eventOpts);
      window.removeEventListener('mousedown', handleInteraction, eventOpts);
      window.removeEventListener('keydown', handleInteraction, eventOpts);
      window.removeEventListener('scroll', handleInteraction, eventOpts);
      window.removeEventListener('pointerdown', handleInteraction, eventOpts);

      document.removeEventListener('click', handleInteraction, eventOpts);
      document.removeEventListener('touchstart', handleInteraction, eventOpts);
      document.removeEventListener('mousedown', handleInteraction, eventOpts);
      document.removeEventListener('keydown', handleInteraction, eventOpts);
      document.removeEventListener('scroll', handleInteraction, eventOpts);
      document.removeEventListener('pointerdown', handleInteraction, eventOpts);

      if (document.body) {
        document.body.removeEventListener('click', handleInteraction, eventOpts);
        document.body.removeEventListener('touchstart', handleInteraction, eventOpts);
        document.body.removeEventListener('mousedown', handleInteraction, eventOpts);
        document.body.removeEventListener('keydown', handleInteraction, eventOpts);
        document.body.removeEventListener('scroll', handleInteraction, eventOpts);
        document.body.removeEventListener('pointerdown', handleInteraction, eventOpts);
      }
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
          userVoluntarilyMutedRef.current = false;
        } else {
          player.mute();
          setIsMuted(true);
          setPlaybackStatus("Muted");
          userVoluntarilyMutedRef.current = true;
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
