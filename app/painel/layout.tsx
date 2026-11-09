import React from 'react';
import AdminSessionKeeper from '@/components/panel/AdminSessionKeeper';

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminSessionKeeper>{children}</AdminSessionKeeper>;
}
