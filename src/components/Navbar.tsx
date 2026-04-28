import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'gratitude', label: 'Gratitude' },
  { id: 'question', label: 'Question' },
  { id: 'journey', label: 'Journey' },
  { id: 'letter', label: 'Letter' },
];

export default function Navbar({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  // Show navbar after initial animation
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3200);
    return () => clearTimeout(timer);
  }, []);

  // Track scroll position to highlight active section
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollY = container.scrollTop;
      const height = container.scrollHeight - container.clientHeight;
      const progress = scrollY / height;

      if (progress < 0.12) setActiveIndex(0);
      else if (progress < 0.28) setActiveIndex(1);
      else if (progress < 0.44) setActiveIndex(2);
      else if (progress < 0.65) setActiveIndex(3);
      else setActiveIndex(4);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  const scrollToSection = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const totalHeight = container.scrollHeight - container.clientHeight;
    const targets = [0, 0.12, 0.28, 0.44, 0.65];
    container.scrollTo({ top: targets[index] * totalHeight, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-6"
        >
          {sections.map((section, i) => {
            const isActive = activeIndex === i;
            const isHovered = hoveredIndex === i;

            return (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(i)}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="flex items-center gap-3 group cursor-pointer"
                whileHover={{ x: -4 }}
                transition={{ duration: 0.2 }}
              >
                {/* Label */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2 }}
                      className="font-display text-xs tracking-[0.25em] uppercase text-gray-400"
                    >
                      {section.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Dot + line indicator */}
                <div className="flex items-center gap-1.5">
                  {/* Line — grows when active */}
                  <motion.div
                    animate={{
                      width: isActive ? 20 : isHovered ? 12 : 6,
                      opacity: isActive ? 1 : isHovered ? 0.6 : 0.2,
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="h-[1px] bg-gradient-to-l from-brand-gold to-brand-rose"
                  />

                  {/* Dot */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.4 : isHovered ? 1.1 : 1,
                      opacity: isActive ? 1 : isHovered ? 0.7 : 0.3,
                    }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                        isActive ? 'bg-brand-gold' : 'bg-white'
                      }`}
                    />
                    {/* Glow ring on active */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full bg-brand-gold"
                      />
                    )}
                  </motion.div>
                </div>
              </motion.button>
            );
          })}

          {/* Vertical line connecting dots */}
          <div className="absolute right-[2px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent -z-10" />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}