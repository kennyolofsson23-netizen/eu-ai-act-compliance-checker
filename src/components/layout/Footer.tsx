import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <span className="font-semibold text-slate-900">EU AI Act Checker</span>
            </Link>
            <p className="text-sm text-slate-600 max-w-xs">
              Free AI risk classification tool for EU AI Act compliance. Get your risk level and obligation checklist in 3 minutes.
            </p>
            <p className="mt-4 text-xs text-slate-500">
              © {new Date().getFullYear()} EU AI Act Compliance Checker. For informational purposes only — not legal advice.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Tool</h2>
            <ul className="space-y-2">
              <li><Link href="/checker" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Start Assessment</Link></li>
              <li><Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Dashboard</Link></li>
              <li><Link href="/auth/register" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Legal</h2>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Terms of Service</Link></li>
              <li><Link href="/about" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">About</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            <strong>Disclaimer:</strong> This tool provides informational guidance only and does not constitute legal advice.
            Consult qualified legal counsel for compliance decisions. EU AI Act (Regulation 2024/1689).
          </p>
        </div>
      </div>
    </footer>
  )
}
