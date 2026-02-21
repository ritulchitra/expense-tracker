import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '@/store/slices/authSlice'
import { useForm, useNotification } from '@/hooks'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { showNotification } = useNotification()
  const [showPassword, setShowPassword] = useState(false)

  const { values, handleChange, handleSubmit, isSubmitting } = useForm(
    {
      email: 'demo@example.com',
      password: 'demo@123',
    },
    async (values) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock authentication
        dispatch(
          loginSuccess({
            user: {
              id: 1,
              name: 'Demo User',
              email: values.email,
            },
            token: 'mock-jwt-token-' + Date.now(),
          })
        )

        showNotification('Login successful!', 'success')
        navigate('/dashboard')
      } catch (error) {
        showNotification('Login failed. Please try again.', 'error')
      }
    }
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">
              💰
            </h1>
            <h2 className="text-3xl font-bold text-gray-900">ExpenseTracker</h2>
            <p className="text-gray-600 text-sm mt-2">
              Manage your finances efficiently
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:text-blue-600 font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              Demo Credentials (Pre-filled)
            </p>
            <div className="mt-3 bg-blue-50 rounded-lg p-3 text-sm text-gray-700">
              <p>Email: demo@example.com</p>
              <p>Password: demo@123</p>
            </div>
          </div>

          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{' '}
            <a href="#" className="text-primary hover:text-blue-600 font-medium">
              Sign up
            </a>
          </p>
        </div>

        <div className="text-center text-gray-600 text-xs mt-6">
          <p>© 2024 Expense Tracker. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
