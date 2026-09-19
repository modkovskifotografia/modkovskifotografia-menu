'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  light?: boolean;
}

export default function Logo({ className = '', light = false }: LogoProps) {
  const [useFallback, setUseFallback] = useState(false);

  // When /images/logo.png is available in /public, it renders crisply with natural horizontal aspect ratio.
  if (!useFallback) {
    return (
      <div className={`relative inline-block ${className}`}>
        <Image
          src="/images/logo.png"
          alt="Modkovski Fotografia"
          width={318}
          height={98}
          className="h-10 md:h-12 lg:h-14 w-auto object-contain transition-all duration-300"
          onError={() => setUseFallback(true)}
          priority
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return <LogoPlaceholder light={light} className={className} />;
}

export function LogoPlaceholder({ className = '', light = false }: LogoProps) {
  return (
    <div 
      className={`inline-flex flex-col items-center justify-center py-2 px-6 border border-dashed transition-all duration-300 ${
        light 
          ? 'border-white/30 text-white hover:border-white/50' 
          : 'border-brand-wine/30 text-brand-wine hover:border-brand-wine/50'
      } ${className}`}
      style={{ minWidth: '160px', minHeight: '65px' }}
      id="logo-placeholder-container"
    >
      <span className="font-serif text-sm tracking-[0.2em] font-medium uppercase leading-none">
        Modkovski
      </span>
      <span className="font-sans text-[8px] tracking-[0.35em] uppercase mt-1.5 opacity-80 font-light">
        Fotografia
      </span>
    </div>
  );
}
