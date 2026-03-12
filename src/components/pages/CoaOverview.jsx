import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Cpu, GitMerge, Database, Zap,
  ChevronRight, BookOpen, ArrowRight,
} from 'lucide-react'

// ─── Concept card ────────────────────────────────────────────────
function ConceptCard({ icon: Icon, title, text, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.4 }}
      className="panel p-5 flex flex-col gap-3"
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: color + '20', border: `1px solid ${color}40` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <h3 className="font-semibold text-sm text-white mb-1">{title}</h3>
        <p className="text-xs text-surface-400 leading-relaxed">{text}</p>
      </div>
    </motion.div>
  )
}

// ─── Experiment card ─────────────────────────────────────────────
function ExperimentCard({ to, badge, title, desc, color, items, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay }}
    >
      <Link to={to} className="group block panel p-6 hover:border-surface-500 transition-all
                               hover:-translate-y-1 hover:shadow-panel">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md"
            style={{ background: color + '20', color, border: `1px solid ${color}40` }}>
            {badge}
          </span>
          <ArrowRight size={16} className="text-surface-600 group-hover:text-surface-300
                                           group-hover:translate-x-1 transition-all" />
        </div>
        <h3 className="font-display font-bold text-lg text-white mb-2">{title}</h3>
        <p className="text-sm text-surface-400 mb-4">{desc}</p>
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-surface-500 font-mono">
              <span style={{ color }}>→</span> {item}
            </li>
          ))}
        </ul>
      </Link>
    </motion.div>
  )
}

export default function CoaOverview() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 bg-surface-900 circuit-grid">
      <div className="max-w-5xl mx-auto">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          border border-primary-600/30 bg-primary-600/10 mb-5">
            <Cpu size={13} className="text-primary-400" />
            <span className="text-xs font-mono text-primary-300">Module 3 — Computer Architecture</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4 leading-tight">
            How a CPU<br />
            <span className="text-primary-400">Actually Works</span>
          </h1>

          <p className="text-surface-400 text-base max-w-2xl mx-auto leading-relaxed">
            Trace a single instruction from memory fetch to writeback.
            Watch registers change in real time, see the pipeline fill up,
            and connect the logic gates you just built to the silicon inside a CPU.
          </p>
        </motion.div>

        {/* ── Key concepts ─────────────────────────────────────── */}
        <div className="mb-12">
          <h2 className="text-xs font-mono font-semibold text-surface-500 uppercase tracking-widest mb-5">
            Concepts Covered
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Zap,       color: '#1A56DB', title: 'Instruction Cycle',   text: 'Fetch → Decode → Execute → WriteBack — the heartbeat of every CPU.' },
              { icon: Database,  color: '#7C3AED', title: 'Registers',           text: 'PC, IR, MAR, MDR, ACC — where the CPU stores its immediate work.' },
              { icon: GitMerge,  color: '#059669', title: 'Pipeline',            text: 'Overlap instruction stages to increase throughput (IPC).' },
              { icon: BookOpen,  color: '#F59E0B', title: 'Von Neumann Model',   text: 'Stored-program model: data and instructions share the same memory bus.' },
            ].map((c) => (
              <ConceptCard key={c.title} {...c} />
            ))}
          </div>
        </div>

        {/* ── Experiment cards ──────────────────────────────────── */}
        <div className="mb-12">
          <h2 className="text-xs font-mono font-semibold text-surface-500 uppercase tracking-widest mb-5">
            Experiments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ExperimentCard
              to="/coa/pipeline" delay={0.1}
              badge="Exp 01" color="#1A56DB"
              title="Pipeline Stepper"
              desc="Step through a 5-instruction program one clock cycle at a time. Watch the fetch-decode-execute loop and see how registers update at each stage."
              items={[
                'Fetch: PC → MAR → MDR → IR',
                'Decode: IR parsed, operand resolved',
                'Execute: ALU operates, ACC updated',
                'WriteBack: result stored, PC advances',
              ]}
            />
            <ExperimentCard
              to="/coa/registers" delay={0.2}
              badge="Exp 02" color="#7C3AED"
              title="Register Visualizer"
              desc="Inspect all CPU registers at the bit level. See binary and hex representations update live. Observe flag register transitions during arithmetic."
              items={[
                '8-bit register bank with binary view',
                'Zero / Carry / Overflow / Sign flags',
                'Highlight which bits flip on each operation',
                'Register change history log',
              ]}
            />
          </div>
        </div>

        {/* ── Von Neumann diagram (SVG inline) ─────────────────── */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="panel p-6 mb-12"
        >
          <h2 className="text-xs font-mono font-semibold text-surface-500 uppercase tracking-widest mb-5">
            Von Neumann Architecture
          </h2>

          <svg viewBox="0 0 720 180" className="w-full" style={{ maxHeight: 160 }}>
            {/* Components */}
            {[
              { x: 20,  w: 120, label: 'Input',   sub: 'Keyboard / Sensors', c: '#64748B' },
              { x: 190, w: 140, label: 'CPU',      sub: 'ALU + Control Unit', c: '#1A56DB' },
              { x: 380, w: 140, label: 'Memory',   sub: 'RAM (data + code)',  c: '#7C3AED' },
              { x: 570, w: 130, label: 'Output',   sub: 'Display / Actuator', c: '#059669' },
            ].map(({ x, w, label, sub, c }) => (
              <g key={label}>
                <rect x={x} y={50} width={w} height={80} rx={8}
                  fill={c + '12'} stroke={c + '60'} strokeWidth={1.5} />
                <text x={x + w / 2} y={88} textAnchor="middle"
                  fontSize={13} fontWeight={700} fill={c} fontFamily="Syne">
                  {label}
                </text>
                <text x={x + w / 2} y={106} textAnchor="middle"
                  fontSize={9} fill="#64748B" fontFamily="JetBrains Mono">
                  {sub}
                </text>
              </g>
            ))}

            {/* Arrows */}
            {[
              { x1: 140, x2: 190, color: '#64748B' },
              { x1: 330, x2: 380, color: '#1A56DB', label: 'Bus' },
              { x1: 520, x2: 570, color: '#7C3AED' },
            ].map(({ x1, x2, color, label }, i) => (
              <g key={i}>
                <line x1={x1} y1={90} x2={x2 - 8} y2={90}
                  stroke={color} strokeWidth={1.5} markerEnd={`url(#arr${i})`} />
                <line x1={x2 - 8} y1={90} x2={x1 + 8} y2={90}
                  stroke={color} strokeWidth={1.5} markerEnd={`url(#arr${i}b)`}
                  strokeDasharray="4 2" opacity={0.5} />
                {label && (
                  <text x={(x1 + x2) / 2} y={82} textAnchor="middle"
                    fontSize={8} fill={color} fontFamily="JetBrains Mono">{label}</text>
                )}
                <defs>
                  <marker id={`arr${i}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill={color} />
                  </marker>
                  <marker id={`arr${i}b`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill={color} opacity={0.5} />
                  </marker>
                </defs>
              </g>
            ))}

            {/* Registers callout on CPU */}
            {['PC', 'IR', 'ACC'].map((r, i) => (
              <text key={r} x={260} y={55 + i * 12} fontSize={8}
                fill="#1A56DB" fontFamily="JetBrains Mono" opacity={0.6}>{r}</text>
            ))}
          </svg>
        </motion.div>

        {/* ── Bridge callout ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4 }}
          className="panel p-5 border-amber-700/30 bg-amber-950/10 flex items-center justify-between gap-4 flex-wrap"
        >
          <div className="flex items-start gap-3">
            <GitMerge size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white mb-1">See the Bridge</p>
              <p className="text-xs text-surface-400">
                The Half Adder you built in Logic Sandbox lives inside every CPU's ALU.
                The pipeline stepper shows exactly where it executes.
              </p>
            </div>
          </div>
          <Link to="/coa/pipeline"
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                       border border-amber-600/40 bg-amber-950/30 text-amber-300
                       text-sm font-mono hover:bg-amber-950/50 transition-all flex-shrink-0">
            Open Pipeline <ChevronRight size={14} />
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
