import { create } from 'zustand'

/**
 * diodeStore — state for the PN Junction Diode experiment
 * Consumed by: DiodeCircuit, VIGraph, Multimeter, BiasToggle
 */
export const useDiodeStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────
  voltage:          0.0,      // Applied voltage in Volts  (-2 to +1.5)
  biasMode:         'forward', // 'forward' | 'reverse'
  temperature:      25,        // °C  (0 – 100)

  // Diode parameters (silicon defaults)
  saturationCurrent: 1e-12,   // Is in Amperes
  idealityFactor:    1,        // n

  // ── Derived (computed on demand by VIGraph) ───────────────────
  // No derived state here — components call diodePhysics.js directly

  // ── Actions ───────────────────────────────────────────────────
  setVoltage:     (v)    => set({ voltage: v }),
  setBiasMode:    (mode) => set({ biasMode: mode, voltage: 0 }),
  setTemperature: (t)    => set({ temperature: t }),
  reset:          ()     => set({ voltage: 0, biasMode: 'forward', temperature: 25 }),
}))
