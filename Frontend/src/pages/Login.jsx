import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import loginPageImg from '../assets/login_page_img.png'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await login({
        username,
        password,
      })

      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)

      navigate('/dashboard')
    } catch (error) {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fa] text-[#242424]">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT - LOGIN FORM */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">

          <div className="w-full max-w-md">

            {/* Branding */}
            <Link
              to="/"
              className="mb-12 inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071E2D] text-xl text-white shadow-sm">
                ✦
              </div>

              <span className="text-2xl font-semibold tracking-tight text-[#242424]">
                PersonalVault
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-4xl font-semibold tracking-tight text-[#071E2D] sm:text-5xl">
                Welcome back
              </h1>

              <p className="mt-3 text-lg leading-7 text-[#5C7C89]">
                Sign in to continue to your personal knowledge space.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Username */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#242424]">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full rounded-xl border border-[#cbd9dd] bg-white px-4 py-3.5 text-base text-[#242424] outline-none transition duration-200 placeholder:text-[#9aabb1] focus:border-[#1F4959] focus:ring-2 focus:ring-[#1F4959]/10"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#242424]">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-[#cbd9dd] bg-white px-4 py-3.5 pr-16 text-base text-[#242424] outline-none transition duration-200 placeholder:text-[#9aabb1] focus:border-[#1F4959] focus:ring-2 focus:ring-[#1F4959]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#5C7C89] transition hover:text-[#1F4959]"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#071E2D] py-3.5 text-base font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#1F4959] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

            </form>

            {/* Register */}
            <p className="mt-8 text-center text-base text-[#5C7C89]">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#1F4959] transition hover:text-[#071E2D] hover:underline"
              >
                Sign Up
              </Link>
            </p>

          </div>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="relative hidden min-h-screen overflow-hidden bg-[#071E2D] lg:flex lg:items-center lg:justify-center">

          <img
            src={loginPageImg}
            alt="PersonalVault knowledge space"
            className="h-full w-full object-contain"
          />

        </div>

      </div>

    </div>
  )
}

export default Login