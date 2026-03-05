import { useState } from "react"
import ResumeUpload from "./components/ResumeUpload"
import SkillTags from "./components/SkillTags"
import SkillPicker from "./components/SkillPicker"
import JobPostings from "./components/JobPostings"

interface MatchResult {
  posting: string
  fit_score: number
  matched: string[]
  missing: string[]
  error?: string
}

function App() {
  const [skills, setSkills] = useState<string[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<MatchResult[]>([])

  function removeSkill(skill: string) {
    setSkills(skills.filter(s => s !== skill))
  }

  function addSkill(skill: string) {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill])
    }
  }

  async function handleAnalyze(postings: string[]) {
    setAnalyzing(true)
    setResults([])

    try {
      const matchResults: MatchResult[] = []

      for (const posting of postings) {
        // Extract skills from JD
        const jdRes = await fetch("http://localhost:8080/analyze-posting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: posting }),
        })

        if (!jdRes.ok) {
          if (jdRes.status === 429) {
            throw new Error("Rate limit reached. Try again tomorrow.")
          }
          throw new Error("Failed to analyze posting")
        }

        const jdData = await jdRes.json()

        if (jdData.skills.length === 0) {
          matchResults.push({
            posting: posting.slice(0, 80) + "...",
            fit_score: 0,
            matched: [],
            missing: [],
            error: "No technical skills found in this posting."
          })
          continue
        }

        // Match against resume skills
        const matchRes = await fetch("http://localhost:8080/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resume_skills: skills,
            jd_skills: jdData.skills,
          }),
        })
        const matchData = await matchRes.json()

        matchResults.push({
          posting: posting.slice(0, 80) + "...",
          fit_score: matchData.fit_score,
          matched: matchData.matched,
          missing: matchData.missing,
        })
      }

      // Sort by fit score descending
      matchResults.sort((a, b) => b.fit_score - a.fit_score)
      setResults(matchResults)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">SkillMatch</h1>
      <ResumeUpload onSkillsExtracted={setSkills} />
      <SkillTags skills={skills} onRemove={removeSkill} />
      <SkillPicker onAdd={addSkill} existingSkills={skills} />
      <JobPostings onAnalyze={handleAnalyze} loading={analyzing} />

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
          {results.map((result, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">{result.posting}</p>
                <span className="text-2xl font-bold text-blue-600">
                  {Math.round(result.fit_score * 100)}%
                </span>
              </div>
              {result.error ? (
                <p className="text-sm text-gray-500 mt-2">{result.error}</p>
              ) : (
                <>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-green-700 mb-1">Matched</p>
                    <div className="flex flex-wrap gap-1">
                      {result.matched.map(skill => (
                        <span key={skill} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-red-700 mb-1">Missing</p>
                    <div className="flex flex-wrap gap-1">
                      {result.missing.map(skill => (
                        <span key={skill} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
