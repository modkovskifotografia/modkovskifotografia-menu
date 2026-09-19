'use client';

import React from 'react';
import { motion } from 'motion/react';
import { brandConfig } from '@/lib/config';

export default function Process() {
  return (
    <section 
      className="py-20 md:py-28 lg:py-36 bg-brand-beige w-full" 
      id="processo"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-brand-wine uppercase block mb-4">
            {brandConfig.process.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-brand-text tracking-tight font-serif mb-6">
            {brandConfig.process.title}
          </h2>
          <div className="w-12 h-[1px] bg-brand-wine/35 mx-auto" />
        </div>

        {/* Six Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {brandConfig.process.steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col relative"
              id={`process-step-${step.number}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-semibold tracking-wider text-brand-wine font-sans uppercase">
                  Passo {step.number}
                </span>
                <div className="h-[1px] flex-grow bg-brand-wine/10" />
              </div>
              
              <h3 className="text-2xl font-light text-brand-text font-serif tracking-tight mb-3">
                {step.title}
              </h3>
              
              <p className="text-sm text-brand-text-soft font-light leading-relaxed max-w-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
