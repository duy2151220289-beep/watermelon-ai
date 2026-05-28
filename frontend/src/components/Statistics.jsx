import { motion } from 'framer-motion'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function Statistics({ stats }) {
  const chartData = {
    labels: stats.recentDetections.map((item, index) => `#${stats.recentDetections.length - index}`),
    datasets: [
      {
        label: 'Confidence',
        data: stats.recentDetections.map((item) => item.confidence),
        backgroundColor: 'rgba(46, 251, 176, 0.6)',
        borderColor: 'rgba(46, 251, 176, 1)',
        borderWidth: 2,
        borderRadius: 12,
      },
    ],
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="card-panel rounded-[40px] border border-white/10 p-8 shadow-neon"
    >
      <div className="grid gap-6 lg:grid-cols-[0.85fr_0.55fr]">
        <div className="space-y-4 rounded-[32px] border border-white/10 bg-[#071f19]/90 p-8 shadow-inner">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8ef3d6]">Realtime dashboard</p>
          <h3 className="text-3xl font-semibold text-white">Detection metrics</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-[#06170f] p-5">
              <p className="text-sm text-slate-400">Total scans</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stats.totalDetections}</p>
            </div>
            <div className="rounded-3xl bg-[#06170f] p-5">
              <p className="text-sm text-slate-400">Avg confidence</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stats.averageConfidence}%</p>
            </div>
            <div className="rounded-3xl bg-[#06170f] p-5">
              <p className="text-sm text-slate-400">Saved events</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stats.recentDetections.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#071d18]/90 p-6 shadow-inner">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#7ff8d3]">Performance trace</p>
              <h4 className="text-xl font-semibold text-white">Recent confidence</h4>
            </div>
            <span className="rounded-full bg-[#1af38f]/10 px-3 py-1 text-xs text-[#b8ffd8]">Live sync</span>
          </div>
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }} />
        </div>
      </div>
    </motion.div>
  )
}
