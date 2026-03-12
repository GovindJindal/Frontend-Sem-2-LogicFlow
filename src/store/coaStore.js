import { create } from 'zustand'

// Stages of the instruction pipeline
export const STAGES = ['Fetch', 'Decode', 'Execute', 'WriteBack']

// Sample instruction program (5 instructions)
const SAMPLE_PROGRAM = [
  { mnemonic: 'LOAD',  operand: '0x10', description: 'Load value from memory address 0x10 into Accumulator' },
  { mnemonic: 'ADD',   operand: '0x11', description: 'Add value at address 0x11 to Accumulator' },
  { mnemonic: 'STORE', operand: '0x20', description: 'Store Accumulator value into memory address 0x20' },
  { mnemonic: 'JUMP',  operand: '0x00', description: 'Jump to address 0x00 if Zero flag is set' },
  { mnemonic: 'HALT',  operand: null,   description: 'Stop execution' },
]

/**
 * coaStore — state for the Computer Architecture module
 * Consumed by: PipelineStepper, RegisterPanel, FlagDisplay
 */
export const useCoaStore = create((set, get) => ({
  // Pipeline
  currentStage:       0,           // index into STAGES[]
  currentInstruction: 0,           // index into program[]
  program:            SAMPLE_PROGRAM,
  isComplete:         false,

  // Registers (8-bit values, 0-255)
  pc:  0,    // Program Counter
  ir:  0,    // Instruction Register
  mar: 0,    // Memory Address Register
  mdr: 0,    // Memory Data Register
  acc: 0,    // Accumulator

  // Flags
  flags: {
    zero:     false,
    carry:    false,
    overflow: false,
    sign:     false,
  },

  // ── Actions ───────────────────────────────────────────────────
  nextStage: () => {
    const { currentStage, currentInstruction, program } = get()
    const nextStage = (currentStage + 1) % STAGES.length
    const nextInstr = nextStage === 0 ? currentInstruction + 1 : currentInstruction
    const isComplete = nextInstr >= program.length

    // Simulate register changes per stage (simplified)
    const updates = {}
    if (STAGES[currentStage] === 'Fetch')     updates.ir  = (currentInstruction * 17 + 42) % 256
    if (STAGES[currentStage] === 'Decode')    updates.mar = (currentInstruction * 8)  % 256
    if (STAGES[currentStage] === 'Execute')   updates.acc = (get().acc + currentInstruction * 7) % 256
    if (STAGES[currentStage] === 'WriteBack') updates.pc  = nextInstr

    set({ currentStage: nextStage, currentInstruction: nextInstr, isComplete, ...updates })
  },

  resetPipeline: () => set({
    currentStage: 0, currentInstruction: 0, isComplete: false,
    pc: 0, ir: 0, mar: 0, mdr: 0, acc: 0,
    flags: { zero: false, carry: false, overflow: false, sign: false },
  }),

  loadProgram: (program) => set({ program, currentStage: 0, currentInstruction: 0, isComplete: false }),
}))
