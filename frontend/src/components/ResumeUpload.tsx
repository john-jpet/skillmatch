import { useState, useRef } from "react"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080"

interface ResumeUploadProps {
  onSkillsExtracted: (skills: string[]) => void
  onLoadingChange?: (loading: boolean) => void
}

export default function ResumeUpload({ onSkillsExtracted, onLoadingChange }: ResumeUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filename, setFilename] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [hover, setHover] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function processFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large — maximum size is 5 MB")
      return
    }
    setFilename(file.name)
    setLoading(true)
    setError("")
    onLoadingChange?.(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${API_URL}/upload-resume`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || "Upload failed")
      }
      const data = await res.json()
      onSkillsExtracted(data.skills)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      onLoadingChange?.(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const isReady = !!filename && !error && !loading

  /* ── Derived hover flags ──
     dragOver always wins; hover only meaningful when not loading */
  const isHovered = hover && !loading && !dragOver

  /* ── Zone border — priority: loading > dragOver > hover > base ── */
  const zoneBorder = loading
    ? "var(--cyan-border)"
    : dragOver
    ? "var(--cyan)"
    : isReady && isHovered
    ? "var(--green)"
    : isReady
    ? "var(--green-border)"
    : isHovered
    ? "var(--cyan-border)"
    : "var(--border)"

  /* ── Zone background ── */
  const zoneBg = loading
    ? "var(--cyan-soft)"
    : dragOver
    ? "rgba(34,211,238,0.05)"
    : isReady
    ? "var(--green-soft)"
    : isHovered
    ? "var(--cyan-soft)"
    : "transparent"

  /* ── Zone scale ── */
  const zoneScale = dragOver ? "scale(1.01)" : isHovered ? "scale(1.005)" : undefined

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className="font-head font-semibold text-sm"
            style={{ color: "var(--text-hi)", letterSpacing: "-0.02em" }}
          >
            Resume
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-lo)" }}>
            Upload a PDF or DOCX to pull skills automatically
          </p>
        </div>
        {isReady && (
          <span
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded anim-fadeIn"
            style={{
              background: "var(--green-soft)",
              color: "var(--green)",
              border: "1px solid var(--green-border)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Done
          </span>
        )}
      </div>

      {/* Drop zone */}
      <div
        onClick={() => !loading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="rounded-lg text-center cursor-pointer transition-all duration-200"
        style={{
          border: `2px dashed ${zoneBorder}`,
          background: zoneBg,
          padding: "28px 20px",
          transform: zoneScale,
        }}
      >
        <input ref={inputRef} type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />

        {loading ? (
          /* ── Skeleton loading ── */
          <div className="flex flex-col items-center gap-3">
            <div className="space-y-2 w-full max-w-xs mx-auto">
              <div className="skeleton mx-auto" style={{ height: "10px", width: "60%", animationDelay: "0ms" }} />
              <div className="skeleton mx-auto" style={{ height: "10px", width: "80%", animationDelay: "100ms" }} />
              <div className="skeleton mx-auto" style={{ height: "10px", width: "45%", animationDelay: "200ms" }} />
            </div>
            <p className="text-xs font-mono" style={{ color: "var(--cyan)" }}>Reading resume…</p>
          </div>

        ) : isReady ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-2 anim-fadeIn">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{
                background: isHovered ? "rgba(52,211,153,0.16)" : "var(--green-soft)",
                border: `1px solid ${isHovered ? "var(--green)" : "var(--green-border)"}`,
                transform: isHovered ? "scale(1.1)" : undefined,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                viewBox="0 0 24 24" stroke="var(--green)" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold font-mono transition-colors duration-200"
              style={{ color: "var(--text-hi)" }}>
              {filename}
            </p>
            <p className="text-xs font-medium transition-colors duration-200"
              style={{ color: isHovered ? "var(--green)" : "var(--text-lo)" }}>
              {isHovered ? "↑ Click to replace" : "Click to replace"}
            </p>
          </div>

        ) : (
          /* ── Default / drag state ── */
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{
                background: dragOver || isHovered ? "var(--cyan-glow)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${dragOver || isHovered ? "var(--cyan-border)" : "var(--border)"}`,
                transform: isHovered ? "scale(1.12)" : undefined,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"
                stroke={dragOver || isHovered ? "var(--cyan)" : "var(--text-lo)"}
                strokeWidth={1.75}
                style={{ transition: "stroke 0.2s ease" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold transition-colors duration-200"
                style={{ color: dragOver ? "var(--cyan)" : isHovered ? "var(--text-hi)" : "var(--text-hi)" }}>
                {dragOver ? "Release to upload" : "Drop your resume here"}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-lo)" }}>
                or{" "}
                <span
                  style={{
                    color: "var(--cyan)",
                    cursor: "pointer",
                    textDecoration: isHovered ? "underline" : "none",
                    transition: "text-decoration 0.15s ease",
                  }}
                >
                  browse files
                </span>
                {" "}· PDF or DOCX
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p
          className="mt-3 text-xs px-3 py-2 rounded anim-fadeIn font-mono"
          style={{ background: "var(--red-soft)", color: "var(--red)", border: "1px solid var(--red-border)" }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
