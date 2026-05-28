import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function CameraLive({ onCapture, isLoading }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayCanvasRef = useRef(null)
  
  const [active, setActive] = useState(false)
  const [isRealtime, setIsRealtime] = useState(false)
  const [realtimeScanning, setRealtimeScanning] = useState(false)
  
  const isRequestingRef = useRef(false)

  // Start/Stop Camera stream
  useEffect(() => {
    if (!active) {
      setIsRealtime(false)
      clearOverlay()
      return
    }
    
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } 
        })
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (err) {
        console.warn('Camera access denied or unavailable.', err)
        setActive(false)
      }
    }
    
    startCamera()
    
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [active])

  // Continuous real-time scanning loop
  useEffect(() => {
    if (!active || !isRealtime) {
      clearOverlay()
      setRealtimeScanning(false)
      return
    }

    setRealtimeScanning(true)
    let timer

    const runLoop = async () => {
      if (isRequestingRef.current) return // busy-lock
      isRequestingRef.current = true
      
      try {
        await captureFrameAndScan()
      } catch (e) {
        console.warn('Realtime frame scan failed', e)
      } finally {
        isRequestingRef.current = false
      }
    }

    timer = setInterval(runLoop, 250) // Poll every 250ms for low-latency

    return () => {
      clearInterval(timer)
      clearOverlay()
    }
  }, [active, isRealtime])

  const clearOverlay = () => {
    const canvas = overlayCanvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const captureFrameAndScan = () => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current || !canvasRef.current) {
        resolve()
        return
      }
      const video = videoRef.current
      const canvas = canvasRef.current
      
      // Sync hidden canvas size with video resolution
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve()
          return
        }
        
        const file = new File([blob], 'camera_frame.jpg', { type: 'image/jpeg' })
        const formData = new FormData()
        formData.append('image', file)
        
        try {
          // Trigger the App handleDetection API callback in SILENT mode
          const result = await onCapture(formData, 'camera', true)
          if (result) {
            drawBoundingBox(result)
          } else {
            clearOverlay()
          }
          resolve()
        } catch (err) {
          // Clear overlay on errors
          clearOverlay()
          reject(err)
        }
      }, 'image/jpeg', 0.8) // Compress frame to 80% quality for faster API uploads
    })
  }

  // Draw scaled neon bounding box directly onto the canvas overlay
  const drawBoundingBox = (result) => {
    const canvas = overlayCanvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d')
    const rect = video.getBoundingClientRect()
    
    // Size the canvas to exactly match visible layout bounds
    canvas.width = rect.width
    canvas.height = rect.height
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!result || !result.bbox || Object.keys(result.bbox).length === 0) return
    
    const { x1, y1, x2, y2 } = result.bbox
    if (x1 === 0 && y1 === 0 && x2 === 0 && y2 === 0) return

    // Scale from captured resolution to screen visible width/height
    const scaleX = rect.width / video.videoWidth
    const scaleY = rect.height / video.videoHeight

    const boxX = x1 * scaleX
    const boxY = y1 * scaleY
    const boxW = (x2 - x1) * scaleX
    const boxH = (y2 - y1) * scaleY

    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#1cf0b3'
    const accentColorRgb = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-rgb').trim() || '28, 240, 179'

    // 1. Draw glowing outer line
    ctx.strokeStyle = `rgba(${accentColorRgb}, 0.45)`
    ctx.lineWidth = 6
    ctx.shadowColor = accentColor
    ctx.shadowBlur = 15
    ctx.strokeRect(boxX, boxY, boxW, boxH)

    // 2. Draw solid inner green line
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 2
    ctx.shadowBlur = 0
    ctx.strokeRect(boxX, boxY, boxW, boxH)

    // 3. Draw tag label background
    const label = `${result.label.toUpperCase()} ${result.confidence.toFixed(0)}%`
    ctx.font = 'bold 10px monospace'
    const labelWidth = ctx.measureText(label).width
    
    ctx.fillStyle = 'rgba(3, 18, 14, 0.85)'
    ctx.fillRect(boxX, boxY - 20, labelWidth + 16, 20)
    
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 1
    ctx.strokeRect(boxX, boxY - 20, labelWidth + 16, 20)

    // 4. Draw tag text
    ctx.fillStyle = '#b7ffde'
    ctx.fillText(label, boxX + 8, boxY - 6)
  }


  // Triggered manually when continuous scan is disabled
  const handleSingleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera_frame.jpg', { type: 'image/jpeg' })
        const formData = new FormData()
        formData.append('image', file)
        onCapture(formData, 'camera', false) // NORMAL mode (shows loading spinners)
      }
    }, 'image/jpeg')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75 }}
      className="card-panel rounded-[32px] border border-white/10 p-6 md:p-8 bg-black/40 backdrop-blur-xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />

      <div className="flex flex-col gap-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#85ffda]">Smart Detection</p>
            <h3 className="text-2xl font-bold text-white mt-1">Live Camera Feed</h3>
          </div>
          <button
            type="button"
            className={`cursor-pointer rounded-2xl border px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              active 
                ? 'border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                : 'border-accent-30 bg-accent-10 text-white hover:border-accent-60 hover:shadow-neon'

            }`}
            onClick={() => setActive((state) => !state)}
          >
            {active ? 'Turn Off' : 'Activate'} Camera
          </button>
        </div>

        {/* Video Wrapper Container */}
        <div className="relative rounded-[28px] border border-white/10 bg-[#020b08] overflow-hidden shadow-inner flex items-center justify-center min-h-[280px] sm:min-h-[440px]">
          
          {/* Pulsing REC indicator overlay */}
          {active && (
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2 rounded-full bg-black/60 border border-white/10 px-3 py-1.5 backdrop-blur-md">
              <span className={`h-2.5 w-2.5 rounded-full ${isRealtime ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
              <span className="text-[9px] font-mono font-bold tracking-widest text-white uppercase">
                {isRealtime ? 'LIVE AI SCAN' : 'CAM READY'}
              </span>
            </div>
          )}

          {/* Sweeping laser scanner animation */}
          {active && isRealtime && (
            <motion.div
              animate={{ y: ["0%", "360px", "0%"] }}
              transition={{ repeat: Infinity, duration: 3.0, ease: "easeInOut" }}
              className="absolute inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#22f0a5] to-transparent shadow-[0_0_15px_#22f0a5] z-10 pointer-events-none"
              style={{ top: 0 }}
            />
          )}

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`w-full max-h-[500px] bg-black object-cover rounded-[28px] transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Screen-size mapped Bounding Box Canvas Overlay */}
          {active && (
            <canvas ref={overlayCanvasRef} className="absolute inset-0 pointer-events-none w-full h-full z-20" />
          )}

          {/* Offline Placeholder */}
          {!active && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500 p-6 text-center">
              <svg className="w-12 h-12 text-slate-600 mb-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-semibold">Live Camera Offline</p>
              <p className="text-xs text-slate-600 max-w-xs">Activate the camera above to begin continuous real-time watermelon scanning.</p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        {active && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/5 pt-4 w-full">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Single Capture Button */}
              <button
                type="button"
                disabled={isLoading || isRealtime}
                onClick={handleSingleCapture}
                className="w-full sm:w-auto cursor-pointer rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 px-6 py-3 font-semibold text-white text-xs tracking-wider uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Single Capture
              </button>

              {/* Realtime Scan Toggle Button */}
              <button
                type="button"
                onClick={() => setIsRealtime((prev) => !prev)}
                className={`w-full sm:w-auto cursor-pointer rounded-2xl px-6 py-3 font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg ${
                  isRealtime 
                    ? 'bg-[#ef4444] text-white shadow-red-500/10 hover:bg-red-600'
                    : 'bg-accent text-slate-950 shadow-accent-glow hover:bg-accent-hover hover:shadow-neon'

                }`}
              >
                {isRealtime ? 'Stop Live Scan' : 'Realtime AI Scan'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${realtimeScanning ? 'bg-red-500 animate-ping' : 'bg-slate-600'}`} />
              <span className="text-xs text-slate-400 font-mono">
                {realtimeScanning 
                  ? `Realtime Active (Latency: ~${isRequestingRef.current ? 'busy' : 'low'})` 
                  : 'Ready for scanning'}
              </span>
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </motion.div>
  )
}
