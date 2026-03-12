import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, RotateCcw,
  Play, Pause, Cpu, Database, Zap, GitMerge,
} from 'lucide-react'
import { useCoaStore, STAGES } from '../store/coaStore'

// ─── Stage metadata ───────────────────────────────────────────────
const STAGE_META = {
  Fetch: {
    color: '#1A56DB',
    icon: '①',
    shortDesc: 'PC → MAR → MDR → IR',
    detail: 'The Program Counter (PC) sends the next instruction address to the Memory Address Register (MAR). Memory outputs the instruction word into the Memory Data Register (MDR). The Instruction Register (IR) latches the opcode.',
    registers: ['pc', 'mar', 'mdr', 'ir'],
  },
  Decode: {
    color: '#7C3AED',
    icon: '②',
    shortDesc: 'IR parsed by Control Unit',
    detail: 'The Control Unit decodes the opcode in IR. It identifies the operation type (LOAD/ADD/STORE/JUMP/HALT), extracts the operand address, and sends control signals to the appropriate units.',
    registers: ['ir', 'mar'],
  },
  Execute: {
    color: '#059669',
    icon: '③',
    shortDesc: 'ALU operates on operand',
    detail: 'The Arithmetic Logic Unit (ALU) performs the operation. For arithmetic instructions, Accumulator (ACC) is updated. For JUMP, the Zero flag is tested. For STORE, data is prepared for writeback.',
    registers: ['acc', 'mdr'],
  },
  WriteBack: {
    color: '#F59E0B',
    icon: '④',
    shortDesc: 'Result stored, PC advances',
    detail: 'The result is written to the destination register or memory. The Program Counter (PC) is incremented to point to the next instruction, ready for the next Fetch stage.',
    registers: ['pc', 'acc'],
  },
}

// ─── Register display helpers ─────────────────────────────────────
const toBin = (n) => (n >>> 0).toString(2).padStart(8, '0')
const toHex = (n) => '0x' + n.toString(16).toUpperCase().padStart(2, '0')

const REGISTER_LABELS = {
  pc:  { full: 'Program Counter',          abbr: 'PC'  },
  ir:  { full: 'Instruction Register',     abbr: 'IR'  },
  mar: { full: 'Memory Address Register',  abbr: 'MAR' },
  mdr: { full: 'Memory Data Register',     abbr: 'MDR' },
  acc: { full: 'Accumulator',              abbr: 'ACC' },
}

// ─── Animated register row ────────────────────────────────────────
function RegisterRow({ name, value, prevValue, isActive }) {
  const changed = value !== prevValue
  const hex = toHex(value)
  const bin = toBin(value)

  return (
    <motion.div
      layout
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
        isActive
          ? 'bg-primary-600/15 border border-primary-600/30'
          : 'border border-transparent'
      }`}
    >
      {/* Abbreviation */}
      <span className="w-10 text-xs font-mono font-bold text-surface-400 flex-shrink-0">
        {REGISTER_LABELS[name]?.abbr || name.toUpperCase()}
      </span>

      {/* Hex value */}
      <motion.span
        key={hex}
        initial={changed ? { color: '#F59E0B', scale: 1.1 } : {}}
        animate={{ color: isActive ? '#60A5FA' : '#E2E8F0', scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-14 text-sm font-mono font-bold tabular-nums"
      >
        {hex}
      </motion.span>

      {/* Binary bits */}
      <div className="flex gap-0.5">
        {bin.split('').map((bit, i) => (
          <motion.span
            key={i}
            initial={changed && bit !== toBin(prevValue)[i] ? { background: '#F59E0B22', scale: 1.2 } : {}}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
            className="w-5 h-5 flex items-center justify-center rounded text-[10px] font-mono font-bold"
            style={{
              background: bit === '1'
                ? (isActive ? 'rgba(96,165,250,0.2)' : 'rgba(34,197,94,0.15)')
                : 'rgba(51,65,85,0.5)',
              color: bit === '1'
                ? (isActive ? '#60A5FA' : '#4ADE80')
                : '#475569',
            }}
          >
            {bit}
          </motion.span>
        ))}
      </div>

      {/* Change indicator */}
      <AnimatePresence>
        {changed && (
          <motion.span
            initial={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="text-[10px] font-mono text-amber-400 ml-1"
          >
            ← updated
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Pipeline stage box ───────────────────────────────────────────
function StageBox({ stage, isActive, isDone, index }) {
  const meta = STAGE_META[stage]
  return (
    <motion.div
      layout
      animate={{
        borderColor:   isActive ? meta.color : isDone ? meta.color + '40' : '#334155',
        background:    isActive ? meta.color + '15' : isDone ? meta.color + '06' : 'rgba(30,41,59,0.4)',
        boxShadow:     isActive ? `0 0 20px ${meta.color}30` : 'none',
      }}
      transition={{ duration: 0.3 }}
      className="flex-1 min-w-0 rounded-xl border p-4 flex flex-col gap-2 relative"
    >
      {/* Stage number bubble */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-1"
        style={{
          background: isActive ? meta.color : isDone ? meta.color + '30' : '#1E293B',
          color:      isActive ? '#fff'     : isDone ? meta.color         : '#475569',
          transition: 'all 0.3s',
        }}
      >
        {isDone && !isActive ? '✓' : index + 1}
      </div>

      {/* Stage name */}
      <p
        className="text-xs font-mono font-bold uppercase tracking-widest"
        style={{ color: isActive ? meta.color : isDone ? meta.color + 'CC' : '#64748B', transition: 'color 0.3s' }}
      >
        {stage}
      </p>

      {/* Short desc */}
      <p className="text-[10px] font-mono text-surface-500 leading-tight">{meta.shortDesc}</p>

      {/* Active pulse ring */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ border: `1px solid ${meta.color}`, borderRadius: 12 }}
        />
      )}

      {/* Connector arrow (not on last stage) */}
      {index < 3 && (
        <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
          <ChevronRight size={14}
            style={{ color: isDone ? meta.color + '80' : '#334155', transition: 'color 0.3s' }}
          />
        </div>
      )}
    </motion.div>
  )
}

// ─── Flag display ─────────────────────────────────────────────────
function FlagBadge({ label, active }) {
  return (
    <div className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all duration-300 ${
      active
        ? 'bg-emerald-900/40 border border-emerald-600/50 text-emerald-400'
        : 'bg-surface-800/50 border border-surface-700 text-surface-600'
    }`}>
      {label}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────
export default function CoaPipeline() {
  const {
    currentStage, currentInstruction,
    program, pc, ir, mar, mdr, acc, flags,
    isComplete, nextStage, resetPipeline,
  } = useCoaStore()

  // Track previous register values for change animation
  const prevRegs = useRef({ pc, ir, mar, mdr, acc })
  const [prevSnapshot, setPrevSnapshot] = useState({ pc, ir, mar, mdr, acc })

  useEffect(() => {
    setPrevSnapshot({ ...prevRegs.current })
    prevRegs.current = { pc, ir, mar, mdr, acc }
  }, [pc, ir, mar, mdr, acc])

  // Auto-play
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (playing && !isComplete) {
      timerRef.current = setInterval(nextStage, 1200)
    } else {
      clearInterval(timerRef.current)
      if (isComplete) setPlaying(false)
    }
    return () => clearInterval(timerRef.current)
  }, [playing, isComplete, nextStage])

  const stageName = STAGES[currentStage]
  const meta      = STAGE_META[stageName]
  const instr     = program[currentInstruction] || program[program.length - 1]

  const registers = { pc, ir, mar, mdr, acc }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 bg-surface-900 circuit-grid">
      <div className="max-w-6xl mx-auto flex flex-col gap-5">

        {/* ── Breadcrumb + title ─────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-3 text-xs font-mono">
            <Link to="/coa" className="text-surface-500 hover:text-primary-400 transition-colors">
              COA
            </Link>
            <ChevronRight size={12} className="text-surface-700" />
            <span className="badge badge-blue">Exp 01</span>
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-bold text-3xl text-white mb-1">Pipeline Stepper</h1>
              <p className="text-surface-400 text-sm">
                Trace instruction execution through Fetch → Decode → Execute → WriteBack.
                Watch registers update at each stage.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Play / Pause */}
              <button
                onClick={() => setPlaying((v) => !v)}
                disabled={isComplete}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-mono
                            transition-all disabled:opacity-40 ${
                  playing
                    ? 'bg-amber-950/30 border-amber-700/40 text-amber-300'
                    : 'bg-primary-600/20 border-primary-600/40 text-primary-300 hover:bg-primary-600/30'
                }`}
              >
                {playing ? <Pause size={14} /> : <Play size={14} />}
                {playing ? 'Pause' : 'Auto-play'}
              </button>
              <button
                onClick={() => { resetPipeline(); setPlaying(false) }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-700
                           bg-surface-800 text-surface-400 hover:text-surface-200 text-sm font-mono transition-all"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Current instruction banner ─────────────────────── */}
        <motion.div
          layout
          className="panel p-4 flex items-center justify-between gap-4 flex-wrap"
          style={{ borderColor: meta.color + '40', background: meta.color + '08' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
              style={{ background: meta.color + '20' }}>
              <Cpu size={16} style={{ color: meta.color }} />
            </div>
            <div>
              <p className="text-xs font-mono text-surface-500">
                Instruction {Math.min(currentInstruction + 1, program.length)} / {program.length}
              </p>
              {isComplete ? (
                <p className="text-sm font-mono font-bold text-emerald-400">✓ Program complete — all instructions executed</p>
              ) : (
                <p className="text-sm font-mono font-bold text-white">
                  <span style={{ color: meta.color }}>{instr.mnemonic}</span>
                  {instr.operand && <span className="text-surface-300"> {instr.operand}</span>}
                  <span className="text-surface-500 ml-2">— {instr.description}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-surface-500">Current stage:</span>
            <span className="font-bold" style={{ color: meta.color }}>
              {isComplete ? 'DONE' : stageName.toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* ── Pipeline stage boxes ───────────────────────────── */}
        <div className="flex gap-3 relative">
          {STAGES.map((stage, i) => (
            <StageBox
              key={stage}
              stage={stage}
              index={i}
              isActive={!isComplete && i === currentStage}
              isDone={isComplete || i < currentStage || (i === currentStage && currentInstruction > 0)}
            />
          ))}
        </div>

        {/* ── Stage detail ───────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stageName + currentInstruction}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="panel p-5"
            style={{ borderColor: meta.color + '30' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} style={{ color: meta.color }} />
              <span className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: meta.color }}>
                {isComplete ? 'Execution Complete' : `${stageName} Stage`}
              </span>
            </div>
            <p className="text-sm text-surface-300 font-mono leading-relaxed">
              {isComplete
                ? 'All 5 instructions have completed the full Fetch → Decode → Execute → WriteBack cycle. ' +
                  'The CPU executed the program in 20 clock cycles (5 instructions × 4 stages each).'
                : meta.detail}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom: registers + program list ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Register bank */}
          <div className="panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <Database size={14} className="text-violet-400" />
              <span className="text-xs font-semibold text-surface-400 uppercase tracking-widest">
                Register Bank
              </span>
              <span className="ml-auto text-[10px] font-mono text-surface-600">hex · binary</span>
            </div>

            <div className="space-y-1">
              {Object.keys(registers).map((name) => (
                <RegisterRow
                  key={name}
                  name={name}
                  value={registers[name]}
                  prevValue={prevSnapshot[name]}
                  isActive={!isComplete && meta.registers.includes(name)}
                />
              ))}
            </div>

            {/* Flags */}
            <div className="mt-4 pt-3 border-t border-surface-700">
              <p className="text-[10px] font-mono text-surface-600 uppercase tracking-widest mb-2">
                Flag Register
              </p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(flags).map(([k, v]) => (
                  <FlagBadge key={k} label={k.slice(0, 2).toUpperCase()} active={v} />
                ))}
              </div>
            </div>
          </div>

          {/* Program listing */}
          <div className="panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <Cpu size={14} className="text-primary-400" />
              <span className="text-xs font-semibold text-surface-400 uppercase tracking-widest">
                Program Memory
              </span>
              <span className="ml-auto text-[10px] font-mono text-surface-600">
                {program.length} instructions
              </span>
            </div>

            <div className="space-y-1 font-mono text-xs">
              {program.map((instr, i) => {
                const isActive   = !isComplete && i === currentInstruction
                const isExecuted = isComplete || i < currentInstruction
                return (
                  <motion.div
                    key={i}
                    animate={{
                      background: isActive   ? 'rgba(26,86,219,0.12)' :
                                  isExecuted ? 'rgba(34,197,94,0.04)'  : 'transparent',
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors"
                    style={{
                      borderColor: isActive ? '#1A56DB40' : isExecuted ? '#22C55E20' : 'transparent',
                    }}
                  >
                    {/* Address */}
                    <span className="text-surface-600 w-10">{toHex(i)}</span>

                    {/* Mnemonic */}
                    <span className={
                      isActive   ? 'text-primary-300 font-bold w-14' :
                      isExecuted ? 'text-emerald-500/70 w-14'        :
                                   'text-surface-400 w-14'
                    }>
                      {instr.mnemonic}
                    </span>

                    {/* Operand */}
                    <span className={isActive ? 'text-amber-300' : isExecuted ? 'text-surface-600' : 'text-surface-500'}>
                      {instr.operand || ''}
                    </span>

                    {/* Status */}
                    <span className="ml-auto">
                      {isExecuted && !isActive && <span className="text-emerald-600">✓</span>}
                      {isActive && (
                        <span className="flex items-center gap-1 text-primary-400">
                          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                            ●
                          </motion.span>
                        </span>
                      )}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            {/* Stage navigation controls */}
            <div className="mt-5 pt-4 border-t border-surface-700 flex items-center gap-3">
              <button
                onClick={nextStage}
                disabled={isComplete}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
                           font-mono text-sm font-semibold transition-all disabled:opacity-40
                           disabled:cursor-not-allowed"
                style={{
                  background:   isComplete ? undefined : meta.color + '20',
                  borderWidth:  1,
                  borderStyle:  'solid',
                  borderColor:  isComplete ? '#334155' : meta.color + '50',
                  color:        isComplete ? '#475569' : meta.color,
                }}
              >
                {isComplete
                  ? 'Program Complete'
                  : <>Next Stage <ChevronRight size={14} /></>}
              </button>
              <Link
                to="/coa/registers"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-surface-700
                           bg-surface-800 text-surface-400 hover:text-surface-200 text-sm font-mono transition-all"
              >
                Registers <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bridge Feature ────────────────────────────────── */}
        <AnimatePresence>
          {(stageName === 'Execute' || isComplete) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4 }}
              className="panel p-5 border-amber-700/40 bg-amber-950/10"
            >
              <div className="flex items-start gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center
                                   bg-amber-950/40 border border-amber-700/40">
                    <GitMerge size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-widest mb-0.5">
                      ⚡ Bridge Feature
                    </p>
                    <p className="text-sm font-bold text-white">
                      The Logic You Built Lives Here
                    </p>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-300 leading-relaxed mb-3">
                    The <span className="text-amber-300 font-semibold">Execute stage</span> uses the{' '}
                    <span className="text-emerald-300 font-semibold">Arithmetic Logic Unit (ALU)</span>.
                    At its core, the ALU is a chain of{' '}
                    <span className="text-primary-300 font-semibold">Half Adders</span> — the exact
                    XOR + AND circuit you built in the Logic Sandbox.
                    Eight of them chained together form an 8-bit adder.
                  </p>

                  {/* Mini Half Adder → ALU diagram */}
                  <div className="bg-surface-900/80 rounded-xl border border-surface-700 p-4 mb-3">
                    <svg viewBox="0 0 480 80" className="w-full" style={{ maxHeight: 72 }}>
                      {/* Half Adder box */}
                      <rect x={10} y={15} width={110} height={50} rx={6}
                        fill="rgba(5,150,105,0.12)" stroke="#05966960" strokeWidth={1.5} />
                      <text x={65} y={36} textAnchor="middle" fontSize={9} fontWeight={700}
                        fill="#059669" fontFamily="JetBrains Mono">HALF ADDER</text>
                      <text x={65} y={48} textAnchor="middle" fontSize={8} fill="#64748B" fontFamily="JetBrains Mono">XOR + AND</text>
                      <text x={65} y={58} textAnchor="middle" fontSize={8} fill="#475569" fontFamily="JetBrains Mono">SUM + CARRY</text>

                      {/* Arrow ×8 */}
                      <text x={135} y={44} fontSize={11} fill="#F59E0B" fontFamily="JetBrains Mono">×8</text>
                      <line x1={122} y1={40} x2={158} y2={40} stroke="#F59E0B" strokeWidth={1.5} markerEnd="url(#arr-bridge)" />
                      <defs>
                        <marker id="arr-bridge" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <path d="M0,0 L6,3 L0,6 Z" fill="#F59E0B" />
                        </marker>
                      </defs>

                      {/* 8-bit ALU box */}
                      <rect x={160} y={10} width={130} height={60} rx={6}
                        fill="rgba(26,86,219,0.12)" stroke="#1A56DB60" strokeWidth={1.5} />
                      <text x={225} y={32} textAnchor="middle" fontSize={9} fontWeight={700}
                        fill="#1A56DB" fontFamily="JetBrains Mono">8-BIT ALU</text>
                      <text x={225} y={44} textAnchor="middle" fontSize={8} fill="#64748B" fontFamily="JetBrains Mono">ADD / SUB / AND / OR</text>
                      <text x={225} y={56} textAnchor="middle" fontSize={8} fill="#475569" fontFamily="JetBrains Mono">A[7:0] OP B[7:0]</text>

                      {/* Arrow */}
                      <line x1={292} y1={40} x2={328} y2={40} stroke="#7C3AED" strokeWidth={1.5} markerEnd="url(#arr-cpu)" />
                      <defs>
                        <marker id="arr-cpu" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <path d="M0,0 L6,3 L0,6 Z" fill="#7C3AED" />
                        </marker>
                      </defs>

                      {/* CPU Execute box */}
                      <rect x={330} y={10} width={140} height={60} rx={6}
                        fill="rgba(124,58,237,0.12)" stroke="#7C3AED60" strokeWidth={1.5} />
                      <text x={400} y={32} textAnchor="middle" fontSize={9} fontWeight={700}
                        fill="#7C3AED" fontFamily="JetBrains Mono">EXECUTE STAGE</text>
                      <text x={400} y={44} textAnchor="middle" fontSize={8} fill="#64748B" fontFamily="JetBrains Mono">IR decoded → ALU ops</text>
                      <text x={400} y={56} textAnchor="middle" fontSize={8} fill="#475569" fontFamily="JetBrains Mono">ACC ← result</text>
                    </svg>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <Link
                      to="/quick-lab/half-adder"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-700/40
                                 bg-emerald-950/20 text-emerald-300 text-xs font-mono hover:bg-emerald-950/40 transition-all"
                    >
                      <GitMerge size={12} /> Revisit Half Adder
                    </Link>
                    <Link
                      to="/sandbox"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary-700/40
                                 bg-primary-950/20 text-primary-300 text-xs font-mono hover:bg-primary-950/40 transition-all"
                    >
                      Build More Gates <ChevronRight size={12} />
                    </Link>
                    <p className="text-xs text-surface-500 font-mono">
                      This connection — gates → ALU → pipeline — is what LogicFlow is built to show.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
