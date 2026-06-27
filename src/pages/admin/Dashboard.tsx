import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Car, 
  Coins, 
  Star, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Camera,
  Search,
  ExternalLink
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { useMockStore, Wash } from '../../stores/mockStore'

export default function Dashboard() {
  const navigate = useNavigate()
  
  // Data selectors
  const washes = useMockStore(state => state.washes)
  const cleaners = useMockStore(state => state.cleaners)
  const payments = useMockStore(state => state.payments)
  const reviews = useMockStore(state => state.reviews)
  const attendance = useMockStore(state => state.attendance)
  const completeWash = useMockStore(state => state.completeWash)

  // Selected wash for side detail panel
  const [selectedWashId, setSelectedWashId] = useState<string | null>(null)
  
  // Selected wash object
  const selectedWash = useMemo(() => {
    return washes.find(w => w.id === selectedWashId) || null
  }, [washes, selectedWashId])

  // Get Today's Date String
  const todayFormatted = useMemo(() => {
    return new Date().toISOString().split('T')[0]
  }, [])

  // Today's Stats calculations
  const stats = useMemo(() => {
    // 1. Today's Washes
    const todayWashes = washes.filter(w => w.startTime.startsWith(todayFormatted))
    const completedToday = todayWashes.filter(w => w.status === 'completed').length
    
    // Yesterday's washes for trend
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayFormatted = yesterday.toISOString().split('T')[0]
    const yesterdayWashesCount = washes.filter(w => w.startTime.startsWith(yesterdayFormatted)).length
    const washTrend = yesterdayWashesCount === 0 ? 100 : Math.round(((todayWashes.length - yesterdayWashesCount) / yesterdayWashesCount) * 100)

    // 2. Active Cleaners
    const activeCheckedIn = attendance.filter(a => a.date === todayFormatted && (a.status === 'present' || a.status === 'late')).length
    const totalCleanersCount = cleaners.filter(c => c.status !== 'inactive').length

    // 3. Pending Payments
    const pendingAmount = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, curr) => sum + curr.amount, 0)

    // 4. Customer Satisfaction
    const recentRatings = reviews.slice(0, 20)
    const avgRating = recentRatings.length === 0 
      ? 4.8 
      : Number((recentRatings.reduce((sum, curr) => sum + curr.rating, 0) / recentRatings.length).toFixed(1))

    return {
      todayWashesCount: todayWashes.length,
      completedToday,
      washTrend,
      activeCleaners: activeCheckedIn,
      totalCleaners: totalCleanersCount,
      pendingPayments: pendingAmount,
      satisfaction: avgRating
    }
  }, [washes, cleaners, payments, reviews, attendance, todayFormatted])

  // Area Chart Data (Last 14 days wash velocity)
  const chartData = useMemo(() => {
    const data = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const formatted = d.toISOString().split('T')[0]
      const count = washes.filter(w => w.startTime.startsWith(formatted) && w.status === 'completed').length
      
      const label = d.toLocaleDateString([], { month: 'short', day: 'numeric' })
      data.push({ name: label, washes: count })
    }
    return data
  }, [washes])

  // Pie Chart Data (Today's payment status counts)
  const pieData = useMemo(() => {
    const todayPayments = payments.filter(p => p.date.startsWith(todayFormatted))
    const success = todayPayments.filter(p => p.status === 'success').reduce((sum, c) => sum + c.amount, 0)
    const pending = todayPayments.filter(p => p.status === 'pending').reduce((sum, c) => sum + c.amount, 0)
    const failed = todayPayments.filter(p => p.status === 'failed').reduce((sum, c) => sum + c.amount, 0)

    return [
      { name: 'Collected', value: success === 0 && pending === 0 ? 3400 : success, color: '#00C896' },
      { name: 'Pending', value: pending === 0 && success === 0 ? 800 : pending, color: '#F59E0B' },
      { name: 'Failed', value: failed === 0 && success === 0 ? 120 : failed, color: '#EF4444' }
    ]
  }, [payments, todayFormatted])

  // Today's Checkins list (Attendance Strip)
  const activeCleanersList = useMemo(() => {
    const todayAtt = attendance.filter(a => a.date === todayFormatted && (a.status === 'present' || a.status === 'late'))
    return todayAtt.map(att => {
      const c = cleaners.find(cl => cl.id === att.cleanerId)
      return {
        id: att.cleanerId,
        name: att.cleanerName,
        checkIn: att.checkIn,
        status: att.status,
        initials: att.cleanerName.split(' ').map(x => x[0]).join('')
      }
    })
  }, [attendance, cleaners, todayFormatted])

  // Recent 10 washes
  const recentWashesList = useMemo(() => {
    return washes.slice(0, 10)
  }, [washes])

  // Complete a mock wash instantly from operations board
  const triggerCompleteWash = (washId: string) => {
    if (window.confirm('Simulate on-site camera upload and complete this wash?')) {
      const washImage = `https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=60`
      completeWash(washId, washImage)
      setSelectedWashId(null)
    }
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Operations Command Center</h1>
          <p className="text-text-muted text-xs font-sans font-light mt-1">Real-time telemetry and management across SparkleDrop locations</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => navigate('/admin/washes')}
            className="h-10 rounded-xl bg-surface border border-border-subtle hover:border-primary/50 text-slate-200 text-xs px-4 font-semibold flex items-center gap-1.5 transition-all"
          >
            Live Wash Tracking <ArrowRight size={14} className="text-primary" />
          </button>
        </div>
      </div>

      {/* STATS ROW (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Today's Washes */}
        <div className="glass-panel p-5 rounded-2xl border border-border-subtle flex items-center justify-between relative overflow-hidden group">
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 font-sans text-xs">Today's Washes</span>
            <span className="font-mono text-2xl font-bold text-white leading-none mt-1">
              {stats.todayWashesCount}
            </span>
            <div className="flex items-center gap-1.5 mt-3 text-[10px] font-mono">
              {stats.washTrend >= 0 ? (
                <span className="text-primary flex items-center gap-0.5">
                  <TrendingUp size={12} /> +{stats.washTrend}%
                </span>
              ) : (
                <span className="text-rose-500 flex items-center gap-0.5">
                  <TrendingDown size={12} /> {stats.washTrend}%
                </span>
              )}
              <span className="text-slate-600">vs yesterday</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Car size={18} />
          </div>
        </div>

        {/* Card 2: Active Cleaners */}
        <div className="glass-panel p-5 rounded-2xl border border-border-subtle flex items-center justify-between relative overflow-hidden group">
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 font-sans text-xs">Active Cleaners</span>
            <span className="font-mono text-2xl font-bold text-white leading-none mt-1">
              {stats.activeCleaners} <span className="text-slate-500 text-sm">/ {stats.totalCleaners}</span>
            </span>
            <div className="flex items-center gap-1.5 mt-3 text-[10px] font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Cleaners checked in today</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
            <Users size={18} />
          </div>
        </div>

        {/* Card 3: Pending Payments */}
        <div className="glass-panel p-5 rounded-2xl border border-border-subtle flex items-center justify-between relative overflow-hidden group">
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 font-sans text-xs">Outstanding Invoices</span>
            <span className="font-mono text-2xl font-bold text-white leading-none mt-1">
              ₹{stats.pendingPayments.toLocaleString()}
            </span>
            <div className="flex items-center gap-1.5 mt-3 text-[10px] font-mono text-slate-500">
              <span className="text-amber-500">Awaiting validation</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Coins size={18} />
          </div>
        </div>

        {/* Card 4: Customer Satisfaction */}
        <div className="glass-panel p-5 rounded-2xl border border-border-subtle flex items-center justify-between relative overflow-hidden group">
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 font-sans text-xs">Satisfaction Index</span>
            <span className="font-mono text-2xl font-bold text-white leading-none mt-1">
              {stats.satisfaction} <span className="text-slate-500 text-sm">/ 5.0</span>
            </span>
            <div className="flex items-center gap-0.5 mt-3 text-[10px] text-primary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill={i < Math.floor(stats.satisfaction) ? 'currentColor' : 'none'} />
              ))}
              <span className="text-slate-600 font-mono ml-1.5">recent reviews</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Star size={18} />
          </div>
        </div>

      </div>

      {/* Today's Attendance Strip */}
      <div className="glass-panel border border-border-subtle rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-slate-300 font-semibold font-sans text-xs">Checked-In Cleaning Crew</span>
          <span className="text-[10px] text-slate-500 font-sans font-light mt-0.5">{activeCleanersList.length} cleaners currently active on-site</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {activeCleanersList.length === 0 ? (
            <span className="text-xs font-mono text-slate-600 italic">No cleaner check-ins registered today</span>
          ) : (
            activeCleanersList.map(cleaner => (
              <div 
                key={cleaner.id}
                onClick={() => navigate(`/admin/cleaners?id=${cleaner.id}`)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-surface border border-border-subtle hover:border-slate-600 transition-colors cursor-pointer"
                title={`Checked in at ${cleaner.checkIn}`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary/30 to-secondary/30 text-white font-bold text-[9px] flex items-center justify-center border border-border-subtle">
                  {cleaner.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-200 leading-none">{cleaner.name.split(' ')[0]}</span>
                  <span className="text-[8px] font-mono text-slate-500 mt-0.5">{cleaner.checkIn}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CHARTS LAYER (Area Chart + Pie Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Wash Activity Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-border-subtle flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-300">Wash Volume Trend</span>
              <span className="text-[10px] text-slate-500 font-sans font-light mt-0.5">Daily completed washes over the last 14 days</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono text-[9px] uppercase">
              14-Day View
            </span>
          </div>

          <div className="h-64 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C896" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00C896" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#1F2937" tick={{ fill: '#6B7280' }} />
                <YAxis stroke="#1F2937" tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '12px', color: '#F9FAFB' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="washes" stroke="#00C896" strokeWidth={2} fillOpacity={1} fill="url(#colorWash)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Snapshot Pie Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-border-subtle flex flex-col justify-between">
          <div className="flex flex-col mb-4">
            <span className="text-xs font-semibold text-slate-300">Today's Settlements</span>
            <span className="text-[10px] text-slate-500 font-sans font-light mt-0.5">Revenue collection ledger allocation</span>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2 mt-4 font-sans text-xs">
            {pieData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-border-subtle/40 pb-1.5 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                  <span>{data.name}</span>
                </div>
                <span className="font-mono text-slate-200 font-bold">₹{data.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RECENT WASHES TABLE */}
      <div className="glass-panel rounded-2xl border border-border-subtle overflow-hidden flex flex-col">
        <div className="p-5 border-b border-border-subtle flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-300">Live Activity Feed</span>
            <span className="text-[10px] text-slate-500 font-sans font-light mt-0.5">Real-time status updates of washes across gated flats</span>
          </div>
          <button 
            onClick={() => navigate('/admin/washes')}
            className="text-[10px] font-semibold text-primary hover:underline"
          >
            Manage All Washes
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="bg-[#111827]/40 border-b border-border-subtle text-slate-500 font-mono text-[10px] uppercase">
                <th className="py-3.5 px-5">Customer / Flat</th>
                <th className="py-3.5 px-5">Cleaner Assigned</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Started Time</th>
                <th className="py-3.5 px-5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentWashesList.map((wash) => (
                <tr 
                  key={wash.id}
                  onClick={() => setSelectedWashId(wash.id)}
                  className="border-b border-border-subtle/50 hover:bg-slate-800/10 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-200">{wash.customerName}</span>
                      <span className="text-[10px] text-slate-500 font-light mt-0.5">{wash.locationName} &middot; Flat {wash.flatNumber}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-300">
                    {wash.cleanerName}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                      wash.status === 'completed' ? 'bg-primary/10 border-primary/20 text-primary' :
                      wash.status === 'in_progress' ? 'bg-secondary/10 border-secondary/20 text-secondary' :
                      wash.status === 'scheduled' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                      'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    }`}>
                      {wash.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-400 font-mono text-[10px]">
                    {new Date(wash.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-200">
                    ₹{wash.paymentAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WASH DETAIL SLIDE OUT PANEL */}
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
                  <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-wider">Wash Details</span>
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
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Current Status</span>
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
                    <div className="absolute bottom-2 left-2 bg-[#0F0F0F]/80 backdrop-blur px-2.5 py-1 rounded border border-border-subtle/80 flex items-center gap-1.5 text-[9px] font-mono text-primary">
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
                <button 
                  onClick={() => triggerCompleteWash(selectedWash.id)}
                  className="flex-1 h-11 bg-primary hover:bg-primary/80 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera size={14} /> Simulate Finish
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

    </div>
  )
}
