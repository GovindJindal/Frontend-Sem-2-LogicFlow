import { create } from 'zustand'

/**
 * rectifierStore — state for the Rectifier Circuits experiment
 * Consumed by: RectifierLab
 *
 * Supports half-wave and full-wave bridge rectifiers
 * with optional RC filter capacitor.
 */
export const useRectifierStore = create((set) => ({
  circuitType:    'half-wave',  // 'half-wave' | 'full-wave'
  amplitude:      10,           // Peak input voltage Vm (V)  1–20
  frequency:      50,           // Hz  25–100
  filterEnabled:  false,        // RC filter capacitor on/off
  capacitance:    100,          // µF  10–1000
  loadResistance: 1000,         // Ω   100–10000

  setCircuitType:    (t) => set({ circuitType: t }),
  setAmplitude:      (v) => set({ amplitude: v }),
  setFrequency:      (f) => set({ frequency: f }),
  toggleFilter:      ()  => set((s) => ({ filterEnabled: !s.filterEnabled })),
  setCapacitance:    (c) => set({ capacitance: c }),
  setLoadResistance: (r) => set({ loadResistance: r }),
  reset: () => set({
    circuitType: 'half-wave', amplitude: 10, frequency: 50,
    filterEnabled: false, capacitance: 100, loadResistance: 1000,
  }),
}))
