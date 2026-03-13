import { useCallback } from 'react'
import { Trash2, RotateCcw, Shuffle } from 'lucide-react'
import { useGateStore } from '../../store/gateStore'

const GATE_TYPES = [
  { type: 'AND',  color: '#1A56DB', desc: 'Output HIGH only when ALL inputs HIGH' },
  { type: 'OR',   color: '#059669', desc: 'Output HIGH when ANY input HIGH' },
  { type: 'NOT',  color: '#7C3AED', desc: 'Inverts the input signal' },
  { type: 'NAND', color: '#B45309', desc: 'NOT AND — universal gate' },
  { type: 'NOR',  color: '#9F1239', desc: 'NOT OR — universal gate' },
  { type: 'XOR',  color: '#0E7490', desc: 'HIGH when inputs DIFFER' },
  { type: 'XNOR', color: '#7C3AED', desc: 'HIGH when inputs are EQUAL' },
]

const IO_TYPES = [
  { type: 'inputNode',  label: 'INPUT',  color: '#22C55E', desc: 'Toggle switch (click to flip)' },
  { type: 'outputNode', label: 'OUTPUT', color: '#F59E0B', desc: 'LED indicator showing result' },
]

// ─── Gate tile ────────────────────────────────────────────────────
function GateTile({ gateType, color, desc, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, 'gateNode', gateType)}
      className="group cursor-grab active:cursor-grabbing select-none"
      title={desc}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-150
                   hover:-translate-y-0.5 hover:shadow-md active:scale-95"
        style={{
          borderColor: color + '40',
          background: color + '10',
        }}
      >
        {/* Mini gate indicator */}
        <div
          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold"
          style={{ background: color + '20', color, border: `1px solid ${color}60` }}
        >
          {gateType === 'NOT' ? '¬' : gateType.slice(0, 2)}
        </div>
        <div>
          <p className="text-xs font-mono font-bold text-surface-200">{gateType}</p>
          <p className="text-[10px] text-surface-500 leading-tight hidden group-hover:block">{desc}</p>
        </div>
      </div>
    </div>
  )
}

// ─── IO tile ─────────────────────────────────────────────────────
function IOTile({ nodeType, label, color, desc, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, nodeType, null)}
      className="cursor-grab active:cursor-grabbing select-none"
      title={desc}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-150
                   hover:-translate-y-0.5 hover:shadow-md active:scale-95"
        style={{
          borderColor: color + '50',
          background: color + '08',
        }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-mono font-bold flex-shrink-0"
          style={{ background: color + '20', color, border: `1px solid ${color}60` }}
        >
          {nodeType === 'inputNode' ? '▶' : '●'}
        </div>
        <p className="text-xs font-mono font-bold text-surface-200">{label}</p>
      </div>
    </div>
  )
}

/**
 * GatePalette
 * Left sidebar for the Logic Gate Sandbox.
 * Drag any tile onto the canvas to place a gate or I/O node.
 * Also houses Reset and Tidy controls.
 */
export default function GatePalette({ onTidy }) {
  const { resetCanvas } = useGateStore()

  const onDragStart = useCallback((event, nodeType, gateType) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType)
    if (gateType) {
      event.dataTransfer.setData('application/reactflow/gateType', gateType)
    }
    event.dataTransfer.effectAllowed = 'move'
  }, [])

  return (
    <aside className="w-48 flex-shrink-0 flex flex-col gap-3 bg-surface-900/80 backdrop-blur
                       border-r border-surface-700 p-3 overflow-y-auto custom-scroll">

      {/* I/O nodes section */}
      <div>
        <p className="text-[10px] font-mono font-semibold text-surface-500 uppercase tracking-widest mb-2">
          I/O Nodes
        </p>
        <div className="flex flex-col gap-1.5">
          {IO_TYPES.map((io) => (
            <IOTile key={io.type} {...io} onDragStart={onDragStart} />
          ))}
        </div>
      </div>

      <div className="border-t border-surface-700" />

      {/* Logic gates section */}
      <div>
        <p className="text-[10px] font-mono font-semibold text-surface-500 uppercase tracking-widest mb-2">
          Logic Gates
        </p>
        <div className="flex flex-col gap-1.5">
          {GATE_TYPES.map((g) => (
            <GateTile key={g.type} gateType={g.type} color={g.color} desc={g.desc} onDragStart={onDragStart} />
          ))}
        </div>
      </div>

      <div className="border-t border-surface-700" />

      {/* Controls */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-mono font-semibold text-surface-500 uppercase tracking-widest">
          Canvas
        </p>
        <button
          onClick={onTidy}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-surface-700
                     bg-surface-800 text-surface-400 hover:text-surface-200 hover:border-surface-600
                     text-xs font-mono transition-all"
        >
          <Shuffle size={13} /> Tidy Layout
        </button>
        <button
          onClick={resetCanvas}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-rose-900/50
                     bg-rose-950/20 text-rose-400 hover:bg-rose-950/40
                     text-xs font-mono transition-all"
        >
          <Trash2 size={13} /> Clear Canvas
        </button>
      </div>

      <div className="border-t border-surface-700" />

      {/* Drag hint */}
      <div className="text-[10px] text-surface-600 font-mono leading-relaxed">
        <p className="mb-1">💡 How to use:</p>
        <p>1. Drag gates onto canvas</p>
        <p>2. Connect handles to wire</p>
        <p>3. Click INPUT to toggle</p>
        <p>4. Watch signal propagate</p>
      </div>
    </aside>
  )
}
