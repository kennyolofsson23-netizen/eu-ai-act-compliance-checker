'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Enterprise Compliance Made Free
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
            EU AI Act Compliance Checker
          </h1>

          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            EU AI Act Compliance Checker is a free AI compliance tool that answers 12 questions about your AI product to instantly get your EU AI Act risk classification, obligation checklist, and documentation templates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/checker" className="flex items-center gap-2">
                Start Free Assessment <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/#how-it-works">Learn How It Works</Link>
            </Button>
          </div>

          <p className="text-sm text-slate-500">
            Takes 5 minutes • No credit card required • Instant results
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
            <p className="text-slate-600">Assessment Questions</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">4</div>
            <p className="text-slate-600">Risk Categories</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <p className="text-slate-600">Free Forever</p>
          </div>
        </div>
      </div>
    </section>
  )
}
