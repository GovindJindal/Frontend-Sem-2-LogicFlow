import { useDiodeStore } from '../../store/diodeStore'
import { diodeCurrent } from '../../utils/diodePhysics'

/**
 * DiodeCircuit
 * Renders an SVG schematic of the diode circuit.
 * Shows animated current flow dots when the diode is conducting.
 * Colour-codes wires by polarity.
 */
export default function DiodeCircuit() {
  const { voltage, biasMode, temperature, saturationCurrent, idealityFactor } = useDiodeStore()

  const currentAmps = diodeCurrent(voltage, temperature, saturationCurrent, idealityFactor)
  const conducting  = biasMode === 'forward' && voltage > 0.6
  const reverseLeak = biasMode === 'reverse' && Math.abs(currentAmps) > 1e-9

  const wireColor = conducting ? '#22C55E'
    : reverseLeak  ? '#F43F5E'
    : '#334155'

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-surface-400 uppercase tracking-widest">
        Circuit Schematic
      </label>

      <div className="bg-surface-900/60 rounded-xl border border-surface-700 p-4 flex items-center justify-center">
        <svg viewBox="0 0 300 160" className="w-full max-w-xs" style={{ height: 140 }}>

          {/* ── Wires ─────────────────────────────────────────── */}
          {/* Top wire (anode → diode) */}
          <line x1="30"  y1="40"  x2="120" y2="40"  stroke={conducting ? '#22C55E' : '#334155'} strokeWidth="2" />
          {/* Top wire (diode → resistor) */}
          <line x1="175" y1="40"  x2="270" y2="40"  stroke={wireColor} strokeWidth="2" />
          {/* Right wire (down) */}
          <line x1="270" y1="40"  x2="270" y2="120" stroke={wireColor} strokeWidth="2" />
          {/* Bottom wire (back to battery) */}
          <line x1="270" y1="120" x2="30"  y2="120" stroke="#334155" strokeWidth="2" />
          {/* Left wire (battery up) */}
          <line x1="30"  y1="120" x2="30"  y2="40"  stroke="#334155" strokeWidth="2" />

          {/* ── Battery (left) ─────────────────────────────────── */}
          {/* + terminal */}
          <line x1="22" y1="72" x2="38" y2="72" stroke="#F59E0B" strokeWidth="3" />
          <line x1="22" y1="80" x2="38" y2="80" stroke="#F59E0B" strokeWidth="1.5" />
          <text x="14" y="77" fontSize="8" fill="#F59E0B" fontFamily="JetBrains Mono">+</text>
          <line x1="30" y1="65" x2="30" y2="72" stroke="#334155" strokeWidth="2" />
          <line x1="30" y1="80" x2="30" y2="88" stroke="#334155" strokeWidth="2" />
          {/* Battery label */}
          <text x="7" y="100" fontSize="8" fill="#64748B" fontFamily="JetBrains Mono">
            {Math.abs(voltage).toFixed(2)}V
          </text>

          {/* ── Diode symbol ───────────────────────────────────── */}
          {/* Triangle body */}
          <polygon
            points="120,28 120,52 148,40"
            fill={conducting ? '#22C55E' : '#1A56DB'}
            fillOpacity={conducting ? 0.8 : 0.4}
            stroke={conducting ? '#22C55E' : '#1A56DB'}
            strokeWidth="1.5"
          />
          {/* Cathode bar */}
          <line x1="148" y1="28" x2="148" y2="52" stroke={conducting ? '#22C55E' : '#1A56DB'} strokeWidth="2.5" />
          {/* Anode wire stub */}
          <line x1="108" y1="40" x2="120" y2="40" stroke={conducting ? '#22C55E' : '#334155'} strokeWidth="2" />
          {/* Cathode wire stub */}
          <line x1="148" y1="40" x2="160" y2="40" stroke={wireColor} strokeWidth="2" />

          {/* Diode labels */}
          <text x="117" y="64" fontSize="8" fill="#64748B" fontFamily="JetBrains Mono">A</text>
          <text x="144" y="64" fontSize="8" fill="#64748B" fontFamily="JetBrains Mono">K</text>
          <text x="118" y="22" fontSize="9" fill="#94A3B8" fontFamily="JetBrains Mono" fontWeight="600">D1</text>

          {/* ── Resistor (right wire, simplified) ──────────────── */}
          <rect x="195" y="34" width="40" height="12" rx="2"
            fill="none" stroke="#64748B" strokeWidth="1.5" />
          <text x="198" y="58" fontSize="8" fill="#64748B" fontFamily="JetBrains Mono">1kΩ</text>

          {/* ── Current flow animation ─────────────────────────── */}
          {conducting && (
            <>
              <circle r="3" fill="#22C55E" opacity="0.9">
                <animateMotion dur="1.2s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#circuit-path" />
                </animateMotion>
              </circle>
              <circle r="3" fill="#22C55E" opacity="0.6">
                <animateMotion dur="1.2s" begin="0.4s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#circuit-path" />
                </animateMotion>
              </circle>
              <circle r="3" fill="#22C55E" opacity="0.4">
                <animateMotion dur="1.2s" begin="0.8s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#circuit-path" />
                </animateMotion>
              </circle>
              <path
                id="circuit-path"
                d="M30,40 L108,40 L148,40 L195,40 L270,40 L270,120 L30,120 L30,40"
                fill="none" stroke="none"
              />
            </>
          )}

          {/* ── Status label ──────────────────────────────────── */}
          <text x="150" y="145" fontSize="9" fill={conducting ? '#22C55E' : '#64748B'}
            fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">
            {conducting
              ? `I = ${(currentAmps * 1000).toFixed(2)} mA  →`
              : biasMode === 'reverse'
              ? 'Reverse biased — leakage only'
              : 'Below threshold (< 0.7V)'}
          </text>
        </svg>
      </div>
    </div>
  )
}
