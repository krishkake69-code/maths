import React, { useRef, useState, MouseEvent } from 'react';

interface Button3DProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'amber' | 'emerald' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  id?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

export default function Button3D({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className = '',
  type = 'button',
  disabled = false,
  id,
  target,
  rel,
  ariaLabel,
}: Button3DProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, isHovered: false });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Subtle, high-end 3D tilt (capped at 8 degrees)
    const rotateY = (x / (rect.width / 2)) * 7;
    const rotateX = -(y / (rect.height / 2)) * 7;
    setTilt({ rotateX, rotateY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, isHovered: false });
  };

  // Size styling
  const sizeStyles = {
    sm: 'px-3.5 py-2 text-xs rounded-xl font-bold',
    md: 'px-6 py-3.5 text-sm rounded-2xl font-extrabold',
    lg: 'px-8 py-4 text-base rounded-2xl font-black'
  }[size];

  // 3D theme styles with tactile mechanical extrusion depth
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white
      border-t border-indigo-400/40 border-x border-indigo-500/30
      shadow-[0_6px_0_#312e81,0_12px_22px_-2px_rgba(79,70,229,0.45)]
      hover:shadow-[0_8px_0_#312e81,0_16px_26px_-2px_rgba(79,70,229,0.55)]
      active:shadow-[0_2px_0_#312e81,0_4px_10px_-2px_rgba(79,70,229,0.3)]
    `,
    amber: `
      bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-slate-950
      border-t border-amber-300/60 border-x border-amber-400/40
      shadow-[0_6px_0_#92400e,0_12px_22px_-2px_rgba(245,158,11,0.45)]
      hover:shadow-[0_8px_0_#92400e,0_16px_26px_-2px_rgba(245,158,11,0.55)]
      active:shadow-[0_2px_0_#92400e,0_4px_10px_-2px_rgba(245,158,11,0.3)]
    `,
    emerald: `
      bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white
      border-t border-emerald-300/40 border-x border-emerald-400/30
      shadow-[0_6px_0_#064e3b,0_12px_22px_-2px_rgba(16,185,129,0.45)]
      hover:shadow-[0_8px_0_#064e3b,0_16px_26px_-2px_rgba(16,185,129,0.55)]
      active:shadow-[0_2px_0_#064e3b,0_4px_10px_-2px_rgba(16,185,129,0.3)]
    `,
    secondary: `
      bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100
      border border-slate-200/90 dark:border-slate-800
      border-b-2 border-b-slate-300 dark:border-b-slate-950
      shadow-[0_5px_0_#cbd5e1,0_10px_18px_-2px_rgba(0,0,0,0.08)]
      dark:shadow-[0_5px_0_#020617,0_10px_18px_-2px_rgba(0,0,0,0.5)]
      hover:shadow-[0_7px_0_#cbd5e1,0_14px_22px_-2px_rgba(0,0,0,0.12)]
      dark:hover:shadow-[0_7px_0_#020617,0_14px_22px_-2px_rgba(0,0,0,0.6)]
      active:shadow-[0_2px_0_#cbd5e1,0_4px_8px_-2px_rgba(0,0,0,0.05)]
      dark:active:shadow-[0_2px_0_#020617,0_4px_8px_-2px_rgba(0,0,0,0.3)]
    `,
    dark: `
      bg-slate-950 text-white
      border border-slate-800
      shadow-[0_5px_0_#020617,0_12px_20px_-2px_rgba(0,0,0,0.6)]
      hover:shadow-[0_7px_0_#020617,0_16px_24px_-2px_rgba(0,0,0,0.7)]
      active:shadow-[0_2px_0_#020617,0_4px_8px_-2px_rgba(0,0,0,0.4)]
    `
  }[variant];

  const content = (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.isHovered 
          ? `perspective(600px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-2px)`
          : 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: tilt.isHovered ? 'transform 0.08s ease-out' : 'transform 0.25s ease-out, box-shadow 0.2s ease',
        transformStyle: 'preserve-3d'
      }}
      className={`
        inline-flex items-center justify-center gap-2 cursor-pointer select-none
        transition-all duration-150 active:translate-y-1 active:scale-[0.99]
        relative overflow-hidden group
        ${sizeStyles}
        ${variantStyles}
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
    >
      {/* Specular shine light bar across surface */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
      />
      
      {/* 3D Elevated child content */}
      <span 
        style={{ transform: 'translateZ(15px)' }} 
        className="flex items-center justify-center gap-2 relative z-10 w-full"
      >
        {children}
      </span>
    </div>
  );

  if (href) {
    return (
      <a 
        href={href} 
        onClick={onClick as any}
        id={id}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className="inline-block"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      id={id}
      aria-label={ariaLabel}
      className="inline-block bg-transparent p-0 border-0 outline-none focus:outline-none"
    >
      {content}
    </button>
  );
}
