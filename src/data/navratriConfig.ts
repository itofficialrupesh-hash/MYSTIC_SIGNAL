import photoOne from '../assets/images/regenerated_image_1780939152437.jpg';
import photoTwo from '../assets/images/regenerated_image_1780655372225.jpg';
import photoThree from '../assets/images/regenerated_image_1780664961225.png';

export interface NavratriPhotoItem {
  id: string;
  title: string;
  caption: string;
  blessing: string;
  imageUrl?: string; // Leave empty or replace with your local image import / URL
  isPlaceholder?: boolean;
}

/**
 * ============================================================================
 * 🌸 VANSHIKA JI'S PERSONAL PHOTO GALLERY CONFIGURATION 🌸
 * ============================================================================
 * How to add or replace photos later:
 * 1. Place your new photo files inside `src/assets/images/` (or `public/`).
 * 2. Import the file at the top of this file (e.g., `import myNewPhoto from '../assets/images/vanshika_navratri.jpg'`)
 *    OR upload a photo directly from the Gallery page using the "Add / Replace Photo" button!
 * 3. Update the `imageUrl` property below. Original photos are displayed with
 *    zero cropping of faces or face alterations.
 */
export const DEFAULT_NAVRATRI_PHOTOS: NavratriPhotoItem[] = [
  {
    id: 'vanshika-photo-1',
    title: 'Meri Devi Ji ✨',
    caption: 'Your smile is the brightest light in my life — sharper and more radiant than a thousand festive diyas.',
    blessing: 'Maa Durga aapki is pyari si muskaan ko hamesha salamat rakhein. 🌺',
    imageUrl: photoOne,
    isPlaceholder: false,
  },
  {
    id: 'vanshika-photo-2',
    title: 'Cute & Precious Expressions 🥺❤️',
    caption: 'Even when you are upset or pouting, you remain the most special and adored person in my world.',
    blessing: 'Har nazar se bachaye Maa Ambey aapko, meri pyari Vanshika Ji. 🧿🪔',
    imageUrl: photoTwo,
    isPlaceholder: false,
  },
  {
    id: 'vanshika-photo-3',
    title: 'Grace & Warmth 🌸',
    caption: 'Every moment captured of you holds a special place in my heart that nothing can ever replace.',
    blessing: 'Aapki zindagi hamesha khushiyon aur sukoon ke phoolon se mehekti rahe. ✨',
    imageUrl: photoThree,
    isPlaceholder: false,
  },
  {
    id: 'vanshika-photo-4',
    title: 'Special Festive Memory Slot 🪔',
    caption: 'Add another favorite photo of Vanshika Ji here anytime using the upload button or in src/data/navratriConfig.ts.',
    blessing: 'Shubh Navratri, Meri Devi Ji ❤️🙏🏻',
    imageUrl: '',
    isPlaceholder: true,
  },
];

export interface NavratriWishCard {
  id: string;
  name: string;
  badge: string;
  message: string;
  isMainHighlight?: boolean;
  accentColor: string;
}

export const NAVRATRI_WISHES: NavratriWishCard[] = [
  {
    id: 'wish-vanshika',
    name: 'Vanshika Ji ❤️',
    badge: 'Meri Devi Ji • Main Blessing',
    message:
      'Happy Navratri, Meri Devi Ji. Maa Durga aapko hamesha khush rakhein, aapki har achhi wish poori ho aur aapki life pyaar aur sukoon se bhari rahe.',
    isMainHighlight: true,
    accentColor: 'from-amber-400 via-rose-400 to-amber-300',
  },
  {
    id: 'wish-taruu',
    name: 'Taruu 🌸',
    badge: 'Festive Blessings & Joy',
    message:
      'Happy Navratri! Maa Durga aapki life mein dher saari khushiyan, success aur positivity lekar aayein.',
    isMainHighlight: false,
    accentColor: 'from-pink-300 via-amber-200 to-rose-300',
  },
  {
    id: 'wish-tanishq',
    name: 'Tanishq ✨',
    badge: 'Peace, Health & Prosperity',
    message:
      'Happy Navratri! Aapko aur aapke parivaar ko sukh, shanti, achhi health aur dher saari khushiyan milein.',
    isMainHighlight: false,
    accentColor: 'from-amber-200 via-yellow-300 to-orange-300',
  },
];

/**
 * Optional licensed devotional audio URL.
 * To use your own MP3/audio file:
 * 1. Place your audio file in `public/navratri-music.mp3`
 * 2. Set `CUSTOM_DEVOTIONAL_AUDIO_URL = '/navratri-music.mp3'`
 * When empty, our built-in Web Audio API Sitar/Tanpura/Flute Serene Devotional Synthesizer
 * plays gentle, peaceful devotional chimes upon clicking the Music button!
 */
export const CUSTOM_DEVOTIONAL_AUDIO_URL = '';

/**
 * ============================================================================
 * 🎥 BACKGROUND VIDEO CONFIGURATION FOR NAVRATRI SANCTUARY 🎥
 * ============================================================================
 * You can change the background video of `section#navratri-apology-sanctuary` by:
 * 1. Clicking the "🎥 Change BG Video" button directly in the top bar of the section
 *    to upload a local MP4/WebM video file or paste any video URL.
 * 2. Or placing your video in `public/navratri-bg.mp4` and updating
 *    `DEFAULT_NAVRATRI_BG_VIDEO_URL` below!
 */
export const DEFAULT_NAVRATRI_BG_VIDEO_URL =
  'https://assets.mixkit.co/videos/preview/mixkit-golden-particles-floating-on-a-dark-background-41761-large.mp4';

