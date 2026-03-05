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
    <div className="mt-4">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search and add skills..."
        className="border border-gray-300 rounded px-3 py-2 w-64"
      />
      {results.length > 0 && (
        <ul className="border border-gray-200 rounded mt-1 w-64 bg-white shadow">
          {results.map(skill => (
            <li
              key={skill}
              onClick={() => handleAdd(skill)}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}