import { MemoryPhoto, StoryChapter, FavoriteMemory, OpenWhenLetter, LoveConfig } from './types';
import profileLogo from './assets/images/regenerated_image_1780664961225.png';

export const DEFAULT_CONFIG: LoveConfig = {
  coupleNameOne: "Rupesh",
  coupleNameTwo: "Mystic Signal",
  specialDate: "1125", // Default simple passcode
  specialDateHint: "WHENEVER YOU FEEL LOW MY GIRL YOU WENT TO PAPA AND MUMMA AND FRIENDS AND MAYBE RUU.... COMBINATION OF DATES.",
  bgMusicUrl: "https://www.youtube.com/watch?v=LlwHphMhUOo", // Fail-safe sweet romantic instrumental loop
  promises: [
    "I promise to always listen to you, even when we don't agree, and to build a space where you feel safe and loved.",
    "I promise to hold your hand through every high and low of life, being your biggest cheerleader and strongest supporter.",
    "I promise to keep choosing you, every single day, and to never take your beautiful soul for granted.",
    "I promise to surprise you with small gestures of love, and to always remind you of how incredibly special you are to me.",
    "I promise to fight for us, to respect your dreams, and to walk beside you as we create our future together."
  ],
  reasonsWhySpecial: [
    "Your beautiful smile that instantly brightens up even my darkest days. ☀️",
    "The way your eyes wrinkle up in pure joy when you find something genuinely funny. ✨",
    "Your endless kindness and the warm, golden heart you show to everyone around you. 💛",
    "The comforting warmth of your presence—how you make feel completely safe and at home. 🏡",
    "Your brilliant mind, your passionate spirit, and the sweet way you care for the tinies details. 🌸",
    "How you make me want to be the absolute best version of myself just to make you proud. 💕"
  ],
  profileLogoUrl: profileLogo
};

export const DEFAULT_PHOTOS: MemoryPhoto[] = [
  {
    id: "photo-1",
    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop",
    date: "November 22, 2023",
    caption: "The Day Everything Changed",
    memoryNote: "Where it all began. The air was crisp, but my heart was completely warm. I still look back at this moment and smile."
  },
  {
    id: "photo-2",
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop",
    date: "December 25, 2023",
    caption: "Midnight Talks & Winter Stars",
    memoryNote: "Remember when we stayed up talking for five hours straight under the twinkling lights? We talked about everything and nothing."
  },
  {
    id: "photo-3",
    url: "https://images.unsplash.com/photo-1543269608-fa3950436a11?q=80&w=600&auto=format&fit=crop",
    date: "February 14, 2024",
    caption: "Our Warm Coffee Escape",
    memoryNote: "Laughter, sweet coffee aroma, and you sitting right across from me. There's no other place I'd rather be."
  },
  {
    id: "photo-4",
    url: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?q=80&w=600&auto=format&fit=crop",
    date: "Spring 2024",
    caption: "A Spark in the Night",
    memoryNote: "Making small wishes on falling stars and realizing my biggest wish was already holding my hand."
  }
];

export const DEFAULT_STORY: StoryChapter[] = [
  {
    id: "story-1",
    title: "The Magical Beginning 🌟",
    date: "November 2023",
    content: "When our paths first crossed, it felt like a quiet alignment of the universe. It wasn't loud or dramatic, but it was perfect. From the first 'hi', something inside clicked, and I knew deep down that you were going to be someone incredibly important in my life.",
    iconName: "Sparkles"
  },
  {
    id: "story-2",
    title: "Becoming Safe Havens 🍂",
    date: "Winter 2023",
    content: "We spent countless nights sharing our stories, our childhood memories, our fears, and our dreams. In each other, we found a safe harbor. Your comforting words became my favorite medicine, and your voice became my favorite song.",
    iconName: "HeartHandshake"
  },
  {
    id: "story-3",
    title: "Under the Warm Sun ☀️",
    date: "Spring 2024",
    content: "As the days grew brighter, so did our bond. Every conversation was filled with effortless laughter. Realizing that I had found not just a partner, but my absolute best friend and partner-in-crime. Knowing we can conquer any challenge together.",
    iconName: "Sun"
  },
  {
    id: "story-4",
    title: "With You, Forever & Always ♾️",
    date: "Today & Beyond",
    content: "And here we are today. Every moment spent with you is a treasure I hold close to my chest. I've watched you grow, and I fall in love with you a little more each day. Thank you for filling my life with color, light, and the sweetest warmth.",
    iconName: "Infinity"
  }
];

export const DEFAULT_MEMORIES: FavoriteMemory[] = [
  {
    id: "mem-1",
    title: "Our Long Midnight Walks",
    description: "Wandering down empty streets under street lamps, hand in hand, chatting about absolute nonsense but feeling so happy.",
    date: "Winter 2023",
    emoji: "🌙"
  },
  {
    id: "mem-2",
    title: "The Infinite Inside Jokes",
    description: "Those silly little code words that instantly trigger a laughing fit in the middle of public transport while everyone else wonders why.",
    date: "Ongoing",
    emoji: "🤪"
  },
  {
    id: "mem-3",
    title: "Our Cozy Rainy-Day Movie Marathons",
    description: "Curled up under warm blankets while heavy rain pattered on the windows, sharing snack packs and sweet whispers.",
    date: "Spring 2024",
    emoji: "🍿"
  },
  {
    id: "mem-4",
    title: "The Quiet Moments of Quiet Support",
    description: "When things were tough and we just sat in gentle silence, knowing that simply being near each other is all the comfort we need.",
    date: "Always",
    emoji: "🫂"
  }
];

export const DEFAULT_LETTERS: OpenWhenLetter[] = [
  {
    id: "letter-sad",
    type: "sad",
    title: "Open When You're Sad 🫂",
    emoji: "🫂",
    shortTeaser: "Click to open for a warm virtual hug, soothing words, and a gentle breathing exercise to calm your beautiful mind.",
    letterText: "My beautiful soul, I wish I could be there to wrap my arms around you and carry some of your weight. Please hold on tight. Take a slow deep breath, hold it, and let it out. You are incredibly strong, but it is okay to feel tired and cry. I am here for you in spirit, and my love surrounds you like a warm blanket. Remember that your sadness is a passing cloud, and the sun will shine in your beautiful eyes again very soon. I believe in you, I love you, and I am always just a heartbeat away. Let's do a quick breathing circle together on this screen. ❤️"
  },
  {
    id: "letter-angry",
    type: "angry",
    title: "Open When You're Angry 🌷",
    emoji: "🌷",
    shortTeaser: "A sweet workspace of cute apologies, a silly interactive anger-disarming meter, and soft thoughts to bring back your smile.",
    letterText: "My lovely girl, I am so sorry if I did something silly or if the world has been unkind to you today! I never want to be the source of your stress or sadness. I love your passionate spirit, but let's take a deep breath. I made a tiny 'Apology & Love Meter' below—please slide it to cool down! Here is a virtual bouquet of fresh tulips. I promise to listen, understand, and hold you close. Please don't stay angry too long, your beautiful smile is too precious to be hidden away of frustration! Let's talk and fix it. Love you always! ❤️"
  },
  {
    id: "letter-miss",
    type: "miss",
    title: "Open When You Miss Me 💕",
    emoji: "💕",
    shortTeaser: "Open for a virtual hug simulator, a live customizable love counter, and cute ways we can feel closer together.",
    letterText: "Hello my sweetheart, I miss you more than words can say. Distance is just a number, and space cannot diminish how deeply our souls are connected. To feel closer, press the 'Virtual Hug' button on this card—I will receive it in my heart. Think of my hand rubbing your back and my chin resting on your head. When you close your eyes, that breeze you feel is me sending you a soft kiss. I'll see you very soon, and until then, I keep you tucked safely in my warmest thoughts. You are my home, and I'm counting down the seconds! ❤️"
  },
  {
    id: "letter-apology",
    type: "apology",
    title: "My Apology Letter 💌",
    emoji: "💌",
    shortTeaser: "A sincere, heartwarming message where I lay down all defense and promise to cherish, care, and adapt.",
    letterText: "To the person who means the world to me: Sometimes I fall short, say things imperfectly, or fail to show you the appreciation you deserve. I want to say a sincere and humble 'I'm sorry.' You deserve the absolute finest treatment, gentleness, and warmth. I am constantly learning how to love you better and be the supportive, loving partner you need. I promise to work on my weaknesses, to hold our love as my highest anchor, and to always cherish you with a soft and open heart. Thank you for your incredible patience and grace with me. I love you beyond words. ❤️"
  },
  {
    id: "letter-promises",
    type: "promises",
    title: "Future Promises ✨",
    emoji: "✨",
    shortTeaser: "A list of warm promises that I make to you for our beautiful journey ahead.",
    letterText: "Here are my sacred promises to you, today and forever. I promise to stand by your side. Check the list of promises anytime you doubt what we have—they are written in stone in my heart. ✨"
  },
  {
    id: "letter-surprise",
    type: "surprise",
    title: "Secret Surprise Coupon 🎁",
    emoji: "🎁",
    shortTeaser: "Unlock redeemable digital coupons for romantic dates, lazy cuddle sessions, or favorite snacks!",
    letterText: "Surprise! Since you unlocked this section, you have received a handful of magical love coupons that you can redeem anytime! (Screenshot to redeem!) 🎁"
  }
];
