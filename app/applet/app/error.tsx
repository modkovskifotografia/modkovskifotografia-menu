'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream text-brand-wine px-4">
      <h2 className="text-3xl font-serif mb-4">Algo deu errado!</h2>
      <p className="text-brand-text-soft mb-6">Ocorreu um erro ao carregar esta página.</p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-brand-wine text-white rounded-md text-sm font-semibold tracking-wider uppercase hover:bg-brand-wine-dark transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );
}
