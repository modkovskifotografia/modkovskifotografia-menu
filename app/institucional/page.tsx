import React from 'react';
import ProposalView from '@/components/ProposalView';

export const metadata = {
  title: 'Proposta para Cobertura de Evento Institucional | Modkovski Fotografia',
  description: 'Palestras, debates, encontros profissionais e reuniões.',
  robots: 'noindex, nofollow',
};

export default function InstitucionalDefaultProposalPage() {
  return <ProposalView category="institucional" slug="padrao" />;
}
