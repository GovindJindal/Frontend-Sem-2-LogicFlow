import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { useGateStore } from '../../store/gateStore'

/**
 * OutputNode
 * An LED-style indicator node showing the final output value.
 * Target handle on the left receives from a gate or input.
 */
const OutputNode = memo(({ id, data, selected }) => {
  const { outputStates } = useGateStore()
  const val    = outputStates[id] ?? undefined
  const isHigh = val === 1
  const isLow  = val === 0
  const label  = data?.label || 'OUT'

  const color  = isHigh ? '#22C55E' : isLow ? '#EF4444' : '#475569'
  const glow   = isHigh ? '0 0 16px rgba(34,197,94,0.6), 0 0 32px rgba(34,197,94,0.2)'
               : isLow  ? '0 0 8px rgba(239,68,68,0.3)' : 'none'

  return (
    <div
      style={{
        width: 64,
        padding: '8px',
        borderRadius: 10,
        border: `2px solid ${color}`,
        background: isHigh ? 'rgba(34,197,94,0.12)' : isLow ? 'rgba(239,68,68,0.08)' : 'rgba(71,85,105,0.1)',
        transition: 'all 0.25s',
        outline: selected ? '2px solid #60A5FA' : 'none',
        outlineOffset: 2,
        textAlign: 'center',
      }}
    >
      {/* LED circle */}
      <div style={{
        width: 24, height: 24,
        borderRadius: '50%',
        background: color,
        boxShadow: glow,
        margin: '0 auto 4px',
        transition: 'all 0.25s',
        opacity: val === undefined ? 0.3 : 1,
      }} />

      {/* Label */}
      <div style={{
        fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 700,
        color: '#94A3B8', marginBottom: 2,
      }}>
        {label}
      </div>

      {/* Value */}
      <div style={{
        fontSize: 16, fontFamily: 'JetBrains Mono', fontWeight: 700,
        color, lineHeight: 1, transition: 'color 0.25s',
      }}>
        {val === undefined ? '?' : val}
      </div>

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        style={{
          background: isHigh ? '#22C55E' : '#1E293B',
          border: `2px solid ${color}`,
          width: 10, height: 10,
          transition: 'all 0.25s',
        }}
      />
    </div>
  )
})

OutputNode.displayName = 'OutputNode'
export default OutputNode
