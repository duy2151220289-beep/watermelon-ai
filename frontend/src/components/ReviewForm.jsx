import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ReviewForm({ onSubmit, isSubmitting, error, user }) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const reviewerName = user ? user.username : name
    if (!reviewerName.trim() || !comment.trim()) return

    const successResponse = await onSubmit({ name: reviewerName, rating, comment })
    if (successResponse) {
      setSuccess(true)
      setName('')
      setComment('')
      setRating(5)
      setTimeout(() => setSuccess(false), 4000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#061c16]/80 to-[#030d0a]/90 p-8 shadow-neon"
    >
      <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-[#1cf0b3]/10 blur-2xl" />
      
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#81f9ce]">Submit review</p>
        <h3 className="mt-1 text-2xl font-bold text-white">Share Your Feedback</h3>
        <p className="text-sm text-slate-400">Let us know about your experience with our watermelon AI.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          {user ? (
            <div className="rounded-2xl border border-[#1cf0b3]/20 bg-[#061b14] p-4 flex items-center justify-between shadow-inner">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Post feedback as account</p>
                <p className="text-sm font-bold text-[#8effdf] mt-0.5 font-mono">👤 {user.username}</p>
              </div>
              <span className="text-[9px] font-mono font-black text-[#1cf0b3] bg-[#1cf0b3]/10 border border-[#1cf0b3]/20 px-2.5 py-1 rounded-full uppercase tracking-wider">Logged In</span>
            </div>
          ) : (
            <>
              <label htmlFor="reviewer-name" className="block text-xs uppercase tracking-[0.2em] text-slate-300">Your Name</label>
              <input
                id="reviewer-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Duy Nguyen"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-[#1cf0b3]/50 focus:bg-white/10 focus:ring-1 focus:ring-[#1cf0b3]/30"
              />
            </>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-slate-300">Rating</label>
          <div className="mt-3 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-2xl transition-colors focus:outline-none"
              >
                <span
                  className={
                    star <= (hoverRating || rating)
                      ? 'text-[#22f0a5] filter drop-shadow-[0_0_8px_rgba(34,240,165,0.7)]'
                      : 'text-slate-600'
                  }
                >
                  ★
                </span>
              </motion.button>
            ))}
            <span className="ml-2 text-xs font-semibold text-[#8bfec0]">
              {(hoverRating || rating)} / 5 Stars
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="reviewer-comment" className="block text-xs uppercase tracking-[0.2em] text-slate-300">Your Comment</label>
          <textarea
            id="reviewer-comment"
            required
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What do you think of our watermelon detector?"
            className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-[#1cf0b3]/50 focus:bg-white/10 focus:ring-1 focus:ring-[#1cf0b3]/30"
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-[#22f0a5]/20 bg-[#082117]/80 p-3 text-xs text-[#8effdf] flex items-center gap-2"
          >
            <span>✓</span> Review submitted successfully! Thank you.
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glow-button flex w-full items-center justify-center rounded-2xl bg-[#22f0a5] py-3 text-sm font-semibold text-slate-950 transition disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
          ) : (
            'Submit Review'
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}
