import React from 'react';
import { Metadata } from 'next';
import ProposalManager from '@/components/ProposalManager';

export const metadata: Metadata = {
  title: 'Propostas Personalizadas | Painel Modkovski Fotografia',
  description: 'Gerenciador de orçamentos e propostas comerciais exclusivas.',
  robots: 'noindex, nofollow',
};

export default function PainelPropostasPage() {
  return <ProposalManager />;
}
