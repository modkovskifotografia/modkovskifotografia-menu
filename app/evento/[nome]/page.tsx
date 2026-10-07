import React from 'react';
import ProposalView from '@/components/ProposalView';
import { getInitialProposalSnapshot } from '@/lib/propostas-service';

interface PageProps {
  params: Promise<{ nome: string }>;
}

export const metadata = {
  title: 'Proposta Exclusiva de Evento | Modkovski Fotografia',
  robots: 'noindex, nofollow',
};

export default async function EventoProposalPage({ params }: PageProps) {
  const { nome } = await params;
  const initial = getInitialProposalSnapshot('evento', nome);
  return <ProposalView category="evento" slug={nome} initialProposal={initial || undefined} />;
}
