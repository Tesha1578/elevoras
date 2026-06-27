import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Layout from './components/layout/Layout'
import Dashboard from './pages/admin/Dashboard'
import Customers from './pages/admin/Customers'
import Cleaners from './pages/admin/Cleaners'
import Flats from './pages/admin/Flats'
import WashTracking from './pages/admin/WashTracking'
import Attendance from './pages/admin/Attendance'
import Payments from './pages/admin/Payments'
import Reviews from './pages/admin/Reviews'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'

import { useMockStore } from './stores/mockStore'

export default function App() {
  const theme = useMockStore(state => state.theme)

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen bg-bg-deep text-text-primary transition-colors duration-300`}>
      <BrowserRouter>
        <Routes>
        {/* Marketing Portal root */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth gateway */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Command Center */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="cleaners" element={<Cleaners />} />
          <Route path="flats" element={<Flats />} />
          <Route path="washes" element={<WashTracking />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}
