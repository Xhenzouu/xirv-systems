import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { authApi } from '../api'
import type { User } from '../api'
import api from '../api/client'

interface Organization {
  id: string
  name: string
  slug: string
  role?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  organization: Organization | null
  login: (email: string, password: string) => Promise<User>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshOrganization: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)

  const fetchOrganization = async () => {
    try {
      const response = await api.get('/organizations')
      if (response.data?.data?.length > 0) {
        const org = response.data.data[0]
        setOrganization({
          id: org.id,
          name: org.name,
          slug: org.slug,
          role: org.role
        })
      }
    } catch (error) {
      console.error('Failed to fetch organization:', error)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const userData = await authApi.getProfile()
          setUser(userData)
          setAuthenticated(true)
          localStorage.setItem('user', JSON.stringify(userData))
          await fetchOrganization()
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
        }
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    const data = await authApi.login({ email, password })
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    
    const userData = data.user
    console.log('🔐 Login response user:', userData)
    console.log('🔐 User role:', userData?.role)
    
    setUser(userData)
    setAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(userData))
    await fetchOrganization()
    
    return userData
  }

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    await authApi.register({ firstName, lastName, email, password })
    await login(email, password)
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken)
      } catch {
        // Ignore errors on logout
      }
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
    setOrganization(null)
    setAuthenticated(false)
  }

  const refreshOrganization = async () => {
    await fetchOrganization()
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        organization,
        login,
        register,
        logout,
        refreshOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}