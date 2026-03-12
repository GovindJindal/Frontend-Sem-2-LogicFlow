import { useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Label, ReferenceArea,
} from 'recharts'
import { useZenerStore } from '../../store/zenerStore'
import { generateZenerCurve, diodeCurrent, formatCurrent } from '../../utils/diodePhysics'

// ─── Custom tooltip ───────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  const { value: iVal, unit: iUnit } = formatCurrent(d.i / 1000)
  return (
    <div className="bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-xs font-mono shadow-panel">
      <p className="text-sky-400">V = {d.v.toFixed(3)} V</p>
      <p className="text-rose-400">I = {iVal} {iUnit}</p>
    </div>
  )
}

/**
 * ZenerVIGraph
 * Renders Zener V-I curve with:
 *  - Breakdown region highlighted in rose
 *  - Vz reference line (dashed, moves with whatIfMode slider)
 *  - Q-point crosshairs tracking voltage slider
 *  - "BREAKDOWN!" badge appearing when V < Vz
 */
export default function ZenerVIGraph() {
  const { voltage, breakdownVoltage, temperature } = useZenerStore()

  const curveData = useMemo(
    () => generateZenerCurve(breakdownVoltage, temperature, 1e-12, 300),
    [breakdownVoltage, temperature]
  )

  const currentAmps = diodeCurrent(voltage, temperature, 1e-12, 1)
  const isBreakdown  = voltage <= breakdownVoltage + 0.05
  const isForward    = voltage >= 0.6

  // Current at operating point — use actual Zener curve math
  const opCurrentMa = (() => {
    if (voltage < breakdownVoltage) {
      const excess = breakdownVoltage - voltage
      return Math.max(-150, -1e-12 * 1000 * Math.exp(excess * 2))
    }
    return Math.min(100, currentAmps * 1000)
  })()

  const xDomain = [breakdownVoltage - 1.5, 1.2]
  const yDomain = [-160, 80]

  // Line color: rose in breakdown, blue forward, grey otherwise
  const lineColor = isBreakdown ? '#F43F5E' : isForward ? '#3B82F6' : '#64748B'

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-xs font-semibold text-surface-400 uppercase tracking-widest">
          V-I Characteristic — Zener Diode
        </label>
        <div className="flex items-center gap-3">
          {isBreakdown && (
            <span className="badge text-xs animate-pulse"
              style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid #F43F5E', color: '#F43F5E' }}>
              ⚡ BREAKDOWN
            </span>
          )}
          <span className="text-xs font-mono text-amber-400">
            Q: ({voltage.toFixed(2)}V, {opCurrentMa.toFixed(1)}mA)
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-72 bg-surface-900/60 rounded-xl border border-surface-700 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curveData} margin={{ top: 12, right: 16, bottom: 26, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />

            {/* Breakdown region shading */}
            <ReferenceArea
              x1={xDomain[0]} x2={breakdownVoltage}
              fill="#F43F5E" fillOpacity={0.06}
              label={{ value: 'Breakdown', position: 'insideTopRight',
                style: { fill: '#F43F5E', fontSize: 9, fontFamily: 'JetBrains Mono' } }}
            />

            <XAxis
              dataKey="v" type="number" domain={xDomain} tickCount={8}
              tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#334155' }} tickLine={false}
            >
              <Label value="Voltage (V)" position="insideBottom" offset={-14}
                style={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            </XAxis>

            <YAxis
              dataKey="i" type="number" domain={yDomain} tickCount={7}
              tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#334155' }} tickLine={false} width={44}
            >
              <Label value="Current (mA)" angle={-90} position="insideLeft" offset={8}
                style={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            </YAxis>

            <Tooltip content={<CustomTooltip />} />

            {/* Axes */}
            <ReferenceLine x={0} stroke="#334155" strokeWidth={1} />
            <ReferenceLine y={0} stroke="#334155" strokeWidth={1} />

            {/* Vz marker — moves with What-If slider */}
            <ReferenceLine
              x={breakdownVoltage}
              stroke="#F43F5E" strokeDasharray="5 3" strokeWidth={1.5}
              label={{ value: `Vz=${Math.abs(breakdownVoltage).toFixed(1)}V`,
                position: 'top',
                style: { fill: '#F43F5E', fontSize: 9, fontFamily: 'JetBrains Mono' } }}
            />

            {/* Forward knee */}
            <ReferenceLine
              x={0.7} stroke="#1A56DB" strokeDasharray="4 3" strokeWidth={1}
              label={{ value: '0.7V', position: 'top',
                style: { fill: '#1A56DB', fontSize: 9, fontFamily: 'JetBrains Mono' } }}
            />

            {/* V-I Curve */}
            <Line
              type="monotone" dataKey="i"
              stroke={lineColor} strokeWidth={2.5}
              dot={false} isAnimationActive={false}
            />

            {/* Q-point crosshairs */}
            <ReferenceLine
              x={parseFloat(voltage.toFixed(2))} stroke="#F59E0B"
              strokeWidth={1} strokeDasharray="3 3"
              label={{ value: `${voltage.toFixed(2)}V`, position: 'top',
                style: { fill: '#F59E0B', fontSize: 9, fontFamily: 'JetBrains Mono' } }}
            />
            <ReferenceLine
              y={parseFloat(opCurrentMa.toFixed(1))} stroke="#F59E0B"
              strokeWidth={1} strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Region legend */}
      <div className="flex flex-wrap gap-4 text-xs font-mono">
        <span className="flex items-center gap-1.5 text-rose-400">
          <span className="w-3 h-0.5 bg-rose-400 inline-block" /> Breakdown region (V ≤ Vz)
        </span>
        <span className="flex items-center gap-1.5 text-slate-500">
          <span className="w-3 h-0.5 bg-slate-500 inline-block" /> Reverse leakage
        </span>
        <span className="flex items-center gap-1.5 text-blue-400">
          <span className="w-3 h-0.5 bg-blue-400 inline-block" /> Forward conduction
        </span>
        <span className="flex items-center gap-1.5 text-amber-400">
          <span className="w-2 h-2 bg-amber-400 rounded-full inline-block" /> Q-point
        </span>
      </div>
    </div>
  )
}
