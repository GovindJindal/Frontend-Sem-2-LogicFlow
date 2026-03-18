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
  // ─────────────────────────────────────────────────────────────
  // Experiment 4: Full Adder
  // ─────────────────────────────────────────────────────────────
  'full-adder': {
    id:         'full-adder',
    title:      'Full Adder',
    subtitle:   'Experiment 04 · Arithmetic Circuits',
    aim:        'Build a 1-bit full adder using two Half Adders and verify all eight input combinations including carry-in.',
    badgeColor: '#0E7490',
    presetId:   'full-adder',
    theory:
      'A Full Adder adds three 1-bit inputs: A, B, and a Carry-in (Cin) from a previous stage. ' +
      'It produces a SUM bit and a CARRY-out. Internally it is built from two Half Adders and an OR gate. ' +
      'SUM = A XOR B XOR Cin. CARRY = (A AND B) OR ((A XOR B) AND Cin). ' +
      'Eight Full Adders chained together form an 8-bit ripple-carry adder — the standard ALU building block.',

    steps: [
      {
        id: 1,
        title: 'Identify the Structure',
        instruction:
          'The Full Adder has three inputs (A, B, Cin) and two outputs (SUM, CARRY). ' +
          'Trace the two XOR gates — they form the first and second Half Adder stages. ' +
          'The two AND gates feed an OR gate to produce the carry. ' +
          'All inputs are currently 0. SUM=0, CARRY=0.',
        hint: 'Follow the signal path: A and B → XOR1 → XOR2 (with Cin) → SUM.',
        highlightNodes: ['xor1', 'xor2'],
        checkFn: (inp, out) =>
          inp['inA'] === 0 && inp['inB'] === 0 && inp['inCin'] === 0,
      },
      {
        id: 2,
        title: 'Verify A=1, B=0, Cin=0',
        instruction:
          'Click input A to set it to 1. Keep B and Cin at 0. ' +
          'Expected: SUM=1, CARRY=0. This is just like a Half Adder — 1+0+0 = 1.',
        hint: 'Toggle only the A input node. B and Cin stay at 0.',
        highlightNodes: ['inA', 'outS'],
        checkFn: (inp, out) =>
          inp['inA'] === 1 && inp['inB'] === 0 && inp['inCin'] === 0 &&
          out['outS'] === 1 && out['outC'] === 0,
      },
      {
        id: 3,
        title: 'Verify A=1, B=1, Cin=0',
        instruction:
          'Set A=1 and B=1, keep Cin=0. ' +
          'Expected: SUM=0, CARRY=1. Same as a Half Adder — 1+1=10 in binary.',
        hint: 'Toggle B to 1. Keep Cin at 0.',
        highlightNodes: ['and1', 'outC'],
        checkFn: (inp, out) =>
          inp['inA'] === 1 && inp['inB'] === 1 && inp['inCin'] === 0 &&
          out['outS'] === 0 && out['outC'] === 1,
      },
      {
        id: 4,
        title: 'The Key Case — A=1, B=1, Cin=1',
        instruction:
          'Now set all three inputs to 1. ' +
          'Expected: SUM=1, CARRY=1. Because 1+1+1 = 3 = 11 in binary — both bits are 1! ' +
          'Watch both AND gates and the OR gate all activate simultaneously.',
        hint: 'Click the Cin (carry-in) input to toggle it to 1.',
        highlightNodes: ['and1', 'and2', 'or1', 'outS', 'outC'],
        checkFn: (inp, out) =>
          inp['inA'] === 1 && inp['inB'] === 1 && inp['inCin'] === 1 &&
          out['outS'] === 1 && out['outC'] === 1,
      },
      {
        id: 5,
        title: 'Full Truth Table',
        instruction:
          'You have verified the key rows. The complete 8-row truth table is:\n\n' +
          '0+0+0=0,c0 · 0+0+1=1,c0 · 0+1+0=1,c0 · 0+1+1=0,c1\n' +
          '1+0+0=1,c0 · 1+0+1=0,c1 · 1+1+0=0,c1 · 1+1+1=1,c1\n\n' +
          'Chain 8 Full Adders together and you have an 8-bit adder — the core of every ALU.',
        isConclusion: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Experiment 5: SR Flip-Flop
  // ─────────────────────────────────────────────────────────────
  'sr-flipflop': {
    id:         'sr-flipflop',
    title:      'SR Flip-Flop',
    subtitle:   'Experiment 05 · Sequential Logic',
    aim:        'Build an SR latch using NOR gates and demonstrate the Set, Reset, and Hold (Memory) states.',
    badgeColor: '#7C3AED',
    presetId:   'sr-flipflop',
    theory:
      'The SR Flip-Flop is the simplest sequential circuit — it has MEMORY. ' +
      'Unlike combinational circuits, the output depends not just on current inputs but on previous state. ' +
      'Built from two cross-coupled NOR gates: SET (S=1,R=0) forces Q=1; RESET (S=0,R=1) forces Q=0; ' +
      'HOLD (S=0,R=0) maintains the previous state. S=1,R=1 is the INVALID (forbidden) state.',

    steps: [
      {
        id: 1,
        title: 'Observe the RESET State',
        instruction:
          'The circuit loads with S=0, R=1 (RESET). ' +
          'Observe: Q=0, Q\'=1. This is the initial reset state. ' +
          'The two NOR gates are cross-coupled — the output of each feeds back into the input of the other.',
        hint: 'Q output (top) should be 0 (red). Q\' output (bottom) should be 1 (green).',
        highlightNodes: ['nor1', 'nor2'],
        checkFn: (inp, out) => inp['inR'] === 1 && inp['inS'] === 0,
      },
      {
        id: 2,
        title: 'SET — Apply S=1, R=0',
        instruction:
          'Click R to set it to 0, then click S to set it to 1. ' +
          'Watch Q flip to 1 and Q\' flip to 0. The latch is now SET. ' +
          'This is the SET operation — like writing a 1 to memory.',
        hint: 'First toggle R to 0, then toggle S to 1.',
        highlightNodes: ['inS', 'outQ'],
        checkFn: (inp, out) =>
          inp['inS'] === 1 && inp['inR'] === 0 && out['outQ'] === 1,
      },
      {
        id: 3,
        title: 'HOLD — Apply S=0, R=0 (Memory!)',
        instruction:
          'Now click S back to 0. Both S and R are now 0. ' +
          'Notice Q stays at 1 — the circuit REMEMBERS the previous Set state. ' +
          'This is why flip-flops are used as memory cells — they hold state without power to the inputs.',
        hint: 'Toggle S back to 0. Both inputs should now be 0. Q should still be 1.',
        highlightNodes: ['outQ', 'outQbar'],
        checkFn: (inp, out) =>
          inp['inS'] === 0 && inp['inR'] === 0 && out['outQ'] === 1,
      },
      {
        id: 4,
        title: 'RESET — Apply S=0, R=1',
        instruction:
          'Click R to set it to 1. Q immediately drops to 0, Q\' goes to 1. ' +
          'The latch is RESET back to its initial state. ' +
          'You have now demonstrated the complete Set → Hold → Reset cycle.',
        hint: 'Toggle R to 1. Q should flip back to 0.',
        highlightNodes: ['inR', 'outQ'],
        checkFn: (inp, out) =>
          inp['inS'] === 0 && inp['inR'] === 1 && out['outQ'] === 0,
      },
      {
        id: 5,
        title: 'Memory Demonstrated',
        instruction:
          'You have verified all valid SR states:\n\n' +
          'S=0, R=1 → Q=0 (RESET)\n' +
          'S=1, R=0 → Q=1 (SET)\n' +
          'S=0, R=0 → Q holds (MEMORY)\n' +
          'S=1, R=1 → INVALID (avoid — undefined state)\n\n' +
          'This latch is the building block for D flip-flops, registers, and RAM.',
        isConclusion: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Experiment 6: 2:1 Multiplexer
  // ─────────────────────────────────────────────────────────────
  'mux-2to1': {
    id:         'mux-2to1',
    title:      '2:1 Multiplexer',
    subtitle:   'Experiment 06 · Combinational Circuits',
    aim:        'Implement a 2:1 multiplexer using AND-OR-NOT logic and verify signal routing with all selector combinations.',
    badgeColor: '#059669',
    presetId:   'mux-2to1',
    theory:
      'A Multiplexer (MUX) is a data selector — it routes one of multiple input signals to a single output. ' +
      'A 2:1 MUX has two data inputs (A, B), one selector line (S), and one output (Y). ' +
      'When S=0, Y=A. When S=1, Y=B. ' +
      'Boolean expression: Y = (A · S̄) + (B · S). ' +
      'MUXes are used in ALUs, data buses, memory addressing, and communication systems.',

    steps: [
      {
        id: 1,
        title: 'Understand the Circuit',
        instruction:
          'The MUX has three inputs: A=1, B=0, S=0 (loaded as initial state). ' +
          'Trace the path: S goes through a NOT gate to produce S̄. ' +
          'AND1 computes A · S̄, AND2 computes B · S. OR combines both.',
        hint: 'Follow from S → NOT → AND1 (with A). AND2 takes B and S directly.',
        highlightNodes: ['not1', 'and1', 'and2', 'or1'],
        checkFn: (inp) => inp['inA'] === 1 && inp['inB'] === 0 && inp['inS'] === 0,
      },
      {
        id: 2,
        title: 'S=0 → Output follows A',
        instruction:
          'With S=0, the NOT gate produces 1, so AND1 passes A through. AND2 is blocked (S=0). ' +
          'Current state: A=1, S=0 → Y should equal 1 (following A). ' +
          'Verify: toggle A to 0 — Y should drop to 0 instantly.',
        hint: 'Click input A to toggle it to 0. Y should follow A.',
        highlightNodes: ['inA', 'outY'],
        checkFn: (inp, out) =>
          inp['inS'] === 0 && out['outY'] === inp['inA'],
      },
      {
        id: 3,
        title: 'S=1 → Output follows B',
        instruction:
          'Click S to set it to 1. Now AND1 is blocked (S̄=0) and AND2 passes B through. ' +
          'Set B=1 — Y should become 1. Toggle B back to 0 — Y should follow B to 0.',
        hint: 'Toggle S to 1 first. Then try changing B and watch Y follow it.',
        highlightNodes: ['inB', 'inS', 'outY'],
        checkFn: (inp, out) =>
          inp['inS'] === 1 && out['outY'] === inp['inB'],
      },
      {
        id: 4,
        title: 'Verify Both Select States',
        instruction:
          'Complete the verification: with S=1 and B=0, set A=1. Y should remain 0 (B=0). ' +
          'A is completely ignored when S=1. This proves the MUX correctly selects the channel.',
        hint: 'Keep S=1, set A=1, B=0. Y should stay 0 since B is selected.',
        highlightNodes: ['inA', 'inS', 'outY'],
        checkFn: (inp, out) =>
          inp['inS'] === 1 && inp['inA'] === 1 && inp['inB'] === 0 && out['outY'] === 0,
      },
      {
        id: 5,
        title: 'MUX Verified',
        instruction:
          'You have confirmed both select states:\n\n' +
          'S=0 → Y = A (input A is selected)\n' +
          'S=1 → Y = B (input B is selected)\n\n' +
          'A 4:1 MUX extends this with 2 selector lines and 4 inputs. ' +
          'In CPUs, MUXes choose between ALU operands, memory vs register data, and instruction paths.',
        isConclusion: true,
      },
    ],
  },
}

export const QUICK_LAB_LIST = Object.values(QUICK_LAB_EXPERIMENTS)
