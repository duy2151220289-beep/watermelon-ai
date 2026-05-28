import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const API_ROOT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? '/api'
    : 'https://watermelon-ai-q84h.onrender.com/api'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      let response
      if (isLogin) {
        // Login
        response = await axios.post(`${API_ROOT}/auth/login/`, { username, password })
      } else {
        // Register
        response = await axios.post(`${API_ROOT}/auth/register/`, { username, email, password })
      }

      const { token, user } = response.data
      onAuthSuccess({ token, username: user.username })
      onClose()
      
      // Clear inputs
      setUsername('')
      setEmail('')
      setPassword('')
    } catch (err) {
      const message = err.response?.data
        ? Object.values(err.response.data).flat().join(' ')
        : 'An error occurred. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md overflow-hidden rounded-[36px] border border-[#1cf0b3]/45 bg-[#030e0b] p-8 md:p-10 shadow-[0_0_60px_rgba(28,240,179,0.2)] text-white"
        >
          {/* Glowing neon bg accent */}
          <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#1cf0b3]/15 blur-[60px] pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-[#3bf7ff]/10 blur-[60px] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="cursor-pointer absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/15 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title Header */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-extrabold tracking-wide uppercase bg-gradient-to-r from-white via-[#81f9ce] to-white bg-clip-text text-transparent">
              {isLogin ? 'LOG IN' : 'SIGN UP'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">
              {isLogin ? 'Access your Watermelon AI Passport' : 'Create your free scanner account'}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-300 font-mono">
              ⚠ {error}
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tên tài khoản..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#1cf0b3]/55 focus:outline-none transition"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nhapemail@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#1cf0b3]/55 focus:outline-none transition"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#1cf0b3]/55 focus:outline-none transition"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer rounded-2xl bg-[#22f0a5] hover:bg-[#1cd893] py-3 text-sm font-extrabold text-slate-950 shadow-neon uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Register Account'}
              </button>
            </div>
          </form>

          {/* Toggle link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="cursor-pointer font-bold text-[#1cf0b3] hover:underline"
            >
              {isLogin ? 'Sign up now' : 'Log In'}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  )
}
