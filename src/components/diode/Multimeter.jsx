import { useDiodeStore } from '../../store/diodeStore'
import { diodeCurrent, formatCurrent } from '../../utils/diodePhysics'
import { cn } from '../../utils/cn'

/**
 * MultimeterDisplay
 * Single instrument readout — dark panel, amber digits.
 */
function MultimeterDisplay({ label, value, unit, color = 'amber', subtext }) {
  const colorMap = {
    amber: { val: 'text-amber-400',   unit: 'text-amber-600',  border: 'border-amber-900/40', bg: 'bg-amber-950/20' },
    blue:  { val: 'text-sky-400',     unit: 'text-sky-600',    border: 'border-sky-900/40',   bg: 'bg-sky-950/20'   },
    green: { val: 'text-emerald-400', unit: 'text-emerald-600',border: 'border-emerald-900/40',bg: 'bg-emerald-950/20'},
  }
  const c = colorMap[color]

  return (
    <div className={cn(
      'rounded-xl border p-4 flex flex-col gap-1 min-w-[140px]',
      c.border, c.bg
    )}>
      {/* Label */}
      <span className="text-xs font-mono font-semibold text-surface-500 uppercase tracking-widest">
        {label}
      </span>

      {/* Value */}
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className={cn('font-mono font-bold text-3xl tabular-nums leading-none', c.val)}>
          {value}
        </span>
        <span className={cn('font-mono text-sm font-semibold', c.unit)}>
          {unit}
        </span>
      </div>

      {/* Subtext */}
      {subtext && (
        <span className="text-xs text-surface-600 font-mono mt-0.5">{subtext}</span>
      )}
    </div>
  )
}

/**
 * Multimeter
 * Shows voltage and current readings for the diode experiment.
 * Reads from diodeStore, computes current via Shockley equation.
 */
export default function Multimeter() {
  const { voltage, temperature, saturationCurrent, idealityFactor, biasMode } = useDiodeStore()

  const currentAmps = diodeCurrent(voltage, temperature, saturationCurrent, idealityFactor)
  const { value: iVal, unit: iUnit } = formatCurrent(currentAmps)

  // Determine if diode is conducting (forward bias > 0.6 V)
  const conducting = biasMode === 'forward' && voltage > 0.6
  const statusLabel = conducting
    ? '● CONDUCTING'
    : biasMode === 'reverse'
    ? '◌ REVERSE BIAS'
    : '◌ CUT-OFF'
  const statusColor = conducting ? 'text-emerald-400' : 'text-surface-500'

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-surface-400 uppercase tracking-widest">
          Virtual Multimeter
        </label>
        <span className={cn('text-xs font-mono font-semibold', statusColor)}>
          {statusLabel}
        </span>
      </div>

      {/* Instrument panels */}
      <div className="flex gap-3 flex-wrap">
        <MultimeterDisplay
          label="Voltage"
          value={voltage >= 0 ? `+${voltage.toFixed(2)}` : voltage.toFixed(2)}
          unit="V"
          color="blue"
          subtext="Applied"
        />
        <MultimeterDisplay
          label="Current"
          value={iVal}
          unit={iUnit}
          color={conducting ? 'green' : 'amber'}
          subtext="Shockley Eq."
        />
        <MultimeterDisplay
          label="Temp"
          value={temperature}
          unit="°C"
          color="amber"
          subtext={`Vt = ${((1.38e-23 * (temperature + 273.15)) / 1.6e-19 * 1000).toFixed(1)} mV`}
        />
      </div>
    </div>
  )
}
