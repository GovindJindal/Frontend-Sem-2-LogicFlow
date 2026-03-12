import { create } from 'zustand'

/**
 * zenerStore — state for the Zener Diode experiment
 * Consumed by: ZenerLab, VIGraph, Multimeter
 */
export const useZenerStore = create((set) => ({
  voltage:          0.0,    // Applied voltage (-8 to +1.5)
  breakdownVoltage: -5.6,   // Vz — configurable in What-If mode
  temperature:      25,
  whatIfMode:       false,  // Toggle to enable Vz + temp sliders

  setVoltage:          (v)  => set({ voltage: v }),
  setBreakdownVoltage: (vz) => set({ breakdownVoltage: vz }),
  setTemperature:      (t)  => set({ temperature: t }),
  toggleWhatIf:        ()   => set((s) => ({ whatIfMode: !s.whatIfMode })),
  reset:               ()   => set({ voltage: 0, breakdownVoltage: -5.6, temperature: 25, whatIfMode: false }),
}))
