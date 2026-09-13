import { FEATURES } from '../data';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';

export default function WhyChooseUs() {
  return (
    <section
      id="why-us"
      className="py-20 md:py-28 bg-white dark:bg-[#07090e] transition-colors duration-300 relative overflow-hidden border-t border-slate-200/60 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
            // THE REHMAN ADVANTAGE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
            Built Specifically for High Scores
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
            How our focused classroom methodology bridges the gap from calculation panic to calm mathematical confidence.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feature, idx) => {
            const IconComponent = (LucideIcons as any)[feature.iconName] || LucideIcons.HelpCircle;

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="bg-slate-50/80 dark:bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between group relative shadow-sm hover:shadow-xl hover:border-indigo-400/50 transition-all backdrop-blur-xs"
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700">
                      Feature 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-5 mt-4 border-t border-slate-200/50 dark:border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Integrated in All Batches</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
