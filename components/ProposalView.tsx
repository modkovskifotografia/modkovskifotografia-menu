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
import { Proposal, ProposalCategory, CATEGORY_LABELS } from '@/lib/propostas';
import { fetchProposalBySlug } from '@/lib/propostas-service';
import { brandConfig } from '@/lib/config';

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

interface ProposalViewProps {
  category: ProposalCategory;
  slug: string;
}

export default function ProposalView({ category, slug }: ProposalViewProps) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [openInstallments, setOpenInstallments] = useState<Record<string, boolean>>({});

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
      navigator.clipboard.writeText(window.location.href);
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
              Proposta Exclusiva preparada para <strong className="text-white underline decoration-white/40 underline-offset-2">{proposal.clientName}</strong>
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
                “{proposal.welcomeMessage}”
                <div className="mt-2 text-right not-italic font-semibold text-brand-wine text-xs">
                  — Alessandra Modkovski
                </div>
              </div>
            </div>

            {/* Quick Summary Badge */}
            <div className="shrink-0 bg-brand-cream/60 border border-brand-wine/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center min-w-[200px]">
              <span className="text-[10px] uppercase tracking-widest text-brand-wine font-bold mb-1">
                Cliente Exclusivo
              </span>
              <span className="font-serif text-xl sm:text-2xl text-brand-wine font-bold mb-3">
                {proposal.clientName}
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
      <Hero />

      {/* 5. Conexão com a Fotógrafa (About) */}
      <About />
      
      {/* 6. Portfólio Completo de Imagens e Vídeos */}
      <Portfolio />
      
      {/* 7. SEÇÃO DE PACOTES E ORÇAMENTO EXCLUSIVO DO CLIENTE */}
      <section id="orcamento-personalizado" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-brand-wine/10 relative">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-brand-wine font-semibold block mb-2">
              Investimento & Experiências
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-text font-normal mb-3">
              Pacotes Selecionados para {proposal.clientName}
            </h2>
            <p className="text-brand-text-soft text-sm">
              Cada opção foi estruturada com máxima dedicação para entregar memórias completas e emocionantes.
            </p>
          </div>

          {/* Grid de Pacotes Personalizados */}
          <div className={`grid gap-8 mb-14 ${
            proposal.packages.length === 1 
              ? 'max-w-md mx-auto grid-cols-1' 
              : proposal.packages.length === 2 
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {proposal.packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-3xl flex flex-col justify-between transition-all duration-300 relative ${
                  pkg.highlight
                    ? 'bg-brand-cream/30 border-2 border-brand-wine shadow-[0_16px_45px_rgba(78,0,0,0.12)] scale-[1.02] p-7 sm:p-8'
                    : 'bg-white border border-brand-wine/15 shadow-[0_8px_30px_rgba(78,0,0,0.05)] p-6 sm:p-7 hover:shadow-lg'
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-wine text-white text-[10px] uppercase tracking-widest font-semibold py-1 px-4 rounded-full shadow-md">
                    Mais Escolhido
                  </div>
                )}

                <div>
                  {/* Informações de Título e Preço */}
                  <div className="border-b border-brand-wine/10 pb-5 mb-5">
                    <h3 className="font-serif text-2xl text-brand-text font-medium mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-brand-wine font-medium flex items-center gap-1.5 mb-4">
                      <Clock className="w-3.5 h-3.5" />
                      {pkg.duration}
                    </p>

                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-3xl sm:text-4xl text-brand-wine font-bold">
                        {pkg.price}
                      </span>
                      <span className="text-xs text-brand-text-soft">
                        {pkg.paymentMethod || 'à vista no Pix'}
                      </span>
                    </div>

                    {/* Botão de Ver Parcelamento */}
                    {pkg.installments && pkg.installments.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-dashed border-brand-wine/15">
                        <button
                          type="button"
                          onClick={() => toggleInstallments(pkg.id)}
                          className="w-full flex items-center justify-between text-xs text-brand-wine hover:text-brand-wine-dark font-medium transition-colors py-1"
                        >
                          <span className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Ver opções de parcelamento (até 12x)</span>
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openInstallments[pkg.id] ? 'rotate-180' : ''}`} />
                        </button>

                        {openInstallments[pkg.id] && (
                          <div className="mt-2.5 p-3 rounded-xl bg-brand-cream/60 border border-brand-wine/10 space-y-1.5 text-xs text-brand-text-soft animate-in fade-in duration-200">
                            {pkg.installments.map((inst, i) => (
                              <div key={i} className="flex justify-between items-center py-0.5 border-b border-brand-wine/5 last:border-0">
                                <span>{inst.times} no cartão</span>
                                <span className="font-semibold text-brand-text">{inst.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Lista de Itens Inclusos */}
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-text-soft leading-relaxed">
                        <div className="w-4 h-4 rounded-full bg-brand-wine/10 text-brand-wine flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botão de Escolher este Pacote */}
                <a
                  href={getWhatsAppMessageUrl(pkg.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 px-5 rounded-full text-xs font-semibold tracking-wider uppercase text-center transition-all flex items-center justify-center gap-2 shadow-sm ${
                    pkg.highlight
                      ? 'bg-brand-wine text-white hover:bg-brand-wine-dark hover:shadow-md'
                      : 'bg-brand-cream text-brand-wine border border-brand-wine/25 hover:bg-brand-wine hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Escolher este Pacote</span>
                </a>
              </div>
            ))}
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

      {/* 8. Processo de Contratação (Como funciona - Igual à página Início) */}
      <Process />
      
      {/* 9. Depoimentos das Clientes (Igual à página Início) */}
      <Testimonial />
      
      {/* 10. Chamada Final para Contratação via WhatsApp (Igual à página Início) */}
      <FinalCTA />
      
      {/* 11. Rodapé da Página (Igual à página Início) */}
      <Footer />

      {/* 12. Botões Flutuantes de WhatsApp e Voltar ao Topo */}
      <FloatingWhatsApp />
    </main>
  );
}
