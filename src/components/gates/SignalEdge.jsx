import { memo, useEffect, useState } from 'react'
import { getBezierPath, EdgeLabelRenderer } from 'reactflow'
import { useGateStore } from '../../store/gateStore'

/**
 * SignalEdge
 * Custom ReactFlow edge that:
 *  - Colours itself based on the source node's output signal (green=HIGH, red=LOW, grey=undefined)
 *  - Animates a "pulse" travelling along the wire when the signal changes
 *  - Shows a delete (×) button on hover
 */
const SignalEdge = memo(({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  source, markerEnd, style = {},
}) => {
  const { outputStates, inputStates, edges, setEdges } = useGateStore()
  const [animating, setAnimating]  = useState(false)
  const [prevVal,   setPrevVal]    = useState(undefined)
  const [hovered,   setHovered]    = useState(false)

  // Read signal value from source node
  const val = inputStates[source] !== undefined
    ? inputStates[source]
    : outputStates[source]

  const color = val === 1 ? '#22C55E' : val === 0 ? '#EF4444' : '#475569'
  const glow  = val === 1
    ? '0 0 6px rgba(34,197,94,0.7)'
    : val === 0
    ? '0 0 3px rgba(239,68,68,0.3)'
    : 'none'

  // Trigger pulse animation when signal changes
  useEffect(() => {
    if (prevVal !== val && prevVal !== undefined) {
      setAnimating(true)
      const t = setTimeout(() => setAnimating(false), 350)
      return () => clearTimeout(t)
    }
    setPrevVal(val)
  }, [val])

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  })

  const handleDelete = (e) => {
    e.stopPropagation()
    setEdges(edges.filter((edge) => edge.id !== id))
  }

  return (
    <>
      {/* Invisible wide hit-area for hover detection */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: 'pointer' }}
      />

      {/* Actual visible wire */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={hovered ? 3 : 2}
        strokeDasharray={animating ? '6 3' : 'none'}
        style={{
          filter: glow,
          transition: 'stroke 0.25s, filter 0.25s, stroke-width 0.15s',
          pointerEvents: 'none',
        }}
      />

      {/* Animated pulse dot travelling along the wire */}
      {animating && (
        <circle r={4} fill={color} opacity={0.9} style={{ filter: glow }}>
          <animateMotion dur="0.35s" fill="freeze">
            <mpath href={`#${id}`} />
          </animateMotion>
        </circle>
      )}

      {/* Delete button — shown on hover */}
      {hovered && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 10,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <button
              onClick={handleDelete}
              style={{
                width: 18, height: 18,
                borderRadius: '50%',
                background: '#334155',
                border: '1px solid #64748B',
                color: '#94A3B8',
                fontSize: 10,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
})

SignalEdge.displayName = 'SignalEdge'
export default SignalEdge
