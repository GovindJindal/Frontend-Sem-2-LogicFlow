import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Loader } from 'lucide-react'

/**
 * LabReportExporter
 * Renders a styled hidden "print layout" div, then uses html2canvas + jsPDF
 * to produce a formatted A4 PDF lab report.
 *
 * Props:
 *   experiment   {string}   — "PN Junction Diode" | "Zener Diode"
 *   expNumber    {string}   — "01" | "02"
 *   aim          {string}
 *   apparatus    {string[]}
 *   theory       {string}
 *   tableRows    {Array}    — [{ v, i, unit }]
 *   observations {string}
 *   conclusion   {string}
 *   graphRef     {ref}      — ref to the graph DOM node to screenshot
 *   studentInfo  {object}   — { name, roll, branch, date }
 */
export default function LabReportExporter({
  experiment, expNumber, aim, apparatus,
  theory, tableRows, observations, conclusion,
  graphRef, studentInfo = {},
}) {
  const printRef  = useRef(null)
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  const generate = useCallback(async () => {
    if (loading) return
    setLoading(true)
    setDone(false)

    try {
      // Dynamic imports — only load when user clicks
      const [jsPDFMod, html2canvasMod] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])
      const jsPDF      = jsPDFMod.default
      const html2canvas = html2canvasMod.default

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = 210
      const pageH = 297
      const ml = 15  // margin left
      const mr = 15  // margin right
      const cw = pageW - ml - mr
      let y  = 15

      // ── Helper functions ─────────────────────────────────────
      const setFont = (size, style = 'normal', color = [30, 30, 30]) => {
        pdf.setFontSize(size)
        pdf.setFont('helvetica', style)
        pdf.setTextColor(...color)
      }

      const line = (y1, opacity = 0.15) => {
        pdf.setDrawColor(100, 100, 100)
        pdf.setGState(new pdf.GState({ opacity }))
        pdf.line(ml, y1, pageW - mr, y1)
        pdf.setGState(new pdf.GState({ opacity: 1 }))
      }

      const wrap = (text, x, y, maxW, lineH = 5) => {
        const lines = pdf.splitTextToSize(text, maxW)
        pdf.text(lines, x, y)
        return y + lines.length * lineH
      }

      const newPage = () => {
        pdf.addPage()
        y = 15
        // Page header band
        pdf.setFillColor(26, 86, 219)
        pdf.rect(0, 0, pageW, 8, 'F')
        setFont(7, 'normal', [255, 255, 255])
        pdf.text('LogicFlow Virtual Lab — Confidential Lab Record', ml, 5.5)
        pdf.text(`Exp ${expNumber} · ${experiment}`, pageW - mr - 60, 5.5)
        y = 18
      }

      // ── PAGE 1 ───────────────────────────────────────────────

      // College header band
      pdf.setFillColor(26, 86, 219)
      pdf.rect(0, 0, pageW, 28, 'F')

      setFont(16, 'bold', [255, 255, 255])
      pdf.text('LogicFlow Virtual Laboratory', pageW / 2, 12, { align: 'center' })
      setFont(9, 'normal', [180, 200, 255])
      pdf.text('Digital Electronics & Computer Architecture', pageW / 2, 18, { align: 'center' })
      setFont(8, 'normal', [140, 170, 240])
      pdf.text('Dept. of Electronics & Communication Engineering', pageW / 2, 23, { align: 'center' })
      y = 36

      // Experiment title block
      pdf.setFillColor(240, 245, 255)
      pdf.roundedRect(ml, y, cw, 22, 3, 3, 'F')
      setFont(11, 'bold', [26, 86, 219])
      pdf.text(`Experiment No. ${expNumber}`, ml + 5, y + 8)
      setFont(13, 'bold', [15, 23, 42])
      pdf.text(experiment, ml + 5, y + 16)
      y += 28

      // Student info grid
      const info = [
        ['Student Name', studentInfo.name || '___________________________'],
        ['Roll No.',     studentInfo.roll || '______________'],
        ['Branch / Sem', studentInfo.branch || 'ECE / Sem IV'],
        ['Date',         studentInfo.date || new Date().toLocaleDateString('en-IN')],
      ]
      setFont(8, 'normal', [80, 80, 80])
      info.forEach(([label, val], i) => {
        const col = i % 2 === 0 ? ml : ml + cw / 2 + 5
        const row = y + Math.floor(i / 2) * 9
        pdf.text(`${label}:`, col, row)
        setFont(8, 'bold', [20, 20, 20])
        pdf.text(val, col + 32, row)
        setFont(8, 'normal', [80, 80, 80])
      })
      y += 22
      line(y); y += 6

      // AIM
      setFont(10, 'bold', [26, 86, 219])
      pdf.text('AIM', ml, y); y += 6
      setFont(9, 'normal', [30, 30, 30])
      y = wrap(aim, ml, y, cw, 5) + 6
      line(y); y += 6

      // APPARATUS
      setFont(10, 'bold', [26, 86, 219])
      pdf.text('APPARATUS REQUIRED', ml, y); y += 6
      setFont(9, 'normal', [30, 30, 30])
      ;(apparatus || []).forEach((item) => {
        pdf.text(`•  ${item}`, ml + 3, y); y += 5
      })
      y += 3
      line(y); y += 6

      // THEORY
      setFont(10, 'bold', [26, 86, 219])
      pdf.text('THEORY', ml, y); y += 6
      setFont(8.5, 'normal', [40, 40, 40])
      y = wrap(theory, ml, y, cw, 4.8) + 6
      line(y); y += 6

      // Check page break
      if (y > pageH - 60) { newPage() }

      // OBSERVATION TABLE
      setFont(10, 'bold', [26, 86, 219])
      pdf.text('OBSERVATIONS', ml, y); y += 6

      // Table header
      const cols = { sno: ml, v: ml + 15, i: ml + 70, region: ml + 110 }
      pdf.setFillColor(26, 86, 219)
      pdf.rect(ml, y, cw, 8, 'F')
      setFont(8, 'bold', [255, 255, 255])
      pdf.text('S.No', cols.sno + 1, y + 5.5)
      pdf.text('Voltage (V)', cols.v + 1, y + 5.5)
      pdf.text('Current (mA / µA)', cols.i + 1, y + 5.5)
      pdf.text('Region', cols.region + 1, y + 5.5)
      y += 8

      // Table rows
      const displayRows = tableRows || []
      displayRows.slice(0, 20).forEach((row, i) => {
        if (y > pageH - 30) { newPage() }
        const bg = i % 2 === 0 ? [248, 250, 255] : [255, 255, 255]
        pdf.setFillColor(...bg)
        pdf.rect(ml, y, cw, 7, 'F')
        pdf.setDrawColor(200, 210, 230)
        pdf.rect(ml, y, cw, 7)
        setFont(8, 'normal', [30, 30, 30])
        pdf.text(String(i + 1), cols.sno + 1, y + 5)
        pdf.text(String(row.v !== undefined ? row.v.toFixed(2) : '--'), cols.v + 1, y + 5)
        pdf.text(String(row.i !== undefined ? row.i : '--'), cols.i + 1, y + 5)
        pdf.text(String(row.region || '--'), cols.region + 1, y + 5)
        y += 7
      })
      y += 6

      // GRAPH (screenshot)
      if (graphRef?.current) {
        if (y > pageH - 80) { newPage() }
        setFont(10, 'bold', [26, 86, 219])
        pdf.text('V-I CHARACTERISTIC CURVE', ml, y); y += 5

        try {
          const canvas = await html2canvas(graphRef.current, {
            backgroundColor: '#ffffff',
            scale: 1.5,
            useCORS: true,
            logging: false,
          })
          const imgData = canvas.toDataURL('image/png')
          const imgW    = cw
          const imgH    = (canvas.height / canvas.width) * imgW
          if (y + imgH > pageH - 20) { newPage() }
          pdf.addImage(imgData, 'PNG', ml, y, imgW, imgH)
          y += imgH + 8
        } catch (e) {
          setFont(8, 'normal', [150, 50, 50])
          pdf.text('(Graph capture failed — screenshot manually)', ml, y)
          y += 8
        }
      }

      // PAGE 2: Conclusion + sign-off
      if (y > pageH - 50) { newPage() } else { line(y); y += 6 }

      setFont(10, 'bold', [26, 86, 219])
      pdf.text('OBSERVATIONS & INFERENCES', ml, y); y += 6
      setFont(8.5, 'normal', [40, 40, 40])
      y = wrap(observations || 'To be filled by student.', ml, y, cw, 4.8) + 6

      line(y); y += 6
      setFont(10, 'bold', [26, 86, 219])
      pdf.text('CONCLUSION', ml, y); y += 6
      setFont(8.5, 'normal', [40, 40, 40])
      y = wrap(conclusion || 'To be filled by student.', ml, y, cw, 4.8) + 10

      // Sign-off boxes
      line(y); y += 8
      const signY = Math.min(y, pageH - 30)
      setFont(8, 'normal', [80, 80, 80])
      pdf.text('Student Signature', ml, signY + 10)
      pdf.line(ml, signY + 12, ml + 60, signY + 12)
      pdf.text('Faculty Signature', ml + 90, signY + 10)
      pdf.line(ml + 90, signY + 12, ml + 150, signY + 12)
      pdf.text('Date of Submission', ml + 140, signY + 10)
      pdf.line(ml + 140, signY + 12, pageW - mr, signY + 12)

      // Footer on all pages
      const totalPages = pdf.internal.getNumberOfPages()
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p)
        pdf.setFillColor(240, 244, 255)
        pdf.rect(0, pageH - 8, pageW, 8, 'F')
        setFont(7, 'normal', [100, 120, 180])
        pdf.text(
          `LogicFlow Virtual Lab • Experiment ${expNumber} • Generated ${new Date().toLocaleDateString('en-IN')}`,
          pageW / 2, pageH - 3, { align: 'center' }
        )
        pdf.text(`Page ${p} of ${totalPages}`, pageW - mr, pageH - 3, { align: 'right' })
      }

      pdf.save(`LogicFlow_Exp${expNumber}_LabReport.pdf`)
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('PDF generation failed. Check console for details.')
    } finally {
      setLoading(false)
    }
  }, [loading, experiment, expNumber, aim, apparatus, theory, tableRows, observations, conclusion, graphRef, studentInfo])

  return (
    <button
      onClick={generate}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-mono
                  transition-all disabled:cursor-not-allowed ${
        done
          ? 'border-emerald-600/40 bg-emerald-950/20 text-emerald-400'
          : loading
          ? 'border-surface-700 bg-surface-800 text-surface-500'
          : 'border-primary-600/40 bg-primary-600/10 text-primary-300 hover:bg-primary-600/20'
      }`}
    >
      {loading ? (
        <><Loader size={14} className="animate-spin" /> Generating PDF…</>
      ) : done ? (
        <><FileText size={14} /> PDF Downloaded ✓</>
      ) : (
        <><Download size={14} /> Export Lab Report</>
      )}
    </button>
  )
}
