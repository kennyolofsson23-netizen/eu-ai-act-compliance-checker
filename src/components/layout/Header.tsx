'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <Link href="/" className="font-bold text-lg hover:text-blue-600 transition-colors">
              EU AI Compliance
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/checker" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Compliance Checker
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              About
            </Link>
          </nav>

          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/checker">Start Assessment</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
