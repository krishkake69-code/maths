import { RESULTS } from '../data';
import { motion } from 'motion/react';
import { Award, Trophy, GraduationCap, ArrowRight } from 'lucide-react';
import { ResultItem } from '../types';

interface ResultsProps {
  results?: ResultItem[];
}

export default function Results({ results }: ResultsProps) {
  const resultsToDisplay = results || RESULTS;

  return (
    <section
      id="results"
      className="py-20 md:py-28 bg-paper dark:bg-chalk-950 transition-colors duration-300 relative overflow-hidden border-t border-chalk-200/60 dark:border-chalk-800/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="max-w-2xl mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] font-bold text-chalk-950 dark:text-chalk-50 tracking-tight">
            Target 100/100 in CBSE and ISC board exams
          </h2>
          <p className="text-chalk-600 dark:text-chalk-300 mt-4 text-sm sm:text-base leading-relaxed max-w-[60ch]">
            "Abki Baar, 100/100 Paar!" Master step-by-step board answer presentation, flawless theorem derivations, and zero-error calculation techniques under Rehman Sir's proven mentorship.
          </p>
        </motion.div>
      </div>

      {/* Horizontal scroll row of topper cards */}
      <div className="pl-4 sm:pl-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-row pb-4 pr-4 sm:pr-6">
          {resultsToDisplay.map((res, index) => (
            <motion.article
              key={res.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="snap-start shrink-0 w-[300px] sm:w-[360px] bg-white dark:bg-chalk-900/80 rounded-[1.75rem] overflow-hidden border border-chalk-200/80 dark:border-chalk-800 shadow-[0_20px_50px_-30px_rgba(10,15,12,0.3)] dark:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)] flex flex-col group"
            >
              {/* Photo */}
              <div className="relative aspect-4/3 overflow-hidden bg-chalk-100 dark:bg-chalk-950">
                <img
                  src={res.image}
                  alt={`${res.name}, ${res.achievement}`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chalk-950/70 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-chalk-950/85 backdrop-blur-sm text-chalk-50 font-mono font-semibold text-[11px] px-3 py-1.5 rounded-full tnum">
                  <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{res.rank}</span>
                </span>
              </div>

              {/* Details */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-chalk-500 dark:text-chalk-400 tnum">
                    {res.exam} • Batch {res.year}
                  </p>
                  <h3 className="text-xl font-bold text-chalk-950 dark:text-chalk-50 tracking-tight mt-1.5">
                    {res.name}
                  </h3>
                  <p className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-bold tnum mt-2">
                    <Award className="w-4 h-4 shrink-0" />
                    <span>{res.score}</span>
                  </p>
                  <p className="text-chalk-500 dark:text-chalk-300 text-xs sm:text-sm italic leading-relaxed mt-3">
                    "{res.achievement}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-chalk-200/70 dark:border-chalk-800 text-[11px] text-chalk-500 dark:text-chalk-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified classroom batch</span>
                  </div>
                  <span className="font-mono font-semibold text-chalk-400">REHMAN SIR</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Motivational banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-5 p-6 sm:p-8 rounded-[2rem] chalkboard relative overflow-hidden"
        >
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-chalk-50 tracking-tight">
              Your name could be on this board next year
            </h4>
            <p className="text-xs sm:text-sm text-chalk-300 mt-2 max-w-xl leading-relaxed">
              Our 2026-27 batches near Silver Shine School, Shastri Nagar are capped at 25 students for maximum focus. Start your 3-day trial classes now!
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 shrink-0 px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-colors whitespace-nowrap"
          >
            <span>Reserve Your Demo Spot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
