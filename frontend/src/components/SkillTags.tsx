interface SkillTagsProps {
  skills: string[]
  onRemove: (skill: string) => void
}

export default function SkillTags({ skills, onRemove }: SkillTagsProps) {
  if (skills.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {skills.map(skill => (
        <span
          key={skill}
          className="flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
        >
          {skill}
          <button
            onClick={() => onRemove(skill)}
            className="text-blue-500 hover:text-blue-900 font-bold"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  )
}