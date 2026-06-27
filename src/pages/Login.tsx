import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react'
import { useMockStore } from '../stores/mockStore'

export default function Login() {
  const navigate = useNavigate()
  const login = useMockStore(state => state.login)
  const currentAdmin = useMockStore(state => state.currentAdmin)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (currentAdmin) {
      navigate('/admin')
    }
  }, [currentAdmin, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const success = login(email, password)
      setLoading(false)
      if (success) {
        navigate('/admin')
      } else {
        setError('Invalid admin credentials. Hint: use the demo autocomplete!')
      }
    }, 800)
  }

  const fillDemoCredentials = () => {
    setEmail('admin@axoweb.in')
    setPassword('admin123')
    setError('')
  }

  return (
    <div className="dark min-h-screen w-full bg-bg-deep text-text-primary flex flex-col justify-center items-center p-6 relative">
      {/* Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] radial-blob-red rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] radial-blob-dark rounded-full pointer-events-none" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 group mb-6"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-heading font-bold text-xl shadow-lg">
              E
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">
              Elevoras
            </span>
          </button>
          <h2 className="font-heading font-bold text-2xl text-white">Welcome Back</h2>
          <p className="text-text-muted text-xs font-sans mt-1">
            Access the car wash operations command center
          </p>
        </div>

        <div className="glass-panel border border-border-subtle/80 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm font-sans">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                <Mail size={12} className="text-slate-500" /> Admin Email
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@axoweb.in" 
                className="h-11 rounded-xl bg-surface border border-border-subtle px-4 text-white focus:outline-none focus:border-primary placeholder:text-slate-600 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                <Lock size={12} className="text-slate-500" /> Password
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="h-11 rounded-xl bg-surface border border-border-subtle px-4 text-white focus:outline-none focus:border-primary placeholder:text-slate-600 transition-colors"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="h-11 rounded-xl bg-primary hover:bg-primary/80 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Assist */}
          <div className="mt-8 pt-6 border-t border-border-subtle flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <ShieldCheck size={14} className="text-secondary" />
              <span>Developer Demonstration Sandbox</span>
            </div>
            
            <button 
              onClick={fillDemoCredentials}
              className="h-11 rounded-xl border border-secondary/30 hover:border-secondary hover:bg-secondary/5 text-secondary font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Quick Demo Sign-In
            </button>
          </div>
        </div>

        <button 
          onClick={() => navigate('/')} 
          className="mt-6 text-xs text-slate-500 hover:text-primary transition-colors text-center w-full block font-mono"
        >
          &larr; Back to Marketing Website
        </button>
      </div>
    </div>
  )
}
