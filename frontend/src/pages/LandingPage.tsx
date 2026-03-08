import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import SkillMatchLogo from "../components/SkillMatchLogo"

export default function LandingPage() {
  const navigate = useNavigate()

  // Apply saved theme synchronously before first paint
  useEffect(() => {
    const saved = localStorage.getItem("sm-theme") || "dark"
    document.documentElement.setAttribute("data-theme", saved)
  }, [])

  return (
    <div
      className="relative min-h-screen overflow-hidden dot-grid flex flex-col items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
    >
      {/* ── Orb 1 — cyan, upper-left ─────────────────────────────────────── */}
      <div
        aria-hidden
        className="orb-pulse"
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.32) 0%, transparent 65%)",
          filter: "blur(80px)",
          animationDelay: "0s",
        }}
      />

      {/* ── Orb 2 — violet, lower-right ──────────────────────────────────── */}
      <div
        aria-hidden
        className="orb-pulse"
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-5%",
          width: "620px",
          height: "620px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.26) 0%, transparent 65%)",
          filter: "blur(100px)",
          animationDelay: "-3s",
        }}
      />

      {/* ── Orb 3 — cyan, upper-right (dim) ──────────────────────────────── */}
      <div
        aria-hidden
        className="orb-pulse"
        style={{
          position: "absolute",
          top: "5%",
          right: "8%",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.16) 0%, transparent 65%)",
          filter: "blur(80px)",
          animationDelay: "-5s",
        }}
      />

      {/* ── Content (above orbs) ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">

        {/* Wordmark logo */}
        <div className="mb-4 anim-fadeUp" style={{ animationDelay: "0ms" }}>
          <SkillMatchLogo expanded={true} size="lg" />
        </div>

        {/* Tagline */}
        <p
          className="mt-4 anim-fadeUp"
          style={{
            fontSize: "17px",
            color: "var(--text-lo)",
            lineHeight: 1.6,
            maxWidth: "360px",
            animationDelay: "60ms",
          }}
        >
          Upload your resume. Paste a job description.
          <br />
          Know exactly where you stand.
        </p>

        {/* Feature pills */}
        <div
          className="flex flex-wrap justify-center gap-2 mt-6 anim-fadeUp"
          style={{ animationDelay: "120ms" }}
        >
          {["Resume parsing", "Skill matching", "Gap analysis", "Multi-role compare"].map(f => (
            <span
              key={f}
              className="font-mono text-xs px-3 py-1 rounded-full"
              style={{
                background: "var(--lifted)",
                color: "var(--text-lo)",
                border: "1px solid var(--border)",
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/app")}
          className="btn-primary mt-10 anim-fadeUp"
          style={{
            background: "linear-gradient(135deg, var(--cyan), var(--violet))",
            color: "var(--bg)",
            boxShadow: "0 0 28px var(--cyan-glow), 0 4px 16px rgba(0,0,0,0.25)",
            fontSize: "15px",
            padding: "12px 32px",
            animationDelay: "180ms",
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

        {/* Footer note */}
        <p
          className="mt-8 font-mono text-[11px] anim-fadeUp"
          style={{ color: "var(--text-lo)", animationDelay: "240ms" }}
        >
          36,944-skill taxonomy · runs locally · no data stored
        </p>
      </div>
    </div>
  )
}
