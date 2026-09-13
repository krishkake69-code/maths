import React, { MouseEvent } from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
  contactInfo?: {
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
}

export default function Footer({ onAdminClick, contactInfo }: FooterProps) {
  const handleScrollToSection = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
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

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Courses & Batches', href: '#courses' },
    { label: 'Why Rehman Sir', href: '#about' },
    { label: 'Results & Ranks', href: '#results' },
    { label: 'Math Diagnostic', href: '#quiz-fun' },
    { label: 'Classroom Photos', href: '#gallery' },
    { label: 'Book 3-Day Demo', href: '#contact' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-800 font-sans math-grid" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Column */}
          <div className="lg:col-span-7 space-y-5">
            <a href="#home" onClick={(e) => handleScrollToSection(e, '#home')} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center text-white font-mono font-black text-xl shadow-md border border-white/20">
                R
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white leading-none">
                  REHMAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-400">MATHS</span>
                </span>
                <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase mt-0.5">
                  CLASSES • GHAZIABAD
                </span>
              </div>
            </a>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg">
              Dedicated coaching for JEE Main, JEE Advanced, and CBSE Class 10 & 12 Board examinations. Transforming math anxiety into computational mastery with Rehman Sir.
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <span>📍 D-48 Mahendra Enclave, near Silver Shine School, Shastri Nagar, Ghaziabad, UP 201002</span>
            </p>

            {/* Social handles */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { name: 'facebook', href: contactInfo?.facebook || 'https://facebook.com/rehman_mathematics' },
                { name: 'instagram', href: contactInfo?.instagram || 'https://instagram.com/rehman_mathematics' },
                { name: 'maps', href: 'https://maps.app.goo.gl/LvyJGmogmsHMHJov9' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white transition-all border border-slate-800"
                  aria-label={`Visit our ${social.name}`}
                >
                  {social.name === 'facebook' && (
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V1h-3a4 4 0 00-4 4v3z"/>
                    </svg>
                  )}
                  {social.name === 'instagram' && (
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  )}
                  {social.name === 'maps' && (
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Quicklinks Column */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScrollToSection(e, link.href)}
                  className="hover:text-amber-400 transition-colors block text-slate-400 hover:underline py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bottom info */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © 2026 REHMAN MATHEMATICS CLASSES. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3 text-slate-500 flex-wrap justify-center text-xs">
            {onAdminClick && (
              <button 
                onClick={onAdminClick}
                className="hover:text-indigo-400 transition-colors cursor-pointer font-bold uppercase tracking-wider"
              >
                Admin Panel
              </button>
            )}
            {onAdminClick && <span>•</span>}
            <span>Near Silver Shine School, Shastri Nagar, Ghaziabad</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Dedicated to Student Ranks <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
