import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'

export type UserRole = 'viewer' | 'superadmin'

interface AuthContextValue {
  role: UserRole
  isSuperadmin: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const SUPERADMIN_PASSWORD = import.meta.env.VITE_SUPERADMIN_PASSWORD || 'superadmin123'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('auth-role') as UserRole | null
      if (saved === 'superadmin') return 'superadmin'
    }
    return 'viewer'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('auth-role', role)
    }
  }, [role])

  const login = async (password: string) => {
    if (password === SUPERADMIN_PASSWORD) {
      setRole('superadmin')
      return true
    }
    return false
  }

  const logout = () => setRole('viewer')

  const value = useMemo(() => ({
    role,
    isSuperadmin: role === 'superadmin',
    login,
    logout
  }), [role])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
