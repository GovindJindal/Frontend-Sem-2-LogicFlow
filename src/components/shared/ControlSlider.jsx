/**
 * ControlSlider
 * Reusable range slider with colour-coded track fill.
 * Used in DiodeLab, ZenerLab, and COA pages.
 *
 * Props:
 *   label      {string}   — row label (omit to show value-only)
 *   value      {number}
 *   min/max    {number}
 *   step       {number}
 *   onChange   {fn}
 *   unit       {string}   — displayed after value (e.g. "V", "°C")
 *   color      {string}   — 'blue' | 'amber' | 'rose' | 'green'
 *   formatVal  {fn}       — optional custom value formatter
 */
export default function ControlSlider({
  label, value, min, max, step = 0.01,
  onChange, unit = '', color = 'blue', formatVal,
}) {
  const pct = ((value - min) / (max - min)) * 100
  const trackColor = {
    blue:  '#1A56DB',
    amber: '#F59E0B',
    rose:  '#F43F5E',
    green: '#22C55E',
  }[color] ?? '#1A56DB'

  const display = formatVal ? formatVal(value) : value

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {label
          ? <span className="text-xs font-semibold text-surface-400 uppercase tracking-widest">{label}</span>
          : <span />
        }
        <span className="font-mono text-sm font-bold text-surface-200">
          {display}{unit}
        </span>
      </div>

      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${trackColor} ${pct}%, #334155 ${pct}%)`,
        }}
      />

      <div className="flex justify-between text-xs font-mono text-surface-600">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}
