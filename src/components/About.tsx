import { motion } from 'motion/react';
import { Target, Users, GraduationCap, Compass, MapPin, Zap, Flame, Sparkles } from 'lucide-react';

export default function About() {
  const highlights = [
    {
      title: 'Rehman Sir’s Direct Mentorship',
      desc: 'No sub-contracted teachers. Every core lecture, doubt resolution session, and diagnostic test review is handled personally by Rehman Sir.',
      icon: GraduationCap,
      badge: '12+ Yrs Experience'
    },
    {
      title: 'Derivation-First, Zero Cramming',
      desc: 'Understand why a formula works with geometric intuition. Calculus, coordinate geometry, and trigonometry become unforgettable.',
      icon: Target,
      badge: 'Pure Logic'
    },
    {
      title: 'Previous 15-Yr JEE PYQs & DPPs',
      desc: 'Students solve actual past NTA & IIT questions daily, building speed, accuracy, and examination stamina.',
      icon: Zap,
      badge: 'Speed Drills'
    },
    {
      title: 'Small Batches & Open Doubt Desk',
      desc: 'Batch sizes are strictly capped so questions are addressed instantly without students feeling shy or left behind.',
      icon: Users,
      badge: '1-on-1 Focus'
    }
  ];

  return (
    <section
      id="about"
      className="py-20 md:py-28 bg-paper dark:bg-chalk-950 transition-colors duration-300 relative overflow-hidden border-t border-chalk-200/60 dark:border-chalk-800/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="max-w-2xl"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] font-bold text-chalk-950 dark:text-chalk-50 tracking-tight">
            Why students excel with Rehman Sir
          </h2>
          <p className="text-chalk-600 dark:text-chalk-300 mt-4 text-sm sm:text-base leading-relaxed max-w-[60ch]">
            Making rigorous higher mathematics simple, structured, and scoring for students in Shastri Nagar and across Ghaziabad.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-14">

          {/* Narrative column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-chalk-300 dark:border-chalk-700 text-chalk-600 dark:text-chalk-300 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>D 48, near Silver Shine School, Mahendra Enclave, Ghaziabad</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-chalk-950 dark:text-chalk-50 tracking-tight leading-snug">
              Math is not a memory contest.{' '}
              <span className="text-emerald-700 dark:text-emerald-400">
                It is pure spatial and algebraic reasoning.
              </span>
            </h3>

            <p className="text-chalk-600 dark:text-chalk-300 leading-relaxed text-sm sm:text-base max-w-[60ch]">
              At <strong className="text-chalk-950 dark:text-chalk-50 font-bold">REHMAN MATHEMATICS CLASSES</strong>, we strip away the intimidating jargon. Whether a student is aiming for a <strong>perfect 100/100 in CBSE Class 12</strong> or targeting <strong>top 99+ percentile in JEE Main & Advanced</strong>, Rehman Sir trains students to see patterns, sketch graphs intuitively, and dismantle multi-concept problems with speed.
            </p>

            <p className="text-chalk-600 dark:text-chalk-300 leading-relaxed text-sm sm:text-base max-w-[60ch]">
              Located conveniently in Shastri Nagar near Silver Shine School, our center provides a focused, quiet learning environment away from mass coaching hype, with continuous parent progress reporting.
            </p>

            {/* Objective & vision blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="border-l-2 border-emerald-500/70 pl-4">
                <div className="flex items-center gap-2 text-chalk-950 dark:text-chalk-50 font-bold text-sm">
                  <Flame className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>The core objective</span>
                </div>
                <p className="text-chalk-500 dark:text-chalk-400 text-xs leading-relaxed mt-1.5">
                  Eliminate hesitation and exam anxiety by building ironclad mastery in Calculus, Vectors, 3D Geometry, and Algebra.
                </p>
              </div>

              <div className="border-l-2 border-emerald-500/70 pl-4">
                <div className="flex items-center gap-2 text-chalk-950 dark:text-chalk-50 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>The result vision</span>
                </div>
                <p className="text-chalk-500 dark:text-chalk-400 text-xs leading-relaxed mt-1.5">
                  Ghaziabad's benchmark institute for mathematics where every hardworking student achieves their dream college selection.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Highlights column: hairline rows */}
          <div className="lg:col-span-6">
            <div className="divide-y divide-chalk-200/80 dark:divide-chalk-800 border-y border-chalk-200/80 dark:divide-chalk-800 border-chalk-200/80 dark:border-chalk-800">
              {highlights.map((h, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: idx * 0.06, ease: [0.32, 0.72, 0, 1] }}
                  className="py-6 flex items-start gap-4 group"
                >
                  <div className="p-2.5 rounded-xl bg-chalk-100 dark:bg-chalk-900 text-emerald-700 dark:text-emerald-400 shrink-0 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40">
                    <h.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-base font-bold text-chalk-950 dark:text-chalk-50">
                        {h.title}
                      </h4>
                      <span className="hidden sm:inline text-[10px] font-mono font-semibold uppercase tracking-wider text-chalk-500 dark:text-chalk-400 shrink-0">
                        {h.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-chalk-500 dark:text-chalk-400 mt-1.5 leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
