import { useState, useEffect } from "react"
import Fuse from "fuse.js"

interface SkillPickerProps {
  onAdd: (skill: string) => void
  existingSkills: string[]
}

export default function SkillPicker({ onAdd, existingSkills }: SkillPickerProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<string[]>([])
  const [fuse, setFuse] = useState<Fuse<string> | null>(null)

  useEffect(() => {
    fetch("/skills.txt")
      .then(res => res.text())
      .then(text => {
        const skills = text.split("\n").map(s => s.trim()).filter(Boolean)
        setFuse(new Fuse(skills, { threshold: 0.3 }))
      })
  }, [])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    if (!fuse || q.length < 2) {
      setResults([])
      return
    }
    const matches = fuse.search(q).slice(0, 8).map(r => r.item)
    setResults(matches)
  }

  function handleAdd(skill: string) {
    if (!existingSkills.includes(skill)) {
      onAdd(skill)
    }
    setQuery("")
    setResults([])
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search skills..."
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder-slate-300"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 w-full border border-slate-200 rounded-lg mt-1 bg-white shadow-lg overflow-hidden">
          {results.map(skill => (
            <li
              key={skill}
              onClick={() => handleAdd(skill)}
              className="px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer text-sm text-slate-700 transition-colors"
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
