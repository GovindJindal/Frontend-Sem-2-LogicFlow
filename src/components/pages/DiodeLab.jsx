import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, BookOpen, ChevronRight, Thermometer, Sliders } from 'lucide-react'

import { useDiodeStore } from '../store/diodeStore'
import { useUiStore }   from '../store/uiStore'
import { diodeCurrent, formatCurrent } from '../utils/diodePhysics'

import BiasToggle         from '../components/diode/BiasToggle'
import Multimeter         from '../components/diode/Multimeter'
import VIGraph            from '../components/diode/VIGraph'
import DiodeCircuit       from '../components/diode/DiodeCircuit'
import LabReportExporter  from '../components/shared/LabReportExporter'

// ─── Reusable slider ────────────────────────────────────────────
function ControlSlider({ label, value, min, max, step, onChange, unit, color = 'blue', formatVal }) {
  const pct = ((value - min) / (max - min)) * 100
  const trackColor = color === 'amber' ? '#F59E0B' : color === 'rose' ? '#F43F5E' : '#1A56DB'
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-surface-400 uppercase tracking-widest">{label}</label>
          <span className="font-mono text-sm font-bold text-surface-200">
            {formatVal ? formatVal(value) : value}{unit}
          </span>
        </div>
      )}
      {!label && (
        <div className="flex justify-end">
          <span className="font-mono text-sm font-bold text-surface-200">
            {formatVal ? formatVal(value) : value}{unit}
          </span>
        </div>
      )}
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, ${trackColor} ${pct}%, #334155 ${pct}%)` }}
      />
      <div className="flex justify-between text-xs font-mono text-surface-600">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  )
}

// ─── Dynamic observation card ────────────────────────────────────
function ObservationCard({ voltage, biasMode }) {
  const obs = (() => {
    if (biasMode === 'reverse') return {
      title: 'Reverse Bias', color: 'rose',
      points: ['Depletion region widens — barrier increases.','Only tiny leakage current (nA range).','Diode acts as an open switch.'],
    }
    if (voltage < 0.3) return {
      title: 'Cut-off Region', color: 'slate',
      points: ['Applied voltage below threshold.','Depletion barrier not overcome.','No significant current flow.'],
    }
    if (voltage < 0.7) return {
      title: 'Near Threshold (0.7V knee)', color: 'amber',
      points: ['Approaching knee voltage for silicon.','Current beginning to rise exponentially.','Depletion region narrowing.'],
    }
    return {
      title: 'Active Conduction', color: 'green',
      points: ['Knee voltage exceeded — diode conducting.','Current rises sharply (exponential).','Forward voltage drop ≈ 0.7 V (constant).'],
    }
  })()

  const styles = {
    rose:  { border: 'border-rose-700/50',     bg: 'bg-rose-950/20',     title: 'text-rose-400'     },
    amber: { border: 'border-amber-700/50',    bg: 'bg-amber-950/20',    title: 'text-amber-400'    },
    green: { border: 'border-emerald-700/50',  bg: 'bg-emerald-950/20',  title: 'text-emerald-400'  },
    slate: { border: 'border-surface-700',     bg: 'bg-surface-800/40',  title: 'text-surface-400'  },
  }
  const s = styles[obs.color]

  return (
    <div className={`rounded-xl border p-4 h-full ${s.border} ${s.bg}`}>
      <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${s.title}`}>
        📋 {obs.title}
      </p>
      <ul className="space-y-2">
        {obs.points.map((pt) => (
          <li key={pt} className="text-xs text-surface-400 flex items-start gap-1.5">
            <span className="flex-shrink-0 mt-0.5">→</span>{pt}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Main page component ─────────────────────────────────────────
export default function DiodeLab() {
  const { voltage, biasMode, temperature, setVoltage, setTemperature, reset } = useDiodeStore()
  const { setActiveModule } = useUiStore()
  useEffect(() => { setActiveModule('diode') }, [])

  const graphRef = useRef(null)

  const vMin  = biasMode === 'forward' ? -0.5 : -2.0
  const vMax  = biasMode === 'forward' ?  1.2 :  0.5

  // Build observation table rows for PDF (10 sample points)
  const tableRows = (() => {
    const pts = []
    const vPoints = biasMode === 'forward'
      ? [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.65, 0.7, 0.75]
      : [-2, -1.8, -1.5, -1.2, -1, -0.8, -0.5, -0.3, -0.1, 0]
    vPoints.forEach((v) => {
      const iA = diodeCurrent(v, temperature, 1e-12, 1)
      const { value: iVal, unit } = formatCurrent(iA)
      const region = v < 0.3 ? (v < 0 ? 'Reverse' : 'Cut-off') : v < 0.7 ? 'Transition' : 'Forward Active'
      pts.push({ v, i: `${iVal} ${unit}`, region })
    })
    return pts
  })()

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 bg-surface-900 circuit-grid">

      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div className="max-w-6xl mx-auto mb-8"
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-blue text-xs">Digital Electronics</span>
              <ChevronRight size={12} className="text-surface-600" />
              <span className="text-surface-400 text-xs font-mono">Experiment 01</span>
            </div>
            <h1 className="font-display font-bold text-3xl text-white mb-1">PN Junction Diode</h1>
            <p className="text-surface-400 text-sm max-w-xl">
              Adjust voltage and temperature to plot the V-I characteristic in real time.
              Observe the Shockley equation at work.
            </p>
          </div>
          <div className="flex gap-2">
            <LabReportExporter
              experiment="PN Junction Diode"
              expNumber="01"
              aim="To plot the V-I characteristics of a PN junction diode and determine the knee voltage, forward resistance, and reverse saturation current."
              apparatus={['PN Junction Diode (1N4007)', 'DC Power Supply (0–5V)', 'Ammeter (0–200mA)', 'Voltmeter (0–5V)', 'Resistor 1kΩ', 'Bread board, connecting wires']}
              theory={`The PN junction diode is a two-terminal semiconductor device. In forward bias (anode +ve), the depletion region narrows and current increases exponentially following the Shockley equation: I = Is(e^(V/nVt) - 1). The knee voltage for silicon is approximately 0.7V. In reverse bias, only a small leakage current (Is ≈ 1nA) flows.`}
              tableRows={tableRows}
              observations={`Forward bias: Knee voltage observed at approximately 0.7V. Current rises exponentially beyond threshold. Reverse bias: Negligible leakage current observed (< 1µA). Temperature increase shifts the curve — higher temperature reduces knee voltage slightly.`}
              conclusion={`The V-I characteristics of the PN junction diode were successfully plotted. The exponential nature of forward conduction confirms the Shockley equation. The diode exhibits unidirectional current flow, making it suitable for rectification applications.`}
              graphRef={graphRef}
            />
            <button onClick={reset} className="btn-secondary flex items-center gap-2 text-sm py-2">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Two-column layout ────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT — Controls */}
        <motion.div className="lg:col-span-1 flex flex-col gap-4"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>

          <div className="panel p-5"><BiasToggle /></div>

          <div className="panel p-5">
            <ControlSlider
              label="Applied Voltage" value={voltage}
              min={vMin} max={vMax} step={0.01} onChange={setVoltage}
              unit="V" color={biasMode === 'reverse' ? 'rose' : 'blue'}
              formatVal={(v) => v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
            />
          </div>

          <div className="panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <Thermometer size={14} className="text-amber-400" />
              <span className="text-xs font-semibold text-surface-400 uppercase tracking-widest">Temperature</span>
            </div>
            <ControlSlider
              value={temperature} min={0} max={100} step={1}
              onChange={setTemperature} unit="°C" color="amber"
            />
            <p className="text-xs text-surface-500 font-mono mt-2">↑ Temp → ↑ Vt → curve shifts left</p>
          </div>

          <div className="panel p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sliders size={14} className="text-primary-400" />
              <span className="text-xs font-semibold text-surface-400 uppercase tracking-widest">Diode Parameters</span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              {[['Material','Silicon (Si)'],['Is (sat.)','1×10⁻¹² A'],['n (ideality)','1.0'],['Vf (typ.)','0.7 V']].map(([k,v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-surface-500">{k}</span>
                  <span className="text-surface-200 font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Graph + instruments */}
        <motion.div className="lg:col-span-2 flex flex-col gap-4"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>

          <div className="panel p-5" ref={graphRef}><VIGraph /></div>
          <div className="panel p-5"><Multimeter /></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="panel p-4"><DiodeCircuit /></div>
            <div className="panel p-4">
              <ObservationCard voltage={voltage} biasMode={biasMode} />
            </div>
          </div>

          {/* Equation reference */}
          <div className="panel p-5">
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-3">Shockley Diode Equation</p>
            <div className="font-mono text-sm text-center py-3 px-4 bg-surface-900/60 rounded-lg border border-surface-700">
              <span className="text-sky-400">I</span>
              <span className="text-surface-400"> = </span>
              <span className="text-emerald-400">Is</span>
              <span className="text-surface-400"> · (e</span>
              <span className="text-amber-400">^(V / n·Vt)</span>
              <span className="text-surface-400"> − 1)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[['Is','Reverse saturation current','A'],['V','Applied voltage','V'],['n','Ideality factor','1–2'],['Vt','Thermal voltage (kT/q)','≈ 26mV @ 25°C']].map(([sym,desc,unit]) => (
                <div key={sym} className="flex gap-2 items-start">
                  <span className="font-mono font-bold text-amber-400 text-sm w-5">{sym}</span>
                  <div>
                    <p className="text-xs text-surface-300">{desc}</p>
                    <p className="text-xs text-surface-500 font-mono">{unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
