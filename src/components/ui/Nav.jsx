import { Link, useLocation } from 'react-router-dom'
import { Cpu, FlaskConical, GitFork, BookOpen, Menu, X, ChevronDown, Zap } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'

// ─── Quick Lab dropdown ───────────────────────────────────────────
const quickLabItems = [
  { id: 'not-gate',       label: 'NOT Gate',       badge: 'A', color: '#7C3AED' },
  { id: 'half-adder',     label: 'Half Adder',     badge: 'B', color: '#059669' },
  { id: 'nand-universal', label: 'NAND Universal', badge: 'C', color: '#B45309' },
]

function QuickLabMenu({ pathname }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const isActive = pathname.startsWith('/quick-lab')

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all border',
          isActive
            ? 'bg-emerald-600/20 border-emerald-600/30 text-emerald-300'
            : 'border-emerald-700/50 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40 hover:text-emerald-300'
        )}
      >
        Quick Lab <ChevronDown size={13} className={cn('transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-52 bg-surface-800 border border-surface-700
                        rounded-xl shadow-panel overflow-hidden z-50">
          <div className="px-3 pt-3 pb-1">
            <p className="text-xs font-mono text-surface-500 uppercase tracking-widest">Guided Experiments</p>
          </div>
          {quickLabItems.map(({ id, label, badge, color }) => (
            <Link
              key={id}
              to={`/quick-lab/${id}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-surface-700 text-surface-300"
            >
              <span>{label}</span>
              <span className="text-xs font-mono font-bold" style={{ color }}>0{badge}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Lab dropdown sub-items ───────────────────────────────────────
const labItems = [
  { to: '/lab/diode', label: 'PN Junction Diode', badge: 'Exp 01', color: 'text-primary-400' },
  { to: '/lab/zener', label: 'Zener Diode',        badge: 'Exp 02', color: 'text-rose-400'    },
]

const coaItems = [
  { to: '/coa',           label: 'Overview',            badge: 'Intro',  color: 'text-primary-400' },
  { to: '/coa/pipeline',  label: 'Pipeline Stepper',    badge: 'Exp 01', color: 'text-violet-400'  },
  { to: '/coa/registers', label: 'Register Visualizer', badge: 'Exp 02', color: 'text-amber-400'   },
]

const topLinks = [
  { to: '/sandbox',    label: 'Logic Gates', icon: GitFork  },
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

// ─── COA dropdown ────────────────────────────────────────────────
function CoaDropdown({ pathname }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const isActive = pathname.startsWith('/coa')

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
        <Cpu size={15} />
        COA
        <ChevronDown size={13} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-surface-800 border border-surface-700
                        rounded-xl shadow-panel overflow-hidden z-50">
          <div className="px-3 pt-3 pb-1">
            <p className="text-xs font-mono text-surface-500 uppercase tracking-widest">Computer Architecture</p>
          </div>
          {coaItems.map(({ to, label, badge, color }) => (
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
          {topLinks.slice(0, 1).map(({ to, label, icon: Icon }) => (
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
          <CoaDropdown pathname={pathname} />
          {topLinks.slice(1).map(({ to, label, icon: Icon }) => (
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
        <div className="flex items-center gap-3 relative">
          <QuickLabMenu pathname={pathname} />
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
          <p className="text-xs font-mono text-surface-600 pt-3 pb-1 uppercase tracking-widest">Computer Architecture</p>
          {coaItems.map(({ to, label, badge, color }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-2.5 text-surface-200 hover:text-white
                         border-b border-surface-800">
              <div className="flex items-center gap-3">
                <Cpu size={15} className="text-primary-400" />
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
