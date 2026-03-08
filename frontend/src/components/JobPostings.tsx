import { useState } from "react"

interface JobPostingsProps {
  onAnalyze: (postings: string[]) => void
  loading: boolean
  hasSkills: boolean
}

export default function JobPostings({ onAnalyze, loading, hasSkills }: JobPostingsProps) {
  const [postings, setPostings] = useState<string[]>([""])

  function updatePosting(index: number, value: string) {
    const updated = [...postings]
    updated[index] = value
    setPostings(updated)
  }

  function addPosting() {
    if (postings.length < 5) setPostings([...postings, ""])
  }

  function removePosting(index: number) {
    setPostings(postings.filter((_, i) => i !== index))
  }

  function handleAnalyze() {
    const filled = postings.filter(p => p.trim().length > 0)
    if (filled.length > 0) onAnalyze(filled)
  }

  const canAnalyze = !loading && hasSkills && postings.some(p => p.trim().length > 0)
  const filledCount = postings.filter(p => p.trim().length > 0).length

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className="font-head font-semibold text-sm"
            style={{ color: "var(--text-hi)", letterSpacing: "-0.02em" }}
          >
            Job Descriptions
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-lo)" }}>
            Paste one or more role descriptions to compare against your skills
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {filledCount > 0 && (
            <span
              className="font-mono text-xs px-2 py-0.5 rounded"
              style={{
                background: "var(--cyan-soft)",
                color: "var(--cyan)",
                border: "1px solid var(--cyan-border)",
              }}
            >
              {filledCount}/{postings.length}
            </span>
          )}
          {postings.length < 5 && (
            <button
              onClick={addPosting}
              className="text-xs font-semibold transition-colors duration-150"
              style={{ color: "var(--text-lo)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-lo)")}
            >
              + Add role
            </button>
          )}
        </div>
      </div>

      {/* Textareas */}
      <div className="space-y-3">
        {postings.map((posting, index) => (
          <div key={index} className="anim-fadeIn">
            {postings.length > 1 && (
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium" style={{ color: "var(--text-lo)" }}>
                  Role {index + 1}
                </span>
                <button
                  onClick={() => removePosting(index)}
                  className="text-xs transition-colors duration-150"
                  style={{ color: "var(--text-lo)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--red)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-lo)")}
                >
                  remove
                </button>
              </div>
            )}
            <textarea
              value={posting}
              onChange={e => updatePosting(index, e.target.value)}
              placeholder="Paste a job description here…"
              className="dark-input w-full resize-none"
              style={{ height: "140px", padding: "12px 14px", lineHeight: "1.6" }}
            />
          </div>
        ))}
      </div>

      {/* ── Run Match CTA ── */}
      <div className="mt-6">
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className="btn-primary"
          style={canAnalyze ? {
            background: "linear-gradient(135deg, var(--cyan), var(--violet))",
            color: "var(--bg)",
            boxShadow: "0 0 24px var(--cyan-glow), 0 4px 16px rgba(0,0,0,0.2)",
          } : undefined}
          onMouseEnter={e => {
            if (canAnalyze) {
              const el = e.currentTarget as HTMLElement
              el.style.filter = "brightness(1.08)"
              el.style.boxShadow = "0 0 36px var(--cyan-glow), 0 6px 20px rgba(0,0,0,0.25)"
              el.style.transform = "translateY(-1px)"
            }
          }}
          onMouseLeave={e => {
            if (canAnalyze) {
              const el = e.currentTarget as HTMLElement
              el.style.filter = ""
              el.style.boxShadow = "0 0 24px var(--cyan-glow), 0 4px 16px rgba(0,0,0,0.2)"
              el.style.transform = ""
            }
          }}
        >
          {loading ? (
            <>
              <span
                className="w-4 h-4 rounded-full border-2 animate-spin shrink-0"
                style={{ borderTopColor: "transparent" }}
              />
              Matching skills…
            </>
          ) : (
            <>Run Match</>
          )}
        </button>
      </div>
    </div>
  )
}
