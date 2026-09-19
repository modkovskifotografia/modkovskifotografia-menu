'use client';

import React from 'react';
import { motion } from 'motion/react';
import { brandConfig } from '@/lib/config';
import { Calendar, MessageCircle } from 'lucide-react';

export default function FinalCTA() {
  const waLink = `https://wa.me/${brandConfig.whatsApp.number}?text=${encodeURIComponent(brandConfig.finalCta.whatsAppText)}`;

  return (
    <section 
      className="py-24 md:py-36 bg-brand-wine text-white text-center relative overflow-hidden" 
      id="reserva"
    >
      {/* Background Decorative Graphic Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
        
        {/* Subtle icon/accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Calendar className="w-8 h-8 text-white/40" strokeWidth={1.2} />
        </motion.div>

        {/* Emotion-driven title */}
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight font-serif mb-6 text-white"
        >
          {brandConfig.finalCta.title}
        </motion.h2>

        {/* Persuasion copy */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm md:text-base lg:text-lg text-white/80 leading-relaxed max-w-2xl font-light mb-12"
        >
          {brandConfig.finalCta.description}
        </motion.p>

        {/* Interactive Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-brand-wine text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 hover:bg-brand-cream hover:-translate-y-0.5 shadow-lg hover:shadow-xl active:translate-y-0"
            id="final-cta-reserve-btn"
          >
            <MessageCircle className="w-4 h-4 fill-current shrink-0" />
            <span>{brandConfig.finalCta.buttonText}</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
