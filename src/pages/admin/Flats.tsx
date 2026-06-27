import React, { useState, useMemo } from 'react'
import { 
  Plus, 
  MapPin, 
  Layers, 
  X, 
  Check, 
  Trash2, 
  ChevronRight, 
  Home, 
  User, 
  Sparkles,
  Info
} from 'lucide-react'
import { useMockStore, Location, Flat } from '../../stores/mockStore'

export default function Flats() {
  const locations = useMockStore(state => state.locations)
  const flats = useMockStore(state => state.flats)
  const customers = useMockStore(state => state.customers)
  const cleaners = useMockStore(state => state.cleaners)
  
  const addLocation = useMockStore(state => state.addLocation)
  const deleteLocation = useMockStore(state => state.deleteLocation)
  const assignCleanerToFlat = useMockStore(state => state.assignCleanerToFlat)

  // Tab state: Locations vs Flats occupancy
  const [activeTab, setActiveTab] = useState<'grid' | 'locations'>('grid')
  
  // Selected Location for grid occupancy view
  const [selectedLocId, setSelectedLocId] = useState(locations[0]?.id || '')

  // Flat detail modal
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null)
  const [selectedCleanerId, setSelectedCleanerId] = useState('')

  // New location form states
  const [locFormOpen, setLocFormOpen] = useState(false)
  const [newLoc, setNewLoc] = useState({
    name: '',
    address: '',
    totalFlats: 120,
    status: 'active' as Location['status']
  })

  // Get active location metadata
  const activeLocation = useMemo(() => {
    return locations.find(l => l.id === selectedLocId) || null
  }, [locations, selectedLocId])

  // Get flats in selected location
  const locationFlats = useMemo(() => {
    return flats.filter(f => f.locationId === selectedLocId)
  }, [flats, selectedLocId])

  // Group flats by Block (A, B, C, D) for the occupancy grid
  const flatsByBlock = useMemo(() => {
    const blocks: { [key: string]: Flat[] } = { A: [], B: [], C: [], D: [] }
    locationFlats.forEach(f => {
      const block = f.flatNumber.split('-')[0]
      if (blocks[block]) {
        blocks[block].push(f)
      } else {
        blocks[block] = [f]
      }
    })
    return blocks
  }, [locationFlats])

  // Handle save new location
  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLoc.name || !newLoc.address) {
      alert('Please fill out name and address.')
      return
    }

    addLocation(newLoc)
    alert('Location community added successfully!')
    setLocFormOpen(false)
    setNewLoc({ name: '', address: '', totalFlats: 120, status: 'active' })
  }

  const handleDeleteLocation = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will remove all associated statistics.`)) {
      deleteLocation(id)
      alert('Location deleted.')
      if (selectedLocId === id) setSelectedLocId(locations[0]?.id || '')
    }
  }

  // Open flat actions modal
  const handleOpenFlatDetail = (flat: Flat) => {
    setSelectedFlat(flat)
    setSelectedCleanerId(flat.cleanerId || '')
  }

  // Re-assign cleaner to flat
  const handleUpdateAssignment = () => {
    if (!selectedFlat) return
    assignCleanerToFlat(selectedFlat.id, selectedCleanerId)
    alert('Assignment updated successfully.')
    setSelectedFlat(null)
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Flat & Location Management</h1>
          <p className="text-text-muted text-xs font-sans font-light mt-1">Audit geographic layouts and view active flat subscriptions</p>
        </div>
        <div className="flex border border-border-subtle rounded-xl overflow-hidden shrink-0 font-sans text-xs">
          <button 
            onClick={() => setActiveTab('grid')}
            className={`px-4 h-10 font-bold transition-colors cursor-pointer ${activeTab === 'grid' ? 'bg-primary text-white' : 'bg-surface text-slate-400 hover:text-slate-200'}`}
          >
            Visual Occupancy Grid
          </button>
          <button 
            onClick={() => setActiveTab('locations')}
            className={`px-4 h-10 font-bold transition-colors cursor-pointer ${activeTab === 'locations' ? 'bg-primary text-white' : 'bg-surface text-slate-400 hover:text-slate-200'}`}
          >
            Manage Gated Communities ({locations.length})
          </button>
        </div>
      </div>

      {/* VIEWPORT: VISUAL OCCUPANCY GRID */}
      {activeTab === 'grid' && (
        <div className="flex flex-col gap-6">
          
          {/* Location Selector Pill bar */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-500 font-mono mr-2 uppercase">Select Complex:</span>
            {locations.map(loc => (
              <button 
                key={loc.id}
                onClick={() => setSelectedLocId(loc.id)}
                className={`px-4.5 h-10 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedLocId === loc.id 
                    ? 'bg-secondary/15 border-secondary text-secondary shadow-lg shadow-secondary/10' 
                    : 'bg-surface border-border-subtle text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>

          {activeLocation && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans text-xs mb-2">
              <div className="p-3.5 rounded-xl bg-surface border border-border-subtle/50 flex flex-col gap-0.5">
                <span className="text-slate-500 uppercase font-mono text-[8px]">Address</span>
                <span className="text-slate-200 font-semibold truncate mt-1">{activeLocation.address}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface border border-border-subtle/50 flex flex-col gap-0.5">
                <span className="text-slate-500 uppercase font-mono text-[8px]">Total Units</span>
                <span className="text-slate-200 font-bold text-sm mt-1">{activeLocation.totalFlats} flats</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface border border-border-subtle/50 flex flex-col gap-0.5">
                <span className="text-slate-500 uppercase font-mono text-[8px]">Grid Legend</span>
                <div className="flex gap-4 mt-2 font-mono text-[9px]">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-primary/10 border border-primary/40 block" /> Occupied</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-surface border border-border-subtle block" /> Vacant</span>
                </div>
              </div>
            </div>
          )}

          {/* Blocks Grid Render */}
          <div className="flex flex-col gap-8">
            {Object.keys(flatsByBlock).map((blockKey) => {
              const blockFlats = flatsByBlock[blockKey]
              if (blockFlats.length === 0) return null

              return (
                <div key={blockKey} className="glass-panel border border-border-subtle rounded-2xl p-5">
                  <h3 className="font-heading font-bold text-sm text-slate-300 mb-4 border-b border-border-subtle pb-2 flex items-center gap-2">
                    <Home size={14} className="text-primary" /> Block {blockKey} Apartments
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                    {blockFlats.map((flat) => {
                      const isOccupied = flat.status === 'occupied'
                      return (
                        <div 
                          key={flat.id}
                          onClick={() => handleOpenFlatDetail(flat)}
                          className={`p-3 rounded-xl border text-center cursor-pointer transition-all hover:scale-105 flex flex-col gap-1 ${
                            isOccupied 
                              ? 'bg-primary/5 border-primary/20 hover:border-primary text-slate-200' 
                              : 'bg-surface border-border-subtle hover:border-slate-600 text-slate-500'
                          }`}
                        >
                          <span className="font-mono text-xs font-bold text-slate-100">{flat.flatNumber}</span>
                          <span className="text-[9px] uppercase font-mono tracking-wider truncate mt-0.5">
                            {isOccupied ? flat.customerName?.split(' ')[0] : 'Vacant'}
                          </span>
                          <span className="text-[8px] text-slate-500 font-sans truncate mt-1">
                            {flat.cleanerName || '--'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      )}

      {/* VIEWPORT: MANAGE LOCATIONS LIST */}
      {activeTab === 'locations' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-end">
            <button 
              onClick={() => setLocFormOpen(true)}
              className="h-10 rounded-xl border border-primary text-primary hover:bg-primary/10 text-xs font-bold px-4 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={16} /> Add Complex
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.map(loc => (
              <div key={loc.id} className="glass-panel p-5 rounded-2xl border border-border-subtle flex flex-col justify-between h-44">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-bold text-base text-slate-200">{loc.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                      loc.status === 'active' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-slate-800 border-border-subtle text-slate-500'
                    }`}>
                      {loc.status}
                    </span>
                  </div>
                  <p className="text-text-muted text-xs font-sans font-light flex items-start gap-1.5 leading-relaxed">
                    <MapPin size={12} className="text-slate-500 shrink-0 mt-0.5" /> {loc.address}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-border-subtle/50 pt-3 mt-4 text-xs font-mono">
                  <span className="text-slate-500">{loc.totalFlats} residential flats</span>
                  <button 
                    onClick={() => handleDeleteLocation(loc.id, loc.name)}
                    className="p-1.5 rounded bg-surface hover:bg-rose-500/10 border border-border-subtle text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FLAT ASSIGNMENT OVERLAY MODAL */}
      {selectedFlat && (
        <>
          <div 
            onClick={() => setSelectedFlat(null)}
            className="fixed inset-0 z-45 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md glass-panel shadow-2xl p-6 rounded-3xl border border-border-subtle">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3.5 mb-6">
              <h3 className="font-heading font-bold text-base text-white">
                Apartment Assignment: {selectedFlat.flatNumber}
              </h3>
              <button 
                onClick={() => setSelectedFlat(null)}
                className="p-1 rounded bg-surface border border-border-subtle text-slate-500 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-5 text-xs font-sans">
              <div className="flex flex-col gap-1.5">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Location complex</div>
                <div className="text-slate-300 font-semibold">{selectedFlat.locationName}</div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="text-[10px] text-slate-500 uppercase font-mono flex items-center gap-1"><User size={10} /> Subscriber Resident</div>
                {selectedFlat.customerId ? (
                  <div className="p-3 rounded-xl bg-[#0F0F0F] border border-border-subtle flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-200">{selectedFlat.customerName}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Subscriber ID: {selectedFlat.customerId}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 uppercase font-mono text-[8px] font-bold">Occupied</span>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">No customer registered to this flat unit yet. Add in Customer database.</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-[10px] text-slate-500 uppercase font-mono flex items-center gap-1"><Sparkles size={10} /> Cleaner Allocation</div>
                <select 
                  value={selectedCleanerId}
                  onChange={(e) => setSelectedCleanerId(e.target.value)}
                  className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-slate-300 focus:outline-none focus:border-primary cursor-pointer w-full"
                >
                  <option value="">Leave Unassigned</option>
                  {cleaners.filter(cl => cl.status === 'active').map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.assignedFlatCount} flats)</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 mt-4 border-t border-border-subtle pt-4">
                <button 
                  onClick={handleUpdateAssignment}
                  className="flex-1 h-11 bg-primary hover:bg-primary/80 text-white font-bold text-xs rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                >
                  Confirm Allocation
                </button>
                <button 
                  onClick={() => setSelectedFlat(null)}
                  className="flex-1 h-11 border border-border-subtle hover:bg-slate-800/40 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </>
      )}

      {/* CREATE LOCATION DIALOG */}
      {locFormOpen && (
        <>
          <div 
            onClick={() => setLocFormOpen(false)}
            className="fixed inset-0 z-45 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md glass-panel shadow-2xl p-6 rounded-3xl border border-border-subtle">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3.5 mb-6">
              <h3 className="font-heading font-bold text-base text-white">Add New Complex Community</h3>
              <button 
                onClick={() => setLocFormOpen(false)}
                className="p-1 rounded bg-surface border border-border-subtle text-slate-500 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="flex flex-col gap-4 text-xs font-sans">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-semibold">Community Complex Name</label>
                <input 
                  type="text" 
                  required
                  value={newLoc.name}
                  onChange={(e) => setNewLoc({ ...newLoc, name: e.target.value })}
                  placeholder="E.g. Prestige Shantiniketan"
                  className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-primary placeholder:text-slate-700"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-semibold">Full Address Location</label>
                <input 
                  type="text" 
                  required
                  value={newLoc.address}
                  onChange={(e) => setNewLoc({ ...newLoc, address: e.target.value })}
                  placeholder="Whitefield, Bangalore"
                  className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-primary placeholder:text-slate-700"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-semibold">Total Building Units / Flats</label>
                <input 
                  type="number" 
                  required
                  value={newLoc.totalFlats}
                  onChange={(e) => setNewLoc({ ...newLoc, totalFlats: parseInt(e.target.value) })}
                  placeholder="120"
                  className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-primary placeholder:text-slate-700 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-semibold">Operations Status</label>
                <select 
                  value={newLoc.status}
                  onChange={(e) => setNewLoc({ ...newLoc, status: e.target.value as Location['status'] })}
                  className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-slate-300 focus:outline-none focus:border-primary cursor-pointer w-full"
                >
                  <option value="active">Active Operations</option>
                  <option value="inactive">Inactive / Suspended</option>
                </select>
              </div>

              <div className="flex gap-2 mt-4 border-t border-border-subtle pt-4">
                <button 
                  type="submit"
                  className="flex-1 h-11 bg-primary hover:bg-primary/80 text-white font-bold text-xs rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                >
                  Add Community
                </button>
                <button 
                  onClick={() => setLocFormOpen(false)}
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
