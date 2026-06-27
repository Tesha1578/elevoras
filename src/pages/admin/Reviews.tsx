import React, { useState, useMemo } from 'react'
import { 
  Star, 
  Search, 
  Filter, 
  Award, 
  ThumbsUp, 
  ThumbsDown,
  MessageSquare,
  Sparkles,
  Calendar
} from 'lucide-react'
import { useMockStore, Review, Cleaner } from '../../stores/mockStore'

export default function Reviews() {
  const reviews = useMockStore(state => state.reviews)
  const cleaners = useMockStore(state => state.cleaners)

  // Filters
  const [selectedRating, setSelectedRating] = useState<number | ''>('')
  const [searchQuery, setSearchQuery] = useState('')

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchesRating = selectedRating ? r.rating === selectedRating : true
      const matchesSearch = r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.cleanerName.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesRating && matchesSearch
    })
  }, [reviews, selectedRating, searchQuery])

  // Cleaner performance rankings (Leaderboard)
  const cleanerLeaderboard = useMemo(() => {
    const list = cleaners.filter(cl => cl.status !== 'inactive').map(cleaner => {
      const cleanerReviews = reviews.filter(r => r.cleanerId === cleaner.id)
      const count = cleanerReviews.length
      
      const avg = count === 0 
        ? 4.9 
        : Number((cleanerReviews.reduce((sum, curr) => sum + curr.rating, 0) / count).toFixed(1))
      
      const initials = cleaner.name.split(' ').map(x => x[0]).join('')
      
      return {
        id: cleaner.id,
        name: cleaner.name,
        employeeId: cleaner.employeeId,
        avgRating: avg,
        reviewCount: count,
        washes: cleaner.assignedFlatCount * 14 + count, // mock wash completion metrics
        initials
      }
    })

    // Sort by avgRating descending, then washes completed descending
    return list.sort((a, b) => {
      if (b.avgRating !== a.avgRating) {
        return b.avgRating - a.avgRating
      }
      return b.washes - a.washes
    })
  }, [cleaners, reviews])

  // Metrics summary
  const reviewStats = useMemo(() => {
    if (reviews.length === 0) return { avg: 4.8, total: 0, fives: 0 }
    
    const total = reviews.length
    const sum = reviews.reduce((s, r) => s + r.rating, 0)
    const avg = Number((sum / total).toFixed(2))
    const fives = reviews.filter(r => r.rating === 5).length
    
    return { avg, total, fives }
  }, [reviews])

  return (
    <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* Header title */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">Ratings & Customer Reviews</h1>
        <p className="text-text-muted text-xs font-sans font-light mt-1">Monitor subscriber reviews, aggregate ratings, and track cleaner work quality</p>
      </div>

      {/* FEEDBACK ANALYTICS METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-sans text-xs">
        
        <div className="p-5 rounded-2xl bg-surface border border-border-subtle/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-slate-500 uppercase font-mono text-[8px] tracking-wider">Average Rating</span>
            <span className="text-primary font-bold text-2xl mt-1 flex items-center gap-1">
              <Star size={18} fill="currentColor" /> {reviewStats.avg}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border-subtle/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-slate-500 uppercase font-mono text-[8px] tracking-wider">Review Submissions</span>
            <span className="text-slate-200 font-bold text-2xl mt-1 flex items-center gap-1">
              <MessageSquare size={18} /> {reviewStats.total} reviews
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border-subtle/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-slate-500 uppercase font-mono text-[8px] tracking-wider">5-Star Feedback</span>
            <span className="text-emerald-400 font-bold text-2xl mt-1 flex items-center gap-1">
              <ThumbsUp size={18} /> {reviewStats.fives} ratings
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827]/40 border border-border-subtle/50 flex flex-col justify-between">
          <span className="text-slate-500 uppercase font-mono text-[8px] tracking-wider">Operational SLA</span>
          <span className="text-slate-200 font-semibold mt-2">Skipped Wash Alert &lt; 24h</span>
          <span className="text-[9px] text-slate-650 font-mono mt-1">Automatic SMS Callback Trigger</span>
        </div>
      </div>

      {/* RATING LEADERS AND WORK LOGGER LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Reviews Feed */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="font-heading font-bold text-base text-slate-300">Live Customer Reviews Feed ({filteredReviews.length})</h2>
          
          {/* Query controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative flex items-center">
              <Search size={14} className="absolute left-3 text-slate-500" />
              <input 
                type="text"
                placeholder="Search reviews description, resident, cleaner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 rounded-xl bg-surface border border-border-subtle pl-9 pr-4 text-xs focus:outline-none focus:border-primary text-white placeholder:text-slate-600"
              />
            </div>
            
            <select 
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value ? parseInt(e.target.value) : '')}
              className="h-10 rounded-xl bg-surface border border-border-subtle px-3 text-xs text-slate-300 focus:outline-none focus:border-primary cursor-pointer w-full"
            >
              <option value="">All Star Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Cards listing */}
          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredReviews.length === 0 ? (
              <div className="glass-panel border border-border-subtle p-8 rounded-2xl text-center text-slate-500 font-sans font-light text-xs">
                No customer reviews matching this search query.
              </div>
            ) : (
              filteredReviews.map((r) => (
                <div key={r.id} className="glass-panel p-4.5 rounded-2xl border border-border-subtle/80 flex flex-col gap-3 font-sans text-xs">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{r.customerName}</span>
                      <span className="text-[10px] text-slate-500 font-light">&middot; Rating:</span>
                      <div className="flex items-center gap-0.5 text-primary">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} fill={i < r.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">{new Date(r.date).toLocaleDateString()}</span>
                  </div>

                  <p className="text-slate-300 italic font-light leading-relaxed">
                    "{r.review}"
                  </p>

                  <div className="flex justify-between items-center border-t border-border-subtle/50 pt-2.5 mt-1 text-[9px] font-mono text-slate-500">
                    <span>Cleaner: <strong className="text-slate-400">{r.cleanerName}</strong></span>
                    <span>Wash Ref ID: {r.washId}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cleaner Performance Leaderboard */}
        <div className="glass-panel border border-border-subtle rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-300 mb-4 flex items-center gap-2">
              <Award size={16} className="text-primary" /> Cleaner Leaderboard
            </h3>
            <p className="text-[10px] text-slate-500 font-sans font-light mb-6">Staff performance ranked by user reviews and wash compliance streaks</p>

            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
              {cleanerLeaderboard.map((clean, idx) => {
                const rankColor = idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-500'
                return (
                  <div key={clean.id} className="p-3 rounded-xl bg-surface/50 border border-border-subtle/40 flex items-center justify-between font-sans text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono font-bold text-sm ${rankColor} w-4 text-center`}>{idx + 1}</span>
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-border-subtle flex items-center justify-center font-bold text-[10px] text-slate-300">
                        {clean.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">{clean.name.split(' ')[0]}</span>
                        <span className="text-[9px] text-slate-500 font-mono mt-0.5">{clean.employeeId}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-primary font-bold font-mono text-[11px] flex items-center gap-0.5">
                        <Star size={11} fill="currentColor" /> {clean.avgRating}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono mt-0.5">{clean.washes} washes</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
