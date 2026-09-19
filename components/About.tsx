'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { brandConfig } from '@/lib/config';
import { Instagram } from 'lucide-react';

// Formatos aceitos e lidos automaticamente em ordem de prioridade (.jpg, .jpeg, .png, .webp)
const CANDIDATE_IMAGES = [
  '/images/fotografa.jpg',
  '/images/fotografa.jpeg',
  '/images/fotografa.png',
  '/images/fotografa.webp',
  brandConfig.about.image,
  brandConfig.about.imageFallback,
].filter((val, idx, self) => Boolean(val) && self.indexOf(val) === idx);

export default function About() {
  const [candidateIndex, setCandidateIndex] = useState(0);

  const handleImageError = () => {
    setCandidateIndex((prev) => {
      if (prev + 1 < CANDIDATE_IMAGES.length) {
        return prev + 1;
      }
      return prev;
    });
  };

  const currentSrc = CANDIDATE_IMAGES[candidateIndex];

  return (
    <section 
      className="py-20 md:py-28 lg:py-36 bg-brand-beige w-full overflow-hidden" 
      id="sobre"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Image Frame - Asymmetric Editorial Offset Layout */}
          <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-start">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md aspect-[4/5] bg-brand-beige-dark shadow-sm"
              id="about-photo-wrapper"
            >
              {/* Offset Background Card for visual depth */}
              <div className="absolute -inset-4 border border-brand-wine/15 translate-x-2 translate-y-2 pointer-events-none" />
              
              <div className="relative w-full h-full overflow-hidden bg-brand-beige-dark">
                <Image
                  key={currentSrc}
                  src={currentSrc}
                  alt="Alessandra Modkovski - Fotógrafa"
                  fill
                  unoptimized
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 35vw"
                  className="object-cover object-center transition-transform duration-1000 hover:scale-[1.03]"
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>

          {/* Text content side */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-brand-wine uppercase block mb-4">
                {brandConfig.about.eyebrow}
              </span>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-text tracking-tight mb-8 font-serif">
                {brandConfig.about.title}
              </h2>
            </motion.div>

            {/* Editorial paragraphs */}
            <div className="space-y-6 max-w-2xl text-brand-text-soft text-sm md:text-base font-light leading-relaxed">
              {brandConfig.about.paragraphs.map((p, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* Premium Instagram integration */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10"
            >
              <a 
                href={brandConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 border border-brand-wine/30 hover:border-brand-wine text-brand-wine text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 hover:bg-brand-wine hover:text-white"
                id="about-instagram-btn"
              >
                <Instagram className="w-4 h-4 text-inherit" strokeWidth={1.5} />
                <span>VER INSTAGRAM</span>
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
