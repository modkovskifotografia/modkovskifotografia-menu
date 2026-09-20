import React from 'react';
import ProposalView from '@/components/ProposalView';

interface PageProps {
  params: Promise<{ nome: string }>;
}

export const metadata = {
  title: 'Proposta Exclusiva de Ensaio de Casal | Modkovski Fotografia',
  robots: 'noindex, nofollow',
};

export default async function CasalProposalPage({ params }: PageProps) {
  const { nome } = await params;
  return <ProposalView category="casal" slug={nome} />;
}
