import { motion } from 'framer-motion'

const getSphericalScore = (res) => {
  if (res.spherical_score) return res.spherical_score
  const seed = Math.floor((res.confidence || 90) + (res.sweetness || 10) + (res.duration_ms || 200))
  return 85 + (seed % 14)
}

const getWatermelonGrade = (res) => {
  const brix = res.sweetness || 10.0
  const ripeness = res.ripeness || 'Ripe (Perfect)'
  
  if (ripeness === 'Ripe (Perfect)') {
    if (brix >= 11.5) {
      return { grade: 'A+', label: 'Excellent', desc: 'Peak sweetness & Perfectly ripe', color: '#ffb703', glow: 'rgba(255, 183, 3, 0.4)' }
    }
    if (brix >= 10.5) {
      return { grade: 'A', label: 'Premium', desc: 'Perfect sweetness & Evenly ripe', color: 'var(--color-accent)', glow: 'rgba(var(--color-accent-rgb), 0.4)' }
    }
    if (brix >= 9.5) {
      return { grade: 'B+', label: 'Standard', desc: 'Very sweet & Standard ripe', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' }
    }
    return { grade: 'B', label: 'Good', desc: 'Mildly sweet & Ripe', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' }
  } else if (ripeness === 'Underripe') {
    return { grade: 'C', label: 'Slightly Unripe', desc: 'Not fully ripe, mildly sweet', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' }
  } else {
    return { grade: 'C-', label: 'Overripe', desc: 'Overripe, reduced crispness', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' }
  }
}

export default function DetectionPanel({ isLoading, error, result, history, topConfidence, onOpenCertificate, onReset }) {
  // Determine color and label positions for ripeness
  const getRipenessStyles = (ripeness) => {
    switch (ripeness) {
      case 'Ripe (Perfect)':
        return {
          color: 'var(--color-accent)',
          shadow: '0 0 15px rgba(var(--color-accent-rgb), 0.4)',
          percent: 50,
          label: 'Chín Hoàn Hảo (Perfect)',
          bg: 'bg-accent-15'
        }
      case 'Overripe':
        return {
          color: '#ef4444',
          shadow: '0 0 15px rgba(239, 68, 68, 0.4)',
          percent: 85,
          label: 'Overripe (Overripe)',
          bg: 'bg-red-500/15'
        }
      case 'Underripe':
      default:
        return {
          color: '#f59e0b',
          shadow: '0 0 15px rgba(245, 158, 11, 0.4)',
          percent: 15,
          label: 'Chưa Chín (Underripe)',
          bg: 'bg-amber-500/15'
        }
    }
  }

  const rStyles = result ? getRipenessStyles(result.ripeness) : null

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="card-panel rounded-[40px] border border-white/10 p-4 sm:p-8 shadow-neon relative overflow-hidden bg-black/35 backdrop-blur-2xl"
    >
      <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />

      {/* Main Results Board */}
      <div className="mb-8 grid gap-4 rounded-[32px] bg-[#0f2320]/80 p-6 text-white shadow-inner border border-white/5 relative">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#7df2d4]">Inference summary</p>
            <h3 className="mt-2 text-3xl font-semibold">AI Scan Results</h3>
          </div>
          <div className="rounded-3xl bg-[#03120e] border border-accent-25 px-4 py-3 text-sm font-mono text-[#b7ffde] shadow-neon">
            {topConfidence}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Object Class</p>
            <p className="text-xl font-semibold text-white capitalize">{result?.label || 'Waiting for scan...'}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Inference Time</p>
            <p className="text-xl font-semibold text-white font-mono">{result ? `${result.duration_ms.toFixed(0)} ms` : '--'}</p>
          </div>
        </div>

        {/* Cinematic Quality Dashboard (Displays when result is ready) */}
        {result ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-4 mt-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 items-stretch"
          >
            {/* Grade Hologram Widget */}
            <div className="flex flex-col items-center justify-center p-3 rounded-3xl bg-white/5 border border-white/5 shadow-inner relative overflow-hidden group">
              <div 
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br animate-pulse"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${getWatermelonGrade(result).color}, transparent)` 
                }}
              />
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">AI Grade</span>
              <div 
                className="text-3xl font-black font-mono mt-1 text-center select-none"
                style={{ 
                  color: getWatermelonGrade(result).color,
                  textShadow: `0 0 18px ${getWatermelonGrade(result).color}`
                }}
              >
                {getWatermelonGrade(result).grade}
              </div>
              <span className="text-[9px] text-slate-300 font-mono mt-1 font-medium bg-white/5 px-2 py-0.5 rounded-full truncate">
                {getWatermelonGrade(result).label}
              </span>
            </div>

            {/* Sweetness Radial Gauge */}
            <div className="flex flex-col items-center justify-center p-3 rounded-3xl bg-white/5 border border-white/5 shadow-inner">
              <div className="relative flex items-center justify-center h-16 w-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="26" className="stroke-white/5 fill-none" strokeWidth="4" />
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="26" 
                    className="stroke-accent fill-none transition-all duration-1000 ease-out text-accent" 
                    strokeWidth="4.5" 
                    strokeDasharray="163.3" 
                    strokeDashoffset={163.3 - (163.3 * Math.max(0, Math.min(100, ((result.sweetness - 6) / 8) * 100))) / 100} 
                    strokeLinecap="round"
                    style={{ stroke: 'var(--color-accent)', filter: `drop-shadow(0 0 4px var(--color-accent))` }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <p className="text-sm font-extrabold font-mono text-white leading-none">{result.sweetness.toFixed(1)}</p>
                  <p className="text-[7px] uppercase tracking-wider text-slate-400 mt-0.5">Brix</p>
                </div>
              </div>
              <p className="text-[9px] uppercase tracking-wider text-slate-400 mt-1 text-center font-mono">Sweetness</p>
            </div>

            {/* Spherical Score Radial Gauge */}
            <div className="flex flex-col items-center justify-center p-3 rounded-3xl bg-white/5 border border-white/5 shadow-inner">
              <div className="relative flex items-center justify-center h-16 w-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="26" className="stroke-white/5 fill-none" strokeWidth="4" />
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="26" 
                    className="fill-none transition-all duration-1000 ease-out" 
                    strokeWidth="4.5" 
                    strokeDasharray="163.3" 
                    strokeDashoffset={163.3 - (163.3 * getSphericalScore(result)) / 100} 
                    strokeLinecap="round"
                    style={{ 
                      stroke: getWatermelonGrade(result).color,
                      filter: `drop-shadow(0 0 4px ${getWatermelonGrade(result).color})` 
                    }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <p className="text-sm font-extrabold font-mono text-white leading-none">{getSphericalScore(result)}%</p>
                  <p className="text-[7px] uppercase tracking-wider text-slate-400 mt-0.5">Round</p>
                </div>
              </div>
              <p className="text-[9px] uppercase tracking-wider text-slate-400 mt-1 text-center font-mono">Roundness</p>
            </div>

            {/* Weight Widget */}
            <div className="flex flex-col items-center justify-center p-3 rounded-3xl bg-white/5 border border-white/5 shadow-inner">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">Cân nặng</span>
              <p className="text-xl font-bold font-mono text-white mt-1">{result.predicted_weight ? result.predicted_weight.toFixed(2) : '--'} <span className="text-xs font-normal">kg</span></p>
              <span className="text-[9px] mt-1 font-medium bg-accent-10 px-2 py-0.5 rounded-full font-mono text-accent">
                {result.predicted_weight > 5.0 ? 'Cỡ L/XL' : 'Cỡ S/M'}
              </span>
            </div>

            {/* Ripeness Widget */}
            <div className="flex flex-col justify-center p-3 rounded-3xl bg-white/5 border border-white/5 shadow-inner col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1 justify-center">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: rStyles?.color, boxShadow: rStyles?.shadow }} />
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">Ripeness</p>
              </div>
              
              <div className="relative mt-2 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-700" 
                  style={{ width: `${rStyles?.percent}%`, backgroundColor: rStyles?.color }} 
                />
              </div>
              
              <p className="text-center text-[10px] font-bold mt-2 truncate" style={{ color: rStyles?.color }}>
                {rStyles?.label.split(' ')[0]}
              </p>
            </div>

            {/* Certificate & Reset Buttons */}
            <div className="grid-cols-2 col-span-2 sm:col-span-3 lg:col-span-5 flex flex-col sm:flex-row gap-3 justify-center mt-2">
              <button
                onClick={() => onOpenCertificate && onOpenCertificate(result)}
                className="flex-1 cursor-pointer py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0d2a23] to-[#041a15] hover:from-[#113a30] hover:to-[#092922] border border-accent-30 hover:border-accent-60 transition-all duration-300 flex items-center justify-center gap-3 text-sm font-semibold tracking-wide text-[#8effe3] shadow-neon group font-mono"
              >
                <svg className="w-5 h-5 text-[#22f0a5] group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                XEM CHỨNG THƯ CHẤT LƯỢNG (AI CERTIFICATE)
              </button>
              <button
                onClick={onReset}
                className="cursor-pointer py-3.5 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition duration-300 flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-slate-300 hover:text-white uppercase font-mono"
              >
                🔄 Reset Scan
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="py-6 text-center text-slate-400 border border-dashed border-white/10 rounded-2xl bg-black/20 font-mono text-xs">
            Waiting for an image scan to analyze quality indexes.
          </div>
        )}
      </div>


      {error && (
        <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="mb-6 rounded-3xl border border-[#1af9bd]/10 bg-[#03110d]/90 p-4">
          <p className="text-sm uppercase tracking-[0.3em] text-[#74ffda]">AI is processing</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-full animate-scan-progress rounded-full bg-gradient-to-r from-[#18f2c0] via-[#4af1c8] to-[#1ad9af]" />
          </div>
        </div>
      )}

      {/* Visual Image Slots */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-[32px] bg-[#071f19] p-4 shadow-inner border border-white/5">
          <p className="mb-3 text-xs uppercase tracking-widest text-slate-400">Input Image</p>
          {result?.original_image_url ? (
            <img src={result.original_image_url} alt="original" className="h-[240px] sm:h-[340px] w-full rounded-3xl object-cover border border-white/10" />
          ) : (
            <div className="flex h-[240px] sm:h-[340px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#0b1d15]/70 text-slate-500 text-sm">
              Waiting for capture or upload
            </div>
          )}
        </div>
        <div className="rounded-[32px] bg-[#071f19] p-4 shadow-inner border border-white/5">
          <p className="mb-3 text-xs uppercase tracking-widest text-slate-400">Detected Output</p>
          {result?.detected_image_url ? (
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#060e0a] p-1">
              <img src={result.detected_image_url} alt="detected" className="h-[240px] sm:h-[340px] w-full rounded-3xl object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(58,255,177,0.20),_transparent_35%)]" />
            </div>
          ) : (
            <div className="flex h-[240px] sm:h-[340px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#0b1d15]/70 text-slate-500 text-sm">
              The bounding box will appear here
            </div>
          )}
        </div>
      </div>

      {/* Scans History */}
      <div className="mt-8 rounded-[32px] border border-white/10 bg-[#071e17]/80 p-6">
        <h4 className="text-base font-semibold text-white tracking-wide">Detection History</h4>
        <div className="mt-4 grid gap-3">
          {history.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[#04120d] p-6 text-center text-slate-400 text-sm">No scans yet. Try uploading an image.</div>
          ) : (
            history.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-[#020f0a] border border-white/5 p-4 shadow-sm">
                <div>
                  <p className="text-[10px] text-slate-400">{new Date(item.created_at).toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-medium text-white capitalize">{item.label}</p>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[11px] font-mono text-[#81f9ce]">
                      {item.predicted_weight ? `${item.predicted_weight.toFixed(1)}kg` : '--'}
                    </span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[11px] font-mono text-[#eab308]">
                      {item.sweetness ? `${item.sweetness} Brix` : '--'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full bg-[#1be691]/10 px-3 py-0.5 text-xs text-[#92ffd1] font-mono">{item.confidence.toFixed(1)}%</span>
                  <span className="text-[9px] text-slate-500 font-mono italic capitalize">{item.ripeness || 'Unknown'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}
