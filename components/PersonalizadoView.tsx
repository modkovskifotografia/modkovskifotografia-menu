'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import FAQ from '@/components/FAQ';
import Testimonial from '@/components/Testimonial';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { brandConfig } from '@/lib/config';
import { 
  MessageCircle, 
  Instagram, 
  Send, 
  Calendar, 
  Camera, 
  Video, 
  Smartphone, 
  Check, 
  Sparkles, 
  HelpCircle,
  Share2,
  Search
} from 'lucide-react';

export default function PersonalizadoView() {
  // Form State
  const [name, setName] = useState('');
  const [projectDate, setProjectDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Fotos']);
  const [referralSource, setReferralSource] = useState<string>('Instagram');
  const [formError, setFormError] = useState('');

  const interestOptions = [
    { id: 'Fotos', label: 'Fotos', icon: Camera, desc: 'Registros fotográficos' },
    { id: 'Vídeos', label: 'Vídeos', icon: Video, desc: 'Captação e edição' },
    { id: 'Storymaker (tempo real)', label: 'Storymaker (tempo real)', icon: Smartphone, desc: 'Cobertura dinâmica para redes sociais no mesmo dia' },
  ];

  const referralOptions = [
    { id: 'Instagram', label: 'Instagram', icon: Instagram },
    { id: 'Indicação', label: 'Indicação', icon: Share2 },
    { id: 'Google', label: 'Google', icon: Search },
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((item) => item !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Por favor, preencha seu nome para que possamos te atender pelo nome.');
      return;
    }

    setFormError('');

    // Format WhatsApp message
    const interestsText = selectedInterests.length > 0 ? selectedInterests.join(', ') : 'A definir';
    const dateText = projectDate.trim() ? projectDate.trim() : 'A definir';
    const descText = description.trim() ? description.trim() : 'Gostaria de alinhar os detalhes da proposta.';

    const messageLines = [
      `Olá Alessandra! Vim pela página de *Proposta Sob Medida* do site e gostaria de solicitar um orçamento personalizado:`,
      ``,
      `👤 *Nome:* ${name.trim()}`,
      `📅 *Data do projeto:* ${dateText}`,
      `✨ *Serviços de interesse:* ${interestsText}`,
      `🔍 *Onde nos achou:* ${referralSource}`,
      ``,
      `📝 *Sobre o projeto:*`,
      `${descText}`,
    ];

    const fullMessage = messageLines.join('\n');
    const waUrl = `https://wa.me/${brandConfig.whatsApp.number}?text=${encodeURIComponent(fullMessage)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="w-full relative min-h-screen flex flex-col bg-brand-cream selection:bg-brand-wine selection:text-white pt-20" id="main-personalizado">
      {/* Barra de Navegação Superior */}
      <Navbar />

      {/* 1. SEÇÃO PRINCIPAL NO TOPO: PROPOSTA SOB MEDIDA */}
      <section className="pt-12 pb-16 md:pt-16 md:pb-20 px-4 sm:px-6 md:px-12 relative overflow-hidden" id="proposta-sob-medida">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-brand-wine/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-wine/10 text-brand-wine text-[11px] uppercase tracking-[0.25em] font-semibold mb-4 border border-brand-wine/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              PROPOSTA SOB MEDIDA
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-text mb-6 tracking-tight leading-tight font-light">
              Crie a experiência ideal <br className="hidden sm:inline" />
              <span className="italic font-normal text-brand-wine">para o seu projeto</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-brand-text-soft leading-relaxed max-w-2xl mx-auto font-light mb-8">
              Caso você queira fazer uma proposta sob medida, com ajuste de quantidades de fotos e vídeos, prazo de entrega ou variadas locações para ensaios, você tem total flexibilidade para criar a experiência ideal para o seu projeto.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. SEÇÃO DE CONTATO & FORMULÁRIO */}
      <section className="pb-24 px-4 sm:px-6 md:px-12 relative" id="contato-personalizado">
        <div className="max-w-4xl mx-auto">
          
          {/* Card com os Canais de Contato Direto (WhatsApp e Instagram) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-brand-wine/15 shadow-md mb-10">
            <div className="text-center mb-8 pb-6 border-b border-brand-wine/10 max-w-xl mx-auto">
              <span className="text-[10px] font-bold text-brand-wine uppercase tracking-[0.25em] block mb-1">
                Canais Diretos
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-brand-text font-semibold mb-2">
                CONTATO
              </h2>
              <p className="text-xs sm:text-sm text-brand-text-soft leading-relaxed">
                Fale diretamente com a Alessandra pelo WhatsApp ou acompanhe nossas produções no Instagram.
              </p>
            </div>

            {/* Grid dos botões de WhatsApp e Instagram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* WhatsApp Card & Button */}
              <div className="bg-brand-cream/40 rounded-2xl p-5 border border-brand-wine/15 flex flex-col justify-between hover:border-brand-wine/40 transition-all">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-wine/10 text-brand-wine flex items-center justify-center shrink-0 border border-brand-wine/15">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-wine/80 block">
                      Atendimento Direto
                    </span>
                    <h3 className="font-serif text-base font-bold text-brand-text">
                      WhatsApp
                    </h3>
                    <p className="text-xs text-brand-text-soft font-mono">
                      (69) 99971-8820
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${brandConfig.whatsApp.number}?text=${encodeURIComponent('Olá Alessandra! Gostaria de tirar dúvidas sobre um orçamento personalizado.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-wine text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-wine-dark transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                  id="btn-contato-whatsapp"
                >
                  <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                  <span>Conversar no WhatsApp</span>
                </a>
              </div>

              {/* Instagram Card & Button */}
              <div className="bg-brand-cream/40 rounded-2xl p-5 border border-brand-wine/15 flex flex-col justify-between hover:border-brand-wine/40 transition-all">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-wine/10 text-brand-wine flex items-center justify-center shrink-0 border border-brand-wine/15">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-wine/80 block">
                      Portfólio & Bastidores
                    </span>
                    <h3 className="font-serif text-base font-bold text-brand-text">
                      Instagram
                    </h3>
                    <p className="text-xs text-brand-text-soft">
                      {brandConfig.instagram.handle}
                    </p>
                  </div>
                </div>

                <a
                  href={brandConfig.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-brand-wine/30 text-brand-wine text-xs font-semibold uppercase tracking-wider hover:bg-brand-wine hover:text-white transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
                  id="btn-contato-instagram"
                >
                  <Instagram className="w-4 h-4 shrink-0" />
                  <span>Acessar Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* 3. FORMULÁRIO DE BRIEFING & ORÇAMENTO SOB MEDIDA */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-brand-wine/15 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-wine via-brand-wine-dark to-brand-wine" />

            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-[10px] font-bold text-brand-wine uppercase tracking-[0.25em] block mb-1">
                Formulário do Projeto
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-brand-text font-bold mb-2">
                Conte-nos sobre o seu projeto
              </h3>
              <p className="text-xs sm:text-sm text-brand-text-soft leading-relaxed">
                Preencha os dados abaixo. Ao clicar no botão ao final, todas as informações serão formatadas e enviadas diretamente para o nosso WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSendWhatsApp} className="space-y-6">
              {/* Linha 1: Nome e Data do Projeto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Nome */}
                <div>
                  <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                    Nome <span className="text-brand-wine">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formError) setFormError('');
                    }}
                    placeholder="Seu nome completo"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-brand-wine/20 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine bg-brand-cream/20 placeholder:text-brand-text-soft/60"
                  />
                </div>

                {/* Data do projeto */}
                <div>
                  <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                    Data do projeto
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={projectDate}
                      onChange={(e) => setProjectDate(e.target.value)}
                      placeholder="Ex: 20/11/2026 ou Em breve"
                      className="w-full px-4 py-3 rounded-xl border border-brand-wine/20 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine bg-brand-cream/20 placeholder:text-brand-text-soft/60"
                    />
                    <Calendar className="w-4 h-4 text-brand-wine/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Linha 2: Opções que tem interesse (Caixas de Seleção Interativas) */}
              <div>
                <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                  Opções que tem interesse
                </label>
                <p className="text-[11px] text-brand-text-soft mb-3">
                  Selecione uma ou mais opções que fazem sentido para a sua necessidade:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {interestOptions.map((opt) => {
                    const isSelected = selectedInterests.includes(opt.id);
                    const Icon = opt.icon;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => toggleInterest(opt.id)}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                          isSelected
                            ? 'bg-brand-wine/5 border-brand-wine shadow-xs ring-1 ring-brand-wine'
                            : 'bg-brand-cream/20 border-brand-wine/15 hover:border-brand-wine/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-brand-wine text-white' : 'bg-brand-wine/10 text-brand-wine'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-brand-wine border-brand-wine text-white' 
                              : 'border-brand-wine/30 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        <div>
                          <span className="font-semibold text-xs text-brand-text block mb-0.5">
                            {opt.label}
                          </span>
                          <span className="text-[10px] text-brand-text-soft leading-tight block">
                            {opt.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Linha 3: Onde nos achou? (Caixa de Seleção / Escolha) */}
              <div>
                <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                  Onde nos achou?
                </label>
                <p className="text-[11px] text-brand-text-soft mb-3">
                  Como você chegou até a Modkovski Fotografia:
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {referralOptions.map((ref) => {
                    const isSelected = referralSource === ref.id;
                    const Icon = ref.icon;
                    return (
                      <button
                        type="button"
                        key={ref.id}
                        onClick={() => setReferralSource(ref.id)}
                        className={`p-3.5 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 ${
                          isSelected
                            ? 'bg-brand-wine text-white border-brand-wine shadow-sm font-semibold'
                            : 'bg-brand-cream/20 border-brand-wine/15 text-brand-text hover:border-brand-wine/30'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-brand-wine'}`} />
                        <span className="text-xs">{ref.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Linha 4: Fale um pouco sobre o seu projeto */}
              <div>
                <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                  Fale um pouco sobre o seu projeto
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Gostaria de fotos e vídeos para meu casamento em um espaço aberto, duração de 3h, com ênfase na cerimônia e família..."
                  className="w-full px-4 py-3 rounded-xl border border-brand-wine/20 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine bg-brand-cream/20 placeholder:text-brand-text-soft/60 resize-y"
                />
              </div>

              {/* Mensagem de Erro se houver */}
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {formError}
                </div>
              )}

              {/* Botão Final: Enviar para o whatsapp */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-8 rounded-full bg-brand-wine text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-wine-dark transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
                  id="btn-enviar-para-whatsapp"
                >
                  <MessageCircle className="w-5 h-5 fill-current shrink-0" />
                  <span>Enviar para o whatsapp</span>
                </button>
                <p className="text-[11px] text-center text-brand-text-soft mt-3">
                  Ao clicar, uma mensagem pré-formatada será aberta no seu aplicativo do WhatsApp pronta para envio.
                </p>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* 4. FAQ */}
      <FAQ />

      {/* 5. Depoimentos */}
      <Testimonial />

      {/* 6. Chamada Final CTA */}
      <FinalCTA />

      {/* Rodapé */}
      <Footer />

      {/* Botões Flutuantes */}
      <FloatingWhatsApp />
    </main>
  );
}
