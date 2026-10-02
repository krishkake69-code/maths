import { useState, useMemo } from 'react';
import { Sparkles, X, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { getAcademicSessionInfo } from '../utils/academicSession';

interface AdmissionBannerProps {
  message?: string;
}

export default function AdmissionBanner({ message }: AdmissionBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const sessionInfo = useMemo(() => getAcademicSessionInfo(), []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="bg-chalk-950 text-chalk-100 relative z-50 text-xs sm:text-sm font-medium py-2.5 px-4"
      id="admission-alert-banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
          <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1 tnum">
            <Zap className="w-3 h-3" /> {sessionInfo.currentSession} Batches
          </span>
          <span className="text-center sm:text-left text-chalk-200">
            {message ? (
              <span className="font-semibold tracking-wide text-chalk-50">{message}</span>
            ) : (
              <>
                <span className="text-chalk-50 font-semibold">Admissions Open:</span> JEE Mains, Advanced & Class 10/11/12th CBSE Mathematics.
                <span className="hidden md:inline text-chalk-400"> • 3-Day Free Trial Classes in Shastri Nagar, Ghaziabad.</span>
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 mx-auto sm:mx-0 shrink-0">
          <a
            href="#contact"
            className="bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 group whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
            <span>Claim Free Demo</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
          </a>
          <button
            onClick={() => setIsVisible(false)}
            className="text-chalk-400 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
