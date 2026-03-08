import { useState, useEffect } from "react"
import type { MatchResult } from "../types"

interface InsightPanelProps {
  results: MatchResult[]
  analyzing: boolean
}

/* ─── Score ring (draws from 0 on mount) ───────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const [drawn, setDrawn] = useState(0)
  const r = 32
  const circumference = 2 * Math.PI * r

  useEffect(() => {
    setDrawn(0)
    const t = setTimeout(() => setDrawn(score), 90)
    return () => clearTimeout(t)
  }, [score])

  const color =
    score >= 0.7 ? "var(--green)"
    : score >= 0.4 ? "var(--amber)"
    : "var(--red)"

  return (
    <div className="relative inline-flex items-center justify-center w-[72px] h-[72px] shrink-0">
      <svg width="72" height="72" viewBox="0 0 72 72">
        {/* Track */}
        <circle cx="36" cy="36" r={r} stroke="var(--border-hi)" strokeWidth="6" fill="none" />
        {/* Arc */}
        <circle
          cx="36" cy="36" r={r}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - drawn * circumference}
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <span
        className="absolute font-head font-bold leading-none"
        style={{ fontSize: "13px", color }}
      >
        {Math.round(score * 100)}%
      </span>
    </div>
  )
}

/* ─── Skeleton result card ─────────────────────────────────────────────── */
function SkeletonCard({ delay }: { delay: number }) {
  return (
    <div
      className="rounded-lg p-4 space-y-3 anim-fadeIn"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-2 pt-1">
          <div className="skeleton" style={{ height: "9px", width: "50px" }} />
          <div className="skeleton" style={{ height: "9px", width: "100%" }} />
          <div className="skeleton" style={{ height: "9px", width: "70%" }} />
        </div>
        <div className="skeleton rounded-full shrink-0" style={{ width: "72px", height: "72px" }} />
      </div>
      <div className="skeleton" style={{ height: "9px", width: "55px" }} />
      <div className="flex flex-wrap gap-1">
        {[55, 70, 48].map((w, i) => (
          <div key={i} className="skeleton" style={{ width: `${w}px`, height: "20px", animationDelay: `${i * 70}ms` }} />
        ))}
      </div>
    </div>
  )
}

/* ─── Result card ──────────────────────────────────────────────────────── */
function ResultCard({ result, rank, delay }: { result: MatchResult; rank: number; delay: number }) {
  const isBest = rank === 1 && !result.error

  return (
    <div
      className="rounded-lg p-4 space-y-3 anim-slideRight"
      style={{
        background: "var(--surface)",
        border: `1px solid ${isBest ? "var(--violet-border)" : "var(--border)"}`,
        boxShadow: isBest ? "0 0 0 1px var(--violet-soft)" : "none",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-mono text-[10px] font-medium" style={{ color: "var(--text-lo)" }}>
              #{rank}
            </span>
            {isBest && (
              <span
                className="font-mono text-[10px] font-bold px-2 py-0.5 rounded anim-fadeIn"
                style={{
                  background: "var(--violet-soft)",
                  color: "var(--violet)",
                  border: "1px solid var(--violet-border)",
                }}
              >
                top match
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-lo)" }}>
            {result.posting}
          </p>
        </div>
        {!result.error && <ScoreRing score={result.fit_score} />}
      </div>

      {result.error ? (
        <p
          className="font-mono text-[11px] px-3 py-2 rounded"
          style={{
            background: "var(--lifted)",
            color: "var(--text-lo)",
            border: "1px solid var(--border)",
          }}
        >
          {result.error}
        </p>
      ) : (
        <div className="space-y-2.5">
          {result.matched.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold mb-1.5" style={{ color: "var(--green)" }}>
                Matched · {result.matched.length}
              </p>
              <div className="flex flex-wrap gap-1">
                {result.matched.map(s => (
                  <span key={s} className="result-tag result-tag--matched">{s}</span>
                ))}
              </div>
            </div>
          )}

          {result.missing.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold mb-1.5" style={{ color: "var(--red)" }}>
                Missing · {result.missing.length}
              </p>
              <div className="flex flex-wrap gap-1">
                {result.missing.map(s => (
                  <span key={s} className="result-tag result-tag--missing">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Panel ────────────────────────────────────────────────────────────── */
export default function InsightPanel({ results, analyzing }: InsightPanelProps) {
  return (
    <aside
      className="w-80 shrink-0 flex flex-col overflow-hidden"
      style={{ background: "var(--panel)", borderLeft: "1px solid var(--border)" }}
    >
      {/* Panel header */}
      <div className="px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between">
          <h2
            className="font-head font-bold text-sm"
            style={{ color: "var(--text-hi)", letterSpacing: "-0.03em" }}
          >
            Fit Report
          </h2>
          {results.length > 0 && !analyzing && (
            <span
              className="font-mono text-[10px] font-medium px-2 py-0.5 rounded anim-fadeIn"
              style={{
                background: "var(--cyan-soft)",
                color: "var(--cyan)",
                border: "1px solid var(--cyan-border)",
              }}
            >
              {results.length} role{results.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-lo)" }}>
          {analyzing
            ? "Running match…"
            : results.length > 0
            ? "Ranked by match percentage"
            : "Results appear here after analysis"}
        </p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {analyzing ? (
          <>
            <SkeletonCard delay={0} />
            <SkeletonCard delay={120} />
          </>
        ) : results.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center h-64 gap-5 text-center px-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="var(--text-lo)" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p
                className="font-head font-semibold text-sm"
                style={{ color: "var(--text-hi)", letterSpacing: "-0.02em" }}
              >
                Nothing yet
              </p>
              <p className="text-xs leading-relaxed mt-1.5" style={{ color: "var(--text-lo)" }}>
                Upload a resume, paste a role,<br />then hit{" "}
                <span className="font-mono px-0.5" style={{ color: "var(--cyan)" }}>Run Match</span>
              </p>
            </div>
          </div>
        ) : (
          results.map((result, i) => (
            <ResultCard key={i} result={result} rank={i + 1} delay={i * 75} />
          ))
        )}
      </div>
    </aside>
  )
}
