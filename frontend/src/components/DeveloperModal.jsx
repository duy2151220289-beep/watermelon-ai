import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

export default function DeveloperModal({ isOpen, onClose, isAdmin, user, onClearSuccess }) {
  const [avatar, setAvatar] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [clearStatus, setClearStatus] = useState(null)
  
  // Load saved developer avatar on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('developer_custom_avatar')
    if (savedAvatar) {
      setAvatar(savedAvatar)
    }
  }, [])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Data = reader.result
        setAvatar(base64Data)
        localStorage.setItem('developer_custom_avatar', base64Data)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatar(null)
    localStorage.removeItem('developer_custom_avatar')
  }

  const handleClearImages = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    setIsClearing(true)
    setClearStatus(null)
    try {
      const response = await axios.post('/api/clear-uploads/', {}, {
        headers: {
          Authorization: `Token ${user?.token}`
        }
      })
      setClearStatus({ 
        type: 'success', 
        text: `Cleanup successful! Deleted ${response.data.files_deleted} images and ${response.data.records_deleted} records.` 
      })
      setConfirmDelete(false)
      if (onClearSuccess) {
        onClearSuccess()
      }
      setTimeout(() => setClearStatus(null), 5000)
    } catch (err) {
      const errMsg = err?.response?.data?.detail || 'Có lỗi xảy ra khi dọn dẹp ảnh.'
      setClearStatus({ type: 'error', text: errMsg })
      setConfirmDelete(false)
    } finally {
      setIsClearing(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        {/* Background Click to Close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="relative w-full max-w-lg overflow-hidden rounded-[38px] border border-[#1cf0b3]/50 bg-[#020a08]/95 p-8 md:p-10 shadow-[0_0_80px_rgba(28,240,179,0.3)] text-white z-10"
        >
          {/* Neon Glow Accents */}
          <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[#1cf0b3]/15 blur-[55px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-44 w-44 rounded-full bg-[#00d2ff]/10 blur-[55px] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="cursor-pointer absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/15 transition-all z-20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content Wrapper */}
          <div className="flex flex-col items-center text-center space-y-6 max-h-[70vh] overflow-y-auto w-full pr-1.5 custom-scrollbar">
            
            {/* Avatar Section */}
            <div className="relative group">
              <div className="relative h-28 w-28 rounded-full border-2 border-[#1cf0b3] flex items-center justify-center bg-black/60 shadow-[0_0_30px_rgba(28,240,179,0.2)] overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Developer Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl">🍉</span>
                )}
                {/* Overlay edit state */}
                {isAdmin && (
                  <label className="cursor-pointer absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
                    <span className="text-[10px] uppercase font-bold text-[#1cf0b3] tracking-wider">Thay ảnh</span>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Holographic spin ring */}
              <div className="absolute -inset-2 rounded-full border border-dashed border-[#1cf0b3]/30 animate-spin-slow pointer-events-none" />
            </div>

            {avatar && isAdmin && (
              <button
                onClick={handleRemoveAvatar}
                className="cursor-pointer text-[10px] uppercase tracking-wider text-red-400 hover:text-red-300 font-bold transition-all bg-red-950/20 border border-red-500/20 px-3 py-1 rounded-full"
              >
                Remove avatar
              </button>
            )}

            {/* Profile Meta Info */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-mono tracking-[0.35em] text-[#81f9ce] uppercase">Project developed by</p>
              <h2 className="text-3xl font-black bg-gradient-to-r from-white via-[#8ffff5] to-white bg-clip-text text-transparent">
                NGUYỄN LÊ BẢO DUY
              </h2>
              <div className="flex justify-center gap-2.5 text-xs text-slate-400 font-mono">
                <span>🎂 Born: <strong className="text-white">2003</strong></span>
                <span>•</span>
                <span>💼 Công việc: <strong className="text-[#1cf0b3]">Web Developer</strong></span>
              </div>
            </div>

            <hr className="w-full border-white/10" />

            {/* Project Goals */}
            <div className="w-full text-left space-y-3">
              <h4 className="text-xs uppercase font-mono tracking-wider text-[#81f9ce] font-bold">🎯 Mục tiêu phát triển dự án:</h4>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#1cf0b3] mt-0.5">✔</span>
                  <span><strong>AI Expansion:</strong> Integrate more non-destructive fruit detection models (mango, durian, jackfruit...).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1cf0b3] mt-0.5">✔</span>
                  <span><strong>Nâng cấp Trực quan 3D:</strong> Add công nghệ WebGL / Three.js tương tác giải phẫu sâu cấu trúc ruột trái cây thời gian thực.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1cf0b3] mt-0.5">✔</span>
                  <span><strong>Mobile Sync:</strong> Build Native Mobile app (iOS/Android) for direct camera scanning at farms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1cf0b3] mt-0.5">✔</span>
                  <span><strong>Edge Computing AI:</strong> Optimize YOLO model to run directly on browsers or edge devices offline.</span>
                </li>
              </ul>
            </div>

            {/* Upload Box for Avatar if not uploaded yet */}
            {!avatar && isAdmin && (
              <div className="w-full pt-2">
                <label className="cursor-pointer flex flex-col items-center justify-center border border-dashed border-[#1cf0b3]/30 hover:border-[#1cf0b3]/60 bg-[#031510] rounded-2xl p-4 transition-all duration-300 group">
                  <svg className="w-6 h-6 text-slate-500 group-hover:text-[#1cf0b3] mb-1.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">Upload Developer Avatar</span>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>
            )}

            {/* Admin Cleanup Controls */}
            {isAdmin && (
              <div className="w-full pt-4 mt-2 border-t border-white/10 text-left space-y-4">
                <h4 className="text-xs uppercase font-mono tracking-wider text-red-400 font-bold flex items-center gap-2">
                  <span>⚙</span> Hệ thống Quản trị (Admin Panel)
                </h4>
                <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-4 space-y-3 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-200">Dọn dẹp bộ nhớ ảnh lưu trữ</span>
                    <span className="text-[11px] text-slate-400 font-light leading-relaxed">
                      Delete all uploaded images (`media/uploads` and `media/results`) and clear scan history from the database.
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleClearImages}
                      disabled={isClearing}
                      className={`cursor-pointer w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 select-none ${
                        isClearing 
                          ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          : confirmDelete
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_25px_rgba(220,38,38,0.4)] animate-pulse'
                            : 'bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50'
                      }`}
                    >
                      {isClearing ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border border-slate-500 border-t-transparent" />
                          Cleaning up system...
                        </>
                      ) : confirmDelete ? (
                        '⚠️ Click again to confirm permanent deletion!'
                      ) : (
                        '🗑 Dọn dẹp tất cả ảnh tải lên'
                      )}
                    </button>

                    {confirmDelete && (
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="cursor-pointer text-[10px] uppercase font-bold text-center text-slate-400 hover:text-white transition duration-200"
                      >
                        Hủy bỏ
                      </button>
                    )}
                  </div>

                  {clearStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl px-3 py-2.5 text-xs text-left font-mono font-medium ${
                        clearStatus.type === 'success'
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/10 border border-red-500/20 text-red-400'
                      }`}
                    >
                      {clearStatus.type === 'success' ? '✅ ' : '❌ '}
                      {clearStatus.text}
                    </motion.div>
                  )}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
