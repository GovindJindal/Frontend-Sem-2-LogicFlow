/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ─── LogicFlow Design Tokens ───────────────────────────────────
      colors: {
        // Primary brand — electric blue
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#1A56DB',   // ← brand default
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Surface — dark slate for UI panels
        surface: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',   // ← panel background
          900: '#0F172A',   // ← page background
          950: '#020617',
        },
        // Accent — amber for warnings, highlights, "live" state
        accent: {
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',   // ← accent default
          600: '#D97706',
          700: '#B45309',
        },
        // Signal colours — for wire states in logic sandbox
        signal: {
          high:   '#22C55E',   // green  — logic HIGH
          low:    '#EF4444',   // red    — logic LOW
          undef:  '#64748B',   // grey   — unconnected
          pulse:  '#38BDF8',   // sky    — propagation animation
        },
      },

      // ─── Typography ─────────────────────────────────────────────────
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],      // headings, hero
        body:    ['"Outfit"', 'sans-serif'],     // body text, UI labels
        mono:    ['"JetBrains Mono"', 'monospace'], // values, code, registers
      },

      // ─── Spacing extras ─────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '128': '32rem',
      },

      // ─── Border radius ───────────────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
      },

      // ─── Box shadows ─────────────────────────────────────────────────
      boxShadow: {
        'glow-blue':  '0 0 20px rgba(26, 86, 219, 0.4)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.4)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.4)',
        'panel':      '0 4px 24px rgba(0,0,0,0.4)',
      },

      // ─── Animations ──────────────────────────────────────────────────
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(26,86,219,0.3)' },
          '50%':       { boxShadow: '0 0 24px rgba(26,86,219,0.8)' },
        },
        'signal-travel': {
          '0%':   { strokeDashoffset: '100%' },
          '100%': { strokeDashoffset: '0%' },
        },
        'bit-flip': {
          '0%':   { transform: 'scaleY(1)',   backgroundColor: '#1E293B' },
          '50%':  { transform: 'scaleY(0.1)', backgroundColor: '#F59E0B' },
          '100%': { transform: 'scaleY(1)',   backgroundColor: '#22C55E' },
        },
        'fade-up': {
          '0%':   { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow':     'pulse-glow 2s ease-in-out infinite',
        'signal-travel':  'signal-travel 0.3s ease-out forwards',
        'bit-flip':       'bit-flip 0.4s ease-in-out',
        'fade-up':        'fade-up 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
