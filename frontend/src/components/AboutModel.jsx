import { motion } from 'framer-motion'

export default function AboutModel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="card-panel rounded-[40px] border border-white/10 p-10 shadow-neon"
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_0.6fr] items-center">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.3em] text-[#89ffd7]">About the model</p>
          <h3 className="text-4xl font-semibold text-white">YOLOv8 watermelon inference designed for speed and cinematic UX.</h3>
          <p className="max-w-2xl text-slate-300">
            This demo loads the AI from <code className="rounded bg-white/10 px-2 py-1 text-sm text-[#a7ffd8]">backend/models/best.pt</code> and uses OpenCV for image preprocessing, bounding box rendering, and GPU-accelerated runtime when available.
          </p>
          <p className="max-w-2xl text-slate-300">
            New fruit intelligence now includes estimated ripeness, predicted sweetness, and weight inference for each watermelon scan.
          </p>
        </div>
        <div className="space-y-4 rounded-[32px] border border-white/10 bg-[#04150f]/90 p-6 shadow-inner">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#67ffbf]">Inference</p>
            <p className="mt-2 text-lg font-semibold text-white">Optimized YOLOv11 pipeline</p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl bg-[#071d13] p-4">
              <p className="text-sm text-slate-400">GPU support</p>
              <p className="mt-1 text-base text-white">Auto-detects CUDA and uses GPU if available</p>
            </div>
            <div className="rounded-3xl bg-[#071d13] p-4">
              <p className="text-sm text-slate-400">Results</p>
              <p className="mt-1 text-base text-white">Bounding boxes, confidence, class names, and performance metrics.</p>
            </div>
            <div className="rounded-3xl bg-[#071d13] p-4">
              <p className="text-sm text-slate-400">Design</p>
              <p className="mt-1 text-base text-white">Futuristic glassmorphism, neon accents, and 3D hologram interactions.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
