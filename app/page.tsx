import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Packages from '@/components/Packages';
import Process from '@/components/Process';
import Testimonial from '@/components/Testimonial';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export default function Home() {
  return (
    <main className="w-full relative min-h-screen flex flex-col bg-brand-cream selection:bg-brand-wine selection:text-white pt-20" id="main-homepage">
      {/* Barra de Navegação Superior */}
      <Navbar />

      {/* 1. Apresentação da Marca & Proposta no Hero */}
      <Hero />

      
      {/* 3. Conexão com a Fotógrafa */}
      <About />
      
      {/* 4. Portfólio de Imagens e Vídeos */}
      <Portfolio />
      
      {/* 2 & 5. Apresentação da Proposta / Experiências e Pacotes (Duplicado conforme solicitado) */}
      <Packages />
      
      {/* 7. Processo de Contratação (Como funciona) */}
      <Process />
      
      {/* 8. Depoimento da Cliente */}
      <Testimonial />
      
      {/* 9. Chamada Final para Contratação via WhatsApp */}
      <FinalCTA />
      
      {/* Rodapé da Página */}
      <Footer />

      {/* Botões Flutuantes (WhatsApp e Voltar ao Topo) */}
      <FloatingWhatsApp />
    </main>
  );
}
