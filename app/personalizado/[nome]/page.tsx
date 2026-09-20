import React from 'react';
import ProposalView from '@/components/ProposalView';

interface PageProps {
  params: Promise<{ nome: string }>;
}

export const metadata = {
  title: 'Proposta Personalizada Sob Medida | Modkovski Fotografia',
  robots: 'noindex, nofollow',
};

export default async function PersonalizadoProposalPage({ params }: PageProps) {
  const { nome } = await params;
  return <ProposalView category="personalizado" slug={nome} />;
}
