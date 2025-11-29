import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, Droplets, Waves } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { authApi } from '../../api/client'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  })

  // Create rain drops on mount
  useEffect(() => {
    const rainContainer = document.getElementById('rain-container')
    if (!rainContainer) return

    const createRainDrop = () => {
      const drop = document.createElement('div')
      drop.className = 'rain-drop'
      drop.style.left = `${Math.random() * 100}%`
      drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`
      drop.style.animationDelay = `${Math.random() * 2}s`
      rainContainer.appendChild(drop)

      setTimeout(() => drop.remove(), 2000)
    }

    const interval = setInterval(createRainDrop, 150)
    return () => clearInterval(interval)
  }, [])

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      general: ''
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email không được để trống'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setErrors({ email: '', password: '', general: '' })

    try {
      // Call real backend API
      const response = await authApi.login({
        email: formData.email,
        password: formData.password
      })

      // Save user data and token to localStorage
      const userData = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.full_name,
        phone: response.user.phone,
        token: response.access_token
      }

      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', response.access_token)

      // Navigate to home
      navigate('/')
    } catch (error) {
      setErrors({
        ...errors,
        general: error instanceof Error ? error.message : 'Đăng nhập thất bại. Email hoặc mật khẩu không đúng.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden px-4 py-12 bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-600">
      {/* Animated Background - Rain */}
      <div id="rain-container" className="absolute inset-0 pointer-events-none z-0"></div>

      {/* Animated Background - Storm Clouds */}
      <div className="storm-cloud top-20 opacity-30" style={{ animationDelay: '0s' }}></div>
      <div className="storm-cloud top-32" style={{ animationDelay: '10s' }}></div>
      <div className="storm-cloud top-16" style={{ animationDelay: '20s' }}></div>

      {/* Animated Background - Water Waves at Bottom */}
      <div className="wave-container">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      {/* Floating Water Droplets */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 animate-float">
        <Droplets className="w-full h-full text-blue-300/20" />
      </div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 animate-float" style={{ animationDelay: '2s' }}>
        <Waves className="w-full h-full text-cyan-300/20" />
      </div>

      {/* Ripple Effects */}
      <div className="ripple-effect top-1/4 left-1/3 w-32 h-32" style={{ animationDelay: '0s' }}></div>
      <div className="ripple-effect bottom-1/3 right-1/4 w-40 h-40" style={{ animationDelay: '1s' }}></div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10 cascade-item">
        {/* Logo */}
        <div className="text-center mb-8 cascade-item">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                <Shield className="w-8 h-8 text-white drop-shadow-lg" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-300 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              {/* Water shimmer effect */}
              <div className="absolute inset-0 rounded-2xl water-shimmer opacity-50"></div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold text-white drop-shadow-lg">
                  VAM
                </span>
                <span className="text-3xl font-semibold text-cyan-100 drop-shadow-lg">Insurance</span>
              </div>
              <p className="text-xs text-cyan-200 font-medium flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                Bảo vệ bạn khỏi bão lũ
              </p>
            </div>
          </Link>
        </div>

        {/* Login Card with Glassmorphism */}
        <Card className="glass-card shadow-2xl border-white/30 overflow-hidden cascade-item" style={{ animationDelay: '0.2s' }}>
          {/* Card Header Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500"></div>

          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent">
              Đăng nhập
            </CardTitle>
            <CardDescription className="text-center text-gray-700 font-medium">
              Nhập thông tin để bảo vệ tài sản của bạn
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* General Error */}
              {errors.general && (
                <div className="p-4 bg-red-50/90 backdrop-blur-sm border border-red-300 rounded-xl text-sm text-red-700 font-medium animate-fade-in">
                  {errors.general}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2 cascade-item" style={{ animationDelay: '0.3s' }}>
                <label htmlFor="email" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium ${errors.email
                        ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                        : 'border-blue-200 focus:ring-blue-200 focus:border-blue-500 hover:border-blue-300'
                      }`}
                    placeholder="email@vaminsurance.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1 animate-fade-in">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2 cascade-item" style={{ animationDelay: '0.4s' }}>
                <label htmlFor="password" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Mật khẩu
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-12 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium ${errors.password
                        ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                        : 'border-blue-200 focus:ring-blue-200 focus:border-blue-500 hover:border-blue-300'
                      }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors p-1 hover:bg-blue-50 rounded-lg"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1 animate-fade-in">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between cascade-item" style={{ animationDelay: '0.5s' }}>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-2 border-blue-300 rounded focus:ring-blue-500 focus:ring-2 transition-all cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 font-medium group-hover:text-blue-700 transition-colors">Ghi nhớ đăng nhập</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700 text-white py-6 text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group cascade-item"
                style={{ animationDelay: '0.6s' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Đăng nhập
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pb-8">
            <div className="text-center text-sm text-gray-700 font-medium cascade-item" style={{ animationDelay: '0.7s' }}>
              Chưa có tài khoản?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-bold transition-colors hover:underline"
              >
                Đăng ký ngay
              </Link>
            </div>

            {/* Divider */}
            <div className="relative w-full cascade-item" style={{ animationDelay: '0.8s' }}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-blue-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 backdrop-blur-sm px-3 py-1 text-gray-600 font-semibold rounded-full">Hoặc đăng nhập với</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 cascade-item" style={{ animationDelay: '0.9s' }}>
              <Button
                type="button"
                variant="outline"
                className="border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 bg-white/80 backdrop-blur-sm font-semibold transition-all duration-300 hover:shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 bg-white/80 backdrop-blur-sm font-semibold transition-all duration-300 hover:shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-cyan-100 mt-6 font-medium drop-shadow-lg cascade-item" style={{ animationDelay: '1s' }}>
          © 2025 VAM Insurance. Bảo vệ tài sản của bạn.
        </p>
      </div>
    </div>
  )
}
