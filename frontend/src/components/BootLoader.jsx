import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BootLoader({ onComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Wait 250ms after 100% to let the user see the complete state before fading out
          setTimeout(onComplete, 250)
          return 100
        }
        // Random incremental steps to make the loading feel organic
        const increment = Math.floor(Math.random() * 3) + 1
        return Math.min(prev + increment, 100)
      })
    }, 20) // Fast loading ~1.5 - 2s total

    return () => clearInterval(interval)
  }, [onComplete])

  // Map progress to logs to simulate real diagnostic boot sequence
  const logs = [
    { text: '⚙️ WATERMELON AI CLIENT v2.1.0 INITIALIZING...', show: progress >= 0 },
    { text: '[ OK ] Establishing secure handshake with Django REST API...', show: progress >= 15 },
    { text: '[ OK ] Initializing WebAssembly SIMD edge inference engine...', show: progress >= 38 },
    { text: '[ OK ] Pre-caching local model weights \'best.onnx\' (11.7 MB)...', show: progress >= 60 },
    { text: '[ OK ] WebGL hardware acceleration hook successfully mounted.', show: progress >= 82 },
    { text: '🚀 SYSTEM READY. LAUNCHING HYBRID DETECTOR...', show: progress >= 95 }
  ]

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#010506] p-4 text-white overflow-hidden select-none font-mono">
      {/* Background Soft Glow Tinted with active Theme Variable */}
      <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
      <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-accent-10 blur-3xl pointer-events-none" />
      <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-accent-10 blur-3xl pointer-events-none" />

      {/* Cyber Grid Particles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="floating-particles">
          <span className="particle particle-1" />
          <span className="particle particle-2" />
          <span className="particle particle-3" />
          <span className="particle particle-4" />
        </div>
      </div>

      {/* Main Terminal Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="w-full max-w-xl rounded-3xl border border-accent-20 bg-black/60 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_50px_rgba(var(--color-accent-rgb),0.12)] relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />

        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-accent-10 pb-3 mb-5">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ef4444]" />
            <span className="h-3 w-3 rounded-full bg-[#f59e0b]" />
            <span className="h-3 w-3 rounded-full bg-[#10b981]" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">watermelon-ai-loader.sh</span>
          <span className="text-xs text-accent font-semibold animate-pulse">BOOTING</span>
        </div>

        {/* Diagnostic Logs Screen */}
        <div className="space-y-2.5 min-h-[160px] text-left text-xs text-slate-300">
          <AnimatePresence>
            {logs.map((log, index) => log.show && (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-2 ${
                  index === logs.length - 1 
                    ? 'text-accent font-bold' 
                    : index === 0 
                      ? 'text-slate-200 font-bold' 
                      : 'text-slate-350'
                }`}
              >
                {log.text}
                {index === logs.filter(l => l.show).length - 1 && progress < 100 && (
                  <span className="typing-cursor" />
                )}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress Bar Container */}
        <div className="mt-8 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="text-accent uppercase tracking-widest font-bold">Deploying system</span>
            <span className="font-bold text-slate-200">{progress}%</span>
          </div>

          <div className="h-3 w-full rounded-full bg-white/5 border border-white/5 overflow-hidden p-0.5 relative">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
              style={{
                boxShadow: '0 0 12px var(--color-accent)'
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="mt-6 text-[10px] uppercase tracking-[0.4em] text-slate-600 font-bold text-center">
        Nguyen Le Bao Duy &copy; 2026. All rights reserved.
      </div>
    </div>
  )
}
