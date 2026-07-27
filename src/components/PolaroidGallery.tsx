import { useState, useEffect } from 'react';
import { MemoryPhoto } from '../types';
import { Layout, Image as ImageIcon, Sparkles, Calendar, Plus, Trash2, SwitchCamera, Info } from 'lucide-react';
import { logActivity } from '../lib/activityLogger';

interface PolaroidGalleryProps {
  photos: MemoryPhoto[];
  onAddTrigger: () => void;
  onRemovePhoto: (id: string) => void;
}

type GalleryStyle = 'polaroid' | 'scrapbook' | 'frame' | 'memory-card';

export default function PolaroidGallery({ photos, onAddTrigger, onRemovePhoto }: PolaroidGalleryProps) {
  const [style, setStyle] = useState<GalleryStyle>('polaroid');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  useEffect(() => {
    logActivity("Opened Gallery", `Style: ${style}`);
  }, [style]);

  // Quick toggle styles
  const stylesList: { id: GalleryStyle; label: string; icon: string }[] = [
    { id: 'polaroid', label: 'Classic Polaroids', icon: '📸' },
    { id: 'scrapbook', label: 'Scrapbook Memories', icon: '📖' },
    { id: 'frame', label: 'Golden Photo Frames', icon: '🖼️' },
    { id: 'memory-card', label: 'Secret Memory Cards', icon: '🃏' }
  ];

  const handleCardClick = (id: string) => {
    if (style === 'memory-card') {
      setFlippedId(flippedId === id ? null : id);
    }
  };

  return (
    <div className="space-y-6" id="photo-gallery-section">
      {/* Navigation and Layout presets selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 p-4 rounded-3xl border border-pink-100/60 shadow-sm">
        <div className="flex items-center gap-2">
          <ImageIcon className="text-pink-500 w-5 h-5" />
          <h3 className="font-serif text-lg font-bold text-gray-800">Our Shared Memory Album</h3>
        </div>
        
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          {stylesList.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setStyle(st.id);
                setFlippedId(null);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                style === st.id 
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-pink-50 border border-pink-100/30'
              }`}
            >
              <span>{st.icon}</span>
              <span>{st.label}</span>
            </button>
          ))}
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-20 bg-white/30 backdrop-blur-md rounded-3xl border border-pink-100/40 p-8">
          <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-pink-400 mx-auto mb-4">
            <ImageIcon size={30} />
          </div>
          <h4 className="font-serif text-lg font-bold text-gray-700">No memories pinned yet</h4>
          <p className="text-xs text-gray-400 max-w-xs mx-auto mt-2 mb-6">
            Add her favorite photos easily using the creator tools! You can choose sweet Unsplash templates or upload your own files.
          </p>
          <button
            onClick={onAddTrigger}
            className="px-5 py-2.5 bg-pink-400 hover:bg-pink-500 text-white rounded-full text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5 mx-auto"
          >
            <Plus size={14} />
            <span>Customize Guest Photos</span>
          </button>
        </div>
      ) : (
        <div className="relative">
          {style === 'memory-card' && (
            <div className="flex items-center gap-1.5 justify-center mb-4 text-[10px] font-bold text-pink-500 bg-pink-50/50 w-fit mx-auto px-3 py-1 rounded-full border border-pink-100">
              <SwitchCamera size={11} />
              <span>Tip: Tap the memory cards to flip them and read the secret diary entries!</span>
            </div>
          )}

          {/* Core Grid */}
          <div 
            id="gallery-grid"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-4 pb-8"
          >
            {photos.map((photo, index) => {
              // Soft random rotations for cute realistic paper look
              const rotationDeg = (index % 3 === 0) ? '-1.5deg' : (index % 3 === 1) ? '2deg' : '-2.5deg';
              const rotationStyle = style === 'polaroid' || style === 'scrapbook' ? { transform: `rotate(${rotationDeg})` } : {};

              return (
                <div
                  key={photo.id}
                  onClick={() => handleCardClick(photo.id)}
                  style={rotationStyle}
                  className="transition-all duration-300 relative group"
                >
                  
                  {/* CLASSIC POLAROID LAYOUT */}
                  {style === 'polaroid' && (
                    <div className="polaroid-frame bg-white relative">
                      {/* Red Tape on Top */}
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-pink-100/70 border-b border-pink-200/35 rotate-[-2deg] opacity-75 shadow-xs" style={{ content: '""' }} />
                      
                      <div className="aspect-square w-full rounded-sm overflow-hidden bg-slate-100 border border-slate-100 relative group-hover:brightness-95 transition-all">
                        <img 
                          src={photo.url} 
                          alt={photo.caption} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      {/* Date & Note markings */}
                      <div className="pt-4 px-1 text-center">
                        <h4 className="font-handwritten text-xl font-bold text-gray-700 leading-tight truncate">{photo.caption}</h4>
                        <span className="font-mono text-[9px] text-pink-400 block mt-1 tracking-wider uppercase font-semibold">
                          {photo.date}
                        </span>
                        {photo.memoryNote && (
                          <p className="text-[10px] text-gray-400 leading-relaxed font-serif mt-2 italic text-left border-t border-dashed border-pink-50 pt-2 line-clamp-3">
                            “{photo.memoryNote}”
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SCRAPBOOK MEMORIES LAYOUT */}
                  {style === 'scrapbook' && (
                    <div className="bg-white/90 p-5 rounded-2xl shadow-md border-2 border-yellow-50 relative group overflow-hidden">
                      {/* Flower sticker */}
                      <div className="absolute top-2 right-2 text-xl select-none opacity-80 animate-pulse">🌸</div>
                      <div className="absolute bottom-2 left-2 text-lg select-none opacity-80">🦋</div>
                      
                      {/* Tape effect in bottom-right/top-left */}
                      <div className="absolute -top-2 left-2 w-10 h-4 bg-orange-100/40 border-r border-orange-200/30 rotate-[35deg]" />

                      <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-orange-50 mb-3 border-2 border-dashed border-pink-100/60">
                        <img 
                          src={photo.url} 
                          alt={photo.caption} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-serif text-sm font-bold text-pink-600 truncate">{photo.caption}</h4>
                        <div className="flex items-center gap-1 text-[9px] text-gray-400 font-mono font-medium">
                          <Calendar size={10} className="text-pink-400" />
                          <span>{photo.date}</span>
                        </div>
                        {photo.memoryNote && (
                          <div className="bg-[#fffdf2] border border-orange-100/40 p-2.5 rounded-lg mt-2 text-[10px] text-amber-900/80 leading-relaxed font-handwritten text-sm">
                            {photo.memoryNote}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* GOLDEN PHOTO FRAME LAYOUT */}
                  {style === 'frame' && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-2.5 rounded-xl border-4 border-amber-300 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-103">
                      <div className="bg-white p-3 shadow-inner rounded-sm relative">
                        <div className="aspect-[3/4] w-full rounded-xs overflow-hidden bg-slate-50 border border-slate-100 mb-3">
                          <img 
                            src={photo.url} 
                            alt={photo.caption} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-center font-serif text-xs font-bold text-amber-900 space-y-0.5 truncate uppercase tracking-tight">
                          <div>{photo.caption}</div>
                          <div className="text-[8px] text-amber-600 font-mono font-medium tracking-widest">{photo.date}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* INTERACTIVE MEMORY CARD (FLIP CARD) */}
                  {style === 'memory-card' && (
                    <div 
                      className="h-[340px] w-full relative cursor-pointer group card-3d-perspective"
                      style={{ perspective: '1000px' }}
                    >
                      <div 
                        className={`w-full h-full relative transition-all duration-700 ease-out preserve-3d ${
                          flippedId === photo.id ? 'rotate-y-180' : ''
                        }`}
                        style={{ 
                          transformStyle: 'preserve-3d',
                          transform: flippedId === photo.id ? 'rotateY(180deg)' : 'none'
                        }}
                      >
                        {/* FRONT FACE */}
                        <div 
                          className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-md border-2 border-pink-50 p-4 flex flex-col justify-between overflow-hidden"
                          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                        >
                          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-pink-50 relative">
                            <img 
                              src={photo.url} 
                              alt={photo.caption} 
                              className="w-full h-full object-cover h-full" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute bottom-3 right-3 bg-pink-100/90 text-[8px] font-bold text-pink-600 px-2 py-0.5 rounded-full border border-pink-200">
                              TAP KEY 🌟
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <span className="font-mono text-[9px] uppercase font-bold text-pink-400 block tracking-wider mb-0.5">
                              {photo.date}
                            </span>
                            <h4 className="font-serif font-bold text-gray-800 text-sm truncate">{photo.caption}</h4>
                            <p className="text-[10px] text-gray-400 mt-1 truncate">
                              {photo.memoryNote || "Click to see hidden message..."}
                            </p>
                          </div>
                        </div>

                        {/* BACK FACE */}
                        <div 
                          className="absolute inset-0 w-full h-full bg-gradient-to-tr from-pink-50 to-purple-50 rounded-3xl shadow-md border-2 border-pink-200 p-6 flex flex-col justify-between overflow-hidden"
                          style={{ 
                            backfaceVisibility: 'hidden', 
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">💌</div>
                            <span className="text-[9px] tracking-wider uppercase font-mono font-bold text-pink-500 block mb-1">
                              Memory Log Diary
                            </span>
                            <h4 className="font-serif font-bold text-gray-700 text-sm border-b border-pink-100 pb-2 mb-3">
                              {photo.caption}
                            </h4>
                          </div>

                          <div className="flex-1 overflow-y-auto px-1">
                            <p className="font-serif italic text-xs text-gray-600 leading-relaxed text-center font-handwritten text-lg leading-snug">
                              “{photo.memoryNote || "No secret diary note added yet. This memory speaks for itself."}”
                            </p>
                          </div>

                          <div className="text-center pt-3 border-t border-pink-100 text-[8px] text-pink-500 font-bold uppercase tracking-widest font-mono">
                            ♥ Captured on {photo.date} ♥
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Delete Photo Button (For instant editing, visible in group hover) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to remove this photo memo?")) {
                        onRemovePhoto(photo.id);
                      }
                    }}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-400 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 cursor-pointer shadow-md z-30"
                    title="Remove Polaroid Photo"
                  >
                    <Trash2 size={11} />
                  </button>

                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
