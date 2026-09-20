import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Portfolio from '@/components/Portfolio';
import Testimonial from '@/components/Testimonial';
import FinalCTA from '@/components/FinalCTA';
import { brandConfig } from '@/lib/config';

export const metadata = {
  title: 'Depoimentos de Clientes | Modkovski Fotografia',
  description: 'Veja o que nossos clientes dizem sobre as experiências de fotografia e vídeos com Alessandra Modkovski.',
};

export default function DepoimentosPage() {
  return (
    <main className="w-full relative min-h-screen flex flex-col bg-brand-cream selection:bg-brand-wine selection:text-white pt-24">
      <Navbar />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-text mt-3 mb-4">
          Inspire-se com as experiências dos nossos clientes.
        </h1>
        <p className="max-w-2xl mx-auto text-brand-text-soft text-sm md:text-base">
          A maior recompensa do nosso trabalho é ver a emoção de cada cliente ao reviver seus momentos mais preciosos, e ajudar profissionais e empresas a se posicionarem com autoridade na internet.
        </p>
      </div>

      <Portfolio eyebrow="Conheça histórias de quem confiou em nós." title="" />
      <Testimonial title="Inspire-se com as experiências dos nossos clientes." showMoreButton={false} />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
