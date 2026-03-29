'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  isAuthenticated: boolean
  children: React.ReactNode
  redirectTo?: string
}

export default function AuthGuard({ isAuthenticated, children, redirectTo = '/auth/login' }: AuthGuardProps) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, redirectTo, router])

  if (!isAuthenticated) return null
  return <>{children}</>
}
