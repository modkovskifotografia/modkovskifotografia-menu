import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Portfolio from '@/components/Portfolio';
import FinalCTA from '@/components/FinalCTA';
import { brandConfig } from '@/lib/config';

export const metadata = {
  title: 'Portfólio | Modkovski Fotografia',
  description: 'Explore o portfólio completo de fotografia e vídeos de casamentos, ensaios e produções de Alessandra Modkovski.',
};

export default function PortfolioPage() {
  return (
    <main className="w-full relative min-h-screen flex flex-col bg-brand-cream selection:bg-brand-wine selection:text-white pt-24">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-brand-wine font-medium">
          {brandConfig.portfolio.eyebrow}
        </span>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-text mt-3 mb-4">
          Portfólio Completo
        </h1>
        <p className="max-w-2xl mx-auto text-brand-text-soft text-sm md:text-base">
          Cada clique e cada cena guardam uma história real, a cumplicidade e a emoção do seu dia gravadas para sempre.
        </p>
      </div>
      <Portfolio />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
