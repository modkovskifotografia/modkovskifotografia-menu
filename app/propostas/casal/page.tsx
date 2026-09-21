import React from 'react';
import ProposalView from '@/components/ProposalView';

export const metadata = {
  title: 'Proposta de Ensaio de Casal | Modkovski Fotografia',
  description: 'Proposta oficial de ensaio de casal.',
};

export default function CasalProposalDefaultPage() {
  return <ProposalView category="casal" slug="padrao" />;
}
