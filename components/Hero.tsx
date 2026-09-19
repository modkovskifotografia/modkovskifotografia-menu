'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Camera, Video } from 'lucide-react';
import { brandConfig } from '@/lib/config';
import Logo from './Logo';

export default function Hero() {
  const [imageSrc, setImageSrc] = useState(brandConfig.hero.image);

  const handleImageError = () => {
    setImageSrc(brandConfig.hero.imageFallback);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative min-h-[95vh] lg:min-h-screen w-full flex flex-col justify-between bg-brand-cream overflow-hidden"
      id="hero-section"
    >
      <div className="w-full h-full lg:grid lg:grid-cols-12 flex flex-col flex-grow">
        
        {/* Left Side: Content */}
        <div className="lg:col-span-7 flex flex-col justify-between px-6 py-12 md:px-12 md:py-16 lg:px-20 lg:py-24 xl:px-24 flex-grow order-2 lg:order-1">
          {/* Main Content Area */}
          <div className="my-auto max-w-2xl pt-4 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
            >
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-brand-wine uppercase block mb-6">
                {brandConfig.hero.tagline}
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-brand-wine tracking-tight leading-[1.05] mb-4 font-serif"
            >
              {brandConfig.hero.title}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif italic text-base md:text-lg lg:text-xl text-brand-text-soft leading-relaxed max-w-xl mb-10"
            >
              &ldquo;{brandConfig.hero.quote}&rdquo;
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection('experiencias-sec-1')}
                className="flex items-center justify-center gap-2 bg-brand-wine text-white hover:bg-brand-wine-dark py-4 px-6 rounded-full text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300 shadow-sm cursor-pointer active:scale-[0.98]"
                id="hero-btn-prop-foto"
              >
                <Camera className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                <span>VER PROPOSTA FOTOGRÁFICA</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection('experiencias-sec-2')}
                className="flex items-center justify-center gap-2 bg-white text-brand-wine border border-brand-wine/20 hover:bg-brand-wine hover:text-white py-4 px-6 rounded-full text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300 shadow-sm cursor-pointer active:scale-[0.98]"
                id="hero-btn-prop-video"
              >
                <Video className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                <span>VER PROPOSTA DE VÍDEOS</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Bottom Info Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-16 lg:mt-12 text-[10px] tracking-widest uppercase text-brand-text-soft flex items-center gap-2 pt-4"
          >
            <span>{brandConfig.name}</span>
            <span>·</span>
            <span>Proposta válida por 10 dias</span>
          </motion.div>
        </div>

        {/* Right Side: Large Format Image Area */}
        <div className="lg:col-span-5 relative min-h-[45vh] md:min-h-[55vh] lg:min-h-full w-full order-1 lg:order-2 overflow-hidden bg-brand-beige">
          {/* Logo overlay on top-left of cover photo */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-5 left-5 md:top-8 md:left-8 z-20"
            id="hero-header-logo"
          >
            <div className="bg-brand-cream/95 backdrop-blur-md px-4 py-2.5 md:px-5 md:py-3 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-brand-wine/10 flex items-center justify-center">
              <Logo />
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={imageSrc}
              alt="Casamento Letícia Faustino - Modkovski Fotografia"
              fill
              className="object-cover object-center"
              onError={handleImageError}
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              referrerPolicy="no-referrer"
            />
            {/* Subtle elegant overlay */}
            <div className="absolute inset-0 bg-brand-wine/5 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-brand-cream via-transparent to-transparent opacity-40 lg:opacity-30" />
          </motion.div>
          
          {/* Accent vertical line overlay for editorial feel */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-brand-wine/10 hidden lg:block" />
        </div>

      </div>
    </section>
  );
}
