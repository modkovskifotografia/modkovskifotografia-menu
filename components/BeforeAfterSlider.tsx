'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeftRight } from 'lucide-react';

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => setIsDragging(false);
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, handleMove]);

  return (
    <section className="py-24 md:py-32 w-full bg-brand-beige border-t border-b border-brand-wine/10 relative overflow-hidden" id="before-after-section">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-brand-wine uppercase block mb-3">
            O PODER DA REVELAÇÃO
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-text tracking-tight font-serif mb-4">
            Antes e Depois da Edição
          </h2>
          <div className="w-12 h-[1px] bg-brand-wine/35 mx-auto mb-6" />
          <p className="text-sm md:text-base text-brand-text-soft font-light leading-relaxed">
            Arraste a barra central para comparar o arquivo original sem edição com o resultado final tratado com nossa assinatura artística.
          </p>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full aspect-[3/4] max-w-[480px] mx-auto rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] select-none cursor-ew-resize border border-brand-wine/20 bg-neutral-900"
          onClick={handleContainerClick}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Layer 1: After Image (Com Edição Final - Full Canvas) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <Image
              src="/images/depois.jpg"
              alt="Foto com Edição Final"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover pointer-events-none select-none"
              priority
              unoptimized
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-black/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold tracking-[0.2em] px-3.5 sm:px-4 py-1.5 rounded-full uppercase border border-white/25 shadow-lg z-10 select-none">
              Com Edição Final
            </div>
          </div>

          {/* Layer 2: Before Image (Original / Sem Edição - Clipped seamlessly with clip-path) */}
          <div 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ 
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              WebkitClipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
            }}
          >
            <Image
              src="/images/antes.jpg"
              alt="Foto Sem Edição (Original)"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover pointer-events-none select-none"
              priority
              unoptimized
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-white/95 backdrop-blur-md text-brand-wine text-[10px] sm:text-xs font-semibold tracking-[0.2em] px-3.5 sm:px-4 py-1.5 rounded-full uppercase border border-brand-wine/25 shadow-lg z-10 whitespace-nowrap select-none">
              Original / Sem Edição
            </div>
          </div>

          {/* Slider Divider Line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 sm:w-1 bg-white shadow-[0_0_20px_rgba(0,0,0,0.7)] z-20 pointer-events-auto"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-brand-wine text-white border-2 border-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-grab active:cursor-grabbing">
              <ArrowLeftRight className="w-5 h-5" strokeWidth={2.2} />
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <span className="text-[11px] text-brand-text-soft/70 font-light italic tracking-wide">
            💡 Dica: Arraste a barra para a esquerda ou direita para comparar os detalhes da revelação e colorimetria.
          </span>
        </div>
      </div>
    </section>
  );
}
