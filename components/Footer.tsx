'use client';

import React from 'react';
import { brandConfig } from '@/lib/config';
import { Instagram, Camera, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-brand-wine-dark text-white/70 py-16 px-6 border-t border-white/5" 
      id="rodape"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Brand signature */}
        <div className="mb-6 flex flex-col items-center">
          <span className="font-serif text-xl tracking-[0.25em] font-medium text-white uppercase mb-1">
            {brandConfig.name}
          </span>
          <span className="font-sans text-[9px] tracking-[0.35em] text-white/50 uppercase font-light">
            {brandConfig.subName}
          </span>
        </div>

        {/* Elegant horizontal line divider */}
        <div className="w-16 h-[1px] bg-white/10 my-4" />

        {/* Instagram signature row */}
        <div className="mb-8">
          <a 
            href={brandConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase hover:text-white transition-colors duration-300"
            id="footer-instagram-link"
          >
            <Instagram className="w-4 h-4 text-white/80" strokeWidth={1.5} />
            <span>{brandConfig.instagram.handle}</span>
          </a>
        </div>

        {/* Footer legalities & wedding proposal markers */}
        <div className="text-[9px] tracking-widest text-white/40 uppercase space-y-2 font-medium">
          <p>
            Proposta válida por 10 dias
          </p>
          <p>
            &copy; {currentYear} {brandConfig.name}. Todos os direitos reservados.
          </p>
          <p className="flex items-center justify-center gap-1 opacity-75 pt-2">
            <span>Desenvolvido com</span>
            <Heart className="w-2.5 h-2.5 text-brand-wine fill-brand-wine inline" />
            <span>para registrar histórias reais.</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
