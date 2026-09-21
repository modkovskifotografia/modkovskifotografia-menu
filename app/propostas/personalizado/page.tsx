import React from 'react';
import ProposalView from '@/components/ProposalView';

export const metadata = {
  title: 'Proposta Personalizada | Modkovski Fotografia',
  description: 'Proposta oficial personalizada.',
};

export default function PersonalizadoProposalDefaultPage() {
  return <ProposalView category="personalizado" slug="padrao" />;
}
