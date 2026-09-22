import React from 'react';
import HomeView from '@/components/HomeView';

export const metadata = {
  title: 'Pacotes Personalizados | Modkovski Fotografia',
  description: 'Soluções de fotografia e vídeo sob medida para o seu projeto, ensaio ou evento especial.',
};

export default function PersonalizadoPage() {
  return <HomeView hidePackages={true} hideAbout={true} hideProcess={true} showPersonalizedCustomSection={true} />;
}
