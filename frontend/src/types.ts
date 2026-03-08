export interface MatchResult {
  posting: string
  fit_score: number
  matched: string[]
  missing: string[]
  error?: string
}
