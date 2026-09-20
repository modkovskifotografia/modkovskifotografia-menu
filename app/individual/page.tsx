import React from 'react';
import ProposalView from '@/components/ProposalView';

export const metadata = {
  title: 'Proposta de Ensaio Fotográfico Individual | Modkovski Fotografia',
  description: 'Ensaios individuais com direção acolhedora e olhar autêntico.',
};

export default function IndividualPage() {
  return <ProposalView category="individual" slug="padrao" />;
}
