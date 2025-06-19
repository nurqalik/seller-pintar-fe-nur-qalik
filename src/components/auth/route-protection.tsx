"use client"

import { useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface RouteProtectionProps {
  children: ReactNode
}

export function RouteProtection({ children }: RouteProtectionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    setLoading(true)
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null

    if (!role) {
      router.push('/login')
      return
    }
    if (role === 'User' && pathname !== '/') {
      router.push('/')
      return
    }
    if (role === 'Admin' && pathname !== '/dashboard') {
      router.push('/dashboard')
      return
    }
    if (!token) {
      router.push('/login')
      return
    }
    setIsAuthorized(true)
    setLoading(false)
  }, [pathname, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
} 