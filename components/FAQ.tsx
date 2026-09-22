'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqList: FaqItem[] = [
  {
    question: "Onde são realizados os ensaios e coberturas?",
    answer: "As propostas são para ensaios externos ou no local de trabalho do cliente. É possível também alugar um horário no estúdio, conforme a necessidade do projeto."
  },
  {
    question: "Como funciona a equipe durante o atendimento?",
    answer: "Trabalhamos em dupla, o que permite auxiliar e fazer com que todo o processo flua com tranquilidade, organização e agilidade."
  },
  {
    question: "Vocês atendem em outras cidades?",
    answer: "Sim! Podemos atender cidades próximas, sempre com uma programação organizada e previamente alinhada."
  },
  {
    question: "Vocês produzem conteúdo para o Instagram?",
    answer: "Também produzimos conteúdo para o seu Instagram, com estratégia e posicionamento. Cuidamos de tudo desde o roteiro até a entrega final, para você não precisar se preocupar com nada."
  },
  {
    question: "Posso fechar um orçamento sem contrato e nota fiscal?",
    answer: "Não. Por aqui fazemos tudo certinho para garantir segurança para ambas as partes. Nós fazemos contrato de prestação de serviço e emitimos a nota fiscal após a entrega."
  },
  {
    question: "Qual é o prazo de entrega dos materiais?",
    answer: "Os prazos de entrega variam conforme o pacote escolhido (geralmente entre 10 a 25 dias para fotos e vídeos), sempre detalhados na sua proposta. Caso seu projeto necessite de um prazo específico, podemos montar uma proposta personalizada"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-28 lg:py-36 bg-brand-cream w-full border-t border-brand-wine/10" id="faq-section">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        
        {/* Header Block */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-brand-wine uppercase block mb-4">
            DÚVIDAS FREQUENTES
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-brand-text tracking-tight font-serif mb-6">
            Perguntas & Respostas
          </h2>
          <div className="w-12 h-[1px] bg-brand-wine/35 mx-auto mb-6" />
          <p className="text-sm md:text-base text-brand-text-soft leading-relaxed font-light max-w-xl mx-auto">
            Tudo o que você precisa saber sobre nossos serviços, atendimento e formas de trabalho.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqList.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="bg-white rounded-2xl border border-brand-wine/15 overflow-hidden shadow-[0_4px_20px_rgba(78,0,0,0.03)] transition-all duration-300"
                id={`faq-item-${index + 1}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-5 px-6 md:px-8 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-brand-cream/30 transition-colors"
                >
                  <span className="font-serif text-lg md:text-xl text-brand-text font-normal">
                    {item.question}
                  </span>
                  <span className={`w-8 h-8 rounded-full bg-brand-cream flex items-center justify-center text-brand-wine shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-brand-wine text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 md:px-8 pb-6 pt-2 text-sm md:text-base text-brand-text-soft font-light leading-relaxed border-t border-brand-wine/5">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
