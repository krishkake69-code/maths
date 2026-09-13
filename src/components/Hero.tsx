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

export default function Hero({ hero, stats }: HeroProps) {
  const sessionInfo = useMemo(() => getAcademicSessionInfo(), []);

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 80;
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
      className="relative min-h-screen pt-28 sm:pt-32 pb-16 md:pb-24 flex items-center justify-center bg-slate-50 dark:bg-[#07090e] math-grid overflow-hidden transition-colors duration-300"
    >
      {/* Three.js 3D Spatial Geometry Canvas Background */}
      <Spatial3DBackground />

      {/* Modern Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[650px] h-[350px] sm:h-[450px] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-amber-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        <div className="space-y-6 sm:space-y-8 flex flex-col items-center">
          
          {/* Admissions alert pill & Location */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex flex-wrap items-center justify-center gap-2"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping" />
              <span>{badgeText}</span>
            </div>
            <a 
              href={locationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100/80 transition-colors shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{locationText}</span>
            </a>
          </motion.div>

          {/* High Impact Modern Student Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.08] max-w-4xl"
            id="hero-main-title"
          >
            {hero?.title ? (
              <span>{hero.title}</span>
            ) : (
              <>
                Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 dark:from-indigo-400 dark:via-violet-400 dark:to-amber-400">Mathematics</span> <br />
                Without the Fear.
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed"
          >
            {hero?.subtitle || (
              <>
                Turn complex calculus, 3D geometry, and trigonometry into simple geometric patterns. Learn step-by-step proofs and lightning-fast JEE question shortcuts with <strong className="text-slate-900 dark:text-white font-extrabold">Rehman Sir</strong>.
              </>
            )}
          </motion.p>

          {/* Student-appealing highlights chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full text-left pt-2"
          >
            {highlights.map((text, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200 backdrop-blur-md shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="font-semibold">{text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA 3D tactile buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button3D
              variant="primary"
              size="lg"
              onClick={() => handleScrollToSection('contact')}
              className="w-full sm:w-auto"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>Book Free 3-Day Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Button3D>

            <Button3D
              variant="secondary"
              size="lg"
              onClick={() => handleScrollToSection('math-3d-lab')}
              className="w-full sm:w-auto"
            >
              <Box className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Open 3D Math Lab</span>
            </Button3D>
          </motion.div>

          {/* Quick Stats Summary Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl w-full pt-6"
          >
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 backdrop-blur-xs text-center">
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{stats?.topJeeScore || '99.85%'}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">Top JEE Score</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 backdrop-blur-xs text-center">
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats?.perfectBoardScore || '100/100'}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">Board Centum</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 backdrop-blur-xs text-center">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats?.experience || '15+ Yrs'}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">Rehman Sir Exp</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 backdrop-blur-xs text-center">
              <p className="text-2xl font-black text-violet-600 dark:text-violet-400">{stats?.studentsCount || '2,500+'}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">Students Guided</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
