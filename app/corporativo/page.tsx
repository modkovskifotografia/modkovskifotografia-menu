import React from 'react';
import HomeView from '@/components/HomeView';

export const metadata = {
  title: 'Produção Corporativa | Modkovski Fotografia',
  description: 'Produção de vídeos para redes sociais, Reels, TikTok, autoridade profissional e cobertura corporativa com planejamento e excelência.',
};

export default function CorporativoPage() {
  return (
    <HomeView 
      hidePackages={true} 
      hideAbout={true} 
      hideProcess={true}
      customHeroImage="/images/capacorporativo.jpg"
      customHeroTitle="Credibilidade em cada detalhe."
      customHeroQuote="Antes de contratarem o seu serviço, seus clientes julgam a sua estrutura. Fortalecemos a credibilidade da sua empresa em cada detalhe visual."
    />
  );
}
