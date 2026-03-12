/**
 * diodePhysics.js
 * Pure physics calculations for diode simulations.
 * No React, no state — just math.
 *
 * References:
 *  - Shockley diode equation: I = Is * (e^(V / n*Vt) - 1)
 *  - Thermal voltage: Vt = kT/q  ≈ 0.02585V at 25°C
 */

const BOLTZMANN = 1.380649e-23  // J/K
const ELECTRON_CHARGE = 1.602176634e-19  // C

/**
 * Thermal voltage at a given temperature.
 * @param {number} tempC - Temperature in Celsius
 * @returns {number} Vt in Volts
 */
export function thermalVoltage(tempC) {
  const tempK = tempC + 273.15
  return (BOLTZMANN * tempK) / ELECTRON_CHARGE
}

/**
 * Shockley diode equation — single point.
 * @param {number} v      - Applied voltage (V)
 * @param {number} tempC  - Temperature (°C)
 * @param {number} Is     - Saturation current (A), default 1e-12 (silicon)
 * @param {number} n      - Ideality factor, default 1
 * @returns {number} Current in Amperes
 */
export function diodeCurrent(v, tempC = 25, Is = 1e-12, n = 1) {
  const Vt = thermalVoltage(tempC)
  return Is * (Math.exp(v / (n * Vt)) - 1)
}

/**
 * Generate a full V-I curve array for Recharts.
 * @param {string} mode     - 'forward' | 'reverse'
 * @param {number} tempC    - Temperature (°C)
 * @param {number} Is       - Saturation current (A)
 * @param {number} n        - Ideality factor
 * @param {number} points   - Number of data points (default 200)
 * @returns {Array<{v: number, i: number}>}
 */
export function generateDiodeCurve(mode = 'forward', tempC = 25, Is = 1e-12, n = 1, points = 200) {
  const range = mode === 'forward'
    ? { min: -0.5, max: 1.0 }
    : { min: -2.0, max: 0.5 }

  const step = (range.max - range.min) / points
  const curve = []

  for (let i = 0; i <= points; i++) {
    const v = range.min + i * step
    const rawI = diodeCurrent(v, tempC, Is, n)
    // Clamp to ±100mA for display
    const i_mA = Math.min(Math.max(rawI * 1000, -100), 100)
    curve.push({ v: parseFloat(v.toFixed(3)), i: parseFloat(i_mA.toFixed(4)) })
  }

  return curve
}

/**
 * Zener diode curve with reverse breakdown.
 * @param {number} Vz   - Breakdown voltage (negative, e.g. -5.6)
 * @param {number} tempC
 * @param {number} Is
 * @param {number} points
 * @returns {Array<{v: number, i: number}>}
 */
export function generateZenerCurve(Vz = -5.6, tempC = 25, Is = 1e-12, points = 300) {
  const minV = Vz - 1.5
  const maxV = 1.0
  const step = (maxV - minV) / points
  const curve = []

  for (let i = 0; i <= points; i++) {
    const v = minV + i * step
    let current

    if (v < Vz) {
      // Breakdown region: sharp current increase
      const excess = Vz - v
      current = -Is * 1000 * Math.exp(excess * 2)
    } else if (v < 0) {
      // Reverse region (before breakdown): tiny leakage
      current = diodeCurrent(v, tempC, Is) * 1000
    } else {
      // Forward region: normal diode
      current = diodeCurrent(v, tempC, Is) * 1000
    }

    // Clamp for display
    const i_mA = Math.min(Math.max(current, -150), 100)
    curve.push({ v: parseFloat(v.toFixed(3)), i: parseFloat(i_mA.toFixed(4)) })
  }

  return curve
}

/**
 * Format current for multimeter display.
 * Auto-selects mA or µA based on magnitude.
 * @param {number} amps
 * @returns {{ value: string, unit: string }}
 */
export function formatCurrent(amps) {
  const abs = Math.abs(amps)
  if (abs >= 0.001) {
    return { value: (amps * 1000).toFixed(3), unit: 'mA' }
  } else if (abs >= 1e-6) {
    return { value: (amps * 1e6).toFixed(2), unit: 'µA' }
  } else {
    return { value: (amps * 1e9).toFixed(2), unit: 'nA' }
  }
}
