import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DonateSection({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('momo') // momo, paypal, crypto
  const [copied, setCopied] = useState(false)

  const cryptoAddress = '0x74D14eA8EdC20367bfBfD9E4E2eD1574aA1eFbc2'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cryptoAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabContent = {
    momo: {
      title: 'Momo E-Wallet',
      subtitle: 'Scan QR code to support the project via Momo',
      details: [
        { label: 'Account Name', value: 'NGUYEN LE BAO DUY' },
        { label: 'Phone Number', value: '0905 XXX XXX' },
        { label: 'Message', value: 'Watermelon AI Donate' },
      ],
      qrColor: 'from-[#a21caf] to-[#db2777]',
      accentColor: '#db2777',
    },
    paypal: {
      title: 'PayPal / Cards',
      subtitle: 'Support with international credit card or PayPal account',
      details: [
        { label: 'Email', value: 'lebaoduy.dev@gmail.com' },
        { label: 'Account Name', value: 'Nguyen Le Bao Duy' },
        { label: 'Country', value: 'Vietnam' },
      ],
      qrColor: 'from-[#2563eb] to-[#1d4ed8]',
      accentColor: '#2563eb',
    },
    crypto: {
      title: 'Crypto Wallet',
      subtitle: 'Support using Ethereum (ETH) or USDT (ERC-20)',
      details: [
        { label: 'Network', value: 'Ethereum / ERC-20' },
        { label: 'Address', value: cryptoAddress },
      ],
      qrColor: 'from-[#f59e0b] to-[#d97706]',
      accentColor: '#f59e0b',
    },
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        {/* Background Click to Close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-[38px] border border-accent-30 bg-[#020a08]/95 p-8 md:p-10 shadow-[0_0_80px_rgba(var(--color-accent-rgb),0.15)] text-white z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Neon Glow Accents */}
          <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-accent-10 blur-[55px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-44 w-44 rounded-full bg-accent-5 blur-[55px] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="cursor-pointer absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/15 transition-all z-20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-center">
            {/* Info Left */}
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-accent">Support project</p>
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                Sponsor Our AI Research
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Your contributions help fund server hosting, API integrations, dataset collection, and GPU compute resources needed to refine our watermelon intelligence models.
              </p>
              <div className="rounded-3xl border border-accent-10 bg-accent-5 p-5 shadow-inner">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Supporter Benefits</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-accent">✦</span> Early access to YOLOv11 model upgrades
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent">✦</span> Real-time weight and ripeness predictions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent">✦</span> Supporter badge in our developer list
                  </li>
                </ul>
              </div>
            </div>

            {/* Interaction Right */}
            <div className="space-y-8 rounded-[32px] border border-accent-10 bg-[#04130f]/90 p-6 md:p-8 shadow-inner relative">
              <div className="flex flex-wrap gap-3">
                {['momo', 'paypal', 'crypto'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-2xl px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none cursor-pointer ${
                      activeTab === tab
                        ? 'bg-accent text-slate-950 shadow-md shadow-accent/20'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab === 'momo' ? 'Momo' : tab === 'paypal' ? 'PayPal' : 'Crypto'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-8 md:grid-cols-[1fr_1.1fr] items-center"
                >
                  {/* QR Mockup */}
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="relative rounded-[28px] bg-slate-950 p-6 ring-1 ring-white/15 shadow-neon">
                      {/* Decorative corner glows */}
                      <div className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-accent rounded-tl-sm" />
                      <div className="absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-accent rounded-tr-sm" />
                      <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-accent rounded-bl-sm" />
                      <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-accent rounded-br-sm" />

                      {/* Gradient QR visual placeholder */}
                      <div className={`h-40 w-40 rounded-xl bg-gradient-to-br ${tabContent[activeTab].qrColor} opacity-90 p-4 flex flex-col justify-between items-center`}>
                        <div className="flex w-full justify-between items-center">
                          <div className="h-10 w-10 border-2 border-slate-950 bg-white rounded-md" />
                          <div className="h-10 w-10 border-2 border-slate-950 bg-white rounded-md" />
                        </div>
                        <div className="h-8 w-8 bg-slate-950 rounded-md flex items-center justify-center">
                          <span className="text-[10px] font-bold text-accent">AI</span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                          <div className="h-10 w-10 border-2 border-slate-950 bg-white rounded-md" />
                          <div className="h-6 w-10 bg-slate-950 opacity-40 rounded" />
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-center text-xs text-slate-400 font-light">
                      {tabContent[activeTab].subtitle}
                    </p>
                  </div>

                  {/* Transaction Details */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">
                      {tabContent[activeTab].title}
                    </h3>
                    <div className="space-y-3">
                      {tabContent[activeTab].details.map((detail, index) => (
                        <div key={index} className="rounded-2xl bg-white/5 p-4 border border-white/5">
                          <p className="text-[10px] uppercase text-slate-400 tracking-wider">
                            {detail.label}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white break-all select-all font-mono">
                            {detail.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {activeTab === 'crypto' && (
                      <motion.button
                        onClick={copyToClipboard}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 py-3 text-xs font-semibold text-white transition cursor-pointer"
                      >
                        <span>{copied ? '✓ Copied!' : 'Copy Wallet Address'}</span>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
