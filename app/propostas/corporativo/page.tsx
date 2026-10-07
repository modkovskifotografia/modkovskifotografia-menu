import React from 'react';
import ProposalView from '@/components/ProposalView';

export const metadata = {
  title: 'Proposta Corporativa | Modkovski Fotografia',
  description: 'Portfólio para ensaios fotográficos, produções de vídeos, cobertura de eventos e casamentos.',
};

export default function CorporativoProposalDefaultPage() {
  return <ProposalView category="corporativo" slug="padrao" />;
}
