'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

interface Partner {
  id: string;
  name: string;
  category?: string;
  imageUrl?: string;
  link?: string;
  active?: boolean;
}

const DEFAULT_PARTNERS: Partner[] = [
  { id: 'part-01', name: 'Mamtur Viagens', category: 'Turismo & Viagens', imageUrl: '/images/portfolio-01.jpg' },
  { id: 'part-02', name: 'Ana Letícia Advocacia', category: 'Jurídico', imageUrl: '/images/portfolio-02.jpg' },
  { id: 'part-03', name: 'Sérgio Psicologia', category: 'Saúde & Bem-estar', imageUrl: '/images/portfolio-03.jpg' },
  { id: 'part-04', name: 'Cerimonial & Eventos', category: 'Eventos', imageUrl: '/images/portfolio-04.jpg' },
  { id: 'part-05', name: 'Espaço & Buffet', category: 'Gastronomia', imageUrl: '/images/portfolio-05.jpg' },
  { id: 'part-06', name: 'Make & Hair Noivas', category: 'Beleza', imageUrl: '/images/portfolio-06.jpg' },
];

function cleanImageSrc(src?: string): string {
  if (!src) return '/images/portfolio-01.jpg';
  const trimmed = src.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  if (trimmed.startsWith('app/painel/depoimentos/')) {
    return '/' + trimmed.replace('app/painel/depoimentos/', 'depoimentos/');
  }
  if (!trimmed.startsWith('/')) {
    return `/${trimmed}`;
  }
  return trimmed;
}

export default function PartnersMarquee() {
  const [partners, setPartners] = useState<Partner[]>(DEFAULT_PARTNERS);

  useEffect(() => {
    fetch('/api/depoimentos?type=partners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.partners) && data.partners.length > 0) {
          const activeOnes = data.partners.filter((p: Partner) => p.active !== false);
          if (activeOnes.length > 0) {
            setPartners(activeOnes);
          }
        }
      })
      .catch(() => {});
  }, []);

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
          className="flex gap-8 md:gap-14 shrink-0 items-center"
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
              {partner.link ? (
                <a 
                  href={partner.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col items-center"
                  title={`Visitar ${partner.name}`}
                >
                  <div 
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border-2 border-brand-wine/25 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-brand-wine transition-all duration-300 relative overflow-hidden"
                    id={`partner-slot-${partner.id}-${index}`}
                  >
                    {partner.imageUrl ? (
                      <Image
                        src={cleanImageSrc(partner.imageUrl)}
                        alt={partner.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-wine/10 text-brand-wine font-serif font-bold text-lg">
                        {partner.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-brand-text/80 mt-2.5 max-w-[120px] text-center truncate group-hover:text-brand-wine transition-colors">
                    {partner.name}
                  </span>
                </a>
              ) : (
                <div className="group flex flex-col items-center">
                  <div 
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border-2 border-brand-wine/25 flex items-center justify-center shadow-xs hover:scale-105 hover:border-brand-wine transition-all duration-300 relative overflow-hidden"
                    id={`partner-slot-${partner.id}-${index}`}
                  >
                    {partner.imageUrl ? (
                      <Image
                        src={cleanImageSrc(partner.imageUrl)}
                        alt={partner.name}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-wine/10 text-brand-wine font-serif font-bold text-lg">
                        {partner.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-brand-text/80 mt-2.5 max-w-[120px] text-center truncate">
                    {partner.name}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
