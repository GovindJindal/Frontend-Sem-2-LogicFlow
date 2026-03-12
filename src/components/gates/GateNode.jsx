import { memo, useCallback } from 'react'
import { Handle, Position } from 'reactflow'
import { useGateStore } from '../../store/gateStore'
import { cn } from '../../utils/cn'

// ─── Gate SVG symbols ────────────────────────────────────────────
// All drawn in a 56×40 viewBox, inputs on left, output on right

const GATE_PATHS = {
  AND: {
    body: 'M8,4 L28,4 Q48,4 48,20 Q48,36 28,36 L8,36 Z',
    inputs: [{ x: 8, y: 12, id: 'a' }, { x: 8, y: 28, id: 'b' }],
    output: { x: 48, y: 20 },
  },
  OR: {
    body: 'M8,4 Q18,4 28,4 Q52,4 52,20 Q52,36 28,36 Q18,36 8,36 Q18,20 8,4 Z',
    inputs: [{ x: 8, y: 12, id: 'a' }, { x: 8, y: 28, id: 'b' }],
    output: { x: 52, y: 20 },
    inputCurve: 'M8,4 Q18,20 8,36', // curved input side
  },
  NOT: {
    body: 'M8,4 L44,20 L8,36 Z',
    inputs: [{ x: 8, y: 20, id: 'a' }],
    output: { x: 50, y: 20 },
    bubble: { cx: 48, cy: 20, r: 4 },
    singleInput: true,
  },
  NAND: {
    body: 'M8,4 L28,4 Q48,4 48,20 Q48,36 28,36 L8,36 Z',
    inputs: [{ x: 8, y: 12, id: 'a' }, { x: 8, y: 28, id: 'b' }],
    output: { x: 54, y: 20 },
    bubble: { cx: 52, cy: 20, r: 4 },
  },
  NOR: {
    body: 'M8,4 Q18,4 28,4 Q52,4 52,20 Q52,36 28,36 Q18,36 8,36 Q18,20 8,4 Z',
    inputs: [{ x: 8, y: 12, id: 'a' }, { x: 8, y: 28, id: 'b' }],
    output: { x: 58, y: 20 },
    bubble: { cx: 56, cy: 20, r: 4 },
    inputCurve: 'M8,4 Q18,20 8,36',
  },
  XOR: {
    body: 'M12,4 Q22,4 32,4 Q56,4 56,20 Q56,36 32,36 Q22,36 12,36 Q22,20 12,4 Z',
    extraCurve: 'M8,4 Q18,20 8,36',
    inputs: [{ x: 12, y: 12, id: 'a' }, { x: 12, y: 28, id: 'b' }],
    output: { x: 56, y: 20 },
    inputCurve: 'M12,4 Q22,20 12,36',
  },
  XNOR: {
    body: 'M12,4 Q22,4 32,4 Q56,4 56,20 Q56,36 32,36 Q22,36 12,36 Q22,20 12,4 Z',
    extraCurve: 'M8,4 Q18,20 8,36',
    inputs: [{ x: 12, y: 12, id: 'a' }, { x: 12, y: 28, id: 'b' }],
    output: { x: 62, y: 20 },
    bubble: { cx: 60, cy: 20, r: 4 },
    inputCurve: 'M12,4 Q22,20 12,36',
  },
}

// Signal colour helpers
const sigColor = (val) =>
  val === 1 ? '#22C55E' : val === 0 ? '#EF4444' : '#475569'

const sigFill = (val) =>
  val === 1 ? 'rgba(34,197,94,0.12)' : val === 0 ? 'rgba(239,68,68,0.08)' : 'rgba(71,85,105,0.08)'

/**
 * GateNode
 * Custom ReactFlow node for logic gates (AND/OR/NOT/NAND/NOR/XOR/XNOR).
 * Renders an SVG gate symbol. Body fill and border colour update based on output signal.
 */
const GateNode = memo(({ id, data, selected }) => {
  const { outputStates, inputStates } = useGateStore()
  const { gateType = 'AND', label } = data

  const shape = GATE_PATHS[gateType] || GATE_PATHS.AND
  const outVal  = outputStates[id]
  const strokeC = sigColor(outVal)
  const fillC   = sigFill(outVal)

  return (
    <div
      className={cn(
        'relative rounded-lg transition-all duration-150',
        selected && 'ring-2 ring-primary-400 ring-offset-1 ring-offset-surface-900'
      )}
      style={{ width: 80, height: 56 }}
    >
      {/* Gate type label above */}
      <div className="absolute -top-5 left-0 right-0 text-center">
        <span className="text-[9px] font-mono font-bold text-surface-500 uppercase tracking-wider">
          {gateType}
        </span>
      </div>

      {/* SVG gate symbol */}
      <svg
        viewBox="0 0 64 40"
        width={80} height={56}
        className="overflow-visible"
        style={{ filter: outVal === 1 ? 'drop-shadow(0 0 4px rgba(34,197,94,0.4))' : 'none' }}
      >
        {/* Extra curve for OR/XOR/NOR/XNOR (curved input side) */}
        {shape.inputCurve && (
          <path d={shape.inputCurve} fill="none" stroke="#334155" strokeWidth="1.5" />
        )}
        {shape.extraCurve && (
          <path d={shape.extraCurve} fill="none" stroke={strokeC} strokeWidth="1.5" opacity="0.6" />
        )}

        {/* Main gate body */}
        <path
          d={shape.body}
          fill={fillC}
          stroke={strokeC}
          strokeWidth="1.8"
          style={{ transition: 'stroke 0.25s, fill 0.25s' }}
        />

        {/* Bubble for NAND/NOR/NOT/XNOR */}
        {shape.bubble && (
          <circle
            cx={shape.bubble.cx} cy={shape.bubble.cy} r={shape.bubble.r}
            fill={fillC} stroke={strokeC} strokeWidth="1.8"
            style={{ transition: 'stroke 0.25s, fill 0.25s' }}
          />
        )}

        {/* Input stub lines */}
        {shape.inputs.map((inp) => (
          <line
            key={inp.id}
            x1={0} y1={inp.y} x2={inp.x} y2={inp.y}
            stroke={sigColor(inputStates[id + '-' + inp.id] ?? outputStates[id + '-src-' + inp.id])}
            strokeWidth="1.5"
            style={{ transition: 'stroke 0.25s' }}
          />
        ))}

        {/* Output stub line */}
        <line
          x1={shape.output.x} y1={shape.output.y}
          x2={shape.bubble ? shape.output.x + 2 : shape.output.x + 4}
          y2={shape.output.y}
          stroke={strokeC} strokeWidth="1.5"
          style={{ transition: 'stroke 0.25s' }}
        />
      </svg>

      {/* ReactFlow Handles — input(s) left, output right */}
      {shape.inputs.map((inp, idx) => {
        const topPct = shape.singleInput ? '50%' : idx === 0 ? '28%' : '72%'
        return (
          <Handle
            key={inp.id}
            type="target"
            position={Position.Left}
            id={inp.id}
            style={{
              top: topPct,
              background: '#1E293B',
              border: `2px solid ${sigColor(undefined)}`,
              width: 10, height: 10,
              transition: 'border-color 0.25s',
            }}
          />
        )
      })}

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{
          top: '50%',
          background: outVal === 1 ? '#22C55E' : '#1E293B',
          border: `2px solid ${strokeC}`,
          width: 10, height: 10,
          transition: 'background 0.25s, border-color 0.25s',
        }}
      />
    </div>
  )
})

GateNode.displayName = 'GateNode'
export default GateNode
