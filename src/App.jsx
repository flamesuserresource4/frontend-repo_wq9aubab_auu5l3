import React, { useState } from 'react'
import Header from './components/Header'
import EmailForm from './components/EmailForm'
import EmailOutput from './components/EmailOutput'

function App() {
  const [generated, setGenerated] = useState('')
  const [lastPrompt, setLastPrompt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  function buildPrompt({ goal, category, tone, detail }) {
    return `Generate a polished email based on the following:
Goal: ${goal}
Category: ${category}
Tone: ${tone}
Detail level: ${detail}

Email Writing Standard:
- Write emails as a senior corporate communicator.
- Sentences must be clear, structured, diplomatic, and impactful.
- Align wording directly to the user's goal with a professional tone.
- Include proper subject, greeting, body, and closing.
- Maintain clarity, respect, and outcome-focused messaging.

Quality requirements:
- Provide a subject line suggestion.
- Proper greeting based on tone and email type.
- Short context/introduction, then a clear main request.
- Supporting details only as needed (based on detail level).
- Polite, professional closing; firm but respectful if escalation.
- Acknowledge the recipient's role/constraints.
- No grammar/spelling mistakes; skimmable, short paragraphs; avoid slang unless Friendly.
- Do NOT repeat the user's goal verbatim; infer and elaborate professionally.
- Include placeholders for names, dates, IDs when helpful.
- Write like an expert email writer.`
  }

  // Mock generator with simple variation capability
  async function generateEmailFromInputs(inputs) {
    const prompt = buildPrompt(inputs)
    setLastPrompt({ prompt, inputs })
    setLoading(true)
    setCopied(false)

    try {
      // Placeholder for real API integration
      // const response = await callEmailApi(prompt)
      // setGenerated(response)

      // Mock result for now
      await new Promise(r => setTimeout(r, 700))
      const stamp = Math.random().toString(36).slice(2, 6)
      const email = mockEmail(inputs, stamp)
      setGenerated(email)
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

// ---- Helpers ----
function toTitleCase(str) {
  return str.replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ')
}

function extractGoalPhrase(goal) {
  // Create a concise non-verbatim phrase from the goal
  const stop = new Set(['to', 'for', 'the', 'a', 'an', 'and', 'of', 'on', 'at', 'with', 'about', 'regarding', 'please', 'kindly', 'my', 'our', 'your', 'in', 'from', 'by', 'due', 'as'])
  const words = goal
    .replace(/[\[\](){}.,!?;:]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  const filtered = []
  for (const w of words) {
    const lw = w.toLowerCase()
    if (!stop.has(lw)) filtered.push(w)
  }
  const compact = filtered.slice(0, 8).join(' ') || goal.trim()
  return toTitleCase(compact)
}

// ---- Mock + API placeholder ----
function mockEmail({ goal, category, tone, detail }, stamp) {
  const goalPhrase = extractGoalPhrase(goal)
  const subject = buildSubject(category, tone, goalPhrase)
  const body = buildBody({ goalPhrase, category, tone, detail })
  return `Subject: ${subject}\n\n${body}\n\nBest regards,\n[Your Name]`
}

function buildSubject(category, tone, goalPhrase) {
  const base = (() => {
    if (category === 'Food / Delivery') return 'Order Support'
    if (category === 'Banking / Finance') return 'Account Assistance'
    if (category === 'Professional') return 'Follow-up'
    return 'Request'
  })()

  const toneMod = tone === 'Assertive'
    ? ' – Action Required'
    : tone === 'Apologetic'
      ? ' – Apologies and Resolution'
      : ''

  // Include a concise hint of the goal without copying verbatim
  const hint = goalPhrase ? ` – ${goalPhrase}` : ''
  return `${base}${toneMod}${hint}`
}

function buildBody({ goalPhrase, category, tone, detail }) {
  // Greeting based on tone + email type
  const greeting = (() => {
    if (category === 'Food / Delivery' || category === 'Banking / Finance') {
      return 'Dear Customer Support Team,'
    }
    if (tone === 'Friendly') return 'Hi [Name],'
    if (tone === 'Semi-Formal') return 'Hello [Name],'
    return 'Dear [Name],'
  })()

  // Executive opener — senior, concise, outcome-oriented
  const opener = (() => {
    const core = `I’m reaching out regarding ${goalPhrase.toLowerCase()}.`
    if (tone === 'Apologetic') return `I’d like to acknowledge the situation concerning ${goalPhrase.toLowerCase()} and propose a clear, constructive way forward.`
    if (tone === 'Assertive') return `I’m contacting you regarding ${goalPhrase.toLowerCase()} and request timely action to move this to resolution.`
    return core
  })()

  // Role acknowledgement
  const acknowledgement = (() => {
    if (category === 'Professional') return 'I recognize competing priorities and appreciate your partnership in keeping us aligned.'
    if (category === 'Food / Delivery') return 'I understand your team manages high volumes daily and appreciate your attention to this.'
    if (category === 'Banking / Finance') return 'I understand compliance and verification steps are essential and appreciate your careful review.'
    return 'I appreciate the time and attention this may require on your side.'
  })()

  // Context blocks tailored to category
  const context = (() => {
    if (category === 'Food / Delivery') return 'Recently, I experienced an issue that affected the expected delivery experience.'
    if (category === 'Banking / Finance') return 'I noticed an inconsistency that warrants a closer review to ensure account accuracy.'
    if (category === 'Professional') return 'To maintain momentum, here is a concise status and the actions proposed.'
    return 'Below is a brief context along with the assistance I’m seeking.'
  })()

  const references = (() => {
    if (category === 'Food / Delivery') return 'Order ID: [XXXX-XXXX] • Date: [DD/MM/YYYY] • Restaurant: [Name] • Issue: [Brief description].'
    if (category === 'Banking / Finance') return 'Reference: [Transaction ID] • Date: [DD/MM/YYYY] • Amount: [$ / ₹] • Channel: [Card/UPI/NetBanking].'
    if (category === 'Professional') return 'Reference: [Project / Ticket] • Timeline: [Milestones & Dates] • Stakeholders: [Names].'
    return 'Reference: [Case/Topic] • Date: [DD/MM/YYYY] • Notes: [Short context].'
  })()

  // Clear request aligned to goal
  const request = (() => {
    if (category === 'Food / Delivery') return `Request: Please review the details related to ${goalPhrase.toLowerCase()} and advise on a suitable resolution. A replacement or refund would be appropriate given the impact.`
    if (category === 'Banking / Finance') return `Request: Please investigate the matter concerning ${goalPhrase.toLowerCase()} and share findings, including any actions required from my side.`
    if (category === 'Professional') return `Request: Let’s confirm ownership, finalize the timeline, and proceed with the next actions aligned to ${goalPhrase.toLowerCase()}.`
    return `Request: Please advise on the most effective next steps to progress ${goalPhrase.toLowerCase()}.`
  })()

  const firmness = tone === 'Assertive' ? 'Timeline: A response by [DD/MM/YYYY] would be appreciated to maintain pace.' : ''
  const appreciation = tone === 'Apologetic' ? 'I regret any inconvenience caused and value your understanding.' : 'Thank you for your time and support.'

  // Detail shaping — short, skimmable paragraphs; senior corporate style
  const detailBlocks = {
    Concise: [
      `${greeting}`,
      `${opener}`,
      `${acknowledgement}`,
      `${request}`,
      `${appreciation} ${firmness}`.trim(),
    ],
    Standard: [
      `${greeting}`,
      `${opener}`,
      `${acknowledgement}`,
      `${context} Key references:`,
      `${references}`,
      `${request}`,
      `${appreciation} ${firmness}`.trim(),
    ],
    Detailed: [
      `${greeting}`,
      `${opener}`,
      `${acknowledgement}`,
      `${context} Summary:`,
      `• Objective: ${goalPhrase}.`,
      `• Key details — ${references}`,
      `${request} If documentation or verification is needed, I can provide it promptly.`,
      `${appreciation} ${firmness}`.trim(),
    ],
  }

  return (detailBlocks[detail] || detailBlocks['Standard']).filter(Boolean).join('\n\n')
}

// Example API integration placeholder (not used by default)
// async function callEmailApi(prompt) {
//   const API_KEY = 'YOUR_API_KEY_HERE'
//   const res = await fetch('https://api.example.com/generate', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${API_KEY}`
//     },
//     body: JSON.stringify({ prompt })
//   })
//   if (!res.ok) throw new Error('API error')
//   const data = await res.json()
//   return data.text
// }
