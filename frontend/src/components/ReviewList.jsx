import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

export default function ReviewList({ reviews, isLoading }) {
  const [sortBy, setSortBy] = useState('newest') // 'newest', 'highest', 'lowest'

  const sortedReviews = useMemo(() => {
    const list = [...reviews]
    if (sortBy === 'newest') {
      return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
    if (sortBy === 'highest') {
      return list.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating
        return new Date(b.created_at) - new Date(a.created_at)
      })
    }
    if (sortBy === 'lowest') {
      return list.sort((a, b) => {
        if (a.rating !== b.rating) return a.rating - b.rating
        return new Date(b.created_at) - new Date(a.created_at)
      })
    }
    return list
  }, [reviews, sortBy])

  const getAvatarGradient = (name) => {
    const code = name.charCodeAt(0) % 5
    const gradients = [
      'from-[#22f0a5] to-[#1bbf9d]',
      'from-[#3b82f6] to-[#2563eb]',
      'from-[#ec4899] to-[#db2777]',
      'from-[#f59e0b] to-[#d97706]',
      'from-[#8b5cf6] to-[#7c3aed]',
    ]
    return gradients[code]
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#061914]/80 to-[#020b08]/90 p-8 shadow-neon">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#81f9ce]">Feedback list</p>
          <h3 className="mt-1 text-2xl font-bold text-white">Community Reviews</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#1af38f]/10 px-3 py-1 text-xs font-semibold text-[#b8ffd8]">
            {reviews.length} total
          </span>
        </div>
      </div>

      {/* Sorting Buttons Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3 text-xs">
        <span className="text-slate-400 font-mono shrink-0 uppercase tracking-wider text-[10px]">Sắp xếp:</span>
        <div className="flex bg-black/45 border border-white/5 rounded-2xl p-1 shrink-0">
          <button
            onClick={() => setSortBy('newest')}
            className={`cursor-pointer px-3.5 py-1.5 rounded-xl transition duration-300 font-bold uppercase tracking-wider ${
              sortBy === 'newest'
                ? 'bg-[#22f0a5] text-slate-950 shadow-neon'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sớm nhất
          </button>
          <button
            onClick={() => setSortBy('highest')}
            className={`cursor-pointer px-3.5 py-1.5 rounded-xl transition duration-300 font-bold uppercase tracking-wider ${
              sortBy === 'highest'
                ? 'bg-[#22f0a5] text-slate-950 shadow-neon'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Highest rated
          </button>
          <button
            onClick={() => setSortBy('lowest')}
            className={`cursor-pointer px-3.5 py-1.5 rounded-xl transition duration-300 font-bold uppercase tracking-wider ${
              sortBy === 'lowest'
                ? 'bg-[#22f0a5] text-slate-950 shadow-neon'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lowest rated
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[350px] flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#22f0a5] border-t-transparent" />
          <p className="text-xs text-slate-400">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex h-[350px] flex-col items-center justify-center text-center">
          <p className="text-sm text-slate-400">No reviews yet.</p>
          <p className="text-xs text-slate-500 mt-1">Be the first to share your opinion!</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-h-[480px] overflow-y-auto space-y-4 pr-2 custom-scrollbar"
        >
          {sortedReviews.map((rev) => (
            <motion.div
              key={rev.id}
              variants={itemVariants}
              className="group relative rounded-2xl border border-white/5 bg-white/5 p-5 transition-all duration-300 hover:border-white/10 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(34,240,165,0.06)]"
            >
              <div className="flex items-start gap-4">
                {/* Custom Avatar */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarGradient(
                    rev.name
                  )} text-sm font-bold text-slate-950`}
                >
                  {rev.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-white group-hover:text-[#22f0a5] transition-colors">
                      {rev.name}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {new Date(rev.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Rating Star Row */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${
                          star <= rev.rating ? 'text-[#22f0a5]' : 'text-slate-700'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed font-light">
                    {rev.comment}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
