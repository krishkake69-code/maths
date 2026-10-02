import { FEATURES } from '../data';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';

export default function WhyChooseUs() {
  const columns = [FEATURES.slice(0, 3), FEATURES.slice(3, 6)];

  return (
    <section
      id="why-us"
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
            Built specifically for high scores
          </h2>
          <p className="text-chalk-600 dark:text-chalk-300 mt-4 text-sm sm:text-base leading-relaxed max-w-[60ch]">
            How our focused classroom methodology bridges the gap from calculation panic to calm mathematical confidence.
          </p>
        </motion.div>

        {/* Two hairline columns of three */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12">
          {columns.map((column, colIdx) => (
            <div key={colIdx} className="divide-y divide-chalk-200/80 dark:divide-chalk-800 border-t border-chalk-200/80 dark:border-chalk-800">
              {column.map((feature, idx) => {
                const IconComponent = (LucideIcons as any)[feature.iconName] || LucideIcons.CircleHelp;
                const globalIdx = colIdx * 3 + idx;

                return (
                  <motion.div
                    key={globalIdx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: globalIdx * 0.05, ease: [0.32, 0.72, 0, 1] }}
                    className="py-7 flex items-start gap-5 group"
                  >
                    <div className="p-2.5 rounded-xl bg-chalk-100 dark:bg-chalk-900 text-emerald-700 dark:text-emerald-400 shrink-0 transition-colors duration-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40">
                      <IconComponent className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-chalk-950 dark:text-chalk-50 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-chalk-500 dark:text-chalk-400 leading-relaxed mt-2 max-w-[55ch]">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
