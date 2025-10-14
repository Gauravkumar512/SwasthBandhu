import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Heart } from 'lucide-react'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType] = useState('admin')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const result = await login(email, password, userType)
    if (result.success) {
      navigate(from, { replace: true })
    }
    setIsLoading(false)
  }

  const handleAutoFill = () => {
    setEmail('admin@hospital.com')
    setPassword('admin123')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Heart className="h-10 w-10 text-primary-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900">System Administrator</h2>
          <p className="text-gray-600 text-sm">Sign in to continue</p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-blue-900">Demo Credentials</h3>
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Auto Fill
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center">
              <span className="text-blue-700 font-medium w-20">Email:</span>
              <span className="text-blue-900 font-mono">admin@hospital.com</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-700 font-medium w-20">Password:</span>
              <span className="text-blue-900 font-mono">admin123</span>
            </div>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@hospital.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
