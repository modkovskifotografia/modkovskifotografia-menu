import React from 'react';
import ProposalView from '@/components/ProposalView';

export const metadata = {
  title: 'Proposta de Ensaio Fotográfico Individual | Modkovski Fotografia',
  description: 'Proposta oficial de ensaio individual.',
};

export default function IndividualProposalDefaultPage() {
  return <ProposalView category="individual" slug="padrao" />;
}
