import { RESULTS } from '../data';
import { motion } from 'motion/react';
import { Award, Trophy, MapPin, Sparkles, GraduationCap, Zap, ArrowRight } from 'lucide-react';
import { ResultItem } from '../types';

interface ResultsProps {
  results?: ResultItem[];
}

export default function Results({ results }: ResultsProps) {
  const resultsToDisplay = results || RESULTS;

  return (
    <section
      id="results"
      className="py-20 md:py-28 bg-white dark:bg-[#07090e] transition-colors duration-300 relative overflow-hidden border-t border-slate-200/60 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
            // BOARD TOPPERS & MERIT LIST
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
            Target 100/100 in CBSE & ISC Board Exams
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
            "Abki Baar, 100/100 Paar!" Master step-by-step board answer presentation, flawless theorem derivations, and zero-error calculation techniques under Rehman Sir's proven mentorship.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 mx-auto mt-4 rounded-full" />
        </div>
 
        {/* Top Highlight Topper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resultsToDisplay.map((res, index) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-slate-50/80 dark:bg-slate-900/80 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-indigo-400/50 transition-all flex flex-col group backdrop-blur-sm"
            >
              {/* Photo Box with Badge overlays */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-950">
                <img
                  src={res.image}
                  alt={res.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Visual Glassmorphic gradient band */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* Score badge top-left */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-amber-300/40">
                  <Trophy className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{res.rank}</span>
                </div>

                {/* Exam Title overlay bottom-left */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest bg-slate-950/60 px-2 py-0.5 rounded backdrop-blur-xs">
                      {res.exam} • Batch {res.year}
                    </span>
                  </div>
                  <p className="text-xl font-black tracking-tight mt-1 text-white">
                    {res.name}
                  </p>
                </div>
              </div>

              {/* Card Footer detail */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-black">
                    <Award className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                    <span>{res.score}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm italic leading-relaxed">
                    "{res.achievement}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                    <span>Verified Classroom Batch</span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-500 font-bold">REHMAN SIR</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Motivational Banner */}
        <div className="mt-16 text-center max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 mx-auto mb-3 shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5 fill-slate-950" />
          </div>
          <h4 className="text-lg font-black text-slate-900 dark:text-white">
            Your Name Could Be on This Board Next Year
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
            Our 2026-27 batches near Silver Shine School, Shastri Nagar are capped at 25 students for maximum focus. Start your 3-day trial classes now!
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            <span>Reserve Your Demo Spot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
