import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Packages from '@/components/Packages';
import Process from '@/components/Process';
import FAQ from '@/components/FAQ';
import Testimonial from '@/components/Testimonial';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { brandConfig } from '@/lib/config';

interface HomeViewProps {
  hidePackages?: boolean;
  hideAbout?: boolean;
  hideProcess?: boolean;
  customHeroImage?: string;
  customHeroTitle?: string;
  customHeroQuote?: string;
}

export default function HomeView({ 
  hidePackages = false,
  hideAbout = false,
  hideProcess = false,
  customHeroImage,
  customHeroTitle,
  customHeroQuote,
}: HomeViewProps) {
  return (
    <main className="w-full relative min-h-screen flex flex-col bg-brand-cream selection:bg-brand-wine selection:text-white pt-20" id="main-homepage">
      {/* Barra de Navegação Superior */}
      <Navbar />

      {/* 1. Apresentação da Marca & Proposta no Hero */}
      <Hero 
        hideProposalButtons={true} 
        customImage={customHeroImage}
        customTitle={customHeroTitle}
        customQuote={customHeroQuote}
      />

      {/* 3. Conexão com a Fotógrafa */}
      {!hideAbout && <About />}
      
      {/* 4. Portfólio de Imagens e Vídeos */}
      <Portfolio showViewPortfolioButton={true} />
      
      {/* 2 & 5. Apresentação da Proposta / Experiências e Pacotes */}
      {!hidePackages && <Packages />}
      
      {/* 7. Processo de Contratação (Como funciona) */}
      {!hideProcess && <Process />}

      {/* FAQ */}
      <FAQ />
      
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
