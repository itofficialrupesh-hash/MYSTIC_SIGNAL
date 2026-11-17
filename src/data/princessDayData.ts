export interface LoveLetterItem {
  id: number;
  title: string;
  subtitle: string;
  envelopeStyle: 'burgundy-gold' | 'dusty-rose' | 'cream-vellum' | 'blush-petal' | 'royal-plum';
  sealMotif: 'heart' | 'rose' | 'star' | 'crown' | 'infinity';
  body: string[];
}

export const PRINCESS_DAY_META = {
  herName: 'Vanshika',
  addressName: 'Vanshika Ji',
  nickname: 'Mystic Signal',
  occasion: 'National Princess Day',
  dateLabel: '18 November 2026',
  personalLine: 'Happy Princess Day, My Girl ❤️',
};

export const LOVE_LETTERS: LoveLetterItem[] = [
  {
    id: 1,
    title: 'A Little Note For You',
    subtitle: 'First Envelope · Velvet Burgundy & Gold',
    envelopeStyle: 'burgundy-gold',
    sealMotif: 'heart',
    body: [
      'Dear Vanshika Ji,',
      'Happy Princess Day to the person who makes ordinary moments feel a little more special.',
      "I don't know how to explain it, but having you in my life is something I genuinely appreciate.",
      'You are my favourite notification, my favourite conversation and my very special Mystic Signal.',
      "Today is your day, Princess. ❤️",
    ],
  },
  {
    id: 2,
    title: "Why You're Special",
    subtitle: 'Second Envelope · Dusty Rose Silk',
    envelopeStyle: 'dusty-rose',
    sealMotif: 'rose',
    body: [
      'Do you know something?',
      "You don't need a crown to be special.",
      'Your little habits, your random conversations, your cute reactions and even your silly moods make you uniquely you.',
      'I hope you always remember how valuable and special you are.',
      'Never stop being yourself, Vanshika Ji.',
    ],
  },
  {
    id: 3,
    title: 'Things I Never Say',
    subtitle: 'Third Envelope · Warm Cotton Parchment',
    envelopeStyle: 'cream-vellum',
    sealMotif: 'star',
    body: [
      'Some things are difficult to say directly.',
      'Sometimes I might not express things properly, sometimes I might make mistakes, but I genuinely value our bond.',
      'Thank you for all those little moments, conversations and memories.',
      'You are someone I never want to take for granted.',
    ],
  },
  {
    id: 4,
    title: 'A Thousand Little Smiles',
    subtitle: 'Fourth Envelope · Soft Blush Linen',
    envelopeStyle: 'blush-petal',
    sealMotif: 'crown',
    body: [
      "Today's little reminder:",
      'You deserve kindness.',
      'You deserve happiness.',
      'You deserve peaceful days.',
      'You deserve to feel appreciated.',
      'And you deserve all the little things that make you smile.',
      'Please take good care of yourself, Princess.',
    ],
  },
  {
    id: 5,
    title: 'Just For My Mystic Signal',
    subtitle: 'Fifth Envelope · Royal Champagne Keepsake',
    envelopeStyle: 'royal-plum',
    sealMotif: 'infinity',
    body: [
      'To My Mystic Signal,',
      'No matter how busy life becomes, I hope you never forget that you are a very special person.',
      'Keep smiling, keep growing and keep being the wonderful person you are.',
      'Happy Princess Day, Vanshika Ji.',
      'Happy Princess Day, My Girl. ❤️',
      'With lots of love,\nYour Mystic Signal ❤️',
    ],
  },
];

export const ROSE_REASONS = [
  {
    id: 1,
    tone: 'crimson' as const,
    title: 'Your Smile',
    note: 'The quiet warmth that brightens even the heaviest day.',
  },
  {
    id: 2,
    tone: 'blush' as const,
    title: 'Your Random Conversations',
    note: 'Every little message from you feels like my favourite part of the day.',
  },
  {
    id: 3,
    tone: 'crimson' as const,
    title: 'Your Cute Reactions',
    note: 'Even your tiniest expressions and silly moods are endlessly adorable.',
  },
  {
    id: 4,
    tone: 'blush' as const,
    title: 'Your Kind Heart',
    note: 'The way you care deeply and bring softness to everyone close to you.',
  },
  {
    id: 5,
    tone: 'crimson' as const,
    title: 'Our Unspoken Bond',
    note: 'Best friend and my favourite person — all wrapped into one soul.',
  },
  {
    id: 6,
    tone: 'blush' as const,
    title: 'Being My Mystic Signal',
    note: 'Simply being Vanshika Ji — irreplaceable, thoughtful, and deeply valued.',
  },
];

export const SORRY_LETTER_PARAGRAPHS = [
  'Vanshika Ji,',
  "I know you're upset with me, and I understand that I may have hurt you.",
  'I am genuinely sorry for the things I said or did that made you feel bad.',
  "I don't want to make excuses or pretend that everything is okay just because today is Princess Day.",
  'Your feelings matter, and I should respect them.',
  "I never want you to feel that your emotions don't matter to me.",
  'I know a sorry cannot magically fix everything, but I want you to know that I mean it.',
  "Take your time. You don't have to reply immediately or forgive me just because I made this little website.",
  'I just wanted to make something special for you and remind you that I genuinely value you.',
  "I'm sorry, Vanshika Ji. ❤️",
];

export const CARE_CARDS = [
  {
    id: 'rest',
    title: 'A Little Rest',
    description: 'Give yourself permission to relax and take things slowly.',
  },
  {
    id: 'hydrate',
    title: 'Stay Hydrated',
    description: 'Keep your favourite water bottle nearby.',
  },
  {
    id: 'warmth',
    title: 'A Little Warmth',
    description: 'Stay comfortable and take care of yourself.',
  },
  {
    id: 'no-pressure',
    title: 'No Pressure',
    description: "You don't have to reply to everyone or do everything today.",
  },
];

export const CARE_PERSONAL_MESSAGE = [
  "I wish I could make your difficult day a little easier. For now, here's a little reminder that your health and comfort come first.",
  "Please rest, take care and follow the advice of someone who can help you when you're feeling unwell.",
  'Your Mystic Signal is wishing you a peaceful and comfortable day. ❤️',
];
