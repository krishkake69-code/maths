import React, { useState, useEffect, MouseEvent } from 'react';
import { Menu, X, Sun, Moon, Sparkles, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Button3D from './Button3D';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onAdminClick?: () => void;
}

export default function Navbar({ darkMode, setDarkMode, onAdminClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  const navItems = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: '3D Lab', href: '#math-3d-lab', id: 'math-3d-lab' },
    { label: 'Courses', href: '#courses', id: 'courses' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Why Us', href: '#why-us', id: 'why-us' },
    { label: 'Results', href: '#results', id: 'results' },
    { label: 'Reviews', href: '#testimonials', id: 'testimonials' },
    { label: 'Class Tour', href: '#gallery', id: 'gallery' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  // Keep track of scroll depth and actively sync with sections
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // Compute total scroll percentage
      const winHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (winHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / winHeight) * 100));
        setScrollProgress(progress);
      }

      // Check which section is in view
      const sectionIds = ['home', 'math-3d-lab', 'courses', 'about', 'why-us', 'results', 'testimonials', 'gallery', 'contact'];
      
      let currentSection = 'home';
      const scrollPosition = scrollY + 140; // Look-ahead offset for navbar height

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = id;
            break;
          }
        }
      }

      // If scrolled to bottom, highlight contact
      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60) {
        currentSection = 'contact';
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const targetRect = target.getBoundingClientRect().top;
      const targetPosition = targetRect - bodyRect;
      const offsetPosition = targetPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      id="main-navigation-header"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-lg shadow-indigo-950/5 border-b border-indigo-100/60 dark:border-slate-800/80 py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      {/* Real-time Scroll Progress Bar Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-slate-200/30 dark:bg-slate-800/30 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-500 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group cursor-pointer"
            id="brand-logo-nav"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center text-white font-mono font-black text-xl shadow-md shadow-indigo-500/20 group-hover:rotate-3 transition-transform duration-300 border border-white/20">
                <span>R</span>
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                REHMAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 dark:from-indigo-400 dark:via-violet-400 dark:to-amber-400">MATHS</span>
              </span>
              <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                JEE & BOARDS • GHAZIABAD
              </span>
            </div>
          </a>

          {/* Desktop Synchronized Navigation */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-full border border-slate-200/60 dark:border-slate-800 relative">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-200 z-10 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 shadow-sm shadow-indigo-600/40 -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Icons and Controls */}
            <div className="flex items-center gap-3">
              {/* Dark/Light mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-amber-400 border border-slate-200/60 dark:border-slate-800 transition-colors shadow-xs cursor-pointer"
                aria-label="Toggle theme mode"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>

              {/* Admin Access Panel Lock */}
              {onAdminClick && (
                <button
                  onClick={onAdminClick}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/60 dark:border-slate-800 transition-colors shadow-xs cursor-pointer"
                  title="Admin Control Center"
                >
                  <Lock className="w-4 h-4" />
                </button>
              )}

              {/* Direct Admission CTA with student vibe */}
              <Button3D
                variant="amber"
                size="sm"
                href="#contact"
                onClick={(e) => handleNavClick(e as any, '#contact')}
                className="shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950 animate-pulse" />
                <span>Book 3-Day Demo</span>
              </Button3D>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              aria-label="Toggle theme mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Admin Control Center"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-3 pt-3 pb-5 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl"
            >
              <div className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />}
                    </a>
                  );
                })}
                
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-amber-500 text-white font-extrabold text-sm text-center shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Book Free Demo Class
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  );
}
