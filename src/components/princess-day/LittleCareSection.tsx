import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Moon, Droplets, Sun, HeartHandshake } from 'lucide-react';
import { CARE_CARDS, CARE_PERSONAL_MESSAGE } from '../../data/princessDayData';

const CARE_ICONS: Record<string, React.ReactNode> = {
  rest: <Moon size={20} className="text-[#8E3557]" />,
  hydrate: <Droplets size={20} className="text-[#8E3557]" />,
  warmth: <Sun size={20} className="text-[#8E3557]" />,
  'no-pressure': <HeartHandshake size={20} className="text-[#8E3557]" />,
};

export default function LittleCareSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="princess-care-section"
      aria-label="Gentle Care Reminders for Vanshika Ji"
      className="relative py-20 sm:py-24 px-4 sm:px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #FFF8EF 0%, #FFF0F3 100%)',
        color: '#4A1028',
      }}
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Heading & Subheading */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-14"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-[#8E3557] font-semibold">
            A Gentle Reminder <span aria-hidden="true">·</span> Comfort First
          </p>
          <h2
            className="font-serif text-3xl sm:text-4xl md:text-[42px] font-semibold text-[#4A1028] leading-tight"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Today, My Princess Has Only One Job...
          </h2>
          <p className="font-serif italic text-xl sm:text-2xl text-[#8E3557]">
            Please Take Care of Yourself.
          </p>
        </motion.div>

        {/* Four Clean Cozy Care Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-12">
          {CARE_CARDS.map((card, index) => (
            <motion.div
              key={card.id}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-2xl p-6 sm:p-7 bg-[#FFFFFF] border border-[#4A1028]/10 shadow-[0_12px_32px_rgba(74,16,40,0.06)] flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-[#FFF0F3] border border-[#F4A7B9]/40 flex items-center justify-center shrink-0">
                {CARE_ICONS[card.id]}
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl font-semibold text-[#4A1028]">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base text-[#5E283D]/85 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Personal Caring Message */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="max-w-3xl mx-auto rounded-2xl p-7 sm:p-10 bg-[#FFFFFF]/90 border border-[#D9B56D]/40 shadow-[0_14px_38px_rgba(74,16,40,0.07)] text-center space-y-4"
        >
          {CARE_PERSONAL_MESSAGE.map((line, idx) => (
            <p
              key={idx}
              className={`text-base sm:text-lg leading-relaxed ${
                idx === CARE_PERSONAL_MESSAGE.length - 1
                  ? 'font-serif italic text-[#4A1028] font-medium pt-2'
                  : 'text-[#4A1028]/90'
              }`}
            >
              {line}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
