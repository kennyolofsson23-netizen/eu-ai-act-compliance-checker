"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  GitCompare,
  Key,
  Settings,
  Plus,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "My Assessments", icon: LayoutDashboard },
  { href: "/dashboard/compare", label: "Compare", icon: GitCompare },
  { href: "/dashboard/keys", label: "API Keys", icon: Key },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (
    <>
      <Link
        href="/checker"
        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors mb-3"
        onClick={() => setMobileOpen(false)}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        New Assessment
      </Link>
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === href
              ? "bg-blue-50 text-blue-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
          )}
          aria-current={pathname === href ? "page" : undefined}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </Link>
      ))}
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <span className="font-semibold text-sm text-slate-900">
            EU AI Act Checker
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="md:hidden px-4 py-3 flex flex-col gap-1 border-b border-slate-200 bg-white"
          aria-label="Dashboard navigation"
        >
          {navLinks}
        </nav>
      )}
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white">
        <div className="p-4 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <span className="font-semibold text-sm text-slate-900">
              EU AI Act Checker
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1" aria-label="Dashboard navigation">
          {navLinks}
        </nav>
      </aside>
    </>
  );
}
