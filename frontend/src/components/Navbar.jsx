import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar({ user, onOpenAuthModal, onLogout, onNavigate, onOpenDeveloperModal, onOpenInstallModal, currentTheme, onChangeTheme, currentPage }) {


  const [isOpen, setIsOpen] = useState(false)
  
  const handleNavLink = (e, targetId) => {
    e.preventDefault()
    setIsOpen(false)
    onNavigate('home')
    setTimeout(() => {
      const el = document.getElementById(targetId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-slate-950/25"
    >
      <div className="container mx-auto px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between gap-6 flex-wrap md:flex-nowrap">
          {/* Logo and Developer Title */}
          <div className="flex items-center gap-3">
            <motion.div
              onClick={() => {
                setIsOpen(false)
                onNavigate('home')
              }}
              className="cursor-pointer relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              initial={{ scale: 0.98, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="absolute inset-0 rounded-full animate-neon-pulse" />
              <div className="relative z-10 h-11 w-11 rounded-full bg-gradient-to-br from-[#22f0a5]/20 via-[#1bedc0]/10 to-[#55ffca]/20 shadow-[0_0_35px_rgba(44,255,176,0.25)] ring-1 ring-white/10 flex items-center justify-center">
                <span className="text-lg font-black text-white/90">D</span>
              </div>
            </motion.div>

            <div className="cursor-pointer select-none" onClick={onOpenDeveloperModal}>
              <p className="text-[10px] sm:text-sm uppercase tracking-[0.4em] text-[#8fffd3] hover:text-[#1cf0b3] transition duration-300">Nguyen Le Bao Duy</p>
              <h1 className="text-sm sm:text-lg font-semibold text-white leading-tight">Developer Application Website</h1>
              <p className="text-[9px] sm:text-xs text-[#8bfec0]/90 font-light mt-0.5">Da Nang, Vietnam</p>
            </div>
          </div>

          {/* Desktop Navigation and Auth */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6 text-slate-300">
              <a href="#detect" onClick={(e) => handleNavLink(e, 'detect')} className="relative transition hover:text-white text-xs font-semibold uppercase tracking-wider">
                Detect
              </a>
              <a href="#stats" onClick={(e) => handleNavLink(e, 'stats')} className="relative transition hover:text-white text-xs font-semibold uppercase tracking-wider">
                Statistics
              </a>

              <a href="#reviews" onClick={(e) => handleNavLink(e, 'reviews')} className="relative transition hover:text-white text-xs font-semibold uppercase tracking-wider">
                Reviews
              </a>
              <a
                href="#leaderboard"
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate('leaderboard')
                }}
                className={`relative transition hover:text-white text-xs font-semibold uppercase tracking-wider ${
                  currentPage === 'leaderboard' ? 'text-accent' : ''
                }`}
              >
                Leaderboard
              </a>

              <button
                onClick={onOpenInstallModal}
                className="cursor-pointer border border-[#1cf0b3]/30 hover:border-[#1cf0b3]/60 bg-[#061b14]/50 hover:bg-[#1cf0b3]/10 text-[#8effe3] rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300"
              >
                📲 Install App
              </button>
            </nav>


            <div className="flex items-center gap-3">
              {/* Cyberpunk Theme Switcher Widget */}
              <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-2.5 py-1.5 mr-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onChangeTheme('emerald')}
                    title="Emerald Matrix (Green)"
                    className={`w-3.5 h-3.5 rounded-full bg-[#1cf0b3] cursor-pointer transition-all duration-300 ${
                      currentTheme === 'emerald'
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110 shadow-[0_0_12px_#1cf0b3]'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  />
                  <button
                    onClick={() => onChangeTheme('synthwave')}
                    title="Synthwave Sunset (Sunset Pink/Purple)"
                    className={`w-3.5 h-3.5 rounded-full bg-[#ff007f] cursor-pointer transition-all duration-300 ${
                      currentTheme === 'synthwave'
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110 shadow-[0_0_12px_#ff007f]'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  />
                  <button
                    onClick={() => onChangeTheme('cyber')}
                    title="Cyber Gold (Gold & Cyan)"
                    className={`w-3.5 h-3.5 rounded-full bg-[#ffb703] cursor-pointer transition-all duration-300 ${
                      currentTheme === 'cyber'
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110 shadow-[0_0_12px_#ffb703]'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  />
                </div>
              </div>

              {user ? (

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onNavigate('profile')}
                    className={`cursor-pointer flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all duration-300 ${
                      (user.role === 'merchant' || user.user?.role === 'merchant')
                        ? 'border-amber-500/40 bg-[#1f1704] text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:border-amber-500/70'
                        : 'border-[#1cf0b3]/30 bg-[#061b14] text-[#8effe3] shadow-neon hover:border-[#1cf0b3]/60'
                    }`}
                  >
                    <span>{(user.role === 'merchant' || user.user?.role === 'merchant') ? '👑' : '👤'}</span>
                    <span className="font-mono">{user.username}</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="cursor-pointer text-xs text-slate-400 hover:text-red-400 font-bold transition"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="cursor-pointer rounded-2xl bg-[#22f0a5] hover:bg-[#1cd893] px-5 py-2.5 text-xs font-extrabold text-slate-950 shadow-neon uppercase tracking-wider transition duration-300"
                >
                  Log In
                </button>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-3">
            {user && (
              <button
                onClick={() => onNavigate('profile')}
                className={`cursor-pointer flex items-center justify-center h-9 w-9 rounded-xl border text-sm transition-all duration-300 ${
                  (user.role === 'merchant' || user.user?.role === 'merchant')
                    ? 'border-amber-500/40 bg-[#1f1704] text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                    : 'border-[#1cf0b3]/30 bg-[#061b14] text-[#8effe3] shadow-neon'
                }`}
              >
                {(user.role === 'merchant' || user.user?.role === 'merchant') ? '👑' : '👤'}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition duration-300"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden mt-4 border-t border-white/5 pt-4"
            >
              <nav className="flex flex-col gap-4 text-slate-300 pb-4">
                <a href="#detect" onClick={(e) => handleNavLink(e, 'detect')} className="text-sm font-semibold uppercase tracking-wider py-2 border-b border-white/5 hover:text-white transition">
                  Detect
                </a>
                <a href="#stats" onClick={(e) => handleNavLink(e, 'stats')} className="text-sm font-semibold uppercase tracking-wider py-2 border-b border-white/5 hover:text-white transition">
                  Statistics
                </a>

                <a href="#reviews" onClick={(e) => handleNavLink(e, 'reviews')} className="text-sm font-semibold uppercase tracking-wider py-2 border-b border-white/5 hover:text-white transition">
                  Reviews
                </a>
                <a
                  href="#leaderboard"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsOpen(false)
                    onNavigate('leaderboard')
                  }}
                  className={`text-sm font-semibold uppercase tracking-wider py-2 border-b border-white/5 hover:text-white transition block ${
                    currentPage === 'leaderboard' ? 'text-accent' : ''
                  }`}
                >
                  Leaderboard
                </a>

                <button
                  onClick={() => {
                    setIsOpen(false)
                    onOpenInstallModal()
                  }}
                  className="cursor-pointer text-left text-sm font-semibold uppercase tracking-wider py-2 border-b border-white/5 text-[#8effe3] hover:text-white transition flex items-center gap-2"
                >
                  📲 Install Mobile App
                </button>

                {/* Mobile Theme Switcher */}
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">Neon Theme:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onChangeTheme('emerald')}
                      className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                        currentTheme === 'emerald'
                          ? 'border-[#1cf0b3]/40 bg-[#1cf0b3]/10 text-[#1cf0b3]'
                          : 'border-white/5 bg-white/5 text-slate-400'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#1cf0b3]" /> Lục
                    </button>
                    <button
                      onClick={() => onChangeTheme('synthwave')}
                      className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                        currentTheme === 'synthwave'
                          ? 'border-[#ff007f]/40 bg-[#ff007f]/10 text-[#ff007f]'
                          : 'border-white/5 bg-white/5 text-slate-400'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#ff007f]" /> Hồng
                    </button>
                    <button
                      onClick={() => onChangeTheme('cyber')}
                      className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                        currentTheme === 'cyber'
                          ? 'border-[#ffb703]/40 bg-[#ffb703]/10 text-[#ffb703]'
                          : 'border-white/5 bg-white/5 text-slate-400'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#ffb703]" /> Vàng
                    </button>
                  </div>
                </div>



                {/* Mobile Auth Panel */}
                <div className="pt-2">
                  {user ? (
                    <div className="flex items-center justify-between gap-4 mt-2">
                      <span className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 ${
                        (user.role === 'merchant' || user.user?.role === 'merchant')
                          ? 'text-amber-300 bg-[#1f1704] border border-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                          : 'text-[#8effe3] bg-[#061b14] border border-[#1cf0b3]/25 shadow-neon'
                      }`}>
                        Xin chào, <span className="font-mono">{user.username}</span> {(user.role === 'merchant' || user.user?.role === 'merchant') && ' 👑'}
                      </span>
                      <button
                        onClick={() => {
                          setIsOpen(false)
                          onLogout()
                        }}
                        className="cursor-pointer text-xs text-red-400 font-bold hover:text-red-300 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20"
                      >
                        Log Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        onOpenAuthModal()
                      }}
                      className="cursor-pointer w-full text-center rounded-xl bg-[#22f0a5] hover:bg-[#1cd893] py-3 text-xs font-extrabold text-slate-950 shadow-neon uppercase tracking-widest transition duration-300"
                    >
                      Log In tài khoản
                    </button>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
