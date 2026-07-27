import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Image as ImageIcon, Mic, Square, Play, Pause, 
  Smile, CornerDownLeft, Trash2, Edit2, Check, CheckCheck, 
  ChevronRight, Circle, Heart, Sparkles, User, Info, AlertCircle 
} from 'lucide-react';
import { supabaseService, sanitizeInput } from '../lib/supabase';
import { logActivity } from '../lib/activityLogger';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  text: string;
  image_url?: string;
  voice_url?: string;
  created_at: string;
  seen_status: 'sent' | 'delivered' | 'seen';
  reply_to_id?: string;
  edited?: boolean;
}

interface PrivateChatProps {
  onTriggerConfetti: () => void;
}

export default function PrivateChat({ onTriggerConfetti }: PrivateChatProps) {
  // Roles: "Ruu" (Admin) and "Princess" (Her)
  const [activeUserRole, setActiveUserRole] = useState<'ruu' | 'princess'>('princess');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showImagePopover, setShowImagePopover] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [voiceBase64, setVoiceBase64] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<any>(null);

  // Editing & Replying states
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  // Indicators & Presence states
  const [otherUserOnline, setOtherUserOnline] = useState(true);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [myTyping, setMyTyping] = useState(false);
  const [otherLastSeen, setOtherLastSeen] = useState<string>('Online');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const myId = activeUserRole === 'princess' ? 'princess_user_id' : 'ruu_user_id';
  const otherId = activeUserRole === 'princess' ? 'ruu_user_id' : 'princess_user_id';
  const myName = activeUserRole === 'princess' ? 'Princess 👑' : 'Ruu ❤️';
  const otherName = activeUserRole === 'princess' ? 'Ruu ❤️' : 'Princess 👑';

  // Cute quick emojis for emotional quick-pasting
  const CUTE_EMOJIS = ['💗', '💋', '🩷', '🫰🏻', '🐣', '🐥', '🎀', '🧸', '🥺', '🌸', '✨', '🫂', '⭐', '🌈'];

  // Initialize and load messages
  useEffect(() => {
    loadMessages();
    logActivity(`Opened Chat as ${myName}`);

    // Real-time listener for messages
    const unsubscribeMessages = supabaseService.subscribe('messages', (payload) => {
      if (payload.eventType === 'INSERT') {
        const newMsg = payload.new as Message;
        setMessages(prev => {
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        
        // Auto mark incoming messages as seen if we are active
        if (newMsg.sender_id === otherId) {
          supabaseService.messages.markAsSeen([newMsg.id]).catch(() => {});
          
          // Trigger a beautiful visual popup/toast
          showLiveToast(`💌 New message from ${otherName}: "${newMsg.text || '📷 Attachment'}"`);
        }
      } else if (payload.eventType === 'UPDATE') {
        const updated = payload.new as Message;
        setMessages(prev => prev.map(m => m.id === updated.id ? { ...m, ...updated } : m));
      } else if (payload.eventType === 'DELETE') {
        const deletedId = payload.old?.id;
        if (deletedId) {
          setMessages(prev => prev.filter(m => m.id !== deletedId));
        }
      }
    });

    // Real-time listener for typing status
    const unsubscribeTyping = supabaseService.subscribe('typing_status', (payload) => {
      const update = payload.new;
      if (update && update.user_id === otherId) {
        setOtherUserTyping(update.is_typing);
      }
    });

    // Real-time listener for presence
    const unsubscribePresence = supabaseService.subscribe('presence', (payload) => {
      const update = payload.new;
      if (update && update.user_id === otherId) {
        setOtherUserOnline(update.status === 'online');
        if (update.status === 'offline') {
          const lastTime = new Date(update.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setOtherLastSeen(`Last seen at ${lastTime}`);
        } else {
          setOtherLastSeen('Online');
        }
      }
    });

    // Set online presence on mount
    supabaseService.presence.set(myId, 'online').catch(() => {});

    // Periodic heartbeat to keep presence updated
    const interval = setInterval(() => {
      supabaseService.presence.set(myId, 'online').catch(() => {});
    }, 15000);

    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
      unsubscribePresence();
      clearInterval(interval);
      supabaseService.presence.set(myId, 'offline').catch(() => {});
    };
  }, [activeUserRole]);

  // Handle auto scrolling on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, otherUserTyping]);

  const loadMessages = async () => {
    try {
      const allMsgs = await supabaseService.messages.get();
      setMessages(allMsgs);
      
      // Mark unread incoming messages as seen
      const unseenIds = allMsgs
        .filter(m => m.sender_id === otherId && m.seen_status !== 'seen')
        .map(m => m.id);
      if (unseenIds.length > 0) {
        await supabaseService.messages.markAsSeen(unseenIds);
      }
    } catch (e) {
      console.error("Failed to load messages", e);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Toast / alert popup engine
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showLiveToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Send textual/multimedia message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !imageUrlInput && !voiceBase64) return;

    const textToSend = inputText.trim();
    setInputText('');
    setImageUrlInput('');
    setVoiceBase64(null);
    setShowImagePopover(false);
    setShowEmojiPicker(false);
    
    // Reset typing status immediately
    supabaseService.typingStatus.set(myId, false).catch(() => {});
    setMyTyping(false);

    try {
      if (editingMessage) {
        await supabaseService.messages.edit(editingMessage.id, textToSend);
        logActivity("Edited Message", `Msg ID: ${editingMessage.id} -> "${textToSend}"`);
        setEditingMessage(null);
      } else {
        await supabaseService.messages.add({
          sender_id: myId,
          recipient_id: otherId,
          text: textToSend,
          image_url: imageUrlInput || undefined,
          voice_url: voiceBase64 || undefined,
          reply_to_id: replyingTo?.id || undefined
        });
        const detailText = textToSend ? `Message: "${textToSend}"` : (imageUrlInput ? `[Image] ${imageUrlInput}` : `[Voice Note]`);
        logActivity("Sent Message", detailText);
        setReplyingTo(null);
        onTriggerConfetti();
      }
      loadMessages();
    } catch (err: any) {
      showLiveToast(`⚠️ Error: ${err.message || 'Failed to sync message.'}`);
    }
  };

  // Manage Typing indicator
  const handleInputKeyDown = () => {
    if (!myTyping) {
      setMyTyping(true);
      supabaseService.typingStatus.set(myId, true).catch(() => {});
    }
    // Debounce typing status resets
    const delay = setTimeout(() => {
      setMyTyping(false);
      supabaseService.typingStatus.set(myId, false).catch(() => {});
    }, 4000);
    return () => clearTimeout(delay);
  };

  // Micro recording system (Voice notes)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      setRecordingDuration(0);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setVoiceBase64(base64String);
          showLiveToast("🎙️ Voice note captured! Click send to share with your love.");
        };
        
        // Stop all track devices to release hardware lock
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      logActivity("Started Recording Voice Note");
    } catch (e) {
      showLiveToast("⚠️ Mic access denied! Please check your browser microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  // Audio Playback handler
  const playVoiceNote = (id: string, base64: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
      return;
    }
    try {
      const audio = new Audio(base64);
      setPlayingAudioId(id);
      audio.play();
      audio.onended = () => setPlayingAudioId(null);
    } catch (e) {
      showLiveToast("Could not play voice note.");
    }
  };

  // Date separator formatter
  const formatMessageDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-white/20 backdrop-blur-xl border border-pink-100/30 shadow-[0_15px_35px_rgba(236,72,153,0.1)] flex flex-col h-[650px] select-none text-zinc-800">
      
      {/* Toast Notification HUD */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-16 left-4 right-4 z-50 p-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-lg border border-pink-400 text-xs font-bold flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="shrink-0 animate-spin-slow" />
              <span>{toastMessage}</span>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="px-1.5 py-0.5 hover:bg-white/20 rounded text-[10px] font-black uppercase tracking-wider cursor-pointer"
            >
              Okay
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Private Chat Header */}
      <header className="p-4 bg-white/40 border-b border-pink-100/30 flex items-center justify-between gap-3 relative z-10 shrink-0">
        <div className="flex items-center gap-3">
          {/* Avatar frame */}
          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm border-2 ${activeUserRole === 'princess' ? 'bg-pink-100 border-pink-300' : 'bg-purple-100 border-purple-300'}`}>
              {activeUserRole === 'princess' ? '🌸' : '🧸'}
            </div>
            <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${otherUserOnline ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white ${otherUserOnline ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
            </span>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-xs font-black text-gray-800 tracking-wide uppercase flex items-center gap-1.5">
              <span>{otherName}</span>
              {otherUserOnline && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-md font-extrabold animate-pulse">Online</span>}
            </h3>
            <p className="text-[10px] text-gray-400 font-bold">
              {otherUserTyping ? (
                <span className="text-pink-500 animate-pulse font-extrabold tracking-widest uppercase">Typing...</span>
              ) : (
                otherLastSeen
              )}
            </p>
          </div>
        </div>

        {/* Simulator Swapper Control (Essential for high-fidelity direct local feedback) */}
        <div className="flex items-center gap-1 bg-pink-100/50 p-1 rounded-xl border border-pink-200/30 select-none">
          <span className="text-[9px] font-black text-pink-600 uppercase px-1.5 tracking-wider">Chat as:</span>
          <button
            onClick={() => {
              setActiveUserRole('princess');
              onTriggerConfetti();
            }}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${activeUserRole === 'princess' ? 'bg-pink-500 text-white shadow-xs' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Princess 👑
          </button>
          <button
            onClick={() => {
              setActiveUserRole('ruu');
              onTriggerConfetti();
            }}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${activeUserRole === 'ruu' ? 'bg-purple-500 text-white shadow-xs' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Ruu ❤️
          </button>
        </div>
      </header>

      {/* Messages Scroll viewport */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-white/10 to-pink-50/5 relative"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2 select-none">
            <div className="w-14 h-14 bg-pink-100/50 rounded-full flex items-center justify-center text-2xl animate-bounce">
              💬
            </div>
            <h4 className="text-xs font-black text-gray-700 uppercase tracking-widest">Start Our Love Chat</h4>
            <p className="text-[11px] text-gray-400 max-w-xs leading-relaxed">
              Every single message is encrypted and securely saved to your private database table on Supabase. Start typing to write to your darling!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id === myId;
            const hasPrev = index > 0;
            const prevMsg = hasPrev ? messages[index - 1] : null;
            const prevDateStr = prevMsg ? formatMessageDate(prevMsg.created_at) : '';
            const currDateStr = formatMessageDate(msg.created_at);
            const showDateHeader = prevDateStr !== currDateStr;

            // Resolve replied-to parent message
            const parentMsg = msg.reply_to_id ? messages.find(m => m.id === msg.reply_to_id) : null;

            return (
              <div key={msg.id} className="space-y-1.5 animate-slide-up">
                {/* Date separator header */}
                {showDateHeader && (
                  <div className="flex justify-center py-2 select-none">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100/80 px-2.5 py-0.5 rounded-full shadow-2xs border border-white/40">
                      {currDateStr}
                    </span>
                  </div>
                )}

                {/* Main bubble alignment row */}
                <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {/* Sender indicator avatar on the left */}
                  {!isMe && (
                    <div className="w-6 h-6 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center text-xs shadow-xs select-none">
                      {msg.sender_id === 'princess_user_id' ? '🌸' : '🧸'}
                    </div>
                  )}

                  {/* Message Bubble framework */}
                  <div className="max-w-[70%] space-y-1 group">
                    {/* Render Reply thread header inside current bubble if referencing parent message */}
                    {parentMsg && (
                      <div className={`text-[10px] p-2 rounded-xl bg-black/5 flex items-center gap-1.5 mb-1 text-slate-500 font-semibold border-l-2 ${isMe ? 'border-pink-400' : 'border-purple-400'}`}>
                        <CornerDownLeft size={10} />
                        <span className="truncate">Replying: "{parentMsg.text || '📷 attachment'}"</span>
                      </div>
                    )}

                    {/* Standard Bubble structure */}
                    <div 
                      className={`p-3 rounded-2xl relative shadow-xs leading-relaxed transition-all ${
                        isMe 
                          ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-br-xs hover:shadow-md' 
                          : 'bg-white/80 backdrop-blur-md text-gray-800 rounded-bl-xs border border-pink-100/30'
                      }`}
                    >
                      {/* Multimedia attachment renderer (Image) */}
                      {msg.image_url && (
                        <div className="mb-2 rounded-xl overflow-hidden max-h-52 border border-black/10">
                          <img 
                            src={msg.image_url} 
                            alt="Attachment" 
                            referrerPolicy="no-referrer"
                            className="object-cover w-full h-full hover:scale-[1.02] transition-transform duration-200"
                          />
                        </div>
                      )}

                      {/* Multimedia attachment renderer (Voice Note) */}
                      {msg.voice_url && (
                        <div className="mb-2 py-1.5 px-3 rounded-xl bg-black/10 flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => playVoiceNote(msg.id, msg.voice_url!)}
                            className="w-7 h-7 rounded-full bg-white text-pink-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                          >
                            {playingAudioId === msg.id ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                          </button>
                          <div className="flex-1 space-y-1">
                            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                              <div className={`h-full bg-white rounded-full ${playingAudioId === msg.id ? 'w-full animate-pulse' : 'w-0'}`} />
                            </div>
                            <span className="text-[8px] font-black tracking-widest text-white/80 uppercase">Voice Note Attachment</span>
                          </div>
                        </div>
                      )}

                      {/* Text label content */}
                      {msg.text && (
                        <p className="text-xs font-medium break-words leading-relaxed">{msg.text}</p>
                      )}

                      {/* Action controllers (Reply / Delete / Edit - visible on hover) */}
                      <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/90 shadow-sm border border-pink-100 rounded-lg shrink-0 ${isMe ? 'right-full mr-2' : 'left-full ml-2'}`}>
                        <button
                          onClick={() => setReplyingTo(msg)}
                          className="p-1 hover:bg-pink-50 text-slate-500 hover:text-pink-600 rounded cursor-pointer"
                          title="Reply to message"
                        >
                          <CornerDownLeft size={11} />
                        </button>
                        
                        {isMe && (
                          <>
                            <button
                              onClick={() => {
                                setEditingMessage(msg);
                                setInputText(msg.text);
                              }}
                              className="p-1 hover:bg-slate-50 text-slate-500 hover:text-blue-600 rounded cursor-pointer"
                              title="Edit Message"
                            >
                              <Edit2 size={11} />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm("Delete this sweet message from our private chat logs?")) {
                                  await supabaseService.messages.delete(msg.id);
                                  loadMessages();
                                }
                              }}
                              className="p-1 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded cursor-pointer"
                              title="Delete Message"
                            >
                              <Trash2 size={11} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Meta indicator footer (Time / Read state / Edited tag) */}
                    <div className={`flex items-center gap-1 text-[9px] text-gray-400 font-bold select-none ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span>{formatMessageTime(msg.created_at)}</span>
                      {msg.edited && <span className="italic text-slate-300">• Edited</span>}
                      {isMe && (
                        <span>
                          {msg.seen_status === 'seen' ? (
                            <CheckCheck size={11} className="text-emerald-500" />
                          ) : (
                            <Check size={11} />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Other user is active typing bubble indicator */}
        {otherUserTyping && (
          <div className="flex items-center gap-2 select-none">
            <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-xs">
              {otherId === 'princess_user_id' ? '🌸' : '🧸'}
            </div>
            <div className="px-3.5 py-2.5 bg-white border border-pink-100/50 rounded-2xl rounded-bl-xs text-xs text-pink-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply Banner tray */}
      {replyingTo && (
        <div className="p-2.5 bg-pink-50 border-t border-pink-100/60 flex items-center justify-between gap-2 text-xs shrink-0 select-none">
          <div className="flex items-center gap-2 text-slate-600 font-semibold truncate">
            <CornerDownLeft size={13} className="text-pink-500" />
            <span className="truncate">Replying to: "{replyingTo.text || 'Attachment'}"</span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-[10px] font-black text-pink-600 hover:text-pink-700 cursor-pointer uppercase bg-white/80 px-2 py-0.5 rounded-lg border border-pink-200"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editing Message Banner tray */}
      {editingMessage && (
        <div className="p-2.5 bg-indigo-50 border-t border-indigo-100/60 flex items-center justify-between gap-2 text-xs shrink-0 select-none">
          <div className="flex items-center gap-2 text-indigo-700 font-bold">
            <Edit2 size={13} />
            <span>Editing message: "{editingMessage.text}"</span>
          </div>
          <button
            onClick={() => {
              setEditingMessage(null);
              setInputText('');
            }}
            className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 cursor-pointer uppercase bg-white/80 px-2 py-0.5 rounded-lg border border-indigo-200"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Emoji Palette Overlay */}
      {showEmojiPicker && (
        <div className="p-2.5 bg-white/95 border-t border-pink-100 flex flex-wrap gap-2 select-none justify-center shrink-0">
          {CUTE_EMOJIS.map(emoji => (
            <button
              key={emoji}
              onClick={() => {
                setInputText(prev => prev + emoji);
                setShowEmojiPicker(false);
              }}
              className="text-lg hover:scale-125 transition-transform duration-100 cursor-pointer p-1"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Image attachment URL prompt popover */}
      {showImagePopover && (
        <div className="p-3 bg-slate-50 border-t border-pink-100 flex flex-col gap-2 shrink-0 select-none">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-gray-400 font-bold uppercase">Insert Image URL</label>
            <button 
              onClick={() => setShowImagePopover(false)}
              className="text-[10px] text-pink-500 font-bold hover:underline cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Paste photo link (e.g., https://unsplash.com/...)"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white border border-pink-200/50 rounded-xl text-xs focus:outline-none focus:border-pink-400"
            />
            <button 
              onClick={() => {
                if (imageUrlInput) {
                  setShowImagePopover(false);
                  showLiveToast("📸 Image URL set successfully! Press Send button.");
                }
              }}
              className="px-3 bg-pink-500 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Set
            </button>
          </div>
        </div>
      )}

      {/* Interactive Input Form bar */}
      <form 
        onSubmit={handleSendMessage}
        className="p-3 bg-white/40 border-t border-pink-100/30 flex items-center gap-2 shrink-0 select-none"
      >
        {/* Toggle Inline Emoji Selector */}
        <button
          type="button"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
            setShowImagePopover(false);
          }}
          className={`p-2 hover:bg-pink-100/60 rounded-xl transition-all cursor-pointer ${showEmojiPicker ? 'bg-pink-100/80 text-pink-500' : 'text-slate-400'}`}
          title="Insert Cute Emoji"
        >
          <Smile size={18} />
        </button>

        {/* Toggle Image Popover link */}
        <button
          type="button"
          onClick={() => {
            setShowImagePopover(!showImagePopover);
            setShowEmojiPicker(false);
          }}
          className={`p-2 hover:bg-pink-100/60 rounded-xl transition-all cursor-pointer ${showImagePopover ? 'bg-pink-100/80 text-pink-500' : 'text-slate-400'}`}
          title="Attach Image Link"
        >
          <ImageIcon size={18} />
        </button>

        {/* Voice recorder action button */}
        {isRecording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="p-2 bg-red-100 text-red-500 rounded-xl animate-pulse cursor-pointer flex items-center gap-1 text-[10px] font-black uppercase tracking-wider"
          >
            <Square size={13} fill="currentColor" />
            <span>{recordingDuration}s</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            className="p-2 hover:bg-pink-100/60 text-slate-400 hover:text-pink-500 rounded-xl cursor-pointer"
            title="Record Voice Note"
          >
            <Mic size={18} />
          </button>
        )}

        {/* Text Input area */}
        <input 
          type="text"
          placeholder={isRecording ? "Voice note recording active..." : "Say something magical right now..."}
          disabled={isRecording}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleInputKeyDown}
          className="flex-1 px-4 py-2 bg-white/80 border border-pink-200/30 rounded-2xl text-xs focus:outline-none focus:border-pink-400 select-all font-medium disabled:opacity-50"
        />

        {/* Send message trigger */}
        <button
          type="submit"
          className="p-2.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:shadow-md active:scale-95 transition-all rounded-2xl cursor-pointer flex items-center justify-center shrink-0"
          title="Send message"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
