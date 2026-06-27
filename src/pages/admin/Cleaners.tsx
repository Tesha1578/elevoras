import React, { useState, useMemo } from 'react'
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Eye, 
  X, 
  Check, 
  Smartphone,
  CalendarDays,
  Coins,
  Star,
  Award,
  Clock,
  Briefcase
} from 'lucide-react'
import { useMockStore, Cleaner, Customer, Attendance, Wash } from '../../stores/mockStore'

export default function Cleaners() {
  const cleaners = useMockStore(state => state.cleaners)
  const customers = useMockStore(state => state.customers)
  const attendance = useMockStore(state => state.attendance)
  const washes = useMockStore(state => state.washes)
  
  const addCleaner = useMockStore(state => state.addCleaner)
  const updateCleaner = useMockStore(state => state.updateCleaner)
  const deleteCleaner = useMockStore(state => state.deleteCleaner)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // UI state overlays
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [editId, setEditId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'attendance' | 'washes' | 'flats'>('attendance')

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    mobile: '',
    status: 'active' as Cleaner['status']
  })

  // Pre-fill query details if passed from topbar or dashboard
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (id) {
      setDetailId(id)
      setDetailOpen(true)
    }
  }, [])

  // Filtered List
  const filteredCleaners = useMemo(() => {
    return cleaners.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus ? c.status === selectedStatus : true
      return matchesSearch && matchesStatus
    })
  }, [cleaners, searchQuery, selectedStatus])

  const activeCleanerDetail = useMemo(() => {
    return cleaners.find(c => c.id === detailId) || null
  }, [cleaners, detailId])

  // Cleaner logs
  const cleanerLogs = useMemo(() => {
    if (!detailId) return { attendance: [], washes: [], flats: [] }
    return {
      attendance: attendance.filter(a => a.cleanerId === detailId),
      washes: washes.filter(w => w.cleanerId === detailId),
      flats: customers.filter(cust => cust.cleanerId === detailId)
    }
  }, [detailId, attendance, washes, customers])

  // Cleaner scorecard metrics
  const cleanerMetrics = useMemo(() => {
    if (!detailId) return { avgRating: 5.0, count: 0, hours: 0 }
    const cleanerWashes = washes.filter(w => w.cleanerId === detailId && w.status === 'completed')
    const ratedWashes = cleanerWashes.filter(w => w.rating !== undefined)
    const avgRating = ratedWashes.length === 0 
      ? 4.9 
      : Number((ratedWashes.reduce((sum, curr) => sum + (curr.rating || 0), 0) / ratedWashes.length).toFixed(1))
    
    return {
      avgRating,
      count: cleanerWashes.length,
      hours: cleanerWashes.length * 0.4 // estimate 24m per wash (0.4 hours)
    }
  }, [detailId, washes])

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      employeeId: `ELV-CLN-0${cleaners.length + 1}`,
      mobile: '',
      status: 'active'
    })
    setFormMode('create')
    setFormOpen(true)
  }

  const handleOpenEdit = (c: Cleaner) => {
    setFormData({
      name: c.name,
      employeeId: c.employeeId,
      mobile: c.mobile,
      status: c.status
    })
    setEditId(c.id)
    setFormMode('edit')
    setFormOpen(true)
  }

  const handleSaveCleaner = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || formData.mobile.length < 10) {
      alert('Please fill out all fields correctly.')
      return
    }

    const payload = {
      name: formData.name,
      employeeId: formData.employeeId,
      mobile: formData.mobile,
      status: formData.status
    }

    if (formMode === 'create') {
      addCleaner(payload)
      alert('Cleaner profile created.')
    } else if (formMode === 'edit' && editId) {
      updateCleaner(editId, payload)
      alert('Cleaner profile updated.')
    }

    setFormOpen(false)
    setEditId(null)
  }

  const handleDeleteCleaner = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove cleaner ${name}? This will mark their assigned flats as unassigned.`)) {
      deleteCleaner(id)
      alert('Cleaner deleted.')
      if (detailId === id) setDetailOpen(false)
    }
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Cleaner Management</h1>
          <p className="text-text-muted text-xs font-sans font-light mt-1">Manage cleaning staff profiles, attendance tracking, and locations assignment</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="h-10 rounded-xl bg-primary hover:bg-primary/80 text-[#0A0F1E] text-xs font-bold px-4 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus size={16} /> Register New Cleaner
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Search */}
        <div className="md:col-span-2 relative flex items-center">
          <Search size={14} className="absolute left-3.5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search cleaner name, Employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 rounded-xl bg-surface border border-border-subtle/80 pl-10 pr-4 text-xs focus:outline-none focus:border-primary transition-colors text-white placeholder:text-slate-600"
          />
        </div>

        {/* Status Filter */}
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-11 rounded-xl bg-surface border border-border-subtle/80 px-4 text-xs text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="active">Active (Checked In)</option>
          <option value="inactive">Inactive</option>
          <option value="on_leave">On Leave</option>
        </select>

      </div>

      {/* GRID LIST */}
      <div className="glass-panel border border-border-subtle rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="bg-[#111827]/40 border-b border-border-subtle text-slate-500 font-mono text-[10px] uppercase">
                <th className="py-3.5 px-5">Staff Cleaner</th>
                <th className="py-3.5 px-5">Employee ID</th>
                <th className="py-3.5 px-5">Mobile</th>
                <th className="py-3.5 px-5">Flats Assigned</th>
                <th className="py-3.5 px-5">Washes Today</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCleaners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500 font-light">
                    No cleaning staff matched your search requirements.
                  </td>
                </tr>
              ) : (
                filteredCleaners.map((cleaner) => (
                  <tr 
                    key={cleaner.id}
                    className="border-b border-border-subtle/50 hover:bg-slate-800/10 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-secondary/30 to-primary/30 border border-border-subtle flex items-center justify-center text-slate-200 font-bold text-[10px]">
                          {cleaner.name.split(' ').map(x => x[0]).join('')}
                        </div>
                        <span className="font-semibold text-slate-200">{cleaner.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-300 font-mono">
                      {cleaner.employeeId}
                    </td>
                    <td className="py-3.5 px-5 text-slate-400 font-mono">
                      {cleaner.mobile}
                    </td>
                    <td className="py-3.5 px-5 text-slate-300 font-mono">
                      {cleaner.assignedFlatCount} flats
                    </td>
                    <td className="py-3.5 px-5 text-slate-300 font-mono">
                      {cleaner.washesToday} washes
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                        cleaner.status === 'active' ? 'bg-primary/10 border-primary/20 text-primary' :
                        cleaner.status === 'on_leave' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                        'bg-slate-850 border-border-subtle text-slate-500'
                      }`}>
                        {cleaner.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => { setDetailId(cleaner.id); setDetailOpen(true); }}
                          className="w-8 h-8 rounded-lg bg-surface border border-border-subtle/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="View Scorecard details"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(cleaner)}
                          className="w-8 h-8 rounded-lg bg-surface border border-border-subtle/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit Cleaner details"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCleaner(cleaner.id, cleaner.name)}
                          className="w-8 h-8 rounded-lg bg-surface border border-border-subtle/80 text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-colors cursor-pointer"
                          title="De-register Cleaner"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT DRAWER */}
      {formOpen && (
        <>
          <div 
            onClick={() => setFormOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-md glass-panel shadow-2xl p-6 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
                <h3 className="font-heading font-bold text-lg text-white">
                  {formMode === 'create' ? 'Register Cleaner Profile' : 'Modify Cleaner Details'}
                </h3>
                <button 
                  onClick={() => setFormOpen(false)}
                  className="p-1 rounded bg-surface border border-border-subtle text-slate-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveCleaner} className="flex flex-col gap-4 font-sans text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-semibold">Cleaner Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g. Ramesh Kumar"
                    className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-primary placeholder:text-slate-700"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-semibold">Employee ID Code</label>
                  <input 
                    type="text" 
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="ELV-CLN-XXX"
                    className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-primary placeholder:text-slate-700 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-semibold">Mobile Number</label>
                  <input 
                    type="tel" 
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                    placeholder="9840XXXXXX"
                    className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-primary placeholder:text-slate-700 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-semibold">Operations Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Cleaner['status'] })}
                    className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="active">Active / Checked In</option>
                    <option value="inactive">Inactive / De-activated</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>

                <button type="submit" className="hidden" id="submit-cleaner-btn" />
              </form>
            </div>

            <div className="mt-8 border-t border-border-subtle pt-4 flex gap-2">
              <button 
                onClick={() => document.getElementById('submit-cleaner-btn')?.click()}
                className="flex-1 h-11 bg-primary hover:bg-primary/80 text-[#0A0F1E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                Save Profile
              </button>
              <button 
                onClick={() => setFormOpen(false)}
                className="flex-1 h-11 border border-border-subtle hover:bg-slate-800/40 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* DETAIL SCORECARD AND TABBED HISTORIES */}
      {detailOpen && activeCleanerDetail && (
        <>
          <div 
            onClick={() => setDetailOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-2xl glass-panel shadow-2xl p-6 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300">
            <div>
              
              {/* Header profile details */}
              <div className="flex items-start justify-between border-b border-border-subtle pb-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-secondary/40 to-primary/40 flex items-center justify-center text-white font-bold text-lg font-heading">
                    {activeCleanerDetail.name.split(' ').map(x => x[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-white leading-none">{activeCleanerDetail.name}</h3>
                    <p className="text-text-muted text-xs font-sans font-light mt-1.5 flex items-center gap-1.5">
                      <Smartphone size={10} /> {activeCleanerDetail.mobile} &middot; ID: {activeCleanerDetail.employeeId}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold border ${
                    activeCleanerDetail.status === 'active' ? 'bg-primary/10 border-primary/20 text-primary' :
                    activeCleanerDetail.status === 'on_leave' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                    'bg-slate-800 border-border-subtle text-slate-500'
                  }`}>
                    {activeCleanerDetail.status}
                  </span>
                  <button 
                    onClick={() => setDetailOpen(false)}
                    className="p-1 rounded bg-surface border border-border-subtle text-slate-500 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Performance Scorecard Row */}
              <div className="grid grid-cols-3 gap-4 mb-6 font-sans text-xs">
                <div className="p-3.5 rounded-xl bg-surface border border-border-subtle/50 flex flex-col gap-0.5">
                  <span className="text-slate-500 uppercase font-mono text-[8px]">Overall rating</span>
                  <span className="text-primary font-bold text-base mt-1 flex items-center gap-1">
                    <Star size={14} fill="currentColor" /> {cleanerMetrics.avgRating}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface border border-border-subtle/50 flex flex-col gap-0.5">
                  <span className="text-slate-500 uppercase font-mono text-[8px]">Washes completed</span>
                  <span className="text-slate-200 font-bold text-base mt-1 flex items-center gap-1">
                    <Award size={14} /> {cleanerMetrics.count}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface border border-border-subtle/50 flex flex-col gap-0.5">
                  <span className="text-slate-500 uppercase font-mono text-[8px]">Logged Work Time</span>
                  <span className="text-slate-200 font-bold text-base mt-1 flex items-center gap-1">
                    <Clock size={14} /> ~{cleanerMetrics.hours.toFixed(1)}h
                  </span>
                </div>
              </div>

              {/* Tab options */}
              <div className="flex border-b border-border-subtle mb-4">
                <button 
                  onClick={() => setActiveTab('attendance')}
                  className={`flex items-center gap-1.5 pb-2.5 px-4 font-semibold text-xs font-heading border-b-2 transition-colors relative top-[1px] ${
                    activeTab === 'attendance' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <CalendarDays size={14} /> Attendance History ({cleanerLogs.attendance.length})
                </button>
                <button 
                  onClick={() => setActiveTab('washes')}
                  className={`flex items-center gap-1.5 pb-2.5 px-4 font-semibold text-xs font-heading border-b-2 transition-colors relative top-[1px] ${
                    activeTab === 'washes' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Briefcase size={14} /> Wrote Washes ({cleanerLogs.washes.length})
                </button>
                <button 
                  onClick={() => setActiveTab('flats')}
                  className={`flex items-center gap-1.5 pb-2.5 px-4 font-semibold text-xs font-heading border-b-2 transition-colors relative top-[1px] ${
                    activeTab === 'flats' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Eye size={14} /> Assigned Residents ({cleanerLogs.flats.length})
                </button>
              </div>

              {/* Tab views content */}
              <div className="max-h-80 overflow-y-auto pr-1">
                
                {/* Attendance */}
                {activeTab === 'attendance' && (
                  <div className="flex flex-col gap-2 font-sans text-xs">
                    {cleanerLogs.attendance.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">No attendance records logged.</div>
                    ) : (
                      cleanerLogs.attendance.map((att: any) => (
                        <div key={att.id} className="p-3 rounded-xl bg-surface border border-border-subtle/80 flex items-center justify-between">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-slate-200">{att.date}</span>
                            <span className="text-[10px] text-slate-500 font-light">In: {att.checkIn} &middot; Out: {att.checkOut || '--'}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                            att.status === 'present' ? 'bg-primary/10 border-primary/20 text-primary' :
                            att.status === 'late' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                            att.status === 'on_leave' ? 'bg-secondary/10 border-secondary/20 text-secondary' :
                            'bg-rose-500/10 border-rose-500/20 text-rose-500'
                          }`}>
                            {att.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Washes */}
                {activeTab === 'washes' && (
                  <div className="flex flex-col gap-2 font-sans text-xs">
                    {cleanerLogs.washes.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">No washes recorded yet.</div>
                    ) : (
                      cleanerLogs.washes.map((w: any) => (
                        <div key={w.id} className="p-3 rounded-xl bg-surface border border-border-subtle/80 flex items-center justify-between">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-slate-200">Date: {new Date(w.startTime).toLocaleDateString()}</span>
                            <span className="text-[10px] text-slate-500 font-light">Flat: {w.flatNumber} &middot; Location: {w.locationName}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {w.rating && (
                              <span className="text-primary font-mono text-[10px] flex items-center gap-0.5">
                                <Star size={10} fill="currentColor" /> {w.rating}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                              w.status === 'completed' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                            }`}>
                              {w.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Assigned flats */}
                {activeTab === 'flats' && (
                  <div className="flex flex-col gap-2 font-sans text-xs">
                    {cleanerLogs.flats.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">No resident flats assigned to this cleaner.</div>
                    ) : (
                      cleanerLogs.flats.map((c: any) => (
                        <div key={c.id} className="p-3 rounded-xl bg-surface border border-border-subtle/80 flex items-center justify-between">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-slate-200">{c.name}</span>
                            <span className="text-[10px] text-slate-500 font-light">Flat {c.flatNumber} &middot; {c.locationName}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-200 bg-[#0A0F1E] border border-border-subtle px-2 py-0.5 rounded">
                            {c.vehicleNumber}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}

              </div>

            </div>

            <div className="mt-8 border-t border-border-subtle pt-4 flex gap-2">
              <button 
                onClick={() => setDetailOpen(false)}
                className="w-full h-11 border border-border-subtle hover:bg-slate-800/40 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Profile Panel
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  )
}
