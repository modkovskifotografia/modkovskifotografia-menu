import React from 'react';
import ProposalView from '@/components/ProposalView';

interface PageProps {
  params: Promise<{ nome: string }>;
}

export const metadata = {
  title: 'Proposta Exclusiva Corporativa | Modkovski Fotografia',
  robots: 'noindex, nofollow',
};

export default async function CorporativoProposalPage({ params }: PageProps) {
  const { nome } = await params;
  return <ProposalView category="corporativo" slug={nome} />;
}
