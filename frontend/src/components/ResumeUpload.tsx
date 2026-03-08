import { useState } from "react"

interface ResumeUploadProps {
  onSkillsExtracted: (skills: string[]) => void
}

export default function ResumeUpload({ onSkillsExtracted }: ResumeUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filename, setFilename] = useState("")

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFilename(file.name)
    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("http://localhost:8080/upload-resume", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || "Upload failed")
      }

      const data = await res.json()
      onSkillsExtracted(data.skills)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
        <span className="text-slate-400 text-sm">
          {filename ? `📄 ${filename}` : "Drop resume here or click to upload"}
        </span>
        <span className="text-slate-300 text-xs mt-1">PDF or DOCX</span>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      {loading && (
        <p className="text-indigo-500 text-sm animate-pulse">Extracting skills...</p>
      )}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}
