import React from 'react';
import ProposalView from '@/components/ProposalView';

interface PageProps {
  params: Promise<{ nome: string }>;
}

export const metadata = {
  title: 'Proposta Exclusiva de Ensaio Individual | Modkovski Fotografia',
  robots: 'noindex, nofollow',
};

export default async function IndividualProposalPage({ params }: PageProps) {
  const { nome } = await params;
  return <ProposalView category="individual" slug={nome} />;
}
