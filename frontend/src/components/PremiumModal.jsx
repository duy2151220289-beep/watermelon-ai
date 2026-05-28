import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function PremiumModal({ isOpen, onClose, onUpgradeSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('momo')
  const [isProcessing, setIsProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePay = () => {
    setIsProcessing(true)
    // Simulate premium payment validation
    setTimeout(() => {
      setIsProcessing(false)
      setSuccess(true)
      setTimeout(() => {
        onUpgradeSuccess()
        onClose()
        // Reset states
        setSuccess(false)
      }, 1500)
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 120 }}
          className="relative max-w-lg w-full rounded-[32px] border border-white/10 bg-[#071310]/95 backdrop-blur-xl shadow-[0_0_50px_rgba(251,191,36,0.18)] p-6 md:p-8 overflow-hidden z-10 font-sans"
        >
          {/* Top Yellow Ambient glow */}
          <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-6 right-6 h-8 w-8 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:text-white transition flex items-center justify-center text-slate-400 text-sm"
          >
            ✕
          </button>

          {!success ? (
            <div className="space-y-6 text-left">
              {/* Premium Heading */}
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 px-3 py-1 text-xs font-bold tracking-wider text-amber-400 font-mono uppercase shadow-[0_0_15px_rgba(245,158,11,0.12)]">
                  👑 Premium Merchant Pack
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight font-mono tracking-wide">
                  Nâng cấp Doanh nghiệp
                </h3>
                <p className="text-slate-300 text-sm font-light">
                  Mở khóa các công cụ chuyên sâu tối ưu cho hộ kinh doanh, nhà vườn và thương lái trái cây sạch.
                </p>
              </div>

              {/* Perks List */}
              <div className="space-y-3 bg-white/5 border border-white/5 rounded-2xl p-4 shadow-inner">
                <p className="text-xs uppercase tracking-widest text-amber-400 font-bold font-mono">Đặc quyền Premium:</p>
                <div className="grid gap-3.5 text-xs text-slate-200">
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 shrink-0 text-sm">✓</span>
                    <span><strong>Xuất Báo cáo CSV thực tế</strong>: Tải trực tiếp danh mục dưa hấu đã kiểm định để kết xuất báo cáo nhanh cho kế toán.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 shrink-0 text-sm">✓</span>
                    <span><strong>Quản lý lô hàng chuyên nghiệp</strong>: Gom và theo dõi chất lượng dưa hấu theo từng đợt nhập hàng.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 shrink-0 text-sm">✓</span>
                    <span><strong>Biểu đồ Analytics chuyên sâu</strong>: Phân tích chi tiết tổng sản lượng quét (kg) và độ ngọt trung bình Brix.</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-slate-400 font-bold font-mono">Phương thức thanh toán:</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'momo', name: 'Momo', icon: '💖' },
                    { id: 'visa', name: 'Visa/Master', icon: '💳' },
                    { id: 'qr', name: 'QR Pay', icon: '📲' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`cursor-pointer flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 ${
                        paymentMethod === method.id
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.08)]'
                          : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400'
                      }`}
                    >
                      <span className="text-xl mb-1">{method.icon}</span>
                      <span className="text-[10px] uppercase font-bold font-mono tracking-wider">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing & Upgrade Button */}
              <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/5">
                <div className="text-left font-mono">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 leading-none">Giá gói vĩnh viễn:</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-black text-[#1cf0b3]">499.000đ</span>
                    <span className="text-xs text-slate-400 line-through">999.000đ</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="cursor-pointer w-full md:w-auto min-w-[180px] bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black tracking-wider text-xs uppercase py-4 px-6 rounded-2xl shadow-[0_0_24px_rgba(245,158,11,0.22)] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Đang xác thực...
                    </>
                  ) : (
                    '🚀 Kích hoạt ngay'
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Payment Success Animation
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 flex flex-col items-center justify-center space-y-4"
            >
              <div className="h-20 w-20 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                🎉
              </div>
              <div className="space-y-2 text-center">
                <h4 className="text-xl font-black text-white font-mono tracking-wide uppercase">
                  Thanh toán thành công!
                </h4>
                <p className="text-emerald-400 text-xs font-mono font-medium tracking-wide">
                  Đã mở khóa Premium Doanh Nghiệp 🧑‍🌾
                </p>
                <p className="text-slate-400 text-xs px-6 font-light">
                  Hệ thống đang chuẩn bị bàn làm việc quản lý nông sản của bạn...
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default PremiumModal
