import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('hospital_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password, userType) => {
    try {
      setLoading(true)
      
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock authentication logic
      const validCredentials = {
        'admin@hospital.com': { password: 'admin123', name: 'Dr. Rajesh Kumar', type: 'admin' },
        'doctor@hospital.com': { password: 'doctor123', name: 'Dr. Priya Sharma', type: 'doctor' },
        'nurse@hospital.com': { password: 'nurse123', name: 'Nurse Anjali Singh', type: 'nurse' },
        'user@patient.com': { password: 'user123', name: 'Patient User', type: 'patient' }
      }

      if (validCredentials[email] && validCredentials[email].password === password) {
        const userData = {
          id: Date.now(),
          email,
          name: validCredentials[email].name,
          type: validCredentials[email].type,
          loginTime: new Date().toISOString()
        }
        
        setUser(userData)
        localStorage.setItem('hospital_user', JSON.stringify(userData))
        toast.success(`Welcome back, ${userData.name}!`)
        return { success: true }
      } else {
        toast.error('Invalid credentials')
        return { success: false, error: 'Invalid credentials' }
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('hospital_user')
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
