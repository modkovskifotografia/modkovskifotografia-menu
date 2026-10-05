import React from 'react';
import { Metadata } from 'next';
import TestimonialManager from '@/components/panel/TestimonialManager';

export const metadata: Metadata = {
  title: 'Depoimentos & Parceiros | Painel Modkovski Fotografia',
  description: 'Gerenciador de avaliações, depoimentos de clientes e rede de parceiros.',
  robots: 'noindex, nofollow',
};

export default function PainelDepoimentosPage() {
  return <TestimonialManager />;
}
