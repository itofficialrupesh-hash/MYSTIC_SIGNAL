import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, BellOff, Clock, Droplet, Coffee, Moon, Check, Sparkles, Volume2 } from 'lucide-react';

interface ReminderItem {
  id: string;
  label: string;
  emoji: string;
  timeStr: string;
  intervalMinutes: number;
  body: string;
  active: boolean;
}

// --- SOOTHING AUDIO ENGINE FOR REMINDER BELLS ---
function playReminderChime(freq: number) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch (e) {
    console.warn(e);
  }
}

export function CareReminders() {
  const [permission, setPermission] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('ruu_care_reminders');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'water', label: 'Water Reminder', emoji: '💧', timeStr: 'Every 45m', intervalMinutes: 45, body: 'Time to sip some warm water to ease your cramps, princess! 💧', active: true },
      { id: 'rest', label: 'Bed Rest Reminder', emoji: '🛌', timeStr: 'Every 2h', intervalMinutes: 120, body: 'You have been active. Time to lay back on soft pillows! 🛌', active: true },
      { id: 'tea', label: 'Cozy Tea Reminder', emoji: '🍵', timeStr: 'Every 4h', intervalMinutes: 240, body: 'Brew a warm mug of honey chamomile or ginger tea now. 🍵', active: false },
      { id: 'sleep', label: 'Cozy Sleep Reminder', emoji: '😴', timeStr: 'At 10:00 PM', intervalMinutes: 1440, body: 'Keep the phone away and crawl under your heavy duvet, baby. 😴', active: true }
    ];
  });

  const [activeToast, setActiveToast] = useState<{ id: string; title: string; body: string; emoji: string } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ruu_care_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Request native permission
  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const resp = await Notification.requestPermission();
      setPermission(resp);
      playReminderChime(523.25);
    } else {
      alert("Browser native notifications are not fully supported on this device/environment. We will use in-app cozy toasts instead! ✨");
    }
  };

  // Toggle individual reminder
  const handleToggleReminder = (id: string) => {
    setReminders(prev => prev.map(rem => {
      if (rem.id === id) {
        const nextActive = !rem.active;
        if (nextActive) {
          playReminderChime(440);
        } else {
          playReminderChime(220);
        }
        return { ...rem, active: nextActive };
      }
      return rem;
    }));
  };

  // Trigger a test notification immediately so the user can see/hear it!
  const handleTestReminder = (rem: ReminderItem) => {
    // 1. Play comforting chime
    playReminderChime(659.25);

    // 2. Try native notification if granted
    if (permission === 'granted' && 'Notification' in window) {
      try {
        new Notification(`Cozy Period Reminder ${rem.emoji}`, {
          body: rem.body,
          icon: '/favicon.ico'
        });
      } catch (err) {
        console.warn("Native Notification failed (likely sandboxed iframe restriction):", err);
      }
    }

    // 3. Fallback to in-app custom toast
    setActiveToast({
      id: rem.id,
      title: rem.label,
      body: rem.body,
      emoji: rem.emoji
    });
  };

  // Auto Dismiss Toast after 6 seconds
  useEffect(() => {
    if (activeToast) {
      const t = setTimeout(() => {
        setActiveToast(null);
      }, 6000);
      return () => clearTimeout(t);
    }
  }, [activeToast]);

  return (
    <div className="space-y-6 text-left">
      <div className="text-center space-y-1 select-none">
        <span className="text-2xl">⏰</span>
        <h3 className="font-serif text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text">
          ⏰ Cozy Care Reminders
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Enable beautiful gentle alerts for water, rest, tea, and sleep to pamper your recovery schedule.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-950/45 border border-pink-500/15 rounded-[40px] p-6 md:p-8 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Permission Request panel (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4 bg-slate-950/30 p-5 rounded-3xl border border-white/5">
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-widest font-black text-pink-400 font-mono flex items-center gap-1">
              🔔 Notification Center
            </span>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Period Hub can deliver gentle system notification sounds directly to your phone/desktop. If native alerts are blocked inside the preview iframe, we automatically render gorgeous in-app overlays!
            </p>
          </div>

          <div className="pt-2">
            {permission === 'granted' ? (
              <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl text-center flex items-center justify-center gap-2 text-[10px] font-black text-pink-300 uppercase tracking-widest">
                <span>✓ System Alerts Enabled</span>
              </div>
            ) : (
              <button
                onClick={handleRequestPermission}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-450 hover:from-pink-600 text-white rounded-xl text-[9px] uppercase font-black tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Bell size={12} className="animate-bounce" /> Enable System Alerts
              </button>
            )}
          </div>
        </div>

        {/* Reminders Setup grid (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          <span className="text-[9px] uppercase tracking-widest font-black text-pink-400 font-mono block mb-1">
            Configure Schedules
          </span>

          <div className="space-y-2.5">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  rem.active 
                    ? 'bg-pink-500/10 border-pink-500/20' 
                    : 'bg-white/5 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-950/40 flex items-center justify-center text-lg select-none">
                    {rem.emoji}
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black text-white">{rem.label}</h5>
                    <p className="text-[9px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {rem.timeStr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Test Trigger Button */}
                  <button
                    onClick={() => handleTestReminder(rem)}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 text-[8px] font-bold text-zinc-300 rounded-lg hover:border-pink-500/30 hover:text-pink-300 transition-colors cursor-pointer"
                  >
                    Test Run ⚡
                  </button>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggleReminder(rem.id)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${
                      rem.active ? 'bg-pink-500' : 'bg-zinc-700'
                    }`}
                  >
                    <motion.div
                      layout
                      className="w-4 h-4 bg-white rounded-full shadow-md"
                      animate={{ x: rem.active ? 16 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Embedded interactive custom cozy Notification Overlay Toast */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-950/95 border border-pink-500/40 p-4 rounded-3xl shadow-2xl backdrop-blur-xl flex items-start gap-3.5 text-left"
          >
            <div className="w-10 h-10 rounded-full bg-pink-500/15 flex items-center justify-center text-2xl shrink-0 select-none animate-bounce">
              {activeToast.emoji}
            </div>
            
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-wider text-pink-400 font-mono flex items-center gap-1">
                  <Sparkles size={10} className="text-yellow-300 animate-pulse" /> Ruu's Care Alert
                </span>
                <span className="text-[8px] text-zinc-500 font-mono">Just Now</span>
              </div>
              <h4 className="text-xs font-black text-white">{activeToast.title}</h4>
              <p className="text-[10px] text-zinc-300 leading-normal font-semibold">
                {activeToast.body}
              </p>
              
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setActiveToast(null);
                    playReminderChime(880);
                  }}
                  className="px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white text-[9px] uppercase font-black tracking-widest rounded-lg transition-colors cursor-pointer"
                >
                  Done, Darling!
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
