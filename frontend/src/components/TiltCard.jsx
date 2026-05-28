import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

function TiltCard({ children, className = '', ...props }) {
  const cardRef = useRef(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glareX, setGlareX] = useState(50)
  const [glareY, setGlareY] = useState(50)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    
    // Mouse coordinates relative to card
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Convert to percentages (0 to 1)
    const px = x / rect.width
    const py = y / rect.height

    // Calculate rotation: max 8 degrees for clean subtle tilt
    const rY = (px - 0.5) * 8
    const rX = (py - 0.5) * -8

    setRotateX(rX)
    setRotateY(rY)

    // Glare coordinates in percentages
    setGlareX(px * 100)
    setGlareY(py * 100)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        scale: isHovered ? 1.012 : 1,
      }}
      transition={
        isHovered
          ? { type: 'tween', ease: 'easeOut', duration: 0.15 }
          : { type: 'spring', damping: 20, stiffness: 120 }
      }
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        position: 'relative',
        overflow: 'hidden',
      }}
      className={className}
      {...props}
    >
      {/* Glare/Shine Hologram Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: isHovered
            ? `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(var(--color-accent-rgb), 0.12) 0%, transparent 60%)`
            : 'none',
          zIndex: 3,
          transition: isHovered ? 'none' : 'background 0.5s ease',
        }}
      />
      
      {/* Subtle depth inner container */}
      <div style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  )
}

export default TiltCard
