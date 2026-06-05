import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertCircle, HardDrive, Tv } from 'lucide-react';

interface MusicPlayerProps {
  musicUrl: string;
}

// Extract standard YouTube 11-character video ID
function getYouTubeId(url: string): string {
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
  
  // Dynamic audio stream state: 'youtube' or 'fallback'
  const [audioSource, setAudioSource] = useState<'youtube' | 'fallback'>('youtube');
  const [hasInteracted, setHasInteracted] = useState(false);

  // Extract the specific romantic music video request which is '2_i3Iw0rZPo'
  const requestedYtId = getYouTubeId(musicUrl) || "2_i3Iw0rZPo";

  // Extremely beautiful and universal romantic acoustic loop for fail-safe play
  const ROMANTIC_PIANO_MP3 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

  // Dispatch postMessage command safely to YouTube iframe (requires enablejsapi=1)
  const sendYtCommand = (func: string, args: any = '') => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch (err) {
        console.warn("Could not dispatch YouTube postMessage command:", err);
      }
    }
  };

  // Harmonize state changes (Play / Pause / Volume / Mute)
  useEffect(() => {
    if (isPlaying) {
      if (audioSource === 'youtube') {
        // Play YouTube track
        sendYtCommand('playVideo');
        sendYtCommand('unMute');
        sendYtCommand('setVolume', isMuted ? 0 : volume * 105);
        
        // Ensure standard audio tag is quiet
        if (audioFallbackRef.current) {
          audioFallbackRef.current.pause();
        }
      } else {
        // Play Native Fallback track
        sendYtCommand('pauseVideo');
        if (audioFallbackRef.current) {
          audioFallbackRef.current.volume = isMuted ? 0 : volume;
          audioFallbackRef.current.play().catch(() => {});
        }
      }
    } else {
      // Pause both sources
      sendYtCommand('pauseVideo');
      if (audioFallbackRef.current) {
        audioFallbackRef.current.pause();
      }
    }
  }, [isPlaying, audioSource, volume, isMuted]);

  // Synchronize dynamic volume/mute tweaks instantly
  useEffect(() => {
    const volPercent = isMuted ? 0 : volume * 105;
    if (audioSource === 'youtube') {
      sendYtCommand('setVolume', volPercent);
    } else if (audioFallbackRef.current) {
      audioFallbackRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioSource]);

  // Handle single physical gesture activation (one-shot wake-up listener)
  // This completely stops event listener spamming & avoids crashing the IFrame during scroll, etc.
  useEffect(() => {
    let triggered = false;

    const activateAudioOnGesture = () => {
      if (triggered) return;
      triggered = true;
      setHasInteracted(true);
      setShowAutoplayAdvisory(false);
      setIsPlaying(true);

      // Perform single-time unmuting and playing trigger on both sources
      sendYtCommand('playVideo');
      sendYtCommand('unMute');
      sendYtCommand('setVolume', volume * 105);

      if (audioFallbackRef.current) {
        audioFallbackRef.current.volume = volume;
        audioFallbackRef.current.play().catch((e) => {
          console.log("Direct native player audio play policy restricted:", e);
        });
      }

      // Turn off wake up triggers entirely to save CPU and event loops
      cleanUpGestureListeners();
    };

    const cleanUpGestureListeners = () => {
      window.removeEventListener('click', activateAudioOnGesture);
      window.removeEventListener('touchstart', activateAudioOnGesture);
      window.removeEventListener('mousedown', activateAudioOnGesture);
      window.removeEventListener('keydown', activateAudioOnGesture);
      window.removeEventListener('scroll', activateAudioOnGesture);
    };

    window.addEventListener('click', activateAudioOnGesture, { once: true });
    window.addEventListener('touchstart', activateAudioOnGesture, { passive: true, once: true });
    window.addEventListener('mousedown', activateAudioOnGesture, { once: true });
    window.addEventListener('keydown', activateAudioOnGesture, { once: true });
    window.addEventListener('scroll', activateAudioOnGesture, { passive: true, once: true });

    // Fallback automatic playback trigger in case browser setup allows early play
    const autoPlayTimer = setTimeout(() => {
      if (!triggered) {
        activateAudioOnGesture();
      }
    }, 2800);

    return () => {
      cleanUpGestureListeners();
      clearTimeout(autoPlayTimer);
    };
  }, []);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
    setShowAutoplayAdvisory(false);
  };

  const handleSliderVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) {
      setIsMuted(false);
    }
  };

  const switchSource = (source: 'youtube' | 'fallback') => {
    setAudioSource(source);
    setIsPlaying(true);
    setShowAutoplayAdvisory(false);
  };

  return (
    <div className="fixed bottom-4 left-4 sm:left-auto sm:right-4 z-50 flex flex-col items-end gap-2.5 select-none max-w-[290px] w-full animate-fade-in">
      
      {/* 
        Aesthetic "Romantic TV Screen" visual portal!
        By keeping the YouTube frame visual and beautiful inside the screen, we ensure high compatibility.
        If the YouTube IFrame is blocked locally, they can easily press the direct switch!
      */}
      {showMiniPlayer && (
        <div className="w-full bg-slate-900/95 border-2 border-pink-300 rounded-3xl p-3 shadow-2xl flex flex-col gap-2 relative transition-all duration-300">
          
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-2 mb-1">
            <span className="text-[10px] font-black tracking-widest text-pink-400 uppercase font-mono flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
              </span>
              <span>Our Love Radio 📻</span>
            </span>
            <button 
              onClick={() => setShowMiniPlayer(false)}
              className="text-[9px] font-bold text-gray-400 hover:text-white bg-white/10 rounded-lg px-2 py-0.5 pointer-events-auto cursor-pointer"
            >
              Hide TV
            </button>
          </div>

          {/* Real YouTube Embed player */}
          {audioSource === 'youtube' ? (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-white/10">
              <iframe
                ref={iframeRef}
                id="yt-iframe-player"
                src={`https://www.youtube.com/embed/${requestedYtId}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${requestedYtId}&controls=0&playsinline=1&rel=0&origin=${encodeURIComponent(window.location.origin)}`}
                allow="autoplay; encrypted-media"
                className="w-full h-full object-cover"
                title="YouTube Romantic Stream"
              />
              <div className="absolute inset-0 bg-pink-500/10 mix-blend-color pointer-events-none" />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-pink-900/80 to-purple-900/90 flex flex-col items-center justify-center border border-pink-500/30 text-center px-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="heart-pulsing text-3xl mb-1.5">💖</div>
              <p className="text-[11px] font-black tracking-wider text-pink-300 uppercase font-serif animate-pulse">Direct Audio Connected</p>
              <p className="text-[10px] text-white/70 italic mt-1 leading-normal">"Fail-Safe Beautiful Melody"</p>
            </div>
          )}

          {/* Quick source switch panel (Hindi support instructions to explain to the user) */}
          <div className="grid grid-cols-2 gap-1.5 mt-1 border-t border-white/5 pt-2">
            <button
              onClick={() => switchSource('youtube')}
              className={`flex items-center justify-center gap-1 py-1 rounded-xl text-[9px] font-bold transition-all cursor-pointer ${
                audioSource === 'youtube' 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
              }`}
            >
              <Tv size={11} />
              <span>YouTube Video</span>
            </button>
            <button
              onClick={() => switchSource('fallback')}
              className={`flex items-center justify-center gap-1 py-1 rounded-xl text-[9px] font-bold transition-all cursor-pointer ${
                audioSource === 'fallback' 
                  ? 'bg-purple-650 text-white shadow-md' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
              }`}
            >
              <HardDrive size={11} />
              <span>Backup Audio</span>
            </button>
          </div>

          <p className="text-[9.5px] text-center text-pink-300/90 bg-pink-950/40 rounded-lg py-1 px-1.5 mt-0.5 leading-tight">
            {audioSource === 'youtube' 
              ? "🎥 YouTube Active (Click 'Backup' if you hear nothing!)" 
              : "🎵 Backup Melody Active (Plays immediately everywhere!)"
            }
          </p>
        </div>
      )}

      {/* Classic HTML5 background fallback audio stream */}
      <audio 
        ref={audioFallbackRef} 
        src={ROMANTIC_PIANO_MP3} 
        loop
        className="hidden pointer-events-none w-0 h-0"
      />

      {/* Onscreen touch instruction bubble if state is quiet */}
      {showAutoplayAdvisory && !isPlaying && (
        <p className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white text-[11px] font-bold font-serif rounded-full px-4.5 py-2 shadow-2xl border border-pink-300/30 flex items-center gap-2 animate-bounce cursor-pointer">
          <span className="animate-pulse text-sm">💋</span>
          <span>Click anywhere to hear our romantic song!</span>
        </p>
      )}

      {/* Primary controller button & player wrap */}
      <div 
        id="music-player-widget"
        className="glass-card bg-white/95 backdrop-blur-md border border-pink-200/50 shadow-xl rounded-3xl px-4 py-2.5 flex items-center gap-3 w-full hover:scale-102 transition-transform duration-300"
      >
        <button
          id="btn-toggle-music"
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center text-white transition-all cursor-pointer shadow-md shrink-0 active:scale-95 duration-100"
          title={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <Pause size={18} fill="white" className="text-white animate-pulse" />
          ) : (
            <Play size={18} fill="white" className="text-white ml-0.5" />
          )}
        </button>

        <div className="flex flex-col justify-center w-28 shrink-0 overflow-hidden">
          <span className="text-[9px] font-black tracking-widest text-pink-500 uppercase font-mono leading-none flex items-center gap-1.5">
            <span>Now Playing</span>
            {isPlaying && <span className="animate-ping inline-flex h-1.5 w-1.5 rounded-full bg-pink-400"></span>}
          </span>
          <span className="text-xs font-bold text-slate-800 truncate block mt-1" title="Beautiful Birthday Video">
            Beautiful Birthday 🎂
          </span>
        </div>

        {/* Dynamic music wave visualizer */}
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

        <div className="flex items-center gap-1.5 border-l border-pink-100 pl-2.5 shrink-0">
          <button 
            id="btn-toggle-mute"
            onClick={() => setIsMuted(prev => !prev)} 
            className="text-slate-400 hover:text-pink-600 cursor-pointer transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <input
            id="vol-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleSliderVolume}
            className="w-10 h-1 accent-pink-500 bg-pink-100 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
