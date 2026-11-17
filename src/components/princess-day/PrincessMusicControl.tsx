import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

export default function PrincessMusicControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);

  // Serene romantic fairytale waltz/music-box progression in F Major / D Minor
  // (F4, A4, C5, E5, D5, C5, Bb4, A4, G4, A4, Bb4, C5)
  const melodyHz = [
    349.23, 440.0, 523.25, 659.25,
    587.33, 523.25, 466.16, 440.0,
    392.0, 440.0, 466.16, 523.25,
    698.46, 659.25, 587.33, 523.25,
  ];
  const bassHz = [174.61, 146.83, 116.54, 130.81];

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

    // Gentle celesta / music-box tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0005, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 2.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 2.2);

    // Subtle warm harmonic octave shimmer
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = 'triangle';
    shimmer.frequency.setValueAtTime(freq * 2, now);
    shimmerGain.gain.setValueAtTime(0.0002, now);
    shimmerGain.gain.linearRampToValueAtTime(0.006, now + 0.06);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0002, now + 1.2);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.start(now);
    shimmer.stop(now + 1.3);

    // Warm cello/pad root every 4 beats
    if (step % 4 === 0) {
      const bassFreq = bassHz[Math.floor(step / 4) % bassHz.length];
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(bassFreq, now);
      bassGain.gain.setValueAtTime(0.0005, now);
      bassGain.gain.linearRampToValueAtTime(0.025, now + 0.6);
      bassGain.gain.exponentialRampToValueAtTime(0.0004, now + 3.6);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 3.7);
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
      timerRef.current = window.setInterval(playNote, 950);
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
      aria-label={isPlaying ? 'Pause background melody' : 'Play background melody'}
      className={`inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9B56D] ${
        isPlaying
          ? 'bg-[#D9B56D] text-[#350A1B] border-[#F4DFB0] shadow-[0_0_20px_rgba(217,181,109,0.35)]'
          : 'bg-[#4A1028]/80 hover:bg-[#5E1634] text-[#FFF8EF] border-[#D9B56D]/40'
      }`}
    >
      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
      <span>{isPlaying ? 'Pause Melody' : 'Play Melody'}</span>
      <Volume2 size={13} className="opacity-75 hidden sm:inline" />
    </button>
  );
}
