import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Packages from '@/components/Packages';
import FinalCTA from '@/components/FinalCTA';
import { brandConfig } from '@/lib/config';

export const metadata = {
  title: 'Casamentos & Cerimônias | Modkovski Fotografia',
  description: 'Cobertura fotográfica e cinematográfica de casamentos com sensibilidade, direção artística e olhar autêntico.',
};

export default function CasamentosPage() {
  return (
    <main className="w-full relative min-h-screen flex flex-col bg-brand-cream selection:bg-brand-wine selection:text-white pt-24">
      <Navbar />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-brand-wine font-medium">
          Amor & Compromisso
        </span>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-text mt-3 mb-4">
          Casamentos & Cerimônias
        </h1>
        <p className="max-w-2xl mx-auto text-brand-text-soft text-sm md:text-base">
          O seu grande dia acontece uma única vez. Registramos cada lágrima de alegria, os olhares cúmplices e a emoção de celebrar a sua história com quem você ama.
        </p>
      </div>

      <Packages />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
