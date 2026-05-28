import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

export default function UploadDropzone({ onSubmit, isLoading }) {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFile = (file) => {
    const formData = new FormData()
    formData.append('image', file)
    onSubmit(formData, 'upload')
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFile(event.dataTransfer.files[0])
    }
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`card-panel relative rounded-[32px] border border-white/10 p-8 ${dragActive ? 'border-[#2ef0a2] bg-[#06170f]' : 'bg-[#071b11]'}`}
      onDragEnter={() => setDragActive(true)}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col gap-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#19b37c]/10 text-[#8fffd3] shadow-[0_0_35px_rgba(27,235,186,0.14)]">
          <span className="text-2xl">⌁</span>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-white">Upload or drag & drop</h3>
          <p className="mt-2 text-sm text-slate-300">Upload a watermelon photo and the AI will detect the fruit with a hologram effect.</p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="glow-button inline-flex items-center justify-center rounded-full bg-[#16c18d] px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-[#0fb97a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Scanning...' : 'Select Image'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.[0]) handleFile(event.target.files[0])
          }}
        />
        <div className="rounded-3xl border border-white/10 bg-[#0b1d16] p-4 text-left text-slate-300">
          <p className="text-sm">Pro tip:</p>
          <p className="mt-2 text-sm">Use a clean watermelon close-up and watch the AI draw neon bounding boxes in real time.</p>
        </div>
      </div>
    </motion.div>
  )
}
