import { Link, useLocation } from 'react-router-dom'
import { Cpu, FlaskConical, GitFork, BookOpen, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../utils/cn'

const links = [
  { to: '/lab/diode',    label: 'Diode Lab',   icon: FlaskConical },
  { to: '/sandbox',      label: 'Logic Gates', icon: GitFork },
  { to: '/coa',          label: 'COA',         icon: Cpu },
  { to: '/curriculum',   label: 'Curriculum',  icon: BookOpen },
]

export default function Nav() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const isHome = pathname === '/'

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isHome
        ? 'bg-transparent'
        : 'bg-surface-900/90 backdrop-blur-md border-b border-surface-700'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center
                          shadow-glow-blue group-hover:shadow-glow-blue transition-all">
            <Cpu size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">
            Logic<span className="text-primary-400">Flow</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all',
                pathname.startsWith(to)
                  ? 'bg-primary-600/20 text-primary-300 border border-primary-600/30'
                  : 'text-surface-300 hover:text-white hover:bg-surface-800'
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link to="/quick-lab/half-adder" className="hidden md:block btn-secondary text-sm py-2">
            Quick Lab
          </Link>
          <button
            className="md:hidden text-surface-300 hover:text-white p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface-900/95 backdrop-blur-md border-b border-surface-700 px-4 pb-4">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 py-3 text-surface-200 hover:text-white border-b border-surface-800 last:border-0"
            >
              <Icon size={16} className="text-primary-400" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
