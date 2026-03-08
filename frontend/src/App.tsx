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
  const [globalError, setGlobalError] = useState("")

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
    setGlobalError("")

    try {
      const matchResults: MatchResult[] = []

      for (const posting of postings) {
        const jdRes = await fetch("http://localhost:8080/analyze-posting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: posting }),
        })

        if (!jdRes.ok) {
          if (jdRes.status === 429) throw new Error("Rate limit reached. Try again tomorrow.")
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

        const matchRes = await fetch("http://localhost:8080/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resume_skills: skills, jd_skills: jdData.skills }),
        })
        const matchData = await matchRes.json()

        matchResults.push({
          posting: posting.slice(0, 80) + "...",
          fit_score: matchData.fit_score,
          matched: matchData.matched,
          missing: matchData.missing,
        })
      }

      matchResults.sort((a, b) => b.fit_score - a.fit_score)
      setResults(matchResults)
    } catch (err: any) {
      setGlobalError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  function getFitColor(score: number) {
    if (score >= 0.75) return "text-emerald-500"
    if (score >= 0.5) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 px-8 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">SkillMatch</span>
        </div>
        <span className="text-slate-500 text-xs font-mono tracking-widest uppercase">Beta</span>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Left — Resume & Skills */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Step 1 — Your Skills</p>
              <ResumeUpload onSkillsExtracted={setSkills} />
            </div>

            {skills.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400 mb-2">{skills.length} skills extracted — click × to remove</p>
                <SkillTags skills={skills} onRemove={removeSkill} />
              </div>
            )}

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-400 mb-2">Add a missing skill manually</p>
              <SkillPicker onAdd={addSkill} existingSkills={skills} />
            </div>
          </div>

          {/* Right — Job Postings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Step 2 — Job Postings</p>
            <JobPostings onAnalyze={handleAnalyze} loading={analyzing} />
          </div>
        </div>

        {/* Global error */}
        {globalError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 mb-6 text-sm">
            {globalError}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Results — ranked by fit</p>
            <div className="grid grid-cols-1 gap-4">
              {results.map((result, index) => (
                <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <p className="text-sm text-slate-500 leading-snug">{result.posting}</p>
                    <span className={`text-3xl font-bold shrink-0 ${getFitColor(result.fit_score)}`}>
                      {Math.round(result.fit_score * 100)}%
                    </span>
                  </div>

                  {result.error ? (
                    <p className="text-sm text-slate-400 italic">{result.error}</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1.5">Matched</p>
                        <div className="flex flex-wrap gap-1.5">
                          {result.matched.map(skill => (
                            <span key={skill} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1.5">Missing</p>
                        <div className="flex flex-wrap gap-1.5">
                          {result.missing.map(skill => (
                            <span key={skill} className="bg-red-50 text-red-600 border border-red-200 text-xs px-2.5 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
