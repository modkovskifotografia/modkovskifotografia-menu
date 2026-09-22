import React from 'react';
import HomeView from '@/components/HomeView';

export const metadata = {
  title: 'Evento | Modkovski Fotografia',
  description: 'Fotografia e filmagem de eventos com sensibilidade e emoção.',
};

export default function EventoPage() {
  return <HomeView hidePackages={true} hideAbout={true} hideProcess={true} />;
}
