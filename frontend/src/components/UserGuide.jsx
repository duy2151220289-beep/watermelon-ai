import { motion, AnimatePresence } from 'framer-motion'

const GUIDE_STEPS = [
  {
    title: "👋 Welcome bạn!",
    content: "Welcome to Watermelon AI - An AI-powered website for real-time analysis, detection, and quality assessment of watermelons by Nguyen Le Bao Duy.",
    emoji: "🍉",
    targetId: "root"
  },
  {
    title: "📸 Quét ảnh AI trực quan",
    content: "In the 'Start Scan' section, upload/drag an image of a watermelon or open Live Camera for direct AI detection. Results show as a bounding box and confidence score.",
    emoji: "⚡",
    targetId: "detect"
  },
  {
    title: "📜 Xem & Tải Chứng chỉ",
    content: "After successful AI analysis, click 'View Certificate' to show the genuine quality certificate and download the scanned image.",
    emoji: "🏆",
    targetId: "detect"
  },
  {
    title: "📊 AI Statistics Charts",
    content: "The 'Statistics' area provides visual auto-updating charts on total scans and average confidence to easily track model performance.",
    emoji: "📈",
    targetId: "stats"
  },
  {
    title: "💬 News Feed & Reviews",
    content: "Update new notifications at 'News Feed'. You can also submit product quality reviews in the 'Reviews' section or donate to support the developer!",
    emoji: "💖",
    targetId: "news-feed"
  }
]

export default function UserGuide({ isOpen, onClose, currentStep, setStep }) {
  const stepData = GUIDE_STEPS[currentStep]

  const handleNext = () => {
    if (currentStep < GUIDE_STEPS.length - 1) {
      setStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1)
    }
  }

  const handleTitleClick = () => {
    if (stepData.targetId) {
      if (stepData.targetId === 'root') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const el = document.getElementById(stepData.targetId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, x: -50, y: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, x: -50, y: 20 }}
          transition={{ duration: 0.35, type: "spring", damping: 15 }}
          className="fixed left-6 max-sm:left-4 max-sm:right-4 bottom-24 max-sm:bottom-20 z-[110] max-w-sm w-auto sm:w-full rounded-3xl border border-[#1cf0b3]/30 bg-[#04120e]/95 p-6 max-sm:p-4.5 shadow-[0_0_40px_rgba(28,240,179,0.22)] text-white backdrop-blur-md"
        >
          {/* Subtle neon glowing light background decoration */}
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#1cf0b3]/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-[#22f0a5]/10 blur-2xl pointer-events-none" />

          {/* Close Header Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 cursor-pointer text-slate-400 hover:text-white hover:rotate-90 transition-all duration-300 text-sm bg-white/5 hover:bg-white/10 w-7 h-7 flex items-center justify-center rounded-full"
          >
            ✕
          </button>

          {/* Guide Content */}
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <div 
                onClick={handleTitleClick}
                className="flex h-11 w-11 max-sm:h-9 max-sm:w-9 shrink-0 items-center justify-center rounded-2xl max-sm:rounded-xl bg-[#1cf0b3]/10 border border-[#1cf0b3]/30 text-2xl max-sm:text-xl animate-bounce cursor-pointer hover:bg-[#1cf0b3]/25 transition-all duration-300"
                title="Click to scroll to this section"
              >
                {stepData.emoji}
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] max-sm:text-[8px] font-bold uppercase tracking-widest max-sm:tracking-wider text-[#8effd6] font-mono flex items-center gap-1">
                  Hướng Dẫn Sử Dụng
                </p>
                <h4 
                  onClick={handleTitleClick}
                  className="text-base max-sm:text-sm font-bold text-white font-mono cursor-pointer hover:text-[#1cf0b3] hover:underline decoration-[#1cf0b3]/50 decoration-2 underline-offset-4 transition-all duration-300 flex items-center gap-1.5 group/title"
                  title="Click to scroll to this section"
                >
                  {stepData.title}
                  <span className="text-xs text-[#1cf0b3] opacity-40 group-hover/title:opacity-100 transition-opacity font-normal">
                    🔗
                  </span>
                </h4>
              </div>
            </div>

            <p className="text-xs max-sm:text-[11px] text-slate-300 leading-relaxed font-light min-h-[72px] max-sm:min-h-[56px]">
              {stepData.content}
            </p>


            {/* Stepper controls */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
              <span className="text-[10px] font-mono tracking-wider text-slate-400">
                Bước {currentStep + 1} / {GUIDE_STEPS.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`cursor-pointer flex h-8 w-8 items-center justify-center rounded-xl border transition duration-300 text-xs font-bold ${
                    currentStep === 0
                      ? 'border-white/5 text-slate-600 cursor-not-allowed'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 text-[#8effd6]'
                  }`}
                >
                  ◀
                </button>
                <button
                  onClick={handleNext}
                  className="cursor-pointer flex h-8 px-4 items-center justify-center rounded-xl border border-[#1cf0b3]/30 bg-[#22f0a5]/10 hover:bg-[#22f0a5]/20 text-[#8effd6] transition duration-300 text-xs font-bold font-mono uppercase tracking-wider"
                >
                  {currentStep === GUIDE_STEPS.length - 1 ? 'Hoàn tất' : '▶'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
