import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import FinalCTA from '@/components/FinalCTA';
import { brandConfig } from '@/lib/config';
import { Video, CheckCircle2, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Produção Corporativa | Modkovski Fotografia',
  description: 'Produção de vídeos para redes sociais, Reels, TikTok, autoridade profissional e cobertura corporativa com planejamento e excelência.',
};

export default function CorporativoPage() {
  const whatsappUrl = `https://wa.me/${brandConfig.whatsApp.number}?text=${encodeURIComponent(
    'Olá Alessandra! Vim pelo site www.modkovskifotografia.com.br na página de Produção Corporativa e gostaria de alinhar um plano de vídeos.'
  )}`;

  return (
    <main className="w-full relative min-h-screen flex flex-col bg-brand-cream selection:bg-brand-wine selection:text-white pt-24">
      <Navbar />
      
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-brand-wine font-medium">
              Autoridade & Crescimento
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-brand-text mt-3 mb-6 leading-tight">
              Produção de Vídeo e Conteúdo Corporativo
            </h1>
            <p className="text-brand-text-soft text-base md:text-lg mb-8 leading-relaxed">
              Soluções completas para empresas, psicólogos, advogados, agências e profissionais que precisam de constância, qualidade e criatividade na produção de vídeos para Reels, TikTok e posicionamento de autoridade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-brand-wine text-white text-xs font-semibold tracking-widest uppercase shadow-lg hover:bg-brand-wine-dark hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5 fill-white text-brand-wine" />
                Falar sobre Corporativo
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-brand-wine/10 bg-brand-beige">
            <img
              src="https://picsum.photos/seed/modkovski-corporativo/1200/900"
              alt="Produção Corporativa Modkovski Fotografia"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Services Breakdown */}
      <section className="py-16 bg-white border-y border-brand-wine/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-brand-wine font-medium">Planos de Conteúdo</span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-text mt-2">Como ajudamos sua marca a se destacar</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-brand-cream border border-brand-wine/10 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-wine/10 text-brand-wine flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-brand-text">Roteirização & Direção</h3>
              <p className="text-brand-text-soft text-sm leading-relaxed">
                Planejamento completo de pautas, roteiros dinâmicos e direção durante a gravação para você se sentir seguro diante das câmeras.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-brand-cream border border-brand-wine/10 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-wine/10 text-brand-wine flex items-center justify-center font-serif font-bold text-xl">
                02
              </div>
              <h3 className="font-serif text-xl font-semibold text-brand-text">Pacotes Mensais</h3>
              <p className="text-brand-text-soft text-sm leading-relaxed">
                Opções de 4, 8 ou 12 vídeos mensais com entrega programada para manter sua presença digital ativa e profissional o ano todo.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-brand-cream border border-brand-wine/10 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-wine/10 text-brand-wine flex items-center justify-center font-serif font-bold text-xl">
                03
              </div>
              <h3 className="font-serif text-xl font-semibold text-brand-text">Edição Dinâmica & Legendas</h3>
              <p className="text-brand-text-soft text-sm leading-relaxed">
                Edição otimizada para retenção de público, trilhas sonoras adequadas, capas atraentes e legendas em formato profissional.
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
