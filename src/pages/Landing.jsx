import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Cpu, Zap, GitFork, FlaskConical, ArrowRight,
  ChevronRight, BookOpen, BarChart2, Download,
  GraduationCap,
} from 'lucide-react'

// ─── Animation variants ─────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const stagger = { show: { transition: { staggerChildren: 0.12 } } }

// ─── Data ───────────────────────────────────────────────────────
const modules = [
  {
    icon: FlaskConical,
    badge: 'Digital Electronics',
    badgeClass: 'badge-blue',
    title: 'Diode Lab',
    desc: 'Drag the voltage slider and watch the V-I characteristic curve plot in real time. Interactive multimeter, bias modes, and What-If temperature controls.',
    color: 'blue',
    href: '/lab/diode',
    accent: '#1A56DB',
    items: ['PN Junction Diode', 'Zener Breakdown', 'V-I Curve (Live)', 'PDF Lab Report'],
  },
  {
    icon: GitFork,
    badge: 'Logic Design',
    badgeClass: 'badge-green',
    title: 'Gate Sandbox',
    desc: 'Drag gates onto a canvas, wire them together, and watch signals pulse through your circuit with colour-coded propagation animation.',
    color: 'green',
    href: '/sandbox',
    accent: '#059669',
    items: ['AND / OR / NOT / NAND / NOR / XOR', 'Signal Propagation Animation', 'Auto Truth Table', 'Snapshot & Share URL'],
  },
  {
    icon: Cpu,
    badge: 'Computer Architecture',
    badgeClass: 'badge-amber',
    title: 'COA Visualizer',
    desc: 'Step through the Fetch-Decode-Execute cycle and watch registers flip bits in real time. See how the Half Adder you built lives inside the ALU.',
    color: 'amber',
    href: '/coa',
    accent: '#D97706',
    items: ['Pipeline Stepper', '8-bit Register Bank', 'Flag Register', 'Bridge: Gates → ALU'],
  },
]

const stats = [
  { value: '3',   label: 'Interactive Modules' },
  { value: '9',   label: 'Core Experiments' },
  { value: '4',   label: 'Universities Mapped' },
  { value: '0',   label: 'Setup Required' },
]

const differentiators = [
  { icon: Zap,          title: 'Signal Propagation',  desc: 'Watch electrical signals travel through gates in real time — not just 0 and 1.' },
  { icon: Cpu,          title: 'Bridge to CPU',        desc: 'Build a Half Adder in the sandbox, then see it live inside the CPU\'s ALU execute stage.' },
  { icon: BarChart2,    title: 'Live V-I Curves',      desc: 'Every slider movement redraws the characteristic curve using the real Shockley equation.' },
  { icon: Download,     title: 'Lab Report Export',    desc: 'Generate a formatted PDF lab report from your session with graph, table, and sign-off. Submit directly.' },
  { icon: GraduationCap,title: 'Curriculum Aligned',  desc: 'All 6 experiments mapped to AKTU, VTU, Anna University, and Mumbai University syllabi.' },
  { icon: GitFork,      title: 'Guided Quick Labs',    desc: '15-minute step-by-step modules with hints, checks, and theory panels built in.' },
]

const quickLabs = [
  { id: 'not-gate',       title: 'NOT Gate',         subtitle: 'Signal Inversion',    color: '#7C3AED', time: '5 min'  },
  { id: 'half-adder',     title: 'Half Adder',       subtitle: '1-bit Binary Adder',  color: '#059669', time: '10 min' },
  { id: 'nand-universal', title: 'NAND Universal',   subtitle: 'Universal Gate Proof', color: '#B45309', time: '8 min'  },
  { id: 'full-adder',     title: 'Full Adder',       subtitle: '3-input Adder + Cin', color: '#0E7490', time: '12 min' },
  { id: 'sr-flipflop',    title: 'SR Flip-Flop',     subtitle: 'Memory & Latching',   color: '#7C3AED', time: '10 min' },
  { id: 'mux-2to1',       title: '2:1 Multiplexer',  subtitle: 'Data Selector',       color: '#059669', time: '8 min'  },
]

// ─── Floating circuit node decoration ───────────────────────────
function CircuitDot({ x, y, delay = 0 }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full bg-primary-500/40"
      style={{ left: x, top: y }}
      animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.4, 1] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

// ─── Module card ─────────────────────────────────────────────────
function ModuleCard({ mod }) {
  const Icon = mod.icon
  return (
    <motion.div variants={fadeUp}>
      <Link to={mod.href} className="group block h-full">
        <div className="panel h-full p-6 hover:border-surface-500 transition-all duration-300
                        hover:-translate-y-1 hover:shadow-panel flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: mod.accent + '20', border: `1px solid ${mod.accent}40` }}>
                <Icon size={18} style={{ color: mod.accent }} />
              </div>
              <span className={`badge ${mod.badgeClass} text-xs`}>{mod.badge}</span>
            </div>
            <ArrowRight size={16} className="text-surface-600 group-hover:text-surface-300
                                             group-hover:translate-x-1 transition-all" />
          </div>

          {/* Title + desc */}
          <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-primary-300
                         transition-colors">{mod.title}</h3>
          <p className="text-surface-400 text-sm leading-relaxed mb-5 flex-1">{mod.desc}</p>

          {/* Feature list */}
          <ul className="space-y-1.5 border-t border-surface-700 pt-4">
            {mod.items.map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-surface-500 font-mono">
                <span style={{ color: mod.accent }}>→</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Main component ─────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen bg-surface-900 overflow-x-hidden">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center circuit-grid px-4 pt-16">

        {/* Background glow blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full
                          bg-primary-600/8 blur-[120px]" />
          <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full
                          bg-emerald-600/6 blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full
                          bg-amber-600/5 blur-[80px]" />
        </div>

        {/* Floating dots */}
        <CircuitDot x="8%"  y="20%" delay={0} />
        <CircuitDot x="15%" y="60%" delay={0.8} />
        <CircuitDot x="82%" y="15%" delay={0.4} />
        <CircuitDot x="90%" y="55%" delay={1.2} />
        <CircuitDot x="50%" y="85%" delay={0.6} />

        {/* Content */}
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="badge badge-blue text-xs uppercase tracking-widest font-semibold py-1.5 px-4">
              ⚡ Virtual Engineering Lab
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl
                       leading-[1.05] tracking-tight mb-6"
          >
            <span className="text-white">The lab that</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r
                             from-primary-400 via-primary-300 to-sky-400">
              never runs out
            </span>
            <br />
            <span className="text-white">of equipment.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={fadeUp}
            className="text-surface-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Interactive simulations for Digital Electronics and Computer Architecture.
            No trainer kits needed — just open the browser and experiment.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/lab/diode" className="btn-primary flex items-center justify-center gap-2 text-base">
              Start Experimenting
              <ArrowRight size={18} />
            </Link>
            <Link to="/quick-lab/half-adder" className="btn-secondary flex items-center justify-center gap-2 text-base">
              Try a Quick Lab
              <ChevronRight size={16} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-px h-12 bg-gradient-to-b from-primary-500/60 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────── */}
      <section className="border-y border-surface-700 bg-surface-800/40">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-display font-bold text-3xl text-primary-400 mb-1">{value}</p>
              <p className="text-surface-400 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODULES ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-mono text-primary-400 uppercase tracking-widest mb-3">What's inside</p>
          <h2 className="font-display font-bold text-4xl text-white mb-4">Three modules. One platform.</h2>
          <p className="text-surface-400 max-w-xl mx-auto">
            Each module covers a full chapter of your curriculum — with interactive experiments,
            real physics, and a PDF you can submit as a lab record.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {modules.map((mod) => <ModuleCard key={mod.title} mod={mod} />)}
        </motion.div>
      </section>

      {/* ── QUICK LABS STRIP ───────────────────────────────────── */}
      <section className="border-y border-surface-700 bg-surface-800/30 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-xs font-mono text-primary-400 uppercase tracking-widest mb-2">Guided experiments</p>
              <h2 className="font-display font-bold text-3xl text-white">Quick Labs</h2>
              <p className="text-surface-400 text-sm mt-1">Structured walkthroughs with auto-verification. Perfect before exams.</p>
            </div>
            <Link to="/sandbox"
              className="flex items-center gap-2 text-sm font-mono text-surface-400 hover:text-primary-400 transition-colors">
              Open Free Sandbox <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLabs.map((lab, i) => (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <Link to={`/quick-lab/${lab.id}`}
                  className="group flex flex-col gap-3 p-5 panel hover:border-surface-500
                             hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold"
                      style={{ background: lab.color + '20', color: lab.color, border: `1px solid ${lab.color}40` }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <span className="text-[10px] font-mono text-surface-600 bg-surface-800 px-2 py-0.5 rounded-full border border-surface-700">
                      {lab.time}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm group-hover:text-primary-300 transition-colors">
                      {lab.title}
                    </p>
                    <p className="text-xs text-surface-500 mt-0.5">{lab.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono mt-auto"
                    style={{ color: lab.color }}>
                    Start <ArrowRight size={11} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATORS ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-mono text-primary-400 uppercase tracking-widest mb-3">Why LogicFlow</p>
          <h2 className="font-display font-bold text-4xl text-white">Built different.</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {differentiators.map((d, i) => {
            const Icon = d.icon
            return (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="panel p-5 flex gap-4"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                                bg-primary-600/15 border border-primary-600/25">
                  <Icon size={16} className="text-primary-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm mb-1">{d.title}</p>
                  <p className="text-surface-400 text-sm leading-relaxed">{d.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── BRIDGE FEATURE CALLOUT ─────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="panel p-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/8 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary-900/50 border border-primary-700/50">
                <GitFork size={14} className="text-primary-400" />
                <span className="text-primary-300 text-xs font-mono">Half Adder</span>
                <ArrowRight size={12} className="text-surface-500" />
                <Cpu size={14} className="text-amber-400" />
                <span className="text-amber-300 text-xs font-mono">ALU inside CPU</span>
              </div>
            </div>
            <h2 className="font-display font-bold text-3xl text-white mb-4">
              Build a circuit. See it inside a CPU.
            </h2>
            <p className="text-surface-300 text-base leading-relaxed max-w-2xl mx-auto mb-8">
              LogicFlow is the only simulator that lets you build a Half Adder in the Logic Sandbox
              and then watch it highlighted inside the ALU during the CPU's Execute stage.
              Digital Electronics and Computer Architecture are the same subject — we show you why.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/sandbox" className="btn-primary inline-flex items-center gap-2">
                Try the Bridge Feature
                <ArrowRight size={16} />
              </Link>
              <Link to="/coa/pipeline" className="btn-secondary inline-flex items-center gap-2">
                See the Pipeline
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CURRICULUM CTA ─────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between gap-6 panel p-6 border-amber-700/30 bg-amber-950/10 flex-wrap"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-950/40 border border-amber-700/40">
              <GraduationCap size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-white mb-0.5">Mapped to your syllabus</p>
              <p className="text-sm text-surface-400">
                AKTU · VTU · Anna University · Mumbai University — see the exact paper code and CO for each experiment.
              </p>
            </div>
          </div>
          <Link to="/curriculum"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-amber-600/40
                       bg-amber-950/30 text-amber-300 text-sm font-mono hover:bg-amber-950/50 transition-all flex-shrink-0">
            View Curriculum <ChevronRight size={14} />
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-surface-700 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-display font-semibold text-surface-300 mb-0.5">LogicFlow</p>
            <p className="text-surface-500 text-sm">Virtual Electronics & Computer Architecture Lab</p>
          </div>
          <div className="flex items-center gap-4 text-sm font-mono text-surface-500">
            <Link to="/lab/diode"  className="hover:text-primary-400 transition-colors">Diode Lab</Link>
            <Link to="/sandbox"    className="hover:text-primary-400 transition-colors">Sandbox</Link>
            <Link to="/coa"        className="hover:text-primary-400 transition-colors">COA</Link>
            <Link to="/curriculum" className="hover:text-primary-400 transition-colors">Curriculum</Link>
          </div>
          <p className="text-surface-600 text-xs font-mono">Semester 2 · Front-End Project</p>
        </div>
      </footer>
    </div>
  )
}
