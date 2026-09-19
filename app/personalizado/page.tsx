import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import FinalCTA from '@/components/FinalCTA';
import { brandConfig } from '@/lib/config';
import { Sparkles, MessageCircle, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Pacotes Personalizados | Modkovski Fotografia',
  description: 'Soluções de fotografia e vídeo sob medida para o seu projeto, ensaio ou evento especial.',
};

export default function PersonalizadoPage() {
  const whatsappUrl = `https://wa.me/${brandConfig.whatsApp.number}?text=${encodeURIComponent(
    'Olá Alessandra! Vim pelo site www.modkovskifotografia.com.br na página de Pacotes Personalizados e gostaria de conversar sobre um projeto sob medida.'
  )}`;

  return (
    <main className="w-full relative min-h-screen flex flex-col bg-brand-cream selection:bg-brand-wine selection:text-white pt-24">
      <Navbar />
      
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-brand-wine font-medium">
              Sob Medida
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-brand-text mt-3 mb-6 leading-tight">
              Proposta Personalizada para o seu projeto
            </h1>
            <p className="text-brand-text-soft text-base md:text-lg mb-8 leading-relaxed">
              Cada história é única e pode exigir uma combinação específica de horas, entrega de fotos extras, locações diferentes ou formatos de vídeos sob medida. Vamos conversar sobre o que você precisa?
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-brand-wine text-white text-xs font-semibold tracking-widest uppercase shadow-lg hover:bg-brand-wine-dark hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5 fill-white text-brand-wine" />
                Montar Pacote no WhatsApp
              </a>
            </div>
          </div>
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-brand-wine/15 shadow-xl flex flex-col gap-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-wine/10 text-brand-wine flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-brand-text">O que podemos personalizar:</h3>
            <ul className="space-y-4">
              {[
                "Quantidade de horas de cobertura flexíveis",
                "Combinação exclusiva de Fotografia + Vídeo",
                "Ensaios externos em múltiplas locações",
                "Roteirização e direção especializada para marcas",
                "Prazos e entregas adaptados ao seu cronograma"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-brand-text-soft">
                  <CheckCircle2 className="w-5 h-5 text-brand-wine shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
