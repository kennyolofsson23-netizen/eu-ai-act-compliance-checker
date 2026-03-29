import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import './globals.css'

const APP_NAME = 'EU AI Act Compliance Checker'
const APP_DESCRIPTION = 'EU AI Act Compliance Checker is a free AI compliance tool that answers 12 questions about your AI product to instantly get your EU AI Act risk classification, obligation checklist, and documentation templates.'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: `${APP_NAME} - Free EU AI Act Risk Assessment`,
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [{ name: 'EU AI Compliance Team' }],
  creator: 'EU AI Compliance Team',
  keywords: [
    'EU AI Act',
    'AI compliance',
    'risk assessment',
    'AI regulation',
    'compliance checker',
    'high-risk AI',
    'AI obligations',
    'GDPR',
    'compliance documentation',
    'AI certification'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: APP_NAME,
    title: `${APP_NAME} - Free EU AI Act Risk Assessment`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: APP_NAME,
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} - Free EU AI Act Risk Assessment`,
    description: APP_DESCRIPTION,
    images: ['/twitter-image.png']
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  robots: 'index, follow',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: APP_NAME,
              description: APP_DESCRIPTION,
              url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              applicationCategory: 'BusinessApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'EUR'
              },
              author: {
                '@type': 'Organization',
                name: 'EU AI Compliance Team'
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: APP_NAME,
              url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              description: APP_DESCRIPTION,
              logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo.png`,
              sameAs: []
            })
          }}
        />

        {/* Plausible Analytics */}
        <script defer data-domain={process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN || 'localhost'} src="https://plausible.io/js/script.js"></script>

        {/* Permissions Policy */}
        <meta name="permissions-policy" content="geolocation=(), microphone=(), camera=()" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
