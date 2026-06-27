import React, { useState, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  Coins, 
  ArrowRight,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  FileSpreadsheet,
  Download,
  Info
} from 'lucide-react'
import { useMockStore, Payment } from '../../stores/mockStore'

export default function Payments() {
  const payments = useMockStore(state => state.payments)
  const processRefund = useMockStore(state => state.processRefund)
  const addPayment = useMockStore(state => state.addPayment)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedType, setSelectedType] = useState('')

  // UI state
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [refundReason, setRefundReason] = useState('')
  const [showRefundConfirm, setShowRefundConfirm] = useState(false)

  // Filtered Payments list
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesSearch = p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus ? p.status === selectedStatus : true
      const matchesType = selectedType ? p.type === selectedType : true

      return matchesSearch && matchesStatus && matchesType
    })
  }, [payments, searchQuery, selectedStatus, selectedType])

  // Selected Payment details
  const selectedPayment = useMemo(() => {
    return payments.find(p => p.id === selectedPaymentId) || null
  }, [payments, selectedPaymentId])

  // Total collected metric
  const totals = useMemo(() => {
    const successPayments = payments.filter(p => p.status === 'success')
    const collected = successPayments.reduce((sum, c) => sum + c.amount, 0)
    const pending = payments.filter(p => p.status === 'pending').reduce((sum, c) => sum + c.amount, 0)
    
    return { collected, pending }
  }, [payments])

  // Handle manual refund process
  const triggerRefund = () => {
    if (!selectedPaymentId) return
    if (!refundReason.trim()) {
      alert('Please state a reason for this refund.')
      return
    }

    processRefund(selectedPaymentId)
    alert(`Refund processed successfully for Transaction. Resident notified. Reason: ${refundReason}`)
    
    // Clear states
    setShowRefundConfirm(false)
    setSelectedPaymentId(null)
    setRefundReason('')
  }

  // Simulate payment webhook retry
  const triggerWebhookRetry = (txId: string) => {
    alert(`Retriggering webhook callback for Transaction ${txId}... Status returned: 200 OK.`)
  }

  // Settlement report download mock
  const triggerReportExport = () => {
    alert('Generating settlement ledger report... Settlement CSV saved to downloads.')
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Payment Ledger</h1>
          <p className="text-text-muted text-xs font-sans font-light mt-1">Audit customer subscription invoices, wallet balances, and refund requests</p>
        </div>
        <button 
          onClick={triggerReportExport}
          className="h-10 rounded-xl bg-surface hover:bg-slate-800 border border-border-subtle hover:border-slate-600 text-slate-200 text-xs font-semibold px-4 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 animate-pulse-subtle"
        >
          <FileSpreadsheet size={16} className="text-primary" /> Export Settlement Report
        </button>
      </div>

      {/* FINANCE SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
        <div className="p-5 rounded-2xl bg-surface border border-border-subtle/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-slate-500 uppercase font-mono text-[8px] tracking-wider">Total Revenue Collected</span>
            <span className="text-primary font-bold text-2xl mt-1">₹{totals.collected.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"><Coins size={20} /></div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border-subtle/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-slate-500 uppercase font-mono text-[8px] tracking-wider">Outstanding / Pending Billing</span>
            <span className="text-amber-500 font-bold text-2xl mt-1">₹{totals.pending.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500"><Coins size={20} /></div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827]/40 border border-border-subtle/50 flex flex-col justify-between">
          <span className="text-slate-500 uppercase font-mono text-[8px] tracking-wider">Payment Compliance</span>
          <span className="text-slate-200 font-semibold mt-2">PCI-DSS Safe Network Node</span>
          <span className="text-[9px] text-slate-600 font-mono mt-1">Stripe / Razorpay Direct Webhooks</span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Search */}
        <div className="md:col-span-2 relative flex items-center">
          <Search size={14} className="absolute left-3.5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search Transaction ID, Resident Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 rounded-xl bg-surface border border-border-subtle/80 pl-10 pr-4 text-xs focus:outline-none focus:border-primary transition-colors text-white placeholder:text-slate-600"
          />
        </div>

        {/* Status Filter */}
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-11 rounded-xl bg-surface border border-border-subtle/80 px-4 text-xs text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        {/* Type Filter */}
        <select 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="h-11 rounded-xl bg-surface border border-border-subtle/80 px-4 text-xs text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="">All Types</option>
          <option value="per_wash">Per Wash Billing</option>
          <option value="wallet">Wallet Top-up</option>
        </select>

      </div>

      {/* TRANSACTION LEDGER TABLE */}
      <div className="glass-panel border border-border-subtle rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="bg-[#111827]/40 border-b border-border-subtle text-slate-500 font-mono text-[10px] uppercase">
                <th className="py-3.5 px-5">Transaction ID</th>
                <th className="py-3.5 px-5">Resident Customer</th>
                <th className="py-3.5 px-5">Type</th>
                <th className="py-3.5 px-5 font-mono text-right">Amount</th>
                <th className="py-3.5 px-5">Date / Time</th>
                <th className="py-3.5 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500 font-light">
                    No transactions registered matching this query.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr 
                    key={p.id}
                    onClick={() => setSelectedPaymentId(p.id)}
                    className="border-b border-border-subtle/50 hover:bg-slate-800/10 cursor-pointer transition-colors"
                  >
                    {/* Tx ID */}
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-200">
                      {p.transactionId}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-5 font-semibold text-slate-200">
                      {p.customerName}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-5 text-slate-400 capitalize">
                      {p.type.replace('_', ' ')}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-200">
                      ₹{p.amount}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-5 text-slate-400 font-mono text-[10px]">
                      {new Date(p.date).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5 text-right">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                        p.status === 'success' ? 'bg-primary/10 border-primary/20 text-primary' :
                        p.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                        p.status === 'refunded' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                        'bg-rose-500/10 border-rose-500/20 text-rose-500'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRANSACTION DETAIL SLIDE OVER DRAWER */}
      {selectedPayment && (
        <>
          <div 
            onClick={() => { setSelectedPaymentId(null); setShowRefundConfirm(false); }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-md glass-panel shadow-2xl p-6 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300">
            <div>
              
              <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-wider">Transaction Invoice</span>
                  <h3 className="font-heading font-bold text-lg text-white mt-1">{selectedPayment.transactionId}</h3>
                </div>
                <button 
                  onClick={() => { setSelectedPaymentId(null); setShowRefundConfirm(false); }}
                  className="p-1 rounded bg-surface border border-border-subtle text-slate-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Status details */}
              <div className="p-4 rounded-xl bg-surface border border-border-subtle/80 flex justify-between items-center mb-6">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-slate-500 uppercase font-mono">Invoice Amount</span>
                  <span className="font-mono text-base font-bold text-white">₹{selectedPayment.amount}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-mono text-[9px] uppercase font-bold border ${
                  selectedPayment.status === 'success' ? 'bg-primary/10 border-primary/20 text-primary' :
                  selectedPayment.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                  selectedPayment.status === 'refunded' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                  'bg-rose-500/10 border-rose-500/20 text-rose-500'
                }`}>
                  {selectedPayment.status}
                </span>
              </div>

              {/* Transaction Metadata fields */}
              <div className="flex flex-col gap-4 font-sans text-xs mb-6">
                <div className="border-b border-border-subtle pb-3">
                  <div className="text-slate-500 uppercase font-mono text-[9px] mb-1">Customer / Resident</div>
                  <div className="font-semibold text-slate-200 text-sm">{selectedPayment.customerName}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Subscriber ID: {selectedPayment.customerId}</div>
                </div>

                <div className="border-b border-border-subtle pb-3">
                  <div className="text-slate-500 uppercase font-mono text-[9px] mb-1">Payment Method & Type</div>
                  <div className="font-semibold text-slate-200 capitalize">{selectedPayment.type.replace('_', ' ')} Gateway</div>
                </div>

                <div className="border-b border-border-subtle pb-3">
                  <div className="text-slate-500 uppercase font-mono text-[9px] mb-1">Timestamp Logs</div>
                  <div className="font-mono text-[10px] text-slate-400 mt-1">{new Date(selectedPayment.date).toLocaleString()}</div>
                </div>

                {selectedPayment.washId && (
                  <div className="border-b border-border-subtle pb-3">
                    <div className="text-slate-500 uppercase font-mono text-[9px] mb-1">Linked Operational Wash ID</div>
                    <div className="font-mono text-primary font-bold text-[10px] hover:underline cursor-pointer">
                      {selectedPayment.washId}
                    </div>
                  </div>
                )}
              </div>

              {/* Refund confirmation logic block */}
              {showRefundConfirm ? (
                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex flex-col gap-3 font-sans text-xs">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <AlertTriangle size={14} /> Refund Authorization Request
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px] font-light">
                    Initiating a refund will void transaction logs, issue webhook reversals, and restore customer wallet balances.
                  </p>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-semibold text-[10px] uppercase font-mono">Stated Reason for Refund</label>
                    <input 
                      type="text" 
                      required
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      placeholder="Skipped wash / Customer request"
                      className="h-10 rounded-lg bg-surface border border-border-subtle px-3 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={triggerRefund}
                      className="flex-1 h-10 bg-rose-500 hover:bg-rose-500/80 text-white font-bold rounded-lg cursor-pointer"
                    >
                      Authorize Refund
                    </button>
                    <button 
                      onClick={() => setShowRefundConfirm(false)}
                      className="flex-1 h-10 border border-border-subtle text-slate-300 rounded-lg hover:bg-slate-800/40 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                selectedPayment.status === 'success' && (
                  <button 
                    onClick={() => setShowRefundConfirm(true)}
                    className="w-full h-11 border border-rose-500/30 hover:border-rose-500 text-rose-400 hover:bg-rose-500/5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    Initiate Admin Reversal Refund
                  </button>
                )
              )}

              {/* Webhook Retry for Failed Transactions */}
              {selectedPayment.status === 'failed' && (
                <button 
                  onClick={() => triggerWebhookRetry(selectedPayment.transactionId)}
                  className="w-full h-11 border border-secondary hover:bg-secondary/5 text-secondary text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCw size={14} /> Retrigger Webhook Callback
                </button>
              )}

              {/* Invoice Download mock */}
              {selectedPayment.status === 'success' && (
                <a 
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert('Downloading PDF receipt voucher...'); }}
                  className="w-full h-11 border border-border-subtle hover:border-slate-500 text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all mt-3"
                >
                  <Download size={14} /> Download Invoice Receipt (PDF)
                </a>
              )}
            </div>

            <div className="mt-8 border-t border-border-subtle pt-4 flex gap-2">
              <button 
                onClick={() => { setSelectedPaymentId(null); setShowRefundConfirm(false); }}
                className="w-full h-11 border border-border-subtle hover:bg-slate-800/40 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Transaction Panel
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  )
}
