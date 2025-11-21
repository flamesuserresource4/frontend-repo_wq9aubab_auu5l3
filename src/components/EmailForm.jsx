import React, { useState, useMemo } from 'react'

export default function EmailForm({ onGenerate, loading }) {
  const [goal, setGoal] = useState('')
  const [category, setCategory] = useState('Professional')
  const [tone, setTone] = useState('Formal')
  const [detail, setDetail] = useState('Standard')

  const isValid = useMemo(() => goal.trim().length > 0, [goal])

  function handleSubmit(e) {
    e.preventDefault()
    if (!isValid) return
    onGenerate({ goal, category, tone, detail })
  }

  function handleClear() {
    setGoal('')
    setCategory('Professional')
    setTone('Formal')
    setDetail('Standard')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-emerald-300 mb-2">Goal</label>
        <textarea
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Describe your email goal… e.g., Complain to Swiggy about delayed order, Request leave approval, Dispute a bank transaction, etc."
          className="w-full h-36 rounded-xl bg-black/40 border border-emerald-500/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 outline-none p-4 text-white placeholder:text-emerald-200/40"
          required
        />
        {!isValid && (
          <p className="mt-2 text-xs text-emerald-300/70" role="alert">Please enter a goal to generate an email.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">Email Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl bg-black/40 border border-emerald-500/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 outline-none p-3 text-white">
            <option>Professional</option>
            <option>Food / Delivery</option>
            <option>Banking / Finance</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full rounded-xl bg-black/40 border border-emerald-500/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 outline-none p-3 text-white">
            <option>Formal</option>
            <option>Semi-Formal</option>
            <option>Friendly</option>
            <option>Apologetic</option>
            <option>Assertive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">Detail Level</label>
          <select value={detail} onChange={(e) => setDetail(e.target.value)} className="w-full rounded-xl bg-black/40 border border-emerald-500/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 outline-none p-3 text-white">
            <option>Concise</option>
            <option>Standard</option>
            <option>Detailed</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button type="submit" disabled={!isValid || loading} className="px-4 py-2 rounded-xl bg-emerald-400 text-black font-semibold shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Generating…' : 'Generate Email'}
        </button>
        <button type="button" onClick={handleClear} className="px-4 py-2 rounded-xl bg-black/50 text-emerald-200 border border-emerald-500/30 hover:bg-black/60 transition">
          Clear All
        </button>
      </div>
    </form>
  )
}
