import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

function AgronomistChat({ activeResult, user }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Xin chào! Tôi là Trợ lý AI Chuyên gia Nông nghiệp dưa hấu 🍉. Tôi có thể giúp gì cho bạn hôm nay? Bạn có thể hỏi tôi về mẹo chọn dưa hấu, cách bảo quản hoặc các công thức chế biến ngon miệng nhé! 🧑‍🌾'
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Trigger quick prompt immediately on click
  const handleQuickPrompt = (promptText) => {
    handleSend(promptText)
  }

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputText).trim()
    if (!text) return

    if (!textToSend) {
      setInputText('')
    }

    // Add user message to state
    const newMessages = [...messages, { sender: 'user', text }]
    setMessages(newMessages)
    setIsTyping(true)

    try {
      // Map frontend messages history to django API backend expectations
      const history = newMessages.slice(1, -1).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        content: msg.text
      }))

      // Prepare optional scan context
      const context = activeResult ? {
        label: activeResult.label,
        ripeness: activeResult.ripeness,
        sweetness: activeResult.sweetness,
        predicted_weight: activeResult.predicted_weight,
        confidence: activeResult.confidence
      } : null

      const response = await axios.post('/api/chat/', {
        message: text,
        history: history,
        context: context
      })

      setIsTyping(false)
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.response }])
    } catch (error) {
      console.error('Chat error:', error)
      setIsTyping(false)
      
      // Smart offline / error fallback message
      const fallbackMsg = 'Kết nối mạng của bạn hoặc hệ thống đang gặp gián đoạn. Tôi vẫn có thể tư vấn offline: Hãy chọn dưa có cuống khô héo, vỏ căng bóng và rốn dưa nhỏ để đạt độ chín ngọt hoàn hảo nhé! 🍉'
      setMessages(prev => [...prev, { sender: 'bot', text: fallbackMsg }])
    }
  }

  const quickPrompts = [
    { text: '🍉 Mẹo chọn dưa hấu ngon ngọt', val: 'mẹo chọn dưa hấu ngon ngọt từ chuyên gia' },
    { text: '❄️ Cách bảo quản dưa hấu lâu', val: 'cách bảo quản dưa hấu được lâu và tươi ngon nhất' },
    { text: '🍹 Công thức sinh tố dưa hấu', val: 'gợi ý công thức món ngon hoặc sinh tố dưa hấu giải nhiệt' },
    { text: '📊 Độ ngọt Brix là gì?', val: 'giải thích chỉ số độ ngọt Brix là gì và thang điểm dưa hấu' }
  ]

  // Add context-specific prompts if there's a scanned watermelon active
  const contextPrompts = activeResult ? [
    { text: '🍈 Làm gì với quả dưa vừa quét này?', val: 'tôi nên làm món gì hoặc ăn quả dưa vừa quét này thế nào?' },
    { text: '❓ Tại sao quả dưa này chín ngon?', val: 'giải thích chi tiết tại sao quả dưa tôi vừa quét đạt chỉ số chất lượng này' }
  ] : []

  return (
    <>
      {/* Morphing Floating Open Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsOpen(true)}
            layoutId="chat-widget"
            className="fixed right-6 bottom-24 z-[100] flex items-center justify-center gap-2 rounded-full border border-[#1cf0b3]/30 bg-[#051a14]/95 backdrop-blur-md text-sm font-semibold tracking-wider text-[#8effd6] shadow-[0_0_24px_rgba(28,240,179,0.22)] hover:shadow-[0_0_36px_rgba(28,240,179,0.45)] transition-all duration-300 cursor-pointer font-mono"
            style={{
              height: '56px',
              width: isHovered ? '170px' : '56px',
              borderRadius: '28px',
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">💬</span>
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap pr-2"
                >
                  Chat với AI
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="chat-widget"
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 150 }}
            className="fixed right-6 bottom-24 z-[101] w-[380px] max-sm:w-[calc(100vw-32px)] h-[520px] rounded-3xl border border-white/10 bg-[#071310]/95 backdrop-blur-xl shadow-[0_0_40px_rgba(28,240,179,0.25)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#051c16] to-[#03110d]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="text-2xl">🧑‍🌾</span>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#1cf0b3] border border-[#071310]" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#1cf0b3] animate-ping" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#8effd6] font-mono leading-none">
                    Trợ lý AI Nông Nghiệp
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">Chuyên gia dưa hấu trực tuyến</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setIsHovered(false)
                }}
                className="cursor-pointer h-8 w-8 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:text-white transition flex items-center justify-center text-slate-400 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Active Result Context Banner */}
            {activeResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-4 mt-3 p-3 rounded-2xl bg-[#1cf0b3]/5 border border-[#1cf0b3]/20 flex items-center justify-between text-xs text-[#8effd6] backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🍈</span>
                  <span className="font-semibold text-slate-200 text-left">
                    Dưa hấu vừa quét: <span className="text-[#1cf0b3]">{activeResult.predicted_weight}kg</span>
                  </span>
                </div>
                <div className="flex gap-1.5 font-mono">
                  <span className="bg-[#1cf0b3]/15 px-2 py-0.5 rounded-lg border border-[#1cf0b3]/20 text-[9px] font-bold">
                    {activeResult.sweetness} Brix
                  </span>
                  <span className="bg-[#1cf0b3]/15 px-2 py-0.5 rounded-lg border border-[#1cf0b3]/20 text-[9px] font-bold">
                    {activeResult.ripeness === 'Ripe (Perfect)' ? 'Chín ngon' : activeResult.ripeness}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin select-text">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed text-left border ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#0d3b2e] to-[#05221b] border-[#1cf0b3]/25 text-slate-200 shadow-[0_2px_12px_rgba(28,240,179,0.05)] rounded-tr-none'
                        : 'bg-white/5 border-white/5 text-slate-300 rounded-tl-none'
                    }`}
                  >
                    {/* Render message formatting - replace line breaks with <br /> */}
                    {msg.text.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < msg.text.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Typing Loader animation */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-none p-3.5 bg-white/5 border border-white/5 flex items-center gap-1.5">
                    <motion.span
                      animate={{ scale: [0.7, 1.2, 0.7] }}
                      transition={{ repeat: Infinity, duration: 1.1, delay: 0 }}
                      className="text-xs"
                    >
                      🍉
                    </motion.span>
                    <motion.span
                      animate={{ scale: [0.7, 1.2, 0.7] }}
                      transition={{ repeat: Infinity, duration: 1.1, delay: 0.2 }}
                      className="text-xs"
                    >
                      🍉
                    </motion.span>
                    <motion.span
                      animate={{ scale: [0.7, 1.2, 0.7] }}
                      transition={{ repeat: Infinity, duration: 1.1, delay: 0.4 }}
                      className="text-xs"
                    >
                      🍉
                    </motion.span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none border-t border-white/5 bg-black/10 select-none">
              {/* Combine context prompts and general prompts */}
              {[...contextPrompts, ...quickPrompts].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(chip.val)}
                  className="cursor-pointer text-[10px] md:text-xs font-mono px-3 py-1.5 rounded-full border border-white/10 hover:border-[#1cf0b3]/40 bg-white/5 hover:bg-[#1cf0b3]/5 text-slate-300 hover:text-[#8effd6] transition-all duration-300"
                >
                  {chip.text}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="p-3 border-t border-white/10 flex gap-2 items-center bg-[#030c0a]/90"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={activeResult ? "Hỏi tôi về quả dưa vừa quét..." : "Hỏi mẹo chọn dưa hấu ngon ngọt..."}
                disabled={isTyping}
                className="flex-1 bg-white/5 border border-white/10 focus:border-[#1cf0b3]/30 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition-all duration-300"
              />
              <button
                type="submit"
                disabled={isTyping || !inputText.trim()}
                className="cursor-pointer h-10 w-10 rounded-2xl bg-gradient-to-r from-[#1cf0b3] to-[#12bd8b] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 text-white flex items-center justify-center shadow-[0_0_12px_rgba(28,240,179,0.25)]"
              >
                🚀
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AgronomistChat
