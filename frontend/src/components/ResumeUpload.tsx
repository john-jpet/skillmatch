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
    <div>
      <h2>Upload Resume</h2>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
      />
      {filename && <p>File: {filename}</p>}
      {loading && <p>Extracting skills...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}