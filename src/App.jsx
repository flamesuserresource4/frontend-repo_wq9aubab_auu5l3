import React, { useState } from 'react'
import Header from './components/Header'
import EmailForm from './components/EmailForm'
import EmailOutput from './components/EmailOutput'

function App() {
  const [generated, setGenerated] = useState('')
  const [lastPrompt, setLastPrompt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

  // Build a server-side prompt reference (kept for debugging or future UI display)
  function buildPrompt({ goal, category, tone, detail }) {
    return `Generate a polished email based on the following:\nGoal: ${goal}\nCategory: ${category}\nTone: ${tone}\nDetail level: ${detail}\n\nEmail Writing Standard:\n- Write emails as a senior corporate communicator.\n- Sentences must be clear, structured, diplomatic, and impactful.\n- Align wording directly to the user's goal with a professional tone.\n- Include proper subject, greeting, body, and closing.\n- Maintain clarity, respect, and outcome-focused messaging.\n\nQuality requirements:\n- Provide a subject line suggestion.\n- Proper greeting based on tone and email type.\n- Short context/introduction, then a clear main request.\n- Supporting details only as needed (based on detail level).\n- Polite, professional closing; firm but respectful if escalation.\n- Acknowledge the recipient's role/constraints.\n- No grammar/spelling mistakes; skimmable, short paragraphs; avoid slang unless Friendly.\n- Do NOT repeat the user's goal verbatim; infer and elaborate professionally.\n- Include placeholders for names, dates, IDs when helpful.\n- Write like an expert email writer.`
  }

  async function generateEmailFromInputs(inputs) {
    const prompt = buildPrompt(inputs)
    setLastPrompt({ prompt, inputs })
    setLoading(true)
    setCopied(false)

    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'API error')
      }

      const data = await res.json()
      // data.output is the full formatted email from backend (with subject + body)
      setGenerated(data.output || '')
    } catch (e) {
      setGenerated('Sorry, something went wrong while generating the email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleRegenerate() {
    if (!lastPrompt) return
    generateEmailFromInputs(lastPrompt.inputs)
  }

  function handleCopy() {
    if (!generated) return
    navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(1000px 600px at 20% -10%, rgba(16,185,129,0.15), transparent), radial-gradient(1000px 600px at 120% 110%, rgba(16,185,129,0.12), transparent)'
      }} />

      <div className="relative">
        <Header />

        <main className="max-w-5xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <section className="rounded-2xl bg-[#0b0b0b] border border-emerald-500/20 p-6 shadow-[0_0_40px_rgba(16,185,129,0.08)]">
              <EmailForm onGenerate={generateEmailFromInputs} loading={loading} />

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleRegenerate}
                  disabled={!lastPrompt || loading}
                  className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/15 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating…' : 'Regenerate'}
                </button>
                {loading && (
                  <span className="ml-1 text-emerald-300/80 text-sm">Working with memory…</span>
                )}
              </div>
            </section>

            <section className="rounded-2xl bg-[#0b0b0b] border border-emerald-500/20 p-6 shadow-[0_0_40px_rgba(16,185,129,0.08)] min-h-[340px]">
              <EmailOutput value={generated} onCopy={handleCopy} canCopy={!!generated} showCopied={copied} />
            </section>
          </div>

          <footer className="mt-10 text-center text-emerald-300/70">Powered by AI</footer>
        </main>
      </div>
    </div>
  )
}

export default App
