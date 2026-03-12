import { create } from 'zustand'

/**
 * gateStore — state for the Logic Gate Sandbox
 * Consumed by: GateCanvas, WireLayer, TruthTable, GatePalette
 */
export const useGateStore = create((set, get) => ({
  // ReactFlow nodes (gates + input/output nodes)
  nodes: [],
  // ReactFlow edges (wires)
  edges: [],
  // Input signal states: { nodeId: 0 | 1 }
  inputStates: {},
  // Computed output states: { nodeId: 0 | 1 }
  outputStates: {},
  // Undo history (last 10 actions)
  history: [],

  // ── Actions ───────────────────────────────────────────────────
  setNodes:   (nodes) => set({ nodes }),
  setEdges:   (edges) => set({ edges }),

  addGate: (gate) => set((s) => ({
    nodes: [...s.nodes, gate],
    history: [...s.history.slice(-9), { type: 'addGate', gate }],
  })),

  removeGate: (id) => set((s) => ({
    nodes:  s.nodes.filter((n) => n.id !== id),
    edges:  s.edges.filter((e) => e.source !== id && e.target !== id),
    history: [...s.history.slice(-9), { type: 'removeGate', id }],
  })),

  toggleInput: (nodeId) => set((s) => ({
    inputStates: {
      ...s.inputStates,
      [nodeId]: s.inputStates[nodeId] === 1 ? 0 : 1,
    },
  })),

  setOutputStates: (states) => set({ outputStates: states }),

  undo: () => {/* TODO Day 5 */},

  resetCanvas: () => set({ nodes: [], edges: [], inputStates: {}, outputStates: {}, history: [] }),

  // Load a pre-built demo circuit from JSON
  loadPreset: (preset) => set({
    nodes:       preset.nodes,
    edges:       preset.edges,
    inputStates: preset.inputStates || {},
    outputStates: {},
    history: [],
  }),
}))
