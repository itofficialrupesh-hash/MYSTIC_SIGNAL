import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';

export default function PrincessMusicControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);

  // Gentle music-box & harp fairytale melody (starts strictly on user click)
  const melodyHz = [
    523.25, 659.25, 783.99, 659.25,
    587.33, 698.46, 659.25, 523.25,
    440.0, 523.25, 587.33, 659.25,
    587.33, 493.88, 523.25, 392.0,
  ];
  const bassHz = [261.63, 220.0, 174.61, 196.0];

  const stopMusic = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend().catch(() => {});
    }
    setIsPlaying(false);
  };

  const playNote = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const step = stepRef.current;
    const freq = melodyHz[step % melodyHz.length];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0005, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0004, now + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.9);

    if (step % 4 === 0) {
      const bassFreq = bassHz[Math.floor(step / 4) % bassHz.length];
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, now);
      bassGain.gain.setValueAtTime(0.0004, now);
      bassGain.gain.linearRampToValueAtTime(0.015, now + 0.4);
      bassGain.gain.exponentialRampToValueAtTime(0.0004, now + 3.2);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 3.3);
    }

    stepRef.current = step + 1;
  };

  const togglePlay = async () => {
    if (isPlaying) {
      stopMusic();
      return;
    }
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      setIsPlaying(true);
      playNote();
      timerRef.current = window.setInterval(playNote, 820);
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={togglePlay}
      aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
      className={`inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 border shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 ${
        isPlaying
          ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white border-pink-300 shadow-[0_4px_16px_rgba(236,72,153,0.3)]'
          : 'bg-white/85 hover:bg-white text-pink-700 border-pink-200'
      }`}
    >
      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
      <span>{isPlaying ? 'Pause Music' : 'Play Music'}</span>
      <Music size={13} className="opacity-75 hidden sm:inline" />
    </button>
  );
}
