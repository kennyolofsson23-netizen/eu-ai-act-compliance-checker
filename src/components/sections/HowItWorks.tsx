'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Answer 12 Questions',
      description: 'Tell us about your AI system: what it does, who uses it, and what data it processes'
    },
    {
      number: '2',
      title: 'Get Risk Classification',
      description: 'Instantly see if your system is unacceptable risk, high-risk, limited risk, or minimal risk'
    },
    {
      number: '3',
      title: 'View Obligations',
      description: 'See a detailed checklist of everything you must do to comply with the EU AI Act'
    },
    {
      number: '4',
      title: 'Download Documentation',
      description: 'Get ready-to-use templates and guidance for compliance documentation'
    }
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get compliance-ready in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-6 rounded-lg border border-slate-200 h-full">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-12 text-slate-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/checker">Start Your Assessment Now</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
