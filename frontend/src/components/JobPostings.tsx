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
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Postings</h2>
      {postings.map((posting, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Posting {index + 1}</span>
            {postings.length > 1 && (
              <button
                onClick={() => removePosting(index)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Remove
              </button>
            )}
          </div>
          <textarea
            value={posting}
            onChange={e => updatePosting(index, e.target.value)}
            placeholder="Paste job posting here..."
            className="w-full h-32 border border-gray-300 rounded px-3 py-2 text-sm resize-none"
          />
        </div>
      ))}
      <div className="flex gap-3 mt-2">
        {postings.length < 5 && (
          <button
            onClick={addPosting}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add another posting
          </button>
        )}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Postings"}
        </button>
      </div>
    </div>
  )
}