'use client'

import { Check, FileText, AlertCircle, ClipboardList, Download } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: AlertCircle,
      title: 'Risk Classification',
      description: 'Get instant classification: Unacceptable, High, Limited, or Minimal Risk'
    },
    {
      icon: ClipboardList,
      title: 'Obligation Checklist',
      description: 'Specific compliance obligations tailored to your AI system'
    },
    {
      icon: FileText,
      title: 'Documentation Templates',
      description: 'Ready-to-use templates for impact assessments and compliance docs'
    },
    {
      icon: Download,
      title: 'Shareable Badge',
      description: 'Display your compliance status with a customizable badge'
    },
    {
      icon: Check,
      title: 'Expert Guidance',
      description: 'Links to official EU AI Act guidance for each requirement'
    },
    {
      icon: AlertCircle,
      title: 'Real-time Updates',
      description: 'Compliance rules updated as regulations evolve'
    }
  ]

  return (
    <section id="features" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Comprehensive Compliance Support</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to assess and document your AI system's EU AI Act compliance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="p-6 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <Icon className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
