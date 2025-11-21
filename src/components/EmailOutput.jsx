import React from 'react'

export default function EmailOutput({ value, onCopy, canCopy, showCopied }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Generated Email</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onCopy}
            disabled={!canCopy}
            className="px-3 py-1.5 rounded-lg bg-emerald-400 text-black font-semibold shadow-[0_0_16px_rgba(16,185,129,0.5)] hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Copy to Clipboard
          </button>
          {showCopied && (
            <span className="text-emerald-300 text-sm" role="status" aria-live="polite">Email copied!</span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-emerald-500/30 bg-black/40 p-4 min-h-[220px] text-emerald-50 overflow-auto">
        {value ? (
          <pre className="whitespace-pre-wrap font-mono leading-relaxed">{value}</pre>
        ) : (
          <p className="text-emerald-200/60">Your generated email will appear here.</p>
        )}
      </div>
    </section>
  )
}
