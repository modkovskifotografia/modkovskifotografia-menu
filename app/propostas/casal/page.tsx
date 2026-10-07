import React from 'react';
import ProposalView from '@/components/ProposalView';

export const metadata = {
  title: 'Proposta de Ensaio de Casal | Modkovski Fotografia',
  description: 'Portfólio para ensaios fotográficos, produções de vídeos, cobertura de eventos e casamentos.',
};

export default function CasalProposalDefaultPage() {
  return <ProposalView category="casal" slug="padrao" />;
}
