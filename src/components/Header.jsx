import React from 'react'

export default function Header() {
  return (
    <header className="w-full py-6">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.6)] grid place-items-center">
            <span className="font-extrabold text-black">S</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-semibold leading-tight">SmartMail AI</h1>
            <p className="text-emerald-300/80 text-sm">Generate perfect emails from a single goal.</p>
          </div>
        </div>
      </div>
    </header>
  )
}
