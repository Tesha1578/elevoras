import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { useMockStore } from '../../stores/mockStore'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentAdmin = useMockStore(state => state.currentAdmin)
  
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Route Auth Guard
  useEffect(() => {
    if (!currentAdmin) {
      navigate('/login')
    }
  }, [currentAdmin, navigate])

  if (!currentAdmin) {
    return null
  }

  return (
    <div className="dark flex h-screen bg-bg-deep text-text-primary font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR navigation */}
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* RIGHT MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* TOP HEADER */}
        <TopBar 
          setMobileOpen={setMobileOpen} 
          mobileOpen={mobileOpen}
        />

        {/* PAGE CONTENT scrollable container */}
        <main className="flex-1 overflow-y-auto bg-bg-deep relative">
          {/* BMW Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] overflow-hidden">
            <img 
              src="/bmw-headlights.png" 
              alt="BMW Backdrop" 
              className="w-full h-full object-cover object-center select-none"
            />
          </div>
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  )
}
