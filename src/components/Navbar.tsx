import React, { useState, useEffect, MouseEvent } from 'react';
import { Sun, Moon, Lock } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
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

  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, 'change', (value) => setIsScrolled(value > 24));
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (value > 0.985) setActiveSection('contact');
  });

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

  // Sync the active nav link with the section in view
  useEffect(() => {
    const sectionIds = ['home', 'math-3d-lab', 'courses', 'about', 'why-us', 'results', 'testimonials', 'gallery', 'contact'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -60% 0px' }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const offset = 88;
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
    <div className="fixed inset-x-0 top-0 z-40 px-3 sm:px-5 pointer-events-none">
      <nav
        id="main-navigation-header"
        className={`pointer-events-auto mt-3 sm:mt-4 max-w-7xl mx-auto rounded-2xl border transition-all duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ${
          isScrolled
            ? 'bg-paper/90 dark:bg-chalk-950/85 backdrop-blur-xl border-chalk-200/70 dark:border-chalk-800/80 shadow-[0_16px_40px_-20px_rgba(10,15,12,0.35)] dark:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.8)]'
            : 'bg-paper/60 dark:bg-chalk-950/60 backdrop-blur-md border-transparent'
        }`}
      >
        <div className="px-4 sm:px-5">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-3 group cursor-pointer"
              id="brand-logo-nav"
            >
              <div className="w-9 h-9 rounded-lg bg-chalk-950 dark:bg-chalk-100 flex items-center justify-center text-white dark:text-chalk-950 font-mono font-bold text-lg shadow-[0_6px_14px_-6px_rgba(10,15,12,0.5)] group-hover:-rotate-3 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]">
                <span>R</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-chalk-950 dark:text-chalk-50 leading-none">
                  REHMAN <span className="text-emerald-600 dark:text-emerald-400">MATHS</span>
                </span>
                <span className="text-[9px] font-mono font-semibold tracking-[0.18em] text-chalk-500 dark:text-chalk-400 uppercase mt-1 tnum">
                  JEE & Boards • Ghaziabad
                </span>
              </div>
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-0.5">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  const xlOnly = item.id === 'why-us' || item.id === 'gallery';
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`relative px-2.5 py-1.5 text-[11px] xl:text-xs font-semibold rounded-full transition-colors duration-200 z-10 ${xlOnly ? 'hidden xl:inline-block' : ''} ${
                        isActive
                          ? 'text-white dark:text-chalk-950'
                          : 'text-chalk-600 dark:text-chalk-300 hover:text-emerald-700 dark:hover:text-emerald-400'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          className="absolute inset-0 rounded-full bg-chalk-950 dark:bg-chalk-100 -z-10"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full text-chalk-600 dark:text-chalk-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-chalk-100 dark:hover:bg-chalk-900 transition-colors cursor-pointer"
                  aria-label="Toggle theme mode"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {onAdminClick && (
                  <button
                    onClick={onAdminClick}
                    className="p-2 rounded-full text-chalk-500 dark:text-chalk-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-chalk-100 dark:hover:bg-chalk-900 transition-colors cursor-pointer"
                    title="Admin Control Center"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                )}

                <Button3D
                  variant="primary"
                  size="sm"
                  href="#contact"
                  onClick={(e) => handleNavClick(e as any, '#contact')}
                  className="shrink-0"
                >
                  <span>Book 3-Day Demo</span>
                </Button3D>
              </div>
            </div>

            {/* Mobile controls */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full text-chalk-600 dark:text-chalk-300 hover:bg-chalk-100 dark:hover:bg-chalk-900 transition-colors cursor-pointer"
                aria-label="Toggle theme mode"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {onAdminClick && (
                <button
                  onClick={onAdminClick}
                  className="p-2 rounded-full text-chalk-600 dark:text-chalk-300 hover:bg-chalk-100 dark:hover:bg-chalk-900 transition-colors cursor-pointer"
                  title="Admin Control Center"
                >
                  <Lock className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 rounded-full text-chalk-800 dark:text-chalk-100 hover:bg-chalk-100 dark:hover:bg-chalk-900 transition-colors cursor-pointer"
                aria-expanded={isOpen}
                aria-label="Toggle menu"
              >
                <span className={`absolute left-1/2 top-1/2 block h-[1.5px] w-[18px] -translate-x-1/2 -translate-y-[4px] bg-current transition-all duration-300 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'rotate-45 translate-y-0' : ''}`} />
                <span className={`absolute left-1/2 top-1/2 block h-[1.5px] w-[18px] -translate-x-1/2 translate-y-[3px] bg-current transition-all duration-300 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ${isOpen ? '-rotate-45 translate-y-0' : ''}`} />
              </button>
            </div>

          </div>
        </div>

        {/* Thin scroll progress line */}
        <div className="absolute bottom-0 left-3 right-3 h-px overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-emerald-500/70 origin-left"
            style={{ scaleX: scrollYProgress }}
          />
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="lg:hidden overflow-hidden"
            >
              <div className="px-4 pb-5 pt-2 border-t border-chalk-200/70 dark:border-chalk-800/80 mt-1">
                <div className="flex flex-col">
                  {navItems.map((item, idx) => {
                    const isActive = activeSection === item.id;
                    return (
                      <motion.a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.04 * idx, ease: [0.32, 0.72, 0, 1] }}
                        className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                          isActive
                            ? 'bg-chalk-950 dark:bg-chalk-100 text-white dark:text-chalk-950'
                            : 'text-chalk-700 dark:text-chalk-200 hover:bg-chalk-100 dark:hover:bg-chalk-900'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className={`text-[10px] font-mono tnum ${isActive ? 'text-emerald-300 dark:text-emerald-700' : 'text-chalk-300 dark:text-chalk-600'}`}>
                          0{idx + 1}
                        </span>
                      </motion.a>
                    );
                  })}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.38, ease: [0.32, 0.72, 0, 1] }}
                    className="mt-3"
                  >
                    <Button3D
                      variant="primary"
                      size="md"
                      href="#contact"
                      onClick={(e) => handleNavClick(e as any, '#contact')}
                      className="w-full"
                    >
                      <span>Book Free Demo Class</span>
                    </Button3D>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>
    </div>
  );
}
