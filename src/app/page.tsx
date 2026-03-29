import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import HowItWorks from '@/components/sections/HowItWorks'
import Features from '@/components/sections/Features'
import DeadlineCountdown from '@/components/sections/DeadlineCountdown'
import FAQ from '@/components/sections/FAQ'
import SocialProof from '@/components/sections/SocialProof'
import { APP_NAME, APP_URL, APP_DESCRIPTION } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'EU AI Act Compliance Checker — Free Risk Classification Tool',
  description: APP_DESCRIPTION,
  alternates: { canonical: APP_URL },
  openGraph: {
    title: 'EU AI Act Compliance Checker — Free Risk Classification Tool',
    description: APP_DESCRIPTION,
    url: APP_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export default function HomePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the EU AI Act?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The EU AI Act (Regulation 2024/1689) is the world\'s first comprehensive AI regulation, establishing rules for AI systems based on their risk level. It applies to providers and deployers of AI systems operating in the EU market.',
        },
      },
      {
        '@type': 'Question',
        name: 'When does the EU AI Act apply?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Prohibited AI practices became enforceable on February 2, 2025. GPAI model obligations apply from August 2, 2025. High-risk AI and transparency obligations are fully enforceable from August 2, 2026.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the fines for non-compliance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fines can reach up to 7% of global annual turnover (€35M cap) for prohibited AI practices, 3% (€15M cap) for high-risk violations, and 1.5% (€7.5M cap) for providing incorrect information to authorities.',
        },
      },
    ],
  }

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: APP_URL,
    description: APP_DESCRIPTION,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <DeadlineCountdown />
      <FAQ />
    </>
  )
}
