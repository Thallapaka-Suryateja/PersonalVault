import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import loginPageImg from '../assets/login_page_img.png'

function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      await register({
        username,
        email,
        password,
      })

      navigate('/login')
    } catch (error) {
      if (error.response?.data) {
        const data = error.response.data

        if (data.username) {
          setError(data.username[0])
        } else if (data.email) {
          setError(data.email[0])
        } else if (data.password) {
          setError(data.password[0])
        } else {
          setError('Registration failed.')
        }
      } else {
        setError('Unable to connect to the server.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fa] text-[#242424]">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =========================
            LEFT - REGISTER FORM
        ========================== */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16 xl:px-24">

          <div className="w-full max-w-md">

            {/* Branding */}
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071E2D] text-xl text-white shadow-sm">
                ✦
              </div>

              <span className="text-2xl font-semibold tracking-tight text-[#242424]">
                PersonalVault
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-4xl font-semibold tracking-tight text-[#071E2D] sm:text-5xl">
                Create your account
              </h1>

              <p className="mt-3 text-lg leading-7 text-[#5C7C89]">
                Start building your personal knowledge space.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#242424]">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                  className="w-full rounded-xl border border-[#cbd9dd] bg-white px-4 py-3.5 text-base text-[#242424] outline-none transition duration-200 placeholder:text-[#9aabb1] focus:border-[#1F4959] focus:ring-2 focus:ring-[#1F4959]/10"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#242424]">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
                    placeholder="Create a password"
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

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#071E2D] py-3.5 text-base font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#1F4959] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

            </form>

            {/* Login */}
            <p className="mt-7 text-center text-base text-[#5C7C89]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#1F4959] transition hover:text-[#071E2D] hover:underline"
              >
                Sign In
              </Link>
            </p>

          </div>
        </div>

        {/* =========================
            RIGHT - IMAGE
        ========================== */}
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

export default Register