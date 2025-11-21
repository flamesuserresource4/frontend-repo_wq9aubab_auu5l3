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
Constraints:
- Do NOT repeat the user's goal verbatim; infer and elaborate professionally.
- Keep it clear, cohesive, and human-sounding.
- Include a subject line.
- Use an appropriate greeting and sign-off.
- Where helpful, include placeholders for names, dates, IDs.
- Write like an expert email writer with well-structured paragraphs.`
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
                  Regenerate
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

// ---- Mock + API placeholder ----
function mockEmail({ goal, category, tone, detail }, stamp) {
  const subject = buildSubject(category, tone)
  const body = buildBody({ category, tone, detail })
  return `Subject: ${subject}\n\n${body}\n\nBest regards,\n[Your Name]`
}

function buildSubject(category, tone) {
  const subjectByCategory = {
    'Professional': {
      default: 'Follow-up and Next Steps',
      assertive: 'Action Required: Next Steps and Timeline',
      apologetic: 'Apologies and Proposed Resolution',
    },
    'Food / Delivery': {
      default: 'Assistance with Recent Order',
      assertive: 'Requesting Resolution for Recent Order Issue',
      apologetic: 'Apologies and Clarification on Recent Order',
    },
    'Banking / Finance': {
      default: 'Inquiry Regarding Recent Account Activity',
      assertive: 'Urgent Review Requested: Account Activity',
      apologetic: 'Clarification Regarding Recent Account Activity',
    },
    'Other': {
      default: 'Request for Support',
      assertive: 'Assistance Needed: Timely Resolution Requested',
      apologetic: 'Apologies and Request for Guidance',
    }
  }

  const cat = subjectByCategory[category] || subjectByCategory['Other']
  const key = tone === 'Assertive' ? 'assertive' : tone === 'Apologetic' ? 'apologetic' : 'default'
  return cat[key]
}

function buildBody({ category, tone, detail }) {
  const greeting = tone === 'Friendly' ? 'Hi there,' : tone === 'Semi-Formal' ? 'Hello,' : 'Dear Team,'

  const topicByCategory = {
    'Professional': 'our recent discussions and the planned deliverables',
    'Food / Delivery': 'a recent order placed through your service',
    'Banking / Finance': 'recent activity reflected on my account',
    'Other': 'a matter that could use your guidance',
  }

  const topic = topicByCategory[category] || topicByCategory['Other']

  // Opening paragraph: expert tone without echoing the raw goal
  const opening =
    tone === 'Apologetic'
      ? `I hope you are well. I’d like to acknowledge the situation regarding ${topic} and offer a clear path forward.`
      : tone === 'Assertive'
      ? `I hope you are well. I’m reaching out regarding ${topic} and would appreciate your prompt attention.`
      : `I hope you are well. I’m writing in connection with ${topic} and would appreciate your guidance.`

  // Context paragraph — elaborated, professional wording
  const contextBase =
    category === 'Food / Delivery'
      ? 'Recently, I experienced an issue affecting the expected delivery experience.'
      : category === 'Banking / Finance'
      ? 'I noticed an inconsistency that merits a closer review to ensure account accuracy.'
      : category === 'Professional'
      ? 'To ensure alignment and momentum, I wanted to summarize the current status and propose next steps.'
      : 'I want to provide a concise overview and request the most suitable next steps.'

  const placeholders =
    category === 'Food / Delivery'
      ? 'Order ID: [XXXX-XXXX] • Placed on: [DD/MM/YYYY] • Restaurant: [Name] • Issue observed: [Brief description].'
      : category === 'Banking / Finance'
      ? 'Reference: [Transaction ID] • Date: [DD/MM/YYYY] • Amount: [$ / ₹] • Channel: [Card/UPI/NetBanking].'
      : category === 'Professional'
      ? 'Reference: [Project / Ticket] • Timeline: [Milestones & Dates] • Stakeholders: [Names].'
      : 'Reference: [Case/Topic] • Date: [DD/MM/YYYY] • Notes: [Short context].'

  const requestLine =
    category === 'Food / Delivery'
      ? 'Could you please review the details above and advise on an appropriate resolution? A replacement or refund would be appreciated as suitable.'
      : category === 'Banking / Finance'
      ? 'Could you please review this activity and confirm the findings, along with any steps required from my side?'
      : category === 'Professional'
      ? 'Could we confirm ownership, finalize the timeline, and proceed with the outlined actions?'
      : 'Could you please advise on the best next steps to move this forward?'

  const toneReinforcement =
    tone === 'Apologetic'
      ? 'I regret any inconvenience this may have caused and appreciate your understanding.'
      : tone === 'Assertive'
      ? 'Given the impact, a timely response would be greatly appreciated.'
      : 'Thank you in advance for your support and guidance.'

  // Detail shaping
  const detailBlocks = {
    Concise: [
      `${greeting}`,
      `${opening}`,
      `${contextBase}`,
      `${placeholders}`,
      `${requestLine}`,
      `${toneReinforcement}`,
    ],
    Standard: [
      `${greeting}`,
      `${opening}`,
      `${contextBase} To help streamline the review, I’m sharing a few quick references below.`,
      `${placeholders}`,
      `${requestLine}`,
      `${toneReinforcement}`,
    ],
    Detailed: [
      `${greeting}`,
      `${opening}`,
      `${contextBase} For clarity, I’ve included a brief summary followed by key references:`,
      `Summary: [One or two sentences outlining the situation and desired outcome].`,
      `Key details — ${placeholders}`,
      `${requestLine} If additional documentation or verification is needed, I’ll be happy to provide it.`,
      `${toneReinforcement}`,
    ],
  }

  const paragraphs = (detailBlocks[detail] || detailBlocks['Standard']).filter(Boolean).join('\n\n')
  return paragraphs
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
