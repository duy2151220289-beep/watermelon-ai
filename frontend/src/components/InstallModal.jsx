import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InstallModal({ isOpen, onClose, deferredPrompt, setDeferredPrompt }) {
  const [activePlatform, setActivePlatform] = useState(null) // 'ios' or 'android'

  const handleAndroidInstall = async () => {
    if (deferredPrompt) {
      // Trigger the native browser installation prompt
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to PWA install: ${outcome}`)
      // Prompt can only be used once, so clear it
      setDeferredPrompt(null)
      onClose()
    } else {
      // Fallback: Show manual install steps
      setActivePlatform('android_manual')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#061811] via-[#051410] to-[#040e0b] p-6 sm:p-8 max-w-lg w-full text-white shadow-[0_0_50px_rgba(28,240,179,0.18)]"
          >
            {/* Cyber Glow Overlays */}
            <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-[#1cf0b3]/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-16 -bottom-16 h-36 w-36 rounded-full bg-[#22f0a5]/10 blur-3xl pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#1cf0b3] to-transparent opacity-60" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 cursor-pointer text-slate-400 hover:text-white hover:rotate-90 transition-all duration-300 text-sm bg-white/5 hover:bg-white/10 w-8 h-8 flex items-center justify-center rounded-full"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-2 mb-6">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1cf0b3]/10 border border-[#1cf0b3]/30 text-2xl animate-pulse">
                📲
              </span>
              <h3 className="text-xl font-bold tracking-wide font-mono text-white">
                Install Mobile App
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light font-mono max-w-sm mx-auto">
                Trải nghiệm AI nhận diện dưa hấu toàn màn hình 100% mượt mà, hỗ trợ quét ngoại tuyến ngoại cảnh không cần mạng!
              </p>
            </div>

            {/* Selection/Display Logic */}
            <AnimatePresence mode="wait">
              {activePlatform === null ? (
                // Platform Selection Grid
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Apple iOS Option */}
                  <button
                    onClick={() => setActivePlatform('ios')}
                    className="cursor-pointer flex flex-col items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-5 hover:border-[#1cf0b3]/30 hover:bg-[#1cf0b3]/5 transition-all duration-300 group"
                  >
                    <span className="text-4xl group-hover:scale-110 transition-transform">🍏</span>
                    <span className="text-sm font-bold tracking-wide font-mono text-white">iOS OS</span>
                    <span className="text-[10px] text-slate-400 font-mono">iPhone / iPad</span>
                  </button>

                  {/* Google Android Option */}
                  <button
                    onClick={deferredPrompt ? handleAndroidInstall : () => setActivePlatform('android_manual')}
                    className="cursor-pointer flex flex-col items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-5 hover:border-[#1cf0b3]/30 hover:bg-[#1cf0b3]/5 transition-all duration-300 group"
                  >
                    <span className="text-4xl group-hover:scale-110 transition-transform animate-bounce">🤖</span>
                    <span className="text-sm font-bold tracking-wide font-mono text-white">Android OS</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {deferredPrompt ? 'Auto Install ⚡' : 'Google Chrome / Other'}
                    </span>
                  </button>
                </motion.div>
              ) : activePlatform === 'ios' ? (
                // iOS Installation Steps Guide
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 text-left"
                >
                  <h4 className="text-sm font-bold text-[#8effd6] font-mono border-b border-white/5 pb-2 flex items-center gap-2">
                    🍏 iOS Installation Guide (Safari):
                  </h4>
                  
                  <ol className="space-y-3.5 text-xs text-slate-300 font-light font-mono list-none p-0">
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1cf0b3]/25 text-[10px] font-bold text-[#8effd6]">1</span>
                      <p>Mở trình duyệt <b>Safari</b> trên iPhone và truy cập vào Website dưa hấu.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1cf0b3]/25 text-[10px] font-bold text-[#8effd6]">2</span>
                      <p>Click the <b>Share</b> button (square icon with an up arrow <span className="text-base">⎋</span> on the bottom toolbar).</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1cf0b3]/25 text-[10px] font-bold text-[#8effd6]">3</span>
                      <p>Cuộn xuống dưới và chọn dòng <b>"Add vào MH chính"</b> (Add to Home Screen).</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1cf0b3]/25 text-[10px] font-bold text-[#8effd6]">4</span>
                      <p>Click <b>"Add"</b> in the top right corner. Done! The App icon will appear on your home screen.</p>
                    </li>
                  </ol>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setActivePlatform(null)}
                      className="cursor-pointer flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition"
                    >
                      ◀ Quay lại
                    </button>
                    <button
                      onClick={onClose}
                      className="cursor-pointer flex-1 rounded-xl border border-[#1cf0b3]/30 bg-[#22f0a5]/10 hover:bg-[#22f0a5]/20 py-2.5 text-xs font-bold text-[#8effd6] transition"
                    >
                      Close guide
                    </button>
                  </div>
                </motion.div>
              ) : (
                // Android Manual Steps Guide (Fallback)
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 text-left"
                >
                  <h4 className="text-sm font-bold text-[#8effd6] font-mono border-b border-white/5 pb-2 flex items-center gap-2">
                    🤖 Android Installation Guide (Chrome):
                  </h4>

                  <ol className="space-y-3.5 text-xs text-slate-300 font-light font-mono list-none p-0">
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1cf0b3]/25 text-[10px] font-bold text-[#8effd6]">1</span>
                      <p>Open <b>Google Chrome</b> on your Android phone.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1cf0b3]/25 text-[10px] font-bold text-[#8effd6]">2</span>
                      <p>Nhấp vào biểu tượng <b>3 dấu chấm</b> ở góc trên cùng bên phải màn hình.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1cf0b3]/25 text-[10px] font-bold text-[#8effd6]">3</span>
                      <p>Chọn dòng <b>"Install ứng dụng"</b> (hoặc <b>"Add vào Màn hình chính"</b>).</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1cf0b3]/25 text-[10px] font-bold text-[#8effd6]">4</span>
                      <p>Confirm <b>"Install"</b>. The App icon will be downloaded to your home screen immediately.</p>
                    </li>
                  </ol>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setActivePlatform(null)}
                      className="cursor-pointer flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition"
                    >
                      ◀ Quay lại
                    </button>
                    <button
                      onClick={onClose}
                      className="cursor-pointer flex-1 rounded-xl border border-[#1cf0b3]/30 bg-[#22f0a5]/10 hover:bg-[#22f0a5]/20 py-2.5 text-xs font-bold text-[#8effd6] transition"
                    >
                      Close guide
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
