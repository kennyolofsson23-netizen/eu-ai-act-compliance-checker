import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 md:py-32" aria-labelledby="hero-heading">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 border border-orange-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            EU AI Act enforcement: August 2, 2026
          </div>

          <h1 id="hero-heading" className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
            Is Your AI Product{' '}
            <span className="text-blue-600">EU Compliant?</span>
          </h1>

          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            EU AI Act Compliance Checker is a free AI compliance tool that classifies your AI system&apos;s risk level, generates your obligation checklist, and creates a shareable compliance badge — all in under 3 minutes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/checker"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Start Free Assessment
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Learn How It Works
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
            {[
              'No signup required',
              'Free forever',
              '3 minutes to complete',
              'Article citations included',
            ].map(feature => (
              <div key={feature} className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" aria-hidden="true" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk level preview cards */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { level: 'Unacceptable', color: 'bg-red-100 border-red-200 text-red-800', icon: '🚫' },
            { level: 'High Risk', color: 'bg-orange-100 border-orange-200 text-orange-800', icon: '⚠️' },
            { level: 'Limited Risk', color: 'bg-yellow-100 border-yellow-200 text-yellow-800', icon: '⚡' },
            { level: 'Minimal Risk', color: 'bg-green-100 border-green-200 text-green-800', icon: '✅' },
          ].map(({ level, color, icon }) => (
            <div key={level} className={`${color} border rounded-lg p-3 text-center text-sm font-medium`}>
              <div className="text-lg mb-1" aria-hidden="true">{icon}</div>
              {level}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
