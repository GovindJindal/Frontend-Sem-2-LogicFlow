import { Link, useLocation } from 'react-router-dom'
import { Cpu, FlaskConical, GitFork, BookOpen, Menu, X, ChevronDown, Zap } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'

// ─── Lab dropdown sub-items ───────────────────────────────────────
const labItems = [
  { to: '/lab/diode', label: 'PN Junction Diode', badge: 'Exp 01', color: 'text-primary-400' },
  { to: '/lab/zener', label: 'Zener Diode',        badge: 'Exp 02', color: 'text-rose-400'    },
]

const topLinks = [
  { to: '/sandbox',    label: 'Logic Gates', icon: GitFork  },
  { to: '/coa',        label: 'COA',         icon: Cpu      },
  { to: '/curriculum', label: 'Curriculum',  icon: BookOpen },
]

// ─── Lab dropdown ────────────────────────────────────────────────
function LabDropdown({ pathname }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const isActive = pathname.startsWith('/lab')

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all',
          isActive
            ? 'bg-primary-600/20 text-primary-300 border border-primary-600/30'
            : 'text-surface-300 hover:text-white hover:bg-surface-800'
        )}
      >
        <FlaskConical size={15} />
        Experiments
        <ChevronDown size={13} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-surface-800 border border-surface-700
                        rounded-xl shadow-panel overflow-hidden z-50">
          <div className="px-3 pt-3 pb-1">
            <p className="text-xs font-mono text-surface-500 uppercase tracking-widest">Digital Electronics</p>
          </div>
          {labItems.map(({ to, label, badge, color }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-surface-700',
                pathname === to ? 'text-white bg-surface-700/60' : 'text-surface-300'
              )}
            >
              <span>{label}</span>
              <span className={cn('text-xs font-mono', color)}>{badge}</span>
            </Link>
          ))}
          <div className="px-3 py-2 border-t border-surface-700">
            <p className="text-xs text-surface-600 font-mono">More experiments coming soon…</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Nav() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
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
          <LabDropdown pathname={pathname} />
          {topLinks.map(({ to, label, icon: Icon }) => (
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

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link to="/quick-lab/half-adder" className="hidden md:block btn-secondary text-sm py-2">
            Quick Lab
          </Link>
          <button
            className="md:hidden text-surface-300 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-900/95 backdrop-blur-md border-b border-surface-700 px-4 pb-4">
          <p className="text-xs font-mono text-surface-600 pt-3 pb-1 uppercase tracking-widest">Experiments</p>
          {labItems.map(({ to, label, badge, color }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-2.5 text-surface-200 hover:text-white
                         border-b border-surface-800">
              <div className="flex items-center gap-3">
                <FlaskConical size={15} className="text-primary-400" />
                {label}
              </div>
              <span className={cn('text-xs font-mono', color)}>{badge}</span>
            </Link>
          ))}
          {topLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 py-3 text-surface-200 hover:text-white
                         border-b border-surface-800 last:border-0">
              <Icon size={16} className="text-primary-400" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
