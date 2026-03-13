import { create } from 'zustand'

/**
 * gateStore — state for the Logic Gate Sandbox
 *
 * Undo strategy: snapshot-based.
 * Before any structural mutation, call pushSnapshot() to save the full
 * { nodes, edges, inputStates }. undo() restores the most recent snapshot.
 */
export const useGateStore = create((set, get) => ({
  nodes:        [],
  edges:        [],
  inputStates:  {},
  outputStates: {},
  snapshots:    [],   // each entry: { nodes, edges, inputStates }

  // ── Snapshot helpers ──────────────────────────────────────────
  pushSnapshot: () => {
    const { nodes, edges, inputStates, snapshots } = get()
    set({
      snapshots: [
        ...snapshots.slice(-19),
        { nodes: [...nodes], edges: [...edges], inputStates: { ...inputStates } },
      ],
    })
  },

  undo: () => {
    const { snapshots } = get()
    if (snapshots.length === 0) return
    const prev = snapshots[snapshots.length - 1]
    set({
      nodes:        prev.nodes,
      edges:        prev.edges,
      inputStates:  prev.inputStates,
      outputStates: {},
      snapshots:    snapshots.slice(0, -1),
    })
  },

  // ── Mutations ─────────────────────────────────────────────────
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) => {
    get().pushSnapshot()
    set((s) => ({ nodes: [...s.nodes, node] }))
  },

  removeNode: (id) => {
    get().pushSnapshot()
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
    }))
  },

  addEdge: (edge) => {
    get().pushSnapshot()
    set((s) => ({ edges: [...s.edges, edge] }))
  },

  toggleInput: (nodeId) =>
    set((s) => ({
      inputStates: {
        ...s.inputStates,
        [nodeId]: s.inputStates[nodeId] === 1 ? 0 : 1,
      },
    })),

  setInputState: (nodeId, val) =>
    set((s) => ({
      inputStates: { ...s.inputStates, [nodeId]: val },
    })),

  setOutputStates: (states) => set({ outputStates: states }),

  resetCanvas: () =>
    set({ nodes: [], edges: [], inputStates: {}, outputStates: {}, snapshots: [] }),

  loadPreset: (preset) =>
    set({
      nodes:        preset.nodes,
      edges:        preset.edges,
      inputStates:  preset.inputStates || {},
      outputStates: {},
      snapshots:    [],
    }),
}))
