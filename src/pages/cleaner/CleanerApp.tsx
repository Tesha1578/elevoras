import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Home, 
  ClipboardList, 
  Calendar, 
  User, 
  MapPin, 
  Camera, 
  Check, 
  Clock, 
  AlertTriangle,
  Play, 
  TrendingUp, 
  Award,
  Sparkles,
  Smartphone,
  Navigation,
  CheckCircle,
  Eye,
  Info
} from 'lucide-react'
import { useMockStore } from '../../stores/mockStore'

export default function CleanerApp() {
  const navigate = useNavigate()

  // Zustand State
  const cleaners = useMockStore(state => state.cleaners)
  const currentCleanerId = useMockStore(state => state.currentCleanerId)
  const setCurrentCleanerId = useMockStore(state => state.setCurrentCleanerId)
  const washes = useMockStore(state => state.washes)
  const attendance = useMockStore(state => state.attendance)
  const clockInCleanerWithSelfie = useMockStore(state => state.clockInCleanerWithSelfie)
  const startWash = useMockStore(state => state.startWash)
  const completeWash = useMockStore(state => state.completeWash)
  const failWash = useMockStore(state => state.failWash)

  // Current logged in cleaner profile
  const cleaner = cleaners.find(c => c.id === currentCleanerId) || cleaners[0]

  // View tab navigation: 'dashboard' | 'jobs' | 'history' | 'profile'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'history' | 'profile'>('dashboard')

  // UI Flow States
  const [showSelfieCheckIn, setShowSelfieCheckIn] = useState(false)
  const [selfieCaptured, setSelfieCaptured] = useState<string | null>(null)
  
  // Camera simulation state for capturing wash proof image
  const [activeCameraJobId, setActiveCameraJobId] = useState<string | null>(null)
  const [cameraFlash, setCameraFlash] = useState(false)

  // Active Job Detail states
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [washChecklist, setWashChecklist] = useState<Record<string, boolean>>({
    rinse: false,
    foam: false,
    wheels: false,
    dry: false
  })

  // Check if attendance checked-in for today
  const todayStr = new Date().toISOString().split('T')[0]
  const todayAttendance = attendance.find(a => a.cleanerId === cleaner.id && a.date === todayStr)

  // Jobs assigned to this cleaner
  const cleanerWashes = washes.filter(w => w.cleanerId === cleaner.id)
  const pendingJobs = cleanerWashes.filter(w => w.status === 'scheduled')
  const inProgressJob = cleanerWashes.find(w => w.status === 'in_progress')
  const completedJobsToday = cleanerWashes.filter(w => w.status === 'completed')

  // Live timer for active in-progress job
  const [timerText, setTimerText] = useState('00:00')
  useEffect(() => {
    let interval: any
    if (inProgressJob) {
      const startTime = new Date(inProgressJob.startTime).getTime()
      interval = setInterval(() => {
        const diff = Math.max(0, Date.now() - startTime)
        const min = String(Math.floor(diff / 60000)).padStart(2, '0')
        const sec = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
        setTimerText(`${min}:${sec}`)
      }, 1000)
    } else {
      setTimerText('00:00')
    }
    return () => clearInterval(interval)
  }, [inProgressJob])

  // Handle Attendance Selfie Confirmation
  const handleCheckIn = () => {
    setSelfieCaptured('📸 Selfie Verified')
    setTimeout(() => {
      clockInCleanerWithSelfie(cleaner.id, 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120')
      setShowSelfieCheckIn(false)
      setSelfieCaptured(null)
    }, 1200)
  }

  // Handle checklist clicks
  const toggleChecklist = (key: string) => {
    setWashChecklist(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Simulated Camera Snapshot for completing a wash
  const handleCameraSnap = () => {
    setCameraFlash(true)
    setTimeout(() => {
      setCameraFlash(false)
      if (activeCameraJobId) {
        completeWash(activeCameraJobId, '/bmw-headlights.png')
        setActiveCameraJobId(null)
        setWashChecklist({ rinse: false, foam: false, wheels: false, dry: false })
      }
    }, 500)
  }

  return (
    <div className="flex flex-col justify-center items-center py-8 min-h-screen bg-[#070708] px-4">
      
      {/* Device mock switcher header */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xs text-text-muted font-sans select-none">Active Cleaner:</span>
        <select 
          value={cleaner.id} 
          onChange={(e) => setCurrentCleanerId(e.target.value)}
          className="h-8 rounded-lg bg-surface border border-border-subtle px-2 text-xs font-semibold focus:outline-none focus:border-primary text-text-primary"
        >
          {cleaners.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.employeeId})</option>
          ))}
        </select>
      </div>

      {/* RUGGED INDUSTRIAL SMARTPHONE SHELL */}
      <div className="relative w-[375px] h-[812px] bg-[#0A0A0B] rounded-[48px] border-[12px] border-[#222227] shadow-[0_0_80px_rgba(255,87,34,0.18)] overflow-hidden flex flex-col text-text-primary">
        
        {/* Device Notch / Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[110px] h-[26px] bg-black rounded-full z-[100] flex items-center justify-center">
          <div className="w-[10px] h-[10px] bg-[#1c1c1e] rounded-full absolute right-3" />
        </div>

        {/* Device Status Bar */}
        <div className="h-10 px-6 flex items-center justify-between text-text-primary text-[11px] font-semibold bg-black z-50 select-none font-mono">
          <span>09:41</span>
          <div className="flex items-center gap-1">
            <span className="text-success">98%</span>
            <div className="w-[20px] h-[10px] border border-text-primary rounded-sm p-[1px] flex">
              <div className="h-full w-[95%] bg-success rounded-2xs" />
            </div>
          </div>
        </div>

        {/* INNER SCREEN CONTAINER (SCROLLABLE VIEWPORT) */}
        <div className="flex-1 flex flex-col overflow-y-auto pb-16 relative bg-[#0D0D0E] scrollbar-none">
          
          {/* HEADER ROW */}
          <div className="p-5 flex justify-between items-center z-10 border-b border-border-subtle bg-[#0D0D0E]/60 backdrop-blurSticky sticky top-0">
            <div>
              <span className="text-[10px] font-mono text-primary font-bold tracking-widest uppercase">ELEVORAS OPERATIONS</span>
              <h1 className="text-base font-bold font-sans tracking-tight leading-none text-text-primary">{cleaner.name}</h1>
              <p className="text-[10px] text-text-muted font-sans mt-0.5">ID: {cleaner.employeeId} · Shift: {todayAttendance ? 'ACTIVE' : 'STANDBY'}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3.5 h-3.5 rounded-full ${todayAttendance ? 'bg-success animate-pulse' : 'bg-text-muted'}`} />
            </div>
          </div>

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="p-5 flex flex-col gap-5">
              
              {/* ATTENDANCE CHECK-IN STRIP */}
              {!todayAttendance ? (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-surface border border-primary/30 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <MapPin size={18} className="text-primary" />
                    <div>
                      <span className="text-xs font-bold block text-text-primary">Shift Attendance Required</span>
                      <span className="text-[9px] text-text-muted block">Verify selfie inside complex geofence.</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowSelfieCheckIn(true)}
                    className="h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Play size={12} /> Check-In shift
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-success/15 border border-success/30 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={18} className="text-success" />
                    <div>
                      <span className="text-xs font-bold block text-text-primary">Checked In Today</span>
                      <span className="text-[9px] text-text-muted block">Shift started at {todayAttendance.checkIn}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">Duty</span>
                </div>
              )}

              {/* METRICS ROW */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 bg-surface border border-border-subtle rounded-xl flex flex-col">
                  <span className="text-[8px] text-text-muted font-bold uppercase">TODAY'S WASh</span>
                  <span className="text-sm font-mono font-bold text-text-primary mt-1">{completedJobsToday.length} / {cleanerWashes.length}</span>
                </div>
                <div className="p-3 bg-surface border border-border-subtle rounded-xl flex flex-col">
                  <span className="text-[8px] text-text-muted font-bold uppercase">EARNINGS</span>
                  <span className="text-sm font-mono font-bold text-success mt-1">₹{completedJobsToday.length * 60}</span>
                </div>
                <div className="p-3 bg-surface border border-border-subtle rounded-xl flex flex-col">
                  <span className="text-[8px] text-text-muted font-bold uppercase">EFFICIENCY</span>
                  <span className="text-sm font-mono font-bold text-primary mt-1">94%</span>
                </div>
              </div>

              {/* NEXT PRIORITY WASH JOB */}
              {todayAttendance && (
                <div>
                  <span className="text-[10px] font-mono text-text-muted uppercase">ACTIVE WASH JOB</span>
                  {inProgressJob ? (
                    <div className="p-4 bg-gradient-to-br from-primary/10 to-surface border border-primary/30 rounded-2xl flex flex-col gap-4 mt-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-base font-bold text-text-primary leading-none uppercase">{inProgressJob.vehicleNumber}</h3>
                          <p className="text-[10px] text-text-muted font-sans mt-0.5">Flat {inProgressJob.flatNumber} · {inProgressJob.customerName}</p>
                        </div>
                        <span className="text-sm font-mono text-primary font-bold tracking-wider">{timerText}</span>
                      </div>

                      {/* Checklist */}
                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(washChecklist).map((key) => (
                          <button
                            key={key}
                            onClick={() => toggleChecklist(key)}
                            className={`h-9 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              washChecklist[key] ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-surface border border-border-subtle text-text-muted'
                            }`}
                          >
                            <Check size={11} className={washChecklist[key] ? 'opacity-100' : 'opacity-30'} />
                            {key.toUpperCase()}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => setActiveCameraJobId(inProgressJob.id)}
                        disabled={!Object.values(washChecklist).every(Boolean)}
                        className={`h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          Object.values(washChecklist).every(Boolean)
                            ? 'bg-success text-white'
                            : 'bg-border-subtle text-text-muted cursor-not-allowed'
                        }`}
                      >
                        <Camera size={14} /> Capture Complete Proof
                      </button>
                    </div>
                  ) : pendingJobs.length > 0 ? (
                    <div className="p-4 bg-surface border border-border-subtle rounded-2xl flex flex-col gap-3.5 mt-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-bold text-text-primary leading-none uppercase">{pendingJobs[0].vehicleNumber}</h3>
                          <p className="text-[9px] text-text-muted font-sans mt-0.5">Flat {pendingJobs[0].flatNumber} · {pendingJobs[0].customerName}</p>
                        </div>
                        <span className="text-[9px] text-primary font-bold">NEXT IN QUEUE</span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => startWash(pendingJobs[0].id)}
                          className="flex-1 h-9 rounded-xl bg-primary text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Play size={10} /> Start Wash
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-surface border border-border-subtle flex flex-col items-center justify-center text-center gap-2 mt-2 py-6">
                      <CheckCircle size={28} className="text-success" />
                      <p className="text-xs font-semibold text-text-primary">All wash jobs completed!</p>
                      <p className="text-[9px] text-text-muted font-sans">You have cleared today's assigned flats checklist.</p>
                    </div>
                  )}
                </div>
              )}

              {/* RATING SCORECARD */}
              <div>
                <span className="text-[10px] font-mono text-text-muted uppercase">CUSTOMER SERVICE RATINGS</span>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="p-3 bg-surface border border-border-subtle rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold block text-text-primary">Monthly Rating Average</span>
                      <span className="text-[9px] text-text-muted">Target bonus milestone is ⭐ 4.5+</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-primary text-sm font-mono font-bold">
                      ⭐ 4.8
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: JOBS QUEUE */}
          {activeTab === 'jobs' && (
            <div className="p-5 flex flex-col gap-3.5">
              <h2 className="text-lg font-heading font-extrabold uppercase">Wash Queue</h2>
              
              <div className="flex flex-col gap-2">
                {cleanerWashes.map(w => (
                  <div key={w.id} className="p-3 bg-surface border border-border-subtle rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-text-primary block uppercase">{w.vehicleNumber}</span>
                      <span className="text-[9px] text-text-muted">Flat {w.flatNumber} · {w.customerName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                        w.status === 'completed' ? 'bg-success/10 text-success border border-success/20' :
                        w.status === 'in_progress' ? 'bg-primary/10 text-primary border border-primary/20 animate-pulse' :
                        'bg-border-subtle/50 text-text-muted'
                      }`}>
                        {w.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE HISTORY */}
          {activeTab === 'history' && (
            <div className="p-5 flex flex-col gap-4">
              <h2 className="text-lg font-heading font-extrabold uppercase">Earnings & Attendance</h2>
              
              <div className="p-4 bg-gradient-to-br from-success/20 to-surface border border-success/30 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-text-muted font-mono uppercase">ESTIMATED INCENTIVE BONUS</span>
                  <h3 className="text-xl font-heading font-extrabold text-success mt-0.5">₹4,200.00</h3>
                  <p className="text-[9px] text-text-muted font-sans">Includes rating averages bonus logs.</p>
                </div>
                <Award size={28} className="text-success" />
              </div>

              {/* Shift log */}
              <div>
                <span className="text-[10px] font-mono text-text-muted uppercase">SHIFT ATTENDANCE logs</span>
                <div className="flex flex-col gap-2 mt-2">
                  {attendance.filter(a => a.cleanerId === cleaner.id).slice(0, 4).map(a => (
                    <div key={a.id} className="p-3 bg-surface border border-border-subtle rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-text-primary block">{new Date(a.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span className="text-[9px] text-text-muted">In: {a.checkIn} {a.checkOut ? `· Out: ${a.checkOut}` : ''}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                        a.status === 'present' ? 'bg-success/10 text-success border border-success/20' : 'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-5 flex flex-col gap-4">
              <h2 className="text-lg font-heading font-extrabold uppercase">Settings</h2>

              <div className="p-4 bg-surface border border-border-subtle rounded-2xl flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center text-primary font-bold text-lg">
                    {cleaner.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary leading-none">{cleaner.name}</h3>
                    <p className="text-[10px] text-text-muted font-sans mt-1">ID: {cleaner.employeeId}</p>
                  </div>
                </div>
                <hr className="border-border-subtle" />
                <div className="flex flex-col gap-2 text-[10px] text-text-muted font-sans">
                  <span className="flex justify-between"><span>Assigned complex:</span> <span className="font-bold text-text-primary">DLF Gardencity</span></span>
                  <span className="flex justify-between"><span>Active flat count:</span> <span className="font-bold text-text-primary">{cleaner.assignedFlatCount} flats</span></span>
                  <span className="flex justify-between"><span>Contact mobile:</span> <span className="font-bold text-text-primary">{cleaner.mobile}</span></span>
                </div>
              </div>

              <div className="p-4 bg-surface border border-border-subtle rounded-xl flex flex-col gap-2">
                <h3 className="text-xs font-bold text-text-primary">Report supply low</h3>
                <p className="text-[9px] text-text-muted font-sans">Request microfiber, foam shampoo, or water canister refill.</p>
                <button 
                  onClick={() => alert('Restock request submitted to administrator')}
                  className="h-8 rounded bg-border-subtle text-text-primary font-bold text-[10px] flex items-center justify-center cursor-pointer mt-1"
                >
                  Request Restock
                </button>
              </div>
            </div>
          )}

        </div>

        {/* OVERLAY: SHIFT SELFIE CHECK-IN */}
        {showSelfieCheckIn && (
          <div className="absolute inset-0 bg-black/90 z-[110] flex flex-col items-center justify-center p-6">
            <div className="w-full bg-surface border border-border-subtle rounded-3xl p-5 flex flex-col gap-4 animate-zoom-in">
              <h3 className="text-xs font-heading font-extrabold uppercase text-center">Clock-In Biometric Selfie</h3>
              
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-border-subtle bg-black flex items-center justify-center">
                {selfieCaptured ? (
                  <div className="text-center flex flex-col items-center gap-2">
                    <CheckCircle size={32} className="text-success animate-bounce" />
                    <span className="text-xs font-bold text-success">{selfieCaptured}</span>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-4 border border-dashed border-primary/50 rounded-full animate-pulse-subtle pointer-events-none" />
                    <div className="w-16 h-16 bg-[#1f1f23] rounded-full flex items-center justify-center text-text-muted">
                      <User size={32} />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setShowSelfieCheckIn(false)}
                  className="flex-1 h-10 rounded-xl border border-border-subtle text-text-primary font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCheckIn}
                  className="flex-1 h-10 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer"
                >
                  Verify selfie
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OVERLAY: CAMERA VIEW VIEWPORT FOR PROOF CAPTURE */}
        {activeCameraJobId && (
          <div className="absolute inset-0 bg-black z-[120] flex flex-col">
            
            {/* Viewfinder header */}
            <div className="h-14 px-6 flex items-center justify-between text-xs font-sans text-white bg-black/60 sticky top-0 z-10">
              <span className="font-bold">ELEVORAS CAMERA API</span>
              <span className="font-mono text-[9px]">TAG: GPS:{cleaner.employeeId}</span>
            </div>

            {/* Viewfinder frame */}
            <div className="flex-1 bg-neutral-900 relative flex items-center justify-center overflow-hidden">
              <img 
                src="/bmw-headlights.png" 
                alt="Camera View" 
                className="w-full h-full object-cover" 
              />
              
              {/* Grid guide */}
              <div className="absolute inset-0 border-[2px] border-primary/30 pointer-events-none flex flex-col justify-between p-12">
                <div className="flex justify-between"><div className="w-4 h-4 border-t-2 border-l-2 border-primary" /><div className="w-4 h-4 border-t-2 border-r-2 border-primary" /></div>
                <div className="flex justify-between"><div className="w-4 h-4 border-b-2 border-l-2 border-primary" /><div className="w-4 h-4 border-b-2 border-r-2 border-primary" /></div>
              </div>

              {/* Watermark badge */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-2.5 py-1 rounded text-[8px] font-mono text-white border border-white/10 flex flex-col gap-0.5 select-none">
                <span>PLATE: {cleanerWashes.find(w => w.id === activeCameraJobId)?.vehicleNumber}</span>
                <span>GPS: 12.9716° N, 77.5946° E</span>
                <span>TIME: {new Date().toLocaleTimeString()}</span>
              </div>

              {/* Flash effect overlay */}
              {cameraFlash && <div className="absolute inset-0 bg-white z-50 animate-flash" />}
            </div>

            {/* Action footer */}
            <div className="h-24 bg-black flex items-center justify-around px-6">
              <button 
                onClick={() => setActiveCameraJobId(null)}
                className="text-xs text-white font-sans font-semibold cursor-pointer"
              >
                Cancel
              </button>
              
              <button 
                onClick={handleCameraSnap}
                className="w-16 h-16 rounded-full bg-white border-[4px] border-neutral-800 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-white border-2 border-black" />
              </button>

              <span className="w-8" />
            </div>
          </div>
        )}

        {/* DEVICE BOTTOM BOTTOM BAR GESTURE NAV */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-[#0D0D0E] border-t border-border-subtle flex justify-around items-center px-4 select-none z-50">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'dashboard' ? 'text-primary' : 'text-text-muted'}`}
          >
            <Home size={16} />
            <span className="text-[9px] font-sans font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'jobs' ? 'text-primary' : 'text-text-muted'}`}
          >
            <ClipboardList size={16} />
            <span className="text-[9px] font-sans font-medium">Washes</span>
          </button>

          <button 
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'history' ? 'text-primary' : 'text-text-muted'}`}
          >
            <Calendar size={16} />
            <span className="text-[9px] font-sans font-medium">Shift Log</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'profile' ? 'text-primary' : 'text-text-muted'}`}
          >
            <User size={16} />
            <span className="text-[9px] font-sans font-medium">Profile</span>
          </button>
        </div>

        {/* Phone Bottom Home Gesture indicator bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-[#3f3f46] rounded-full z-50 pointer-events-none" />

      </div>

    </div>
  )
}
