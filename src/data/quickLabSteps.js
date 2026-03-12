/**
 * quickLabSteps.js
 * Step-by-step guided experiments for the Quick Lab overlay.
 * Each experiment maps to a preset circuit ID and has an array of steps.
 * Each step has: title, instruction, hint, highlightNodes[], targetInputs{}
 */

export const QUICK_LAB_EXPERIMENTS = {
  'not-gate': {
    id: 'not-gate',
    title: 'NOT Gate — Signal Inverter',
    subtitle: 'Experiment 03-A',
    badgeColor: '#7C3AED',
    presetId: 'not-gate',
    aim: 'Verify that a NOT gate always produces the complement of its input.',
    theory: 'The NOT gate (inverter) is the simplest logic gate. It has one input and one output. When input is HIGH (1), output is LOW (0) — and vice versa. Boolean expression: Q = Ā',
    steps: [
      {
        id: 1,
        title: 'Observe the initial state',
        instruction: 'The circuit is loaded with input A = 0. Notice the output Q is currently 1 (HIGH, green LED). This confirms: NOT 0 = 1.',
        hint: 'Look at the LED indicator on the right — it should be glowing green.',
        highlightNodes: ['in1', 'out1'],
        targetInputs: null,
      },
      {
        id: 2,
        title: 'Toggle input A to HIGH',
        instruction: 'Click the INPUT node labelled "A" to flip it to 1. Watch the signal colour on the wire change from red to green, and the output should flip to 0.',
        hint: 'Click directly on the square "A" node on the left side of the circuit.',
        highlightNodes: ['in1'],
        targetInputs: { in1: 1 },
        checkFn: (inputStates, outputStates) => inputStates['in1'] === 1 && outputStates['out1'] === 0,
      },
      {
        id: 3,
        title: 'Toggle back to LOW',
        instruction: 'Click input A again to return it to 0. The output returns to 1. You have verified the complete truth table of a NOT gate.',
        hint: 'Click the "A" node to toggle it back to 0.',
        highlightNodes: ['in1', 'out1'],
        targetInputs: { in1: 0 },
        checkFn: (inputStates, outputStates) => inputStates['in1'] === 0 && outputStates['out1'] === 1,
      },
      {
        id: 4,
        title: 'Read the Truth Table',
        instruction: 'Look at the Truth Table panel on the right — the currently active row (highlighted in blue) matches your input. The NOT gate has only 2 rows. Record both in your lab book.',
        hint: 'The blue-highlighted row in the truth table shows the current live state.',
        highlightNodes: [],
        targetInputs: null,
        isConclusion: true,
      },
    ],
  },

  'half-adder': {
    id: 'half-adder',
    title: 'Half Adder — 1-bit Addition',
    subtitle: 'Experiment 03-B',
    badgeColor: '#059669',
    presetId: 'half-adder',
    aim: 'Build and verify a Half Adder circuit that adds two 1-bit binary numbers.',
    theory: 'A half adder adds two single bits A and B, producing a SUM and a CARRY. SUM = A XOR B (the result bit), CARRY = A AND B (carry into the next bit position). It uses exactly two gates.',
    steps: [
      {
        id: 1,
        title: 'Identify the two gates',
        instruction: 'The circuit contains an XOR gate (produces the SUM) and an AND gate (produces the CARRY). Both gates receive inputs A and B. Trace the wire paths with your eyes.',
        hint: 'Notice how both wires from A and B split — one path goes to XOR, one to AND.',
        highlightNodes: ['inA', 'inB', 'xor1', 'and1'],
        targetInputs: null,
      },
      {
        id: 2,
        title: 'Test: A=0, B=0',
        instruction: 'Both inputs are currently 0. Verify: 0 + 0 = 0, carry = 0. SUM should be 0 (red), CARRY should be 0 (red).',
        hint: 'Both output LEDs should be red (LOW). This is the trivial case.',
        highlightNodes: ['outS', 'outC'],
        targetInputs: { inA: 0, inB: 0 },
        checkFn: (inp, out) => inp['inA'] === 0 && inp['inB'] === 0,
      },
      {
        id: 3,
        title: 'Test: A=1, B=0',
        instruction: 'Click input A to make it 1, keep B at 0. Now 1 + 0 = 1, carry = 0. SUM should go HIGH (green), CARRY stays LOW.',
        hint: 'Click the "A" input node to toggle it to 1.',
        highlightNodes: ['inA'],
        targetInputs: { inA: 1, inB: 0 },
        checkFn: (inp, out) => inp['inA'] === 1 && inp['inB'] === 0 && out['outS'] === 1 && out['outC'] === 0,
      },
      {
        id: 4,
        title: 'Test: A=0, B=1',
        instruction: 'Click A back to 0, then click B to make it 1. 0 + 1 = 1, carry = 0. SUM HIGH, CARRY LOW — same as before by symmetry.',
        hint: 'Click "A" to return to 0, then click "B" to set to 1.',
        highlightNodes: ['inB'],
        targetInputs: { inA: 0, inB: 1 },
        checkFn: (inp, out) => inp['inA'] === 0 && inp['inB'] === 1 && out['outS'] === 1 && out['outC'] === 0,
      },
      {
        id: 5,
        title: 'Test: A=1, B=1 — the carry case',
        instruction: 'Set both A and B to 1. Now 1 + 1 = 10 in binary — SUM = 0, CARRY = 1. Watch the CARRY LED light up green!',
        hint: 'Click the "A" node to set it back to 1, keeping B=1.',
        highlightNodes: ['inA', 'inB', 'outC'],
        targetInputs: { inA: 1, inB: 1 },
        checkFn: (inp, out) => inp['inA'] === 1 && inp['inB'] === 1 && out['outS'] === 0 && out['outC'] === 1,
      },
      {
        id: 6,
        title: 'Verify the truth table',
        instruction: 'You have tested all 4 input combinations. The truth table panel on the right should show all 4 rows. Export it as CSV for your lab record.',
        hint: 'Click "Export CSV" at the bottom of the truth table panel.',
        highlightNodes: [],
        targetInputs: null,
        isConclusion: true,
      },
    ],
  },

  'nand-universal': {
    id: 'nand-universal',
    title: 'NAND — Universal Gate',
    subtitle: 'Experiment 03-C',
    badgeColor: '#B45309',
    presetId: 'nand-universal',
    aim: 'Demonstrate that NAND is a universal gate by wiring it to behave as a NOT gate.',
    theory: 'A universal gate can implement any Boolean function by itself. NAND is universal. When both inputs of a NAND gate are tied together, it behaves as a NOT gate: NAND(A,A) = NOT(AND(A,A)) = NOT A.',
    steps: [
      {
        id: 1,
        title: 'Observe the wiring',
        instruction: 'Notice that both input lines of the NAND gate come from the same source — input A. Both handles (a and b) are wired to A. This is the trick that makes it a NOT gate.',
        hint: 'Trace both wires from the NAND gate backward — they both lead to the same input node.',
        highlightNodes: ['in1', 'nand1'],
        targetInputs: null,
      },
      {
        id: 2,
        title: 'Toggle A — confirm NOT behaviour',
        instruction: 'Click input A to toggle it. With A=0: NAND(0,0) = NOT(0) = 1. With A=1: NAND(1,1) = NOT(1) = 0. The output always inverts A.',
        hint: 'Toggle A a few times and watch the output node — it always opposes A.',
        highlightNodes: ['in1', 'nand1', 'out1'],
        targetInputs: null,
        checkFn: (inp, out) => {
          const a = inp['in1'] ?? 0
          return out['nand1'] === (a === 1 ? 0 : 1)
        },
      },
      {
        id: 3,
        title: 'The universal gate principle',
        instruction: 'Because NAND can implement NOT, and any circuit can be built from NOT + AND (or NOT + OR), NAND can implement any logic function. This is why CPUs are built primarily from NAND gates.',
        hint: 'This is a conceptual step — read the theory and make a note.',
        highlightNodes: [],
        targetInputs: null,
        isConclusion: true,
      },
    ],
  },
}

export const QUICK_LAB_LIST = Object.values(QUICK_LAB_EXPERIMENTS)
