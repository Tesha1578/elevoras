import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Sparkles, 
  MapPin, 
  Layers, 
  CalendarDays, 
  Coins, 
  Star, 
  FilePieChart, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Car
} from 'lucide-react'
import { useMockStore } from '../../stores/mockStore'

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (c: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (o: boolean) => void
}

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const location = useLocation()
  const logout = useMockStore(state => state.logout)
  const currentAdmin = useMockStore(state => state.currentAdmin)

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Customers', path: '/admin/customers', icon: <Users size={18} /> },
    { label: 'Cleaners', path: '/admin/cleaners', icon: <Sparkles size={18} /> },
    { label: 'Flats & Locations', path: '/admin/flats', icon: <Layers size={18} /> },
    { label: 'Wash Tracking', path: '/admin/washes', icon: <Car size={18} /> },
    { label: 'Attendance', path: '/admin/attendance', icon: <CalendarDays size={18} /> },
    { label: 'Payments', path: '/admin/payments', icon: <Coins size={18} /> },
    { label: 'Reviews', path: '/admin/reviews', icon: <Star size={18} /> },
    { label: 'Reports', path: '/admin/reports', icon: <FilePieChart size={18} /> },
    { label: 'Settings', path: '/admin/settings', icon: <SettingsIcon size={18} /> },
  ]

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of the admin panel?')) {
      logout()
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111827] border-r border-border-subtle/70">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-subtle/50">
        <Link 
          to="/admin" 
          className="flex items-center gap-2.5 overflow-hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-heading font-bold text-base shrink-0">
            E
          </div>
          {!collapsed && (
            <span className="font-heading font-bold text-lg tracking-tight text-white animate-fade-in">
              Elevoras Admin
            </span>
          )}
        </Link>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-6 h-6 rounded-md bg-surface border border-border-subtle items-center justify-center text-slate-500 hover:text-white"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3.5 h-11 px-3.5 rounded-xl text-xs font-semibold font-sans transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/10' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-border-subtle/50 flex flex-col gap-2">
        {!collapsed && currentAdmin && (
          <div className="px-2 py-1.5 rounded-xl bg-surface border border-border-subtle/30 flex flex-col">
            <span className="text-[10px] font-mono text-primary uppercase font-bold">{currentAdmin.role}</span>
            <span className="text-[11px] font-semibold truncate text-slate-200">{currentAdmin.name}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 h-11 px-3.5 w-full rounded-xl text-xs font-semibold font-sans text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Fixed side) */}
      <aside 
        className={`hidden lg:block shrink-0 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } h-screen sticky top-0`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* Mobile Sidebar (Slide-out menu) */}
      <aside 
        className={`lg:hidden fixed top-0 bottom-0 left-0 z-50 w-64 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
