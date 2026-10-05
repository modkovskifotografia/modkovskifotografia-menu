'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminSessionKeeper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Do nothing on login page (it manages its own credentials flow)
    if (pathname === '/painel/login') return;

    const token = localStorage.getItem('modkovski_admin_token');
    if (token && token.startsWith('modkovski_session_')) {
      // Re-assert cookies into document.cookie in case browser cleared cross-site cookies
      const hasCookie = document.cookie.includes('modkovski_admin_session=');
      if (!hasCookie) {
        document.cookie = `modkovski_admin_session=${token}; path=/; max-age=2592000; SameSite=None; Secure`;
        document.cookie = `modkovski_admin_session_lax=${token}; path=/; max-age=2592000; SameSite=Lax`;
      }
    }
  }, [pathname]);

  return <>{children}</>;
}
