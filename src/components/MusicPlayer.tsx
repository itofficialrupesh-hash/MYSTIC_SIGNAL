import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertCircle, Tv, Music } from 'lucide-react';

interface MusicPlayerProps {
  musicUrl?: string;
}

// Support extraction of YouTube 11-char ID safely
function getYouTubeId(url: string | undefined): string {
  if (!url) return "2_i3Iw0rZPo";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : "2_i3Iw0rZPo";
}

export default function MusicPlayer({ musicUrl }: MusicPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const audioFallbackRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [showAutoplayAdvisory, setShowAutoplayAdvisory] = useState(true);
  const [showMiniPlayer, setShowMiniPlayer] = useState(true);
  const [audioSource, setAudioSource] = useState<'youtube' | 'fallback'>('youtube');

  // Hardcode the gorgeous romantic song standard url
  const activeYtId = "2_i3Iw0rZPo";

  // Beautiful alternative romantic backup stream
  const ROMANTIC_PIANO_MP3 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

  // Safely dispatch postMessage commands to YouTube Iframe
  const sendYtCommand = (func: string, args: any = '') => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch (err) {
        console.warn("YouTube control action failed:", err);
      }
    }
  };

  // Harmonize playback state changes instantly
  useEffect(() => {
    if (isPlaying) {
      if (audioSource === 'youtube') {
        sendYtCommand('playVideo');
        sendYtCommand('unMute');
        sendYtCommand('setVolume', isMuted ? 0 : volume * 100);
        if (audioFallbackRef.current) {
          audioFallbackRef.current.pause();
        }
      } else {
        sendYtCommand('pauseVideo');
        if (audioFallbackRef.current) {
          audioFallbackRef.current.volume = isMuted ? 0 : volume;
          audioFallbackRef.current.play().catch(() => {});
        }
      }
    } else {
      sendYtCommand('pauseVideo');
      if (audioFallbackRef.current) {
        audioFallbackRef.current.pause();
      }
    }
  }, [isPlaying, audioSource, volume, isMuted]);

  // Synchronize master volume edits across both engines
  useEffect(() => {
    const calculatedVolume = isMuted ? 0 : volume * 100;
    if (audioSource === 'youtube') {
      sendYtCommand('setVolume', calculatedVolume);
    } else if (audioFallbackRef.current) {
      audioFallbackRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioSource]);

  // On page load, listen for a click or screen touch to automatically play
  useEffect(() => {
    let hasTriggered = false;

    const startAutoplayOnGesture = () => {
      if (hasTriggered) return;
      hasTriggered = true;
      setIsPlaying(true);
      setShowAutoplayAdvisory(false);

      // Trigger standard Play actions across both channels
      sendYtCommand('playVideo');
      sendYtCommand('unMute');
      sendYtCommand('setVolume', volume * 100);

      if (audioFallbackRef.current) {
        audioFallbackRef.current.volume = volume;
        audioFallbackRef.current.play().catch((e) => {
          console.log("Internal backup audio play blocked:", e);
        });
      }

      cleanupGestureListeners();
    };

    const cleanupGestureListeners = () => {
      window.removeEventListener('click', startAutoplayOnGesture);
      window.removeEventListener('touchstart', startAutoplayOnGesture);
      window.removeEventListener('mousedown', startAutoplayOnGesture);
      window.removeEventListener('keydown', startAutoplayOnGesture);
      window.removeEventListener('scroll', startAutoplayOnGesture);
    };

    window.addEventListener('click', startAutoplayOnGesture, { once: true });
    window.addEventListener('touchstart', startAutoplayOnGesture, { passive: true, once: true });
    window.addEventListener('mousedown', startAutoplayOnGesture, { once: true });
    window.addEventListener('keydown', startAutoplayOnGesture, { once: true });
    window.addEventListener('scroll', startAutoplayOnGesture, { passive: true, once: true });

    // Try a soft automatic start timer 
    const fallbackTimer = setTimeout(() => {
      if (!hasTriggered) {
        startAutoplayOnGesture();
      }
    }, 2500);

    return () => {
      cleanupGestureListeners();
      clearTimeout(fallbackTimer);
    };
  }, []);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
    setShowAutoplayAdvisory(false);
  };

  const switchTrackSource = (source: 'youtube' | 'fallback') => {
    setAudioSource(source);
    setIsPlaying(true);
    setShowAutoplayAdvisory(false);
  };

  return (
    <div className="fixed bottom-3 left-3 sm:left-auto sm:right-3 z-50 flex flex-col items-end gap-2 select-none max-w-[240px] w-full animate-fade-in">
      
      {/* Mini display box containing the live TV stream */}
      {showMiniPlayer && (
        <div className="w-full bg-slate-900/95 border border-pink-300 rounded-2xl p-2.5 shadow-2xl flex flex-col gap-1.5 relative transition-all duration-300">
          
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-1.5 mb-0.5">
            <span className="text-[9px] font-black tracking-widest text-pink-400 uppercase font-mono flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              <span>Romantic FM 📻</span>
            </span>
            <button 
              onClick={() => setShowMiniPlayer(false)}
              className="text-[8px] font-bold text-gray-450 hover:text-white bg-white/10 rounded px-1.5 py-0.5 cursor-pointer"
            >
              Hide
            </button>
          </div>

          {/* YouTube Video container */}
          {audioSource === 'youtube' ? (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner border border-white/10">
              <iframe
                ref={iframeRef}
                id="yt-iframe-player"
                src={`https://www.youtube.com/embed/${activeYtId}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${activeYtId}&controls=0&playsinline=1&rel=0`}
                allow="autoplay; encrypted-media"
                className="w-full h-full object-cover"
                title="Romantic Melody YouTube Player"
              />
              <div className="absolute inset-0 bg-pink-500/5 mix-blend-color pointer-events-none" />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-pink-900/80 to-purple-900/90 flex flex-col items-center justify-center border border-pink-500/30 text-center px-2 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="text-2xl mb-1">💖</div>
              <p className="text-[10px] font-black tracking-wider text-pink-300 uppercase font-serif">Direct Audio Active</p>
              <p className="text-[9px] text-white/70 italic mt-0.5 leading-normal">"Fail-Safe Melody"</p>
            </div>
          )}

          {/* Source switchers */}
          <div className="grid grid-cols-2 gap-1 mt-0.5 border-t border-white/5 pt-1.5">
            <button
              onClick={() => switchTrackSource('youtube')}
              className={`flex items-center justify-center gap-1 py-0.5 rounded-lg text-[8px] font-bold transition-all cursor-pointer ${
                audioSource === 'youtube' 
                  ? 'bg-pink-500 text-white shadow-sm' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
              }`}
            >
              <Tv size={9} />
              <span>YouTube</span>
            </button>
            <button
              onClick={() => switchTrackSource('fallback')}
              className={`flex items-center justify-center gap-1 py-0.5 rounded-lg text-[8px] font-bold transition-all cursor-pointer ${
                audioSource === 'fallback' 
                  ? 'bg-pink-500 text-white shadow-sm' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
              }`}
            >
              <Music size={9} />
              <span>Backup</span>
            </button>
          </div>
        </div>
      )}

      {/* Background audio backup player */}
      <audio 
        ref={audioFallbackRef} 
        src={ROMANTIC_PIANO_MP3} 
        loop
        className="hidden pointer-events-none w-0 h-0"
      />

      {/* Advisory hint to unmute/touch */}
      {showAutoplayAdvisory && !isPlaying && (
        <p className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white text-[10px] font-bold font-serif rounded-full px-3 py-1.5 shadow-2xl border border-pink-300/30 flex items-center gap-1.5 animate-bounce cursor-pointer">
          <span className="animate-pulse text-xs">💋</span>
          <span>Tap to unmute song!</span>
        </p>
      )}

      {/* Primary music controls widget panel matching targeted CSS id */}
      <div 
        id="music-player-widget"
        className="glass-card bg-white/95 backdrop-blur-md border border-pink-200/50 shadow-lg rounded-2xl px-2.5 py-1.5 flex items-center gap-2 w-full hover:scale-102 transition-transform duration-300 animate-slide-in"
      >
        <button
          id="btn-toggle-music"
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center text-white transition-all cursor-pointer shadow-md shrink-0 active:scale-95 duration-100"
          title={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <Pause size={14} fill="white" className="text-white" />
          ) : (
            <Play size={14} fill="white" className="text-white ml-0.5" />
          )}
        </button>

        <div className="flex flex-col justify-center w-20 shrink-0 overflow-hidden">
          <span className="text-[8px] font-black tracking-widest text-pink-500 uppercase font-mono leading-none flex items-center gap-1">
            <span>Now Playing</span>
            {isPlaying && <span className="animate-ping inline-flex h-1 w-1 rounded-full bg-pink-400"></span>}
          </span>
          <span className="text-[10px] font-bold text-slate-800 truncate block mt-0.5">
            Beautiful Birthday 🎂
          </span>
        </div>

        {/* Moving music wave bars */}
        <div className="flex items-end gap-0.5 h-3 w-4 shrink-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-0.5 bg-pink-400 rounded-full"
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

        <div className="flex items-center gap-1 border-l border-pink-100 pl-1.5 shrink-0">
          <button 
            id="btn-toggle-mute"
            onClick={() => setIsMuted(prev => !prev)} 
            className="text-slate-400 hover:text-pink-600 cursor-pointer transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
          <input
            id="vol-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              if (val > 0) setIsMuted(false);
            }}
            className="w-8 h-1 accent-pink-500 bg-pink-100 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
