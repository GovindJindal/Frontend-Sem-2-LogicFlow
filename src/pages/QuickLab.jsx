import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ReactFlow, {
  Background, BackgroundVariant,
  applyNodeChanges, applyEdgeChanges,
  addEdge as rfAddEdge,
  useReactFlow, ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  ChevronLeft, ChevronRight, CheckCircle,
  BookOpen, Lightbulb, FlaskConical, Trophy,
} from 'lucide-react'

import { useGateStore }                         from '../store/gateStore'
import { propagateSignals }                     from '../utils/gateLogic'
import { QUICK_LAB_EXPERIMENTS }                from '../data/quickLabSteps'
import GateNode                                 from '../components/gates/GateNode'
import InputNode                                from '../components/gates/InputNode'
import OutputNode                               from '../components/gates/OutputNode'
import SignalEdge                               from '../components/gates/SignalEdge'
import { PRESETS }                              from '../data/presets'

const nodeTypes = { gateNode: GateNode, inputNode: InputNode, outputNode: OutputNode }
const edgeTypes = { signalEdge: SignalEdge }

// ─── Progress bar ────────────────────────────────────────────────
function StepProgress({ current, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="transition-all duration-300 rounded-full"
          style={{
            width:  i < current ? 20 : i === current ? 16 : 8,
            height: 6,
            background: i < current ? '#22C55E' : i === current ? '#1A56DB' : '#334155',
          }}
        />
      ))}
    </div>
  )
}

// ─── Step panel ───────────────────────────────────────────────────
function StepPanel({ experiment, step, stepIdx, onNext, onPrev, isFirst, isLast, stepDone }) {
  const [showHint, setShowHint] = useState(false)

  // Reset hint when step changes
  useEffect(() => setShowHint(false), [stepIdx])

  return (
    <motion.div
      key={stepIdx}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-full"
    >
      {/* Step header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 text-white"
          style={{ background: stepDone ? '#22C55E' : experiment.badgeColor }}
        >
          {stepDone ? '✓' : step.id}
        </div>
        <h3 className="font-semibold text-sm text-white leading-tight">{step.title}</h3>
      </div>

      {/* Instruction */}
      <div className="bg-surface-800/60 rounded-xl border border-surface-700 p-4 mb-3">
        <p className="text-sm text-surface-300 leading-relaxed">{step.instruction}</p>
      </div>

      {/* Hint toggle */}
      {step.hint && (
        <div className="mb-3">
          <button
            onClick={() => setShowHint((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Lightbulb size={12} />
            {showHint ? 'Hide hint' : 'Show hint'}
          </button>
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 bg-amber-950/20 border border-amber-700/30 rounded-lg px-3 py-2"
              >
                <p className="text-xs text-amber-300 font-mono">{step.hint}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Conclusion card */}
      {step.isConclusion && (
        <div className="bg-emerald-950/20 border border-emerald-700/30 rounded-xl p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={14} className="text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Conclusion</span>
          </div>
          <p className="text-xs text-emerald-300 font-mono leading-relaxed">
            Experiment complete! Export the truth table as CSV and paste it into your lab record.
          </p>
        </div>
      )}

      {/* Step done indicator */}
      <AnimatePresence>
        {stepDone && !step.isConclusion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-700/40
                       rounded-lg px-3 py-2 mb-3 text-xs font-mono text-emerald-400"
          >
            <CheckCircle size={13} /> Step verified — proceed to next
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1" />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-700">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono
                     border border-surface-700 bg-surface-800 text-surface-400
                     hover:text-surface-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={13} /> Back
        </button>

        <StepProgress current={stepIdx} total={experiment.steps.length} />

        {isLast ? (
          <Link
            to="/sandbox"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono
                       border border-emerald-600/40 bg-emerald-950/30 text-emerald-300
                       hover:bg-emerald-950/50 transition-all"
          >
            Free Sandbox <ChevronRight size={13} />
          </Link>
        ) : (
          <button
            onClick={onNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono
                       border transition-all"
            style={{
              borderColor: stepDone || step.isConclusion ? '#22C55E' + '60' : '#334155',
              background:  stepDone || step.isConclusion ? 'rgba(34,197,94,0.12)' : '#1E293B',
              color:       stepDone || step.isConclusion ? '#4ADE80' : '#94A3B8',
            }}
          >
            Next <ChevronRight size={13} />
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ─── Inner canvas ─────────────────────────────────────────────────
function QuickLabCanvas({ experiment, currentStep }) {
  const reactFlowInstance = useReactFlow()
  const { nodes, edges, inputStates, setNodes, setEdges, setOutputStates } = useGateStore()

  const step = experiment.steps[currentStep]

  // ── Signal propagation ────────────────────────────────────────
  useEffect(() => {
    if (nodes.length === 0) return
    const signals  = propagateSignals(nodes, edges, inputStates)
    const enriched = { ...signals }
    nodes.forEach((n) => {
      if (n.type === 'outputNode') {
        const inEdge = edges.find((e) => e.target === n.id)
        if (inEdge) enriched[n.id] = signals[inEdge.source] ?? undefined
      }
    })
    setOutputStates(enriched)
  }, [inputStates, edges, nodes, setOutputStates])

  // Highlight nodes for current step
  const highlighted = step?.highlightNodes || []
  const styledNodes = nodes.map((n) => ({
    ...n,
    style: highlighted.includes(n.id)
      ? { filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.8))' }
      : {},
  }))

  useEffect(() => {
    setTimeout(() => reactFlowInstance.fitView({ padding: 0.25 }), 80)
  }, [])

  return (
    <ReactFlow
      nodes={styledNodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={(changes) => setNodes(applyNodeChanges(changes, nodes))}
      onEdgesChange={(changes) => setEdges(applyEdgeChanges(changes, edges))}
      onConnect={(p) => setEdges(rfAddEdge({ ...p, type: 'signalEdge' }, edges))}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      deleteKeyCode={null}     // disable delete in guided mode
      nodesDraggable={false}   // lock layout in guided mode
      nodesConnectable={false} // no rewiring in guided mode
      style={{ background: '#0F172A' }}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1E293B" />
    </ReactFlow>
  )
}

// ─── Page ─────────────────────────────────────────────────────────
export default function QuickLab() {
  const { id } = useParams()
  const experiment = QUICK_LAB_EXPERIMENTS[id]

  const { loadPreset, inputStates, outputStates } = useGateStore()
  const [stepIdx,   setStepIdx]   = useState(0)
  const [showTheory, setShowTheory] = useState(false)

  // Load preset circuit on mount
  useEffect(() => {
    if (!experiment) return
    const preset = PRESETS[experiment.presetId]
    if (preset) loadPreset(preset)
    setStepIdx(0)
  }, [id])

  if (!experiment) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <p className="text-surface-400">Experiment not found: <code className="font-mono">{id}</code></p>
        <Link to="/sandbox" className="btn-secondary text-sm">← Back to Sandbox</Link>
      </div>
    )
  }

  const step    = experiment.steps[stepIdx]
  const isFirst = stepIdx === 0
  const isLast  = stepIdx === experiment.steps.length - 1

  // Check if current step condition is satisfied
  const stepDone = step.checkFn
    ? step.checkFn(inputStates, outputStates)
    : false

  const goNext = () => { if (!isLast) setStepIdx((i) => i + 1) }
  const goPrev = () => { if (!isFirst) setStepIdx((i) => i - 1) }

  return (
    <div className="h-screen flex flex-col bg-surface-900 pt-16">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="px-5 py-3 border-b border-surface-700 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/sandbox" className="text-surface-500 hover:text-surface-300 transition-colors">
            <ChevronLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold"
                style={{ color: experiment.badgeColor }}>{experiment.subtitle}</span>
              <h1 className="font-display font-bold text-base text-white">{experiment.title}</h1>
            </div>
            <p className="text-xs text-surface-500 font-mono">{experiment.aim}</p>
          </div>
        </div>

        <button
          onClick={() => setShowTheory((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono
                      border transition-all ${
            showTheory
              ? 'bg-violet-600/20 border-violet-600/40 text-violet-300'
              : 'border-surface-700 bg-surface-800 text-surface-400 hover:text-surface-200'
          }`}
        >
          <BookOpen size={12} /> Theory
        </button>
      </div>

      {/* Theory panel (slides down) */}
      <AnimatePresence>
        {showTheory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-violet-800/40 bg-violet-950/15 flex-shrink-0"
          >
            <div className="px-6 py-4">
              <p className="text-sm text-violet-200 leading-relaxed max-w-3xl font-mono">
                {experiment.theory}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main: canvas (left) + step panel (right) ───────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ReactFlow canvas */}
        <div className="flex-1">
          <ReactFlowProvider>
            <QuickLabCanvas experiment={experiment} currentStep={stepIdx} />
          </ReactFlowProvider>
        </div>

        {/* Step panel sidebar */}
        <div className="w-80 flex-shrink-0 border-l border-surface-700 bg-surface-900/90
                        flex flex-col overflow-hidden">
          {/* Sidebar header */}
          <div className="px-5 py-3 border-b border-surface-700 flex items-center gap-2 flex-shrink-0">
            <FlaskConical size={14} style={{ color: experiment.badgeColor }} />
            <span className="text-xs font-semibold text-surface-300">
              Step {stepIdx + 1} / {experiment.steps.length}
            </span>
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto p-5 custom-scroll">
            <AnimatePresence mode="wait">
              <StepPanel
                key={stepIdx}
                experiment={experiment}
                step={step}
                stepIdx={stepIdx}
                onNext={goNext}
                onPrev={goPrev}
                isFirst={isFirst}
                isLast={isLast}
                stepDone={stepDone}
              />
            </AnimatePresence>
          </div>

          {/* Quick Lab list at bottom */}
          <div className="border-t border-surface-700 px-5 py-3 flex-shrink-0">
            <p className="text-[10px] font-mono text-surface-600 uppercase tracking-widest mb-2">Other Experiments</p>
            <div className="flex flex-col gap-1">
              {[
                { id: 'not-gate',       label: 'NOT Gate',    color: '#7C3AED' },
                { id: 'half-adder',     label: 'Half Adder',  color: '#059669' },
                { id: 'nand-universal', label: 'NAND Universal', color: '#B45309' },
              ].map((exp) => (
                <Link
                  key={exp.id}
                  to={`/quick-lab/${exp.id}`}
                  className={`text-xs font-mono px-2 py-1.5 rounded transition-colors ${
                    exp.id === id
                      ? 'text-white bg-surface-700'
                      : 'text-surface-500 hover:text-surface-300 hover:bg-surface-800'
                  }`}
                >
                  <span className="mr-2" style={{ color: exp.color }}>●</span>
                  {exp.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
