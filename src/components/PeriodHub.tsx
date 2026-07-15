import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Sparkles, Smile, MessageSquare, Coffee, Music, CloudRain, 
  CloudSnow, Sun, Moon, Volume2, VolumeX, Mail, Gift, Flame, Compass,
  ChevronRight, RefreshCw, Feather, Droplet, Cloud, Award, HeartHandshake, Eye
} from 'lucide-react';
import { supabaseService, isRealSupabase } from '../lib/supabase';

// Lazy load all sections to improve initial page load performance
import { VirtualLoveExperience } from './PeriodHubSections';
import { TeddyCollection } from './PeriodHubSections';
import { ChocolateCollection } from './PeriodHubSections';
import { FlowerGarden } from './PeriodHubSections';
import { LoveLetterLibrary } from './PeriodHubSections';
import { MiniComfortGames } from './PeriodHubSections';
import { MoodBooster } from './PeriodHubSections';
import { RelaxationPlayer } from './PeriodHubSections';
import { DailyComfortChecklist } from './PeriodHubSections';
import { MessageForRuu } from './PeriodHubSections';
import { SurpriseGiftBox } from './PeriodHubSections';
import { FinalSection } from './PeriodHubSections';

import { ComfortJourney } from './PremiumPeriodHubSections';
import { OpenWhenEnvelopes } from './PremiumPeriodHubSections';
import { BreathingCompanion } from './PremiumPeriodHubSections';
import { SleepMode } from './PremiumPeriodHubSections';
import { DailySurprise } from './PremiumPeriodHubSections';
import { PositiveAffirmations } from './PremiumPeriodHubSections';
import { MemoryWall } from './PremiumPeriodHubSections';
import { MoodMusic } from './PremiumPeriodHubSections';
import { CuteCompanion } from './PremiumPeriodHubSections';
import { CareStreak } from './PremiumPeriodHubSections';
import { RewardCollection } from './PremiumPeriodHubSections';

import { TodaysLove } from './PeriodHubExpandedSections';
import { LoveJar } from './PeriodHubExpandedSections';
import { SelfCareRoutine } from './PeriodHubExpandedSections';
import { MoodGarden } from './PeriodHubExpandedSections';
import { CareBox } from './PeriodHubExpandedSections';
import { WishWall } from './PeriodHubExpandedSections';
import { LoveNotes } from './PeriodHubExpandedSections';
import { RainyWindow } from './PeriodHubExpandedSections';
import { PremiumMusicPlayer } from './PeriodHubExpandedSections';
import { DailyGift } from './PeriodHubExpandedSections';
import { Achievements } from './PeriodHubExpandedSections';
import { TeddyReactions } from './PeriodHubExpandedSections';

import { DailyCareCompanion } from './PeriodHubExpandedSectionsPart5';
import { ComfortWheel } from './PeriodHubExpandedSectionsPart5';
import { KindnessWall } from './PeriodHubExpandedSectionsPart5';
import { ComfortMeditation } from './PeriodHubExpandedSectionsPart5';
import { VirtualGiftShelf } from './PeriodHubExpandedSectionsPart5';
import { LoveTimeline } from './PeriodHubExpandedSectionsPart5';
import { GratitudeGarden } from './PeriodHubExpandedSectionsPart5';
import { ThemeCustomizer } from './PeriodHubExpandedSectionsPart5';
import { FinalThankYou } from './PeriodHubExpandedSectionsPart5';

import { PeriodHubAdminDashboard } from './PeriodHubAdminDashboard';
import { CareReminders } from './CareReminders';

// --- COZY AUDIO SYNTHESIZER ENGINE (Web Audio API) ---
class CozyAudioEngine {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  
  // Continuous source nodes
  private rainSource: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;
  
  private oceanSource: AudioBufferSourceNode | null = null;
  private oceanGain: GainNode | null = null;
  private oceanFilter: BiquadFilterNode | null = null;
  
  private fireSource: AudioBufferSourceNode | null = null;
  private fireGain: GainNode | null = null;
  
  // Generative instruments
  private pianoTimer: any = null;
  private lofiTimer: any = null;
  
  // Volume controls (0 to 1)
  private vols = {
    rain: 0.15,
    ocean: 0.12,
    fire: 0.10,
    piano: 0.20,
    lofi: 0.15,
  };

  constructor() {
    // Lazy initialized on first user interaction
  }

  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
      this.noiseBuffer = this.createNoiseBuffer();
    }
  }

  private createNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  public resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- COZY SOUND TOGGLES ---

  public setRainActive(active: boolean) {
    this.resume();
    if (!this.ctx || !this.noiseBuffer) return;

    if (active) {
      if (this.rainSource) return;
      this.rainSource = this.ctx.createBufferSource();
      this.rainSource.buffer = this.noiseBuffer;
      this.rainSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      filter.Q.value = 0.8;

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(this.vols.rain, this.ctx.currentTime);

      this.rainSource.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.ctx.destination);
      this.rainSource.start();

      // Trigger crackling droplet droplets occasionally
      this.scheduleRainDroplets();
    } else {
      if (this.rainSource) {
        try { this.rainSource.stop(); } catch (e) {}
        this.rainSource.disconnect();
        this.rainSource = null;
      }
      if (this.rainGain) {
        this.rainGain.disconnect();
        this.rainGain = null;
      }
    }
  }

  private scheduleRainDroplets() {
    if (!this.rainSource || !this.ctx) return;
    // Play a tiny water drop pop sound every now and then
    const delay = Math.random() * 800 + 200;
    setTimeout(() => {
      if (this.rainSource) {
        this.playDropletSound();
        this.scheduleRainDroplets();
      }
    }, delay);
  }

  private playDropletSound() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const baseFreq = Math.random() * 800 + 400;
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  public setOceanActive(active: boolean) {
    this.resume();
    if (!this.ctx || !this.noiseBuffer) return;

    if (active) {
      if (this.oceanSource) return;
      this.oceanSource = this.ctx.createBufferSource();
      this.oceanSource.buffer = this.noiseBuffer;
      this.oceanSource.loop = true;

      this.oceanFilter = this.ctx.createBiquadFilter();
      this.oceanFilter.type = 'lowpass';
      this.oceanFilter.frequency.setValueAtTime(350, this.ctx.currentTime);

      this.oceanGain = this.ctx.createGain();
      this.oceanGain.gain.setValueAtTime(this.vols.ocean, this.ctx.currentTime);

      this.oceanSource.connect(this.oceanFilter);
      this.oceanFilter.connect(this.oceanGain);
      this.oceanGain.connect(this.ctx.destination);
      this.oceanSource.start();

      // Automate the lowpass filter frequency to simulate swelling ocean waves
      this.animateOceanWaves();
    } else {
      if (this.oceanSource) {
        try { this.oceanSource.stop(); } catch (e) {}
        this.oceanSource.disconnect();
        this.oceanSource = null;
      }
      if (this.oceanGain) {
        this.oceanGain.disconnect();
        this.oceanGain = null;
      }
      this.oceanFilter = null;
    }
  }

  private animateOceanWaves() {
    if (!this.oceanSource || !this.ctx || !this.oceanFilter || !this.oceanGain) return;
    const now = this.ctx.currentTime;
    
    // Smoothly sweep the filter between 180Hz and 550Hz every 4.5 seconds to emulate tide
    this.oceanFilter.frequency.setValueAtTime(180, now);
    this.oceanFilter.frequency.exponentialRampToValueAtTime(520, now + 2.2);
    this.oceanFilter.frequency.exponentialRampToValueAtTime(180, now + 4.5);

    // Also modulate volume slightly for realism
    this.oceanGain.gain.setValueAtTime(this.vols.ocean * 0.4, now);
    this.oceanGain.gain.linearRampToValueAtTime(this.vols.ocean * 1.1, now + 2.2);
    this.oceanGain.gain.linearRampToValueAtTime(this.vols.ocean * 0.4, now + 4.5);

    setTimeout(() => {
      this.animateOceanWaves();
    }, 4500);
  }

  public setFireplaceActive(active: boolean) {
    this.resume();
    if (!this.ctx || !this.noiseBuffer) return;

    if (active) {
      if (this.fireSource) return;
      this.fireSource = this.ctx.createBufferSource();
      this.fireSource.buffer = this.noiseBuffer;
      this.fireSource.loop = true;

      const rumbleFilter = this.ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.value = 85;

      this.fireGain = this.ctx.createGain();
      this.fireGain.gain.setValueAtTime(this.vols.fire, this.ctx.currentTime);

      this.fireSource.connect(rumbleFilter);
      rumbleFilter.connect(this.fireGain);
      this.fireGain.connect(this.ctx.destination);
      this.fireSource.start();

      // Start crackle pops
      this.scheduleFireCrackles();
    } else {
      if (this.fireSource) {
        try { this.fireSource.stop(); } catch (e) {}
        this.fireSource.disconnect();
        this.fireSource = null;
      }
      if (this.fireGain) {
        this.fireGain.disconnect();
        this.fireGain = null;
      }
    }
  }

  private scheduleFireCrackles() {
    if (!this.fireSource || !this.ctx) return;
    const delay = Math.random() * 450 + 50;
    setTimeout(() => {
      if (this.fireSource) {
        this.playCrackleSound();
        this.scheduleFireCrackles();
      }
    }, delay);
  }

  private playCrackleSound() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const bandpass = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(Math.random() * 60 + 40, this.ctx.currentTime);

    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(Math.random() * 6000 + 2000, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(5, this.ctx.currentTime);

    const popVol = Math.random() * 0.007 + 0.001;
    gain.gain.setValueAtTime(popVol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + 0.015);

    osc.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  }

  public setPianoActive(active: boolean) {
    this.resume();
    if (!this.ctx) return;

    if (active) {
      if (this.pianoTimer) return;
      // F# major pentatonic scale (F#3, G#3, A#3, C#4, D#4, F#4, G#4, A#4)
      const freqs = [185.00, 207.65, 233.08, 277.18, 311.13, 369.99, 415.30, 466.16, 554.37, 622.25];
      
      const playRandomNote = () => {
        if (!this.ctx) return;
        const index = Math.floor(Math.random() * freqs.length);
        const freq = freqs[index];
        this.playPianoNote(freq, Math.random() * 2.2 + 1.2);
        
        // Random cozy timing interval for next note
        const nextDelay = Math.random() * 3000 + 1500;
        this.pianoTimer = setTimeout(playRandomNote, nextDelay);
      };

      playRandomNote();
    } else {
      if (this.pianoTimer) {
        clearTimeout(this.pianoTimer);
        this.pianoTimer = null;
      }
    }
  }

  private playPianoNote(freq: number, duration: number) {
    if (!this.ctx) return;
    
    // Combine two oscillators for a warm, physical piano/rhodes model sound
    const oscMain = this.ctx.createOscillator();
    const oscSub = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    oscMain.type = 'sine';
    oscMain.frequency.setValueAtTime(freq, this.ctx.currentTime);

    oscSub.type = 'triangle';
    oscSub.frequency.setValueAtTime(freq * 0.5, this.ctx.currentTime); // sub octave warmth

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + duration * 0.8);

    const now = this.ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    // Soft attack (mimicking piano hammer strike)
    gainNode.gain.linearRampToValueAtTime(this.vols.piano * 0.7, now + 0.12);
    // Gentle sustained decay
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscMain.connect(filter);
    oscSub.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    oscMain.start(now);
    oscSub.start(now);
    
    oscMain.stop(now + duration);
    oscSub.stop(now + duration);
  }

  public setLofiActive(active: boolean) {
    this.resume();
    if (!this.ctx) return;

    if (active) {
      if (this.lofiTimer) return;
      
      // Soothing, repeating sweet lofi chord sequence: 
      // G#maj7 -> C#maj7 -> A#m7 -> D#7sus
      const progressions = [
        [207.65, 261.63, 311.13, 392.00], // G#maj7 (G#3, C4, D#4, G4)
        [138.59, 261.63, 311.13, 349.23], // C#maj7 (C#3, C4, D#4, F4)
        [233.08, 277.18, 349.23, 415.30], // A#m7 (A#3, C#4, F4, G#4)
        [155.56, 277.18, 311.13, 466.16], // D#7sus (D#3, C#4, D#4, A#4)
      ];
      let step = 0;

      const playChordStep = () => {
        if (!this.ctx) return;
        const chord = progressions[step];
        chord.forEach((noteFreq) => {
          this.playLofiPadNote(noteFreq, 4.0);
        });

        // Add soft dusty lofi vinyl crackle or tiny kick rim-shot
        if (Math.random() > 0.4) {
          this.playLofiRimShot();
        }

        step = (step + 1) % progressions.length;
        this.lofiTimer = setTimeout(playChordStep, 4500);
      };

      playChordStep();
    } else {
      if (this.lofiTimer) {
        clearTimeout(this.lofiTimer);
        this.lofiTimer = null;
      }
    }
  }

  private playLofiPadNote(freq: number, duration: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Apply lowpass filtering to make the chord extremely "warm & lo-fi"
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.vols.lofi * 0.35, now + 1.2); // swell slowly
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + duration);
  }

  private playLofiRimShot() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // --- SOUND EFFECTS ---

  public playSparkleSound() {
    this.resume();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Play a delightful, shimmering chime arpeggio
    const freqs = [880, 1046.5, 1318.5, 1568, 1760];
    freqs.forEach((freq, idx) => {
      const timeOffset = idx * 0.055;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + timeOffset);

      gain.gain.setValueAtTime(0.022, now + timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + timeOffset + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + timeOffset);
      osc.stop(now + timeOffset + 0.4);
    });
  }

  public playPopSound() {
    this.resume();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(580, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  public playWarmSwellSound() {
    this.resume();
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(261.63, this.ctx.currentTime); // Middle C
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(329.63, this.ctx.currentTime); // E4

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(750, this.ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.09, this.ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 1.3);
    osc2.stop(this.ctx.currentTime + 1.3);
  }

  public stopAll() {
    this.setRainActive(false);
    this.setOceanActive(false);
    this.setFireplaceActive(false);
    this.setPianoActive(false);
    this.setLofiActive(false);
  }
}

// Global Audio Engine Instance (singleton for clean state handling)
const globalCozyAudio = new CozyAudioEngine();


// --- TYPE DECLARATIONS ---
interface LoveLetterItem {
  id: string;
  title: string;
  message: string;
  signature: string;
}

interface DeserveCard {
  id: string;
  emoji: string;
  title: string;
  quote: string;
  color: string;
}

// Fallback letter databases
const PRESET_LOVE_LETTERS: LoveLetterItem[] = [
  {
    id: 'cramps',
    title: 'For when the cramps hurt too much 🌸',
    message: 'Oh my beautiful girl, I wish I could hold you in my arms, rub your belly, and take all the pain away. Since I am miles away, close your eyes, take a deep breath, and wrap yourself super tight in this warm blanket. You are so strong, but right now, you don’t have to be. Just rest, lay back, and let me pamper you from afar. You are the prettiest, most precious treasure in my world. ❤️',
    signature: 'Yours forever, Ruu'
  },
  {
    id: 'mood',
    title: 'For when the mood swings feel overwhelming 🧸',
    message: 'Hey, look at me! It is absolutely okay to feel angry, sad, crying, or totally exhausted right now. Don’t hold back your tears, and don’t blame yourself for anything. Your hormones are doing crazy things, and I am here to stand by you through every single emotion. If you want to scream, scream. If you want silence, I will sit with you in silence. Your feelings are safe with me, baby. Always. 🫂',
    signature: 'Your safe space, Ruu'
  },
  {
    id: 'distance',
    title: 'A letter of pure hugs & love across miles ☕',
    message: 'My love, distance is just a test to see how far love can travel. My care and thoughts are wrapping around you right this second. Imagine me kissing your forehead, tucking you into bed, and whispering how proud I am of you. Drink your tea, eat your chocolate, and remember: you are the center of my universe, and I am sending you a million virtual kisses. 💋',
    signature: 'Your Favorite Boy, Ruu'
  }
];

const DESERVE_CARDS: DeserveCard[] = [
  { id: 'rest', emoji: '✨', title: 'Rest', quote: 'No work, no stress. Lie down, relax your shoulders, and breathe.', color: 'from-pink-100 to-rose-200 text-pink-700' },
  { id: 'water', emoji: '💧', title: 'Drink Water', quote: 'Stay hydrated, sweet girl. Hydration helps flush out toxins and eases cramps.', color: 'from-sky-100 to-blue-200 text-blue-700' },
  { id: 'drink', emoji: '☕', title: 'Warm Drink', quote: 'Warm liquids boost pelvic blood flow, easing uterine muscle cramps.', color: 'from-amber-100 to-orange-200 text-amber-800' },
  { id: 'sleep', emoji: '🛌', title: 'Sleep', quote: 'A cozy nap heals the body. Close those beautiful eyes and let yourself drift away.', color: 'from-indigo-100 to-violet-200 text-indigo-700' },
  { id: 'relax', emoji: '🌸', title: 'Relax', quote: 'Inhale peace, exhale tension. Let your mind wander to sweet, warm fields.', color: 'from-purple-100 to-lavender-200 text-purple-700' },
  { id: 'teddy', emoji: '🧸', title: 'Hug Teddy', quote: 'Teddies are great listeners and give the best soft, silent squeezes.', color: 'from-orange-100 to-amber-200 text-amber-900' },
  { id: 'chocolate', emoji: '🍫', title: 'Chocolate Time', quote: 'Dark chocolate triggers endorphins. Go ahead, you deserve that sweet treat!', color: 'from-pink-100 to-amber-200 text-pink-800' },
  { id: 'music', emoji: '🎵', title: 'Calm Music', quote: 'Let the soft frequencies calm your nervous system and soothe your soul.', color: 'from-teal-100 to-emerald-200 text-teal-800' },
  { id: 'smile', emoji: '🩷', title: 'Smile', quote: 'Your beautiful smile lights up my whole world. Smile for me, my angel!', color: 'from-rose-100 to-pink-300 text-rose-700' },
  { id: 'loved', emoji: '❤️', title: 'Remember You Are Loved', quote: 'Every cell in my body loves you. You are cherished, protected, and adored.', color: 'from-red-100 to-pink-200 text-red-700' },
];

const CHEER_UPS = [
  "You are stronger than any silly hormone cycle! 🌸",
  "If cramps were a person, I would fight them for you right now! 🥊❤️",
  "A chocolate a day keeps the frown away! Go take a big bite! 🍫",
  "Reminder: You are the most gorgeous girl in the universe, even in oversized pajamas! 👑",
  "Sending a giant wave of warmth and love directly to your heart! 🌊💖",
  "You are allowed to just lay in bed and do absolutely nothing today. I declare it a royal holiday! 🛌",
  "My love for you grows with every second, especially today! 🧸",
  "Did you know? Otters hold hands when they sleep so they don't drift away. Just like I am holding your hand! 🦦💞",
  "I'm sending a million virtual forehead kisses to soothe you. Mwah! 💋"
];

const THEME_BACKGROUNDS: Record<string, { day: string; night: string }> = {
  pink_dream: {
    day: 'bg-radial from-[#fff4f6] via-[#faf0ff] to-[#fffafc] text-zinc-700',
    night: 'bg-radial from-[#1e132c] via-[#10071c] to-[#0a0312] text-slate-100'
  },
  lavender_glow: {
    day: 'bg-radial from-[#f5f3ff] via-[#eef2ff] to-[#fafaff] text-zinc-700',
    night: 'bg-radial from-[#180f2d] via-[#0b0518] to-[#05010a] text-slate-100'
  },
  rose_gold: {
    day: 'bg-radial from-[#fff7ed] via-[#fff1f2] to-[#fafaf9] text-zinc-700',
    night: 'bg-radial from-[#251216] via-[#140608] to-[#0a0102] text-slate-100'
  },
  aurora_sky: {
    day: 'bg-radial from-[#ecfdf5] via-[#f0fdf4] to-[#f8fafc] text-zinc-700',
    night: 'bg-radial from-[#022c22] via-[#041e17] to-[#010907] text-slate-100'
  },
  soft_night: {
    day: 'bg-radial from-[#f1f5f9] via-[#e2e8f0] to-[#f8fafc] text-zinc-700',
    night: 'bg-radial from-[#0f172a] via-[#020617] to-[#000000] text-slate-100'
  },
  cream_white: {
    day: 'bg-radial from-[#fefbf6] via-[#fcf6eb] to-[#fffdfa] text-zinc-700',
    night: 'bg-radial from-[#1c1917] via-[#141210] to-[#0c0a09] text-slate-100'
  }
};

// Falling Sakura Petals & Heart Canvas Particle generator helper
interface SakuraParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotSpeed: number;
  isHeart: boolean;
}

const SakuraCanvas = React.memo(({ isLoading }: { isLoading: boolean }) => {
  const [sakuras, setSakuras] = useState<SakuraParticle[]>([]);

  useEffect(() => {
    if (isLoading) return;
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    const limit = isMobile ? 12 : 28;
    const interval = setInterval(() => {
      if (document.hidden) return;
      setSakuras((prev) => {
        const filtered = prev.filter((s) => s.y < 110);
        if (filtered.length < limit) {
          const isHeart = Math.random() > 0.5;
          return [
            ...filtered,
            {
              id: Date.now() + Math.random(),
              x: Math.random() * 100,
              y: -5,
              size: Math.random() * 10 + 6,
              speedX: Math.random() * 1.2 - 0.6,
              speedY: Math.random() * 0.7 + 0.3,
              rotation: Math.random() * 360,
              rotSpeed: Math.random() * 1.6 - 0.8,
              isHeart
            }
          ];
        }
        return filtered;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;
    let lastTime = performance.now();
    let animId: number;
    const fpsLimit = 60;
    const interval = 1000 / fpsLimit;

    function tick(now: number) {
      animId = requestAnimationFrame(tick);
      if (document.hidden) return;
      
      const elapsed = now - lastTime;
      if (elapsed >= interval) {
        lastTime = now - (elapsed % interval);
        setSakuras((prev) => {
          if (prev.length === 0) return prev;
          return prev.map((s) => ({
            ...s,
            x: s.x + s.speedX * 0.12,
            y: s.y + s.speedY * 0.8,
            rotation: s.rotation + s.rotSpeed
          }));
        });
      }
    }
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isLoading]);

  return (
    <>
      {sakuras.map((petal) => (
        <div
          key={petal.id}
          className="absolute top-0 left-0 select-none pointer-events-none text-md"
          style={{
            transform: `translate3d(${petal.x}vw, ${petal.y}vh, 0) rotate(${petal.rotation}deg)`,
            fontSize: `${petal.size}px`,
            opacity: 0.65,
            color: petal.isHeart ? '#fda4af' : '#fbcfe8'
          }}
        >
          {petal.isHeart ? '❤️' : '🌸'}
        </div>
      ))}
    </>
  );
});

export default function PeriodHub({ onTriggerConfetti }: { onTriggerConfetti?: () => void }) {
  // --- STATES ---
  const [isLoading, setIsLoading] = useState(false);
  const [loadTextIdx, setLoadTextIdx] = useState(0);
  const [theme, setTheme] = useState<string>(() => {
    try {
      return localStorage.getItem('ruu_hub_theme') || 'pink_dream';
    } catch (e) {
      return 'pink_dream';
    }
  });

  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('ruu_hub_theme', newTheme);
    } catch (e) {}
  };
  
  // Custom states for counters (persist in localstorage for extra luxury!)
  const [counters, setCounters] = useState(() => {
    try {
      const saved = localStorage.getItem('love_hub_counters');
      return saved ? JSON.parse(saved) : { love: 12, hugs: 8, teddies: 4, flowers: 15, chocolates: 6, letters: 3 };
    } catch (e) {
      return { love: 12, hugs: 8, teddies: 4, flowers: 15, chocolates: 6, letters: 3 };
    }
  });

  // Toggles
  const [rainActive, setRainActive] = useState(false);
  const [snowActive, setSnowActive] = useState(false);
  const [nightMode, setNightMode] = useState(true);
  const [lofiActive, setLofiActive] = useState(false);
  const [natureActive, setNatureActive] = useState(false);
  const [pianoActive, setPianoActive] = useState(false);
  const [oceanActive, setOceanActive] = useState(false);
  const [fireplaceActive, setFireplaceActive] = useState(false);

  // Interaction Feedback states
  const [activeOverlayMessage, setActiveOverlayMessage] = useState<string | null>(null);
  const [activeOverlayType, setActiveOverlayType] = useState<'hug' | 'teddy' | 'chocolate' | 'flower' | 'letter' | 'cheer' | 'hchoco' | 'tea' | 'love' | null>(null);
  const [letterOpen, setLetterOpen] = useState<LoveLetterItem | null>(null);
  const [cheerMsg, setCheerMsg] = useState('');

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Selected deserve card for beautiful popup details
  const [selectedCard, setSelectedCard] = useState<DeserveCard | null>(null);

  // Comfort Level dynamically computed
  const [comfortScore, setComfortScore] = useState(78); // Out of 100

  // --- SUPABASE AUTH & BACKEND INTEGRATION STATES ---
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminClicksCount, setAdminClicksCount] = useState(0);
  const [isEmailLoginModalOpen, setIsEmailLoginModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  // Handle hidden admin launch trigger (clicking title/brand header 5 times)
  const handleAdminClick = () => {
    const nextCount = adminClicksCount + 1;
    setAdminClicksCount(nextCount);
    if (nextCount >= 5) {
      setShowAdminDashboard(true);
      setAdminClicksCount(0);
    }
  };

  useEffect(() => {
    // Listen to real-time auth changes
    const unsubscribe = supabaseService.auth.onAuthStateChange((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch data on login
  useEffect(() => {
    if (!currentUser) return;
    const fetchDbData = async () => {
      try {
        const dbCounters = await supabaseService.counters.get(currentUser.id);
        if (dbCounters) {
          setCounters(dbCounters);
        }
        const savedScore = localStorage.getItem(`ruu_comfort_score_${currentUser.id}`);
        if (savedScore) {
          setComfortScore(parseInt(savedScore, 10));
        }
      } catch (err) {
        console.warn("Error fetching data from database:", err);
      }
    };
    fetchDbData();
  }, [currentUser]);

  // Sync to database
  useEffect(() => {
    if (!currentUser) return;
    supabaseService.counters.save(currentUser.id, counters).catch(err => {
      console.warn("Could not sync counters with database:", err);
    });
  }, [counters, currentUser]);

  const handleGuestLogin = async () => {
    try {
      const user = await supabaseService.auth.loginGuest();
      setCurrentUser(user);
      setAuthMessage('Logged in as Guest! ✨');
      setTimeout(() => setAuthMessage(''), 3000);
    } catch (err: any) {
      setAuthMessage(err.message || 'Login failed');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    try {
      const user = await supabaseService.auth.loginEmail(emailInput.trim(), nameInput.trim() || undefined);
      setCurrentUser(user);
      setIsEmailLoginModalOpen(false);
      setAuthMessage('Successfully signed in! 🧸');
      setEmailInput('');
      setNameInput('');
      setTimeout(() => setAuthMessage(''), 3000);
    } catch (err: any) {
      setAuthMessage(err.message || 'Login failed');
    }
  };

  const handleLogout = async () => {
    try {
      await supabaseService.auth.logout();
      setCurrentUser(null);
      setAuthMessage('Logged out safely.');
      setTimeout(() => setAuthMessage(''), 3000);
    } catch (err: any) {
      setAuthMessage('Logout failed');
    }
  };

  // Loader Text cycle
  const loaderTexts = [
    "Preparing your warm hugs...",
    "Collecting sweet chocolates...",
    "Picking fresh pink flowers...",
    "Wrapping your teddy bear...",
    "Sending love across miles...",
    "Creating a beautiful warm space...",
    "Almost ready to comfort you..."
  ];

  // Load effects
  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadTextIdx((prev) => (prev + 1) % loaderTexts.length);
    }, 1800);

    const finishLoading = setTimeout(() => {
      setIsLoading(false);
      globalCozyAudio.resume();
    }, 4000);

    return () => {
      clearInterval(textInterval);
      clearTimeout(finishLoading);
    };
  }, []);

  // Sync counters and comfort score to local storage
  useEffect(() => {
    try {
      const key = currentUser ? `love_hub_counters_${currentUser.id}` : 'love_hub_counters';
      localStorage.setItem(key, JSON.stringify(counters));
    } catch (e) {}
  }, [counters, currentUser]);

  useEffect(() => {
    try {
      const key = currentUser ? `ruu_comfort_score_${currentUser.id}` : 'ruu_comfort_score';
      localStorage.setItem(key, comfortScore.toString());
    } catch (e) {}
  }, [comfortScore, currentUser]);


  // Comfort Meter automatic level updates
  useEffect(() => {
    const baseline = 75;
    // Comfort is boosted by audio activities and click counters
    const activeAudiosCount = 
      (rainActive ? 4 : 0) + 
      (snowActive ? 3 : 0) + 
      (lofiActive ? 5 : 0) + 
      (natureActive ? 4 : 0) + 
      (pianoActive ? 6 : 0) + 
      (oceanActive ? 5 : 0) + 
      (fireplaceActive ? 5 : 0);
    
    const clickBooster = Math.min(18, (counters.love + counters.hugs + counters.teddies + counters.chocolates + counters.flowers) * 0.2);
    const targetScore = Math.min(100, baseline + activeAudiosCount + Math.floor(clickBooster));
    
    // Smoothly animate comfort score towards target
    if (comfortScore < targetScore) {
      const t = setTimeout(() => setComfortScore(prev => Math.min(targetScore, prev + 1)), 50);
      return () => clearTimeout(t);
    } else if (comfortScore > targetScore) {
      const t = setTimeout(() => setComfortScore(prev => Math.max(targetScore, prev - 1)), 50);
      return () => clearTimeout(t);
    }
  }, [rainActive, snowActive, lofiActive, natureActive, pianoActive, oceanActive, fireplaceActive, counters]);

  // Audio trigger synchronization when toggles change
  useEffect(() => {
    globalCozyAudio.setRainActive(rainActive);
  }, [rainActive]);

  useEffect(() => {
    globalCozyAudio.setOceanActive(oceanActive);
  }, [oceanActive]);

  useEffect(() => {
    globalCozyAudio.setFireplaceActive(fireplaceActive);
  }, [fireplaceActive]);

  useEffect(() => {
    globalCozyAudio.setPianoActive(pianoActive);
  }, [pianoActive]);

  useEffect(() => {
    globalCozyAudio.setLofiActive(lofiActive);
  }, [lofiActive]);

  // Clean up audio context when component unmounts
  useEffect(() => {
    return () => {
      globalCozyAudio.stopAll();
    };
  }, []);

  // Interactive buttons trigger actions
  const triggerAction = (type: 'love' | 'hug' | 'teddy' | 'chocolate' | 'flower' | 'letter' | 'cheer') => {
    globalCozyAudio.resume();

    if (type === 'love') {
      globalCozyAudio.playSparkleSound();
      setCounters(prev => ({ ...prev, love: prev.love + 1 }));
      if (onTriggerConfetti) onTriggerConfetti();
      setActiveOverlayType('love');
      setActiveOverlayMessage("My endless love is bursting around you like warm sunshine! You are the most adorable girl ever. 💖");
    }

    if (type === 'hug') {
      globalCozyAudio.playWarmSwellSound();
      setCounters(prev => ({ ...prev, hugs: prev.hugs + 1 }));
      if (onTriggerConfetti) onTriggerConfetti();
      setActiveOverlayType('hug');
      setActiveOverlayMessage("Hugging you super cozy and tight! Imagine me wrapping my arms around you, kissing your head, and letting you sink into my warm chest. You are safe. You are loved. 🫂❤️");
      if (navigator.vibrate) {
        try { navigator.vibrate([150, 80, 150]); } catch (e) {}
      }
    }

    if (type === 'teddy') {
      globalCozyAudio.playPopSound();
      setCounters(prev => ({ ...prev, teddies: prev.teddies + 1 }));
      setActiveOverlayType('teddy');
      setActiveOverlayMessage("Soft fluffy teddy bear is delivered safely onto your lap! He has strict rules to hold your hand, hug your waist, and protect you from cramps. 🧸✨");
    }

    if (type === 'chocolate') {
      globalCozyAudio.playPopSound();
      setCounters(prev => ({ ...prev, chocolates: prev.chocolates + 1 }));
      setActiveOverlayType('chocolate');
      setActiveOverlayMessage("Mmm, opening a premium rich bar of dark chocolate just for you! It melts so sweetly, releasing happy waves. Take a sweet bite! 🍫💋");
    }

    if (type === 'flower') {
      globalCozyAudio.playSparkleSound();
      setCounters(prev => ({ ...prev, flowers: prev.flowers + 1 }));
      if (onTriggerConfetti) onTriggerConfetti();
      setActiveOverlayType('flower');
      setActiveOverlayMessage("A sweet rain of fresh cherry blossoms and red roses explodes around you! Each petal carries a promise that I will always care for you. 🌹🌸");
    }

    if (type === 'letter') {
      globalCozyAudio.playWarmSwellSound();
      setCounters(prev => ({ ...prev, letters: prev.letters + 1 }));
      // Open random letter or open letter drawer
      const randomLetter = PRESET_LOVE_LETTERS[Math.floor(Math.random() * PRESET_LOVE_LETTERS.length)];
      setLetterOpen(randomLetter);
    }

    if (type === 'cheer') {
      globalCozyAudio.playSparkleSound();
      const randMsg = CHEER_UPS[Math.floor(Math.random() * CHEER_UPS.length)];
      setCheerMsg(randMsg);
      setActiveOverlayType('cheer');
      setActiveOverlayMessage(randMsg);
    }
  };

  const selectDeserveCard = (card: DeserveCard) => {
    globalCozyAudio.resume();
    globalCozyAudio.playPopSound();
    setSelectedCard(card);
  };

  // --- LOADER RENDERING ---
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-radial from-[#fff4f6] via-[#faf0ff] to-[#fffbfc] select-none text-zinc-700">
        <div className="relative p-8 max-w-sm text-center space-y-6">
          {/* Animated 3D Teddy Container */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
            {/* Soft glowing aurora behind teddy */}
            <div className="absolute inset-0 bg-pink-300/30 rounded-full blur-3xl animate-pulse" />
            
            {/* SVG Teddy sitting */}
            <svg viewBox="0 0 100 100" className="w-40 h-40 relative z-10 drop-shadow-lg">
              {/* Ears */}
              <circle cx="28" cy="28" r="12" fill="#d97706" />
              <circle cx="28" cy="28" r="7" fill="#fbcfe8" />
              <circle cx="72" cy="28" r="12" fill="#d97706" />
              <circle cx="72" cy="28" r="7" fill="#fbcfe8" />
              {/* Head */}
              <circle cx="50" cy="42" r="23" fill="#b45309" />
              {/* Snout */}
              <ellipse cx="50" cy="48" rx="8" ry="6" fill="#fde047" />
              <polygon points="47,45 53,45 50,48" fill="#451a03" />
              {/* Eyes */}
              <circle cx="42" cy="38" r="2.5" fill="#1e1b4b" />
              <circle cx="58" cy="38" r="2.5" fill="#1e1b4b" />
              {/* Blush */}
              <ellipse cx="37" cy="44" rx="3" ry="2" fill="#f472b6" opacity="0.7" />
              <ellipse cx="63" cy="44" rx="3" ry="2" fill="#f472b6" opacity="0.7" />
              {/* Body */}
              <ellipse cx="50" cy="74" rx="25" ry="21" fill="#b45309" />
              <ellipse cx="50" cy="74" rx="17" ry="14" fill="#fbcfe8" />
              {/* Beating Heart in hand */}
              <path 
                d="M50,71 C48,67 40,67 40,73 C40,79 50,84 50,84 C50,84 60,79 60,73 C60,67 52,67 50,71 Z" 
                fill="#f43f5e" 
                className="heart-pulsing origin-center"
                style={{ transformOrigin: '50px 75px' }}
              />
              {/* Paws */}
              <circle cx="23" cy="75" r="7.5" fill="#d97706" />
              <circle cx="77" cy="75" r="7.5" fill="#d97706" />
              <circle cx="34" cy="88" r="8" fill="#d97706" />
              <circle cx="66" cy="88" r="8" fill="#d97706" />
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-pink-600/90 tracking-wide">
              Entering Period Hub 🌸
            </h3>
            
            {/* Animated Loading Text with slide-up transitions */}
            <div className="h-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadTextIdx}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-sm font-sans font-semibold text-pink-400"
                >
                  {loaderTexts[loadTextIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-pink-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.8, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-pink-400 to-purple-400"
            />
          </div>

          <button 
            onClick={() => {
              setIsLoading(false);
              globalCozyAudio.resume();
            }}
            className="text-[10px] uppercase tracking-wider text-pink-500/60 font-bold hover:text-pink-500 cursor-pointer"
          >
            Skip to Cozy Hub ➔
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN APP COMPONENT ---
  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen transition-colors duration-1000 overflow-hidden select-none pb-24 ${
        (THEME_BACKGROUNDS[theme] || THEME_BACKGROUNDS.pink_dream)[nightMode ? 'night' : 'day']
      }`}
    >
      {/* Background Aurora Glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full blur-[160px] pointer-events-none opacity-50 mix-blend-screen bg-pink-500/20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[140px] pointer-events-none opacity-40 mix-blend-screen bg-purple-500/15" />
      
      {/* Dynamic Rain/Snow/Sakura canvas simulator overlays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Sakura petals and hearts falling */}
        <SakuraCanvas isLoading={isLoading} />

        {/* Rain Simulator overlay drops */}
        {rainActive && (
          <div className="absolute inset-0 opacity-25">
            {Array.from({ length: 40 }).map((_, i) => (
              <div 
                key={i}
                className="absolute bg-sky-300 w-[1.5px] h-6 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `equalizer-wave 0.8s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Snow Simulator overlay particles */}
        {snowActive && (
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 5 + 3}px`,
                  height: `${Math.random() * 5 + 3}px`,
                  transform: `translateY(${Math.random() * 10}px)`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- FLOATING CONTROLLER RAIL / SYSTEM TOOLBAR --- */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 pt-6 flex flex-wrap items-center justify-between gap-4">
        <div 
          onClick={handleAdminClick}
          className="flex items-center gap-3 cursor-pointer select-none active:scale-95 transition-transform"
          title="Period Hub Cozy Room (Click 5 times for Admin)"
        >
          <div className="p-3 bg-pink-500/10 backdrop-blur-md rounded-2xl border border-pink-500/20 shadow-sm text-pink-500">
            <span className="text-2xl">🌸</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-black bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 bg-clip-text text-transparent">
              Period Hub
            </h1>
            <p className="text-[10px] font-mono tracking-widest uppercase opacity-80 font-bold">
              Comfort & Cozy Room
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Toggles bar */}
          <div className="flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 shadow-sm">
            {/* Day/Night */}
            <button 
              onClick={() => {
                setNightMode(!nightMode);
                globalCozyAudio.playPopSound();
              }}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                nightMode ? 'bg-purple-950/40 text-purple-300' : 'bg-amber-100 text-amber-700'
              }`}
              title="Toggle Day/Night visual mode"
            >
              {nightMode ? <Moon size={14} /> : <Sun size={14} />}
              <span>{nightMode ? "Cozy Night" : "Sweet Day"}</span>
            </button>

            {/* Rain toggle */}
            <button 
              onClick={() => {
                setRainActive(!rainActive);
                globalCozyAudio.playPopSound();
              }}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                rainActive ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-gray-400 hover:text-pink-400'
              }`}
            >
              <CloudRain size={14} />
              <span>Rain {rainActive ? "ON 🌧️" : "OFF"}</span>
            </button>

            {/* Snow toggle */}
            <button 
              onClick={() => {
                setSnowActive(!snowActive);
                globalCozyAudio.playPopSound();
              }}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                snowActive ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-gray-400 hover:text-pink-400'
              }`}
            >
              <CloudSnow size={14} />
              <span>Snow {snowActive ? "ON ❄️" : "OFF"}</span>
            </button>
          </div>

          {/* Supabase Authentication Widget */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 shadow-sm">
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2">
                <span className="text-sm select-none" title="User Avatar">{currentUser.avatar || '💖'}</span>
                <div className="text-left select-none max-w-[120px]">
                  <p className="text-[10px] font-extrabold text-pink-300 leading-none truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[8px] font-mono text-zinc-400 leading-none uppercase mt-0.5">
                    {currentUser.isAnonymous ? 'Guest 🌸' : 'Member ✨'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-1 px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/35 text-red-300 hover:text-white transition-all text-[8px] font-black uppercase tracking-wider cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleGuestLogin}
                  className="px-2 py-1 rounded-lg bg-pink-500/15 hover:bg-pink-500/30 text-pink-300 text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border border-pink-500/20"
                >
                  Guest 🌸
                </button>
                <button
                  onClick={() => {
                    setIsEmailLoginModalOpen(true);
                    globalCozyAudio.playPopSound();
                  }}
                  className="px-2 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border border-purple-500/20"
                >
                  Sign In 🔒
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ambient Audio Sounds Panel */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 mt-4">
        <div className="glass-card rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-500 uppercase tracking-widest bg-pink-500/10 px-2 py-0.5 rounded-full">
              <Volume2 size={10} /> Live Cozy Synth Mixer
            </span>
            <p className="text-xs text-gray-500 max-w-md">
              Toggle sweet, synthesized organic sound layers to wrap your room in peace and warmth. (Web Audio synthesized live!)
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { id: 'piano', label: '🎹 Relaxing Piano', active: pianoActive, set: setPianoActive },
              { id: 'lofi', label: '🎵 Lofi Beats', active: lofiActive, set: setLofiActive },
              { id: 'ocean', label: '🌊 Wave Swells', active: oceanActive, set: setOceanActive },
              { id: 'fireplace', label: '🔥 Warm Fireplace', active: fireplaceActive, set: setFireplaceActive }
            ].map((snd) => (
              <button
                key={snd.id}
                onClick={() => {
                  snd.set(!snd.active);
                  globalCozyAudio.playPopSound();
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                  snd.active 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-450 text-white shadow-md scale-105' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-500 hover:text-pink-400 border border-white/5'
                }`}
              >
                <span>{snd.label}</span>
                {snd.active && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- HERO PANEL --- */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Illustration + cozy room visual scene */}
        <div className="lg:col-span-5 relative w-full h-80 md:h-[400px] glass-card rounded-3xl overflow-hidden border border-white/20 p-6 flex flex-col justify-between shadow-lg">
          {/* Back Glowing lights representing warm soft bedroom lamps */}
          <div className="absolute top-[25%] right-[20%] w-24 h-24 bg-yellow-400/30 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-[20%] left-[25%] w-32 h-32 bg-pink-400/25 rounded-full blur-2xl animate-pulse" />
          
          {/* Header area showing location */}
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] uppercase tracking-widest font-bold text-pink-500">
              Cozy Bedside View ☕🌸
            </span>
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
            </div>
          </div>

          {/* Custom SVG Drawing: Girl with blanket, teddy, warm cup */}
          <div className="flex-1 flex items-center justify-center relative my-4">
            <svg viewBox="0 0 120 100" className="w-full max-w-[280px] h-full">
              {/* Window background with stars or rain drops */}
              <rect x="5" y="10" width="30" height="40" rx="3" fill="#0f091a" opacity="0.4" />
              <line x1="20" y1="10" x2="20" y2="50" stroke="#fbcfe8" strokeWidth="0.5" opacity="0.3" />
              <line x1="5" y1="30" x2="35" y2="30" stroke="#fbcfe8" strokeWidth="0.5" opacity="0.3" />
              
              {/* Stars inside window */}
              <circle cx="12" cy="18" r="0.6" fill="#fde047" className="animate-ping" />
              <circle cx="28" cy="22" r="0.8" fill="#fde047" />
              <circle cx="18" cy="42" r="0.5" fill="#fde047" />

              {/* Raindrops running outside window (if rain active) */}
              {rainActive && (
                <>
                  <line x1="10" y1="15" x2="10" y2="25" stroke="#38bdf8" strokeWidth="0.4" opacity="0.6" />
                  <line x1="25" y1="20" x2="25" y2="30" stroke="#38bdf8" strokeWidth="0.4" opacity="0.6" />
                  <line x1="16" y1="32" x2="16" y2="42" stroke="#38bdf8" strokeWidth="0.4" opacity="0.6" />
                </>
              )}

              {/* Comfortable Bed Frame/Couch */}
              <rect x="35" y="65" width="80" height="20" rx="4" fill="#a78bfa" opacity="0.35" />
              <rect x="40" y="60" width="75" height="8" rx="2" fill="#fff0f5" opacity="0.9" />

              {/* Soft Cushions/Pillows */}
              <rect x="92" y="44" width="18" height="18" rx="3" transform="rotate(-15 92 44)" fill="#fbcfe8" opacity="0.8" />
              <rect x="80" y="48" width="18" height="18" rx="3" fill="#f3e8ff" opacity="0.8" />

              {/* Cute Teddy Sitting beside Pillow */}
              <g transform="translate(82, 45) scale(0.35)">
                <circle cx="20" cy="20" r="10" fill="#92400e" />
                {/* Ears */}
                <circle cx="8" cy="10" r="4" fill="#92400e" />
                <circle cx="32" cy="10" r="4" fill="#92400e" />
                {/* Snout */}
                <ellipse cx="20" cy="23" rx="4" ry="3" fill="#fef08a" />
                <polygon points="18,22 22,22 20,24" fill="#451a03" />
                {/* Eyes */}
                <circle cx="16" cy="17" r="1.5" fill="#000" />
                <circle cx="24" cy="17" r="1.5" fill="#000" />
                {/* Body */}
                <ellipse cx="20" cy="38" rx="14" ry="12" fill="#78350f" />
                <ellipse cx="20" cy="38" rx="9" ry="8" fill="#fbcfe8" />
              </g>

              {/* The Girl Wrapped in a Premium Cozy Blanket */}
              {/* Cozy curly blanket layers */}
              <path d="M42,55 C42,42 68,40 70,55 C70,55 78,55 78,65 C78,75 42,75 42,55 Z" fill="#fda4af" opacity="0.85" />
              {/* Nested folded warm blanket stripes */}
              <path d="M44,58 C48,50 64,50 68,58" stroke="#f472b6" strokeWidth="2" fill="none" opacity="0.8" />
              <path d="M46,64 C50,56 62,56 66,64" stroke="#db2777" strokeWidth="1.5" fill="none" opacity="0.5" />
              
              {/* Small girl face popping out of blanket cozily sleeping */}
              <circle cx="60" cy="46" r="8" fill="#fed7aa" />
              {/* Cute sleeping eyes */}
              <path d="M57,47 Q59,49 61,47" stroke="#1e1b4b" strokeWidth="0.8" fill="none" />
              <path d="M63,46 Q64,48 65,46" stroke="#1e1b4b" strokeWidth="0.8" fill="none" />
              {/* Sweet smile */}
              <path d="M59,51 Q60,52 61,51" stroke="#e11d48" strokeWidth="0.6" fill="none" />
              {/* Cozy hair */}
              <path d="M52,44 C52,38 68,38 68,44 L68,48 L52,48 Z" fill="#7c2d12" />

              {/* Warm cup of Coffee/Chocolate on Bedside table */}
              <rect x="15" y="75" width="16" height="14" rx="1" fill="#f59e0b" opacity="0.2" />
              <rect x="15" y="73" width="16" height="3" rx="0.5" fill="#d97706" />
              {/* Cup */}
              <path d="M19,65 L27,65 L26,73 L20,73 Z" fill="#e2e8f0" />
              <path d="M27,67 C29,67 29,71 27,71" stroke="#e2e8f0" strokeWidth="1" fill="none" />
              {/* Steam waves rising */}
              <path d="M21,61 Q22,58 21,55" stroke="#f3e8ff" strokeWidth="0.8" fill="none" className="heart-pulsing" />
              <path d="M24,62 Q25,59 24,56" stroke="#f3e8ff" strokeWidth="0.8" fill="none" className="heart-pulsing" style={{ animationDelay: '0.4s' }} />

              {/* Floating micro-hearts around her */}
              <path d="M72,32 C71.5,30 68,30 68,33 C68,36 72,39 72,39 C72,39 76,36 76,33 C76,30 72.5,30 72,32 Z" fill="#f43f5e" className="heart-pulsing" style={{ transformOrigin: '72px 35px' }} />
              <path d="M48,38 C47.5,36 44,36 44,39 C44,42 48,45 48,45 C48,45 52,42 52,39 C52,36 48.5,36 48,38 Z" fill="#ec4899" className="heart-pulsing" style={{ transformOrigin: '48px 41px', animationDelay: '0.5s' }} />
            </svg>
          </div>

          {/* Warm indicator bar */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 flex items-center justify-between text-[11px] font-bold">
            <span className="flex items-center gap-1 text-pink-500">
              <Flame size={12} className="animate-bounce" /> Room Temp: 24.5°C
            </span>
            <span className="text-gray-400">
              Cozy Cozy status: Extreme Cozy ✨
            </span>
          </div>
        </div>

        {/* Hero text headers + dynamic button matrix */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-pink-500/10 border border-pink-500/30 rounded-full text-pink-500 font-extrabold text-[10px] uppercase tracking-widest">
              ✨ Sent by Ruu with care
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-gray-800 dark:text-white leading-tight">
              You deserve extra <br />
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                love today ❤️
              </span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-600 dark:text-zinc-300 max-w-xl">
              Even if I'm miles away, my love, care and hugs will always find you. Tap any gift below to feel the warmth, and listen to the soothing live-synthesized room music.
            </p>
          </div>

          {/* Interactive Button Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: 'love', label: '❤️ Send Love', color: 'hover:bg-red-500/20 hover:border-red-500/40 text-red-500 dark:text-red-400 bg-white/5 border-white/10 dark:bg-black/20' },
              { id: 'hug', label: '🫂 Virtual Hug', color: 'hover:bg-pink-500/20 hover:border-pink-500/40 text-pink-500 dark:text-pink-400 bg-white/5 border-white/10 dark:bg-black/20' },
              { id: 'teddy', label: '🧸 Teddy Delivery', color: 'hover:bg-amber-500/20 hover:border-amber-500/40 text-amber-600 dark:text-amber-400 bg-white/5 border-white/10 dark:bg-black/20' },
              { id: 'chocolate', label: '🍫 Chocolate', color: 'hover:bg-pink-600/20 hover:border-pink-600/40 text-pink-700 dark:text-pink-300 bg-white/5 border-white/10 dark:bg-black/20' },
              { id: 'flower', label: '🌹 Flowers', color: 'hover:bg-rose-500/20 hover:border-rose-500/40 text-rose-500 dark:text-rose-400 bg-white/5 border-white/10 dark:bg-black/20' },
              { id: 'hchoco', label: '☕ Hot Chocolate', color: 'hover:bg-orange-500/20 hover:border-orange-500/40 text-orange-600 dark:text-orange-400 bg-white/5 border-white/10 dark:bg-black/20' },
              { id: 'tea', label: '🍵 Warm Tea', color: 'hover:bg-teal-500/20 hover:border-teal-500/40 text-teal-600 dark:text-teal-400 bg-white/5 border-white/10 dark:bg-black/20' },
              { id: 'letter', label: '💌 Love Letter', color: 'hover:bg-indigo-500/20 hover:border-indigo-500/40 text-indigo-500 dark:text-indigo-400 bg-white/5 border-white/10 dark:bg-black/20' },
              { id: 'cheer', label: '✨ Cheer Up', color: 'hover:bg-amber-400/20 hover:border-amber-400/40 text-amber-500 dark:text-amber-400 bg-white/5 border-white/10 dark:bg-black/20' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  if (btn.id === 'hchoco') {
                    setCounters(prev => ({ ...prev, love: prev.love + 1 }));
                    setComfortScore(prev => Math.min(100, prev + 4));
                    globalCozyAudio.playWarmSwellSound();
                    setActiveOverlayType('hchoco');
                    setActiveOverlayMessage("Brewing hot chocolate topped with miniature marshmallows! Feel the rich warmth sink down to your toes. ☕✨");
                  } else if (btn.id === 'tea') {
                    setCounters(prev => ({ ...prev, hugs: prev.hugs + 1 }));
                    setComfortScore(prev => Math.min(100, prev + 3));
                    globalCozyAudio.playSparkleSound();
                    setActiveOverlayType('tea');
                    setActiveOverlayMessage("Steeping a delicate mug of honey chamomile tea. It reduces muscle spasms and soothes cramp aches instantly. 🍵🌸");
                  } else {
                    triggerAction(btn.id as any);
                  }
                }}
                className={`py-3 px-4 rounded-2xl text-xs font-bold font-sans glass-card border shadow-sm cursor-pointer transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] flex items-center justify-center gap-1.5 ${btn.color}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- STATS COUNT & COMFORT METER --- */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Love Counter Widget */}
        <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-md border border-white/20">
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-serif font-bold text-pink-500">
              Your Care Counter Box 💖
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              "You have received these sweet deliveries from your boy Ruu"
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { id: 'love', label: '❤️ Love', count: counters.love },
              { id: 'hugs', label: '🫂 Hugs', count: counters.hugs },
              { id: 'teddies', label: '🧸 Teddies', count: counters.teddies },
              { id: 'flowers', label: '🌹 Flowers', count: counters.flowers },
              { id: 'chocolates', label: '🍫 Chocolates', count: counters.chocolates },
              { id: 'letters', label: '💌 Letters', count: counters.letters }
            ].map((cnt) => (
              <div 
                key={cnt.id}
                className="bg-white/5 dark:bg-white/10 rounded-2xl p-4 text-center border border-white/5 hover:border-pink-300/30 transition-all flex flex-col items-center justify-center space-y-1"
              >
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{cnt.label}</span>
                <span className="text-2xl font-serif font-black text-pink-500 bg-clip-text">
                  {cnt.count}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-center italic text-gray-400">
            Each click of love increases your comfort levels and triggers happy sounds!
          </div>
        </div>

        {/* Comfort Circular Meter */}
        <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-center gap-8 shadow-md border border-white/20">
          
          {/* Progress Circle Visualizer */}
          <div className="relative w-44 h-44 flex items-center justify-center select-none">
            {/* SVG circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="88" 
                cy="88" 
                r="74" 
                stroke={nightMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"} 
                strokeWidth="12" 
                fill="transparent" 
              />
              <circle 
                cx="88" 
                cy="88" 
                r="74" 
                stroke="url(#comfortGradient)" 
                strokeWidth="12" 
                fill="transparent" 
                strokeDasharray={2 * Math.PI * 74}
                strokeDashoffset={2 * Math.PI * 74 * (1 - comfortScore / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="comfortGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase font-bold text-pink-500">Comfort</span>
              <span className="text-3xl font-serif font-black text-gray-800 dark:text-white">
                {comfortScore}%
              </span>
              <span className="text-[9px] text-gray-400">Warm & Protected</span>
            </div>
          </div>

          {/* Descriptive lists detailing other meter stats */}
          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-pink-500">Your Emotional Metrics</h4>
              <p className="text-[11px] text-gray-500">These soft indicators show how comforted, protected, and pampered you are right now.</p>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              {[
                { label: 'Comfort Level', value: comfortScore, color: 'bg-pink-500' },
                { label: 'Love Absorption', value: Math.min(100, 85 + (counters.love * 0.5)), color: 'bg-rose-500' },
                { label: 'Warmth Factor', value: Math.min(100, 72 + (rainActive ? 12 : 0) + (fireplaceActive ? 15 : 0)), color: 'bg-orange-500' },
                { label: 'Partner Support', value: 100, color: 'bg-purple-500' },
                { label: 'Happiness & Serotonin', value: Math.min(100, 80 + (counters.chocolates * 1.5) + (counters.flowers * 0.8)), color: 'bg-yellow-400' }
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span>{stat.label}</span>
                    <span className="text-pink-500 font-mono font-bold">{stat.value}%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.color}`} style={{ width: `${stat.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION: TODAY'S LOVE LOCKER --- */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 mt-16 space-y-6">
        <TodaysLove />
      </div>

      {/* --- SECTION: TODAY YOU DESERVE --- */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 mt-16 space-y-6">
        <div className="text-center space-y-1 select-none">
          <span className="text-2xl">🌸</span>
          <h3 className="text-2xl md:text-3xl font-serif font-black text-gray-800 dark:text-white">
            Today You Deserve...
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-md mx-auto">
            Take extra special care of yourself today, baby. Click any card below to read a soothing medicine note specifically written to pamper your cramps, pain, and spirit.
          </p>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {DESERVE_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => selectDeserveCard(card)}
              className="group relative rounded-2xl p-5 text-center bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-md border border-white/20 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-pink-300 flex flex-col items-center justify-between min-h-[155px]"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-pink-400 text-xs">
                ✨
              </div>

              <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {card.emoji}
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold font-sans text-gray-800 dark:text-white uppercase tracking-wider">
                  {card.title}
                </h4>
                <p className="text-[10px] text-gray-400 line-clamp-2">
                  {card.quote}
                </p>
              </div>

              <span className="text-[9px] uppercase tracking-wider text-pink-500/60 group-hover:text-pink-500 font-extrabold flex items-center gap-0.5 mt-2">
                Care Note <ChevronRight size={10} />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- EXTENDED PREMIUM EXPERIENCE SECTIONS --- */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 mt-16 space-y-20">
        
        {/* Dynamic Theme Customizer (Part 5) */}
        <div className="glass-card rounded-[40px] p-6 md:p-10 border border-white/10 shadow-2xl">
          <ThemeCustomizer currentTheme={theme} onChangeTheme={handleSetTheme} />
        </div>

        {/* Daily Care Companion (Part 5) */}
        <DailyCareCompanion />
        
        {/* Comfort Journey Timeline Section */}
        <div className="glass-card rounded-[40px] p-6 md:p-10 border border-white/10 shadow-2xl">
          
            <ComfortJourney />
          
        </div>

        {/* Love Jar & Self Care Routine Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col justify-between">
            
              <LoveJar />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col justify-between">
            
              <SelfCareRoutine />
            
          </div>
        </div>

        {/* 1. Virtual Love Experience */}
        <div className="glass-card rounded-[40px] p-6 md:p-10 border border-white/20 shadow-xl">
          
            <VirtualLoveExperience onTriggerConfetti={onTriggerConfetti} />
          
        </div>

        {/* Mood Garden & Care Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col justify-between">
            
              <MoodGarden />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col justify-between">
            
              <CareBox />
            
          </div>
        </div>

        {/* Open When Letters Section */}
        <div className="glass-card rounded-[40px] p-6 md:p-10 border border-white/10 shadow-2xl">
          
            <OpenWhenEnvelopes />
          
        </div>

        {/* 2. Teddy Collection & 3. Chocolate Collection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/20 shadow-xl flex flex-col justify-between">
            
              <TeddyCollection />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/20 shadow-xl flex flex-col justify-between">
            
              <ChocolateCollection onTriggerConfetti={onTriggerConfetti} />
            
          </div>
        </div>

        {/* Breathing Companion & Sleep Mode Ambient Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl">
            
              <BreathingCompanion />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl">
            
              <SleepMode />
            
          </div>
        </div>

        {/* Daily Surprise & Positive Affirmations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl">
            
              <DailySurprise />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl">
            
              <PositiveAffirmations />
            
          </div>
        </div>

        {/* Wish Wall & Love Notes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl">
            
              <WishWall />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl">
            
              <LoveNotes />
            
          </div>
        </div>

        {/* 4. Flower Garden & 5. Love Letter Library */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/20 shadow-xl flex flex-col justify-between">
            
              <FlowerGarden />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/20 shadow-xl flex flex-col justify-between">
            
              <LoveLetterLibrary />
            
          </div>
        </div>

        {/* Memory Wall & Mood Music Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl">
            
              <MemoryWall />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl">
            
              <MoodMusic />
            
          </div>
        </div>

        {/* Rainy Window & Premium Music Player Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl">
            
              <RainyWindow />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl">
            
              <PremiumMusicPlayer />
            
          </div>
        </div>

        {/* Cozy Care Reminders Section */}
        <div className="glass-card rounded-[40px] p-6 md:p-10 border border-white/10 shadow-2xl">
          
            <CareReminders />
          
        </div>

        {/* Teddy Bear Interactive Reactions full-width Section */}
        <div className="glass-card rounded-[40px] p-6 md:p-10 border border-white/10 shadow-2xl">
          
            <TeddyReactions />
          
        </div>

        {/* 6. Mini Comfort Games */}
        <div className="glass-card rounded-[40px] p-6 md:p-10 border border-white/20 shadow-xl">
          
            <MiniComfortGames onTriggerConfetti={onTriggerConfetti} />
          
        </div>

        {/* Cute Teddy Helper Companion & Care Streak Progress Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl">
            
              <CuteCompanion />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl">
            
              <CareStreak />
            
          </div>
        </div>

        {/* 7. Mood Booster & 8. Relaxation Player */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/20 shadow-xl flex flex-col justify-between">
            
              <MoodBooster />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/20 shadow-xl flex flex-col justify-between">
            
              <RelaxationPlayer />
            
          </div>
        </div>

        {/* Badge Reward Collection Section */}
        <div className="glass-card rounded-[40px] p-6 md:p-10 border border-white/10 shadow-2xl">
          
            <RewardCollection />
          
        </div>

        {/* 9. Daily Comfort Checklist & 11. Surprise Gift Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/20 shadow-xl flex flex-col justify-between">
            
              <DailyComfortChecklist onUpdateComfortScore={(amt) => setComfortScore(prev => Math.max(0, Math.min(100, prev + amt)))} />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/20 shadow-xl flex flex-col justify-between">
            
              <SurpriseGiftBox onTriggerConfetti={onTriggerConfetti} />
            
          </div>
        </div>

        {/* Daily Gift & Achievements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col justify-between">
            
              <DailyGift />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col justify-between">
            
              <Achievements />
            
          </div>
        </div>

        {/* Kindness Wall Scrolling Ribbon (Part 5) */}
        
          <KindnessWall />
        

        {/* Comfort Wheel & Gratitude Garden Dual Grid (Part 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col justify-between">
            
              <ComfortWheel />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col justify-between">
            
              <GratitudeGarden />
            
          </div>
        </div>

        {/* Comfort Meditation & Virtual Gift Shelf Dual Grid (Part 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col justify-between">
            
              <ComfortMeditation />
            
          </div>
          <div className="glass-card rounded-[40px] p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col justify-between">
            
              <VirtualGiftShelf />
            
          </div>
        </div>

        {/* Love Timeline Section (Part 5) */}
        <div className="glass-card rounded-[40px] p-6 md:p-10 border border-white/10 shadow-2xl">
          
            <LoveTimeline />
          
        </div>

        {/* Final Thank You (Part 5) */}
        
          <FinalThankYou />
        

        {/* 10. Message For Ruu */}
        <div className="glass-card rounded-[40px] p-6 md:p-10 border border-white/20 shadow-xl">
          
            <MessageForRuu onTriggerConfetti={onTriggerConfetti} />
          
        </div>

        {/* 12. Final Section with Premium Quote */}
        
          <FinalSection />
        

      </div>

      {/* --- FLOATING MODALS & OVERLAYS INTERACTION CONTAINER --- */}
      {typeof document !== 'undefined' && createPortal(
        <>
          <AnimatePresence>
            {/* Click Feedback overlays (e.g. Hug, Teddy bouncing messages) */}
        {activeOverlayType && activeOverlayMessage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#fffdfd] dark:bg-[#181223] max-w-md w-full rounded-3xl border border-pink-200/50 p-6 md:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              {/* Top particles decoration */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500" />
              
              {/* Decorative background icons */}
              <div className="absolute top-4 right-4 text-3xl opacity-10 select-none">🌸</div>
              <div className="absolute bottom-4 left-4 text-3xl opacity-10 select-none">💖</div>

              {/* Action specific visual illustrations */}
              <div className="w-20 h-20 mx-auto rounded-full bg-pink-500/10 flex items-center justify-center text-4xl">
                {activeOverlayType === 'hug' && '🫂'}
                {activeOverlayType === 'teddy' && '🧸'}
                {activeOverlayType === 'chocolate' && '🍫'}
                {activeOverlayType === 'flower' && '🌹'}
                {activeOverlayType === 'cheer' && '✨'}
                {activeOverlayType === 'hchoco' && '☕'}
                {activeOverlayType === 'tea' && '🍵'}
                {activeOverlayType === 'letter' && '💌'}
                {activeOverlayType === 'love' && '❤️'}
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-pink-600">
                  {activeOverlayType === 'hug' && "Virtual Hug Sent! 🫂"}
                  {activeOverlayType === 'teddy' && "Teddy Bear Delivered! 🧸"}
                  {activeOverlayType === 'chocolate' && "Chocolate Opened! 🍫"}
                  {activeOverlayType === 'flower' && "Flower Shower Burst! 🌹"}
                  {activeOverlayType === 'cheer' && "A Note to Smile! ✨"}
                  {activeOverlayType === 'hchoco' && "Hot Chocolate Ready! ☕"}
                  {activeOverlayType === 'tea' && "Warm Tea Steeping! 🍵"}
                  {activeOverlayType === 'letter' && "Love Letter Arrived! 💌"}
                  {activeOverlayType === 'love' && "Endless Love Sent! ❤️"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
                  {activeOverlayMessage}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveOverlayType(null);
                    setActiveOverlayMessage(null);
                    globalCozyAudio.playPopSound();
                  }}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-450 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {activeOverlayType === 'hug' ? 'Hug Received ❤️' : 'Thank You ❤️'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Selected Deserve Card detail Modal */}
        {selectedCard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white dark:bg-[#161021] max-w-md w-full rounded-3xl border border-pink-200/50 p-6 md:p-8 text-center space-y-5 shadow-2xl relative overflow-hidden"
            >
              {/* Color Stripe based on card selection */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400" />

              <div className="w-16 h-16 mx-auto rounded-full bg-pink-500/10 flex items-center justify-center text-4xl">
                {selectedCard.emoji}
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest bg-pink-500/10 px-2.5 py-0.5 rounded-full">
                  Caring Guideline
                </span>
                <h3 className="font-serif text-xl font-black text-gray-800 dark:text-white uppercase tracking-wider">
                  You Deserve {selectedCard.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed italic">
                  "{selectedCard.quote}"
                </p>
              </div>

              {/* Customized medical/partner comfort details */}
              <div className="bg-pink-50/50 dark:bg-white/5 rounded-2xl p-4 text-left space-y-1.5 border border-pink-200/10">
                <span className="text-[10px] font-bold text-pink-600 dark:text-pink-300 block uppercase tracking-wider">
                  🧸 Ruu's Soft Medicine Tip:
                </span>
                <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                  {selectedCard.id === 'rest' && "Cramp pains increase significantly with mental fatigue. Please put down your phone, lie flat on your side, and draw your knees up close to your chest to soothe muscles."}
                  {selectedCard.id === 'water' && "Hydrating reduces water retention, which causes heavy bloating and painful abdomen contractions. Let's aim to sip a warm glass of water right now!"}
                  {selectedCard.id === 'drink' && "Warm liquid increases blood flow to your abdominal area, easing down uterine contractions. chamomile, peppermint, or warm ginger teas are natural anti-spasmodics!"}
                  {selectedCard.id === 'sleep' && "Your body is expending a lot of energy repairing and resetting itself. A small 30-minute nap will elevate your dopamine levels and dull the pelvic sensory nerves."}
                  {selectedCard.id === 'relax' && "Stress raises cortisol, which physically worsens period pain. Turn on the Wave Swells or Rain layers below, take slow, deep breaths, and let tension slide away."}
                  {selectedCard.id === 'teddy' && "Tucking a soft pillow or stuffed teddy tightly against your lower belly provides subtle heat insulation and soothing pressure. Try it now!"}
                  {selectedCard.id === 'chocolate' && "Cocoa is rich in magnesium, which naturally calms muscle cramping. It also boosts serotonin to fight anxiety and fatigue. Indulge with zero guilt!"}
                  {selectedCard.id === 'music' && "Music releases natural endorphins and helps block out pain signals. Relax with our live generative piano playing sweet minor & major scales!"}
                  {selectedCard.id === 'smile' && "Even a tiny smile triggers chemical endorphins. You look so beautiful when you smile. I am smiling with you, my darling."}
                  {selectedCard.id === 'loved' && "You are my entire world. No matter the cramps, the tears, or the miles between us, I am wrapping you in security and safety forever. You are my princess."}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedCard(null);
                    globalCozyAudio.playPopSound();
                  }}
                  className="w-full py-2.5 bg-pink-100 hover:bg-pink-200 dark:bg-white/5 dark:hover:bg-white/10 text-pink-600 dark:text-pink-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Close & Pamper Me 🌸
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Love Letter modal */}
        {letterOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#fffbfc] dark:bg-[#1a1226] max-w-lg w-full rounded-3xl border-2 border-pink-200/40 p-6 md:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              {/* Handwritten Paper Styling */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400" />
              <div className="absolute top-2 right-2 text-2xl opacity-10 select-none">🌸</div>
              <div className="absolute bottom-2 left-6 text-2xl opacity-10 select-none font-serif">💌</div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded-full inline-block">
                  Handwritten Letter
                </span>
                <h3 className="font-serif text-xl font-bold text-gray-800 dark:text-white">
                  {letterOpen.title}
                </h3>
              </div>

              {/* Letter content in Caveat/handwritten style font */}
              <div className="p-5 md:p-6 bg-[#fffdfa] dark:bg-[#1f172e] rounded-2xl border border-amber-100/50 dark:border-purple-900/40 text-left relative shadow-inner">
                {/* Vintage paper lines */}
                <div className="absolute inset-0 bg-linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px) bg-[length:100%_24px] pointer-events-none opacity-50" />
                <p className="font-handwritten text-xl md:text-2xl text-amber-900 dark:text-pink-100 leading-relaxed relative z-10 whitespace-pre-wrap">
                  {letterOpen.message}
                </p>
                <p className="font-handwritten text-2xl text-right text-pink-600 dark:text-pink-400 mt-4 relative z-10 font-bold">
                  — {letterOpen.signature}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const idx = PRESET_LOVE_LETTERS.findIndex(l => l.id === letterOpen.id);
                    const nextIdx = (idx + 1) % PRESET_LOVE_LETTERS.length;
                    setLetterOpen(PRESET_LOVE_LETTERS[nextIdx]);
                    globalCozyAudio.playSparkleSound();
                  }}
                  className="flex-1 py-2.5 border border-pink-200/50 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/20 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <RefreshCw size={12} className="animate-spin-slow" />
                  <span>Next Sweet Letter 💌</span>
                </button>
                <button
                  onClick={() => {
                    setLetterOpen(null);
                    globalCozyAudio.playPopSound();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-450 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Keep in Heart ❤️
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SUPABASE FLOATING STATUS TOAST --- */}
      <AnimatePresence>
        {authMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] px-4 py-2 bg-pink-500/20 backdrop-blur-md border border-pink-500 text-pink-300 rounded-full text-xs font-semibold shadow-2xl tracking-wide flex items-center gap-1.5"
          >
            <span>✨</span>
            <span>{authMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- EMAIL SIGN-IN MODAL OVERLAY --- */}
      <AnimatePresence>
        {isEmailLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#100720]/90 border border-pink-500/30 rounded-[32px] p-6 shadow-2xl relative text-white"
            >
              <button
                onClick={() => setIsEmailLoginModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-pink-400 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>

              <div className="text-center space-y-2 mb-6">
                <span className="text-3xl">🔑</span>
                <h3 className="font-serif text-xl font-black bg-gradient-to-r from-pink-300 to-purple-400 bg-clip-text text-transparent">
                  Access Your Cozy Locker
                </h3>
                <p className="text-[10px] text-zinc-400">
                  Connect with Supabase to sync your wishes, feedback history, and comfort stats across devices.
                </p>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-black text-pink-400 block">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Lovely Princess (Optional)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-black text-pink-400 block">
                    Your Email Address:
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer shadow-lg"
                >
                  Enter Cozy Room ✨
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADMIN DASHBOARD OVERLAY --- */}
      <AnimatePresence>
        {showAdminDashboard && (
          <div className="fixed inset-0 z-[120] bg-slate-950/95 overflow-y-auto">
            <PeriodHubAdminDashboard onClose={() => setShowAdminDashboard(false)} />
          </div>
        )}
      </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  );
}
