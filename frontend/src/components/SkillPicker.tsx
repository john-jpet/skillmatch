import { useState, useEffect, useRef } from "react"
import Fuse from "fuse.js"

interface SkillPickerProps {
  onAdd: (skill: string) => void
  existingSkills: string[]
}

export default function SkillPicker({ onAdd, existingSkills }: SkillPickerProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<string[]>([])
  const [fuse, setFuse] = useState<Fuse<string> | null>(null)
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/skills.txt")
      .then(res => res.text())
      .then(text => {
        const skills = text.split("\n").map(s => s.trim()).filter(Boolean)
        setFuse(new Fuse(skills, { threshold: 0.3 }))
      })
  }, [])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setResults([])
        setFocused(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    if (!fuse || q.length < 2) { setResults([]); return }
    setResults(fuse.search(q).slice(0, 8).map(r => r.item))
  }

  function handleAdd(skill: string) {
    if (!existingSkills.includes(skill)) onAdd(skill)
    setQuery("")
    setResults([])
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Search input */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13" height="13" fill="none" viewBox="0 0 24 24"
          stroke={focused ? "var(--cyan)" : "var(--text-lo)"}
          strokeWidth={2.5}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search and add skills…"
          className="dark-input"
          style={{ paddingLeft: "34px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px" }}
        />
      </div>

      {/* Dropdown */}
      {results.length > 0 && (
        <ul
          className="absolute left-0 right-0 top-full mt-1.5 rounded-lg overflow-hidden z-20 anim-fadeIn"
          style={{
            background: "var(--lifted)",
            border: "1px solid var(--border-hi)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {results.map((skill, i) => {
            const added = existingSkills.includes(skill)
            return (
              <li
                key={skill}
                onMouseDown={() => handleAdd(skill)}
                className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-colors duration-100"
                style={{
                  borderTop: i > 0 ? "1px solid var(--border)" : "none",
                  color: added ? "var(--text-lo)" : "var(--text-hi)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                }}
                onMouseEnter={e => {
                  if (!added) {
                    ;(e.currentTarget as HTMLElement).style.background = "var(--cyan-soft)"
                    ;(e.currentTarget as HTMLElement).style.color = "var(--cyan)"
                  }
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.background = ""
                  ;(e.currentTarget as HTMLElement).style.color = added ? "var(--text-lo)" : "var(--text-hi)"
                }}
              >
                {skill}
                {added && (
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-lo)" }}>
                    added
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
