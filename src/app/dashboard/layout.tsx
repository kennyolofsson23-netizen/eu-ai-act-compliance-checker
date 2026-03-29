import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import DashboardSidebar from '@/components/layout/DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />
      <main className="flex-1 p-6 md:p-8 bg-slate-50 overflow-auto">
        {children}
      </main>
    </div>
  )
}
