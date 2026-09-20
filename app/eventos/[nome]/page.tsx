import React from 'react';
import ProposalView from '@/components/ProposalView';

interface PageProps {
  params: Promise<{ nome: string }>;
}

export const metadata = {
  title: 'Proposta Exclusiva de Evento | Modkovski Fotografia',
  robots: 'noindex, nofollow',
};

export default async function EventosPluralProposalPage({ params }: PageProps) {
  const { nome } = await params;
  return <ProposalView category="evento" slug={nome} />;
}
