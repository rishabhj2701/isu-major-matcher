// Ask & prep. Two halves:
//  1. "Bring to your advisor": questions generated from the real profile and
//     matches, each with the reason it was generated. Check, copy, print.
//  2. "Ask the catalog": a rule-based, source-cited Q&A over local verified
//     data. Says "I don't know" below a confidence floor. NOT an AI model —
//     labelled as such; a grounded Bedrock RAG service is the planned upgrade.

import { useMemo, useState } from 'react';
import { buildAdvisorQuestions, questionsToText } from '../lib/advisorQuestions.js';
import { ask, SUGGESTED_QUESTIONS } from '../lib/askEngine.js';
import { COMMON_QUESTIONS } from '../data/syntheticSessions.js';
import Icon from '../components/Icon.jsx';

export default function Ask({ profile, topScored = [], role = 'student', onStartQuest }) {
  const questions = useMemo(() => buildAdvisorQuestions(profile ?? {}, topScored), [profile, topScored]);
  const [checked, setChecked] = useState(() => new Set(questions.map((q) => q.id)));
  const [copied, setCopied] = useState(false);

  const [input, setInput] = useState('');
  const [thread, setThread] = useState([]);
  const [typing, setTyping] = useState(false);

  const topIds = topScored.map((m) => m.id);

  function send(text) {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput('');
    setThread((t) => [...t, { who: 'you', text: q }]);
    setTyping(true);
    const result = ask(q, { profile: { topIds } });
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      setTyping(false);
      setThread((t) => [...t, { who: 'bot', result }]);
    }, reduce ? 0 : 450);
  }

  async function copy() {
    const sel = questions.filter((q) => checked.has(q.id));
    try {
      await navigator.clipboard.writeText(questionsToText(sel));
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <section className="askpage" aria-labelledby="ask-heading">
      <header className="pagehead">
        <span className="eyebrow-plain">{role === 'advisor' ? 'What students ask · prepared answers' : 'Ask & prep'}</span>
        <h1 id="ask-heading">{role === 'advisor' ? 'Questions students bring, answered from sources' : 'Walk into advising with the right questions'}</h1>
        <p>
          {role === 'advisor'
            ? 'The most common questions from recent (synthetic) sessions, and the rule-based, source-cited answers the student view gives. Useful for seeing what students have already been told.'
            : "Questions below are generated from your actual answers and matches, each with the reason it appeared. Your don'ts get their own question. Then test the catalog Q&A."}
        </p>
      </header>

      <div className="ask-cols">
        <section className="panel" aria-labelledby="bring-heading">
          <div className="panelhead">
            <h2 id="bring-heading"><Icon name="flag" size={18} /> {role === 'advisor' ? 'Most common questions' : 'Bring to your advisor'}</h2>
            <span className="badge">{role === 'advisor' ? 'Synthetic counts' : `${checked.size} selected`}</span>
          </div>

          {role === 'advisor' ? (
            <ol className="common-q">
              {COMMON_QUESTIONS.map((c) => (
                <li key={c.text}>
                  <button type="button" className="tl-link" onClick={() => send(c.text)}>{c.text}</button>
                  <span className="badge">{c.count}</span>
                </li>
              ))}
            </ol>
          ) : !profile ? (
            <div className="empty-block">
              <p className="muted">Complete the quest and we'll tailor these to your interests, don'ts and matches.</p>
              <button type="button" className="btn-pill" onClick={onStartQuest}>Start Major Quest <span className="go"><Icon name="arrow" size={14} /></span></button>
              <p className="viz-caption">Until then, here are the general questions:</p>
              <ul className="qlist plain">{questions.map((q) => <li key={q.id}>{q.text}</li>)}</ul>
            </div>
          ) : (
            <>
              <ul className="qlist">
                {questions.map((q, i) => (
                  <li key={q.id} className="qitem reveal" style={{ '--delay': `${i * 50}ms` }}>
                    <label>
                      <input type="checkbox" checked={checked.has(q.id)} onChange={() => setChecked((s) => { const n = new Set(s); if (n.has(q.id)) n.delete(q.id); else n.add(q.id); return n; })} />
                      <span>
                        <span className={`chip-mini ${q.tag === "Your don'ts" ? 'tone-cardinal' : 'tone-neutral'}`}>{q.tag}</span>
                        <span className="qtext">{q.text}</span>
                        <small className="qwhy">Why: {q.why}</small>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="results-actions">
                <button type="button" className="secondary-button" onClick={copy}><Icon name="copy" size={14} /> {copied ? 'Copied' : 'Copy selected'}</button>
                <button type="button" className="secondary-button" onClick={() => window.print()}><Icon name="print" size={14} /> Print</button>
              </div>
            </>
          )}
        </section>

        <section className="panel askbot" aria-labelledby="bot-heading">
          <div className="panelhead">
            <h2 id="bot-heading"><Icon name="search" size={18} /> Ask the catalog</h2>
            <span className="badge" title="Keyword retrieval over local verified data. Not a language model.">Rule-based · not AI</span>
          </div>
          <p className="muted small">
            Answers come only from the structured data in this app and link to the official page. Below a confidence floor it says so and points you to an advisor. A server-side, catalog-grounded Bedrock version is the planned upgrade; nothing here pretends to be it.
          </p>

          <div className="thread" aria-live="polite">
            {thread.length === 0 && (
              <div className="sugg">
                {SUGGESTED_QUESTIONS.map((s) => (
                  <button key={s} type="button" className="gchip" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}
            {thread.map((m, i) =>
              m.who === 'you' ? (
                <div key={i} className="msg you"><p>{m.text}</p></div>
              ) : (
                <div key={i} className={`msg bot ${m.result.status}`}>
                  {m.result.status === 'answer' ? (
                    <>
                      <b>{m.result.best.title}</b>
                      <p>{m.result.best.answer}</p>
                      <a href={m.result.best.source.url} target="_blank" rel="noopener noreferrer" className="src">Source: {m.result.best.source.label} ↗</a>
                      <small className="conf">match {Math.round(m.result.confidence * 100)}% · rule-based</small>
                    </>
                  ) : (
                    <>
                      <b>I'm not sure about that one.</b>
                      <p>I only answer from the verified major, learning-community and FAQ data in this prototype. For this question, talk to an ISU academic advisor.</p>
                      {m.result.alternatives.length > 0 && (
                        <p className="small muted">Closest topics: {m.result.alternatives.map((a) => a.title).join(' · ')}</p>
                      )}
                      <a href="https://www.advising.iastate.edu/" target="_blank" rel="noopener noreferrer" className="src">ISU Academic Advising ↗</a>
                    </>
                  )}
                </div>
              )
            )}
            {typing && <div className="msg bot"><span className="typing" aria-label="Looking up"><i /><i /><i /></span></div>}
          </div>

          <form className="pillform" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <label htmlFor="ask-input" className="sr-only">Ask a question about majors or learning communities</label>
            <input id="ask-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a major, careers, learning communities…" autoComplete="off" />
            <button type="submit" className="btn-round" aria-label="Send"><Icon name="arrow" size={15} /></button>
          </form>
        </section>
      </div>
    </section>
  );
}
