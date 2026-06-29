import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Home, 
  Car, 
  CreditCard, 
  User, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus, 
  Coins, 
  Calendar,
  Send,
  Sliders,
  ChevronRight,
  Star,
  Bell,
  Trash2,
  CalendarCheck
} from 'lucide-react'
import { useMockStore } from '../../stores/mockStore'

export default function CustomerApp() {
  const navigate = useNavigate()
  
  // Zustand States
  const customers = useMockStore(state => state.customers)
  const currentCustomerId = useMockStore(state => state.currentCustomerId)
  const setCurrentCustomerId = useMockStore(state => state.setCurrentCustomerId)
  const washes = useMockStore(state => state.washes)
  const payments = useMockStore(state => state.payments)
  const addCustomerVehicle = useMockStore(state => state.addCustomerVehicle)
  const updateCustomerWallet = useMockStore(state => state.updateCustomerWallet)
  const updateCustomerVacation = useMockStore(state => state.updateCustomerVacation)
  const updateCustomerPlan = useMockStore(state => state.updateCustomerPlan)
  const rateWash = useMockStore(state => state.rateWash)

  // Current active customer profile
  const customer = customers.find(c => c.id === currentCustomerId) || customers[0]

  // View tabs: 'home' | 'garage' | 'payments' | 'profile'
  const [activeTab, setActiveTab] = useState<'home' | 'garage' | 'payments' | 'profile'>('home')

  // UI Modals
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false)
  const [showAddWalletModal, setShowAddWalletModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState<string | null>(null) // washId

  // Rating States
  const [ratingStars, setRatingStars] = useState(5)
  const [ratingComment, setRatingComment] = useState('')

  // Form States
  const [newPlate, setNewPlate] = useState('')
  const [newBrand, setNewBrand] = useState('')
  const [newModel, setNewModel] = useState('')
  const [newColor, setNewColor] = useState('')
  const [newType, setNewType] = useState<'car' | 'bike'>('car')
  
  const [addAmount, setAddAmount] = useState('500')
  const [vacationStart, setVacationStart] = useState('')
  const [vacationEnd, setVacationEnd] = useState('')

  // Before/After comparison slider position state
  const [sliderPos, setSliderPos] = useState(50)

  // Notifications toggle list
  const [showNotifications, setShowNotifications] = useState(false)

  // Active Live Wash Tracking
  const customerWashes = washes.filter(w => w.customerId === customer.id)
  const todayWash = customerWashes.find(w => {
    const todayStr = new Date().toISOString().split('T')[0]
    return w.startTime.startsWith(todayStr)
  }) || customerWashes[0] // fallback to latest

  // Live timer tick for active washes
  const [elapsedTime, setElapsedTime] = useState('00:00')
  useEffect(() => {
    let interval: any
    if (todayWash && todayWash.status === 'in_progress') {
      const startTime = new Date(todayWash.startTime).getTime()
      interval = setInterval(() => {
        const diff = Math.max(0, Date.now() - startTime)
        const min = String(Math.floor(diff / 60000)).padStart(2, '0')
        const sec = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
        setElapsedTime(`${min}:${sec}`)
      }, 1000)
    } else {
      setElapsedTime('00:00')
    }
    return () => clearInterval(interval)
  }, [todayWash])

  // Handle Add Vehicle Submission
  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlate || !newBrand || !newModel) return
    addCustomerVehicle(customer.id, {
      plateNumber: newPlate,
      type: newType,
      brand: newBrand,
      model: newModel,
      color: newColor || 'Grey'
    })
    setShowAddVehicleModal(false)
    setNewPlate('')
    setNewBrand('')
    setNewModel('')
    setNewColor('')
  }

  // Handle Wallet Recharge Submission
  const handleAddWallet = (amount: number) => {
    updateCustomerWallet(customer.id, amount)
    setShowAddWalletModal(false)
  }

  // Handle Rating Review Submission
  const handleRatingSubmit = () => {
    if (!showRatingModal) return
    rateWash(showRatingModal, ratingStars, ratingComment)
    setShowRatingModal(null)
    setRatingComment('')
    setRatingStars(5)
  }

  // Toggle vacation date limits
  const handleVacationSave = () => {
    updateCustomerVacation(customer.id, vacationStart || null, vacationEnd || null)
  }

  return (
    <div className="flex flex-col justify-center items-center py-8 min-h-screen bg-[#070708] px-4">
      
      {/* Device mock switcher header */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xs text-text-muted font-sans select-none">Active Persona:</span>
        <select 
          value={customer.id} 
          onChange={(e) => setCurrentCustomerId(e.target.value)}
          className="h-8 rounded-lg bg-surface border border-border-subtle px-2 text-xs font-semibold focus:outline-none focus:border-primary text-text-primary"
        >
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.flatNumber})</option>
          ))}
        </select>
      </div>

      {/* 3D SMARTPHONE SHELL CONTAINER */}
      <div className="relative w-[375px] h-[812px] bg-[#0D0D0D] rounded-[48px] border-[10px] border-[#1F1F24] shadow-[0_0_80px_rgba(255,87,34,0.18)] overflow-hidden flex flex-col text-text-primary">
        
        {/* Device Notch / Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[110px] h-[26px] bg-black rounded-full z-[100] flex items-center justify-center">
          <div className="w-[10px] h-[10px] bg-[#1c1c1e] rounded-full absolute right-3" />
        </div>

        {/* Device Status Bar */}
        <div className="h-10 px-6 flex items-center justify-between text-text-primary text-[11px] font-semibold bg-black z-50 select-none font-mono">
          <span>09:41</span>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <div className="w-[20px] h-[10px] border border-text-primary rounded-sm p-[1px] flex">
              <div className="h-full w-[80%] bg-text-primary rounded-2xs" />
            </div>
          </div>
        </div>

        {/* INNER SCREEN CONTAINER (SCROLLABLE VIEWPORT) */}
        <div className="flex-1 flex flex-col overflow-y-auto pb-16 relative bg-[#0D0D0D] scrollbar-none">
          
          {/* HEADER ROW */}
          <div className="p-5 flex justify-between items-center z-10 border-b border-border-subtle bg-[#0D0D0D]/60 backdrop-blurSticky sticky top-0">
            <div>
              <span className="text-[10px] font-mono text-primary font-bold tracking-widest uppercase">ELEVORAS RESIDENT</span>
              <h1 className="text-base font-bold font-sans tracking-tight leading-none text-text-primary">{customer.name}</h1>
              <p className="text-[10px] text-text-muted font-sans mt-0.5">Flat {customer.flatNumber} · {customer.locationName}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-8 h-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-text-primary relative cursor-pointer"
              >
                <Bell size={14} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
              </button>
            </div>
          </div>

          {/* NOTIFICATION OVERLAY PANEL */}
          {showNotifications && (
            <div className="absolute top-16 inset-x-4 bg-surface rounded-2xl border border-border-subtle shadow-2xl p-4 z-50 text-xs animate-fade-in font-sans">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-border-subtle">
                <span className="font-bold text-text-primary">Inbox Messages</span>
                <button onClick={() => setShowNotifications(false)} className="text-[10px] text-primary hover:underline">Close</button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg text-text-primary">
                  <span className="font-semibold block">🚿 Wash Started</span>
                  Cleaner Arun has clocked-in and began detailing your vehicle.
                </div>
                <div className="p-2 bg-border-subtle/50 rounded-lg text-text-muted">
                  <span className="font-semibold text-text-primary block">💰 Wallet Recharge</span>
                  Successfully credited ₹500 from UPI Transaction.
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: HOME PANEL */}
          {activeTab === 'home' && (
            <div className="p-5 flex flex-col gap-5">
              
              {/* HERO: WASH STATUS CONTAINER */}
              {todayWash ? (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/15 via-surface to-surface border border-primary/30 flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/10 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase">TODAY'S VEHICLE SERVICES</span>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border-subtle text-[9px] font-bold text-primary animate-pulse">
                      <Clock size={10} />
                      {todayWash.status === 'in_progress' ? 'LIVE TRACKING' : todayWash.status.toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-extrabold tracking-tight uppercase leading-none">{customer.vehicleNumber}</h3>
                    <p className="text-xs text-text-muted font-sans mt-0.5">Cleaner: {todayWash.cleanerName} (assigned)</p>
                  </div>

                  {/* Progressive Stepper */}
                  <div className="flex justify-between items-center gap-2 px-1 relative">
                    <div className="absolute top-3 left-3 right-3 h-[2px] bg-border-subtle z-0" />
                    
                    <div className="z-10 flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-bold">1</div>
                      <span className="text-[9px] text-text-primary font-bold">Scheduled</span>
                    </div>

                    <div className="z-10 flex flex-col items-center gap-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        todayWash.status !== 'scheduled' ? 'bg-primary text-white' : 'bg-surface border border-border-subtle text-text-muted'
                      }`}>2</div>
                      <span className={`text-[9px] font-bold ${todayWash.status !== 'scheduled' ? 'text-text-primary' : 'text-text-muted'}`}>Washing</span>
                    </div>

                    <div className="z-10 flex flex-col items-center gap-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        todayWash.status === 'completed' ? 'bg-success text-white' : 'bg-surface border border-border-subtle text-text-muted'
                      }`}>3</div>
                      <span className={`text-[9px] font-bold ${todayWash.status === 'completed' ? 'text-success' : 'text-text-muted'}`}>Done</span>
                    </div>
                  </div>

                  {/* Real-time counters or image previews */}
                  {todayWash.status === 'in_progress' && (
                    <div className="p-3 bg-black/40 border border-primary/20 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-muted">Wash Elapsed Time</span>
                      <span className="text-lg font-mono text-primary font-bold tracking-wider">{elapsedTime}</span>
                    </div>
                  )}

                  {todayWash.status === 'completed' && (
                    <div className="flex flex-col gap-3">
                      {/* Before / After comparison slider */}
                      <span className="text-[10px] font-mono text-text-muted uppercase">DRAG SLIDER TO VERIFY WASH QUALITY</span>
                      
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-border-subtle">
                        {/* Before (Dark/Gray Overlay) */}
                        <img 
                          src="/bmw-headlights.png" 
                          alt="Before" 
                          className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.35]" 
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[8px] font-bold text-white uppercase tracking-widest">Before (Dusty)</div>
                        
                        {/* After (Clean/Active Color Overlay) */}
                        <div className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-primary" style={{ width: `${sliderPos}%` }}>
                          <img 
                            src="/bmw-headlights.png" 
                            alt="After" 
                            className="absolute inset-0 w-[315px] h-[178px] max-w-none object-cover" 
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-success/80 text-[8px] font-bold text-white uppercase tracking-widest">After (Clean)</div>
                        </div>
                        
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={sliderPos}
                          onChange={(e) => setSliderPos(Number(e.target.value))}
                          className="absolute inset-x-0 bottom-3 z-20 accent-primary cursor-ew-resize opacity-80" 
                        />
                      </div>

                      {!todayWash.rating && (
                        <button 
                          onClick={() => setShowRatingModal(todayWash.id)}
                          className="h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Star size={14} /> Rate and Review Wash Proof
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-surface border border-border-subtle flex flex-col items-center justify-center text-center gap-3 py-8">
                  <AlertCircle size={32} className="text-text-muted" />
                  <p className="text-xs font-semibold text-text-primary">No wash scheduled today</p>
                  <p className="text-[10px] text-text-muted">Contact operations manager or settings panel to schedule.</p>
                </div>
              )}

              {/* STATS STRIP */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 bg-surface border border-border-subtle rounded-xl flex flex-col">
                  <span className="text-[9px] text-text-muted font-bold uppercase">WALLET</span>
                  <span className="text-sm font-mono font-bold text-success mt-1">₹{customer.walletBalance || 0}</span>
                </div>
                <div className="p-3 bg-surface border border-border-subtle rounded-xl flex flex-col">
                  <span className="text-[9px] text-text-muted font-bold uppercase">STREAK</span>
                  <span className="text-sm font-mono font-bold text-primary mt-1">18 Days 🔥</span>
                </div>
                <div className="p-3 bg-surface border border-border-subtle rounded-xl flex flex-col">
                  <span className="text-[9px] text-text-muted font-bold uppercase">PLAN</span>
                  <span className="text-sm font-mono font-bold text-text-primary mt-1">{customer.activePlan || 'Silver'}</span>
                </div>
              </div>

              {/* QUICK ACTIONS ROW */}
              <div>
                <span className="text-[10px] font-mono text-text-muted uppercase">CONCIERGE ACTIONS</span>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button 
                    onClick={() => setActiveTab('garage')}
                    className="p-3 bg-surface border border-border-subtle hover:border-primary/40 rounded-xl flex items-center gap-2 transition-all text-left cursor-pointer"
                  >
                    <Car size={16} className="text-primary" />
                    <div>
                      <span className="text-xs font-bold block text-text-primary">My Garage</span>
                      <span className="text-[9px] text-text-muted block">Manage {customer.vehicles?.length || 1} cars</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('payments')}
                    className="p-3 bg-surface border border-border-subtle hover:border-primary/40 rounded-xl flex items-center gap-2 transition-all text-left cursor-pointer"
                  >
                    <Coins size={16} className="text-success" />
                    <div>
                      <span className="text-xs font-bold block text-text-primary">Top Up</span>
                      <span className="text-[9px] text-text-muted block">Add wallet funds</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* RECENT WASH LOGS */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono text-text-muted uppercase">WASH LOG TIMELINE</span>
                  <span className="text-[9px] text-primary font-bold">View History</span>
                </div>
                <div className="flex flex-col gap-2">
                  {customerWashes.slice(0, 3).map(w => (
                    <div key={w.id} className="p-3 bg-surface border border-border-subtle rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className={w.status === 'completed' ? 'text-success' : 'text-text-muted'} />
                        <div>
                          <span className="font-bold block text-text-primary">{w.vehicleNumber}</span>
                          <span className="text-[9px] text-text-muted">{new Date(w.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} · {w.duration || 20}m</span>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-text-primary">₹{w.paymentAmount}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MY GARAGE */}
          {activeTab === 'garage' && (
            <div className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-heading font-extrabold uppercase">Digital Garage</h2>
                <button 
                  onClick={() => setShowAddVehicleModal(true)}
                  className="px-3 h-8 rounded-full bg-primary text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Vehicle
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {customer.vehicles?.map((v, idx) => (
                  <div key={idx} className="p-4 bg-surface border border-border-subtle rounded-2xl flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-mono text-primary font-bold uppercase">{v.type}</span>
                      <h3 className="text-base font-bold text-text-primary mt-0.5">{v.brand} {v.model}</h3>
                      <p className="text-[10px] text-text-muted font-sans mt-0.5">Color: {v.color} · License: {v.plateNumber}</p>
                    </div>
                    <div className="w-12 h-12 bg-border-subtle/50 rounded-xl flex items-center justify-center text-text-primary">
                      <Car size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENTS & WALLET */}
          {activeTab === 'payments' && (
            <div className="p-5 flex flex-col gap-4">
              <h2 className="text-lg font-heading font-extrabold uppercase">Wallet & Billing</h2>
              
              <div className="p-5 rounded-2xl bg-gradient-to-br from-success/20 to-surface border border-success/30 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] text-text-muted font-mono uppercase">WALLET BALANCE</span>
                  <h3 className="text-3xl font-heading font-extrabold text-success mt-1">₹{customer.walletBalance || 0}</h3>
                </div>
                
                <button 
                  onClick={() => setShowAddWalletModal(true)}
                  className="h-10 rounded-xl bg-success hover:bg-success/90 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Plus size={14} /> Add Wallet Funds
                </button>
              </div>

              {/* Transactions list */}
              <div>
                <span className="text-[10px] font-mono text-text-muted uppercase">TRANSACTION STATEMENTS</span>
                <div className="flex flex-col gap-2 mt-2">
                  {payments.filter(p => p.customerId === customer.id).slice(0, 5).map(p => (
                    <div key={p.id} className="p-3 bg-surface border border-border-subtle rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-text-primary block">{p.type === 'wallet' ? 'Wallet Credit' : 'Wash Deduct'}</span>
                        <span className="text-[9px] text-text-muted">{new Date(p.date).toLocaleDateString()} · {p.transactionId}</span>
                      </div>
                      <span className={`font-mono font-bold ${p.type === 'wallet' ? 'text-success' : 'text-text-primary'}`}>
                        {p.type === 'wallet' ? '+' : '-'}₹{p.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-5 flex flex-col gap-5">
              <h2 className="text-lg font-heading font-extrabold uppercase">Settings</h2>

              {/* Subscription card */}
              <div className="p-4 bg-surface border border-border-subtle rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-text-muted font-mono uppercase">ACTIVE WASH PLAN</span>
                  <h3 className="text-sm font-bold text-text-primary mt-0.5">{customer.activePlan || 'Silver'} Package</h3>
                  <p className="text-[10px] text-text-muted font-sans mt-0.5">Renews automatically via wallet auto-pay.</p>
                </div>
                <button 
                  onClick={() => setShowPlanModal(true)}
                  className="px-3 h-8 rounded-full border border-primary text-primary font-bold text-[10px] cursor-pointer"
                >
                  Change Plan
                </button>
              </div>

              {/* Vacation setting */}
              <div className="p-4 bg-surface border border-border-subtle rounded-xl flex flex-col gap-3">
                <div>
                  <h3 className="text-xs font-bold text-text-primary">Vacation Standby Mode</h3>
                  <p className="text-[9px] text-text-muted font-sans mt-0.5">Temporarily suspend washing services while away.</p>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="date" 
                    value={vacationStart}
                    onChange={(e) => setVacationStart(e.target.value)}
                    className="flex-1 h-8 rounded bg-border-subtle/50 px-2 text-[10px] text-text-primary border border-border-subtle" 
                  />
                  <input 
                    type="date" 
                    value={vacationEnd}
                    onChange={(e) => setVacationEnd(e.target.value)}
                    className="flex-1 h-8 rounded bg-border-subtle/50 px-2 text-[10px] text-text-primary border border-border-subtle" 
                  />
                </div>
                <button 
                  onClick={handleVacationSave}
                  className="h-8 rounded bg-primary text-white font-bold text-[10px] flex items-center justify-center cursor-pointer"
                >
                  Save Dates
                </button>
              </div>
            </div>
          )}

        </div>

        {/* MODAL: RATE WASH */}
        {showRatingModal && (
          <div className="absolute inset-0 bg-black/80 z-[110] flex items-end justify-center">
            <div className="w-full bg-surface border-t border-border-subtle rounded-t-[32px] p-6 flex flex-col gap-4 animate-slide-up">
              <h3 className="text-sm font-heading font-extrabold uppercase text-center">Rate cleaner service</h3>
              
              {/* Star selector */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    onClick={() => setRatingStars(star)}
                    className="cursor-pointer"
                  >
                    <Star 
                      size={28} 
                      className={star <= ratingStars ? 'text-primary fill-primary' : 'text-text-muted'} 
                    />
                  </button>
                ))}
              </div>

              <textarea 
                placeholder="Leave feedback comments (optional)..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                className="w-full h-20 rounded-xl bg-border-subtle/50 border border-border-subtle p-3 text-xs text-text-primary focus:outline-none focus:border-primary resize-none"
              />

              <div className="flex gap-2">
                <button 
                  onClick={() => setShowRatingModal(null)}
                  className="flex-1 h-10 rounded-xl border border-border-subtle text-text-primary font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRatingSubmit}
                  className="flex-1 h-10 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD VEHICLE */}
        {showAddVehicleModal && (
          <div className="absolute inset-0 bg-black/85 z-[110] flex items-center justify-center p-4">
            <form onSubmit={handleAddVehicle} className="w-full bg-surface border border-border-subtle rounded-3xl p-5 flex flex-col gap-3.5 animate-zoom-in">
              <h3 className="text-xs font-heading font-extrabold uppercase text-center">Add vehicle to garage</h3>
              
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setNewType('car')}
                  className={`flex-1 h-8 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    newType === 'car' ? 'bg-primary text-white' : 'bg-border-subtle/50 text-text-primary'
                  }`}
                >
                  Car
                </button>
                <button 
                  type="button"
                  onClick={() => setNewType('bike')}
                  className={`flex-1 h-8 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    newType === 'bike' ? 'bg-primary text-white' : 'bg-border-subtle/50 text-text-primary'
                  }`}
                >
                  Bike
                </button>
              </div>

              <input 
                type="text" 
                placeholder="License Plate Number" 
                value={newPlate}
                onChange={(e) => setNewPlate(e.target.value)}
                className="h-10 rounded-xl bg-border-subtle/50 px-3 text-xs text-text-primary border border-border-subtle focus:outline-none focus:border-primary"
                required
              />

              <input 
                type="text" 
                placeholder="Make (e.g. BMW)" 
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                className="h-10 rounded-xl bg-border-subtle/50 px-3 text-xs text-text-primary border border-border-subtle focus:outline-none focus:border-primary"
                required
              />

              <input 
                type="text" 
                placeholder="Model (e.g. 3 Series)" 
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                className="h-10 rounded-xl bg-border-subtle/50 px-3 text-xs text-text-primary border border-border-subtle focus:outline-none focus:border-primary"
                required
              />

              <input 
                type="text" 
                placeholder="Color (e.g. Black)" 
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="h-10 rounded-xl bg-border-subtle/50 px-3 text-xs text-text-primary border border-border-subtle focus:outline-none focus:border-primary"
              />

              <div className="flex gap-2 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="flex-1 h-10 rounded-xl border border-border-subtle text-text-primary font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: RECHARGE WALLET */}
        {showAddWalletModal && (
          <div className="absolute inset-0 bg-black/85 z-[110] flex items-center justify-center p-4">
            <div className="w-full bg-surface border border-border-subtle rounded-3xl p-5 flex flex-col gap-4 animate-zoom-in">
              <h3 className="text-xs font-heading font-extrabold uppercase text-center">Recharge Wallet balance</h3>
              
              <div className="grid grid-cols-3 gap-2">
                {[200, 500, 1000].map(amount => (
                  <button 
                    key={amount}
                    onClick={() => setAddAmount(String(amount))}
                    className={`h-10 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      addAmount === String(amount) ? 'bg-success text-white' : 'bg-border-subtle/50 text-text-primary border border-border-subtle'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              <input 
                type="number" 
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="h-11 rounded-xl bg-border-subtle/50 px-4 text-center text-lg font-mono text-text-primary border border-border-subtle focus:outline-none focus:border-success"
              />

              <div className="flex gap-2">
                <button 
                  onClick={() => setShowAddWalletModal(false)}
                  className="flex-1 h-10 rounded-xl border border-border-subtle text-text-primary font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleAddWallet(Number(addAmount))}
                  className="flex-1 h-10 rounded-xl bg-success text-white font-bold text-xs cursor-pointer"
                >
                  Recharge
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CHANGE SUBSCRIPTION PLAN */}
        {showPlanModal && (
          <div className="absolute inset-0 bg-black/85 z-[110] flex items-center justify-center p-4">
            <div className="w-full bg-surface border border-border-subtle rounded-3xl p-5 flex flex-col gap-3 animate-zoom-in">
              <h3 className="text-xs font-heading font-extrabold uppercase text-center">Choose subscription plan</h3>
              
              <div className="flex flex-col gap-2">
                {['Silver', 'Gold', 'Diamond'].map(plan => (
                  <button
                    key={plan}
                    onClick={() => {
                      updateCustomerPlan(customer.id, plan)
                      setShowPlanModal(false)
                    }}
                    className={`p-3.5 rounded-2xl text-left border flex justify-between items-center transition-all cursor-pointer ${
                      customer.activePlan === plan 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border-subtle bg-border-subtle/20 text-text-primary'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{plan} Plan</span>
                      <span className="text-[9px] text-text-muted">
                        {plan === 'Silver' ? '20 washes/mo' : plan === 'Gold' ? 'Daily wash + polish' : 'Unlimited washes + steam coating'}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold">
                      {plan === 'Silver' ? '₹799' : plan === 'Gold' ? '₹1299' : '₹1999'}
                    </span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setShowPlanModal(false)}
                className="w-full h-10 rounded-xl border border-border-subtle text-text-primary font-bold text-xs mt-2 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* DEVICE BOTTOM BOTTOM BAR GESTURE NAV */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-[#0D0D0D] border-t border-border-subtle flex justify-around items-center px-4 select-none z-50">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'home' ? 'text-primary' : 'text-text-muted'}`}
          >
            <Home size={16} />
            <span className="text-[9px] font-sans font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('garage')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'garage' ? 'text-primary' : 'text-text-muted'}`}
          >
            <Car size={16} />
            <span className="text-[9px] font-sans font-medium">Garage</span>
          </button>

          <button 
            onClick={() => setActiveTab('payments')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'payments' ? 'text-primary' : 'text-text-muted'}`}
          >
            <CreditCard size={16} />
            <span className="text-[9px] font-sans font-medium">Wallet</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'profile' ? 'text-primary' : 'text-text-muted'}`}
          >
            <User size={16} />
            <span className="text-[9px] font-sans font-medium">Settings</span>
          </button>
        </div>

        {/* Phone Bottom Home Gesture indicator bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-[#3f3f46] rounded-full z-50 pointer-events-none" />

      </div>

    </div>
  )
}
