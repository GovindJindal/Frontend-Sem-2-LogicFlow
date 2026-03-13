import { Routes, Route } from 'react-router-dom'
import Landing       from './pages/Landing'
import DiodeLab      from './pages/DiodeLab'
import ZenerLab      from './pages/ZenerLab'
import Sandbox       from './pages/Sandbox'
import CoaPipeline   from './pages/CoaPipeline'
import CoaRegisters  from './pages/CoaRegisters'
import CoaOverview   from './pages/CoaOverview'
import QuickLab      from './pages/QuickLab'
import Curriculum    from './pages/Curriculum'
import NotFound      from './pages/NotFound'
import Nav           from './components/ui/Nav'

export default function App() {
  return (
    <div className="min-h-screen bg-surface-900 text-surface-100">
      <Nav />
      <Routes>
        <Route path="/"                element={<Landing />} />
        <Route path="/lab/diode"       element={<DiodeLab />} />
        <Route path="/lab/zener"       element={<ZenerLab />} />
        <Route path="/sandbox"         element={<Sandbox />} />
        <Route path="/coa"             element={<CoaOverview />} />
        <Route path="/coa/pipeline"    element={<CoaPipeline />} />
        <Route path="/coa/registers"   element={<CoaRegisters />} />
        <Route path="/quick-lab/:id"   element={<QuickLab />} />
        <Route path="/curriculum"      element={<Curriculum />} />
        <Route path="*"                element={<NotFound />} />
      </Routes>
    </div>
  )
}
