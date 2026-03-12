import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RotateCcw, FlaskConical, ChevronRight,
  Thermometer, Zap, ToggleLeft, ToggleRight, Info,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { useZenerStore }  from '../store/zenerStore'
import { useUiStore }     from '../store/uiStore'
import ControlSlider      from '../components/shared/ControlSlider'
import ZenerVIGraph       from '../components/diode/ZenerVIGraph'
import ZenerMultimeter    from '../components/diode/ZenerMultimeter'
import ZenerCircuit       from '../components/diode/ZenerCircuit'
import LabReportExporter  from '../components/shared/LabReportExporter'

// ─── Zener-specific observation card ─────────────────────────────
function ZenerObservation({ voltage, breakdownVoltage }) {
  const isBreakdown = voltage <= breakdownVoltage + 0.05
  const isForward   = voltage >= 0.6
  const nearBreak   = voltage > breakdownVoltage + 0.05 && voltage < breakdownVoltage + 1

  const obs = (() => {
    if (isBreakdown) return {
      title: '⚡ Breakdown Region — Regulation Active',
      color: 'rose',
      points: [
        `Vout is clamped at ${Math.abs(breakdownVoltage).toFixed(1)} V regardless of input.`,
        'Zener absorbs excess current — acts as voltage regulator.',
        'This is the normal operating region for a Zener diode.',
        'Power dissipation P = Vz × Iz — keep within rated limit.',
      ],
    }
    if (nearBreak) return {
      title: '🔶 Approaching Breakdown',
      color: 'amber',
      points: [
        `Vz = ${Math.abs(breakdownVoltage).toFixed(1)} V — decrease voltage slightly to trigger.`,
        'Avalanche or Zener tunnelling about to occur.',
        'Current will spike sharply once threshold is crossed.',
      ],
    }
    if (isForward) return {
      title: '→ Forward Bias (Zener behaves as normal diode)',
      color: 'blue',
      points: [
        'Zener conducts in forward direction like any silicon diode.',
        'Forward voltage drop ≈ 0.7 V.',
        'Not the intended operating mode for regulation.',
      ],
    }
    return {
      title: '◌ Reverse Bias — Awaiting Breakdown',
      color: 'slate',
      points: [
        `Applied reverse voltage (${Math.abs(voltage).toFixed(2)} V) < Vz (${Math.abs(breakdownVoltage).toFixed(1)} V).`,
        'Only tiny reverse leakage current flows.',
        `Increase reverse voltage to reach ${Math.abs(breakdownVoltage).toFixed(1)} V.`,
      ],
    }
  })()

  const s = {
    rose:  { border: 'border-rose-700/50',    bg: 'bg-rose-950/20',    title: 'text-rose-400'    },
    amber: { border: 'border-amber-700/50',   bg: 'bg-amber-950/20',   title: 'text-amber-400'   },
    blue:  { border: 'border-blue-700/50',    bg: 'bg-blue-950/20',    title: 'text-blue-400'    },
    slate: { border: 'border-surface-700',    bg: 'bg-surface-800/40', title: 'text-surface-400' },
  }[obs.color]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={obs.title}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className={`rounded-xl border p-4 h-full ${s.border} ${s.bg}`}
      >
        <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${s.title}`}>
          {obs.title}
        </p>
        <ul className="space-y-2">
          {obs.points.map((pt) => (
            <li key={pt} className="text-xs text-surface-400 flex items-start gap-1.5">
              <span className="flex-shrink-0 mt-0.5">→</span>{pt}
            </li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── What-If Mode toggle button ───────────────────────────────────
function WhatIfToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold
                  transition-all duration-200 ${
        enabled
          ? 'bg-violet-900/30 border-violet-600/50 text-violet-300'
          : 'bg-surface-800 border-surface-600 text-surface-400 hover:text-surface-200'
      }`}
    >
      {enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
      What-If Mode
    </button>
  )
}

// ─── Main page ────────────────────────────────────────────────────
export default function ZenerLab() {
  const {
    voltage, breakdownVoltage, temperature, whatIfMode,
    setVoltage, setBreakdownVoltage, setTemperature,
    toggleWhatIf, reset,
  } = useZenerStore()

  const { setActiveModule } = useUiStore()
  useEffect(() => { setActiveModule('zener') }, [])

  const graphRef = useRef(null)
  const isBreakdown = voltage <= breakdownVoltage + 0.05

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 bg-surface-900 circuit-grid">

      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div
        className="max-w-6xl mx-auto mb-8"
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-xs font-mono">
              <Link to="/lab/diode" className="text-surface-500 hover:text-primary-400 transition-colors">
                Diode Lab
              </Link>
              <ChevronRight size={12} className="text-surface-700" />
              <span className="badge badge-blue text-xs">Experiment 02</span>
            </div>

            <h1 className="font-display font-bold text-3xl text-white mb-1">
              Zener Diode
            </h1>
            <p className="text-surface-400 text-sm max-w-xl">
              Explore reverse breakdown and voltage regulation. Drag voltage into the breakdown
              region and watch the Zener clamp the output. Use What-If Mode to see how Vz shifts
              the entire characteristic curve.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <WhatIfToggle enabled={whatIfMode} onToggle={toggleWhatIf} />
            <LabReportExporter
              experiment="Zener Diode"
              expNumber="02"
              aim="To plot the V-I characteristics of a Zener diode and determine the breakdown voltage, dynamic resistance, and voltage regulation characteristics."
              apparatus={['Zener Diode (1N4733A, Vz=5.1V)', 'DC Power Supply (0–12V)', 'Ammeter (0–200mA)', 'Voltmeter (0–12V)', 'Series Resistor 470Ω', 'Bread board, connecting wires']}
              theory={`The Zener diode is designed to operate in the reverse breakdown region. Below breakdown voltage (Vz), only tiny leakage current flows. At Vz, avalanche or Zener tunneling causes a sharp increase in current while voltage stays nearly constant — enabling voltage regulation. The 1N4733A has Vz = 5.1V at 76mA test current.`}
              tableRows={[
                { v: breakdownVoltage - 2, i: '< 1 µA',     region: 'Reverse (pre-breakdown)' },
                { v: breakdownVoltage + 0.05, i: '≈ 50 mA', region: 'Breakdown (Vz)' },
                { v: 0, i: '0 mA',                          region: 'Zero bias' },
                { v: 0.7, i: '≈ 10 mA',                     region: 'Forward active' },
              ]}
              observations={`Reverse breakdown observed at Vz ≈ ${Math.abs(breakdownVoltage).toFixed(1)}V. Output voltage remains clamped at Vz even with varying input — confirming regulation action. What-If Mode demonstrates negative temperature coefficient for Vz < 5V devices.`}
              conclusion={`The Zener diode V-I characteristics were successfully plotted. Breakdown voltage confirmed at ${Math.abs(breakdownVoltage).toFixed(1)}V. The diode maintains constant output voltage in breakdown region, validating its use as a shunt voltage regulator.`}
              graphRef={graphRef}
            />
            <button onClick={reset} className="btn-secondary flex items-center gap-2 text-sm py-2">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* What-If mode banner */}
        <AnimatePresence>
          {whatIfMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
              className="mt-4 rounded-xl border border-violet-700/40 bg-violet-950/20 px-4 py-3
                         flex items-center gap-3 text-sm"
            >
              <Info size={15} className="text-violet-400 flex-shrink-0" />
              <p className="text-violet-300">
                <span className="font-semibold">What-If Mode active.</span>{' '}
                The Vz and Temperature sliders now control the diode parameters —
                watch the entire V-I curve shift in real time as you adjust them.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── 2-column layout ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT — Controls ────────────────────────────────────── */}
        <motion.div
          className="lg:col-span-1 flex flex-col gap-4"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Voltage slider */}
          <div className="panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} className={isBreakdown ? 'text-rose-400' : 'text-primary-400'} />
              <span className="text-xs font-semibold text-surface-400 uppercase tracking-widest">
                Applied Voltage
              </span>
            </div>
            <ControlSlider
              value={voltage} min={-8} max={1.5} step={0.05}
              onChange={setVoltage} unit="V"
              color={isBreakdown ? 'rose' : voltage >= 0.6 ? 'green' : 'blue'}
              formatVal={(v) => v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
            />
            {/* Quick preset buttons */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {[
                { label: 'At Vz', val: breakdownVoltage - 0.1, color: 'rose' },
                { label: '0 V',   val: 0,                      color: 'slate' },
                { label: '+0.7V', val: 0.7,                    color: 'blue' },
              ].map(({ label, val, color }) => (
                <button
                  key={label}
                  onClick={() => setVoltage(val)}
                  className="text-xs font-mono px-2.5 py-1 rounded-md border border-surface-600
                             bg-surface-800 text-surface-400 hover:text-surface-200
                             hover:border-surface-500 transition-all"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* What-If controls — shown only when enabled */}
          <AnimatePresence>
            {whatIfMode && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                {/* Vz slider */}
                <div className="panel p-5 border-violet-700/30">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-violet-300 uppercase tracking-widest">
                      Breakdown Voltage (Vz)
                    </span>
                  </div>
                  <ControlSlider
                    value={Math.abs(breakdownVoltage)} min={2} max={8} step={0.1}
                    onChange={(v) => setBreakdownVoltage(-v)}
                    unit="V" color="rose"
                    formatVal={(v) => `${v.toFixed(1)}`}
                  />
                  <p className="text-xs text-surface-500 font-mono mt-2">
                    Watch the Vz marker slide on the graph →
                  </p>
                </div>

                {/* Temperature slider */}
                <div className="panel p-5 border-violet-700/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Thermometer size={14} className="text-amber-400" />
                    <span className="text-xs font-semibold text-violet-300 uppercase tracking-widest">
                      Temperature
                    </span>
                  </div>
                  <ControlSlider
                    value={temperature} min={0} max={100} step={1}
                    onChange={setTemperature} unit="°C" color="amber"
                  />
                  <p className="text-xs text-surface-500 font-mono mt-2">
                    ↑ Temp → Vz slightly decreases (negative tempco for Vz &lt; 5V)
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Static Zener parameters */}
          <div className="panel p-5">
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical size={14} className="text-rose-400" />
              <span className="text-xs font-semibold text-surface-400 uppercase tracking-widest">
                Zener Parameters
              </span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              {[
                ['Type',        '1N4733A'],
                ['Vz (nom.)',   `${Math.abs(breakdownVoltage).toFixed(1)} V`],
                ['Iz (test)',   '76 mA'],
                ['Zzt',         '7 Ω'],
                ['Tempco',      '< 5V → negative'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-surface-500">{k}</span>
                  <span className="text-surface-200 font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation to next experiment */}
          <div className="panel p-4 border-surface-700/50">
            <p className="text-xs text-surface-500 mb-2">Previous experiment</p>
            <Link
              to="/lab/diode"
              className="flex items-center justify-between text-sm text-surface-300
                         hover:text-primary-300 transition-colors group"
            >
              <span>← PN Junction Diode</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* RIGHT — Graph + instruments ─────────────────────────── */}
        <motion.div
          className="lg:col-span-2 flex flex-col gap-4"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* V-I Graph */}
          <div className="panel p-5" ref={graphRef}>
            <ZenerVIGraph />
          </div>

          {/* Multimeter */}
          <div className="panel p-5">
            <ZenerMultimeter />
          </div>

          {/* Circuit + Observation side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="panel p-4">
              <ZenerCircuit />
            </div>
            <div className="panel p-4">
              <ZenerObservation voltage={voltage} breakdownVoltage={breakdownVoltage} />
            </div>
          </div>

          {/* Comparison vs PN diode */}
          <div className="panel p-5">
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-4">
              Zener vs PN Junction Diode
            </p>
            <div className="grid grid-cols-2 gap-px bg-surface-700 rounded-lg overflow-hidden text-xs font-mono">
              {[
                ['Property',         'PN Diode',          'Zener Diode'],
                ['Forward drop',     '≈ 0.7 V',           '≈ 0.7 V (same)'],
                ['Reverse bias',     'Blocks (open)',      'Blocks until Vz'],
                ['Breakdown use',    'Destructive — avoid','Intentional — regulates'],
                ['Primary use',      'Rectification',     'Voltage regulation'],
                ['Breakdown Vz',     '> 50 V (PIV)',      '2.4 V – 200 V range'],
              ].map((row, i) => (
                row.map((cell, j) => (
                  <div key={`${i}-${j}`} className={`px-3 py-2 ${
                    i === 0 ? 'bg-surface-700 text-surface-300 font-semibold' :
                    j === 0 ? 'bg-surface-800/80 text-surface-400' :
                    j === 2 ? 'bg-rose-950/20 text-rose-300' :
                    'bg-surface-800/50 text-surface-300'
                  }`}>
                    {cell}
                  </div>
                ))
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
