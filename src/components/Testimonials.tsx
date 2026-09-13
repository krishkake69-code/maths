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
      className="py-20 md:py-28 bg-white dark:bg-[#07090e] transition-colors duration-300 relative overflow-hidden border-t border-slate-200/60 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
            // UNFILTERED STUDENT REVIEWS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
            Real Stories. Real Ranks.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Read what Ghaziabad students and parents say about Rehman Sir’s graphical methods and doubt desk support.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Testimonials Main Interface */}
        <div className="max-w-4xl mx-auto relative px-4">
          
          {hasTestimonials ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-50/90 dark:bg-slate-900/90 p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-indigo-950/5 relative flex flex-col justify-between backdrop-blur-xs"
              >
                {/* Double quote visual decoration */}
                <Quote className="w-24 h-24 text-indigo-200/40 dark:text-indigo-950/60 absolute top-4 left-4 -z-0 pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  
                  {/* Star rating row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: current!.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
                      Verified Review
                    </span>
                  </div>

                  {/* Main feedback body */}
                  <p className="text-base sm:text-xl text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    "{current!.review}"
                  </p>

                  {/* Profile details bottom row */}
                  <div className="flex items-center gap-4 pt-5 border-t border-slate-200/60 dark:border-slate-800">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-600/20">
                      {current!.name[0]}
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                        {current!.name}
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${
                          current!.role === 'Student' 
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' 
                            : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          {current!.role}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {current!.course} • Rehman Mathematics Classes
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-950 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
              <Quote className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4 opacity-50" />
              <p className="text-slate-500 dark:text-slate-400 text-base">No testimonials yet.</p>
            </div>
          )}

          {/* Controls under box */}
          <div className="flex items-center justify-between sm:justify-end gap-4 mt-8">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">0{currentIndex + 1}</span>
              <span>/</span>
              <span>0{testimonialsToDisplay.length}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrev}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                aria-label="Previous review"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md shadow-indigo-600/20 cursor-pointer border border-indigo-400/30"
                aria-label="Next review"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 text-center">
          {[
            { label: 'Parent-Approved Progress', icon: HeartHandshake },
            { label: 'Calculus Made Visual', icon: Sparkles },
            { label: 'Weekly WhatsApp Reports', icon: UserCheck },
            { label: 'Instant Doubt Counter', icon: CheckCircle2 }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
              <item.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1.5" />
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
