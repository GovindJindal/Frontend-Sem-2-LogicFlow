import { useDiodeStore } from '../../store/diodeStore'
import { cn } from '../../utils/cn'

/**
 * BiasToggle
 * Switches between Forward and Reverse bias modes.
 * Resetting voltage to 0 on switch (prevents invalid states).
 */
export default function BiasToggle() {
  const { biasMode, setBiasMode } = useDiodeStore()

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-surface-400 uppercase tracking-widest">
        Bias Mode
      </label>

      <div className="flex rounded-lg overflow-hidden border border-surface-600 w-fit">
        {['forward', 'reverse'].map((mode) => {
          const active = biasMode === mode
          return (
            <button
              key={mode}
              onClick={() => setBiasMode(mode)}
              className={cn(
                'px-5 py-2 text-sm font-semibold transition-all duration-200 capitalize',
                active
                  ? mode === 'forward'
                    ? 'bg-primary-600 text-white'
                    : 'bg-rose-700 text-white'
                  : 'bg-surface-800 text-surface-400 hover:text-surface-200'
              )}
            >
              {mode}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-surface-500 max-w-[200px]">
        {biasMode === 'forward'
          ? 'P-side positive → current flows above 0.7 V'
          : 'P-side negative → tiny leakage current only'}
      </p>
    </div>
  )
}
