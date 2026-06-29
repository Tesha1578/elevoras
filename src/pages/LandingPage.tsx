import { useState } from 'react'
import { 
  Sparkles, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Minus, 
  Mail, 
  MapPin, 
  Globe, 
  Camera, 
  CreditCard, 
  Star, 
  FileText, 
  WifiOff, 
  Menu, 
  X,
  Sun,
  Moon
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMockStore } from '../stores/mockStore'

export default function LandingPage() {
  const navigate = useNavigate()
  const currentAdmin = useMockStore(state => state.currentAdmin)
  const theme = useMockStore(state => state.theme)
  const toggleTheme = useMockStore(state => state.toggleTheme)
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Accordion state for pricing breakdown
  const [pricingOpen, setPricingOpen] = useState<string | null>(null)
  
  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    org: '',
    phone: '',
    email: '',
    message: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => {
      setFormSubmitted(false)
      setFormData({ name: '', org: '', phone: '', email: '', message: '' })
    }, 4000)
  }

  const toggleAccordion = (app: string) => {
    setPricingOpen(pricingOpen === app ? null : app)
  }

  return (
    <div className="relative min-h-screen bg-bg-deep text-text-primary font-sans overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] radial-blob-red rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] radial-blob-dark rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-20%] w-[60%] h-[60%] radial-blob-red rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] radial-blob-dark rounded-full pointer-events-none" />

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border-subtle/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-heading font-bold text-xl shadow-lg shadow-primary/20">
              E
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent group-hover:from-primary group-hover:to-white transition-all duration-300">
              Elevoras
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">How It Works</a>
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Features</a>
            <a href="#apps" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Apps</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Pricing</a>
            <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Contact</a>
            
            <span className="w-[1px] h-4 bg-border-subtle" />
            
            <button onClick={() => navigate('/customer')} className="text-sm font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer">Customer App</button>
            <button onClick={() => navigate('/cleaner')} className="text-sm font-bold text-success hover:text-success/80 transition-colors cursor-pointer">Cleaner App</button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {currentAdmin ? (
              <button 
                onClick={() => navigate('/admin')}
                className="px-5 h-11 rounded-full text-sm font-semibold border border-border-subtle hover:border-primary transition-all duration-300 text-slate-800"
              >
                Go to Dashboard
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="px-5 h-11 rounded-full text-sm font-semibold border border-border-subtle hover:border-primary transition-all duration-300 text-slate-800"
              >
                Admin Login
              </button>
            )}
            <a 
              href="#contact" 
              className="px-5 h-11 rounded-full bg-primary hover:bg-primary/80 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-300"
            >
              Get a Demo
            </a>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full border border-border-subtle hover:border-primary text-text-primary flex items-center justify-center transition-colors cursor-pointer"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-primary"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-bg-deep border-b border-border-subtle/80 flex flex-col p-6 gap-5 shadow-2xl transition-all duration-300">
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-700 hover:text-primary">How It Works</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-700 hover:text-primary">Features</a>
            <a href="#apps" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-700 hover:text-primary">Apps</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-700 hover:text-primary">Pricing</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-700 hover:text-primary">Contact</a>
            
            <hr className="border-border-subtle my-2" />
            
            <div className="flex flex-col gap-3">
              {/* Mobile Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="w-full h-12 rounded-full text-sm font-semibold border border-border-subtle text-slate-800 flex items-center justify-center gap-2 cursor-pointer"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>

              <button 
                onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                className="w-full h-12 rounded-full text-sm font-semibold border border-border-subtle text-slate-800 flex items-center justify-center"
              >
                Admin Login
              </button>
              <a 
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-12 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/10"
              >
                Get a Demo
              </a>
            </div>
          </div>
        )}
      </header>

      {/* SECTION 1 — HERO */}
      <section id="home" className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-8 animate-pulse-subtle">
            <Sparkles size={14} />
            <span>CAR WASH MANAGEMENT PLATFORM</span>
          </div>

          <h1 className="font-heading font-bold text-5xl md:text-7xl tracking-tight leading-none text-text-primary uppercase max-w-4xl mb-8">
            Car Wash Operations.<br />
            <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Finally Under Control.
            </span>
          </h1>

          <p className="text-base md:text-xl text-slate-500 max-w-3xl mb-12 font-sans font-light leading-relaxed">
            Elevoras brings your apartment car wash service into one connected platform — 
            real-time wash tracking, payments, attendance, and reporting across every flat in your community.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <a 
              href="#contact" 
              className="w-full sm:w-auto px-8 h-14 bg-primary hover:bg-primary/80 text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all duration-300 text-base"
            >
              Get a Demo
            </a>
            <a 
              href="#features" 
              className="w-full sm:w-auto px-8 h-14 bg-slate-100/80 hover:bg-slate-100 border border-border-subtle rounded-full flex items-center justify-center gap-2 hover:border-primary/50 transition-all duration-300 text-base"
            >
              View Features <ArrowRight size={18} className="text-primary" />
            </a>
          </div>

          {/* Stats Bar */}
          <div className="w-full max-w-4xl glass-panel border border-border-subtle/80 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-[33%] w-[1px] bg-border-subtle/50 hidden md:block" />
            <div className="absolute top-0 bottom-0 left-[66%] w-[1px] bg-border-subtle/50 hidden md:block" />
            
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-primary uppercase tracking-wider mb-2">Architectural Blueprint</span>
              <span className="font-heading font-bold text-lg md:text-xl text-slate-800">3 Apps in One Platform</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-secondary uppercase tracking-wider mb-2">Cross-Platform Tech</span>
              <span className="font-heading font-bold text-lg md:text-xl text-slate-800">Android · iOS · Web</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-primary uppercase tracking-wider mb-2">Scale Ready</span>
              <span className="font-heading font-bold text-lg md:text-xl text-slate-800">Built for Gated Communities</span>
            </div>
          </div>

          {/* Floating Mockup screens representation */}
          <div className="relative w-full max-w-5xl h-[300px] md:h-[480px] bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/80 to-transparent flex items-center justify-center">
            {/* Ambient glow in center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] radial-blob-red rounded-full opacity-60 pointer-events-none" />
            
            {/* Center Web Portal screenshot mock */}
            <div className="absolute bottom-0 w-[80%] md:w-[70%] h-[75%] md:h-[80%] glass-panel rounded-t-2xl shadow-2xl border border-border-subtle/80 overflow-hidden translate-y-4">
              <div className="bg-[#1F2937]/50 h-8 px-4 flex items-center gap-2 border-b border-border-subtle">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <div className="h-4 w-48 rounded bg-slate-100 mx-auto text-[9px] font-mono text-slate-500 flex items-center justify-center">
                  admin.elevoras.in/dashboard
                </div>
              </div>
              <div className="p-4 grid grid-cols-4 gap-3 bg-[#0F0F0F]/40 h-full">
                <div className="col-span-1 border-r border-border-subtle/40 pr-2 flex flex-col gap-2">
                  <div className="h-3 w-16 rounded bg-primary/20" />
                  <div className="h-6 rounded bg-slate-100/80 border border-border-subtle/30" />
                  <div className="h-6 rounded bg-slate-100/80" />
                  <div className="h-6 rounded bg-slate-100/80" />
                  <div className="h-6 rounded bg-slate-100/80" />
                </div>
                <div className="col-span-3 flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 rounded bg-surface border border-border-subtle/50 p-1.5 flex flex-col justify-between">
                      <div className="h-2 w-12 rounded bg-slate-600" />
                      <div className="h-4 w-8 rounded bg-primary/30" />
                    </div>
                    <div className="h-12 rounded bg-surface border border-border-subtle/50 p-1.5 flex flex-col justify-between">
                      <div className="h-2 w-12 rounded bg-slate-600" />
                      <div className="h-4 w-8 rounded bg-secondary/30" />
                    </div>
                    <div className="h-12 rounded bg-surface border border-border-subtle/50 p-1.5 flex flex-col justify-between">
                      <div className="h-2 w-12 rounded bg-slate-600" />
                      <div className="h-4 w-8 rounded bg-violet-500/30" />
                    </div>
                  </div>
                  <div className="h-24 rounded bg-surface border border-border-subtle/50 p-2 flex flex-col justify-between">
                    <div className="h-3 w-24 rounded bg-slate-700" />
                    <div className="w-full h-12 flex items-end gap-1 px-2 border-b border-border-subtle/50 pb-1">
                      <div className="h-[20%] w-[10%] bg-secondary/40 rounded-t" />
                      <div className="h-[40%] w-[10%] bg-primary/50 rounded-t" />
                      <div className="h-[60%] w-[10%] bg-primary/50 rounded-t" />
                      <div className="h-[30%] w-[10%] bg-secondary/40 rounded-t" />
                      <div className="h-[75%] w-[10%] bg-primary/80 rounded-t" />
                      <div className="h-[90%] w-[10%] bg-primary/95 rounded-t" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Customer App mockup */}
            <div className="absolute left-0 bottom-4 w-[28%] md:w-[22%] h-[65%] md:h-[75%] glass-panel rounded-2xl shadow-2xl border border-border-subtle/80 overflow-hidden -rotate-6 translate-x-2 md:-translate-x-8 animate-float">
              <div className="h-5 w-full bg-slate-100 flex items-center justify-between px-3 text-[8px] font-mono text-slate-500">
                <span>09:41 AM</span>
                <div className="w-12 h-3 rounded-full bg-black flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                </div>
                <div className="w-4 h-2 rounded bg-slate-700" />
              </div>
              <div className="p-3 flex flex-col gap-3 bg-[#0F0F0F]/80 h-full">
                <div className="flex items-center justify-between">
                  <div className="w-6 h-6 rounded-full bg-primary/20" />
                  <div className="h-2 w-14 rounded bg-slate-700" />
                </div>
                <div className="h-20 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-2 flex flex-col justify-between">
                  <div className="h-2 w-10 rounded bg-primary" />
                  <div className="h-4 w-20 rounded bg-white/20" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00C896] animate-ping" />
                    <span className="text-[7px] text-[#00C896] font-mono">WASH STARTED</span>
                  </div>
                </div>
                <div className="h-16 rounded-xl bg-surface border border-border-subtle p-2 flex flex-col justify-between">
                  <div className="h-2 w-16 bg-slate-700 rounded" />
                  <div className="h-6 w-full bg-primary hover:bg-primary/80 rounded flex items-center justify-center text-[8px] font-bold text-[#0F0F0F]">
                    Pay Wash Invoice
                  </div>
                </div>
              </div>
            </div>

            {/* Right Cleaner App mockup */}
            <div className="absolute right-0 bottom-4 w-[28%] md:w-[22%] h-[65%] md:h-[75%] glass-panel rounded-2xl shadow-2xl border border-border-subtle/80 overflow-hidden rotate-6 -translate-x-2 md:translate-x-8 animate-float" style={{ animationDelay: '2s' }}>
              <div className="h-5 w-full bg-slate-100 flex items-center justify-between px-3 text-[8px] font-mono text-slate-500">
                <span>09:41 AM</span>
                <div className="w-12 h-3 rounded-full bg-black flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                </div>
                <div className="w-4 h-2 rounded bg-slate-700" />
              </div>
              <div className="p-3 flex flex-col gap-3 bg-[#0F0F0F]/80 h-full">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-secondary/30" />
                  <div className="h-2 w-12 bg-slate-600 rounded" />
                </div>
                <div className="h-24 rounded-xl bg-surface border border-border-subtle/80 p-2 flex flex-col justify-between">
                  <div className="h-2 w-16 bg-slate-700 rounded" />
                  <div className="grid grid-cols-2 gap-1">
                    <div className="h-10 border border-[#00C896]/30 bg-[#00C896]/5 rounded-lg flex flex-col items-center justify-center text-[7px] text-[#00C896]">
                      <Camera size={10} className="mb-0.5" />
                      Capture
                    </div>
                    <div className="h-10 bg-slate-800 rounded-lg flex flex-col items-center justify-center text-[7px] text-slate-600">
                      <span>A-304</span>
                      <span>1 Wash Left</span>
                    </div>
                  </div>
                  <div className="h-4 w-full bg-secondary/80 rounded flex items-center justify-center text-[7px] font-bold text-[#0F0F0F]">
                    Submit Wash
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — HOW IT WORKS */}
      <section id="how-it-works" className="relative py-28 px-6 bg-surface/40 border-y border-border-subtle/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-heading font-bold text-4xl md:text-5xl tracking-tight text-text-primary mb-4 uppercase">
              How Elevoras Works
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto font-sans font-light">
              Three roles. One platform. Zero chaos.
            </p>
          </div>

          {/* 3 Role Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {/* Customer Role */}
            <div className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-inner">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-text-primary mb-4 group-hover:text-primary transition-colors uppercase">
                1. Customer App
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm font-sans font-light">
                Residents open the app to track their car wash in real-time, inspect camera-verified completion proof photos, pay securely online, and rate the service directly from their phones.
              </p>
            </div>

            {/* Cleaner Role */}
            <div className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-6 shadow-inner">
                <span className="text-2xl">🧹</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-text-primary mb-4 group-hover:text-secondary transition-colors uppercase">
                2. Cleaner App
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm font-sans font-light">
                Staff check in for the day, review assigned flats, tap to start the wash timer, capture and upload live photo proof (restricted from camera roll uploads), and clock out.
              </p>
            </div>

            {/* Admin Role */}
            <div className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6 shadow-inner">
                <span className="text-2xl">🖥️</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-text-primary mb-4 group-hover:text-violet-400 transition-colors uppercase">
                3. Admin Web Portal
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm font-sans font-light">
                Society managers and operations teams track cleaners' attendance, assign flats, generate daily wash summaries, process payments, inspect reviews, and audit photo records in one central hub.
              </p>
            </div>
          </div>

          {/* Horizontal Flow Diagram */}
          <div className="w-full glass-panel border border-border-subtle p-8 rounded-2xl overflow-x-auto">
            <h4 className="font-heading font-semibold text-lg text-slate-700 mb-6 text-center">
              The Elevoras Automated Operations Flow
            </h4>
            <div className="min-w-[900px] flex items-center justify-between px-4 py-2 font-mono text-xs">
              <div className="flex flex-col items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-surface border border-border-subtle flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 size={12} className="text-primary" /> Customer Books
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-600" />
              <div className="flex flex-col items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-surface border border-border-subtle flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 size={12} className="text-primary" /> Cleaner Assigned
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-600" />
              <div className="flex flex-col items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-surface border border-border-subtle flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 size={12} className="text-primary" /> Wash Started
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-600" />
              <div className="flex flex-col items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-surface border border-border-subtle flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 size={12} className="text-primary" /> Photo Captured
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-600" />
              <div className="flex flex-col items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-surface border border-border-subtle flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 size={12} className="text-primary" /> Customer Notified
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-600" />
              <div className="flex flex-col items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-surface border border-border-subtle flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 size={12} className="text-primary" /> Payment Done
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-600" />
              <div className="flex flex-col items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 flex items-center gap-1.5 text-primary">
                  <CheckCircle2 size={12} /> Invoice Generated
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — APP OVERVIEW (3 App Cards) */}
      <section id="apps" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-heading font-bold text-4xl md:text-5xl tracking-tight text-text-primary mb-4 uppercase">
              One Ecosystem. Three Powerful Apps.
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto font-sans font-light">
              Connected in real-time. Designed to keep operations smooth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1 - Customer App */}
            <div className="glass-panel border-t-2 border-t-primary rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
                    Android + iOS
                  </span>
                  <Smartphone size={20} className="text-primary" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-text-primary mb-2 uppercase">
                  Your Car, Always in the Loop
                </h3>
                <p className="text-slate-500 text-sm font-sans font-light mb-8">
                  Designed for gated community residents to track, pay, and review washes seamlessly.
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    'Live wash status tracking',
                    'View wash completion photos (camera-verified)',
                    'Rate and review every single wash',
                    'Pay per wash or top up wallet balance',
                    'Auto-generated digital invoices',
                    'Full payment transaction history',
                    'Push notifications when wash starts/ends'
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 size={16} className="text-[#00C896] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 border-t border-border-subtle pt-6">
                <span className="text-xs font-mono text-slate-500">Milestone Integration Ready</span>
              </div>
            </div>

            {/* Card 2 - Cleaner App */}
            <div className="glass-panel border-t-2 border-t-secondary rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-mono">
                    Android + iOS
                  </span>
                  <Smartphone size={20} className="text-secondary" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-text-primary mb-2 uppercase">
                  Built for the Person Doing the Work
                </h3>
                <p className="text-slate-500 text-sm font-sans font-light mb-8">
                  Super simple, low-data utility application tailored for cleaning operators on-site.
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    'Daily check-in / check-out with timestamps',
                    'View assigned flats and customers for the day',
                    'One-tap wash start and end workflow',
                    'Camera-only photo capture (gallery blocked)',
                    'Offline mode — logs washes with no signals',
                    'Automatic data sync on connection recovery',
                    'Simple wash history logs per flat'
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 border-t border-border-subtle pt-6">
                <span className="text-xs font-mono text-slate-500">Low Latency Data Sync</span>
              </div>
            </div>

            {/* Card 3 - Admin Portal */}
            <div className="glass-panel border-t-2 border-t-violet-500 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono">
                    Web App
                  </span>
                  <Monitor size={20} className="text-violet-400" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-text-primary mb-2 uppercase">
                  Total Control From One Dashboard
                </h3>
                <p className="text-slate-500 text-sm font-sans font-light mb-8">
                  The operations command center for supervisors and society board representatives.
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    'Add, edit, remove customers and cleaners',
                    'Manage flats and locations (multi-complex support)',
                    'Assign cleaners to specific flats & locations',
                    'Daily, monthly, and cleaner-wise wash reports',
                    'Attendance tracking and working-hours reports',
                    'Payment transaction management with filters',
                    'Refund initiation and webhook callback controls',
                    'Export reports as CSV/PDF with one click',
                    'Revenue analytics and performance leaderboard'
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 size={16} className="text-violet-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 border-t border-border-subtle pt-6">
                {currentAdmin ? (
                  <button 
                    onClick={() => navigate('/admin')}
                    className="w-full h-11 bg-violet-600 hover:bg-violet-600/80 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Enter Live Preview <ArrowRight size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full h-11 bg-violet-600 hover:bg-violet-600/80 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Login to Dashboard <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — KEY FEATURES (Feature Grid) */}
      <section id="features" className="py-28 px-6 bg-surface/40 border-y border-border-subtle/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-heading font-bold text-4xl md:text-5xl tracking-tight text-text-primary mb-4 uppercase">
              What Makes Elevoras Different
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto font-sans font-light">
              Every feature built specifically for apartment-scale car wash operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Camera className="text-primary" />,
                title: 'Camera-Only Upload',
                body: 'Wash proof photos must be taken live. Cleaner App gallery upload is blocked at the OS permission level to prevent fake records.'
              },
              {
                icon: <CreditCard className="text-secondary" />,
                title: 'Payment Gateway',
                body: 'Per-wash billing or wallet top-ups. Webhook callbacks, automated invoices, and secure refund triggers. No raw card storage.'
              },
              {
                icon: <Clock className="text-primary" />,
                title: 'Live Wash Tracking',
                body: 'Washes are timestamped instantly (start, end, duration). Customers track status live, and admin dashboards hold full records.'
              },
              {
                icon: <Star className="text-secondary" />,
                title: 'Ratings & Reviews',
                body: 'Residents rate each wash. The admin portal aggregates ratings by cleaner, location, flat, and date range.'
              },
              {
                icon: <MapPin className="text-primary" />,
                title: 'Multi-Location Ready',
                body: 'Manage multiple apartments and gated communities in a single admin account. Staff assigned per location/flat.'
              },
              {
                icon: <ShieldCheck className="text-secondary" />,
                title: 'Security-First Layout',
                body: 'All timestamps stored in UTC, and displayed in user local timezone. Encrypted storage and secure API communication.'
              },
              {
                icon: <FileText className="text-primary" />,
                title: 'Smart Reports',
                body: 'Generate wash counts, cleaner attendance, payment breakdowns, and no-wash alerts. Single-click PDF and CSV exports.'
              },
              {
                icon: <WifiOff className="text-secondary" />,
                title: 'Offline Support',
                body: 'Cleaners can record washes in low-connectivity areas (basement parkings). Washes sync automatically when signal returns.'
              }
            ].map((feat, idx) => (
              <div key={idx} className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center mb-5 shadow">
                    {feat.icon}
                  </div>
                  <h4 className="font-heading font-semibold text-lg text-text-primary mb-2">
                    {feat.title}
                  </h4>
                  <p className="text-slate-500 text-xs font-sans font-light leading-relaxed">
                    {feat.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — SOCIAL PROOF / TRUST */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary tracking-tight uppercase">
              Built with Real-World Constraints in Mind
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-border-subtle/50 bg-slate-100/40 backdrop-blur flex flex-col justify-between">
              <p className="text-slate-700 font-sans italic text-sm leading-relaxed mb-6">
                "Camera-only upload enforced at the OS level — not just a UI toggle. We guarantee physical presence of the cleaner at the car."
              </p>
              <div className="font-mono text-xs">
                <div className="text-primary font-bold">Architecture Decision</div>
                <div className="text-slate-500">Elevoras Core Platform</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border-subtle/50 bg-slate-100/40 backdrop-blur flex flex-col justify-between">
              <p className="text-slate-700 font-sans italic text-sm leading-relaxed mb-6">
                "All timestamps are registered in UTC and converted dynamically. Gives audits absolute accuracy for residents and managers alike."
              </p>
              <div className="font-mono text-xs">
                <div className="text-secondary font-bold">UTC Synchronization</div>
                <div className="text-slate-500">Reliable Logging Engine</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border-subtle/50 bg-slate-100/40 backdrop-blur flex flex-col justify-between">
              <p className="text-slate-700 font-sans italic text-sm leading-relaxed mb-6">
                "Payment gateway configuration supports sandbox mode, instant settlements, and automated receipts on successful callbacks."
              </p>
              <div className="font-mono text-xs">
                <div className="text-violet-400 font-bold">PCI-Compliant Billing</div>
                <div className="text-slate-500">Zero Local Card Storage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — EXTRA FEATURES (Added Value) */}
      <section className="py-24 px-6 bg-surface/40 border-t border-border-subtle/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary tracking-tight mb-4 uppercase">
              More Than the Brief. Built Ahead of What You'll Need.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm font-sans font-light">
              Extra integrations implemented to ensure maximum scalability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: '🔔 Push Notifications',
                desc: 'Milestone notifications sent to customer devices immediately. Auto alerts on wash start, completion, and receipt validation.'
              },
              {
                title: '📈 Revenue Analytics',
                desc: 'Dashboard visualizes collected cash against outstanding customer invoices, filters by date range, and predicts next month collections.'
              },
              {
                title: '🏆 Cleaner Leaderboard',
                desc: 'Gamify your workforce metrics. Auto-ranks cleaners by rating averages, attendance punctuality streaks, and wash completions.'
              },
              {
                title: '📥 Export Reports',
                desc: 'supervisor can generate operational reports, save as CSV sheets or printable PDF dossiers with branding headers in one click.'
              },
              {
                title: '🗺️ Multi-Community Dashboard',
                desc: 'Switch operations seamlessly. Society management groups running multiple complex locations can control everything from one credential.'
              },
              {
                title: '🤖 AI Wash Insights',
                tag: 'Roadmap',
                desc: 'Machine learning algorithms to predict cleaning schedules, highlight customer churn candidates, and alert when cars are skipped.'
              }
            ].map((extra, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-heading font-bold text-lg text-text-primary">
                      {extra.title.split(' ')[0]} {extra.title.split(' ').slice(1).join(' ')}
                    </h4>
                    {extra.tag && (
                      <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono text-[9px] uppercase">
                        {extra.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs font-sans font-light leading-relaxed">
                    {extra.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — PRICING */}
      <section id="pricing" className="py-28 px-6 border-t border-border-subtle/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-heading font-bold text-4xl md:text-5xl tracking-tight text-text-primary mb-4 uppercase">
              Transparent Pricing. No Surprises.
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto font-sans font-light">
              One-time development investment. Milestone-based payments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Primary Pricing Info */}
            <div className="lg:col-span-3 glass-panel rounded-2xl p-8 relative overflow-hidden border border-primary/30">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-wider mb-4 inline-block">
                Full-Stack Build
              </span>
              <h3 className="font-heading font-bold text-2xl text-text-primary mb-4 uppercase">
                Enterprise Custom Ecosystem
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-heading font-bold text-4xl md:text-5xl text-text-primary">₹2,50,000</span>
                <span className="text-slate-500 text-sm font-sans">One-Time Development Fee</span>
              </div>
              
              <div className="flex items-center gap-2 mb-8 text-sm text-slate-700">
                <Clock size={16} className="text-primary" />
                <span>Completion Timeline: <strong>25 Working Days</strong></span>
              </div>

              {/* Milestones */}
              <h4 className="font-heading font-semibold text-slate-700 mb-4 border-b border-border-subtle pb-2 text-sm">
                Milestone-Based Payments
              </h4>
              <div className="flex flex-col gap-3 font-sans text-xs">
                {[
                  { title: 'Project Kickoff', pct: '40%', amt: '₹1,00,000', trigger: 'On agreement signing' },
                  { title: 'Mid-Delivery Verification', pct: '30%', amt: '₹75,000', trigger: 'Day 10 — UI & backend ready' },
                  { title: 'Final Handover', pct: '30%', amt: '₹75,000', trigger: 'Day 25 — fully deployed & app store ready' }
                ].map((mil, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-surface border border-border-subtle/50">
                    <div className="mb-1 sm:mb-0">
                      <span className="font-bold text-slate-800">{mil.title}</span>
                      <span className="ml-2 text-slate-500">({mil.pct})</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 font-mono text-[10px]">{mil.trigger}</span>
                      <span className="font-mono font-bold text-primary">{mil.amt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* App breakdown & Details */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Accordion Component */}
              <div className="glass-panel rounded-2xl p-6 border border-border-subtle">
                <h4 className="font-heading font-bold text-lg text-text-primary mb-4">
                  Per-App Breakdown
                </h4>
                
                <div className="flex flex-col gap-3">
                  {[
                    {
                      id: 'cust-app',
                      title: 'Customer App (Android + iOS)',
                      cost: '₹95,000',
                      store: '₹12,000 Store deployment',
                      details: 'Built with React Native for native performance. Includes Wallet, UPI callback checks, live wash tracking, photos lightbox, and rating modules.'
                    },
                    {
                      id: 'cleaner-app',
                      title: 'Cleaner App (Android + iOS)',
                      cost: '₹70,000',
                      store: '₹12,000 Store deployment',
                      details: 'Super simplified interface built for outdoor operations. Enforces OS-level camera upload locks, offline support, and smart logs.'
                    },
                    {
                      id: 'admin-portal',
                      title: 'Admin Web Portal',
                      cost: '₹61,000',
                      store: 'Included in deployment',
                      details: 'Responsive React 19/TS operations portal. Real-time maps, cleaner allocations, charts, reports builder, settings and control systems.'
                    }
                  ].map((app) => (
                    <div key={app.id} className="border border-border-subtle/80 rounded-xl overflow-hidden bg-[#0F0F0F]/50">
                      <button 
                        onClick={() => toggleAccordion(app.id)}
                        className="w-full p-4 flex items-center justify-between font-sans text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-all"
                      >
                        <span>{app.title}</span>
                        {pricingOpen === app.id ? <Minus size={14} className="text-primary" /> : <Plus size={14} className="text-primary" />}
                      </button>
                      
                      {pricingOpen === app.id && (
                        <div className="p-4 border-t border-border-subtle bg-slate-100/30 text-[11px] font-sans text-slate-500 leading-relaxed">
                          <div className="flex justify-between mb-2">
                            <span>Development Cost:</span>
                            <strong className="text-slate-800">{app.cost}</strong>
                          </div>
                          <div className="flex justify-between mb-3 border-b border-border-subtle pb-2">
                            <span>Store Deployment:</span>
                            <strong className="text-slate-800">{app.store}</strong>
                          </div>
                          <p>{app.details}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Note */}
              <div className="glass-panel rounded-2xl p-6 border border-border-subtle/80 bg-gradient-to-tr from-secondary/5 to-transparent text-xs font-sans">
                <div className="font-bold text-slate-800 mb-2">AMC Details & Modes</div>
                <p className="text-slate-500 mb-4 leading-relaxed">
                  Post go-live maintenance (AMC) fee is <strong>₹8,000/month</strong>, covering server updates, security checks, and minor updates.
                </p>
                <div className="flex flex-wrap gap-2 font-mono text-[10px] text-slate-600">
                  <span className="px-2 py-1 rounded bg-slate-100 border border-border-subtle">NEFT</span>
                  <span className="px-2 py-1 rounded bg-slate-100 border border-border-subtle">UPI</span>
                  <span className="px-2 py-1 rounded bg-slate-100 border border-border-subtle">Cheque</span>
                </div>
              </div>

              <a 
                href="#contact"
                className="h-14 rounded-xl border border-primary hover:bg-primary/10 text-primary font-bold flex items-center justify-center transition-all duration-300 text-sm"
              >
                Request a Custom Quote &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — CONTACT / GET A DEMO */}
      <section id="contact" className="py-28 px-6 bg-surface/40 border-t border-border-subtle/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
              <h3 className="font-heading font-bold text-3xl text-text-primary mb-2 uppercase">
                Ready to Build?
              </h3>
              <p className="text-slate-500 text-sm font-sans mb-8">
                Drop your details below. We'll get back to you within 24 hours.
              </p>

              {formSubmitted ? (
                <div className="h-[300px] flex flex-col items-center justify-center text-center p-6 bg-primary/5 rounded-2xl border border-primary/20">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 text-2xl animate-bounce">
                    🎉
                  </div>
                  <h4 className="font-heading font-bold text-lg text-text-primary mb-2">Message Transmitted!</h4>
                  <p className="text-slate-500 text-xs max-w-sm">
                    Thank you for reaching out. An AXOWEB platform engineer from Chennai will call you within 24 hours to schedule a custom demonstration.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-600 text-xs font-semibold">Your Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Vijay Srinivasan" 
                        className="h-11 rounded-full bg-surface border border-border-subtle px-4 text-white focus:outline-none focus:border-primary placeholder:text-slate-600 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-600 text-xs font-semibold">Society / Organization</label>
                      <input 
                        type="text" 
                        name="org" 
                        required
                        value={formData.org}
                        onChange={handleInputChange}
                        placeholder="Prestige Association" 
                        className="h-11 rounded-full bg-surface border border-border-subtle px-4 text-white focus:outline-none focus:border-primary placeholder:text-slate-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-600 text-xs font-semibold">Mobile Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98840 12345" 
                        className="h-11 rounded-full bg-surface border border-border-subtle px-4 text-white focus:outline-none focus:border-primary placeholder:text-slate-600 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-600 text-xs font-semibold">Email Address</label>
                      <input 
                        type="email" 
                        name="email" 
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="vijay@prestige.com" 
                        className="h-11 rounded-full bg-surface border border-border-subtle px-4 text-white focus:outline-none focus:border-primary placeholder:text-slate-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-600 text-xs font-semibold">Requirements / Message</label>
                    <textarea 
                      name="message" 
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about the size of your community (e.g. 350 flats) and payment options needed..."
                      className="rounded-xl bg-surface border border-border-subtle p-4 text-white focus:outline-none focus:border-primary placeholder:text-slate-600 transition-colors resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="h-12 rounded-full bg-primary hover:bg-primary/80 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all"
                  >
                    Send Message <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>

            {/* Contact Details */}
            <div className="flex flex-col justify-center">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-wider mb-6 inline-block w-fit">
                Headquarters
              </span>
              <h3 className="font-heading font-bold text-4xl text-text-primary mb-6 uppercase">
                Let's discuss the operations workflow in Chennai.
              </h3>
              <p className="text-slate-500 leading-relaxed font-sans font-light mb-10 text-base">
                Elevoras is modular. We can configure flat maps, cleaner assignments, transaction limits, and wallet policies according to your resident rules.
              </p>

              <div className="flex flex-col gap-6 font-mono text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-primary">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">EMAIL ENQUIRIES</div>
                    <a href="mailto:hello@axoweb.in" className="text-slate-800 hover:text-primary transition-colors">hello@axoweb.in</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-secondary">
                    <Globe size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">OFFICIAL WEBSITE</div>
                    <a href="https://axoweb.in" target="_blank" rel="noreferrer" className="text-slate-800 hover:text-secondary transition-colors">axoweb.in</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-primary">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">LOCATION OFFICE</div>
                    <span className="text-slate-800">Chennai, Tamil Nadu, India</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-border-subtle bg-[#0F0F0F] relative z-10 text-xs text-slate-500 font-sans font-light">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-heading font-bold text-sm">
              E
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-text-primary tracking-tight">Elevoras</span>
              <span className="text-slate-600 block text-[10px]">Car Wash Management Ecosystem</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-slate-600">
            <a href="#home" className="hover:text-primary transition-colors">Home</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>

          <div className="text-center md:text-right font-mono text-[10px] text-slate-600">
            <div>Ref: AXWEB/2026/ELVR/001 | Valid 30 Days</div>
            <div>Built by AXOWEB Technologies, Chennai</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-border-subtle/50 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>&copy; {new Date().getFullYear()} AXOWEB Technologies. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
