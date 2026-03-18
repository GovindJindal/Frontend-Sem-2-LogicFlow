import { useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, ChevronRight, Zap, ToggleLeft, ToggleRight, Activity } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label,
} from 'recharts'

import { useRectifierStore } from '../store/rectifierStore'
import { useUiStore }        from '../store/uiStore'
import ControlSlider         from '../components/shared/ControlSlider'
import LabReportExporter     from '../components/shared/LabReportExporter'
import { useEffect }         from 'react'

// ─── Physics helpers ─────────────────────────────────────────────
const VD = 0.7   // diode forward voltage drop

function generateWaveform({ circuitType, amplitude: Vm, frequency, filterEnabled, capacitance, loadResistance }) {
  const T       = 1 / frequency          // period in seconds
  const POINTS  = 300
  const tMax    = 2 * T                  // show 2 full cycles
  const dt      = tMax / POINTS
  const RC      = (loadResistance * capacitance * 1e-6)

  const data = []
  let vcap = 0   // capacitor voltage (for filter simulation)

  for (let i = 0; i <= POINTS; i++) {
    const t    = i * dt
    const tMs  = parseFloat((t * 1000).toFixed(3))
    const vin  = Vm * Math.sin(2 * Math.PI * frequency * t)

    let vout
    if (circuitType === 'half-wave') {
      const rectified = Math.max(vin - VD, 0)
      if (filterEnabled) {
        const decayed = vcap * Math.exp(-dt / RC)
        vcap = Math.max(rectified, decayed)
        vout = vcap
      } else {
        vout = rectified
      }
    } else {
      // full-wave bridge: two diodes in series
      const rectified = Math.max(Math.abs(vin) - 2 * VD, 0)
      if (filterEnabled) {
        const decayed = vcap * Math.exp(-dt / (RC / 2))
        vcap = Math.max(rectified, decayed)
        vout = vcap
      } else {
        vout = rectified
      }
    }

    data.push({
      t: tMs,
      vin:  parseFloat(vin.toFixed(3)),
      vout: parseFloat(vout.toFixed(3)),
    })
  }
  return data
}

function calcMetrics({ circuitType, amplitude: Vm, frequency, filterEnabled, capacitance, loadResistance }) {
  const isHalf  = circuitType === 'half-wave'
  const drops   = isHalf ? VD : 2 * VD
  const Vpeak   = Math.max(Vm - drops, 0)

  const Vdc     = isHalf ? Vpeak / Math.PI : (2 * Vpeak) / Math.PI
  const Vrms    = isHalf ? Vpeak / 2       : Vpeak / Math.sqrt(2)
  const Vac     = Math.sqrt(Math.max(Vrms ** 2 - Vdc ** 2, 0))
  const ripple  = Vdc > 0 ? Vac / Vdc : 0
  const piv     = isHalf ? Vm : Vm    // bridge PIV = Vm
  const freq_out = isHalf ? frequency : 2 * frequency

  // With capacitor filter
  const RC = loadResistance * capacitance * 1e-6
  const fRipple = filterEnabled
    ? Vpeak / (freq_out * RC)    // simplified ripple Vr ≈ Vp / (f·R·C)
    : ripple * Vdc

  const Vdc_filter = filterEnabled
    ? Vpeak - fRipple / 2
    : Vdc

  return {
    Vpeak:       Vpeak.toFixed(2),
    Vdc:         (filterEnabled ? Vdc_filter : Vdc).toFixed(2),
    Vrms:        Vrms.toFixed(2),
    rippleFactor:(filterEnabled ? fRipple / Math.max(Vdc_filter, 0.01) : ripple).toFixed(3),
    piv:         piv.toFixed(1),
    freqOut:     freq_out,
  }
}

// ─── Metric card ─────────────────────────────────────────────────
function MetricCard({ label, value, unit, color = '#1A56DB', sub }) {
  return (
    <div className="panel p-4 flex flex-col gap-1">
      <p className="text-[10px] font-mono text-surface-500 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="font-display font-bold text-2xl" style={{ color }}>{value}</span>
        <span className="text-sm font-mono text-surface-400">{unit}</span>
      </div>
      {sub && <p className="text-[10px] font-mono text-surface-600">{sub}</p>}
    </div>
  )
}

// ─── Custom waveform tooltip ──────────────────────────────────────
function WaveTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-xs font-mono shadow-panel">
      <p className="text-surface-400 mb-1">t = {label} ms</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name} = {p.value.toFixed(3)} V
        </p>
      ))}
    </div>
  )
}

// ─── Half-wave circuit SVG ────────────────────────────────────────
function HalfWaveCircuit({ active }) {
  const wireColor = active ? '#22C55E' : '#334155'
  const diodeColor = '#1A56DB'
  return (
    <svg viewBox="0 0 380 160" className="w-full" style={{ maxHeight: 130 }}>
      {/* AC source */}
      <circle cx={40} cy={80} r={22} fill="#1E293B" stroke="#334155" strokeWidth={1.5} />
      <text x={40} y={77} textAnchor="middle" fontSize={14} fill="#1A56DB" fontFamily="JetBrains Mono">~</text>
      <text x={40} y={100} textAnchor="middle" fontSize={7} fill="#64748B" fontFamily="JetBrains Mono">AC</text>

      {/* Top wire → diode */}
      <line x1={62} y1={58} x2={130} y2={58} stroke={wireColor} strokeWidth={2} />
      {/* Diode symbol */}
      <polygon points="130,48 130,68 155,58" fill={diodeColor} opacity={0.8} />
      <line x1={155} y1={48} x2={155} y2={68} stroke={diodeColor} strokeWidth={2} />
      <text x={142} y={44} textAnchor="middle" fontSize={8} fill={diodeColor} fontFamily="JetBrains Mono">D1</text>
      {/* Wire after diode */}
      <line x1={155} y1={58} x2={240} y2={58} stroke={wireColor} strokeWidth={2} />
      {/* Down to load */}
      <line x1={240} y1={58} x2={240} y2={72} stroke={wireColor} strokeWidth={2} />
      {/* Load resistor */}
      <rect x={225} y={72} width={30} height={16} rx={3} fill="#1E293B" stroke="#334155" strokeWidth={1.5} />
      <text x={240} y={83} textAnchor="middle" fontSize={8} fill="#64748B" fontFamily="JetBrains Mono">RL</text>
      {/* Bottom return wire */}
      <line x1={240} y1={88} x2={240} y2={102} stroke={wireColor} strokeWidth={2} />
      <line x1={240} y1={102} x2={40} y2={102} stroke={wireColor} strokeWidth={2} />
      <line x1={40} y1={102} x2={40} y2={62} stroke={wireColor} strokeWidth={2} />

      {/* Vout tap */}
      <line x1={240} y1={58} x2={320} y2={58} stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3 2" />
      <line x1={240} y1={102} x2={320} y2={102} stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3 2" />
      <text x={335} y={82} textAnchor="middle" fontSize={8} fill="#F59E0B" fontFamily="JetBrains Mono">Vout</text>
      <text x={335} y={92} textAnchor="middle" fontSize={7} fill="#64748B" fontFamily="JetBrains Mono">+</text>
    </svg>
  )
}

// ─── Full-wave bridge circuit SVG ────────────────────────────────
function FullWaveCircuit({ active }) {
  const wireColor = active ? '#22C55E' : '#334155'
  const dc = '#1A56DB'
  const cx = 190, cy = 80, r = 38
  // Diamond bridge: top=D1, right=D2, bottom=D3, left=D4
  const pts = {
    top:    [cx, cy - r],
    right:  [cx + r, cy],
    bottom: [cx, cy + r],
    left:   [cx - r, cy],
  }
  const diodeArrow = (x1, y1, x2, y2, label) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
    return (
      <g key={label}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={dc} strokeWidth={2} />
        <circle cx={mx} cy={my} r={5} fill={dc} opacity={0.7} />
        <text x={mx + 8} y={my + 3} fontSize={7} fill={dc} fontFamily="JetBrains Mono">{label}</text>
      </g>
    )
  }
  return (
    <svg viewBox="0 0 380 165" className="w-full" style={{ maxHeight: 130 }}>
      {/* AC source */}
      <circle cx={40} cy={80} r={22} fill="#1E293B" stroke="#334155" strokeWidth={1.5} />
      <text x={40} y={77} textAnchor="middle" fontSize={14} fill="#1A56DB" fontFamily="JetBrains Mono">~</text>
      <text x={40} y={100} textAnchor="middle" fontSize={7} fill="#64748B" fontFamily="JetBrains Mono">AC</text>
      {/* Wires to bridge left */}
      <line x1={62} y1={58} x2={pts.left[0]} y2={pts.left[1]} stroke={wireColor} strokeWidth={1.5} />
      <line x1={62} y1={102} x2={pts.bottom[0]} y2={pts.bottom[1]} stroke={wireColor} strokeWidth={1.5} />
      {/* Four diodes as diamond */}
      {diodeArrow(pts.left[0], pts.left[1], pts.top[0], pts.top[1], 'D1')}
      {diodeArrow(pts.bottom[0], pts.bottom[1], pts.left[0], pts.left[1], 'D2')}
      {diodeArrow(pts.top[0], pts.top[1], pts.right[0], pts.right[1], 'D3')}
      {diodeArrow(pts.right[0], pts.right[1], pts.bottom[0], pts.bottom[1], 'D4')}
      {/* Load from top/right to bottom */}
      <line x1={pts.top[0]} y1={pts.top[1]} x2={pts.right[0]} y2={pts.right[1]} stroke={wireColor} strokeWidth={1.5} />
      <line x1={pts.right[0]} y1={pts.right[1]} x2={280} y2={cy} stroke={wireColor} strokeWidth={1.5} />
      <line x1={pts.bottom[0]} y1={pts.bottom[1]} x2={280} y2={cy + 30} stroke={wireColor} strokeWidth={1.5} />
      {/* Load */}
      <rect x={265} y={cy} width={30} height={30} rx={3} fill="#1E293B" stroke="#334155" strokeWidth={1.5} />
      <text x={280} y={cy + 18} textAnchor="middle" fontSize={8} fill="#64748B" fontFamily="JetBrains Mono">RL</text>
      {/* Vout */}
      <line x1={280} y1={cy} x2={350} y2={cy} stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3 2" />
      <line x1={280} y1={cy + 30} x2={350} y2={cy + 30} stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3 2" />
      <text x={360} y={cy + 18} textAnchor="middle" fontSize={8} fill="#F59E0B" fontFamily="JetBrains Mono">Vout</text>
    </svg>
  )
}

// ─── Observation card ─────────────────────────────────────────────
function ObservationCard({ metrics, circuitType, filterEnabled }) {
  const isHalf = circuitType === 'half-wave'
  const rf = parseFloat(metrics.rippleFactor)

  const quality = rf < 0.1 ? { label: 'Excellent filtering', color: 'emerald' }
    : rf < 0.5 ? { label: 'Good DC output', color: 'primary' }
    : rf < 1.0 ? { label: 'Moderate ripple', color: 'amber' }
    : { label: 'High ripple — use filter', color: 'rose' }

  const points = [
    `Output frequency: ${metrics.freqOut} Hz (${isHalf ? '= input freq' : '= 2× input freq'})`,
    `PIV rating required: ≥ ${metrics.piv} V per diode`,
    `DC output: ${metrics.Vdc} V ${filterEnabled ? '(filtered)' : `(= Vm/π${isHalf ? '' : ' × 2'})`}`,
    `Ripple factor γ = ${metrics.rippleFactor} ${rf < 0.1 ? '— ideal for DC supply' : rf > 1 ? '— add filter capacitor' : ''}`,
  ]

  const colorMap = { emerald: 'border-emerald-700/40 bg-emerald-950/15 text-emerald-400', primary: 'border-primary-700/40 bg-primary-950/15 text-primary-400', amber: 'border-amber-700/40 bg-amber-950/15 text-amber-400', rose: 'border-rose-700/40 bg-rose-950/15 text-rose-400' }
  const c = colorMap[quality.color]

  return (
    <div className={`rounded-xl border p-4 ${c}`}>
      <p className="text-xs font-bold uppercase tracking-widest mb-3">📋 {quality.label}</p>
      <ul className="space-y-1.5">
        {points.map((pt) => (
          <li key={pt} className="text-xs text-surface-400 flex items-start gap-1.5">
            <span className="flex-shrink-0 mt-0.5 text-surface-600">→</span>{pt}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────
export default function RectifierLab() {
  const {
    circuitType, amplitude, frequency, filterEnabled,
    capacitance, loadResistance,
    setCircuitType, setAmplitude, setFrequency,
    toggleFilter, setCapacitance, setLoadResistance, reset,
  } = useRectifierStore()

  const { setActiveModule } = useUiStore()
  useEffect(() => { setActiveModule('rectifier') }, [])

  const graphRef = useRef(null)
  const isHalf   = circuitType === 'half-wave'

  const waveData = useMemo(
    () => generateWaveform({ circuitType, amplitude, frequency, filterEnabled, capacitance, loadResistance }),
    [circuitType, amplitude, frequency, filterEnabled, capacitance, loadResistance]
  )

  const metrics = useMemo(
    () => calcMetrics({ circuitType, amplitude, frequency, filterEnabled, capacitance, loadResistance }),
    [circuitType, amplitude, frequency, filterEnabled, capacitance, loadResistance]
  )

  const tableRows = [
    { v: `${amplitude}V peak, f=${frequency}Hz`, i: `${metrics.Vdc}V DC`, region: isHalf ? 'Half-wave' : 'Full-wave' },
    { v: 'Ripple factor γ', i: metrics.rippleFactor, region: filterEnabled ? 'Filtered' : 'Unfiltered' },
    { v: 'Peak output Vp', i: `${metrics.Vpeak}V`, region: `After ${isHalf ? '1' : '2'} diode drops` },
    { v: 'PIV per diode', i: `${metrics.piv}V`, region: 'Minimum diode rating' },
    { v: 'Output frequency', i: `${metrics.freqOut}Hz`, region: isHalf ? '= fin' : '= 2×fin' },
  ]

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 bg-surface-900 circuit-grid">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ───────────────────────────────────────────── */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-blue text-xs">Digital Electronics</span>
                <ChevronRight size={12} className="text-surface-600" />
                <span className="text-surface-400 text-xs font-mono">Experiment 03</span>
              </div>
              <h1 className="font-display font-bold text-3xl text-white mb-1">Rectifier Circuits</h1>
              <p className="text-surface-400 text-sm max-w-xl">
                Observe how diodes convert AC to DC. Compare half-wave and full-wave bridge rectifiers.
                Toggle the RC filter to smooth the output.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <LabReportExporter
                experiment="Rectifier Circuits"
                expNumber="03"
                aim="To study the characteristics of half-wave and full-wave bridge rectifier circuits and determine Vdc, ripple factor, and PIV. Observe the effect of a filter capacitor on the output waveform."
                apparatus={['Silicon Diodes 1N4007 (×4)', 'Step-down transformer (230V/12V)', 'Load resistor 1kΩ', 'Filter capacitor 100µF, 50V', 'Oscilloscope (dual channel)', 'Multimeter', 'Bread board, connecting wires']}
                theory={`A rectifier converts alternating current (AC) to direct current (DC) using the unidirectional conduction property of diodes. A half-wave rectifier uses one diode and conducts only during the positive half cycle, giving Vdc = Vm/π. A full-wave bridge rectifier uses four diodes, conducts during both half cycles, and gives Vdc = 2Vm/π. The ripple factor γ = Vac/Vdc quantifies output quality. A filter capacitor drastically reduces ripple by storing charge between peaks.`}
                tableRows={tableRows}
                observations={`Half-wave: Vdc ≈ ${calcMetrics({ circuitType: 'half-wave', amplitude, frequency, filterEnabled: false, capacitance, loadResistance }).Vdc}V, γ ≈ 1.21 (theoretical). Full-wave: Vdc ≈ ${calcMetrics({ circuitType: 'full-wave', amplitude, frequency, filterEnabled: false, capacitance, loadResistance }).Vdc}V, γ ≈ 0.482 (theoretical). Filter capacitor ${capacitance}µF reduces ripple significantly.`}
                conclusion={`Both rectifier circuits successfully convert AC to DC. Full-wave bridge provides superior DC output (higher Vdc, lower ripple). Filter capacitor reduces ripple factor from ~${isHalf ? '1.21' : '0.48'} to ~${metrics.rippleFactor}, confirming its effectiveness in power supply design.`}
                graphRef={graphRef}
              />
              <button onClick={reset} className="btn-secondary flex items-center gap-2 text-sm py-2">
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Circuit type selector ─────────────────────────── */}
        <motion.div
          className="panel p-1.5 flex gap-1.5 mb-5 w-fit"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        >
          {[
            { id: 'half-wave', label: 'Half-Wave Rectifier',       sub: '1 diode' },
            { id: 'full-wave', label: 'Full-Wave Bridge Rectifier', sub: '4 diodes' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setCircuitType(c.id)}
              className={`flex flex-col items-start px-4 py-2.5 rounded-lg transition-all ${
                circuitType === c.id
                  ? 'bg-primary-600/20 border border-primary-600/40'
                  : 'border border-transparent hover:bg-surface-800'
              }`}
            >
              <span className={`text-sm font-semibold ${circuitType === c.id ? 'text-primary-300' : 'text-surface-300'}`}>
                {c.label}
              </span>
              <span className="text-xs font-mono text-surface-500">{c.sub}</span>
            </button>
          ))}
        </motion.div>

        {/* ── Main grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT — Controls */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          >
            {/* Input parameters */}
            <div className="panel p-5 flex flex-col gap-5">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest">Input Signal</p>
              <ControlSlider
                label="Peak Voltage (Vm)"
                value={amplitude} min={1} max={20} step={0.5}
                onChange={setAmplitude} unit="V" color="blue"
              />
              <ControlSlider
                label="Frequency"
                value={frequency} min={25} max={100} step={5}
                onChange={setFrequency} unit=" Hz" color="amber"
              />
            </div>

            {/* Load */}
            <div className="panel p-5 flex flex-col gap-5">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest">Load</p>
              <ControlSlider
                label="Load Resistance"
                value={loadResistance} min={100} max={10000} step={100}
                onChange={setLoadResistance} unit=" Ω" color="rose"
                formatVal={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}
              />
            </div>

            {/* Filter capacitor */}
            <div className="panel p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-surface-300">Filter Capacitor</p>
                  <p className="text-xs text-surface-500 font-mono mt-0.5">RC smoothing circuit</p>
                </div>
                <button
                  onClick={toggleFilter}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                    filterEnabled
                      ? 'bg-emerald-900/30 border-emerald-700/40 text-emerald-400'
                      : 'bg-surface-800 border-surface-700 text-surface-500 hover:text-surface-300'
                  }`}
                >
                  {filterEnabled ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                  {filterEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <AnimatePresence>
                {filterEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <ControlSlider
                      label="Capacitance"
                      value={capacitance} min={10} max={1000} step={10}
                      onChange={setCapacitance} unit=" µF" color="green"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Observation card */}
            <ObservationCard metrics={metrics} circuitType={circuitType} filterEnabled={filterEnabled} />
          </motion.div>

          {/* RIGHT — Waveform + metrics + circuit */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-4"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          >
            {/* Waveform chart */}
            <div className="panel p-5" ref={graphRef}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-primary-400" />
                  <span className="text-xs font-semibold text-surface-400 uppercase tracking-widest">
                    Waveform — 2 Cycles
                  </span>
                </div>
                <div className="flex gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-primary-400 inline-block rounded" />
                    <span className="text-surface-400">AC input</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-amber-400 inline-block rounded" />
                    <span className="text-surface-400">DC output</span>
                  </span>
                </div>
              </div>

              <div className="h-56 bg-surface-900/60 rounded-xl border border-surface-700 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={waveData} margin={{ top: 8, right: 16, bottom: 20, left: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis
                      dataKey="t"
                      tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#334155' }} tickLine={false}
                      tickCount={8}
                    >
                      <Label value="Time (ms)" position="insideBottom" offset={-12}
                        style={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                    </XAxis>
                    <YAxis
                      domain={[-amplitude * 1.15, amplitude * 1.15]}
                      tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#334155' }} tickLine={false} width={36}
                    >
                      <Label value="V (volts)" angle={-90} position="insideLeft" offset={8}
                        style={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                    </YAxis>
                    <Tooltip content={<WaveTooltip />} />
                    <ReferenceLine y={0} stroke="#334155" strokeWidth={1} />
                    <ReferenceLine y={parseFloat(metrics.Vdc)} stroke="#F59E0B"
                      strokeDasharray="4 3" strokeWidth={1}
                      label={{ value: `Vdc=${metrics.Vdc}V`, position: 'right',
                        style: { fill: '#F59E0B', fontSize: 8, fontFamily: 'JetBrains Mono' } }} />
                    <Line type="monotone" dataKey="vin"  stroke="#3B82F6" strokeWidth={1.5}
                      dot={false} isAnimationActive={false} name="Vin" />
                    <Line type="monotone" dataKey="vout" stroke="#F59E0B" strokeWidth={2}
                      dot={false} isAnimationActive={false} name="Vout" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <MetricCard label="Peak Output"   value={metrics.Vpeak}       unit="V"   color="#1A56DB" />
              <MetricCard label="Vdc Output"    value={metrics.Vdc}         unit="V"   color="#F59E0B" sub={filterEnabled ? 'filtered' : undefined} />
              <MetricCard label="Ripple Factor" value={metrics.rippleFactor} unit="γ"  color={parseFloat(metrics.rippleFactor) < 0.5 ? '#22C55E' : '#F43F5E'} />
              <MetricCard label="PIV Rating"    value={metrics.piv}         unit="V"   color="#7C3AED" sub="per diode" />
              <MetricCard label="Output Freq."  value={metrics.freqOut}     unit="Hz"  color="#0E7490" />
            </div>

            {/* Circuit diagram */}
            <div className="panel p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={13} className="text-primary-400" />
                <span className="text-xs font-semibold text-surface-400 uppercase tracking-widest">
                  Circuit Diagram — {isHalf ? 'Half-Wave' : 'Full-Wave Bridge'}
                </span>
              </div>
              <div className="bg-surface-900/60 rounded-xl border border-surface-700 p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={circuitType}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isHalf
                      ? <HalfWaveCircuit active={true} />
                      : <FullWaveCircuit active={true} />
                    }
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs font-mono text-surface-500">
                <div>
                  <span className="text-primary-400">Vdc =</span>
                  {isHalf ? ' Vm / π ≈ 0.318·Vm' : ' 2Vm / π ≈ 0.637·Vm'}
                </div>
                <div>
                  <span className="text-amber-400">γ =</span>
                  {isHalf ? ' √(π²/4 − 1) ≈ 1.21' : ' √(π²/8 − 1) ≈ 0.482'}
                </div>
                <div>
                  <span className="text-violet-400">PIV =</span>
                  {isHalf ? ' Vm (single diode)' : ' Vm (per bridge diode)'}
                </div>
                <div>
                  <span className="text-emerald-400">fout =</span>
                  {isHalf ? ' fin (same freq)' : ' 2 × fin (doubled)'}
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}
