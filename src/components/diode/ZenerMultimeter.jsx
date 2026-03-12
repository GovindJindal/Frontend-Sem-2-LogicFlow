import { useZenerStore } from '../../store/zenerStore'
import { diodeCurrent, formatCurrent } from '../../utils/diodePhysics'
import { cn } from '../../utils/cn'

function Panel({ label, value, unit, sub, colorClass, bgClass, borderClass }) {
  return (
    <div className={cn('rounded-xl border p-4 flex flex-col gap-1 min-w-[140px]', borderClass, bgClass)}>
      <span className="text-xs font-mono font-semibold text-surface-500 uppercase tracking-widest">{label}</span>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className={cn('font-mono font-bold text-3xl tabular-nums leading-none', colorClass)}>{value}</span>
        <span className="font-mono text-sm font-semibold text-surface-500">{unit}</span>
      </div>
      {sub && <span className="text-xs text-surface-600 font-mono mt-0.5">{sub}</span>}
    </div>
  )
}

export default function ZenerMultimeter() {
  const { voltage, breakdownVoltage, temperature } = useZenerStore()

  // Compute actual operating current
  const isBreakdown = voltage <= breakdownVoltage + 0.05
  const isForward   = voltage >= 0.6

  let currentAmps
  if (isBreakdown) {
    const excess = breakdownVoltage - voltage
    currentAmps = -1e-12 * Math.exp(Math.min(excess * 2, 40)) // clamped
  } else {
    currentAmps = diodeCurrent(voltage, temperature, 1e-12, 1)
  }
  const { value: iVal, unit: iUnit } = formatCurrent(currentAmps)

  const Vt    = ((1.38e-23 * (temperature + 273.15)) / 1.6e-19 * 1000).toFixed(1)
  const power = Math.abs(voltage * currentAmps * 1000).toFixed(3) // mW

  // Status
  const status = isBreakdown
    ? { label: '⚡ IN BREAKDOWN', color: 'text-rose-400' }
    : isForward
    ? { label: '● CONDUCTING',   color: 'text-emerald-400' }
    : { label: '◌ REVERSE / CUT-OFF', color: 'text-surface-500' }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-surface-400 uppercase tracking-widest">Virtual Multimeter</label>
        <span className={cn('text-xs font-mono font-semibold', status.color)}>{status.label}</span>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Panel
          label="Voltage" unit="V"
          value={voltage >= 0 ? `+${voltage.toFixed(2)}` : voltage.toFixed(2)}
          sub="Applied"
          colorClass="text-sky-400"
          bgClass="bg-sky-950/20"
          borderClass="border-sky-900/40"
        />
        <Panel
          label="Current" unit={iUnit}
          value={iVal}
          sub={isBreakdown ? 'Breakdown current' : 'Shockley Eq.'}
          colorClass={isBreakdown ? 'text-rose-400' : isForward ? 'text-emerald-400' : 'text-amber-400'}
          bgClass={isBreakdown ? 'bg-rose-950/20' : 'bg-amber-950/20'}
          borderClass={isBreakdown ? 'border-rose-900/40' : 'border-amber-900/40'}
        />
        <Panel
          label="Power" unit="mW"
          value={power}
          sub={`Vt = ${Vt} mV`}
          colorClass="text-violet-400"
          bgClass="bg-violet-950/20"
          borderClass="border-violet-900/40"
        />
        <Panel
          label="Vz" unit="V"
          value={Math.abs(breakdownVoltage).toFixed(1)}
          sub="Breakdown voltage"
          colorClass="text-rose-300"
          bgClass="bg-rose-950/10"
          borderClass="border-rose-900/30"
        />
      </div>
    </div>
  )
}
