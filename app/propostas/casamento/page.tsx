import React from 'react';
import ProposalView from '@/components/ProposalView';

export const metadata = {
  title: 'Proposta de Casamento | Modkovski Fotografia',
  description: 'Proposta oficial de cobertura de casamento.',
};

export default function CasamentoProposalDefaultPage() {
  return <ProposalView category="casamento" slug="padrao" />;
}
