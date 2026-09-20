'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Camera, MessageCircle } from 'lucide-react';
import { brandConfig } from '@/lib/config';
import Logo from '@/components/Logo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Portfólio', href: '/portfolio' },
    { name: 'Corporativo', href: '/corporativo' },
    { name: 'Casamentos', href: '/casamentos' },
    { name: 'Eventos', href: '/eventos' },
    { name: 'Personalizado', href: '/personalizado' },
    { name: 'Depoimentos', href: '/depoimentos' },
  ];

  const whatsappUrl = `https://wa.me/${brandConfig.whatsApp.number}?text=${encodeURIComponent(
    'Olá Alessandra! Vim pelo site www.modkovskifotografia.com.br e gostaria de conversar sobre orçamento.'
  )}`;

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-brand-cream/95 backdrop-blur-md shadow-sm py-3 border-b border-brand-wine/10' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="w-9 h-9 text-brand-wine transition-transform duration-300 group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-serif text-lg md:text-xl font-bold tracking-wide text-brand-wine">
              {brandConfig.name}
            </span>
            <span className="text-[10px] tracking-widest text-brand-text-soft uppercase">
              Fotografia & Vídeo
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs xl:text-sm font-medium tracking-wide text-brand-text hover:text-brand-wine transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-wine hover:after:w-full after:transition-all after:duration-300"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-brand-wine text-white text-xs font-semibold tracking-wider uppercase shadow-sm hover:bg-brand-wine-dark hover:shadow-md transition-all duration-300 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-white text-brand-wine" />
            Orçamento
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-brand-wine rounded-lg hover:bg-brand-wine/5 transition-colors"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-brand-cream border-b border-brand-wine/15 shadow-xl py-6 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-serif font-medium text-brand-text hover:text-brand-wine py-2 border-b border-brand-wine/5 flex items-center justify-between"
            >
              <span>{link.name}</span>
              <span className="text-xs text-brand-wine/60 font-sans">→</span>
            </Link>
          ))}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full py-3 rounded-full bg-brand-wine text-white text-center text-xs font-semibold tracking-wider uppercase shadow hover:bg-brand-wine-dark transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            Falar no WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
