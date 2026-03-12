import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause, Database } from 'lucide-react'
import { useCoaStore, STAGES } from '../store/coaStore'

// ─── Helpers ─────────────────────────────────────────────────────
const toBin  = (n) => (n >>> 0).toString(2).padStart(8, '0')
const toHex  = (n) => '0x' + n.toString(16).toUpperCase().padStart(2, '0')
const toDec  = (n) => n.toString()

// ─── Bit tile ─────────────────────────────────────────────────────
function BitTile({ bit, index, changed }) {
  const isSet = bit === '1'
  return (
    <motion.div
      key={`${bit}-${changed}`}
      initial={changed ? { scale: 1.3, background: '#F59E0B30' } : {}}
      animate={{ scale: 1, background: isSet ? 'rgba(34,197,94,0.2)' : 'rgba(51,65,85,0.4)' }}
      transition={{ duration: 0.3 }}
      className="w-8 h-8 flex flex-col items-center justify-center rounded text-center"
      style={{ border: `1px solid ${isSet ? '#22C55E40' : '#334155'}` }}
    >
      <span className={`text-sm font-mono font-bold leading-none ${isSet ? 'text-emerald-400' : 'text-surface-600'}`}>
        {bit}
      </span>
      <span className="text-[8px] font-mono text-surface-700 leading-none mt-0.5">{7 - index}</span>
    </motion.div>
  )
}

// ─── Full register card ───────────────────────────────────────────
const REG_META = {
  pc:  { abbr: 'PC',  full: 'Program Counter',         color: '#1A56DB', desc: 'Points to the next instruction address in memory. Increments after each WriteBack stage.' },
  ir:  { abbr: 'IR',  full: 'Instruction Register',    color: '#7C3AED', desc: 'Holds the current instruction being executed. Loaded during Fetch from memory via MDR.' },
  mar: { abbr: 'MAR', full: 'Memory Address Register', color: '#0E7490', desc: 'Holds the memory address to be accessed. Set by Control Unit, used by memory bus.' },
  mdr: { abbr: 'MDR', full: 'Memory Data Register',    color: '#059669', desc: 'Buffer between CPU and memory. Holds data read from or to be written to memory.' },
  acc: { abbr: 'ACC', full: 'Accumulator',             color: '#F59E0B', desc: 'Primary working register. ALU operations read from and write results to the ACC.' },
}

function RegisterCard({ name, value, prevValue, isActive }) {
  const meta    = REG_META[name]
  const bin     = toBin(value)
  const prevBin = toBin(prevValue)
  const changed = value !== prevValue

  return (
    <motion.div
      layout
      animate={{
        borderColor: isActive ? meta.color + '60' : '#334155',
        background:  isActive ? meta.color + '08'  : 'rgba(30,41,59,0.4)',
      }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-mono text-sm font-bold"
            style={{ background: meta.color + '20', color: meta.color, border: `1px solid ${meta.color}40` }}>
            {meta.abbr}
          </div>
          <div>
            <p className="text-xs font-semibold text-surface-300">{meta.full}</p>
            <p className="text-[10px] text-surface-600 font-mono mt-0.5">{meta.desc.slice(0, 60)}…</p>
          </div>
        </div>
        {changed && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-mono text-amber-400 bg-amber-950/30 border border-amber-800/40
                       px-2 py-0.5 rounded-full flex-shrink-0"
          >
            updated
          </motion.span>
        )}
      </div>

      {/* Bit display */}
      <div className="flex gap-1 mb-3">
        {bin.split('').map((bit, i) => (
          <BitTile key={i} bit={bit} index={i} changed={changed && bit !== prevBin[i]} />
        ))}
      </div>

      {/* Numeric representations */}
      <div className="flex gap-4 text-xs font-mono mt-1">
        <span className="text-surface-500">HEX</span>
        <span className="font-bold" style={{ color: meta.color }}>{toHex(value)}</span>
        <span className="text-surface-500">DEC</span>
        <span className="text-surface-300 font-bold">{toDec(value)}</span>
        <span className="text-surface-500">BIN</span>
        <span className="text-surface-400">{bin.slice(0, 4)} {bin.slice(4)}</span>
      </div>
    </motion.div>
  )
}

// ─── Change log ───────────────────────────────────────────────────
function ChangeLog({ entries }) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-surface-600 text-xs font-mono gap-1">
        <Database size={16} />
        <p>No changes yet — step the pipeline</p>
      </div>
    )
  }
  return (
    <div className="space-y-1 overflow-y-auto max-h-64 custom-scroll">
      {[...entries].reverse().map((e, i) => (
        <div key={i} className="flex items-center gap-2 text-xs font-mono px-2 py-1.5
                                 border-b border-surface-800/60 last:border-0">
          <span className="text-surface-600 w-16 flex-shrink-0">{e.stage}</span>
          <span style={{ color: REG_META[e.reg]?.color || '#94A3B8' }}
            className="w-10 font-bold flex-shrink-0">{REG_META[e.reg]?.abbr || e.reg}</span>
          <span className="text-rose-400">{toHex(e.from)}</span>
          <span className="text-surface-600">→</span>
          <span className="text-emerald-400">{toHex(e.to)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────
export default function CoaRegisters() {
  const {
    currentStage, currentInstruction,
    pc, ir, mar, mdr, acc, flags,
    isComplete, nextStage, resetPipeline,
  } = useCoaStore()

  const registers = { pc, ir, mar, mdr, acc }
  const prevRegs  = useRef({ pc, ir, mar, mdr, acc })
  const [prevSnap, setPrevSnap] = useState({ pc, ir, mar, mdr, acc })
  const [log,      setLog]      = useState([])

  // Record changes
  useEffect(() => {
    const changes = Object.keys(registers).filter((k) => registers[k] !== prevRegs.current[k])
    if (changes.length > 0) {
      const stage = STAGES[currentStage] || 'WriteBack'
      setLog((prev) => [
        ...prev,
        ...changes.map((reg) => ({
          stage, reg,
          from: prevRegs.current[reg],
          to:   registers[reg],
        })),
      ])
    }
    setPrevSnap({ ...prevRegs.current })
    prevRegs.current = { ...registers }
  }, [pc, ir, mar, mdr, acc])

  // Active registers for current stage
  const stageName  = STAGES[currentStage] || 'WriteBack'
  const activeRegs = !isComplete
    ? (stageName === 'Fetch'     ? ['pc', 'mar', 'mdr', 'ir'] :
       stageName === 'Decode'    ? ['ir', 'mar'] :
       stageName === 'Execute'   ? ['acc', 'mdr'] :
                                   ['pc', 'acc'])
    : []

  // Auto-play
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef(null)
  useEffect(() => {
    if (playing && !isComplete) {
      timerRef.current = setInterval(nextStage, 1400)
    } else {
      clearInterval(timerRef.current)
      if (isComplete) setPlaying(false)
    }
    return () => clearInterval(timerRef.current)
  }, [playing, isComplete, nextStage])

  const handleReset = () => {
    resetPipeline()
    setLog([])
    setPlaying(false)
    setPrevSnap({ pc: 0, ir: 0, mar: 0, mdr: 0, acc: 0 })
    prevRegs.current = { pc: 0, ir: 0, mar: 0, mdr: 0, acc: 0 }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 bg-surface-900 circuit-grid">
      <div className="max-w-6xl mx-auto flex flex-col gap-5">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-3 text-xs font-mono">
            <Link to="/coa" className="text-surface-500 hover:text-primary-400 transition-colors">COA</Link>
            <ChevronRight size={12} className="text-surface-700" />
            <span className="badge badge-blue">Exp 02</span>
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-bold text-3xl text-white mb-1">Register Visualizer</h1>
              <p className="text-surface-400 text-sm">
                Watch all CPU registers at the bit level. Highlighted registers are active in the current pipeline stage.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPlaying((v) => !v)}
                disabled={isComplete}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-mono transition-all disabled:opacity-40 ${
                  playing
                    ? 'bg-amber-950/30 border-amber-700/40 text-amber-300'
                    : 'bg-primary-600/20 border-primary-600/40 text-primary-300 hover:bg-primary-600/30'
                }`}
              >
                {playing ? <Pause size={14} /> : <Play size={14} />}
                {playing ? 'Pause' : 'Auto-play'}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-700
                           bg-surface-800 text-surface-400 hover:text-surface-200 text-sm font-mono transition-all"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Current state strip ────────────────────────────── */}
        <div className="panel p-3 flex items-center justify-between gap-3 flex-wrap text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="text-surface-500">Stage</span>
            <span className="font-bold text-primary-300">
              {isComplete ? 'COMPLETE' : stageName.toUpperCase()}
            </span>
            <span className="text-surface-500">Instruction</span>
            <span className="font-bold text-amber-300">
              {Math.min(currentInstruction + 1, 5)} / 5
            </span>
          </div>
          <div className="flex gap-2 items-center">
            {!isComplete && (
              <>
                <span className="text-surface-500">Active:</span>
                {activeRegs.map((r) => (
                  <span key={r} className="font-bold px-2 py-0.5 rounded"
                    style={{ color: REG_META[r]?.color, background: REG_META[r]?.color + '15' }}>
                    {REG_META[r]?.abbr}
                  </span>
                ))}
              </>
            )}
            {isComplete && <span className="text-emerald-400 font-bold">✓ All instructions executed</span>}
          </div>
          <button
            onClick={nextStage}
            disabled={isComplete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono
                       transition-all disabled:opacity-40"
            style={{
              borderColor: '#1A56DB50',
              background:  '#1A56DB15',
              color:       '#60A5FA',
            }}
          >
            Next Stage <ChevronRight size={12} />
          </button>
        </div>

        {/* ── Register grid ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(registers).map((name) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Object.keys(registers).indexOf(name) * 0.07 }}
            >
              <RegisterCard
                name={name}
                value={registers[name]}
                prevValue={prevSnap[name]}
                isActive={activeRegs.includes(name)}
              />
            </motion.div>
          ))}

          {/* Flag register card */}
          <div className="panel p-5 rounded-xl border border-surface-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-mono text-sm font-bold
                              bg-rose-950/30 border border-rose-800/30 text-rose-400">FR</div>
              <div>
                <p className="text-xs font-semibold text-surface-300">Flag Register</p>
                <p className="text-[10px] text-surface-600 font-mono">Status bits set by ALU operations</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(flags).map(([name, active]) => (
                <motion.div
                  key={name}
                  animate={{
                    background: active ? 'rgba(34,197,94,0.12)' : 'rgba(51,65,85,0.3)',
                    borderColor: active ? '#22C55E40' : '#334155',
                  }}
                  className="rounded-lg border px-3 py-2 text-center"
                >
                  <p className={`text-xs font-mono font-bold ${active ? 'text-emerald-400' : 'text-surface-600'}`}>
                    {name.toUpperCase()}
                  </p>
                  <p className={`text-lg font-mono font-bold leading-none mt-0.5 ${active ? 'text-emerald-400' : 'text-surface-700'}`}>
                    {active ? '1' : '0'}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Change log ─────────────────────────────────────── */}
        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Database size={14} className="text-primary-400" />
            <span className="text-xs font-semibold text-surface-400 uppercase tracking-widest">
              Register Change Log
            </span>
            <span className="ml-auto text-[10px] font-mono text-surface-600">
              {log.length} change{log.length !== 1 ? 's' : ''}
            </span>
            {log.length > 0 && (
              <button
                onClick={() => setLog([])}
                className="text-[10px] font-mono text-surface-600 hover:text-surface-400 transition-colors"
              >
                clear
              </button>
            )}
          </div>
          <ChangeLog entries={log} />
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Link
            to="/coa/pipeline"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-surface-700
                       bg-surface-800 text-surface-400 hover:text-surface-200 text-sm font-mono transition-all"
          >
            <ChevronLeft size={14} /> Pipeline Stepper
          </Link>
          <Link
            to="/coa"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-surface-700
                       bg-surface-800 text-surface-400 hover:text-surface-200 text-sm font-mono transition-all"
          >
            ← COA Overview
          </Link>
        </div>

      </div>
    </div>
  )
}
