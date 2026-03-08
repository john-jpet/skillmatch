interface SkillMatchLogoProps {
  expanded: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeConfig = {
  //                  font                         wt   boltW  boltH  gap  tracking       maxW-exp   maxW-compact
  sm: { fontSize: '14px',                        fw: 700, boltW: 18, boltH: 18, gap: 0, ls: '-0.02em', expW: '140px', cmpW: '20px' },
  md: { fontSize: '20px',                        fw: 700, boltW: 24, boltH: 24, gap: 0, ls: '-0.03em', expW: '200px', cmpW: '28px' },
  lg: { fontSize: 'clamp(30px, 4vw, 40px)',      fw: 800, boltW: 62, boltH: 62, gap: 0, ls: '-0.04em', expW: '300px', cmpW: '50px' },
}

const TRANSITION = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'

export default function SkillMatchLogo({ expanded, size = 'md' }: SkillMatchLogoProps) {
  const s = sizeConfig[size]
  const gradId = `sm-bolt-grad-${size}`

  const textBase: React.CSSProperties = {
    display: 'block',
    fontFamily: "'Syne', system-ui, sans-serif",
    fontSize: s.fontSize,
    fontWeight: s.fw,
    letterSpacing: s.ls,
    lineHeight: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: expanded ? s.expW : s.cmpW,
    opacity: expanded ? 1 : 0.9,
    transition: TRANSITION,
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>

      {/* ── Left: "Skill" / "S" ──────────────────────────────────────────── */}
      <span style={{ ...textBase, color: 'var(--text-hi)' }}>
        {expanded ? 'Skill' : 'S'}
      </span>

      {/* ── Bolt SVG — fixed anchor, never animates ───────────────────────── */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={s.boltW}
        height={s.boltH}
        viewBox="0 0 24 24"
        aria-hidden
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--cyan)" />
            <stop offset="100%" stopColor="var(--violet)" />
          </linearGradient>
        </defs>
        <path
          d="M13 10V3L4 14h7v7l9-11h-7z"
          fill={`url(#${gradId})`}
        />
      </svg>

      {/* ── Right: "Match" / "M" — gradient fill ─────────────────────────── */}
      <span
        style={{
          ...textBase,
          background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {expanded ? 'Match' : 'M'}
      </span>

    </div>
  )
}
