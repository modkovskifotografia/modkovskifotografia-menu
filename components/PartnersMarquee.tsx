'use client';

import React from 'react';
import { motion } from 'motion/react';

interface Partner {
  id: string;
  name: string;
}

const partners: Partner[] = [
  { id: '01', name: 'Parceiro 01' },
  { id: '02', name: 'Parceiro 02' },
  { id: '03', name: 'Parceiro 03' },
  { id: '04', name: 'Parceiro 04' },
  { id: '05', name: 'Parceiro 05' },
  { id: '06', name: 'Parceiro 06' },
  { id: '07', name: 'Parceiro 07' },
  { id: '08', name: 'Parceiro 08' },
];

export default function PartnersMarquee() {
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-20 md:py-28 bg-brand-cream w-full overflow-hidden border-t border-brand-wine/10" id="principais-parceiros">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-brand-wine uppercase block mb-3">
          REDE DE CONFIANÇA
        </span>
        <h2 className="text-3xl md:text-4xl font-light text-brand-text tracking-tight font-serif">
          Principais Parceiros
        </h2>
        <div className="w-12 h-[1px] bg-brand-wine/35 mx-auto mt-4" />
      </div>

      {/* Marquee container */}
      <div className="relative w-full overflow-hidden flex py-8">
        <motion.div
          className="flex gap-10 md:gap-16 shrink-0 items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 35,
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <motion.div
              key={`${partner.id}-${index}`}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: (index % 8) * 0.4,
              }}
              className="flex flex-col items-center justify-center shrink-0"
            >
              <div 
                className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-brand-wine/10 border border-brand-wine/25 flex items-center justify-center shadow-sm hover:scale-105 transition-transform duration-300 relative overflow-hidden"
                id={`partner-slot-${partner.id}`}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-wine/20 flex items-center justify-center text-brand-wine/60" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
