import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import PremiumModal from './PremiumModal'

export default function ProfilePage({ user, onNavigate, onViewCertificate, onUserChange }) {
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [premiumModalOpen, setPremiumModalOpen] = useState(false)
  const API_ROOT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? '/api'
    : 'https://watermelon-ai-q84h.onrender.com/api'

  const handleUpdateRole = async (newRole) => {
    try {
      const response = await axios.post(`${API_ROOT}/auth/profile/`, 
        { role: newRole }, 
        { headers: { Authorization: `Token ${user.token}` } }
      )
      
      // Update local profileData
      setProfileData(prev => {
        if (!prev) return prev
        return {
          ...prev,
          user: {
            ...prev.user,
            role: newRole
          }
        }
      })
      
      // Trigger global user change so navbar / crown updates
      if (onUserChange && response.data.user) {
        const updatedUser = {
          ...user,
          role: newRole,
          user: response.data.user
        }
        onUserChange(updatedUser)
      }
    } catch (err) {
      console.error("Error updating role:", err)
      alert("Không thể cập nhật phân quyền người dùng. Vui lòng thử lại!")
    }
  }

  // Tamagotchi virtual pet states
  const username = user?.user?.username || user?.username || 'guest'
  const [petName, setPetName] = useState(() => localStorage.getItem(`watermelon_pet_name_${username}`) || 'Neon Dưa')
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(petName)
  const [coins, setCoins] = useState(10)
  const [equipped, setEquipped] = useState({ glasses: false, headphones: false, crown: false })
  const [owned, setOwned] = useState({ glasses: false, headphones: false, crown: false })
  const [petHappiness, setPetHappiness] = useState(80)
  const [petEnergy, setPetEnergy] = useState(90)
  const [petting, setPetting] = useState(false)
  const [floatingEmojis, setFloatingEmojis] = useState([])

  const fetchProfile = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await axios.get(`${API_ROOT}/auth/profile/`, {
        headers: { Authorization: `Token ${user.token}` }
      })
      setProfileData(response.data)
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Không thể tải thông tin hồ sơ cá nhân.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.token) {
      fetchProfile()
    }
  }, [user])

  // Load and sync pet data on profile load
  useEffect(() => {
    if (profileData) {
      // Coins setup (dynamic base on scans + saved history)
      const savedCoins = localStorage.getItem(`watermelon_pet_coins_${username}`)
      if (savedCoins !== null) {
        setCoins(parseInt(savedCoins, 10))
      } else {
        const baseCoins = profileData.totalScans * 10
        const initialCoins = Math.max(20, baseCoins)
        setCoins(initialCoins)
        localStorage.setItem(`watermelon_pet_coins_${username}`, initialCoins.toString())
      }

      // Load items owned & equipped
      const savedOwned = localStorage.getItem(`watermelon_pet_owned_${username}`)
      if (savedOwned) setOwned(JSON.parse(savedOwned))

      const savedEquipped = localStorage.getItem(`watermelon_pet_equipped_${username}`)
      if (savedEquipped) setEquipped(JSON.parse(savedEquipped))

      // Load vital states
      const savedHappiness = localStorage.getItem(`watermelon_pet_happiness_${username}`)
      if (savedHappiness !== null) setPetHappiness(parseInt(savedHappiness, 10))

      const savedEnergy = localStorage.getItem(`watermelon_pet_energy_${username}`)
      if (savedEnergy !== null) setPetEnergy(parseInt(savedEnergy, 10))
    }
  }, [profileData, username])

  const totalScans = profileData?.totalScans || 0
  const xp = totalScans * 25
  const level = Math.floor(xp / 100) + 1
  const xpProgress = xp % 100

  const getLevelStage = (lvl) => {
    if (lvl <= 2) return 'Hạt mầm Sơ sinh'
    if (lvl <= 5) return 'Mầm xanh Phát sáng'
    if (lvl <= 8) return 'Dưa con Thông thái'
    if (lvl <= 12) return 'Dưa hấu Cyberpunk'
    return 'Dưa thần Vô cực'
  }

  const handleSaveName = () => {
    if (newName.trim()) {
      setPetName(newName)
      localStorage.setItem(`watermelon_pet_name_${username}`, newName)
      setIsEditingName(false)
    }
  }

  const handlePet = () => {
    setPetting(true)
    const emojis = ['❤️', '✨', '⚡', '🌟', '💖']
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
    
    // Add floating emoji particle
    const id = Date.now() + Math.random()
    const x = (Math.random() - 0.5) * 160
    const y = -120 - Math.random() * 60
    
    setFloatingEmojis(prev => [...prev, { id, emoji: randomEmoji, x, y }])
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id))
    }, 850)

    // Increase happiness
    setPetHappiness(prev => {
      const next = Math.min(100, prev + 10)
      localStorage.setItem(`watermelon_pet_happiness_${username}`, next.toString())
      return next
    })

    // Random Coin bonus (20% chance)
    if (Math.random() < 0.2) {
      setCoins(prev => {
        const next = prev + 1
        localStorage.setItem(`watermelon_pet_coins_${username}`, next.toString())
        return next
      })
    }

    setTimeout(() => setPetting(false), 500)
  }

  const handleFeed = () => {
    if (petEnergy >= 100) return
    
    setPetEnergy(prev => {
      const next = Math.min(100, prev + 25)
      localStorage.setItem(`watermelon_pet_energy_${username}`, next.toString())
      return next
    })

    // Consumes 2 coins for energy booster
    if (coins >= 2) {
      setCoins(prev => {
        const next = Math.max(0, prev - 2)
        localStorage.setItem(`watermelon_pet_coins_${username}`, next.toString())
        return next
      })
    }

    const feedEmojis = ['😋', '🍉', '🥤', '⚡']
    const randomEmoji = feedEmojis[Math.floor(Math.random() * feedEmojis.length)]
    const id = Date.now() + Math.random()
    setFloatingEmojis(prev => [...prev, { id, emoji: randomEmoji, x: 0, y: -100 }])
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id))
    }, 850)
  }

  const handleBuyAccessory = (key, price) => {
    const currentCoins = Number(coins)
    const itemPrice = Number(price)
    const currentOwned = owned || { glasses: false, headphones: false, crown: false }
    if (currentCoins >= itemPrice && !currentOwned[key]) {
      const nextOwned = { ...currentOwned, [key]: true }
      setOwned(nextOwned)
      localStorage.setItem(`watermelon_pet_owned_${username}`, JSON.stringify(nextOwned))
      
      const nextCoins = currentCoins - itemPrice
      setCoins(nextCoins)
      localStorage.setItem(`watermelon_pet_coins_${username}`, nextCoins.toString())
    }
  }

  const handleToggleEquip = (key) => {
    const currentOwned = owned || { glasses: false, headphones: false, crown: false }
    const currentEquipped = equipped || { glasses: false, headphones: false, crown: false }
    if (currentOwned[key]) {
      const nextEquipped = { ...currentEquipped, [key]: !currentEquipped[key] }
      setEquipped(nextEquipped)
      localStorage.setItem(`watermelon_pet_equipped_${username}`, JSON.stringify(nextEquipped))
    }
  }

  const handleDeleteScan = async (scanId) => {
    if (profileData) {
      setProfileData(prev => ({
        ...prev,
        scans: prev.scans.filter(s => s.id !== scanId),
        totalScans: Math.max(0, prev.totalScans - 1)
      }))
    }
  }

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch (e) {
      return dateStr
    }
  }

  const gearItems = [
    { key: 'glasses', name: 'Cyberpunk Glasses', price: 30, icon: '🕶️', desc: 'Wear cool glowing LED glasses.' },
    { key: 'headphones', name: 'DJ Headphones', price: 60, icon: '🎧', desc: 'Enjoy futuristic electronic music.' },
    { key: 'crown', name: 'Vương miện Vô cực', price: 120, icon: '👑', desc: 'Dành riêng cho những vị thần dưa.' }
  ]

  const renderPetVisual = () => {
    // Stage 1: Hạt mầm Sơ sinh (Lvl 1 - 2)
    if (level <= 2) {
      return (
        <div className="relative h-40 w-40 flex items-center justify-center bg-slate-950/40 rounded-full border border-accent-10 shadow-inner overflow-visible">
          <div className="absolute bottom-3 w-24 h-6 rounded-lg bg-gradient-to-r from-accent-20 via-accent-10 to-accent-20 border border-accent-30 shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.2)] flex items-center justify-center">
            <span className="text-[8px] font-mono text-accent uppercase tracking-wider animate-pulse">Sprout Pot</span>
          </div>
          <div className="absolute bottom-8 w-20 h-4 rounded-full bg-slate-900 border-b border-accent-20 shadow-inner" />
          
          <motion.div
            animate={{ rotate: [-4, 4] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            className="absolute bottom-9 flex flex-col items-center origin-bottom overflow-visible"
          >
            <div className="w-1.5 h-14 bg-gradient-to-t from-[#064e3b] to-accent rounded-full shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.25)] relative overflow-visible">
              <motion.div
                animate={{ rotate: [-5, 5] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                className="absolute left-[-16px] top-4 w-5 h-3 bg-accent rounded-full origin-right -rotate-30 shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.3)]"
              />
              <motion.div
                animate={{ rotate: [5, -5] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.2 }}
                className="absolute right-[-16px] top-2 w-5 h-3 bg-accent rounded-full origin-left rotate-30 shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.3)]"
              />
            </div>
            <div className="h-2 w-2 rounded-full bg-[#ffb703] animate-ping" />
          </motion.div>
        </div>
      )
    }

    // Stage 2: Mầm xanh Phát sáng (Lvl 3 - 5)
    if (level <= 5) {
      return (
        <div className="relative h-40 w-40 flex items-center justify-center bg-slate-950/40 rounded-full border border-accent-10 shadow-inner overflow-visible">
          <div className="absolute bottom-2 w-28 h-6 rounded-lg bg-gradient-to-r from-accent-20 via-accent-10 to-accent-20 border border-accent-30 shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.2)]" />
          <div className="absolute bottom-7 w-24 h-4 rounded-full bg-slate-900 border-b border-accent-20 shadow-inner" />
          
          <motion.div
            animate={{ rotate: [-3, 3] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center origin-bottom overflow-visible"
          >
            <div className="w-1.5 h-16 bg-gradient-to-t from-[#064e3b] to-accent rounded-full shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.25)] relative overflow-visible">
              <div className="absolute left-[-18px] top-6 w-6 h-3 bg-accent rounded-full -rotate-30 shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.3)] animate-pulse" />
              <div className="absolute right-[-18px] top-2 w-6 h-3 bg-accent rounded-full rotate-30 shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.3)] animate-pulse" />
            </div>
          </motion.div>

          <motion.div
            animate={petting ? { y: [-10, 0], scaleY: [0.85, 1.05, 1] } : { y: [-2, 2] }}
            transition={petting ? { duration: 0.45, ease: 'easeOut' } : { duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            className="absolute bottom-6 right-6 h-14 w-14 rounded-full flex items-center justify-center cursor-pointer select-none bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#10b981] shadow-[0_0_15px_rgba(28,240,179,0.25)] border border-[#1cf0b3]/30 overflow-visible group"
            onClick={handlePet}
          >
            <div className="flex flex-col items-center justify-center space-y-1 select-none pointer-events-none scale-75">
              <div className="flex gap-2.5">
                <span className="text-[7px] font-bold text-[#1cf0b3] drop-shadow-[0_0_4px_#1cf0b3] font-mono">●</span>
                <span className="text-[7px] font-bold text-[#1cf0b3] drop-shadow-[0_0_4px_#1cf0b3] font-mono">●</span>
              </div>
              <span className="text-[6px] font-bold text-[#1cf0b3] drop-shadow-[0_0_3px_#1cf0b3] font-mono">‿</span>
            </div>

            {equipped.crown && (
              <span className="absolute -top-5 text-xl drop-shadow-[0_0_8px_#ffb703] animate-bounce pointer-events-none z-20">👑</span>
            )}
            {equipped.headphones && (
              <span className="absolute -top-1.5 text-2xl drop-shadow-[0_0_8px_#ff007f] pointer-events-none z-20">🎧</span>
            )}
            {equipped.glasses && (
              <span className="absolute top-[28%] text-2xl drop-shadow-[0_0_8px_#00f0ff] pointer-events-none z-20">🕶️</span>
            )}
          </motion.div>
        </div>
      )
    }

    // Stage 3: Dưa con Thông thái (Lvl 6 - 8)
    if (level <= 8) {
      return (
        <motion.div
          onClick={handlePet}
          animate={petting ? { y: [-24, 0], scaleY: [0.9, 1.05, 1] } : { y: [-6, 6] }}
          transition={petting ? { duration: 0.45, ease: 'easeOut' } : { duration: 2.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="relative h-40 w-40 rounded-full flex items-center justify-center cursor-pointer select-none bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#10b981] shadow-[0_0_35px_rgba(28,240,179,0.3)] border-2 border-[#1cf0b3]/40 overflow-visible"
        >
          <div className="absolute -inset-4 rounded-full border border-dashed border-[#1cf0b3]/30 animate-spin-slow pointer-events-none" />

          <div className="absolute inset-0 rounded-full overflow-hidden opacity-30 pointer-events-none">
            <div className="absolute left-[20%] top-0 bottom-0 w-2.5 bg-[#022c22] blur-[1px]" />
            <div className="absolute left-[40%] top-0 bottom-0 w-2.5 bg-[#022c22] blur-[1px] rotate-12" />
            <div className="absolute left-[60%] top-0 bottom-0 w-2.5 bg-[#022c22] blur-[1px] -rotate-12" />
            <div className="absolute left-[80%] top-0 bottom-0 w-2.5 bg-[#022c22] blur-[1px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center space-y-3 select-none pointer-events-none">
            <div className="flex gap-7">
              <span className="text-xl font-bold text-[#1cf0b3] drop-shadow-[0_0_8px_#1cf0b3] font-mono animate-pulse">
                {petEnergy < 35 ? 'q.q' : petting ? '^.^' : '●'}
              </span>
              <span className="text-xl font-bold text-[#1cf0b3] drop-shadow-[0_0_8px_#1cf0b3] font-mono animate-pulse">
                {petEnergy < 35 ? 'q.q' : petting ? '^.^' : '●'}
              </span>
            </div>
            <span className="text-sm font-black text-[#1cf0b3] drop-shadow-[0_0_6px_#1cf0b3] font-mono">
              {petEnergy < 35 ? '﹏' : petting ? '‿' : 'v'}
            </span>
          </div>

          {equipped.crown && (
            <span className="absolute -top-7 text-4xl drop-shadow-[0_0_12px_#ffb703] animate-bounce pointer-events-none z-20">👑</span>
          )}
          {equipped.headphones && (
            <span className="absolute -top-2.5 text-5xl drop-shadow-[0_0_12px_#ff007f] pointer-events-none z-20">🎧</span>
          )}
          {equipped.glasses && (
            <span className="absolute top-[28%] text-5xl drop-shadow-[0_0_12px_#00f0ff] pointer-events-none z-20">🕶️</span>
          )}
        </motion.div>
      )
    }

    // Stage 4: Dưa hấu Cyberpunk (Lvl 9 - 12)
    if (level <= 12) {
      return (
        <motion.div
          onClick={handlePet}
          animate={petting ? { y: [-24, 0], scaleY: [0.9, 1.05, 1] } : { y: [-6, 6] }}
          transition={petting ? { duration: 0.45, ease: 'easeOut' } : { duration: 2.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="relative h-40 w-40 rounded-full flex items-center justify-center cursor-pointer select-none bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#047857] shadow-[0_0_40px_rgba(28,240,179,0.35)] border-2 border-accent overflow-visible"
        >
          <div className="absolute -inset-5 rounded-full border border-accent/40 animate-pulse pointer-events-none" />
          <div className="absolute -inset-3 rounded-full border border-dashed border-accent/25 animate-spin-slow pointer-events-none" />

          <div className="absolute inset-0 rounded-full overflow-hidden opacity-25 pointer-events-none">
            <div className="absolute left-[15%] top-0 bottom-0 w-3 bg-black" />
            <div className="absolute left-[35%] top-0 bottom-0 w-3 bg-black rotate-12" />
            <div className="absolute left-[55%] top-0 bottom-0 w-3 bg-black -rotate-12" />
            <div className="absolute left-[75%] top-0 bottom-0 w-3 bg-black" />
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80 animate-pulse" viewBox="0 0 100 100">
            <path d="M 30 15 Q 35 40 25 70 Q 28 85 40 90" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3,3" />
            <path d="M 70 10 Q 60 45 75 75 Q 70 85 60 92" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="2,2" />
            <path d="M 45 5 Q 52 50 48 95" fill="none" stroke="var(--color-accent)" strokeWidth="1.2" />
          </svg>

          <div className="relative z-10 flex flex-col items-center justify-center space-y-3.5 select-none pointer-events-none">
            <div className="flex gap-7">
              <span className="text-xl font-bold text-accent drop-shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.85)] font-mono animate-pulse">
                {petEnergy < 35 ? 'q.q' : petting ? 'ò.ó' : 'ಠ_ಠ'}
              </span>
              <span className="text-xl font-bold text-accent drop-shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.85)] font-mono animate-pulse">
                {petEnergy < 35 ? 'q.q' : petting ? 'ò.ó' : 'ಠ_ಠ'}
              </span>
            </div>
            <span className="text-sm font-black text-accent drop-shadow-[0_0_6px_rgba(var(--color-accent-rgb),0.85)] font-mono">
              {petEnergy < 35 ? '﹏' : petting ? '︺' : '▬'}
            </span>
          </div>

          {equipped.crown && (
            <span className="absolute -top-7 text-4xl drop-shadow-[0_0_12px_#ffb703] animate-bounce pointer-events-none z-20">👑</span>
          )}
          {equipped.headphones && (
            <span className="absolute -top-2.5 text-5xl drop-shadow-[0_0_12px_#ff007f] pointer-events-none z-20">🎧</span>
          )}
          {equipped.glasses && (
            <span className="absolute top-[28%] text-5xl drop-shadow-[0_0_12px_#00f0ff] pointer-events-none z-20">🕶️</span>
          )}
        </motion.div>
      )
    }

    // Stage 5: Dưa thần Vô cực (Lvl 13+)
    return (
      <div className="relative h-44 w-44 flex items-center justify-center overflow-visible">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,183,3,0.3),_transparent_70%)] animate-pulse pointer-events-none" />
        <div className="absolute -inset-6 rounded-full border-2 border-dashed border-[#ffb703]/25 animate-spin-slow pointer-events-none" />
        <div className="absolute -inset-3 rounded-full border border-accent/35 animate-spin-reverse pointer-events-none" />

        <motion.div
          onClick={handlePet}
          animate={petting ? { y: [-30, 0], scale: [0.95, 1.1, 1] } : { y: [-15, 15] }}
          transition={petting ? { duration: 0.45, ease: 'easeOut' } : { duration: 2.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="relative h-36 w-36 rounded-full flex items-center justify-center cursor-pointer select-none bg-gradient-to-br from-[#ffb703] via-[#eab308] to-[#10b981] shadow-[0_0_60px_rgba(255,183,3,0.55)] border-2 border-accent overflow-visible z-10"
        >
          <div className="absolute inset-0 rounded-full overflow-hidden opacity-30 pointer-events-none">
            <div className="absolute left-[20%] top-0 bottom-0 w-3 bg-[#3f2b00]" />
            <div className="absolute left-[40%] top-0 bottom-0 w-3 bg-[#3f2b00] rotate-12" />
            <div className="absolute left-[60%] top-0 bottom-0 w-3 bg-[#3f2b00] -rotate-12" />
            <div className="absolute left-[80%] top-0 bottom-0 w-3 bg-[#3f2b00]" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center space-y-3 select-none pointer-events-none">
            <div className="flex gap-6">
              <span className="text-xl font-bold text-white drop-shadow-[0_0_8px_#ffb703] font-mono animate-pulse">
                {petEnergy < 35 ? 'q.q' : petting ? '✧.✧' : '★_★'}
              </span>
              <span className="text-xl font-bold text-white drop-shadow-[0_0_8px_#ffb703] font-mono animate-pulse">
                {petEnergy < 35 ? 'q.q' : petting ? '✧.✧' : '★_★'}
              </span>
            </div>
            <span className="text-sm font-black text-white drop-shadow-[0_0_6px_#ffb703] font-mono">
              {petEnergy < 35 ? '﹏' : petting ? '︺' : '▿'}
            </span>
          </div>

          {equipped.crown ? (
            <span className="absolute -top-9 text-5xl drop-shadow-[0_0_15px_#ffb703] animate-bounce pointer-events-none z-20">👑</span>
          ) : (
            <div className="absolute -top-3 w-16 h-2 rounded-full border border-[#ffb703] bg-[#ffb703]/20 animate-pulse pointer-events-none" />
          )}
          {equipped.headphones && (
            <span className="absolute -top-1.5 text-5xl drop-shadow-[0_0_15px_#ff007f] pointer-events-none z-20">🎧</span>
          )}
          {equipped.glasses && (
            <span className="absolute top-[28%] text-5xl drop-shadow-[0_0_15px_#00f0ff] pointer-events-none z-20">🕶️</span>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12 lg:px-8 max-w-5xl">
      {/* Return to home button */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate('home')}
          className="cursor-pointer inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#1cf0b3] font-bold border border-[#1cf0b3]/20 bg-[#071b14] px-4 py-2.5 rounded-2xl hover:border-[#1cf0b3]/55 transition shadow-neon"
        >
          ← Quay lại Home (Home)
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#1cf0b3] border-t-transparent" />
          <p className="text-xs text-slate-400 font-mono">Loading profile data...</p>
        </div>
      ) : error ? (
        <div className="rounded-[32px] border border-red-500/20 bg-red-500/10 p-6 text-center text-red-300 font-mono max-w-md mx-auto">
          ⚠ {error}
        </div>
      ) : profileData ? (
        <div className="space-y-10">
          
          {/* Profile Card & Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[36px] border border-white/10 bg-gradient-to-br from-[#061b14]/75 to-[#020b08]/85 p-6 md:p-8 shadow-neon relative overflow-hidden flex flex-col md:flex-row items-center gap-8"
          >
            <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
            
            {/* Holographic Avatar */}
            <div className="relative h-24 w-24 rounded-full border border-[#1cf0b3]/40 flex items-center justify-center bg-black/40 shadow-inner group">
              <span className="text-4xl">🍉</span>
              <div className="absolute inset-0 rounded-full border border-dashed border-[#1cf0b3] animate-spin-slow pointer-events-none opacity-30" />
            </div>

            {/* Profile Meta */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                {profileData.user.role === 'merchant' ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-amber-400 font-mono shadow-[0_0_12px_rgba(245,158,11,0.15)] select-none">
                    👑 Premium Merchant
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1cf0b3]/15 border border-[#1cf0b3]/30 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-[#8effd6] font-mono select-none">
                    🍉 Consumer Member
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-extrabold text-white leading-tight">{profileData.user.username}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
                <span>📧 {profileData.user.email}</span>
                <span>📅 Gia nhập: {formatDate(profileData.user.date_joined)}</span>
              </div>
            </div>

            {/* Analytical Counters */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 text-center">
              <div className="rounded-2xl bg-white/5 border border-white/5 p-4 min-w-[120px]">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Total Scans</p>
                <p className="text-2xl font-black font-mono text-[#1cf0b3] mt-1">{profileData.totalScans}</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/5 p-4 min-w-[120px]">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Reviews Left</p>
                <p className="text-2xl font-black font-mono text-[#eab308] mt-1">{profileData.totalReviews}</p>
              </div>
            </div>
        </motion.div>

          {/* === HỆ THỐNG PHÂN QUYỀN SAAS (CONSUMER VS MERCHANT PREMIUM) === */}
          {profileData.user.role === 'merchant' ? (
            /* MERCHANT PREMIUM DASHBOARD */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-[40px] border border-amber-500/30 bg-[#071310]/95 p-6 md:p-8 shadow-[0_0_50px_rgba(251,191,36,0.12)] relative overflow-hidden text-left space-y-6"
            >
              <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[10px] font-bold text-amber-400 uppercase font-mono shadow-[0_0_10px_rgba(245,158,11,0.08)]">
                    👑 Premium Control Center
                  </span>
                  <h3 className="text-2xl font-black text-white font-mono tracking-wide uppercase">
                    Trung tâm Quản trị Nhà Vườn
                  </h3>
                  <p className="text-xs text-slate-400">
                    Phân tích số liệu sâu, quản lý kho dưa hấu theo lô hàng và tải xuống báo cáo CSV kinh doanh.
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      const scans = profileData.scans || [];
                      if (scans.length === 0) {
                        alert("Không có dữ liệu quét nào để xuất báo cáo.");
                        return;
                      }
                      let csvContent = "\uFEFF"; // UTF-8 BOM
                      csvContent += "Mã quả dưa,Loại quả,Độ chín,Độ ngọt (Brix),Trọng lượng (kg),Độ tin cậy AI (%),Ngày quét\n";
                      scans.forEach(scan => {
                        csvContent += `${scan.id},${scan.label},${scan.ripeness === 'Ripe (Perfect)' ? 'Chín hoàn hảo' : scan.ripeness},${scan.sweetness},${scan.predicted_weight},${scan.confidence.toFixed(1)},${new Date(scan.created_at).toLocaleString('vi-VN')}\n`;
                      });
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.setAttribute("href", url);
                      link.setAttribute("download", `Bao_Cao_Nha_Vuon_Watermelon_${new Date().toISOString().slice(0,10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#1cf0b3] to-[#12bd8b] hover:brightness-110 text-slate-950 font-black tracking-wider text-xs uppercase py-3.5 px-5 shadow-[0_0_20px_rgba(28,240,179,0.2)] transition-all duration-300 font-mono"
                  >
                    📊 Xuất Báo cáo Lô hàng (.CSV)
                  </button>
                  <button
                    onClick={() => handleUpdateRole('consumer')}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-red-500/25 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs py-3.5 px-4 font-bold tracking-wider uppercase transition-all duration-300 font-mono"
                  >
                    🔄 Hạ cấp thử nghiệm
                  </button>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white/5 border border-white/5 p-4.5">
                  <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Tổng sản lượng dưa đã kiểm định</p>
                  <p className="text-3xl font-black font-mono text-[#1cf0b3] mt-1.5">
                    {profileData.scans ? profileData.scans.reduce((acc, s) => acc + (s.predicted_weight || 0), 0).toFixed(1) : '0.0'} <span className="text-sm font-medium text-slate-400">kg</span>
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/5 p-4.5">
                  <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Độ ngọt trung bình toàn vườn</p>
                  <p className="text-3xl font-black font-mono text-[#eab308] mt-1.5">
                    {profileData.scans && profileData.scans.length > 0
                      ? (profileData.scans.reduce((acc, s) => acc + (s.sweetness || 0), 0) / profileData.scans.length).toFixed(1)
                      : '0.0'} <span className="text-sm font-medium text-slate-400">Brix</span>
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/5 p-4.5">
                  <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Hàng lỗi / Loại bỏ (AI Filter)</p>
                  <p className="text-3xl font-black font-mono text-red-400 mt-1.5">
                    0 <span className="text-sm font-medium text-slate-400">quả</span>
                  </p>
                </div>
              </div>

              {/* Mock Batches list */}
              <div className="space-y-3.5">
                <h5 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold">📦 Lô dưa hấu nhập vườn gần đây</h5>
                <div className="rounded-2xl border border-white/5 overflow-hidden">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-slate-400 font-mono text-[9px] uppercase border-b border-white/5">
                        <th className="p-3">Tên lô hàng</th>
                        <th className="p-3">Tổng sản lượng</th>
                        <th className="p-3">Độ ngọt trung bình</th>
                        <th className="p-3">Đánh giá chung</th>
                        <th className="p-3">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      <tr>
                        <td className="p-3 font-semibold text-white">Lô dưa Long An Cát Ngọt #01</td>
                        <td className="p-3">92.4 kg (22 quả)</td>
                        <td className="p-3 font-mono text-amber-400">11.8 Brix</td>
                        <td className="p-3 text-[#1cf0b3]">Chín ngọt cực đều (Ripe)</td>
                        <td className="p-3"><span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded text-[10px] uppercase font-mono">Đã kiểm định</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">Lô dưa Hắc Mỹ Nhân Cần Thơ #04</td>
                        <td className="p-3">48.2 kg (12 quả)</td>
                        <td className="p-3 font-mono text-amber-400">9.2 Brix</td>
                        <td className="p-3 text-amber-400">Độ ngọt khá, hơi non (Underripe)</td>
                        <td className="p-3"><span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded text-[10px] uppercase font-mono">Đã kiểm định</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">Lô dưa sọc dưa xuất khẩu #12</td>
                        <td className="p-3">150.0 kg (35 quả)</td>
                        <td className="p-3 font-mono text-amber-400">12.5 Brix</td>
                        <td className="p-3 text-[#1cf0b3]">Độ chín hoàn hảo (Ripe Perfect)</td>
                        <td className="p-3"><span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded text-[10px] uppercase font-mono animate-pulse">Chờ kiểm định</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            /* CONSUMER SAAS PRICING / UPGRADE CARD */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-[32px] border border-amber-500/20 bg-[#061510]/80 p-6 md:p-8 shadow-[0_0_35px_rgba(245,158,11,0.08)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden theme-led-border"
            >
              <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
              
              <div className="text-left space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-400 font-mono select-none">
                  🧑‍🌾 Phiên bản Nhà Vườn & Thương Lái
                </span>
                <h3 className="text-xl font-black text-white font-mono uppercase tracking-wide">
                  Nâng cấp lên Doanh Nghiệp Premium
                </h3>
                <p className="text-xs text-slate-300 max-w-xl font-light leading-relaxed">
                  Bạn là nhà vườn, thương lái hoặc hộ kinh doanh trái cây sạch? Nâng cấp lên phiên bản đặc biệt để mở khóa: **Xuất báo cáo CSV thực tế**, **Quản lý dưa theo từng lô hàng**, và **Biểu đồ thống kê Analytics sản lượng sâu**.
                </p>
              </div>

              <button
                onClick={() => setPremiumModalOpen(true)}
                className="cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black tracking-wider text-xs uppercase py-3.5 px-6 rounded-2xl shadow-[0_0_24px_rgba(245,158,11,0.22)] transition-all duration-300 shrink-0 font-mono"
              >
                👑 Nâng cấp ngay
              </button>
            </motion.div>
          )}


          {/* 🤖 CYBERPET TAMAGOTCHI SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[40px] border border-[#1cf0b3]/30 bg-slate-950/70 p-6 md:p-8 shadow-[0_0_50px_rgba(28,240,179,0.15)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(28,240,179,0.08),_transparent_60%)] pointer-events-none z-0" />
            <div className="absolute top-4 right-4 text-[10px] uppercase font-mono text-[#1cf0b3]/60 bg-[#1cf0b3]/5 px-3 py-1 rounded-full border border-[#1cf0b3]/20">
              🤖 Cyberpet Dashboard
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_1.3fr] items-center">
              {/* Left Column: Animated Pet View */}
              <div className="flex flex-col items-center justify-center space-y-6 pt-4">
                
                {/* Pet Name Editor */}
                <div className="flex items-center gap-2">
                  {isEditingName ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        maxLength="15"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-black/60 border border-[#1cf0b3]/50 text-white rounded-xl px-3 py-1 text-sm font-bold font-mono focus:outline-none focus:border-[#1cf0b3]"
                      />
                      <button onClick={handleSaveName} className="bg-[#1cf0b3] text-slate-950 px-2.5 py-1 rounded-xl text-xs font-bold cursor-pointer hover:bg-[#2efd94]">Lưu</button>
                      <button onClick={() => setIsEditingName(false)} className="bg-white/10 text-white px-2 py-1 rounded-xl text-xs cursor-pointer hover:bg-white/15">Hủy</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-black text-white font-mono bg-gradient-to-r from-white to-[#8effd6] bg-clip-text text-transparent">{petName}</h4>
                      <button
                        onClick={() => {
                          setNewName(petName)
                          setIsEditingName(true)
                        }}
                        className="text-slate-400 hover:text-[#1cf0b3] transition text-xs cursor-pointer"
                        title="Rename Pet"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>

                {/* Animated Watermelon CSS Character */}
                <div className="relative flex items-center justify-center p-6 h-56 w-full overflow-visible">
                  {renderPetVisual()}

                  {/* Floating Emojis */}
                  <AnimatePresence>
                    {floatingEmojis.map(emoji => (
                      <motion.span
                        key={emoji.id}
                        initial={{ opacity: 1, scale: 0.8, x: 0, y: 0 }}
                        animate={{ opacity: 0, scale: 1.5, x: emoji.x, y: emoji.y }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.85, ease: 'easeOut' }}
                        className="absolute text-xl pointer-events-none z-30"
                        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                      >
                        {emoji.emoji}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Energy & Happiness Status Bars */}
                <div className="w-full max-w-[240px] space-y-3.5 pt-2">
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400">
                      <span>⚡ Energy:</span>
                      <span className={petEnergy < 35 ? 'text-red-400 animate-pulse' : 'text-[#1cf0b3]'}>{petEnergy}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-[#1cf0b3] rounded-full transition-all duration-500 shadow-[0_0_8px_#1cf0b3]" style={{ width: `${petEnergy}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400">
                      <span>❤️ Hạnh phúc:</span>
                      <span className="text-[#ff007f]">{petHappiness}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-[#ff007f] rounded-full transition-all duration-500 shadow-[0_0_8px_#ff007f]" style={{ width: `${petHappiness}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Level, Coins & Accessories Gear Shop */}
              <div className="space-y-6">
                {/* Level Card */}
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4.5 text-left relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-mono tracking-widest text-[#1cf0b3]">Evolution Stage</p>
                      <h4 className="text-lg font-black text-white font-mono mt-0.5">{getLevelStage(level)}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Level</span>
                      <span className="text-3xl font-black font-mono text-white block">Lvl {level}</span>
                    </div>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-slate-400 uppercase">
                      <span>XP: {xpProgress}/100</span>
                      <span>Tới cấp sau</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.5)]" style={{ width: `${xpProgress}%` }} />
                    </div>
                  </div>
                </div>

                {/* Coin & Feeding Control Panel */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 bg-[#ffb703]/10 border border-[#ffb703]/25 rounded-2xl px-5 py-3 shadow-[0_0_15px_rgba(255,183,3,0.06)]">
                    <span className="text-2xl animate-spin-slow">🪙</span>
                    <div className="text-left leading-none">
                      <span className="text-[10px] uppercase font-mono text-[#ffb703] block tracking-wider">Accumulated Coins</span>
                      <span className="text-xl font-black font-mono text-white mt-1 inline-block">{coins} xu</span>
                    </div>
                  </div>

                  <button
                    onClick={handleFeed}
                    disabled={petEnergy >= 100 || coins < 2}
                    className={`cursor-pointer rounded-2xl px-6 py-4.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border select-none transition-all duration-300 ${
                      petEnergy >= 100
                        ? 'bg-slate-800/20 border-slate-700 text-slate-500 cursor-not-allowed'
                        : coins < 2
                          ? 'bg-red-950/20 border-red-500/20 text-red-400/50 cursor-not-allowed'
                          : 'bg-accent text-slate-950 border-transparent hover:scale-105 shadow-[0_4px_15px_rgba(var(--color-accent-rgb),0.25)] hover:bg-accent-hover'
                    }`}
                  >
                    🍉 Feed (-2 coins)
                  </button>
                </div>

                {/* Accessories Shop Grid */}
                <div className="space-y-3.5 text-left">
                  <h5 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold">🛒 Cửa hàng phụ kiện Hologram</h5>
                  
                  <div className="grid gap-3">
                    {gearItems.map((item) => {
                      const isOwned = owned[item.key]
                      const isEquipped = equipped[item.key]
                      return (
                        <div
                          key={item.key}
                          className={`rounded-2xl border p-3.5 flex items-center justify-between gap-4 transition duration-300 ${
                            isEquipped 
                              ? 'border-accent bg-[#031c15]/65' 
                              : isOwned 
                                ? 'border-white/10 bg-[#030a08]/90' 
                                : 'border-white/5 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-3xl shrink-0 bg-black/40 rounded-xl h-12 w-12 border border-white/5 flex items-center justify-center select-none shadow">
                              {item.icon}
                            </span>
                            <div className="leading-none text-left space-y-1">
                              <span className="font-bold text-sm text-white block">{item.name}</span>
                              <span className="text-[10px] text-slate-400 font-light leading-relaxed">{item.desc}</span>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isOwned ? (
                              <button
                                onClick={() => {
                                  if (level <= 2) {
                                    alert("Seed Sprout cannot equip items yet! Accumulate scans to evolve to Lvl 3.")
                                    return
                                  }
                                  handleToggleEquip(item.key)
                                }}
                                className={`cursor-pointer px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition duration-200 border ${
                                  level <= 2
                                    ? 'bg-slate-800/10 border-slate-700/10 text-slate-500 cursor-not-allowed opacity-50'
                                    : isEquipped
                                      ? 'bg-transparent border-accent text-accent hover:bg-accent/10'
                                      : 'bg-white/10 border-white/5 text-white hover:bg-white/15'
                                }`}
                              >
                                {isEquipped ? 'Unequip' : 'Equip'}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBuyAccessory(item.key, item.price)}
                                disabled={coins < item.price}
                                className={`cursor-pointer px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition duration-200 select-none ${
                                  coins < item.price
                                    ? 'bg-slate-800/10 border-slate-700/10 text-slate-500 cursor-not-allowed'
                                    : 'bg-[#ffb703] border-transparent text-slate-950 hover:bg-[#fb8500] hover:scale-105'
                                }`}
                              >
                                Buy ({item.price} xu)
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* User's Scan History List */}
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold tracking-wide text-white">Lịch sử quét cá nhân (Personal History)</h3>
              <p className="text-xs text-slate-400 mt-1">List of watermelons scanned and quality-certified by your account.</p>
            </div>

            {profileData.scans.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-white/10 bg-[#04120d]/20 p-12 text-center text-slate-400 max-w-xl mx-auto">
                <svg className="w-12 h-12 mx-auto text-slate-500 mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-base font-semibold">Chưa có lịch sử quét</p>
                <p className="text-xs text-slate-500 mt-1 mb-6">Go back to the home page and scan your first watermelon!</p>
                <button
                  onClick={() => onNavigate('home')}
                  className="cursor-pointer py-2.5 px-6 rounded-2xl bg-[#22f0a5] hover:bg-[#1cd893] text-slate-950 font-extrabold text-xs tracking-wider uppercase transition shadow-neon"
                >
                  Start quét ngay 🍉
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                <AnimatePresence>
                  {profileData.scans.map((scan) => (
                    <motion.div
                      key={scan.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="rounded-3xl border border-white/5 bg-[#030e0b]/55 p-4 md:p-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 hover:border-[#1cf0b3]/25 transition"
                    >
                      {/* Photo Thumbnail */}
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl overflow-hidden border border-white/10 bg-black flex-shrink-0">
                          <img 
                            src={scan.detected_image_url || scan.original_image_url} 
                            alt="Scan Thumbnail" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-400">ID: {scan.id}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-[10px] font-mono text-slate-400">📅 {new Date(scan.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                          </div>
                          <p className="text-base font-bold text-white capitalize">{scan.label}</p>
                        </div>
                      </div>

                      {/* Specs widgets */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                        {/* Weight */}
                        <div className="rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-center min-w-[70px]">
                          <p className="text-[9px] text-slate-500 uppercase">Weight</p>
                          <p className="text-white font-bold mt-0.5">{scan.predicted_weight ? `${scan.predicted_weight.toFixed(1)}kg` : '--'}</p>
                        </div>
                        {/* Sweetness */}
                        <div className="rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-center min-w-[70px]">
                          <p className="text-[9px] text-slate-500 uppercase">Sweetness</p>
                          <p className="text-[#eab308] font-bold mt-0.5">{scan.sweetness ? `${scan.sweetness} Brix` : '--'}</p>
                        </div>
                        {/* Ripeness */}
                        <div className="rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-center min-w-[80px]">
                          <p className="text-[9px] text-slate-500 uppercase">Ripeness</p>
                          <p className="text-[#1cf0b3] font-bold mt-0.5 capitalize">{scan.ripeness || 'Unknown'}</p>
                        </div>
                        {/* Confidence */}
                        <div className="rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-center min-w-[70px]">
                          <p className="text-[9px] text-slate-500 uppercase">YOLO</p>
                          <p className="text-white font-bold mt-0.5">{scan.confidence.toFixed(0)}%</p>
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="flex items-center gap-2 border-t md:border-t-0 border-white/5 pt-3 md:pt-0 justify-end">
                        {/* View Certificate */}
                        <button
                          onClick={() => onViewCertificate(scan)}
                          className="cursor-pointer px-4 py-2 rounded-xl bg-[#0a231c] hover:bg-[#113229] border border-[#1cf0b3]/30 hover:border-[#1cf0b3]/60 transition text-xs font-bold text-[#8effe3]"
                        >
                          Chứng thư
                        </button>
                        {/* Remove from history view */}
                        <button
                          onClick={() => handleDeleteScan(scan.id)}
                          className="cursor-pointer px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 transition text-xs font-bold text-slate-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <PremiumModal
            isOpen={premiumModalOpen}
            onClose={() => setPremiumModalOpen(false)}
            onUpgradeSuccess={() => handleUpdateRole('merchant')}
          />
        </div>
      ) : null}
    </div>
  )
}
