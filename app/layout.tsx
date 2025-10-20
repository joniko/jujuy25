import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import TopNav from '../components/TopNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://oremos.app'),
  title: 'Oremos 24/7 - Echeverria Ora',
  description: 'Únete a la cadena de oración 24/7. Ora junto a la comunidad en tiempo real.',
  openGraph: {
    title: 'Oremos 24/7 🙏',
    description: 'Únete a la cadena de oración 24/7. Ora junto a la comunidad en tiempo real.',
    url: 'https://oremos.app',
    siteName: 'Oremos 24/7',
    images: [
      {
        url: '/api/og', // Imagen dinámica generada por Vercel OG
        width: 1200,
        height: 630,
        alt: 'Oremos 24/7 - Echeverria Ora',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oremos 24/7 🙏',
    description: 'Únete a la cadena de oración 24/7. Ora junto a la comunidad en tiempo real.',
    images: ['/api/og'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <TopNav />
        {children}
      </body>
    </html>
  )
}
