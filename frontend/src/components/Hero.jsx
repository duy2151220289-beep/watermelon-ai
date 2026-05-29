import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Watermelon3D from './Watermelon3D'

function useTyping(values, { typeMs = 70, deleteMs = 45, holdMs = 900 } = {}) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = values[index]
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (subIndex < current.length) {
          setSubIndex((v) => v + 1)
        } else {
          setIsDeleting(true)
        }
      } else {
        if (subIndex > 0) {
          setSubIndex((v) => v - 1)
        } else {
          setIsDeleting(false)
          setIndex((v) => (v + 1) % values.length)
        }
      }
    }, isDeleting ? deleteMs : typeMs)

    return () => clearTimeout(timer)
  }, [deleteMs, holdMs, index, isDeleting, subIndex, typeMs, values])

  // hold step (small, lightweight)
  useEffect(() => {
    const current = values[index]
    if (!isDeleting && subIndex === current.length) {
      const timer = setTimeout(() => setIsDeleting(true), holdMs)
      return () => clearTimeout(timer)
    }
  }, [holdMs, index, isDeleting, subIndex, values])

  return values[index].slice(0, subIndex)
}

export default function Hero({ activeResult, isLoading, onOpenDeveloperModal, onOpenInstallModal, onOpenDonateModal }) {

  const cardRef = useRef(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  const skills = useMemo(
    () => ['HTML', 'CSS', 'JavaScript', 'Python', 'Django', 'React.js', 'Node.js', 'MongoDB', 'C++', 'GitHub'],
    []
  )
  const typedSkill = useTyping(skills, { typeMs: 65, deleteMs: 40, holdMs: 1000 })

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      const x = (px - 0.5) * 10
      const y = (py - 0.5) * -10
      setParallax({ x, y })
    }

    const onLeave = () => setParallax({ x: 0, y: 0 })

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section className="relative overflow-hidden py-20">
      {/* Cinematic Background Video with absolute fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-20"
        >
          <source src="/hero_bg.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-glowing-dots-in-a-dark-space-41604-large.mp4" type="video/mp4" />
        </video>
        {/* Soft overlays to merge video edges and guarantee text readability */}
        <div className="absolute inset-0 bg-radial-glow opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020607]/20 via-transparent to-[#020607]" />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-70 z-10">
        <div className="absolute left-10 top-10 h-2 w-2 rounded-full bg-[#1cf0b3]/70 shadow-[0_0_18px_rgba(28,240,179,0.55)]" />
        <div className="absolute right-16 top-24 h-1.5 w-1.5 rounded-full bg-[#55ffca]/60 shadow-[0_0_18px_rgba(85,255,202,0.4)]" />
        <div className="absolute bottom-24 left-1/3 h-1.5 w-1.5 rounded-full bg-[#2efd94]/60 shadow-[0_0_18px_rgba(46,253,148,0.35)]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_0.7fr] items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white bg-[#030a08]/90 theme-led-border select-none shadow-neon font-mono">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> AI watermelon scanner
            </p>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <h2
                  onClick={onOpenDeveloperModal}
                  className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white cursor-pointer hover:text-[#1cf0b3] transition duration-300 neon-text"
                >
                  Watermelon AI
                </h2>
                
                {/* Social Icons */}
                <div className="flex items-center gap-3 mt-1.5 md:mt-2.5">
                  <a
                    href="https://facebook.com/duyduy0610"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:border-[#1cf0b3] hover:bg-[#1cf0b3]/15 hover:text-[#1cf0b3] shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-[0_0_20px_rgba(28,240,179,0.4)]"
                    title="Facebook"
                  >
                    <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1h-4c-2.8 0-5 2.2-5 5v2z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/paodii.uwu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:border-[#1cf0b3] hover:bg-[#1cf0b3]/15 hover:text-[#1cf0b3] shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-[0_0_20px_rgba(28,240,179,0.4)]"
                    title="Instagram"
                  >
                    <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                </div>
              </div>
              <p className="text-base font-semibold tracking-tight text-[#8bfec0] md:text-lg">
                Developer Application Website from Da Nang, Vietnam
              </p>
            </div>

            <p className="max-w-2xl text-slate-300 sm:text-lg">
              Passionate about AI-powered web applications, futuristic UI experiences, and modern fullstack development using Django, React, and YOLOv8.
            </p>

            <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-neon">
              <span className="text-xs uppercase tracking-[0.3em] text-[#91ffd6]">Skills</span>
              <div className="ml-2 inline-flex items-center gap-2">
                <span className="text-sm text-white">{typedSkill}</span>
                <span className="typing-cursor" />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#04120e]/60 p-4 shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(46,255,176,0.18),_transparent_55%)]" />
              <div className="relative flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.03 }}
                    whileHover={{ scale: 1.04 }}
                    className="rounded-3xl border border-white/10 bg-white/5 px-3 py-1 text-sm text-[#d8ffe9] shadow-[0_0_25px_rgba(46,251,191,0.12)]"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="space-y-4 sm:flex sm:items-center sm:gap-4 sm:space-y-0">
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <a href="#detect" className="glow-button inline-flex items-center justify-center rounded-3xl bg-[#22f0a5] px-6 py-3 text-base font-semibold text-slate-950 transition shadow-xl shadow-[#2effb0]/25 hover:-translate-y-1">
                  Start Scan
                </a>
                <button
                  onClick={onOpenDonateModal}
                  className="cursor-pointer inline-flex items-center justify-center rounded-3xl border border-accent-30 bg-accent-5 hover:bg-accent-15 text-accent px-6 py-3 text-base font-semibold transition duration-300 shadow-neon hover:-translate-y-1 font-mono"
                >
                  🎁 Donate
                </button>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-neon flex-1 sm:flex-none">
                <p className="text-xs uppercase tracking-[0.3em] text-[#91ffd6]">Last detection</p>
                <p className="mt-2 text-2xl font-semibold text-white">{activeResult ? `${activeResult.confidence.toFixed(1)}%` : '--'}</p>
              </div>
            </div>

          </motion.div>

          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            whileHover={{ boxShadow: '0 30px 110px rgba(34,240,165,0.10)' }}
            style={{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)` }}
            className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#072114] via-[#071e17] to-[#0b1d1a] p-6 shadow-neon"
          >
            <div className="absolute -left-20 top-10 h-40 w-40 rounded-full bg-[#22f0a5]/10 blur-3xl" />
            <div className="absolute -right-24 bottom-8 h-48 w-48 rounded-full bg-[#1fbf9d]/10 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#1cf0b3] to-transparent opacity-60" />

            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="floating-particles">
                <span className="particle particle-1" />
                <span className="particle particle-2" />
                <span className="particle particle-3" />
                <span className="particle particle-4" />
                <span className="particle particle-5" />
                <span className="particle particle-6" />
              </div>
            </div>


            <div className="hero-watermelon-frame relative mx-auto h-[280px] sm:h-[420px] w-full max-w-[420px] overflow-hidden rounded-[32px] bg-[#031312]/70 p-4 shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(46,255,176,0.12),_transparent_65%)] pointer-events-none" />
              <Watermelon3D isLoading={isLoading} />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#020607]/80 to-transparent pointer-events-none" />
            </div>


            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 rounded-3xl border border-white/10 bg-[#04120e]/80 p-4 shadow-inner"
              whileHover={{ y: -2 }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-[#8bfec0]">AI scan overlay</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-xs uppercase text-slate-400">Model</p>
                  <p className="mt-1 text-sm font-semibold text-white">YOLOv11 Watermelon</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-xs uppercase text-slate-400">Trend</p>
                  <p className="mt-1 text-sm font-semibold text-white">Realtime GPU-ready</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
