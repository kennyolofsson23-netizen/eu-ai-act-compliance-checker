'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h2 className="font-semibold text-sm mb-4">Product</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/checker" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Compliance Checker
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-sm mb-4">Resources</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-sm mb-4">Legal</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/compliance" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  AI Compliance
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  GDPR
                </Link>
              </li>
              <li>
                <a href="mailto:contact@euaicompliance.app" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-sm mb-4">Follow</h2>
            <ul className="space-y-2">
              <li>
                <a href="https://twitter.com" className="text-sm text-slate-600 hover:text-slate-900 transition-colors" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" className="text-sm text-slate-600 hover:text-slate-900 transition-colors" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              © {currentYear} EU AI Act Compliance Checker. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="mailto:contact@euaicompliance.app" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
