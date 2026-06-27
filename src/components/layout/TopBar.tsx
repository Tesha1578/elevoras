import React, { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { 
  Bell, 
  Search, 
  Menu, 
  User, 
  SearchIcon,
  Sparkles,
  Car,
  Coins,
  Check,
  X
} from 'lucide-react'
import { useMockStore } from '../../stores/mockStore'

interface TopBarProps {
  setMobileOpen: (o: boolean) => void
  mobileOpen: boolean
}

export default function TopBar({ setMobileOpen, mobileOpen }: TopBarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const currentAdmin = useMockStore(state => state.currentAdmin)
  const washes = useMockStore(state => state.washes)
  const payments = useMockStore(state => state.payments)
  const cleaners = useMockStore(state => state.cleaners)

  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ customers: any[], cleaners: any[] }>({ customers: [], cleaners: [] })

  const customers = useMockStore(state => state.customers)

  // Generate dynamic notification alerts from our mock data
  useEffect(() => {
    const list: any[] = []
    
    // In progress wash alert
    const activeWash = washes.find(w => w.status === 'in_progress')
    if (activeWash) {
      list.push({
        id: 'n-1',
        title: 'Live Wash Active',
        desc: `Cleaner ${activeWash.cleanerName} started washing Flat ${activeWash.flatNumber}.`,
        time: 'Just now',
        type: 'wash',
        unread: true
      })
    }

    // Recent refund
    const refundedPay = payments.find(p => p.status === 'refunded')
    if (refundedPay) {
      list.push({
        id: 'n-2',
        title: 'Refund Approved',
        desc: `Refund of ₹${refundedPay.amount} initiated for ${refundedPay.customerName}.`,
        time: '15m ago',
        type: 'payment',
        unread: true
      })
    }

    // Active checks
    const activeCleaner = cleaners.find(c => c.status === 'active')
    if (activeCleaner) {
      list.push({
        id: 'n-3',
        title: 'Staff Checked In',
        desc: `${activeCleaner.name} checked in successfully today.`,
        time: '1h ago',
        type: 'attendance',
        unread: false
      })
    }

    setNotifications(list)
  }, [washes, payments, cleaners])

  // Key bindings for global search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle Search Queries
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ customers: [], cleaners: [] })
      return
    }

    const q = searchQuery.toLowerCase()
    
    const matchedCust = customers.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.flatNumber.toLowerCase().includes(q) || 
      c.vehicleNumber.toLowerCase().includes(q)
    ).slice(0, 5)

    const matchedClean = cleaners.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.employeeId.toLowerCase().includes(q)
    ).slice(0, 5)

    setSearchResults({ customers: matchedCust, cleaners: matchedClean })
  }, [searchQuery, customers, cleaners])

  // Breadcrumbs builder
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(x => x)
    // Shift off the admin tag or translate
    const crumbs = paths.map((path, idx) => {
      const routeTo = `/${paths.slice(0, idx + 1).join('/')}`
      const isLast = idx === paths.length - 1
      const label = path.charAt(0).toUpperCase() + path.slice(1)
      
      return (
        <span key={routeTo} className="flex items-center gap-1">
          <span className="text-slate-600">/</span>
          {isLast ? (
            <span className="text-slate-300 font-medium font-sans text-xs">{label}</span>
          ) : (
            <Link to={routeTo} className="text-slate-500 hover:text-slate-300 font-sans text-xs">
              {label}
            </Link>
          )}
        </span>
      )
    })

    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link to="/admin" className="text-slate-500 hover:text-slate-300 font-sans">
          Admin
        </Link>
        {crumbs}
      </div>
    )
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="h-16 border-b border-border-subtle/50 bg-[#111827]/70 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
      
      {/* Mobile Drawer Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg bg-surface border border-border-subtle"
        >
          <Menu size={18} />
        </button>
        <div className="hidden sm:block">
          {getBreadcrumbs()}
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-4">
        
        {/* Search trigger pill */}
        <button 
          onClick={() => setSearchOpen(true)}
          className="h-10 rounded-xl bg-surface border border-border-subtle/80 hover:border-slate-700 px-4 text-left text-slate-500 text-xs flex items-center justify-between gap-6 transition-all w-48 md:w-64 cursor-pointer"
        >
          <span className="flex items-center gap-2 font-sans font-light">
            <Search size={14} /> Search...
          </span>
          <span className="text-[10px] font-mono bg-slate-800/80 px-1.5 py-0.5 rounded border border-border-subtle">
            &#8984;K
          </span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl bg-surface border border-border-subtle/80 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown panel */}
          {showNotifications && (
            <>
              <div 
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 z-40 bg-transparent"
              />
              <div className="absolute right-0 mt-3 w-80 rounded-2xl glass-panel shadow-2xl p-4 z-50 text-xs font-sans">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-3">
                  <span className="font-heading font-bold text-slate-200">Alert Notification Center</span>
                  <button 
                    onClick={markAllRead} 
                    className="text-[10px] font-semibold text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 font-sans font-light">
                      No operational notifications.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`p-2.5 rounded-xl border flex gap-3 transition-colors ${
                          notif.unread 
                            ? 'bg-[#111827] border-primary/20 hover:bg-[#1f2937]/40' 
                            : 'bg-[#111827]/40 border-border-subtle/50 text-slate-400'
                        }`}
                      >
                        <div className="mt-0.5">
                          {notif.type === 'wash' && <Car size={14} className="text-primary" />}
                          {notif.type === 'payment' && <Coins size={14} className="text-secondary" />}
                          {notif.type === 'attendance' && <Sparkles size={14} className="text-violet-400" />}
                        </div>
                        <div className="flex-1 flex flex-col">
                          <span className="font-semibold text-slate-200">{notif.title}</span>
                          <span className="text-[11px] text-slate-400 font-light mt-0.5 leading-relaxed">{notif.desc}</span>
                          <span className="text-[9px] font-mono text-slate-500 mt-1">{notif.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Account Avatar */}
        {currentAdmin && (
          <div className="flex items-center gap-3 border-l border-border-subtle/50 pl-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-secondary/40 to-primary/40 border border-border-subtle flex items-center justify-center text-slate-200 text-xs font-bold font-heading">
              {currentAdmin.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-[11px] font-semibold text-slate-200 leading-none">{currentAdmin.name}</span>
              <span className="text-[9px] font-mono text-slate-500 leading-none mt-1 uppercase font-bold">{currentAdmin.role}</span>
            </div>
          </div>
        )}

      </div>

      {/* Global Cmd+K Search Dialog overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-sm">
          <div 
            onClick={() => setSearchOpen(false)}
            className="absolute inset-0 z-0"
          />
          <div className="w-full max-w-xl rounded-2xl glass-panel shadow-2xl p-4 relative z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2 text-slate-400 flex-1">
                <SearchIcon size={16} />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search customer name, flat (e.g. A-202), vehicle..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-slate-200 text-sm font-sans w-full focus:outline-none placeholder:text-slate-600"
                />
              </div>
              <button 
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded bg-surface border border-border-subtle text-slate-500 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            {/* Results listing */}
            <div className="max-h-80 overflow-y-auto flex flex-col gap-3 font-sans text-xs">
              {!searchQuery.trim() ? (
                <div className="text-center py-8 text-slate-500 font-light">
                  Type to query customers, cleaners, flats or locations...
                </div>
              ) : (
                <>
                  {searchResults.customers.length > 0 && (
                    <div>
                      <div className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider mb-2 px-1">Customers</div>
                      <div className="flex flex-col gap-1.5">
                        {searchResults.customers.map(c => (
                          <div 
                            key={c.id} 
                            onClick={() => { setSearchOpen(false); navigate(`/admin/customers?id=${c.id}`); }}
                            className="p-2.5 rounded-xl bg-surface hover:bg-[#1f2937]/50 border border-border-subtle/50 flex justify-between items-center cursor-pointer transition-colors"
                          >
                            <div>
                              <div className="font-semibold text-slate-200">{c.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">Flat {c.flatNumber} &middot; {c.locationName}</div>
                            </div>
                            <span className="font-mono text-[10px] text-slate-500 bg-[#0F0F0F] px-2 py-0.5 rounded border border-border-subtle">
                              {c.vehicleNumber}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.cleaners.length > 0 && (
                    <div>
                      <div className="font-mono text-[10px] text-secondary uppercase font-bold tracking-wider mb-2 px-1">Cleaners</div>
                      <div className="flex flex-col gap-1.5">
                        {searchResults.cleaners.map(c => (
                          <div 
                            key={c.id} 
                            onClick={() => { setSearchOpen(false); navigate(`/admin/cleaners?id=${c.id}`); }}
                            className="p-2.5 rounded-xl bg-surface hover:bg-[#1f2937]/50 border border-border-subtle/50 flex justify-between items-center cursor-pointer transition-colors"
                          >
                            <div>
                              <div className="font-semibold text-slate-200">{c.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">Employee ID: {c.employeeId}</div>
                            </div>
                            <span className="font-mono text-[9px] text-[#00C896] bg-[#00C896]/10 px-2 py-0.5 rounded border border-[#00C896]/20">
                              {c.status.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.customers.length === 0 && searchResults.cleaners.length === 0 && (
                    <div className="text-center py-8 text-slate-500 font-light">
                      No records matched your search query.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
