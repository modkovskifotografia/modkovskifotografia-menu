import React from 'react';
import { Metadata } from 'next';
import ProposalManager from '@/components/ProposalManager';

export const metadata: Metadata = {
  title: 'Painel Administrativo | Modkovski Fotografia',
  description: 'Painel de controle para gerenciar Propostas, Depoimentos, Parceiros e Contratos.',
  robots: 'noindex, nofollow',
};

export default function PainelPage() {
  return <ProposalManager />;
}
