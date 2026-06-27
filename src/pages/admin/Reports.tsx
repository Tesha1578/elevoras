import React, { useState, useMemo } from 'react'
import { 
  FileText, 
  Calendar, 
  MapPin, 
  User, 
  Coins, 
  Star, 
  Search, 
  Download, 
  FileSpreadsheet,
  FileDown,
  Info,
  Check
} from 'lucide-react'
import { useMockStore } from '../../stores/mockStore'

export default function Reports() {
  const locations = useMockStore(state => state.locations)
  const cleaners = useMockStore(state => state.cleaners)
  const washes = useMockStore(state => state.washes)
  const payments = useMockStore(state => state.payments)
  const reviews = useMockStore(state => state.reviews)

  // Report types list
  const reportTypes = [
    { id: 'daily-wash', name: 'Daily Wash Summary', icon: <FileText size={16} />, desc: 'Wash telemetry logs grouped by location and cleaner count.' },
    { id: 'monthly-wash', name: 'Monthly Wash Report', icon: <Calendar size={16} />, desc: 'Aggregated monthly completions counts and average duration metrics.' },
    { id: 'attendance', name: 'Attendance Summary', icon: <User size={16} />, desc: 'Staff clock-in/out records, late counts and shift logs.' },
    { id: 'payments', name: 'Payment Collections', icon: <Coins size={16} />, desc: 'Revenue streams mapped by payment gateway transaction statuses.' },
    { id: 'revenue-cleaner', name: 'Revenue by Cleaner', icon: <Coins size={16} />, desc: 'Washes completed versus fees collected per crew member.' },
    { id: 'no-wash', name: 'No-Wash Flats Alert', icon: <Info size={16} />, desc: 'Predictive alert of flats showing zero wash logs in the last 7 days.' }
  ]

  // States
  const [activeReportId, setActiveReportId] = useState('daily-wash')
  const [selectedLoc, setSelectedLoc] = useState('')
  const [selectedCleaner, setSelectedCleaner] = useState('')
  const [startDate, setStartDate] = useState(new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])

  // Get active report details
  const activeReport = useMemo(() => {
    return reportTypes.find(r => r.id === activeReportId) || reportTypes[0]
  }, [activeReportId])

  // Generate dynamic preview data based on report type and filter selections
  const previewData = useMemo(() => {
    const locName = selectedLoc ? locations.find(l => l.id === selectedLoc)?.name : ''
    
    if (activeReportId === 'daily-wash') {
      const filtered = washes.filter(w => {
        const matchesLoc = locName ? w.locationName === locName : true
        const matchesClean = selectedCleaner ? w.cleanerId === selectedCleaner : true
        return matchesLoc && matchesClean
      }).slice(0, 8)

      return {
        headers: ['Wash ID', 'Flat', 'Customer', 'Cleaner', 'Amount', 'Status'],
        rows: filtered.map(w => [w.id, w.flatNumber, w.customerName, w.cleanerName, `₹${w.paymentAmount}`, w.status])
      }
    } 
    
    if (activeReportId === 'monthly-wash') {
      return {
        headers: ['Location Complex', 'Total Booked', 'Completed', 'Failed', 'Avg Duration'],
        rows: locations.map(l => {
          const locWashes = washes.filter(w => w.locationName === l.name)
          const completed = locWashes.filter(w => w.status === 'completed').length
          const failed = locWashes.filter(w => w.status === 'failed').length
          return [l.name, locWashes.length, completed, failed, '24 minutes']
        })
      }
    }

    if (activeReportId === 'attendance') {
      return {
        headers: ['Date', 'Cleaner Name', 'Clock In', 'Clock Out', 'Shift Status'],
        rows: cleaners.filter(cl => cl.status !== 'inactive').map((c, i) => {
          const statusVal = i === 1 ? 'LATE' : 'PRESENT'
          return [new Date().toLocaleDateString(), c.name, '07:15 AM', '11:30 AM', statusVal]
        })
      }
    }

    if (activeReportId === 'payments') {
      const filtered = payments.slice(0, 8)
      return {
        headers: ['Txn ID', 'Customer', 'Type', 'Amount', 'Date', 'Status'],
        rows: filtered.map(p => [p.transactionId, p.customerName, p.type, `₹${p.amount}`, new Date(p.date).toLocaleDateString(), p.status])
      }
    }

    if (activeReportId === 'revenue-cleaner') {
      return {
        headers: ['Cleaner Name', 'Employee ID', 'Assigned Flats', 'Washes Completed', 'Revenue Mapped'],
        rows: cleaners.filter(cl => cl.status !== 'inactive').map(c => {
          const washCount = c.assignedFlatCount * 14 + c.washesToday
          const revVal = washCount * 100
          return [c.name, c.employeeId, `${c.assignedFlatCount} flats`, washCount, `₹${revVal.toLocaleString()}`]
        })
      }
    }

    if (activeReportId === 'no-wash') {
      // Flats occupied but showing 0 washes in washes log
      return {
        headers: ['Flat Number', 'Location Complex', 'Resident Customer', 'Assigned Cleaner', 'Days Inactive'],
        rows: [
          ['B-103', 'Prestige Shantiniketan', 'Amit Verma', 'Ramesh Kumar', '8 days'],
          ['A-204', 'DLF Gardencity', 'Vikram Singh', 'Suresh Pillai', '11 days'],
          ['C-401', 'Hiranandani Parks', 'Rahul Sen', 'Anbu Chezhian', '9 days']
        ]
      }
    }

    return { headers: [], rows: [] }
  }, [activeReportId, selectedLoc, selectedCleaner, locations, washes, cleaners, payments])

  // Mock Export handler
  const handleExport = (format: 'pdf' | 'csv') => {
    alert(`Compiling data fields... Generating ${format.toUpperCase()} export template for ${activeReport.name}. Mock download saved successfully.`)
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* Header title */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">Reports Builder Center</h1>
        <p className="text-text-muted text-xs font-sans font-light mt-1">Configure telemetry parameters and export operational spreadsheets</p>
      </div>

      {/* REPORT BUILDER THREE-WAY SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start font-sans text-xs">
        
        {/* Left Side: Report selector */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <div className="font-mono text-[9px] text-slate-500 uppercase font-bold tracking-wider px-1">Available Reports</div>
          {reportTypes.map((report) => {
            const isActive = report.id === activeReportId
            return (
              <button 
                key={report.id}
                onClick={() => setActiveReportId(report.id)}
                className={`p-3.5 rounded-xl border text-left flex gap-3 transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-primary/5 border-primary/40 text-slate-200' 
                    : 'bg-surface border-border-subtle hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`mt-0.5 ${isActive ? 'text-primary' : 'text-slate-500'}`}>{report.icon}</div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-200">{report.name}</span>
                  <span className="text-[10px] text-slate-500 font-light leading-relaxed">{report.desc}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Center: Parameters setup */}
        <div className="lg:col-span-1 glass-panel p-5 rounded-2xl border border-border-subtle flex flex-col gap-4">
          <div className="font-mono text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-2">Configure Parameters</div>
          
          {/* Date pickers */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 font-semibold">Start Date</label>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-xs text-slate-300 focus:outline-none focus:border-primary cursor-pointer font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 font-semibold">End Date</label>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-xs text-slate-300 focus:outline-none focus:border-primary cursor-pointer font-mono"
            />
          </div>

          {/* Location filter (only for relevant reports) */}
          {activeReportId !== 'attendance' && activeReportId !== 'payments' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-semibold">Location Complex</label>
              <select 
                value={selectedLoc}
                onChange={(e) => setSelectedLoc(e.target.value)}
                className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Cleaner filter */}
          {(activeReportId === 'daily-wash' || activeReportId === 'attendance') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-semibold">Staff Cleaner</label>
              <select 
                value={selectedCleaner}
                onChange={(e) => setSelectedCleaner(e.target.value)}
                className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="">All Cleaners</option>
                {cleaners.filter(cl => cl.status === 'active').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-4 border-t border-border-subtle/50 pt-4 flex flex-col gap-2">
            <button 
              onClick={() => handleExport('pdf')}
              className="h-11 bg-primary hover:bg-primary/80 text-[#0A0F1E] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileDown size={14} /> Export Document (PDF)
            </button>
            <button 
              onClick={() => handleExport('csv')}
              className="h-11 border border-border-subtle hover:bg-slate-800/40 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet size={14} className="text-primary" /> Export Ledger (CSV)
            </button>
          </div>
        </div>

        {/* Right Side: Data preview */}
        <div className="lg:col-span-2 glass-panel border border-border-subtle rounded-2xl overflow-hidden flex flex-col h-full min-h-[300px]">
          <div className="p-4 border-b border-border-subtle bg-[#111827]/40 flex justify-between items-center">
            <span className="font-mono text-[9px] text-slate-500 uppercase font-bold tracking-wider">Report Preview Pane</span>
            <span className="text-[10px] text-slate-400 font-semibold">{activeReport.name}</span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="bg-[#111827]/10 border-b border-border-subtle text-slate-500 font-mono text-[9px] uppercase">
                  {previewData.headers.map((h, i) => (
                    <th key={i} className="py-2.5 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-border-subtle/40 hover:bg-slate-800/5 transition-colors">
                    {row.map((val, cIdx) => (
                      <td key={cIdx} className="py-3 px-4 text-slate-300 font-light truncate max-w-[150px]" title={String(val)}>
                        {val === 'completed' || val === 'success' || val === 'PRESENT' ? (
                          <span className="text-primary font-semibold font-mono text-[9px] uppercase">{val}</span>
                        ) : val === 'failed' || val === 'LATE' ? (
                          <span className="text-amber-500 font-semibold font-mono text-[9px] uppercase">{val}</span>
                        ) : val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  )
}
