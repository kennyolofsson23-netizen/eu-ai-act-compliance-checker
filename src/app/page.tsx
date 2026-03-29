import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import HowItWorks from '@/components/sections/HowItWorks'
import FAQ from '@/components/sections/FAQ'

export const metadata: Metadata = {
  title: 'Free EU AI Act Compliance Checker - Risk Assessment Tool',
  description: 'Instantly assess your AI product\'s EU AI Act compliance. Answer 12 questions, get risk classification, obligation checklist, and documentation templates.',
  openGraph: {
    title: 'Free EU AI Act Compliance Checker',
    description: 'Instantly assess your AI product\'s EU AI Act compliance in 5 minutes',
    type: 'website'
  }
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
