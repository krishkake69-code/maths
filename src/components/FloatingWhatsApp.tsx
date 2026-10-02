import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Calculator } from 'lucide-react';
import { getDynamicWhatsAppMessages } from '../utils/academicSession';

interface FloatingWhatsAppProps {
  phone?: string;
}

export default function FloatingWhatsApp({ phone }: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNum = phone || '9911667462';
  const { currentSession, sampleQuestions, getWhatsAppUrl } = useMemo(
    () => getDynamicWhatsAppMessages(phoneNum),
    [phoneNum]
  );

  const handleWhatsAppRedirect = (customMsg?: string) => {
    const targetUrl = getWhatsAppUrl(customMsg);
    window.open(targetUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="floating-whatsapp-widget">

      {/* Helpdesk window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="bg-white dark:bg-chalk-900 w-80 max-w-[calc(100vw-3rem)] rounded-[1.5rem] shadow-2xl shadow-chalk-950/30 border border-chalk-200/70 dark:border-chalk-800 overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-emerald-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center relative">
                  <Calculator className="w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-emerald-700" aria-label="Online" />
                </div>
                <div>
                  <h4 className="text-sm font-bold leading-tight">Rehman Math Helpdesk</h4>
                  <p className="text-[10px] text-emerald-100 mt-0.5">Typically replies in 5 mins</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat content */}
            <div className="p-5 space-y-4 bg-paper dark:bg-chalk-950 text-xs sm:text-sm">
              <div className="bg-chalk-100 dark:bg-chalk-900 p-3.5 rounded-2xl rounded-tl-md text-chalk-800 dark:text-chalk-200 leading-relaxed font-medium">
                Welcome to <span className="font-bold text-emerald-700 dark:text-emerald-400">REHMAN MATHEMATICS CLASSES</span>. How can Rehman Sir help with your JEE / Boards math preparation today?
              </div>

              {/* Quick questions */}
              <div className="space-y-2 pt-1">
                <p className="text-[10px] text-chalk-400 font-semibold uppercase tracking-[0.14em] pl-1">
                  Ask on WhatsApp
                </p>
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleWhatsAppRedirect(q.msg)}
                    className="w-full text-left p-3 rounded-xl bg-white dark:bg-chalk-900 border border-chalk-200/70 dark:border-chalk-800 hover:border-emerald-500 text-[11px] font-semibold text-chalk-700 dark:text-chalk-200 transition-colors cursor-pointer block"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer action */}
            <div className="p-4 bg-white dark:bg-chalk-900 border-t border-chalk-200/70 dark:border-chalk-800 flex justify-between items-center gap-3">
              <input
                type="text"
                readOnly
                placeholder="Type question on WhatsApp..."
                className="bg-paper dark:bg-chalk-950 px-3.5 py-2.5 rounded-xl text-xs flex-1 text-chalk-400 focus:outline-none border border-chalk-200/70 dark:border-chalk-800"
              />
              <button
                onClick={() => handleWhatsAppRedirect()}
                className="p-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shrink-0 cursor-pointer"
                aria-label="Send WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-[0_18px_40px_-12px_rgba(4,120,87,0.6)] hover:scale-[1.04] active:scale-95 transition-all duration-300 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] cursor-pointer group"
        aria-label="Open WhatsApp Chat Desk"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping opacity-60 group-hover:hidden pointer-events-none" aria-hidden="true" />
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.01 14.069.988 11.99.988c-5.438 0-9.863 4.373-9.867 9.803-.001 1.97.512 3.888 1.49 5.593L2.613 21.35l5.09-1.33c1.56.95 3.1 1.45 4.815 1.45l.13-.1zM17.37 14.5c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-2.73-1.36-3.85-2.28-4.9-4.1-.15-.26-.15-.45-.01-.59.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.22-.24-.59-.5-.51-.67-.52-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.12 4.52.72.31 1.28.5 1.71.64.72.23 1.38.2 1.9.12.58-.09 1.74-.71 1.99-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.22-.57-.37z"/>
          </svg>
        )}
      </button>

    </div>
  );
}
