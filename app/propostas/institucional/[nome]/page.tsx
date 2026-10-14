import React from 'react';
import ProposalView from '@/components/ProposalView';

interface PageProps {
  params: Promise<{ nome: string }>;
}

export const metadata = {
  title: 'Proposta para Cobertura de Evento Institucional | Modkovski Fotografia',
  robots: 'noindex, nofollow',
};

export default async function PropostaInstitucionalSlugPage({ params }: PageProps) {
  const { nome } = await params;
  return <ProposalView category="institucional" slug={nome} />;
}
