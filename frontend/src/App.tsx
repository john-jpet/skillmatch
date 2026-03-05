import { useState } from "react"
import ResumeUpload from "./components/ResumeUpload"
import SkillTags from "./components/SkillTags"
import SkillPicker from "./components/SkillPicker"

function App() {
  const [skills, setSkills] = useState<string[]>([])

  function removeSkill(skill: string) {
    setSkills(skills.filter(s => s !== skill))
  }

  function addSkill(skill: string) {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">SkillMatch</h1>
      <ResumeUpload onSkillsExtracted={setSkills} />
      <SkillTags skills={skills} onRemove={removeSkill} />
      <SkillPicker onAdd={addSkill} existingSkills={skills} />
    </div>
  )
}

export default App