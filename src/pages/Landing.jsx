import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Cpu, Zap, GitFork, FlaskConical, ArrowRight,
  ChevronRight, BookOpen, BarChart2, Download
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
    items: ['PN Junction Diode', 'Zener Breakdown', 'V-I Curve (Live)', 'Virtual Multimeter'],
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
    items: ['AND / OR / NOT / NAND / NOR', 'Signal Propagation Animation', 'Auto Truth Table', 'Snapshot & Share'],
  },
  {
    icon: Cpu,
    badge: 'Computer Architecture',
    badgeClass: 'badge-amber',
    title: 'COA Visualizer',
    desc: 'Step through the Fetch-Decode-Execute cycle and watch registers flip bits in real time. Endianness toggle, flag register, and pipeline annotations.',
    color: 'amber',
    href: '/coa',
    accent: '#D97706',
    items: ['Pipeline Stepper', '8-bit Registers', 'Flag Register', 'Endianness Toggle'],
  },
]

const stats = [
  { value: '3',   label: 'Interactive Modules' },
  { value: '5+',  label: 'Core Experiments' },
  { value: '0',   label: 'Setup Required' },
  { value: '∞',   label: 'Attempts, No Hardware Needed' },
]

const differentiators = [
  { icon: Zap,      title: 'Signal Propagation',  desc: 'Watch electrical signals travel through gates in real time — not just 0 and 1.' },
  { icon: Cpu,      title: 'Bridge to CPU',        desc: 'Build a Half Adder in the sandbox, then see it live inside a CPU\'s ALU.' },
  { icon: BarChart2,title: 'Live V-I Curves',      desc: 'Every slider movement redraws the characteristic curve. Physics, not just animation.' },
  { icon: Download, title: 'Lab Report Export',    desc: 'Generate a formatted PDF lab report from your session. Submit directly.' },
  { icon: BookOpen, title: 'Curriculum Aligned',   desc: 'Experiments mapped to AKTU, VTU, and Anna University lab syllabi.' },
  { icon: GitFork,  title: 'Guided Quick Labs',    desc: '15-minute step-by-step modules for when you have limited lab time.' },
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
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-bold text-4xl text-white mb-4">Three Modules. One Platform.</h2>
          <p className="text-surface-400 text-lg max-w-xl mx-auto">
            From individual diode curves to full CPU pipeline — all in one browser tab.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link
                to={mod.href}
                className="group block h-full panel p-6 hover:border-primary-600/50
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-panel"
              >
                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${mod.accent}20`, border: `1px solid ${mod.accent}40` }}
                  >
                    <mod.icon size={22} style={{ color: mod.accent }} />
                  </div>
                  <span className={`badge ${mod.badgeClass} text-xs`}>{mod.badge}</span>
                </div>

                {/* Title + desc */}
                <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-primary-300 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-surface-400 text-sm leading-relaxed mb-5">{mod.desc}</p>

                {/* Feature list */}
                <ul className="space-y-2">
                  {mod.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-surface-300">
                      <span className="w-1 h-1 rounded-full bg-primary-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="flex items-center gap-1.5 mt-6 text-primary-400 text-sm font-medium
                                group-hover:gap-3 transition-all">
                  Open Module <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── DIFFERENTIATORS ────────────────────────────────────── */}
      <section className="bg-surface-800/30 border-t border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary-400 font-mono text-sm mb-3 tracking-widest uppercase">
              Why LogicFlow
            </p>
            <h2 className="font-display font-bold text-4xl text-white mb-4">
              Not a textbook. A workbench.
            </h2>
            <p className="text-surface-400 text-lg max-w-xl mx-auto">
              Every feature was built around one question:
              what do students actually need in a 2-hour lab session?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {differentiators.map((d, i) => (
              <motion.div
                key={d.title}
                className="panel p-5 flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary-600/15 border border-primary-600/30
                                flex items-center justify-center flex-shrink-0">
                  <d.icon size={18} className="text-primary-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm mb-1">{d.title}</p>
                  <p className="text-surface-400 text-sm leading-relaxed">{d.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRIDGE FEATURE CALLOUT ─────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
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
              and then click <em>"See This in a CPU"</em> to watch it highlighted inside the ALU.
              Digital Electronics and Computer Architecture are the same subject — we show you why.
            </p>
            <Link to="/sandbox" className="btn-primary inline-flex items-center gap-2">
              Try the Bridge Feature
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-surface-700 py-8 px-4 text-center text-surface-500 text-sm">
        <p className="mb-1">
          <span className="font-display font-semibold text-surface-300">LogicFlow</span>
          {' '}— Virtual Electronics Lab
        </p>
        <p>Built for engineering students. Semester 2 Frontend Project.</p>
      </footer>
    </div>
  )
}
