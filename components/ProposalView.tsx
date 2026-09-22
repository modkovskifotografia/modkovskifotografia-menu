'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Check, 
  MessageCircle, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  FileCheck2,
  Copy,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ChevronDown
} from 'lucide-react';
import { 
  Proposal, 
  ProposalCategory, 
  CATEGORY_LABELS,
  calculateDefaultInstallments 
} from '@/lib/propostas';
import { fetchProposalBySlug } from '@/lib/propostas-service';
import { brandConfig, InstallmentOption } from '@/lib/config';

// Home Page Components
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Process from '@/components/Process';
import Testimonial from '@/components/Testimonial';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

import HomeView from '@/components/HomeView';

interface ProposalViewProps {
  category: ProposalCategory;
  slug: string;
}

export default function ProposalView({ category, slug }: ProposalViewProps) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [openInstallments, setOpenInstallments] = useState<Record<string, boolean>>({});
  const [selectedInstallments, setSelectedInstallments] = useState<Record<string, InstallmentOption | null>>({});
  const [openVideoInstallments, setOpenVideoInstallments] = useState<Record<string, boolean>>({});
  const [selectedVideoInstallments, setSelectedVideoInstallments] = useState<Record<string, InstallmentOption | null>>({});

  const videoSection = brandConfig.packageSections?.find((s) => s.id === 'sec-2') || brandConfig.packageSections?.[1];

  useEffect(() => {
    let isMounted = true;
    fetchProposalBySlug(category, slug).then((data) => {
      if (isMounted) {
        setProposal(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [category, slug]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const origin = 'https://www.modkovskifotografia.com.br';
      const fullUrl = `${origin}/propostas/${category}/${slug}`;
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const toggleInstallments = (pkgId: string) => {
    setOpenInstallments((prev) => ({
      ...prev,
      [pkgId]: !prev[pkgId],
    }));
  };

  const handleSelectInstallment = (pkgId: string, installment: InstallmentOption) => {
    setSelectedInstallments((prev) => {
      const current = prev[pkgId];
      if (current?.times === installment.times) {
        return { ...prev, [pkgId]: null };
      }
      return { ...prev, [pkgId]: installment };
    });
  };

  const getIndividualWhatsAppUrl = (
    pkgName: string,
    expNumber: string,
    price: string,
    selectedInst?: InstallmentOption | null
  ) => {
    const propTitle = proposal?.title || 'Proposta';
    const client = proposal?.clientName || '';
    let text = '';
    if (selectedInst) {
      text = `Olá Alessandra! Vi a ${propTitle}${proposal?.clientSlug !== 'padrao' && client ? ` para ${client}` : ''} e quero reservar a minha data para a ${expNumber}: ${pkgName} com a opção de parcelamento em ${selectedInst.times} de ${selectedInst.value} no cartão de crédito.`;
    } else {
      text = `Olá Alessandra! Vi a ${propTitle}${proposal?.clientSlug !== 'padrao' && client ? ` para ${client}` : ''} e quero reservar a minha data para a ${expNumber}: ${pkgName} (${price} via Pix).`;
    }
    return `https://wa.me/${brandConfig.whatsApp.number}?text=${encodeURIComponent(text)}`;
  };

  const toggleVideoInstallments = (pkgId: string) => {
    setOpenVideoInstallments((prev) => ({
      ...prev,
      [pkgId]: !prev[pkgId],
    }));
  };

  const handleSelectVideoInstallment = (pkgId: string, installment: InstallmentOption) => {
    setSelectedVideoInstallments((prev) => {
      const current = prev[pkgId];
      if (current?.times === installment.times) {
        return { ...prev, [pkgId]: null };
      }
      return { ...prev, [pkgId]: installment };
    });
  };

  const getIndividualVideoWhatsAppUrl = (
    pkgName: string,
    expNumber: string,
    price: string,
    selectedInst?: InstallmentOption | null
  ) => {
    const propTitle = proposal?.title || 'Proposta';
    const client = proposal?.clientName || '';
    let text = '';
    if (selectedInst) {
      text = `Olá Alessandra! Vi a ${propTitle}${proposal?.clientSlug !== 'padrao' && client ? ` para ${client}` : ''} e quero reservar a minha data para a Produção de vídeo (${expNumber}: ${pkgName}) com a opção de parcelamento em ${selectedInst.times} de ${selectedInst.value} no cartão de crédito.`;
    } else {
      text = `Olá Alessandra! Vi a ${propTitle}${proposal?.clientSlug !== 'padrao' && client ? ` para ${client}` : ''} e quero reservar a minha data para a Produção de vídeo (${expNumber}: ${pkgName} - ${price} via Pix).`;
    }
    return `https://wa.me/${brandConfig.whatsApp.number}?text=${encodeURIComponent(text)}`;
  };

  const getWhatsAppMessageUrl = (packageName?: string) => {
    const client = proposal?.clientName || 'meu projeto';
    const text = packageName
      ? `Olá Alessandra! Analisei a proposta personalizada para ${client} e gostaria de confirmar o pacote "${packageName}". Como podemos prosseguir com a reserva?`
      : `Olá Alessandra! Recebi a proposta personalizada para ${client} e gostaria de tirar algumas dúvidas sobre as opções.`;
    return `https://wa.me/${brandConfig.whatsApp.number}?text=${encodeURIComponent(text)}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-brand-wine/20 border-t-brand-wine animate-spin mb-4" />
        <p className="font-serif text-lg text-brand-text">Carregando proposta exclusiva...</p>
      </main>
    );
  }

  // Not found or deleted
  if (!proposal) {
    return (
      <main className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-brand-wine/10">
          <div className="w-16 h-16 rounded-full bg-brand-wine/10 text-brand-wine flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-brand-wine font-semibold block mb-2">
            Link Expirado ou Indisponível
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-brand-text font-normal mb-4">
            Proposta Não Encontrada
          </h1>
          <p className="text-sm text-brand-text-soft leading-relaxed mb-8">
            Esta proposta personalizada já foi encerrada ou o link não está mais ativo. Se você precisa de um novo orçamento ou deseja tirar dúvidas, fale diretamente com a Alessandra no WhatsApp.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/${brandConfig.whatsApp.number}?text=${encodeURIComponent('Olá Alessandra! Tentei acessar meu link de proposta personalizada, mas ele não está mais disponível. Gostaria de conversar com você.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-full bg-brand-wine text-white text-xs font-semibold tracking-wider uppercase shadow-md hover:bg-brand-wine-dark transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              Falar no WhatsApp
            </a>
            <Link
              href="/"
              className="w-full py-3 px-6 rounded-full border border-brand-wine/20 text-brand-text text-xs font-medium tracking-wider uppercase hover:bg-brand-wine/5 transition-all"
            >
              Conhecer o Site Oficial
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const effectiveWelcomeMessage = proposal.category === 'individual'
    ? (proposal.welcomeMessage && !proposal.welcomeMessage.includes('É uma alegria apresentar')
        ? proposal.welcomeMessage
        : 'Meu objetivo é transformar o nosso ensaio em um momento leve e divertido. Vou te guiar em cada passo para que a timidez vá embora e você se sinta em casa logo no primeiro clique.')
    : proposal.welcomeMessage;

  const isRestricted = ['individual', 'casal', 'corporativo', 'evento', 'personalizado'].includes(proposal.category);

  return (
    <main className="w-full relative min-h-screen flex flex-col bg-brand-cream selection:bg-brand-wine selection:text-white pt-20" id="main-proposal-page">
      
      {/* 1. Barra de Navegação Superior (Exatamente igual à página Início) */}
      <Navbar />

      {/* 2. Banner Superior Exclusivo de Proposta Personalizada para o Cliente */}
      <div className="w-full bg-brand-wine text-white py-3 px-4 sm:px-8 border-b border-white/10 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest">
              {CATEGORY_LABELS[proposal.category] || proposal.category}
            </span>
            <span className="text-xs text-white/90">
              {proposal.category === 'corporativo' ? (
                <>Proposta Corporativa para <strong className="text-white">{proposal.clientName}</strong></>
              ) : proposal.category === 'casamento' ? (
                <>Cobertura de casamento para <strong className="text-white">{proposal.clientName}</strong></>
              ) : proposal.clientSlug === 'padrao' ? (
                <>Proposta Oficial de <strong className="text-white">Ensaio Individual</strong></>
              ) : (
                <>Proposta Exclusiva preparada para <strong className="text-white underline decoration-white/40 underline-offset-2">{proposal.clientName}</strong></>
              )}
            </span>
            <span className="text-white/60 hidden md:inline">•</span>
            <span className="text-[11px] text-white/80 hidden md:inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-white/70" />
              Válida por {proposal.validityDays} dias
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] text-white transition-colors"
              title="Copiar link da proposta"
            >
              {copied ? <CheckCircle2 className="w-3 h-3 text-green-300" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Link Copiado!' : 'Copiar Link'}</span>
            </button>

            <a
              href="#orcamento-personalizado"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-brand-wine text-[11px] font-bold uppercase tracking-wider hover:bg-brand-cream transition-all shadow-sm"
            >
              Ver Valores e Pacotes ↓
            </a>
          </div>
        </div>
      </div>

      {/* 3. Saudação Especial & Apresentação da Proposta */}
      <section className="w-full py-8 sm:py-10 px-4 sm:px-6 lg:px-8 bg-brand-cream/80 border-b border-brand-wine/10">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(78,0,0,0.05)] border border-brand-wine/15">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-brand-wine" />
                <span className="text-xs uppercase tracking-[0.2em] text-brand-wine font-semibold">
                  Orçamento Personalizado & Confidencial
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-brand-text font-normal mb-2">
                {proposal.title}
              </h1>
              <p className="text-sm text-brand-text-soft max-w-2xl leading-relaxed mb-4">
                {proposal.subtitle}
              </p>
              
              {/* Personal message from Alessandra */}
              <div className="bg-brand-cream/40 p-4 sm:p-5 rounded-2xl border-l-4 border-brand-wine text-xs sm:text-sm text-brand-text italic leading-relaxed">
                “{effectiveWelcomeMessage}”
                <div className="mt-2 text-right not-italic font-semibold text-brand-wine text-xs">
                  — Alessandra Modkovski
                </div>
              </div>
            </div>

            {/* Quick Summary Badge */}
            <div className="shrink-0 bg-brand-cream/60 border border-brand-wine/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center min-w-[200px]">
              <span className="text-[10px] uppercase tracking-widest text-brand-wine font-bold mb-1">
                {proposal.clientSlug === 'padrao' ? 'Proposta Oficial' : 'Cliente Exclusivo'}
              </span>
              <span className="font-serif text-xl sm:text-2xl text-brand-wine font-bold mb-3">
                {proposal.category === 'corporativo'
                  ? `Corporativo para ${proposal.clientName}`
                  : proposal.category === 'casamento'
                    ? `Cobertura de casamento para ${proposal.clientName}`
                    : proposal.clientSlug === 'padrao' ? 'Ensaio Individual' : proposal.clientName}
              </span>
              <a
                href={getWhatsAppMessageUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-full bg-brand-wine text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-brand-wine-dark transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Apresentação da Marca & Hero da Página Início */}
      <Hero 
        fotoTargetId={proposal.category === 'individual' ? 'ensaio-fotografico' : 'orcamento-personalizado'}
        videoTargetId="producao-de-video"
        videoButtonWine={proposal.category === 'individual'}
        fotoButtonText={proposal.category === 'casamento' ? 'VER PROPOSTA' : 'VER PROPOSTA FOTOGRÁFICA'}
        hideVideoButton={proposal.category === 'casamento'}
        hideProposalButtons={isRestricted}
      />

      {/* 5. Conexão com a Fotógrafa (About) */}
      {!isRestricted && <About />}
      
      {/* 6. Portfólio Completo de Imagens e Vídeos */}
      {proposal.category === 'individual' ? (
        <Portfolio limitSlots={3} showViewMoreButton={true} showViewPortfolioButton={true} />
      ) : (
        <Portfolio showViewPortfolioButton={true} />
      )}
      
      {/* 7. SEÇÃO DE PACOTES E ORÇAMENTO EXCLUSIVO DO CLIENTE */}
      {!isRestricted && (
        <section 
          id={proposal.category === 'individual' ? 'ensaio-fotografico' : 'orcamento-personalizado'} 
          className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-brand-wine/10 relative"
        >
          <span id="orcamento-personalizado" className="sr-only" />
          <span id="ensaio-fotografico" className="sr-only" />
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              {proposal.category === 'individual' ? (
                <>
                  <span className="text-xs uppercase tracking-[0.25em] text-brand-wine font-semibold block mb-2">
                    A PROPOSTA
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-brand-text font-normal mb-3">
                    Ensaio fotográfico
                  </h2>
                  <p className="text-brand-text-soft text-sm sm:text-base leading-relaxed">
                    Preparamos quatro possibilidades de ensaio para que você escolha o formato que mais combina com aquilo que deseja guardar. Desde um ensaio mais objetivo até uma experiência completa.
                  </p>
                </>
              ) : proposal.category === 'corporativo' && proposal.clientSlug === 'padrao' ? (
                <>
                  <span className="text-xs uppercase tracking-[0.25em] text-brand-wine font-semibold block mb-2">
                    A PROPOSTA
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-brand-text font-normal mb-3">
                    Ensaio fotográfico
                  </h2>
                  <p className="text-brand-text-soft text-sm sm:text-base leading-relaxed">
                    Preparamos quatro possibilidades de ensaio corporativo para que você escolha o formato que mais se alinha ao posicionamento da sua marca. Desde uma sessão mais objetiva até uma experiência completa de imagem profissional.
                  </p>
                </>
              ) : proposal.category === 'casamento' ? (
                <>
                  <span className="text-xs uppercase tracking-[0.25em] text-brand-wine font-semibold block mb-2">
                    A PROPOSTA
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-brand-text font-normal mb-3">
                    Sua cerimônia, do seu jeito.
                  </h2>
                  <p className="text-brand-text-soft text-sm sm:text-base leading-relaxed">
                    Preparamos quatro possibilidades de cobertura de casamento para que você escolha o formato perfeito para eternizar o dia mais especial da sua vida.
                  </p>
                </>
              ) : (
                <>
                  <span className="text-xs uppercase tracking-[0.25em] text-brand-wine font-semibold block mb-2">
                    Investimento & Experiências
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-brand-text font-normal mb-3">
                    Pacotes Selecionados para {proposal.clientName}
                  </h2>
                  <p className="text-brand-text-soft text-sm leading-relaxed">
                    Cada opção foi estruturada com máxima dedicação para entregar memórias completas e emocionantes.
                  </p>
                </>
              )}
            </div>

            {/* Grid de Pacotes Personalizados */}
            <div className={`grid gap-6 sm:gap-8 mb-14 ${
              proposal.packages.length === 1 
                ? 'max-w-md mx-auto grid-cols-1' 
                : proposal.packages.length === 2 
                  ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                  : proposal.packages.length === 4
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {proposal.packages.map((pkg, index) => {
                const expNumber = `EXPERIÊNCIA 0${index + 1}`;
                const isInstallmentOpen = !!openInstallments[pkg.id];
                const currentSelectedInst = selectedInstallments[pkg.id];
                const isFeatured = pkg.highlight;

                const individualWhatsAppUrl = getIndividualWhatsAppUrl(
                  pkg.name,
                  expNumber,
                  pkg.price,
                  currentSelectedInst
                );

                return (
                  <div
                    key={pkg.id}
                    className={`card-float rounded-3xl flex flex-col justify-between transition-all duration-300 relative bg-white ${
                      isFeatured
                        ? 'border-2 border-brand-wine shadow-[0_16px_45px_rgba(78,0,0,0.12)] scale-[1.02] p-6 sm:p-7'
                        : 'border border-brand-wine/15 shadow-[0_8px_30px_rgba(78,0,0,0.05)] p-6 sm:p-7 hover:shadow-xl hover:border-brand-wine/30'
                    }`}
                    style={{
                      animationDelay: `${(index % 4) * 0.7}s`,
                      animationDuration: `${4.5 + (index % 3) * 0.5}s`,
                    }}
                    id={`package-card-${pkg.id}`}
                  >
                    {/* Tag de destaque */}
                    {isFeatured && (
                      <div className="absolute -top-3 right-6 bg-brand-wine text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full shadow-sm">
                        EXPERIÊNCIA COMPLETA
                      </div>
                    )}

                    <div>
                      {/* EXPERIÊNCIA 0X */}
                      <span className="text-[10px] font-bold tracking-[0.25em] text-brand-wine uppercase block mb-1.5">
                        {expNumber}
                      </span>

                      {/* Nome do Ensaio */}
                      <h3 className="text-2xl font-serif text-brand-text font-normal mb-1">
                        {pkg.name}
                      </h3>

                      {/* Duração */}
                      {pkg.duration && (
                        <span className="text-xs sm:text-sm text-brand-text-soft font-light block pb-4 border-b border-brand-wine/10">
                          {pkg.duration}
                        </span>
                      )}

                      {/* Lista de Itens Inclusos / Features */}
                      <ul className="mt-4 space-y-2.5 text-xs text-brand-text-soft font-light">
                        {pkg.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-2 leading-relaxed">
                            <Check className="w-3.5 h-3.5 text-brand-wine mt-0.5 shrink-0" strokeWidth={2} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {pkg.extraNote && (
                        <p className="mt-4 text-[11px] text-brand-text-soft italic bg-brand-cream/60 p-3 rounded-xl border border-brand-wine/10 leading-relaxed">
                          {pkg.extraNote}
                        </p>
                      )}
                    </div>

                    {/* Bloco de Investimento e Parcelamento */}
                    <div className="mt-6 pt-4 border-t border-brand-wine/10">
                      <span className="text-[9.5px] uppercase tracking-widest text-brand-text-soft font-semibold block mb-1">
                        Investimento
                      </span>
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className="text-3xl sm:text-4xl font-light text-brand-wine font-serif">
                          {pkg.price}
                        </span>
                        <span className="text-[11px] font-medium text-brand-text-soft uppercase tracking-wider">
                          NO PIX
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-brand-text-soft mb-2.5">
                        <CreditCard className="w-3.5 h-3.5 text-brand-wine/60" />
                        <span>Reserva via sinal de 30%</span>
                      </div>

                      {/* Linha divisória */}
                      <div className="w-full h-[1px] bg-brand-wine/10 my-2.5" />

                      {/* Accordion de Parcelamento */}
                      {pkg.installments && pkg.installments.length > 0 && (
                        <div className="mb-3">
                          <button
                            type="button"
                            onClick={() => toggleInstallments(pkg.id)}
                            className={`w-full flex items-center justify-between py-2 px-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                              isInstallmentOpen || currentSelectedInst
                                ? 'bg-brand-cream border-brand-wine/30 text-brand-wine font-medium'
                                : 'bg-brand-cream/60 hover:bg-brand-cream border-brand-wine/15 text-[11px] text-brand-wine font-medium'
                            }`}
                            id={`btn-parcelamento-${pkg.id}`}
                            aria-expanded={isInstallmentOpen}
                          >
                            <span className="tracking-wider uppercase font-semibold text-[10.5px]">
                              {currentSelectedInst ? `Parcelado (${currentSelectedInst.times})` : 'PARCELAMENTO'}
                            </span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-brand-wine transition-transform duration-300 ${
                                isInstallmentOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {isInstallmentOpen && (
                            <div className="overflow-hidden border-x border-b border-brand-wine/15 rounded-b-xl bg-brand-cream/40 p-2.5 animate-in fade-in duration-200">
                              <p className="text-[9.5px] text-brand-text-soft font-light mb-2 text-center italic">
                                Selecione a opção desejada:
                              </p>
                              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                                {pkg.installments.map((inst, iIdx) => {
                                  const isSelected = currentSelectedInst?.times === inst.times;
                                  return (
                                    <button
                                      type="button"
                                      key={iIdx}
                                      onClick={() => handleSelectInstallment(pkg.id, inst)}
                                      className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-left border transition-all cursor-pointer ${
                                        isSelected
                                          ? 'bg-brand-wine text-white border-brand-wine shadow-xs'
                                          : 'bg-white/80 hover:bg-white border-brand-wine/10 text-brand-text hover:border-brand-wine/30'
                                      }`}
                                      id={`pkg-${pkg.id}-opt-${inst.times}`}
                                    >
                                      <span className={`text-[10px] font-semibold ${isSelected ? 'text-white' : 'text-brand-wine'}`}>
                                        {inst.times}:
                                      </span>
                                      <span className="text-[10px] font-medium">
                                        {inst.value}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>

                              {currentSelectedInst && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedInstallments((prev) => ({ ...prev, [pkg.id]: null }))}
                                  className="w-full text-center text-[10px] text-brand-wine hover:underline mt-2 pt-1.5 border-t border-brand-wine/10 font-medium cursor-pointer"
                                >
                                  Voltar para valor à vista (Pix)
                                </button>
                              )}

                              <span className="text-[9px] text-brand-text-soft/70 block mt-1.5 text-center font-light">
                                Cartão de crédito
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Indicador de Opção Selecionada */}
                      <div className="mb-3 text-center">
                        {currentSelectedInst ? (
                          <div className="inline-flex items-center gap-1.5 text-[10.5px] text-brand-wine bg-brand-cream/80 px-2.5 py-1 rounded-full border border-brand-wine/20">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-wine" />
                            <span>Opção: <strong>{currentSelectedInst.times} de {currentSelectedInst.value}</strong></span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-brand-text-soft/70 block font-light">
                            Opção: À vista ({pkg.price} no Pix)
                          </span>
                        )}
                      </div>

                      {/* Botão RESERVAR DATA */}
                      <a
                        href={individualWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-3.5 px-4 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
                          isFeatured
                            ? 'bg-brand-wine text-white hover:bg-brand-wine-dark hover:shadow-md hover:-translate-y-0.5'
                            : 'bg-brand-cream border border-brand-wine/25 text-brand-wine hover:bg-brand-wine hover:text-white hover:-translate-y-0.5'
                        }`}
                        id={`package-cta-${pkg.id}`}
                      >
                        <MessageCircle className="w-4 h-4 text-inherit shrink-0" strokeWidth={1.5} />
                        <span>RESERVAR DATA</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Garantias e Condições Comerciais */}
            <div className="bg-brand-cream/40 rounded-3xl p-6 sm:p-8 border border-brand-wine/10 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck2 className="w-4 h-4 text-brand-wine" />
                <span className="text-xs uppercase tracking-[0.2em] text-brand-wine font-semibold">
                  Condições de Pagamento e Reserva
                </span>
              </div>
              <p className="text-xs sm:text-sm text-brand-text-soft leading-relaxed mb-4">
                {proposal.investmentNote}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-brand-wine/10 text-xs text-brand-text">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                  <span>Contrato digital seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                  <span>Garantia de data na agenda</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                  <span>Emissão de Nota Fiscal</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Seção Personalizada se for categoria personalizado */}
      {proposal.category === 'personalizado' && (
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
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>PERSONALIZE SUA PROPOSTA</span>
            </a>
          </div>
        </section>
      )}

      {/* Campo Antes e Depois da Edição */}
      {!isRestricted && <BeforeAfterSlider />}

      {/* Campo Produção de vídeo */}
      {!isRestricted && proposal.category !== 'casamento' && (() => {
            const videoList = proposal.videoPackages !== undefined 
              ? proposal.videoPackages 
              : (videoSection?.packages || []);

            if (!videoList || videoList.length === 0) return null;

            return (
              <section className="py-20 md:py-28 lg:py-32 bg-brand-cream border-b border-brand-wine/10 w-full" id="producao-de-video">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
                  
                  {/* Intro Header */}
                  <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
                    <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-brand-wine uppercase block mb-3">
                      {videoSection?.eyebrow || 'A PROPOSTA'}
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-text tracking-tight font-serif mb-4">
                      {videoSection?.title || 'Produção de vídeo'}
                    </h2>
                    <div className="w-12 h-[1px] bg-brand-wine/35 mx-auto mb-6" />
                    <p className="text-sm md:text-base text-brand-text-soft leading-relaxed font-light">
                      {proposal.category === 'corporativo' && proposal.clientSlug === 'padrao'
                        ? 'Preparamos quatro formatos de produção de vídeo para atender aos seus objetivos, desde um modelo mais prático até o nível de autoridade. Caso a sua estratégia demande uma quantidade específica de vídeos, basta nos informar para personalizarmos a proposta.'
                        : (videoSection?.description || 'Preparamos quatro formatos de produção de vídeo para atender à sua estratégia, do modelo prático ao nível autoridade. Caso sua estratégia necessite de uma quantidade específica de vídeos, nos informe para ajustarmos.')}
                    </p>
                  </div>

                  {/* Video Packages Grid */}
                  <div className={`grid gap-6 sm:gap-8 items-stretch ${
                    videoList.length === 1
                      ? 'max-w-md mx-auto grid-cols-1'
                      : videoList.length === 2
                        ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                        : videoList.length === 3
                          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                  }`}>
                    {videoList.map((pkg, vIdx) => {
                      const expNumber = `EXPERIÊNCIA 0${vIdx + 1}`;
                      const isVideoOpen = !!openVideoInstallments[pkg.id];
                      const currentVideoInst = selectedVideoInstallments[pkg.id];
                      const isFeatured = ('highlight' in pkg ? pkg.highlight : (pkg as any).isFeatured) ?? false;
                      const videoWhatsAppUrl = getIndividualVideoWhatsAppUrl(
                        pkg.name,
                        expNumber,
                        pkg.price,
                        currentVideoInst
                      );
                      const installments = (pkg.installments && pkg.installments.length > 0)
                        ? pkg.installments
                        : calculateDefaultInstallments(pkg.price);

                      return (
                        <div
                          key={pkg.id}
                          className={`card-float rounded-3xl flex flex-col justify-between transition-all duration-300 relative bg-white ${
                            isFeatured
                              ? 'border-2 border-brand-wine shadow-[0_16px_45px_rgba(78,0,0,0.12)] scale-[1.02] p-6 sm:p-7'
                              : 'border border-brand-wine/15 shadow-[0_8px_30px_rgba(78,0,0,0.05)] p-6 sm:p-7 hover:shadow-xl hover:border-brand-wine/30'
                          }`}
                          style={{
                            animationDelay: `${(vIdx % 4) * 0.7}s`,
                            animationDuration: `${4.5 + (vIdx % 3) * 0.5}s`,
                          }}
                          id={`video-card-${pkg.id}`}
                        >
                          {/* Tag de destaque */}
                          {isFeatured && (
                            <div className="absolute -top-3 right-6 bg-brand-wine text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full shadow-sm">
                              {(pkg as any).badge || 'EXPERIÊNCIA COMPLETA'}
                            </div>
                          )}

                          <div>
                            {/* EXPERIÊNCIA 0X */}
                            <span className="text-[10px] font-bold tracking-[0.25em] text-brand-wine uppercase block mb-1.5">
                              {expNumber}
                            </span>

                            {/* Nome do Pacote */}
                            <h3 className="text-2xl font-serif text-brand-text font-normal mb-1">
                              {pkg.name}
                            </h3>

                            {/* Duração / Formato */}
                            {(pkg as any).duration && (
                              <span className="text-xs text-brand-text-soft font-light block pb-3">
                                {(pkg as any).duration}
                              </span>
                            )}

                            {/* Linha divisória sutil */}
                            <div className="w-full h-[1px] bg-brand-wine/10 mb-4" />

                            {/* Lista de Features */}
                            <ul className="space-y-2.5 text-xs text-brand-text-soft font-light">
                              {pkg.features.map((feature, fIndex) => (
                                <li key={fIndex} className="flex items-start gap-2 leading-relaxed">
                                  <Check className="w-3.5 h-3.5 text-brand-wine mt-0.5 shrink-0" strokeWidth={2} />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Bloco de Investimento e Parcelamento */}
                          <div className="mt-6 pt-4 border-t border-brand-wine/10">
                            <span className="text-[9.5px] uppercase tracking-widest text-brand-text-soft font-semibold block mb-1">
                              Investimento
                            </span>
                            <div className="flex items-baseline gap-1.5 mb-1">
                              <span className="text-3xl sm:text-4xl font-light text-brand-wine font-serif">
                                {pkg.price}
                              </span>
                              <span className="text-[11px] font-medium text-brand-text-soft uppercase tracking-wider">
                                NO PIX
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[11px] text-brand-text-soft mb-2.5">
                              <CreditCard className="w-3.5 h-3.5 text-brand-wine/60" />
                              <span>Reserva via sinal de 30%</span>
                            </div>

                            {/* Linha divisória */}
                            <div className="w-full h-[1px] bg-brand-wine/10 my-2.5" />

                            {/* Accordion de Parcelamento */}
                            {installments && installments.length > 0 && (
                              <div className="mb-3">
                                <button
                                  type="button"
                                  onClick={() => toggleVideoInstallments(pkg.id)}
                                  className={`w-full flex items-center justify-between py-2 px-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                                    isVideoOpen || currentVideoInst
                                      ? 'bg-brand-cream border-brand-wine/30 text-brand-wine font-medium'
                                      : 'bg-brand-cream/60 hover:bg-brand-cream border-brand-wine/15 text-[11px] text-brand-wine font-medium'
                                  }`}
                                  id={`btn-parcelamento-video-${pkg.id}`}
                                  aria-expanded={isVideoOpen}
                                >
                                  <span className="tracking-wider uppercase font-semibold text-[10.5px]">
                                    {currentVideoInst ? `Parcelado (${currentVideoInst.times})` : 'PARCELAMENTO'}
                                  </span>
                                  <ChevronDown
                                    className={`w-3.5 h-3.5 text-brand-wine transition-transform duration-300 ${
                                      isVideoOpen ? 'rotate-180' : ''
                                    }`}
                                  />
                                </button>

                                {isVideoOpen && (
                                  <div className="overflow-hidden border-x border-b border-brand-wine/15 rounded-b-xl bg-brand-cream/40 p-2.5 animate-in fade-in duration-200">
                                    <p className="text-[9.5px] text-brand-text-soft font-light mb-2 text-center italic">
                                      Selecione a opção desejada:
                                    </p>
                                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                                      {installments.map((inst, iIdx) => {
                                        const isSelected = currentVideoInst?.times === inst.times;
                                        return (
                                          <button
                                            type="button"
                                            key={iIdx}
                                            onClick={() => handleSelectVideoInstallment(pkg.id, inst)}
                                            className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-left border transition-all cursor-pointer ${
                                              isSelected
                                                ? 'bg-brand-wine text-white border-brand-wine shadow-xs'
                                                : 'bg-white/80 hover:bg-white border-brand-wine/10 text-brand-text hover:border-brand-wine/30'
                                            }`}
                                            id={`pkg-video-${pkg.id}-opt-${inst.times}`}
                                          >
                                            <span className={`text-[10px] font-semibold ${isSelected ? 'text-white' : 'text-brand-wine'}`}>
                                              {inst.times}:
                                            </span>
                                            <span className="text-[10px] font-medium">
                                              {inst.value}
                                            </span>
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {currentVideoInst && (
                                      <button
                                        type="button"
                                        onClick={() => setSelectedVideoInstallments((prev) => ({ ...prev, [pkg.id]: null }))}
                                        className="w-full text-center text-[10px] text-brand-wine hover:underline mt-2 pt-1.5 border-t border-brand-wine/10 font-medium cursor-pointer"
                                      >
                                        Voltar para valor à vista (Pix)
                                      </button>
                                    )}

                                    <span className="text-[9px] text-brand-text-soft/70 block mt-1.5 text-center font-light">
                                      Cartão de crédito
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Indicador de Opção Selecionada */}
                            <div className="mb-3 text-center">
                              {currentVideoInst ? (
                                <div className="inline-flex items-center gap-1.5 text-[10.5px] text-brand-wine bg-brand-cream/80 px-2.5 py-1 rounded-full border border-brand-wine/20">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-wine" />
                                  <span>Opção: <strong>{currentVideoInst.times} de {currentVideoInst.value}</strong></span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-brand-text-soft/70 block font-light">
                                  Opção: À vista ({pkg.price} no Pix)
                                </span>
                              )}
                            </div>

                            {/* Botão RESERVAR DATA */}
                            <a
                              href={videoWhatsAppUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-full py-3.5 px-4 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
                                isFeatured
                                  ? 'bg-brand-wine text-white hover:bg-brand-wine-dark hover:shadow-md hover:-translate-y-0.5'
                                  : 'bg-brand-cream border border-brand-wine/25 text-brand-wine hover:bg-brand-wine hover:text-white hover:-translate-y-0.5'
                              }`}
                              id={`video-cta-${pkg.id}`}
                            >
                              <MessageCircle className="w-4 h-4 text-inherit shrink-0" strokeWidth={1.5} />
                              <span>RESERVAR DATA</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })()}

      {/* 8. Processo de Contratação (Como funciona - Igual à página Início) */}
      {!isRestricted && <Process />}
      
      {/* 9. Depoimentos das Clientes (Igual à página Início) */}
      <Testimonial buttonWine={true} />
      
      {/* 10. Chamada Final para Contratação via WhatsApp (Igual à página Início) */}
      <FinalCTA />
      
      {/* 11. Rodapé da Página (Igual à página Início) */}
      <Footer />

      {/* 12. Botões Flutuantes de WhatsApp e Voltar ao Topo */}
      <FloatingWhatsApp />
    </main>
  );
}
