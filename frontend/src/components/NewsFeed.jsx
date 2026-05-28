import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NewsFeed({ posts, onLike, onDislike }) {
  const [userVotes, setUserVotes] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 2

  useEffect(() => {
    try {
      const savedVotes = localStorage.getItem('watermelon_posts_votes')
      if (savedVotes) {
        setUserVotes(JSON.parse(savedVotes))
      }
    } catch (e) {
      console.warn('Unable to access localStorage for votes', e)
    }
  }, [])

  // Auto-bound current page if posts list changes
  useEffect(() => {
    const totalPages = Math.ceil(posts.length / postsPerPage)
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [posts, currentPage])

  const saveVote = (postId, type) => {
    const updated = { ...userVotes, [postId]: type }
    setUserVotes(updated)
    try {
      localStorage.setItem('watermelon_posts_votes', JSON.stringify(updated))
    } catch (e) {
      console.warn('Unable to save vote to localStorage', e)
    }
  }

  const handleLikeClick = (postId) => {
    if (userVotes[postId]) return // already voted
    onLike(postId)
    saveVote(postId, 'like')
  }

  const handleDislikeClick = (postId) => {
    if (userVotes[postId]) return // already voted
    onDislike(postId)
    saveVote(postId, 'dislike')
  }

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      return dateStr
    }
  }

  // Pagination calculations
  const totalPages = Math.ceil(posts.length / postsPerPage)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  return (
    <section id="news-feed" className="container mx-auto px-6 py-12 lg:px-8 border-t border-white/10">
      <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-[#81f9ce]">Admin Announcements</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          News Feed & Platform Updates
        </h2>
        <p className="text-slate-300 text-sm">
          Stay updated with the latest AI model improvements, feature additions, and direct updates from Nguyen Le Bao Duy.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="max-w-2xl mx-auto rounded-[32px] border border-dashed border-white/10 bg-[#04120d]/30 p-12 text-center text-slate-400">
          <svg className="w-12 h-12 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2m-2 4h.01M16 20h.01m-2.01-4h.01M9 16h.01M9 12h.01M9 8h.01m2.01 0h.01M11 12h.01M12 16h.01m4-12h.01m-.01 4h.01m-.01 4h.01m-.01 4h.01" />
          </svg>
          <p className="text-base font-semibold">Chưa có bài viết mới</p>
          <p className="text-xs text-slate-500 mt-1">Updates from the Admin will appear here.</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid gap-8">
            <AnimatePresence mode="wait">
              {currentPosts.map((post, idx) => {
                const votedType = userVotes[post.id]
                const hasVoted = !!votedType

                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#051510]/50 backdrop-blur-xl p-6 md:p-8 shadow-neon hover:border-[#1cf0b3]/30 transition-all duration-300 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1cf0b3]/5 via-transparent to-transparent pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Decorative bar */}
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#1cf0b3]/30 to-transparent" />

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold tracking-wide text-white group-hover:text-[#8dffdf] transition-colors">
                          {post.title}
                        </h3>
                        {post.id === posts[0].id && (
                          <span className="led-badge select-none">
                            Mới nhất
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 mt-1 sm:mt-0">
                        📅 {formatDate(post.created_at)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line mb-6">
                      {post.content}
                    </div>

                    {/* Actions (Like/Dislike panel) */}
                    <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                      {/* Like Button */}
                      <button
                        onClick={() => handleLikeClick(post.id)}
                        disabled={hasVoted}
                        className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-300 text-xs font-semibold ${
                          votedType === 'like'
                            ? 'border-[#1cf0b3]/50 bg-[#1cf0b3]/10 text-[#1cf0b3]'
                            : hasVoted
                            ? 'border-white/5 bg-white/5 text-slate-500 cursor-not-allowed'
                            : 'border-white/10 bg-white/5 text-[#81f9ce] hover:border-[#1cf0b3]/40 hover:bg-[#1cf0b3]/5'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={votedType === 'like' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M14 10h4.708C19.988 10 21 11.012 21 12.25c0 .661-.284 1.258-.737 1.678.453.42.737 1.017.737 1.678 0 .661-.284 1.258-.737 1.678.453.42.737 1.017.737 1.678 0 1.238-1.012 2.25-2.292 2.25H9c-1.105 0-2-.895-2-2v-7.382a2 2 0 011.106-1.789L13 7.5V10zM7 21H4a2 2 0 01-2-2v-6a2 2 0 012-2h3" />
                        </svg>
                        Thích <span className="font-mono text-sm ml-1 font-extrabold">{post.likes}</span>
                      </button>

                      {/* Dislike Button */}
                      <button
                        onClick={() => handleDislikeClick(post.id)}
                        disabled={hasVoted}
                        className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-300 text-xs font-semibold ${
                          votedType === 'dislike'
                            ? 'border-red-500/50 bg-red-500/10 text-red-400'
                            : hasVoted
                            ? 'border-white/5 bg-white/5 text-slate-500 cursor-not-allowed'
                            : 'border-white/10 bg-white/5 text-red-300 hover:border-red-500/40 hover:bg-red-500/5'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={votedType === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10 14H5.292C4.012 14 3 12.988 3 11.75c0-.661.284-1.258.737-1.678C3.284 9.652 3 9.055 3 8.394c0-.661.284-1.258.737-1.678C3.284 6.296 3 5.699 3 5.038c0-1.238 1.012-2.25 2.292-2.25H15c1.105 0 2 .895 2 2v7.382a2 2 0 01-1.106 1.789L11 16.5V14zM17 3h3a2 2 0 012 2v6a2 2 0 01-2 2h-3" />
                        </svg>
                        Không Thích <span className="font-mono text-sm ml-1 font-extrabold">{post.dislikes}</span>
                      </button>

                      {/* Status feedback */}
                      {hasVoted && (
                        <span className="text-[10px] text-slate-500 italic ml-auto font-mono">
                          ✓ You reacted
                        </span>
                      )}
                    </div>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition duration-300 hover:border-[#1cf0b3]/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
              >
                ←
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`cursor-pointer flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold transition duration-300 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-[#1cf0b3] to-[#12c488] text-slate-950 font-bold shadow-[0_0_20px_rgba(28,240,179,0.35)]'
                      : 'border border-white/10 bg-white/5 text-slate-300 hover:border-[#1cf0b3]/50 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition duration-300 hover:border-[#1cf0b3]/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
