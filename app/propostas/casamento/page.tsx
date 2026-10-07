import React from 'react';
import ProposalView from '@/components/ProposalView';

export const metadata = {
  title: 'Proposta de Casamento | Modkovski Fotografia',
  description: 'Portfólio para ensaios fotográficos, produções de vídeos, cobertura de eventos e casamentos.',
};

export default function CasamentoProposalDefaultPage() {
  return <ProposalView category="casamento" slug="padrao" />;
}
