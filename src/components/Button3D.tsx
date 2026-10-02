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

    // Soft, high-end tilt capped at 5 degrees
    const rotateY = (x / (rect.width / 2)) * 5;
    const rotateX = -(y / (rect.height / 2)) * 5;
    setTilt({ rotateX, rotateY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, isHovered: false });
  };

  // Buttons are full pills; cards stay soft (documented shape system)
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs font-semibold gap-1.5',
    md: 'px-6 py-3 text-sm font-bold gap-2',
    lg: 'px-7 py-3.5 text-base font-bold gap-2',
  }[size];

  const variantStyles = {
    // Ink solid: the house primary
    primary: `
      bg-chalk-950 dark:bg-chalk-100 text-white dark:text-chalk-950
      shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_-8px_rgba(10,15,12,0.5)]
      hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_30px_-8px_rgba(10,15,12,0.55)]
      active:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_10px_-6px_rgba(10,15,12,0.4)]
    `,
    // Accent solid: single emerald accent (kept for existing call sites)
    amber: `
      bg-emerald-700 hover:bg-emerald-800 text-white
      shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_24px_-8px_rgba(4,120,87,0.55)]
      hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_30px_-8px_rgba(4,120,87,0.6)]
      active:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_10px_-6px_rgba(4,120,87,0.45)]
    `,
    emerald: `
      bg-emerald-700 hover:bg-emerald-800 text-white
      shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_24px_-8px_rgba(4,120,87,0.55)]
      hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_30px_-8px_rgba(4,120,87,0.6)]
      active:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_10px_-6px_rgba(4,120,87,0.45)]
    `,
    // Outline: quiet secondary
    secondary: `
      bg-transparent text-chalk-800 dark:text-chalk-100
      border border-chalk-300 dark:border-chalk-700
      hover:border-chalk-500 dark:hover:border-chalk-500 hover:bg-chalk-50 dark:hover:bg-chalk-900
      shadow-[0_6px_18px_-10px_rgba(10,15,12,0.25)]
      dark:shadow-[0_6px_18px_-10px_rgba(0,0,0,0.6)]
      active:shadow-none
    `,
    dark: `
      bg-chalk-950 dark:bg-chalk-100 text-white dark:text-chalk-950
      shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_-8px_rgba(10,15,12,0.5)]
      hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_30px_-8px_rgba(10,15,12,0.55)]
      active:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_10px_-6px_rgba(10,15,12,0.4)]
    `,
  }[variant];

  const content = (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.isHovered
          ? `perspective(600px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-1px)`
          : 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: tilt.isHovered
          ? 'transform 0.12s cubic-bezier(0.32,0.72,0,1)'
          : 'transform 0.3s cubic-bezier(0.32,0.72,0,1), box-shadow 0.3s cubic-bezier(0.32,0.72,0,1)',
        transformStyle: 'preserve-3d',
      }}
      className={`
        inline-flex items-center justify-center cursor-pointer select-none whitespace-nowrap
        rounded-full transition-all duration-200
        active:translate-y-[1px] active:scale-[0.98]
        relative overflow-hidden group
        ${sizeStyles}
        ${variantStyles}
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
    >
      {/* Soft specular light sweep */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
      />

      {/* Elevated child content */}
      <span
        style={{ transform: 'translateZ(10px)' }}
        className="flex items-center justify-center relative z-10 w-full"
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
