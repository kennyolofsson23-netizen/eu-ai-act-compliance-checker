import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { APP_NAME, APP_URL, APP_DESCRIPTION } from '@/lib/constants'

export const metadata: Metadata = {
  title: {
    default: 'EU AI Act Compliance Checker — Free Risk Classification Tool',
    template: '%s | EU AI Act Compliance Checker',
  },
  description: APP_DESCRIPTION,
  keywords: ['EU AI Act', 'AI compliance', 'risk classification', 'GPAI', 'high-risk AI', 'AI regulation'],
  authors: [{ name: 'EU AI Act Compliance Checker' }],
  creator: 'EU AI Act Compliance Checker',
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: APP_NAME,
    title: 'EU AI Act Compliance Checker — Free Risk Classification Tool',
    description: APP_DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: APP_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EU AI Act Compliance Checker — Free Risk Classification Tool',
    description: APP_DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: APP_NAME,
              url: APP_URL,
              description: APP_DESCRIPTION,
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
              provider: {
                '@type': 'Organization',
                name: APP_NAME,
                url: APP_URL,
              },
            }),
          }}
        />
        {process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className="min-h-screen bg-white font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
