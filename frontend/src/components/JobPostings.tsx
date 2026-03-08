import { useState } from "react"

interface JobPostingsProps {
  onAnalyze: (postings: string[]) => void
  loading: boolean
}

export default function JobPostings({ onAnalyze, loading }: JobPostingsProps) {
  const [postings, setPostings] = useState<string[]>([""])

  function updatePosting(index: number, value: string) {
    const updated = [...postings]
    updated[index] = value
    setPostings(updated)
  }

  function addPosting() {
    if (postings.length < 5) {
      setPostings([...postings, ""])
    }
  }

  function removePosting(index: number) {
    setPostings(postings.filter((_, i) => i !== index))
  }

  function handleAnalyze() {
    const filled = postings.filter(p => p.trim().length > 0)
    if (filled.length > 0) onAnalyze(filled)
  }

  return (
    <div className="flex flex-col gap-4">
      {postings.map((posting, index) => (
        <div key={index}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-400">Posting {index + 1}</span>
            {postings.length > 1 && (
              <button
                onClick={() => removePosting(index)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          <textarea
            value={posting}
            onChange={e => updatePosting(index, e.target.value)}
            placeholder="Paste job posting here..."
            className="w-full h-36 border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder-slate-300"
          />
        </div>
      ))}

      <div className="flex items-center justify-between pt-1">
        {postings.length < 5 ? (
          <button
            onClick={addPosting}
            className="text-sm text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            + Add posting ({postings.length}/5)
          </button>
        ) : (
          <span className="text-xs text-slate-300">Max 5 postings</span>
        )}
        <button
          onClick={handleAnalyze}
          disabled={loading || postings.every(p => !p.trim())}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
    </div>
  )
}
