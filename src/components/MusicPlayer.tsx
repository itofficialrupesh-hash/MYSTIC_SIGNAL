import React, { useEffect, useRef, useState } from 'react';
import { logActivity } from '../lib/activityLogger';

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
  if (!url) return "MAvHJCModP0";
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
  return "MAvHJCModP0";
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
    if (player) {
      try {
        // Dynamic allow attribute delegation to ensure nested iframe can play audio unmuted
        const iframe = document.getElementById('bg-music-iframe-api') as HTMLIFrameElement;
        if (iframe) {
          iframe.setAttribute('allow', 'autoplay; encrypted-media');
        }

        // Try unmuting first (crucial for gesture-gated audio channels)
        if (typeof player.unMute === 'function') {
          player.unMute();
        }
        if (typeof player.setVolume === 'function') {
          player.setVolume(85);
        }
        if (typeof player.playVideo === 'function') {
          player.playVideo();
        }
        setIsMuted(false);
        isMutedRef.current = false;
        setPlaybackStatus("Playing Live 🔊");

        // Delayed retry to handle transition states
        setTimeout(() => {
          try {
            const currentIframe = document.getElementById('bg-music-iframe-api') as HTMLIFrameElement;
            if (currentIframe) {
              currentIframe.setAttribute('allow', 'autoplay; encrypted-media');
            }
            if (typeof player.unMute === 'function') player.unMute();
            if (typeof player.setVolume === 'function') player.setVolume(85);
            if (typeof player.playVideo === 'function') player.playVideo();
          } catch (e) {}
        }, 150);
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
        playerRef.current = new window.YT.Player('bg-music-iframe-api', {
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
                  event.target.playVideo();
                  event.target.unMute();
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
                    setIsMuted(false);
                    isMutedRef.current = false;
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

    const events = ['click', 'touchstart', 'touchend', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'keydown', 'scroll'];

    events.forEach(evt => {
      window.addEventListener(evt, handleInteraction, { capture: true });
      document.addEventListener(evt, handleInteraction, { capture: true });
      if (document.body) {
        document.body.addEventListener(evt, handleInteraction, { capture: true });
      }
    });

    // Background sync interval to force unmute once the user has interacted at least once
    const syncInterval = setInterval(() => {
      const player = playerRef.current;
      if (player && typeof player.isMuted === 'function') {
        try {
          const physicallyMuted = player.isMuted();
          
          if (userInteractedRef.current && !userVoluntarilyMutedRef.current) {
            // Force play if it is paused or unstarted
            let playerState = -1;
            try {
              playerState = player.getPlayerState();
            } catch (e) {}

            if (playerState === 2 || playerState === -1 || playerState === 5) {
              if (typeof player.playVideo === 'function') {
                player.playVideo();
              }
            }

            if (physicallyMuted) {
              if (typeof player.unMute === 'function') {
                player.unMute();
              }
              if (typeof player.setVolume === 'function') {
                player.setVolume(85);
              }
            }
            setIsMuted(false);
            isMutedRef.current = false;
            setPlaybackStatus("Playing Live 🔊");
          } else {
            // Keep state in sync with physical player state
            if (physicallyMuted !== isMutedRef.current) {
              setIsMuted(physicallyMuted);
              isMutedRef.current = physicallyMuted;
              setPlaybackStatus(physicallyMuted ? "Muted" : "Playing Live 🔊");
            }
          }
        } catch (e) {}
      }
    }, 400);

    return () => {
      clearInterval(syncInterval);
      events.forEach(evt => {
        window.removeEventListener(evt, handleInteraction, { capture: true });
        document.removeEventListener(evt, handleInteraction, { capture: true });
        if (document.body) {
          document.body.removeEventListener(evt, handleInteraction, { capture: true });
        }
      });
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
          logActivity("Played Music", "Unmuted background track");
        } else {
          player.mute();
          setIsMuted(true);
          setPlaybackStatus("Muted");
          userVoluntarilyMutedRef.current = true;
          logActivity("Muted Music", "Muted background track");
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2">
      {/* Offscreen YouTube iframe container required for audio engine */}
      <div className="w-1 h-1 opacity-0 overflow-hidden absolute pointer-events-none -z-50" aria-hidden="true">
        <div id="bg-music-iframe-api" className="w-full h-full" />
      </div>

      {/* Ultra-compact Mini Music Player Toggle */}
      <button
        type="button"
        onClick={handleManualPlayUnmute}
        className={`px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 flex items-center gap-1.5 text-xs font-black cursor-pointer active:scale-95 select-none ${
          isMuted
            ? 'bg-slate-950/90 text-pink-300 border-pink-500/40 hover:bg-slate-900 shadow-[0_0_12px_rgba(236,72,153,0.3)] animate-pulse'
            : 'bg-slate-950/90 text-emerald-300 border-emerald-500/40 hover:bg-slate-900 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
        }`}
        title={isMuted ? "Play Music" : "Mute Music"}
      >
        <span className="text-sm">{isMuted ? "▶️" : "🔊"}</span>
        <span>{isMuted ? "Play" : "Mute"}</span>
      </button>
    </div>
  );
}
