import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isRealSupabase = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined');

// Real Supabase Client
export const supabase = isRealSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// --- INTERFACES ---
export interface Profile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
}

export interface PeriodFeedback {
  id: string;
  user_id: string;
  message: string;
  rating: number;
  mood: string;
  anonymous: boolean;
  created_at: string;
}

export interface LoveNote {
  id: string;
  user_id: string;
  note: string;
  favorite: boolean;
  created_at: string;
}

export interface DailyReward {
  id: string;
  user_id: string;
  reward: string;
  claimed_at: string;
}

export interface CareStreak {
  id: string;
  user_id: string;
  streak: number;
  last_visit: string;
}

export interface ComfortChecklist {
  id: string;
  user_id: string;
  water: boolean;
  rest: boolean;
  sleep: boolean;
  food: boolean;
  music: boolean;
  completed_at: string;
}

export interface GiftCollection {
  id: string;
  user_id: string;
  gift_name: string;
  gift_type: string;
  created_at: string;
}

export interface MoodHistory {
  id: string;
  user_id: string;
  selected_mood: string;
  created_at: string;
}

export interface AffirmationHistory {
  id: string;
  user_id: string;
  affirmation: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  details: string;
  created_at: string;
}

// --- SECURE SANITIZATION & VALIDATION ENGINE ---
export function sanitizeInput(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Basic spam filter
const SPAM_WORDS = ['spam', 'buy bitcoin', 'hack', 'cheat', 'abuse', 'kill', 'suicide'];
export function isSpam(message: string): boolean {
  const normalized = message.toLowerCase();
  return SPAM_WORDS.some(word => normalized.includes(word));
}

// Rate Limiter
const feedbackTimestamps: Record<string, number[]> = {};
export function checkRateLimit(userId: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  if (!feedbackTimestamps[userId]) {
    feedbackTimestamps[userId] = [];
  }
  feedbackTimestamps[userId] = feedbackTimestamps[userId].filter(t => now - t < windowMs);
  if (feedbackTimestamps[userId].length >= limit) {
    return false; // Rate limited
  }
  feedbackTimestamps[userId].push(now);
  return true;
}

// --- LOCAL STORAGE ENGINE (MOCK BACKEND WITH HIGH- fidelity SIMULATION) ---
class MockDatabase {
  private getStorageItem<T>(key: string, defaultVal: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }

  private setStorageItem<T>(key: string, val: T) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  // State
  currentUser: { id: string; email: string; name: string; avatar: string; isAnonymous: boolean } | null = null;
  subscribers: Record<string, ((payload: any) => void)[]> = {};

  constructor() {
    this.currentUser = this.getStorageItem('supabase_mock_user', {
      id: 'guest_user_ruu',
      email: 'guest@periodhub.com',
      name: 'Lovely Guest',
      avatar: '🌸',
      isAnonymous: true
    });
  }

  notify(table: string, eventType: 'INSERT' | 'DELETE' | 'UPDATE', record: any) {
    if (this.subscribers[table]) {
      this.subscribers[table].forEach(cb => cb({ eventType, new: record, old: record }));
    }
  }

  subscribe(table: string, cb: (payload: any) => void) {
    if (!this.subscribers[table]) this.subscribers[table] = [];
    this.subscribers[table].push(cb);
    return () => {
      this.subscribers[table] = this.subscribers[table].filter(x => x !== cb);
    };
  }
}

const mockDb = new MockDatabase();

// --- THE UNIFIED SUPABASE SERVICE WRAPPER ---
export const supabaseService = {
  // --- AUTHENTICATION ---
  auth: {
    getCurrentUser: async () => {
      if (isRealSupabase && supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          return {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || 'Lovely User',
            avatar: user.user_metadata?.avatar || '💖',
            isAnonymous: user.is_anonymous || false
          };
        }
      }
      return mockDb.currentUser;
    },

    loginGuest: async () => {
      const guest = {
        id: 'guest_' + Math.random().toString(36).substr(2, 9),
        email: 'guest@periodhub.com',
        name: 'Lovely Guest',
        avatar: '🌸',
        isAnonymous: true
      };
      mockDb.currentUser = guest;
      localStorage.setItem('supabase_mock_user', JSON.stringify(guest));
      return guest;
    },

    loginEmail: async (email: string, name = 'Lovely Princess') => {
      const user = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        name,
        avatar: '🧸',
        isAnonymous: false
      };
      mockDb.currentUser = user;
      localStorage.setItem('supabase_mock_user', JSON.stringify(user));
      return user;
    },

    logout: async () => {
      if (isRealSupabase && supabase) {
        await supabase.auth.signOut();
      }
      mockDb.currentUser = null;
      localStorage.removeItem('supabase_mock_user');
    },

    onAuthStateChange: (cb: (user: any) => void) => {
      if (isRealSupabase && supabase) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            cb({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || 'Lovely User',
              avatar: session.user.user_metadata?.avatar || '💖',
              isAnonymous: session.user.is_anonymous || false
            });
          } else {
            cb(null);
          }
        });
        return () => subscription.unsubscribe();
      } else {
        cb(mockDb.currentUser);
        return () => {};
      }
    }
  },

  // --- PROFILES ---
  profiles: {
    get: async (userId: string): Promise<Profile | null> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (!error && data) return data;
      }
      const saved = localStorage.getItem(`profile_${userId}`);
      if (saved) return JSON.parse(saved);
      return {
        id: userId,
        name: 'Lovely Princess',
        avatar: '🌸',
        email: 'lovely@periodhub.com',
        created_at: new Date().toISOString()
      };
    },
    save: async (profile: Profile): Promise<Profile> => {
      if (isRealSupabase && supabase) {
        const { error } = await supabase.from('profiles').upsert(profile);
        if (error) console.warn("Supabase profiles write issue:", error.message || error);
      }
      localStorage.setItem(`profile_${profile.id}`, JSON.stringify(profile));
      return profile;
    }
  },

  // --- PERIOD FEEDBACK (MESSAGE FOR RUU) ---
  feedback: {
    get: async (): Promise<PeriodFeedback[]> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase.from('period_feedback').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      }
      try {
        const local = localStorage.getItem('ruu_supabase_feedback');
        return local ? JSON.parse(local) : [];
      } catch (e) {
        return [];
      }
    },
    add: async (feedback: Omit<PeriodFeedback, 'id' | 'created_at'>): Promise<PeriodFeedback> => {
      // Input Validation & Sanitization
      const cleanMessage = sanitizeInput(feedback.message);
      if (isSpam(cleanMessage)) {
        throw new Error('Your message content is rejected by our safety engine.');
      }
      if (!checkRateLimit(feedback.user_id)) {
        throw new Error('Please wait a moment before sending another message to Ruu.');
      }

      const record: PeriodFeedback = {
        id: 'feedback_' + Math.random().toString(36).substr(2, 9),
        user_id: feedback.user_id,
        message: cleanMessage,
        rating: feedback.rating,
        mood: feedback.mood,
        anonymous: feedback.anonymous,
        created_at: new Date().toISOString()
      };

      if (isRealSupabase && supabase) {
        const { error } = await supabase.from('period_feedback').insert(record);
        if (error) console.warn("Supabase period_feedback write issue:", error.message || error);
      }

      // Track as general activity
      supabaseService.activityLogs.log('submitted_feedback', `Message: "${cleanMessage}". Mood: ${feedback.mood}, Rating: ${feedback.rating}`);

      // Sync local
      try {
        const local = localStorage.getItem('ruu_supabase_feedback');
        const list = local ? JSON.parse(local) : [];
        const nextList = [record, ...list];
        localStorage.setItem('ruu_supabase_feedback', JSON.stringify(nextList));
      } catch (e) {}

      mockDb.notify('period_feedback', 'INSERT', record);
      return record;
    },
    delete: async (id: string): Promise<void> => {
      if (isRealSupabase && supabase) {
        await supabase.from('period_feedback').delete().eq('id', id);
      }
      try {
        const local = localStorage.getItem('ruu_supabase_feedback');
        if (local) {
          const list = JSON.parse(local) as PeriodFeedback[];
          const nextList = list.filter(item => item.id !== id);
          localStorage.setItem('ruu_supabase_feedback', JSON.stringify(nextList));
        }
      } catch (e) {}
      mockDb.notify('period_feedback', 'DELETE', { id });
    }
  },

  // --- LOVE NOTES ---
  loveNotes: {
    get: async (): Promise<LoveNote[]> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase.from('love_notes').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      }
      try {
        const local = localStorage.getItem('ruu_supabase_love_notes');
        return local ? JSON.parse(local) : [];
      } catch (e) {
        return [];
      }
    },
    add: async (note: Omit<LoveNote, 'id' | 'created_at'>): Promise<LoveNote> => {
      const record: LoveNote = {
        id: 'note_' + Math.random().toString(36).substr(2, 9),
        user_id: note.user_id,
        note: sanitizeInput(note.note),
        favorite: note.favorite,
        created_at: new Date().toISOString()
      };

      if (isRealSupabase && supabase) {
        await supabase.from('love_notes').insert(record);
      }

      // Track as general activity
      supabaseService.activityLogs.log('added_love_note', `Note: "${record.note}"`);

      try {
        const local = localStorage.getItem('ruu_supabase_love_notes');
        const list = local ? JSON.parse(local) : [];
        const nextList = [record, ...list];
        localStorage.setItem('ruu_supabase_love_notes', JSON.stringify(nextList));
      } catch (e) {}

      mockDb.notify('love_notes', 'INSERT', record);
      return record;
    },
    toggleFavorite: async (id: string, favorite: boolean): Promise<void> => {
      if (isRealSupabase && supabase) {
        await supabase.from('love_notes').update({ favorite }).eq('id', id);
      }
      try {
        const local = localStorage.getItem('ruu_supabase_love_notes');
        if (local) {
          const list = JSON.parse(local) as LoveNote[];
          const nextList = list.map(item => item.id === id ? { ...item, favorite } : item);
          localStorage.setItem('ruu_supabase_love_notes', JSON.stringify(nextList));
        }
      } catch (e) {}
      mockDb.notify('love_notes', 'UPDATE', { id, favorite });
    }
  },

  // --- CARE STREAK ---
  careStreak: {
    get: async (userId: string): Promise<number> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase.from('care_streak').select('*').eq('user_id', userId).single();
        if (!error && data) return data.streak;
      }
      const saved = localStorage.getItem(`streak_${userId}`);
      return saved ? parseInt(saved, 10) : 3; // Defaults to 3 streak
    },
    set: async (userId: string, streak: number): Promise<void> => {
      if (isRealSupabase && supabase) {
        await supabase.from('care_streak').upsert({ user_id: userId, streak, last_visit: new Date().toISOString() });
      }
      localStorage.setItem(`streak_${userId}`, streak.toString());
    }
  },

  // --- DAILY REWARDS (PREVENTS MULTIPLE CLAIMS PER DAY) ---
  dailyRewards: {
    get: async (userId: string): Promise<DailyReward[]> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase.from('daily_rewards').select('*').eq('user_id', userId);
        if (!error && data) return data;
      }
      const saved = localStorage.getItem(`daily_rewards_${userId}`);
      return saved ? JSON.parse(saved) : [];
    },
    claim: async (userId: string, rewardName: string): Promise<DailyReward> => {
      const todayStr = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(`daily_rewards_${userId}`);
      const list: DailyReward[] = saved ? JSON.parse(saved) : [];

      // Check if already claimed today
      const alreadyClaimed = list.some(r => r.claimed_at.startsWith(todayStr));
      if (alreadyClaimed) {
        throw new Error('You have already claimed your sweet surprise today!');
      }

      const record: DailyReward = {
        id: 'reward_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        reward: rewardName,
        claimed_at: new Date().toISOString()
      };

      if (isRealSupabase && supabase) {
        await supabase.from('daily_rewards').insert(record);
      }

      list.push(record);
      localStorage.setItem(`daily_rewards_${userId}`, JSON.stringify(list));
      return record;
    }
  },

  // --- MOOD HISTORY ---
  moodHistory: {
    get: async (userId: string): Promise<MoodHistory[]> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase.from('mood_history').select('*').eq('user_id', userId);
        if (!error && data) return data;
      }
      const saved = localStorage.getItem(`mood_history_${userId}`);
      return saved ? JSON.parse(saved) : [];
    },
    add: async (userId: string, mood: string): Promise<MoodHistory> => {
      const record: MoodHistory = {
        id: 'mood_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        selected_mood: mood,
        created_at: new Date().toISOString()
      };

      if (isRealSupabase && supabase) {
        await supabase.from('mood_history').insert(record);
      }

      const saved = localStorage.getItem(`mood_history_${userId}`);
      const list = saved ? JSON.parse(saved) : [];
      list.push(record);
      localStorage.setItem(`mood_history_${userId}`, JSON.stringify(list));
      return record;
    }
  },

  // --- COMFORT CHECKLIST ---
  comfortChecklist: {
    get: async (userId: string): Promise<ComfortChecklist | null> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase.from('comfort_checklist').select('*').eq('user_id', userId).single();
        if (!error && data) return data;
      }
      const saved = localStorage.getItem(`checklist_${userId}`);
      return saved ? JSON.parse(saved) : null;
    },
    save: async (checklist: ComfortChecklist): Promise<ComfortChecklist> => {
      if (isRealSupabase && supabase) {
        await supabase.from('comfort_checklist').upsert(checklist);
      }
      localStorage.setItem(`checklist_${checklist.user_id}`, JSON.stringify(checklist));
      return checklist;
    }
  },

  // --- GIFT COLLECTION ---
  gifts: {
    get: async (userId: string): Promise<GiftCollection[]> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase.from('gift_collection').select('*').eq('user_id', userId);
        if (!error && data) return data;
      }
      const saved = localStorage.getItem(`gifts_${userId}`);
      return saved ? JSON.parse(saved) : [];
    },
    add: async (userId: string, giftName: string, giftType: string): Promise<GiftCollection> => {
      const record: GiftCollection = {
        id: 'gift_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        gift_name: giftName,
        gift_type: giftType,
        created_at: new Date().toISOString()
      };

      if (isRealSupabase && supabase) {
        await supabase.from('gift_collection').insert(record);
      }

      const saved = localStorage.getItem(`gifts_${userId}`);
      const list = saved ? JSON.parse(saved) : [];
      list.push(record);
      localStorage.setItem(`gifts_${userId}`, JSON.stringify(list));
      return record;
    }
  },

  // --- COSMIC WISHES ---
  wishes: {
    get: async (): Promise<any[]> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase.from('cosmic_wishes').select('*').order('created_at', { ascending: true });
        if (!error && data) return data;
      }
      try {
        const local = localStorage.getItem('ruu_cosmic_wishes');
        return local ? JSON.parse(local) : [
          { id: 1, text: "May all tummy pain vanish right now! ⭐", type: 'star', x: 25, y: 35, color: '#fde047' },
          { id: 2, text: "I wish for infinite cozy cuddles 🫂", type: 'heart', x: 68, y: 55, color: '#f43f5e' },
          { id: 3, text: "May tomorrow be incredibly sweet 🌈", type: 'butterfly', x: 45, y: 22, color: '#c084fc' }
        ];
      } catch (e) {
        return [];
      }
    },
    add: async (wish: any): Promise<any> => {
      const record = {
        id: wish.id || 'wish_' + Math.random().toString(36).substr(2, 9),
        text: sanitizeInput(wish.text),
        type: wish.type,
        x: wish.x,
        y: wish.y,
        color: wish.color,
        created_at: new Date().toISOString()
      };
      if (isRealSupabase && supabase) {
        await supabase.from('cosmic_wishes').insert(record);
      }
      try {
        const local = localStorage.getItem('ruu_cosmic_wishes');
        const list = local ? JSON.parse(local) : [];
        const nextList = [...list, record];
        localStorage.setItem('ruu_cosmic_wishes', JSON.stringify(nextList));
      } catch (e) {}
      mockDb.notify('cosmic_wishes', 'INSERT', record);
      return record;
    },
    clear: async (): Promise<void> => {
      if (isRealSupabase && supabase) {
        await supabase.from('cosmic_wishes').delete().neq('id', '0');
      }
      localStorage.setItem('ruu_cosmic_wishes', '[]');
      mockDb.notify('cosmic_wishes', 'DELETE', null);
    }
  },

  // --- CARE COUNTERS ---
  counters: {
    get: async (userId: string): Promise<any> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase.from('care_counters').select('*').eq('user_id', userId).single();
        if (!error && data) return data.counters;
      }
      try {
        const saved = localStorage.getItem(`counters_${userId}`);
        return saved ? JSON.parse(saved) : { love: 12, hugs: 8, teddies: 4, flowers: 15, chocolates: 6, letters: 3 };
      } catch (e) {
        return { love: 12, hugs: 8, teddies: 4, flowers: 15, chocolates: 6, letters: 3 };
      }
    },
    save: async (userId: string, counters: any): Promise<void> => {
      if (isRealSupabase && supabase) {
        await supabase.from('care_counters').upsert({ user_id: userId, counters, updated_at: new Date().toISOString() });
      }
      localStorage.setItem(`counters_${userId}`, JSON.stringify(counters));
      mockDb.notify('care_counters', 'UPDATE', { user_id: userId, counters });
    }
  },

  // --- LOVE JAR ---
  loveJar: {
    get: async (userId: string): Promise<number> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase.from('love_jar').select('*').eq('user_id', userId).single();
        if (!error && data) return data.count;
      }
      const saved = localStorage.getItem(`love_jar_count_${userId}`);
      return saved ? parseInt(saved, 10) : 12;
    },
    set: async (userId: string, count: number): Promise<void> => {
      if (isRealSupabase && supabase) {
        await supabase.from('love_jar').upsert({ user_id: userId, count, updated_at: new Date().toISOString() });
      }
      localStorage.setItem(`love_jar_count_${userId}`, count.toString());
      mockDb.notify('love_jar', 'UPDATE', { user_id: userId, count });
    }
  },

  // --- ACTIVITY LOGS ---
  activityLogs: {
    get: async (): Promise<ActivityLog[]> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      }
      try {
        const local = localStorage.getItem('ruu_supabase_activity_logs');
        return local ? JSON.parse(local) : [];
      } catch (e) {
        return [];
      }
    },
    log: async (action: string, details: string = ''): Promise<ActivityLog> => {
      let userId = 'guest_user_ruu';
      try {
        userId = mockDb.currentUser?.id || 'guest_user_ruu';
      } catch (e) {}

      // Try to parse details if it's JSON from logActivity
      let logPayload: any = {};
      try {
        logPayload = JSON.parse(details);
      } catch (e) {
        logPayload = { details };
      }

      const record: ActivityLog = {
        id: 'log_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        action: logPayload.activity || action,
        details: logPayload.details || details,
        created_at: new Date().toISOString()
      };
      
      if (isRealSupabase && supabase) {
        // Construct standard database payload including page, browser, device, session_id
        const dbPayload = {
          ...record,
          page: logPayload.page || '',
          browser: logPayload.browser || '',
          device: logPayload.device || '',
          session_id: logPayload.session_id || ''
        };
        supabase.from('activity_logs').insert(dbPayload)
          .then(
            ({ error }) => {
              if (error) {
                console.warn("Supabase activity_logs write issue (falling back to local):", error.message || error);
              }
            },
            (err) => {
              console.warn("Supabase activity_logs unexpected failure:", err);
            }
          );
      }
      try {
        const local = localStorage.getItem('ruu_supabase_activity_logs');
        const list = local ? JSON.parse(local) : [];
        const nextList = [record, ...list].slice(0, 500);
        localStorage.setItem('ruu_supabase_activity_logs', JSON.stringify(nextList));
      } catch (e) {}
      
      mockDb.notify('activity_logs', 'INSERT', record);
      return record;
    }
  },

  // --- NEW: PRIVATE REAL-TIME CHAT SERVICE ---
  messages: {
    get: async (): Promise<any[]> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });
        if (!error && data) return data;
        if (error) {
          console.warn("Supabase messages read issue (using local storage fallback):", error.message || error);
          if (error.code === '42P01') {
            (window as any)._supabaseMessagesTableMissing = true;
          }
        }
      }
      try {
        const local = localStorage.getItem('ruu_supabase_messages') || '[]';
        return JSON.parse(local);
      } catch (e) {
        return [];
      }
    },
    add: async (msg: {
      sender_id: string;
      recipient_id: string;
      text: string;
      image_url?: string;
      voice_url?: string;
      reply_to_id?: string;
    }): Promise<any> => {
      const record = {
        id: 'msg_' + Math.random().toString(36).substr(2, 9),
        sender_id: msg.sender_id,
        recipient_id: msg.recipient_id,
        text: sanitizeInput(msg.text),
        image_url: msg.image_url || '',
        voice_url: msg.voice_url || '',
        reply_to_id: msg.reply_to_id || '',
        seen_status: 'sent',
        edited: false,
        created_at: new Date().toISOString()
      };

      if (isRealSupabase && supabase) {
        const { error } = await supabase.from('messages').insert(record);
        if (error) {
          console.warn("Supabase messages write issue (falling back to local storage):", error.message || error);
          if (error.code === '42P01') {
            (window as any)._supabaseMessagesTableMissing = true;
          }
        }
      }

      try {
        const local = localStorage.getItem('ruu_supabase_messages') || '[]';
        const list = JSON.parse(local);
        list.push(record);
        localStorage.setItem('ruu_supabase_messages', JSON.stringify(list));
      } catch (e) {}

      mockDb.notify('messages', 'INSERT', record);
      return record;
    },
    edit: async (id: string, newText: string): Promise<void> => {
      const cleanText = sanitizeInput(newText);
      if (isRealSupabase && supabase) {
        await supabase.from('messages').update({ text: cleanText, edited: true }).eq('id', id);
      }
      try {
        const local = localStorage.getItem('ruu_supabase_messages') || '[]';
        let list = JSON.parse(local);
        list = list.map((m: any) => m.id === id ? { ...m, text: cleanText, edited: true } : m);
        localStorage.setItem('ruu_supabase_messages', JSON.stringify(list));
      } catch (e) {}
      mockDb.notify('messages', 'UPDATE', { id, text: cleanText, edited: true });
    },
    delete: async (id: string): Promise<void> => {
      if (isRealSupabase && supabase) {
        await supabase.from('messages').delete().eq('id', id);
      }
      try {
        const local = localStorage.getItem('ruu_supabase_messages') || '[]';
        let list = JSON.parse(local);
        list = list.filter((m: any) => m.id !== id);
        localStorage.setItem('ruu_supabase_messages', JSON.stringify(list));
      } catch (e) {}
      mockDb.notify('messages', 'DELETE', { id });
    },
    markAsSeen: async (messageIds: string[]): Promise<void> => {
      if (messageIds.length === 0) return;
      if (isRealSupabase && supabase) {
        await supabase.from('messages').update({ seen_status: 'seen' }).in('id', messageIds);
      }
      try {
        const local = localStorage.getItem('ruu_supabase_messages') || '[]';
        let list = JSON.parse(local);
        list = list.map((m: any) => messageIds.includes(m.id) ? { ...m, seen_status: 'seen' } : m);
        localStorage.setItem('ruu_supabase_messages', JSON.stringify(list));
      } catch (e) {}
      messageIds.forEach(id => {
        mockDb.notify('messages', 'UPDATE', { id, seen_status: 'seen' });
      });
    }
  },

  // --- NEW: REAL-TIME TYPING STATUS ---
  typingStatus: {
    set: async (userId: string, isTyping: boolean): Promise<void> => {
      const record = { user_id: userId, is_typing: isTyping, last_updated: new Date().toISOString() };
      if (isRealSupabase && supabase) {
        await supabase.from('typing_status').upsert(record);
      }
      mockDb.notify('typing_status', 'UPDATE', record);
    }
  },

  // --- NEW: PRESENCE AND ONLINE STATUS ---
  presence: {
    set: async (userId: string, status: 'online' | 'offline'): Promise<void> => {
      const record = {
        user_id: userId,
        status,
        last_seen: new Date().toISOString(),
        browser: navigator.userAgent.substring(0, 100),
        device: window.innerWidth < 768 ? 'Mobile' : 'Desktop'
      };
      if (isRealSupabase && supabase) {
        await supabase.from('presence').upsert(record);
      }
      mockDb.notify('presence', 'UPDATE', record);
    },
    get: async (userId: string): Promise<any> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase.from('presence').select('*').eq('user_id', userId).single();
        if (!error && data) return data;
      }
      return {
        user_id: userId,
        status: 'online',
        last_seen: new Date().toISOString(),
        browser: 'Chrome',
        device: 'Mobile'
      };
    }
  },

  // --- NEW: NOTIFICATIONS SERVICE ---
  notifications: {
    get: async (): Promise<any[]> => {
      if (isRealSupabase && supabase) {
        const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      }
      try {
        const local = localStorage.getItem('ruu_supabase_notifications') || '[]';
        return JSON.parse(local);
      } catch (e) {
        return [];
      }
    },
    add: async (notif: { user_id: string; title: string; body: string }): Promise<any> => {
      const record = {
        id: 'notif_' + Math.random().toString(36).substr(2, 9),
        user_id: notif.user_id,
        title: notif.title,
        body: notif.body,
        read: false,
        created_at: new Date().toISOString()
      };
      if (isRealSupabase && supabase) {
        await supabase.from('notifications').insert(record);
      }
      try {
        const local = localStorage.getItem('ruu_supabase_notifications') || '[]';
        const list = JSON.parse(local);
        list.unshift(record);
        localStorage.setItem('ruu_supabase_notifications', JSON.stringify(list));
      } catch (e) {}
      mockDb.notify('notifications', 'INSERT', record);
      return record;
    },
    markAsRead: async (id: string): Promise<void> => {
      if (isRealSupabase && supabase) {
        await supabase.from('notifications').update({ read: true }).eq('id', id);
      }
      try {
        const local = localStorage.getItem('ruu_supabase_notifications') || '[]';
        let list = JSON.parse(local);
        list = list.map((n: any) => n.id === id ? { ...n, read: true } : n);
        localStorage.setItem('ruu_supabase_notifications', JSON.stringify(list));
      } catch (e) {}
      mockDb.notify('notifications', 'UPDATE', { id, read: true });
    }
  },

  // --- REAL-TIME LISTENER SETUP ---
  subscribe: (table: string, cb: (payload: any) => void) => {
    if (isRealSupabase && supabase) {
      const channel = supabase
        .channel(`public:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
          cb({
            eventType: payload.eventType,
            new: payload.new,
            old: payload.old
          });
        })
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      return mockDb.subscribe(table, cb);
    }
  }
};
