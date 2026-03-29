import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ComplianceCheckerForm from '@/components/checker/ComplianceCheckerForm'

export const metadata: Metadata = {
  title: 'EU AI Act Compliance Assessment - Start Now',
  description: 'Answer 12 questions about your AI system and get instant EU AI Act risk classification and compliance obligations.',
  openGraph: {
    title: 'EU AI Act Compliance Assessment',
    description: 'Get your AI system classified and compliance obligations outlined'
  }
}

export default function CheckerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ComplianceCheckerForm />
      </main>
      <Footer />
    </div>
  )
}
