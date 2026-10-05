'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { 
  FileText, 
  MessageSquareQuote, 
  ScrollText, 
  ExternalLink, 
  LogOut, 
  KeyRound,
  LayoutDashboard
} from 'lucide-react';

interface PanelNavigationProps {
  onOpenChangePassword?: () => void;
  activeCount?: {
    proposals?: number;
    testimonials?: number;
    contracts?: number;
  };
}

export default function PanelNavigation({ 
  onOpenChangePassword,
  activeCount 
}: PanelNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch {}
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('modkovski_admin_auth');
      localStorage.removeItem('modkovski_admin_auth');
      localStorage.removeItem('modkovski_admin_token');
      document.cookie = 'modkovski_admin_session=; path=/; max-age=0; SameSite=None; Secure';
      document.cookie = 'modkovski_admin_session_lax=; path=/; max-age=0; SameSite=Lax';
    }
    window.location.href = '/painel/login';
  };

  const navItems = [
    {
      label: 'Propostas',
      href: '/painel/propostas',
      icon: FileText,
      count: activeCount?.proposals,
      active: pathname.startsWith('/painel/propostas') || pathname === '/propostas' || pathname === '/admin' || pathname === '/admin/propostas'
    },
    {
      label: 'Depoimentos & Parceiros',
      href: '/painel/depoimentos',
      icon: MessageSquareQuote,
      count: activeCount?.testimonials,
      active: pathname.startsWith('/painel/depoimentos')
    },
    {
      label: 'Contratos',
      href: '/painel/contratos',
      icon: ScrollText,
      count: activeCount?.contracts,
      active: pathname.startsWith('/painel/contratos')
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-wine/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/painel" className="flex items-center gap-3 group">
              <Logo className="w-9 h-9" />
              <div className="hidden sm:block">
                <span className="font-serif text-lg font-bold text-brand-text tracking-wide group-hover:text-brand-wine transition-colors">
                  Modkovski
                </span>
                <span className="block text-[10px] text-brand-wine font-semibold uppercase tracking-[0.25em]">
                  Painel Administrativo
                </span>
              </div>
            </Link>

            <div className="h-6 w-[1px] bg-brand-wine/15 hidden md:block" />

            {/* Main Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1.5 bg-brand-cream/80 p-1.5 rounded-2xl border border-brand-wine/10">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      item.active
                        ? 'bg-brand-wine text-white shadow-sm'
                        : 'text-brand-text-soft hover:text-brand-wine hover:bg-white/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {typeof item.count === 'number' && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.active ? 'bg-white/20 text-white' : 'bg-brand-wine/10 text-brand-wine'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-wine/15 bg-white text-brand-text text-xs font-medium hover:bg-brand-cream hover:border-brand-wine/30 transition-all shadow-2xs"
              title="Abrir site público em nova aba"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-wine" />
              <span className="hidden sm:inline">Ver Site</span>
            </Link>

            {onOpenChangePassword && (
              <button
                onClick={onOpenChangePassword}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-wine/15 bg-white text-brand-text text-xs font-medium hover:bg-brand-cream hover:border-brand-wine/30 transition-all shadow-2xs"
                title="Alterar senha de acesso"
              >
                <KeyRound className="w-3.5 h-3.5 text-brand-wine" />
                <span className="hidden sm:inline">Senha</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50/70 text-red-700 text-xs font-medium hover:bg-red-100 transition-all"
              title="Encerrar sessão"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-brand-wine/10 overflow-x-auto gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 min-w-[100px] text-center inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                  item.active
                    ? 'bg-brand-wine text-white shadow-xs'
                    : 'text-brand-text-soft hover:text-brand-wine bg-brand-cream/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
