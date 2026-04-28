import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import React, { useRef, useState, useEffect } from 'react';
import Navbar from './Navbar';

// Reusable animated section component
const fadeSectionVariants = {
  hidden: { opacity: 0, y: 50, filter: "blur(15px)", scale: 0.95 },
  visible: { 
    opacity: 1, y: 0, filter: "blur(0px)", scale: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.4 }
  }
};

const fadeItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

const FadeSection = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={fadeSectionVariants}
      className={`min-h-[70vh] w-full flex items-center justify-center py-20 px-6 ${className}`}
    >
      {children}
    </motion.section>
  );
};

// Magical Particles Component
const Particles = () => {
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, size: number, duration: number, delay: number, xWobble: number }[]>([]);

  useEffect(() => {
    const particleCount = 40;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      xWobble: Math.random() * 10 - 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-brand-gold/50 mix-blend-screen"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}vw`,
            top: `${p.y}vh`,
          }}
          animate={{
            y: [`0vh`, `-100vh`],
            x: [`0vw`, `${p.xWobble}vw`, `0vw`],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function Story({ setRole }: { setRole?: (role: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  const bgY1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  // Final section state
  const [finalState, setFinalState] = useState<0 | 1 | 2>(0);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: inputValue.trim().substring(0, 1000) })
      });
      if (!res.ok) throw new Error('API request failed');

      setSubmitSuccess(true);
      setInputValue("");
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (e) {
      console.error("Failed to submit:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    await fetch('/api/logout', { method: 'POST' });
    if (setRole) setRole(null);
  };

  const words = ["ARE", "YOU", "SURE", "YOU", "WANT", "TO", "CONTINUE?"];

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full overflow-y-auto scroll-smooth relative"
    >
      <button 
        onClick={handleLogout}
        className="fixed bottom-6 right-6 z-50 text-[10px] tracking-widest uppercase text-white/20 hover:text-white/60 transition-colors"
      >
        Logout
      </button>

      <Navbar containerRef={containerRef} />

      {/* Background ambient glow & Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <motion.div 
          style={{ y: bgY1 }}
          className="absolute w-[80vw] h-[80vh] bg-brand-gold/5 rounded-full blur-[140px] mix-blend-screen animate-pulse" 
        />
        <motion.div 
          style={{ y: bgY2, animationDelay: '2s' }}
          className="absolute w-[60vw] h-[60vh] bg-brand-rose/5 rounded-full blur-[120px] mix-blend-screen animate-pulse" 
        />
        <Particles />
      </div>

      <div className="relative z-10 w-full">
        {/* SECTION 1: Hero */}
        <section className="min-h-screen w-full flex flex-col items-center justify-center relative py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="text-center"
          >
            <h1 className="font-display font-light text-sm md:text-xl tracking-[0.3em] uppercase text-gray-400 mb-6">
              Thanks for our friendship
            </h1>
            <div className="flex justify-center items-center">
              {"ZAHRA".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50, rotateX: -90, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: 1 + i * 0.15,
                    type: "spring",
                    damping: 12,
                    stiffness: 100
                  }}
                  className="font-display font-bold text-6xl md:text-8xl mx-1 tracking-tight text-white glow-text inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            className="absolute bottom-12 flex flex-col items-center text-gray-500 animate-bounce"
          >
            <span className="text-xs tracking-widest uppercase mb-2">Scroll</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-gray-500 to-transparent" />
          </motion.div>
        </section>

        {/* SECTION 2: Thank you */}
        <FadeSection className="bg-black/50 backdrop-blur-sm">
          <div className="max-w-3xl text-center space-y-8">
            <motion.p variants={fadeItemVariants} className="font-sans text-xl md:text-3xl font-light leading-relaxed text-gray-300">
              Thank you for being my friend.
            </motion.p>
            <motion.p variants={fadeItemVariants} className="font-sans text-xl md:text-3xl font-light leading-relaxed text-gray-300">
              Thank you for accepting me when I was still new,<br/>
              when I didn't really know how to fit in yet.
            </motion.p>
            <motion.p variants={fadeItemVariants} className="font-sans text-xl md:text-3xl font-light leading-relaxed text-gray-100 glow-text italic mt-12">
              It honestly meant more than you probably realized.
            </motion.p>
          </div>
        </FadeSection>

        {/* SECTION 3: Question */}
        <FadeSection>
          <div className="max-w-2xl w-full flex flex-col items-center text-center">
            <motion.h3 variants={fadeItemVariants} className="font-display text-3xl md:text-5xl font-light mb-12 tracking-wide text-gray-200">
              What kind of person do you think I am?
            </motion.h3>
            <motion.div variants={fadeItemVariants} className="w-full relative max-w-md glow-box p-[1px] rounded-2xl bg-gradient-to-r from-brand-rose/30 to-brand-gold/30 transition-all duration-300 focus-within:from-brand-rose focus-within:to-brand-gold">
              <div className="bg-[#0c0a09] rounded-2xl p-2 flex overflow-hidden">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Type your thoughts..."
                  disabled={isSubmitting}
                  className="bg-transparent text-white font-sans w-full px-4 py-3 outline-none placeholder:text-gray-600 disabled:opacity-50"
                />
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !inputValue.trim()}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl text-sm font-medium tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'SENDING' : 'SEND'}
                </button>
              </div>
            </motion.div>
            
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-brand-gold mt-4 font-sans text-sm tracking-widest uppercase glow-text"
                >
                  Thank you for sharing
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeSection>

        {/* SCROLL WORDS SECTIONS */}
        {words.map((word, index) => (
          <section key={index} className="min-h-[50vh] w-full flex items-center justify-center py-20">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.6, y: 50, filter: "blur(20px)", letterSpacing: "-0.1em" }}
              whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)", letterSpacing: "0.05em" }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className={`font-display font-bold text-7xl md:text-[12vw] ${index === words.length - 1 ? "text-brand-gold glow-text mx-4 text-center md:text-[8vw] leading-tight" : "text-gray-100"}`}
            >
              {word}
            </motion.h2>
          </section>
        ))}

        {/* FINAL SECTION */}
        <section className="min-h-screen w-full flex items-center justify-center relative py-20 p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-4xl w-full min-h-[400px] flex flex-col items-center justify-center relative p-12 border border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-md glow-box"
          >
            <AnimatePresence mode="wait">
              {finalState === 0 && (
                <motion.div
                  key="state-0"
                  initial={{ opacity: 0, filter: "blur(20px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="text-center flex flex-col items-center"
                >
                  <p className="font-sans text-xl md:text-2xl text-gray-300 mb-12 max-w-lg leading-relaxed font-light">
                    This might make you uncomfortable. Are you sure you want to see it?
                  </p>
                  <div className="flex gap-6">
                    <button 
                      onClick={() => setFinalState(1)}
                      className="px-8 py-3 rounded-full bg-white text-black font-semibold text-sm tracking-widest hover:scale-105 transition-transform"
                    >
                      YES
                    </button>
                    <button 
                      onClick={() => {
                        containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-8 py-3 rounded-full border border-gray-600 text-gray-400 font-semibold text-sm tracking-widest hover:border-white hover:text-white transition-colors"
                    >
                      NO
                    </button>
                  </div>
                </motion.div>
              )}

              {finalState === 1 && (
                <motion.div
                  key="state-1"
                  initial={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="text-center flex flex-col items-center"
                >
                  <p className="font-display text-4xl md:text-5xl text-brand-rose glow-text mb-12 font-light tracking-wide">
                    Are you really sure?
                  </p>
                  <div className="flex gap-6">
                    <button 
                      onClick={() => setFinalState(2)}
                      className="px-8 py-3 rounded-full bg-brand-rose text-white shadow-[0_0_30px_rgba(253,164,175,0.5)] font-semibold text-sm tracking-widest hover:scale-105 transition-all"
                    >
                      YES
                    </button>
                    <button 
                      onClick={() => setFinalState(0)}
                      className="px-8 py-3 rounded-full border border-gray-600 text-gray-400 font-semibold text-sm tracking-widest hover:border-white hover:text-white transition-colors"
                    >
                      NO
                    </button>
                  </div>
                </motion.div>
              )}

              {finalState === 2 && (
                <motion.div
                  key="state-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="text-center max-w-3xl space-y-12 relative z-10 py-12 px-6"
                >
                  <div className="space-y-12 pb-16">
                    {[
                      "I’ve been thinking about writing this for a long time, and honestly, I kept holding back. It crossed my mind more times than I can count, but I always found a reason to delay it. Maybe I wasn’t ready, or maybe I was just afraid it would make things feel different between us. But keeping it to myself doesn’t really make it go away either.",
                      "So… I’ll start with something simple. Thank you. I really mean that, not just as something people say. Thank you for everything we’ve been through—whether it seemed small or something you might not even remember anymore. For me, those moments stayed. In their own quiet way, they meant more than they probably looked.",
                      "And I’m sorry. If there were times I said something wrong, or acted in a way that made you uncomfortable without realizing it. Sometimes I only understand things after they’ve already passed, and if I could go back, there are definitely things I would do better.",
                      "There’s also something I’ve been keeping to myself for a long time. Not because it didn’t matter, but because I thought about it too much. I felt something, but at the same time, I wasn’t sure if it was something I should ever say out loud. So I stayed quiet, and let everything just continue as it was.",
                      "But lately, I’ve realized that not everything should stay unspoken. Not because I expect anything from you, but because I don’t want to leave things unfinished—like something important was left hanging.",
                      "I’m sorry if this sounds selfish. I know it might be. And I know this probably isn’t the right timing either. But I didn’t want to walk away from all of this without at least being honest once.",
                      "I’m not asking for anything. You don’t have to respond, you don’t have to explain anything, and you don’t have to feel pressured in any way. This isn’t me expecting something back—this is just me finally saying what I couldn’t say before.",
                      "That’s all I wanted to say.",
                      "Thank you, truly. And I’m sorry, for anything that wasn’t right.",
                      "I just hope… this doesn’t ruin what we have."
                    ].map((text, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 40, filter: "blur(15px)", scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                        className="font-sans text-lg md:text-xl text-gray-200 leading-relaxed font-light glow-text"
                      >
                        {text}
                      </motion.p>
                    ))}
                  </div>

                  <motion.div
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: 2, duration: 2 }}
                     className="pt-12"
                  >
                    <button 
                      onClick={() => {
                          setFinalState(0);
                          containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-gray-500 hover:text-white transition-colors text-sm tracking-widest uppercase border-b border-transparent hover:border-white pb-1"
                    >
                      Start Over
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
    </div>
  );
}