'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { brandConfig } from '@/lib/config';

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const whatsappUrl = `https://wa.me/${brandConfig.whatsApp.number}?text=${encodeURIComponent(
    'Olá Alessandra! Vi sua proposta comercial e gostaria de conversar sobre meu evento/projeto.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Botão Voltar ao Topo (aparece ao rolar a página) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onClick={scrollToTop}
            className="pointer-events-auto w-12 h-12 md:w-13 md:h-13 bg-white text-brand-wine border border-brand-wine/20 hover:bg-brand-wine hover:text-white rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_35px_rgba(96,0,0,0.2)] transition-all duration-300 flex items-center justify-center group cursor-pointer"
            id="back-to-top-btn"
            aria-label="Voltar ao topo"
            title="Voltar ao topo"
          >
            <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Botão Flutuante de WhatsApp */}
      <div className="pointer-events-auto flex items-center group relative">
        {/* Tooltip on hover */}
        <div className="absolute right-full mr-3 bg-white text-brand-text px-4 py-2 rounded-lg shadow-xl border border-brand-wine/15 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden md:block">
          Falar com Alessandra no WhatsApp 💬
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com Alessandra no WhatsApp"
          className="w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 relative group"
        >
          <MessageCircle className="w-7 h-7 md:w-8 md:h-8 fill-white text-[#25D366]" strokeWidth={1.5} />
          
          {/* Pulsing ring */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />
        </a>
      </div>
    </div>
  );
}
