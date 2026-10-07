import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-sand flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-brand-wine/10 space-y-6">
        <span className="text-xs font-semibold tracking-[0.25em] text-brand-wine uppercase block">
          Página Não Encontrada
        </span>
        <h1 className="font-serif text-5xl font-light text-brand-text">
          404
        </h1>
        <p className="text-sm text-brand-text-soft leading-relaxed">
          A página ou proposta que você está procurando não existe, foi movida ou o link informado está incorreto.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-wine text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-wine-dark transition-all shadow-md"
          >
            <Home className="w-4 h-4" />
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
