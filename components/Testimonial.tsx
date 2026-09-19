'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { brandConfig } from '@/lib/config';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export default function Testimonial() {
  const testimonials = brandConfig.testimonial.items || [
    {
      id: 1,
      occasion: brandConfig.testimonial.occasion || "1 ANO DE CASADOS",
      quote: brandConfig.testimonial.quote,
      client: brandConfig.testimonial.client || "ANDRESSA E DEIVISON",
    }
  ];

  const total = testimonials.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [keyCounter, setKeyCounter] = useState(0);

  const nextTestimonial = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
    setKeyCounter((prev) => prev + 1);
  }, [total]);

  const prevTestimonial = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setKeyCounter((prev) => prev + 1);
  }, [total]);

  const goToIndex = useCallback((targetIndex: number) => {
    if (targetIndex === currentIndex) return;
    setDirection(targetIndex > currentIndex ? 1 : -1);
    setCurrentIndex(targetIndex);
    setKeyCounter((prev) => prev + 1);
  }, [currentIndex]);

  // Timer automático de 20 segundos para cada depoimento (com loop infinito)
  useEffect(() => {
    if (isPaused || total <= 1) return;

    const timer = setInterval(() => {
      nextTestimonial();
    }, 20000); // 20 segundos

    return () => clearInterval(timer);
  }, [nextTestimonial, isPaused, total, keyCounter]);

  const currentItem = testimonials[currentIndex];

  return (
    <section 
      className="py-20 md:py-28 lg:py-32 bg-brand-cream w-full border-t border-brand-wine/10 relative overflow-hidden" 
      id="depoimentos"
    >
      <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
        
        <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-brand-wine uppercase block mb-3">
          {brandConfig.testimonial.eyebrow}
        </span>
        
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-brand-text tracking-tight font-serif mb-10 md:mb-14">
          {brandConfig.testimonial.title}
        </h2>

        {/* Carousel Container com botões de navegação lateral */}
        <div 
          className="relative max-w-3xl mx-auto flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {/* Botão Esquerdo (Anterior) */}
          <button
            onClick={prevTestimonial}
            id="testimonial-prev-btn"
            aria-label="Depoimento anterior"
            className="absolute -left-3 sm:-left-6 md:-left-12 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full border border-brand-wine/25 bg-brand-cream/90 hover:bg-brand-wine hover:text-brand-cream text-brand-wine transition-all duration-300 flex items-center justify-center shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-wine/40"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Card Principal de Depoimento */}
          <div className="w-full relative min-h-[360px] sm:min-h-[320px] md:min-h-[290px] flex items-center justify-center">
            <div className="w-full relative py-12 md:py-16 px-7 sm:px-10 md:px-16 border border-brand-wine/15 bg-brand-beige/30 shadow-xs backdrop-blur-xs flex flex-col items-center">
              
              {/* Ícone de Aspas decorativo */}
              <div className="mb-5 flex justify-center">
                <Quote className="w-8 h-8 md:w-9 md:h-9 text-brand-wine/35" strokeWidth={1.2} />
              </div>

              {/* Animação de transição suave do conteúdo do slot */}
              <div className="relative w-full overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.35 }
                    }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Tag / Ocasião (ex: 1 ANO DE CASADOS) */}
                    {currentItem.occasion && (
                      <span className="text-[11px] md:text-xs font-semibold tracking-[0.25em] text-brand-wine uppercase block mb-4">
                        {currentItem.occasion}
                      </span>
                    )}
                    
                    {/* Texto do Depoimento */}
                    <p className="font-serif italic text-base sm:text-lg md:text-xl lg:text-[21px] text-brand-text leading-relaxed max-w-2xl mb-6">
                      {currentItem.quote}
                    </p>
                    
                    {/* Divisor sutil */}
                    <div className="w-10 h-[1px] bg-brand-wine/25 mb-4" />
                    
                    {/* Nome do Cliente (ex: ANDRESSA E DEIVISON) */}
                    <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-brand-wine uppercase block">
                      {currentItem.client}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Barra de progresso visual de 20s */}
              <div className="w-full max-w-[200px] h-[2px] bg-brand-wine/10 mt-8 rounded-full overflow-hidden">
                <motion.div
                  key={`progress-${currentIndex}-${keyCounter}`}
                  initial={{ width: '0%' }}
                  animate={{ width: isPaused ? '0%' : '100%' }}
                  transition={{ duration: 20, ease: 'linear' }}
                  className="h-full bg-brand-wine/40"
                />
              </div>

            </div>
          </div>

          {/* Botão Direito (Próximo) */}
          <button
            onClick={nextTestimonial}
            id="testimonial-next-btn"
            aria-label="Próximo depoimento"
            className="absolute -right-3 sm:-right-6 md:-right-12 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full border border-brand-wine/25 bg-brand-cream/90 hover:bg-brand-wine hover:text-brand-cream text-brand-wine transition-all duration-300 flex items-center justify-center shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-wine/40"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        {/* Indicadores de Slot (1 a 5) */}
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {testimonials.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => goToIndex(index)}
                id={`testimonial-dot-${index + 1}`}
                aria-label={`Ir para depoimento ${index + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                  isActive 
                    ? 'w-7 h-2 bg-brand-wine' 
                    : 'w-2 h-2 bg-brand-wine/25 hover:bg-brand-wine/50'
                }`}
              />
            );
          })}
        </div>

        {/* Contador de slides sutil (ex: 01 / 05) */}
        <div className="mt-3 text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-wine/60">
          0{currentIndex + 1} / 0{total}
        </div>

      </div>
    </section>
  );
}
