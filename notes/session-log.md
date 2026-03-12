# LogicFlow — Session Log

## Day 1

### What was built
- ✅ Vite + React 18 scaffold with all dependencies in package.json
- ✅ tailwind.config.js with full design token system (colors, fonts, animations)
- ✅ postcss.config.js
- ✅ index.html with Google Fonts (Syne, Outfit, JetBrains Mono)
- ✅ src/index.css with Tailwind directives, component classes, circuit-grid background
- ✅ src/main.jsx entry point with BrowserRouter
- ✅ src/App.jsx with all routes wired up
- ✅ All 5 Zustand stores: diodeStore, zenerStore, gateStore, coaStore, uiStore
- ✅ src/utils/diodePhysics.js (Shockley equation, curve generation, current formatter)
- ✅ src/utils/gateLogic.js (pure gate functions, propagation, truth table generator)
- ✅ src/utils/cn.js (clsx + tailwind-merge helper)
- ✅ src/components/ui/Nav.jsx (responsive navigation with active states)
- ✅ src/pages/Landing.jsx (full hero, modules, differentiators, bridge callout, footer)
- ✅ All page stubs (DiodeLab, ZenerLab, Sandbox, CoaPipeline, CoaRegisters, CoaOverview, QuickLab, Curriculum)
- ✅ notes/architecture.md
- ✅ notes/decisions.md

### What is broken / TODO
- None known. App shell is clean.

### Notes
- All physics math is ready in diodePhysics.js — do not rewrite on Day 2, just import and use.
- The Shockley equation at large forward voltages produces very large numbers — generateDiodeCurve
  already clamps to ±100mA. Check this is visible in the graph range on Day 2.

### ✅ Day 1 Complete

---

## Day 2

### What was built
- ✅ src/components/diode/BiasToggle.jsx — forward/reverse mode switcher, resets voltage on switch
- ✅ src/components/diode/Multimeter.jsx — three-panel instrument (Voltage, Current, Temp) with auto-unit formatting (mA/µA/nA)
- ✅ src/components/diode/VIGraph.jsx — Recharts LineChart with live Q-point tracker, reference lines, knee voltage marker, equation annotations
- ✅ src/components/diode/DiodeCircuit.jsx — SVG schematic with animated current-flow dots (SVG animateMotion)
- ✅ src/pages/DiodeLab.jsx — full 2-column layout wiring all 4 components + dynamic ObservationCard + Shockley equation reference

### What is working
- Voltage slider → diodePhysics.js → VIGraph re-renders (live curve)
- Voltage slider → Multimeter reads update in real time
- BiasToggle switches mode → graph domain flips, slider range resets to 0
- Temperature slider → full curve regenerates (useMemo on temperature)
- DiodeCircuit SVG dots animate when voltage > 0.6V (conducting state)
- ObservationCard text updates dynamically with voltage/mode

### Known issues / watch for
- VIGraph Q-point is shown via two ReferenceLine crosshairs — not a true dot on the curve.
  On Day 5 polish pass, consider finding the nearest curveData point and rendering a custom dot.
- DiodeCircuit SVG animateMotion may not work in all browsers without a polyfill (Chrome/Firefox OK).

### ✅ Day 2 Complete

## Day 3

### What was built
- ✅ src/components/shared/ControlSlider.jsx — reusable slider (replaces inline version in DiodeLab)
- ✅ src/components/diode/ZenerVIGraph.jsx — V-I curve with breakdown region shading, live Vz marker, BREAKDOWN badge
- ✅ src/components/diode/ZenerMultimeter.jsx — 4-panel instrument (Voltage, Current, Power, Vz) from zenerStore
- ✅ src/components/diode/ZenerCircuit.jsx — SVG Zener regulator with bent-cathode symbol + animated current dots
- ✅ src/pages/ZenerLab.jsx — full page with What-If mode, AnimatePresence Vz/Temp sliders, comparison table, quick-preset buttons
- ✅ src/components/ui/Nav.jsx — Experiments dropdown with PN Diode + Zener Diode, closes on outside click

### What is working
- Voltage drag into breakdown region → BREAKDOWN badge pulses on graph, rose wire colours, ObservationCard animates
- What-If Mode toggle → violet banner, Vz slider + Temp slider slide in/out with AnimatePresence
- Vz slider → ReferenceLine on ZenerVIGraph moves in real time, entire curve regenerates
- Quick-preset buttons: "At Vz", "0 V", "+0.7V" — instant navigation to interesting operating points
- Nav dropdown: both experiments listed with Exp 01 / Exp 02 badges, closes on click-outside

### ✅ Day 3 Complete

---

## Day 4

### What was built
- ✅ src/components/gates/GateNode.jsx — SVG gate symbols for AND/OR/NOT/NAND/NOR/XOR/XNOR, signal-reactive fill/stroke, ReactFlow handles
- ✅ src/components/gates/InputNode.jsx — clickable toggle switch, drives inputStates in gateStore
- ✅ src/components/gates/OutputNode.jsx — LED indicator, reads outputStates, glows green on HIGH
- ✅ src/components/gates/SignalEdge.jsx — custom animated edge: colour-coded (green/red/grey), pulse dot travels on signal change, delete button on hover
- ✅ src/components/gates/GatePalette.jsx — draggable left sidebar with all 6 gate types + INPUT/OUTPUT tiles + Tidy/Clear buttons
- ✅ src/data/presets.js — 4 preset circuits: NOT, AND, Half Adder, NAND-as-NOT
- ✅ src/pages/Sandbox.jsx — full ReactFlow canvas with drop handler, onConnect, propagation useEffect, truth table panel, preset picker, Share URL, Bridge CTA
- ✅ src/index.css — ReactFlow dark mode overrides

### What is working
- Drag any gate/IO tile from palette → drops onto canvas at cursor position
- Connect handles → SignalEdge created, coloured grey (no signal yet)
- Click INPUT node → toggles 0↔1 → propagateSignals() runs → all downstream edges + OutputNode update colour
- Signal change → pulse dot animates along edge wire
- Bridge CTA badge appears when canvas contains XOR + AND + 2 inputs (Half Adder pattern)
- Truth table panel: auto-generates all 2^n rows from current circuit
- "Load Demo" → Half Adder preset drops in fully wired and ready to toggle
- "Tidy Layout" → nodes re-arranged left-to-right by type
- "Share" → circuit serialised to URL param, copied to clipboard

### Known issues / watch for
- onNodesChange uses require() inline — refactor to static import on Day 5 polish pass
- Truth table only works with nodes typed exactly 'inputNode'/'outputNode' — custom label nodes may not appear


### ✅ Day 4 Complete

---

## Day 5

### What was built
- ✅ src/pages/CoaOverview.jsx — full COA module landing page: hero, 4 concept cards, 2 experiment cards, Von Neumann architecture SVG diagram, Bridge callout
- ✅ src/pages/CoaPipeline.jsx — interactive pipeline stepper: 4 animated stage boxes, pulsing active stage, auto-play with configurable speed, register bank panel, program listing with active row indicator, stage detail text, CSV-ready
- ✅ src/pages/CoaRegisters.jsx — bit-level register visualizer: 5 register cards with 8-bit tile grid, hex/dec/bin display, animated bit highlights on change, flag register, change history log
- ✅ src/components/ui/Nav.jsx — added COA dropdown (Overview + Pipeline + Registers) with same pattern as Experiments dropdown

### What is working
- CoaOverview: concept cards + experiment cards link to /coa/pipeline and /coa/registers
- CoaPipeline: "Next Stage" button steps through all 4 stages × 5 instructions = 20 cycles; register values animate on change; "Auto-play" button cycles at 1.2s per stage
- CoaRegisters: bit tiles flash amber on update; "updated" badge appears briefly; change log shows all reg mutations with from/to hex values
- Both pipeline pages share coaStore state — navigating between them preserves position
- COA dropdown in Nav covers all three routes

### ✅ Day 5 Complete

---

## Day 6

### What was built
- ✅ src/components/shared/LabReportExporter.jsx — jsPDF + html2canvas PDF generator: A4 layout, college header band, student info grid, apparatus table, theory section, observation table, graph screenshot, conclusion, sign-off boxes, page numbering, footer on all pages
- ✅ src/pages/Curriculum.jsx — full course mapping page: university selector (AKTU/VTU/Anna/Mumbai), experiments by module, paper code + sem + topic + CO per uni, lab record completeness tracker per experiment
- ✅ src/pages/CoaPipeline.jsx — Bridge Feature panel: appears on Execute stage, SVG Half Adder → 8-bit ALU → Execute diagram, links to Quick Lab and Sandbox
- ✅ src/pages/DiodeLab.jsx — wired LabReportExporter with graphRef on VIGraph panel, pre-filled aim/apparatus/theory/observations/conclusion
- ✅ src/pages/ZenerLab.jsx — same PDF export wiring with Zener-specific content and dynamic Vz value in text

### What is working
- Click "Export Lab Report" in DiodeLab → generates and downloads LogicFlow_Exp01_LabReport.pdf
- Graph screenshot captured via html2canvas from the live Recharts panel
- Curriculum page university switcher → paper codes and topic names update per university
- Bridge Feature: appears when pipeline hits Execute stage, SVG diagram shows XOR+AND → ALU → pipeline chain
- All 6 experiments listed in Curriculum with correct module grouping

### ✅ Day 6 Complete
