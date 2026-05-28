export default function ScanOverlay({ isLoading }) {
  return (
    <div className={`pointer-events-none fixed inset-x-0 top-0 z-50 transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mx-auto mt-5 h-1 w-[90%] overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-[0_0_35px_rgba(34,255,166,0.2)]">
        <div className="h-full w-[30%] animate-scan bg-gradient-to-r from-[#17e7b0] via-[#78fff2] to-[#43e8b4]" />
      </div>
      <div className="mx-auto mt-2 flex w-[90%] items-center justify-between text-xs text-slate-300">
        <span>AI scan in progress</span>
        <span>Hologram pulse active</span>
      </div>
    </div>
  )
}
