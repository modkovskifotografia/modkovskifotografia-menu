import React from 'react';
import ProposalView from '@/components/ProposalView';

export const metadata = {
  title: 'Proposta de Evento | Modkovski Fotografia',
  description: 'Portfólio para ensaios fotográficos, produções de vídeos, cobertura de eventos e casamentos.',
};

export default function EventoProposalDefaultPage() {
  return <ProposalView category="evento" slug="padrao" />;
}
