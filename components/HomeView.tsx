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
  showPersonalizedCustomSection?: boolean;
}

export default function HomeView({ 
  hidePackages = false,
  hideAbout = false,
  hideProcess = false,
  showPersonalizedCustomSection = false,
}: HomeViewProps) {
  return (
    <main className="w-full relative min-h-screen flex flex-col bg-brand-cream selection:bg-brand-wine selection:text-white pt-20" id="main-homepage">
      {/* Barra de Navegação Superior */}
      <Navbar />

      {/* 1. Apresentação da Marca & Proposta no Hero */}
      <Hero hideProposalButtons={true} />

      {/* 3. Conexão com a Fotógrafa */}
      {!hideAbout && <About />}
      
      {/* 4. Portfólio de Imagens e Vídeos */}
      <Portfolio showViewPortfolioButton={true} />
      
      {/* 2 & 5. Apresentação da Proposta / Experiências e Pacotes */}
      {!hidePackages && <Packages />}

      {/* Seção Personalizada se for a página /personalizado */}
      {showPersonalizedCustomSection && (
        <section className="py-20 px-6 md:px-12 bg-white border-y border-brand-wine/10 my-10" id="orcamento-personalizado">
          <div className="max-w-3xl mx-auto text-center bg-brand-cream/40 p-8 sm:p-12 rounded-3xl border border-brand-wine/15 shadow-sm">
            <span className="text-xs uppercase tracking-[0.25em] text-brand-wine font-semibold block mb-3">
              PROPOSTA SOB MEDIDA
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-text mb-6">
              Crie a experiência ideal para o seu projeto
            </h2>
            <p className="text-sm md:text-base text-brand-text-soft leading-relaxed font-light mb-8">
              Caso você queira fazer uma proposta sob medida, com ajuste de quantidades de fotos e vídeos, prazo de entrega ou variadas locações para ensaios, você tem total flexibilidade para criar a experiência ideal para o seu projeto.
            </p>
            <a
              href={`https://wa.me/${brandConfig.whatsApp.number}?text=${encodeURIComponent('Oi, gostaria de personalizar minha proposta. Eu preciso de:\n[Descreva como será o seu projeto]')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-brand-wine text-white text-xs font-semibold uppercase tracking-widest hover:bg-brand-wine-dark transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              id="btn-personalize-sua-proposta"
            >
              <span>PERSONALIZE SUA PROPOSTA</span>
            </a>
          </div>
        </section>
      )}
      
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
