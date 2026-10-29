'use client';

import { FormEvent, useMemo, useState } from 'react';
import type { GradeApiResponse } from '@/lib/types';

const initialHook = 'Most B2B founders lose qualified leads because their first LinkedIn line sounds like everyone else.';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [hook, setHook] = useState(initialHook);
  const [result, setResult] = useState<GradeApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const count = useMemo(() => hook.trim() ? hook.trim().split(/\s+/).length : 0, [hook]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, linkedinUrl, hook }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not grade this hook.');
      setResult(payload as GradeApiResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function copyText(value: string) {
    try { await navigator.clipboard.writeText(value); } catch { /* Clipboard may be blocked in some browsers. */ }
  }

  return (
    <main className="shell">
      <nav className="nav">
        <div className="brand"><span className="brand-mark">H</span><span>HookGrade <b>Studio</b></span></div>
        <div className="nav-right"><span className="live-dot" /> RULE-BASED SCORING <span className="nav-divider">/</span> AI REWRITES</div>
      </nav>

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-line" /> LINKEDIN HOOK GRADER <span className="eyebrow-pill">BETA</span></div>
        <h1>Make your first line<br /><em>impossible to ignore.</em></h1>
        <p className="hero-sub">Get a transparent score, actionable feedback, and three fresh ways to open your next LinkedIn post.</p>
        <div className="hero-meta"><span><i className="meta-icon">01</i> 5 fixed scoring rules</span><span><i className="meta-icon">02</i> 3 rewrite angles</span><span><i className="meta-icon">03</i> Saved to your workspace</span></div>
      </section>

      <section className="workspace">
        <form className="input-card" onSubmit={handleSubmit}>
          <div className="card-top"><div><span className="section-number">01</span><h2>Your hook</h2></div><span className="subtle-label">ORIGINAL DRAFT</span></div>
          <div className="field-row">
            <label>YOUR NAME <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pari Soni" required maxLength={100} /></label>
            <label>EMAIL <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" type="email" required maxLength={254} /></label>
          </div>
          <div className="field-row">
            <label>COMPANY <span className="optional">OPTIONAL</span><input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" maxLength={150} /></label>
            <label>LINKEDIN PROFILE <span className="optional">OPTIONAL</span><input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." type="url" maxLength={500} /></label>
          </div>
          <label className="hook-label">PASTE YOUR FIRST LINE <span className="optional">ONE HOOK ONLY</span></label>
          <textarea value={hook} onChange={(e) => setHook(e.target.value)} placeholder="Write the first line of your LinkedIn post..." rows={5} maxLength={1200} required />
          <div className="textarea-footer"><span>{count} words · {hook.length}/1200 characters</span><button className="text-button" type="button" onClick={() => setHook('')}>Clear hook</button></div>
          <div className="submit-row"><div className="privacy-note"><span className="lock">◈</span> Your hook is scored with fixed rules. AI is only used for rewrites.</div><button className="primary-button" type="submit" disabled={loading || !hook.trim() || !name.trim() || !email.trim()}>{loading ? <><span className="spinner" /> Grading…</> : <>Grade my hook <span>↗</span></>}</button></div>
          {error && <div className="error-box" role="alert">{error}</div>}
        </form>

        <aside className="rules-card">
          <div className="card-top"><div><span className="section-number">02</span><h2>Scoring rules</h2></div><span className="score-total">100 PTS</span></div>
          <p className="rules-intro">Every rule is deterministic. The score does not depend on the AI.</p>
          <div className="rule-list">
            {[['01','Concise length','8–25 words'],['02','Specific audience','Role or niche'],['03','Pain or outcome','Clear business value'],['04','Curiosity or tension','Question, contrast, insight'],['05','Easy to read','Clean, scannable wording']].map(([num, title, desc]) => <div className="rule-item" key={num}><span className="rule-num">{num}</span><div className="rule-copy"><b>{title}</b><small>{desc}</small></div><span className="rule-points">+20</span></div>)}
          </div>
          <div className="rules-foot"><span className="rules-foot-icon">✓</span><span><b>Transparent by design</b><small>Each failed rule returns a specific, one-line suggestion.</small></span></div>
        </aside>
      </section>

      {result && <section className="results" aria-live="polite">
        <div className="results-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> RESULTS</div><h2>Your hook report</h2></div><div className="provider-badge">{result.ai_provider === 'gemini' ? <><span className="live-dot" /> GEMINI REWRITES</> : <><span className="fallback-dot" /> LOCAL FALLBACK REWRITES</>}</div></div>
        <div className="results-grid">
          <div className="score-card"><div className="score-overline">HOOK SCORE</div><div className="score-number">{result.score.score}<small>/100</small></div><div className="score-track"><span style={{ width: `${result.score.score}%` }} /></div><p>{result.score.score >= 80 ? 'Strong foundation. Refine for even more impact.' : result.score.score >= 60 ? 'Good starting point. A few changes can sharpen it.' : 'There is room to make the opening clearer and stronger.'}</p><div className="score-rule-count">{result.score.rules.filter((r) => r.passed).length} of 5 rules passed</div></div>
          <div className="feedback-card"><div className="result-card-title">Rule-by-rule feedback</div>{result.score.rules.map((rule) => <div className={`feedback-row ${rule.passed ? 'passed' : 'failed'}`} key={rule.id}><span className="status-icon">{rule.passed ? '✓' : '!'}</span><div><b>{rule.title}</b><small>{rule.passed ? 'Passed · +20 points' : rule.feedback}</small></div><span className="feedback-points">{rule.points}/20</span></div>)}</div>
        </div>
        <div className="rewrites-header"><div><div className="eyebrow"><span className="eyebrow-line" /> AI REWRITES</div><h2>Three new angles</h2></div><p>Keep the core idea. Change the way you open.</p></div>
        {result.notices.length > 0 && <div className="notice-box">{result.notices.map((notice, index) => <p key={index}>{notice}</p>)}</div>}
        <div className="rewrite-grid">{result.rewrites.map((rewrite, index) => <article className="rewrite-card" key={`${rewrite.style}-${index}`}><div className="rewrite-top"><span className="rewrite-index">0{index + 1}</span><span className="rewrite-style">{rewrite.style}</span></div><p className="rewrite-hook">{rewrite.hook}</p><div className="why-label">WHY IT WORKS</div><p className="why-copy">{rewrite.why_it_works}</p><button className="copy-button" type="button" onClick={() => copyText(rewrite.hook)}>Copy hook <span>↗</span></button></article>)}</div>
        <div className="save-status"><span className={result.saved ? 'status-led success' : 'status-led warn'} />{result.saved ? 'Saved to Supabase' : 'Not saved to Supabase — check server configuration'}<span className="status-separator">·</span><span className={result.webhook_sent ? 'status-led success' : 'status-led warn'} />{result.webhook_sent ? 'Sent to Make webhook' : 'Make webhook not confirmed'}</div>
      </section>}

      <footer className="footer"><span>HOOKGRADE STUDIO</span><span>Deterministic scoring · Structured AI · Traceable output</span><span>MYNTMORE ROUND 2</span></footer>
    </main>
  );
}
