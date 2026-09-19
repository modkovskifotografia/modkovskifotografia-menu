'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { brandConfig, InstallmentOption, PackageItem } from '@/lib/config';
import { Check, MessageCircle, CreditCard, ChevronDown, CheckCircle2 } from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';

export default function Packages() {
  const [openInstallments, setOpenInstallments] = useState<Record<string, boolean>>({});
  const [selectedInstallments, setSelectedInstallments] = useState<Record<string, InstallmentOption | null>>({});

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const toggleInstallment = (pkgId: string) => {
    setOpenInstallments(prev => ({
      ...prev,
      [pkgId]: !prev[pkgId]
    }));
  };

  const handleSelectInstallment = (pkgId: string, installment: InstallmentOption) => {
    setSelectedInstallments(prev => {
      const current = prev[pkgId];
      if (current?.times === installment.times) {
        // Toggle off back to Pix
        return { ...prev, [pkgId]: null };
      }
      return { ...prev, [pkgId]: installment };
    });
  };

  const getWhatsAppMessage = (pkg: PackageItem, expNumber: string) => {
    const selectedInst = selectedInstallments[pkg.id];
    
    if (selectedInst) {
      return `Olá! Vi a proposta da Modkovski Fotografia e quero reservar a minha data para a ${expNumber}: ${pkg.name} com a opção de parcelamento em ${selectedInst.times} de ${selectedInst.value} no cartão de crédito.`;
    }
    
    return `Olá! Vi a proposta da Modkovski Fotografia e quero reservar a minha data para a ${expNumber}: ${pkg.name} (${pkg.price} via Pix).`;
  };

  return (
    <div className="w-full flex flex-col" id="experiencias-wrapper">
      {brandConfig.packageSections.map((section, sIndex) => (
        <React.Fragment key={section.id}>
          <section 
            className={`py-20 md:py-28 lg:py-36 w-full ${sIndex % 2 === 1 ? 'bg-brand-cream border-t border-brand-wine/10' : 'bg-brand-beige'}`} 
            id={`experiencias-${section.id}`}
          >
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            
            {/* Intro Header */}
            <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-brand-wine uppercase block mb-4">
                {section.eyebrow}
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-brand-text tracking-tight font-serif mb-6">
                {section.title}
              </h2>
              <div className="w-12 h-[1px] bg-brand-wine/35 mx-auto mb-6" />
              <p className="text-sm md:text-base text-brand-text-soft leading-relaxed font-light">
                {section.description}
              </p>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
              {section.packages.map((pkg: PackageItem, index) => {
                const isFeatured = pkg.isFeatured;
                const expNumber = `Experiência 0${index + 1}`;
                const isInstallmentOpen = !!openInstallments[pkg.id];
                const currentSelectedInst = selectedInstallments[pkg.id];
                const message = getWhatsAppMessage(pkg, expNumber);
                const waLink = `https://wa.me/${brandConfig.whatsApp.number}?text=${encodeURIComponent(message)}`;
                
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.98 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={`reveal-on-scroll animate-float relative flex flex-col justify-between p-6 md:p-7 bg-white transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] ${
                      isFeatured 
                        ? 'border-2 border-brand-wine scale-[1.02] lg:scale-[1.03] z-10 shadow-[0_15px_40px_rgba(96,0,0,0.12)]' 
                        : 'border border-brand-wine/10 hover:border-brand-wine/20'
                    }`}
                    style={{ animationDelay: `${index * 0.4}s`, animationDuration: `${5 + (index % 3)}s` }}
                    id={`package-card-${pkg.id}`}
                  >
                    {/* Highlight Badge */}
                    {isFeatured && pkg.badge && (
                      <div className="absolute top-0 right-6 -translate-y-1/2 bg-brand-wine text-white text-[8px] font-bold tracking-[0.2em] uppercase px-3 py-1 shadow-sm">
                        {pkg.badge}
                      </div>
                    )}

                    <div>
                      {/* Step / Number */}
                      <span className="text-[9px] font-bold tracking-[0.2em] text-brand-wine uppercase block mb-1.5">
                        {expNumber}
                      </span>
                      
                      {/* Name & Duration */}
                      <h3 className={`text-xl font-light text-brand-text tracking-tight font-serif ${pkg.duration ? 'mb-1.5' : 'mb-4 pb-4 border-b border-brand-wine/10'}`}>
                        {pkg.name}
                      </h3>
                      
                      {pkg.duration && (
                        <span className="text-xs text-brand-text-soft font-light block pb-4 border-b border-brand-wine/10">
                          {pkg.duration}
                        </span>
                      )}

                      {/* Bullet features */}
                      <ul className="mt-4 space-y-2.5 text-xs text-brand-text-soft font-light">
                        {pkg.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-2 leading-relaxed">
                            <Check className="w-3.5 h-3.5 text-brand-wine mt-0.5 shrink-0" strokeWidth={2} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing Block */}
                    <div className="mt-6 pt-4 border-t border-brand-wine/10">
                      <span className="text-[9.5px] uppercase tracking-widest text-brand-text-soft font-semibold block mb-1">
                        Investimento
                      </span>
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className="text-xl font-light text-brand-wine font-serif">
                          {pkg.price}
                        </span>
                        <span className="text-[10px] font-medium text-brand-text-soft uppercase tracking-wider">
                          no {pkg.paymentMethod}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-[10px] text-brand-text-soft mb-2.5">
                        <CreditCard className="w-3 h-3 text-brand-wine/60" />
                        <span>Reserva via sinal de 30%</span>
                      </div>

                      {/* Divider line below reserva */}
                      <div className="w-full h-[1px] bg-brand-wine/10 my-2.5" />

                      {/* Parcelamento Tab / Accordion */}
                      {pkg.installments && pkg.installments.length > 0 && (
                        <div className="mb-3">
                          <button
                            type="button"
                            onClick={() => toggleInstallment(pkg.id)}
                            className={`w-full flex items-center justify-between py-1.5 px-2.5 border transition-all duration-200 cursor-pointer ${
                              isInstallmentOpen || currentSelectedInst
                                ? 'bg-brand-cream border-brand-wine/30 text-brand-wine font-medium'
                                : 'bg-brand-cream/60 hover:bg-brand-cream border-brand-wine/15 text-[10.5px] text-brand-wine font-medium'
                            }`}
                            id={`btn-parcelamento-${pkg.id}`}
                            aria-expanded={isInstallmentOpen}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="tracking-wider uppercase font-semibold text-[10px]">
                                {currentSelectedInst ? `Parcelado (${currentSelectedInst.times})` : 'Parcelamento'}
                              </span>
                            </div>
                            <ChevronDown 
                              className={`w-3.5 h-3.5 text-brand-wine transition-transform duration-300 ${
                                isInstallmentOpen ? 'rotate-180' : ''
                              }`} 
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {isInstallmentOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="overflow-hidden border-x border-b border-brand-wine/15 bg-brand-cream/40"
                              >
                                <div className="p-2">
                                  <p className="text-[9.5px] text-brand-text-soft font-light mb-1.5 text-center italic">
                                    Selecione a opção desejada:
                                  </p>
                                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                                    {pkg.installments.map((inst, iIdx) => {
                                      const isSelected = currentSelectedInst?.times === inst.times;
                                      return (
                                        <button
                                          type="button"
                                          key={iIdx}
                                          onClick={() => handleSelectInstallment(pkg.id, inst)}
                                          className={`flex items-center justify-between py-1 px-1.5 text-left border transition-all cursor-pointer ${
                                            isSelected 
                                              ? 'bg-brand-wine text-white border-brand-wine shadow-xs' 
                                              : 'bg-white/80 hover:bg-white border-brand-wine/10 text-brand-text hover:border-brand-wine/30'
                                          }`}
                                          id={`pkg-${pkg.id}-opt-${inst.times}`}
                                        >
                                          <span className={`text-[9.5px] font-semibold ${isSelected ? 'text-white' : 'text-brand-wine'}`}>
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
                                      onClick={() => setSelectedInstallments(prev => ({ ...prev, [pkg.id]: null }))}
                                      className="w-full text-center text-[9.5px] text-brand-wine hover:underline mt-1.5 pt-1 border-t border-brand-wine/10 font-medium cursor-pointer"
                                    >
                                      Voltar para valor à vista (Pix)
                                    </button>
                                  )}
                                  
                                  <span className="text-[8.5px] text-brand-text-soft/70 block mt-1 text-center font-light">
                                    Cartão de crédito
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Selected Option Feedback Indicator */}
                      <div className="mb-3 text-center">
                        {currentSelectedInst ? (
                          <div className="inline-flex items-center gap-1 text-[10px] text-brand-wine bg-brand-cream/80 px-2 py-0.5 rounded-xs border border-brand-wine/20">
                            <CheckCircle2 className="w-3 h-3 text-brand-wine" />
                            <span>Opção: <strong>{currentSelectedInst.times} de {currentSelectedInst.value}</strong></span>
                          </div>
                        ) : (
                          <span className="text-[9.5px] text-brand-text-soft/70 block font-light">
                            Opção: À vista ({pkg.price} no Pix)
                          </span>
                        )}
                      </div>



                      {/* WhatsApp Button */}
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-3 px-3 text-center text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center gap-1.5 ${
                          isFeatured 
                            ? 'bg-brand-wine text-white hover:bg-brand-wine-dark hover:-translate-y-0.5' 
                            : 'bg-brand-cream border border-brand-wine/20 text-brand-wine hover:bg-brand-wine hover:text-white hover:-translate-y-0.5'
                        }`}
                        id={`package-cta-${pkg.id}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-inherit shrink-0" strokeWidth={1.5} />
                        <span>RESERVAR DATA</span>
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>
          {sIndex === 0 && <BeforeAfterSlider />}
        </React.Fragment>
      ))}
    </div>
  );
}
