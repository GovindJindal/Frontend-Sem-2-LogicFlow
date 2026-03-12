import { useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
  Background, Controls, MiniMap,
  addEdge, useReactFlow, ReactFlowProvider,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitFork, ChevronRight, LayoutGrid,
  Table, Cpu, Info, Share2,
} from 'lucide-react'

import { useGateStore }       from '../store/gateStore'
import { propagateSignals, generateTruthTable } from '../utils/gateLogic'
import GateNode               from '../components/gates/GateNode'
import InputNode              from '../components/gates/InputNode'
import OutputNode             from '../components/gates/OutputNode'
import SignalEdge             from '../components/gates/SignalEdge'
import GatePalette            from '../components/gates/GatePalette'
import { PRESETS, PRESET_LIST } from '../data/presets'

// ─── ReactFlow type registrations ───────────────────────────────
const nodeTypes = {
  gateNode:    GateNode,
  inputNode:   InputNode,
  outputNode:  OutputNode,
}

const edgeTypes = {
  signalEdge: SignalEdge,
}

// Default edge options
const defaultEdgeOptions = {
  type: 'signalEdge',
  animated: false,
}

// ─── Truth Table panel ───────────────────────────────────────────
function TruthTablePanel({ nodes, edges }) {
  const rows = generateTruthTable(nodes, edges)
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-surface-600 text-xs font-mono gap-2">
        <Table size={20} />
        <p>Add INPUT and OUTPUT nodes to generate truth table</p>
      </div>
    )
  }

  const inputLabels  = Object.keys(rows[0].inputs)
  const outputLabels = Object.keys(rows[0].outputs)

  return (
    <div className="overflow-auto custom-scroll h-full">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-surface-700">
            {inputLabels.map((l) => (
              <th key={l} className="px-3 py-2 text-primary-400 font-semibold text-left">{l}</th>
            ))}
            <th className="px-2 py-2 text-surface-600">│</th>
            {outputLabels.map((l) => (
              <th key={l} className="px-3 py-2 text-amber-400 font-semibold text-left">{l}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const allOnes = Object.values(row.outputs).every((v) => v === 1)
            return (
              <tr key={i} className={`border-b border-surface-800/50 ${allOnes ? 'bg-emerald-950/20' : ''}`}>
                {inputLabels.map((l) => (
                  <td key={l} className={`px-3 py-1.5 ${row.inputs[l] === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.inputs[l]}
                  </td>
                ))}
                <td className="px-2 text-surface-700">│</td>
                {outputLabels.map((l) => (
                  <td key={l} className={`px-3 py-1.5 font-bold ${row.outputs[l] === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.outputs[l]}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Preset picker ───────────────────────────────────────────────
function PresetPicker({ onSelect, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="absolute top-14 right-4 w-64 bg-surface-800 border border-surface-700
                 rounded-xl shadow-panel z-50 overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-surface-700">
        <p className="text-xs font-semibold text-surface-300">Load Demo Circuit</p>
      </div>
      {PRESET_LIST.map((p) => (
        <button
          key={p.id}
          onClick={() => { onSelect(p.id); onClose() }}
          className="w-full text-left px-4 py-3 hover:bg-surface-700 transition-colors border-b border-surface-800 last:border-0"
        >
          <p className="text-sm font-semibold text-white">{p.name}</p>
          <p className="text-xs text-surface-400 mt-0.5">{p.description}</p>
        </button>
      ))}
    </motion.div>
  )
}

// ─── Inner canvas component (needs ReactFlowProvider context) ────
function SandboxCanvas() {
  const reactFlowInstance = useReactFlow()
  const reactFlowWrapper  = useRef(null)

  const {
    nodes, edges, inputStates,
    setNodes, setEdges, setOutputStates, loadPreset,
  } = useGateStore()

  const [showTruthTable, setShowTruthTable] = useState(true)
  const [showPresets,    setShowPresets]    = useState(false)
  const [showBridgeCTA,  setShowBridgeCTA]  = useState(false)

  // ── Signal propagation ─────────────────────────────────────────
  // Re-run every time inputs or edges change
  useEffect(() => {
    if (nodes.length === 0) return
    const signals = propagateSignals(nodes, edges, inputStates)

    // Merge output node signals (outputNode reads from signals via its source connection)
    const enriched = { ...signals }
    nodes.forEach((n) => {
      if (n.type === 'outputNode') {
        // Find the edge targeting this output node
        const inEdge = edges.find((e) => e.target === n.id)
        if (inEdge) enriched[n.id] = signals[inEdge.source] ?? undefined
      }
    })
    setOutputStates(enriched)

    // Check if circuit contains a half adder pattern (for bridge CTA)
    const hasXOR = nodes.some((n) => n.data?.gateType === 'XOR')
    const hasAND = nodes.some((n) => n.data?.gateType === 'AND')
    const hasTwo = nodes.filter((n) => n.type === 'inputNode').length >= 2
    setShowBridgeCTA(hasXOR && hasAND && hasTwo)
  }, [inputStates, edges, nodes])

  // ── Drop handler ───────────────────────────────────────────────
  const onDrop = useCallback((event) => {
    event.preventDefault()
    const nodeType  = event.dataTransfer.getData('application/reactflow/type')
    const gateType  = event.dataTransfer.getData('application/reactflow/gateType')
    if (!nodeType) return

    const bounds   = reactFlowWrapper.current.getBoundingClientRect()
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    })

    const id = `${nodeType}-${Date.now()}`
    const newNode = {
      id,
      type: nodeType,
      position,
      data: nodeType === 'gateNode'
        ? { gateType }
        : { label: nodeType === 'inputNode' ? `IN${nodes.filter(n => n.type === 'inputNode').length + 1}` : `OUT` },
    }

    setNodes([...nodes, newNode])

    // Initialise input state for new input nodes
    if (nodeType === 'inputNode') {
      useGateStore.setState((s) => ({
        inputStates: { ...s.inputStates, [id]: 0 }
      }))
    }
  }, [nodes, reactFlowInstance, setNodes])

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  // ── Connect handler ────────────────────────────────────────────
  const onConnect = useCallback((params) => {
    setEdges(addEdge({ ...params, type: 'signalEdge' }, edges))
  }, [edges, setEdges])

  // ── Tidy layout ────────────────────────────────────────────────
  const handleTidy = useCallback(() => {
    const inputNodes  = nodes.filter((n) => n.type === 'inputNode')
    const gateNodes   = nodes.filter((n) => n.type === 'gateNode')
    const outputNodes = nodes.filter((n) => n.type === 'outputNode')

    const tidied = [
      ...inputNodes.map((n, i)  => ({ ...n, position: { x: 80,  y: 80 + i * 120 } })),
      ...gateNodes.map((n, i)   => ({ ...n, position: { x: 280, y: 80 + i * 120 } })),
      ...outputNodes.map((n, i) => ({ ...n, position: { x: 480, y: 80 + i * 120 } })),
    ]
    setNodes(tidied)
    setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 50)
  }, [nodes, setNodes, reactFlowInstance])

  // ── Load preset ────────────────────────────────────────────────
  const handleLoadPreset = useCallback((id) => {
    const preset = PRESETS[id]
    if (!preset) return
    loadPreset(preset)
    setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 50)
  }, [loadPreset, reactFlowInstance])

  // ── Snapshot / share ──────────────────────────────────────────
  const handleShare = useCallback(() => {
    const state = { nodes, edges, inputStates }
    const encoded = btoa(JSON.stringify(state))
    const url = `${window.location.origin}/sandbox?circuit=${encoded}`
    navigator.clipboard.writeText(url).catch(() => {})
    alert('Circuit URL copied to clipboard!')
  }, [nodes, edges, inputStates])

  return (
    <div className="flex flex-col h-full">
      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="relative flex items-center justify-between px-4 py-2 border-b border-surface-700 bg-surface-900/80">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTruthTable((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono
                        border transition-all ${
              showTruthTable
                ? 'bg-primary-600/20 border-primary-600/40 text-primary-300'
                : 'bg-surface-800 border-surface-700 text-surface-400 hover:text-surface-200'
            }`}
          >
            <Table size={12} /> Truth Table
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono
                       border border-surface-700 bg-surface-800 text-surface-400
                       hover:text-surface-200 transition-all"
          >
            <Share2 size={12} /> Share
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Bridge CTA */}
          <AnimatePresence>
            {showBridgeCTA && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono
                           border border-amber-600/40 bg-amber-950/30 text-amber-300
                           hover:bg-amber-950/50 transition-all animate-pulse"
              >
                <Cpu size={12} /> See This in a CPU →
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={() => setShowPresets((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono
                       border border-surface-700 bg-surface-800 text-surface-400
                       hover:text-surface-200 transition-all"
          >
            <LayoutGrid size={12} /> Load Demo
          </button>
        </div>

        {/* Preset picker dropdown */}
        <AnimatePresence>
          {showPresets && (
            <PresetPicker
              onSelect={handleLoadPreset}
              onClose={() => setShowPresets(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Main area: canvas + truth table ─────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* GatePalette */}
        <GatePalette onTidy={handleTidy} />

        {/* ReactFlow Canvas */}
        <div ref={reactFlowWrapper} className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            onNodesChange={(changes) => {
              // Apply position changes only (don't delete via keyboard here — Day 5)
              const { applyNodeChanges } = require('reactflow')
              setNodes(applyNodeChanges(changes, nodes))
            }}
            onEdgesChange={(changes) => {
              const { applyEdgeChanges } = require('reactflow')
              setEdges(applyEdgeChanges(changes, edges))
            }}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            connectionRadius={30}
            snapToGrid
            snapGrid={[10, 10]}
            deleteKeyCode="Delete"
            minZoom={0.3}
            maxZoom={2.5}
            style={{ background: '#0F172A' }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20} size={1}
              color="#1E293B"
            />
            <Controls
              style={{ bottom: 16, left: 8 }}
              showInteractive={false}
            />
            <MiniMap
              style={{ background: '#1E293B', border: '1px solid #334155' }}
              nodeColor={(n) =>
                n.type === 'inputNode'  ? '#22C55E' :
                n.type === 'outputNode' ? '#F59E0B' : '#1A56DB'
              }
              maskColor="rgba(15,23,42,0.8)"
            />
          </ReactFlow>

          {/* Empty state overlay */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center
                            pointer-events-none gap-4">
              <div className="text-center">
                <GitFork size={32} className="text-surface-700 mx-auto mb-3" />
                <p className="text-surface-600 text-sm font-mono">Drag gates from the left panel</p>
                <p className="text-surface-700 text-xs font-mono mt-1">or load a demo circuit →</p>
              </div>
            </div>
          )}
        </div>

        {/* Truth Table panel */}
        <AnimatePresence>
          {showTruthTable && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-l border-surface-700 bg-surface-900/80 overflow-hidden flex-shrink-0"
            >
              <div className="w-60 h-full flex flex-col">
                <div className="px-4 py-2.5 border-b border-surface-700 flex items-center gap-2">
                  <Table size={13} className="text-primary-400" />
                  <span className="text-xs font-semibold text-surface-300">Truth Table</span>
                </div>
                <div className="flex-1 overflow-auto p-2">
                  <TruthTablePanel nodes={nodes} edges={edges} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Page wrapper ─────────────────────────────────────────────────
export default function Sandbox() {
  return (
    <div className="h-screen flex flex-col bg-surface-900 pt-16">

      {/* ── Page header ───────────────────────────────────── */}
      <div className="px-6 py-3 border-b border-surface-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-surface-500">
            <span className="badge badge-green text-xs">Logic Design</span>
            <ChevronRight size={12} className="text-surface-700" />
            <span>Experiment 03</span>
          </div>
          <h1 className="font-display font-bold text-lg text-white">Logic Gate Sandbox</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-surface-500">
          <Info size={12} />
          <span>Drag gates • Wire handles • Click inputs to toggle</span>
        </div>
      </div>

      {/* ── Canvas (takes remaining height) ───────────────── */}
      <div className="flex-1 overflow-hidden">
        <ReactFlowProvider>
          <SandboxCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  )
}
