import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WelcomeModal({ isOpen, onClose }) {
  const introText = "Non-destructive watermelon quality analysis platform, integrating deep learning AI inference and real-time interactive 3D visualization."
  
  const [typedText, setTypedText] = useState('')
  const [typingComplete, setTypingComplete] = useState(false)
  const [step, setStep] = useState(1) // 1: Intro, 2: Thank You

  useEffect(() => {
    if (!isOpen) return
    
    setTypedText('')
    setTypingComplete(false)
    setStep(1)
    
    let index = 0
    const interval = setInterval(() => {
      if (index < introText.length) {
        setTypedText((prev) => prev + introText.charAt(index))
        index++
      } else {
        setTypingComplete(true)
        clearInterval(interval)
      }
    }, 10) // fast typing speed

    return () => clearInterval(interval)
  }, [isOpen])

  const handleNextStep = () => {
    setStep(2)
  }

  const handleFinalClose = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010606]/90 backdrop-blur-2xl"
        >
          {/* Neon Glow background elements */}
          <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-[#22f0a5]/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#1cf0b3]/5 blur-[100px] pointer-events-none" />

          {/* Modal Container */}
          <motion.div
            key={step}
            initial={{ scale: 0.9, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="relative max-w-2xl w-full rounded-[40px] border border-white/10 bg-gradient-to-br from-[#041a14]/90 via-[#020b08]/95 to-[#051c16]/90 p-8 md:p-10 shadow-[0_0_100px_rgba(34,240,165,0.25)] text-center overflow-hidden"
          >
            {/* Tech grid scanning effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(46,255,176,0.06),_transparent_75%)] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#22f0a5] to-transparent opacity-90" />

            {step === 1 ? (
              <div className="space-y-6 relative z-10">
                {/* Icon badge */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#22f0a5]/10 border border-[#22f0a5]/30 shadow-[0_0_20px_rgba(34,240,165,0.25)]">
                  <span className="text-2xl animate-pulse">🍉</span>
                </div>

                {/* Title & Creator */}
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-wider text-white bg-gradient-to-r from-white via-[#81f9ce] to-white bg-clip-text text-transparent">
                    WATERMELON AI PLATFORM
                  </h2>
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1cf0b3]" />
                    <p className="text-[#8bfec0] font-semibold text-xs uppercase tracking-[0.25em]">
                      Project by Nguyen Le Bao Duy
                    </p>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1cf0b3]" />
                  </div>
                  <p className="text-[10px] tracking-widest font-mono text-slate-400 uppercase">
                    Da Nang, Vietnam
                  </p>
                </div>

                {/* Typewriter terminal introduction */}
                <div className="min-h-[60px] flex items-center justify-center rounded-2xl bg-black/45 border border-white/5 px-5 py-3 shadow-inner text-center">
                  <p className="text-sm text-[#c8ffd5] font-mono leading-relaxed">
                    &gt; {typedText}
                    {!typingComplete && <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#22f0a5] animate-pulse" />}
                  </p>
                </div>

                {/* High-tech Features Grid */}
                <div className="grid gap-4 sm:grid-cols-3 text-left">
                  {/* Feature 1 */}
                  <div className="rounded-2xl border border-white/5 bg-[#05130f]/60 p-4 shadow-sm hover:border-[#1cf0b3]/25 transition-all">
                    <div className="text-[#1cf0b3] font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1cf0b3]" />
                      AI Detection
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Real-time watermelon detection from live camera or image uploads using optimized <strong>YOLOv8/v11</strong> models.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="rounded-2xl border border-white/5 bg-[#05130f]/60 p-4 shadow-sm hover:border-[#1cf0b3]/25 transition-all">
                    <div className="text-[#1cf0b3] font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1cf0b3]" />
                      Optical Analysis
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Optical HSV skin scanning to estimate <strong>sweetness Brix</strong>, classify biological ripeness, and predict weight.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="rounded-2xl border border-white/5 bg-[#05130f]/60 p-4 shadow-sm hover:border-[#1cf0b3]/25 transition-all">
                    <div className="text-[#1cf0b3] font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1cf0b3]" />
                      3D Visual Sync
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Interactive <strong>3D watermelon visualization</strong> synchronized with real-time holographic scanning laser states.
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <motion.button
                    onClick={handleNextStep}
                    whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(34,240,165,0.45)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto cursor-pointer glow-button inline-flex items-center justify-center gap-2 rounded-2xl bg-[#22f0a5] hover:bg-[#1cd893] px-10 py-3.5 text-sm font-extrabold text-slate-950 transition duration-300 shadow-xl shadow-[#2effb0]/20 tracking-wider uppercase"
                  >
                    Start Experience 🚀
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 relative z-10 py-4">
                {/* Heart/Thank Badge */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#22f0a5]/10 border border-[#22f0a5]/30 shadow-[0_0_20px_rgba(34,240,165,0.25)]">
                  <span className="text-2xl animate-bounce">💖</span>
                </div>

                {/* Thank you Header */}
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-wider text-white bg-gradient-to-r from-[#81f9ce] via-white to-[#81f9ce] bg-clip-text text-transparent">
                    THANK YOU FOR VISITING
                  </h2>
                  <p className="text-[#8bfec0] font-mono text-[10px] uppercase tracking-[0.3em]">
                    Welcome to my creative workspace
                  </p>
                </div>

                {/* Heartwarming message */}
                <div className="rounded-3xl bg-black/45 border border-white/5 px-6 py-6 shadow-inner text-left space-y-4 max-w-xl mx-auto">
                  <p className="text-sm text-slate-200 leading-relaxed font-light">
                    Welcome to my small creative corner. This project was built with passion, aiming to integrate AI and modern 3D graphics to optimize the agricultural quality analysis experience. I hope you find useful information and have a great experience using this website!
                  </p>
                  <p className="text-sm text-slate-200 leading-relaxed font-light">
                    If you love the project, please leave positive feedback, reviews, or support me in the Donate section. Your contribution is a huge motivation for me to continue researching and upgrading breakthrough features in the future!
                  </p>
                  <p className="text-sm text-[#8dffdf] font-semibold text-center mt-2">
                    Wishing you a day full of energy and joy! 🍉
                  </p>
                </div>

                {/* Final close button */}
                <div className="pt-2">
                  <motion.button
                    onClick={handleFinalClose}
                    whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(34,240,165,0.45)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto cursor-pointer glow-button inline-flex items-center justify-center gap-2 rounded-2xl bg-[#22f0a5] hover:bg-[#1cd893] px-10 py-3.5 text-sm font-extrabold text-slate-950 transition duration-300 shadow-xl shadow-[#2effb0]/20 tracking-wider uppercase"
                  >
                    Start khám phá nền tảng ngay 🍉
                  </motion.button>
                </div>
              </div>
            )}

            {/* Corner styling tech accents */}
            <div className="absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#1cf0b3]/40" />
            <div className="absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#1cf0b3]/40" />
            <div className="absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#1cf0b3]/40" />
            <div className="absolute bottom-3 right-3 h-2.5 w-2.5 border-b border-r border-[#1cf0b3]/40" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
