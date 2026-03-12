import { memo, useCallback } from 'react'
import { Handle, Position } from 'reactflow'
import { useGateStore } from '../../store/gateStore'

/**
 * InputNode
 * A clickable toggle switch. Click to flip between HIGH (1) and LOW (0).
 * Source handle on the right feeds into gate inputs.
 */
const InputNode = memo(({ id, data, selected }) => {
  const { inputStates, toggleInput } = useGateStore()
  const val = inputStates[id] ?? 0

  const handleClick = useCallback(() => {
    toggleInput(id)
  }, [id, toggleInput])

  const isHigh   = val === 1
  const color    = isHigh ? '#22C55E' : '#EF4444'
  const bgColor  = isHigh ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.08)'
  const label    = data?.label || id.slice(-2).toUpperCase()

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer select-none"
      style={{
        width: 68,
        padding: '6px 10px',
        borderRadius: 8,
        border: `2px solid ${color}`,
        background: bgColor,
        boxShadow: isHigh ? `0 0 10px rgba(34,197,94,0.3)` : 'none',
        transition: 'all 0.2s',
        outline: selected ? '2px solid #60A5FA' : 'none',
        outlineOffset: 2,
      }}
    >
      {/* Label */}
      <div style={{
        fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 700,
        color: '#94A3B8', textAlign: 'center', marginBottom: 2,
      }}>
        {label}
      </div>

      {/* Value display */}
      <div style={{
        fontSize: 18, fontFamily: 'JetBrains Mono', fontWeight: 700,
        color, textAlign: 'center', lineHeight: 1,
        transition: 'color 0.2s',
      }}>
        {val}
      </div>

      {/* Toggle hint */}
      <div style={{ fontSize: 8, color: '#475569', textAlign: 'center', marginTop: 2 }}>
        click to toggle
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{
          background: isHigh ? '#22C55E' : '#1E293B',
          border: `2px solid ${color}`,
          width: 10, height: 10,
          transition: 'all 0.2s',
        }}
      />
    </div>
  )
})

InputNode.displayName = 'InputNode'
export default InputNode
