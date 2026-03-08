interface SkillTagsProps {
  skills: string[]
  onRemove: (skill: string) => void
}

export default function SkillTags({ skills, onRemove }: SkillTagsProps) {
  if (skills.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill, i) => (
        <span
          key={skill}
          className="skill-tag anim-chipPop"
          style={{ animationDelay: `${Math.min(i * 30, 250)}ms` }}
          onClick={() => onRemove(skill)}
        >
          {skill}
        </span>
      ))}
    </div>
  )
}
