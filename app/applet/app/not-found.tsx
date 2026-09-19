import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream text-brand-wine px-4">
      <h2 className="text-3xl font-serif mb-4">Página não encontrada</h2>
      <p className="text-brand-text-soft mb-6">A página que você está procurando não existe ou foi movida.</p>
      <Link href="/" className="px-6 py-3 bg-brand-wine text-white rounded-md text-sm font-semibold tracking-wider uppercase hover:bg-brand-wine-dark transition-colors">
        Voltar para a Página Inicial
      </Link>
    </div>
  );
}
