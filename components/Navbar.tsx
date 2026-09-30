'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Camera, MessageCircle, ChevronDown } from 'lucide-react';
import { brandConfig } from '@/lib/config';
import Logo from '@/components/Logo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);
  const [mobilePortfolioOpen, setMobilePortfolioOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setPortfolioDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Depoimentos', href: '/depoimentos' },
    { name: 'Personalize seu orçamento', href: '/personalizado' },
  ];

  const portfolioSubLinks = [
    { name: 'Portfólio Geral', href: '/portfolio' },
    { name: 'Individuais e Casais', href: '/individuais-e-casais' },
    { name: 'Corporativo', href: '/corporativo' },
    { name: 'Casamentos', href: '/casamentos' },
    { name: 'Eventos', href: '/eventos' },
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
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 2xl:gap-6">
          <Link
            href="/"
            className="text-xs xl:text-[13px] font-medium tracking-wide text-brand-text hover:text-brand-wine transition-colors duration-200 py-1 relative whitespace-nowrap after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-wine hover:after:w-full after:transition-all after:duration-300"
          >
            Início
          </Link>

          {/* Portfolio Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setPortfolioDropdownOpen(!portfolioDropdownOpen)}
              className="text-xs xl:text-[13px] font-medium tracking-wide text-brand-text hover:text-brand-wine transition-colors duration-200 py-1 flex items-center gap-1 cursor-nowrap focus:outline-none group"
            >
              <span>Portfólio</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${portfolioDropdownOpen ? 'rotate-180 text-brand-wine' : 'text-brand-text group-hover:text-brand-wine'}`} />
            </button>

            {portfolioDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-brand-wine/15 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {portfolioSubLinks.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={() => setPortfolioDropdownOpen(false)}
                    className="block px-4 py-2.5 text-xs text-brand-text hover:bg-brand-cream hover:text-brand-wine transition-colors font-medium tracking-wide"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs xl:text-[13px] font-medium tracking-wide text-brand-text hover:text-brand-wine transition-colors duration-200 py-1 relative whitespace-nowrap after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-wine hover:after:w-full after:transition-all after:duration-300"
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
        <div className="lg:hidden absolute top-full left-0 right-0 bg-brand-cream border-b border-brand-wine/15 shadow-xl py-6 px-6 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300 max-h-[80vh] overflow-y-auto">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-serif font-medium text-brand-text hover:text-brand-wine py-2 border-b border-brand-wine/5 flex items-center justify-between"
          >
            <span>Início</span>
            <span className="text-xs text-brand-wine/60 font-sans">→</span>
          </Link>

          {/* Mobile Portfolio Accordion */}
          <div className="border-b border-brand-wine/5 pb-2">
            <button
              onClick={() => setMobilePortfolioOpen(!mobilePortfolioOpen)}
              className="w-full text-base font-serif font-medium text-brand-text hover:text-brand-wine py-2 flex items-center justify-between cursor-pointer"
            >
              <span>Portfólio</span>
              <ChevronDown className={`w-4 h-4 text-brand-wine transition-transform duration-200 ${mobilePortfolioOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobilePortfolioOpen && (
              <div className="pl-4 py-2 flex flex-col gap-2 bg-brand-wine/5 rounded-xl mt-1">
                {portfolioSubLinks.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobilePortfolioOpen(false);
                    }}
                    className="text-sm font-sans text-brand-text-soft hover:text-brand-wine py-1.5 flex items-center justify-between pr-2"
                  >
                    <span>{sub.name}</span>
                    <span className="text-[10px] text-brand-wine/60">→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.slice(1).map((link) => (
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

