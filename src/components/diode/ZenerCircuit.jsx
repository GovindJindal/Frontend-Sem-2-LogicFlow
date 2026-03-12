import { useZenerStore } from '../../store/zenerStore'
import { diodeCurrent } from '../../utils/diodePhysics'

/**
 * ZenerCircuit
 * SVG schematic of a standard Zener voltage regulator.
 * Shows current flow animation in breakdown region.
 * The Zener symbol uses the bent-cathode bar distinguishing it from a regular diode.
 */
export default function ZenerCircuit() {
  const { voltage, breakdownVoltage, temperature } = useZenerStore()

  const isBreakdown = voltage <= breakdownVoltage + 0.05
  const isForward   = voltage >= 0.6
  const conducting  = isBreakdown || isForward

  const wireColor    = isBreakdown ? '#F43F5E' : isForward ? '#22C55E' : '#334155'
  const diodeColor   = isBreakdown ? '#F43F5E' : isForward ? '#22C55E' : '#1A56DB'
  const animDur      = isBreakdown ? '0.6s' : '1.2s'

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-surface-400 uppercase tracking-widest">
        Zener Regulator Circuit
      </label>

      <div className="bg-surface-900/60 rounded-xl border border-surface-700 p-3 flex items-center justify-center">
        <svg viewBox="0 0 320 170" className="w-full max-w-sm" style={{ height: 150 }}>

          {/* ── Wires ─────────────────────────────────────────────── */}
          <line x1="30"  y1="35"  x2="100" y2="35"  stroke="#334155" strokeWidth="2" />
          {/* top: series resistor → zener anode */}
          <line x1="165" y1="35"  x2="220" y2="35"  stroke={wireColor} strokeWidth="2" />
          {/* right rail (down) */}
          <line x1="220" y1="35"  x2="290" y2="35"  stroke={wireColor} strokeWidth="2" />
          <line x1="290" y1="35"  x2="290" y2="130" stroke={wireColor} strokeWidth="2" />
          {/* bottom rail */}
          <line x1="290" y1="130" x2="30"  y2="130" stroke="#334155" strokeWidth="2" />
          {/* left rail (up) */}
          <line x1="30"  y1="130" x2="30"  y2="35"  stroke="#334155" strokeWidth="2" />

          {/* Zener shunt path (parallel to load) */}
          <line x1="220" y1="35"  x2="220" y2="60"  stroke={wireColor} strokeWidth="2" />
          <line x1="220" y1="110" x2="220" y2="130" stroke={wireColor} strokeWidth="2" />

          {/* ── Battery ────────────────────────────────────────────── */}
          <line x1="22" y1="72" x2="38" y2="72" stroke="#F59E0B" strokeWidth="3" />
          <line x1="22" y1="80" x2="38" y2="80" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="30" y1="60" x2="30" y2="72" stroke="#334155" strokeWidth="2" />
          <line x1="30" y1="80" x2="30" y2="95" stroke="#334155" strokeWidth="2" />
          <text x="5"  y="79" fontSize="8" fill="#F59E0B" fontFamily="JetBrains Mono">+</text>
          <text x="5"  y="100" fontSize="8" fill="#64748B" fontFamily="JetBrains Mono">{Math.abs(voltage).toFixed(1)}V</text>

          {/* ── Series resistor (top wire) ─────────────────────────── */}
          <rect x="100" y="28" width="40" height="14" rx="2"
            fill="none" stroke="#64748B" strokeWidth="1.5" />
          <text x="106" y="54" fontSize="8" fill="#64748B" fontFamily="JetBrains Mono">Rs</text>
          <line x1="140" y1="35" x2="155" y2="35" stroke={wireColor} strokeWidth="2" />

          {/* ── Load resistor (right, vertical) ───────────────────── */}
          <rect x="256" y="65" width="14" height="40" rx="2"
            fill="none" stroke="#64748B" strokeWidth="1.5" />
          <text x="243" y="94" fontSize="8" fill="#64748B" fontFamily="JetBrains Mono">RL</text>
          <line x1="263" y1="35"  x2="263" y2="65"  stroke={wireColor} strokeWidth="2" />
          <line x1="263" y1="105" x2="263" y2="130" stroke={wireColor} strokeWidth="2" />

          {/* ── Zener diode (vertical shunt, cathode up) ──────────── */}
          {/* Triangle pointing DOWN (conventional current flows up in breakdown) */}
          <polygon
            points="208,60 232,60 220,85"
            fill={diodeColor} fillOpacity={conducting ? 0.7 : 0.25}
            stroke={diodeColor} strokeWidth="1.5"
          />
          {/* Zener cathode bar with bent ends (Z-shape distinguisher) */}
          <line x1="206" y1="60" x2="234" y2="60" stroke={diodeColor} strokeWidth="2.5" />
          {/* Bent ends of cathode bar */}
          <line x1="206" y1="60" x2="200" y2="54" stroke={diodeColor} strokeWidth="2" />
          <line x1="234" y1="60" x2="240" y2="54" stroke={diodeColor} strokeWidth="2" />

          {/* Zener label */}
          <text x="243" y="75" fontSize="9" fill="#94A3B8" fontFamily="JetBrains Mono" fontWeight="600">Dz</text>
          <text x="200" y="50" fontSize="8" fill="#64748B" fontFamily="JetBrains Mono">K</text>
          <text x="214" y="100" fontSize="8" fill="#64748B" fontFamily="JetBrains Mono">A</text>

          {/* Vz label on diode */}
          <text x="165" y="86" fontSize="8" fill={isBreakdown ? '#F43F5E' : '#64748B'}
            fontFamily="JetBrains Mono">Vz={Math.abs(breakdownVoltage).toFixed(1)}</text>

          {/* ── Current flow animation ─────────────────────────────── */}
          {conducting && (
            <>
              {[0, 0.4, 0.8].map((delay, i) => (
                <circle key={i} r="3" fill={wireColor} opacity={0.9 - i * 0.2}>
                  <animateMotion dur={animDur} begin={`${delay}s`} repeatCount="indefinite">
                    <mpath href="#zener-path" />
                  </animateMotion>
                </circle>
              ))}
              <path
                id="zener-path"
                d={isBreakdown
                  ? 'M220,130 L220,110 L220,85 L220,60 L220,35 L165,35 L140,35 L100,35 L30,35 L30,130 L220,130'
                  : 'M30,35 L100,35 L140,35 L165,35 L220,35 L290,35 L290,130 L30,130 L30,35'}
                fill="none" stroke="none"
              />
            </>
          )}

          {/* ── Status label ───────────────────────────────────────── */}
          <text x="160" y="155" fontSize="9"
            fill={isBreakdown ? '#F43F5E' : isForward ? '#22C55E' : '#64748B'}
            fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">
            {isBreakdown
              ? `Breakdown — Vout clamped at ${Math.abs(breakdownVoltage).toFixed(1)}V`
              : isForward
              ? 'Forward conducting'
              : 'Reverse biased — waiting for Vz'}
          </text>
        </svg>
      </div>

      {/* Key insight */}
      <p className="text-xs text-surface-500 font-mono leading-relaxed">
        {isBreakdown
          ? '✓ Zener clamps output voltage — excess current flows through Dz'
          : '→ Increase reverse voltage until it reaches Vz to see regulation'}
      </p>
    </div>
  )
}
