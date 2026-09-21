import React from 'react';
import ProposalView from '@/components/ProposalView';

interface PageProps {
  params: Promise<{ nome: string }>;
}

export const metadata = {
  title: 'Proposta Exclusiva de Casamento | Modkovski Fotografia',
  robots: 'noindex, nofollow',
};

export default async function CasamentoProposalPage({ params }: PageProps) {
  const { nome } = await params;
  return <ProposalView category="casamento" slug={nome} />;
}
