import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Modkovski Fotografia | Proposta Comercial',
  description: 'Portfólio para ensaios fotográficos, produções de vídeos, cobertura de eventos e casamentos.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/favicon.png' },
    ],
  },
  openGraph: {
    title: 'Modkovski Fotografia | Proposta Comercial',
    description: 'Portfólio para ensaios fotográficos, produções de vídeos, cobertura de eventos e casamentos.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modkovski Fotografia | Proposta Comercial',
    description: 'Portfólio para ensaios fotográficos, produções de vídeos, cobertura de eventos e casamentos.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

