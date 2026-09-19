import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import FinalCTA from '@/components/FinalCTA';
import { brandConfig } from '@/lib/config';
import { Camera, Calendar, Clock, CheckCircle2, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Cobertura de Eventos | Modkovski Fotografia',
  description: 'Fotografia e filmagem profissional para aniversários, batizados, formaturas e eventos sociais em Rondônia e região.',
};

export default function EventosPage() {
  const whatsappUrl = `https://wa.me/${brandConfig.whatsApp.number}?text=${encodeURIComponent(
    'Olá Alessandra! Vi a página de Eventos no site www.modkovskifotografia.com.br e gostaria de um orçamento para cobertura.'
  )}`;

  return (
    <main className="w-full relative min-h-screen flex flex-col bg-brand-cream selection:bg-brand-wine selection:text-white pt-24">
      <Navbar />
      
      {/* Hero section for Eventos */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-brand-wine font-medium">
              Cobertura Especializada
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-brand-text mt-3 mb-6 leading-tight">
              Eventos que merecem ser eternizados
            </h1>
            <p className="text-brand-text-soft text-base md:text-lg mb-8 leading-relaxed">
              Aniversários de 1 ano, festas de família, formaturas, batizados e celebrações marcantes. Estar presente com sensibilidade e atenção aos detalhes para registrar cada sorriso espontâneo e abraço sincero.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-brand-wine text-white text-xs font-semibold tracking-widest uppercase shadow-lg hover:bg-brand-wine-dark hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5 fill-white text-brand-wine" />
                Orçamento para Evento
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-brand-wine/10 bg-brand-beige">
            <img
              src="https://picsum.photos/seed/modkovski-eventos/1200/900"
              alt="Cobertura de Eventos Modkovski Fotografia"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-16 bg-white border-y border-brand-wine/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-brand-wine font-medium">Como Funciona</span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-text mt-2">O que está incluso na cobertura</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-brand-cream border border-brand-wine/10 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-wine/10 text-brand-wine flex items-center justify-center font-serif font-bold text-xl">
                01
              </div>
              <h3 className="font-serif text-xl font-semibold text-brand-text">Olhar Atento e Discreto</h3>
              <p className="text-brand-text-soft text-sm leading-relaxed">
                Capturamos os momentos espontâneos e a energia real da sua celebração sem interferir no andamento do evento.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-brand-cream border border-brand-wine/10 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-wine/10 text-brand-wine flex items-center justify-center font-serif font-bold text-xl">
                02
              </div>
              <h3 className="font-serif text-xl font-semibold text-brand-text">Fotografia + Vídeo Brinde</h3>
              <p className="text-brand-text-soft text-sm leading-relaxed">
                Opção de cobertura combinada de fotos em alta resolução e vídeos curtos ideais para redes sociais e recordação familiar.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-brand-cream border border-brand-wine/10 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-wine/10 text-brand-wine flex items-center justify-center font-serif font-bold text-xl">
                03
              </div>
              <h3 className="font-serif text-xl font-semibold text-brand-text">Plataforma de Seleção</h3>
              <p className="text-brand-text-soft text-sm leading-relaxed">
                Galeria digital privativa e intuitiva para você selecionar suas fotos preferidas com total praticidade e rapidez.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
