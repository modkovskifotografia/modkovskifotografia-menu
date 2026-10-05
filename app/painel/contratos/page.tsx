import React from 'react';
import { Metadata } from 'next';
import ContractManager from '@/components/panel/ContractManager';

export const metadata: Metadata = {
  title: 'Contratos & Modelos | Painel Modkovski Fotografia',
  description: 'Gerenciador e emissão de contratos comerciais de fotografia e vídeo.',
  robots: 'noindex, nofollow',
};

export default function PainelContratosPage() {
  return <ContractManager />;
}
