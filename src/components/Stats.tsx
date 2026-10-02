import { Award, Users, BookOpen, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { StatsData } from '../types';

interface StatsProps {
  stats?: StatsData;
}

export default function Stats({ stats }: StatsProps) {
  const statsList = [
    {
      label: stats?.studentsCountLabel || 'Students Mentored',
      value: stats?.studentsCount || '2,500+',
      description: stats?.studentsCountDesc || 'JEE aspirants & CBSE board students guided to top percentiles in Ghaziabad.',
      icon: Users
    },
    {
      label: stats?.successRateLabel || 'Board Distinction Rate',
      value: stats?.successRate || '96%',
      description: stats?.successRateDesc || 'Students achieving 90%+ in Class 10 & 12 CBSE Board examinations.',
      icon: Star
    },
    {
      label: stats?.experienceLabel || 'Years of Teaching',
      value: stats?.experience || '15+ Yrs',
      description: stats?.experienceDesc || 'Pure mathematics specialization focusing on derivation intuition.',
      icon: BookOpen
    },
    {
      label: stats?.selectionsLabel || 'IIT & NIT Selections',
      value: stats?.selectionsCount || '350+',
      description: stats?.selectionsDesc || 'Proud alumni studying in premier engineering institutions across India.',
      icon: Award
    }
  ];

  return (
    <section
      className="relative py-20 md:py-28 bg-paper-deep dark:bg-chalk-950 math-grid overflow-hidden transition-colors duration-300 border-y border-chalk-200/60 dark:border-chalk-800/70"
      id="stats"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="max-w-2xl mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] font-bold text-chalk-950 dark:text-chalk-50 tracking-tight">
            Proven results in every board and exam
          </h2>
          <p className="text-chalk-600 dark:text-chalk-300 mt-4 text-sm sm:text-base leading-relaxed max-w-[60ch]">
            Our numbers reflect rigorous practice, step-marking discipline, and weekly diagnostic tracking right here in Shastri Nagar.
          </p>
        </motion.div>

        {/* Editorial numbers: no cards, hairline dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 sm:gap-y-10 sm:gap-x-10">
          {statsList.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: idx * 0.07, ease: [0.32, 0.72, 0, 1] }}
              className="sm:border-l sm:border-chalk-300/70 dark:sm:border-chalk-800 sm:pl-6 first:sm:border-l-0 first:sm:pl-0 group"
            >
              <stat.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-5xl sm:text-6xl font-display font-bold tracking-tight text-chalk-950 dark:text-chalk-50 tnum mt-4 transition-colors duration-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                {stat.value}
              </p>
              <p className="text-sm font-bold text-chalk-700 dark:text-chalk-200 mt-2">
                {stat.label}
              </p>
              <p className="text-xs text-chalk-500 dark:text-chalk-400 mt-2 leading-relaxed max-w-[32ch]">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
