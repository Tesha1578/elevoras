import React, { useState, useMemo } from 'react'
import { 
  CalendarDays, 
  Clock, 
  User, 
  Check, 
  X, 
  Plus, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react'
import { useMockStore, Attendance as AttendanceType } from '../../stores/mockStore'

export default function Attendance() {
  const attendance = useMockStore(state => state.attendance)
  const cleaners = useMockStore(state => state.cleaners)
  const clockInCleaner = useMockStore(state => state.clockInCleaner)
  const clockOutCleaner = useMockStore(state => state.clockOutCleaner)
  const updateAttendanceStatus = useMockStore(state => state.updateAttendanceStatus)

  // Selected date filter
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedCleanerIdForCal, setSelectedCleanerIdForCal] = useState(cleaners[0]?.id || '')

  // Manual clock-in form state
  const [manualClockInOpen, setManualClockInOpen] = useState(false)
  const [manualData, setManualData] = useState({
    cleanerId: '',
    checkInTime: '07:15 AM'
  })

  // Group attendance by date
  const dayAttendance = useMemo(() => {
    return attendance.filter(a => a.date === selectedDate)
  }, [attendance, selectedDate])

  // Cleaner attendance stats for today
  const dailyStats = useMemo(() => {
    const present = dayAttendance.filter(a => a.status === 'present').length
    const late = dayAttendance.filter(a => a.status === 'late').length
    const absent = dayAttendance.filter(a => a.status === 'absent').length
    const onLeave = dayAttendance.filter(a => a.status === 'on_leave').length
    
    return { present, late, absent, onLeave }
  }, [dayAttendance])

  // Get active cleaner for calendar review
  const calCleaner = useMemo(() => {
    return cleaners.find(c => c.id === selectedCleanerIdForCal) || cleaners[0] || null
  }, [cleaners, selectedCleanerIdForCal])

  // Calendar attendance logs (last 14 days)
  const calLogs = useMemo(() => {
    return attendance.filter(a => a.cleanerId === selectedCleanerIdForCal).slice(0, 14)
  }, [attendance, selectedCleanerIdForCal])

  // Handle Manual Clock-in submit
  const handleManualClockIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualData.cleanerId) {
      alert('Select a cleaner.')
      return
    }

    // Check if already checked in today
    const exists = attendance.some(a => a.cleanerId === manualData.cleanerId && a.date === new Date().toISOString().split('T')[0])
    if (exists) {
      alert('This cleaner is already checked in for today!')
      return
    }

    clockInCleaner(manualData.cleanerId, manualData.checkInTime)
    alert('Attendance overriding log registered successfully.')
    setManualClockInOpen(false)
  }

  // Toggle clock out
  const handleClockOut = (cleanerId: string) => {
    if (window.confirm('Clock out this cleaner and lock working hours?')) {
      clockOutCleaner(cleanerId)
      alert('Cleaner logged as checked out.')
    }
  }

  // Admin Override status
  const handleStatusOverride = (attId: string, status: AttendanceType['status']) => {
    updateAttendanceStatus(attId, status)
    alert(`Status overridden: ${status.toUpperCase()}`)
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Attendance Telemetry</h1>
          <p className="text-text-muted text-xs font-sans font-light mt-1">Audit cleaner clock-in timestamps and verify daily shift rates</p>
        </div>
        <button 
          onClick={() => setManualClockInOpen(true)}
          className="h-10 rounded-xl bg-surface hover:bg-slate-800 border border-border-subtle hover:border-slate-600 text-slate-200 text-xs font-semibold px-4 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus size={16} /> Admin Manual Override
        </button>
      </div>

      {/* STATS OVERVIEW HEADER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans text-xs">
        <div className="p-4 rounded-2xl bg-surface border border-border-subtle/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-slate-500 uppercase font-mono text-[8px] tracking-wider">Present Crew</span>
            <span className="text-primary font-bold text-lg mt-1">{dailyStats.present}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">&#10003;</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border-subtle/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-slate-500 uppercase font-mono text-[8px] tracking-wider">Late Arrivals</span>
            <span className="text-amber-500 font-bold text-lg mt-1">{dailyStats.late}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">&#9202;</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border-subtle/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-slate-500 uppercase font-mono text-[8px] tracking-wider">Absent / Skipped</span>
            <span className="text-rose-500 font-bold text-lg mt-1">{dailyStats.absent}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">&#10007;</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border-subtle/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-slate-500 uppercase font-mono text-[8px] tracking-wider">On Authorized Leave</span>
            <span className="text-secondary font-bold text-lg mt-1">{dailyStats.onLeave}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">&#9993;</div>
        </div>
      </div>

      {/* GRID SECTION (Today's Logs vs Calendar Review) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's log list */}
        <div className="lg:col-span-2 glass-panel border border-border-subtle rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border-subtle flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-300">Shift Log Ledger</span>
              <span className="text-[10px] text-slate-500 font-sans mt-0.5">Logs for: <strong>{selectedDate}</strong></span>
            </div>
            
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-9 rounded-lg bg-surface border border-border-subtle px-3 text-xs text-slate-300 focus:outline-none focus:border-primary cursor-pointer font-mono"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="bg-[#111827]/40 border-b border-border-subtle text-slate-500 font-mono text-[10px] uppercase">
                  <th className="py-3.5 px-5">Staff Cleaner</th>
                  <th className="py-3.5 px-5">Clock In</th>
                  <th className="py-3.5 px-5">Clock Out</th>
                  <th className="py-3.5 px-5">Hours</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions Override</th>
                </tr>
              </thead>
              <tbody>
                {dayAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500 font-light">
                      No attendance checks registered for this date.
                    </td>
                  </tr>
                ) : (
                  dayAttendance.map((att) => (
                    <tr 
                      key={att.id}
                      className="border-b border-border-subtle/50 hover:bg-slate-800/10 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-semibold text-slate-200">
                        {att.cleanerName}
                      </td>
                      <td className="py-3.5 px-5 text-slate-400 font-mono">
                        {att.checkIn}
                      </td>
                      <td className="py-3.5 px-5 text-slate-400 font-mono">
                        {att.checkOut || (
                          att.status !== 'absent' && att.status !== 'on_leave' ? (
                            <button 
                              onClick={() => handleClockOut(att.cleanerId)}
                              className="px-2 py-0.5 rounded bg-secondary/15 hover:bg-secondary/30 text-secondary border border-secondary/20 text-[9px] font-bold"
                            >
                              Clock Out
                            </button>
                          ) : '--'
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-slate-300 font-mono">
                        {att.hoursWorked ? `${att.hoursWorked}h` : '--'}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                          att.status === 'present' ? 'bg-primary/10 border-primary/20 text-primary' :
                          att.status === 'late' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                          att.status === 'on_leave' ? 'bg-secondary/10 border-secondary/20 text-secondary' :
                          'bg-rose-500/10 border-rose-500/20 text-rose-500'
                        }`}>
                          {att.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-sans">
                        <select 
                          value={att.status}
                          onChange={(e) => handleStatusOverride(att.id, e.target.value as AttendanceType['status'])}
                          className="bg-surface border border-border-subtle rounded text-[10px] text-slate-400 p-1 hover:border-slate-500 cursor-pointer"
                        >
                          <option value="present">Present</option>
                          <option value="late">Late</option>
                          <option value="absent">Absent</option>
                          <option value="on_leave">On Leave</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendar visual review */}
        <div className="glass-panel border border-border-subtle rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-300 mb-4 flex items-center gap-2">
              <CalendarDays size={16} className="text-primary" /> Crew Calendar Audit
            </h3>
            
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Select Staff Member:</label>
              <select 
                value={selectedCleanerIdForCal}
                onChange={(e) => setSelectedCleanerIdForCal(e.target.value)}
                className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-xs text-slate-300 focus:outline-none focus:border-primary cursor-pointer w-full"
              >
                {cleaners.filter(cl => cl.status !== 'inactive').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {calCleaner && (
              <div className="flex flex-col gap-3 text-xs font-sans mb-6 bg-surface/50 border border-border-subtle/50 p-3 rounded-xl">
                <div className="flex justify-between items-center pb-2 border-b border-border-subtle/50">
                  <span className="font-bold text-slate-200">{calCleaner.name}</span>
                  <span className="font-mono text-[10px] text-slate-400">{calCleaner.employeeId}</span>
                </div>
                <div className="flex justify-between font-mono text-[10px] text-slate-400">
                  <span>Present rate:</span>
                  <span className="text-primary font-bold">
                    {Math.round((calLogs.filter(c => c.status === 'present' || c.status === 'late').length / 14) * 100)}%
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div className="font-mono text-[9px] text-slate-500 uppercase font-bold tracking-wider px-1 mb-1">Telemetry Logs (Last 14 Days)</div>
              <div className="flex flex-col gap-1.5 font-mono text-[10px] max-h-48 overflow-y-auto pr-1">
                {calLogs.map(log => (
                  <div key={log.id} className="flex justify-between items-center p-2 rounded-lg bg-surface/30 border border-border-subtle/40">
                    <span>{log.date}</span>
                    <span className={`px-2 py-0.5 rounded font-bold border ${
                      log.status === 'present' ? 'border-primary/20 text-primary bg-primary/5' :
                      log.status === 'late' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                      'border-rose-500/20 text-rose-500 bg-rose-500/5'
                    }`}>
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* MANUAL CLOCK-IN POPUP DIALOG */}
      {manualClockInOpen && (
        <>
          <div 
            onClick={() => setManualClockInOpen(false)}
            className="fixed inset-0 z-45 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md glass-panel shadow-2xl p-6 rounded-3xl border border-border-subtle">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3.5 mb-6">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-1.5">
                <UserCheck size={18} className="text-primary" /> Manual Check-In Registry
              </h3>
              <button 
                onClick={() => setManualClockInOpen(false)}
                className="p-1 rounded bg-surface border border-border-subtle text-slate-500 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleManualClockIn} className="flex flex-col gap-4 text-xs font-sans">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-semibold">Select Staff Cleaner</label>
                <select 
                  value={manualData.cleanerId}
                  onChange={(e) => setManualData({ ...manualData, cleanerId: e.target.value })}
                  className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-slate-300 focus:outline-none focus:border-primary cursor-pointer w-full"
                >
                  <option value="">Choose cleaner...</option>
                  {cleaners.filter(cl => cl.status !== 'inactive').map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.employeeId})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-semibold">Simulated Check-In Time</label>
                <input 
                  type="text" 
                  required
                  value={manualData.checkInTime}
                  onChange={(e) => setManualData({ ...manualData, checkInTime: e.target.value })}
                  placeholder="07:30 AM"
                  className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-primary placeholder:text-slate-700 font-mono"
                />
              </div>

              <div className="flex gap-2 mt-4 border-t border-border-subtle pt-4">
                <button 
                  type="submit"
                  className="flex-1 h-11 bg-primary hover:bg-primary/80 text-[#0A0F1E] font-bold text-xs rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                >
                  Register Clock In
                </button>
                <button 
                  onClick={() => setManualClockInOpen(false)}
                  className="flex-1 h-11 border border-border-subtle hover:bg-slate-800/40 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </div>
  )
}
