import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

export default function LeaderboardPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('scanners') // 'scanners' or 'supporters'
  const [data, setData] = useState({ scanners: [], supporters: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/leaderboard/')
        setData(response.data)
      } catch (err) {
        console.error('Error fetching leaderboard:', err)
        setError('Không thể tải dữ liệu bảng xếp hạng. Vui lòng thử lại!')
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  // Helper for rank badges
  const getRankBadge = (rank, type) => {
    if (type === 'scanners') {
      if (rank === 1) return { icon: '💎', label: 'Kim cương', color: 'from-[#00f0ff] to-[#0072ff] text-[#00f0ff] border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.3)]' }
      if (rank === 2) return { icon: '🥇', label: 'Vàng', color: 'from-[#ffb703] to-[#fb8500] text-[#ffb703] border-[#ffb703]/40 shadow-[0_0_20px_rgba(255,183,3,0.3)]' }
      if (rank === 3) return { icon: '🥈', label: 'Bạc', color: 'from-[#e0e0e0] to-[#9e9e9e] text-[#e0e0e0] border-[#e0e0e0]/40 shadow-[0_0_20px_rgba(224,224,224,0.3)]' }
      return { icon: '🥉', label: 'Bronze', color: 'from-[#a18276] to-[#8d5b4c] text-[#a18276] border-[#a18276]/30' }
    } else {
      if (rank === 1) return '🏆'
      if (rank === 2) return '🥈'
      if (rank === 3) return '🥉'
      return '⭐'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20 } }
  }

  return (
    <div className="relative min-h-screen bg-[#020607] py-24 px-6 md:px-12 text-white overflow-hidden custom-scrollbar">
      {/* Background Holographic Elements */}
      <div className="absolute inset-0 bg-radial-glow opacity-60 pointer-events-none z-0" />
      <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-accent-10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-accent-5 blur-[130px] pointer-events-none" />

      {/* Cyberpunk grid lines decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1.5px,_transparent_1.5px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1.5px,_transparent_1.5px)] bg-[size:45px_45px] pointer-events-none opacity-40" />

      <div className="container mx-auto max-w-5xl relative z-10 space-y-12">
        {/* Navigation Breadcrumb Header */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('home')}
            className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold tracking-wider hover:bg-white/10 transition-all font-mono shadow-inner text-slate-300 hover:text-white"
          >
            <span>←</span> Quay lại Home
          </motion.button>

          <span className="led-badge select-none">
            🍉 CYBER LEADERBOARD v1.0
          </span>
        </div>

        {/* Cinematic Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.4em] text-accent font-mono"
          >
            Honoring contributions & achievements
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-[#dffff5] to-white bg-clip-text text-transparent uppercase tracking-tight leading-tight"
          >
            Bảng Xếp Hạng Nông Nghiệp
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-slate-400 font-light max-w-lg mx-auto"
          >
            The system automatically ranks top watermelon experts and honors sponsors contributing to the AI model.
          </motion.p>
        </div>

        {/* Dual-tab switchers */}
        <div className="flex justify-center">
          <div className="flex rounded-3xl border border-white/15 bg-slate-950/80 p-1.5 shadow-inner">
            <button
              onClick={() => setActiveTab('scanners')}
              className={`rounded-2xl px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none cursor-pointer flex items-center gap-2 ${
                activeTab === 'scanners'
                  ? 'bg-accent text-slate-950 shadow-lg shadow-accent/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🏆</span> Kiện Tướng Quét Dưa
            </button>
            <button
              onClick={() => setActiveTab('supporters')}
              className={`rounded-2xl px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none cursor-pointer flex items-center gap-2 ${
                activeTab === 'supporters'
                  ? 'bg-accent text-slate-950 shadow-lg shadow-accent/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>💎</span> Nhà Tài Trợ Vàng
            </button>
          </div>
        </div>

        {/* Main Content Pane */}
        <div className="card-panel rounded-[40px] border border-white/10 bg-slate-950/75 p-6 md:p-10 shadow-neon relative min-h-[480px]">
          {/* Subtle decoration lines inside panel */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
          <div className="absolute top-4 left-4 h-3 w-3 border-t-2 border-l-2 border-accent/40 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-4 right-4 h-3 w-3 border-t-2 border-r-2 border-accent/40 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-4 left-4 h-3 w-3 border-b-2 border-l-2 border-accent/40 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-4 right-4 h-3 w-3 border-b-2 border-r-2 border-accent/40 rounded-br-sm pointer-events-none" />

          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <div className="h-12 w-12 rounded-full border-4 border-accent border-t-transparent animate-spin shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.3)]" />
              <span className="text-xs uppercase tracking-widest text-accent font-mono animate-pulse">
                Diagnosing data...
              </span>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-center p-6">
              <span className="text-3xl">⚠️</span>
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'scanners' ? (
                <motion.div
                  key="scanners"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="space-y-4"
                >
                  <div className="grid grid-cols-[80px_1fr_120px] md:grid-cols-[100px_1fr_180px] px-6 text-slate-500 text-[10px] uppercase font-mono tracking-widest border-b border-white/5 pb-3">
                    <span>Thứ hạng</span>
                    <span>Chuyên gia / Tài khoản</span>
                    <span className="text-right">Tổng lượt quét</span>
                  </div>

                  <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1.5 custom-scrollbar">
                    {data.scanners.map((scanner, index) => {
                      const badge = getRankBadge(scanner.rank, 'scanners')
                      return (
                        <motion.div
                          key={scanner.username}
                          variants={itemVariants}
                          className="grid grid-cols-[80px_1fr_120px] md:grid-cols-[100px_1fr_180px] items-center px-6 py-4.5 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-20 hover:bg-white/10 transition-all duration-300 group"
                        >
                          {/* Rank column */}
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border font-black font-mono text-sm ${badge.color}`}>
                              {scanner.rank}
                            </span>
                            <span className="text-base" title={badge.label}>{badge.icon}</span>
                          </div>

                          {/* Username and progress visualizer */}
                          <div className="space-y-1.5 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white group-hover:text-accent transition-colors">
                                {scanner.username}
                              </span>
                              {scanner.rank === 1 && (
                                <span className="text-[9px] uppercase font-mono tracking-wider bg-accent/15 border border-accent/30 text-accent px-2 py-0.5 rounded-full select-none">
                                  Top 1 Agent
                                </span>
                              )}
                            </div>

                            {/* Neon energy gauge for scans */}
                            <div className="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((scanner.scan_count / (data.scanners[0]?.scan_count || 1)) * 100, 100)}%` }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                                className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.5)]"
                              />
                            </div>
                          </div>

                          {/* Total scan count */}
                          <div className="text-right">
                            <span className="font-black font-mono text-lg text-white group-hover:scale-105 transition-transform inline-block">
                              {scanner.scan_count}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono block">lượt quét</span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="supporters"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="grid gap-4 sm:grid-cols-2"
                >
                  {data.supporters.map((supporter) => {
                    const badgeIcon = getRankBadge(supporter.rank, 'supporters')
                    return (
                      <motion.div
                        key={supporter.name}
                        variants={itemVariants}
                        className="relative overflow-hidden rounded-[26px] border border-white/5 bg-[#031510]/60 p-5 shadow-inner hover:border-accent-20 hover:bg-white/5 transition-all duration-300 flex items-start gap-4.5 group"
                      >
                        {/* Gold badge shine effect */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(var(--color-accent-rgb),0.06),_transparent_55%)] pointer-events-none" />

                        {/* Avatar bubble */}
                        <div className="relative shrink-0 h-14 w-14 rounded-full border border-accent-30 flex items-center justify-center bg-black/60 shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.1)] group-hover:scale-105 transition-transform">
                          <span className="text-3xl">{supporter.avatar}</span>
                          <span className="absolute -bottom-1 -right-1 text-sm bg-slate-950 rounded-full h-5 w-5 border border-white/10 flex items-center justify-center shadow">
                            {badgeIcon}
                          </span>
                        </div>

                        {/* Information body */}
                        <div className="flex-1 space-y-1 text-left min-w-0">
                          <div className="flex items-center gap-1.5 justify-between">
                            <span className="font-bold text-white text-base truncate group-hover:text-accent transition-colors">
                              {supporter.name}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider bg-accent-5 border border-accent-20 text-accent px-2 py-0.5 rounded-full select-none truncate">
                              {supporter.method}
                            </span>
                          </div>

                          <div className="text-[10px] text-accent uppercase font-mono tracking-wider font-bold">
                            🏅 {supporter.badge}
                          </div>

                          <div className="pt-2 flex items-baseline gap-1.5 justify-between">
                            <span className="text-[10px] text-slate-500 font-mono uppercase">Tài trợ</span>
                            <span className="text-lg font-black text-white font-mono bg-gradient-to-r from-accent to-[#55ffca] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.2)]">
                              {supporter.amount}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Call to action footer panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/5 bg-[#031510]/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner text-left relative overflow-hidden"
        >
          <div className="absolute -left-20 top-0 h-40 w-40 rounded-full bg-accent-5 blur-3xl pointer-events-none" />
          
          <div className="space-y-1 relative z-10 max-w-xl">
            <h4 className="font-bold text-white text-lg">💡 Muốn xuất hiện trong bảng vàng tài trợ?</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Your contributions help sponsor GPU costs for the watermelon AI model. Click the Donate button on the home screen, complete the transfer, and contact the developer to be honored!
            </p>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="cursor-pointer shrink-0 rounded-2xl bg-accent text-slate-950 font-bold uppercase tracking-wider text-xs px-6 py-3.5 hover:scale-105 transition-all shadow-[0_4px_20px_rgba(var(--color-accent-rgb),0.3)] hover:bg-accent-hover"
          >
            🍉 Quay lại Scan Watermelon ngay
          </button>
        </motion.div>
      </div>
    </div>
  )
}
