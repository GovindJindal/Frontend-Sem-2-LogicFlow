# LogicFlow — Architecture

## System Overview
Three-module React SPA. One frontend (Vite + React 18), no backend.
All physics/logic runs in the browser via JavaScript.

## Module Boundaries

### 1. Digital Electronics Lab
- Routes: /lab/diode, /lab/zener
- State: diodeStore, zenerStore (Zustand)
- Physics: src/utils/diodePhysics.js (Shockley equation)
- Charts: Recharts LineChart (V-I curves)

### 2. Logic Gate Sandbox
- Route: /sandbox, /quick-lab/:id
- State: gateStore (Zustand)
- Canvas: ReactFlow (nodes = gates, edges = wires)
- Logic: src/utils/gateLogic.js (pure functions)

### 3. Computer Architecture Visualizer
- Routes: /coa, /coa/pipeline, /coa/registers
- State: coaStore (Zustand)
- Animation: Framer Motion (stage transitions, bit flips)

## Cross-Cutting Concerns
- Routing: React Router v6 (BrowserRouter)
- Styling: Tailwind CSS + custom tokens in tailwind.config.js
- Animation: Framer Motion (page transitions, propagation)
- PDF Export: jsPDF + html2canvas (client-side only)
- Deployment: Vercel (free tier)

## Bridge Feature
The key innovation: /sandbox → "See This in CPU" button → /coa/alu?highlight=half-adder
Implemented in Day 9. Requires Half Adder detection in gateStore.
