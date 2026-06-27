import { useState, useEffect, useMemo } from 'react'
import { 
  Clock, 
  AlertTriangle,
  X,
  Camera,
  Play,
  Check,
  Search,
  Star
} from 'lucide-react'
import { useMockStore, type Wash } from '../../stores/mockStore'

export default function WashTracking() {
  const washes = useMockStore(state => state.washes)
  const locations = useMockStore(state => state.locations)
  const cleaners = useMockStore(state => state.cleaners)
  const startWash = useMockStore(state => state.startWash)
  const completeWash = useMockStore(state => state.completeWash)
  const failWash = useMockStore(state => state.failWash)
  
  // Realtime clock state for active washes duration counter
  const [now, setNow] = useState(new Date())

  // Filters
  const [selectedLoc, setSelectedLoc] = useState('')
  const [selectedCleaner, setSelectedCleaner] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // UI States
  const [selectedWashId, setSelectedWashId] = useState<string | null>(null)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  // Increment duration counter for in-progress washes
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Filtered washes list
  const filteredWashes = useMemo(() => {
    return washes.filter(w => {
      const matchesSearch = w.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            w.flatNumber.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLoc = selectedLoc ? w.locationName === locations.find(l => l.id === selectedLoc)?.name : true
      const matchesClean = selectedCleaner ? w.cleanerId === selectedCleaner : true
      const matchesStatus = selectedStatus ? w.status === selectedStatus : true

      return matchesSearch && matchesLoc && matchesClean && matchesStatus
    })
  }, [washes, searchQuery, selectedLoc, selectedCleaner, selectedStatus, locations])

  // Split into Active (scheduled + in_progress) vs History (completed + failed)
  const activeWashes = useMemo(() => {
    return filteredWashes.filter(w => w.status === 'in_progress' || w.status === 'scheduled')
  }, [filteredWashes])

  const historyWashes = useMemo(() => {
    return filteredWashes.filter(w => w.status === 'completed' || w.status === 'failed')
  }, [filteredWashes])

  // Get active wash selected detail
  const selectedWash = useMemo(() => {
    return washes.find(w => w.id === selectedWashId) || null
  }, [washes, selectedWashId])

  // Calculate live counter duration in minutes/seconds
  const getLiveDurationString = (startTimeStr: string) => {
    const start = new Date(startTimeStr)
    const diffMs = now.getTime() - start.getTime()
    if (diffMs < 0) return '00:00'
    const totalSecs = Math.floor(diffMs / 1000)
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Simulator controls
  const triggerStartWash = (washId: string) => {
    startWash(washId)
    alert('Wash status updated: IN PROGRESS. Resident notified.')
  }

  const triggerCompleteWash = (washId: string) => {
    const washImage = `https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=60`
    completeWash(washId, washImage)
    alert('Wash status updated: COMPLETED. Digital invoice auto-generated.')
    setSelectedWashId(null)
  }

  const triggerFailWash = (washId: string) => {
    if (window.confirm('Mark this wash as FAILED? This logs a skipped alert.')) {
      failWash(washId)
      setSelectedWashId(null)
    }
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* Telemetry header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Live Wash Tracking Center</h1>
          <p className="text-text-muted text-xs font-sans font-light mt-1">Real-time status updates of active cleaner teams on flat parameters</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 font-mono text-[10px] text-slate-500 bg-surface border border-border-subtle p-2 px-3.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Auto-refresh telemetry active</span>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="relative flex items-center">
          <Search size={14} className="absolute left-3.5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search resident, flat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 rounded-xl bg-surface border border-border-subtle/80 pl-10 pr-4 text-xs focus:outline-none focus:border-primary transition-colors text-white placeholder:text-slate-600"
          />
        </div>

        <select 
          value={selectedLoc}
          onChange={(e) => setSelectedLoc(e.target.value)}
          className="h-11 rounded-xl bg-surface border border-border-subtle/80 px-4 text-xs text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="">All Locations</option>
          {locations.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        <select 
          value={selectedCleaner}
          onChange={(e) => setSelectedCleaner(e.target.value)}
          className="h-11 rounded-xl bg-surface border border-border-subtle/80 px-4 text-xs text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="">All Cleaners</option>
          {cleaners.filter(cl => cl.status === 'active').map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-11 rounded-xl bg-surface border border-border-subtle/80 px-4 text-xs text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* LIVE RUNNING OPERATIONS BOARD */}
      <div>
        <h2 className="font-heading font-bold text-base text-slate-300 mb-4 flex items-center gap-2">
          <Clock size={16} className="text-secondary" /> Active Operations Telemetry ({activeWashes.length})
        </h2>
        
        {activeWashes.length === 0 ? (
          <div className="glass-panel border border-border-subtle p-8 rounded-2xl text-center text-slate-500 font-sans font-light text-xs">
            No active cleaning logs currently running. All assignments finished or scheduled.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeWashes.map(wash => {
              const isProgress = wash.status === 'in_progress'
              return (
                <div 
                  key={wash.id}
                  onClick={() => setSelectedWashId(wash.id)}
                  className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer ${
                    isProgress 
                      ? 'border-secondary/30 bg-secondary/5 hover:border-secondary shadow-lg shadow-secondary/5' 
                      : 'border-border-subtle/80 bg-surface/20 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <span className="font-heading font-bold text-base text-white">Flat {wash.flatNumber}</span>
                      <span className="text-[10px] text-slate-500 font-sans mt-0.5">{wash.locationName}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[8px] uppercase font-bold border flex items-center gap-1.5 ${
                      isProgress ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                    }`}>
                      {isProgress && <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />}
                      {wash.status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 text-xs font-sans text-slate-300 mb-4 border-y border-border-subtle/50 py-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-mono text-[10px] uppercase">Resident</span>
                      <span className="font-semibold">{wash.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-mono text-[10px] uppercase">Staff Crew</span>
                      <span>{wash.cleanerName}</span>
                    </div>
                  </div>

                  {/* Duration Live clock */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                      <Clock size={12} className="text-slate-500" />
                      {isProgress ? (
                        <span>Duration: <strong className="text-white">{getLiveDurationString(wash.startTime)}</strong></span>
                      ) : (
                        <span>Scheduled queue</span>
                      )}
                    </div>
                    
                    {/* Action simulator pill */}
                    <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {!isProgress ? (
                        <button 
                          onClick={() => triggerStartWash(wash.id)}
                          className="px-2.5 py-1 bg-secondary text-white font-bold font-heading rounded text-[9px] flex items-center gap-1 cursor-pointer"
                        >
                          <Play size={8} fill="currentColor" /> Start Wash
                        </button>
                      ) : (
                        <button 
                          onClick={() => triggerCompleteWash(wash.id)}
                          className="px-2.5 py-1 bg-primary text-[#0A0F1E] font-bold font-heading rounded text-[9px] flex items-center gap-1 cursor-pointer"
                        >
                          <Camera size={10} /> Finish
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* COMPLETED/FAILED HISTORICAL WORK LOGGER */}
      <div className="glass-panel rounded-2xl border border-border-subtle overflow-hidden flex flex-col mt-2">
        <div className="p-5 border-b border-border-subtle">
          <h3 className="font-heading font-bold text-sm text-white">Telemetry Historical Archives</h3>
          <p className="text-[10px] text-slate-500 font-sans font-light mt-0.5">Logs of completed proof records and failed schedules</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="bg-[#111827]/40 border-b border-border-subtle text-slate-500 font-mono text-[10px] uppercase">
                <th className="py-3.5 px-5">Flat Unit</th>
                <th className="py-3.5 px-5">Resident subscriber</th>
                <th className="py-3.5 px-5">Staff Cleaner</th>
                <th className="py-3.5 px-5">Image Proof</th>
                <th className="py-3.5 px-5">Feedback Rating</th>
                <th className="py-3.5 px-5">Billing</th>
                <th className="py-3.5 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {historyWashes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500 font-light">
                    No historical logs matched filters.
                  </td>
                </tr>
              ) : (
                historyWashes.map((wash) => (
                  <tr 
                    key={wash.id}
                    onClick={() => setSelectedWashId(wash.id)}
                    className="border-b border-border-subtle/50 hover:bg-slate-800/10 cursor-pointer transition-colors"
                  >
                    {/* Flat */}
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-200">
                      {wash.flatNumber}
                    </td>

                    {/* Resident */}
                    <td className="py-3.5 px-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">{wash.customerName}</span>
                        <span className="text-[10px] text-slate-500 font-light mt-0.5">{wash.locationName}</span>
                      </div>
                    </td>

                    {/* Cleaner */}
                    <td className="py-3.5 px-5 text-slate-300">
                      {wash.cleanerName}
                    </td>

                    {/* Proof */}
                    <td className="py-3.5 px-5" onClick={(e) => e.stopPropagation()}>
                      {wash.imageUrl ? (
                        <div 
                          onClick={() => setLightboxImage(wash.imageUrl || null)}
                          className="w-10 h-7 rounded bg-slate-900 border border-border-subtle overflow-hidden relative cursor-zoom-in"
                        >
                          <img src={wash.imageUrl} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-slate-650 italic">--</span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-5">
                      {wash.rating ? (
                        <span className="text-primary font-mono font-bold flex items-center gap-0.5">
                          <Star size={10} fill="currentColor" /> {wash.rating}
                        </span>
                      ) : (
                        <span className="text-slate-600">Unrated</span>
                      )}
                    </td>

                    {/* Billing */}
                    <td className="py-3.5 px-5 font-mono text-slate-300">
                      ₹{wash.paymentAmount}
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-5 text-right">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                        wash.status === 'completed' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                      }`}>
                        {wash.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WASH DETAIL OVERLAY PANEL */}
      {selectedWash && (
        <>
          <div 
            onClick={() => setSelectedWashId(null)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-md glass-panel shadow-2xl p-6 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-wider">Wash Timeline Details</span>
                  <h3 className="font-heading font-bold text-lg text-white mt-1">ID: {selectedWash.id}</h3>
                </div>
                <button 
                  onClick={() => setSelectedWashId(null)}
                  className="p-1 rounded bg-surface border border-border-subtle text-slate-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Status block */}
              <div className="p-4 rounded-xl bg-surface border border-border-subtle/80 flex justify-between items-center mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Operations Status</span>
                  <span className="font-mono text-xs font-semibold uppercase text-slate-200">{selectedWash.status}</span>
                </div>
                <span className={`px-2 py-1 rounded-full font-mono text-[9px] uppercase font-bold border ${
                  selectedWash.status === 'completed' ? 'bg-primary/10 border-primary/20 text-primary' :
                  selectedWash.status === 'in_progress' ? 'bg-secondary/10 border-secondary/20 text-secondary' :
                  selectedWash.status === 'scheduled' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                  'bg-rose-500/10 border-rose-500/20 text-rose-500'
                }`}>
                  {selectedWash.status}
                </span>
              </div>

              {/* Customer and Cleaner block */}
              <div className="flex flex-col gap-4 font-sans text-xs mb-6">
                <div className="border-b border-border-subtle pb-3">
                  <div className="text-slate-500 uppercase font-mono text-[9px] mb-1">Customer / Residence</div>
                  <div className="font-semibold text-slate-200 text-sm">{selectedWash.customerName}</div>
                  <div className="text-slate-400 mt-1">{selectedWash.locationName} &middot; Flat {selectedWash.flatNumber}</div>
                </div>

                <div className="border-b border-border-subtle pb-3">
                  <div className="text-slate-500 uppercase font-mono text-[9px] mb-1">Cleaner Assigned</div>
                  <div className="font-semibold text-slate-200 text-sm">{selectedWash.cleanerName}</div>
                </div>

                <div className="border-b border-border-subtle pb-3">
                  <div className="text-slate-500 uppercase font-mono text-[9px] mb-1">Timestamps</div>
                  <div className="flex flex-col gap-1 font-mono text-[10px] text-slate-400 mt-1">
                    <div>Started: {new Date(selectedWash.startTime).toLocaleString()}</div>
                    {selectedWash.endTime && <div>Ended: {new Date(selectedWash.endTime).toLocaleString()}</div>}
                    {selectedWash.duration && <div>Duration: {selectedWash.duration} minutes</div>}
                  </div>
                </div>

                <div className="border-b border-border-subtle pb-3">
                  <div className="text-slate-500 uppercase font-mono text-[9px] mb-1">Finance & Payments</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-slate-300">Amount: <strong>₹{selectedWash.paymentAmount}</strong></span>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                      selectedWash.paymentStatus === 'success' ? 'bg-primary/10 border-primary/20 text-primary' :
                      selectedWash.paymentStatus === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                      'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    }`}>
                      {selectedWash.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Photo Proof Box */}
              {selectedWash.status === 'completed' && selectedWash.imageUrl && (
                <div className="flex flex-col gap-2 font-sans text-xs">
                  <div className="text-slate-500 uppercase font-mono text-[9px]">Camera-Verified Photo Proof</div>
                  <div className="rounded-xl overflow-hidden border border-border-subtle relative aspect-video bg-[#111827]">
                    <img 
                      src={selectedWash.imageUrl} 
                      alt="Wash proof" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-[#0A0F1E]/80 backdrop-blur px-2.5 py-1 rounded border border-border-subtle/80 flex items-center gap-1.5 text-[9px] font-mono text-primary">
                      <Camera size={10} /> Camera-Only Lock Enabled
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback and Rating */}
              {selectedWash.status === 'completed' && selectedWash.rating && (
                <div className="flex flex-col gap-2 font-sans text-xs mt-6">
                  <div className="text-slate-500 uppercase font-mono text-[9px]">Customer Review</div>
                  <div className="p-3.5 rounded-xl bg-surface border border-border-subtle">
                    <div className="flex items-center gap-0.5 text-primary mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < (selectedWash.rating || 0) ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <p className="text-slate-300 italic font-light">"{selectedWash.review}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions in Sidebar Drawer */}
            <div className="mt-8 border-t border-border-subtle pt-4 flex gap-2">
              {selectedWash.status === 'in_progress' && (
                <>
                  <button 
                    onClick={() => triggerCompleteWash(selectedWash.id)}
                    className="flex-1 h-11 bg-primary hover:bg-primary/80 text-[#0A0F1E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check size={14} /> Complete Wash
                  </button>
                  <button 
                    onClick={() => triggerFailWash(selectedWash.id)}
                    className="flex-1 h-11 bg-rose-500 hover:bg-rose-500/80 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <AlertTriangle size={14} /> Fail Wash
                  </button>
                </>
              )}
              {selectedWash.status === 'scheduled' && (
                <button 
                  onClick={() => triggerStartWash(selectedWash.id)}
                  className="flex-1 h-11 bg-secondary hover:bg-secondary/80 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play size={14} /> Start Wash
                </button>
              )}
              <button 
                onClick={() => setSelectedWashId(null)}
                className="flex-1 h-11 border border-border-subtle hover:bg-slate-800/40 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Panel
              </button>
            </div>

          </div>
        </>
      )}

      {/* LIGHTBOX OVERLAY */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
        >
          <button className="absolute top-6 right-6 p-2 rounded-xl bg-surface border border-border-subtle text-slate-400 hover:text-white">
            <X size={20} />
          </button>
          <img src={lightboxImage} className="max-w-full max-h-full rounded-2xl shadow-2xl border border-border-subtle" alt="Lightbox proof" />
        </div>
      )}

    </div>
  )
}
