/**
 * gateLogic.js
 * Pure logic functions for the gate sandbox.
 * All functions take 0/1 inputs and return 0/1 outputs.
 */

export const andGate  = (a, b) => (a & b) & 1
export const orGate   = (a, b) => (a | b) & 1
export const notGate  = (a)    => a === 1 ? 0 : 1
export const nandGate = (a, b) => notGate(andGate(a, b))
export const norGate  = (a, b) => notGate(orGate(a, b))
export const xorGate  = (a, b) => (a ^ b) & 1
export const xnorGate = (a, b) => notGate(xorGate(a, b))

/** Map gate type string to its function */
export const GATE_FUNCTIONS = {
  AND:  andGate,
  OR:   orGate,
  NOT:  notGate,
  NAND: nandGate,
  NOR:  norGate,
  XOR:  xorGate,
  XNOR: xnorGate,
}

/**
 * Topologically sort nodes and propagate signals.
 * @param {Array} nodes     - ReactFlow nodes
 * @param {Array} edges     - ReactFlow edges
 * @param {Object} inputs   - { nodeId: 0|1 } for INPUT nodes
 * @returns {Object}        - { nodeId: 0|1 } for all nodes
 */
export function propagateSignals(nodes, edges, inputs) {
  const signals = { ...inputs }

  // Build adjacency: targetHandle → sourceNodeId
  const connections = {}
  edges.forEach((e) => {
    if (!connections[e.target]) connections[e.target] = {}
    connections[e.target][e.targetHandle] = e.source
  })

  // Simple iterative propagation (max 10 passes for cycles)
  for (let pass = 0; pass < 10; pass++) {
    nodes.forEach((node) => {
      if (node.type === 'inputNode') return // already in signals

      const fn = GATE_FUNCTIONS[node.data?.gateType]
      if (!fn) return

      const conn = connections[node.id] || {}
      const a = signals[conn['a']] ?? 0
      const b = signals[conn['b']] ?? 0

      const result = node.data.gateType === 'NOT' ? fn(a) : fn(a, b)
      signals[node.id] = result
    })
  }

  return signals
}

/**
 * Generate a full truth table for the current circuit.
 * @param {Array} nodes
 * @param {Array} edges
 * @returns {Array<{inputs: Object, outputs: Object}>}
 */
export function generateTruthTable(nodes, edges) {
  const inputNodes  = nodes.filter((n) => n.type === 'inputNode')
  const outputNodes = nodes.filter((n) => n.type === 'outputNode')

  if (inputNodes.length === 0 || outputNodes.length === 0) return []

  const rows = []
  const combinations = 1 << inputNodes.length  // 2^n

  for (let i = 0; i < combinations; i++) {
    const inputState = {}
    inputNodes.forEach((node, idx) => {
      inputState[node.id] = (i >> (inputNodes.length - 1 - idx)) & 1
    })

    const allSignals = propagateSignals(nodes, edges, inputState)

    const inputRow  = {}
    const outputRow = {}
    inputNodes.forEach((n)  => (inputRow[n.data.label  || n.id] = inputState[n.id]))
    outputNodes.forEach((n) => (outputRow[n.data.label || n.id] = allSignals[n.id] ?? 0))

    rows.push({ inputs: inputRow, outputs: outputRow })
  }

  return rows
}
