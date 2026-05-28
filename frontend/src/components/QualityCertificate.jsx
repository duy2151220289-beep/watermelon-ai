import { motion, AnimatePresence } from 'framer-motion'

export default function QualityCertificate({ isOpen, onClose, result }) {
  if (!result) return null

  const scanId = `WM-${result.id}-${Math.floor(1000 + Math.random() * 9000)}`
  const formattedDate = new Date(result.created_at).toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  // Dynamic QR Code generation using qrserver API
  const qrData = encodeURIComponent(`Watermelon Quality Passport\nScan ID: ${scanId}\nRipeness: ${result.ripeness}\nSweetness: ${result.sweetness} Brix\nWeight: ${result.predicted_weight} kg`)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&color=1cf0b3&bgcolor=061a15`

  const handlePrint = () => {
    window.print()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          {/* Custom style injection for high-tech print formatting */}
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              body * {
                visibility: hidden !important;
              }
              #print-certificate-area, #print-certificate-area * {
                visibility: visible !important;
              }
              #print-certificate-area {
                position: fixed !important;
                left: 5% !important;
                top: 10% !important;
                width: 90% !important;
                max-width: 800px !important;
                background-color: #030e0b !important;
                border: 3px solid #1cf0b3 !important;
                border-radius: 24px !important;
                padding: 30px !important;
                color: #ffffff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                box-shadow: none !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}} />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-[36px] border border-[#1cf0b3]/45 bg-[#030e0b] p-8 md:p-10 shadow-[0_0_80px_rgba(28,240,179,0.25)] text-white"
          >
            {/* Holographic Glowing Accents */}
            <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-[#1cf0b3]/10 blur-[90px] pointer-events-none" />
            <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-[#3bf7ff]/10 blur-[90px] pointer-events-none" />
            
            {/* Top Close Button (no-print) */}
            <button
              onClick={onClose}
              className="no-print cursor-pointer absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/15 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Certificate Area to Print */}
            <div id="print-certificate-area" className="relative flex flex-col gap-8">
              {/* Certificate Border Line Decoration */}
              <div className="absolute -inset-4 rounded-[28px] border border-[#1cf0b3]/10 pointer-events-none" />
              
              {/* Header */}
              <div className="text-center space-y-2 border-b border-[#1cf0b3]/20 pb-6">
                <div className="flex items-center justify-center gap-3">
                  <span className="h-2 w-10 rounded-full bg-gradient-to-r from-transparent to-[#1cf0b3]" />
                  <p className="text-xs uppercase tracking-[0.4em] text-[#8affdf] font-semibold">AI Watermelon Quality Certificate</p>
                  <span className="h-2 w-10 rounded-full bg-gradient-to-l from-transparent to-[#1cf0b3]" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-white via-[#e8fffc] to-[#a2ffe4] bg-clip-text text-transparent">
                  CHỨNG THƯ CHẤT LƯỢNG DƯA HẤU
                </h2>
                <p className="text-[10px] font-mono text-slate-400">PASSPORT ID: {scanId}</p>
              </div>

              {/* Main Body Grid */}
              <div className="grid gap-8 md:grid-cols-2 items-center">
                {/* Left Side: Image Visual with Tech Bounding Box */}
                <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/40 p-4 shadow-inner">
                  <div className="absolute top-2 left-2 text-[8px] font-mono text-[#1cf0b3] tracking-widest uppercase">Target Image</div>
                  <div className="absolute bottom-2 right-3 text-[8px] font-mono text-slate-500">SYSTEM STABLE V1.0</div>
                  
                  <div className="relative mt-4 overflow-hidden rounded-xl border border-white/10 w-full max-h-[220px]">
                    <img 
                      src={result.detected_image_url || result.original_image_url} 
                      alt="Watermelon Certificate" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Bounding box simulated neon corner frames */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#3bf7ff]" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#3bf7ff]" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#3bf7ff]" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#3bf7ff]" />
                  </div>
                </div>

                {/* Right Side: Quality Specifications */}
                <div className="space-y-5">
                  <h3 className="text-sm uppercase tracking-[0.25em] text-[#1cf0b3] font-semibold border-b border-white/5 pb-2">Analysis Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-[#08201a]/70 border border-white/5 p-3.5">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Khối Lượng</p>
                      <p className="text-2xl md:text-3xl font-extrabold font-mono text-white mt-1">{result.predicted_weight?.toFixed(2)} kg</p>
                    </div>

                    <div className="rounded-xl bg-[#08201a]/70 border border-white/5 p-3.5">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Sweetness</p>
                      <p className="text-2xl md:text-3xl font-extrabold font-mono text-white mt-1">{result.sweetness?.toFixed(1)} Brix</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#08201a]/70 border border-white/5 p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">Ripeness State</p>
                      <p className="text-lg md:text-xl font-extrabold mt-1 text-[#1cf0b3]">
                        {result.ripeness === 'Ripe (Perfect)' ? 'Chín Hoàn Hảo' : 
                         result.ripeness === 'Overripe' ? 'Overripe' : 'Chưa Chín'}
                      </p>
                    </div>
                    <span 
                      className={`h-5 w-5 rounded-full shadow-[0_0_15px_rgba(28,240,179,0.6)]`}
                      style={{ 
                        backgroundColor: result.ripeness === 'Ripe (Perfect)' ? '#1cf0b3' : 
                                         result.ripeness === 'Overripe' ? '#ef4444' : '#f59e0b'
                      }}
                    />
                  </div>

                  <div className="space-y-1.5 font-mono text-xs text-slate-300">
                    <p>Hệ thống suy luận: <span className="text-white">YOLOv11 Inference</span></p>
                    <p>Model confidence: <span className="text-white">{result.confidence.toFixed(1)}%</span></p>
                    <p>Thời gian quét: <span className="text-white">{formattedDate}</span></p>
                  </div>
                </div>
              </div>

              {/* Bottom Certificate Seal & QR Section */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[#1cf0b3]/20 pt-6 mt-2">
                {/* Guarantee & Seal */}
                <div className="flex items-center gap-4 text-left">
                  {/* Glowing Approved Hologram */}
                  <div className="relative h-16 w-16 rounded-full border border-dashed border-[#1cf0b3]/40 flex items-center justify-center animate-spin-slow">
                    <div className="absolute inset-1 rounded-full border border-[#1cf0b3] flex items-center justify-center font-bold text-[8px] font-mono text-[#1cf0b3]">
                      AI PASSED
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-bold tracking-wide text-white">BẢO CHỨNG BỞI WATERMELON AI</p>
                    <p className="text-xs text-slate-300 max-w-sm leading-relaxed">Non-destructive optical analysis data generated automatically by AI through watermelon rind structure analysis.</p>
                  </div>
                </div>

                {/* dynamic neon QR code */}
                <div className="flex flex-col items-center p-2 rounded-xl bg-[#061a15] border border-[#1cf0b3]/30 shadow-inner">
                  <img src={qrUrl} alt="QR Verification" className="w-[100px] height-[100px]" />
                  <p className="text-[9px] text-[#1cf0b3] font-mono mt-1.5 tracking-widest font-semibold uppercase">Scan to Verify</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions (no-print) */}
            <div className="no-print mt-8 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-white/5 pt-6">
              <button
                onClick={onClose}
                className="w-full sm:w-auto cursor-pointer px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all text-sm font-semibold"
              >
                Cancel / Close
              </button>
              <button
                onClick={handlePrint}
                className="w-full sm:w-auto cursor-pointer px-6 py-2.5 rounded-xl bg-[#22f0a5] hover:bg-[#1cd893] text-slate-950 font-bold transition-all text-sm shadow-neon flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2zm5-17h-5v4h5V4z" />
                </svg>
                In / Tải PDF Chứng Chỉ
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
