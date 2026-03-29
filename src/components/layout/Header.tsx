"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" aria-hidden="true" />
            <span className="font-semibold text-slate-900">
              EU AI Act Checker
            </span>
          </Link>
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            <Link
              href="/checker"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Start Assessment
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#faq"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/checker"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Free Assessment
            </Link>
          </nav>
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
        {mobileOpen && (
          <nav
            className="md:hidden border-t border-slate-200 py-4 flex flex-col gap-3"
            aria-label="Mobile navigation"
          >
            <Link
              href="/checker"
              className="text-sm font-medium text-slate-700 py-2"
              onClick={() => setMobileOpen(false)}
            >
              Start Assessment
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-slate-700 py-2"
              onClick={() => setMobileOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/#faq"
              className="text-sm font-medium text-slate-700 py-2"
              onClick={() => setMobileOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-700 py-2"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/checker"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white w-full"
              onClick={() => setMobileOpen(false)}
            >
              Free Assessment
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
