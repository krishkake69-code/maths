import { motion } from 'motion/react';
import { Target, Users, GraduationCap, CheckCircle2, Compass, MapPin, Zap, Flame, Sparkles } from 'lucide-react';

export default function About() {
  const highlights = [
    {
      title: 'Rehman Sir’s Direct Mentorship',
      desc: 'No sub-contracted teachers. Every core lecture, doubt resolution session, and diagnostic test review is handled personally by Rehman Sir.',
      icon: GraduationCap,
      badge: '12+ Yrs Experience',
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-800/40'
    },
    {
      title: 'Derivation-First, Zero Cramming',
      desc: 'Understand why a formula works with geometric intuition. Calculus, coordinate geometry, and trigonometry become unforgettable.',
      icon: Target,
      badge: 'Pure Logic',
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/40'
    },
    {
      title: 'Previous 15-Yr JEE PYQs & DPPs',
      desc: 'Students solve actual past NTA & IIT questions daily, building speed, accuracy, and examination stamina.',
      icon: Zap,
      badge: 'Speed Drills',
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/40'
    },
    {
      title: 'Small Batches & Open Doubt Desk',
      desc: 'Batch sizes are strictly capped so questions are addressed instantly without students feeling shy or left behind.',
      icon: Users,
      badge: '1-on-1 Focus',
      color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border-violet-200/60 dark:border-violet-800/40'
    }
  ];

  return (
    <section
      id="about"
      className="py-20 md:py-28 bg-white dark:bg-[#07090e] transition-colors duration-300 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
            // PEDAGOGY & PHILOSOPHY
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Why Students Excel With Rehman Sir
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Making rigorous higher mathematics simple, structured, and scoring for students in Shastri Nagar and across Ghaziabad.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>D 48, near Silver Shine School, Mahendra Enclave, Ghaziabad</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Math is not a memory contest. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 dark:from-indigo-400 dark:to-amber-400">
                It is pure spatial and algebraic reasoning.
              </span>
            </h3>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              At <strong className="text-slate-900 dark:text-white">REHMAN MATHEMATICS CLASSES</strong>, we strip away the intimidating jargon. Whether a student is aiming for a <strong>perfect 100/100 in CBSE Class 12</strong> or targeting <strong>top 99+ percentile in JEE Main & Advanced</strong>, Rehman Sir trains students to see patterns, sketch graphs intuitively, and dismantle multi-concept problems with speed.
            </p>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              Located conveniently in Shastri Nagar near Silver Shine School, our center provides a focused, quiet learning environment away from mass coaching hype, with continuous parent progress reporting.
            </p>

            {/* Mission & Vision Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm mb-1.5">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>The Core Objective</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Eliminate hesitation and exam anxiety by building ironclad mastery in Calculus, Vectors, 3D Geometry, and Algebra.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm mb-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>The Result Vision</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Ghaziabad's benchmark institute for mathematics where every hardworking student achieves their dream college selection.
                </p>
              </div>
            </div>
          </div>

          {/* Right Highlights Column */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((h, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-3xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border ${h.color}`}>
                      <h.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                      {h.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {h.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {h.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 pt-4 mt-2 border-t border-slate-200/40 dark:border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Direct Guarantee</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
