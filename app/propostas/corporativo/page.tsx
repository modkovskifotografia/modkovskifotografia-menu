import React from 'react';
import ProposalView from '@/components/ProposalView';

export const metadata = {
  title: 'Proposta Corporativa | Modkovski Fotografia',
  description: 'Proposta oficial de produção corporativa.',
};

export default function CorporativoProposalDefaultPage() {
  return <ProposalView category="corporativo" slug="padrao" />;
}
