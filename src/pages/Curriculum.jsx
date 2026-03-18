import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, CheckCircle, Circle, ChevronRight,
  FlaskConical, GitFork, Cpu, GraduationCap,
  ExternalLink, Star,
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────

const UNIVERSITIES = [
  { id: 'aktu',  label: 'AKTU',          full: 'Dr. APJ Abdul Kalam Technical University' },
  { id: 'vtu',   label: 'VTU',           full: 'Visvesvaraya Technological University' },
  { id: 'anna',  label: 'Anna Univ.',    full: 'Anna University, Chennai' },
  { id: 'mumbai',label: 'Mumbai Univ.', full: 'University of Mumbai' },
]

// Each experiment maps to curriculum topics per university
const EXPERIMENTS = [
  {
    id: 'exp01',
    title: 'PN Junction Diode',
    module: 'Digital Electronics',
    to: '/lab/diode',
    icon: FlaskConical,
    color: '#1A56DB',
    status: 'complete',
    mapTo: {
      aktu:   { paper: 'KEC-301', sem: 'III', topic: 'Unit II — Diode Theory & Applications', outcome: 'CO2' },
      vtu:    { paper: '18EC32',  sem: 'III', topic: 'Module 2 — Semiconductor Diodes',       outcome: 'CO1' },
      anna:   { paper: 'EC3251',  sem: 'III', topic: 'Unit 1 — PN Junction Characteristics',  outcome: 'CO2' },
      mumbai: { paper: 'BECOC301',sem: 'III', topic: 'Chapter 2 — Diode Characteristics',     outcome: 'CO1' },
    },
    labRecord: { aim: true, circuit: true, observations: true, conclusion: true, viva: true },
  },
  {
    id: 'exp02',
    title: 'Zener Diode & Regulation',
    module: 'Digital Electronics',
    to: '/lab/zener',
    icon: FlaskConical,
    color: '#F43F5E',
    status: 'complete',
    mapTo: {
      aktu:   { paper: 'KEC-301', sem: 'III', topic: 'Unit II — Zener Diode & Voltage Regulation', outcome: 'CO2' },
      vtu:    { paper: '18EC32',  sem: 'III', topic: 'Module 2 — Zener Regulator',                  outcome: 'CO1' },
      anna:   { paper: 'EC3251',  sem: 'III', topic: 'Unit 1 — Zener Characteristics',              outcome: 'CO2' },
      mumbai: { paper: 'BECOC301',sem: 'III', topic: 'Chapter 2 — Zener Applications',              outcome: 'CO1' },
    },
    labRecord: { aim: true, circuit: true, observations: true, conclusion: true, viva: true },
  },
  {
    id: 'exp03',
    title: 'Logic Gate Sandbox',
    module: 'Logic Design',
    to: '/sandbox',
    icon: GitFork,
    color: '#059669',
    status: 'complete',
    mapTo: {
      aktu:   { paper: 'KEC-401', sem: 'IV', topic: 'Unit I — Boolean Algebra & Logic Gates', outcome: 'CO1' },
      vtu:    { paper: '18EC33',  sem: 'III', topic: 'Module 1 — Combinational Circuits',     outcome: 'CO2' },
      anna:   { paper: 'EC3352',  sem: 'IV',  topic: 'Unit 2 — Combinational Logic',          outcome: 'CO1' },
      mumbai: { paper: 'BECOC401',sem: 'IV',  topic: 'Chapter 1 — Logic Gates',               outcome: 'CO2' },
    },
    labRecord: { aim: true, circuit: true, observations: true, conclusion: true, viva: false },
  },
  {
    id: 'exp04',
    title: 'Half Adder (Quick Lab)',
    module: 'Logic Design',
    to: '/quick-lab/half-adder',
    icon: GitFork,
    color: '#0E7490',
    status: 'complete',
    mapTo: {
      aktu:   { paper: 'KEC-401', sem: 'IV', topic: 'Unit I — Arithmetic Circuits', outcome: 'CO1' },
      vtu:    { paper: '18EC33',  sem: 'III', topic: 'Module 1 — Half Adder',        outcome: 'CO2' },
      anna:   { paper: 'EC3352',  sem: 'IV',  topic: 'Unit 2 — Arithmetic Circuits', outcome: 'CO1' },
      mumbai: { paper: 'BECOC401',sem: 'IV',  topic: 'Chapter 2 — Adders',           outcome: 'CO2' },
    },
    labRecord: { aim: true, circuit: true, observations: true, conclusion: false, viva: false },
  },
  {
    id: 'exp05',
    title: 'Instruction Pipeline',
    module: 'Computer Architecture',
    to: '/coa/pipeline',
    icon: Cpu,
    color: '#7C3AED',
    status: 'complete',
    mapTo: {
      aktu:   { paper: 'KCS-501', sem: 'V', topic: 'Unit II — Processor Organisation & Pipelining', outcome: 'CO3' },
      vtu:    { paper: '18CS42',  sem: 'IV', topic: 'Module 3 — Instruction Pipeline',              outcome: 'CO2' },
      anna:   { paper: 'CS3551',  sem: 'V',  topic: 'Unit 3 — Pipeline Processing',                 outcome: 'CO3' },
      mumbai: { paper: 'BECOCS501',sem: 'V', topic: 'Module 3 — CPU Organisation',                  outcome: 'CO3' },
    },
    labRecord: { aim: true, circuit: false, observations: true, conclusion: true, viva: false },
  },
  {
    id: 'exp03',
    title: 'Rectifier Circuits',
    module: 'Digital Electronics',
    to: '/lab/rectifier',
    icon: FlaskConical,
    color: '#F59E0B',
    status: 'complete',
    mapTo: {
      aktu:   { paper: 'KEC-301', sem: 'III', topic: 'Unit II — Rectifier Circuits & Filters',        outcome: 'CO2' },
      vtu:    { paper: '18EC32',  sem: 'III', topic: 'Module 2 — Rectifiers and Filters',             outcome: 'CO1' },
      anna:   { paper: 'EC3251',  sem: 'III', topic: 'Unit 1 — Rectifier and Clipper Circuits',       outcome: 'CO2' },
      mumbai: { paper: 'BECOC301',sem: 'III', topic: 'Chapter 3 — Rectifier and Filter Circuits',    outcome: 'CO1' },
    },
    labRecord: { aim: true, circuit: true, observations: true, conclusion: true, viva: true },
  },
  {
    id: 'exp07',
    title: 'Full Adder',
    module: 'Logic Design',
    to: '/quick-lab/full-adder',
    icon: GitFork,
    color: '#0E7490',
    status: 'complete',
    mapTo: {
      aktu:   { paper: 'KEC-401', sem: 'IV', topic: 'Unit I — Arithmetic Circuits: Full Adder',   outcome: 'CO1' },
      vtu:    { paper: '18EC33',  sem: 'III', topic: 'Module 1 — Full Adder Design',              outcome: 'CO2' },
      anna:   { paper: 'EC3352',  sem: 'IV',  topic: 'Unit 2 — Full Adder and Subtractor',        outcome: 'CO1' },
      mumbai: { paper: 'BECOC401',sem: 'IV',  topic: 'Chapter 2 — Full Adder',                    outcome: 'CO2' },
    },
    labRecord: { aim: true, circuit: true, observations: true, conclusion: true, viva: false },
  },
  {
    id: 'exp08',
    title: 'SR Flip-Flop',
    module: 'Logic Design',
    to: '/quick-lab/sr-flipflop',
    icon: GitFork,
    color: '#7C3AED',
    status: 'complete',
    mapTo: {
      aktu:   { paper: 'KEC-401', sem: 'IV', topic: 'Unit III — Sequential Circuits: SR Latch',   outcome: 'CO3' },
      vtu:    { paper: '18EC33',  sem: 'III', topic: 'Module 3 — Flip-Flops: SR Type',            outcome: 'CO3' },
      anna:   { paper: 'EC3352',  sem: 'IV',  topic: 'Unit 4 — Flip-Flops and Latches',           outcome: 'CO3' },
      mumbai: { paper: 'BECOC401',sem: 'IV',  topic: 'Chapter 4 — Sequential Logic: SR FF',       outcome: 'CO3' },
    },
    labRecord: { aim: true, circuit: true, observations: true, conclusion: true, viva: false },
  },
  {
    id: 'exp09',
    title: '2:1 Multiplexer',
    module: 'Logic Design',
    to: '/quick-lab/mux-2to1',
    icon: GitFork,
    color: '#059669',
    status: 'complete',
    mapTo: {
      aktu:   { paper: 'KEC-401', sem: 'IV', topic: 'Unit II — Combinational: Multiplexers',    outcome: 'CO2' },
      vtu:    { paper: '18EC33',  sem: 'III', topic: 'Module 2 — MUX and DEMUX',                outcome: 'CO2' },
      anna:   { paper: 'EC3352',  sem: 'IV',  topic: 'Unit 3 — Multiplexers and Decoders',      outcome: 'CO2' },
      mumbai: { paper: 'BECOC401',sem: 'IV',  topic: 'Chapter 3 — Data Selectors (MUX)',        outcome: 'CO2' },
    },
    labRecord: { aim: true, circuit: true, observations: true, conclusion: true, viva: false },
  },
]

// ─── Sub-components ───────────────────────────────────────────────

function StatusDot({ done }) {
  return done
    ? <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
    : <Circle      size={13} className="text-surface-600 flex-shrink-0" />
}

function LabRecordBadge({ parts }) {
  const done  = Object.values(parts).filter(Boolean).length
  const total = Object.keys(parts).length
  const pct   = Math.round((done / total) * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-700 rounded-full overflow-hidden" style={{ width: 60 }}>
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-mono text-surface-500">{done}/{total}</span>
    </div>
  )
}

function ExperimentRow({ exp, uni }) {
  const map = exp.mapTo[uni]
  const Icon = exp.icon

  return (
    <Link to={exp.to}>
      <motion.div
        whileHover={{ x: 4 }}
        className="flex items-start gap-4 px-4 py-3.5 rounded-xl border border-surface-700/60
                   bg-surface-800/30 hover:bg-surface-800/60 hover:border-surface-600
                   transition-all cursor-pointer group"
      >
        {/* Status + icon */}
        <div className="flex flex-col items-center gap-1 pt-0.5 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: exp.color + '20', border: `1px solid ${exp.color}40` }}>
            <Icon size={13} style={{ color: exp.color }} />
          </div>
          {exp.status === 'complete' && (
            <span className="text-[9px] font-mono text-emerald-500">✓ done</span>
          )}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-semibold text-white group-hover:text-primary-300 transition-colors">
              {exp.title}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ color: exp.color, background: exp.color + '15', border: `1px solid ${exp.color}30` }}>
              {exp.module}
            </span>
          </div>

          {map && (
            <div className="flex items-center gap-3 flex-wrap text-[11px] font-mono text-surface-500">
              <span>{map.paper}</span>
              <span className="text-surface-700">·</span>
              <span>Sem {map.sem}</span>
              <span className="text-surface-700">·</span>
              <span className="truncate max-w-xs">{map.topic}</span>
              <span className="text-surface-700">·</span>
              <span className="text-amber-500">{map.outcome}</span>
            </div>
          )}

          <div className="mt-2">
            <LabRecordBadge parts={exp.labRecord} />
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight size={14} className="text-surface-600 group-hover:text-primary-400
                                            group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
      </motion.div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────
export default function Curriculum() {
  const [activeUni, setActiveUni] = useState('aktu')

  const modules = [...new Set(EXPERIMENTS.map((e) => e.module))]
  const doneCount = EXPERIMENTS.filter((e) => e.status === 'complete').length

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 bg-surface-900 circuit-grid">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          border border-primary-600/30 bg-primary-600/10 mb-5">
            <GraduationCap size={13} className="text-primary-400" />
            <span className="text-xs font-mono text-primary-300">Curriculum Mapping</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-white mb-3">
            Course Alignment
          </h1>
          <p className="text-surface-400 text-sm max-w-2xl leading-relaxed">
            Every LogicFlow experiment maps directly to your university syllabus.
            Select your university below to see the exact paper code, semester, and course outcome each experiment covers.
          </p>

          {/* Stats */}
          <div className="flex gap-6 mt-5">
            {[
              { label: 'Experiments',    value: EXPERIMENTS.length },
              { label: 'Complete',       value: doneCount, color: 'text-emerald-400' },
              { label: 'Universities',   value: UNIVERSITIES.length },
              { label: 'Lab-record ready', value: '4 / 6', color: 'text-amber-400' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className={`font-display font-bold text-2xl ${color || 'text-white'}`}>{value}</p>
                <p className="text-xs text-surface-500 font-mono">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── University selector ─────────────────────────────────── */}
        <div className="flex gap-2 flex-wrap mb-6">
          {UNIVERSITIES.map((u) => (
            <button
              key={u.id}
              onClick={() => setActiveUni(u.id)}
              className={`px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-all border ${
                activeUni === u.id
                  ? 'bg-primary-600/20 border-primary-600/40 text-primary-300'
                  : 'bg-surface-800 border-surface-700 text-surface-400 hover:text-surface-200'
              }`}
            >
              {u.label}
            </button>
          ))}
          <div className="ml-2 flex items-center">
            <span className="text-xs text-surface-500 font-mono">
              {UNIVERSITIES.find((u) => u.id === activeUni)?.full}
            </span>
          </div>
        </div>

        {/* ── Experiments by module ───────────────────────────────── */}
        <div className="flex flex-col gap-8">
          {modules.map((mod) => {
            const exps = EXPERIMENTS.filter((e) => e.module === mod)
            return (
              <motion.div
                key={mod}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xs font-mono font-semibold text-surface-400 uppercase tracking-widest">
                    {mod}
                  </h2>
                  <div className="flex-1 h-px bg-surface-700" />
                  <span className="text-xs font-mono text-surface-600">
                    {exps.filter((e) => e.status === 'complete').length} / {exps.length} complete
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <AnimatePresence mode="wait">
                    {exps.map((exp) => (
                      <ExperimentRow key={exp.id + activeUni} exp={exp} uni={activeUni} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* ── Lab record legend ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 panel p-5"
        >
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-4">
            Lab Record Completeness
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { key: 'aim',          label: 'Aim',          icon: '🎯' },
              { key: 'circuit',      label: 'Circuit',      icon: '⚡' },
              { key: 'observations', label: 'Observations', icon: '📊' },
              { key: 'conclusion',   label: 'Conclusion',   icon: '✅' },
              { key: 'viva',         label: 'Viva Q&A',     icon: '💬' },
            ].map(({ key, label, icon }) => {
              const hasCount = EXPERIMENTS.filter((e) => e.labRecord[key]).length
              return (
                <div key={key} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                  <span className="text-lg">{icon}</span>
                  <span className="text-xs font-semibold text-surface-300">{label}</span>
                  <span className="text-xs font-mono text-surface-500">{hasCount}/{EXPERIMENTS.length} exps</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 panel p-5 border-amber-700/30 bg-amber-950/10 flex items-center justify-between gap-4 flex-wrap"
        >
          <div className="flex items-center gap-3">
            <Star size={18} className="text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">Export Lab Report PDF</p>
              <p className="text-xs text-surface-400">
                After completing a DiodeLab experiment, click "Export Lab Report" to generate a submission-ready PDF.
              </p>
            </div>
          </div>
          <Link
            to="/lab/diode"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-600/40
                       bg-amber-950/30 text-amber-300 text-sm font-mono hover:bg-amber-950/50 transition-all flex-shrink-0"
          >
            Open Lab <ChevronRight size={14} />
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
