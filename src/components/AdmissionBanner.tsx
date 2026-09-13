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
      transition={{ duration: 0.3 }}
      className="bg-slate-950 text-white relative z-50 text-xs sm:text-sm font-medium py-2.5 px-4 border-b border-indigo-500/20 shadow-sm"
      id="admission-alert-banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider flex items-center gap-1 shadow-sm">
            <Zap className="w-3 h-3 fill-slate-950" /> {sessionInfo.currentSession} Batches
          </span>
          <span className="text-center sm:text-left text-slate-200">
            {message ? (
              <span className="font-bold tracking-wide text-white">{message}</span>
            ) : (
              <>
                <span className="text-white font-bold">Admissions Open:</span> JEE Mains, Advanced & Class 10/11/12th CBSE Mathematics.
                <span className="hidden md:inline text-slate-400"> • 3-Day Free Trial Classes in Shastri Nagar, Ghaziabad.</span>
              </>
            )}
          </span>
        </div>
        
        <div className="flex items-center gap-3 mx-auto sm:mx-0 shrink-0">
          <a
            href="#contact"
            className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 group border border-indigo-400/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Claim Free Demo</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
