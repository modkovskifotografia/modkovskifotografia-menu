import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Camera, User, Globe, MessageCircle, Mic } from 'lucide-react';
import { brandConfig } from '@/lib/config';

export const metadata = {
  title: 'Bio Links | Modkovski Fotografia',
  description: 'Conecte-se com a Modkovski Fotografia. Orçamentos, portfólio e histórias reais.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function BioLinksPage() {
  return (
    <main 
      className="min-h-screen w-full relative flex flex-col items-center justify-center py-12 px-4 sm:px-6 bg-cover bg-center bg-no-repeat selection:bg-brand-wine selection:text-white overflow-hidden animate-fade-in transition-opacity duration-700"
      style={{ backgroundImage: 'url(/images/biolinks_bg.jpg)' }}
    >
      {/* Subtle light overlay for perfect contrast */}
      <div className="absolute inset-0 bg-white/45 backdrop-blur-[1px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-[0_12px_40px_rgba(78,0,0,0.12)] border border-brand-wine/15">
        
        {/* Circular Profile Photo */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-brand-wine shadow-[0_8px_20px_rgba(78,0,0,0.15)] mb-5 group">
          <Image
            src="/images/fotografa.jpg"
            alt="Alessandra Modkovski - Fotógrafa"
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            priority
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Brand Name & Subtitle */}
        <h1 className="font-serif text-2xl sm:text-3xl tracking-wide text-brand-wine font-bold uppercase mb-1">
          {brandConfig.name}
        </h1>
        <p className="text-xs sm:text-sm tracking-[0.15em] uppercase text-brand-text-soft font-medium mb-6">
          Fotografia e produção de vídeos
        </p>

        {/* Social Icons Header: WhatsApp, Instagram, and Website - dynamic hover effects with subtle rotation and scaling */}
        <div className="mb-8 flex items-center justify-center gap-3.5">
          {/* WhatsApp Icon */}
          <a
            href={brandConfig.whatsApp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-wine text-white shadow-md hover:bg-brand-wine-dark hover:scale-110 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(78,0,0,0.3)] transition-all duration-300 ease-out cursor-pointer"
            aria-label="WhatsApp da Modkovski Fotografia"
            title="Fale no WhatsApp"
          >
            <MessageCircle className="w-5 h-5 text-white transition-transform duration-300 ease-out group-hover:scale-115 group-hover:rotate-12" />
          </a>

          {/* Instagram Icon */}
          <a
            href={brandConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-wine text-white shadow-md hover:bg-brand-wine-dark hover:scale-110 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(78,0,0,0.3)] transition-all duration-300 ease-out cursor-pointer"
            aria-label="Instagram da Modkovski Fotografia"
            title="Visite o Instagram"
          >
            <Instagram className="w-5 h-5 text-white transition-transform duration-300 ease-out group-hover:scale-115 group-hover:-rotate-12" />
          </a>

          {/* Website Globe with Cursor Icon */}
          <a
            href="https://www.modkovskifotografia.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-wine text-white shadow-md hover:bg-brand-wine-dark hover:scale-110 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(78,0,0,0.3)] transition-all duration-300 ease-out cursor-pointer"
            title="Visitar site oficial www.modkovskifotografia.com.br"
            aria-label="Visitar site oficial"
          >
            <Globe className="w-5 h-5 text-white transition-transform duration-300 ease-out group-hover:scale-115 group-hover:rotate-[18deg]" />
            <span className="absolute bottom-1 right-1 text-[10px] select-none bg-brand-wine rounded-full p-0.5 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:translate-x-0.5">🖱️</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-4">
          {/* Button 1: Faça seu orçamento (WhatsApp) */}
          <a
            href={brandConfig.whatsApp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-full bg-brand-wine text-white font-medium text-sm sm:text-base uppercase tracking-wider shadow-[0_8px_25px_rgba(78,0,0,0.25)] hover:shadow-[0_16px_35px_rgba(78,0,0,0.35)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group transform-gpu"
          >
            <span className="flex-1 text-center font-semibold">Faça seu orçamento</span>
            <MessageCircle className="w-5 h-5 opacity-90 group-hover:scale-110 transition-transform text-white" />
          </a>

          {/* Button 2: Veja meu portfólio (/portfolio) */}
          <Link
            href="/portfolio"
            className="w-full py-4 px-6 rounded-full bg-brand-wine text-white font-medium text-sm sm:text-base uppercase tracking-wider shadow-[0_8px_25px_rgba(78,0,0,0.25)] hover:shadow-[0_16px_35px_rgba(78,0,0,0.35)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group transform-gpu"
          >
            <span className="flex-1 text-center font-semibold">Veja meu portfólio</span>
            <Camera className="w-5 h-5 opacity-90 group-hover:scale-110 transition-transform text-white" />
          </Link>

          {/* Button 3: Quem sou eu (Página inicial /) */}
          <Link
            href="/"
            className="w-full py-4 px-6 rounded-full bg-brand-wine text-white font-medium text-sm sm:text-base uppercase tracking-wider shadow-[0_8px_25px_rgba(78,0,0,0.25)] hover:shadow-[0_16px_35px_rgba(78,0,0,0.35)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group transform-gpu"
          >
            <span className="flex-1 text-center font-semibold">Quem sou eu</span>
            <User className="w-5 h-5 opacity-90 group-hover:scale-110 transition-transform text-white" />
          </Link>

          {/* Button 4: Depoimentos (/depoimentos) */}
          <Link
            href="/depoimentos"
            className="w-full py-4 px-6 rounded-full bg-brand-wine text-white font-medium text-sm sm:text-base uppercase tracking-wider shadow-[0_8px_25px_rgba(78,0,0,0.25)] hover:shadow-[0_16px_35px_rgba(78,0,0,0.35)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group transform-gpu"
          >
            <span className="flex-1 text-center font-semibold">Depoimentos</span>
            <Mic className="w-5 h-5 opacity-90 group-hover:scale-110 transition-transform text-white" />
          </Link>
        </div>

        {/* Footer / Copyright inside card */}
        <div className="mt-8 pt-6 border-t border-brand-wine/10 w-full text-center">
          <p className="text-xs text-brand-text-soft">
            © {new Date().getFullYear()} Modkovski Fotografia. Todos os direitos reservados.
          </p>
        </div>

      </div>
    </main>
  );
}
