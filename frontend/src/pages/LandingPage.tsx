import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import SkillMatchLogo from "../components/SkillMatchLogo"

/* ─── Static example data ────────────────────────────────────────────────── */
const EXAMPLE = {
  title: "Software Engineer · Backend",
  score: 74,
  matched: ["Python", "SQL", "REST APIs", "Git", "FastAPI", "Linux", "PostgreSQL"],
  missing: ["Kubernetes", "Docker", "Distributed Systems"],
}

const HOW_STEPS = [
  {
    num: "01",
    label: "Upload your resume",
    desc: "Drop a PDF or DOCX. We extract your skills automatically and build a customizable profile.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    num: "02",
    label: "Paste job descriptions",
    desc: "Add up to 5 role descriptions at once. We automatically identify every required skill.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    num: "03",
    label: "Get your match score",
    desc: "Instant fit score for every role. See exactly which skills you have and which you're missing.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

/* ─── LandingPage ────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem("sm-theme") || "dark"
    document.documentElement.setAttribute("data-theme", saved)
  }, [])

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ══════════════════════════════════════════════════════════════════════
          Hero — unchanged visually, now its own section
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen overflow-hidden dot-grid flex flex-col items-center justify-center px-6"
      >
        {/* Orb 1 — cyan, upper-left */}
        <div aria-hidden className="orb-pulse" style={{
          position: "absolute", top: "-20%", left: "-10%",
          width: "700px", height: "700px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.32) 0%, transparent 65%)",
          filter: "blur(80px)", animationDelay: "0s",
        }} />

        {/* Orb 2 — violet, lower-right */}
        <div aria-hidden className="orb-pulse" style={{
          position: "absolute", bottom: "-15%", right: "-5%",
          width: "620px", height: "620px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.26) 0%, transparent 65%)",
          filter: "blur(100px)", animationDelay: "-3s",
        }} />

        {/* Orb 3 — cyan dim, upper-right */}
        <div aria-hidden className="orb-pulse" style={{
          position: "absolute", top: "5%", right: "8%",
          width: "380px", height: "380px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.16) 0%, transparent 65%)",
          filter: "blur(80px)", animationDelay: "-5s",
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
          <div className="mb-4 anim-fadeUp" style={{ animationDelay: "0ms" }}>
            <SkillMatchLogo expanded={true} size="lg" />
          </div>

          <p className="mt-4 anim-fadeUp" style={{
            fontSize: "17px", color: "var(--text-lo)", lineHeight: 1.6,
            maxWidth: "360px", animationDelay: "60ms",
          }}>
            Upload your resume. Paste a job description.
            <br />Know exactly where you stand.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-6 anim-fadeUp" style={{ animationDelay: "120ms" }}>
            {["Resume parsing", "Skill matching", "Gap analysis", "Multi-role compare"].map(f => (
              <span key={f} className="font-mono text-xs px-3 py-1 rounded-full" style={{
                background: "var(--lifted)", color: "var(--text-lo)", border: "1px solid var(--border)",
              }}>
                {f}
              </span>
            ))}
          </div>

          <button
            onClick={() => navigate("/app")}
            className="btn-primary mt-10 anim-fadeUp"
            style={{
              background: "linear-gradient(135deg, var(--cyan), var(--violet))",
              color: "var(--bg)",
              boxShadow: "0 0 28px var(--cyan-glow), 0 4px 16px rgba(0,0,0,0.25)",
              fontSize: "15px", padding: "12px 32px", animationDelay: "180ms",
              transition: "filter 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.filter = "brightness(1.08)"
              el.style.boxShadow = "0 0 44px var(--cyan-glow), 0 6px 20px rgba(0,0,0,0.3)"
              el.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.filter = ""
              el.style.boxShadow = "0 0 28px var(--cyan-glow), 0 4px 16px rgba(0,0,0,0.25)"
              el.style.transform = ""
            }}
          >
            Get Started
          </button>

        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 animate-bounce"
          style={{ transform: "translateX(-50%)", color: "var(--text-lo)" }}
          aria-hidden
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          Example Analysis
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 px-6 flex flex-col items-center"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {/* Section heading */}
        <div className="text-center mb-12" style={{ maxWidth: "480px" }}>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] mb-3" style={{ color: "var(--cyan)" }}>
            In Practice
          </p>
          <h2 className="font-head font-bold" style={{
            fontSize: "28px", color: "var(--text-hi)", letterSpacing: "-0.04em", lineHeight: 1.1,
          }}>
            The gap, made visible
          </h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-lo)" }}>
            A backend engineer resume against a real job posting. This is what lands in your results panel.
          </p>
        </div>

        {/* Example card */}
        <div style={{
          width: "100%", maxWidth: "580px",
          background: "var(--surface)",
          border: "1px solid var(--border-hi)",
          borderRadius: "12px",
          boxShadow: "0 0 48px rgba(34,211,238,0.07), 0 16px 48px rgba(0,0,0,0.45)",
          overflow: "hidden",
        }}>
          {/* Card header */}
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] mb-1" style={{ color: "var(--text-lo)" }}>
                Analyzed Role
              </p>
              <p className="font-head font-semibold text-sm" style={{ color: "var(--text-hi)", letterSpacing: "-0.02em" }}>
                {EXAMPLE.title}
              </p>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span
                className="font-mono font-bold"
                style={{
                  fontSize: "26px", lineHeight: 1,
                  color: "var(--green)",
                }}
              >
                {EXAMPLE.score}%
              </span>
              <span className="font-mono text-[10px]" style={{ color: "var(--text-lo)" }}>match score</span>
            </div>
          </div>

          {/* Skills grid — two columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Matched */}
            <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.10em] mb-3" style={{ color: "var(--green)" }}>
                Matched Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLE.matched.map(s => (
                  <span key={s} className="result-tag result-tag--matched">{s}</span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.10em] mb-3" style={{ color: "var(--red)" }}>
                Missing Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLE.missing.map(s => (
                  <span key={s} className="result-tag result-tag--missing">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Card footer */}
          <div className="px-6 py-3 flex items-center gap-2" style={{ background: "var(--panel)" }}>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--lifted)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${EXAMPLE.score}%`,
                  background: "linear-gradient(90deg, var(--cyan), var(--green))",
                }}
              />
            </div>
            <span className="font-mono text-[10px] shrink-0" style={{ color: "var(--text-lo)" }}>
              {EXAMPLE.matched.length} matched · {EXAMPLE.missing.length} missing
            </span>
          </div>
        </div>

        {/* Secondary CTA */}
        <p className="mt-10 text-sm" style={{ color: "var(--text-lo)" }}>
          Ready to run your own?{" "}
          <button
            onClick={() => navigate("/app")}
            className="font-semibold"
            style={{ color: "var(--cyan)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
          >
            Get started →
          </button>
        </p>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          How It Works
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-6 flex flex-col items-center"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="text-center mb-12" style={{ maxWidth: "480px" }}>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] mb-3" style={{ color: "var(--violet)" }}>
            The Process
          </p>
          <h2 className="font-head font-bold" style={{
            fontSize: "28px", color: "var(--text-hi)", letterSpacing: "-0.04em", lineHeight: 1.1,
          }}>
            Drop in. Get signal.
          </h2>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          style={{ width: "100%", maxWidth: "720px" }}
        >
          {HOW_STEPS.map(step => (
            <div key={step.num} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "24px",
            }}>
              {/* Step number + icon */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[11px] font-semibold" style={{ color: "var(--cyan)" }}>
                  {step.num}
                </span>
                <div style={{ color: "var(--cyan)", opacity: 0.7 }}>
                  {step.icon}
                </div>
              </div>
              <p className="font-head font-semibold text-sm mb-2" style={{ color: "var(--text-hi)", letterSpacing: "-0.02em" }}>
                {step.label}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-lo)" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          Footer
      ══════════════════════════════════════════════════════════════════════ */}
      <footer
        className="py-8 px-6 flex flex-wrap items-center justify-between gap-4"
        style={{ borderTop: "1px solid var(--border)", maxWidth: "720px", margin: "0 auto" }}
      >
        <SkillMatchLogo expanded={true} size="sm" />
        <p className="font-mono text-[10px]" style={{ color: "var(--text-lo)" }}>
          36,944-skill taxonomy · v0.1.0 · no data stored
        </p>
      </footer>

    </div>
  )
}
