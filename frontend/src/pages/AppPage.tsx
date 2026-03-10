import { useState, useEffect, useRef } from "react"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080"
import type { MatchResult } from "../types"
import ResumeUpload from "../components/ResumeUpload"
import SkillTags from "../components/SkillTags"
import SkillPicker from "../components/SkillPicker"
import JobPostings from "../components/JobPostings"
import InsightPanel from "../components/InsightPanel"
import SkillMatchLogo from "../components/SkillMatchLogo"
import { useWindowWidth } from "../hooks/useWindowWidth"

type Theme = "dark" | "light"

/* ─── Nav items ─────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    id: "resume", label: "Workspace",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
  {
    id: "history", label: "History",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    id: "settings", label: "Settings",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
]

/* ─── Theme toggle control ──────────────────────────────────────────────── */
function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  return (
    <div className="theme-toggle">
      <button
        onClick={() => onChange("dark")}
        className={`theme-toggle-btn ${theme === "dark" ? "active" : ""}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        Dark
      </button>
      <button
        onClick={() => onChange("light")}
        className={`theme-toggle-btn ${theme === "light" ? "active" : ""}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        Light
      </button>
    </div>
  )
}

/* ─── Settings panel ────────────────────────────────────────────────────── */
function SettingsPanel({
  theme, onThemeChange, analyzeCount, onClearSession,
}: {
  theme: Theme
  onThemeChange: (t: Theme) => void
  analyzeCount: number
  onClearSession: () => void
}) {
  const MAX_DAILY = 10
  const remaining = Math.max(0, MAX_DAILY - analyzeCount)

  const remainingColor =
    remaining === 0 ? "var(--red)"
    : remaining <= 3 ? "var(--amber)"
    : "var(--text-lo)"

  return (
    <div className="max-w-2xl space-y-5">
      {/* Header */}
      <div className="anim-fadeUp mb-8" style={{ animationDelay: "0ms" }}>
        <h1
          className="font-head font-bold"
          style={{ fontSize: "32px", color: "var(--text-hi)", letterSpacing: "-0.04em", lineHeight: 1 }}
        >
          Settings
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-lo)" }}>
          Preferences and workspace configuration
        </p>
      </div>

      {/* Appearance card */}
      <div className="card anim-fadeUp" style={{ animationDelay: "60ms" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3
            className="font-head font-semibold text-sm"
            style={{ color: "var(--text-hi)", letterSpacing: "-0.02em" }}
          >
            Appearance
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-lo)" }}>
            Interface and visual preferences
          </p>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-hi)" }}>Color scheme</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-lo)" }}>
                Switch between dark and light appearance
              </p>
            </div>
            <ThemeToggle theme={theme} onChange={onThemeChange} />
          </div>
        </div>
      </div>

      {/* Application details card */}
      <div className="card anim-fadeUp" style={{ animationDelay: "120ms" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3
            className="font-head font-semibold text-sm"
            style={{ color: "var(--text-hi)", letterSpacing: "-0.02em" }}
          >
            Application
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-lo)" }}>
            Build and usage details
          </p>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--text)" }}>Version</p>
            <p className="font-mono text-xs" style={{ color: "var(--text-lo)" }}>0.1.0</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--text)" }}>Taxonomy</p>
            <p className="font-mono text-xs" style={{ color: "var(--text-lo)" }}>36,944 skills · GPL2 licensed</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--text)" }}>Analyses remaining today</p>
            <p className="font-mono text-xs font-semibold" style={{ color: remainingColor }}>
              {remaining}
            </p>
          </div>
        </div>
      </div>

      {/* Session card */}
      <div className="card anim-fadeUp" style={{ animationDelay: "180ms" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3
            className="font-head font-semibold text-sm"
            style={{ color: "var(--text-hi)", letterSpacing: "-0.02em" }}
          >
            Session
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-lo)" }}>
            Reset session data without leaving the page
          </p>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-hi)" }}>Clear session</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-lo)" }}>
                Resets skills, results, and history
              </p>
            </div>
            <button
              onClick={onClearSession}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150"
              style={{
                color: "var(--red)",
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.20)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = "rgba(248,113,113,0.14)"
                el.style.borderColor = "rgba(248,113,113,0.35)"
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = "rgba(248,113,113,0.08)"
                el.style.borderColor = "rgba(248,113,113,0.20)"
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── History panel helpers ─────────────────────────────────────────────── */
function fitColor(score: number) {
  if (score >= 0.70) return "var(--green)"
  if (score >= 0.40) return "var(--amber)"
  return "var(--red)"
}
function fitBg(score: number) {
  if (score >= 0.70) return "rgba(52,211,153,0.10)"
  if (score >= 0.40) return "rgba(245,158,11,0.10)"
  return "rgba(248,113,113,0.10)"
}
function fitBorder(score: number) {
  if (score >= 0.70) return "rgba(52,211,153,0.25)"
  if (score >= 0.40) return "rgba(245,158,11,0.25)"
  return "rgba(248,113,113,0.25)"
}

/* ─── History panel ─────────────────────────────────────────────────────── */
function HistoryPanel({ history }: { history: Record<string, MatchResult> }) {
  const allResults = Object.values(history).filter(r => !r.error)
  const totalEntries = Object.keys(history).length
  const totalScored  = allResults.length

  type Agg = { avgScore: number; topMissing: [string, number][]; topMatched: [string, number][] }
  let agg: Agg | null = null
  if (totalScored > 0) {
    const mc: Record<string, number> = {}
    const hc: Record<string, number> = {}
    for (const r of allResults) {
      for (const s of r.missing) mc[s] = (mc[s] || 0) + 1
      for (const s of r.matched) hc[s] = (hc[s] || 0) + 1
    }
    agg = {
      avgScore: allResults.reduce((sum, r) => sum + r.fit_score, 0) / totalScored,
      topMissing: Object.entries(mc).sort((a, b) => b[1] - a[1]).slice(0, 6),
      topMatched: Object.entries(hc).sort((a, b) => b[1] - a[1]).slice(0, 6),
    }
  }

  const entries = Object.values(history).sort((a, b) => b.fit_score - a.fit_score)

  return (
    <div className="max-w-2xl space-y-5">
      {/* Header */}
      <div className="anim-fadeUp mb-8" style={{ animationDelay: "0ms" }}>
        <h1
          className="font-head font-bold"
          style={{ fontSize: "32px", color: "var(--text-hi)", letterSpacing: "-0.04em", lineHeight: 1 }}
        >
          History
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-lo)" }}>
          Your past analyses, all in one place
        </p>
      </div>

      {totalEntries === 0 ? (
        <div
          className="card p-12 anim-fadeUp flex flex-col items-center text-center gap-5"
          style={{ animationDelay: "60ms" }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: "var(--lifted)", border: "1px solid var(--border-hi)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"
              stroke="var(--text-lo)" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-head font-semibold text-sm"
              style={{ color: "var(--text-hi)", letterSpacing: "-0.02em" }}>
              No analyses yet
            </p>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--text-lo)" }}>
              Paste job postings and hit{" "}
              <span style={{ color: "var(--cyan)" }}>Run Match</span>{" "}
              to see results here.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Session summary card */}
          {agg && (
            <div className="card anim-fadeUp" style={{ animationDelay: "60ms" }}>
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div>
                  <h3 className="font-head font-semibold text-sm"
                    style={{ color: "var(--text-hi)", letterSpacing: "-0.02em" }}>
                    Session Summary
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-lo)" }}>
                    {totalEntries} unique {totalEntries === 1 ? "posting" : "postings"} analyzed
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className="font-mono font-bold"
                    style={{ fontSize: "30px", color: fitColor(agg.avgScore), lineHeight: 1 }}
                  >
                    {Math.round(agg.avgScore * 100)}
                  </span>
                  <span className="font-mono text-xs" style={{ color: "var(--text-lo)" }}>% avg</span>
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div className="px-6 py-5" style={{ borderRight: "1px solid var(--border)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.10em] mb-3"
                    style={{ color: "var(--red)" }}>
                    Top Gaps
                  </p>
                  {agg.topMissing.length === 0 ? (
                    <p className="text-xs italic" style={{ color: "var(--text-lo)" }}>None</p>
                  ) : (
                    <div className="space-y-2">
                      {agg.topMissing.map(([skill, count]) => (
                        <div key={skill} className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs truncate" style={{ color: "var(--text-hi)" }}>
                            {skill}
                          </span>
                          <span className="font-mono text-[10px] shrink-0"
                            style={{
                              color: "rgba(248,113,113,0.85)",
                              background: "rgba(248,113,113,0.08)",
                              border: "1px solid rgba(248,113,113,0.18)",
                              padding: "1px 6px", borderRadius: "4px",
                            }}>
                            {count}/{totalScored}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-6 py-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.10em] mb-3"
                    style={{ color: "var(--green)" }}>
                    Top Strengths
                  </p>
                  {agg.topMatched.length === 0 ? (
                    <p className="text-xs italic" style={{ color: "var(--text-lo)" }}>None</p>
                  ) : (
                    <div className="space-y-2">
                      {agg.topMatched.map(([skill, count]) => (
                        <div key={skill} className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs truncate" style={{ color: "var(--text-hi)" }}>
                            {skill}
                          </span>
                          <span className="font-mono text-[10px] shrink-0"
                            style={{
                              color: "rgba(52,211,153,0.85)",
                              background: "rgba(52,211,153,0.08)",
                              border: "1px solid rgba(52,211,153,0.18)",
                              padding: "1px 6px", borderRadius: "4px",
                            }}>
                            {count}/{totalScored}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Flat posting list */}
          <div className="card anim-fadeUp" style={{ animationDelay: "120ms" }}>
            <div className="px-5 py-3.5 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 className="font-head font-semibold text-sm"
                style={{ color: "var(--text-hi)", letterSpacing: "-0.02em" }}>
                Analyzed Postings
              </h3>
              <span className="font-mono text-[10px]"
                style={{
                  color: "var(--cyan)", background: "var(--cyan-soft)",
                  border: "1px solid var(--cyan-border)",
                  padding: "1px 7px", borderRadius: "4px",
                }}>
                {totalEntries}
              </span>
            </div>

            <div>
              {entries.map((r, i) => (
                <div key={i} className="px-5 py-4"
                  style={{ borderBottom: i < entries.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div className="flex items-start gap-3 mb-2.5">
                    <p className="text-xs leading-relaxed flex-1 min-w-0" style={{ color: "var(--text)" }}>
                      {r.posting}
                    </p>
                    {r.error ? (
                      <span className="font-mono text-[10px] shrink-0 px-2 py-0.5 rounded"
                        style={{
                          color: "var(--red)",
                          background: "rgba(248,113,113,0.08)",
                          border: "1px solid rgba(248,113,113,0.20)",
                        }}>
                        Error
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-bold shrink-0 px-2 py-0.5 rounded"
                        style={{
                          color: fitColor(r.fit_score),
                          background: fitBg(r.fit_score),
                          border: `1px solid ${fitBorder(r.fit_score)}`,
                          minWidth: "42px", textAlign: "center",
                        }}>
                        {Math.round(r.fit_score * 100)}%
                      </span>
                    )}
                  </div>

                  {r.error ? (
                    <p className="text-xs italic" style={{ color: "var(--text-lo)" }}>{r.error}</p>
                  ) : (
                    <div className="space-y-1.5">
                      {r.matched.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-[10px] font-bold shrink-0"
                            style={{ color: "var(--green)", width: "14px" }}>✓</span>
                          {r.matched.slice(0, 8).map(s => (
                            <span key={s} className="font-mono text-[10px] px-1.5 py-px rounded"
                              style={{
                                color: "rgba(52,211,153,0.85)",
                                background: "rgba(52,211,153,0.07)",
                                border: "1px solid rgba(52,211,153,0.15)",
                              }}>
                              {s}
                            </span>
                          ))}
                          {r.matched.length > 8 && (
                            <span className="font-mono text-[10px]" style={{ color: "var(--text-lo)" }}>
                              +{r.matched.length - 8}
                            </span>
                          )}
                        </div>
                      )}
                      {r.missing.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-[10px] font-bold shrink-0"
                            style={{ color: "var(--red)", width: "14px" }}>✗</span>
                          {r.missing.slice(0, 8).map(s => (
                            <span key={s} className="font-mono text-[10px] px-1.5 py-px rounded"
                              style={{
                                color: "rgba(248,113,113,0.85)",
                                background: "rgba(248,113,113,0.07)",
                                border: "1px solid rgba(248,113,113,0.15)",
                              }}>
                              {s}
                            </span>
                          ))}
                          {r.missing.length > 8 && (
                            <span className="font-mono text-[10px]" style={{ color: "var(--text-lo)" }}>
                              +{r.missing.length - 8}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ─── Sidebar ───────────────────────────────────────────────────────────── */
function Sidebar({ active, onNav }: { active: string; onNav: (id: string) => void }) {
  const width = useWindowWidth()
  return (
    <aside
      className="w-52 shrink-0 flex flex-col"
      style={{ background: "var(--sidebar)", borderRight: "1px solid var(--border)" }}
    >
      {/* Brand */}
      <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <SkillMatchLogo expanded={width >= 1024} size="sm" />
      </div>

      {/* Nav section label */}
      <div className="px-4 pt-5 pb-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-lo)" }}>
          Workspace
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-4 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const isActive = item.id === active
          return (
            <div key={item.id} className="relative">
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 rounded-r-full"
                  style={{ width: "2px", background: "var(--cyan)" }}
                />
              )}
              <button
                onClick={() => onNav(item.id)}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                {item.icon}
                {item.label}
              </button>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="font-mono text-[10px]" style={{ color: "var(--text-lo)" }}>v0.1.0</p>
      </div>
    </aside>
  )
}

/* ─── Skill skeleton ────────────────────────────────────────────────────── */
function SkillSkeleton() {
  const widths = [68, 88, 58, 82, 72, 64, 78, 52, 92, 66, 74, 56]
  return (
    <div className="flex flex-wrap gap-1.5">
      {widths.map((w, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ width: `${w}px`, height: "24px", animationDelay: `${i * 55}ms` }}
        />
      ))}
    </div>
  )
}

/* ─── Main workspace ────────────────────────────────────────────────────── */
interface WorkspaceProps {
  skills: string[]
  resumeLoading: boolean
  analyzing: boolean
  onSkillsExtracted: (s: string[]) => void
  onLoadingChange: (v: boolean) => void
  onRemove: (s: string) => void
  onAdd: (s: string) => void
  onAnalyze: (postings: string[]) => void
}
function Workspace({
  skills, resumeLoading, analyzing,
  onSkillsExtracted, onLoadingChange, onRemove, onAdd, onAnalyze,
}: WorkspaceProps) {
  const hasSkills = skills.length > 0

  return (
    <div className="max-w-2xl space-y-5">
      {/* Page header */}
      <div className="anim-fadeUp mb-8" style={{ animationDelay: "0ms" }}>
        <h1
          className="font-head font-bold"
          style={{ fontSize: "32px", color: "var(--text-hi)", letterSpacing: "-0.04em", lineHeight: 1 }}
        >
          Role Fit
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-lo)" }}>
          Drop a resume. Paste a role. Know where you stand.
        </p>
      </div>

      {/* Resume upload */}
      <div className="anim-fadeUp" style={{ animationDelay: "60ms" }}>
        <ResumeUpload onSkillsExtracted={onSkillsExtracted} onLoadingChange={onLoadingChange} />
      </div>

      {/* Skills card */}
      <div className="card p-5 anim-fadeUp" style={{ animationDelay: "130ms", position: "relative", zIndex: 10 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3
              className="font-head font-semibold text-sm"
              style={{ color: "var(--text-hi)", letterSpacing: "-0.02em" }}
            >
              Skills
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-lo)" }}>
              {resumeLoading
                ? "Parsing your resume…"
                : hasSkills
                ? "Hover to highlight · click to remove"
                : "Pull from a resume or search to add manually"}
            </p>
          </div>
          {hasSkills && !resumeLoading && (
            <span
              className="font-mono text-xs px-2 py-0.5 rounded"
              style={{
                background: "var(--cyan-soft)",
                color: "var(--cyan)",
                border: "1px solid var(--cyan-border)",
              }}
            >
              {skills.length}
            </span>
          )}
        </div>

        {resumeLoading ? (
          <SkillSkeleton />
        ) : hasSkills ? (
          <SkillTags skills={skills} onRemove={onRemove} />
        ) : (
          <p className="text-xs italic" style={{ color: "var(--text-lo)" }}>No skills yet.</p>
        )}

        <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <SkillPicker onAdd={onAdd} existingSkills={skills} />
        </div>
      </div>

      {/* Empty-skills warning — shown above JobPostings when no skills loaded */}
      {!hasSkills && !resumeLoading && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-lg anim-fadeIn"
          style={{
            background: "rgba(245,158,11,0.07)",
            border: "1px solid rgba(245,158,11,0.22)",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24"
            stroke="var(--amber)" strokeWidth={2} className="shrink-0 mt-0.5">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: "var(--amber)" }}>
            Upload a resume or add skills manually before running a match.
          </p>
        </div>
      )}

      {/* Job postings */}
      <div className="anim-fadeUp" style={{ animationDelay: "200ms" }}>
        <JobPostings onAnalyze={onAnalyze} loading={analyzing} hasSkills={hasSkills} />
      </div>
    </div>
  )
}

/* ─── AppPage root ──────────────────────────────────────────────────────── */
export default function AppPage() {
  /* — Theme — */
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("sm-theme") as Theme) || "dark"
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("sm-theme", theme)
  }, [theme])

  /* — Nav — */
  const [active, setActive] = useState("resume")
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" })
  }, [active])

  /* — App state — */
  const [skills, setSkills] = useState<string[]>([])
  const [resumeLoading, setResumeLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<MatchResult[]>([])
  const [history, setHistory] = useState<Record<string, MatchResult>>({})
  const [globalError, setGlobalError] = useState("")
  const [analyzeCount, setAnalyzeCount] = useState<number>(() => {
    const today = new Date().toISOString().slice(0, 10)
    const stored = localStorage.getItem("sm-analyze-count")
    if (!stored) return 0
    try {
      const { date, count } = JSON.parse(stored)
      return date === today ? count : 0
    } catch { return 0 }
  })

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    localStorage.setItem("sm-analyze-count", JSON.stringify({ date: today, count: analyzeCount }))
  }, [analyzeCount])

  function removeSkill(skill: string) {
    setSkills(prev => prev.filter(s => s !== skill))
  }

  function addSkill(skill: string) {
    setSkills(prev => (prev.includes(skill) ? prev : [...prev, skill]))
  }

  async function handleAnalyze(postings: string[]) {
    setAnalyzing(true)
    setResults([])

    try {
      const matchResults: MatchResult[] = []
      const newEntries: Record<string, MatchResult> = {}

      for (const posting of postings) {
        const jdRes = await fetch(`${API_URL}/analyze-posting`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: posting }),
        })

        if (!jdRes.ok) {
          if (jdRes.status === 429) throw new Error("429 rate limit exceeded")
          throw new Error("Failed to analyze posting")
        }

        const jdData = await jdRes.json()

        if (jdData.skills.length === 0) {
          const r: MatchResult = {
            posting: posting.slice(0, 80) + "...",
            fit_score: 0, matched: [], missing: [],
            error: "No technical skills found in this posting.",
          }
          matchResults.push(r)
          newEntries[posting] = r
          continue
        }

        const matchRes = await fetch(`${API_URL}/match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resume_skills: skills, jd_skills: jdData.skills }),
        })
        const matchData = await matchRes.json()

        const r: MatchResult = {
          posting: posting.slice(0, 80) + "...",
          fit_score: matchData.fit_score,
          matched: matchData.matched,
          missing: matchData.missing,
        }
        matchResults.push(r)
        newEntries[posting] = r
      }

      matchResults.sort((a, b) => b.fit_score - a.fit_score)
      setResults(matchResults)
      setHistory(prev => ({ ...prev, ...newEntries }))
    } catch (err: any) {
      if (err.message?.includes("429") || err.message?.includes("rate limit")) {
        setGlobalError("Daily limit reached (10 analyses/day). Try again tomorrow.")
      } else {
        setGlobalError(err.message || "Something went wrong. Please try again.")
      }
    } finally {
      setAnalyzing(false)
      setAnalyzeCount(prev => prev + 1)
    }
  }

  function clearSession() {
    setSkills([])
    setResults([])
    setHistory({})
    setAnalyzeCount(0)
  }

  const isWorkspace = active === "resume"

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <Sidebar active={active} onNav={setActive} />

      <div className="flex flex-1 overflow-hidden">
        {/* Center workspace */}
        <main ref={mainRef} className="flex-1 dot-grid overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
          {/* Workspace stays mounted so ResumeUpload + JobPostings keep their state */}
          <div style={{ display: isWorkspace ? "block" : "none" }}>
            <Workspace
              skills={skills}
              resumeLoading={resumeLoading}
              analyzing={analyzing}
              onSkillsExtracted={setSkills}
              onLoadingChange={setResumeLoading}
              onRemove={removeSkill}
              onAdd={addSkill}
              onAnalyze={handleAnalyze}
            />
          </div>
          {active === "settings" && (
            <SettingsPanel
              theme={theme}
              onThemeChange={setTheme}
              analyzeCount={analyzeCount}
              onClearSession={clearSession}
            />
          )}
          {active === "history" && <HistoryPanel history={history} />}
        </main>

        {/* Insight panel */}
        <InsightPanel results={results} analyzing={analyzing} globalError={globalError} />
      </div>
    </div>
  )
}
