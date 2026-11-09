import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isTokenValid } from '@/lib/auth';
import ProposalManager from '@/components/ProposalManager';

export const metadata = {
  title: 'Gestor de Propostas Personalizadas | Modkovski Fotografia',
  robots: 'noindex, nofollow',
};

export default async function PropostasAdminPage() {
  const cookieStore = await cookies();
  const token = 
    cookieStore.get('modkovski_admin_session')?.value || 
    cookieStore.get('modkovski_admin_session_lax')?.value;

  if (!isTokenValid(token)) {
    redirect('/painel/login');
  }

  return <ProposalManager />;
}

