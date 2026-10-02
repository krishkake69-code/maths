import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, MapPin, Zap, Box } from 'lucide-react';
import Spatial3DBackground from './Spatial3DBackground';
import Button3D from './Button3D';
import { HeroData, StatsData } from '../types';
import { getAcademicSessionInfo } from '../utils/academicSession';

interface HeroProps {
  hero?: HeroData;
  stats?: StatsData;
}

export default function Hero({ hero }: HeroProps) {
  const sessionInfo = useMemo(() => getAcademicSessionInfo(), []);

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

  const highlights = (hero?.highlights && hero.highlights.length > 0)
    ? hero.highlights
    : [
        'Visual Graphical Calculus (Zero Rote Memorization)',
        'Daily Practice Problems (DPP) & Past 15-Yr JEE PYQs',
        'Personal Doubt Counter & 1-on-1 Mentoring',
        'CBSE 100/100 Step-Marking Board Mastery'
      ];

  const badgeText = hero?.badgeText || `New ${sessionInfo.currentSession} Batches Open`;
  const locationText = hero?.locationText || 'Near Silver Shine School, Shastri Nagar';
  const locationLink = hero?.locationLink || 'https://maps.app.goo.gl/LvyJGmogmsHMHJov9';

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-paper dark:bg-chalk-950 math-grid transition-colors duration-300"
    >
      {/* Three.js spatial geometry canvas */}
      <Spatial3DBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[100dvh] pt-24 pb-16 lg:py-24">

          {/* Left: value proposition */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="inline-flex flex-wrap items-center gap-2"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-chalk-950 dark:bg-chalk-100 text-chalk-50 dark:text-chalk-950 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-600 animate-ping" />
                <span>{badgeText}</span>
              </div>
              <a
                href={locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-chalk-300 dark:border-chalk-700 text-chalk-600 dark:text-chalk-300 text-xs font-semibold hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{locationText}</span>
              </a>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.32, 0.72, 0, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-chalk-950 dark:text-chalk-50 tracking-tight leading-[1.06] mt-7 max-w-xl"
              id="hero-main-title"
            >
              {hero?.title ? (
                <span>{hero.title}</span>
              ) : (
                <>
                  Master <span className="text-emerald-600 dark:text-emerald-400">Mathematics</span> Without the Fear.
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease: [0.32, 0.72, 0, 1] }}
              className="text-base sm:text-lg text-chalk-600 dark:text-chalk-300 max-w-[60ch] leading-relaxed mt-5"
            >
              {hero?.subtitle || (
                <>
                  Turn complex calculus, 3D geometry, and trigonometry into simple geometric patterns. Learn step-by-step proofs and lightning-fast JEE question shortcuts with <strong className="text-chalk-950 dark:text-chalk-50 font-bold">Rehman Sir</strong>.
                </>
              )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-8 w-full sm:w-auto"
            >
              <Button3D
                variant="primary"
                size="lg"
                onClick={() => handleScrollToSection('contact')}
                className="w-full sm:w-auto"
              >
                <Zap className="w-4.5 h-4.5 text-emerald-300 dark:text-emerald-500 fill-emerald-300 dark:fill-emerald-500" />
                <span>Book Free 3-Day Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Button3D>

              <Button3D
                variant="secondary"
                size="lg"
                onClick={() => handleScrollToSection('math-3d-lab')}
                className="w-full sm:w-auto"
              >
                <Box className="w-4.5 h-4.5" />
                <span>Open 3D Math Lab</span>
              </Button3D>
            </motion.div>
          </div>

          {/* Right: chalkboard panel with the live syllabus highlights */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-6 w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto"
          >
            <div className="relative p-1.5 rounded-[2rem] bg-chalk-950/[0.04] dark:bg-white/[0.04] ring-1 ring-chalk-200/80 dark:ring-chalk-800 shadow-[0_40px_80px_-40px_rgba(10,15,12,0.45)] dark:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
              <div className="chalkboard rounded-[calc(2rem-0.375rem)] p-6 sm:p-8 relative overflow-hidden">
                {/* Chalk formulas */}
                <div className="flex items-end justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-chalk text-3xl sm:text-4xl text-chalk-100 leading-tight">
                      d/dx (sin x) = cos x
                    </p>
                    <svg viewBox="0 0 220 8" className="w-44 mt-1.5" aria-hidden="true">
                      <path d="M2 5 Q 30 1, 55 4 T 110 4 T 165 4 T 218 3" fill="none" stroke="rgba(52,211,153,0.6)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-chalk-400 pb-2">
                    Class notes
                  </span>
                </div>

                <p className="font-chalk text-2xl sm:text-3xl text-chalk-200/90 leading-snug mt-4">
                  ∫ 1/(1+x²) dx = tan⁻¹(x) + C
                </p>

                <div className="border-t border-dashed border-chalk-700/80 mt-6 pt-5">
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-chalk-400">
                    What every batch covers
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {highlights.map((text, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-chalk-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-medium leading-snug">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
