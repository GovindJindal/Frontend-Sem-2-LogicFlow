/**
 * presets.js
 * Pre-built demo circuits for the Logic Gate Sandbox.
 * Each preset has: id, name, description, nodes[], edges[], inputStates{}
 *
 * Node positions are chosen so the circuit reads left-to-right cleanly.
 */

export const PRESETS = {
  'not-gate': {
    id: 'not-gate',
    name: 'NOT Gate Demo',
    description: 'The simplest circuit — one input, one output, inverted.',
    nodes: [
      { id: 'in1',  type: 'inputNode',  position: { x: 80,  y: 160 }, data: { label: 'A' } },
      { id: 'not1', type: 'gateNode',   position: { x: 240, y: 148 }, data: { gateType: 'NOT' } },
      { id: 'out1', type: 'outputNode', position: { x: 420, y: 155 }, data: { label: 'Q' } },
    ],
    edges: [
      { id: 'e1', source: 'in1', sourceHandle: 'out', target: 'not1', targetHandle: 'a', type: 'signalEdge' },
      { id: 'e2', source: 'not1', sourceHandle: 'out', target: 'out1', targetHandle: 'in', type: 'signalEdge' },
    ],
    inputStates: { in1: 0 },
  },

  'and-gate': {
    id: 'and-gate',
    name: 'AND Gate',
    description: 'Output is HIGH only when both inputs are HIGH.',
    nodes: [
      { id: 'in1',  type: 'inputNode',  position: { x: 80,  y: 120 }, data: { label: 'A' } },
      { id: 'in2',  type: 'inputNode',  position: { x: 80,  y: 200 }, data: { label: 'B' } },
      { id: 'and1', type: 'gateNode',   position: { x: 240, y: 148 }, data: { gateType: 'AND' } },
      { id: 'out1', type: 'outputNode', position: { x: 420, y: 155 }, data: { label: 'Q' } },
    ],
    edges: [
      { id: 'e1', source: 'in1', sourceHandle: 'out', target: 'and1', targetHandle: 'a', type: 'signalEdge' },
      { id: 'e2', source: 'in2', sourceHandle: 'out', target: 'and1', targetHandle: 'b', type: 'signalEdge' },
      { id: 'e3', source: 'and1', sourceHandle: 'out', target: 'out1', targetHandle: 'in', type: 'signalEdge' },
    ],
    inputStates: { in1: 0, in2: 0 },
  },

  'half-adder': {
    id: 'half-adder',
    name: 'Half Adder',
    description: 'Adds two 1-bit numbers. Sum = A XOR B, Carry = A AND B.',
    nodes: [
      { id: 'inA',   type: 'inputNode',  position: { x: 60,  y: 100 }, data: { label: 'A' } },
      { id: 'inB',   type: 'inputNode',  position: { x: 60,  y: 220 }, data: { label: 'B' } },
      { id: 'xor1',  type: 'gateNode',   position: { x: 240, y: 88  }, data: { gateType: 'XOR' } },
      { id: 'and1',  type: 'gateNode',   position: { x: 240, y: 208 }, data: { gateType: 'AND' } },
      { id: 'outS',  type: 'outputNode', position: { x: 430, y: 95  }, data: { label: 'SUM' } },
      { id: 'outC',  type: 'outputNode', position: { x: 430, y: 215 }, data: { label: 'CARRY' } },
    ],
    edges: [
      { id: 'e1', source: 'inA',  sourceHandle: 'out', target: 'xor1', targetHandle: 'a', type: 'signalEdge' },
      { id: 'e2', source: 'inB',  sourceHandle: 'out', target: 'xor1', targetHandle: 'b', type: 'signalEdge' },
      { id: 'e3', source: 'inA',  sourceHandle: 'out', target: 'and1', targetHandle: 'a', type: 'signalEdge' },
      { id: 'e4', source: 'inB',  sourceHandle: 'out', target: 'and1', targetHandle: 'b', type: 'signalEdge' },
      { id: 'e5', source: 'xor1', sourceHandle: 'out', target: 'outS', targetHandle: 'in', type: 'signalEdge' },
      { id: 'e6', source: 'and1', sourceHandle: 'out', target: 'outC', targetHandle: 'in', type: 'signalEdge' },
    ],
    inputStates: { inA: 0, inB: 0 },
  },

  'full-adder': {
    id: 'full-adder',
    name: 'Full Adder',
    description: 'Adds two bits plus a carry-in. Built from two Half Adders chained together.',
    nodes: [
      { id: 'inA',   type: 'inputNode',  position: { x: 50,  y: 80  }, data: { label: 'A'   } },
      { id: 'inB',   type: 'inputNode',  position: { x: 50,  y: 180 }, data: { label: 'B'   } },
      { id: 'inCin', type: 'inputNode',  position: { x: 50,  y: 300 }, data: { label: 'Cin' } },
      { id: 'xor1',  type: 'gateNode',   position: { x: 210, y: 110 }, data: { gateType: 'XOR' } },
      { id: 'xor2',  type: 'gateNode',   position: { x: 370, y: 110 }, data: { gateType: 'XOR' } },
      { id: 'and1',  type: 'gateNode',   position: { x: 210, y: 240 }, data: { gateType: 'AND' } },
      { id: 'and2',  type: 'gateNode',   position: { x: 370, y: 240 }, data: { gateType: 'AND' } },
      { id: 'or1',   type: 'gateNode',   position: { x: 510, y: 240 }, data: { gateType: 'OR'  } },
      { id: 'outS',  type: 'outputNode', position: { x: 530, y: 110 }, data: { label: 'SUM'   } },
      { id: 'outC',  type: 'outputNode', position: { x: 670, y: 240 }, data: { label: 'CARRY' } },
    ],
    edges: [
      { id: 'e1', source: 'inA',   sourceHandle: 'out', target: 'xor1', targetHandle: 'a', type: 'signalEdge' },
      { id: 'e2', source: 'inB',   sourceHandle: 'out', target: 'xor1', targetHandle: 'b', type: 'signalEdge' },
      { id: 'e3', source: 'inA',   sourceHandle: 'out', target: 'and1', targetHandle: 'a', type: 'signalEdge' },
      { id: 'e4', source: 'inB',   sourceHandle: 'out', target: 'and1', targetHandle: 'b', type: 'signalEdge' },
      { id: 'e5', source: 'xor1',  sourceHandle: 'out', target: 'xor2', targetHandle: 'a', type: 'signalEdge' },
      { id: 'e6', source: 'inCin', sourceHandle: 'out', target: 'xor2', targetHandle: 'b', type: 'signalEdge' },
      { id: 'e7', source: 'xor1',  sourceHandle: 'out', target: 'and2', targetHandle: 'a', type: 'signalEdge' },
      { id: 'e8', source: 'inCin', sourceHandle: 'out', target: 'and2', targetHandle: 'b', type: 'signalEdge' },
      { id: 'e9', source: 'and1',  sourceHandle: 'out', target: 'or1',  targetHandle: 'a', type: 'signalEdge' },
      { id: 'e10',source: 'and2',  sourceHandle: 'out', target: 'or1',  targetHandle: 'b', type: 'signalEdge' },
      { id: 'e11',source: 'xor2',  sourceHandle: 'out', target: 'outS', targetHandle: 'in', type: 'signalEdge' },
      { id: 'e12',source: 'or1',   sourceHandle: 'out', target: 'outC', targetHandle: 'in', type: 'signalEdge' },
    ],
    inputStates: { inA: 0, inB: 0, inCin: 0 },
  },

  'sr-flipflop': {
    id: 'sr-flipflop',
    name: 'SR Flip-Flop',
    description: 'NOR-NOR latch — the simplest memory element in digital circuits.',
    nodes: [
      { id: 'inS',  type: 'inputNode', position: { x: 60,  y: 100 }, data: { label: 'S' } },
      { id: 'inR',  type: 'inputNode', position: { x: 60,  y: 260 }, data: { label: 'R' } },
      { id: 'nor1', type: 'gateNode',  position: { x: 240, y: 88  }, data: { gateType: 'NOR' } },
      { id: 'nor2', type: 'gateNode',  position: { x: 240, y: 248 }, data: { gateType: 'NOR' } },
      { id: 'outQ',    type: 'outputNode', position: { x: 430, y: 95  }, data: { label: 'Q'  } },
      { id: 'outQbar', type: 'outputNode', position: { x: 430, y: 255 }, data: { label: "Q'" } },
    ],
    edges: [
      { id: 'e1', source: 'inS',  sourceHandle: 'out', target: 'nor1', targetHandle: 'a', type: 'signalEdge' },
      { id: 'e2', source: 'nor2', sourceHandle: 'out', target: 'nor1', targetHandle: 'b', type: 'signalEdge' },
      { id: 'e3', source: 'inR',  sourceHandle: 'out', target: 'nor2', targetHandle: 'b', type: 'signalEdge' },
      { id: 'e4', source: 'nor1', sourceHandle: 'out', target: 'nor2', targetHandle: 'a', type: 'signalEdge' },
      { id: 'e5', source: 'nor1', sourceHandle: 'out', target: 'outQ',    targetHandle: 'in', type: 'signalEdge' },
      { id: 'e6', source: 'nor2', sourceHandle: 'out', target: 'outQbar', targetHandle: 'in', type: 'signalEdge' },
    ],
    inputStates: { inS: 0, inR: 1 },
  },

  'mux-2to1': {
    id: 'mux-2to1',
    name: '2:1 Multiplexer',
    description: 'Routes one of two inputs to the output based on the selector line S.',
    nodes: [
      { id: 'inA',  type: 'inputNode', position: { x: 60,  y: 100 }, data: { label: 'A' } },
      { id: 'inB',  type: 'inputNode', position: { x: 60,  y: 200 }, data: { label: 'B' } },
      { id: 'inS',  type: 'inputNode', position: { x: 60,  y: 320 }, data: { label: 'S' } },
      { id: 'not1', type: 'gateNode',  position: { x: 200, y: 308 }, data: { gateType: 'NOT' } },
      { id: 'and1', type: 'gateNode',  position: { x: 340, y: 108 }, data: { gateType: 'AND' } },
      { id: 'and2', type: 'gateNode',  position: { x: 340, y: 228 }, data: { gateType: 'AND' } },
      { id: 'or1',  type: 'gateNode',  position: { x: 480, y: 168 }, data: { gateType: 'OR'  } },
      { id: 'outY', type: 'outputNode',position: { x: 640, y: 175 }, data: { label: 'Y'  } },
    ],
    edges: [
      { id: 'e1', source: 'inA',  sourceHandle: 'out', target: 'and1', targetHandle: 'a', type: 'signalEdge' },
      { id: 'e2', source: 'not1', sourceHandle: 'out', target: 'and1', targetHandle: 'b', type: 'signalEdge' },
      { id: 'e3', source: 'inB',  sourceHandle: 'out', target: 'and2', targetHandle: 'a', type: 'signalEdge' },
      { id: 'e4', source: 'inS',  sourceHandle: 'out', target: 'and2', targetHandle: 'b', type: 'signalEdge' },
      { id: 'e5', source: 'inS',  sourceHandle: 'out', target: 'not1', targetHandle: 'a', type: 'signalEdge' },
      { id: 'e6', source: 'and1', sourceHandle: 'out', target: 'or1',  targetHandle: 'a', type: 'signalEdge' },
      { id: 'e7', source: 'and2', sourceHandle: 'out', target: 'or1',  targetHandle: 'b', type: 'signalEdge' },
      { id: 'e8', source: 'or1',  sourceHandle: 'out', target: 'outY', targetHandle: 'in', type: 'signalEdge' },
    ],
    inputStates: { inA: 1, inB: 0, inS: 0 },
  },

  'nand-universal': {
    id: 'nand-universal',
    name: 'NAND as NOT',
    description: 'Demonstrates NAND as a universal gate — here wired as a NOT gate.',
    nodes: [
      { id: 'in1',   type: 'inputNode',  position: { x: 60,  y: 160 }, data: { label: 'A' } },
      { id: 'nand1', type: 'gateNode',   position: { x: 220, y: 148 }, data: { gateType: 'NAND' } },
      { id: 'out1',  type: 'outputNode', position: { x: 400, y: 155 }, data: { label: 'NOT A' } },
    ],
    edges: [
      { id: 'e1', source: 'in1', sourceHandle: 'out', target: 'nand1', targetHandle: 'a', type: 'signalEdge' },
      { id: 'e2', source: 'in1', sourceHandle: 'out', target: 'nand1', targetHandle: 'b', type: 'signalEdge' },
      { id: 'e3', source: 'nand1', sourceHandle: 'out', target: 'out1', targetHandle: 'in', type: 'signalEdge' },
    ],
    inputStates: { in1: 0 },
  },
}

export const PRESET_LIST = Object.values(PRESETS)
