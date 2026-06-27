import React, { useState, useMemo } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Eye, 
  X, 
  Check, 
  Car, 
  Smartphone,
  Info,
  CalendarDays,
  Coins,
  Star
} from 'lucide-react'
import { useMockStore, Customer, Cleaner, Location } from '../../stores/mockStore'

export default function Customers() {
  // Store actions & data
  const customers = useMockStore(state => state.customers)
  const cleaners = useMockStore(state => state.cleaners)
  const locations = useMockStore(state => state.locations)
  const flats = useMockStore(state => state.flats)
  const washes = useMockStore(state => state.washes)
  const payments = useMockStore(state => state.payments)
  const reviews = useMockStore(state => state.reviews)
  
  const addCustomer = useMockStore(state => state.addCustomer)
  const updateCustomer = useMockStore(state => state.updateCustomer)
  const deleteCustomer = useMockStore(state => state.deleteCustomer)

  // Filters & query states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLoc, setSelectedLoc] = useState('')
  const [selectedCleaner, setSelectedCleaner] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // UI state overlays
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [editId, setEditId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'washes' | 'payments' | 'reviews'>('washes')

  // Form inputs
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    locationId: '',
    flatNumber: '',
    vehicleNumber: '',
    vehicleType: 'car' as Customer['vehicleType'],
    cleanerId: '',
    status: 'active' as Customer['status']
  })

  // Pre-fill search from query param if passed
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (id) {
      setDetailId(id)
      setDetailOpen(true)
    }
  }, [])

  // Filtered & Searched Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.mobile.includes(searchQuery) ||
                            c.flatNumber.toLowerCase().includes(c.flatNumber.toLowerCase())
      
      const matchesLoc = selectedLoc ? c.locationId === selectedLoc : true
      const matchesClean = selectedCleaner ? c.cleanerId === selectedCleaner : true
      const matchesStatus = selectedStatus ? c.status === selectedStatus : true

      return matchesSearch && matchesLoc && matchesClean && matchesStatus
    })
  }, [customers, searchQuery, selectedLoc, selectedCleaner, selectedStatus])

  // Paginated output
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredCustomers.slice(start, start + itemsPerPage)
  }, [filteredCustomers, currentPage])

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)

  // Get active details object
  const activeCustomerDetail = useMemo(() => {
    return customers.find(c => c.id === detailId) || null
  }, [customers, detailId])

  // Get customer specific logs
  const customerLogs = useMemo(() => {
    if (!detailId) return { washes: [], payments: [], reviews: [] }
    return {
      washes: washes.filter(w => w.customerId === detailId),
      payments: payments.filter(p => p.customerId === detailId),
      reviews: reviews.filter(r => r.customerId === detailId)
    }
  }, [detailId, washes, payments, reviews])

  // Open Form for Creation
  const handleOpenCreate = () => {
    setFormData({
      name: '',
      mobile: '',
      locationId: locations[0]?.id || '',
      flatNumber: '',
      vehicleNumber: '',
      vehicleType: 'car',
      cleanerId: cleaners.filter(c => c.status === 'active')[0]?.id || '',
      status: 'active'
    })
    setFormMode('create')
    setFormOpen(true)
  }

  // Open Form for Editing
  const handleOpenEdit = (cust: Customer) => {
    setFormData({
      name: cust.name,
      mobile: cust.mobile,
      locationId: cust.locationId,
      flatNumber: cust.flatNumber,
      vehicleNumber: cust.vehicleNumber,
      vehicleType: cust.vehicleType,
      cleanerId: cust.cleanerId,
      status: cust.status
    })
    setEditId(cust.id)
    setFormMode('edit')
    setFormOpen(true)
  }

  // Save Form Handler
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || formData.mobile.length < 10 || !formData.flatNumber) {
      alert('Please check details. Mobile must be at least 10 digits.')
      return
    }

    const loc = locations.find(l => l.id === formData.locationId)
    const cleaner = cleaners.find(c => c.id === formData.cleanerId)

    // Flat logic
    const flatId = `f-${formData.locationId}-${formData.flatNumber}`

    const payload = {
      name: formData.name,
      mobile: formData.mobile,
      flatId,
      flatNumber: formData.flatNumber,
      locationId: formData.locationId,
      locationName: loc ? loc.name : '',
      vehicleNumber: formData.vehicleNumber.toUpperCase(),
      vehicleType: formData.vehicleType,
      cleanerId: formData.cleanerId,
      cleanerName: cleaner ? cleaner.name : 'Unassigned',
      status: formData.status
    }

    if (formMode === 'create') {
      addCustomer(payload)
      alert('Customer created successfully!')
    } else if (formMode === 'edit' && editId) {
      updateCustomer(editId, payload)
      alert('Customer updated successfully!')
    }

    setFormOpen(false)
    setEditId(null)
  }

  // Delete customer handler
  const handleDeleteCustomer = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete customer ${name}? This will free their assigned flat.`)) {
      deleteCustomer(id)
      alert('Customer deleted.')
      if (detailId === id) setDetailOpen(false)
    }
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Customer Database</h1>
          <p className="text-text-muted text-xs font-sans font-light mt-1">Manage gated community residents and vehicle details</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="h-10 rounded-xl bg-primary hover:bg-primary/80 text-white text-xs font-bold px-4 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus size={16} /> Add Resident Customer
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Search */}
        <div className="md:col-span-2 relative flex items-center">
          <Search size={14} className="absolute left-3.5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search name, phone, flat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 rounded-xl bg-surface border border-border-subtle/80 pl-10 pr-4 text-xs focus:outline-none focus:border-primary transition-colors text-white placeholder:text-slate-600"
          />
        </div>

        {/* Location Filter */}
        <select 
          value={selectedLoc}
          onChange={(e) => setSelectedLoc(e.target.value)}
          className="h-11 rounded-xl bg-surface border border-border-subtle/80 px-4 text-xs text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="">All Gated Locations</option>
          {locations.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        {/* Cleaner Filter */}
        <select 
          value={selectedCleaner}
          onChange={(e) => setSelectedCleaner(e.target.value)}
          className="h-11 rounded-xl bg-surface border border-border-subtle/80 px-4 text-xs text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="">All Assigned Cleaners</option>
          {cleaners.filter(cl => cl.status === 'active').map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-11 rounded-xl bg-surface border border-border-subtle/80 px-4 text-xs text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

      </div>

      {/* DATABASE GRID / TABLE */}
      <div className="glass-panel border border-border-subtle rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="bg-[#111827]/40 border-b border-border-subtle text-slate-500 font-mono text-[10px] uppercase">
                <th className="py-3.5 px-5">Resident</th>
                <th className="py-3.5 px-5">Residence (Flat)</th>
                <th className="py-3.5 px-5">Vehicle Details</th>
                <th className="py-3.5 px-5">Cleaner Assigned</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500 font-light">
                    No customers found matching filter requirements.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((cust) => (
                  <tr 
                    key={cust.id}
                    className="border-b border-border-subtle/50 hover:bg-slate-800/10 transition-colors"
                  >
                    {/* Resident Info */}
                    <td className="py-3.5 px-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">{cust.name}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">{cust.mobile}</span>
                      </div>
                    </td>
                    
                    {/* Location & Flat */}
                    <td className="py-3.5 px-5 text-slate-300">
                      <div className="flex flex-col">
                        <span>Flat {cust.flatNumber}</span>
                        <span className="text-[10px] text-slate-500 font-light mt-0.5">{cust.locationName}</span>
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-200 bg-[#0F0F0F] border border-border-subtle px-2 py-0.5 rounded">
                          {cust.vehicleNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 capitalize">({cust.vehicleType})</span>
                      </div>
                    </td>

                    {/* Cleaner Assigned */}
                    <td className="py-3.5 px-5 text-slate-300">
                      {cust.cleanerName}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                        cust.status === 'active' 
                          ? 'bg-primary/10 border-primary/20 text-primary' 
                          : 'bg-slate-800 border-border-subtle text-slate-500'
                      }`}>
                        {cust.status}
                      </span>
                    </td>

                    {/* Row Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => { setDetailId(cust.id); setDetailOpen(true); }}
                          className="w-8 h-8 rounded-lg bg-surface border border-border-subtle/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="View detailed statistics"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(cust)}
                          className="w-8 h-8 rounded-lg bg-surface border border-border-subtle/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit Customer"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                          className="w-8 h-8 rounded-lg bg-surface border border-border-subtle/80 text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove Customer"
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

        {/* Pagination navigation */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border-subtle flex items-center justify-between font-mono text-[10px] text-slate-500 bg-[#111827]/10">
            <span>Showing page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-3 h-8 rounded-lg bg-surface border border-border-subtle text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3 h-8 rounded-lg bg-surface border border-border-subtle text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD/EDIT RESIDENT DRAWER */}
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
                  {formMode === 'create' ? 'Register New Resident' : 'Modify Customer File'}
                </h3>
                <button 
                  onClick={() => setFormOpen(false)}
                  className="p-1 rounded bg-surface border border-border-subtle text-slate-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveCustomer} className="flex flex-col gap-4 font-sans text-xs">
                
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-semibold">Customer Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g. Siddharth Nair"
                    className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-primary placeholder:text-slate-700"
                  />
                </div>

                {/* Mobile */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-semibold">Mobile Number (+91 prefix)</label>
                  <input 
                    type="tel" 
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                    placeholder="9884XXXXXX"
                    className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-primary placeholder:text-slate-700 font-mono"
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-semibold">Gated Complex / Location</label>
                  <select 
                    value={formData.locationId}
                    onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                    className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                {/* Flat Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-semibold">Flat / Villa Number</label>
                  <input 
                    type="text" 
                    required
                    value={formData.flatNumber}
                    onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                    placeholder="E.g. C-304"
                    className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-primary placeholder:text-slate-700"
                  />
                </div>

                {/* Vehicle details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-semibold">Vehicle Number</label>
                    <input 
                      type="text" 
                      required
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                      placeholder="TN-07-CS-1234"
                      className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-primary placeholder:text-slate-700 font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-semibold">Vehicle Type</label>
                    <select 
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as Customer['vehicleType'] })}
                      className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="car">Car Only</option>
                      <option value="bike">Bike Only</option>
                      <option value="both">Both (Car + Bike)</option>
                    </select>
                  </div>
                </div>

                {/* Cleaner Assignment */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-semibold">Cleaner Assignment</label>
                  <select 
                    value={formData.cleanerId}
                    onChange={(e) => setFormData({ ...formData, cleanerId: e.target.value })}
                    className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="">Leave Unassigned</option>
                    {cleaners.filter(cl => cl.status === 'active').map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.assignedFlatCount} assigned)</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-semibold">Membership Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Customer['status'] })}
                    className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="active">Active Subscriber</option>
                    <option value="inactive">Suspended / Inactive</option>
                  </select>
                </div>

                <button type="submit" className="hidden" id="submit-form-btn" />
              </form>
            </div>

            <div className="mt-8 border-t border-border-subtle pt-4 flex gap-2">
              <button 
                onClick={() => document.getElementById('submit-form-btn')?.click()}
                className="flex-1 h-11 bg-primary hover:bg-primary/80 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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

      {/* CUSTOMER PROFILE DETAIL PANEL */}
      {detailOpen && activeCustomerDetail && (
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
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/30 to-secondary/30 flex items-center justify-center text-white font-bold text-lg font-heading">
                    {activeCustomerDetail.name.split(' ').map(x => x[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-white leading-none">{activeCustomerDetail.name}</h3>
                    <p className="text-text-muted text-xs font-sans font-light mt-1.5 flex items-center gap-1.5">
                      <Smartphone size={10} /> {activeCustomerDetail.mobile} &middot; Flat {activeCustomerDetail.flatNumber}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setDetailOpen(false); handleOpenEdit(activeCustomerDetail); }}
                    className="h-8 rounded-lg border border-border-subtle px-3 text-xs hover:border-slate-500 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => setDetailOpen(false)}
                    className="p-1 rounded bg-surface border border-border-subtle text-slate-500 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Quick Info block */}
              <div className="grid grid-cols-3 gap-4 mb-6 font-sans text-xs">
                <div className="p-3.5 rounded-xl bg-surface border border-border-subtle/50 flex flex-col gap-0.5">
                  <span className="text-slate-500 uppercase font-mono text-[8px]">Location complex</span>
                  <span className="text-slate-200 font-semibold truncate mt-1">{activeCustomerDetail.locationName}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface border border-border-subtle/50 flex flex-col gap-0.5">
                  <span className="text-slate-500 uppercase font-mono text-[8px]">Vehicle Details</span>
                  <span className="text-slate-200 font-semibold font-mono mt-1">{activeCustomerDetail.vehicleNumber}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface border border-border-subtle/50 flex flex-col gap-0.5">
                  <span className="text-slate-500 uppercase font-mono text-[8px]">Staff Assigned</span>
                  <span className="text-slate-200 font-semibold truncate mt-1">{activeCustomerDetail.cleanerName}</span>
                </div>
              </div>

              {/* Tabs list (Washes, Payments, Reviews) */}
              <div className="flex border-b border-border-subtle mb-4">
                <button 
                  onClick={() => setActiveTab('washes')}
                  className={`flex items-center gap-1.5 pb-2.5 px-4 font-semibold text-xs font-heading border-b-2 transition-colors relative top-[1px] ${
                    activeTab === 'washes' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <CalendarDays size={14} /> Wash History ({customerLogs.washes.length})
                </button>
                <button 
                  onClick={() => setActiveTab('payments')}
                  className={`flex items-center gap-1.5 pb-2.5 px-4 font-semibold text-xs font-heading border-b-2 transition-colors relative top-[1px] ${
                    activeTab === 'payments' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Coins size={14} /> Payments ({customerLogs.payments.length})
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`flex items-center gap-1.5 pb-2.5 px-4 font-semibold text-xs font-heading border-b-2 transition-colors relative top-[1px] ${
                    activeTab === 'reviews' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Star size={14} /> Reviews ({customerLogs.reviews.length})
                </button>
              </div>

              {/* Tab views content */}
              <div className="max-h-96 overflow-y-auto pr-1">
                
                {/* Tabs - Wash History */}
                {activeTab === 'washes' && (
                  <div className="flex flex-col gap-2 font-sans text-xs">
                    {customerLogs.washes.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 font-light">No washes recorded yet.</div>
                    ) : (
                      customerLogs.washes.map((w: any) => (
                        <div key={w.id} className="p-3 rounded-xl bg-surface border border-border-subtle/80 flex items-center justify-between">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-slate-200">Date: {new Date(w.startTime).toLocaleDateString()}</span>
                            <span className="text-[10px] text-slate-500 font-light">Cleaner: {w.cleanerName} &middot; Duration: {w.duration || '--'}m</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                            w.status === 'completed' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                          }`}>
                            {w.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tabs - Payments */}
                {activeTab === 'payments' && (
                  <div className="flex flex-col gap-2 font-sans text-xs">
                    {customerLogs.payments.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 font-light">No payment transactions found.</div>
                    ) : (
                      customerLogs.payments.map((p: any) => (
                        <div key={p.id} className="p-3 rounded-xl bg-surface border border-border-subtle/80 flex items-center justify-between">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-slate-200">{p.transactionId}</span>
                            <span className="text-[10px] text-slate-500 font-light">Date: {new Date(p.date).toLocaleDateString()} &middot; Type: {p.type}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <strong className="text-slate-200">₹{p.amount}</strong>
                            <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                              p.status === 'success' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                            }`}>
                              {p.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tabs - Reviews */}
                {activeTab === 'reviews' && (
                  <div className="flex flex-col gap-3 font-sans text-xs">
                    {customerLogs.reviews.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 font-light">No reviews posted.</div>
                    ) : (
                      customerLogs.reviews.map((r: any) => (
                        <div key={r.id} className="p-3.5 rounded-xl bg-surface border border-border-subtle">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-0.5 text-primary">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={11} fill={i < r.rating ? 'currentColor' : 'none'} />
                              ))}
                            </div>
                            <span className="text-[9px] font-mono text-slate-500">{new Date(r.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-300 italic font-light">"{r.review}"</p>
                          <div className="text-[9px] text-slate-500 font-mono mt-2 uppercase font-semibold">Cleaner: {r.cleanerName}</div>
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
