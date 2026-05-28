import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import UploadDropzone from './components/UploadDropzone'
import DetectionPanel from './components/DetectionPanel'
import CameraLive from './components/CameraLive'
import Statistics from './components/Statistics'
import Footer from './components/Footer'

import ScanOverlay from './components/ScanOverlay'
import ReviewForm from './components/ReviewForm'
import ReviewList from './components/ReviewList'
import DonateSection from './components/DonateSection'
import WelcomeModal from './components/WelcomeModal'
import QualityCertificate from './components/QualityCertificate'
import NewsFeed from './components/NewsFeed'
import AuthModal from './components/AuthModal'
import ProfilePage from './components/ProfilePage'
import DeveloperModal from './components/DeveloperModal'
import UserGuide from './components/UserGuide'
import InstallModal from './components/InstallModal'
import BootLoader from './components/BootLoader'
import LeaderboardPage from './components/LeaderboardPage'
import AgronomistChat from './components/AgronomistChat'




const API_ROOT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? '/api'
  : 'https://watermelon-ai-q84h.onrender.com/api'

function App() {
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({ totalDetections: 0, averageConfidence: 0, recentDetections: [] })
  const [activeResult, setActiveResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [reviews, setReviews] = useState([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [submitReviewError, setSubmitReviewError] = useState('')
  const [showWelcome, setShowWelcome] = useState(true)
  const [certOpen, setCertOpen] = useState(false)
  const [posts, setPosts] = useState([])

  const [user, setUser] = useState(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [devModalOpen, setDevModalOpen] = useState(false)
  const [scanWarning, setScanWarning] = useState(null)
  const [showGuide, setShowGuide] = useState(false)
  const [guideStep, setGuideStep] = useState(0)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installModalOpen, setInstallModalOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('watermelon_app_theme') || 'emerald')
  const [booting, setBooting] = useState(true)
  const [donateModalOpen, setDonateModalOpen] = useState(false)




  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_ROOT}/stats/`)
      setStats(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchHistory = async () => {
    try {
      const headers = {}
      const storedUser = localStorage.getItem('watermelon_auth_user')
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          if (parsed?.token) {
            headers['Authorization'] = `Token ${parsed.token}`
          }
        } catch (e) {
          console.error(e)
        }
      }
      const response = await axios.get(`${API_ROOT}/history/`, { headers })
      setHistory(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchReviews = async () => {
    setIsLoadingReviews(true)
    try {
      const response = await axios.get(`${API_ROOT}/reviews/`)
      setReviews(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingReviews(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_ROOT}/posts/`)
      setPosts(response.data)
    } catch (err) {
      console.error('Error fetching posts:', err)
    }
  }

  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(`${API_ROOT}/posts/${postId}/like/`)
      setPosts((prev) => prev.map((p) => (p.id === postId ? response.data : p)))
    } catch (err) {
      console.error('Error liking post:', err)
    }
  }

  const handleDislikePost = async (postId) => {
    try {
      const response = await axios.post(`${API_ROOT}/posts/${postId}/dislike/`)
      setPosts((prev) => prev.map((p) => (p.id === postId ? response.data : p)))
    } catch (err) {
      console.error('Error disliking post:', err)
    }
  }

  const handleCreateReview = async (reviewData) => {
    setIsSubmittingReview(true)
    setSubmitReviewError('')
    try {
      const headers = {}
      if (user?.token) {
        headers['Authorization'] = `Token ${user.token}`
      }
      const response = await axios.post(`${API_ROOT}/reviews/`, reviewData, { headers })
      setReviews((prev) => [response.data, ...prev])
      return true
    } catch (err) {
      const message = err?.response?.data
        ? Object.values(err.response.data).flat().join(' ')
        : 'Failed to submit review.'
      setSubmitReviewError(message)
      return false
    } finally {
      setIsSubmittingReview(false)
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('watermelon_auth_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Error parsing stored user:', e)
      }
    }
    fetchHistory()
    fetchStats()
    fetchReviews()
    fetchPosts()
  }, [])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      console.log('PWA beforeinstallprompt event captured!')
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.remove('theme-synthwave', 'theme-cyber')
    if (theme === 'synthwave') {
      document.documentElement.classList.add('theme-synthwave')
    } else if (theme === 'cyber') {
      document.documentElement.classList.add('theme-cyber')
    }
    localStorage.setItem('watermelon_app_theme', theme)
  }, [theme])



  const handleAuthSuccess = (userData) => {
    setUser(userData)
    localStorage.setItem('watermelon_auth_user', JSON.stringify(userData))
    setTimeout(() => fetchHistory(), 50)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('watermelon_auth_user')
    setCurrentPage('home')
    setTimeout(() => fetchHistory(), 50)
  }

  useEffect(() => {
    if (scanWarning) {
      const timer = setTimeout(() => setScanWarning(null), 6000)
      return () => clearTimeout(timer)
    }
  }, [scanWarning])

  const playScanSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const context = new AudioContext()
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(520, context.currentTime)
      gain.gain.setValueAtTime(0.08, context.currentTime)
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start()
      oscillator.frequency.exponentialRampToValueAtTime(230, context.currentTime + 0.35)
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.55)
      oscillator.stop(context.currentTime + 0.6)
    } catch (error) {
      console.warn('Scan sound failed', error)
    }
  }

  const handleDetection = async (formData, source = 'upload', isSilent = false) => {
    setError('')
    if (!isSilent) {
      setIsLoading(true)
      playScanSound()
    }

    // Offline Mode: Fallback to Browser Edge AI Inference
    if (!navigator.onLine) {
      try {
        console.log('Detecting locally (Offline Edge AI Mode)...')
        const imageFile = formData.get('image')
        if (!imageFile) throw new Error('No image file found in scan request.')
        
        // Convert Blob file to HTMLImageElement for canvas processing
        const imageUrl = URL.createObjectURL(imageFile)
        const img = new Image()
        img.src = imageUrl
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
        
        // Dynamically import local ONNX inference script to optimize initial page loading
        const { runLocalInference } = await import('./utils/localInference')
        const result = await runLocalInference(img)
        
        URL.revokeObjectURL(imageUrl)
        
        if (result && result.confidence === 0.0) {
          setScanWarning({
            title: "Không phát hiện dưa hấu (Local AI)",
            message: "Browser AI could not detect a valid watermelon in this image. Please adjust the angle and try again!"
          })
        }
        
        setActiveResult(result)
        // Skipping fetchHistory() and fetchStats() since Django server is unreachable offline
        return result
      } catch (localErr) {
        console.error('Browser local ONNX inference failed:', localErr)
        if (!isSilent) setError('Không thể nhận diện cục bộ: ' + localErr.message)
        throw localErr
      } finally {
        if (!isSilent) setIsLoading(false)
      }
    }

    // Online Mode: Django Server REST API
    try {
      formData.append('source', source)
      const headers = { 'Content-Type': 'multipart/form-data' }
      if (user?.token) {
        headers['Authorization'] = `Token ${user.token}`
      }
      const response = await axios.post(`${API_ROOT}/detect/`, formData, { headers })
      const result = response.data.result
      if (result && result.confidence === 0.0) {
        setScanWarning({
          title: "Không phát hiện dưa hấu",
          message: "Hệ thống AI không tìm thấy thực thể dưa hấu hợp lệ trong bức ảnh này. Vui lòng tải lên hoặc chụp ảnh quả dưa hấu khác rõ nét hơn!"
        })
      }
      setActiveResult(result)
      fetchHistory()
      fetchStats()
      return result
    } catch (err) {
      const message = err?.response?.data?.detail || 'Unable to process image. Please try again.'
      if (!isSilent) setError(message)
      throw err
    } finally {
      if (!isSilent) setIsLoading(false)
    }
  }

  const topConfidence = useMemo(() => {
    return activeResult?.confidence ? `${activeResult.confidence.toFixed(1)}%` : '--'
  }, [activeResult])

  return (
    <AnimatePresence mode="wait">
      {booting ? (
        <motion.div key="bootloader" className="w-full h-full">
          <BootLoader onComplete={() => setBooting(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="app-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="app-shell min-h-screen bg-[#020607] text-white overflow-x-hidden"
        >

      <div className="absolute inset-0 bg-radial-glow opacity-70 pointer-events-none" />
      <Navbar
        user={user}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        onOpenDeveloperModal={() => setDevModalOpen(true)}
        onOpenInstallModal={() => setInstallModalOpen(true)}
        currentTheme={theme}
        onChangeTheme={setTheme}
        currentPage={currentPage}
      />

      <main className="relative isolate">
        {currentPage === 'profile' ? (
          <ProfilePage
            user={user}
            onNavigate={setCurrentPage}
            onUserChange={handleAuthSuccess}
            onViewCertificate={(scan) => {
              setActiveResult(scan);
              setCertOpen(true);
            }}
          />
        ) : currentPage === 'leaderboard' ? (
          <LeaderboardPage onNavigate={setCurrentPage} />
        ) : (
          <>
            <Hero activeResult={activeResult} isLoading={isLoading} onOpenDeveloperModal={() => setDevModalOpen(true)} onOpenInstallModal={() => setInstallModalOpen(true)} onOpenDonateModal={() => setDonateModalOpen(true)} />

            
            <NewsFeed posts={posts} onLike={handleLikePost} onDislike={handleDislikePost} />

            <section id="detect" className="container mx-auto px-6 py-16 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-start">
                <motion.div
                  initial={{ opacity: 0, y: 60, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", damping: 14, stiffness: 95, duration: 0.8 }}
                  className="backdrop-blur-xl border border-white/10 rounded-[32px] shadow-neon p-8"
                >
                  <div className="flex flex-col gap-6">
                    <div className="space-y-3">
                      <p className="text-sm uppercase tracking-[0.3em] text-[#81f9ce]">AI watermelon scan</p>
                      <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                        Upload a watermelon image or use live camera detection
                      </h2>
                      <p className="max-w-2xl text-slate-300">
                        Experience cinematic AI inference with real-time bounding boxes, confidence scoring, and holographic results.
                      </p>
                    </div>

                    <UploadDropzone onSubmit={handleDetection} isLoading={isLoading} />
                    <CameraLive onCapture={handleDetection} isLoading={isLoading} />

                    {/* Reset button — only visible when a scan result is active */}
                    {activeResult && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.35 }}
                        onClick={() => setActiveResult(null)}
                        className="cursor-pointer w-full flex items-center justify-center gap-3 rounded-[24px] border border-[#1cf0b3]/25 bg-gradient-to-r from-[#041a14] to-[#051e18] hover:from-[#0a2e24] hover:to-[#0c3528] py-4 px-6 text-sm font-semibold tracking-widest text-[#8effd6] uppercase transition-all duration-300 shadow-[0_0_24px_rgba(28,240,179,0.10)] hover:shadow-[0_0_36px_rgba(28,240,179,0.22)] group font-mono"
                        whileHover={{ scale: 1.025 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1cf0b3]/10 border border-[#1cf0b3]/20 group-hover:bg-[#1cf0b3]/20 transition-all duration-300 text-base group-hover:rotate-180 transition-transform">
                          🔄
                        </span>
                        Tải lại / Reset Scan
                      </motion.button>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 60, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", damping: 14, stiffness: 95, duration: 0.8, delay: 0.1 }}
                >
                  <DetectionPanel
                    isLoading={isLoading}
                    error={error}
                    result={activeResult}
                    history={history}
                    topConfidence={topConfidence}
                    onOpenCertificate={() => setCertOpen(true)}
                    onReset={() => setActiveResult(null)}
                  />
                </motion.div>
              </div>
            </section>

            <section id="stats" className="container mx-auto px-6 py-16 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", damping: 14, stiffness: 95, duration: 0.8 }}
              >
                <Statistics stats={stats} />
              </motion.div>
            </section>


            <section id="reviews" className="container mx-auto px-6 py-16 lg:px-8 border-t border-white/10">
              <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-start">
                <motion.div
                  initial={{ opacity: 0, y: 60, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", damping: 14, stiffness: 95, duration: 0.8 }}
                >
                  <ReviewForm onSubmit={handleCreateReview} isSubmitting={isSubmittingReview} error={submitReviewError} user={user} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 60, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", damping: 14, stiffness: 95, duration: 0.8, delay: 0.1 }}
                >
                  <ReviewList reviews={reviews} isLoading={isLoadingReviews} />
                </motion.div>
              </div>
            </section>


          </>
        )}
      </main>
      <Footer />
      <AnimatePresence>{isLoading && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />}</AnimatePresence>
      <ScanOverlay isLoading={isLoading} />
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      <QualityCertificate isOpen={certOpen} onClose={() => setCertOpen(false)} result={activeResult} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />
      <DeveloperModal
        isOpen={devModalOpen}
        onClose={() => setDevModalOpen(false)}
        isAdmin={user?.username === 'admin'}
        user={user}
        onClearSuccess={() => {
          fetchHistory()
          fetchStats()
        }}
      />
      <DonateSection isOpen={donateModalOpen} onClose={() => setDonateModalOpen(false)} />
      
      {/* Floating Scan Warning Toast */}
      <AnimatePresence>
        {scanWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-24 right-6 z-[120] max-w-sm w-full rounded-3xl border border-red-500/30 bg-[#0c0404]/95 p-6 shadow-[0_0_40px_rgba(239,68,68,0.2)] text-white backdrop-blur-md"
          >
            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-red-500/10 blur-2xl pointer-events-none" />
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
                <span className="text-xl">⚠️</span>
              </div>
              <div className="flex-1 space-y-1.5 text-left">
                <h4 className="text-sm font-bold uppercase tracking-wide text-red-400 font-mono">
                  {scanWarning.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {scanWarning.message}
                </p>
                <button
                  onClick={() => setScanWarning(null)}
                  className="cursor-pointer mt-3 text-[10px] uppercase tracking-widest font-black text-[#1cf0b3] hover:text-[#22f0a5] transition duration-300 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl hover:bg-white/10"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Guide Button and Stepper Toast */}
      <button
        onClick={() => {
          setShowGuide(true)
          setGuideStep(0)
        }}
        className="fixed left-6 max-sm:left-4 bottom-6 max-sm:bottom-4 z-[100] flex items-center gap-2 max-sm:gap-1 rounded-full border border-[#1cf0b3]/30 bg-[#051a14]/95 backdrop-blur-md px-5 py-3.5 max-sm:px-3 max-sm:py-2 text-sm max-sm:text-xs font-semibold tracking-wider text-[#8effd6] shadow-[0_0_24px_rgba(28,240,179,0.15)] hover:shadow-[0_0_36px_rgba(28,240,179,0.35)] transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer font-mono group"
      >
        <span className="text-base max-sm:text-sm animate-pulse group-hover:rotate-12 transition-transform">📖</span>
        Hướng dẫn<span className="max-sm:hidden"> sử dụng</span>
      </button>


      <UserGuide
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        currentStep={guideStep}
        setStep={setGuideStep}
      />

      <InstallModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        setDeferredPrompt={setDeferredPrompt}
      />


      {/* Floating Network Status Badge */}
      <div
        className={`fixed right-6 max-sm:right-4 bottom-6 max-sm:bottom-4 z-[100] flex items-center gap-2 max-sm:gap-1.5 rounded-full border px-4 py-2.5 max-sm:px-3 max-sm:py-2 text-xs max-sm:text-[10px] font-semibold tracking-wider backdrop-blur-md transition-all duration-300 font-mono shadow-md ${
          isOnline
            ? 'border-[#1cf0b3]/30 bg-[#051a14]/90 text-[#8effd6] shadow-[0_0_18px_rgba(28,240,179,0.12)]'
            : 'border-amber-500/30 bg-[#1a1405]/90 text-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.15)] animate-pulse'
        }`}
      >
        <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-[#2efd94]' : 'bg-amber-400'}`} />
        {isOnline ? (
          <>🌐 <span className="max-sm:hidden">Trực tuyến (</span>Server AI<span className="max-sm:hidden">)</span></>
        ) : (
          <>⚡ <span className="max-sm:hidden">Ngoại tuyến (</span>Thiết bị AI<span className="max-sm:hidden">)</span></>
        )}
      </div>

      {/* Floating Agronomist Chatbot */}
      <AgronomistChat activeResult={activeResult} user={user} />

        </motion.div>
      )}
    </AnimatePresence>
  )

}

export default App
