import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, GitFork, FlaskConical, Cpu } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-900 circuit-grid flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Glitchy 404 */}
        <div className="relative mb-6">
          <p className="font-display font-bold text-8xl text-surface-800 select-none">404</p>
          <p className="font-display font-bold text-8xl text-primary-500/20 absolute inset-0
                         translate-x-1 translate-y-0.5 select-none">404</p>
          <p className="font-mono text-primary-400 text-sm absolute bottom-2 left-1/2 -translate-x-1/2
                         whitespace-nowrap">signal not found</p>
        </div>

        <h1 className="font-display font-bold text-2xl text-white mb-2">
          Wrong address
        </h1>
        <p className="text-surface-400 text-sm mb-8">
          This route doesn't exist. Head back and pick an experiment.
        </p>

        {/* Quick links */}
        <div className="flex flex-col gap-2 max-w-xs mx-auto">
          <Link to="/"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                       bg-primary-600/20 border border-primary-600/40 text-primary-300
                       font-mono text-sm hover:bg-primary-600/30 transition-all">
            <Home size={14} /> Home
          </Link>
          <div className="grid grid-cols-3 gap-2">
            {[
              { to: '/lab/diode', icon: FlaskConical, label: 'Diode Lab' },
              { to: '/sandbox',   icon: GitFork,      label: 'Sandbox'   },
              { to: '/coa',       icon: Cpu,           label: 'COA'       },
            ].map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to}
                className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl
                           border border-surface-700 bg-surface-800 text-surface-400
                           hover:text-surface-200 hover:border-surface-600
                           font-mono text-xs transition-all">
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
