# LogicFlow — Decisions Log

## [Day 1] React + Vite over Next.js
**Decision:** Use React 18 + Vite, not Next.js.
**Reason:** This is a pure frontend project. No SSR needed. Vite is faster to develop with,
simpler to deploy on Vercel, and has zero config complexity. Next.js adds server-side complexity
that adds zero value here.

## [Day 1] Tailwind CSS for styling
**Decision:** Tailwind utility classes, not CSS Modules or styled-components.
**Reason:** Design tokens defined once in tailwind.config.js. Utility classes are faster to
iterate on during a 14-day build. No naming conventions to maintain.

## [Day 1] Zustand over Redux / Context
**Decision:** Zustand for all state management.
**Reason:** Zero boilerplate. Each module's state is isolated in its own slice.
Components subscribe only to what they need. No Provider wrapping.

## [Day 1] No backend
**Decision:** All physics, logic, and state runs in the browser.
**Reason:** This is a frontend semester project. A backend would add deployment complexity
and is not required for any core feature. PDF export is client-side via jsPDF.

## [Day 1] Recharts over D3.js
**Decision:** Recharts for all charts/graphs.
**Reason:** Recharts is React-native. D3.js requires imperative DOM manipulation that
conflicts with React's rendering model. Recharts is easier to animate with Framer Motion.
Exception: If D3 force layout is needed for a future feature, use it in a separate canvas
context outside React.

## [Day 1] ReactFlow for Logic Sandbox
**Decision:** ReactFlow for the gate canvas, not custom SVG/Canvas.
**Reason:** ReactFlow handles node drag/drop, edge routing, viewport pan/zoom out of the box.
Building this from scratch would consume 3+ days. ReactFlow is production-ready and
customisable enough for our gate node types.

## [Day 1] Font choices
**Decision:** Syne (display), Outfit (body), JetBrains Mono (values/code)
**Reason:** Syne is an engineering-forward grotesque — bold and precise. Outfit is clean
and readable at body sizes. JetBrains Mono is the industry standard for code/values and
has tabular numbers built in (essential for multimeter display).
