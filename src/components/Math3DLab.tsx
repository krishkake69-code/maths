import { Compass, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import Math3DViewer, { Math3DMode } from './Math3DViewer';
import Button3D from './Button3D';

export default function Math3DLab() {
  const activePreset: Math3DMode = 'vectors';

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 88;
      const bodyRect = document.body.getBoundingClientRect().top;
      const targetRect = el.getBoundingClientRect().top;
      const targetPosition = targetRect - bodyRect;
      const offsetPosition = targetPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const legend = [
    {
      dot: 'bg-cyan-400',
      title: 'Vector a',
      desc: 'Ground reference vector along the Cartesian X-axis with magnitude |a|.'
    },
    {
      dot: 'bg-amber-400',
      title: 'Vector b',
      desc: 'Rotates through angle θ relative to vector a across 3D space.'
    },
    {
      dot: 'bg-purple-400',
      title: 'Normal a × b',
      desc: 'Magnitude = |a||b| sin(θ), directed perpendicularly via the right-hand rule.'
    },
    {
      dot: 'bg-violet-400',
      square: true,
      title: 'Shaded plane area',
      desc: 'Parallelogram area = |a × b|. Collapses to zero when vectors are parallel.'
    }
  ];

  const pillars = [
    {
      title: 'Zero angle guesswork',
      desc: 'Never struggle with cross products or direction cosines. See vectors interact in Cartesian space with right-hand rules.',
      badge: 'Vector intuition'
    },
    {
      title: 'Step-marking visual proofs',
      desc: 'Learn how to write board-standard solutions for 3D lines, skew distance, and plane equations to secure 100/100.',
      badge: 'Class 12 boards'
    },
    {
      title: 'Fast JEE coordinate elimination',
      desc: 'Quickly spot parallel planes, normal collinearity, and orthogonal dot products to solve JEE problems in under 60 seconds.',
      badge: 'JEE speed'
    }
  ];

  return (
    <section
      id="math-3d-lab"
      className="py-20 md:py-28 bg-paper dark:bg-chalk-950 math-dense-grid relative overflow-hidden transition-colors duration-300 border-t border-chalk-200/60 dark:border-chalk-800/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="max-w-2xl mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] font-bold text-chalk-950 dark:text-chalk-50 tracking-tight">
            Visualize in 3D before you calculate
          </h2>
          <p className="text-chalk-600 dark:text-chalk-300 mt-4 text-sm sm:text-base leading-relaxed max-w-[60ch]">
            In JEE Advanced and Class 12 Boards, questions from 3D Geometry and Vectors carry over <strong className="text-emerald-700 dark:text-emerald-400 font-bold">20% of the paper</strong>. Rehman Sir teaches through interactive spatial geometry so you never have to guess angles in your head.
          </p>
        </motion.div>

        {/* 3D viewer in a machined bezel */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="p-1.5 sm:p-2 rounded-[2rem] bg-chalk-100/70 dark:bg-chalk-900/60 ring-1 ring-chalk-200/80 dark:ring-chalk-800 shadow-[0_40px_90px_-45px_rgba(10,15,12,0.5)] dark:shadow-[0_40px_90px_-45px_rgba(0,0,0,0.95)]"
        >
          <Math3DViewer
            key={activePreset}
            initialMode={activePreset}
            height="480px"
            showControls={true}
            className="rounded-[calc(2rem-0.5rem)]"
          />
        </motion.div>

        {/* Live graph legend */}
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <span className="inline-flex items-center gap-2 text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live 3D graph analysis
            </span>
            <span className="text-[11px] font-mono text-chalk-400 px-2.5 py-1 rounded-full border border-chalk-200 dark:border-chalk-800">
              3D Cartesian XYZ
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
            {legend.map((item, idx) => (
              <div key={idx} className="lg:border-t border-chalk-200/80 dark:border-chalk-800 lg:pt-4">
                <div className="flex items-center gap-2">
                  <span className={`shrink-0 ${item.square ? 'w-2.5 h-2.5 rounded-[3px] border border-current' : 'w-2.5 h-2.5 rounded-full'} ${item.dot} opacity-90`} />
                  <strong className="text-sm font-bold text-chalk-900 dark:text-chalk-100">{item.title}</strong>
                </div>
                <p className="text-xs text-chalk-500 dark:text-chalk-400 leading-relaxed mt-1.5">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-14">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.32, 0.72, 0, 1] }}
              className="p-6 rounded-2xl bg-chalk-50 dark:bg-chalk-900/70 border border-chalk-200/70 dark:border-chalk-800"
            >
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-chalk-500 dark:text-chalk-400">
                {pillar.badge}
              </span>
              <h3 className="text-lg font-bold text-chalk-950 dark:text-chalk-50 mt-2.5">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-chalk-500 dark:text-chalk-400 mt-2 leading-relaxed">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA band */}
        <div className="mt-14 p-6 sm:p-8 rounded-[2rem] chalkboard relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            <div className="flex items-start gap-3.5">
              <Compass className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-chalk-50">
                  Experience 3D classroom lectures
                </h3>
                <p className="text-xs sm:text-sm text-chalk-300 leading-relaxed mt-1 max-w-lg">
                  Attend 3 days of live vector and calculus sessions with Rehman Sir in Shastri Nagar, Ghaziabad.
                </p>
              </div>
            </div>
            <Button3D
              variant="amber"
              size="md"
              onClick={() => handleScrollToSection('contact')}
              className="shrink-0"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Reserve Free 3-Day Demo Pass</span>
              <ArrowRight className="w-4 h-4" />
            </Button3D>
          </div>
        </div>

      </div>
    </section>
  );
}
