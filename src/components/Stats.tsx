import { Award, Users, BookOpen, Star } from 'lucide-react';
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
      icon: Users,
      badge: 'Ghaziabad Legacy',
      accent: 'from-indigo-500 to-violet-600'
    },
    {
      label: stats?.successRateLabel || 'Board Distinction Rate',
      value: stats?.successRate || '96%',
      description: stats?.successRateDesc || 'Students achieving 90%+ in Class 10 & 12 CBSE Board examinations.',
      icon: Star,
      badge: 'Academic Excellence',
      accent: 'from-amber-500 to-orange-600'
    },
    {
      label: stats?.experienceLabel || 'Years of Teaching',
      value: stats?.experience || '15+ Yrs',
      description: stats?.experienceDesc || 'Pure mathematics specialization focusing on derivation intuition.',
      icon: BookOpen,
      badge: 'Rehman Sir',
      accent: 'from-emerald-500 to-teal-600'
    },
    {
      label: stats?.selectionsLabel || 'IIT & NIT Selections',
      value: stats?.selectionsCount || '350+',
      description: stats?.selectionsDesc || 'Proud alumni studying in premier engineering institutions across India.',
      icon: Award,
      badge: 'Competitive Track',
      accent: 'from-violet-500 to-indigo-600'
    }
  ];

  return (
    <section className="relative py-20 bg-slate-950 text-white math-grid overflow-hidden border-y border-indigo-950/40" id="stats">
      {/* Background soft ambient glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
              // BY THE NUMBERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Proven Results in Every Board & Exam.
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Our numbers reflect rigorous practice, step-marking discipline, and weekly diagnostic tracking right here in Shastri Nagar.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsList.map((stat, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl hover:border-indigo-500/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.accent} text-white shadow-md shadow-indigo-950/30 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50">
                    {stat.badge}
                  </span>
                </div>

                <p className="text-4xl sm:text-5xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-indigo-200 group-hover:to-amber-300 transition-colors">
                  {stat.value}
                </p>
                <p className="text-base font-bold text-slate-200 mt-1">
                  {stat.label}
                </p>
              </div>

              <p className="text-xs text-slate-400 mt-4 leading-relaxed border-t border-slate-800/70 pt-3">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

