import { useState } from 'react';
import { TESTIMONIALS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowLeft, ArrowRight, Quote, HeartHandshake, UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonialsToDisplay = testimonials || TESTIMONIALS;
  const hasTestimonials = testimonialsToDisplay.length > 0;
  const safeIndex = hasTestimonials && currentIndex >= testimonialsToDisplay.length ? 0 : currentIndex;

  const handlePrev = () => {
    if (!hasTestimonials) return;
    setCurrentIndex((prev) => {
      const idx = prev >= testimonialsToDisplay.length ? 0 : prev;
      return idx === 0 ? testimonialsToDisplay.length - 1 : idx - 1;
    });
  };

  const handleNext = () => {
    if (!hasTestimonials) return;
    setCurrentIndex((prev) => {
      const idx = prev >= testimonialsToDisplay.length ? 0 : prev;
      return idx === testimonialsToDisplay.length - 1 ? 0 : idx + 1;
    });
  };

  const current = hasTestimonials ? testimonialsToDisplay[safeIndex] : null;

  return (
    <section
      id="testimonials"
      className="py-20 md:py-28 bg-paper dark:bg-chalk-950 transition-colors duration-300 relative overflow-hidden border-t border-chalk-200/60 dark:border-chalk-800/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="max-w-2xl mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] font-bold text-chalk-950 dark:text-chalk-50 tracking-tight">
            Real stories. Real ranks.
          </h2>
          <p className="text-chalk-600 dark:text-chalk-300 mt-4 text-sm sm:text-base leading-relaxed max-w-[60ch]">
            Read what Ghaziabad students and parents say about Rehman Sir’s graphical methods and doubt desk support.
          </p>
        </motion.div>

        {/* Single rotating quote */}
        <div className="max-w-4xl">

          {hasTestimonials ? (
            <div className="relative">
              <Quote className="w-14 h-14 text-chalk-200 dark:text-chalk-800 absolute -top-2 -left-2 sm:-left-6 pointer-events-none" aria-hidden="true" />
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={safeIndex}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="relative pl-8 sm:pl-10 border-l-2 border-emerald-500/70"
                >
                  <div className="flex items-center gap-1 text-emerald-500" aria-label={`Rated ${current!.rating} out of 5`}>
                    {Array.from({ length: current!.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-lg sm:text-2xl text-chalk-900 dark:text-chalk-100 leading-snug font-display font-medium tracking-tight mt-4">
                    "{current!.review}"
                  </p>

                  <footer className="flex items-center gap-4 pt-6 mt-6">
                    <div className="w-12 h-12 rounded-xl bg-chalk-950 dark:bg-chalk-100 text-chalk-50 dark:text-chalk-950 flex items-center justify-center font-display font-bold text-lg">
                      {current!.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-chalk-950 dark:text-chalk-50 flex items-center gap-2">
                        {current!.name}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold tracking-wider ${
                          current!.role === 'Student'
                            ? 'bg-chalk-100 dark:bg-chalk-900 text-chalk-600 dark:text-chalk-300'
                            : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                        }`}>
                          {current!.role}
                        </span>
                      </p>
                      <p className="text-xs text-chalk-500 dark:text-chalk-400 mt-0.5">
                        {current!.course}
                      </p>
                    </div>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>
          ) : (
            <div className="p-12 rounded-[1.75rem] border border-chalk-200 dark:border-chalk-800 text-center">
              <Quote className="w-14 h-14 text-chalk-300 dark:text-chalk-700 mx-auto mb-4 opacity-50" />
              <p className="text-chalk-500 dark:text-chalk-400 text-base">No testimonials yet.</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between sm:justify-start sm:gap-6 gap-4 mt-10">
            <p className="text-xs font-mono text-chalk-400 tnum" aria-live="polite">
              <span className="text-chalk-950 dark:text-chalk-100 font-semibold">{String(safeIndex + 1).padStart(2, '0')}</span>
              {' / '}
              {String(testimonialsToDisplay.length).padStart(2, '0')}
            </p>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full border border-chalk-300 dark:border-chalk-700 text-chalk-700 dark:text-chalk-100 hover:border-chalk-500 dark:hover:border-chalk-500 hover:bg-chalk-50 dark:hover:bg-chalk-900 transition-colors cursor-pointer"
                aria-label="Previous review"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-chalk-950 dark:bg-chalk-100 text-white dark:text-chalk-950 hover:bg-chalk-800 dark:hover:bg-white transition-colors cursor-pointer"
                aria-label="Next review"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Trust strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 mt-16 pt-8 border-t border-chalk-200/80 dark:border-chalk-800">
          {[
            { label: 'Parent-Approved Progress', icon: HeartHandshake },
            { label: 'Calculus Made Visual', icon: Sparkles },
            { label: 'Weekly WhatsApp Reports', icon: UserCheck },
            { label: 'Instant Doubt Counter', icon: CheckCircle2 }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <item.icon className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={1.75} />
              <span className="text-xs sm:text-sm font-semibold text-chalk-700 dark:text-chalk-200">{item.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
