import React from 'react';
import ProposalView from '@/components/ProposalView';

export const metadata = {
  title: 'Proposta de Evento | Modkovski Fotografia',
  description: 'Proposta oficial de cobertura de evento.',
};

export default function EventoProposalDefaultPage() {
  return <ProposalView category="evento" slug="padrao" />;
}
