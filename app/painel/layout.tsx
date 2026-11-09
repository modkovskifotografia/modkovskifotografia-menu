import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isTokenValid } from '@/lib/auth';
import AdminSessionKeeper from '@/components/panel/AdminSessionKeeper';

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = 
    cookieStore.get('modkovski_admin_session')?.value || 
    cookieStore.get('modkovski_admin_session_lax')?.value;

  if (!isTokenValid(token)) {
    redirect('/painel/login');
  }

  return <AdminSessionKeeper>{children}</AdminSessionKeeper>;
}

