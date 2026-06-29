import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Smartphone, Shield, User, Sparkles } from 'lucide-react'
import { useMockStore } from '../../stores/mockStore'

export default function SandboxOverlay() {
  const navigate = useNavigate()
  const location = useLocation()
  const washes = useMockStore(state => state.washes)
  
  const [notification, setNotification] = useState<string | null>(null)
  const [prevWashesCount, setPrevWashesCount] = useState(washes.length)

  // Live simulation event notifier: alerts the simulator across different app frames
  useEffect(() => {
    if (washes.length !== prevWashesCount) {
      const latestWash = washes[0]
      if (latestWash) {
        if (latestWash.status === 'completed') {
          setNotification(`✨ Cleaner completed wash for Flat ${latestWash.flatNumber}!`)
        } else if (latestWash.status === 'in_progress') {
          setNotification(`🚿 Cleaner started wash for Flat ${latestWash.flatNumber}!`)
        } else if (latestWash.status === 'failed') {
          setNotification(`⚠️ Wash failed for Flat ${latestWash.flatNumber}.`)
        }
      }
      setPrevWashesCount(washes.length)
      
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [washes, prevWashesCount])

  const path = location.pathname

  return (
    <>
      {/* Toast Notification for cross-device updates */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full bg-primary text-white text-xs font-semibold font-sans shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles size={14} className="animate-spin" />
          <span>{notification}</span>
        </div>
      )}

      {/* Floating Viewport Switcher */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] glass-panel p-2 py-1.5 rounded-full border border-border-subtle/80 flex items-center gap-2.5 shadow-2xl scale-95 hover:scale-100 transition-all duration-300">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold rounded-full select-none">
          SIMULATOR
        </div>
        
        <button
          onClick={() => navigate('/customer')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold font-sans transition-all cursor-pointer ${
            path.startsWith('/customer')
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <Smartphone size={13} />
          Customer Mobile
        </button>

        <button
          onClick={() => navigate('/cleaner')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold font-sans transition-all cursor-pointer ${
            path.startsWith('/cleaner')
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <Smartphone size={13} />
          Cleaner Mobile
        </button>

        <button
          onClick={() => navigate('/admin')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold font-sans transition-all cursor-pointer ${
            path.startsWith('/admin')
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <Shield size={13} />
          Admin Portal
        </button>

        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold font-sans transition-all cursor-pointer ${
            path === '/'
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <User size={13} />
          Website
        </button>
      </div>
    </>
  )
}
