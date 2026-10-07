'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-sand flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-brand-wine/10 space-y-6">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-light text-brand-text">
            Ocorreu um imprevisto
          </h2>
          <p className="text-xs text-brand-text-soft leading-relaxed">
            Não foi possível carregar as informações desta página no momento. Tente novamente ou retorne à página inicial.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-wine text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-wine-dark transition-all shadow-md cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Tentar Novamente
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-brand-wine/20 text-brand-text text-xs font-semibold uppercase tracking-wider hover:bg-brand-cream transition-all"
          >
            <Home className="w-4 h-4" />
            Início
          </Link>
        </div>
      </div>
    </div>
  );
}
