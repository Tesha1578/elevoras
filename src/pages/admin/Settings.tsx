import React, { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Coins, 
  Bell, 
  Users, 
  ShieldCheck, 
  RotateCw, 
  Save, 
  Check, 
  Plus, 
  Trash2,
  Lock,
  Globe,
  Clock
} from 'lucide-react'
import { useMockStore } from '../../stores/mockStore'

export default function Settings() {
  const settings = useMockStore(state => state.settings)
  const updateSettings = useMockStore(state => state.updateSettings)

  // Settings form states
  const [formData, setFormData] = useState({
    businessName: settings.businessName,
    defaultCheckInTime: settings.defaultCheckInTime,
    defaultLateThreshold: settings.defaultLateThreshold,
    gatewayMode: settings.gatewayMode,
    emailNotificationsEnabled: settings.emailNotificationsEnabled,
    smsNotificationsEnabled: settings.smsNotificationsEnabled
  })

  // Admin users list mock
  const [admins, setAdmins] = useState([
    { name: 'AXOWEB Operator', email: 'admin@axoweb.in', role: 'Super Admin' },
    { name: 'SparkleDrop Manager', email: 'manager@sparkledrop.in', role: 'Manager' },
    { name: 'Gated Supervisor', email: 'supervisor@prestige.in', role: 'Viewer' }
  ])

  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Manager' })
  const [showAddAdmin, setShowAddAdmin] = useState(false)

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(formData)
    alert('System settings configuration committed and deployed successfully!')
  }

  // Add new admin mock
  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdmin.name || !newAdmin.email) return
    setAdmins([...admins, newAdmin])
    setNewAdmin({ name: '', email: '', role: 'Manager' })
    setShowAddAdmin(false)
    alert('New administrator authorized access credential.')
  }

  const handleDeleteAdmin = (email: string) => {
    if (email === 'admin@axoweb.in') {
      alert('Cannot delete primary developer Super Admin!')
      return
    }
    if (window.confirm(`Revoke dashboard access for ${email}?`)) {
      setAdmins(admins.filter(a => a.email !== email))
      alert('Administrator credential revoked.')
    }
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* Header title */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">System Settings</h1>
        <p className="text-text-muted text-xs font-sans font-light mt-1">Configure operational hours, webhook API endpoints, and supervisor roles</p>
      </div>

      {/* THREE SECTION GRID LAYOUT */}
      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-xs items-start">
        
        {/* Col 1: General & Shift */}
        <div className="flex flex-col gap-6">
          
          {/* General business profile */}
          <div className="glass-panel p-5 rounded-2xl border border-border-subtle flex flex-col gap-4">
            <h3 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2 border-b border-border-subtle pb-2">
              <Globe size={16} className="text-primary" /> Business Profile
            </h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-semibold">Corporate Business Name</label>
              <input 
                type="text" 
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-semibold">Base Currency</label>
                <input 
                  type="text" 
                  disabled
                  value="INR (₹)"
                  className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-slate-500 cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-semibold">Default Timezone</label>
                <input 
                  type="text" 
                  disabled
                  value="Asia/Kolkata"
                  className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Operating hours */}
          <div className="glass-panel p-5 rounded-2xl border border-border-subtle flex flex-col gap-4">
            <h3 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2 border-b border-border-subtle pb-2">
              <Clock size={16} className="text-secondary" /> Operating Hours
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-semibold">Shift Start Clock</label>
                <input 
                  type="text" 
                  value={formData.defaultCheckInTime}
                  onChange={(e) => setFormData({ ...formData, defaultCheckInTime: e.target.value })}
                  placeholder="07:30 AM"
                  className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-primary font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-semibold">Late Check-in Limit</label>
                <input 
                  type="text" 
                  value={formData.defaultLateThreshold}
                  onChange={(e) => setFormData({ ...formData, defaultLateThreshold: e.target.value })}
                  placeholder="09:30 AM"
                  className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-sans font-light leading-relaxed">
              * Logins registered past late limit trigger push alerts to supervisors.
            </p>
          </div>

        </div>

        {/* Col 2: Payments & Notifications */}
        <div className="flex flex-col gap-6">
          
          {/* Payment gateway config */}
          <div className="glass-panel p-5 rounded-2xl border border-border-subtle flex flex-col gap-4">
            <h3 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2 border-b border-border-subtle pb-2">
              <Coins size={16} className="text-primary" /> Gateway Configurations
            </h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-semibold">Gateway Processing Mode</label>
              <select 
                value={formData.gatewayMode}
                onChange={(e) => setFormData({ ...formData, gatewayMode: e.target.value as 'sandbox' | 'production' })}
                className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-slate-300 focus:outline-none focus:border-primary cursor-pointer w-full"
              >
                <option value="sandbox">Sandbox Testing Environment</option>
                <option value="production">Live Production Node</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-semibold">Sandbox Webhook Endpoint</label>
              <div className="p-3 bg-surface border border-border-subtle rounded-lg text-[10px] text-slate-500 font-mono select-all overflow-x-auto">
                https://api.elevoras.in/v1/callbacks/payments
              </div>
            </div>
          </div>

          {/* Notifications toggles */}
          <div className="glass-panel p-5 rounded-2xl border border-border-subtle flex flex-col gap-4">
            <h3 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2 border-b border-border-subtle pb-2">
              <Bell size={16} className="text-secondary" /> Messaging Telemetry
            </h3>
            
            <div className="flex flex-col gap-3 font-sans text-xs">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg bg-surface/50 border border-border-subtle/50">
                <input 
                  type="checkbox" 
                  checked={formData.emailNotificationsEnabled}
                  onChange={(e) => setFormData({ ...formData, emailNotificationsEnabled: e.target.checked })}
                  className="w-4 h-4 text-primary bg-[#111827] border-border-subtle focus:ring-0 focus:ring-offset-0 rounded cursor-pointer"
                />
                <span className="text-slate-300">Authorize automated email receipts on completion</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg bg-surface/50 border border-border-subtle/50">
                <input 
                  type="checkbox" 
                  checked={formData.smsNotificationsEnabled}
                  onChange={(e) => setFormData({ ...formData, smsNotificationsEnabled: e.target.checked })}
                  className="w-4 h-4 text-primary bg-[#111827] border-border-subtle focus:ring-0 focus:ring-offset-0 rounded cursor-pointer"
                />
                <span className="text-slate-300">Trigger WhatsApp milestone push alerts (SLA integrations)</span>
              </label>
            </div>
          </div>

        </div>

        {/* Col 3: User Admin CRUD list */}
        <div className="flex flex-col gap-6">
          
          <div className="glass-panel p-5 rounded-2xl border border-border-subtle flex flex-col gap-4">
            <h3 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2 border-b border-border-subtle pb-2">
              <Users size={16} className="text-primary" /> Administrator Privileges
            </h3>
            
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {admins.map((adm) => (
                <div key={adm.email} className="p-2.5 rounded-xl bg-surface/50 border border-border-subtle flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block">{adm.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{adm.email} &middot; {adm.role}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleDeleteAdmin(adm.email)}
                    className="p-1.5 rounded bg-surface hover:bg-rose-500/10 border border-border-subtle text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {showAddAdmin ? (
              <div className="p-3.5 rounded-xl bg-surface border border-border-subtle flex flex-col gap-3 font-sans text-xs mt-2">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold text-[10px] uppercase font-mono">Supervisor Name</label>
                  <input 
                    type="text" 
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    placeholder="Vijay R."
                    className="h-9 rounded bg-[#0A0F1E] border border-border-subtle px-3 text-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold text-[10px] uppercase font-mono">Email Address</label>
                  <input 
                    type="email" 
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    placeholder="vijay@sparkledrop.in"
                    className="h-9 rounded bg-[#0A0F1E] border border-border-subtle px-3 text-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold text-[10px] uppercase font-mono">Privilege Role</label>
                  <select 
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                    className="h-9 rounded bg-[#0A0F1E] border border-border-subtle px-3 text-slate-300 focus:outline-none cursor-pointer w-full text-xs"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Viewer">Viewer (Read-only)</option>
                  </select>
                </div>

                <div className="flex gap-2 mt-1">
                  <button 
                    type="button"
                    onClick={handleAddAdmin}
                    className="flex-1 h-9 bg-primary text-[#0A0F1E] font-bold rounded-lg cursor-pointer"
                  >
                    Authorize
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddAdmin(false)}
                    className="flex-1 h-9 border border-border-subtle text-slate-300 rounded-lg hover:bg-slate-800/40 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => setShowAddAdmin(true)}
                className="w-full h-10 border border-primary text-primary hover:bg-primary/5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={14} /> Authorize Administrator Access
              </button>
            )}

          </div>

          {/* Master Save Button */}
          <button 
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/80 text-[#0A0F1E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20 transition-colors cursor-pointer"
          >
            <Save size={16} /> Deploy & Commit Configurations
          </button>

        </div>

      </form>

    </div>
  )
}
