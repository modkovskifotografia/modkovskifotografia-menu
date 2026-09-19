import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Modkovski Fotografia | Proposta Comercial',
  description: 'Sua cerimônia de casamento registrada com sensibilidade e olhar artístico.',
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
    description: 'Sua cerimônia de casamento registrada com sensibilidade e olhar artístico.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modkovski Fotografia | Proposta Comercial',
    description: 'Sua cerimônia de casamento registrada com sensibilidade e olhar artístico.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

