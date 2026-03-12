import { useMemo, useRef } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Label
} from 'recharts'
import { useDiodeStore } from '../../store/diodeStore'
import { generateDiodeCurve, diodeCurrent, formatCurrent } from '../../utils/diodePhysics'

// ─── Custom tooltip ─────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  const { value: iVal, unit: iUnit } = formatCurrent(d.i / 1000)
  return (
    <div className="bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-xs font-mono shadow-panel">
      <p className="text-sky-400">V = {d.v.toFixed(3)} V</p>
      <p className="text-emerald-400">I = {iVal} {iUnit}</p>
    </div>
  )
}

// ─── Operating point dot ─────────────────────────────────────────
function OpPointDot({ cx, cy, voltage, currentMa }) {
  if (cx == null || cy == null) return null
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill="#F59E0B" stroke="#0F172A" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={12} fill="none" stroke="#F59E0B" strokeWidth={1} opacity={0.4} />
    </g>
  )
}

/**
 * VIGraph
 * Renders the V-I characteristic curve using Recharts.
 * The curve re-generates on every temperature change.
 * The operating point (amber dot) tracks the voltage slider in real time.
 */
export default function VIGraph() {
  const { voltage, biasMode, temperature, saturationCurrent, idealityFactor } = useDiodeStore()

  // Regenerate full curve when temperature or bias mode changes
  const curveData = useMemo(
    () => generateDiodeCurve(biasMode, temperature, saturationCurrent, idealityFactor, 250),
    [biasMode, temperature, saturationCurrent, idealityFactor]
  )

  // Current operating point
  const currentAmps = diodeCurrent(voltage, temperature, saturationCurrent, idealityFactor)
  const currentMa   = Math.min(Math.max(currentAmps * 1000, -100), 100)

  // Domain helpers
  const isForward = biasMode === 'forward'
  const xDomain   = isForward ? [-0.5, 1.0]  : [-2.0, 0.5]
  const yDomain   = isForward ? [-5,   100]  : [-5,   20]

  // Highlight colour
  const lineColor = isForward ? '#3B82F6' : '#F43F5E'

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-surface-400 uppercase tracking-widest">
          V-I Characteristic Curve
        </label>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          <span className="text-amber-400">
            Q-point: ({voltage.toFixed(2)} V, {currentMa.toFixed(2)} mA)
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-64 bg-surface-900/60 rounded-xl border border-surface-700 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curveData} margin={{ top: 10, right: 16, bottom: 24, left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />

            <XAxis
              dataKey="v"
              type="number"
              domain={xDomain}
              tickCount={7}
              tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            >
              <Label value="Voltage (V)" position="insideBottom" offset={-12}
                style={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            </XAxis>

            <YAxis
              dataKey="i"
              type="number"
              domain={yDomain}
              tickCount={6}
              tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              width={40}
            >
              <Label value="Current (mA)" angle={-90} position="insideLeft" offset={8}
                style={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            </YAxis>

            <Tooltip content={<CustomTooltip />} />

            {/* Zero axes */}
            <ReferenceLine x={0} stroke="#334155" strokeWidth={1} />
            <ReferenceLine y={0} stroke="#334155" strokeWidth={1} />

            {/* Knee voltage marker for forward bias */}
            {isForward && (
              <ReferenceLine
                x={0.7}
                stroke="#1A56DB"
                strokeDasharray="4 3"
                strokeWidth={1}
                label={{ value: '0.7V knee', position: 'top',
                  style: { fill: '#1A56DB', fontSize: 9, fontFamily: 'JetBrains Mono' } }}
              />
            )}

            {/* The V-I curve */}
            <Line
              type="monotone"
              dataKey="i"
              stroke={lineColor}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />

            {/* Operating point dot — rendered as a custom dot on the nearest point */}
            <ReferenceLine
              x={parseFloat(voltage.toFixed(2))}
              stroke="#F59E0B"
              strokeWidth={1}
              strokeDasharray="3 3"
              label={{ value: `${voltage.toFixed(2)}V`, position: 'top',
                style: { fill: '#F59E0B', fontSize: 9, fontFamily: 'JetBrains Mono' } }}
            />
            <ReferenceLine
              y={parseFloat(currentMa.toFixed(2))}
              stroke="#F59E0B"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Annotations */}
      <div className="flex flex-wrap gap-4 text-xs font-mono text-surface-500">
        <span>
          <span className="text-sky-500">I = Is·(e</span>
          <span className="text-surface-500">^(V/nVt)</span>
          <span className="text-sky-500"> - 1)</span>
        </span>
        <span>Is = {saturationCurrent.toExponential(0)} A</span>
        <span>n = {idealityFactor}</span>
        <span>Vt ≈ {((1.38e-23 * (temperature + 273.15)) / 1.6e-19 * 1000).toFixed(1)} mV</span>
      </div>
    </div>
  )
}
