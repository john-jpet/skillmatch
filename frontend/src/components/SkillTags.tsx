interface SkillTagsProps {
  skills: string[]
  onRemove: (skill: string) => void
}

export default function SkillTags({ skills, onRemove }: SkillTagsProps) {
  if (skills.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map(skill => (
        <span
          key={skill}
          className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs px-3 py-1.5 rounded-full"
        >
          {skill}
          <button
            onClick={() => onRemove(skill)}
            className="text-indigo-300 hover:text-indigo-700 font-bold ml-0.5 leading-none"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  )
}
